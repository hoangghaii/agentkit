import fs from 'node:fs';
import path from 'node:path';
import {isDeepStrictEqual as equal} from 'node:util';
import {parse as parseTOML} from 'smol-toml';
import {hash,readJSON,writeAtomic as write} from './source.mjs';
import {textMerge,removeFragment,addFragment} from './merge.mjs';
import {render} from './render.mjs';
const manifestPath='.agentkit/manifest.json';
function safe(target, rel) {
  if(path.isAbsolute(rel) || /^[a-z]:/i.test(rel) || rel.split(/[\\/]/).includes('..')) throw new Error(`Unsafe managed path: ${rel}`);
  const full=path.resolve(target,rel),inside=path.relative(target,full);
  if(inside.startsWith('..'+path.sep)||inside==='..'||path.isAbsolute(inside))throw new Error(`Path escapes target: ${rel}`);
  let check=full;
  while(check.startsWith(target+path.sep) || check===target) {
    try {
      if(fs.lstatSync(check).isSymbolicLink())throw new Error(`Symlink in target: ${check}`);
    } catch(error) {if(error.code!=='ENOENT')throw error;}
    if(check===target)break;
    check=path.dirname(check);
  }
  return full;
}
function contribution(before, after) {
  if(Array.isArray(after)) return after.filter(x=>!(before||[]).some(v=>equal(v,x)));
  if(after&&typeof after==='object') {
    const out={};
    for(const [k,v] of Object.entries(after)) {
      if(equal(before?.[k],v)) continue;
      out[k]=contribution(before?.[k],v);
    }
    return out;
  }
  return after;
}
function restoreEmptyContainers(current, original, observed) {
  if(!original || typeof original!=='object' || Array.isArray(original))return current;
  const result=structuredClone(current);
  for(const [key,value] of Object.entries(original)) {
    if(!value || typeof value!=='object' || !Object.hasOwn(observed||{},key))continue;
    if(result[key]===undefined) {
      if(!Object.keys(value).length)result[key]=structuredClone(value);
      else if(!Array.isArray(value)) {
        const restored=restoreEmptyContainers({},value,observed[key]);
        if(Object.keys(restored).length)result[key]=restored;
      }
    } else if(!Array.isArray(value)&&typeof result[key]==='object'&&!Array.isArray(result[key]))result[key]=restoreEmptyContainers(result[key],value,observed[key]);
  }
  return result;
}
function prepare(current, old, next) {
  const type=next?.type||old.type;
  if(type==='file') {
    if(current && (!old || hash(current)!==old.hash)) throw new Error('Existing file differs; preserved');
    if(!current && old) throw new Error('Managed file was removed; preserved');
    return {data:next?.data??null,entry:next?{type,hash:hash(next.data)}:null};
  }
  const raw=current?.toString('utf8')||'';
  const original=old?old.original:(current?raw:null);
  let result,fragment;
  if(type==='json') {
    const parsed=current!==null?JSON.parse(raw):{};
    let base=old?removeFragment(parsed,old.fragment):parsed;
    if(old&&original!==null)base=restoreEmptyContainers(base,JSON.parse(original),parsed);
    result=next?addFragment(base,JSON.parse(next.data)):base;
    fragment=contribution(base,result);
    if(!next && original!==null && equal(result,JSON.parse(original))) return {data:Buffer.from(original),entry:null};
    if(!next && original===null && !Object.keys(result).length) return {data:null,entry:null};
    result=equal(parsed,result)?raw:JSON.stringify(result,null,2)+'\n';
  } else {
    if(type==='toml-block'&&raw) parseTOML(raw);
    fragment=next?.data.toString()||'';
    result=textMerge(raw,old?.fragment,fragment,type==='toml-block');
    if(!next && original!==null && result===original+'\n')result=original;
    if(type==='toml-block' && result) parseTOML(result);
    if(!next && original===null && !result.trim()) return {data:null,entry:null};
  }
  return {data:Buffer.from(result),entry:next?{type,fragment,original,hash:hash(result)}:null};
}
function preview(action) {
  const old=action.current?.toString('utf8')||'',next=action.data?.toString('utf8')||'';
  const summary={file:action.rel,operation:action.data===null?'remove':action.current?'modify':'add'};
  if(!old.includes('\0')&&!next.includes('\0')&&Math.max(old.length,next.length)<20000) {
    const a=old.split('\n'),b=next.split('\n');let start=0,end=0;
    while(start<a.length&&start<b.length&&a[start]===b[start])start++;
    while(end<a.length-start&&end<b.length-start&&a[a.length-1-end]===b[b.length-1-end])end++;
    summary.diff=[`--- a/${action.rel}`,`+++ b/${action.rel}`,`@@ -${start+1},${a.length-start-end} +${start+1},${b.length-start-end} @@`,...a.slice(start,a.length-end).map(l=>'-'+l),...b.slice(start,b.length-end).map(l=>'+'+l)].slice(0,100).join('\n');
  }
  return summary;
}
export function install(target, packs, agents, {dryRun=false, uninstall=false}={}) {
  target=path.resolve(target);
  const mp=safe(target,manifestPath);
  const previous=fs.existsSync(mp)?readJSON(mp):{files:{}};
  if(previous.schemaVersion && previous.schemaVersion!==1) throw new Error('Unsupported manifest version');
  const plan=uninstall?{files:new Map(),packs:[],agents:[]}:render(packs,agents,target);
  const actions=[],conflicts=[],entries={};
  for(const rel of new Set([...Object.keys(previous.files),...plan.files.keys()])) {
    const full=safe(target,rel),old=previous.files[rel],next=plan.files.get(rel);
    const current=fs.existsSync(full)?fs.readFileSync(full):null;
    try {
      const {data,entry}=prepare(current,old,next);
      if(entry) entries[rel]=entry;
      if((data===null&&current)||(data!==null&&(!current||!current.equals(data)))) actions.push({rel,data,current});
    } catch(error) {conflicts.push({file:rel,reason:error.message});if(old)entries[rel]=old;}
  }
  // Preflight all paths and conflicts before a single write.
  if(conflicts.length&&!uninstall) return {ok:false,dryRun,conflicts,actions:actions.map(a=>a.rel),...(dryRun?{changes:actions.map(preview)}:{})};
  if(!dryRun) {
    const committed=[];
    try {
      for(const a of actions) {
        const full=safe(target,a.rel);
        if(a.data===null)fs.unlinkSync(full);else write(full,a.data);
        committed.push(a);
      }
      if(uninstall&&!Object.keys(entries).length) {if(fs.existsSync(mp))fs.unlinkSync(mp);}
      else {
        const selection=uninstall?previous:plan;
        write(mp,JSON.stringify({schemaVersion:1,version:readJSON(new URL('../../package.json',import.meta.url)).version,packs:selection.packs,agents:selection.agents,files:entries},null,2)+'\n');
      }
    } catch(error) {
      for(const a of committed.reverse()) {
        const full=safe(target,a.rel);
        if(a.current===null)fs.rmSync(full,{force:true});else write(full,a.current);
      }
      throw error;
    }
  }
  return {ok:!conflicts.length,dryRun,conflicts,actions:actions.map(a=>a.rel),...(dryRun?{changes:actions.map(preview)}:{})};
}
export function status(target) {
  const mp=safe(path.resolve(target),manifestPath);
  if(!fs.existsSync(mp)) return {installed:false};
  const manifest=readJSON(mp),changed=[];
  for(const [rel,entry] of Object.entries(manifest.files)) {
    const p=safe(path.resolve(target),rel);
    if(!fs.existsSync(p)||hash(fs.readFileSync(p))!==entry.hash)changed.push(rel);
  }
  return {installed:true,version:manifest.version,packs:manifest.packs,agents:manifest.agents,changed};
}
