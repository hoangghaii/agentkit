import {ROOT,readJSON} from './lib/source.mjs';
import path from 'node:path';
export async function checkUpstreams({offline=false}={}) {
  const pins=readJSON(path.join(ROOT,'kit/upstreams.json'));
  if(offline)return pins.map(p=>({name:p.name,pinned:p.commit,status:'offline'}));
  const repos=[...new Set(pins.map(p=>p.repository))],heads=new Map();
  await Promise.allSettled(repos.map(async repo=>{
    try {
      const response=await fetch(`https://api.github.com/repos/${repo.replace('https://github.com/','')}/commits/HEAD`,{headers:{Accept:'application/vnd.github+json','User-Agent':'AgentKit-Engineer'},signal:AbortSignal.timeout(5000)});
      if(!response.ok)throw new Error(`HTTP ${response.status}`);
      heads.set(repo,(await response.json()).sha);
    }catch(error){heads.set(repo,{error:error.message});}
  }));
  return pins.map(p=>{
    const head=heads.get(p.repository);
    if(typeof head!=='string')return {name:p.name,pinned:p.commit,status:'unavailable',reason:head?.error};
    return {name:p.name,pinned:p.commit,head,status:head===p.commit?'current':'review-required',diff:`${p.repository}/compare/${p.commit}...${head}`};
  });
}
