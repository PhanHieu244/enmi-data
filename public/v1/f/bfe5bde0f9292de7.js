/* The Statement / direction-d2. Game-local, additive action presentation.
 * Does not splice nodes, write run/global state, grant rewards, or add saves.
 * Include after statement-runtime.js and statement-actions-data.js.
 * API evidence: supplied statement-runtime.js uses E.mech/E.def/c.live().
 * Uses the supplied 1.0.4 context lifecycle: resumeHere/onExit/live.
 * Art and director feeling remain review candidates.
 */
(() => {
  'use strict';
  const E = globalThis.StoryEngine, catalog = globalThis.StatementActionData;
  if (!E || !catalog || globalThis.StatementActions) return;
  const bindings = new WeakMap(), seenNodes = new WeakMap(), presented = new WeakSet(), warnings = [];
  let readingOwner = null;
  const tr = value => E.nat ? E.nat(value) : (value?.en || String(value || ''));
  let active = null, epoch = 0, disabled = false;
  const stats = { opened: 0, revealed: 0, completed: 0, skipped: 0, cancelled: 0, missingAssets: 0 };
  const warn = (code, id) => {
    if (!warnings.some(x => x.code === code && x.id === id)) warnings.push({ code, id });
  };
  function emit(type, id) {
    globalThis.dispatchEvent?.(new CustomEvent('statement-action', { detail: { type, id } }));
  }
  function bindNode(node) {
    if(E.S?.()?.id!==catalog.game)return;
    const value = E.S?.()?.nodes?.[node];
    if (!value || seenNodes.has(value)) return;
    seenNodes.set(value, true);
    const targets = catalog.entries.filter(x => x.node === node), hits = new Map();
    const visited = new WeakSet();
    function walk(v) {
      if (!v || typeof v !== 'object' || visited.has(v)) return;
      visited.add(v);
      for (const cfg of targets) if (v.n?.en === cfg.matchEn) {
        const a = hits.get(cfg.id) || []; a.push(v); hits.set(cfg.id, a);
      }
      for (const child of Object.values(v)) walk(child);
    }
    walk(value);
    for (const cfg of targets) {
      const found = hits.get(cfg.id) || [];
      if (found.length === 1) bindings.set(found[0], cfg);
      else warn(found.length ? 'ambiguous-anchor' : 'missing-anchor', cfg.id);
    }
  }
  function bindAll() { for (const node of new Set(catalog.entries.map(x => x.node))) bindNode(node); }
  function abort(reason) {
    epoch++;
    active?.settle(false, reason || 'cancelled');
  }
  const API = globalThis.StatementActions = {
    version: catalog.version,
    get disabled() { return disabled; },
    set disabled(value) {
      disabled = !!value;
      // Turning the presentation feature off is a visual skip, not an owner
      // cancellation. The approved narration must still run if its owner lives.
      if (disabled && active) { stats.skipped++;active.settle(true,'disabled'); }
    },
    // Public presentation teardown is pass-through. Native stop/load/reset
    // use the private owner cancellation below; external callers cannot skip n.
    abort: reason => active?.settle(true,reason || 'visual-abort'), bind: bindAll,
    audit: () => ({ version: catalog.version, warnings: warnings.slice(), stats: { ...stats },
      active: active?.cfg.id || null, phase: active?.panel.dataset.phase || null, scope: 'game-local adapter; supplied runtime 1.0.4' })
  };

  // A gesture belongs to the surface on which it began. Keep a small capture
  // guard after DOM teardown until its pointer/key releases have been consumed.
  // This protects the next narration from a release that began during exit.
  // It is a game-local guard, not a replacement for an engine-owned input lease.
  function guardOwnedInput(panel) {
    const pointers=new Set(),keys=new Set(),clicks=new Map();
    let retired=false,disposed=false,clickTimer=null;
    const inPanel=event=>event.composedPath?.().includes(panel) || panel.contains(event.target);
    const stop=event=>{event.preventDefault();event.stopImmediatePropagation();};
    const code=event=>event.code || event.key;
    function maybeDispose(){
      if(!retired||pointers.size||keys.size||clicks.size||disposed)return;
      disposed=true;clearTimeout(clickTimer);
      for(const [type,fn] of listeners)window.removeEventListener(type,fn,true);
    }
    function expireClicks(){
      clearTimeout(clickTimer);
      clickTimer=setTimeout(()=>{clicks.clear();maybeDispose();},1500);
    }
    function down(event){
      // A fresh down is a new gesture even if the platform reuses pointer IDs.
      clicks.delete(event.pointerId);
      if(!retired&&inPanel(event))pointers.add(event.pointerId);
      else pointers.delete(event.pointerId);
      maybeDispose();
    }
    function up(event){
      if(!pointers.delete(event.pointerId))return;
      clicks.set(event.pointerId,{x:event.clientX,y:event.clientY});expireClicks();
      if(retired||!inPanel(event))stop(event);
      maybeDispose();
    }
    function cancel(event){
      const had=pointers.delete(event.pointerId);clicks.delete(event.pointerId);
      if(had&&retired)stop(event);maybeDispose();
    }
    function click(event){
      let id=clicks.has(event.pointerId)?event.pointerId:null;
      if(id===null&&event.detail>0){
        for(const [candidate,p] of clicks)if(Math.abs(event.clientX-p.x)<3&&Math.abs(event.clientY-p.y)<3){id=candidate;break;}
      }
      if(id===null)return;
      clicks.delete(id);
      if(retired||!inPanel(event))stop(event);
      maybeDispose();
    }
    function keydown(event){
      if(!retired&&!event.metaKey&&!event.ctrlKey&&!event.altKey)keys.add(code(event));
      else if(retired&&keys.has(code(event)))stop(event);
    }
    function keyup(event){
      if(keys.delete(code(event)))stop(event);maybeDispose();
    }
    function blur(event){
      // Capture also sees a focused button's blur during DOM removal. That is
      // not a window focus loss and must not release an in-flight gesture.
      if(event.target!==window)return;
      pointers.clear();keys.clear();clicks.clear();maybeDispose();
    }
    const listeners=[['pointerdown',down],['pointerup',up],['pointercancel',cancel],['click',click],['keydown',keydown],['keyup',keyup],['blur',blur]];
    for(const [type,fn] of listeners)window.addEventListener(type,fn,{capture:true,passive:false});
    return ()=>{retired=true;maybeDispose();};
  }

  function loadAsset(asset, signal) {
    return new Promise(resolve => {
      if (!asset || signal.aborted) return resolve(null);
      const img = new Image(); let done = false;
      const finish = ok => {
        if (done) return; done = true; clearTimeout(timeout);
        signal.removeEventListener('abort', cancel); img.onload = img.onerror = null;
        resolve(ok && !signal.aborted ? asset : null);
      };
      const cancel = () => finish(false);
      const timeout = setTimeout(() => finish(false), 6000);
      signal.addEventListener('abort', cancel, { once: true });
      img.onload = () => finish(img.naturalWidth > 0 && img.naturalHeight > 0);
      img.onerror = () => finish(false);
      img.src = asset.file;
    });
  }
  function paintAsset(host, asset, cfg) {
    host.replaceChildren();
    const frame=document.createElement('div');frame.className='statement-action-image-frame';host.append(frame);
    const dims=asset.rect?asset.rect.slice(2):asset.size||[1024,1536];
    const fit=()=>{
      const width=Math.min(host.clientWidth,host.clientHeight*dims[0]/dims[1]);
      frame.style.width=Math.max(0,width)+'px';frame.style.height=Math.max(0,width*dims[1]/dims[0])+'px';
    };
    fit();
    if(typeof ResizeObserver==='function'){
      const observer=new ResizeObserver(fit);observer.observe(host);
      active?.controller?.signal.addEventListener('abort',()=>observer.disconnect(),{once:true});
    }
    if (asset.rect && asset.sourceSize) {
      const [x,y,w,h] = asset.rect, [W,H] = asset.sourceSize;
      const image = document.createElement('div');
      image.className = 'statement-action-crop'; image.setAttribute('role','img');
      image.setAttribute('aria-label',tr(cfg.verb));
      image.style.aspectRatio = `${w} / ${h}`;
      image.style.backgroundImage = `url("${asset.file}")`;
      image.style.backgroundSize = `${100*W/w}% ${100*H/h}%`;
      image.style.backgroundPosition = `${W===w?0:100*x/(W-w)}% ${H===h?0:100*y/(H-h)}%`;
      frame.append(image);
    } else {
      const image = document.createElement('img'); image.src = asset.file;
      image.alt = tr(cfg.verb); image.draggable = false; frame.append(image);
    }
    if(asset.file===cfg.generated?.file || asset.file===cfg.afterAsset?.file)for(const spec of cfg.overlays||[]){
      // Some exact source text belongs to a face that this photograph does
      // not show (Finch's envelope address). Keep its accessible readout, but
      // do not invent printing on the visible reverse or on a different page.
      if(spec.onArt===false)continue;
      const label=document.createElement('span');label.className='statement-action-source-label';
      label.textContent=tr(spec.text);label.style.left=spec.x+'%';label.style.top=spec.y+'%';
      label.style.width=spec.width+'%';label.style.fontSize=(spec.fontCqw||3.4)+'cqw';
      if(spec.color)label.style.color=spec.color;
      if(spec.fontFamily)label.style.fontFamily=spec.fontFamily;
      if(spec.whiteSpace)label.style.whiteSpace=spec.whiteSpace;
      if(spec.mark==='circle')label.dataset.mark='circle';
      label.style.transform=`translate(-50%,-50%) rotate(${spec.rotate||0}deg)`;
      frame.append(label);
    }
    return frame;
  }
  async function gate(c, cfg) {
    if (disabled || !c.live()) return false;
    // Both frames must load before this action can begin. A missing state
    // falls through to the existing narration; never reveal the after frame
    // as a substitute for a closed drawer, folder or floorboard.
    const reveal=cfg.interaction==='reveal';
    if(reveal && (!cfg.beforeAsset || !cfg.afterAsset)) { warn('awaiting-matched-state-pair',cfg.id);return true; }
    if (!reveal && !cfg.generated && !cfg.fallback) { warn('awaiting-art',cfg.id); return true; }
    if (active) active.settle(false,'superseded');
    const myEpoch = epoch, controller = new AbortController(), previousFocus = document.activeElement;
    const root = document.querySelector('.statement') || document.querySelector('.se');
    if (!root) { warn('missing-game-root',cfg.id); return true; }
    const panel = document.createElement('section');
    panel.className = 'statement-action'; panel.setAttribute('role','dialog');
    panel.setAttribute('aria-modal','true'); panel.setAttribute('aria-labelledby','statement-action-title');
    const title = document.createElement('h2'); title.id = 'statement-action-title'; title.textContent = tr(cfg.verb);
    const location = document.createElement('p'); location.className = 'statement-action-location';
    location.textContent = tr(E.S?.()?.scenes?.[E.R?.()?.scene]?.name || {en:'The Statement',vi:'Lời khai'});
    const art = document.createElement('figure'); art.className='statement-action-art';
    const controls = document.createElement('div'); controls.className='statement-action-controls';
    let readout=null;
    if(cfg.overlays?.length){
      readout=document.createElement('p');readout.className='statement-action-source-readout';
      readout.textContent=cfg.overlays.map(x=>tr(x.text)).join(' · ');readout.hidden=reveal;controls.append(readout);
    }
    const instruction=document.createElement('p');instruction.className='statement-action-instruction';
    const instructions={
      photograph:{en:'Frame the object, then press the shutter.',vi:'Giữ vật trong khung rồi bấm chụp.'},
      inspect:{en:'Touch the marked detail to examine it.',vi:'Chạm chi tiết được đánh dấu để xem kỹ.'},
      transfer:{en:'Select the object, then touch its destination. You can also drag it there.',vi:'Chọn vật rồi chạm nơi đặt. Bạn cũng có thể kéo vật tới đó.'},
      playback:{en:'Press PLAY on the recorder.',vi:'Bấm PLAY trên máy ghi âm.'},
      reveal:{en:'Touch the marked part to open it, then inspect what is inside.',vi:'Chạm phần được đánh dấu để mở, rồi xem bên trong.'}
    };
    instruction.textContent=tr(instructions[cfg.interaction]||instructions.inspect);
    const perform = document.createElement('button'); perform.type='button'; perform.className='statement-action-do';
    perform.textContent=tr(cfg.verb); perform.disabled=true;
    const skip = document.createElement('button'); skip.type='button'; skip.className='statement-action-skip';
    skip.textContent=tr({en:'Skip visual',vi:'Bỏ qua diễn cảnh'});
    controls.append(instruction,perform,skip);panel.append(location,title,art,controls);root.append(panel);
    panel.dataset.interaction=cfg.interaction||'inspect';
    panel.dataset.actionId=cfg.id;panel.dataset.phase=reveal?'before':'ready';
    // The native save cursor must point to this authored n while a visual
    // gate waits. Its preceding item/condition steps must never replay.
    c.resumeHere?.(true);
    const retireInput=guardOwnedInput(panel);
    stats.opened++; emit('open',cfg.id);
    let settled=false,closing=false,animation=null,poll=null,selected=false,afterAsset=null,newVisual=false;
    const finished = new Promise(resolve => {
      function clean() {
        clearInterval(poll);controller.abort();animation?.cancel();retireInput();panel.remove();
        window.removeEventListener('keydown',key,true);
        if (active?.panel===panel) active=null;
        if (previousFocus?.isConnected && c.live()) previousFocus.focus?.({preventScroll:true});
      }
      function settle(ok, reason) {
        if(settled)return;settled=true;clean();
        if(!ok){stats.cancelled++;emit('cancel',cfg.id);}
        resolve(ok && epoch===myEpoch && c.live());
      }
      function owned(){return !cfg.transfer?.requiresOwnership || E.R?.()?.items?.includes(cfg.transfer.item);}
      active={cfg,panel,settle,step:c.st,controller};
      c.onExit?.(()=>settle(false,'owner-exit'));
      async function finish(skipped) {
        if(closing||settled)return;closing=true;perform.disabled=skip.disabled=true;
        const live=()=>!settled && epoch===myEpoch && c.live();
        if(!live())return settle(false,'stale');
        const reduced=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
        if(!skipped && reveal && panel.dataset.phase==='before'){
          panel.dataset.phase='changing';
          if(!reduced && art.animate){
            animation=art.animate([{opacity:1},{opacity:.2}],{duration:120,easing:'ease-out'});
            try{await animation.finished;}catch(_){}
            if(!live())return settle(false,'stale');
          }
          paintAsset(art,afterAsset,cfg);
          if(readout)readout.hidden=false;
          panel.dataset.phase='after';stats.revealed++;emit('reveal',cfg.id);
          instruction.textContent=tr({en:'Inspect the revealed detail, then continue.',vi:'Xem chi tiết vừa mở ra, rồi tiếp tục.'});
          perform.textContent=tr({en:'Continue',vi:'Tiếp tục'});
          closing=false;perform.disabled=skip.disabled=false;
          perform.focus({preventScroll:true});return;
        }
        panel.dataset.phase='complete';
        if(!skipped && cfg.interaction==='transfer' && (!selected||!owned())){
          closing=false;perform.disabled=!selected;skip.disabled=false;
          if(!owned()){selected=false;perform.disabled=true;instruction.textContent=tr({en:'This object is no longer available. Skip the visual to return to the story.',vi:'Vật này không còn sẵn. Bỏ qua diễn cảnh để về lại truyện.'});}
          return;
        }
        if(!skipped && !reduced && cfg.interaction==='photograph' && art.animate){
          instruction.textContent=tr({en:'Photograph captured.',vi:'Đã chụp ảnh.'});
          animation=art.animate([{filter:'brightness(1)'},{filter:'brightness(2.5)',offset:.25},{filter:'brightness(1)'}],{duration:190,easing:'ease-out'});
          try{await animation.finished;}catch(_){}
          if(!live())return settle(false,'stale');
        }
        if(!reduced && panel.animate){
          animation=panel.animate([{opacity:1},{opacity:0}],{duration:140,easing:'ease-out',fill:'forwards'});
          try{await animation.finished;}catch(_){/* Cancelled by owner teardown. */}
        }
        if(!live())return settle(false,'stale');
        if(skipped)stats.skipped++;else stats.completed++;
        if(!skipped && newVisual)presented.add(c);
        emit(skipped?'skip':'complete',cfg.id);settle(true,'complete');
      }
      active.onReady=frame=>{
        if(settled)return;
        if(cfg.interaction==='photograph'){
          perform.classList.add('statement-action-shutter');perform.textContent='';
          perform.setAttribute('aria-label',tr(cfg.verb));perform.title=tr(cfg.verb);perform.disabled=false;
          const corners=document.createElement('span');corners.className='statement-action-viewfinder';corners.setAttribute('aria-hidden','true');frame.append(corners);
          perform.focus({preventScroll:true});
        }else if(cfg.interaction==='transfer'){
          const row=document.createElement('div');row.className='statement-action-transfer';
          const prop=document.createElement('button');prop.type='button';prop.className='statement-action-prop';
          const label=document.createElement('span');label.textContent=tr(cfg.transfer.prop);
          if(cfg.transfer.art)loadAsset(cfg.transfer.art,controller.signal).then(asset=>{
            if(!asset||settled)return;
            const thumb=document.createElement('span');thumb.className='statement-action-prop-thumb';prop.prepend(thumb);
            paintAsset(thumb,asset,{verb:cfg.transfer.prop});
          });
          prop.append(label);row.append(prop);controls.insertBefore(row,perform);
          perform.classList.add('statement-action-drop');perform.textContent=tr(cfg.transfer.destination);perform.disabled=true;
          prop.setAttribute('aria-pressed','false');
          function select(){
            if(closing||settled)return;
            if(!owned()){selected=false;warn('stale-owned-item',cfg.id);return;}
            selected=true;prop.setAttribute('aria-pressed','true');perform.disabled=false;
          }
          prop.addEventListener('click',select);
          let start=null;
          prop.addEventListener('pointerdown',event=>{
            if(event.button!==0)return;select();if(!selected)return;
            start={id:event.pointerId,x:event.clientX,y:event.clientY};prop.setPointerCapture?.(event.pointerId);
          });
          prop.addEventListener('pointermove',event=>{
            if(!start||start.id!==event.pointerId)return;
            prop.style.transform=`translate(${event.clientX-start.x}px,${event.clientY-start.y}px)`;
          });
          prop.addEventListener('pointerup',event=>{
            if(!start||start.id!==event.pointerId)return;
            const moved=Math.abs(event.clientX-start.x)+Math.abs(event.clientY-start.y)>10;
            start=null;prop.style.transform='';prop.releasePointerCapture?.(event.pointerId);
            const r=perform.getBoundingClientRect();
            if(moved&&event.clientX>=r.left&&event.clientX<=r.right&&event.clientY>=r.top&&event.clientY<=r.bottom)finish(false);
          });
          prop.addEventListener('pointercancel',()=>{start=null;selected=false;prop.style.transform='';prop.setAttribute('aria-pressed','false');perform.disabled=true;});
          prop.focus({preventScroll:true});
        }else{
          const touch=document.createElement('button');touch.type='button';
          touch.className=cfg.interaction==='playback'?'statement-action-play':'statement-action-detail-target';
          touch.textContent=cfg.interaction==='playback'?'▶':'';
          touch.style.left=(cfg.target?.x??50)+'%';touch.style.top=(cfg.target?.y??50)+'%';
          if(cfg.target?.shape==='frame'){
            touch.classList.add('statement-action-detail-frame');
            touch.style.width=cfg.target.width+'%';touch.style.height=cfg.target.height+'%';
            touch.style.transform=`translate(-50%,-50%) rotate(${cfg.target.rotate||0}deg)`;
          }
          touch.setAttribute('aria-label',tr(cfg.verb));touch.title=tr(cfg.verb);
          touch.addEventListener('click',event=>{if(event.detail<2)finish(false);});frame.append(touch);
          // Initial focus stays on the accessible verb button so its focus
          // indicator does not cover small evidence text in the artwork.
          perform.disabled=false;perform.textContent=tr(cfg.verb);perform.focus({preventScroll:true});
        }
      };
      function key(event) {
        if(settled)return;
        if(event.key==='Escape'){event.preventDefault();event.stopImmediatePropagation();finish(true);return;}
        if(event.key==='Tab'){
          const buttons=[...panel.querySelectorAll('button')].filter(b=>!b.disabled);
          if(!buttons.length){event.preventDefault();return;}
          const i=buttons.indexOf(document.activeElement);
          const next=event.shiftKey?(i<=0?buttons.length-1:i-1):(i<0||i>=buttons.length-1?0:i+1);
          event.preventDefault();event.stopImmediatePropagation();buttons[next].focus();return;
        }
        if(event.key==='Enter'||event.key===' '){
          event.preventDefault();event.stopImmediatePropagation();if(event.repeat)return;
          if(document.activeElement===skip)finish(true);
          else if(document.activeElement?.classList.contains('statement-action-prop'))document.activeElement.click();
          else if(!perform.disabled)finish(false);
        }
      }
      window.addEventListener('keydown',key,true);
      for(const event of ['pointerdown','pointerup','click','touchstart','touchend'])
        panel.addEventListener(event,e=>e.stopPropagation());
      perform.addEventListener('click',event=>{if(event.detail<2)finish(false);});
      skip.addEventListener('click',()=>finish(true));
      // A native owner cancellation must release this promise, but must never
      // call the original narration or a continuation from a newer scene.
      poll=setInterval(()=>{
        if(epoch!==myEpoch||!c.live())settle(false,'owner-ended');
        else if(cfg.enabled===false){stats.skipped++;settle(true,'anchor-disabled');}
      },100);
      skip.focus({preventScroll:true});
    });
    let asset;
    if(reveal){
      [asset,afterAsset]=await Promise.all([loadAsset(cfg.beforeAsset,controller.signal),loadAsset(cfg.afterAsset,controller.signal)]);
      if(!afterAsset)asset=null;
    }else{
      asset=await loadAsset(cfg.generated,controller.signal);
      if(!asset&&!controller.signal.aborted)asset=await loadAsset(cfg.fallback,controller.signal);
    }
    if(!controller.signal.aborted&&active?.panel===panel){
      if(asset){newVisual=reveal || asset.file===cfg.generated?.file;const frame=paintAsset(art,asset,cfg);active.onReady?.(frame);}
      else {stats.missingAssets++;warn('asset-unavailable',cfg.id);active.settle(true,'asset-unavailable');}
    }
    return finished;
  }

  const narration = E.mech?.n;
  if (typeof narration !== 'function' || typeof E.def !== 'function') {
    warn('unsupported-narration-hook','engine'); return;
  }
  E.def('n',async function(c,...rest){
    if(!c.live())return;
    if(E.S?.()?.id!==catalog.game)return narration.call(this,c,...rest);
    bindAll();
    const cfg=bindings.get(c.st);
    if(!cfg||cfg.enabled===false||disabled||E.auto)return narration.call(this,c,...rest); // ?auto: tự chơi không có người chạm → bỏ qua diễn cảnh
    if(await gate(c,cfg)) {
      if(!c.live())return;
      // The real 1.0.4 renderer calls E.ui.pic(st.pic) inside the original n.
      // Keep that native call and saved visual state, but hide its legacy
      // raster only while this exact, successfully completed visual owns the
      // original narration. Skip, missing-art and disabled paths retain it.
      let release=()=>{};
      if(presented.has(c) && c.st.pic){
        const root=document.querySelector('.statement');
        if(root){
          readingOwner?.release();
          const owner={context:c,root,run:E.R?.(),release:null};
          release=()=>{
            if(readingOwner!==owner)return;
            // Retire only this old native insert while it is still hidden.
            // ns=true leaves the engine's saved R.pic untouched. Resetting
            // the native renderer's current name lets a later authored use
            // of the same picture create a fresh, normally visible insert.
            const old=root.querySelector('.se-pic:not(.out)');
            if(E.R?.()===owner.run && old?.querySelector('i')?.classList.contains('im-'+c.st.pic)){
              old.style.visibility='hidden';old.style.pointerEvents='none';
              E.ui.pic?.(null,null,true);
            }
            delete root.dataset.statementActionReadthrough;readingOwner=null;
          };
          owner.release=release;readingOwner=owner;
          root.dataset.statementActionReadthrough=cfg.id;
          c.onExit?.(release);
        }
      }
      try{return await narration.call(this,c,...rest);}finally{release();}
    }
  });
  E.on?.('boot',bindAll);
  E.on?.('end',()=>abort('end'));
  for (const [owner,name] of [[E,'stop'],[E.ui,'reset'],[E.ui,'title']]) {
    if(!owner||typeof owner[name]!=='function')continue;
    const previous=owner[name];
    owner[name]=function(...args){abort(name);return previous.apply(this,args);};
  }
  E.on?.('step',(type,st)=>{
    if(active&&st!==active.step)abort('step-replaced');
  });
})();
