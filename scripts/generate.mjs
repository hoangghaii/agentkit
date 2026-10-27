import fs from 'node:fs';
import path from 'node:path';
import {ROOT,walk,write} from './lib/source.mjs';
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
if(failures.length){console.error('Generated output differs:',failures.join(', '));process.exitCode=1;}
else console.log(check?'Generated output is synchronized.':'Generated core output.');
