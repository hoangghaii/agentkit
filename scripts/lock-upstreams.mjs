import fs from 'node:fs';
import path from 'node:path';
import {ROOT,readJSON,walk,hash,writeAtomic} from './lib/source.mjs';
const file=path.join(ROOT,'kit/upstreams.json'),upstreams=readJSON(file),refresh=process.argv.includes('--refresh');
const errors=[];
for(const pin of upstreams) {
  const dir=path.join(ROOT,'skills',pin.name),files={};
  for(const f of walk(dir)) files[path.relative(dir,f).split(path.sep).join('/')]=hash(fs.readFileSync(f));
  if(refresh)pin.files=files;
  else for(const name of new Set([...Object.keys(files),...Object.keys(pin.files||{})]))if(files[name]!==pin.files?.[name])errors.push(`${pin.name}/${name}`);
}
if(refresh) {writeAtomic(file,JSON.stringify(upstreams,null,2)+'\n');console.log('Recorded reviewed local snapshot hashes; upstream commits unchanged.');}
else if(errors.length) {console.error('Snapshot drift:',errors.join(', '));process.exitCode=1;}
else console.log('Pinned skill snapshots match their local hashes.');
