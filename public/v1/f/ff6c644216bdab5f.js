/* Enmi caseboard — compact questions, nine-card pages and visible saved connections. */
(() => {
 const E=globalThis.StoryEngine,esc=E.esc,tr=(en,vi)=>E.nat({en,vi});
 const bi=t=>E.ui.readingText?.(t,{compact:true})||'<span>'+esc(E.nat(t))+'</span>';
 const readingToggle=()=>E.ui.readingToggle?.()||'';
 const sameReading=(a,b)=>a===b||!!(a&&b&&typeof a==='object'&&typeof b==='object'&&[...new Set([...Object.keys(a),...Object.keys(b)])].every(k=>a[k]===b[k]));
 const paths={move:'<path d="M12 2v20M2 12h20M8 6l4-4 4 4M8 18l4 4 4-4M6 8l-4 4 4 4M18 8l4 4-4 4"/>',link:'<path d="m9 15 6-6M7 13l-2 2a4 4 0 0 0 6 6l3-3M10 6l3-3a4 4 0 0 1 6 6l-2 2"/>',filter:'<path d="M3 5h18M6 12h12M9 19h6"/><circle cx="8" cy="5" r="2"/><circle cx="15" cy="12" r="2"/>',hint:'<path d="M9 18h6M10 22h4M8 14a6 6 0 1 1 8 0c-1 1-1 2-1 3H9c0-1 0-2-1-3Z"/>',folder:'<path d="M3 5h7l2 3h9v12H3Z"/>',undo:'<path d="m8 4-5 5 5 5M3 9h10a7 7 0 0 1 0 14"/>',fit:'<path d="M8 3H3v5M16 3h5v5M3 16v5h5M21 16v5h-5M8 8h8v8H8Z"/>',plus:'<path d="M5 12h14M12 5v14"/>',minus:'<path d="M5 12h14"/>',close:'<path d="m6 6 12 12M18 6 6 18"/>',check:'<path d="m4 12 5 5L20 6"/>',note:'<path d="M5 3h14v18H5ZM8 8h8M8 12h8M8 16h5"/>',info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7v1"/>',pin:'<path d="m8 3 8 0-1 7 3 3-6 1-6-1 3-3ZM12 14v8"/>',layout:'<path d="M3 3h7v7H3ZM14 3h7v7h-7ZM3 14h7v7H3ZM14 14h7v7h-7Z"/>'};
 const icon=k=>'<svg viewBox="0 0 24 24" aria-hidden="true">'+(paths[k]||paths.note)+'</svg>';
 const flat=t=>typeof t==='string'?t:Object.values(t||{}).filter(v=>typeof v==='string').join(' ');
 const fold=t=>String(t||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d'),unique=a=>[...new Set(a)],clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
 const WIDTH=148,HEIGHT=170,STEP_X=184,STEP_Y=204,PAGE_SIZE=9;
 const columns=n=>n<=6?2:3;
 const gridPosition=(i,n)=>({x:26+(i%columns(n))*STEP_X,y:30+Math.floor(i/columns(n))*STEP_Y});
 // A stable layout is independent of answer order. Existing coordinates win.
 const shuffled=(values,seed)=>{let n=2166136261;for(const ch of seed)n=Math.imul(n^ch.charCodeAt(0),16777619)>>>0;const a=values.slice();for(let i=a.length-1;i>0;i--){n=(Math.imul(n,1664525)+1013904223)>>>0;const j=n%(i+1);[a[i],a[j]]=[a[j],a[i]];}return a;};
 E.def('caseboard',c=>new Promise(resolve=>{
  c.resumeHere?.();
  const B=c.st.caseboard||{},R=E.R(),S=E.S(),links=B.links||[],key=c.key('caseboard');
  const saved=R.used[key],st=R.used[key]=saved&&typeof saved==='object'?saved:{};
  st.edges=Array.isArray(st.edges)?st.edges:[];st.got=Array.isArray(st.got)?st.got:[];
  st.selected=Array.isArray(st.selected)?st.selected.slice(0,1):[];
  st.pos=st.pos&&typeof st.pos==='object'?st.pos:{};st.colors=st.colors||{};st.layers=st.layers&&typeof st.layers==='object'?st.layers:{};st.layerCounter=Math.max(1,...Object.values(st.layers).filter(Number.isFinite));
  st.mode=st.mode==='move'?'move':'connect';st.focus=Number.isInteger(st.focus)?clamp(st.focus,0,3):0;
  st.category=['all','objects','testimony','inference'].includes(st.category)?st.category:st.filter==='fact'?'objects':st.filter==='testimony'?'testimony':'all';
  st.query=typeof st.query==='string'?st.query:'';st.mistakes=Number(st.mistakes)||0;
  st.page=Number.isInteger(st.page)&&st.page>=0?st.page:0;
  st.controlsCollapsed=typeof st.controlsCollapsed==='boolean'?st.controlsCollapsed:true;
  // Layout coordinates may move once when adopting pages. Evidence, wires and
  // earned conclusions never depend on page membership or layout coordinates.
  const needsPageLayout=st.version!==6;st.version=6;
  const need=Math.max(0,Math.min(B.need??links.length,links.length));
  let done=false,shell,viewport,world,wires,observer,frame=0,gesture=null,pinch=null,ignoreClickUntil=0;
  let message='',tone='normal',drawer=false,popup='',viewTools=false,vpSize={w:0,h:0},reading;
  st.hintLevel=Number.isInteger(st.hintLevel)&&st.hintLevel>0?1:0;
  const pointers=new Map(),live=()=>!done&&c.live(),lid=(l,i)=>String(l.id??('L'+i)),pair=(a,b)=>[a,b].sort().join('|');
  const conclusionId=i=>E.caseConclusionId(key,lid(links[i],i));
  const aliases=new Map(links.map((l,i)=>['k:'+lid(l,i),conclusionId(i)]));
  const canonical=id=>aliases.get(id)||id;
  const isConclusion=id=>typeof id==='string'&&(id.startsWith('k:')||E.recordKind(id)==='inference');
  const ids=l=>unique((l.ids||[l.a,l.b]).filter(id=>typeof id==='string'&&id).map(canonical));
  // Author-facing k:<local-id> references keep their meaning on this board.
  // Runtime/save IDs include the board key, so earlier boards can share L0 etc.
  const migrateMap=obj=>{for(const id of Object.keys(obj)){const to=canonical(id);if(to!==id){if(!Object.hasOwn(obj,to))obj[to]=obj[id];delete obj[id];}}};
  [st.pos,st.layers].forEach(migrateMap);
  st.selected=st.selected.map(canonical);if(Array.isArray(st.pinned))st.pinned=st.pinned.map(canonical);
  if(Array.isArray(st.lastPair))st.lastPair=st.lastPair.map(canonical);
  const canonicalEdge=k=>typeof k==='string'&&k.split('|').length===2?k.split('|').map(canonical).sort().join('|'):k;
  st.edges=st.edges.map(canonicalEdge);for(const k of Object.keys(st.colors)){const to=canonicalEdge(k);if(to!==k){st.colors[to]||=st.colors[k];delete st.colors[k];}}
  st.got=unique([...st.got.filter(i=>Number.isInteger(i)&&links[i]),...links.flatMap((l,i)=>E.caseConclusion(conclusionId(i))?[i]:[])]);
  const info=id=>{
   if(typeof id!=='string')return null;id=canonical(id);
   if(id.startsWith('q:')){const q=R.quotes?.[id.slice(2)];return q?{name:{en:E.cname(S.chars[q.who]),vi:E.cname(S.chars[q.who])},desc:q,kind:'testimony',who:q.who}:null;}
   if(id.startsWith('k:')){const i=links.findIndex((l,j)=>conclusionId(j)===id),record=E.caseConclusion(id)||(i>=0&&st.got.includes(i)?links[i]:null);if(!record)return null;const name=record.title||record.label||record.desc||{en:'Recorded conclusion',vi:'Kết luận đã ghi'},desc=record.desc||record.label||record.title;return{...record,name,desc,brief:flat(desc)!==flat(name)?desc:'',kind:'inference',chapter:record.chapter||R.ch||1};}
   return R.items.includes(id)&&S.items[id]?S.items[id]:null;
  };
  const meta=id=>{const it=info(id);if(!it)return{};const supplied=id.startsWith('q:')||id.startsWith('k:')?{}:E.evidenceMeta?.(id)||{},type=isConclusion(id)?'inference':supplied.type||it.recordType||it.kind||'observation';return{...supplied,type,group:type==='inference'?'inference':supplied.group||(type==='testimony'?'testimony':'objects'),who:supplied.who||it.who,chapter:supplied.chapter||it.chapter||1};};
  const conclusions=()=>unique([...E.caseConclusionRecords().map(record=>record.id),...R.items.filter(isConclusion)]).filter(id=>info(id));
  const pool=()=>unique([...R.items,...Object.keys(R.quotes||{}).map(k=>'q:'+k),...conclusions()]).filter(id=>info(id));
  const required=()=>unique(links.flatMap(ids)).filter(id=>info(id)),authored=()=>unique((B.cards||[]).map(canonical)).filter(id=>info(id));
  const sources=id=>{const it=info(id);return unique(it?.sources||[]).map(sourceId=>{const saved=(it.sourceRecords||[]).find(record=>record.id===sourceId),current=info(sourceId),name=current?.name||saved?.name;return name?{id:sourceId,name,available:!!current}:null;}).filter(Boolean);};
  const sourceSummary=id=>{const names=sources(id).map(source=>E.nat(source.name));return names.length?tr('Based on: ','Căn cứ: ')+names.join(' · '):'';};
  const recordArt=(id,size='sm')=>isConclusion(id)?'<span class="cb4-record-icon">'+icon('note')+'</span>':id.startsWith('q:')?'<span class="cb4-record-avatar">'+(meta(id).who?'<i class="im-'+esc(meta(id).who)+'"></i>':'')+'<b>“</b></span>':E.itemArt?.(id,size)||'<span class="cb4-record-icon">'+icon('note')+'</span>';
  const categoryLabel=g=>g==='testimony'?tr('Testimony','Lời khai'):g==='inference'?tr('Inference','Suy luận'):tr('Objects & traces','Vật & dấu vết');
  const focusLabel=n=>[tr('All records','Tất cả hồ sơ'),tr('Nearby context','Cùng bối cảnh'),tr('This investigation','Việc đang điều tra'),tr('This question','Câu hỏi này')][n];
  const relevant=n=>{
   const all=pool();if(n===0)return all;
   const f=B.focus||{},declared=Array.isArray(f)?f[n-1]:f[['recent','case','question'][n-1]];
   let chosen;
   if(Array.isArray(declared))chosen=declared.map(canonical).filter(id=>all.includes(id));
   else if(n===1)chosen=all.filter(id=>meta(id).chapter>=Math.max(1,(R.ch||1)-1));
   else if(n===2)chosen=authored().length?authored():all.slice(-8);
   else chosen=authored().length?authored().slice(0,Math.max(4,required().length+1)):all.slice(-6);
   // Earned conclusions remain visible when a story narrows the evidence scope.
   return unique([...chosen,...required(),...conclusions()]);
  };
  const effective=()=>new Set(relevant(st.focus));
  const ordered=()=>{st.order=unique([...(Array.isArray(st.order)?st.order:[]).filter(id=>st.pinned.includes(id)),...shuffled(st.pinned,key+'|layout-3')]);return st.order;};
  const scoped=()=>{const allowed=effective();return ordered().filter(id=>info(id)&&allowed.has(id));};
  const pageCount=()=>Math.max(1,Math.ceil(scoped().length/PAGE_SIZE));
  const visible=()=>{st.page=clamp(st.page,0,pageCount()-1);return scoped().slice(st.page*PAGE_SIZE,(st.page+1)*PAGE_SIZE);};
  const pageOf=id=>{const i=scoped().indexOf(id);return i<0?null:Math.floor(i/PAGE_SIZE);};
  const pageLabel=id=>{const page=pageOf(id);return page===null?tr('Outside current focus','Ngoài phạm vi đang xem'):tr('Page ','Trang ')+(page+1);};
  // This list comes only from wires the player has already made. Never use
  // authored answer links to suggest an undiscovered partner.
  const savedConnections=id=>st.edges.filter(k=>(!id||k.split('|').includes(id))&&k.split('|').every(x=>info(x)));
  const awayConnections=id=>savedConnections(id).filter(k=>k.split('|').some(x=>x!==id&&pageOf(x)!==st.page));
  const connected=xs=>{const seen=new Set([xs[0]]);let change=true;while(change){change=false;for(const e of st.edges){const[a,b]=e.split('|');if(xs.includes(a)&&xs.includes(b)){if(seen.has(a)&&!seen.has(b)){seen.add(b);change=true;}if(seen.has(b)&&!seen.has(a)){seen.add(a);change=true;}}}}return xs.every(id=>seen.has(id));};
  const colorFor=k=>{if(!st.colors[k]){const n=Object.keys(st.colors).length,p=['#ef907e','#7fc9dd','#e4c96c','#bca5ed','#9bc78a','#edb0d1','#a9badc'];st.colors[k]=p[n]||'hsl('+Math.round((n*137.508)%360)+' 65% 72%)';}return st.colors[k];};
  const remember=(l,i)=>E.recordCaseConclusion(key,lid(l,i),{label:l.label,title:l.title,desc:l.desc,sources:ids(l),sourceRecords:ids(l).map(id=>{const it=info(id);return it?{id,name:it.name,desc:it.desc,kind:it.kind}:null;}).filter(Boolean),chapter:R.ch||1,boardTitle:B.q||B.prompt});
  st.got.forEach(i=>remember(links[i],i));
  st.edges=unique(st.edges.filter(k=>typeof k==='string'&&k.split('|').length===2&&k.split('|').every(id=>info(id))&&links.some(l=>k.split('|').every(id=>ids(l).includes(id)))));
  st.edges.forEach(colorFor);
  if(!Array.isArray(st.pinned)){const base=authored().length?authored():pool().filter(id=>!isConclusion(id)).slice(-6);st.pinned=unique([...base,...required(),...st.edges.flatMap(k=>k.split('|'))]);}
  st.pinned=unique([...st.pinned.filter(id=>info(id)),...conclusions()]);
  const layoutOrder=()=>ordered();
  const ensurePosition=id=>{const p=st.pos[id];if(p&&Number.isFinite(p.x)&&Number.isFinite(p.y))return p;const all=scoped(),i=Math.max(0,all.indexOf(id)),n=Math.min(PAGE_SIZE,all.length-Math.floor(i/PAGE_SIZE)*PAGE_SIZE);return st.pos[id]=gridPosition(i%PAGE_SIZE,n);};
  const arrangePages=(force=false)=>{const all=scoped(),signatures=[];for(let page=0;page<pageCount();page++){const cards=all.slice(page*PAGE_SIZE,(page+1)*PAGE_SIZE),signature=JSON.stringify(cards);signatures.push(signature);if(force||st.layoutPages?.[page]!==signature)cards.forEach((id,i)=>st.pos[id]=gridPosition(i,cards.length));}st.layoutPages=signatures;};
  arrangePages(needsPageLayout);
  const pinConclusions=()=>{for(const id of conclusions())if(!st.pinned.includes(id)){st.pinned.push(id);ensurePosition(id);}};
  const persist=()=>{if(live())E.save();},setMessage=(text,kind='normal')=>{message=text;tone=kind;updateStatus();};
  const btn=(action,k,label,extra='')=>'<button class="cb4-icon" '+action+' aria-label="'+esc(label)+'" title="'+esc(label)+'" '+extra+'>'+icon(k)+'</button>';
  const instruction=()=>st.mode==='move'?tr('Drag a pin to move a card; drag the board to pan.','Kéo ghim để dời thẻ; kéo nền để xem quanh.'):st.selected.length?tr('Choose a second record. You may change pages.','Chọn hồ sơ thứ hai. Có thể chuyển trang.'):tr('Tap two records to connect. Read opens the details.','Chạm hai hồ sơ để nối. Đọc để xem kỹ.');
  const cardHtml=id=>{const it=info(id),m=meta(id),p=ensurePosition(id),sel=st.selected.includes(id),source=sourceSummary(id),away=awayConnections(id).length;return'<article class="cb4-card '+esc(m.group)+(isConclusion(id)?' cb4-earned':'')+(sel?' selected':'')+(away?' cb4-linked-away':'')+'" data-card="'+esc(id)+'" style="left:'+p.x+'px;top:'+p.y+'px;z-index:'+(st.layers[id]||1)+'"><button class="cb4-pin" data-pin="'+esc(id)+'" aria-label="'+esc((st.mode==='move'?tr('Move ','Di chuyển '):tr('Connect ','Nối '))+E.nat(it.name))+'" aria-pressed="'+sel+'"><i></i></button><button class="cb4-select" data-select="'+esc(id)+'" aria-pressed="'+sel+'"><span class="cb4-art">'+recordArt(id)+'</span><span class="cb4-kind">'+esc(categoryLabel(m.group))+'</span><b>'+bi(it.name)+'</b><span class="cb4-brief">'+(it.brief?bi(it.brief):'')+'</span>'+(source?'<span class="cb4-card-sources">'+esc(source)+'</span>':'')+'</button><button class="cb4-read" data-detail="'+esc(id)+'" aria-label="'+esc(tr('Read ','Đọc ')+E.nat(it.name))+'">'+icon('info')+'<span>'+esc(tr('Read','Đọc'))+'</span></button>'+(away?'<button class="cb4-away-links" data-board-links="'+esc(id)+'" aria-label="'+esc(tr('Saved connections outside this page: ','Mối nối đã lưu ngoài trang này: ')+away)+'" title="'+esc(tr('Connections outside this page','Mối nối ngoài trang này'))+'">↗ '+away+'</button>':'')+'</article>';};
  const transform=()=>{if(!world||!st.view)return;if(viewport)st.viewSize={w:viewport.clientWidth,h:viewport.clientHeight};world.style.transform='translate('+st.view.x+'px,'+st.view.y+'px) scale('+st.view.z+')';shell.querySelector('[data-zoom-label]').textContent=Math.round(st.view.z*100)+'%';};
  const bounds=()=>{const v=visible();if(!v.length)return{x:0,y:0,w:360,h:260};const ps=v.map(id=>ensurePosition(id)),x=Math.min(...ps.map(p=>p.x))-20,y=Math.min(...ps.map(p=>p.y))-24;return{x,y,w:Math.max(...ps.map(p=>p.x))+WIDTH+20-x,h:Math.max(...ps.map(p=>p.y))+HEIGHT+20-y};};
  // Automatic layouts keep text legible on a phone; the board can be panned.
  // Only the explicitly requested Fit control zooms out to show every card.
  const fit=(initial=false)=>{if(!viewport)return;const b=bounds(),w=viewport.clientWidth,h=viewport.clientHeight;let z=clamp(Math.min((w-28)/b.w,(h-28)/b.h),.32,1.15);if(initial)z=clamp((w-28)/b.w,columns(visible().length)===2?.7:.85,1);const x=initial&&b.w*z>w-28?14-b.x*z:(w-b.w*z)/2-b.x*z,y=initial&&b.h*z>h-28?14-b.y*z:(h-b.h*z)/2-b.y*z;st.view={x,y,z,user:!initial};transform();persist();};
  const wiresDraw=()=>{
   if(!wires)return;const shown=new Set(visible()),all=st.edges.filter(k=>k.split('|').every(id=>shown.has(id)));
   const right=Math.max(640,...visible().map(id=>ensurePosition(id).x+WIDTH+70)),bottom=Math.max(520,...visible().map(id=>ensurePosition(id).y+HEIGHT+70));
   world.style.width=right+'px';world.style.height=bottom+'px';wires.setAttribute('viewBox','0 0 '+right+' '+bottom);wires.style.width=right+'px';wires.style.height=bottom+'px';
   // Positive screen-space Y lets the thread hang below the chord. Keep the
   // sag bounded so long connections stay readable beside the record cards.
   // Endpoints remain the pin centres; pan/zoom transforms this shared world.
   wires.innerHTML=all.map(k=>{const[a,b]=k.split('|'),p=ensurePosition(a),q=ensurePosition(b),ax=p.x+WIDTH/2,ay=p.y+3,bx=q.x+WIDTH/2,by=q.y+3,col=colorFor(k),sag=Math.min(110,Math.max(28,Math.hypot(bx-ax,by-ay)*.18));return'<g data-edge="'+esc(k)+'" style="--wire:'+col+'"><path d="M'+ax+' '+ay+' Q'+((ax+bx)/2)+' '+((ay+by)/2+sag)+' '+bx+' '+by+'"/><circle cx="'+ax+'" cy="'+ay+'" r="3"/><circle cx="'+bx+'" cy="'+by+'" r="3"/></g>';}).join('');
   if(gesture?.type==='link'&&gesture.moved&&gesture.to){const p=ensurePosition(gesture.id),q=gesture.to;wires.innerHTML+='<path class="cb4-wire-preview" d="M'+(p.x+WIDTH/2)+' '+(p.y+3)+' L'+q.x+' '+q.y+'"/>';}
  };
  function updateStatus(){
   if(!shell)return;const el=shell.querySelector('.cb4-status');el.className='cb4-status '+tone;el.textContent=message||instruction();
   const fin=shell.querySelector('[data-finish]'),ready=st.got.length>=need;fin.disabled=!(ready||B.required===false||pool().length<2);fin.classList.toggle('ready',ready);fin.innerHTML=icon(ready?'check':'link')+'<span>'+esc(ready?tr('Use conclusions','Dùng kết luận'):tr('Continue','Tiếp tục'))+'</span>';
   shell.querySelector('[data-undo]').disabled=!st.edges.length;shell.querySelector('.cb4-scope').textContent=(st.focus?focusLabel(st.focus)+' · ':'')+visible().length+'/'+scoped().length+' '+tr('cards','thẻ');
   shell.querySelector('[data-drawer] b').textContent=pool().length;shell.querySelector('[data-conclusions]').innerHTML=st.got.length+'/'+need+' '+icon('note');shell.querySelectorAll('[data-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.mode===st.mode)));shell.dataset.interactionMode=st.mode;
   const pages=pageCount(),pager=shell.querySelector('.cb4-pages');pager.hidden=pages<=1;
   shell.querySelector('[data-board-page-label]').textContent=(st.page+1)+' / '+pages;
   shell.querySelector('[data-board-page="-1"]').disabled=st.page===0;shell.querySelector('[data-board-page="1"]').disabled=st.page===pages-1;
   const selected=shell.querySelector('.cb4-selected-record'),id=st.selected[0];selected.hidden=!id;
   selected.innerHTML=id?'<button data-board-selection-find title="'+esc(tr('Find the first record; keep this selection','Tìm hồ sơ đầu tiên; giữ lựa chọn'))+'">'+icon('link')+'<span>'+bi(info(id).name)+'<small>'+esc(pageLabel(id))+'</small></span></button><button data-board-selection aria-label="'+esc(tr('Cancel connection selection','Bỏ chọn đầu dây'))+'" title="'+esc(tr('Cancel selection','Bỏ chọn'))+'">'+icon('close')+'</button>':'';
   const connections=shell.querySelector('.cb4-saved-links'),count=savedConnections().length;connections.hidden=!count;connections.querySelector('span').textContent=count;connections.setAttribute('aria-label',tr('Read saved connections: ','Xem các mối nối đã lưu: ')+count);
   shell.dataset.columns=columns(visible().length);shell.dataset.page=st.page+1;
   shell.querySelector('.cb4-controls').hidden=st.controlsCollapsed;shell.querySelector('[data-controls-toggle]').setAttribute('aria-expanded',String(!st.controlsCollapsed));
   reading?.refresh();
  }
  const cardsDraw=()=>{if(!live()||!shell)return;arrangePages();const f=shell.contains(document.activeElement)?document.activeElement:null,k=f?.dataset.select||f?.dataset.pin;st.selected=st.selected.filter(id=>scoped().includes(id)).slice(0,1);world.querySelector('.cb4-cards').innerHTML=visible().map(cardHtml).join('');shell.querySelector('.cb4-empty').hidden=visible().length>0;wiresDraw();updateStatus();if(k)[...world.querySelectorAll(f?.dataset.pin?'[data-pin]':'[data-select]')].find(x=>(x.dataset.pin||x.dataset.select)===k)?.focus({preventScroll:true});};
  const popupDraw=()=>{
   const host=shell.querySelector('.cb4-popover');host.hidden=!popup;shell.querySelector('[data-hint]').setAttribute('aria-expanded',String(popup==='hint'));if(!popup){host.innerHTML='';return;}
   const title=popup==='hint'?tr('A nudge','Một gợi ý'):popup==='attempt'?tr('What this pair leaves open','Cặp này còn thiếu điều gì'):tr('Supported conclusions','Kết luận có căn cứ');
   const defaultHint={en:'Which two records directly answer the question above?',vi:'Hai hồ sơ nào trực tiếp trả lời câu hỏi ở trên?'};
   const hints=[B.nudge||defaultHint,B.hint].filter(Boolean),attempt=(st.lastPair||[]).filter(id=>info(id));
   const review=(B.review?.pairs||[]).find(x=>x.ids?.length===2&&x.ids.every(id=>attempt.includes(canonical(id))))?.text||(B.review?.with||[]).find(x=>attempt.includes(canonical(x.id)))?.text||B.review?.text||defaultHint;
   const content=popup==='hint'?'<div class="cb4-hint">'+bi(hints[Math.min(st.hintLevel,hints.length-1)])+'</div>'+(st.hintLevel<hints.length-1?'<button class="cb4-text-button" data-more-hint>'+esc(tr('More specific hint','Gợi ý cụ thể hơn'))+'</button>':''):popup==='attempt'?'<div class="cb4-attempt-records">'+attempt.map(id=>'<button data-detail="'+esc(id)+'">'+icon('info')+'<span>'+esc(E.nat(info(id).name))+'</span></button>').join('')+'</div><div class="cb4-hint">'+esc(E.nat(review))+'</div><button class="cb4-text-button" data-popup-close>'+esc(tr('Try another connection','Thử mối liên hệ khác'))+'</button>':conclusions().length?conclusions().map(id=>'<article class="cb4-conclusion"><b>'+icon('check')+'</b><div>'+bi(info(id).desc||info(id).name)+'<button class="cb4-text-button" data-detail="'+esc(id)+'">'+esc(sourceSummary(id)||tr('Read conclusion','Đọc kết luận'))+'</button></div></article>').join(''):'<p>'+esc(tr('A valid connection will add its conclusion here and to your casebook.','Mối nối có căn cứ sẽ thêm kết luận ở đây và trong hồ sơ.'))+'</p>';
   host.innerHTML='<header><b>'+esc(title)+'</b>'+btn('data-popup-close','close',tr('Close','Đóng'))+'</header>'+content;host.scrollTop=0;reading?.refresh();
  };
  const drawerIds=()=>{const allowed=effective(),q=fold(st.query);return pool().filter(id=>allowed.has(id)&&(st.category==='all'||meta(id).group===st.category)&&(!q||fold(flat(info(id).name)+' '+flat(info(id).desc)+' '+flat(info(id).brief)).includes(q)));};
  const drawerRows=()=>{
   const list=shell.querySelector('.cb4-drawer-list');if(!list)return;const shown=drawerIds();
   list.innerHTML=shown.length?shown.map(id=>{const it=info(id),m=meta(id),p=st.pinned.includes(id),earned=isConclusion(id),linked=st.edges.some(k=>k.split('|').includes(id));return'<article class="cb4-drawer-record '+esc(m.group)+'"><button data-detail="'+esc(id)+'" class="cb4-drawer-read">'+recordArt(id)+'<span><small>'+esc(categoryLabel(m.group))+'</small><b>'+esc(E.nat(it.name))+'</b><em>'+esc(it.brief?E.nat(it.brief):sourceSummary(id))+'</em></span></button><button class="cb4-icon '+(p?'active':'')+'" data-pin-card="'+esc(id)+'" '+(p&&(linked||earned)?'disabled':'')+' aria-label="'+esc((earned?tr('Recorded conclusion: ','Kết luận đã ghi: '):p?tr('Put away ','Cất '):tr('Pin ','Ghim '))+E.nat(it.name))+'" title="'+esc(earned?tr('Recorded conclusions stay on the board.','Kết luận đã ghi luôn ở trên bảng.'):p&&linked?tr('Undo its connections before putting this card away.','Gỡ dây nối trước khi cất thẻ này.'):p?tr('Put away','Cất thẻ'):tr('Pin to board','Ghim lên bảng'))+'">'+icon(p?'check':'pin')+'</button></article>';}).join(''):'<p class="cb4-no-results">'+esc(tr('No records match. Clear the search or widen the focus.','Không có hồ sơ phù hợp. Xóa từ tìm hoặc mở rộng bộ lọc.'))+'</p>';
   shell.querySelector('[data-drawer-count]').textContent=shown.length+'/'+pool().length;
  };
  const drawerDraw=()=>{
   const host=shell.querySelector('.cb4-drawer');host.hidden=!drawer;shell.querySelector('[data-drawer]').setAttribute('aria-expanded',String(drawer));if(!drawer)return;
   host.innerHTML='<header><h3>'+esc(tr('Evidence drawer','Ngăn hồ sơ'))+' <small data-drawer-count></small></h3>'+btn('data-drawer-close','close',tr('Close evidence drawer','Đóng ngăn hồ sơ'))+'</header><div class="cb4-drawer-tabs" role="group" aria-label="'+esc(tr('Record category','Loại hồ sơ'))+'">'+['all','objects','testimony','inference'].map(g=>'<button data-category="'+g+'" aria-pressed="'+(st.category===g)+'">'+esc(g==='all'?tr('All','Tất cả'):categoryLabel(g))+'</button>').join('')+'</div><div class="cb4-search"><input type="search" data-record-search aria-label="'+esc(tr('Search records','Tìm hồ sơ'))+'" placeholder="'+esc(tr('Name or detail · EN / VI','Tên hoặc chi tiết · EN / VI'))+'" value="'+esc(st.query)+'" autocomplete="off"><button data-clear-search class="cb4-icon" aria-label="'+esc(tr('Clear search','Xóa từ tìm'))+'">'+icon('close')+'</button></div><label class="cb4-drawer-scope">'+esc(tr('Scope','Phạm vi'))+'<select data-board-focus>'+[0,1,2,3].map(n=>'<option value="'+n+'"'+(n===st.focus?' selected':'')+'>'+esc(focusLabel(n))+'</option>').join('')+'</select></label><div class="cb4-drawer-list"></div>';drawerRows();
  };
  const mount=()=>{
   E.ui.hideBox();
   const head='<header class="cb4-head"><div class="cb4-eyebrow"><span>'+esc(tr('QUESTION','CÂU HỎI'))+'</span><div class="cb4-head-actions">'+readingToggle()+'<button class="cb4-progress" data-conclusions aria-label="'+esc(tr('Read supported conclusions','Đọc các kết luận có căn cứ'))+'"></button>'+btn('data-controls-toggle','filter',tr('Show or hide board controls','Mở hoặc thu gọn điều chỉnh bảng'))+'</div></div><h2>'+bi(B.prompt||B.q||{en:'What do the records establish?',vi:'Các hồ sơ xác lập được điều gì?'})+'</h2></header>';
   const tool=(action,k,label,count=false)=>'<button class="cb4-icon cb4-tool" '+action+' aria-label="'+esc(label)+'">'+icon(k)+'<span>'+esc(label)+'</span>'+(count?'<b></b>':'')+'</button>';
   const toolbar='<nav class="cb4-toolbar" aria-label="'+esc(tr('Board controls','Điều khiển bảng'))+'"><div class="cb4-modes" role="group" aria-label="'+esc(tr('Interaction mode','Chế độ thao tác'))+'"><button data-mode="move">'+icon('move')+'<span>'+esc(tr('Move','Di chuyển'))+'</span></button><button data-mode="connect">'+icon('link')+'<span>'+esc(tr('Connect','Nối dây'))+'</span></button></div>'+tool('data-board-tools aria-expanded="false"','fit',tr('View','Bảng'))+tool('data-hint','hint',tr('Hint','Gợi ý'))+tool('data-drawer','folder',tr('Records','Hồ sơ'),true)+'</nav><nav class="cb4-view-tools" aria-label="'+esc(tr('Zoom and arrange','Phóng và xếp bảng'))+'" hidden><div class="cb4-zoom">'+btn('data-zoom-out','minus',tr('Zoom out','Thu nhỏ'))+btn('data-fit','fit',tr('Fit all pinned cards','Xem toàn bộ thẻ'))+btn('data-zoom-in','plus',tr('Zoom in','Phóng to'))+'<small data-zoom-label></small></div>'+btn('data-arrange','layout',tr('Arrange cards neatly','Xếp thẻ gọn lại'))+'</nav>';
   E.ui.panel('<section class="cb4-root">'+head+'<div class="cb4-controls">'+toolbar+'<p class="cb4-scope"></p></div><div class="cb4-page-row"><nav class="cb4-pages" aria-label="'+esc(tr('Board pages','Các trang bảng'))+'"><button data-board-page="-1" aria-label="'+esc(tr('Previous page','Trang trước'))+'">‹</button><span data-board-page-label role="status"></span><button data-board-page="1" aria-label="'+esc(tr('Next page','Trang sau'))+'">›</button></nav><button class="cb4-saved-links" data-board-links="" hidden title="'+esc(tr('Saved connections','Mối nối đã lưu'))+'">'+icon('link')+'<span></span></button><div class="cb4-selected-record" hidden></div></div><div class="cb4-viewport" role="group" aria-label="'+esc(tr('Movable investigation board','Bảng điều tra có thể kéo'))+'"><div class="cb4-world"><svg class="cb4-wires" aria-hidden="true"></svg><div class="cb4-cards"></div></div><p class="cb4-empty" hidden>'+esc(tr('Pin a record from the drawer to begin.','Ghim một hồ sơ để bắt đầu.'))+'</p><aside class="cb4-popover" role="status" aria-live="polite" hidden></aside></div><footer class="cb4-footer"><p class="cb4-status" role="status" aria-live="polite"></p><div>'+btn('data-undo','undo',tr('Undo the last wire','Gỡ dây cuối'))+'<button class="cb4-finish" data-finish></button></div></footer><section class="cb4-drawer" aria-label="'+esc(tr('Evidence drawer','Ngăn hồ sơ'))+'" hidden></section></section>','caseboard');
   shell=document.querySelector('.cb4-root');viewport=shell.querySelector('.cb4-viewport');world=shell.querySelector('.cb4-world');wires=shell.querySelector('.cb4-wires');reading=E.ui.bindReading?.(shell);cardsDraw();popupDraw();drawerDraw();
   if(needsPageLayout||!st.view||![st.view.x,st.view.y,st.view.z].every(Number.isFinite))fit(true);else{
    st.view.z=clamp(st.view.z,.32,1.6);
    // Saved pan coordinates belong to the viewport they were measured in.
    // The mobile header settles after reload; without this reference its
    // first resize offsets an already-centred saved board a second time.
    const prev=st.viewSize,w=viewport.clientWidth,h=viewport.clientHeight;
    if(prev&&Number.isFinite(prev.w)&&Number.isFinite(prev.h)&&prev.w>0&&prev.h>0&&(prev.w!==w||prev.h!==h)){
     if(st.view.user){st.view.x+=(w-prev.w)/2;st.view.y+=(h-prev.h)/2;}else fit(true);
    }
    transform();
   }
   vpSize={w:viewport.clientWidth,h:viewport.clientHeight};
   shell.addEventListener('click',onClick);shell.addEventListener('input',onInput);shell.addEventListener('change',onChange);shell.addEventListener('keydown',onKey);
   viewport.addEventListener('pointerdown',onDown);viewport.addEventListener('pointermove',onMove);viewport.addEventListener('pointerup',onUp);viewport.addEventListener('pointercancel',onCancel);viewport.addEventListener('wheel',onWheel,{passive:false});
   if(globalThis.ResizeObserver){observer=new ResizeObserver(()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{if(!live()||!st.view)return;const w=viewport.clientWidth,h=viewport.clientHeight;if(w===vpSize.w&&h===vpSize.h)return;if(st.view.user){st.view.x+=(w-vpSize.w)/2;st.view.y+=(h-vpSize.h)/2;transform();}else fit(true);vpSize={w,h};wiresDraw();persist();});});observer.observe(viewport);}persist();
  };
  const finish=ok=>{if(!live())return;c.resumeHere?.(false);done=true;if(B[ok?'ok':'fail'])c.push('caseboard',ok?'ok':'fail');E.save();E.ui.clear();resolve();};
  const connect=(a,b)=>{
   if(!live()||!a||!b||a===b||!info(a)||!info(b))return;st.selected=[];const k=pair(a,b);
   if(st.edges.includes(k)){setMessage(tr('That connection is already on the board.','Mối nối này đã có trên bảng.'));cardsDraw();return;}
   if(!links.some(l=>ids(l).includes(a)&&ids(l).includes(b))){st.mistakes++;st.lastPair=[a,b];popup='attempt';setMessage(tr('This pair leaves the question open. Review the two records.','Cặp này chưa trả lời được câu hỏi. Hãy đối chiếu lại hai hồ sơ.'),'wrong');E.sfx('wrong');persist();cardsDraw();popupDraw();return;}
   st.edges.push(k);colorFor(k);const unlocked=[];
   links.forEach((l,i)=>{if(!st.got.includes(i)&&ids(l).every(id=>info(id))&&connected(ids(l))){st.got.push(i);unlocked.push(i);remember(l,i);E.apply(l);for(const id of l.gives||[]){if(id.startsWith('q:')){const q=S.quotes?.[id.slice(2)];if(q)E.addQuote(id.slice(2),q);}else if(S.items[id]&&!R.items.includes(id)){R.items.push(id);E.emit('item',id);}}}});
   pinConclusions();arrangePages();
   if(unlocked.length)st.page=Math.max(0,Math.floor(scoped().indexOf(conclusionId(unlocked[0]))/PAGE_SIZE));
   if(unlocked.length){setMessage(tr('Conclusion recorded and pinned to the board.','Đã ghi kết luận và ghim lên bảng.'),'success');E.sfx('solve');popup='conclusions';}else{setMessage(tr('A supported connection has been added.','Đã thêm một mối nối có căn cứ.'),'success');E.sfx('pick');}
   const reactions=unlocked.filter(i=>links[i].then);
   if(reactions.length){c.again();for(const i of reactions.reverse())c.push('caseboard','links',i,'then');c.resumeHere?.(false);E.save();done=true;E.ui.clear();resolve();return;}
   persist();cardsDraw();if(unlocked.length)fit(true);popupDraw();if(drawer)drawerRows();
  };
  const select=id=>{if(!live()||!info(id))return;if(st.mode==='move'){setMessage(tr('Drag this card to move it, or use Read for its full record.','Kéo thẻ này để di chuyển, hoặc bấm Đọc để xem đầy đủ.'));return;}popup='';popupDraw();message='';tone='normal';if(st.selected[0]===id)st.selected=[];else if(st.selected.length)return connect(st.selected[0],id);else st.selected=[id];persist();cardsDraw();};
  const centerCard=id=>{const index=scoped().indexOf(id);if(index>=0)st.page=Math.floor(index/PAGE_SIZE);cardsDraw();const p=ensurePosition(id),z=Math.max(.85,st.view.z);st.view={x:viewport.clientWidth/2-(p.x+WIDTH/2)*z,y:viewport.clientHeight/2-(p.y+HEIGHT/2)*z,z,user:true};transform();};
  const findRecord=id=>{if(!live()||!info(id))return;if(!effective().has(id))st.focus=0;popup='';popupDraw();drawer=false;drawerDraw();centerCard(id);persist();world.querySelector('[data-select="'+CSS.escape(id)+'"]')?.focus({preventScroll:true});};
  const connectionsSheet=id=>{
   const edges=savedConnections(id);if(!live()||!edges.length)return;
   const sh=E.ui.sheet(tr('Saved connections','Mối nối đã lưu'),'<section class="se-board-connections">'+readingToggle()+'<p>'+esc(tr('Choose a record to find it on the board.','Chọn hồ sơ để tìm lại trên bảng.'))+'</p><ol>'+edges.map(k=>'<li>'+k.split('|').map(x=>'<button data-cb-locate="'+esc(x)+'"><span>'+bi(info(x).name)+'</span><small>'+esc(pageLabel(x))+'</small></button>').join('<span class="se-board-connection-symbol" aria-hidden="true">↔</span>')+'</li>').join('')+'</ol></section>');
   E.ui.bindReading?.(sh,{native:reading?.native});
   sh.querySelectorAll('[data-cb-locate]').forEach(button=>button.onclick=()=>{if(!live())return;E.ui.closeSheet();findRecord(button.dataset.cbLocate);});
  };
  const detail=id=>{
   const it=info(id);if(!it||!live())return;const m=meta(id),sourceList=sources(id),sh=E.ui.sheet(tr('Evidence record','Ghi chép chứng cứ'),'<section class="cb4-record-detail">'+readingToggle()+'<div class="cb4-record-large">'+recordArt(id,'lg')+'</div><small>'+esc(categoryLabel(m.group))+'</small>'+(it.boardTitle?'<section class="se-board-record-question"><small>'+esc(tr('Question','Câu hỏi'))+'</small>'+bi(it.boardTitle)+'</section>':'')+'<h3>'+bi(it.name)+'</h3>'+(it.desc&&!sameReading(it.name,it.desc)?'<div>'+bi(it.desc)+'</div>':'')+(it.source?'<p class="cb4-record-source">'+bi(it.source)+'</p>':'')+(sourceList.length?'<section class="cb4-conclusion-sources"><h4>'+esc(tr('Supporting records','Hồ sơ làm căn cứ'))+'</h4>'+sourceList.map(source=>source.available?'<button class="se-btn" data-cb-source="'+esc(source.id)+'">'+bi(source.name)+'</button>':'<p>'+bi(source.name)+'</p>').join('')+'</section>':'')+'<button class="se-btn wide" data-cb-listen>'+esc(tr('Listen in English','Nghe tiếng Anh'))+'</button><button class="se-btn wide" data-cb-pin>'+icon('pin')+' '+esc(st.pinned.includes(id)?tr('Find on board','Tìm trên bảng'):tr('Pin to board','Ghim lên bảng'))+'</button></section>');
   E.ui.bindReading?.(sh);
   sh.querySelector('[data-cb-listen]').onclick=()=>{if(live())E.say(E.tgt(it.desc),m.who||'narr',{force:true,lang:E.L});};
   sh.querySelectorAll('[data-cb-source]').forEach(button=>button.onclick=()=>detail(button.dataset.cbSource));
   sh.querySelector('[data-cb-pin]').onclick=()=>{if(!live())return;if(!st.pinned.includes(id)){st.pinned.push(id);ensurePosition(id);}if(!effective().has(id))st.focus=0;E.ui.closeSheet();cardsDraw();centerCard(id);persist();};
  };
  const setFocus=n=>{st.focus=n;st.page=0;st.selected=[];popup='';popupDraw();message=tr('Focus: ','Thu gọn: ')+focusLabel(n);tone='normal';cardsDraw();if(drawer)drawerDraw();fit(true);persist();};
  const point=(x,y)=>{const r=viewport.getBoundingClientRect();return{x:x-r.left-viewport.clientLeft,y:y-r.top-viewport.clientTop};};
  const zoom=(factor,at)=>{const p=at||{x:viewport.clientWidth/2,y:viewport.clientHeight/2},z=clamp(st.view.z*factor,.32,1.6),wx=(p.x-st.view.x)/st.view.z,wy=(p.y-st.view.y)/st.view.z;st.view={x:p.x-wx*z,y:p.y-wy*z,z,user:true};transform();};
  function onClick(e){
   if(!live())return;const t=e.target;
   // pointerup may replace a card with a conclusion popover. The synthetic
   // click from that same tap must not activate the new content underneath.
   if(t.closest('.cb4-viewport')&&performance.now()<ignoreClickUntil&&e.detail!==0)return;
   const mode=t.closest('[data-mode]');if(mode){st.mode=mode.dataset.mode;st.selected=[];message='';tone='normal';cardsDraw();persist();return;}
   if(t.closest('[data-controls-toggle]')){st.controlsCollapsed=!st.controlsCollapsed;updateStatus();persist();return;}
   const page=t.closest('[data-board-page]');if(page){st.page=clamp(st.page+Number(page.dataset.boardPage),0,pageCount()-1);popup='';popupDraw();message='';cardsDraw();fit(true);persist();return;}
   if(t.closest('[data-board-selection-find]')){if(st.selected[0])findRecord(st.selected[0]);return;}
   const savedLinks=t.closest('[data-board-links]');if(savedLinks)return connectionsSheet(savedLinks.dataset.boardLinks);
   if(t.closest('[data-board-selection]')){st.selected=[];cardsDraw();persist();return;}
   if(t.closest('[data-board-tools]')){viewTools=!viewTools;shell.querySelector('.cb4-view-tools').hidden=!viewTools;shell.querySelector('[data-board-tools]').setAttribute('aria-expanded',String(viewTools));return;}
   if(t.closest('[data-hint]')){popup=popup==='hint'?'':'hint';popupDraw();return;}
   if(t.closest('[data-more-hint]')){st.hintLevel=1;popupDraw();persist();return;}
   if(t.closest('[data-conclusions]')){popup=popup==='conclusions'?'':'conclusions';popupDraw();return;}
   if(t.closest('[data-popup-close]')){popup='';popupDraw();return;}
   if(t.closest('[data-drawer]')){drawer=!drawer;popup='';popupDraw();drawerDraw();return;}
   if(t.closest('[data-drawer-close]')){drawer=false;drawerDraw();shell.querySelector('[data-drawer]').focus({preventScroll:true});return;}
   const cat=t.closest('[data-category]');if(cat){st.category=cat.dataset.category;shell.querySelectorAll('[data-category]').forEach(b=>b.setAttribute('aria-pressed',String(b===cat)));drawerRows();persist();return;}
   if(t.closest('[data-clear-search]')){st.query='';shell.querySelector('[data-record-search]').value='';drawerRows();persist();return;}
   const rec=t.closest('[data-detail]');if(rec)return detail(rec.dataset.detail);
   const pin=t.closest('[data-pin-card]');if(pin){const id=pin.dataset.pinCard;if(st.pinned.includes(id)){if(isConclusion(id)||st.edges.some(k=>k.split('|').includes(id)))return;st.pinned=st.pinned.filter(x=>x!==id);}else{st.pinned.push(id);ensurePosition(id);}cardsDraw();drawerRows();persist();return;}
   const card=t.closest('[data-select],[data-pin]');if(card)return select(card.dataset.select||card.dataset.pin);
   if(t.closest('[data-fit]'))return fit(false);if(t.closest('[data-zoom-in]')){zoom(1.2);persist();return;}if(t.closest('[data-zoom-out]')){zoom(1/1.2);persist();return;}
   if(t.closest('[data-arrange]')){const arranged=layoutOrder().filter(id=>visible().includes(id));arranged.forEach((id,i)=>st.pos[id]=gridPosition(i,arranged.length));cardsDraw();fit(true);persist();return;}
   if(t.closest('[data-undo]')){if(!st.edges.length)return;st.edges.pop();setMessage(tr('Wire removed. Recorded conclusions stay in your casebook.','Đã gỡ dây. Kết luận đã ghi vẫn nằm trong hồ sơ.'));persist();cardsDraw();return;}
   if(t.closest('[data-finish]')&&!t.closest('[data-finish]').disabled)return finish(st.got.length>=need);
  }
  function onInput(e){if(!live()||!e.target.matches('[data-record-search]'))return;st.query=e.target.value;drawerRows();persist();}
  function onChange(e){if(live()&&e.target.matches('[data-board-focus]'))setFocus(clamp(+e.target.value,0,3));}
  function onKey(e){
   if(!live())return;if(e.key==='Escape'){st.selected=[];popup='';drawer=false;message='';popupDraw();drawerDraw();cardsDraw();persist();return;}
   const card=e.target.closest('[data-card]');if(st.mode==='move'&&card&&['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)){e.preventDefault();const p=ensurePosition(card.dataset.card),n=e.shiftKey?24:8;p.x+=e.key==='ArrowLeft'?-n:e.key==='ArrowRight'?n:0;p.y+=e.key==='ArrowUp'?-n:e.key==='ArrowDown'?n:0;card.style.left=p.x+'px';card.style.top=p.y+'px';wiresDraw();persist();}
  }
  function onDown(e){
   if(!live()||e.button>0)return;
   // A fresh deliberate tap is allowed immediately, including closing the
   // just-opened popover. Only the prior pointerup's trailing click is blocked.
   ignoreClickUntil=0;
   if(e.target.closest('.cb4-zoom,.cb4-popover,[data-detail],[data-board-links]'))return;
   pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});try{viewport.setPointerCapture(e.pointerId);}catch{}
   if(pointers.size===2){if(gesture?.type==='card'){st.pos[gesture.id]={...gesture.origin};cardsDraw();}const ps=[...pointers.values()],m=point((ps[0].x+ps[1].x)/2,(ps[0].y+ps[1].y)/2);pinch={distance:Math.hypot(ps[0].x-ps[1].x,ps[0].y-ps[1].y),view:{...st.view},world:{x:(m.x-st.view.x)/st.view.z,y:(m.y-st.view.y)/st.view.z}};gesture=null;wiresDraw();e.preventDefault();return;}
   if(pointers.size>2)return;const card=e.target.closest('[data-card]'),pin=e.target.closest('[data-pin]'),type=pin?(st.mode==='move'?'card':'link'):'pan';
   if(card){st.layers[card.dataset.card]=++st.layerCounter;card.style.zIndex=st.layerCounter;}gesture={type,id:card?.dataset.card,pointer:e.pointerId,x:e.clientX,y:e.clientY,moved:false,origin:type==='card'?{...ensurePosition(card.dataset.card)}:{...st.view}};if(type==='card')card.classList.add('dragging');
  }
  function onMove(e){
   if(!live()||!pointers.has(e.pointerId))return;pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
   if(pinch&&pointers.size>=2){e.preventDefault();const ps=[...pointers.values()],m=point((ps[0].x+ps[1].x)/2,(ps[0].y+ps[1].y)/2),d=Math.hypot(ps[0].x-ps[1].x,ps[0].y-ps[1].y),z=clamp(pinch.view.z*d/Math.max(1,pinch.distance),.32,1.6);st.view={x:m.x-pinch.world.x*z,y:m.y-pinch.world.y*z,z,user:true};transform();ignoreClickUntil=performance.now()+350;return;}
   if(!gesture||gesture.pointer!==e.pointerId)return;const dx=e.clientX-gesture.x,dy=e.clientY-gesture.y;if(Math.hypot(dx,dy)>7)gesture.moved=true;if(!gesture.moved)return;e.preventDefault();
   if(gesture.type==='card'){const p=st.pos[gesture.id]={x:gesture.origin.x+dx/st.view.z,y:gesture.origin.y+dy/st.view.z},card=[...world.querySelectorAll('[data-card]')].find(x=>x.dataset.card===gesture.id);if(card){card.style.left=p.x+'px';card.style.top=p.y+'px';}wiresDraw();}
   else if(gesture.type==='pan'){st.view={...gesture.origin,x:gesture.origin.x+dx,y:gesture.origin.y+dy,user:true};transform();}
   else{const p=point(e.clientX,e.clientY);gesture.to={x:(p.x-st.view.x)/st.view.z,y:(p.y-st.view.y)/st.view.z};world.querySelectorAll('[data-card]').forEach(x=>x.classList.toggle('link-target',x===document.elementFromPoint(e.clientX,e.clientY)?.closest('[data-card]')&&x.dataset.card!==gesture.id));wiresDraw();}
  }
  function onUp(e){
   if(!live())return;pointers.delete(e.pointerId);try{viewport.releasePointerCapture(e.pointerId);}catch{}
   if(pinch){if(pointers.size<2){pinch=null;gesture=null;pointers.clear();ignoreClickUntil=performance.now()+350;persist();}return;}
   const g=gesture;gesture=null;world.querySelectorAll('.dragging,.link-target').forEach(x=>x.classList.remove('dragging','link-target'));wiresDraw();if(!g||g.pointer!==e.pointerId)return;
   if(g.moved){ignoreClickUntil=performance.now()+400;if(g.type==='link'){const t=document.elementFromPoint(e.clientX,e.clientY)?.closest('[data-card]');if(t&&world.contains(t)&&t.dataset.card!==g.id)connect(g.id,t.dataset.card);else setMessage(tr('Release on a second record, or tap two records to connect.','Thả trên hồ sơ thứ hai, hoặc chạm lần lượt hai hồ sơ để nối.'));}persist();}
   else if(g.id){ignoreClickUntil=performance.now()+350;select(g.id);}
  }
  function onCancel(e){pointers.delete(e.pointerId);if(pinch){st.view={...pinch.view};pinch=null;transform();}if(gesture){if(gesture.type==='card')st.pos[gesture.id]={...gesture.origin};else if(gesture.type==='pan')st.view={...gesture.origin};}gesture=null;pointers.clear();ignoreClickUntil=performance.now()+350;cardsDraw();transform();persist();}
  function onWheel(e){if(!live()||e.target.closest('.cb4-popover'))return;e.preventDefault();zoom(e.deltaY<0?1.08:1/1.08,point(e.clientX,e.clientY));persist();}
  c.onExit?.(()=>{done=true;reading?.dispose();observer?.disconnect();cancelAnimationFrame(frame);if(gesture?.type==='card')st.pos[gesture.id]={...gesture.origin};gesture=null;pinch=null;pointers.clear();if(viewport){viewport.removeEventListener('pointerdown',onDown);viewport.removeEventListener('pointermove',onMove);viewport.removeEventListener('pointerup',onUp);viewport.removeEventListener('pointercancel',onCancel);viewport.removeEventListener('wheel',onWheel);}shell?.removeEventListener('click',onClick);shell?.removeEventListener('input',onInput);shell?.removeEventListener('change',onChange);shell?.removeEventListener('keydown',onKey);});
  mount();
  E.autoRun(()=>{for(const l of links){const xs=ids(l).filter(id=>info(id));for(let i=1;i<xs.length;i++){connect(xs[0],xs[i]);if(!live())return;}}finish(st.got.length>=need);});
 }));
})();

