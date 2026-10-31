/* Art-state staging only; prose, choices and saved step paths stay unchanged. */
(() => {
 const E=StoryEngine;
 function apply(S){if(!S||S.id!=='vale-dossiers-part3-v01')return;
  const yard=S.scenes.p3_dorn_yard;
  for(const id of ['p3_dorn_morning','p3_dorn_open'])S.scenes[id]||={...yard,size:[1024,1536],time:{en:'Wednesday · morning',vi:'Thứ Tư · buổi sáng'}};
  S.scenes.p3_race||={...S.scenes.p3_finish,size:[1024,1536]};
  for(const p of Object.values(S.places||{}))for(const v of Object.values(p.views||{}))for(const actor of v.people||[]){if(actor.who==='ben')actor.r=[39,35,26,57];if(actor.who==='nora')actor.r=[67,37,25,55];}
  const open=S.nodes?.p3c5_open;if(open){const bg=open.find(s=>s.bg);if(bg)bg.bg='p3_dorn_morning';for(const s of open){if(s.n?.en?.startsWith('Dorn opens the stable door.'))s.shot='p3_dorn_open';if(s.explore)s.explore.img='p3_dorn_open';}}
  const end=S.nodes?.p3c5_true_route;for(const s of end||[]){if(s.n?.en?.startsWith('Later, the starting bell')){s.shot='p3_race';s.clearProps=true;}if(s.n?.en?.startsWith('Lady Wycliffe accepts the cup'))s.shot=null;}
 }
 E.on('boot',apply);E.on('chapter',()=>apply(E.S()));
})();
