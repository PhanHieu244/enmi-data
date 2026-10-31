/* Enmi caseboard 0.4 — movable evidence, deliberate connections, current-run facts. */
(() => {
 const E=globalThis.StoryEngine,esc=E.esc,tr=(en,vi)=>E.nat({en,vi});
 const bi=t=>'<span lang="'+esc(E.L)+'">'+esc(E.tgt(t))+'</span>'+(E.G().set.tr&&E.sub(t)?'<small lang="'+esc(E.N)+'">'+esc(E.sub(t))+'</small>':'');
 const paths={move:'<path d="M12 2v20M2 12h20M8 6l4-4 4 4M8 18l4 4 4-4M6 8l-4 4 4 4M18 8l4 4-4 4"/>',link:'<path d="m9 15 6-6M7 13l-2 2a4 4 0 0 0 6 6l3-3M10 6l3-3a4 4 0 0 1 6 6l-2 2"/>',filter:'<path d="M3 5h18M6 12h12M9 19h6"/><circle cx="8" cy="5" r="2"/><circle cx="15" cy="12" r="2"/>',hint:'<path d="M9 18h6M10 22h4M8 14a6 6 0 1 1 8 0c-1 1-1 2-1 3H9c0-1 0-2-1-3Z"/>',folder:'<path d="M3 5h7l2 3h9v12H3Z"/>',undo:'<path d="m8 4-5 5 5 5M3 9h10a7 7 0 0 1 0 14"/>',fit:'<path d="M8 3H3v5M16 3h5v5M3 16v5h5M21 16v5h-5M8 8h8v8H8Z"/>',plus:'<path d="M5 12h14M12 5v14"/>',minus:'<path d="M5 12h14"/>',close:'<path d="m6 6 12 12M18 6 6 18"/>',check:'<path d="m4 12 5 5L20 6"/>',note:'<path d="M5 3h14v18H5ZM8 8h8M8 12h8M8 16h5"/>',info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7v1"/>',pin:'<path d="m8 3 8 0-1 7 3 3-6 1-6-1 3-3ZM12 14v8"/>',layout:'<path d="M3 3h7v7H3ZM14 3h7v7h-7ZM3 14h7v7H3ZM14 14h7v7h-7Z"/>'};
 const icon=k=>'<svg viewBox="0 0 24 24" aria-hidden="true">'+(paths[k]||paths.note)+'</svg>';
 const flat=t=>typeof t==='string'?t:Object.values(t||{}).filter(v=>typeof v==='string').join(' ');
 const fold=t=>String(t||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d'),unique=a=>[...new Set(a)],clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
 const WIDTH=148,HEIGHT=170;
 E.def('caseboard',c=>new Promise(resolve=>{
  c.resumeHere?.();
  const B=c.st.caseboard||{},R=E.R(),S=E.S(),links=B.links||[],key=c.key('caseboard');
  const saved=R.used[key],st=R.used[key]=saved&&typeof saved==='object'?saved:{};
  st.edges=Array.isArray(st.edges)?st.edges:[];st.got=Array.isArray(st.got)?st.got:[];
  st.selected=Array.isArray(st.selected)?st.selected.slice(0,1):[];
  st.pos=st.pos&&typeof st.pos==='object'?st.pos:{};st.colors=st.colors||{};st.layers=st.layers&&typeof st.layers==='object'?st.layers:{};st.layerCounter=Math.max(1,...Object.values(st.layers).filter(Number.isFinite));
  st.mode=st.mode==='move'?'move':'connect';st.focus=Number.isInteger(st.focus)?clamp(st.focus,0,3):0;
  st.category=['all','objects','testimony','inference'].includes(st.category)?st.category:st.filter==='fact'?'objects':st.filter==='testimony'?'testimony':'all';
  st.query=typeof st.query==='string'?st.query:'';st.mistakes=Number(st.mistakes)||0;st.version=4;
  const need=Math.max(0,Math.min(B.need??links.length,links.length));
  let done=false,shell,viewport,world,wires,observer,frame=0,gesture=null,pinch=null,ignoreClickUntil=0;
  let message='',tone='normal',drawer=false,popup='',vpSize={w:0,h:0};
  const pointers=new Map(),live=()=>!done&&c.live(),lid=(l,i)=>String(l.id??('L'+i)),ids=l=>unique(l.ids||[l.a,l.b]).filter(Boolean),pair=(a,b)=>[a,b].sort().join('|');
  const info=id=>{
   if(id.startsWith('q:')){const q=R.quotes?.[id.slice(2)];return q?{name:{en:E.cname(S.chars[q.who]),vi:E.cname(S.chars[q.who])},desc:q,kind:'testimony',who:q.who}:null;}
   if(id.startsWith('k:')){const i=links.findIndex((l,j)=>lid(l,j)===id.slice(2));return i>=0&&st.got.includes(i)?{name:{en:'Conclusion '+(i+1),vi:'Kết luận '+(i+1)},desc:links[i].label,kind:'inference',chapter:R.ch}:null;}
   return R.items.includes(id)&&S.items[id]?S.items[id]:null;
  };
  const meta=id=>{const it=info(id);if(!it)return{};const supplied=id.startsWith('q:')||id.startsWith('k:')?{}:E.evidenceMeta?.(id)||{},type=supplied.type||it.recordType||it.kind||'observation';return{...supplied,type,group:supplied.group||(type==='testimony'?'testimony':type==='inference'?'inference':'objects'),who:supplied.who||it.who,chapter:supplied.chapter||it.chapter||1};};
  const pool=()=>unique([...R.items,...Object.keys(R.quotes||{}).map(k=>'q:'+k),...st.got.map(i=>'k:'+lid(links[i],i))]).filter(id=>info(id));
  const required=()=>unique(links.flatMap(ids)).filter(id=>info(id)),authored=()=>unique(B.cards||[]).filter(id=>info(id));
  const recordArt=(id,size='sm')=>id.startsWith('k:')?'<span class="cb4-record-icon">'+icon('note')+'</span>':id.startsWith('q:')?'<span class="cb4-record-avatar">'+(meta(id).who?'<i class="im-'+esc(meta(id).who)+'"></i>':'')+'<b>“</b></span>':E.itemArt?.(id,size)||'<span class="cb4-record-icon">'+icon('note')+'</span>';
  const categoryLabel=g=>g==='testimony'?tr('Testimony','Lời khai'):g==='inference'?tr('Inference','Suy luận'):tr('Objects & traces','Vật & dấu vết');
  const focusLabel=n=>[tr('All records','Tất cả hồ sơ'),tr('Nearby context','Cùng bối cảnh'),tr('This investigation','Việc đang điều tra'),tr('This question','Câu hỏi này')][n];
  const relevant=n=>{
   const all=pool();if(n===0)return all;
   const f=B.focus||{},declared=Array.isArray(f)?f[n-1]:f[['recent','case','question'][n-1]];
   let chosen;
   if(Array.isArray(declared))chosen=declared.filter(id=>all.includes(id));
   else if(n===1)chosen=all.filter(id=>meta(id).chapter>=Math.max(1,(R.ch||1)-1));
   else if(n===2)chosen=authored().length?authored():all.slice(-8);
   else chosen=authored().length?authored().slice(0,Math.max(4,required().length+1)):all.slice(-6);
   return unique([...chosen,...required()]);
  };
  const effective=()=>new Set(relevant(st.focus)),visible=()=>st.pinned.filter(id=>info(id)&&effective().has(id));
  const connected=xs=>{const seen=new Set([xs[0]]);let change=true;while(change){change=false;for(const e of st.edges){const[a,b]=e.split('|');if(xs.includes(a)&&xs.includes(b)){if(seen.has(a)&&!seen.has(b)){seen.add(b);change=true;}if(seen.has(b)&&!seen.has(a)){seen.add(a);change=true;}}}}return xs.every(id=>seen.has(id));};
  const colorFor=k=>{if(!st.colors[k]){const n=Object.keys(st.colors).length,p=['#ef907e','#7fc9dd','#e4c96c','#bca5ed','#9bc78a','#edb0d1','#a9badc'];st.colors[k]=p[n]||'hsl('+Math.round((n*137.508)%360)+' 65% 72%)';}return st.colors[k];};
  const remember=(l,i)=>{R.caseConclusions||={};R.caseConclusions[key+'|'+lid(l,i)]||={label:l.label,sources:ids(l),chapter:R.ch||1,boardTitle:B.q};};
  st.got=unique(st.got.filter(i=>Number.isInteger(i)&&links[i]));st.got.forEach(i=>remember(links[i],i));
  st.edges=unique(st.edges.filter(k=>typeof k==='string'&&k.split('|').length===2&&k.split('|').every(id=>info(id))&&links.some(l=>k.split('|').every(id=>ids(l).includes(id)))));
  st.edges.forEach(colorFor);
  if(!Array.isArray(st.pinned)){const base=authored().length?authored():pool().filter(id=>!id.startsWith('k:')).slice(-6);st.pinned=unique([...base,...required(),...st.edges.flatMap(k=>k.split('|'))]);}
  st.pinned=unique(st.pinned.filter(id=>info(id)));
  const ensurePosition=(id,i=st.pinned.indexOf(id))=>{const p=st.pos[id];return p&&Number.isFinite(p.x)&&Number.isFinite(p.y)?p:(st.pos[id]={x:26+(i%2)*184,y:30+Math.floor(i/2)*204});};
  st.pinned.forEach(ensurePosition);
  const persist=()=>{if(live())E.save();},setMessage=(text,kind='normal')=>{message=text;tone=kind;updateStatus();};
  const btn=(action,k,label,extra='')=>'<button class="cb4-icon" '+action+' aria-label="'+esc(label)+'" title="'+esc(label)+'" '+extra+'>'+icon(k)+'</button>';
  const instruction=()=>st.mode==='move'?tr('Drag cards to arrange them. Drag the empty board to look around.','Kéo thẻ để sắp xếp. Kéo nền bảng để xem quanh.'):st.selected.length?tr('Choose another record to test a connection.','Chọn thêm một ghi chép để kiểm tra mối liên hệ.'):tr('Tap two records to connect them. Only supported links stay.','Chạm hai ghi chép để nối. Chỉ mối liên hệ có căn cứ được giữ.');
  const cardHtml=id=>{const it=info(id),m=meta(id),p=ensurePosition(id),sel=st.selected.includes(id);return'<article class="cb4-card '+esc(m.group)+(sel?' selected':'')+'" data-card="'+esc(id)+'" style="left:'+p.x+'px;top:'+p.y+'px;z-index:'+(st.layers[id]||1)+'"><button class="cb4-pin" data-pin="'+esc(id)+'" aria-label="'+esc(tr('Connect ','Nối ')+E.nat(it.name))+'" aria-pressed="'+sel+'"><i></i></button><button class="cb4-select" data-select="'+esc(id)+'" aria-pressed="'+sel+'"><span class="cb4-art">'+recordArt(id)+'</span><span class="cb4-kind">'+esc(categoryLabel(m.group))+'</span><b>'+esc(E.nat(it.name))+'</b><span class="cb4-brief">'+esc(it.brief?E.nat(it.brief):'')+'</span></button><button class="cb4-read" data-detail="'+esc(id)+'" aria-label="'+esc(tr('Read ','Đọc ')+E.nat(it.name))+'">'+icon('info')+'<span>'+esc(tr('Read','Đọc'))+'</span></button></article>';};
  const transform=()=>{if(!world||!st.view)return;if(viewport)st.viewSize={w:viewport.clientWidth,h:viewport.clientHeight};world.style.transform='translate('+st.view.x+'px,'+st.view.y+'px) scale('+st.view.z+')';shell.querySelector('[data-zoom-label]').textContent=Math.round(st.view.z*100)+'%';};
  const bounds=()=>{const v=visible();if(!v.length)return{x:0,y:0,w:360,h:260};const ps=v.map(id=>ensurePosition(id)),x=Math.min(...ps.map(p=>p.x))-20,y=Math.min(...ps.map(p=>p.y))-24;return{x,y,w:Math.max(...ps.map(p=>p.x))+WIDTH+20-x,h:Math.max(...ps.map(p=>p.y))+HEIGHT+20-y};};
  const fit=(initial=false)=>{if(!viewport)return;const b=bounds(),w=viewport.clientWidth,h=viewport.clientHeight;let z=clamp(Math.min((w-28)/b.w,(h-54)/b.h),.32,1.15);if(initial)z=clamp((w-28)/b.w,.78,1);const y=initial&&b.h*z>h-54?16-b.y*z:(h-b.h*z)/2-b.y*z-14;st.view={x:(w-b.w*z)/2-b.x*z,y,z,user:!initial};transform();persist();};
  const wiresDraw=()=>{
   if(!wires)return;const shown=new Set(visible()),all=st.edges.filter(k=>k.split('|').every(id=>shown.has(id)));
   const right=Math.max(1000,...st.pinned.map(id=>ensurePosition(id).x+WIDTH+120)),bottom=Math.max(1000,...st.pinned.map(id=>ensurePosition(id).y+HEIGHT+120));
   world.style.width=right+'px';world.style.height=bottom+'px';wires.setAttribute('viewBox','0 0 '+right+' '+bottom);wires.style.width=right+'px';wires.style.height=bottom+'px';
   // Positive screen-space Y lets the thread hang below the chord. Keep the
   // sag bounded so long connections stay readable beside the record cards.
   // Endpoints remain the pin centres; pan/zoom transforms this shared world.
   wires.innerHTML=all.map(k=>{const[a,b]=k.split('|'),p=ensurePosition(a),q=ensurePosition(b),ax=p.x+WIDTH/2,ay=p.y+3,bx=q.x+WIDTH/2,by=q.y+3,col=colorFor(k),sag=Math.min(110,Math.max(28,Math.hypot(bx-ax,by-ay)*.18));return'<g data-edge="'+esc(k)+'" style="--wire:'+col+'"><path d="M'+ax+' '+ay+' Q'+((ax+bx)/2)+' '+((ay+by)/2+sag)+' '+bx+' '+by+'"/><circle cx="'+ax+'" cy="'+ay+'" r="3"/><circle cx="'+bx+'" cy="'+by+'" r="3"/></g>';}).join('');
  };
  function updateStatus(){
   if(!shell)return;const el=shell.querySelector('.cb4-status');el.className='cb4-status '+tone;el.textContent=message||instruction();
   const fin=shell.querySelector('[data-finish]'),ready=st.got.length>=need;fin.disabled=!(ready||B.required===false||pool().length<2);fin.classList.toggle('ready',ready);fin.innerHTML=icon(ready?'check':'link')+'<span>'+esc(ready?tr('Use conclusions','Dùng kết luận'):tr('Continue','Tiếp tục'))+'</span>';
   shell.querySelector('[data-undo]').disabled=!st.edges.length;shell.querySelector('.cb4-scope').textContent=focusLabel(st.focus)+' · '+visible().length+'/'+st.pinned.length+' '+tr('pinned','thẻ trên bảng')+' · '+tr('drag the background to pan','kéo nền để xem quanh');
   const f=shell.querySelector('[data-focus]');f.querySelector('b').textContent=st.focus;f.classList.toggle('active',!!st.focus);f.setAttribute('aria-label',tr('Narrow the records: ','Thu gọn hồ sơ: ')+focusLabel(st.focus));
   shell.querySelector('[data-drawer] b').textContent=pool().length;shell.querySelector('[data-conclusions]').innerHTML=st.got.length+'/'+need+' '+icon('note');shell.querySelectorAll('[data-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.mode===st.mode)));shell.dataset.interactionMode=st.mode;
  }
  const cardsDraw=()=>{if(!live()||!shell)return;const f=shell.contains(document.activeElement)?document.activeElement:null,k=f?.dataset.select||f?.dataset.pin;st.selected=st.selected.filter(id=>visible().includes(id)).slice(0,1);world.querySelector('.cb4-cards').innerHTML=visible().map(cardHtml).join('');shell.querySelector('.cb4-empty').hidden=visible().length>0;wiresDraw();updateStatus();if(k)[...world.querySelectorAll(f?.dataset.pin?'[data-pin]':'[data-select]')].find(x=>(x.dataset.pin||x.dataset.select)===k)?.focus({preventScroll:true});};
  const popupDraw=()=>{
   const host=shell.querySelector('.cb4-popover');host.hidden=!popup;shell.querySelector('[data-hint]').setAttribute('aria-expanded',String(popup==='hint'));if(!popup){host.innerHTML='';return;}
   const title=popup==='hint'?tr('A nudge','Một gợi ý'):tr('Supported conclusions','Kết luận có căn cứ');
   const content=popup==='hint'?'<div class="cb4-hint">'+bi(B.hint||{en:'Read what each record actually establishes. Two records may concern the same event without proving the same claim.',vi:'Đọc điều mỗi ghi chép thực sự xác nhận. Hai ghi chép có thể cùng nói về một việc mà chưa chứng minh cùng một nhận định.'})+'</div>':st.got.length?st.got.map(i=>'<article class="cb4-conclusion"><b>'+icon('check')+'</b><div>'+bi(links[i].label)+'</div></article>').join(''):'<p>'+esc(tr('A valid connection will add its conclusion here and to your casebook.','Mối nối có căn cứ sẽ thêm kết luận ở đây và trong hồ sơ.'))+'</p>';
   host.innerHTML='<header><b>'+esc(title)+'</b>'+btn('data-popup-close','close',tr('Close','Đóng'))+'</header>'+content;host.scrollTop=0;
  };
  const drawerIds=()=>{const allowed=effective(),q=fold(st.query);return pool().filter(id=>allowed.has(id)&&(st.category==='all'||meta(id).group===st.category)&&(!q||fold(flat(info(id).name)+' '+flat(info(id).desc)+' '+flat(info(id).brief)).includes(q)));};
  const drawerRows=()=>{
   const list=shell.querySelector('.cb4-drawer-list');if(!list)return;const shown=drawerIds();
   list.innerHTML=shown.length?shown.map(id=>{const it=info(id),m=meta(id),p=st.pinned.includes(id),linked=st.edges.some(k=>k.split('|').includes(id));return'<article class="cb4-drawer-record '+esc(m.group)+'"><button data-detail="'+esc(id)+'" class="cb4-drawer-read">'+recordArt(id)+'<span><small>'+esc(categoryLabel(m.group))+'</small><b>'+esc(E.nat(it.name))+'</b><em>'+esc(it.brief?E.nat(it.brief):'')+'</em></span></button><button class="cb4-icon '+(p?'active':'')+'" data-pin-card="'+esc(id)+'" '+(p&&linked?'disabled':'')+' aria-label="'+esc((p?tr('Put away ','Cất '):tr('Pin ','Ghim '))+E.nat(it.name))+'" title="'+esc(p&&linked?tr('Undo its connections before putting this card away.','Gỡ dây nối trước khi cất thẻ này.'):p?tr('Put away','Cất thẻ'):tr('Pin to board','Ghim lên bảng'))+'">'+icon(p?'check':'pin')+'</button></article>';}).join(''):'<p class="cb4-no-results">'+esc(tr('No records match. Clear the search or widen the focus.','Không có hồ sơ phù hợp. Xóa từ tìm hoặc mở rộng bộ lọc.'))+'</p>';
   shell.querySelector('[data-drawer-count]').textContent=shown.length+'/'+pool().length;
  };
  const drawerDraw=()=>{
   const host=shell.querySelector('.cb4-drawer');host.hidden=!drawer;shell.querySelector('[data-drawer]').setAttribute('aria-expanded',String(drawer));if(!drawer)return;
   host.innerHTML='<header><h3>'+esc(tr('Evidence drawer','Ngăn hồ sơ'))+' <small data-drawer-count></small></h3>'+btn('data-drawer-close','close',tr('Close evidence drawer','Đóng ngăn hồ sơ'))+'</header><div class="cb4-drawer-tabs" role="group" aria-label="'+esc(tr('Record category','Loại hồ sơ'))+'">'+['all','objects','testimony','inference'].map(g=>'<button data-category="'+g+'" aria-pressed="'+(st.category===g)+'">'+esc(g==='all'?tr('All','Tất cả'):categoryLabel(g))+'</button>').join('')+'</div><div class="cb4-search"><input type="search" data-record-search aria-label="'+esc(tr('Search records','Tìm hồ sơ'))+'" placeholder="'+esc(tr('Name or detail · EN / VI','Tên hoặc chi tiết · EN / VI'))+'" value="'+esc(st.query)+'" autocomplete="off"><button data-clear-search class="cb4-icon" aria-label="'+esc(tr('Clear search','Xóa từ tìm'))+'">'+icon('close')+'</button></div><p class="cb4-drawer-scope">'+esc(focusLabel(st.focus))+(st.focus?' <button data-focus-reset>'+esc(tr('Show all','Hiện tất cả'))+'</button>':'')+'</p><div class="cb4-drawer-list"></div>';drawerRows();
  };
  const mount=()=>{
   E.ui.hideBox();
   const head='<header class="cb4-head"><div class="cb4-eyebrow"><span>'+esc(tr('CASE BOARD','BẢNG ĐIỀU TRA'))+'</span><button class="cb4-progress" data-conclusions aria-label="'+esc(tr('Read supported conclusions','Đọc các kết luận có căn cứ'))+'"></button></div><h2>'+bi(B.q||{en:'Connect the evidence.',vi:'Nối các chứng cứ.'})+'</h2></header>';
   const toolbar='<nav class="cb4-toolbar" aria-label="'+esc(tr('Board controls','Điều khiển bảng'))+'"><div class="cb4-modes" role="group" aria-label="'+esc(tr('Interaction mode','Chế độ thao tác'))+'"><button data-mode="move">'+icon('move')+'<span>'+esc(tr('Move','Di chuyển'))+'</span></button><button data-mode="connect">'+icon('link')+'<span>'+esc(tr('Connect','Nối dây'))+'</span></button></div><button class="cb4-icon cb4-focus" data-focus title="'+esc(tr('Narrow records','Thu gọn hồ sơ'))+'">'+icon('filter')+'<b></b></button>'+btn('data-hint','hint',tr('Hint','Gợi ý'))+'<button class="cb4-icon" data-drawer aria-label="'+esc(tr('Evidence drawer','Ngăn hồ sơ'))+'" title="'+esc(tr('Evidence drawer','Ngăn hồ sơ'))+'">'+icon('folder')+'<b></b></button></nav>';
   E.ui.panel('<section class="cb4-root">'+head+toolbar+'<p class="cb4-scope"></p><div class="cb4-viewport" role="group" aria-label="'+esc(tr('Movable investigation board','Bảng điều tra có thể kéo'))+'"><div class="cb4-world"><svg class="cb4-wires" aria-hidden="true"></svg><div class="cb4-cards"></div></div><p class="cb4-empty" hidden>'+esc(tr('Pin a record from the drawer to begin.','Ghim một ghi chép từ ngăn hồ sơ để bắt đầu.'))+'</p><div class="cb4-zoom">'+btn('data-zoom-out','minus',tr('Zoom out','Thu nhỏ'))+btn('data-fit','fit',tr('Fit all pinned cards','Xem toàn bộ thẻ'))+btn('data-zoom-in','plus',tr('Zoom in','Phóng to'))+'<small data-zoom-label></small></div><aside class="cb4-popover" role="status" aria-live="polite" hidden></aside></div><footer class="cb4-footer"><p class="cb4-status" role="status" aria-live="polite"></p><div>'+btn('data-undo','undo',tr('Undo the last wire','Gỡ dây cuối'))+btn('data-arrange','layout',tr('Arrange cards neatly','Xếp thẻ gọn lại'))+'<button class="cb4-finish" data-finish></button></div></footer><section class="cb4-drawer" aria-label="'+esc(tr('Evidence drawer','Ngăn hồ sơ'))+'" hidden></section></section>','caseboard');
   shell=document.querySelector('.cb4-root');viewport=shell.querySelector('.cb4-viewport');world=shell.querySelector('.cb4-world');wires=shell.querySelector('.cb4-wires');cardsDraw();popupDraw();drawerDraw();
   if(!st.view||![st.view.x,st.view.y,st.view.z].every(Number.isFinite))fit(true);else{
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
   shell.addEventListener('click',onClick);shell.addEventListener('input',onInput);shell.addEventListener('keydown',onKey);
   viewport.addEventListener('pointerdown',onDown);viewport.addEventListener('pointermove',onMove);viewport.addEventListener('pointerup',onUp);viewport.addEventListener('pointercancel',onCancel);viewport.addEventListener('wheel',onWheel,{passive:false});
   if(globalThis.ResizeObserver){observer=new ResizeObserver(()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{if(!live()||!st.view)return;const w=viewport.clientWidth,h=viewport.clientHeight;if(w===vpSize.w&&h===vpSize.h)return;if(st.view.user){st.view.x+=(w-vpSize.w)/2;st.view.y+=(h-vpSize.h)/2;transform();}else fit(true);vpSize={w,h};wiresDraw();persist();});});observer.observe(viewport);}persist();
  };
  const finish=ok=>{if(!live())return;c.resumeHere?.(false);done=true;if(B[ok?'ok':'fail'])c.push('caseboard',ok?'ok':'fail');E.save();E.ui.clear();resolve();};
  const connect=(a,b)=>{
   if(!live()||!a||!b||a===b||!info(a)||!info(b))return;st.selected=[];const k=pair(a,b);
   if(st.edges.includes(k)){setMessage(tr('That connection is already on the board.','Mối nối này đã có trên bảng.'));cardsDraw();return;}
   if(!links.some(l=>ids(l).includes(a)&&ids(l).includes(b))){st.mistakes++;setMessage(tr('No supported connection yet. Read the two records and try another pair.','Chưa có mối liên hệ đủ căn cứ. Đọc lại hai ghi chép rồi thử cặp khác.'),'wrong');E.sfx('wrong');persist();cardsDraw();return;}
   st.edges.push(k);colorFor(k);const unlocked=[];
   links.forEach((l,i)=>{if(!st.got.includes(i)&&ids(l).every(id=>info(id))&&connected(ids(l))){st.got.push(i);unlocked.push(i);remember(l,i);E.apply(l);for(const id of l.gives||[]){if(id.startsWith('q:')){const q=S.quotes?.[id.slice(2)];if(q)E.addQuote(id.slice(2),q);}else if(S.items[id]&&!R.items.includes(id)){R.items.push(id);E.emit('item',id);}}}});
   if(unlocked.length){setMessage(tr('Conclusion recorded. Tap the count above to read it.','Đã ghi kết luận. Chạm số đếm phía trên để đọc.'),'success');E.sfx('solve');popup='conclusions';}else{setMessage(tr('A supported connection has been added.','Đã thêm một mối nối có căn cứ.'),'success');E.sfx('pick');}
   const reactions=unlocked.filter(i=>links[i].then);
   if(reactions.length){c.again();for(const i of reactions.reverse())c.push('caseboard','links',i,'then');c.resumeHere?.(false);E.save();done=true;E.ui.clear();resolve();return;}
   persist();cardsDraw();popupDraw();if(drawer)drawerRows();
  };
  const select=id=>{if(!live()||!info(id))return;if(st.mode==='move'){setMessage(tr('Drag this card to move it, or use Read for its full record.','Kéo thẻ này để di chuyển, hoặc bấm Đọc để xem đầy đủ.'));return;}popup='';popupDraw();message='';tone='normal';if(st.selected[0]===id)st.selected=[];else if(st.selected.length)return connect(st.selected[0],id);else st.selected=[id];persist();cardsDraw();};
  const centerCard=id=>{const p=ensurePosition(id),z=Math.max(.85,st.view.z);st.view={x:viewport.clientWidth/2-(p.x+WIDTH/2)*z,y:viewport.clientHeight/2-(p.y+HEIGHT/2)*z,z,user:true};transform();};
  const detail=id=>{
   const it=info(id);if(!it||!live())return;const m=meta(id),sh=E.ui.sheet(tr('Evidence record','Ghi chép chứng cứ'),'<section class="cb4-record-detail"><div class="cb4-record-large">'+recordArt(id,'lg')+'</div><small>'+esc(categoryLabel(m.group))+'</small><h3>'+bi(it.name)+'</h3><div>'+bi(it.desc)+'</div>'+(it.source?'<p class="cb4-record-source">'+bi(it.source)+'</p>':'')+'<button class="se-btn wide" data-cb-listen>'+esc(tr('Listen in English','Nghe tiếng Anh'))+'</button><button class="se-btn wide" data-cb-pin>'+icon('pin')+' '+esc(st.pinned.includes(id)?tr('Find on board','Tìm trên bảng'):tr('Pin to board','Ghim lên bảng'))+'</button></section>');
   sh.querySelector('[data-cb-listen]').onclick=()=>{if(live())E.say(E.tgt(it.desc),m.who||'narr',{force:true,lang:E.L});};
   sh.querySelector('[data-cb-pin]').onclick=()=>{if(!live())return;if(!st.pinned.includes(id)){st.pinned.push(id);ensurePosition(id);}if(!effective().has(id))st.focus=0;E.ui.closeSheet();cardsDraw();centerCard(id);persist();};
  };
  const setFocus=n=>{st.focus=n;st.selected=[];popup='';popupDraw();message=tr('Focus: ','Thu gọn: ')+focusLabel(n);tone='normal';cardsDraw();if(drawer)drawerDraw();fit(false);persist();};
  const nextFocus=()=>{const cur=relevant(st.focus).slice().sort().join('|');for(let i=1;i<=4;i++){const n=(st.focus+i)%4;if(n===0||relevant(n).slice().sort().join('|')!==cur)return setFocus(n);}};
  const zoom=(factor,at)=>{const rect=viewport.getBoundingClientRect(),p=at||{x:rect.width/2,y:rect.height/2},z=clamp(st.view.z*factor,.32,1.6),wx=(p.x-st.view.x)/st.view.z,wy=(p.y-st.view.y)/st.view.z;st.view={x:p.x-wx*z,y:p.y-wy*z,z,user:true};transform();};
  function onClick(e){
   if(!live())return;const t=e.target;
   if(t.closest('.cb4-viewport')&&performance.now()<ignoreClickUntil&&!t.closest('.cb4-zoom,.cb4-popover'))return;
   const mode=t.closest('[data-mode]');if(mode){st.mode=mode.dataset.mode;st.selected=[];message='';tone='normal';cardsDraw();persist();return;}
   if(t.closest('[data-focus]'))return nextFocus();if(t.closest('[data-focus-reset]'))return setFocus(0);
   if(t.closest('[data-hint]')){popup=popup==='hint'?'':'hint';popupDraw();return;}
   if(t.closest('[data-conclusions]')){popup=popup==='conclusions'?'':'conclusions';popupDraw();return;}
   if(t.closest('[data-popup-close]')){popup='';popupDraw();return;}
   if(t.closest('[data-drawer]')){drawer=!drawer;popup='';popupDraw();drawerDraw();return;}
   if(t.closest('[data-drawer-close]')){drawer=false;drawerDraw();shell.querySelector('[data-drawer]').focus({preventScroll:true});return;}
   const cat=t.closest('[data-category]');if(cat){st.category=cat.dataset.category;shell.querySelectorAll('[data-category]').forEach(b=>b.setAttribute('aria-pressed',String(b===cat)));drawerRows();persist();return;}
   if(t.closest('[data-clear-search]')){st.query='';shell.querySelector('[data-record-search]').value='';drawerRows();persist();return;}
   const rec=t.closest('[data-detail]');if(rec)return detail(rec.dataset.detail);
   const pin=t.closest('[data-pin-card]');if(pin){const id=pin.dataset.pinCard;if(st.pinned.includes(id)){if(st.edges.some(k=>k.split('|').includes(id)))return;st.pinned=st.pinned.filter(x=>x!==id);}else{st.pinned.push(id);ensurePosition(id);}cardsDraw();drawerRows();persist();return;}
   const card=t.closest('[data-select],[data-pin]');if(card)return select(card.dataset.select||card.dataset.pin);
   if(t.closest('[data-fit]'))return fit(false);if(t.closest('[data-zoom-in]')){zoom(1.2);persist();return;}if(t.closest('[data-zoom-out]')){zoom(1/1.2);persist();return;}
   if(t.closest('[data-arrange]')){visible().forEach((id,i)=>st.pos[id]={x:26+(i%2)*184,y:30+Math.floor(i/2)*204});cardsDraw();fit(false);persist();return;}
   if(t.closest('[data-undo]')){if(!st.edges.length)return;st.edges.pop();setMessage(tr('Wire removed. Recorded conclusions stay in your casebook.','Đã gỡ dây. Kết luận đã ghi vẫn nằm trong hồ sơ.'));persist();cardsDraw();return;}
   if(t.closest('[data-finish]')&&!t.closest('[data-finish]').disabled)return finish(st.got.length>=need);
  }
  function onInput(e){if(!live()||!e.target.matches('[data-record-search]'))return;st.query=e.target.value;drawerRows();persist();}
  function onKey(e){
   if(!live())return;if(e.key==='Escape'){st.selected=[];popup='';drawer=false;message='';popupDraw();drawerDraw();cardsDraw();persist();return;}
   const card=e.target.closest('[data-card]');if(st.mode==='move'&&card&&['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)){e.preventDefault();const p=ensurePosition(card.dataset.card),n=e.shiftKey?24:8;p.x=Math.max(0,p.x+(e.key==='ArrowLeft'?-n:e.key==='ArrowRight'?n:0));p.y=Math.max(8,p.y+(e.key==='ArrowUp'?-n:e.key==='ArrowDown'?n:0));card.style.left=p.x+'px';card.style.top=p.y+'px';wiresDraw();persist();}
  }
  function onDown(e){
   if(!live()||e.button>0||e.target.closest('.cb4-zoom,.cb4-popover,[data-detail]'))return;
   pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});try{viewport.setPointerCapture(e.pointerId);}catch{}
   if(pointers.size===2){if(gesture?.type==='card'){st.pos[gesture.id]={...gesture.origin};cardsDraw();}const ps=[...pointers.values()],r=viewport.getBoundingClientRect(),m={x:(ps[0].x+ps[1].x)/2-r.left,y:(ps[0].y+ps[1].y)/2-r.top};pinch={distance:Math.hypot(ps[0].x-ps[1].x,ps[0].y-ps[1].y),view:{...st.view},world:{x:(m.x-st.view.x)/st.view.z,y:(m.y-st.view.y)/st.view.z}};gesture=null;e.preventDefault();return;}
   if(pointers.size>2)return;const card=e.target.closest('[data-card]'),pin=e.target.closest('[data-pin]'),type=card?(st.mode==='move'&&!pin?'card':'link'):'pan';
   if(card){st.layers[card.dataset.card]=++st.layerCounter;card.style.zIndex=st.layerCounter;}gesture={type,id:card?.dataset.card,pointer:e.pointerId,x:e.clientX,y:e.clientY,moved:false,origin:card?{...ensurePosition(card.dataset.card)}:{...st.view}};if(type==='card')card.classList.add('dragging');
  }
  function onMove(e){
   if(!live()||!pointers.has(e.pointerId))return;pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
   if(pinch&&pointers.size>=2){e.preventDefault();const ps=[...pointers.values()],r=viewport.getBoundingClientRect(),m={x:(ps[0].x+ps[1].x)/2-r.left,y:(ps[0].y+ps[1].y)/2-r.top},d=Math.hypot(ps[0].x-ps[1].x,ps[0].y-ps[1].y),z=clamp(pinch.view.z*d/Math.max(1,pinch.distance),.32,1.6);st.view={x:m.x-pinch.world.x*z,y:m.y-pinch.world.y*z,z,user:true};transform();ignoreClickUntil=performance.now()+350;return;}
   if(!gesture||gesture.pointer!==e.pointerId)return;const dx=e.clientX-gesture.x,dy=e.clientY-gesture.y;if(Math.hypot(dx,dy)>7)gesture.moved=true;if(!gesture.moved)return;e.preventDefault();
   if(gesture.type==='card'){const p=st.pos[gesture.id]={x:Math.max(0,gesture.origin.x+dx/st.view.z),y:Math.max(8,gesture.origin.y+dy/st.view.z)},card=[...world.querySelectorAll('[data-card]')].find(x=>x.dataset.card===gesture.id);if(card){card.style.left=p.x+'px';card.style.top=p.y+'px';}wiresDraw();}
   else if(gesture.type==='pan'){st.view={...gesture.origin,x:gesture.origin.x+dx,y:gesture.origin.y+dy,user:true};transform();}
   else world.querySelectorAll('[data-card]').forEach(x=>x.classList.toggle('link-target',x===document.elementFromPoint(e.clientX,e.clientY)?.closest('[data-card]')&&x.dataset.card!==gesture.id));
  }
  function onUp(e){
   if(!live())return;pointers.delete(e.pointerId);try{viewport.releasePointerCapture(e.pointerId);}catch{}
   if(pinch){if(pointers.size<2){pinch=null;gesture=null;pointers.clear();ignoreClickUntil=performance.now()+350;persist();}return;}
   const g=gesture;gesture=null;world.querySelectorAll('.dragging,.link-target').forEach(x=>x.classList.remove('dragging','link-target'));if(!g||g.pointer!==e.pointerId)return;
   if(g.moved){ignoreClickUntil=performance.now()+400;if(g.type==='link'){const t=document.elementFromPoint(e.clientX,e.clientY)?.closest('[data-card]');if(t&&t.dataset.card!==g.id)connect(g.id,t.dataset.card);}persist();}
   else if(g.id){ignoreClickUntil=performance.now()+350;select(g.id);}
  }
  function onCancel(e){pointers.delete(e.pointerId);if(pinch){st.view={...pinch.view};pinch=null;transform();}if(gesture){if(gesture.type==='card')st.pos[gesture.id]={...gesture.origin};else if(gesture.type==='pan')st.view={...gesture.origin};}gesture=null;pointers.clear();ignoreClickUntil=performance.now()+350;cardsDraw();transform();persist();}
  function onWheel(e){if(!live()||e.target.closest('.cb4-popover'))return;e.preventDefault();const r=viewport.getBoundingClientRect();zoom(e.deltaY<0?1.08:1/1.08,{x:e.clientX-r.left,y:e.clientY-r.top});persist();}
  c.onExit?.(()=>{done=true;observer?.disconnect();cancelAnimationFrame(frame);if(gesture?.type==='card')st.pos[gesture.id]={...gesture.origin};gesture=null;pinch=null;pointers.clear();if(viewport){viewport.removeEventListener('pointerdown',onDown);viewport.removeEventListener('pointermove',onMove);viewport.removeEventListener('pointerup',onUp);viewport.removeEventListener('pointercancel',onCancel);viewport.removeEventListener('wheel',onWheel);}shell?.removeEventListener('click',onClick);shell?.removeEventListener('input',onInput);shell?.removeEventListener('keydown',onKey);});
  mount();
  E.autoRun(()=>{for(const l of links){const xs=ids(l).filter(id=>info(id));for(let i=1;i<xs.length;i++){connect(xs[0],xs[i]);if(!live())return;}}finish(st.got.length>=need);});
 }));
})();

