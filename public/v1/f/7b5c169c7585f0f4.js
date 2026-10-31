/* Shared mobile measurements; scene controls follow the actual HUD, not vh guesses. */
(() => {
 const E=StoryEngine;
 const location=E.ui.loc;
 E.ui.loc=(...args)=>{
  location(...args);
  const status=document.querySelector('.se-stat');
  if(status){const full=[status.querySelector('.st-n')?.textContent,status.querySelector('.st-t')?.textContent].filter(Boolean).join(' · ');status.title=full;status.setAttribute('aria-label',full||E.nat({en:'Location',vi:'Địa điểm'}));}
 };
 const reveal=E.ui.reveal;
 E.ui.reveal=(id,options={})=>{
  const pending=reveal(id,options);
  if(options.fresh&&E.S()?.recordReceipts){
   const close=document.querySelector('.se-rev.fresh .rv-tap');
   if(close)close.textContent=E.nat({en:'Continue',vi:'Tiếp tục'});
  }
  return pending;
 };
 E.on('boot',()=>{
  const root=document.querySelector('.se'),top=root?.querySelector('.se-top'),ui=root?.querySelector('.se-ui');if(!root||!top||!ui)return;
  const status=top.querySelector('.se-stat');
  if(status)status.onclick=event=>{
   event.stopPropagation();
   const name=status.querySelector('.st-n')?.textContent,time=status.querySelector('.st-t')?.textContent;
   if(!name)return;
   E.ui.sheet(E.nat({en:'Location',vi:'Địa điểm'}),'<p><b>'+E.esc(name)+'</b></p>'+(time?'<p>'+E.esc(time)+'</p>':'')+'<button class="se-btn wide" data-location-back>'+E.esc(E.nat({en:'Back to the story',vi:'Trở lại truyện'}))+'</button>');
   document.querySelector('[data-location-back]').onclick=()=>E.ui.closeSheet();
  };
  let frame=0;
  const measure=()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{
   const rr=root.getBoundingClientRect(),tr=top.getBoundingClientRect(),ur=ui.getBoundingClientRect();
   const side=matchMedia('(min-aspect-ratio: 11/10) and (max-height: 560px)').matches;
   const bottom=!side&&ui.children.length&&ur.width>rr.width*.65?Math.max(0,rr.bottom-ur.top):0;
   root.style.setProperty('--vale-hud-height',Math.round(bottom)+'px');
   root.style.setProperty('--vale-toolbar-height',Math.ceil(tr.height+Math.max(0,tr.top-rr.top))+'px');
  });};
  const ro=new ResizeObserver(measure);ro.observe(top);ro.observe(ui);ro.observe(root);
  const mo=new MutationObserver(measure);mo.observe(ui,{childList:true,subtree:false});mo.observe(root,{attributes:true,attributeFilter:['data-m']});
  addEventListener('resize',measure);E.on('line',measure);E.on('step',measure);E.on('image-plane',measure);measure();
 });
})();
