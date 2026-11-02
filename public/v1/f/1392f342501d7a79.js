/* Spatial continuity is physical: a new room retires the previous cast and shot.
   In-room speech only changes light emphasis, never the camera or ground line. */
(() => {
 'use strict';
 const E=StoryEngine;
 // Candidate 1.0.4-compatible presentation fix; original story arrays stay byte-identical.
 // All numbers below are SHOT coordinates, not physical body-height canon.
 let frame=0,noticeTimer=null,currentNotice=null;
 const noticeQueue=[],seenNotices=new WeakSet();
 function queueFit(){if(!frame)frame=requestAnimationFrame(()=>{frame=0;spriteFit();});}
 function shotGeometry(width,height,count){
  const slots=count===1?[50]:count===2?[28,72]:count===3?[25,50,75]:Array.from({length:count},(_,i)=>12+76*i/(count-1));
  const factor=count===1?.94:count===2?.54:count===3?.46:Math.min(.38,.9/count);
  const cellWidth=Math.max(1,Math.min(width*factor,height*(count===1?1.2:count===2?1:.8)));
  return {slots,cellWidth,cellHeight:cellWidth*2};
 }
 function spriteFit(){
  const root=document.querySelector('.statement'),stage=root?.querySelector('.se-stage'),band=root?.querySelector('.se-chars');
  if(!stage||!band||!stage.clientWidth||!band.clientHeight)return;
  const actors=[...band.querySelectorAll('.se-ch.on:not(.out)')];
  // Preserve physical left-to-right order. Speaking never reorders the cast.
  actors.sort((a,b)=>(parseFloat(getComputedStyle(a).left)||0)-(parseFloat(getComputedStyle(b).left)||0));
  const g=shotGeometry(stage.clientWidth,band.clientHeight,actors.length||1);
  root.dataset.statementShotCount=String(actors.length);
  actors.forEach((actor,i)=>{
   const el=actor.querySelector('.se-chi');if(!el)return;
   actor.style.setProperty('left',g.slots[i]+'%','important');
   actor.style.setProperty('width',g.cellWidth+'px','important');
   Object.assign(el.style,{width:g.cellWidth+'px',height:g.cellHeight+'px',top:'0px',bottom:'auto'});
  });
 }
 function closeNotice(el=currentNotice){
  if(!el)return;el.dataset.statementNotice='closed';el.setAttribute('aria-hidden','true');
  if(el===currentNotice){clearTimeout(noticeTimer);currentNotice=null;showNextNotice();}
 }
 function showNextNotice(){
  if(currentNotice)return;
  while(noticeQueue.length){const el=noticeQueue.shift();if(!el.isConnected)continue;
   currentNotice=el;el.dataset.statementNotice='visible';el.removeAttribute('aria-hidden');
   globalThis.Statement?.dismissObjective?.();
   // Cosmetic lifetime only: relation values/history remain owned by the engine.
   noticeTimer=setTimeout(()=>closeNotice(el),3600);break;
  }
 }
 function clearNotices(){
  clearTimeout(noticeTimer);if(currentNotice){currentNotice.dataset.statementNotice='closed';currentNotice.setAttribute('aria-hidden','true');}
  currentNotice=null;for(const el of noticeQueue){el.dataset.statementNotice='closed';el.setAttribute('aria-hidden','true');}noticeQueue.length=0;
 }
 function syncNotices(root){
  if(currentNotice&&!currentNotice.isConnected){clearTimeout(noticeTimer);currentNotice=null;}
  for(const el of root.querySelectorAll('.se-mem .se-rm')){
   if(seenNotices.has(el))continue;seenNotices.add(el);el.dataset.statementNotice='queued';el.setAttribute('aria-hidden','true');
   const b=document.createElement('button');b.type='button';b.className='statement-notice-dismiss';b.textContent='×';
   b.setAttribute('aria-label',typeof E.nat==='function'?E.nat({en:'Dismiss notification',vi:'Đóng thông báo'}):'Dismiss notification');
   b.addEventListener('pointerdown',e=>e.stopPropagation());
   b.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();closeNotice(el);});el.append(b);noticeQueue.push(el);
  }
  showNextNotice();
 }
 // Pure geometry is exposed for a component harness; this is not an engine API.
 globalThis.StatementDirection={version:'candidate-1',shotGeometry,refresh:queueFit,clearNotices};
 E.on('dialogue-frame',queueFit);
 const show=E.ui.show;E.ui.show=(...args)=>{
  const [who,at='c',face='']=args,old=E.R()?.cast?.[who];
  // Suppress a repeated entrance only for the exact same, visibly mounted pose.
  // A missing DOM actor, CG, changed pose or changed slot still calls the engine.
  if(args.length<=3&&typeof who==='string'&&/^[a-z0-9_-]+$/i.test(who)&&old&&old.at===at&&(old.face??'')===face&&!E.R()?.cg){
   const mounted=[...document.querySelectorAll('.statement .se-ch.on:not(.out)')].some(actor=>actor.querySelector('.im-'+who));
   if(mounted){queueFit();return;}
  }
  const out=show(...args);queueFit();return out;
 };
 const scene=E.ui.scene;E.ui.scene=(id,keepCg)=>{
  const R=E.R(),changed=R?.scene&&R.scene!==id;
  if(changed){clearNotices();globalThis.Statement?.clearObjective?.();}if(changed&&!keepCg){E.ui.hide('*');E.ui.pic?.(null);E.ui.cam?.(null);}
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
   const at=R.cast[st.say]?.at||(['c','l','r'].find(x=>!Object.values(R.cast).some(c=>c.at===x))||'c');
   const face=typeof st.face==='function'?st.face(E.state()):(st.face??R.cast[st.say]?.face??'');
   if(!R.cast[st.say]||R.cast[st.say].face!==face)E.ui.show(st.say,at,face);queueFit();
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
  const root=document.querySelector('.statement'),stage=root?.querySelector('.se-stage'),band=root?.querySelector('.se-chars');
  if(!root||!stage||!band)return;
  root.dataset.statementDirection='1';
  new ResizeObserver(queueFit).observe(stage);
  new ResizeObserver(queueFit).observe(band);
  new MutationObserver(queueFit).observe(band,{childList:true,subtree:true,attributes:true,attributeFilter:['class','data-face']});
  new MutationObserver(()=>syncNotices(root)).observe(root,{childList:true,subtree:true});
  for(const key of ['stop']){const fn=E[key];if(typeof fn==='function')E[key]=function(...args){clearNotices();return fn.apply(this,args);};}
  const reset=E.ui.reset;if(typeof reset==='function')E.ui.reset=function(...args){clearNotices();return reset.apply(this,args);};
  E.on('end',clearNotices);syncNotices(root);queueFit();
 });
})();
