/* A compact right-hand dropdown reuses the engine's real controls. */
(() => {
 'use strict';
 const E=StoryEngine,V=Statement;
 E.on('boot',()=>{
  const root=document.querySelector('.se'),top=root?.querySelector('.se-top'),group=top?.querySelector('.se-grp'),settings=top?.querySelector('[data-a="menu"]');
  if(!root||!top||!group||!settings||top.querySelector('[data-quick-toggle]'))return;
  root.classList.add('statement-toolbar');
  group.classList.add('statement-quick-menu');group.dataset.quickMenu='';group.id='statement-quick-menu';group.hidden=true;
  group.setAttribute('role','group');group.setAttribute('aria-label',E.nat({en:'Game menu',vi:'Menu trò chơi'}));
  const labels={book:{en:'Casebook',vi:'Hồ sơ'},log:{en:'Dialogue history',vi:'Lịch sử thoại'},trall:{en:'Translation',vi:'Bản dịch'},flow:{en:'Your route',vi:'Tuyến đã chơi'},menu:{en:'Settings',vi:'Cài đặt'}};
  const buttons={};for(const button of [...top.querySelectorAll('[data-a]')]){
   const key=button.dataset.a;if(!labels[key])continue;buttons[key]=button;
   button.type='button';button.setAttribute('aria-label',E.nat(labels[key]));button.title=E.nat(labels[key]);
   const span=document.createElement('span');span.className='statement-tool-label';span.textContent=E.nat(labels[key]);button.append(span);
  }
  for(const key of ['book','log','trall','flow','menu'])if(buttons[key])group.append(buttons[key]);
  const toggle=document.createElement('button');toggle.type='button';toggle.className='statement-quick-toggle';toggle.dataset.quickToggle='';toggle.setAttribute('aria-controls',group.id);toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label',E.nat({en:'Open game menu',vi:'Mở menu trò chơi'}));toggle.title=toggle.getAttribute('aria-label');toggle.innerHTML=E.ICON.menu+'<i class="statement-menu-dot" hidden></i>';toggle.querySelector('svg')?.setAttribute('aria-hidden','true');
  top.append(toggle);
  const shield=document.createElement('div');shield.className='statement-menu-shield';shield.hidden=true;shield.setAttribute('aria-hidden','true');root.append(shield);
  let opened=false;
  const setOpen=(value,focus=false)=>{
   const next=!!value;if(next===opened)return;opened=next;group.hidden=!opened;shield.hidden=!opened;root.classList.toggle('statement-menu-open',opened);
   toggle.setAttribute('aria-expanded',String(opened));toggle.setAttribute('aria-label',E.nat(opened?{en:'Close game menu',vi:'Đóng menu trò chơi'}:{en:'Open game menu',vi:'Mở menu trò chơi'}));toggle.title=toggle.getAttribute('aria-label');
   if(opened){E.hush();buttons.trall?.setAttribute('aria-pressed',String(!!E.G().set.tr));if(focus)group.querySelector('button')?.focus({preventScroll:true});}
   else if(focus)toggle.focus({preventScroll:true});
   E.emit('quick-menu',opened);
  };
  V.closeQuickMenu=()=>setOpen(false);
  const leave=document.createElement('button');leave.type='button';leave.dataset.quickExit='';
  const leaveLabel=E.nat({en:'Exit to overview',vi:'Thoát về tổng quan'});leave.setAttribute('aria-label',leaveLabel);leave.title=leaveLabel;
  leave.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5H4v14h5M13 7l5 5-5 5M8 12h12"/></svg><span class="statement-tool-label">'+E.esc(leaveLabel)+'</span>';
  leave.onclick=e=>{e.preventDefault();e.stopPropagation();setOpen(false);V.dismissObjective?.();V.home();};group.append(leave);
  toggle.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();E.sfx('tap');setOpen(!opened,e.detail===0);});
  shield.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();setOpen(false,true);});
  // Close before the native delegated handler opens the real sheet or changes
  // translation. The original data-a buttons and their state stay intact.
  group.addEventListener('click',e=>{if(e.target.closest('[data-a]'))setOpen(false);});
  root.addEventListener('keydown',e=>{
   if(!opened)return;
   if(e.key==='Escape'){e.preventDefault();e.stopPropagation();setOpen(false,true);return;}
   if(!['ArrowDown','ArrowUp','Home','End'].includes(e.key))return;
   const all=[...group.querySelectorAll('button')].filter(b=>!b.disabled),i=all.indexOf(document.activeElement);
   e.preventDefault();const next=e.key==='Home'?0:e.key==='End'?all.length-1:e.key==='ArrowDown'?(i+1+all.length)%all.length:(i-1+all.length)%all.length;all[next]?.focus({preventScroll:true});
  });
  // On touch, blur can temporarily leave BODY active before click dispatch.
  // Hiding the touched control at that point retargets its click to the scene.
  // Close on an explicit keyboard focus transfer; pointer dismissal belongs
  // to the shield's completed click above.
  let tabTransfer=false;
  top.addEventListener('keydown',e=>{if(e.key==='Tab')tabTransfer=true;});
  top.addEventListener('pointerdown',()=>{tabTransfer=false;},true);
  top.addEventListener('focusout',e=>{
   if(tabTransfer&&e.relatedTarget&&!top.contains(e.relatedTarget))setOpen(false);
   tabTransfer=false;
  });
  const sourceDot=buttons.book?.querySelector('.se-dot'),menuDot=toggle.querySelector('.statement-menu-dot');
  const dot=()=>{if(menuDot&&sourceDot)menuDot.hidden=sourceDot.hidden;};if(sourceDot)new MutationObserver(dot).observe(sourceDot,{attributes:true,attributeFilter:['hidden']});dot();
  E.on('step',()=>setOpen(false));E.on('end',()=>setOpen(false));
  const reset=E.ui.reset;E.ui.reset=(...args)=>{setOpen(false);return reset(...args);};
 });
})();
