import {spawnSync} from 'node:child_process';
import {status} from './lib/install.mjs';
export function doctor(target) {
  const dependencies={};
  for(const [name,args] of Object.entries({node:['--version'],python3:['--version'],libreoffice:['--version'],pdftoppm:['-v'],pandoc:['--version'],ffmpeg:['-version'],gemini:['--version']})) {
    const check=spawnSync(name,args,{encoding:'utf8',timeout:3000,windowsHide:true});
    dependencies[name]={available:!check.error&&check.status===0,required:name==='node'};
  }
  return {ok:Number(process.versions.node.split('.')[0])>=20,node:process.version,project:status(target),dependencies,
    notes:['Core needs Node.js 20+ only; optional dependencies are checked when their skills run.','Host discovery and hook execution require a trusted project. Review hooks in the host UI.']};
}
