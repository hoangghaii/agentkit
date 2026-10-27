import {spawnSync} from 'node:child_process';
import path from 'node:path';
import {ROOT,walk} from './lib/source.mjs';
import {validate} from './validate.mjs';
const result=validate();let failed=!result.ok;
for(const issue of result.errors)console.error(issue);
for(const folder of ['bin','scripts','hooks','tests'])for(const f of walk(path.join(ROOT,folder)).filter(f=>/\.(?:mjs|cjs)$/.test(f))) {
  const check=spawnSync(process.execPath,['--check',f],{encoding:'utf8'});
  if(check.status!==0){failed=true;console.error(check.stderr);}
}
console.log(failed?'Validation failed.':`Validated ${result.skills} skills, metadata, configuration, links and executable syntax.`);
process.exitCode=failed?1:0;
