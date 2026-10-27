import fs from 'node:fs';
import path from 'node:path';
import {ROOT,walk,readJSON,write,hash} from './lib/source.mjs';
import {validate} from './validate.mjs';
import {zip} from './lib/zip.mjs';
export function build({dryRun=false}={}) {
  const result=validate();if(!result.ok)throw new Error(`Validation failed:\n${result.errors.join('\n')}`);
  const pkg=readJSON(path.join(ROOT,'package.json')),files=new Map();
  for(const entry of [...pkg.files,'package.json','package-lock.json']) {
    const p=path.join(ROOT,entry);
    if(!fs.existsSync(p))continue;
    for(const f of fs.statSync(p).isDirectory()?walk(p):[p]) {
      const rel=path.relative(ROOT,f).split(path.sep).join('/');
      if(/(^|\/)\.env(?:\..*)?$/.test(rel)&&path.basename(rel)!=='.env.example')continue;
      if(/(^|\/)(?:\.env|\.coverage|coverage.*|.*\.log|.*\.pyc|.*\.zip|.*\.tgz|.*\.tar\.gz)$/.test(rel))continue;
      if(/(?:\.(?:pem|key|p12|pfx)|(?:^|\/)(?:credentials|service-account)\.json)$/.test(rel))continue;
      files.set(`agentkit-engineer/${rel}`,fs.readFileSync(f));
    }
  }
  const archive=path.join(ROOT,'dist/agentkit-engineer.zip');
  if(!dryRun) {
    const data=zip(files);write(archive,data);write(archive+'.sha256',hash(data)+'  agentkit-engineer.zip\n');
  }
  return {ok:true,dryRun,version:pkg.version,files:files.size,archive};
}
