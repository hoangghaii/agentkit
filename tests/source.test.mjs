import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {parse as toml} from 'smol-toml';
import {parse as yaml} from 'yaml';
import {validate} from '../scripts/validate.mjs';
import {ROOT,readJSON} from '../scripts/lib/source.mjs';
import {render} from '../scripts/lib/render.mjs';
test('all canonical metadata, cleanup policy and local links validate',()=>{
  const result=validate();assert.equal(result.ok,true,JSON.stringify(result.errors));assert.equal(result.commands,53);assert.equal(result.skills,53);
});
test('every selected skill and all 16 roles render into both native formats',()=>{
  const {files}=render(Object.keys(readJSON(path.join(ROOT,'kit/packs.json'))));
  for(const [rel,entry] of files) {
    const text=entry.data.toString();
    if(rel.endsWith('.json'))JSON.parse(text);
    if(rel.endsWith('.toml'))toml(text);
    if(rel.endsWith('SKILL.md')) {
      const match=text.match(/^---\n([\s\S]*?)\n---\n/);assert.ok(match,rel);assert.ok(yaml(match[1]).description);
    }
  }
  for(const role of readJSON(path.join(ROOT,'kit/agents.json'))) {
    const codex=toml(files.get(`.codex/agents/${role.name}.toml`).data.toString());assert.equal(codex.model,undefined);
    const claude=files.get(`.claude/agents/${role.name}.md`).data.toString();assert.doesNotMatch(claude,/^model:/m);
    if(role.readOnly) {
      const expected=['researcher','scout-external'].includes(role.name)?'Read, Grep, Glob, WebSearch, WebFetch':'Read, Grep, Glob';
      assert.ok(claude.includes(`tools: ${expected}\n`));
    }
  }
});
test('technical notification guidance survives cleanup',()=>{
  for(const name of ['mobile-development','payment-integration','mcp-builder']) {
    const source=fs.readFileSync(path.join(ROOT,`skills/${name}/SKILL.md`),'utf8');
    // Each domain must remain installed and retain meaningful capability guidance.
    assert.ok(source.length>300,name);
  }
  const mobile=fs.readFileSync(path.join(ROOT,'skills/mobile-development/references/mobile-best-practices.md'),'utf8');
  assert.match(mobile,/notification/i);
  const payment=fs.readFileSync(path.join(ROOT,'skills/payment-integration/references/polar/benefits.md'),'utf8');
  assert.match(payment,/webhook|notification/i);
});
test('cleanup classifier rejects excluded identifiers and preserves technical language',async()=>{
  const {excludedContent}=await import('../scripts/validate.mjs');
  for(const encoded of ['RHV5IE5ndXnhu4Vu','RElTQ09SRA==','aHR0cHM6Ly94LmNvbS9leGFtcGxl'])assert.equal(excludedContent(Buffer.from(encoded,'base64').toString()),true);
  for(const value of ['x','notification','payment webhook notification','MCP notifications/tools/list_changed','mobile push notification'])assert.equal(excludedContent(value),false);
});
