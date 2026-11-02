/* Story-scoped interface. The Enmi interpreter and save state remain authoritative. */
(() => {
  const E=StoryEngine, q=s=>document.querySelector(s), esc=E.esc;
  const clone=x=>JSON.parse(JSON.stringify(x));
  const V=globalThis.ValeDemo={q,esc,clone,version:'0.9.7',engineUpdate:'1.0.4',active:null,line:null,storage:true};
  V.caseMeta=()=>E.S().caseMeta||{part:'I',chapters:6,endings:4,source:'A Scandal in Bohemia',sourceUrl:'https://www.gutenberg.org/ebooks/1661'};
  V.bi=t=>`<span class="vd-en" lang="en">${esc(E.tgt(t))}</span>${E.sub(t)?`<span class="vd-vi" lang="vi">${esc(E.sub(t))}</span>`:''}`;
  V.labels={fact:['Observed fact','Dữ kiện quan sát'],testimony:['Testimony','Lời khai'],inference:['Inference','Suy luận']};
  V.kind=it=>it.kind==='observation'?'fact':it.kind||'fact';
  V.tag=it=>{const k=V.kind(it),l=V.labels[k]||V.labels.fact;return `<span class="vd-kind ${esc(k)}">${l[0]} · ${l[1]}</span>`;};
  V.key=()=> 'se.'+E.S().id;
  // Resolve the case's lazy chapter data before validating a saved nested path.
  V.prepareSave=async()=>{const n=Math.max(1,...(E.S().chapters||[]).map(c=>c.ch));if(!(await E.loadUpTo(n)))throw Error('Could not load chapter data · Chưa nạp được dữ liệu chương');};
  V.snapshot=()=>{
    if(q('.se')?.dataset.m==='ov'){try{const old=JSON.parse(localStorage.getItem(V.key()+'.r'));if(old?.stack)return old;}catch{}}
    return E.snapshot ? E.snapshot() : clone(E.R());
  };
  V.persist=()=>{const r=V.snapshot();E.save();if(E.explore)return r;try{localStorage.setItem(V.key()+'.r',JSON.stringify(r));localStorage.setItem(V.key()+'.g',JSON.stringify(E.G()));V.storage=true;}catch{V.storage=false;}return r;};
  V.start=()=>{V.active=null;V.line=null;E.ui.closeSheet();E.stop();E.ui.clear();E.ui.hide('*');q('.se-top').hidden=false;E.newRun();};
  V.home=()=>{V.persist();E.ui.closeSheet();E.stop();E.ui.title();};
  V.restart=()=>{const sh=E.ui.sheet('Start again · Chơi lại','<p>This replaces the current route. Unlocked chapter outcomes and vocabulary remain.</p><p class="vd-vi">Tuyến đang chơi sẽ bắt đầu lại. Kết chương đã mở và từ đã lưu vẫn được giữ.</p><button class="se-btn pri wide" data-restart>Start chapter 1 again · Chơi lại chương 1</button>');sh.querySelector('[data-restart]').onclick=V.start;};
  V.exportSave=()=>{const d={format:'vale-dossiers-save',version:1,story:E.S().id,exportedAt:new Date().toISOString(),global:clone(E.G()),run:V.persist()};const url=URL.createObjectURL(new Blob([JSON.stringify(d,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='Vale_Dossiers_Save.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),30000);E.ui.toast('Save exported · Đã xuất bản lưu');};
  V.importSave=()=>{const input=document.createElement('input');input.type='file';input.accept='.json,application/json';input.onchange=async()=>{const file=input.files[0];if(!file)return;try{
    if(file.size>2000000)throw Error('Save file too large · Tệp quá lớn');const d=JSON.parse(await file.text());
    if(d.format!=='vale-dossiers-save'||d.version!==1||d.story!==E.S().id||!d.global?.set||!d.run?.f||!Array.isArray(d.run.stack)||!Array.isArray(d.run.items)||!Array.isArray(d.run.log))throw Error('Incompatible save · Bản lưu không tương thích');
    await V.prepareSave?.(d);
    if(!d.run.stack.every(f=>typeof f.n==='string'&&Array.isArray(f.p)&&Number.isInteger(f.i)&&f.i>=0&&Array.isArray(E.walk(f))&&f.i<=E.walk(f).length)||!d.run.items.every(id=>E.S().items[id]))throw Error('Unavailable scene or evidence · Cảnh hoặc chứng cứ không hợp lệ');
    const sh=E.ui.sheet('Load this save? · Nạp bản lưu?','<p>This replaces the current route in this browser.</p><p class="vd-vi">Bạn có thể xuất tiến độ hiện tại trước khi nạp.</p><div class="se-row"><button class="se-btn" data-export>Export current · Xuất hiện tại</button><button class="se-btn pri" data-load>Load save · Nạp</button></div>');sh.querySelector('[data-export]').onclick=V.exportSave;sh.querySelector('[data-load]').onclick=()=>{try{localStorage.setItem(V.key()+'.g',JSON.stringify(d.global));localStorage.setItem(V.key()+'.r',JSON.stringify(d.run));V.reloading=true;window.removeEventListener('beforeunload',V.unload);location.reload();}catch{E.ui.toast('Browser storage unavailable · Không thể lưu trên trình duyệt này');}};
  }catch(e){E.ui.toast(esc(e.message),5000);}};input.click();};
  V.update=()=>{const l=V.line,root=q('.se'),label=q('.vd-reader-label');if(!label)return;label.textContent=l?.kind==='think'?'YOUR THOUGHTS · SUY NGHĨ':l?.kind==='say'?'':'NARRATION · LỜI DẪN';label.hidden=l?.kind==='say';q('.se-txt').lang=l?.lang||E.L;q('.se-sub').lang=(l?.lang||E.L)===E.N?E.L:E.N;root.dataset.vdMask=E.R().f.matthias_masked===false?'off':'on';};
  V.unload=()=>{if(!V.reloading&&E.R()?.stack?.length)V.persist();};
  const initPreferences=()=>{const g=E.G().set;if(!g.vdNativeControls){
    Object.assign(g,{mode:'imm',speed:1,vDlg:true,vNarr:!!E.S().defaultNarration,shadow:true,sfx:true,amb:true,vdInitialized:true,vdNativeControls:true});
  }
  // Áp dụng mặc định mới một lần cho cả bản lưu cũ; không đổi tiến độ.
  if(!g.vdEnglishDefault){Object.assign(g,{mode:'imm',tr:false,docTr:false,vdEnglishDefault:true});}
  return g;};
  E.on('boot',()=>{E.S().recordReceipts=true;E.S().recordPresentation='compact';E.S().placeSwipe='direction';E.S().inspectionZoom=false;E.S().stableActionFraming=true;E.S().transientHints=true;E.S().collapsibleObjectives=true;V.wasLegacy=!!E.G().set.vdInitialized&&!E.G().set.vdNativeControls;const g=initPreferences();const root=q('.se');root.classList.add('vd');root.classList.toggle('vd-large',!!g.vdLarge);
    root.addEventListener('keydown',e=>{const word=e.target.closest?.('.w[data-w]');if(!word||e.repeat||e.altKey||e.ctrlKey||e.metaKey||!['Enter',' '].includes(e.key))return;e.preventDefault();e.stopPropagation();word.click();});
    const box=q('.se-box'),scroll=document.createElement('div');scroll.className='vd-dialogue-scroll';scroll.tabIndex=0;scroll.setAttribute('aria-label','Story text · Nội dung truyện');scroll.innerHTML='<p class="vd-reader-label"></p>';box.insertBefore(scroll,q('.se-txt'));scroll.append(q('.se-txt'),q('.se-sub'));
    // Keep native tap-to-read; suppress clicks produced by scrolling a long line.
    let press=null,moved=false;
    box.addEventListener('pointerdown',e=>{press=[e.clientX,e.clientY,scroll.scrollTop];moved=false;},{passive:true});
    box.addEventListener('pointermove',e=>{if(press&&(Math.abs(e.clientX-press[0])+Math.abs(e.clientY-press[1])>12||Math.abs(scroll.scrollTop-press[2])>3))moved=true;},{passive:true});
    box.addEventListener('pointercancel',()=>{press=null;moved=true;});
    box.addEventListener('click',e=>{if(moved){e.stopPropagation();moved=false;}press=null;},true);
    // A labelled native button keeps the interpreter's reveal-then-advance
    // behavior. Its click bubbles to core; no second advance handler is added.
    // Native Enter/Space is already excluded from the document shortcut.
    const oldMore=box.querySelector('.se-more'),more=document.createElement('button');
    more.type='button';more.className='se-more';more.innerHTML='<span></span>';
    oldMore?.replaceWith(more);
    const hint=document.createElement('div');hint.className='vd-scroll-hint';hint.hidden=true;
    hint.textContent=E.nat({en:'Scroll to read more ↓',vi:'Cuộn để đọc tiếp ↓'});
    hint.setAttribute('role','note');box.querySelector('.se-tools').before(hint);
    hint.addEventListener('click',e=>e.stopPropagation());
    let readerFrame=0;
    const syncReader=()=>{
      readerFrame=0;
      const done=box.classList.contains('done');
      const label=E.nat(done?{en:'Next',vi:'Tiếp'}:{en:'Show all',vi:'Hiện hết'});
      const fullLabel=E.nat(done?{en:'Next line',vi:'Câu tiếp'}:{en:'Show full line',vi:'Hiện hết câu'});
      if(more.firstChild.textContent!==label)more.firstChild.textContent=label;
      more.setAttribute('aria-label',fullLabel);more.title=fullLabel;
      // Measure without the hint's own height, so its appearance cannot create
      // an overflow that would keep it visible unnecessarily.
      hint.hidden=true;
      const remaining=scroll.scrollHeight-scroll.clientHeight-scroll.scrollTop;
      hint.hidden=box.hidden||!done||remaining<=2;
    };
    const scheduleReader=()=>{if(!readerFrame)readerFrame=requestAnimationFrame(syncReader);};
    const readerMutations=new MutationObserver(scheduleReader);
    readerMutations.observe(box,{attributes:true,attributeFilter:['class','hidden']});
    readerMutations.observe(scroll,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:['hidden']});
    const readerSize=new ResizeObserver(scheduleReader);
    [scroll,q('.se-txt'),q('.se-sub')].forEach(el=>readerSize.observe(el));
    scroll.addEventListener('scroll',scheduleReader,{passive:true});
    addEventListener('resize',scheduleReader);scheduleReader();

    // The native Hint owns which zones are eligible. Fit only its temporary
    // captions; image coordinates and touch targets remain unchanged.
    const fitHintLabels=()=>{
      if(!matchMedia('(hover:none)').matches)return;
      const labels=[...root.querySelectorAll('.vbx:is(.hint1,.hint2) .pz:not(.seen):not([aria-hidden="true"]) .pz-l')].filter(el=>el.getClientRects().length);
      if(!labels.length)return;
      const rr=root.getBoundingClientRect(),top=q('.se-top').getBoundingClientRect().bottom+8;
      const hud=q('.se-panel.pl')?.getBoundingClientRect(),bottom=hud?hud.top-8:rr.bottom-8;
      const obstacles=[...root.querySelectorAll('.se-plnav button')].filter(el=>el.getClientRects().length).map(el=>el.getBoundingClientRect());
      for(const label of labels){
        label.style.removeProperty('--vd-hint-x');label.style.removeProperty('--vd-hint-y');
        const r=label.getBoundingClientRect(),scale=r.width/(label.offsetWidth||r.width)||1;
        const x=Math.max(rr.left+8,Math.min(r.left,rr.right-8-r.width));
        const clamp=y=>Math.max(top,Math.min(y,bottom-r.height));
        const candidates=[r.top,label.parentElement.getBoundingClientRect().bottom+8,...obstacles.flatMap(o=>[o.top-r.height-8,o.bottom+8])].map(clamp).sort((a,b)=>Math.abs(a-r.top)-Math.abs(b-r.top));
        const free=y=>!obstacles.some(o=>x<o.right+6&&x+r.width>o.left-6&&y<o.bottom+6&&y+r.height>o.top-6);
        const y=candidates.find(free)??clamp(r.top);
        label.style.setProperty('--vd-hint-x',((x-r.left)/scale)+'px');
        label.style.setProperty('--vd-hint-y',((y-r.top)/scale)+'px');
        obstacles.push({left:x,right:x+r.width,top:y,bottom:y+r.height});
      }
    };
    root.addEventListener('click',e=>{if(e.target.closest('[data-hint]'))requestAnimationFrame(fitHintLabels);});
    let hintResize=0;addEventListener('resize',()=>{clearTimeout(hintResize);hintResize=setTimeout(fitHintLabels,80);});

    const names={menu:'Menu · Cài đặt',trall:'EN / VI · Bật tắt bản dịch',log:'History · Lịch sử thoại',book:'Casebook · Sổ vụ án',flow:'Routes · Sơ đồ nhánh'};q('.se-top').querySelectorAll('[data-a]').forEach(b=>{if(names[b.dataset.a]){b.setAttribute('aria-label',names[b.dataset.a]);b.title=names[b.dataset.a];}});
    V.nativeFlow=E.ui.flowSheet;V.nativeMenu=E.ui.menu;V.nativeBook=E.ui.book;const title=E.ui.title;E.ui.title=()=>{title();V.decorateTitle();};E.ui.menu=()=>V.settings();E.ui.book=(...args)=>V.book(...args);E.ui.flowSheet=(...args)=>V.routebook(...args);window.addEventListener('beforeunload',V.unload);
    document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')V.unload();});
    try{localStorage.setItem(V.key()+'.probe','1');localStorage.removeItem(V.key()+'.probe');}catch{V.storage=false;}
  });
  E.on('step',(type)=>{initPreferences();const f=E.R().stack.at(-1);V.active=f?{type,n:f.n,p:JSON.stringify(f.p),i:f.i-1}:null;V.line=null;queueMicrotask(V.update);});
  E.on('line',line=>{V.line=line;queueMicrotask(()=>{V.update();const scroll=q('.vd-dialogue-scroll');if(scroll)scroll.scrollTop=0;q('.se-txt')?.querySelectorAll('.w[data-w]').forEach(word=>{word.tabIndex=0;word.setAttribute('role','button');word.setAttribute('aria-label','Look up '+word.dataset.w+' · Tra nghĩa');});});});E.on('end',()=>{V.active=null;});
})();
