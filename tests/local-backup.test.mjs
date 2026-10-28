import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {ROOT,LOCAL_BACKUP_DIR,walk,write} from '../scripts/lib/source.mjs';
import {excludedContent} from '../scripts/validate.mjs';
import {render} from '../scripts/lib/render.mjs';
import {spawnSync} from 'node:child_process';

test('ignored historical copies never enter active source traversal or rendered installs',t=>{
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'agentkit-backup-isolation-'));
  t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
  write(path.join(root,'active.txt'),'active');
  const backup=path.join(root,LOCAL_BACKUP_DIR);
  write(path.join(backup,'SKILL.md'),'historical fixture');
  assert.deepEqual(walk(root),[path.join(root,'active.txt')]);
  assert.deepEqual(walk(backup),[]);
  assert.equal(excludedContent(LOCAL_BACKUP_DIR),false);
  assert.equal(excludedContent('/'+LOCAL_BACKUP_DIR+'/README.md'),false);
  assert.equal(excludedContent(LOCAL_BACKUP_DIR+'-unexpected'),true);
  assert.equal(excludedContent('unexpected-'+LOCAL_BACKUP_DIR),true);
  assert.equal(excludedContent('prefix'+LOCAL_BACKUP_DIR),true);
  assert.equal(excludedContent(LOCAL_BACKUP_DIR+'.md'),true);
  assert.equal(excludedContent('đ'+LOCAL_BACKUP_DIR),true);
  assert.equal(excludedContent(Buffer.from('Y2xhdWRla2l0','base64').toString()),true);
  for(const rel of render().files.keys())assert.ok(!rel.split('/').includes(LOCAL_BACKUP_DIR));
});

test('optional installed statusline works from nested directories without an external usage tool',t=>{
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'agentkit-statusline-'));
  t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
  const {files}=render(['core'],['claude'],root);
  for(const [rel,entry] of files)if(rel.startsWith('.agentkit/templates/'))write(path.join(root,rel),entry.data);
  const nested=path.join(root,'src','nested');fs.mkdirSync(nested,{recursive:true});
  const config=JSON.parse(files.get('.agentkit/templates/claude-statusline.json.example').data.toString());
  const result=spawnSync(config.statusLine.command,{shell:true,cwd:nested,encoding:'utf8',
    env:{...process.env,NO_COLOR:'1',AGENTKIT_CCUSAGE:'0'},
    input:JSON.stringify({workspace:{current_dir:root},model:{display_name:'Fixture Model'}}),timeout:5000});
  assert.equal(result.status,0,result.stderr);
  assert.ok(result.stdout.includes('Fixture Model'));
  assert.ok(result.stdout.includes(path.basename(root)));
  assert.ok(fs.readFileSync(path.join(ROOT,'.gitignore'),'utf8').includes('/'+LOCAL_BACKUP_DIR+'/'));
});
