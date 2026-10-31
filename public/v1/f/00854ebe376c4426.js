/* Vale 0.6 presentation metadata; authored arrays/save paths stay stable. */
(() => {
 const E=StoryEngine;
 const walk=(v,fn)=>{if(!v||typeof v!=='object')return;fn(v);for(const x of Object.values(v))if(x&&typeof x==='object')walk(x,fn);};
 const narr=(S,prefix,fn)=>{for(const c of [S.nodes,S.places,S.talks])walk(c,v=>{if(v.n?.en?.startsWith(prefix))fn(v);});};
 const face=(id,who,from,to,extra={})=>({id,ms:1250,actors:[{id:who,...extra,frames:[{offset:0,face:from},{offset:.62,face:to}]}]});
 function apply(S){if(!S||S.id!=='vale-dossiers-part3-v01')return;
  const yard=S.scenes.p3_dorn_yard;
  S.scenes.p3_stable.name={en:'Wycliffe stable · stall',vi:'Trại Wycliffe · chuồng ngựa'};
  for(const id of ['p3_dorn_morning','p3_dorn_open'])S.scenes[id]||={...yard,size:[1024,1536],time:{en:'Wednesday · morning',vi:'Thứ Tư · buổi sáng'}};
  S.scenes.p3_dorn_gate_closed||={...yard,size:[1024,1536],time:{en:'Monday · late afternoon',vi:'Thứ Hai · cuối chiều'}};
  S.scenes.p3_yard_morning||={...S.scenes.p3_yard,size:[1024,1536],time:{en:'Tuesday · morning',vi:'Thứ Ba · buổi sáng'}};
  S.scenes.p3_yard_morning_alert||={...S.scenes.p3_yard,size:[1024,1536],time:{en:'Tuesday',vi:'Thứ Ba'}};
  S.scenes.p3_stable_return||={...S.scenes.p3_stable,size:[1024,1536],time:{en:'Wednesday',vi:'Thứ Tư'}};
  S.scenes.p3_race||={...S.scenes.p3_finish,size:[1024,1536]};
  for(const p of Object.values(S.places||{}))for(const v of Object.values(p.views||{}))for(const a of v.people||[]){if(a.who==='ben')a.r=[39,35,26,57];if(a.who==='nora')a.r=[67,37,25,55];}
  const c3=S.nodes?.p3c3_open;if(c3){const bg=c3.find(s=>s.bg);if(bg)bg.bg='p3_yard_morning';}
  const yv=S.places?.p3c3_yard_walk?.views?.yard;if(yv)yv.img=s=>s.has('p3_dog_baseline')?'p3_yard_morning_alert':'p3_yard_morning';
  for(const s of S.nodes?.p3c4_open||[])if(s.bg==='p3_yard')s.bg='p3_yard_morning_alert';
  for(const s of S.nodes?.p3c5_recovery_route||[])if(s.bg==='p3_yard')s.bg='p3_stable';
  const open=S.nodes?.p3c5_open;if(open){const bg=open.find(s=>s.bg);if(bg)bg.bg='p3_dorn_morning';for(const s of open){if(s.n?.en?.startsWith('Dorn opens the stable door.')){delete s.shot;s.scene='p3_dorn_open';}if(s.explore)s.explore.img='p3_dorn_open';}}
  walk(S.nodes,v=>{if(v.say==='dorn'&&v.face==='concerned')v.face='uneasy';});
  narr(S,'Lady Wycliffe waits by the gate',v=>{v.motion=face('p3-v06-owner-concern','elin','','concerned');});
  narr(S,'Dorn looks past you towards the moor.',v=>{v.motion=face('p3-v06-guarded-glance','dorn','','uneasy',{show:true,at:'r'});});
  narr(S,'He closes the gate on the word',v=>{v.motion={id:'p3-v06-outer-gate',ms:1600,backdrop:{frames:[{offset:0,art:'p3_dorn_yard'},{offset:.4,art:'p3_dorn_gate_closed'}]}};});
  narr(S,'A new messenger opens the gate with his elbow',v=>{v.motion={id:'p3-v06-observed-bark',ms:2100,backdrop:{frames:[{offset:0,art:'p3_yard_morning'},{offset:.34,art:'p3_yard_morning_alert'}]}};});
  narr(S,'Outside, Ben is cleaning the unused bridle.',v=>{delete v.shot;v.scene='p3_yard_morning_alert';v.motion={id:'p3-v06-corrected-report',ms:1500,actors:[{id:'elin',hide:true},{id:'reed',hide:true},{id:'ben',show:true,at:'c',frames:[{offset:0,face:''},{offset:.72,face:'relieved'}]}]};});
  narr(S,'She hands you a second note.',v=>{v.motion=face('p3-v06-care-finding','nora','','concerned',{show:true,at:'r'});});
  // Brief arrival; reuse native id and original identification endpoint.
  narr(S,'Nora leads the animal into the open.',v=>{v.look=[50,35,42,35];v.motion={id:'p3-v06-horse-arrival',ms:1500,actors:[{id:'dorn',hide:true}],tracks:[{id:'ember',art:'p3_horse',at:[53,65],w:72,ar:1.5,frames:[{offset:0,opacity:0},{offset:.2,opacity:1},{offset:1,at:[49,65],w:74,opacity:1}]}]};});
  walk(S.nodes,v=>{if(v.say==='nora'&&v.en?.startsWith('No injury that would prevent him running'))v.motion=face('p3-v06-health-confirmed','nora','concerned','',{show:true,at:'l'});});
  for(const s of S.nodes?.p3c5_true_route||[]){
   if(s.say==='elin'&&s.en==='You found him.')s.motion=face('p3-v06-horse-safe','elin','concerned','',{show:true,at:'l'});
   if(s.n?.en?.startsWith('Later, the starting bell')){s.shot='p3_race';s.clearProps=true;s.look=[19,27,74,60];}
   if(s.n?.en?.startsWith('Lady Wycliffe accepts the cup')){s.shot=null;s.look=null;}
  }
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
