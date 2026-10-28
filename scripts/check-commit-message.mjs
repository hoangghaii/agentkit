import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {ROOT,readJSON} from './lib/source.mjs';
// Lightweight enforcement of this repository's conventional header rules, without a global CLI.
export function checkCommitMessage(message) {
  const config=readJSON(path.join(ROOT,'.commitlintrc.json'));
  const header=message.split(/\r?\n/).find(line=>line.trim()&&!line.startsWith('#'))||'';
  if(/^(Merge |Revert ")/.test(header))return [];
  const errors=[],match=header.match(/^([a-z]+)(?:\([^()\r\n]+\))?(!)?: (\S.*)$/);
  if(!match)return ['Use type(scope): subject or type: subject.'];
  if(!config.rules['type-enum'][2].includes(match[1]))errors.push('Unsupported conventional commit type.');
  if(header.length>config.rules['header-max-length'][2])errors.push('Commit header exceeds the configured length.');
  if(match[3].endsWith('.'))errors.push('Commit subject must not end with a full stop.');
  if(/^\p{Lu}/u.test(match[3]))errors.push('Start the commit subject with lowercase text.');
  return errors;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  try {
    const file=process.argv[2];if(!file)throw new Error('Pass the Git commit message file.');
    const errors=checkCommitMessage(fs.readFileSync(file,'utf8'));
    if(errors.length){console.error(errors.join('\n'));process.exitCode=1;}
  }catch(error){console.error(error.message);process.exitCode=1;}
}
