/* Vale 0.6: presentation metadata only; authored arrays/save paths stay stable. */
(() => {
 const E=StoryEngine;
 const walk=(v,fn)=>{if(!v||typeof v!=='object')return;fn(v);for(const x of Object.values(v))if(x&&typeof x==='object')walk(x,fn);};
 const narr=(S,prefix,fn)=>{for(const c of [S.nodes,S.places,S.talks])walk(c,v=>{if(v.n?.en?.startsWith(prefix))fn(v);});};
 const face=(id,who,from,to,extra={})=>({id,ms:1250,actors:[{id:who,...extra,frames:[{offset:0,face:from},{offset:.62,face:to}]}]});
 function apply(S){if(!S||S.id!=='vale-dossiers-part2-v01')return;
  S.scenes.p2_corridor_night||={...S.scenes.p2_corridor,time:{en:'Monday · night',vi:'Thứ Hai · ban đêm'}};
  S.scenes.p2_corridor_dawn||={...S.scenes.p2_corridor,time:{en:'Tuesday · dawn',vi:'Thứ Ba · bình minh'}};
  S.scenes.p2_room_shut||={...S.scenes.p2_room,size:[1024,1536]};
  narr(S,'You step back into the corridor',v=>{delete v.shot;v.scene='p2_corridor_night';});
  narr(S,'The last task is a small one:',v=>{delete v.shot;v.scene='p2_house_evening';});
  walk(S.nodes,v=>{if(v.reconstruct?.id==='p2_watch_positions'){v.reconstruct.numbered=false;for(const c of v.reconstruct.cards)if(['reed','lydia','vale'].includes(c.id))c.image=c.id;}});
  const bed=S.nodes?.p2c4_open?.find(s=>s.explore)?.explore?.spots?.find(s=>s.id==='bed');
  if(bed){bed.r=[46,73,9,8];bed.x=50.5;bed.y=77;}
  if(S.items?.p2_night_observation)S.items.p2_night_observation.artAlias='p2_night_vent';
  // This record is a solicitor's paper copy; Rusk's ledger stays unread.
  if(S.items?.p2_income)S.items.p2_income.artAlias='p2_letter';
  narr(S,'The woman at the door does not smile.',v=>{v.motion=face('p2-v06-joke-ends','reed','','concerned');});
  narr(S,'Lydia opens her bag and takes out a folded note.',v=>{v.motion=face('p2-v06-voluntary-note','lydia','','calm',{show:true,at:'r'});});
  narr(S,'You close it once and open it again, gently.',v=>{v.motion={id:'p2-v06-shutter-test',ms:2500,backdrop:{frames:[{offset:0,art:'p2_room'},{offset:.27,art:'p2_room_shut'},{offset:.76,art:'p2_room'}]}};});
  narr(S,'For a moment, his hand leaves the ledger.',v=>{v.motion={id:'p2-v06-steadied-envelope',ms:1450,actors:[{id:'rusk',show:true,at:'l',frames:[{offset:0,face:''}]},{id:'lydia',show:true,at:'r',frames:[{offset:0,face:''},{offset:.72,face:'resolute'}]}]};});
  narr(S,'Lydia returns to the doorway.',v=>{v.motion={id:'p2-v06-plan-understood',ms:1450,actors:[{id:'reed',show:true,at:'l',frames:[{offset:0,face:'concerned'}]},{id:'lydia',show:true,at:'r',frames:[{offset:0,face:''},{offset:.72,face:'resolute'}]}]};});
  narr(S,'Lydia checks the plan herself.',v=>{v.motion=face('p2-v06-safe-arrangement','lydia','resolute','calm',{show:true,at:'r'});});
  narr(S,'The grille at the high opening is no longer flush',v=>{delete v.shot;v.look=[62,4,25,25];v.motion={id:'p2-v06-observed-emergence',ms:2100,backdrop:{frames:[{offset:0,art:'p2_room_night'},{offset:.42,art:'p2_action_vent'}]}};});
  narr(S,'Rusk appears at his study door.',v=>{v.motion={id:'p2-v06-rusk-at-door',ms:700,actors:[{id:'rusk',show:true,at:'r',frames:[{offset:0,face:''}]}]};});
  narr(S,'She folds the copy along its old crease.',v=>{v.motion=face('p2-v06-unfinished-answer','lydia','','resolute',{show:true,at:'r'});});
  narr(S,'She takes her papers from Ruth and walks past the study door.',v=>{delete v.shot;v.scene='p2_corridor_dawn';});
 }
 E.on('boot',apply);E.on('chapter',()=>apply(E.S()));
})();
