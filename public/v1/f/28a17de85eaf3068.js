/* Vale 0.7: presentation metadata only; authored arrays/save paths stay stable. */
(() => {
 const E=StoryEngine;
 const walk=(v,fn)=>{if(!v||typeof v!=='object')return;fn(v);for(const x of Object.values(v))if(x&&typeof x==='object')walk(x,fn);};
 // Presentation anchors are stable authoring paths, never wording-dependent.
 // Missing later chapters are expected during lazy loading; apply runs again on chapter.
 const at=(S,path)=>path.reduce((v,k)=>v?.[k],S);
 const step=(S,path,fn)=>{const v=at(S,path);if(v)fn(v);};
 const narr=(S,path,fn)=>step(S,path,v=>{if(v.n)fn(v);});
 const action=(S,path,context,zoom=1.25)=>step(S,path,v=>{v.actionFrame={focus:v.look,context,zoom};});
 const wide=(S,path)=>step(S,path,v=>{v.actionFrame=null;});
 const face=(id,who,from,to,extra={})=>({id,ms:1250,actors:[{id:who,...extra,frames:[{offset:0,face:from},{offset:.62,face:to}]}]});
 function apply(S){if(!S||S.id!=='vale-dossiers-part2-v01')return;
  S.scenes.p2_corridor_night||={...S.scenes.p2_corridor,time:{en:'Monday · night',vi:'Thứ Hai · ban đêm'}};
  S.scenes.p2_corridor_dawn||={...S.scenes.p2_corridor,time:{en:'Tuesday · dawn',vi:'Thứ Ba · bình minh'}};
  S.scenes.p2_room_shut||={...S.scenes.p2_room,size:[1024,1536]};
  narr(S,["nodes","p2c5_observe",1],v=>{delete v.shot;v.scene='p2_corridor_night';});
  narr(S,["nodes","p2c5_close",3],v=>{delete v.shot;v.scene='p2_house_evening';});
  walk(S.nodes,v=>{if(v.reconstruct?.id==='p2_watch_positions'){v.reconstruct.numbered=false;for(const c of v.reconstruct.cards)if(['reed','lydia','vale'].includes(c.id))c.image=c.id;}});
  const bed=S.nodes?.p2c4_open?.find(s=>s.explore)?.explore?.spots?.find(s=>s.id==='bed');
  if(bed){bed.r=[46,73,9,8];bed.x=50.5;bed.y=77;}
  if(S.items?.p2_night_observation)S.items.p2_night_observation.artAlias='p2_night_vent';
  // This record is a solicitor's paper copy; Rusk's ledger stays unread.
  if(S.items?.p2_income)S.items.p2_income.artAlias='p2_letter';
  narr(S,["nodes","p2c1_open",4],v=>{v.motion={id:'p2-v06-reed-candle-letters',ms:700,actors:[{id:'reed',show:true,at:'c',frames:[{offset:0,face:'candle-letters'}]}]};});
  // The original show and dialogue steps must not put the mail away early.
  // This is ordinary correspondence, separate from Lydia's later case note.
  const opening=S.nodes?.p2c1_open,putDown=opening?.[13]?.n?13:-1;
  if(putDown>=0){
   for(const v of opening.slice(0,putDown))if(v.show==='reed'||v.say==='reed')v.face='candle-letters';
   const mail={id:'reed-mail',art:'p2_correspondence_down',at:[49,75],w:13,ar:1.5,z:3};
   Object.assign(opening[putDown],{shot:'study',look:[42.5,72.55,13,4.9],motion:{id:'p2-v06-correspondence-set-down',ms:1100,tracks:[{...mail,frames:[{offset:0,at:[49,74.3],opacity:0},{offset:.25,opacity:1},{offset:.8,at:[49,75]},{offset:1}]}],actors:[{id:'reed',frames:[{offset:0,face:'concerned'}]}]}});
   // Return to the native conversation with one saved stack on the same desk.
   if(opening[putDown+1])Object.assign(opening[putDown+1],{shot:null,look:null,motion:{id:'p2-v06-correspondence-resting',ms:0,tracks:[{...mail,frames:[{offset:0},{offset:1}]}]}});
  }
  narr(S,["nodes","p2c1_open",17],v=>{v.shot='p2_lydia_note_desk';v.look=[43,61,15,6];v.motion=face('p2-v06-voluntary-note','lydia','','calm',{show:true,at:'r'});});
  const noteAt=opening?.[17]?.n?17:-1;
  if(noteAt>=0&&opening[noteAt+1])Object.assign(opening[noteAt+1],{shot:null,look:null,motion:{id:'p2-v06-note-on-desk',ms:0,tracks:[{id:'reed-mail',art:'p2_correspondence_down',at:[49,75],w:13,ar:1.5,z:3,frames:[{offset:0},{offset:1}]},{id:'lydia-note',art:'p2_note_flat',at:[65,78],w:15,ar:1.5,z:3,frames:[{offset:0},{offset:1}]}]}});
  narr(S,["nodes","p2c1_open",32],v=>{v.shot='p2_lydia_note_return';v.look=[31,44,43,10];v.motion={id:'p2-v06-original-returned',ms:0,tracks:[{id:'lydia-note',art:'p2_note_flat',at:[65,78],w:15,ar:1.5,opacity:0,frames:[{offset:0,opacity:0},{offset:1,opacity:0}],remove:true}]};});
  narr(S,["places","p2c2_house","views","room","zones",0,"then",1],v=>{v.motion={id:'p2-v06-shutter-test',ms:2500,backdrop:{frames:[{offset:0,art:'p2_room'},{offset:.27,art:'p2_room_shut'},{offset:.76,art:'p2_room'}]}};});
  narr(S,["nodes","p2c4_open",12,"explore","spots",0,"then",0],v=>{v.shot='p2_cord_touch';v.look=[52,40,16,9];v.motion={id:'p2-v06-cord-test',ms:1800,backdrop:{frames:[{offset:0,art:'p2_cord_touch'},{offset:.5,art:'p2_cord_raised'}]}};});
  narr(S,["nodes","p2c4_open",12,"explore","spots",0,"then",2],v=>{v.shot=null;v.look=[70,29,15,13];});
  narr(S,["nodes","p2c3_open",18],v=>{v.motion={id:'p2-v06-steadied-envelope',ms:1450,actors:[{id:'rusk',show:true,at:'l',frames:[{offset:0,face:''}]},{id:'lydia',show:true,at:'r',frames:[{offset:0,face:''},{offset:.72,face:'resolute'}]}]};});
  narr(S,["nodes","p2c3_open",10],v=>{v.shot='p2_carrier_heel_before';v.look=[43,35,28,10];v.motion={id:'p2-v06-carrier-heel',ms:2100,backdrop:{frames:[{offset:0,art:'p2_carrier_heel_before'},{offset:.5,art:'p2_carrier_heel_after'}]}};});
  const study=S.nodes?.p2c3_open,arrival=study?.[10]?.n?10:-1;
  if(arrival>=0&&study[arrival+1]){study[arrival+1].shot=null;study[arrival+1].look=null;}
  narr(S,["nodes","p2c4_open",37],v=>{v.motion={id:'p2-v06-plan-understood',ms:1450,actors:[{id:'reed',show:true,at:'l',frames:[{offset:0,face:'concerned'}]},{id:'lydia',show:true,at:'r',frames:[{offset:0,face:''},{offset:.72,face:'resolute'}]}]};});
  narr(S,["nodes","p2c5_watch",5],v=>{v.motion=face('p2-v06-safe-arrangement','lydia','resolute','calm',{show:true,at:'r'});});
  narr(S,["nodes","p2c5_observe",0],v=>{delete v.shot;v.look=[62,4,25,25];v.motion={id:'p2-v06-observed-emergence',ms:2100,backdrop:{frames:[{offset:0,art:'p2_room_night'},{offset:.42,art:'p2_action_vent'}]}};});
  narr(S,["nodes","p2c5_observe",6],v=>{v.shot='p2_carrier_empty_night';v.look=[76,28,14,12.5];v.motion={id:'p2-v06-rusk-at-door',ms:700,actors:[{id:'rusk',show:true,at:'r',frames:[{offset:0,face:''}]}]};});
  step(S,["nodes","p2c5_observe",7],v=>{if(v.say==='rusk'){v.shot=null;v.look=null;}});
  narr(S,["nodes","p2c6_open",14],v=>{v.motion=face('p2-v06-unfinished-answer','lydia','','resolute',{show:true,at:'r'});});
  narr(S,["nodes","p2c6_intervention",3],v=>{delete v.shot;v.scene='p2_corridor_dawn';});
  // The contact remains the focus, but the source-inspected context keeps the
  // whole hand/prop and its surroundings visible. Never zoom to a tiny contact.
  action(S,["nodes","p2c1_open",13],[0,65,100,33],1.3);
  wide(S,["nodes","p2c1_open",14]);
  action(S,["nodes","p2c1_open",17],[20,6,78,70]);
  wide(S,["nodes","p2c1_open",18]);
  action(S,["nodes","p2c1_open",32],[20,0,78,70]);
  wide(S,["nodes","p2c1_open",34]);
  action(S,["nodes","p2c3_open",10],[16,13,84,43]);
  wide(S,["nodes","p2c3_open",11]);
  action(S,["nodes","p2c4_open",12,"explore","spots",0,"then",0],[36,0,47,60]);
  action(S,["nodes","p2c4_open",12,"explore","spots",0,"then",2],[39,1,55,61]);
  wide(S,["nodes","p2c4_open",12,"explore","spots",0,"then",3]);
  action(S,["nodes","p2c5_observe",0],[35,0,57,66],1.35);
  wide(S,["nodes","p2c5_observe",1]);
  action(S,["nodes","p2c5_observe",6],[45,15,55,34]);
  wide(S,["nodes","p2c5_observe",7]);

 }
 E.on('boot',apply);E.on('chapter',()=>apply(E.S()));
})();
