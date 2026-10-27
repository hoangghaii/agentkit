#!/usr/bin/env node
import path from 'node:path';
import fs from 'node:fs';
import {ROOT,readJSON} from '../scripts/lib/source.mjs';
import {install,status} from '../scripts/lib/install.mjs';
import {validate} from '../scripts/validate.mjs';
import {build} from '../scripts/build.mjs';
import {doctor} from '../scripts/doctor.mjs';
import {checkUpstreams} from '../scripts/upstreams.mjs';
const [command,...args]=process.argv.slice(2);
const supported=new Set(['target','agents','packs','dry-run','check','json','offline']);
function options() {
  const out={};
  for(let i=0;i<args.length;i++) {
    const flag=args[i];
    if(!flag.startsWith('--')||!supported.has(flag.slice(2)))throw new Error(`Unknown argument: ${flag}`);
    const key=flag.slice(2);
    if(['dry-run','check','json','offline'].includes(key))out[key]=true;
    else {if(!args[i+1]||args[i+1].startsWith('--'))throw new Error(`Missing value for ${flag}`);out[key]=args[++i];}
  }
  return out;
}
try {
  const opts=options(),target=path.resolve(opts.target||process.cwd());
  const list=(value,fallback)=>value?value.split(',').map(x=>x.trim()).filter(Boolean):fallback;
  let result;
  switch(command) {
    case 'install': result=install(target,list(opts.packs,['core']),list(opts.agents,['codex','claude']),{dryRun:opts['dry-run']});break;
    case 'uninstall': result=install(target,[],[],{dryRun:opts['dry-run'],uninstall:true});break;
    case 'validate': result=validate();break;
    case 'doctor': result=doctor(target);break;
    case 'build': result=build({dryRun:opts['dry-run']});break;
    case 'update': {
      const mp=path.join(target,'.agentkit/manifest.json');
      if(!fs.existsSync(mp))throw new Error('Project is not installed; use install first');
      const previous=readJSON(mp);
      result=install(target,list(opts.packs,previous.packs),list(opts.agents,previous.agents),{dryRun:opts.check||opts['dry-run']});
      result.installed=status(target);
      result.upstream=opts.check?await checkUpstreams({offline:opts.offline}):'Pinned snapshots; use update --check to compare upstream commits.';
      break;
    }
    default:
      if(command && !['help','--help'].includes(command))throw new Error(`Unknown command: ${command}`);
      result={usage:'agentkit-engineer install --target <project> --agents codex,claude --packs core,web [--dry-run]',commands:['install','validate','doctor','build','update --check','uninstall'],source:ROOT};
  }
  console.log(JSON.stringify(result,null,2));
  if(result.ok===false)process.exitCode=1;
} catch(error) {console.error(error.message);process.exitCode=1;}
