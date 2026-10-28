import fs from 'node:fs';
import path from 'node:path';
import {ROOT,walk,write,readJSON} from './lib/source.mjs';
import {render} from './lib/render.mjs';
const check=process.argv.includes('--check'),base=path.join(ROOT,'generated/core');
const {files}=render();
const expected=new Set();let failures=[];
for(const [rel,entry] of files) {
  const p=path.join(base,rel);expected.add(p);
  if(check) {if(!fs.existsSync(p)||!fs.readFileSync(p).equals(entry.data))failures.push(rel);}
  else write(p,entry.data);
}
for(const f of walk(base))if(!expected.has(f)) {if(check)failures.push(path.relative(base,f));else fs.unlinkSync(f);}
const commands=readJSON(path.join(ROOT,'kit/commands.json'));
const commandDoc='# Command mapping\n\nGenerated from [kit/commands.json](../kit/commands.json). Mode arguments preserve each alias’s intent.\n\n| Claude alias | Shared skill | Arguments | Pack |\n| --- | --- | --- | --- |\n'+commands.map(c=>`| /${c.alias.replaceAll('/',':')} | $${c.workflow} | ${c.arguments||'default'} | ${c.pack} |\n`).join('');
const guide=path.join(ROOT,'guide/COMMANDS.md');
if(check){if(!fs.existsSync(guide)||fs.readFileSync(guide,'utf8')!==commandDoc)failures.push('guide/COMMANDS.md');}
else write(guide,commandDoc);
if(failures.length){console.error('Generated output differs:',failures.join(', '));process.exitCode=1;}
else console.log(check?'Generated output is synchronized.':'Generated core output.');
