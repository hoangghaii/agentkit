import {deflateRawSync} from 'node:zlib';
// Minimal deterministic ZIP writer; no external archiver or shell interpolation.
function crc32(data) {
  let crc=0xffffffff;
  for(const byte of data) {crc^=byte;for(let n=0;n<8;n++)crc=(crc>>>1)^((crc&1)?0xedb88320:0);}
  return (crc^0xffffffff)>>>0;
}
export function zip(files) {
  const local=[],central=[];let offset=0;
  for(const [name,raw] of [...files].sort(([a],[b])=>(a<b?-1:a>b?1:0))) {
    const data=Buffer.isBuffer(raw)?raw:Buffer.from(raw),encoded=Buffer.from(name),compressed=deflateRawSync(data);
    const crc=crc32(data),header=Buffer.alloc(30);
    header.writeUInt32LE(0x04034b50);header.writeUInt16LE(20,4);header.writeUInt16LE(0x800,6);header.writeUInt16LE(8,8);
    header.writeUInt16LE(33,12);header.writeUInt32LE(crc,14);header.writeUInt32LE(compressed.length,18);header.writeUInt32LE(data.length,22);header.writeUInt16LE(encoded.length,26);
    const dir=Buffer.alloc(46);
    dir.writeUInt32LE(0x02014b50);dir.writeUInt16LE(20,4);dir.writeUInt16LE(20,6);dir.writeUInt16LE(0x800,8);dir.writeUInt16LE(8,10);dir.writeUInt16LE(33,14);
    dir.writeUInt32LE(crc,16);dir.writeUInt32LE(compressed.length,20);dir.writeUInt32LE(data.length,24);dir.writeUInt16LE(encoded.length,28);dir.writeUInt32LE(offset,42);
    local.push(header,encoded,compressed);central.push(dir,encoded);offset+=header.length+encoded.length+compressed.length;
  }
  const directory=Buffer.concat(central),end=Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50);end.writeUInt16LE(files.size,8);end.writeUInt16LE(files.size,10);end.writeUInt32LE(directory.length,12);end.writeUInt32LE(offset,16);
  return Buffer.concat([...local,directory,end]);
}
