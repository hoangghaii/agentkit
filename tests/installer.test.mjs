import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {parse as toml} from 'smol-toml';
import {install,status} from '../scripts/lib/install.mjs';
import {readJSON,write} from '../scripts/lib/source.mjs';
const temp=t=>{const p=fs.mkdtempSync(path.join(os.tmpdir(),'agentkit project '));t.after(()=>fs.rmSync(p,{recursive:true,force:true}));return p;};
test('new project, spaces, no Git, both host discovery trees and idempotency',t=>{
  const p=temp(t);assert.equal(install(p,['core'],['codex','claude']).ok,true);
  assert.ok(fs.existsSync(path.join(p,'.agents/skills/kit-plan/SKILL.md')));
  assert.ok(fs.existsSync(path.join(p,'.claude/skills/kit-plan/SKILL.md')));
  assert.equal(toml(fs.readFileSync(path.join(p,'.codex/agents/planner.toml'),'utf8')).model,undefined);
  assert.deepEqual(install(p,['core'],['codex','claude']).actions,[]);
  assert.equal(status(p).changed.length,0);
});
test('preflight collision is atomic and dry-run does not write',t=>{
  const p=temp(t);write(path.join(p,'.agents/skills/kit-plan/SKILL.md'),'custom');
  const result=install(p,['core'],['codex','claude']);assert.equal(result.ok,false);
  assert.equal(fs.existsSync(path.join(p,'CLAUDE.md')),false);
  const clean=path.join(p,'dry run');assert.equal(install(clean,['core'],['codex'],{dryRun:true}).ok,true);
  assert.equal(fs.existsSync(clean),false);
});
test('merge user instructions, JSON hooks and TOML config; uninstall restores them',t=>{
  const p=temp(t),instructions='# My project\n',config='model = "custom"\n\n[mcp_servers.my_server]\nurl = "https://example.org/mcp"\n';
  const settings={permissions:{deny:['Read(.env)']},hooks:{PreToolUse:[{matcher:'Bash',hooks:[{type:'command',command:'echo custom'}]}]}};
  write(path.join(p,'AGENTS.md'),instructions);write(path.join(p,'.codex/config.toml'),config);
  write(path.join(p,'.claude/settings.json'),JSON.stringify(settings));write(path.join(p,'.mcp.json'),JSON.stringify({mcpServers:{mine:{url:'https://example.org/mcp'}}}));
  assert.equal(install(p,['core'],['codex','claude']).ok,true);
  assert.equal(readJSON(path.join(p,'.claude/settings.json')).hooks.PreToolUse.length,2);
  const userFile=path.join(p,'user.txt');write(userFile,'keep');
  assert.equal(install(p,[],[],{uninstall:true}).ok,true);
  assert.equal(fs.readFileSync(path.join(p,'AGENTS.md'),'utf8'),instructions);
  assert.equal(fs.readFileSync(path.join(p,'.codex/config.toml'),'utf8'),config);
  assert.deepEqual(readJSON(path.join(p,'.claude/settings.json')),settings);
  assert.equal(fs.readFileSync(userFile,'utf8'),'keep');
});
test('pack and host changes remove only unchanged managed files',t=>{
  const p=temp(t);install(p,['core','web','backend-data'],['codex','claude']);
  const result=install(p,['core'],['codex']);assert.equal(result.ok,true);
  assert.equal(fs.existsSync(path.join(p,'.agents/skills/webapp-testing/SKILL.md')),false);
  assert.equal(fs.existsSync(path.join(p,'.claude/skills/kit-plan/SKILL.md')),false);
  assert.equal(fs.existsSync(path.join(p,'.agents/skills/kit-plan/SKILL.md')),true);
});
test('edited file and edited managed config survive update and uninstall',t=>{
  const p=temp(t);install(p,['core'],['codex','claude']);
  const f=path.join(p,'.agents/skills/kit-plan/SKILL.md');fs.appendFileSync(f,'\nUser edit\n');
  const settings=readJSON(path.join(p,'.claude/settings.json'));settings.hooks.PreToolUse[0].hooks[0].command='echo user';write(path.join(p,'.claude/settings.json'),JSON.stringify(settings));
  const before=fs.readFileSync(f);assert.equal(install(p,['core'],['codex','claude']).ok,false);
  const result=install(p,[],[],{uninstall:true});assert.equal(result.ok,false);assert.equal(result.conflicts.length,2);
  assert.deepEqual(fs.readFileSync(f),before);assert.equal(readJSON(path.join(p,'.claude/settings.json')).hooks.PreToolUse[0].hooks[0].command,'echo user');
  assert.ok(fs.existsSync(path.join(p,'.agentkit/manifest.json')));
});
test('unknown packs and target symlinks are rejected without writing',t=>{
  const p=temp(t);assert.throws(()=>install(p,['unknown'],['codex']),/Unknown pack/);
  if(process.platform==='win32')return;
  const outside=temp(t);fs.symlinkSync(outside,path.join(p,'.agents'),'dir');
  assert.throws(()=>install(p,['core'],['codex']),/Symlink/);
  assert.deepEqual(fs.readdirSync(outside),[]);
});
test('user-added config remains after install and uninstall',t=>{
  const p=temp(t);install(p,['core'],['claude']);
  const settings=readJSON(path.join(p,'.claude/settings.json'));settings.theme='dark';settings.hooks.PreToolUse.push({matcher:'Read',hooks:[{type:'command',command:'echo user'}]});write(path.join(p,'.claude/settings.json'),JSON.stringify(settings));
  assert.equal(install(p,['core'],['claude']).ok,true);
  assert.equal(install(p,[],[],{uninstall:true}).ok,true);
  assert.deepEqual(readJSON(path.join(p,'.claude/settings.json')),{theme:'dark',hooks:{PreToolUse:[{matcher:'Read',hooks:[{type:'command',command:'echo user'}]}]}});
});
test('dangling symlinks cannot redirect installed files outside the target',t=>{
  if(process.platform==='win32')return;
  const p=temp(t),outside=path.join(temp(t),'missing.md'),destination=path.join(p,'.agents/skills/kit-plan/SKILL.md');
  fs.mkdirSync(path.dirname(destination),{recursive:true});fs.symlinkSync(outside,destination);
  assert.throws(()=>install(p,['core'],['codex']),/Symlink/);
  assert.equal(fs.existsSync(outside),false);
});
test('empty user config containers and instructions without newline survive uninstall',t=>{
  const p=temp(t),config={hooks:{PreToolUse:[]}};
  write(path.join(p,'.claude/settings.json'),JSON.stringify(config));write(path.join(p,'AGENTS.md'),'user instructions');
  assert.equal(install(p,['core'],['codex','claude']).ok,true);
  assert.equal(install(p,[],[],{uninstall:true}).ok,true);
  assert.deepEqual(readJSON(path.join(p,'.claude/settings.json')),config);
  assert.equal(fs.readFileSync(path.join(p,'AGENTS.md'),'utf8'),'user instructions');
});
test('a manifest write failure rolls back installed content and preserves ownership',t=>{
  const p=temp(t);install(p,['core'],['codex']);
  const mp=path.join(p,'.agentkit/manifest.json'),before=fs.readFileSync(mp),rename=fs.renameSync;
  fs.renameSync=(from,to)=>{if(to===mp)throw new Error('simulated manifest failure');return rename(from,to);};
  try {assert.throws(()=>install(p,['core','web'],['codex']),/simulated manifest failure/);}
  finally {fs.renameSync=rename;}
  assert.deepEqual(fs.readFileSync(mp),before);
  assert.equal(fs.existsSync(path.join(p,'.agents/skills/webapp-testing/SKILL.md')),false);
  assert.equal(status(p).changed.length,0);
});
test('reinstall respects deletion of unowned empty config containers',t=>{
  const p=temp(t);write(path.join(p,'.claude/settings.json'),JSON.stringify({custom:{}}));install(p,['core'],['claude']);
  const config=readJSON(path.join(p,'.claude/settings.json'));delete config.custom;write(path.join(p,'.claude/settings.json'),JSON.stringify(config));
  assert.equal(install(p,['core'],['claude']).ok,true);
  assert.equal(Object.hasOwn(readJSON(path.join(p,'.claude/settings.json')),'custom'),false);
});
test('empty JSON config is rejected before any installation writes',t=>{
  const p=temp(t),config=path.join(p,'.claude/settings.json');
  write(config,'');
  const result=install(p,['core'],['codex','claude']);
  assert.equal(result.ok,false);
  assert.ok(result.conflicts.some(c=>c.file==='.claude/settings.json'));
  assert.equal(fs.readFileSync(config,'utf8'),'');
  assert.equal(fs.existsSync(path.join(p,'AGENTS.md')),false);
  assert.equal(fs.existsSync(path.join(p,'.agentkit/manifest.json')),false);
});
test('partial uninstall keeps selected hosts and packs for recovery',t=>{
  const p=temp(t);install(p,['core','web'],['codex','claude']);
  const file=path.join(p,'.agents/skills/kit-plan/SKILL.md'),original=fs.readFileSync(file);
  fs.appendFileSync(file,'\nUser change\n');
  assert.equal(install(p,[],[],{uninstall:true}).ok,false);
  const manifest=readJSON(path.join(p,'.agentkit/manifest.json'));
  assert.deepEqual(manifest.packs,['core','web']);assert.deepEqual(manifest.agents,['codex','claude']);
  assert.equal(fs.existsSync(path.join(p,'.claude/skills/webapp-testing/SKILL.md')),false);
  write(file,original);
  assert.equal(install(p,manifest.packs,manifest.agents).ok,true);
  assert.ok(fs.existsSync(path.join(p,'.claude/skills/webapp-testing/SKILL.md')));
  assert.equal(status(p).changed.length,0);
});
test('empty host selection cannot silently discard an installation',t=>{
  const p=temp(t);install(p,['core'],['codex']);
  const before=fs.readFileSync(path.join(p,'.agentkit/manifest.json'));
  assert.throws(()=>install(p,['core'],[]),/at least one target agent/);
  assert.deepEqual(fs.readFileSync(path.join(p,'.agentkit/manifest.json')),before);
});
