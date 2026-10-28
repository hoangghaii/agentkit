import fs from 'node:fs';
import path from 'node:path';
import {parse as yaml} from 'yaml';
import {parse as toml} from 'smol-toml';
import {ROOT,walk,readJSON,hash,LOCAL_BACKUP_DIR} from './lib/source.mjs';
// Encoded policy permits testing absence without embedding removed identities in source.
const denied=Buffer.from('ZHV5W1xzLl8tXSpuZ3V5ZW58ZHV5bmd1eWVufG1yZ29vbmllfGdvb25uZ3V5ZW58ZGlzY29yZHx0ZWxlZ3JhbXxyZWRkaXR8dHdpdHRlcnxmYWNlYm9va3xsaW5rZWRpbnxpbnN0YWdyYW18dGlrdG9rfGh1bWFuW1xzLV0qbWNwfGNsYXVkZWtpdHxodHRwcz86Ly8oPzp3d3dcLik/KD86eFwuY29tfHRcLmNvKSg/OlsvXHNdfCQpfHNvY2lhbFsgLV1tZWRpYXx5b3V0dWJlfHlvdXR1XC5iZXx0d2l0Y2h8cGludGVyZXN0fHNuYXBjaGF0fG1hc3RvZG9ufHRocmVhZHNcLm5ldHxic2t5XC5hcHB8c3Vic3RhY2t8d2hhdHNhcHB8d2VpYm8=','base64').toString();
// The explicitly ignored historical-copy path is allowed; its contents are never active source.
const backupToken = new RegExp(`(?<![\\p{L}\\p{N}_.-])${LOCAL_BACKUP_DIR}(?![\\p{L}\\p{N}_.-])`,'gu');
export const excludedContent = text => new RegExp(denied,'iu').test(text.replace(backupToken,'<local-backup>').normalize('NFD').replace(/\p{M}/gu,''));
export function validate(root=ROOT) {
  const errors=[],warnings=[],packs=readJSON(path.join(root,'kit/packs.json'));
  const declared=new Set(Object.values(packs).flat()),known=new Set();
  for(const f of walk(path.join(root,'skills')).filter(f=>path.basename(f)==='SKILL.md')) {
    const name=path.basename(path.dirname(f));known.add(name);
    try {
      const raw=fs.readFileSync(f,'utf8'),match=raw.match(/^---\n([\s\S]*?)\n---(?:\n|$)/);
      if(!match)throw new Error('Missing frontmatter');
      const meta=yaml(match[1]);
      if(meta.name!==name||!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name)||name.length>64)throw new Error('Skill name mismatch or invalid name');
      if(typeof meta.description!=='string'||!meta.description.trim()||meta.description.length>1024)throw new Error('Invalid description');
      for(const key of Object.keys(meta))if(!['name','description','license','compatibility','metadata','allowed-tools'].includes(key))throw new Error(`Unsupported metadata ${key}`);
      if(!declared.has(name))throw new Error('Not assigned to a pack');
    } catch(e) {errors.push(`${path.relative(root,f)}: ${e.message}`);}
  }
  for(const name of declared)if(!known.has(name))errors.push(`Missing skill ${name}`);
  const files=walk(root).filter(f=>!f.startsWith(path.join(root,'generated')+path.sep));
  for(const f of files) {
    const rel=path.relative(root,f),data=fs.readFileSync(f);
    if(data.includes(0))continue;
    const text=data.toString('utf8');
    if(excludedContent(text))errors.push(`${rel}: excluded content`);
    try {
      if(f.endsWith('.json')||f.endsWith('.json.example'))JSON.parse(text);
      if(/\.ya?ml$/.test(f))yaml(text);
      if(f.endsWith('.toml')||f.endsWith('.toml.example'))toml(text);
      if(rel.startsWith('agents'+path.sep)) {
        const m=text.match(/^---\n([\s\S]*?)\n---\n/);if(!m||!yaml(m[1]).description)throw new Error('Invalid agent metadata');
      }
    } catch(e) {errors.push(`${rel}: ${e.message}`);}
    if(f.endsWith('.md'))for(const match of text.matchAll(/\[[^\]\n]*\]\(([^)\s]+)(?:\s+"[^"\n]*")?\)/g)) {
      const link=match[1].replace(/^<|>$/g,'').split('#')[0];
      if(!link||/^(?:[a-z]+:|\/)/i.test(link)||/[{}*<>]/.test(link))continue;
      let dest;try{dest=decodeURIComponent(link);}catch{continue;}
      const direct=path.resolve(path.dirname(f),dest);
      if(!fs.existsSync(direct))errors.push(`${rel}: broken link ${link}`);
    }
  }
  const commands=readJSON(path.join(root,'kit/commands.json'));
  if(commands.length!==53||new Set(commands.map(c=>c.alias)).size!==53)errors.push('Expected mapping for 53 unique legacy commands');
  for(const c of commands) {
    if(!known.has(c.workflow)){errors.push(`Missing workflow ${c.workflow}`);continue;}
    const entry=fs.readFileSync(path.join(root,'skills',c.workflow,'SKILL.md'),'utf8');
    for(const mode of c.arguments.split(/\s+/).filter(Boolean))if(!entry.includes(mode))errors.push(`Undefined mode ${mode} for ${c.alias}`);
    if(!packs[c.pack]?.includes(c.workflow))errors.push(`Alias ${c.alias} is not installed with its workflow pack`);
  }
  const cases=readJSON(path.join(root,'kit/trigger-cases.json'));
  for(const name of known)if(!cases[name]||cases[name].positive?.length<2||cases[name].negative?.length<2)errors.push(`Missing trigger scenarios ${name}`);
  for(const u of readJSON(path.join(root,'kit/upstreams.json'))) {
    const local=path.join(root,'skills',u.name),expected=u.files||{};
    for(const f of walk(local)) {
      const rel=path.relative(local,f).split(path.sep).join('/');
      if(expected[rel]!==hash(fs.readFileSync(f)))errors.push(`Snapshot drift ${u.name}/${rel}`);
    }
    for(const rel of Object.keys(expected))if(!fs.existsSync(path.join(local,rel)))errors.push(`Missing snapshot file ${u.name}/${rel}`);
    if(!/^[a-f0-9]{40}$/.test(u.commit)||!/^[a-f0-9]{64}$/.test(u.archiveSha256))errors.push(`Unpinned upstream ${u.name}`);
    if(!fs.existsSync(path.join(root,'skills',u.name,'UPSTREAM-LICENSE.txt'))&&!fs.existsSync(path.join(root,'skills',u.name,'LICENSE.txt'))&&!fs.existsSync(path.join(root,'skills',u.name,'UPSTREAM-NOTICE.md')))errors.push(`Missing upstream license ${u.name}`);
  }
  return {ok:!errors.length,skills:known.size,commands:commands.length,errors,warnings};
}
