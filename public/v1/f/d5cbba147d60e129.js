/* Vale 0.7 presentation metadata; authored arrays/save paths stay stable. */
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
 // The sound check cuts from the outer door to Nora at the care-room window.
 // Both frames preserve their own broad context instead of sharing one crop.
 E.regions({
  p3_stable:{r:{p3_sound_context:[0,12,88,64]}},
  p3_stable_outer_closed:{r:{p3_sound_context:[0,12,88,64]}},
  p3_care_signal:{r:{p3_sound_context:[14,13,73,57]}}
 });
 const mossSleep={art:'p3_moss_sleep',at:[50.7,57.2],w:20,ar:2};
 const mossAlert={art:'p3_moss_alert',at:[51.5,55.1],w:25,ar:1.5};
 const mossTrack=(pose,frames)=>({id:'moss',...pose,z:3,frames:frames||[{offset:0},{offset:1}]});
 function apply(S){if(!S||S.id!=='vale-dossiers-part3-v01')return;
  const yard=S.scenes.p3_dorn_yard;
  S.scenes.p3_stable.name={en:'Wycliffe stable · stall',vi:'Trại Wycliffe · chuồng ngựa'};
  for(const id of ['p3_dorn_morning','p3_dorn_open'])S.scenes[id]||={...yard,size:[1024,1536],time:{en:'Wednesday · morning',vi:'Thứ Tư · buổi sáng'}};
  S.scenes.p3_dorn_gate_closed||={...yard,size:[1024,1536],time:{en:'Monday · late afternoon',vi:'Thứ Hai · cuối chiều'}};
  S.scenes.p3_yard_morning||={...S.scenes.p3_yard,size:[1024,1536],time:{en:'Tuesday · morning',vi:'Thứ Ba · buổi sáng'}};
  S.scenes.p3_yard_morning_alert||={...S.scenes.p3_yard,size:[1024,1536],time:{en:'Tuesday',vi:'Thứ Ba'}};
  S.scenes.p3_yard_morning_clean||={...S.scenes.p3_yard,size:[1024,1536],time:{en:'Tuesday · morning',vi:'Thứ Ba · buổi sáng'}};
  S.scenes.p3_yard_morning_open||={...S.scenes.p3_yard_morning_clean};
  S.scenes.p3_office_stored||={...S.scenes.p3_office,size:[1024,1536],time:{en:'Tuesday · afternoon',vi:'Thứ Ba · buổi chiều'}};
  S.scenes.p3_stable_return||={...S.scenes.p3_stable,size:[1024,1536],time:{en:'Wednesday',vi:'Thứ Tư'}};
  S.scenes.p3_race||={...S.scenes.p3_finish,size:[1024,1536]};
  for(const p of Object.values(S.places||{}))for(const v of Object.values(p.views||{}))for(const a of v.people||[]){if(a.who==='ben')a.r=[39,35,26,57];if(a.who==='nora')a.r=[67,37,25,55];}
  const c3=S.nodes?.p3c3_open;if(c3){const bg=c3.find(s=>s.bg);if(bg)bg.bg='p3_yard_morning_clean';}
  const yv=S.places?.p3c3_yard_walk?.views?.yard;if(yv){
   yv.img=s=>s.has('p3_dog_baseline')?'p3_yard_morning_open':'p3_yard_morning_clean';
   // Static exploration fallback and the one animated prop share one identity.
   // The active prop suppresses this fallback only in its own image layer.
   yv.props=[...(yv.props||[]).filter(p=>p.id!=='moss'),
    {id:'moss',art:'p3_moss_sleep',r:[40.7,53.87,20,6.67],if:s=>!s.has('p3_dog_baseline'),z:3},
    {id:'moss',art:'p3_moss_alert',r:[39,49.54,25,11.12],if:s=>s.has('p3_dog_baseline'),z:3}];
   const dog=yv.zones?.find(z=>z.id==='dog');if(dog){dog.r=[41,50,22,11];dog.inspectR=[36,46,32,19];}
  }
  const sv=S.places?.p3c3_yard_walk?.views?.stall;
  if(sv){sv.img=s=>s.R.pl?.p3c3_yard_walk?.seen?.['stall/hatch']?'p3_stable_outer_closed':'p3_stable';const test=sv.zones?.find(z=>z.id==='hatch');if(test?.then?.[1]){test.then[1].shot=null;test.then[1].look=null;}}
  for(const s of S.nodes?.p3c4_open||[])if(s.bg==='p3_yard')s.bg='p3_yard_morning_alert';
  for(const s of S.nodes?.p3c5_recovery_route||[])if(s.bg==='p3_yard')s.bg='p3_stable';
  const open=S.nodes?.p3c5_open;if(open){const bg=open.find(s=>s.bg);if(bg)bg.bg='p3_dorn_morning';for(const s of open){if(s===open[10]&&s.n){delete s.shot;s.scene='p3_dorn_open';}if(s.explore)s.explore.img='p3_dorn_open';}}
  walk(S.nodes,v=>{if(v.say==='dorn'&&v.face==='concerned')v.face='uneasy';});
  narr(S,["nodes","p3c1_open",8],v=>{v.motion=face('p3-v06-owner-concern','elin','','concerned');});
  narr(S,["nodes","p3c2_open",22],v=>{v.motion=face('p3-v06-guarded-glance','dorn','','uneasy',{show:true,at:'r'});});
  narr(S,["nodes","p3c2_open",25],v=>{v.motion={id:'p3-v06-outer-gate',ms:1600,backdrop:{frames:[{offset:0,art:'p3_dorn_yard'},{offset:.4,art:'p3_dorn_gate_closed'}]}};});
  narr(S,["nodes","p3c3_open",4],v=>{v.look=[36,50,32,26];v.motion={id:'p3-v06-moss-sleeps',ms:0,tracks:[mossTrack(mossSleep)]};});
  step(S,["nodes","p3c3_open",6],v=>{if(v.say==='reed'){v.look=null;v.face='tea';}});
  narr(S,["places","p3c3_yard_walk","views","yard","zones",0,"then",0],v=>{v.scene='p3_yard_morning_open';v.look=[39,49.5,25,11.2];v.motion={id:'p3-v06-observed-bark',ms:3400,tracks:[mossTrack(mossSleep,[{offset:0},{offset:.2,...mossAlert},{offset:.38,art:'p3_moss_bark',at:[51.5,54.9]},{offset:.5,...mossAlert},{offset:.66,art:'p3_moss_bark',at:[51.5,54.9]},{offset:.79,...mossAlert},{offset:1,...mossAlert}])],actors:[{id:'reed',hide:true},{id:'nora',hide:true}]};});
  narr(S,["places","p3c3_yard_walk","views","yard","zones",0,"then",2],v=>{v.look=[49,39,21,16];v.motion={id:'p3-v06-familiar-greeting',ms:1000,actors:[{id:'ben',hide:true}],tracks:[mossTrack({art:'p3_ben_moss_settle',at:[56.4,50.6],w:49,ar:1.5},[{offset:0,opacity:0},{offset:.35,opacity:1},{offset:1}])]};});
  narr(S,["places","p3c3_yard_walk","views","stall","zones",0,"then",0],v=>{v.shot='p3_stable';v.look='p3_sound_check';v.motion={id:'p3-v06-door-sound-check',ms:3100,backdrop:{frames:[{offset:0,art:'p3_stable'},{offset:.28,art:'p3_stable_outer_closed'},{offset:.67,art:'p3_care_signal'}]}};});
  // Ben keeps the actual letters through the following conversation. Only the
  // completed observation returns to the dog-only exploration pose.
  walk(S.places,v=>{if(v.item==='p3_dog_baseline')v.motion={id:'p3-v06-observation-complete',ms:0,tracks:[mossTrack(mossAlert)]};});
  narr(S,["nodes","p3c3_open",14],v=>{v.scene='p3_yard_morning_open';v.look=null;v.motion={id:'p3-v06-yard-after-observation',ms:0,tracks:[mossTrack(mossAlert)]};});
  narr(S,["nodes","p3c4_open",41],v=>{v.look=[45,59,30,18];v.motion={id:'p3-v06-private-letters-stored',ms:1450,backdrop:{frames:[{offset:0,art:'p3_office'},{offset:.48,art:'p3_office_stored'}]}};});
  narr(S,["nodes","p3c3_open",30],v=>{delete v.shot;v.scene='p3_yard_morning_alert';v.motion={id:'p3-v06-corrected-report',ms:1500,actors:[{id:'elin',hide:true},{id:'reed',hide:true},{id:'ben',show:true,at:'c',frames:[{offset:0,face:''},{offset:.72,face:'relieved'}]}]};});
  narr(S,["nodes","p3c4_open",17],v=>{v.motion=face('p3-v06-care-finding','nora','','concerned',{show:true,at:'r'});});
  // A real cloth contact uncovers the star before the original full-horse check.
  narr(S,["nodes","p3c5_open",16],v=>{v.shot='p3_forehead_before';v.look=[60,28,23,18];v.motion={id:'p3-v06-horse-forehead',ms:2200,actors:[{id:'dorn',hide:true}],backdrop:{frames:[{offset:0,art:'p3_forehead_before'},{offset:.5,art:'p3_forehead_after'}]}};});
  if(open){const arrival=open.find(v=>v.prop?.id==='ember'&&!v.prop.off);if(arrival){arrival.shot=null;arrival.look=null;Object.assign(arrival.prop,{at:[53,65],to:[49,65],w:74,ms:900});}}
  narr(S,["nodes","p3c5_open",19,"explore","spots",2,"then",0],v=>{v.shot='p3_farrier_check';v.look=[39,29,16,11];});
  walk(S.nodes,v=>{if(v.item==='p3_shoe_match'){v.shot=null;v.look=null;v.motion={id:'p3-v06-shoe-check-return',ms:0,tracks:[{id:'ember',art:'p3_horse',at:[49,65],w:74,ar:1.5,frames:[{offset:0},{offset:1}]}]};}});
  step(S,["nodes","p3c5_open",24],v=>{if(v.say==='nora')v.motion=face('p3-v06-health-confirmed','nora','concerned','',{show:true,at:'l'});});
  for(const s of S.nodes?.p3c5_true_route||[]){
   if(s===S.nodes.p3c5_true_route[3]&&s.n)s.motion={id:'p3-v06-course-examination',ms:700,tracks:[{id:'ember_course',art:'p3_horse',at:[49,66],w:70,ar:1.5,frames:[{offset:0,opacity:0},{offset:1,opacity:1}]}]};
   if(s===S.nodes.p3c5_true_route[5]&&s.say==='elin')s.motion=face('p3-v06-horse-safe','elin','concerned','',{show:true,at:'l'});
   if(s===S.nodes.p3c5_true_route[7]&&s.n){s.shot='p3_race';s.clearProps=true;s.look=[19,27,74,60];}
   if(s===S.nodes.p3c5_true_route[8]&&s.n){s.shot=null;s.look=null;}
  }
  narr(S,["nodes","p3c5_late_route",6],v=>{v.look=[43,39,45,34];v.motion={id:'p3-v06-late-departure',ms:2200,tracks:[{id:'ember_late',art:'p3_horse',at:[49,66],w:70,ar:1.5,frames:[{offset:0,opacity:0},{offset:.15,opacity:1},{offset:1,at:[70,66]}]}]};});
  // The native scene fade reveals one drinking horse. Keep the muzzle/water
  // unobstructed during this action; foreground portraits resume on actual speech.
  narr(S,["nodes","p3c5_recovery_route",5],v=>{delete v.shot;delete v.clearProps;delete v.motion;v.scene='p3_stable_return';v.look=[12,46,30,31];});
  walk(S.nodes?.p3c5_recovery_route,v=>{
   if(v===at(S,["nodes","p3c5_recovery_route",6,"then",0])&&v.say==='nora'){v.look=null;v.motion=face('p3-v06-recovery-care','nora','concerned','',{show:true,at:'l'});}
   if(v===at(S,["nodes","p3c5_recovery_route",6,"else",0])&&v.say==='elin'){v.look=null;v.motion=face('p3-v06-recovery-owner','elin','concerned','',{show:true,at:'l'});}
   if(v===at(S,["nodes","p3c5_recovery_route",7])&&v.say==='reed')v.motion={id:'p3-v06-recovery-report',ms:700,actors:[{id:'nora',hide:true},{id:'elin',hide:true},{id:'reed',show:true,at:'l',frames:[{offset:0,face:'concerned'}]}]};
  });
  // These are composed action images: focus identifies the contact while
  // context protects the complete dog, hand, horse or person from a second crop.
  action(S,["nodes","p3c3_open",4],[16,25,78,45],1.3);
  wide(S,["nodes","p3c3_open",6]);
  action(S,["places","p3c3_yard_walk","views","yard","zones",0,"then",0],[16,25,78,45],1.35);
  action(S,["places","p3c3_yard_walk","views","yard","zones",0,"then",2],[25,27,62,42]);
  wide(S,["places","p3c3_yard_walk","views","yard","zones",0,"then",7]);
  action(S,["places","p3c3_yard_walk","views","stall","zones",0,"then",0],"p3_sound_context");
  wide(S,["places","p3c3_yard_walk","views","stall","zones",0,"then",1]);
  wide(S,["nodes","p3c3_open",14]);
  action(S,["nodes","p3c4_open",41],[0,43,100,43]);
  wide(S,["nodes","p3c4_open",42]);
  action(S,["nodes","p3c5_open",16],[3,3,94,82]);
  wide(S,["nodes","p3c5_open",17]);
  action(S,["nodes","p3c5_open",19,"explore","spots",2,"then",0],[3,0,87,65]);
  wide(S,["nodes","p3c5_open",19,"explore","spots",2,"then",2]);
  action(S,["nodes","p3c5_true_route",7],[9,23,85,59]);
  wide(S,["nodes","p3c5_true_route",8]);
  action(S,["nodes","p3c5_late_route",6],[7,30,93,48]);
  wide(S,["nodes","p3c5_late_route",7]);
  action(S,["nodes","p3c5_recovery_route",5],[14,28,73,49]);
  wide(S,["nodes","p3c5_recovery_route",6,"then",0]);
  wide(S,["nodes","p3c5_recovery_route",6,"else",0]);

 }
 E.on('boot',apply);E.on('chapter',()=>apply(E.S()));
})();
