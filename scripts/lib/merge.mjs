import {isDeepStrictEqual as equal} from 'node:util';
import {markerStart,markerEnd} from './source.mjs';
export function textMerge(current, previous, next, toml=false) {
  const start=toml?'# agentkit:begin':markerStart,end=toml?'# agentkit:end':markerEnd;
  const a=current.indexOf(start),b=current.indexOf(end);
  if(previous) {
    if(!current.includes(previous)) throw new Error('Managed block was edited');
    return current.replace(previous,next||'');
  }
  if(a>=0 || b>=0) throw new Error('Untracked managed block');
  return current+(current && !current.endsWith('\n')?'\n':'')+(next||'');
}
function object(v) {return v!==null && typeof v==='object' && !Array.isArray(v);}
export function removeFragment(current, fragment, trail='') {
  if(Array.isArray(fragment)) {
    if(!Array.isArray(current)) throw new Error(`Edited config: ${trail}`);
    const result=structuredClone(current);
    for(const item of fragment) {
      const at=result.findIndex(x=>equal(x,item));
      if(at<0) throw new Error(`Edited managed array: ${trail}`);
      result.splice(at,1);
    }
    return result;
  }
  if(object(fragment)) {
    if(!object(current)) throw new Error(`Edited config: ${trail}`);
    const result=structuredClone(current);
    for(const [key,value] of Object.entries(fragment)) {
      const rest=removeFragment(result[key],value,`${trail}/${key}`);
      if(rest===undefined || (object(rest)&&!Object.keys(rest).length) || (Array.isArray(rest)&&!rest.length)) delete result[key];
      else result[key]=rest;
    }
    return result;
  }
  if(!equal(current,fragment)) throw new Error(`Edited managed value: ${trail}`);
}
export function addFragment(current, fragment, trail='') {
  if(Array.isArray(fragment)) {
    if(current!==undefined&&!Array.isArray(current)) throw new Error(`Config collision: ${trail}`);
    const result=structuredClone(current||[]);
    for(const item of fragment) if(!result.some(x=>equal(x,item))) result.push(item);
    return result;
  }
  if(object(fragment)) {
    if(current!==undefined&&!object(current)) throw new Error(`Config collision: ${trail}`);
    const result=structuredClone(current||{});
    for(const [key,value] of Object.entries(fragment)) result[key]=addFragment(result[key],value,`${trail}/${key}`);
    return result;
  }
  if(current!==undefined && !equal(current,fragment)) throw new Error(`Config collision: ${trail}`);
  return fragment;
}
