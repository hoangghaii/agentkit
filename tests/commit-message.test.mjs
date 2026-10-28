import test from 'node:test';
import assert from 'node:assert/strict';
import {checkCommitMessage} from '../scripts/check-commit-message.mjs';
test('source hook accepts conventional task commits and Git merge headers',()=>{
  for(const value of ['fix(workflows): restore phase delivery','feat!: remove obsolete adapter','Merge branch \'master\''])assert.deepEqual(checkCommitMessage(value),[]);
});
test('source hook rejects missing type, invalid subjects and oversized headers',()=>{
  for(const value of ['update everything','unknown: subject','fix: ','fix: Uppercase subject','fix: trailing stop.','fix: '+ 'x'.repeat(110)])assert.ok(checkCommitMessage(value).length,value);
});
