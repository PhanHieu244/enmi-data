/* Vale 0.6 presentation metadata; authored arrays/save paths stay stable. */
(() => {
 const E=StoryEngine;
 const walk=(v,fn)=>{if(!v||typeof v!=='object')return;fn(v);for(const x of Object.values(v))if(x&&typeof x==='object')walk(x,fn);};
 const narr=(S,prefix,fn)=>{for(const c of [S.nodes,S.places,S.talks])walk(c,v=>{if(v.n?.en?.startsWith(prefix))fn(v);});};
 const face=(id,who,from,to,extra={})=>({id,ms:1250,actors:[{id:who,...extra,frames:[{offset:0,face:from},{offset:.62,face:to}]}]});
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
  const open=S.nodes?.p3c5_open;if(open){const bg=open.find(s=>s.bg);if(bg)bg.bg='p3_dorn_morning';for(const s of open){if(s.n?.en?.startsWith('Dorn opens the stable door.')){delete s.shot;s.scene='p3_dorn_open';}if(s.explore)s.explore.img='p3_dorn_open';}}
  walk(S.nodes,v=>{if(v.say==='dorn'&&v.face==='concerned')v.face='uneasy';});
  narr(S,'Lady Wycliffe waits by the gate',v=>{v.motion=face('p3-v06-owner-concern','elin','','concerned');});
  narr(S,'Dorn looks past you towards the moor.',v=>{v.motion=face('p3-v06-guarded-glance','dorn','','uneasy',{show:true,at:'r'});});
  narr(S,'He closes the gate on the word',v=>{v.motion={id:'p3-v06-outer-gate',ms:1600,backdrop:{frames:[{offset:0,art:'p3_dorn_yard'},{offset:.4,art:'p3_dorn_gate_closed'}]}};});
  narr(S,'Tuesday morning brings dry flags',v=>{v.look=[36,50,32,26];v.motion={id:'p3-v06-moss-sleeps',ms:0,tracks:[mossTrack(mossSleep)]};});
  walk(S.nodes,v=>{if(v.say==='reed'&&v.en?.startsWith('The cups are holding things')){v.look=null;v.face='tea';}});
  narr(S,'A new messenger opens the gate with his elbow',v=>{v.scene='p3_yard_morning_open';v.look=[39,49.5,25,11.2];v.motion={id:'p3-v06-observed-bark',ms:3400,tracks:[mossTrack(mossSleep,[{offset:0},{offset:.2,...mossAlert},{offset:.38,art:'p3_moss_bark',at:[51.5,54.9]},{offset:.5,...mossAlert},{offset:.66,art:'p3_moss_bark',at:[51.5,54.9]},{offset:.79,...mossAlert},{offset:1,...mossAlert}])],actors:[{id:'reed',hide:true},{id:'nora',hide:true}]};});
  narr(S,'Ben takes the letters.',v=>{v.look=[49,39,21,16];v.motion={id:'p3-v06-familiar-greeting',ms:1000,actors:[{id:'ben',hide:true}],tracks:[mossTrack({art:'p3_ben_moss_settle',at:[56.4,50.6],w:49,ar:1.5},[{offset:0,opacity:0},{offset:.35,opacity:1},{offset:1}])]};});
  narr(S,'With Nora back in the care room',v=>{v.shot='p3_stable';v.look='p3_sound_check';v.motion={id:'p3-v06-door-sound-check',ms:3100,backdrop:{frames:[{offset:0,art:'p3_stable'},{offset:.28,art:'p3_stable_outer_closed'},{offset:.67,art:'p3_care_signal'}]}};});
  // Ben keeps the actual letters through the following conversation. Only the
  // completed observation returns to the dog-only exploration pose.
  walk(S.places,v=>{if(v.item==='p3_dog_baseline')v.motion={id:'p3-v06-observation-complete',ms:0,tracks:[mossTrack(mossAlert)]};});
  narr(S,'Before you enter the office, Ben asks',v=>{v.scene='p3_yard_morning_open';v.look=null;v.motion={id:'p3-v06-yard-after-observation',ms:0,tracks:[mossTrack(mossAlert)]};});
  narr(S,'As you leave, Lady Wycliffe puts the family letters back',v=>{v.look=[45,59,30,18];v.motion={id:'p3-v06-private-letters-stored',ms:1450,backdrop:{frames:[{offset:0,art:'p3_office'},{offset:.48,art:'p3_office_stored'}]}};});
  narr(S,'Outside, Ben is cleaning the unused bridle.',v=>{delete v.shot;v.scene='p3_yard_morning_alert';v.motion={id:'p3-v06-corrected-report',ms:1500,actors:[{id:'elin',hide:true},{id:'reed',hide:true},{id:'ben',show:true,at:'c',frames:[{offset:0,face:''},{offset:.72,face:'relieved'}]}]};});
  narr(S,'She hands you a second note.',v=>{v.motion=face('p3-v06-care-finding','nora','','concerned',{show:true,at:'r'});});
  // A real cloth contact uncovers the star before the original full-horse check.
  narr(S,'Nora leads the animal into the open.',v=>{v.shot='p3_forehead_before';v.look=[60,28,23,18];v.motion={id:'p3-v06-horse-forehead',ms:2200,actors:[{id:'dorn',hide:true}],backdrop:{frames:[{offset:0,art:'p3_forehead_before'},{offset:.5,art:'p3_forehead_after'}]}};});
  if(open){const arrival=open.find(v=>v.prop?.id==='ember'&&!v.prop.off);if(arrival){arrival.shot=null;arrival.look=null;Object.assign(arrival.prop,{at:[53,65],to:[49,65],w:74,ms:900});}}
  narr(S,'The farrier supports the foot while Nora reads',v=>{v.shot='p3_farrier_check';v.look=[39,29,16,11];});
  walk(S.nodes,v=>{if(v.item==='p3_shoe_match'){v.shot=null;v.look=null;v.motion={id:'p3-v06-shoe-check-return',ms:0,tracks:[{id:'ember',art:'p3_horse',at:[49,65],w:74,ar:1.5,frames:[{offset:0},{offset:1}]}]};}});
  walk(S.nodes,v=>{if(v.say==='nora'&&v.en?.startsWith('No injury that would prevent him running'))v.motion=face('p3-v06-health-confirmed','nora','concerned','',{show:true,at:'l'});});
  for(const s of S.nodes?.p3c5_true_route||[]){
   if(s.n?.en?.startsWith('At the course, the surgeon examines Ember Star'))s.motion={id:'p3-v06-course-examination',ms:700,tracks:[{id:'ember_course',art:'p3_horse',at:[49,66],w:70,ar:1.5,frames:[{offset:0,opacity:0},{offset:1,opacity:1}]}]};
   if(s.say==='elin'&&s.en==='You found him.')s.motion=face('p3-v06-horse-safe','elin','concerned','',{show:true,at:'l'});
   if(s.n?.en?.startsWith('Later, the starting bell')){s.shot='p3_race';s.clearProps=true;s.look=[19,27,74,60];}
   if(s.n?.en?.startsWith('Lady Wycliffe accepts the cup')){s.shot=null;s.look=null;}
  }
  narr(S,'Ben leads Ember Star past the enclosure instead of into it.',v=>{v.look=[43,39,45,34];v.motion={id:'p3-v06-late-departure',ms:2200,tracks:[{id:'ember_late',art:'p3_horse',at:[49,66],w:70,ar:1.5,frames:[{offset:0,opacity:0},{offset:.15,opacity:1},{offset:1,at:[70,66]}]}]};});
  // The native scene fade reveals one drinking horse. Keep the muzzle/water
  // unobstructed during this action; foreground portraits resume on actual speech.
  narr(S,'Ben opens the stall door wide enough for both of them.',v=>{delete v.shot;delete v.clearProps;delete v.motion;v.scene='p3_stable_return';v.look=[12,46,30,31];});
  walk(S.nodes?.p3c5_recovery_route,v=>{
   if(v.say==='nora'&&v.en?.startsWith('The course surgeon has time')){v.look=null;v.motion=face('p3-v06-recovery-care','nora','concerned','',{show:true,at:'l'});}
   if(v.say==='elin'&&v.en?.startsWith('The entry has closed.')){v.look=null;v.motion=face('p3-v06-recovery-owner','elin','concerned','',{show:true,at:'l'});}
   if(v.say==='reed'&&v.en?.startsWith('I have left the second heading open.'))v.motion={id:'p3-v06-recovery-report',ms:700,actors:[{id:'nora',hide:true},{id:'elin',hide:true},{id:'reed',show:true,at:'l',frames:[{offset:0,face:'concerned'}]}]};
  });
 }
 E.on('boot',apply);E.on('chapter',()=>apply(E.S()));
})();
