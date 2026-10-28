import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
export const LOCAL_BACKUP_DIR = 'claudekit-engineer-backup';
export const readJSON = p => JSON.parse(fs.readFileSync(p, 'utf8'));
export const hash = data => crypto.createHash('sha256').update(data).digest('hex');
export function walk(dir) {
  if (path.resolve(dir).split(path.sep).includes(LOCAL_BACKUP_DIR)) return [];
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, {withFileTypes: true}).sort((a,b)=>(a.name<b.name?-1:a.name>b.name?1:0)).flatMap(e => {
    const p = path.join(dir, e.name);
    if (e.name === LOCAL_BACKUP_DIR) return [];
    if (e.isSymbolicLink()) throw new Error(`Symlink in source: ${p}`);
    if (['node_modules','__pycache__','.pytest_cache','.mypy_cache','.cache','coverage','htmlcov','.git','dist'].includes(e.name)) return [];
    return e.isDirectory() ? walk(p) : [p];
  });
}
export function write(p, data) {
  fs.mkdirSync(path.dirname(p), {recursive: true});
  fs.writeFileSync(p, data);
}
export function writeAtomic(p, data) {
  fs.mkdirSync(path.dirname(p), {recursive:true});
  const tmp=p+'.agentkit-'+crypto.randomBytes(8).toString('hex');
  try {
    fs.writeFileSync(tmp,data,{flag:'wx',...(fs.existsSync(p)?{mode:fs.statSync(p).mode}:{})});
    fs.renameSync(tmp,p);
  } finally {fs.rmSync(tmp,{force:true});}
}
export function select(packs, agents) {
  const catalog = readJSON(path.join(ROOT,'kit/packs.json'));
  if(!agents.length)throw new Error('Select at least one target agent with --agents codex,claude');
  for (const p of packs) if (!catalog[p]) throw new Error(`Unknown pack: ${p}`);
  for (const a of agents) if (!['codex','claude'].includes(a)) throw new Error(`Unknown agent: ${a}`);
  return {packs: [...new Set(['core', ...packs])], agents: [...new Set(agents)], catalog};
}
export const markerStart = '<!-- agentkit:begin -->';
export const markerEnd = '<!-- agentkit:end -->';
export function block(content) { return `${markerStart}\n${content.trim()}\n${markerEnd}\n`; }
