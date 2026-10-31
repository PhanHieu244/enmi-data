/* Shared mobile measurements; scene controls follow the actual HUD, not vh guesses. */
(() => {
 const E=StoryEngine;
 E.on('boot',()=>{
  const root=document.querySelector('.se'),top=root?.querySelector('.se-top'),ui=root?.querySelector('.se-ui');if(!root||!top||!ui)return;
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
