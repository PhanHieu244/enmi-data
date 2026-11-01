/* Spatial continuity is physical: a new room retires the previous cast and shot.
   In-room speech only changes light emphasis, never the camera or ground line. */
(() => {
 'use strict';
 const E=StoryEngine;
 function spriteFit(){const stage=document.querySelector('.se-stage'),root=document.querySelector('.statement'),bust=root?.dataset.framing==='bust',count=Number(root?.dataset.n)||1;for(const actor of document.querySelectorAll('.statement .se-ch')){const el=actor.querySelector('.se-chi');if(!el)continue;const width=bust?Math.min(stage.clientWidth*(count===1?1.3:count===2?.95:.68),actor.clientHeight*1.75):Math.min(actor.clientWidth,actor.clientHeight/2);Object.assign(el.style,{width:width+'px',height:width*2+'px',left:(actor.clientWidth-width)/2+'px',right:'auto',top:bust?(-width*.02)+'px':'auto',bottom:bust?'auto':'0'});}}
 E.on('dialogue-frame',()=>requestAnimationFrame(spriteFit));
 const show=E.ui.show;E.ui.show=(...args)=>{const out=show(...args);requestAnimationFrame(spriteFit);return out;};
 const scene=E.ui.scene;E.ui.scene=(id,keepCg)=>{
  const R=E.R(),changed=R?.scene&&R.scene!==id;
  if(changed&&!keepCg){E.ui.hide('*');E.ui.pic?.(null);E.ui.cam?.(null);}
  const result=scene(id,keepCg);
  if(['car','interview','cells'].includes(id))E.ui.dialogueFrame?.('bust',true);
  if(R?.stack?.length&&document.querySelector('.se')?.dataset.m!=='ov'){
   R.statementVisits||=[];if(R.statementVisits.at(-1)?.scene!==id)R.statementVisits.push({scene:id,ch:R.ch||1});
  }
  return result;
 };
 E.on('step',(type,st)=>{
  const R=E.R();if(!R)return;
  if(type==='say'&&st.say!=='me'&&!st.phone&&!st.offscreen&&!['caller','finch'].includes(st.say)&&!R.cg){
   const at=R.cast[st.say]?.at||(['l','r','c'].find(x=>!Object.values(R.cast).some(c=>c.at===x))||'c');
   const face=typeof st.face==='function'?st.face(E.state()):(st.face??R.cast[st.say]?.face??'');
   if(!R.cast[st.say]||R.cast[st.say].face!==face)E.ui.show(st.say,at,face);
  }
 });
 E.on('boot',()=>{
  // Measured against the actual generated image, not the earlier prompt.
  const layouts={
   pier:{body:[33,53],wallet:[59,47],steps:[82,81],boat:[15,32],cam:[92,6],owen:[72,33]},
   c2_shop:{board:[20,24],photos:[70,23],jar:[23,42],door:[43,35]},
   c3_hosp:{rota:[8,20],car:[93,31],bin:[67,34]},
   c4_wire:{desk:[40,39],chair:[93,52],paint:[22,16]},
   c5_storm:{wall:[28,75],marta:[15,41]},
   c5_gp:{gate:[44,49],window:[89,31],bed:[19,47],wall:[90,26]}
  };
  for(const[node,layout]of Object.entries(layouts)){for(const st of E.S().nodes[node]||[]){if(!st.explore)continue;for(const spot of st.explore.spots){if(layout[spot.id]){[spot.x,spot.y]=layout[spot.id];spot.r=[spot.x-5,spot.y-5,10,10];}if(node==='pier'&&spot.id==='owen'){spot.art='owen';spot.artR=[58,18,28,37.3333];}}}}
  new ResizeObserver(spriteFit).observe(document.querySelector('.se-stage'));
 });
})();
