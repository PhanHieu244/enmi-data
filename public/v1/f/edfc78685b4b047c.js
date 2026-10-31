/* Art-only staging overlay: no inserted steps or changed save paths. */
(() => {
 const E=StoryEngine;
 function walk(v){if(!v||typeof v!=='object')return;
  // The next observation is from the corridor, not the closed pre-incident grille.
  if(v.n?.en?.startsWith('You step back into the corridor'))v.shot='p2_corridor_night';
  if(v.n?.en?.startsWith('The last task is a small one:'))v.shot='p2_house_evening';
  if(v.reconstruct?.id==='p2_watch_positions'){
   v.reconstruct.numbered=false;
   for(const c of v.reconstruct.cards){if(c.id==='reed')c.image='reed';if(c.id==='lydia')c.image='lydia';if(c.id==='vale')c.image='vale';}
  }
  for(const x of Object.values(v))if(x&&typeof x==='object')walk(x);
 }
 function apply(S){if(!S||S.id!=='vale-dossiers-part2-v01')return;S.scenes.p2_corridor_night||={...S.scenes.p2_corridor,time:{en:'Monday · night',vi:'Thứ Hai · ban đêm'}};walk(S.nodes);const room=S.nodes?.p2c4_open?.find(s=>s.explore)?.explore;const bed=room?.spots?.find(s=>s.id==='bed');if(bed){bed.r=[46,73,9,8];bed.x=50.5;bed.y=77;}if(S.items?.p2_night_observation)S.items.p2_night_observation.artAlias='p2_night_vent';}
 E.on('boot',apply);E.on('chapter',()=>apply(E.S()));
})();
