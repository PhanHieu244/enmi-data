// Enmi Story Engine 3 — SÂN KHẤU (nạp sau mech-plus.js). Lời dẫn luôn “nhìn vào” một thứ; vật phẩm hiện ra tận mắt.
// Đặc tả: docs/story-engine/MECHANICS.md mục “Engine 3”. Tóm tắt:
//   VÙNG ẢNH   StoryEngine.regions({ "<ảnh>": { size: [w, h], r: { sign: [x, y, w, h] | { box, shape, fx, label, maxScale } } } })
//              (sinh tự động từ art.json → regions.js bởi art-css.js; truyện cũng ghi tay được ở scenes.<cảnh>.regions)
//              x, y, w, h = % của ẢNH (không phải màn hình) → luôn khớp vật trên ảnh dù màn hình dài / ngắn.
//              maxScale: trần zoom riêng cho look vào vùng này, 1…6; mặc định 3.2, không đổi cảnh rộng.
//   look       { look: "sign" } máy quay trượt + phóng tới vùng của ảnh đang hiện · { look: null } lùi ra · gắn vào bất kỳ bước nào: { n: {…}, look: "posts" }
//   scene      khoá phụ { n: {…}, scene: "yard" } đổi địa điểm thật; giữ diễn viên native, dọn đạo cụ cũ, cập nhật tên/giờ
//   shot       { shot: "act-ring" } khung hình cho lời dẫn (toàn màn, chuyển nhanh, trôi nhẹ) · { shot: null } về cảnh · cũng là khoá phụ
//   prop       đạo cụ chuyển động trên ảnh: { prop: { id: "car", art: "it-car", at: [x, y, w], to: [x, y], ms: 1600, rot, fade, wait } } · { prop: { id: "car", off: true } }
//   motion     metadata của n/think/say hoặc bước riêng: { id, ms, tracks, actors, backdrop } · Skip/Replay chỉ hình · lưu khung cuối
//   item       nhận đồ = vật HIỆN RA giữa màn (từ đúng chỗ nó nằm nếu vừa chạm vùng), lật mặt sau (items.<mã>.sides), đọc (items.<mã>.doc) → bay vào túi
//   read       { read: "note" } (đọc giấy tờ của đồ vật) · { read: { paper, hand, title, lines: [{ en, vi, s }] } } · docs.<mã> dùng chung
//   slow       khoá phụ cho lựa chọn: { choice: […], timer: 6, slow: true } — chậm lại kiểu Detroit (màu nhạt, viền tối, tiếng tim)
//   Nhân vật: thở nhẹ khi đứng · chớp mắt nếu có ảnh im-<mã>[-<mặt>]-blink · đổi biểu cảm mờ chéo.
//   Chưa có ảnh: ?art=wire (hoặc Cài đặt dev) → khung dây hiện tên ảnh + các vùng — soát bố cục trước khi vẽ.
(() => {
  const E = globalThis.StoryEngine, def = E.def, esc = E.esc, h = E.h;
  const nat = t => E.nat(t);
  const investigationText = t => E.ui.investigationText?.(t) ?? esc(nat(t));
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const root = () => $(".se");
  const Q = new URLSearchParams(location.search);
  E.wire = Q.get("art") === "wire";
  const cond = (c, s) => (c == null ? true : typeof c === "function" ? !!c(s) : typeof c === "string" ? s.truth(c) || s.has(c) || !!s.f[c] : typeof c === "object" && !Array.isArray(c) ? Object.entries(c).every(([k, v]) => (+s.f[k] || 0) >= v) : !!c);
  E.cond = cond;
  const T = (en, vi) => nat({ en, vi });

  // Framing is a conversation decision, independent of the current speaker.
  // The renderer may crop its own actor art for `bust`; the state survives
  // narration and saves, and resets only when the physical cast/room changes.
  E.ui.dialogueFrame = (mode='full', lock=false) => {
    mode=mode==='bust'?'bust':'full';const R=E.R();if(R){R.dialogueFrame=mode;R.dialogueFrameLock=!!lock;}
    if(root()?.dataset.framing!==mode){if(root())root().dataset.framing=mode;E.emit('dialogue-frame',mode);}
  };
  E.side('framing',mode=>E.ui.dialogueFrame(mode,mode!=null));
  E.on('step',(type,st)=>{
    if(E.S()?.conversationFraming!=='adaptive'||E.R()?.dialogueFrameLock||type!=='say'||st.say==='me'||st.phone||st.offscreen||E.R()?.cg)return;
    const run=E.R();queueMicrotask(()=>{if(E.R()!==run||run.dialogueFrameLock||run.cg)return;const physical=new Set(Object.keys(run.cast||{}));physical.add(st.say);E.ui.dialogueFrame(physical.size===1?'bust':'full');});
  });

  // Conversation blocking is a presentation layer, not a physical relocation.
  // Keep the same actor and image node across replies, narration and question
  // menus. A room renderer may continue updating its own world coordinates;
  // removing this layer exposes those untouched coordinates on exploration.
  const adaptiveDialogue = () => E.S()?.conversationFraming === 'adaptive';
  let dialogueContext = null, dialogueQueued = false, dialogueRaf = 0, dialogueObserver;
  const dialogueImages = new Map(), dialogueObserved = new Set();
  const dialogueRank = {ll:0,l:1,c:2,r:3,rr:4};
  const dialogueSlots = {1:[50],2:[25,75],3:[16,50,84],4:[13,38,62,87],5:[11,30,50,70,89]};
  const dialogueWidths = {1:3,2:1.8,3:1.55,4:1.38,5:1.25};
  const dialogueNumber = n => Math.round(n * 100) / 100;
  const dialogueStyle = (el, key, value) => { if(el.style.getPropertyValue(key)!==value)el.style.setProperty(key,value); };
  const dialogueData = (el, key, value) => { if(el.dataset[key]!==value)el.dataset[key]=value; };
  function clearDialogueLayout(forget = false) {
    const rt=root();
    if(rt){
      for(const key of ['dialogueLayout','dialoguePhase','dialogueSpeaker'])delete rt.dataset[key];
      for(const key of ['--dialogue-top','--dialogue-height'])rt.style.removeProperty(key);
      for(const actor of rt.querySelectorAll('[data-dialogue-actor]')){
        delete actor.dataset.dialogueActor;delete actor.dataset.dialogueFocus;
        delete actor.dataset.dialogueAction;
        actor.style.removeProperty('--dialogue-left');actor.style.removeProperty('--dialogue-width');
      }
    }
    if(forget)dialogueContext=null;
  }
  const cleanDialogueArt = value => Array.isArray(value) && value.length && value.length < 8 && value.every(x=>typeof x==='string'&&/^im-[\w-]+$/.test(x));
  function dialogueImageSize(art, classes, character) {
    const image=getComputedStyle(art).backgroundImage,url=/url\(["']?(.*?)["']?\)/.exec(image)?.[1];
    if(url&&!dialogueImages.has(url)){
      const entry={size:null};dialogueImages.set(url,entry);
      const im=new Image();
      im.onload=()=>{if(im.naturalWidth&&im.naturalHeight){entry.size=[im.naturalWidth,im.naturalHeight];scheduleDialogueLayout();}};
      im.onerror=()=>{};im.src=url;
      if(im.complete&&im.naturalWidth&&im.naturalHeight)entry.size=[im.naturalWidth,im.naturalHeight];
    }
    return dialogueImages.get(url)?.size || character.bodySize || classes.map(x=>naturalSizes.get(x.slice(3))||REG[x.slice(3)]?.size).find(Boolean) || [1024,1536];
  }
  function dialogueBody(character, classes, size) {
    const source=character.bodyBounds,box=Array.isArray(source)?source:classes.slice().reverse().map(x=>source?.[x.slice(3)]).find(Array.isArray)||source?.default;
    const [w,h]=size;
    return Array.isArray(box)&&box.length===4&&box.every(Number.isFinite)&&box[0]>=0&&box[1]>=0&&box[2]>box[0]&&box[3]>box[1]&&box[2]<=w&&box[3]<=h ? [...box] : [0,0,w,h];
  }
  function dialoguePose(actor, hold) {
    const R=E.R(),saved=R.cast[actor.dataset.id],cached=saved.dialogueArt;
    const valid=cached&&cached.scene===R.scene&&cached.face===(saved.face||'')&&cleanDialogueArt(cached.classes);
    const id=actor.dataset.id,character=E.S().chars[id]||{};
    const bodyArt=character.conversationArt||character.bodyArt||(character.bodyBounds?id+'-full':null);
    const neutralBody=classes=>!saved.face&&classes?.length===1&&classes[0]==='im-'+id&&typeof bodyArt==='string'&&/^[\w-]+$/.test(bodyArt)&&E.hasArt('im-'+bodyArt)?['im-'+bodyArt]:classes;
    // Menus and their spoken player echo have no new actor pose. Older
    // direction plugins may release their classes here; keep the last real
    // bitmap, including after reload. Only class names enter the saved cast.
    if(hold&&valid){cached.classes=neutralBody(cached.classes);return cached;}
    // A new expression's first animation frame can be opacity zero while
    // the base is already hidden. It is still the selected artwork; waiting
    // for a later line would leave one actor at the legacy physical scale.
    const candidates=[...actor.querySelectorAll('.se-chi > .ii:not(.fo):not(.bk)')].map(art=>({art,css:getComputedStyle(art)})).filter(x=>x.css.display!=='none'&&x.css.visibility!=='hidden'&&x.css.backgroundImage!=='none');
    candidates.sort((a,b)=>Number(b.css.opacity)-Number(a.css.opacity)||Number(b.art.classList.contains('f'))-Number(a.art.classList.contains('f')));
    let classes=candidates[0]?[...candidates[0].art.classList].filter(x=>/^im-[\w-]+$/.test(x)):null;
    // Some projects use the bare character ID for a portrait and <id>-full
    // for the measured body. The first menu must start with that same body,
    // before a direction plugin has received its first spoken line. Explicit
    // expressions and authored action poses remain authoritative.
    classes=neutralBody(classes);
    if(!cleanDialogueArt(classes))return valid?cached:null;
    if(valid&&classes.join(' ')===cached.classes.join(' '))return cached;
    return saved.dialogueArt={classes,face:saved.face||'',scene:R.scene};
  }
  function renderDialogueLayout() {
    const rt=root(),R=E.R(),context=dialogueContext,st=$('.se-stage');
    if(!rt||!st||!adaptiveDialogue()||!context||context.run!==R||!context.active||R.cg||R.shot||R.actionFrame||(R.dialogueFrameLock&&R.dialogueFrame!=='bust'))return clearDialogueLayout();
    if(detailOverlay?.run===R&&detailOverlay.framing==='scene'&&detailOverlay.el.isConnected&&!detailOverlay.el.hidden)return clearDialogueLayout();
    if(/^(pl|xp|map|deduce|caseboard|present|full|gallery|sched)$/.test(rt.dataset.m||''))return clearDialogueLayout();
    const actors=[...rt.querySelectorAll('.se-chars > .se-ch')].filter(el=>R.cast?.[el.dataset.id]&&!el.classList.contains('out')&&getComputedStyle(el).visibility!=='hidden');
    if(!actors.length)return clearDialogueLayout();
    actors.sort((a,b)=>(dialogueRank[R.cast[a.dataset.id].at]??2)-(dialogueRank[R.cast[b.dataset.id].at]??2));
    const speaker=actors.some(el=>el.dataset.id===context.who)?context.who:'';
    dialogueData(rt,'dialogueLayout',actors.length===1?'single':'group');
    dialogueData(rt,'dialoguePhase',context.phase);dialogueData(rt,'dialogueSpeaker',speaker);
    const W=st.clientWidth,H=st.clientHeight;
    const bars=[...new Set([$('.se-top'),...$$(hudSelector)])].filter(shown);
    // Reserve the same control lane even when a topic menu hides View scene.
    // The crop depends on the viewport/cast, never on the length of a reply.
    const safeTop=Math.min(H*.42,Math.max(68,...bars.map(el=>layoutRect(el,st).bottom))+56);
    const count=actors.length,shortLandscape=matchMedia('(min-width:600px) and (max-height:500px)').matches;
    const cropHeight=count===1?1.75:shortLandscape?1.8:1.2;
    const bodyHeight=Math.max(200,Math.min((H-safeTop)*cropHeight,W*(dialogueWidths[Math.min(count,5)]||1.25)));
    const top=Math.max(safeTop,H*.94-bodyHeight),height=Math.max(120,H-top);
    dialogueStyle(rt,'--dialogue-top',dialogueNumber(top)+'px');dialogueStyle(rt,'--dialogue-height',dialogueNumber(height)+'px');
    const slots=dialogueSlots[count]||actors.map((_,i)=>10+80*i/Math.max(1,count-1));
    const hold=context.freezePose||context.phase==='menu'||/^(choice|talk)$/.test(context.type);
    const actionSubjects=new Set((context.action?.actors||[]).filter(a=>!a.hide&&a.frames?.some(f=>E.S().chars[a.id]?.actionFocusBounds?.[a.id+'-'+f.face])).map(a=>a.id));
    const readers=[$('.se-box'),$('.se-ui > .se-panel')].filter(shown).map(el=>layoutRect(el,st)).filter(b=>b.right>0&&b.left<W&&b.top>top);
    const actionBottom=Math.min(H-12,...readers.map(b=>b.top-16));
    for(const [i,actor]of actors.entries()){
      const pose=dialoguePose(actor,hold);if(!pose)continue;
      let art=actor.querySelector('.se-chi > .se-dialogue-art');
      if(!art){art=document.createElement('div');art.className='se-dialogue-art';art.setAttribute('aria-hidden','true');actor.querySelector('.se-chi').append(art);}
      const cls='se-dialogue-art '+pose.classes.join(' ');if(art.className!==cls)art.className=cls;
      const ch=E.S().chars[actor.dataset.id]||{},size=dialogueImageSize(art,pose.classes,ch),bounds=dialogueBody(ch,pose.classes,size),[left,crown,right,foot]=bounds;
      const focusSource=ch.actionFocusBounds;
      const actionPoses=context.action?.actors?.find(a=>a.id===actor.dataset.id)?.frames||[];
      const actionBoxes=actionPoses.map(f=>focusSource?.[actor.dataset.id+'-'+f.face]).filter(b=>Array.isArray(b)&&b.length===4&&b.every(Number.isFinite));
      const focus=actionBoxes.length?[Math.min(...actionBoxes.map(b=>b[0])),Math.min(...actionBoxes.map(b=>b[1])),Math.max(...actionBoxes.map(b=>b[2])),Math.max(...actionBoxes.map(b=>b[3]))]:null;
      const focusValid=focus?.length===4&&focus.every(Number.isFinite)&&focus[0]>=0&&focus[1]>=0&&focus[2]>focus[0]&&focus[3]>focus[1]&&focus[2]<=size[0]&&focus[3]<=size[1];
      let scale=bodyHeight/(foot-crown),slot=slots[i];
      if(focusValid){
        // Authored action bounds cover the head, hands and held prop, never
        // the whole lower skirt. Fit this meaningful region above the actual
        // reader without changing ordinary conversational crops. Paired poses
        // use one union box so writing→showing a page keeps the same framing.
        scale=Math.min(scale,Math.max(80,actionBottom-top)/(focus[3]-crown),Math.max(80,W-32)/(focus[2]-focus[0]));
        const center=(left+right)/2,minCenter=16-(focus[0]-center)*scale,maxCenter=W-16-(focus[2]-center)*scale;
        slot=Math.max(minCenter,Math.min(maxCenter,W*slot/100))/W*100;
        dialogueData(actor,'dialogueAction','true');
      }else delete actor.dataset.dialogueAction;
      const width=Math.max(80,(right-left)*scale+24);
      dialogueData(actor,'dialogueActor','true');
      dialogueData(actor,'dialogueFocus',actionSubjects.size?(actionSubjects.has(actor.dataset.id)?'action':'listener'):speaker?(actor.dataset.id===speaker?'speaker':'listener'):'neutral');
      dialogueStyle(actor,'--dialogue-left',dialogueNumber(slot)+'%');dialogueStyle(actor,'--dialogue-width',dialogueNumber(width)+'px');
      dialogueStyle(art,'--dialogue-art-size',`${dialogueNumber(size[0]*scale)}px ${dialogueNumber(size[1]*scale)}px`);
      dialogueStyle(art,'--dialogue-art-position',`${dialogueNumber(width/2-(left+right)/2*scale)}px ${dialogueNumber(-crown*scale)}px`);
    }
    for(const actor of rt.querySelectorAll('[data-dialogue-actor]'))if(!actors.includes(actor)){delete actor.dataset.dialogueActor;delete actor.dataset.dialogueFocus;}
  }
  function scheduleDialogueLayout() {
    // ResizeObserver chỉ lên lịch: đổi kích thước trong microtask của chính
    // lượt delivery gây vòng ResizeObserver ở khung hội thoại/ending.
    if(dialogueRaf)return;
    dialogueRaf=requestAnimationFrame(()=>{dialogueRaf=0;renderDialogueLayout();layoutDetailOverlay();});
  }
  function dialogueStep(type,st) {
    if(!adaptiveDialogue())return clearDialogueLayout(true);
    if(/^(bg|place|explore|map|title|end)$/.test(type))return clearDialogueLayout(true);
    const active=/^(n|say|think|choice|talk|pic)$/.test(type),previous=dialogueContext;
    if(active)dialogueContext={run:E.R(),active:true,type,phase:/^(choice|talk)$/.test(type)?'menu':'line',who:type==='say'&&!st.phone&&!st.offscreen&&st.say!=='me'?st.say:'',action:st.motion||null};
    else if(previous?.run===E.R())previous.freezePose=true;
    scheduleDialogueLayout();
  }
  E.on('step',dialogueStep);
  const dialogueLine=E.ui.line;
  E.ui.line=value=>{
    if(adaptiveDialogue()){
      const previous=dialogueContext?.run===E.R()?dialogueContext:null,type=previous?.type||'line';
      dialogueContext={run:E.R(),active:true,type,phase:'line',who:(value.kind||'say')==='say'&&value.who!=='me'&&!String(value.cls||'').split(/\s+/).includes('phone')?value.who||'':'',action:previous?.action||null};
    }
    const result=dialogueLine(value);scheduleDialogueLayout();return result;
  };
  const dialoguePanel=E.ui.panel;
  E.ui.panel=(html,cls='')=>{
    const result=dialoguePanel(html,cls),type=cls.split(' ')[0];
    if(adaptiveDialogue()&&/^(tk|chs)$/.test(type))dialogueContext={run:E.R(),active:true,type:type==='tk'?'talk':'choice',phase:'menu',who:''};
    scheduleDialogueLayout();return result;
  };
  E.ui.dialogueLayoutState=()=>{
    const rt=root();if(!rt?.dataset.dialogueLayout)return null;
    return{mode:rt.dataset.dialogueLayout,phase:rt.dataset.dialoguePhase,speaker:rt.dataset.dialogueSpeaker,top:parseFloat(rt.style.getPropertyValue('--dialogue-top')),height:parseFloat(rt.style.getPropertyValue('--dialogue-height')),actors:[...rt.querySelectorAll('[data-dialogue-actor]')].map(el=>({id:el.dataset.id,focus:el.dataset.dialogueFocus,left:parseFloat(el.style.getPropertyValue('--dialogue-left')),width:parseFloat(el.style.getPropertyValue('--dialogue-width')),pose:E.R()?.cast?.[el.dataset.id]?.dialogueArt?.classes||[]}))};
  };
  E.on('end',()=>clearDialogueLayout(true));
  E.on('boot',()=>{
    clearDialogueLayout(true);dialogueObserver?.disconnect();dialogueObserved.clear();
    if(globalThis.ResizeObserver)dialogueObserver=new ResizeObserver(scheduleDialogueLayout);
    queueMicrotask(()=>{for(const el of [root(),$('.se-stage'),$('.se-top'),$('.se-box'),$('.se-ui'),...$$(hudSelector)].filter(Boolean))if(!dialogueObserved.has(el)){dialogueObserved.add(el);dialogueObserver?.observe(el);}scheduleDialogueLayout();});
  });
  addEventListener('resize',scheduleDialogueLayout,{passive:true});

  // ═════════ VÙNG ẢNH ═════════
  const REG = {};
  E.regions = o => { for (const k in o) { const a = REG[k] || {}; REG[k] = { ...a, ...o[k], r: { ...(a.r || {}), ...(o[k].r || {}) } }; } };
  E.regionsAll = REG;
  const normR = a => (!a ? null : Array.isArray(a) ? { box: a } : a.box ? a : null);
  // vùng của 1 ảnh: regions.js → scenes.<ảnh>.regions → views của địa điểm (khai báo tại chỗ)
  E.regionOf = (img, name) => {
    if (Array.isArray(name)) return { box: name };
    if (name && typeof name === "object") return normR(name);
    return normR(REG[img]?.r?.[name] ?? E.S()?.scenes?.[img]?.regions?.[name] ?? LOCAL[img]?.[name]);
  };
  const LOCAL = {}; // vùng khai báo trong view của place (regions: {…}) → đăng ký khi vẽ view
  E.regionsOf = img => ({ ...(E.S()?.scenes?.[img]?.regions || {}), ...(LOCAL[img] || {}), ...(REG[img]?.r || {}) });
  const naturalSizes = new Map(), imageLoads = new Map();
  let visualTransition = null, resetCamera = null;
  E.imgSize = img => naturalSizes.get(img) || REG[img]?.size || E.S()?.scenes?.[img]?.size || [576, 1024];
  E.curImg = () => (E.ui.bgKey?.() || "").slice(2);
  // One physical image plane is shared by the bitmap, effects, actors and hit regions.
  // Percentages always refer to that plane, including cover crops and resized stages.
  const actionFor = img => root()?.classList.contains("action-framed") && E.R()?.actionFrame && img === E.curImg() ? E.R().actionFrame : null;
  E.fit = (img = E.curImg()) => actionFor(img) ? "contain" : REG[img]?.fit || E.S()?.scenes?.[img]?.fit || E.S()?.fit || "contain";
  E.coverBox = img => {
    const st = $(".se-stage"); if (!st) return { x: 0, y: 0, w: 1, h: 1 };
    if (actionFor(img)) return actionPlane(img, st);
    const W = st.clientWidth, H = st.clientHeight, [iw, ih] = E.imgSize(img), sc = (E.fit(img) === "cover" ? Math.max : Math.min)(W / iw, H / ih);
    const f = E._frame && E._frame.img === img ? E._frame : { dx: 0, dy: 0 };
    return { x: (W - iw * sc) / 2 + f.dx, y: (H - ih * sc) / 2 + f.dy, w: iw * sc, h: ih * sc };
  };
  E.syncImagePlanes = layer => {
    const layers = layer ? [layer] : $$(".se-bgl[data-image]");
    for (const L of layers) {
      // Hold the outgoing image's own framing while the new view is prepared.
      if (visualTransition?.outgoing === L) continue;
      const img = L.dataset.image; if (!img) continue;
      // Interactive image planes must never inherit decorative Ken Burns
      // animation. Newly mounted hit regions otherwise restart at scale 1.04
      // while the bitmap is already farther through its separate animation.
      if(L.querySelector(':scope > .zones'))L.dataset.interactive='true';
      const b = E.coverBox(img), fit = E.fit(img), [iw, ih] = E.imgSize(img);
      if(b.action){
        L.dataset.actionFrame="true";
        const a=b.action.area,left=Math.max(0,a.left-b.x),right=Math.min(b.w,a.right-b.x),top=Math.max(0,a.top-b.y),bottom=Math.min(b.h,a.bottom-b.y);
        for(const[k,v]of Object.entries({l:left,r:right,t:top,b:bottom,fx:Math.min(8,Math.max(1,(right-left)/12)),fy:Math.min(8,Math.max(1,(bottom-top)/12))}))L.style.setProperty("--af-"+k,v+"px");
      }else delete L.dataset.actionFrame;
      L.style.setProperty("--ar", String(iw / ih)); L.dataset.fit = fit;
      L.style.setProperty("--image-x", b.x + "px"); L.style.setProperty("--image-y", b.y + "px");
      L.style.setProperty("--image-w", b.w + "px"); L.style.setProperty("--image-h", b.h + "px");
      for (const el of L.querySelectorAll(":scope > .ii, .vbx")) {
        Object.assign(el.style, { left: b.x + "px", top: b.y + "px", right: "auto", bottom: "auto", width: b.w + "px", height: b.h + "px", margin: "0", transform: "none" });
        if (el.classList.contains("ii")) { el.style.backgroundSize = "100% 100%"; el.style.backgroundPosition = "center"; }
      }
      const ii = L.querySelector(":scope > .ii[class*='im-']"), bd = L.querySelector(":scope > .bd");
      if (fit === "cover") bd?.remove();
      else if (ii && !bd) L.insertAdjacentHTML("afterbegin", `<div class="bd ${ii.className.replace(/\bii\b/, "").trim()}"></div>`);
      for (const sprite of L.querySelectorAll(".pp.full .pp-i > .ii")) E.fitSprite?.(sprite);
    }
  };
  E._layerHook = (L, key) => {
    const img = key.slice(2); L.dataset.image = img;
    E.syncImagePlanes(L);
    const ii = L.querySelector(":scope > .ii"), bg = ii && getComputedStyle(ii).backgroundImage;
    const url = bg && /url\(["']?(.*?)["']?\)/.exec(bg)?.[1];
    if (!url || naturalSizes.has(img)) return;
    if (!imageLoads.has(url)) imageLoads.set(url, new Promise(resolve => {
      const im = new Image(); im.onload = () => resolve([im.naturalWidth, im.naturalHeight]); im.onerror = () => resolve(null); im.src = url;
    }));
    imageLoads.get(url).then(size => {
      if (!size?.[0] || !size[1]) return;
      naturalSizes.set(img, size);
      if (L.dataset.image === img) { E.syncImagePlanes(L); E.emit("image-plane", img); }
    });
  };
  let planeObserver;
  E.on("boot", () => {
    planeObserver?.disconnect(); const st = $(".se-stage");
    if (st && globalThis.ResizeObserver) { planeObserver = new ResizeObserver(() => {
      // An authored layout switch (side reader → full action) is part of the
      // current dissolve. Its outgoing image is already frozen in pixels.
      // An actual viewport/orientation change ends that hold and refits both.
      if (visualTransition && (visualTransition.viewport[0] !== innerWidth || visualTransition.viewport[1] !== innerHeight)) finishVisualTransition();
      E.syncImagePlanes(); refreshFocus();
    }); planeObserver.observe(st); }
    E.syncImagePlanes();
  });
  // LẤY KHUNG CHO MỌI MÀN HÌNH: ảnh phủ kín màn (cover) thì màn dài (điện thoại 19,5:9) cắt 2 bên, màn rộng (máy tính, máy tính bảng ngang) cắt trên dưới.
  //   frame(ảnh, [box…]) dời ảnh (trong giới hạn vẫn phủ kín) để MỌI vùng quan trọng nằm trong phần thấy được — trừ thanh trên (top) và
  //   thanh dưới (bottom, px). Ảnh + vùng chạm + đồ ghép + hiệu ứng dời CÙNG nhau (biến --fx / --fy trên lớp nền) → luôn trùng.
  E.ui.frame = (img, boxes, o = {}) => {
    const st = $(".se-stage"); if (!st) return;
    const layers = $$(".se-bgl[data-image]").filter(L => L.dataset.image === img);
    const W = st.clientWidth, H = st.clientHeight, [iw, ih] = E.imgSize(img), sc = (E.fit(img) === "cover" ? Math.max : Math.min)(W / iw, H / ih), cw = iw * sc, chh = ih * sc;
    const applyFrame = (dx, dy) => { E._frame = { img, dx, dy }; for (const L of layers) { L.style.setProperty("--fx", dx + "px"); L.style.setProperty("--fy", dy + "px"); E.syncImagePlanes(L); } scheduleFocus(); };
    if (E.fit(img) !== "cover") return applyFrame(0, 0);
    const c = { x: (W - cw) / 2, y: (H - chh) / 2 };
    const bs = (boxes || []).filter(Boolean); if (!bs.length) return applyFrame(0, 0);
    const m = 2;
    const x0 = Math.min(...bs.map(b => b[0])) - m, x1 = Math.max(...bs.map(b => b[0] + b[2])) + m, y0 = Math.min(...bs.map(b => b[1])) - m, y1 = Math.max(...bs.map(b => b[1] + b[3])) + m;
    const top = o.top ?? 64, bot = o.bottom ?? 120;
    const fit = (lo, hi, a0, a1, size, base, max) => {
      // khoảng ảnh (px) cần thấy [a0, a1] · cửa sổ thấy được [lo, hi] · base = vị trí mép ảnh khi căn giữa · max = độ dời tối đa mỗi phía
      const p0 = base + a0 / 100 * size, p1 = base + a1 / 100 * size;
      let d = 0;
      if (p1 - p0 > hi - lo) d = (lo + hi) / 2 - (p0 + p1) / 2; else if (p0 < lo) d = lo - p0; else if (p1 > hi) d = hi - p1;
      return Math.max(-max, Math.min(max, d));
    };
    const dx = fit(0, W, x0, x1, cw, c.x, Math.abs(c.x)), dy = fit(top, H - bot, y0, y1, chh, c.y, Math.abs(c.y));
    applyFrame(dx, dy);
  };
  E.rectPx = (img, box) => { const c = E.coverBox(img); return { x: c.x + box[0] / 100 * c.w, y: c.y + box[1] / 100 * c.h, w: box[2] / 100 * c.w, h: box[3] / 100 * c.h }; };
  // HTML khung ảnh có cùng hình học với nền (lớp con đặt theo % của ẢNH): ar = rộng / cao
  // có ẢNH THẬT (luật trong art.css) — khác hasArt (truyện chưa có ảnh nào thì hasArt coi như có)
  let REAL = null;
  E.artReal = cls => { if (!REAL) { REAL = new Set(); try { for (const ss of document.styleSheets) for (const r of ss.cssRules || []) for (const m of (r.selectorText || "").matchAll(/\.(im-[\w-]+)/g)) REAL.add(m[1]); } catch {} } return REAL.has(cls); };
  // A full-body actor's authored region describes the visible person, not the
  // transparent PNG canvas. Read alpha bounds once; only CSS layout is changed.
  // Cross-origin/opaque art falls back to its natural canvas, still unstretched.
  const spriteInfo = new Map();
  E.fitSprite = el => {
    const url = /url\(["']?(.*?)["']?\)/.exec(getComputedStyle(el).backgroundImage)?.[1]; if (!url) return;
    const fit = info => {
      if (!el.isConnected || !info) return;
      const W = el.clientWidth, H = el.clientHeight, [x, y, w, h] = info.bounds;
      if (!W || !H || !w || !h) return;
      const scale = Math.min(W / w, H / h);
      el.style.backgroundSize = `${info.width * scale}px ${info.height * scale}px`;
      el.style.backgroundPosition = `${(W - w * scale) / 2 - x * scale}px ${H - (y + h) * scale}px`;
      const label = el.closest(".pp")?.querySelector(".pp-n"); if (label) label.style.top = Math.max(0, H - h * scale - 5) + "px";
      el.dataset.spriteFit = "visible-bounds";
    };
    let entry = spriteInfo.get(url);
    if (!entry) {
      entry = { info: null, ready: null }; spriteInfo.set(url, entry);
      entry.ready = new Promise(resolve => {
        const im = new Image(); im.onload = () => {
          const W = im.naturalWidth, H = im.naturalHeight, info = { width: W, height: H, bounds: [0, 0, W, H] };
          try {
            const canvas = document.createElement("canvas"); canvas.width = W; canvas.height = H;
            const ctx = canvas.getContext("2d", { willReadFrequently: true }); ctx.drawImage(im, 0, 0);
            const a = ctx.getImageData(0, 0, W, H).data; let x0 = W, y0 = H, x1 = -1, y1 = -1;
            for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (a[(y * W + x) * 4 + 3] >= 32) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
            if (x1 >= x0 && y1 >= y0) info.bounds = [Math.max(0, x0 - 2), Math.max(0, y0 - 2), Math.min(W, x1 + 3) - Math.max(0, x0 - 2), Math.min(H, y1 + 3) - Math.max(0, y0 - 2)];
          } catch { /* Natural-size containment remains a safe fallback. */ }
          entry.info = info; resolve(info);
        };
        im.onerror = () => resolve(null); im.src = url;
      });
    }
    if (entry.info) fit(entry.info); else entry.ready.then(fit);
  };
  E.vbox = (img, inner = "", cls = "") => { const [w, hh] = E.imgSize(img); return `<div class="vbw ${cls}"><div class="vbx" style="--ar:${(w / hh).toFixed(4)}">${inner}</div></div>`; };
  const pct = b => `left:${b[0]}%;top:${b[1]}%;width:${b[2]}%;height:${b[3]}%`;
  E.pctStyle = pct;
  // Physical scene props live separately from the interaction buttons. They
  // remain visible while an authored detail runs and never inherit a minimum
  // touch-target size. The same image plane positions both art and its glint.
  E.scenePropsHTML = (img, props = []) => E.vbox(img, props.map(p => `<i class="scene-prop ii im-${esc(p.art)}" data-scene-prop="${esc(p.id || p.art)}" aria-hidden="true" style="${pct(p.box)};background-size:contain;background-position:center;background-repeat:no-repeat;pointer-events:none;z-index:${p.z ?? 2}${p.rotate ? `;transform:rotate(${p.rotate}deg)` : ""}"></i>`).join(""), "scene-props");
  E.ui.sceneProps = (img, props) => {
    const R = E.R();
    if (props) R.sceneProps = { img, items: props };
    const items = props || (R.sceneProps?.img === img ? R.sceneProps.items : []);
    const signature = JSON.stringify(items);
    for (const L of $$(".se-bgl[data-image]").filter(l => l.dataset.image === img)) {
      const old = L.querySelector(":scope > .scene-props");
      if (old?.dataset.props === signature) { E.syncImagePlanes(L); continue; }
      old?.remove();
      if (items.length) { const zones = L.querySelector(":scope > .zones"); (zones || L).insertAdjacentHTML(zones ? "beforebegin" : "beforeend", E.scenePropsHTML(img, items)); L.querySelector(":scope > .scene-props").dataset.props = signature; }
      E.syncImagePlanes(L);
    }
  };

  // HIỆU ỨNG THEO VÙNG: ripple (nước lăn tăn) · flicker (đèn chập chờn) · glow (sáng nhẹ đập) · smoke (khói bốc) · twinkle (lấp lánh) · drip (giọt rơi) · fog (sương trôi)
  E.regionFx = {}; // plugin thêm: E.regionFx.ten = (vùng) => "<html>"
  const fxHtml = img => Object.entries(E.regionsOf(img)).map(([k, v]) => { const r = normR(v); if (!r?.fx) return ""; return String(r.fx).split(/\s+/).map(f => E.regionFx[f] ? E.regionFx[f](r) : `<i class="rfx rfx-${esc(f)}${r.shape === "ellipse" ? " el" : ""}" style="${pct(r.box)}"></i>`).join(""); }).join("");
  E.fxHtml = fxHtml;
  // khung dây (chưa có ảnh): tên ảnh + các vùng có nhãn
  E.wireHtml = (img, force) => {
    if (!force && !E.wire) return "";
    const rs = E.regionsOf(img);
    return `<div class="wire"><b>${esc(img)}</b>${Object.entries(rs).map(([k, v]) => { const r = normR(v); return r ? `<i class="${r.shape === "ellipse" ? "el" : ""}" style="${pct(r.box)}"><span>${esc(k)}</span></i>` : ""; }).join("")}</div>`;
  };

  // gắn lớp hiệu ứng vùng + khung dây vào cảnh (bg) vừa dựng
  const scene0 = E.ui.scene;
  E.ui.scene = (id, keepCg) => {
    const R = E.R();
    if(R?.scene!==id&&!keepCg){clearDialogueLayout(true);clearDetailOverlay();E.ui.dialogueFrame('full');}
    if (E.ui.bgKey() !== "s:" + id) prepareVisualTransition("s:" + id);
    if(!keepCg&&R?.actionFrame)setActionFrame(null,false);
    if (R?.shot && !keepCg) { R.shot = null; R.shotBack = null; root()?.classList.remove("shot"); }
    if (!keepCg) lookTo(null, 0, true);
    return Promise.resolve(scene0(id, keepCg)).then(() => {
      if (E.ui.bgKey() === "s:" + id) { decorate(id, !E.hasArt("im-" + id)); if (E.R()?.sceneProps?.img === id) E.ui.sceneProps(id); paintSavedProps(R, id); }
    });
  };
  function decorate(img, missing) {
    const L = $(".se-bgl.on"); if (!L || L.dataset.image !== img || L.querySelector(":scope > .deco")) return;
    const extra = fxHtml(img) + (missing || E.wire ? E.wireHtml(img, true) : "");
    if (extra) L.insertAdjacentHTML("beforeend", E.vbox(img, extra, "deco"));
    E.syncImagePlanes(L);
  }

  // Keep the native outgoing buffer opaque underneath the incoming fade.
  // Fading both to half opacity darkens the stage by 25%. Its camera is held
  // independently so the next inspection zoom cannot move the old image.
  // No extra bitmap layer is created and narration never waits for this fade.
  const transitionStyleKeys = ["transform", "transform-origin", "animation", "transition", "opacity", "z-index"];
  const keepStyles = el => transitionStyleKeys.map(k => [k, el.style.getPropertyValue(k), el.style.getPropertyPriority(k)]);
  const putStyles = (el, saved) => { for (const [k, v, priority] of saved) { if (v) el.style.setProperty(k, v, priority); else el.style.removeProperty(k); } };
  const matrixAt = el => {
    if (!el) return new DOMMatrix();
    const cs = getComputedStyle(el), origin = cs.transformOrigin.split(" ").map(parseFloat), m = new DOMMatrix(cs.transform === "none" ? undefined : cs.transform);
    return new DOMMatrix().translate(origin[0] || 0, origin[1] || 0).multiply(m).translate(-(origin[0] || 0), -(origin[1] || 0));
  };
  const cameraMatrix = () => matrixAt($(".se-bgw"));
  const transitionMs = el => {
    const cs = getComputedStyle(el), times = value => value.split(",").map(x => parseFloat(x) * (x.trim().endsWith("ms") ? 1 : 1000));
    return Math.max(0, ...times(cs.transitionDuration), ...times(cs.animationDuration));
  };
  function finishVisualTransition() {
    const tr = visualTransition; if (!tr) return;
    visualTransition = null; cancelAnimationFrame(tr.raf);
    const incoming = tr.incoming || $$(".se-bgl.on").find(l => l !== tr.outgoing);
    if (incoming) {
      // A rapid second navigation can reuse a buffer halfway through its fade.
      // Settle the currently visible destination before that buffer is reused.
      for (const k of [...incoming.classList]) if (/^(t-|out-)/.test(k)) incoming.classList.remove(k);
      const oldTransition = incoming.style.getPropertyValue("transition"), oldPriority = incoming.style.getPropertyPriority("transition");
      incoming.style.setProperty("transition", "none", "important");
      void incoming.offsetWidth;
      if (oldTransition) incoming.style.setProperty("transition", oldTransition, oldPriority); else incoming.style.removeProperty("transition");
    }
    tr.outgoing.classList.remove("se-transition-held");
    for (const k of [...tr.outgoing.classList]) if (/^(t-|out-)/.test(k)) tr.outgoing.classList.remove(k);
    putStyles(tr.outgoing, tr.styles);
    for (const child of tr.children) putStyles(child.el, child.styles);
    // The destination has settled. Retire the outgoing bitmap immediately;
    // releasing the hold must not start a second opacity fade behind it.
    if (incoming && !tr.outgoing.classList.contains("on")) E.ui.retireLayer?.(tr.outgoing);
  }
  function prepareVisualTransition(key, cut = false) {
    if (visualTransition?.key === key) return;
    const previous = visualTransition, current = $(".se-bgl.on");
    // If the requested image is still decoding, carry forward the actual
    // visible camera instead of exposing a reset camera between requests.
    const carry = previous && !previous.incoming && current === previous.outgoing ? cameraMatrix().multiply(matrixAt(current)) : null;
    finishVisualTransition();
    if (cut || E.auto || reducedMotion() || typeof DOMMatrix !== "function") { resetCamera = null; E.emit("visual-transition-prepared", key); return; }
    const outgoing = $(".se-bgl.on"); if (!outgoing) { E.emit("visual-transition-prepared", key); return; }
    const remembered = resetCamera?.layer === outgoing && performance.now() - resetCamera.at < 80 ? resetCamera.matrix : null;
    resetCamera = null;
    const tr = { key, outgoing, run: E.R(), viewport:[innerWidth,innerHeight], styles: keepStyles(outgoing), children: [], net: carry || (remembered || cameraMatrix()).multiply(matrixAt(outgoing)), raf: 0, requested: performance.now(), incoming: null, until: 0 };
    for (const el of outgoing.querySelectorAll(":scope > div")) {
      const cs = getComputedStyle(el); tr.children.push({ el, styles: keepStyles(el) });
      el.style.setProperty("transform", cs.transform, "important"); el.style.setProperty("opacity", cs.opacity, "important");
      el.style.setProperty("animation", "none", "important"); el.style.setProperty("transition", "none", "important");
    }
    visualTransition = tr;
    outgoing.classList.add("se-transition-held");
    outgoing.style.setProperty("transform-origin", "0 0", "important");
    const frame = now => {
      if (visualTransition !== tr) return;
      if (E.R() !== tr.run || reducedMotion() || E.ui.bgKey() !== key || !outgoing.isConnected) return finishVisualTransition();
      if (!tr.incoming) {
        tr.incoming = $$(".se-bgl.on").find(l => l !== outgoing && l.dataset.image === key.slice(2)) || null;
        if (tr.incoming) tr.until = now + Math.min(800, transitionMs(tr.incoming));
      }
      try { outgoing.style.setProperty("transform", cameraMatrix().inverse().multiply(tr.net).toString(), "important"); } catch { return finishVisualTransition(); }
      if (tr.incoming && now >= tr.until || now - tr.requested > 1500) return finishVisualTransition();
      tr.raf = requestAnimationFrame(frame);
    };
    outgoing.style.setProperty("transform", cameraMatrix().inverse().multiply(tr.net).toString(), "important");
    // Plugins may now release the previous scene's layout before the incoming
    // layer is measured, without exposing its old image at the new scale.
    E.emit("visual-transition-prepared", key);
    tr.raf = requestAnimationFrame(frame);
  }
  const layer0 = E.ui.layer;
  E.ui.layer = (key, inner, opts = {}) => {
    if (E.ui.bgKey() !== key || opts.force) prepareVisualTransition(key, opts.tr === "cut");
    return layer0(key, inner, opts);
  };
  const cg0 = E.ui.cg;
  E.ui.cg = name => { if (name && E.hasArt("im-" + name) && E.ui.bgKey() !== "c:" + name) prepareVisualTransition("c:" + name); return cg0(name); };
  E.ui.transitionState = () => visualTransition ? { key: visualTransition.key, from: visualTransition.outgoing.dataset.image, committed: !!visualTransition.incoming } : null;
  const compensateVisualCamera = () => {
    const tr = visualTransition; if (!tr) return;
    try { tr.outgoing.style.setProperty("transform", cameraMatrix().inverse().multiply(tr.net).toString(), "important"); } catch { finishVisualTransition(); }
  };

  // Relocation is distinct from a shot: a shot deliberately hides the native
  // cast and retains the return location. Scene metadata moves that location
  // on the existing story step, preserving array/save indices and cast slots.
  // On resume, the same scene must not clear endpoint props or reset its look.
  E.side("scene", async (id, st, ctx) => {
    if (typeof id !== "string" || !E.S()?.scenes?.[id]) throw Error("scene: unknown scene " + String(id));
    if ("shot" in st || st.motion?.backdrop) throw Error("scene: use a separate step for an inspection shot or backdrop cue");
    const R = E.R();
    const changed = R.scene !== id || !!R.cg || !!R.shot;
    // A new destination supersedes a still-decoding inspection immediately.
    // Only a same-scene resume needs the current restore commit first.
    if (!changed) await E.ui.layerReady?.();
    if (E.R() !== R || ctx?.live && !ctx.live()) return;
    if (changed) {
      motionCurrent?.dispose(); cancelProps(); R.props = {};
      if (R.sceneProps?.img !== id) R.sceneProps = null;
      root()?.querySelectorAll(".vbw.props").forEach(el => el.remove());
    }
    if (changed || E.ui.bgKey() !== "s:" + id) await E.ui.scene(id);
  });

  // ═════════ MÁY QUAY TỚI VÙNG (look) ═════════
  // Only an explicitly authored look follows HUD layout. Wide views and native
  // cast keep their framing. Use layout boxes, not an entrance animation's
  // temporary translated position, so long bilingual text cannot cover hands.
  let activeFocus = null, focusObserver, focusMutation, focusRaf = 0;
  const focusObserved = new Set();
  const hudSelector = '.lf-hud,[data-stage-obstruction="top"]';
  const focusBlockSelector = '.se-top,.se-box,.se-ui,.se-sheet,.se-card,' + hudSelector;
  const shown = el => !!el && !el.hidden && !!el.getClientRects().length && getComputedStyle(el).visibility !== "hidden";
  const layoutRect = (el, st) => {
    const pos = node => { let x = 0, y = 0; for (; node; node = node.offsetParent) { x += node.offsetLeft; y += node.offsetTop; } return { x, y }; };
    const a = pos(el), b = pos(st);
    return { left: a.x - b.x, top: a.y - b.y, right: a.x - b.x + el.offsetWidth, bottom: a.y - b.y + el.offsetHeight };
  };
  function focusArea(st, initial) {
    const W = st.clientWidth, H = st.clientHeight;
    let area = initial || { left: W * .06, top: 8, right: W * .94, bottom: H - 8 };
    const headers = [...new Set([$(".se-top"), ...$$(hudSelector)])].filter(shown);
    // Plugins can add a guide after boot. Its actual layout is part of the
    // safe image area, and caps the dialogue height on a short portrait phone.
    const hudBottom = Math.max(0, ...headers.map(el => layoutRect(el, st).bottom));
    const floor = Math.round(hudBottom) + 'px', rt = root();
    if (rt?.style.getPropertyValue('--action-hud-bottom') !== floor) rt?.style.setProperty('--action-hud-bottom', floor);
    const blocks = [...new Set([...headers, $(".se-box")])].filter(shown);
    const ui = $(".se-ui"), panel = ui?.querySelector(":scope > .se-panel");
    // Native bottom panels occupy space; full sheets do not change the camera.
    // In landscape the panel may be beside the stage and have no intersection.
    if (shown(ui) && shown(panel) && !panel.matches(".full,.ov") && getComputedStyle(panel).position !== "fixed") blocks.push(ui);
    for (const el of blocks) {
      const b = layoutRect(el, st), l = Math.max(area.left, b.left - 7), r = Math.min(area.right, b.right + 7), t = Math.max(area.top, b.top - 7), d = Math.min(area.bottom, b.bottom + 7);
      if (l >= r || t >= d) continue;
      const choices = [
        { ...area, bottom: t }, { ...area, top: d },
        { ...area, right: l }, { ...area, left: r },
      ].filter(a => a.right > a.left && a.bottom > a.top);
      if (choices.length) area = choices.sort((a, b) => (b.right - b.left) * (b.bottom - b.top) - (a.right - a.left) * (a.bottom - a.top))[0];
    }
    return area;
  }
  function focusBlocked() {
    return $$(".se-sheet,.se-rev,.se-read,.se-card,.se-iv,.se-pop,.se-panel.full,.se-panel.ov,.se-panel.vd-explore,.se-panel.vd-deduce").some(shown);
  }
  function refreshFocus() {
    syncScenePeek();
    motionCurrent?.positionControl?.();
    if(actionFor(E.curImg())&&!focusBlocked()){E.syncImagePlanes();return;}
    const f = activeFocus;
    if (!f || f.run !== E.R() || f.img !== E.curImg() || !root()?.classList.contains("looking") || focusBlocked()) return;
    lookTo(f.name, 0, true, true);
  }
  function scheduleFocus() {
    if ((!activeFocus && !actionFor(E.curImg()) && !peekAvailable()) || focusRaf) return;
    focusRaf = requestAnimationFrame(() => { focusRaf = 0; refreshFocus(); });
  }
  function observeFocusBlocks() {
    if (!focusObserver) return;
    const current = new Set($$(focusBlockSelector));
    for (const el of focusObserved) if (!current.has(el) || !el.isConnected) { focusObserver.unobserve(el); focusObserved.delete(el); }
    for (const el of current) if (!focusObserved.has(el)) { focusObserved.add(el); focusObserver.observe(el); }
  }
  E.on("boot", () => {
    focusObserver?.disconnect(); focusObserved.clear(); focusMutation?.disconnect(); cancelAnimationFrame(focusRaf); focusRaf = 0; activeFocus = null;
    const rt = root();
    if (globalThis.ResizeObserver) { focusObserver = new ResizeObserver(scheduleFocus); observeFocusBlocks(); }
    if (rt && globalThis.MutationObserver) {
      focusMutation = new MutationObserver(records => {
        const relevant = records.some(m => m.type === 'attributes'
          ? m.attributeName === 'data-stage-obstruction' || m.target.matches(focusBlockSelector)
          : m.target.closest(focusBlockSelector) || [...m.addedNodes, ...m.removedNodes].some(n => n.nodeType === 1 && (n.matches(hudSelector) || n.querySelector(hudSelector))));
        if (relevant) { observeFocusBlocks(); scheduleFocus(); }
      });
      focusMutation.observe(rt, { childList: true, subtree: true, attributes: true, attributeFilter: ["hidden", "data-stage-obstruction"] });
    }
    queueMicrotask(observeFocusBlocks);
  });
  E.on("line", scheduleFocus); E.on("step", scheduleFocus); E.on("image-plane", scheduleFocus);
  // Composed actions share one sharp image/prop plane. Tiny contacts position
  // the composition; broad context bounds, rather than contacts, limit crop.
  const clampAF=(v,lo,hi)=>Math.min(hi,Math.max(lo,v));
  function cleanActionBox(value) {
    const b=normR(value)?.box;
    if(!b||b.length!==4||!b.every(Number.isFinite)||b[2]<=0||b[3]<=0)return null;
    const x=clampAF(b[0],0,99.5),y=clampAF(b[1],0,99.5);
    return[x,y,Math.max(.5,Math.min(b[2],100-x)),Math.max(.5,Math.min(b[3],100-y))];
  }
  // Reserve the reading lane before the first painted action frame. Deriving
  // this rectangle from the live dialogue height made the image jump once
  // when text appeared, again when it wrapped, and sometimes into a side gap.
  // A stable action layout has one vertical scene lane (or an explicit
  // landscape column). Only a viewport change or the player's View scene
  // control changes it; the printed sentence never moves the camera.
  function stableActionArea(st, landscape, split) {
    const rt=root(),W=st.clientWidth,H=st.clientHeight;
    // Only permanent authored chrome reserves the stable action lane. Profile
    // or introduction notices must not resize an actor midway through a cue.
    const headers=[...new Set([$(".se-top"),...$$('[data-stage-obstruction="top"]')])].filter(shown);
    const top=Math.min(H-120,Math.max(72,...headers.map(el=>layoutRect(el,st).bottom+8)));
    const reader=landscape?0:Math.round(Math.min(280,Math.max(184,H*.34),Math.max(150,H-top-196)));
    rt.style.setProperty("--action-hud-bottom",Math.round(top-8)+"px");
    rt.style.setProperty("--action-reader-height",reader+"px");
    const edge=Math.max(10,W*.035);
    return landscape&&!scenePeek
      ?{left:8,top,right:Math.max(40,split-8),bottom:H-8}
      :{left:edge,top,right:W-edge,bottom:scenePeek?H-8:H-reader-20};
  }
  function actionPlane(img,st) {
    const config=actionFor(img),[iw,ih]=E.imgSize(img),W=st.clientWidth,H=st.clientHeight;
    const landscape=matchMedia("(min-width:600px) and (max-height:500px)").matches;
    const split=Math.min(W*.46,Math.max(160,H*iw/ih));
    root().style.setProperty("--action-scene-width",split+"px");
    const initial=landscape&&!scenePeek?{left:8,top:8,right:Math.max(40,split-8),bottom:H-8}:undefined;
    const area=E.S()?.stableActionFraming?stableActionArea(st,landscape,split):focusArea(st,initial),aw=Math.max(1,area.right-area.left),ah=Math.max(1,area.bottom-area.top);
    const focus=cleanActionBox(E.regionOf(img,config.focus))||cleanActionBox(config.lastFocus)||[35,30,30,40];
    let context=cleanActionBox(E.regionOf(img,config.context))||cleanActionBox(config.lastContext);
    if(!context){const w=Math.max(70,focus[2]),h=Math.max(40,focus[3]);context=[clampAF(focus[0]+focus[2]/2-w/2,0,100-w),clampAF(focus[1]+focus[3]/2-h/2,0,100-h),w,h];}
    const x0=Math.min(context[0],focus[0]),y0=Math.min(context[1],focus[1]),x1=Math.max(context[0]+context[2],focus[0]+focus[2]),y1=Math.max(context[1]+context[3],focus[1]+focus[3]);
    context=[x0,y0,x1-x0,y1-y0];config.lastFocus=[...focus];config.lastContext=[...context];
    const zoom=clampAF(Number.isFinite(config.zoom)?config.zoom:1.3,1,2);
    // Width-based ceiling avoids whole-plate thumbnails and contact-only
    // enlargement. A source pixel never exceeds one CSS pixel.
    const scale=Math.min(1,aw/iw*zoom,aw/(iw*context[2]/100),ah/(ih*context[3]/100));
    const w=iw*scale,h=ih*scale;
    const position=(a0,a1,size,start,span,centre)=>{
      const desired=(a0+a1)/2-centre/100*size;
      if(size<=a1-a0)return clampAF(desired,a0,a1-size);
      const lo=Math.max(a1-size,a0-start/100*size),hi=Math.min(a0,a1-(start+span)/100*size);
      return lo<=hi?clampAF(desired,lo,hi):clampAF(desired,a0-start/100*size,a1-(start+span)/100*size);
    };
    const x=position(area.left,area.right,w,context[0],context[2],focus[0]+focus[2]/2),y=position(area.top,area.bottom,h,context[1],context[3],focus[1]+focus[3]/2);
    return{x,y,w,h,action:{image:img,area:{...area},focus,context,scale,zoom,source:[iw,ih],landscape}};
  }
  function setActionFrame(value,render=true) {
    const R=E.R(),rt=root();if(!R||!rt)return;
    if(!value){setScenePeek(false);delete R.actionFrame;rt.classList.remove("action-framed");delete rt.dataset.actionLayout;rt.style.removeProperty("--action-scene-width");rt.style.removeProperty("--action-hud-bottom");rt.style.removeProperty("--action-reader-height");if(render)E.syncImagePlanes();syncScenePeek();return;}
    const v=value===true?R.actionFrame||{}:value;if(!v||typeof v!=="object"||Array.isArray(v))return;
    const copy=x=>Array.isArray(x)?[...x]:x;
    R.actionFrame={focus:copy(v.focus??null),...(v.context!=null?{context:copy(v.context)}:{}),zoom:clampAF(Number.isFinite(v.zoom)?v.zoom:1.3,1,2),...(cleanActionBox(v.lastFocus)?{lastFocus:cleanActionBox(v.lastFocus)}:{}),...(cleanActionBox(v.lastContext)?{lastContext:cleanActionBox(v.lastContext)}:{})};
    const look=R.look;lookTo(null,0,true);R.look=look;$(".se-bgw").dataset.cam="";rt.classList.add("action-framed");
    if(E.S()?.stableActionFraming)rt.dataset.actionLayout="stable";else delete rt.dataset.actionLayout;
    if(render){E.syncImagePlanes();scheduleFocus();}
  }
  E.ui.actionFrame=value=>setActionFrame(value);
  E.ui.actionFrameState=()=>{const img=E.curImg(),st=$(".se-stage");if(!st||!actionFor(img))return null;const b=actionPlane(img,st);return{...b.action,plane:{x:b.x,y:b.y,w:b.w,h:b.h}};};
  // A temporary view of an action or authored cast, not a story/save mode. Auto's preference
  // is untouched; its timer is suspended until this same line is visible again.
  let scenePeek = null, scenePeekButton = null;
  const peekAvailable=()=>!!actionFor(E.curImg())||["standing","seated","interview","grounded","medium"].includes(root()?.dataset.v093Direction)||!!(
    motionCurrent?.peek&&!motionCurrent.disposed&&motionCurrent.R===E.R()&&motionCurrent.key===E.ui.bgKey()&&
    (!motionCurrent.ctx.live||motionCurrent.ctx.live())
  );
  function setScenePeek(value) {
    const rt=root(),box=$(".se-box");
    if(value&&(!peekAvailable()||!shown(box)||focusBlocked()||E.auto))return;
    if(!!value===!!scenePeek)return;
    scenePeek=value?{run:E.R()}:null;
    rt?.classList.toggle("action-peek",!!scenePeek);
    if(box)box.inert=!!scenePeek;
    E.emit("action-peek",!!scenePeek);
    if(actionFor(E.curImg())){E.syncImagePlanes();scheduleFocus();}syncScenePeek();
  }
  function syncScenePeek() {
    const rt=root(),box=$(".se-box");if(!rt||!box)return;
    if(scenePeek&&(scenePeek.run!==E.R()||!peekAvailable()||box.hidden||focusBlocked()))setScenePeek(false);
    if(!peekAvailable()||E.auto||box.hidden){scenePeekButton?.remove();scenePeekButton=null;return;}
    if(!scenePeekButton?.isConnected){
      scenePeekButton=h('<button type="button" class="se-scene-peek"></button>');rt.appendChild(scenePeekButton);
      scenePeekButton.onclick=e=>{e.stopPropagation();setScenePeek(!scenePeek);};
    }
    const active=!!scenePeek,key=String(active),label=T(active?"Show dialogue":"View scene",active?"Hiện lời thoại":"Xem cảnh");
    if(scenePeekButton.dataset.active!==key){
      scenePeekButton.dataset.active=key;scenePeekButton.setAttribute("aria-pressed",key);
      scenePeekButton.setAttribute("aria-label",label);scenePeekButton.title=label;
      scenePeekButton.innerHTML=(active?E.ICON.log:E.ICON.photo)+`<span${E.S()?.inspectionZoom===false?' style="display:inline"':''}>${esc(label)}</span>`;
    }
    const bounds=rt.getBoundingClientRect(),top=$(".se-top");
    let y=shown(top)?top.getBoundingClientRect().bottom-bounds.top+8:12;
    for(const el of $$(E.S()?.stableActionFraming?'[data-stage-obstruction="top"]':hudSelector))if(shown(el))y=Math.max(y,el.getBoundingClientRect().bottom-bounds.top+8);
    const lane=$(".se-lane");if(!E.S()?.stableActionFraming&&shown(lane)&&[...lane.children].some(n=>n.textContent&&getComputedStyle(n).opacity!=="0"))y=Math.max(y,lane.getBoundingClientRect().bottom-bounds.top+8);
    const br=shown(box)?box.getBoundingClientRect():null,hit=scenePeekButton.getBoundingClientRect();
    const ceiling=br&&hit.right>br.left&&hit.left<br.right?br.top-bounds.top-8:bounds.height-12;
    scenePeekButton.hidden=focusBlocked()||y+44>ceiling;scenePeekButton.style.top=y+"px";
  }
  E.ui.actionPeek=value=>setScenePeek(value);
  E.ui.actionPeekState=()=>!!scenePeek;
  E.on("line",()=>{setScenePeek(false);queueMicrotask(syncScenePeek);});
  E.on("step",()=>{setScenePeek(false);queueMicrotask(syncScenePeek);});
  E.on("boot",()=>{
    scenePeek=null;scenePeekButton=null;
    const rt=root();if(!rt)return;
    rt.addEventListener("click",e=>{
      if(!scenePeek||$("[data-quick-menu]:not([hidden])")||e.target.closest(".se-scene-peek,.se-motion-control,.se-top,.se-sheet,.se-card,.se-pop,.se-read,.se-rev,.se-iv,.v94-objective-notice,.se-lane"))return;
      e.preventDefault();e.stopImmediatePropagation();setScenePeek(false);
    },true);
    rt.addEventListener("keydown",e=>{
      if(!scenePeek||$("[data-quick-menu]:not([hidden])")||e.target.closest(".se-sheet,.se-pop"))return;
      if(e.key==="Escape"||(["Enter"," "].includes(e.key)&&!e.target.closest("button,a,input,select,textarea"))){e.preventDefault();e.stopImmediatePropagation();setScenePeek(false);}
    },true);
  });
  const scenePeekSheet0=E.ui.sheet;
  E.ui.sheet=(...args)=>{setScenePeek(false);return scenePeekSheet0(...args);};
  const scenePeekStop0=E.stop;
  E.stop=(...args)=>{
    setScenePeek(false);
    const result=scenePeekStop0(...args);
    finishVisualTransition();resetCamera=null;
    cancelAnimationFrame(focusRaf);focusRaf=0;activeFocus=null;
    const w=$(".se-bgw");if(w)w.style.transition="none";
    return result;
  };
  function savedActionFrame(R) {
    if(R.actionFrame)return{...R.actionFrame};
    // Older saves only contain shot/look. Stable authored interpreter paths
    // identify new composition before restore can expose the legacy crop.
    for(const f of[...(R.stack||[])].reverse()){
      const steps=E.walk?.(f);if(!Array.isArray(steps))continue;
      for(const i of[f.i,f.i-1]){const st=steps[i];if(i===f.i&&st&&"actionFrame"in st&&!st.actionFrame)return null;if(!st?.actionFrame)continue;
        const matches=R.shot?(st.shot===R.shot||st.motion?.backdrop?.frames?.some(p=>p.art===R.shot)):i===f.i;
        if(matches)return st.actionFrame===true?{}:{...st.actionFrame};
      }
    }
    return null;
  }
  function lookTo(name, ms = 1500, quiet, refresh = false) {
    const w = $(".se-bgw"), R = E.R(); if (!w) return;
    if (R && !refresh) delete R.lookSource;
    if(name!=null&&name!==false&&R?.actionFrame)setActionFrame(null);
    if (syncMotionPreference()) ms = 0;
    if (name == null || name === false) {
      activeFocus = null; cancelAnimationFrame(focusRaf); focusRaf = 0;
      // An action frame may already have cleared the CSS transform while
      // retaining its semantic focus. Always clear that saved focus as well,
      // or a later reload can zoom back into the previous object on dialogue.
      if (R) R.look = null;
      root()?.classList.remove("looking");
      if (!w.style.transform && !quiet) return;
      if (quiet && w.style.transform && !visualTransition && typeof DOMMatrix === "function") resetCamera = { layer: $(".se-bgl.on"), matrix: cameraMatrix(), at: performance.now() };
      w.style.transition = quiet ? "none" : `transform ${ms}ms cubic-bezier(.45,0,.2,1)`;
      w.style.transform = "";
      compensateVisualCamera();
      return;
    }
    const img = E.curImg(), r = E.regionOf(img, name);
    if (!r) { console.warn("[story] look: không có vùng", name, "trên", img); return; }
    const st = $(".se-stage"), W = st.clientWidth, H = st.clientHeight, p = E.rectPx(img, r.box);
    const focusKey = JSON.stringify(name), previous = activeFocus;
    const same = previous?.run === R && previous.img === img && previous.key === focusKey && previous.width === W && previous.height === H;
    let area = focusArea(st);
    // Keep an intentional inspection framing when the next line is shorter
    // or its box closes. Only a tighter obstruction, a new target or a real
    // viewport change can reframe it. The first layout pass belongs to this
    // line, not the panel that was visible before the inspection began.
    if (same && previous.settled) area = {
      left: Math.max(area.left, previous.area.left), top: Math.max(area.top, previous.area.top),
      right: Math.min(area.right, previous.area.right), bottom: Math.min(area.bottom, previous.area.bottom)
    };
    if (area.right <= area.left || area.bottom <= area.top) area = focusArea(st);
    const cx = p.x + p.w / 2, cy = p.y + p.h / 2;
    const c = E.coverBox(img);
    const ratio = (need, space) => need <= 0 ? 0 : space > .01 ? need / space : Infinity;
    // A rare contact near a bitmap edge may need more zoom to clear a short
    // bilingual HUD without exposing an image edge. Only this authored region
    // opts in; malformed/old metadata retains the original 3.2 ceiling.
    const maxScale = Number.isFinite(r.maxScale) && r.maxScale >= 1 && r.maxScale <= 6 ? r.maxScale : 3.2;
    const upper = Math.min(maxScale, (area.right - area.left) / p.w, (area.bottom - area.top) / p.h);
    // An entire focus rectangle must fit, not just its centre. The lower bound
    // also leaves enough bitmap below/above it to cover the complete stage.
    const lower = Math.max(1, ratio(area.left, p.x - c.x), ratio(W - area.right, c.x + c.w - p.x - p.w), ratio(area.top, p.y - c.y), ratio(H - area.bottom, c.y + c.h - p.y - p.h));
    const fits = E.fit(img) === "cover" && lower <= upper;
    const centreMin = Math.max(1, ratio(area.left, cx - c.x), ratio(W - area.right, c.x + c.w - cx), ratio(area.top, cy - c.y), ratio(H - area.bottom, c.y + c.h - cy));
    // Oversized/edge targets cannot always fit without revealing image seams.
    // Keep the critical centre visible where possible; authors should name a
    // smaller contact/detail region for a very short phone viewport.
    const k = fits ? upper : Math.max(1, Math.min(maxScale, Math.max(upper, centreMin)));
    let tx = (area.left + area.right) / 2 - k * cx, ty = (area.top + area.bottom) / 2 - k * cy;
    const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
    tx = clamp(tx, Math.max(W - k * (c.x + c.w), fits ? area.left - k * p.x : -Infinity), Math.min(-k * c.x, fits ? area.right - k * (p.x + p.w) : Infinity));
    ty = clamp(ty, Math.max(H - k * (c.y + c.h), fits ? area.top - k * p.y : -Infinity), Math.min(-k * c.y, fits ? area.bottom - k * (p.y + p.h) : Infinity));
    const transform = `translate(${tx.toFixed(2)}px,${ty.toFixed(2)}px) scale(${k.toFixed(5)})`;
    const unchanged = activeFocus?.transform === transform && !!w.style.transform;
    const now = performance.now();
    if (refresh && same) ms = Math.max(0, previous.until - now);
    activeFocus = { run: R, img, name, key: focusKey, width: W, height: H, area,
      settled: refresh || same && previous.settled, transform,
      until: refresh && same || unchanged && same ? previous.until : now + ms };
    w.dataset.cam = "";
    w.style.transformOrigin = "0 0";
    if (!unchanged) { w.style.transition = `transform ${ms}ms cubic-bezier(.45,0,.2,1)`; w.style.transform = transform; }
    compensateVisualCamera();
    root()?.classList.add("looking");
    if (R) R.look = name;
  }
  E.ui.look = lookTo;
  // Inspection state, repeat-tap and Back work independently of magnifying
  // the room. A game can use authored detail shots while leaving this off.
  E.ui.inspectionLook = (name, ms, quiet) => {
    const R = E.R();
    if (E.S()?.inspectionZoom === false) {
      E.ui.zoom(null);
      if (!R?.shot && !R?.actionFrame || R?.lookSource === "inspection") lookTo(null, 0, true);
      return;
    }
    lookTo(name, ms, quiet);
    if (R?.look != null) R.lookSource = "inspection";
  };
  function savedInspectionFocus(R, look = R.look) {
    if (R.lookSource === "inspection") return true;
    if (R.shot || R.actionFrame || look == null) return false;
    // Older saves have no provenance. Preserve an explicit authored camera
    // on the saved line; otherwise a live detail state identifies inspection.
    const f = R.stack?.at(-1), st = f && E.walk(f)?.[f.i];
    if (st?.look != null || st?.valeStage?.look != null) return false;
    return !!R.pl?.[R.vw?.pid]?.detail || Object.values(R.xpDetail || {}).some(d => d?.box && (!d.img || d.img === R.scene));
  }
  def("look", async ({ st }) => lookTo(st.look, st.ms));

  // ═════════ KHUNG HÌNH CHO LỜI DẪN (shot) ═════════
  E.ui.shot = (name, o = {}) => {
    const R = E.R(), rt = root();
    if (!name) {
      if (!R.shot) {if(R.actionFrame)setActionFrame(null,false);E.syncImagePlanes();return Promise.resolve();}
      const back = R.shotBack;
      // Capture and hold the composed outgoing plane before removing its
      // action viewport. Clearing Peek/frame first exposed a wide flash.
      prepareVisualTransition(back?.key || "s:" + (back?.scene || R.scene));
      if(R.actionFrame)setActionFrame(null,false);
      R.shot = null; R.shotBack = null; rt.classList.remove("shot");
      let ready;
      if (back?.key?.startsWith("v:")) {
        rt.classList.remove("cg");
        const img = back.key.slice(2), has = E.hasArt("im-" + img);
        E.ui.layer(back.key, `<div class="ph vph"></div>${has ? `<div class="ii im-${esc(img)}"></div>` : ""}` + E.vbox(img, fxHtml(img) + E.wireHtml(img, !has || E.wire), "deco") + (R.sceneProps?.img === img ? E.scenePropsHTML(img, R.sceneProps.items) : "") + E.vbox(img, "", "zones"), { tr: "still" });
        ready = E.ui.layerReady?.();
      } else { rt.classList.remove("cg"); ready = E.ui.scene(back?.scene || R.scene, false); }
      return Promise.resolve(ready).then(() => {
        if (E.R() === R && !R.shot && E.ui.bgKey() === back?.key) {
          if (back.look) {
            if (back.lookSource === "inspection" || E.S()?.inspectionZoom === false && savedInspectionFocus(R, back.look)) E.ui.inspectionLook(back.look, 0, true);
            else lookTo(back.look, 0, true);
          }
          paintSavedProps(R, E.curImg());
        }
      });
    }
    if (o.clearProps) { R.props = {}; rt.querySelectorAll(".vbw.props").forEach(el => el.remove()); }
    const has = E.hasArt("im-" + name);
    if (!has && !E.wire) return Promise.resolve(); // chưa vẽ → giữ khung đang có
    if (E.ui.bgKey() !== "h:" + name) prepareVisualTransition("h:" + name, o.tr === "cut");
    if(!o.keepActionFrame&&!o.actionFrame&&!o.restore&&R.actionFrame)setActionFrame(null,false);
    if (!R.shot && !o.restore) R.shotBack = { key: E.ui.bgKey(), scene: R.scene, look: R.look, ...(R.lookSource ? { lookSource: R.lookSource } : {}) };
    lookTo(null, 0, true);
    R.shot = name;
    rt.classList.add("cg", "shot");
    E.ui.layer("h:" + name, `<div class="ph cgph"></div>${has ? `<div class="ii im-${esc(name)}"></div>` : ""}` + E.vbox(name, fxHtml(name) + (has && !E.wire ? "" : E.wireHtml(name, true)), "deco"), { cls: "cgl", tr: o.tr ?? "still" });
    return Promise.resolve(E.ui.layerReady?.()).then(() => paintSavedProps(R, name));
  };
  def("shot",async c=>{
    await E.ui.shot(c.st.shot,c.st);
    if("actionFrame"in c.st)setActionFrame(c.st.actionFrame);
    if(c.st.actionFrame&&"look"in c.st)E.R().look=c.st.look;
    if(c.st.actionFrame&&c.st.motion)await playMotion(c.st.motion,c,true);
  });
  E.side("shot", async (v, st, c) => {
    // A saved backdrop cue is already restored at its endpoint. Do not flash
    // its authored BEFORE shot while the resumed cue prepares that endpoint.
    const mark = st.motion && E.R()?.used?.[c.key("motion", st.motion.id || "cue")];
    if (mark?.final && st.motion?.backdrop && mark.backdropFinal === E.curImg()) return;
    return E.ui.shot(v, st);
  });
  // On narrated lines: shot -> composition -> semantic look -> motion.
  // A primary shot defers composition until its image has been selected.
  def("actionFrame",async({st})=>setActionFrame(st.actionFrame));
  E.side("actionFrame",async(v,st,c)=>{if(c.type!=="shot")setActionFrame(v);});
  // Framing belongs to the image selected by this line, then motion captures
  // that look. Registering look first would let shot silently reset the crop.
  E.side("look",async(v,st,c)=>{if(st.actionFrame){if(c.type!=="shot")E.R().look=v;}else lookTo(v);});

  // A small authored push belongs to this narration only. Returning from it
  // never changes logical room/cast, and a saved line remembers its baseline.
  E.side('focus',async(spec,st,c)=>{
    if(!spec||!['n','think','say'].includes(c.type))return;
    await E.ui.layerReady?.();if(c.live?.()===false)return;
    const R=E.R(),img=E.curImg(),key=c.key(),old=R.lineFocus?.key===key?R.lineFocus:{before:R.look,beforeSource:R.lookSource};
    const authored=E.regionOf(img,spec.r??spec.region??spec.box??spec);if(!authored)return;
    const scale=Math.max(1,Math.min(1.4,Number(spec.scale)||1.15)),target={...authored,maxScale:scale};
    R.lineFocus={key,img,before:old.before??null,beforeSource:old.beforeSource??null};
    lookTo(target,spec.ms??650);
    c.onExit?.(()=>{if(E.R()!==R||R.lineFocus?.key!==key)return;delete R.lineFocus;if(E.curImg()!==img)return;const ms=spec.returnMs??400;if(old.beforeSource==='inspection'){if(E.S()?.inspectionZoom===false)lookTo(null,ms);else E.ui.inspectionLook(old.before??null,ms);}else{lookTo(old.before??null,ms);if(old.beforeSource)R.lookSource=old.beforeSource;}});
  });
  // An insert is an owned foreground layer, not an actor exit or a new room.
  // It disappears with its line; actors keep their exact native DOM identity.
  let detailOverlay=null;
  function clearDetailOverlay() {
    if(!detailOverlay)return;
    const previous=detailOverlay;detailOverlay=null;
    previous.readCleanup?.splice(0).forEach(fn=>fn());
    previous.el.getAnimations?.({subtree:true}).forEach(a=>a.cancel());
    previous.el.remove();
  }
  function layoutDetailOverlay() {
    const current=detailOverlay,stage=$('.se-stage');if(!current?.el.isConnected||!stage||current.run!==E.R())return;
    const W=stage.clientWidth,H=stage.clientHeight;
    const intersects=b=>b.right>0&&b.left<W&&b.bottom>0&&b.top<H;
    const headers=[...new Set([$('.se-top'),...$$(hudSelector),$('.se-scene-peek'),$('.se-motion-control')])].filter(shown).map(el=>layoutRect(el,stage)).filter(intersects);
    const readers=[$('.se-box'),$('.se-ui > .se-panel')].filter(shown).map(el=>layoutRect(el,stage)).filter(intersects);
    const top=Math.max(12,...headers.map(b=>b.bottom+12));
    const bottom=Math.max(12,...readers.filter(b=>b.top>top).map(b=>H-b.top+12));
    dialogueStyle(current.el,'--detail-top',dialogueNumber(top)+'px');
    dialogueStyle(current.el,'--detail-bottom',dialogueNumber(bottom)+'px');
    // Size an inspection to its own artwork, not to all unused stage space.
    // The available reading lane still caps this on small/landscape screens.
    const insert=current.el.querySelector('.se-action-insert');
    const rows=['.se-detail-title','.se-detail-caption','.se-detail-actions'].reduce((n,s)=>n+(insert.querySelector(s)?.getBoundingClientRect().height||0),0);
    const pictureWidth=Math.max(0,Math.min(660,W-24)-2);
    dialogueStyle(current.el,'--detail-ideal-height',dialogueNumber(pictureWidth/(current.aspect||1.4)+rows+2)+'px');
  }
  E.ui.detailView=async(spec,c)=>{
    const value=typeof spec==='string'?{art:spec}:spec;
    if(!value?.art||!E.hasArt('im-'+value.art)){clearDetailOverlay();return;}
    const run=E.R(),scene=run?.scene;
    await preloadMotionArt([value.art]);if(c?.live?.()===false||E.R()!==run||run.scene!==scene)return;
    const same=detailOverlay?.run===run&&detailOverlay.art===value.art&&detailOverlay.scene===scene&&detailOverlay.el.isConnected;
    if(!same){
      clearDetailOverlay();
      const el=h(`<div class="se-action-overlay se-detail-overlay" data-detail-art="${esc(value.art)}"><div class="se-action-insert"><i class="ii im-${esc(value.art)}"></i><button type="button" class="se-detail-close" data-detail-close aria-label="${esc(T('Close image','Đóng ảnh'))}">${E.ICON.x||'×'}</button></div></div>`);
      $('.se-stage').appendChild(el);detailOverlay={el,run,scene,art:value.art,step:c?.st,readCleanup:[]};
      el.querySelector('[data-detail-close]').onclick=e=>{e.preventDefault();e.stopPropagation();if(detailOverlay?.el===el){detailOverlay.closed=true;el.hidden=true;E.sfx('tap');scheduleDialogueLayout();}};
    }
    const current=detailOverlay,el=current.el,insert=el.querySelector('.se-action-insert');
    current.step=c?.st;current.framing=value.framing==='scene'?'scene':'conversation';el.dataset.overlayKey=c?.key?.()||'';el.classList.toggle('still',!!same);
    current.aspect=Number.isFinite(value.aspect)&&value.aspect>0?value.aspect:1.4;
    el.style.setProperty('--insert-ar',String(current.aspect));
    for(const [key,tag,cls]of [['title','b','se-detail-title'],['caption','span','se-detail-caption']]){
      const text=value[key]?nat(value[key]):'',old=insert.querySelector('.'+cls);
      if(!text){old?.remove();continue;}
      const node=old||document.createElement(tag);if(!old){node.className=cls;insert.appendChild(node);}if(node.textContent!==text)node.textContent=text;
    }
    // Only explicitly authored readable content gets a Read action. Never
    // OCR generated pixels, infer sealed contents or grant inspection rewards.
    const readSpec=value.read||E.ui.detailDocument?.(value,c?.st),oldActions=insert.querySelector('.se-detail-actions');
    if(readSpec){
      const actions=oldActions||h(`<div class="se-detail-actions"><button type="button" class="se-btn" data-detail-read>${E.ICON.doc||''}<span>${esc(T('Read','Đọc'))}</span></button></div>`);
      if(!oldActions)insert.appendChild(actions);
      actions.querySelector('button').onclick=async event=>{
        event.preventDefault();event.stopPropagation();
        if(current.reading||detailOverlay!==current||current.closed)return;
        const step=current.step;current.reading=true;E.ui.closeWordPop?.();
        await E.ui.read(readSpec,{preview:true,live:()=>detailOverlay===current&&current.step===step&&current.run===E.R()&&!current.closed,onExit:fn=>current.readCleanup.push(fn)});
        current.reading=false;current.readCleanup.length=0;
        if(detailOverlay===current&&!current.closed&&el.isConnected)actions.querySelector('button').focus({preventScroll:true});
      };
    }else oldActions?.remove();
    // The next step owns cleanup. Removing on line exit would flash the same
    // detail between two adjacent narrated lines. Stop/reset still clear now.
    scheduleDialogueLayout();return el;
  };
  E.on('step',(_type,st)=>{if(detailOverlay&&(detailOverlay.run!==E.R()||detailOverlay.step!==st))clearDetailOverlay();});
  E.on('end',clearDetailOverlay);
  E.side('overlay',async(spec,st,c)=>{
    const value=typeof spec==='string'?{art:spec}:spec;if(!value?.art)return;
    if(value.detail||value.read||E.ui.detailDocument?.(value,st))return E.ui.detailView(value,c);
    if(!E.hasArt('im-'+value.art))return;
    await preloadMotionArt([value.art]);if(c.live?.()===false)return;
    const el=h(`<div class="se-action-overlay${value.full?' full':''}" data-overlay-key="${esc(c.key())}"><div class="se-action-insert"><i class="ii im-${esc(value.art)}"></i>${value.caption?`<span>${esc(nat(value.caption))}</span>`:''}</div></div>`);
    if(value.aspect)el.style.setProperty('--insert-ar',String(value.aspect));
    $('.se-stage').appendChild(el);c.onExit?.(()=>{el.getAnimations({subtree:true}).forEach(a=>a.cancel());el.remove();});
  });

  // ═════════ ĐẠO CỤ + CỬ ĐỘNG THEO LỜI KỂ ═════════
  // Motion shares the native image plane and saved props; it never grants items,
  // advances dialogue or creates actors that were not explicitly shown.
  const center = (img, v) => { if (Array.isArray(v)) return v; const r = E.regionOf(img, v); return r ? [r.box[0] + r.box[2] / 2, r.box[1] + r.box[3] / 2, r.box[2]] : [50, 50]; };
  const reducedMotion = () => E.auto || E.G()?.set.motion === "reduced" || (E.G()?.set.motion !== "full" && matchMedia("(prefers-reduced-motion: reduce)").matches);
  const syncMotionPreference = () => {
    const reduced = !!reducedMotion(); root()?.classList.toggle("se-motion-reduced", reduced);
    if (reduced) finishVisualTransition();
    if (reduced) $$(".se-chi .fo").forEach(el => el.remove());
    return reduced;
  };
  E.on("boot", syncMotionPreference);
  const propAnimations = new Map();
  const motionArtReady = new Map();
  async function preloadMotionArt(arts) {
    const pending = [...new Set(arts)].filter(Boolean).map(art => {
      if (motionArtReady.has(art)) return motionArtReady.get(art);
      const promise = new Promise(resolve => {
        const probe = document.createElement("i"); probe.className = "im-" + art; probe.hidden = true; document.body.appendChild(probe);
        const url = /url\(["']?([^"')]+)/.exec(getComputedStyle(probe).backgroundImage)?.[1]; probe.remove();
        if (!url) return resolve();
        const image = new Image(); image.onerror = () => resolve(); image.onload = () => (image.decode ? image.decode() : Promise.resolve()).catch(() => {}).then(resolve); image.src = url;
      });
      motionArtReady.set(art, promise); return promise;
    });
    let timer; await Promise.race([Promise.all(pending), new Promise(resolve => timer = setTimeout(resolve, 450))]); clearTimeout(timer);
  }
  const propBox = (L, img) => {
    let box = L?.querySelector(".vbw.props .vbx");
    if (!box && L) { L.insertAdjacentHTML("beforeend", E.vbox(img, "", "props")); E.syncImagePlanes(L); box = L.querySelector(".vbw.props .vbx"); }
    return box;
  };
  const propEl = (L, id) => [...(L?.querySelectorAll(".vbw.props .prp") || [])].find(el => el.dataset.p === id);
  const propTransform = p => `translate(-50%,-50%) rotate(${p.rotate ?? 0}deg) scale(${p.scale ?? 1})`;
  function propArt(el, art, fade = false) {
    const old = el.querySelector(".prp-art");
    if (el.dataset.art === art && old) return;
    el.querySelectorAll(".prp-frame-out").forEach(n => { n.getAnimations().forEach(a => a.cancel()); n.remove(); });
    if (old && fade && !reducedMotion()) {
      const ghost = old.cloneNode(); ghost.classList.add("prp-frame-out"); el.appendChild(ghost);
      const anim = ghost.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 150, easing: "ease-out" });
      anim.finished.catch(() => {}).then(() => ghost.remove());
    }
    const image = old || h('<div class="ii prp-art"></div>');
    image.className = "ii prp-art im-" + art;
    if (!old) el.appendChild(image);
    el.dataset.art = art;
    el.querySelector(".prp-ph")?.remove();
    if (!E.hasArt("im-" + art)) el.appendChild(h(`<span class="prp-ph">${esc(el.dataset.p)}</span>`));
  }
  function renderProp(id, p, L = $(".se-bgl.on"), img = E.curImg()) {
    const box = propBox(L, img); if (!box) return null;
    let el = propEl(L, id);
    if (!el) { el = h(`<div class="prp" data-p="${esc(id)}"></div>`); box.appendChild(el); }
    const a = center(img, p.at ?? [50, 50]);
    Object.assign(el.style, { left: a[0] + "%", top: a[1] + "%", width: (p.w ?? a[2] ?? 20) + "%", aspectRatio: String(p.ar ?? 1), zIndex: String(p.z ?? 1), transform: propTransform(p), opacity: String(p.opacity ?? 1) });
    el.dataset.at = a.join(","); propArt(el, p.art || "it-" + id);
    return el;
  }
  // A cut selects a new native buffer even when it uses the same location
  // plate. Objects already placed there retain custody and must reappear in
  // that buffer. A real scene change still clears them through the scene/bg
  // steps; an inspection of a different image never inherits them.
  function paintSavedProps(R, img) {
    if (E.R() !== R || E.curImg() !== img) return;
    for (const [id, p] of Object.entries(R.props || {})) if (p.img === img) renderProp(id, p);
  }
  const cancelProps = () => { for (const finish of [...propAnimations.values()]) finish(); propAnimations.clear(); };
  def("prop", async ({ st }) => {
    const P = st.prop, img = E.curImg(), L = $(".se-bgl.on"), R = E.R(); if (!L || !P?.id) return;
    const old = R.props?.[P.id]?.img === img ? R.props[P.id] : {};
    let el = propEl(L, P.id); propAnimations.get(el)?.();
    if (P.off && !el) { delete (R.props || {})[P.id]; return; }
    const a = center(img, P.at ?? old.at ?? [50, 50]), b = P.to != null ? center(img, P.to) : a;
    const initial = { ...old, art: P.art || old.art || "it-" + P.id, at: a, w: P.w ?? a[2] ?? old.w ?? 20, ar: P.ar ?? old.ar ?? 1, z: P.z ?? old.z ?? 1, rotate: P.rot?.[0] ?? P.rotate ?? old.rotate ?? 0, scale: P.scale ?? old.scale ?? 1, opacity: P.fade === "in" ? 0 : P.opacity ?? old.opacity ?? 1, img };
    const final = { ...initial, at: b, rotate: P.rot?.[1] ?? initial.rotate, opacity: P.fade === "out" || P.off ? 0 : P.opacity ?? 1 };
    if (P.off) delete (R.props || {})[P.id]; else (R.props ||= {})[P.id] = final;
    el = renderProp(P.id, initial, L, img);
    const ms = reducedMotion() ? 0 : Math.max(0, P.ms ?? (P.off ? 400 : 1200));
    let resolve, done = false, an; const promise = new Promise(r => resolve = r);
    const finish = () => { if (done) return; done = true; propAnimations.delete(el); if (P.off) el.remove(); else if (el.isConnected) renderProp(P.id, final, L, img); an?.cancel(); resolve(); };
    if (ms) { an = el.animate([initial, final].map(p => ({ left: p.at[0] + "%", top: p.at[1] + "%", transform: propTransform(p), opacity: p.opacity })), { duration: ms, delay: P.delay ?? 0, easing: P.ease || "cubic-bezier(.45,0,.25,1)", fill: "both" }); propAnimations.set(el, finish); an.finished.then(finish, finish); } else finish();
    if (P.sfx) E.sfx(P.sfx);
    if (P.wait) await promise;
  });

  // { n/say/think:…, motion:{id,ms,tracks:[{id,art,at,w,ar,frames:[{offset,at,art,rotate,scale,opacity}],remove}],actors:[{id,frames:[{offset,face}]}]} }
  // Offsets 0…1 are elapsed time; repeat a transform in adjacent frames to hold.
  // A standalone {motion:…} waits. Metadata normally plays beside its line.
  let motionCurrent = null;
  function motionFrames(raw, initial, img, actor = false) {
    const src = Array.isArray(raw) && raw.length ? raw : [{}];
    let previous = { ...initial, at: Array.isArray(initial.at) ? [...initial.at] : initial.at };
    const frames = src.map((f, i) => {
      const next = { ...previous, ...f, offset: f.offset ?? (src.length > 1 ? i / (src.length - 1) : 1) };
      if (!actor) next.at = center(img, f.at ?? previous.at);
      if (!Number.isFinite(next.offset) || next.offset < 0 || next.offset > 1 || (i && next.offset < (src[i - 1].offset ?? (i - 1) / (src.length - 1)))) throw Error("motion: offsets must increase from 0 to 1");
      if (!actor && (!next.at.slice(0, 2).every(Number.isFinite) || ![next.scale, next.rotate, next.opacity].every(Number.isFinite))) throw Error("motion: invalid transform");
      previous = next; return next;
    });
    if (frames[0].offset > 0) frames.unshift({ ...initial, offset: 0 });
    if (frames.at(-1).offset < 1) frames.push({ ...frames.at(-1), offset: 1 });
    return frames;
  }
  const actorEl = id => [...$$(".se-ch")].find(el => el.dataset.id === id);
  function motionProjection(saved, cue) {
    saved.props ||= {}; saved.cast ||= {};
    for (const t of cue.tracks) { if (t.remove) delete saved.props[t.id]; else saved.props[t.id] = { ...t.final }; }
    for (const a of cue.actors) if (saved.cast[a.id]) saved.cast[a.id] = { at: a.final.at, face: a.final.face };
    if (cue.backdrop) { saved.shot = cue.backdrop.final.art; saved.shotBack = { ...cue.shotBack }; saved.look = cue.look && E.regionOf(cue.backdrop.final.art, cue.look) ? cue.look : null; if(cue.actionFrame)saved.actionFrame={...cue.actionFrame}; }
  }
  const snapshot0 = E.snapshot;
  E.snapshot = () => {
    const saved = snapshot0();
    if (motionCurrent && motionCurrent.R === E.R() && !motionCurrent.disposed) motionProjection(saved, motionCurrent);
    return saved;
  };
  const motionIcon = replay => replay ? '<svg viewBox="0 0 24 24"><path d="M4 10a8 8 0 1 1 1 8M4 4v6h6"/></svg>' : '<svg viewBox="0 0 24 24"><path d="m6 5 9 7-9 7zM18 5v14"/></svg>';
  async function playMotion(M, ctx, standalone = false) {
    if (!M || typeof M !== "object") return;
    motionCurrent?.dispose();
    ctx.resumeHere?.(true);
    // Restore owns the first image/zoom commit. Its ready callback was queued
    // before this step; capturing after it prevents replay from losing zoom.
    await E.ui.layerReady?.();
    if (ctx.live && !ctx.live()) return;
    const R = E.R(), img = E.curImg(), key = E.ui.bgKey(), markKey = ctx.key("motion", M.id || "cue");
    const savedStart = R.used?.[markKey], tracks = [], actors = [], ids = new Set();
    const sameSavedImage = savedStart && (savedStart.img === img || savedStart.backdropFinal === img);
    const backFrames = M.backdrop ? motionFrames(M.backdrop.frames, { art: img }, img, true) : null;
    if (backFrames && (M.tracks || []).length) throw Error("motion: backdrop and prop tracks need separate cues");
    if (backFrames?.some(f => typeof f.art !== "string" || !f.art)) throw Error("motion: backdrop frames need art");
    const backdrop = backFrames ? { frames: backFrames, final: backFrames.at(-1), frameIndex: -1 } : null;
    for (const t of M.tracks || []) {
      if (!t?.id || ids.has(t.id)) throw Error("motion: missing or duplicate track id"); ids.add(t.id);
      const old = sameSavedImage && savedStart.props?.[t.id] || (R.props?.[t.id]?.img === img ? R.props[t.id] : {});
      const at = center(img, t.at ?? old.at ?? [50, 50]);
      const initial = { art: t.art || old.art || "it-" + t.id, at, w: t.w ?? at[2] ?? old.w ?? 20, ar: t.ar ?? old.ar ?? 1, z: t.z ?? old.z ?? 1, rotate: t.rotate ?? old.rotate ?? 0, scale: t.scale ?? old.scale ?? 1, opacity: t.opacity ?? old.opacity ?? 1, img };
      const frames = motionFrames(t.frames, initial, img), final = { ...frames.at(-1), img }; delete final.offset;
      tracks.push({ id: t.id, initial, frames, final, remove: !!t.remove, ease: t.ease || M.ease || "ease-in-out", frameIndex: -1 });
      for (const f of frames) E.preloadImg("im-" + f.art);
    }
    const actorIds = new Set();
    for (const a of M.actors || []) {
      if (!a?.id || actorIds.has(a.id)) throw Error("motion: missing or duplicate actor id"); actorIds.add(a.id);
      // Absent actors stay absent unless the author explicitly opts into
      // native show; hide is also explicit staging, never an inferred effect.
      if (a.hide) { E.ui.hide(a.id); continue; }
      if (a.show && !R.cast?.[a.id] && E.S().chars[a.id]) E.ui.show(a.id, a.at || "c", a.frames?.[0]?.face || "");
      if (!R.cast?.[a.id] || !actorEl(a.id)) continue;
      const initial = { ...(sameSavedImage && savedStart.actors?.[a.id] || R.cast[a.id]), at: a.at ?? R.cast[a.id].at };
      const frames = motionFrames(a.frames, initial, img, true);
      actors.push({ id: a.id, initial, frames, final: frames.at(-1), frameIndex: -1 });
      for (const f of frames) if (f.face) E.preloadImg(`im-${a.id}-${f.face}`);
    }
    if (!tracks.length && !actors.length && !backdrop) return;
    const duration = M.ms ?? 1800;
    if (!Number.isFinite(duration) || duration < 0 || duration > 15000) throw Error("motion: ms must be 0…15000");
    const sounds = (M.sounds || []).map(s => {
      if (!s || typeof s.cue !== "string" || !s.cue || !Number.isFinite(s.at) || s.at < 0 || s.at > 1) throw Error("motion: sounds need a cue and an offset 0…1");
      return { at: s.at, cue: s.cue };
    });
    let resolve; const promise = new Promise(r => resolve = r);
    const cue = { R, img, key, tracks, actors, backdrop, peek: M.peek === true, look: R.look, actionFrame:R.actionFrame?{...R.actionFrame}:null, shotBack: R.shotBack || { key, scene: R.scene, look: R.look }, ctx, running: false, disposed: false, raf: 0, anims: [], soundHandles: [], heard: new Set(), button: null, observer: null, startTime: 0 };
    motionCurrent = cue;
    const valid = () => !cue.disposed && motionCurrent === cue && E.R() === R && E.ui.bgKey() === cue.key && (!ctx.live || ctx.live());
    const swapBackdrop = frame => {
      if (!backdrop || E.R() !== R) return;
      const composition=R.actionFrame||cue.actionFrame;
      if (E.curImg() !== frame.art) E.ui.shot(frame.art, { tr: reducedMotion() ? "cut" : "still",keepActionFrame:!!composition });
      cue.key = E.ui.bgKey(); cue.img = E.curImg();
      // Matching frames retain camera context. The image is changed by the
      // native two-buffer shot renderer, never by an opaque foreground prop.
      // chỉ giữ góc quay nếu ảnh mới CÓ vùng đó (ảnh cận → ảnh toàn cảnh thì thôi: shot() đã đưa camera về toàn cảnh, gọi look sẽ chỉ báo thiếu vùng)
      if(composition){setActionFrame(composition);R.look=cue.look;cue.actionFrame={...R.actionFrame};}else E.ui.look(cue.look && E.regionOf(E.curImg(), cue.look) ? cue.look : null, 0, true);
    };
    const setFace = (a, frame) => { const el = actorEl(a.id); if (R.cast?.[a.id] && el && (el.dataset.face !== (frame.face || "") || el.dataset.at !== frame.at)) E.ui.show(a.id, frame.at, frame.face || ""); };
    const clearAnimation = () => {
      cancelAnimationFrame(cue.raf); cue.raf = 0;
      for (const an of cue.anims) an.cancel(); cue.anims = [];
      for (const t of tracks) t.el?.querySelectorAll(".prp-frame-out").forEach(el => { el.getAnimations().forEach(a => a.cancel()); el.remove(); });
    };
    const positionControl = () => {
      const rt = root(), button = cue.button; if (!rt || !button) return;
      const bounds = rt.getBoundingClientRect(), top = $(".se-top"), box = $(".se-box");
      let y = top && !top.hidden ? top.getBoundingClientRect().bottom - bounds.top + 8 : 12;
      // Native games may keep Profile beneath the header. It is an essential
      // control, so the action affordance must sit below its actual rectangle.
      // Plugins can reserve a top-stage area (context/mission bars, profiles)
      // without coupling the engine to a particular game's CSS class.
      for (const el of $$(E.S()?.stableActionFraming?'[data-stage-obstruction="top"]':hudSelector)) if (shown(el)) y = Math.max(y, el.getBoundingClientRect().bottom - bounds.top + 8);
      const lane = $(".se-lane"), visibleNotice = lane && [...lane.children].some(n => n.textContent && getComputedStyle(n).opacity !== "0");
      if (visibleNotice && !E.S()?.stableActionFraming) y = Math.max(y, lane.getBoundingClientRect().bottom - bounds.top + 8);
      const br=shown(box)?box.getBoundingClientRect():null,stageBounds=$('.se-stage')?.getBoundingClientRect()||bounds;
      // Native actor actions can share the narrow stage beside a landscape
      // reader without using actionFrame. Place every control in that actual
      // stage, and measure its intended 44px hit area even while hidden.
      // Measuring a hidden button returned zero and toggled overlap each pass.
      let right=Math.min(bounds.right,stageBounds.right)-12;
      if(br&&br.left>stageBounds.left+68&&br.right>right-44&&br.top<bounds.top+y+44&&br.bottom>bounds.top+y)right=Math.min(right,br.left-12);
      const left=Math.max(bounds.left+12,stageBounds.left+12,right-44),hit={left,right:left+44};
      button.style.left=(left-bounds.left)+'px';button.style.right='auto';
      const ceiling = br&&hit.right>br.left&&hit.left<br.right ? br.top - bounds.top - 8 : Math.min(bounds.bottom,stageBounds.bottom)-bounds.top-12;
      button.hidden = reducedMotion() || stageBounds.width<68 || y + 44 > ceiling;
      button.style.top = y + "px";
    };
    cue.positionControl = positionControl;
    const updateControl = () => {
      if (E.auto || !cue.button) return;
      syncMotionPreference();
      const replay = !cue.running, label = T(replay ? "Replay action" : "Finish action", replay ? "Xem lại hành động" : "Xem hết hành động");
      cue.button.dataset.motionMode = replay ? "replay" : "skip";
      cue.button.setAttribute("aria-label", label); cue.button.title = label; cue.button.innerHTML = motionIcon(replay);
      positionControl();
    };
    const stopCueSounds = () => { for (const handle of cue.soundHandles) handle?.stop?.(0.04); cue.soundHandles = []; };
    cue.finish = (completed = false) => {
      if (cue.disposed) return;
      if (!completed) stopCueSounds();
      const same = E.R() === R && E.ui.bgKey() === cue.key;
      cue.running = false; clearAnimation();
      if (same) {
        if (backdrop) {
          swapBackdrop(backdrop.final);
          const finalKey = cue.key;
          Promise.resolve(E.ui.layerReady?.()).then(() => {
            if (E.R() !== R || E.ui.bgKey() !== finalKey) return;
            for (const id in R.props || {}) if (R.props[id].img === E.curImg()) renderProp(id, R.props[id]);
          });
        }
        const layer = $(".se-bgl.on");
        for (const t of tracks) { if (t.remove) { t.el?.remove(); propEl(layer, t.id)?.remove(); delete (R.props || {})[t.id]; } else { (R.props ||= {})[t.id] = { ...t.final }; t.el = renderProp(t.id, t.final, layer, img); } }
        for (const a of actors) setFace(a, a.final);
      }
      updateControl(); resolve();
    };
    cue.dispose = () => {
      if (cue.disposed) return;
      cue.finish(); cue.disposed = true; cue.observer?.disconnect(); cue.button?.remove();
      if (motionCurrent === cue) motionCurrent = null;
      syncScenePeek();
    };
    ctx.onExit?.(cue.dispose);
    (R.used ||= {})[markKey] = { final: true, img, backdropFinal: backdrop?.final.art, props: Object.fromEntries(tracks.map(t => [t.id, t.initial])), actors: Object.fromEntries(actors.map(a => [a.id, a.initial])) };
    // Save the endpoint with a resumable step marker before any asynchronous
    // visual work. Loading the line again paints that endpoint once.
    motionProjection(R, { ...cue, actors: [], backdrop: null });
    ctx.resumeHere?.(true); E.save();
    await Promise.all([E.ui.layerReady?.(), preloadMotionArt([
      ...tracks.flatMap(t => t.frames.map(f => f.art)),
      ...actors.flatMap(a => a.frames.map(f => f.face ? a.id + "-" + f.face : a.id)),
      ...(backdrop?.frames.map(f => f.art) || []),
    ])]);
    if (!valid()) { cue.dispose(); return; }
    if (!E.auto) {
      cue.button = h('<button type="button" class="se-motion-control"></button>'); root().appendChild(cue.button);
      cue.button.onclick = event => { event.stopPropagation(); if (!valid()) return cue.dispose(); if (cue.running) cue.finish(); else cue.start(); };
      cue.observer = new ResizeObserver(positionControl);
      [root(), $(".se-stage"), $(".se-top"), $(".se-box"), $(".se-lane"), ...$$('.lf-hud,[data-stage-obstruction="top"]')].filter(Boolean).forEach(el => cue.observer.observe(el));
    }
    const applyFrame = progress => {
      if (backdrop) {
        let index = 0; while (index + 1 < backdrop.frames.length && backdrop.frames[index + 1].offset <= progress) index++;
        if (index !== backdrop.frameIndex) { swapBackdrop(backdrop.frames[index]); backdrop.frameIndex = index; }
      }
      for (const t of tracks) {
        let index = 0; while (index + 1 < t.frames.length && t.frames[index + 1].offset <= progress) index++;
        if (index !== t.frameIndex) {
          const frame = t.frames[index]; propArt(t.el, frame.art, index > 0);
          t.el.style.aspectRatio = String(frame.ar); t.el.style.zIndex = String(frame.z);
          t.frameIndex = index;
        }
      }
      for (const a of actors) {
        let index = 0; while (index + 1 < a.frames.length && a.frames[index + 1].offset <= progress) index++;
        setFace(a, a.frames[index]); a.frameIndex = index;
      }
      // Physical cues follow the actual motion clock, including Replay. Skip,
      // reduced motion and a restored endpoint never play unheard past sounds.
      sounds.forEach((s, index) => {
        if (progress < s.at || cue.heard.has(index)) return;
        cue.heard.add(index); const handle = E.sfx(s.cue); if (handle) cue.soundHandles.push(handle);
        E.emit("motion-sound", { id: M.id || "cue", cue: s.cue, at: s.at, progress });
      });
    };
    cue.start = () => {
      if (!valid()) return cue.dispose();
      clearAnimation(); stopCueSounds(); cue.heard.clear(); cue.running = true; if (backdrop) backdrop.frameIndex = -1;
      const layer = $(".se-bgl.on");
      for (const t of tracks) {
        propAnimations.get(propEl(layer, t.id))?.();
        t.el = renderProp(t.id, t.frames[0], layer, img); t.frameIndex = -1;
      }
      if (reducedMotion() || !duration) { cue.finish(); return; }
      for (const t of tracks) cue.anims.push(t.el.animate(t.frames.map(f => ({ offset: f.offset, left: f.at[0] + "%", top: f.at[1] + "%", width: f.w + "%", transform: propTransform(f), opacity: f.opacity, easing: t.ease })), { duration, fill: "both" }));
      cue.startTime = performance.now(); applyFrame(0); updateControl();
      const tick = now => {
        if (!valid()) return cue.dispose();
        if (reducedMotion()) return cue.finish();
        const progress = Math.min(1, (now - cue.startTime) / duration);
        applyFrame(progress);
        if (progress >= 1) { cue.finish(true); E.save(); }
        else cue.raf = requestAnimationFrame(tick);
      };
      cue.raf = requestAnimationFrame(tick);
    };
    if (savedStart?.final && sameSavedImage) cue.finish(); else cue.start();
    if (standalone || M.wait) { E.autoRun?.(cue.finish); await promise; }
    ctx.resumeHere?.(false);
  }
  E.ui.finishMotion = () => { syncMotionPreference(); motionCurrent?.finish(); };
  E.ui.replayMotion = () => motionCurrent?.start?.();
  E.ui.motionState = () => motionCurrent ? { id: motionCurrent.ctx.st.motion?.id, running: motionCurrent.running, img: motionCurrent.img } : null;
  def("motion", c => playMotion(c.st.motion, c, true));
  E.side("motion",(m,st,c)=>c.type==="shot"&&st.actionFrame?undefined:playMotion(m,c));

  // ═════════ CHUYỂN ĐỘNG CHẬM khi chọn (Detroit) ═════════
  E.side("slow", async v => {
    if (!v || E.auto) return;
    const rt = root(); rt.classList.add("slowmo"); E.sfx("sting"); E.haptic("MEDIUM");
    let n = 0; const off = E.on("step", () => { if (++n > 1) { rt.classList.remove("slowmo"); off(); } });
  });

  // ═════════ VẬT PHẨM HIỆN RA ═════════
  // items.<mã>.sides = [{ t }, { art: "it-ring-in", t: { en, vi }, note, set, truth }] — mặt 0 = ảnh it-<mã>; lật lần đầu 1 mặt = áp set / ghi chú
  // items.<mã>.doc = { paper, hand, lines } → nút “Đọc”
  const sidesOf = id => { const it = E.S().items?.[id]; return it?.sides?.length ? it.sides : null; };
  const artOf = (id, k) => (k ? sidesOf(id)?.[k]?.art : E.S().items?.[id]?.recordArt) || "it-" + id;
  const bigArt = (id, k = 0) => { const it = E.S().items?.[id]; if (E.recordKind?.(id) === "inference") return E.inferenceArt("rv-a"); const a = artOf(id, k), real=E.artReal?.("im-"+a); if (!k && !real) return E.itemArt(id,"rv-a"); return `<span class="se-ia rv-a">${real?'':`<span class="ic">${E.ICON[it?.icon] || E.ICON.box}</span>`}<i class="im-${esc(a)}"></i></span>`; };
  const seeSide = (id, k) => {
    const R = E.R(), sd = sidesOf(id)?.[k]; if (!sd) return;
    const key = `side:${id}:${k}`; if (R.used[key]) return; R.used[key] = 1;
    E.apply(sd);
    if (sd.note) (R.jot ||= []).push({ ch: R.ch, t: sd.note });
    if (sd.truth && !E.G().truths[sd.truth]) { R.truths[sd.truth] = 1; E.G().truths[sd.truth] = Date.now(); E.ui.dot(true); E.ui.toast(`${E.ICON.bulb || ""}<span><small>${esc(T("Truth uncovered", "Sự thật mới"))}</small><b>${esc(nat(E.S().truths?.[sd.truth]?.name))}</b></span>`, 3000, "item"); }
    E.save();
  };
  // khung xem vật: dùng cho lúc nhận đồ (fresh) và khi mở từ túi / hồ sơ
  let cancelReveal = null;
  E.ui.cancelReveal = () => cancelReveal?.();
  E.ui.reveal = (id, o = {}) => new Promise(res => {
    const S = E.S(), it = S.items?.[id], rt = root(); if (!it || !rt) return res();
    cancelReveal?.();
    $(".se-rev", rt)?.remove();
    const sides = sidesOf(id), doc = it.doc || S.docs?.[id];
    const compact = S.recordPresentation === "compact", receipt = !!(o.fresh && o.receipt), run = E.R(), returnTo = document.activeElement;
    const timers = [], animations = [], readCleanup = [];
    let closed = false, busy = false, turning = false, reading = false;
    let k = 0;
    const v = h(`<div class="se-rev${o.fresh ? " fresh" : ""}${compact ? " compact-record" : ""}${receipt ? " receipt-notice" : ""}" role="dialog" aria-modal="true" aria-label="${esc(nat(it.name))}" tabindex="-1"><div class="rv-bg"></div><div class="rv-c">
      ${o.fresh ? `<small class="rv-k">${esc(E.recordKind?.(id)==="inference"?T("Conclusion recorded", "Đã ghi kết luận"):(it.recordType||it.kind)==="testimony"?T("Account recorded", "Đã ghi lời khai"):T("Added to records", "Đã thêm hồ sơ"))}</small>` : ""}
      <div class="rv-tools">${E.ui.readingToggle?.()||''}</div><div class="rv-st">${bigArt(id, 0)}</div>
      <b class="rv-n">${investigationText(it.name)}</b><div class="rv-copy"><p class="rv-d" tabindex="0">${investigationText(sides?.[0]?.t || it.desc)}</p>${compact ? `<small class="rv-scroll-hint" hidden>${esc(T("Scroll to read more ↓", "Cuộn để đọc tiếp ↓"))}</small>` : ""}</div>
      <div class="rv-b">${receipt ? `<button class="se-btn" data-receipt-open>${esc(T("View details", "Xem chi tiết"))}</button>` : ""}${sides ? `<button class="se-btn" data-turn>${E.ICON.flip || "↻"}<span>${esc(T("Turn over", "Lật lại"))}</span></button>` : ""}${doc ? `<button class="se-btn" data-read>${E.ICON.doc || ""}<span>${esc(T("Read", "Đọc"))}</span></button>` : ""}</div>
      <button class="rv-tap" type="button" aria-label="${esc(T("Close item and continue", "Đóng vật phẩm và tiếp tục"))}">${esc(o.fresh ? E.recordKind?.(id)==="inference" ? T("Continue", "Tiếp tục") : T("Tap to put it in your bag", "Chạm để cất vào túi") : T("Tap to close", "Chạm để đóng"))}</button></div></div>`);
    rt.appendChild(v);
    const receiptReading=E.ui.bindReading?.(v,{native:o.native});
    const live = () => !closed && v.isConnected && E.R() === run && (!o.context?.live || o.context.live());
    const settle = cancelled => {
      if (closed) return; closed = true;
      timers.forEach(clearTimeout); animations.forEach(a => a.cancel()); readCleanup.splice(0).forEach(fn => fn()); copyObserver?.disconnect();receiptReading?.dispose();
      v.remove(); if (cancelReveal === cancel) cancelReveal = null;
      if (!cancelled && returnTo?.isConnected) returnTo.focus?.({preventScroll:true});
      res();
    };
    const cancel = () => settle(true); cancelReveal = cancel;
    o.context?.onExit?.(cancel);
    const animate = (frames, options) => { const a = art.animate(frames, options); animations.push(a); return a; };
    const later = (fn, ms) => timers.push(setTimeout(() => { if (live()) fn(); else cancel(); }, ms));
    // bay ra từ chỗ vật nằm (vùng vừa chạm) → giữa màn
    const art = $(".rv-st", v);
    const description = $(".rv-d", v), scrollHint = $(".rv-scroll-hint", v);
    const syncCopy = () => { if (scrollHint && !closed) scrollHint.hidden = description.scrollHeight <= description.clientHeight + description.scrollTop + 3; };
    const copyObserver = compact && typeof ResizeObserver !== "undefined" ? new ResizeObserver(syncCopy) : null;
    copyObserver?.observe(description); description.onscroll = syncCopy;
    if (o.from && !E.auto && !compact && !reducedMotion()) { const b = art.getBoundingClientRect(), f = o.from; animate([{ transform: `translate(${f.x + f.w / 2 - (b.left + b.width / 2)}px,${f.y + f.h / 2 - (b.top + b.height / 2)}px) scale(${Math.max(.15, Math.min(1, f.w / b.width))})`, opacity: .4 }, { transform: "none", opacity: 1 }], { duration: 620, easing: "cubic-bezier(.2,.9,.25,1)" }); }
    if (o.fresh) { E.sfx("item"); E.haptic("LIGHT"); }
    const turn = async () => {
      if (!live() || busy || turning || !sides) return; turning = true;
      try {
        if (!reducedMotion() && !E.auto) await animate([{ transform: "rotateY(0)" }, { transform: "rotateY(90deg)" }], { duration: 140, easing: "ease-in" }).finished;
        if (!live()) return;
        k = (k + 1) % sides.length; seeSide(id, k);
        art.innerHTML = bigArt(id, k); $(".rv-d", v).innerHTML = investigationText(sides[k].t || it.desc);
        receiptReading?.refresh();description.scrollTop = 0; syncCopy();
        if (!reducedMotion() && !E.auto) await animate([{ transform: "rotateY(-90deg)" }, { transform: "rotateY(0)" }], { duration: 180, easing: "ease-out" }).finished;
        if (live()) E.sfx("page");
      } catch (e) { if (e.name !== "AbortError") console.warn("[story] item turn", e); }
      finally { turning = false; }
    };
    const close = () => {
      if (busy || !live()) return; busy = true;
      const exits = [];
      const bag = $(".se-top [data-a=book]", rt);
      if (o.fresh && bag && !E.auto && !compact && !reducedMotion()) {
        const a = art.getBoundingClientRect(), b = bag.getBoundingClientRect();
        exits.push(animate([{ transform: "none", opacity: 1 }, { transform: `translate(${b.left + b.width / 2 - (a.left + a.width / 2)}px,${b.top + b.height / 2 - (a.top + a.height / 2)}px) scale(.12)`, opacity: .2 }], { duration: 520, easing: "cubic-bezier(.5,0,.75,0)", fill: "forwards" }));
        later(() => { bag.classList.remove("got"); void bag.offsetWidth; bag.classList.add("got"); E.sfx("pick"); }, 480);
      }
      v.classList.add("out");
      if (E.auto || reducedMotion()) return settle(false);
      // The installed theme owns its actual exit duration. Await this view's
      // finite exit animations (plus its art flight), never a guessed160ms.
      // Removal happens before the item-step promise resolves and paints the
      // next dialogue/scene. Cancel/reset still settles immediately.
      void v.offsetWidth;
      exits.push(...(v.getAnimations?.() || []).filter(a => Number.isFinite(a.effect?.getComputedTiming().endTime)));
      Promise.allSettled([...new Set(exits)].map(a => a.finished)).then(() => { if (live()) settle(false); else cancel(); });
    };
    v.onclick = async e => {
      e.stopPropagation(); if (!live() || busy || reading) return;
      if (v.classList.contains('receipt-notice') && e.target.closest('[data-receipt-open],.rv-st,.rv-n,.rv-k')) {
        v.classList.remove('receipt-notice');
        v.querySelector('[data-receipt-open]')?.remove();
        receiptReading?.refresh(); syncCopy(); description.focus({preventScroll:true}); E.sfx('tap'); return;
      }
      if (e.target.closest("[data-turn]")) { e.stopPropagation(); return turn(); }
      if (e.target.closest("[data-read]")) { reading = true; v.hidden = true; await E.ui.read(id, { native:receiptReading?.native, live, onExit: fn => readCleanup.push(fn) }); reading = false; if (live()) { v.hidden = false; $("[data-read]", v)?.focus({preventScroll:true}); } return; }
      if (e.target.closest(".rv-tap") || (!o.fresh && e.target.closest(".rv-bg"))) close();
    };
    v.onkeydown = e => {
      if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); return close(); }
      if (e.key !== "Tab") return;
      const buttons = [...v.querySelectorAll("button,[tabindex='0']")].filter(b => !b.disabled && b.getClientRects().length), first = buttons[0], last = buttons.at(-1);
      if (e.shiftKey && (document.activeElement === first || document.activeElement === v)) { e.preventDefault(); last?.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
    };
    requestAnimationFrame(() => { if (live()) { syncCopy(); $(".rv-tap", v)?.focus({preventScroll:true}); } });
    // A request from the item detail belongs to this receipt. Never dispatch
    // a delayed click through the document: another item may have replaced it.
    if(o.turn)later(turn,0);
    if (E.auto) later(close, 5);
  });
  // nhận đồ: vật hiện ra (quiet = chỉ chấm đỏ ở túi). from: tên vùng trên ảnh đang hiện (vật bay ra từ đó)
  def("item", async c => {
    const { st } = c;
    const R = E.R(); if (R.items.includes(st.item)) return;
    R.items.push(st.item); E.save(); E.ui.dot(true); E.emit("item", st.item);
    if (st.quiet) return;
    const it=E.S().items?.[st.item];
    const receipt = !!(E.S().recordReceipts && E.recordKind?.(st.item)!=="inference" && (st.receipt === true || (it?.recordType||it?.kind)==="testimony"));
    let from = E._zoneRect || null;
    if (st.from) { const img = E.curImg(), r = E.regionOf(img, st.from); if (r) { const p = E.rectPx(img, r.box), sr = $(".se-stage").getBoundingClientRect(); from = { x: sr.left + p.x, y: sr.top + p.y, w: p.w, h: p.h }; } }
    E._zoneRect = null;
    E.ui.hideBox();
    await E.ui.reveal(st.item, { fresh: true, receipt, from, context:c });
  });
  // túi / hồ sơ: chạm 1 vật → khung xem có Lật / Đọc (thay khung cũ chỉ có ảnh + mô tả, giữ “Ghép với…”)
  const iv0 = E.ui.itemView;
  E.ui.itemView = id => {
    iv0(id);
    const it = E.S().items?.[id], v = $(".se-iv"); if (!v || !it) return;
    const doc = it.doc || E.S().docs?.[id];
    if (!sidesOf(id) && !doc) return;
    const row = h(`<div class="rv-b">${sidesOf(id) ? `<button class="se-btn" data-turn>${E.ICON.flip || "↻"}<span>${esc(T("Turn over", "Lật lại"))}</span></button>` : ""}${doc ? `<button class="se-btn" data-read>${E.ICON.doc || ""}<span>${esc(T("Read", "Đọc"))}</span></button>` : ""}</div>`);
    $(".se-ivc", v)?.insertBefore(row, $(".se-ivc > small", v));
    row.onclick = e => {
      e.stopPropagation();
      const native=v.dataset.readingLanguage==="native";
      if (e.target.closest("[data-read]")) return E.ui.read(id,{native});
      if (e.target.closest("[data-turn]")) { E.ui.releaseReading?.(v);v.remove(); E.ui.reveal(id,{turn:true,native}); }
    };
  };

  // ═════════ ĐỌC GIẤY TỜ (read) ═════════
  // doc: { paper: "note" | "letter" | "card" | "report" | "log" | "list" | "screen" | "sign" | "label", hand: "caps" | "script" | "type" | "print" | "marker",
  //        title: { en, vi }, art: "doc-x" (ảnh nền giấy tuỳ chọn), lines: [{ en, vi, s: "pencil" | "cross" | "stamp" | "small" | "big" | "red" | "faded" | "gap" }],
  //        note: { en, vi } (ghi vào sổ lần đọc đầu), set, mark: [chỉ số dòng quan trọng — sáng lên khi đọc lại] }
  // Chữ là CHỮ THẬT (không vẽ bằng AI) → sắc nét, chạm từ để tra; dòng dịch hiện theo nút Dịch / “Luôn dịch”.
  let cancelRead=null;
  E.ui.cancelRead=()=>cancelRead?.();
  E.documentOf=spec=>typeof spec==='string'?(E.S()?.items?.[spec]?.doc||E.S()?.docs?.[spec]):spec;
  E.ui.read = (spec, context) => new Promise(res => {
    const S = E.S(), R = E.R(), rt = root();
    const id = typeof spec === "string" ? spec : null;
    const d = E.documentOf(spec);
    if (!d || !rt || (context?.live&&!context.live())) return res();
    const returnTo=document.activeElement;
    const parentReading=returnTo?.closest?.('[data-reading-scope]');
    cancelRead?.();
    const key = "read:" + (id || E.hash?.(JSON.stringify(d).slice(0, 200)) || "x");
    const first = !R.used[key];
    if(!context?.preview){R.used[key] = 1;if (first) { E.apply(d); if (d.note) (R.jot ||= []).push({ ch: R.ch, t: d.note }); }}
    let tr = context?.native==null ? parentReading ? parentReading.dataset.readingLanguage==='native' : false : !!context.native;
    // Documents are reading surfaces. Long translated pages replace the
    // original in place; doubling every paragraph makes both harder to scan.
    // Word study remains available on the original-language page.
    const hasTranslation=(d.lines||[]).some(l=>!!E.sub(l))||!!E.sub(d.title);
    const compactTranslation=d.bilingual!==true&&((d.lines||[]).length>1||(d.lines||[]).some(l=>String(E.tgt(l)||'').length+String(E.sub(l)||'').length>140));
    const line = (l, i) => {
      if (l.s === "gap") return `<div class="dl gap"></div>`;
      const main = E.tgt(l), sub = E.sub(l);
      return `<div class="dl${l.s ? " " + l.s.split(" ").map(x => "s-" + x).join(" ") : ""}${(d.mark || []).includes(i) && !first ? " mk" : ""}"><span class="dm">${E.words(main, E.L)}</span>${sub ? `<small class="dt">${esc(sub.replace(/\[\[|\]\]/g, ""))}</small>` : ""}</div>`;
    };
    const v = h(`<div class="se-read${tr ? " tr" : ""}${compactTranslation?' rd-compact-translation':''}" role="dialog" aria-modal="true" aria-label="${esc(nat(d.title)||T("Document", "Tài liệu"))}" tabindex="-1"><div class="rd-bg"></div><div class="rd-tools">${hasTranslation?E.ui.translationButton(tr, 'data-tr'):''}</div>
      <div class="rd-scroll" tabindex="0" aria-label="${esc(T('Document text','Nội dung tài liệu'))}"><div class="rd-p p-${esc(d.paper || "note")} h-${esc(d.hand || "print")}">${d.art ? `<i class="rd-art im-${esc(d.art)}"></i>` : ""}
        ${d.title ? `<div class="rd-t">${esc(tr&&compactTranslation?E.sub(d.title)||E.tgt(d.title):E.tgt(d.title))}</div>` : ""}${d.readingNote?`<p class="rd-note">${esc(tr?E.sub(d.readingNote)||E.tgt(d.readingNote):E.tgt(d.readingNote))}</p>`:''}<div class="rd-l">${(d.lines || []).map(line).join("")}</div></div></div>
      <div class="rd-bar"><button class="se-btn pri" data-x>${esc(T("Done", "Xong"))}</button></div></div>`);
    rt.appendChild(v);
    E.sfx("page"); E.haptic("LIGHT");
    let settled=false,closing=false,closeTimer=0,autoTimer=0,focusFrame=0;
    const live=()=>!settled&&v.isConnected&&E.R()===R&&(!context?.live||context.live());
    const settle=cancelled=>{
      if(settled)return;settled=true;
      clearTimeout(closeTimer);clearTimeout(autoTimer);cancelAnimationFrame(focusFrame);
      E.ui.closeWordPop?.(v);v.onclick=null;v.onkeydown=null;v.remove();
      if(cancelRead===cancel)cancelRead=null;
      if(!cancelled&&E.R()===R&&(!context?.live||context.live())&&returnTo?.isConnected)returnTo.focus?.({preventScroll:true});
      res();
    };
    const cancel=()=>settle(true);cancelRead=cancel;
    const close=()=>{if(closing||settled)return;if(!live())return cancel();closing=true;v.classList.add('out');closeTimer=setTimeout(()=>settle(!live()),E.auto||reducedMotion()?0:260);};
    context?.onExit?.(cancel);
    v.onkeydown = e => { if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); return close(); } if (e.key === "Tab") { const bs=[...v.querySelectorAll('button,[tabindex="0"]')].filter(b=>!b.disabled&&b.getClientRects().length),first=bs[0],last=bs.at(-1); if (e.shiftKey && (document.activeElement===first || document.activeElement===v)) {e.preventDefault();last?.focus();} else if (!e.shiftKey && document.activeElement===last) {e.preventDefault();first?.focus();} } };
    focusFrame=requestAnimationFrame(() => { if (live()&&!closing) v.querySelector('[data-x]')?.focus({preventScroll:true}); });
    v.onclick = e => {
      if(!live()||closing)return;
      const w = e.target.closest(".w[data-w]"); if (w) return; // tra từ: bộ bắt chạm chung của engine xử lý
      if (e.target.closest("[data-tr]")) {
        e.stopPropagation();E.ui.closeWordPop?.(v);
        const lane=v.querySelector('.rd-scroll'),progress=lane.scrollTop/Math.max(1,lane.scrollHeight-lane.clientHeight);
        tr = !tr; v.classList.toggle("tr", tr);
        E.ui.updateTranslationButton(v.querySelector('[data-tr]'), tr);
        if(d.title&&compactTranslation)v.querySelector('.rd-t').textContent=tr?E.sub(d.title)||E.tgt(d.title):E.tgt(d.title);
        if(d.readingNote)v.querySelector('.rd-note').textContent=tr?E.sub(d.readingNote)||E.tgt(d.readingNote):E.tgt(d.readingNote);
        lane.scrollTop=progress*Math.max(0,lane.scrollHeight-lane.clientHeight);
        E.sfx("tap"); return;
      }
      if (e.target.closest("[data-x]") || e.target.closest(".rd-bg")) close();
    };
    if (E.auto) autoTimer=setTimeout(close, 5);
  });
  def("read", async c => { c.resumeHere?.(); E.ui.hideBox(); await E.ui.read(c.st.read,c); c.resumeHere?.(false); });

  // ═════════ NHÂN VẬT: đổi biểu cảm mờ chéo · chớp mắt ═════════
  const show0 = E.ui.show;
  E.ui.show = (id, at, face) => {
    syncMotionPreference();
    const previous=E.R()?.cast?.[id];
    if(adaptiveDialogue()&&previous){at=at??previous.at;face=face??previous.face;}
    if(!E.R()?.cast?.[id]&&!E.R()?.dialogueFrameLock)E.ui.dialogueFrame('full');
    // The resumed spoken line may still carry its starting expression. A
    // completed cue owns its endpoint until that line leaves the screen.
    const held = motionCurrent && !motionCurrent.disposed && !motionCurrent.running && motionCurrent.R === E.R() && motionCurrent.actors.find(a => a.id === id);
    if (held) { at = held.final.at; face = held.final.face; }
    const el = $(`.se-ch[data-id="${id}"]`);
    if (el && (el.dataset.face || "") !== (face || "") && !reducedMotion()) {
      el.querySelectorAll('.se-chi .fo,.se-chi .bk').forEach(old=>old.remove());
      const cur = el.classList.contains("hasf") ? el.querySelector(".ii.f") : el.querySelector(".ii.im-" + id);
      if (cur) { const g = cur.cloneNode(); g.className = cur.className.replace(/\bf\b/, "") + " fo"; el.querySelector(".se-chi").appendChild(g); setTimeout(() => g.remove(), 260); }
    }
    show0(id, at, face);
    const n = $(`.se-ch[data-id="${id}"]`); if (n && !n.style.getPropertyValue("--bd")) n.style.setProperty("--bd", (-Math.random() * 5).toFixed(2) + "s");
    scheduleDialogueLayout();
  };
  const hide0=E.ui.hide;E.ui.hide=(...args)=>{const result=hide0(...args);scheduleDialogueLayout();return result;};
  let blinkT = 0;
  const blink = () => {
    clearTimeout(blinkT);
    blinkT = setTimeout(blink, 2600 + Math.random() * 3600);
    if (reducedMotion() || document.hidden) return;
    for (const el of $$(".se-ch.on")) {
      if (Math.random() < .35) continue;
      const id = el.dataset.id, f = el.dataset.face, cls = `im-${id}${f && el.classList.contains("hasf") ? "-" + f : ""}-blink`;
      if (!E.hasArt(cls)) continue;
      let b = el.querySelector(".ii.bk"); if (!b) { b = h(`<div class="ii bk"></div>`); el.querySelector(".se-chi").appendChild(b); }
      b.className = "ii bk " + cls; b.classList.add("on"); setTimeout(() => b.classList.remove("on"), 130);
    }
  };
  E.on("boot", () => setTimeout(blink, 2000));

  // ═════════ khôi phục / dọn ═════════
  const restore0 = E.ui.restore;
  let restoreToken = 0;
  E.ui.restore = () => {
    E.ui.cancelRead?.();motionCurrent?.dispose(); cancelProps();
    const R = E.R(), look = R.look, inspection = savedInspectionFocus(R), action=savedActionFrame(R), token = ++restoreToken;
    restore0();
    E.ui.dialogueFrame(R.dialogueFrame||'full',R.dialogueFrameLock);
    if(action)setActionFrame(action,false);
    if (R.shot) { const s = R.shot; R.shot = null; E.ui.shot(s, { tr: "cut", restore: true }); }
    else if (R.scene) decorate(R.scene, !E.hasArt("im-" + R.scene));
    const key = E.ui.bgKey();
    // A restored bitmap may still be decoding. Adding props immediately would
    // attach them to the outgoing title/scene layer and make them disappear.
    return Promise.resolve(E.ui.layerReady?.()).then(() => {
      if (token !== restoreToken || E.R() !== R || E.ui.bgKey() !== key) return;
      if(action){setActionFrame(action);R.look=look;}else if (look) {
        if (inspection) E.ui.inspectionLook(look, 0, true); else lookTo(look, 0);
      }
      for (const id in R.props || {}) { const p = R.props[id]; if (p.img === E.curImg()) renderProp(id, p); }
    });
  };
  const reset0 = E.ui.reset;
  E.ui.reset = () => { clearDetailOverlay();clearDialogueLayout(true);setScenePeek(false);scenePeekButton?.remove();scenePeekButton=null;motionCurrent?.dispose(); cancelProps(); finishVisualTransition(); resetCamera = null; ++restoreToken; const R = E.R(), look = R?.look, lookSource = R?.lookSource, action=R?.actionFrame; E.ui.cancelRead?.();E.ui.cancelReveal?.(); reset0(); lookTo(null, 0, true); if (R) {R.look=look;if(lookSource)R.lookSource=lookSource;if(action)R.actionFrame=action;} const rt = root(); rt?.classList.remove("shot", "slowmo", "action-framed"); rt?.style.removeProperty("--action-scene-width"); $(".se-rev")?.remove(); $(".se-read")?.remove(); };
  const stopStage=E.stop;E.stop=(...args)=>{E.ui.cancelRead?.();E.ui.cancelReveal?.();clearDetailOverlay();clearDialogueLayout(true);return stopStage(...args);};
  // sang cảnh khác → đạo cụ của cảnh cũ không còn
  E.on("step", (type, st) => { if (type === "bg") { motionCurrent?.dispose(); cancelProps(); if (E.R()?.props) E.R().props = {}; } if((type==="place"||type==="explore")&&E.R()?.actionFrame)setActionFrame(null);motionCurrent?.positionControl?.(); });

  // icon thêm
  Object.assign(E.ICON, {
    flip: E.ICON.flip || `<svg viewBox="0 0 24 24"><path d="M4 12a8 8 0 0 1 14-5.3M20 4v5h-5M20 12a8 8 0 0 1-14 5.3M4 20v-5h5"/></svg>`,
    doc: E.ICON.doc || `<svg viewBox="0 0 24 24"><path d="M7 3h7l5 5v13H7zM14 3v5h5M10 13h6M10 17h6"/></svg>`,
    left: `<svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg>`,
    right: `<svg viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg>`,
    down: `<svg viewBox="0 0 24 24"><path d="M5 9l7 7 7-7"/></svg>`,
    hint: `<svg viewBox="0 0 24 24"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z"/></svg>`,
    hand: `<svg viewBox="0 0 24 24"><path d="M8 13V5.5a1.5 1.5 0 0 1 3 0V12M11 11V4.5a1.5 1.5 0 0 1 3 0V12M14 11.5V6a1.5 1.5 0 0 1 3 0v7.5c0 4-2.5 7.5-6.5 7.5-2.8 0-4.4-1.4-5.8-3.8L3 13.4a1.5 1.5 0 0 1 2.6-1.4L8 15"/></svg>`,
    talk: `<svg viewBox="0 0 24 24"><path d="M4 5h16v11H9l-5 4z"/></svg>`,
  });
})();

// ═════════ LÀN TRẠNG THÁI + LÀN THÔNG BÁO (engine 3 — người dùng 30/10: “thông báo, tên địa điểm, giờ dễ bị đè UI”) ═════════
// · Tên địa điểm + giờ nằm TRONG thanh trên (viên giữa, giữa nút menu và cụm nút) — đổi cảnh: viên nở ra (tên + giờ) ~3,6 giây rồi thu lại
//   chỉ còn giờ (nếu truyện có đồng hồ). Chạm viên = xem lại địa điểm. Không còn thẻ địa điểm nổi đè lên hình / thông báo.
// · Mọi thông báo (nhận đồ, “X sẽ nhớ”, nhân vật mới, toast) xếp chung 1 cột dưới thanh trên → không chồng lên nhau.
(() => {
  const E = globalThis.StoryEngine, h = E.h, $ = s => document.querySelector(s);
  let tmr = 0, cur = { n: "", t: "" };
  E.ui.loc = (name, time) => {
    const st = $(".se-stat"); if (!st) return;
    if (name != null) cur.n = name; if (time != null) cur.t = time;
    st.querySelector(".st-n").textContent = cur.n || "";
    st.querySelector(".st-t").textContent = cur.t || "";
    st.classList.add("big"); st.classList.toggle("has", !!cur.n);
    clearTimeout(tmr); tmr = setTimeout(() => st.classList.remove("big"), E.auto ? 1 : 3600);
  };
  E.on("boot", () => {
    const top = $(".se-top"), menu = top?.querySelector("[data-a=menu]");
    if (top && !top.querySelector(".se-stat")) {
      const st = h(`<button class="se-stat" aria-label="${E.esc(E.nat({ en: "Where am I", vi: "Đang ở đâu" }))}"><span class="st-l"><b class="st-n"></b><small class="st-t"></small></span><span class="sp-clock" hidden></span></button>`);
      menu ? menu.after(st) : top.prepend(st);
      st.onclick = e => { e.stopPropagation(); if (cur.n) E.ui.loc(); };
    }
    // nhãn lời suy nghĩ theo ngôn ngữ người chơi (CSS content đọc biến)
    document.querySelector(".se")?.classList.toggle("fit-cover", E.fit() === "cover");
    document.querySelector(".se")?.style.setProperty("--se-think-l", JSON.stringify(E.nat({ en: "You think", vi: "Bạn nghĩ" })));
    // “X sẽ nhớ” + nhân vật mới vào chung cột thông báo
    const tb = $(".se-toast"), mem = $(".se-mem");
    if (tb && mem && !$(".se-lane")) { const lane = h(`<div class="se-lane"></div>`); tb.before(lane); lane.append(mem, tb); }
  });
  // cảnh mới (core ghi vào .se-loc cũ) → chuyển sang viên trạng thái
  const sc = E.ui.scene;
  E.ui.scene = (id, keep) => {
    const loc = $(".se-loc"), before = loc?.dataset.n;
    const ready = sc(id, keep);
    if (loc && loc.dataset.n !== before && loc.classList.contains("in")) { loc.classList.remove("in"); const S = E.S().scenes[id] || {}; E.ui.loc(E.nat(S.name) || "", S.time ? E.nat(S.time) : (E.R().clock?.t || "")); }
    return ready;
  };
  // đồng hồ đổi → giờ trong viên cũng đổi
  E.on("step", type => { if (type === "clock") setTimeout(() => { const t = E.R().clock?.t; cur.t = t || cur.t; $(".se-stat")?.classList.toggle("clk", !!E.R().clock); }, 0); });
})();

// ═════════ HỘP LỜI kiểu visual novel: màu người nói · TỰ CHẠY (auto) ═════════
// · Bảng tên + viền trên hộp lời mang màu nhân vật đang nói (bạn = màu chủ đạo).
// · TỰ CHẠY (người dùng 30/10: bản đầu “chưa ổn”): chờ chữ hiện HẾT + giọng đọc XONG → đếm thời gian đọc (thanh mảnh trên hộp lời chạy hết)
//   → sang câu sau. Chạm màn = sang câu ngay (KHÔNG tắt tự chạy, như Ren'Py). Gặp lựa chọn / câu đố / thẻ sự thật / bảng / sổ tay → tự đứng chờ.
//   Tắt / bật: nút trên hộp lời (nhớ giữa các lần chơi).
(() => {
  const E = globalThis.StoryEngine, h = E.h, $ = s => document.querySelector(s), T = (en, vi) => E.nat({ en, vi });
  let seq = 0, tm = 0, voice = null;
  const box = () => $(".se-box");
  // giọng đọc của câu hiện tại (lời hội thoại / lời dẫn khi bật đọc lời dẫn) — tự chạy chờ đọc xong
  const say0 = E.say;
  E.say = (...a) => { const p = say0(...a); voice = p; return p; };
  const on = () => !!E.G()?.set.autoAdv;
  const busy = () => $(".se-sheet:not([hidden]), .se-rev, .se-read, .se-card:not([hidden]), .se-iv, .se-pop, [data-quick-menu]:not([hidden])");
  const bar = () => { let b = box()?.querySelector(".se-ap"); if (!b && box()) { b = h(`<i class="se-ap"></i>`); box().appendChild(b); } return b; };
  const stopBar = () => { const b = box()?.querySelector(".se-ap"); if (b) { b.style.transition = "none"; b.style.transform = "scaleX(0)"; } };
  const setAuto = v => { E.G().set.autoAdv = !!v; E.save(); $(".se-autob")?.classList.toggle("on", !!v); $(".se")?.classList.toggle("autoing", !!v); if (v) arm(); else { clearTimeout(tm); stopBar(); } };
  async function arm() {
    clearTimeout(tm); stopBar();
    const b = box(); if (!on() || !b || b.hidden || E.auto || E.ui.actionPeekState?.() || $("[data-quick-menu]:not([hidden])")) return;
    const my = seq, v = voice;
    // 1) chữ hiện hết (lớp done do core gắn)
    while (my === seq && !b.classList.contains("done")) await new Promise(r => setTimeout(r, 80));
    // 2) giọng đọc xong (tối đa 30 giây)
    let spoke = false;
    if (v) { const t0 = Date.now(); await Promise.race([v, new Promise(r => setTimeout(r, 30000))]); spoke = Date.now() - t0 > 300; }
    if (my !== seq || !on() || b.hidden) return;
    // 3) thời gian đọc: đã nghe giọng → nghỉ ngắn; không giọng → theo độ dài câu (kèm dòng dịch nếu đang hiện)
    const sp = Math.max(.7, E.G().set.speed || 1), n = (b.querySelector(".se-txt")?.textContent || "").length + (b.querySelector(".se-sub:not([hidden])")?.textContent || "").length * .5;
    const wait = (spoke ? 700 : Math.min(9000, 900 + n * 42)) / sp;
    const pb = bar(); pb.style.transition = "none"; pb.style.transform = "scaleX(0)"; void pb.offsetWidth;
    pb.style.transition = `transform ${wait}ms linear`; pb.style.transform = "scaleX(1)";
    const fire = () => {
      if (my !== seq || !on() || b.hidden) return;
      if (busy() || E.ui.actionPeekState?.()) { tm = setTimeout(fire, 400); return; }
      // Concise narration must not let Auto skip the physical action's end.
      // Manual advance/Skip stays native; reduced motion adds no extra wait.
      if (E.ui.motionState?.()?.running) { tm = setTimeout(fire, 120); return; }
      stopBar(); b.click();
    };
    tm = setTimeout(fire, wait);
  }
  E.on("line", d => {
    seq++; voice = null;
    const b = box(); if (!b) return;
    const ch = d.who === "me" ? null : E.S().chars[d.who];
    b.style.setProperty("--sc", d.kind !== "say" ? "transparent" : d.who === "me" ? "var(--se-ac)" : ch?.color || "#aaa");
    // E.say gọi NGAY SAU sự kiện line → đợi 1 nhịp mới bắt được lời hứa của giọng đọc
    setTimeout(arm, 0);
  });
  E.on("action-peek",active=>{seq++;clearTimeout(tm);stopBar();if(!active&&on())setTimeout(arm,0);});
  E.on("quick-menu",opened=>{seq++;clearTimeout(tm);stopBar();if(!opened&&on())setTimeout(arm,0);});
  E.on("boot", () => {
    const tools = $(".se-tools"); if (!tools || $(".se-autob")) return;
    const bt = h(`<button class="se-autob${on() ? " on" : ""}" aria-label="${E.esc(T("Auto", "Tự chạy"))}"><svg viewBox="0 0 24 24"><path d="M6 5l8 7-8 7zM14 5l8 7-8 7z"/></svg><span>${E.esc(T("Auto", "Tự chạy"))}</span></button>`);
    tools.querySelector(".se-more")?.before(bt);
    bt.addEventListener("click", e => { e.stopPropagation(); setAuto(!on()); E.sfx("tap"); if (on()) E.ui.toast(E.esc(T("Auto on — tap anywhere to skip ahead", "Đã bật tự chạy — chạm màn để sang câu nhanh")), 1600); });
    $(".se")?.classList.toggle("autoing", on());
  });
})();
