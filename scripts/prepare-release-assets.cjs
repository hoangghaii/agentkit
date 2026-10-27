#!/usr/bin/env node
const {spawnSync}=require('node:child_process');
const path=require('node:path');
const result=spawnSync(process.execPath,[path.join(__dirname,'../bin/agentkit.mjs'),'build'],{stdio:'inherit'});
process.exitCode=result.status??1;
