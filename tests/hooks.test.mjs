import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {spawnSync} from 'node:child_process';
import {ROOT,write} from '../scripts/lib/source.mjs';
import {install} from '../scripts/lib/install.mjs';
const adapter=path.join(ROOT,'hooks/adapter.cjs');
function run(mode,payload,host='codex') {return spawnSync(process.execPath,[adapter,host,mode],{input:typeof payload==='string'?payload:JSON.stringify(payload),encoding:'utf8'});}
test('search advises explicit dependency search and permits build/debug commands',()=>{
  for(const host of ['codex','claude']) {
    assert.match(run('search',{tool_input:{command:'rg token node_modules/pkg'}},host).stdout,/additionalContext/);
    for(const command of ['npm run build','node dist/debug.js','npm test','rg notification src','git diff','rg x src']) {
      const result=run('search',{tool_input:{command}},host);assert.equal(result.status,0);assert.equal(result.stdout,'');
    }
    assert.equal(run('search','{invalid',host).status,0);assert.equal(run('search',{},host).stdout,'');
  }
});
test('modularization resolves relative paths and Codex patch payloads',t=>{
  const p=fs.mkdtempSync(path.join(os.tmpdir(),'agentkit-hook '));t.after(()=>fs.rmSync(p,{recursive:true,force:true}));
  write(path.join(p,'large.js'),'const x=1;\n'.repeat(205));
  for(const input of [{file_path:'large.js'},{command:'*** Begin Patch\n*** Update File: large.js\n@@\n*** End Patch'}]) {
    const result=run('modularization',{cwd:p,tool_input:input});assert.equal(result.status,0);assert.match(result.stdout,/205|206/);
  }
  assert.equal(run('modularization',{cwd:p,tool_input:{file_path:'missing'}}).stdout,'');
});
test('installed hook launcher works from a nested directory with spaces',t=>{
  const p=fs.mkdtempSync(path.join(os.tmpdir(),'agentkit hook project '));t.after(()=>fs.rmSync(p,{recursive:true,force:true}));
  install(p,['core'],['codex','claude']);const cwd=path.join(p,'src','nested');fs.mkdirSync(cwd,{recursive:true});
  for(const rel of ['.codex/hooks.json','.claude/settings.json']) {
    const config=JSON.parse(fs.readFileSync(path.join(p,rel),'utf8'));
    const result=spawnSync(config.hooks.PreToolUse[0].hooks[0].command,{cwd,input:JSON.stringify({tool_input:{command:'find node_modules -name test'}}),shell:true,encoding:'utf8'});
    assert.equal(result.status,0,result.stderr);assert.match(result.stdout,/additionalContext/);
  }
});
