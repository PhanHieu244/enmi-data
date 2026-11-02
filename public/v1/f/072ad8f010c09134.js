/* Statement direction d2: physical cast/axis remains engine-owned.
   Measured atlas paint, optional speaker closeups and establishing pans are presentation only. */
(() => {
 'use strict';
 const E=StoryEngine;
 // Candidate 1.0.4-compatible presentation fix; original story arrays stay byte-identical.
 // All numbers below are SHOT coordinates, not physical body-height canon.
 let frame=0,noticeTimer=null,currentNotice=null;
 const noticeQueue=[],seenNotices=new WeakSet();
 function queueFit(){if(!frame)frame=requestAnimationFrame(()=>{frame=0;spriteFit();});}
 const reducedMotion=()=>E.G()?.set.motion==='reduced'||(E.G()?.set.motion!=='full'&&matchMedia('(prefers-reduced-motion:reduce)').matches);
 const settings=()=>({cameraPans:false,reviewPoses:false,expressionCloseups:false,groupCloseups:true,...globalThis.StatementStagingOptions});
 const rootOf=()=>document.querySelector('.statement');
 const nodeOf=()=>E.R()?.stack?.[0]?.n||'';
 const rank={ll:0,l:1,c:2,r:3,rr:4};
 let focus='',poseShot=null,portrait=null,pan=null,stepSerial=0;
 const imageStatus=new Map(),panHistory=[];
 const metricFor=(id,face)=>{
  const M=globalThis.StatementStagingData?.metrics||{};
  if(id==='owen'&&nodeOf()==='c5_pier'&&settings().reviewPoses)return M['owen-oilskin-d1'];
  return M[id+(face?'-'+face:'')]||M[id];
 };
 function imageReady(src){
  if(!imageStatus.has(src)){
   const value={ready:false,failed:false};imageStatus.set(src,value);const im=new Image();
   im.onload=()=>{value.ready=true;value.size=[im.naturalWidth,im.naturalHeight];queueFit();};
   im.onerror=()=>{value.failed=true;queueFit();};im.src=src;
  }
  return imageStatus.get(src);
 }
 function shotGeometry(width,height,count,close=false){
  const slots=count===1?[50]:count===2?[28,72]:count===3?[22,50,78]:Array.from({length:count},(_,i)=>12+76*i/(count-1));
  const factor=close||count===1?.94:count===2?.54:count===3?.42:Math.min(.36,.9/count);
  const cellWidth=Math.max(1,Math.min(width*factor,height*(close||count===1?.98:count===2?.6:.48)));
  return {slots,cellWidth,cellHeight:cellWidth*2};
 }
 function safeActorArea(root,stage){
  const W=stage.clientWidth,H=stage.clientHeight,land=W!==root.clientWidth&&root.clientWidth>=600&&root.clientHeight<=500;
  const top=land?74:root.clientHeight<=640?128:144;
  const box=root.querySelector('.se-box'),br=box?.getBoundingClientRect(),sr=stage.getBoundingClientRect();
  let bottom=land?H-15:Math.min(H-(root.clientHeight<=640?226:282),br&&!box.hidden?br.top-sr.top-12:H);
  const lane=parseFloat(getComputedStyle(root).getPropertyValue('--statement-phone-lane-top'));
  if(root.dataset.phoneLayout==='compact'&&Number.isFinite(lane))bottom=Math.min(bottom,lane-sr.top+root.getBoundingClientRect().top-8);
  const height=Math.max(0,bottom-top);
  return {left:0,top,right:W,bottom:Math.max(top,bottom),width:W,height,landscape:land,hiddenReason:height<90?'phone-panel-space':''};
 }
 function updateShot(root,stage,area){
  let layer=root.querySelector('.statement-directed-shot');
  if(!layer){layer=document.createElement('div');layer.className='statement-directed-shot';layer.setAttribute('aria-hidden','true');layer.innerHTML='<img alt="">';stage.append(layer);}
  const candidate=poseShot&&settings().reviewPoses?poseShot:portrait&&settings().expressionCloseups?portrait:null;
  const status=candidate?imageReady(candidate.file):null,active=!!(candidate&&status?.ready&&!E.R()?.cg&&area.height>=90);
  layer.hidden=!active;root.dataset.statementDirectedShot=active?candidate.kind:'';
  if(!active)return false;
  const im=layer.querySelector('img');if(im.getAttribute('src')!==candidate.file)im.src=candidate.file;
  layer.dataset.kind=candidate.kind;layer.dataset.asset=candidate.file;layer.dataset.speaker=candidate.who||'';
  // Seated full scenes fit the whole meaningful head/hands/cup image. Bust
  // portraits have their own aspect; they never inherit the 1:2 sprite crop.
  const sr=stage.getBoundingClientRect(),rr=root.getBoundingClientRect();
  const bottom=Math.max(area.top+90,area.bottom),height=bottom-area.top;
  Object.assign(layer.style,{left:'0px',top:area.top+'px',width:area.width+'px',height:height+'px'});
  const [iw,ih]=status.size,crop=candidate.crop||[0,0,1,1],cw=(crop[2]-crop[0])*iw,ch=(crop[3]-crop[1])*ih;
  const scale=Math.min(area.width/cw,height/ch),drawW=iw*scale,drawH=ih*scale;
  const anchorX=candidate.kind==='expression'?globalThis.StatementStagingData?.portraits?.[candidate.file]?.headAnchorX:null;
  const imageLeft=Number.isFinite(anchorX)?area.width/2-anchorX*drawW:(area.width-cw*scale)/2-crop[0]*drawW;
  Object.assign(im.style,{position:'absolute',left:imageLeft+'px',top:(-crop[1]*drawH)+'px',width:drawW+'px',height:drawH+'px',maxWidth:'none',maxHeight:'none',clipPath:'inset('+(crop[1]*100)+'% '+((1-crop[2])*100)+'% '+((1-crop[3])*100)+'% '+(crop[0]*100)+'%)'});
  return true;
 }
 function spriteFit(){
  const root=rootOf(),stage=root?.querySelector('.se-stage'),band=root?.querySelector('.se-chars');
  if(!stage||!band||!stage.clientWidth)return;
  for(const a of band.querySelectorAll('.se-ch.out'))a.style.setProperty('opacity','0','important');
  const actors=[...band.querySelectorAll('.se-ch.on:not(.out)')];
  actors.sort((a,b)=>(rank[E.R()?.cast?.[a.dataset.id]?.at]??2)-(rank[E.R()?.cast?.[b.dataset.id]?.at]??2));
  const area=safeActorArea(root,stage),focused=actors.length>1&&settings().groupCloseups&&actors.some(a=>a.dataset.id===focus)?focus:'';
  const g=shotGeometry(area.width,area.height,actors.length||1,!!focused);
  root.dataset.statementShotCount=String(actors.length);root.dataset.statementFocus=focused;root.dataset.statementCastHidden=area.hiddenReason;
  for(const[k,v]of Object.entries({left:'0px',right:'0px',top:area.top+'px',bottom:'auto',height:area.height+'px',width:area.width+'px'}))band.style.setProperty(k,v,'important');
  const shot=updateShot(root,stage,area);
  actors.forEach((actor,i)=>{
   const el=actor.querySelector('.se-chi');if(!el)return;
   const id=actor.dataset.id,face=actor.dataset.face||'',m=metricFor(id,face),w=g.cellWidth,h=w/(m?.aspect||.5);
   const anchor=m?.anchor||[.5,.2],bbox=m?.bbox||[0,0,1,1];
   actor.dataset.statementActor='true';actor.dataset.statementFocus=focused?(id===focused?'speaker':'listener'):'group';
   actor.dataset.statementAxis=E.R()?.cast?.[id]?.at||'c';
   const left=focused?50:g.slots[i];
   for(const[k,v]of Object.entries({left:left+'%',width:w+'px',height:area.height+'px',top:'0px',bottom:'auto',transform:'translateX(-50%)',opacity:focused&&id!==focused?'0':'1',visibility:focused&&id!==focused?'hidden':'visible'}))actor.style.setProperty(k,v,'important');
   // Upper-silhouette alpha centroid is an explicit, reproducible anchor.
   // Crown comes from alpha128 bounds; body lower crop is deliberate bust.
   for(const[k,v]of Object.entries({width:w+'px',height:h+'px',left:(.5-anchor[0])*w+'px',top:(8-bbox[1]*h)+'px',right:'auto',bottom:'auto',transform:'none',animation:'none'}))el.style.setProperty(k,v,'important');
   const oil=id==='owen'&&nodeOf()==='c5_pier'&&settings().reviewPoses;
   actor.dataset.statementOilskin=oil?'true':'false';
   for(const img of el.querySelectorAll(':scope > .ii')){
    img.style.setProperty('clip-path','none','important');
    if(oil){img.style.setProperty('background-image','url("'+m.file+'")','important');img.style.setProperty('background-size','100% 100%','important');img.style.setProperty('background-position','center','important');}
    else{img.style.removeProperty('background-image');img.style.removeProperty('background-size');img.style.removeProperty('background-position');}
   }
   actor.dataset.statementMetric=oil?'owen-oilskin-d1':id+(face?'-'+face:'');
  });
 }
 function choosePortrait(st){
  if(st.phone||st.offscreen||st.say==='me')return null;
  const n=nodeOf(),who=st.say,face=typeof st.face==='function'?st.face(E.state()):st.face??E.R()?.cast?.[who]?.face??'';
  let key='';
  if(who==='ruth'&&['interview','c2_cells','c2'].includes(n))key=face==='soft'?'soft':face==='cold'?'stern':'focused';
  if(who==='kieran'&&n==='interview')key=['sad','crying','shock'].includes(face)?'breaking':['soft','relief'].includes(face)?'':'frightened';
  if(who==='owen'&&['interview','c2'].includes(n))key=['cold','angry'].includes(face)?'defensive':'friendly';
  if(who==='owen'&&n==='c5_pier')key='cornered-oilskin';
  if(who==='tom'&&n==='c2_cells')key=face==='soft'?'protective':face==='sad'?'tired':'';
  return key?{file:'img/st-cu-'+who+'-'+key+'-d2.webp',kind:'expression',who,crop:who==='kieran'?[0,.04,1,.57]:[0,0,1,.74]}:null;
 }
 const pans={
  pier:{scene:'pier',text:'The north pier. Fog rolls in from the sea.',points:[[24,37,1.12],[66,45,1.13],[50,50,1]],purpose:['Marta and waterline','pier approach and lamp','whole pier']},
  c2_shop:{scene:'chipshop',text:"Maggie's is warm, loud and smells",points:[[25,25,1.12],[75,35,1.12],[50,50,1]],purpose:['fryer and counter','steamed window and tables','whole shop']},
  c3_arch:{scene:'archive',text:'2 p.m. The records room under the station.',points:[[24,30,1.12],[74,40,1.13],[50,50,1]],purpose:['shelves of records','Finch desk area without reading clues','whole archive']},
  c4_gala:{scene:'gala',text:'Holt House glows on the hill like a ship.',points:[[50,15,1.13],[42,42,1.1],[50,50,1]],purpose:['chandelier and balcony','reception floor','whole hall']},
  c5_gp:{scene:'gullpoint',text:'Gull Point. A dead factory with broken windows.',points:[[22,27,1.13],[48,49,1.16],[50,50,1]],purpose:['old crane and factory mass','chained gate','whole entrance']}
 };
 function stopPan(reason='next-step'){
  if(!pan)return;const p=pan;pan=null;p.animation?.cancel();p.button?.remove();
  rootOf()?.removeAttribute('data-statement-pan');p.record.endedAt=performance.now();p.record.reason=reason;
 }
 async function startPan(key,serial){
  const spec=pans[key];if(!spec||!settings().cameraPans)return;
  const record={key,scene:spec.scene,points:spec.points,purpose:spec.purpose,startedAt:performance.now(),skipped:E.auto?'auto':reducedMotion()?'reduced-motion':null};panHistory.push(record);
  if(record.skipped)return;
  const run=E.R();await E.ui.layerReady?.();
  if(serial!==stepSerial||run!==E.R()||E.R()?.scene!==spec.scene)return;
  const root=rootOf(),layer=root?.querySelector('.se-bgl.on > .ii'),stage=root?.querySelector('.se-stage');if(!layer||!stage)return;
  const sr=stage.getBoundingClientRect(),lr=layer.getBoundingClientRect();
  const frames=spec.points.map(([x,y,k],i)=>({transform:'translate('+((50-x)/100*lr.width*(k-1)).toFixed(2)+'px,'+((50-y)/100*lr.height*(k-1)).toFixed(2)+'px) scale('+k+')',transformOrigin:x+'% '+y+'%',offset:i/(spec.points.length-1)}));
  const animation=layer.animate(frames,{duration:4800,easing:'ease-in-out',fill:'none'});
  const button=document.createElement('button');button.type='button';button.className='statement-pan-skip';button.textContent=E.nat({en:'Skip camera move',vi:'Bỏ qua chuyển máy'});
  button.addEventListener('pointerdown',e=>{e.stopPropagation();});button.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();stopPan('skip');});stage.append(button);
  root.dataset.statementPan=key;record.duration=4800;record.actualLayer={width:lr.width,height:lr.height};record.keyframes=frames;
  pan={animation,button,record};animation.finished.then(()=>{if(pan?.animation===animation)stopPan('completed');}).catch(()=>{});
 }
 function directionStep(type,st){
  const serial=++stepSerial;stopPan();
  const n=nodeOf();poseShot=null;
  if(type==='say'&&!st.phone&&!st.offscreen&&st.say!=='me'){focus=st.say;portrait=choosePortrait(st);}
  else if(['choice','talk','set','add','meter','item','cp'].includes(type)){/* hold physical shot through a menu/state receipt */}
  else{focus='';portrait=null;}
  if(type==='n'){
   const t=typeof st.n==='string'?st.n:st.n?.en||'';
   if(n==='interview'&&t.startsWith('The boy holds a paper cup'))poseShot={file:'img/st-cg-kieran-seated-d1.webp',kind:'seated',who:'kieran',crop:[0,.08,1,.73]};
   if(n==='c2_cells'&&t.startsWith('Interview Room 2. Tom'))poseShot={file:'img/st-cg-tom-seated-d1.webp',kind:'seated',who:'tom',crop:[0,.08,1,.76]};
   const p=pans[n];if(p&&t.startsWith(p.text))startPan(n,serial);
  }
  queueFit();
 }
 function clearDirection(){++stepSerial;stopPan('lifecycle');focus='';portrait=null;poseShot=null;queueFit();}
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
  for(const el of root.querySelectorAll('.se-mem .se-rm,.se-mem .se-meet')){
   if(seenNotices.has(el))continue;seenNotices.add(el);el.dataset.statementNotice='queued';el.setAttribute('aria-hidden','true');
   const b=document.createElement('button');b.type='button';b.className='statement-notice-dismiss';b.textContent='×';
   b.setAttribute('aria-label',typeof E.nat==='function'?E.nat({en:'Dismiss notification',vi:'Đóng thông báo'}):'Dismiss notification');
   b.addEventListener('pointerdown',e=>e.stopPropagation());
   b.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();closeNotice(el);});el.append(b);noticeQueue.push(el);
  }
  showNextNotice();
 }
 // Pure geometry is exposed for a component harness; this is not an engine API.
 globalThis.StatementDirection={version:'direction-d2',shotGeometry,refresh:queueFit,clearNotices,
  configure:options=>{globalThis.StatementStagingOptions={...settings(),...options};if(options.cameraPans===false)stopPan('disabled');queueFit();return settings();},
  inspect:()=>({settings:settings(),node:nodeOf(),focus,poseShot,portrait,pan:pan?.record||null,panHistory:panHistory.map(x=>({...x})),area:rootOf()?safeActorArea(rootOf(),rootOf().querySelector('.se-stage')):null}),
  panSpecs:pans};
 E.on('step',directionStep);
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
  if(changed){clearNotices();clearDirection();globalThis.Statement?.clearObjective?.();}if(changed&&!keepCg){E.ui.hide('*');E.ui.pic?.(null);E.ui.cam?.(null);}
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
  root.dataset.statementDirection='2';
  new ResizeObserver(queueFit).observe(stage);
  new ResizeObserver(queueFit).observe(band);
  new MutationObserver(queueFit).observe(band,{childList:true,subtree:true,attributes:true,attributeFilter:['class','data-face']});
  new MutationObserver(()=>syncNotices(root)).observe(root,{childList:true,subtree:true});
  for(const key of ['stop']){const fn=E[key];if(typeof fn==='function')E[key]=function(...args){clearNotices();clearDirection();return fn.apply(this,args);};}
  const reset=E.ui.reset;if(typeof reset==='function')E.ui.reset=function(...args){clearNotices();clearDirection();return reset.apply(this,args);};
  E.on('end',()=>{clearNotices();clearDirection();});syncNotices(root);queueFit();
  new MutationObserver(queueFit).observe(root,{attributes:true,attributeFilter:['data-phone-layout']});
  addEventListener('resize',()=>{stopPan('resize');queueFit();},{passive:true});
 });
})();
