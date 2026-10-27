import test from 'node:test';
import assert from 'node:assert/strict';
import {zip} from '../scripts/lib/zip.mjs';
import {inflateRawSync} from 'node:zlib';
test('ZIP roundtrips UTF8 paths and binary content with valid headers',()=>{
  const files=new Map([['agentkit-engineer/đường dẫn/file.txt',Buffer.from('verified\n')],['agentkit-engineer/binary.bin',Buffer.from([0,1,255])]]);
  const data=zip(files),found=new Map();let cursor=0;
  while(data.readUInt32LE(cursor)===0x04034b50) {
    const length=data.readUInt32LE(cursor+18),nameLength=data.readUInt16LE(cursor+26),extra=data.readUInt16LE(cursor+28);
    const name=data.subarray(cursor+30,cursor+30+nameLength).toString(),start=cursor+30+nameLength+extra;
    found.set(name,inflateRawSync(data.subarray(start,start+length)));cursor=start+length;
  }
  assert.deepEqual(found,files);assert.equal(data.readUInt32LE(data.length-22),0x06054b50);assert.equal(data.readUInt16LE(data.length-12),files.size);
});
