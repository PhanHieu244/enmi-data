/* PhoneSurface d2 — game-agnostic candidate. Enmi engine public API only.
 * Local module until promotion into _lib/story/phone.js is reviewed.
 * No story nodes, conditions, rewards, save keys, or core files are modified. */
(function(g){'use strict';
  const words={
    incoming:{en:'Incoming call',vi:'Cuộc gọi đến'},connected:{en:'On the phone',vi:'Đang gọi'},
    voicemail:{en:'Saved voice message',vi:'Tin nhắn thoại đã lưu'},message:{en:'New message',vi:'Tin nhắn mới'},
    ended:{en:'Call ended',vi:'Đã kết thúc cuộc gọi'},'message-ended':{en:'Message finished',vi:'Đã nghe xong tin nhắn'},missed:{en:'Missed call',vi:'Cuộc gọi nhỡ'},
    lock:{en:'Locked phone',vi:'Điện thoại khóa'},battery:{en:'Low battery',vi:'Pin yếu'},
    recording:{en:'Recording',vi:'Đang ghi âm'},charging:{en:'Charging · recording',vi:'Đang sạc · ghi âm'},
    poweroff:{en:'Phone powered off',vi:'Điện thoại đã tắt nguồn'},nosignal:{en:'Calls unavailable · one bar',vi:'Không đủ sóng gọi · một vạch'},
    compose:{en:'Compose message',vi:'Soạn tin nhắn'},delivered:{en:'Message delivered',vi:'Tin nhắn đã gửi'},
    unsent:{en:'Reply not sent · signal lost',vi:'Tin nhắn tiếp theo chưa gửi · mất sóng'},
    'recording-playback':{en:'Evidence recording',vi:'Bản ghi âm chứng cứ'},
    answer:{en:'Answer',vi:'Nghe máy'},play:{en:'Play',vi:'Phát'},open:{en:'Open message',vi:'Mở tin nhắn'},
    end:{en:'End call',vi:'Kết thúc cuộc gọi'},silence:{en:'Silence',vi:'Tắt chuông'},silenced:{en:'Ringing silenced',vi:'Đã tắt chuông'},
    saved:{en:'Saved',vi:'Đã lưu'},advert:{en:'Service offer',vi:'Tin quảng cáo dịch vụ'},
    visualWave:{en:'Voice message waveform',vi:'Dải sóng tin nhắn thoại'},
    contactPhoto:{en:'Contact photo',vi:'Ảnh liên hệ'},lockscreen:{en:'Lock screen',vi:'Màn hình khóa'},
    decline:{en:'Decline',vi:'Từ chối'},remaining:{en:'Time to answer',vi:'Thời gian nghe máy'},unknown:{en:'Unknown number',vi:'Số lạ'},external:{en:'Phone',vi:'Điện thoại'}
  };
  const el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!=null)n.textContent=text;return n;};
  const inScope=(path,scope)=>!!scope&&(path===scope||path.startsWith(scope+'[')||path.startsWith(scope+'.'));
  function resolvePath(S,path){const keys=path.replace(/\[(\d+)\]/g,'.$1').split('.');let value=S;for(const k of keys)value=value?.[k];return value;}
  function checkAnchor(st,a){
    if(!st||typeof st!=='object')return false;
    if(a.expectGo)return st.go===a.expectGo;
    if(a.expectCall)return st.call?.from===a.expectCall;
    if(a.expectChat)return String(st.chat?.msgs?.[0]?.en||'').startsWith(a.expectChat);
    if(a.expectListen)return String(st.listen?.audio||'').startsWith(a.expectListen);
    if(a.expectLock)return String(st.lock?.prompt?.en||'').startsWith(a.expectLock);
    if(a.expectType)return String(st.type?.prompt?.en||'').startsWith(a.expectType);
    const t=st.en||st.n?.en||st.think?.en||'';
    return !a.expect||t.startsWith(a.expect)||!!a.expectAscii&&t.startsWith(a.expectAscii);
  }
  // Release tickets outlive a closing surface. The initiating Enter key, an
  // extra finger, or a press begun during the fade cannot reach the next beat.
  // Tickets settle on the matching release/click, never a guessed delay.
  let sharedInputGuard=null;
  function inputGuard(){
    if(sharedInputGuard)return sharedInputGuard;
    const active=new Set(),closing=new Set(),downKeys=new Set(),keyTickets=new Set(),downPointers=new Map(),pointerTickets=new Map();
    const activation=e=>e.code==='Enter'||e.code==='NumpadEnter'||e.code==='Space'||e.key==='Enter'||e.key===' ';
    const key=e=>e.code||e.key;
    const inside=(owners,target)=>[...owners].some(owner=>owner.root?.contains(target));
    const consume=e=>{if(e.cancelable)e.preventDefault();e.stopImmediatePropagation();};
    const pid=e=>e.pointerId??1;
    const down=e=>{
      const id=pid(e);pointerTickets.delete(id);downPointers.delete(id);
      if(inside(active,e.target))downPointers.set(id,{x:e.clientX,y:e.clientY,button:e.button,phase:'pressed'});
      if(inside(closing,e.target)){pointerTickets.set(id,{x:e.clientX,y:e.clientY,button:e.button,phase:'pressed'});consume(e);}
    };
    const up=e=>{
      const id=pid(e),ticket=pointerTickets.get(id);downPointers.delete(id);
      if(ticket){ticket.phase='released';ticket.x=e.clientX;ticket.y=e.clientY;consume(e);}
    };
    const cancel=e=>{const id=pid(e);downPointers.delete(id);if(pointerTickets.delete(id))consume(e);};
    const click=e=>{
      let id=e.pointerId;
      if(!pointerTickets.has(id)&&e.detail>0){
        id=[...pointerTickets].find(([,t])=>t.phase==='released'&&t.button===e.button&&Math.abs(t.x-e.clientX)<=1&&Math.abs(t.y-e.clientY)<=1)?.[0];
      }
      if(pointerTickets.has(id)){pointerTickets.delete(id);consume(e);}
      else if(inside(closing,e.target))consume(e);
    };
    const keyDown=e=>{
      if(!activation(e))return;const k=key(e);
      if(keyTickets.has(k)){consume(e);return;}
      if(active.size)downKeys.add(k);
      if(closing.size){keyTickets.add(k);consume(e);}
    };
    const keyUp=e=>{
      if(!activation(e))return;const k=key(e);downKeys.delete(k);
      if(keyTickets.delete(k))consume(e);
    };
    for(const [name,handler]of [['pointerdown',down],['pointerup',up],['pointercancel',cancel],['click',click],['keydown',keyDown],['keyup',keyUp]])g.addEventListener(name,handler,{capture:true,passive:false});
    sharedInputGuard={
      activate(owner){active.add(owner);},
      close(owner){
        closing.add(owner);
        for(const k of downKeys)keyTickets.add(k);
        for(const [id,t]of downPointers)pointerTickets.set(id,{...t});
      },
      release(owner){active.delete(owner);closing.delete(owner);if(!active.size){downKeys.clear();downPointers.clear();}},
      snapshot(){return {active:active.size,closing:closing.size,keyTickets:[...keyTickets],pointerTickets:[...pointerTickets].map(([id,t])=>({id,phase:t.phase}))};}
    };
    return sharedInputGuard;
  }

  class PhoneSurface {
    constructor(root,{data,language,assetBase,auto,sound,layerClass}={}){
      this.root=root;this.data=data||{};this.language=language||(()=> 'en');this.assetBase=assetBase||'';
      this.auto=auto||(()=>false);this.sound=sound||(()=>{});this.input=inputGuard();
      this.owner=0;this.renderVersion=0;this.pending=null;this.nativeInfo=null;this.active=null;this.savedInert=[];
      this.layer=el('section','enmi-phone-layer'+(layerClass?' '+layerClass:''));this.layer.hidden=true;root.append(this.layer);
      this.layer.addEventListener('click',e=>{if(this.blocking())e.stopPropagation();});
      this.guard=e=>{
        if(!this.blocking())return;
        if(e.key==='Tab'){
          const bs=[...this.layer.querySelectorAll('button:not([disabled])')];if(!bs.length)return;
          e.preventDefault();e.stopImmediatePropagation();const i=bs.indexOf(document.activeElement);bs[(i+(e.shiftKey?-1:1)+bs.length)%bs.length].focus();
        }else if(e.key==='Escape'){e.preventDefault();e.stopImmediatePropagation();this.silence();}
        else if((e.key===' '||e.key==='Enter')&&!this.layer.contains(e.target)){e.preventDefault();e.stopImmediatePropagation();}
      };
      this.resize=()=>this.fit();
      if(g.ResizeObserver){this.observer=new ResizeObserver(this.resize);this.observer.observe(root);}
      this.mutation=new MutationObserver(()=>this.fit());
      for(const x of root.querySelectorAll('.se-box,.se-ui,.se-stage'))this.mutation.observe(x,{attributes:true,childList:true,subtree:true});
      g.addEventListener?.('resize',this.resize);
    }
    blocking(){return !!(this.pending||this.nativeInfo);}
    t(x){if(x==null)return '';if(typeof x==='string')return x;const lang=this.language()||'en';return x[lang]||x.en||x.vi||'';}
    label(k){return this.t(this.data.labels?.[k]||words[k]||k);}
    asset(key){const p=this.data.assets?.[key];return p?this.assetBase+p:'';}
    visibleRect(el){if(!el||el.hidden||!el.getClientRects().length||getComputedStyle(el).visibility==='hidden')return null;return el.getBoundingClientRect();}
    fit(){
      if(this.layer.hidden)return;
      const r=this.root.getBoundingClientRect(),st=this.visibleRect(this.root.querySelector('.se-stage'))||r;
      const top=this.visibleRect(this.root.querySelector('.se-top')),box=this.visibleRect(this.root.querySelector('.se-box'));
      const speaker=box?this.visibleRect(this.root.querySelector('.se-box .se-name')):null;
      const panel=this.visibleRect(this.root.querySelector('.se-ui>.se-panel:not(.call)'));
      const landscape=r.width>=600&&r.height<=500,compact=this.layer.dataset.layout==='compact';
      let x=8,y=Math.max(64,top?top.bottom-r.top+8:64),w=r.width-16,h=r.height-y-12;
      if(compact){
        x=(landscape?st.left-r.left:0)+8;w=(landscape?st.width:r.width)-16;h=40;
        let floor=landscape?st.bottom-r.top-8:r.height-12;
        if(!landscape){for(const z of [box,speaker,panel])if(z&&z.width>0&&z.height>0)floor=Math.min(floor,z.top-r.top-6);}
        y=Math.max(64,floor-h);
      }else if(!this.layer.classList.contains('sp-gate')&&!this.layer.classList.contains('sp-native-call')){
        if(landscape){x=st.left-r.left+8;w=st.width-16;h=st.bottom-r.top-y-8;}
        else if(box)h=Math.max(110,box.top-r.top-y-8);
      }
      for(const [k,v]of Object.entries({x,y,w,h}))this.layer.style.setProperty('--sp-'+k,Math.max(k==='h'?40:0,v)+'px');
      const laneTop=compact?y:-1;
      if(this.root.style.getPropertyValue('--phone-lane-top')!==laneTop+'px')this.root.style.setProperty('--phone-lane-top',laneTop+'px');
      this.root.style.setProperty('--phone-lane-height',compact?'40px':'0px');
      this.layoutMetrics={root:{x:r.x,y:r.y,width:r.width,height:r.height},layout:compact?'compact':'closeup',safe:{x,y,width:w,height:h},landscape};
      if(this.plane&&this.physicalImage){
        const ratio=this.physicalImage.naturalWidth/this.physicalImage.naturalHeight||2/3;
        const pw=Math.min(w,h*ratio),ph=pw/ratio;this.plane.style.width=pw+'px';this.plane.style.height=ph+'px';
        if(this.physicalScreen)this.physicalScreen.style.fontSize=Math.max(8,Math.min(17,pw*(this.active.screenRect?.[2]||35)/900))+'px';
      }
      if(this.handset){
        const horizontal=landscape,hh=Math.min(h,horizontal?292:580),ww=hh*2/3;
        this.handset.style.width=Math.min(ww,w)+'px';this.handset.style.height=Math.min(hh,w*1.5)+'px';
      }
      if(this.listenerArt){
        const height=Math.max(0,(box&&!landscape?box.top-r.top-8:st.bottom-r.top)-Math.max(58,st.top-r.top));
        Object.assign(this.listenerArt.style,{left:st.left-r.left+'px',top:Math.max(58,st.top-r.top)+'px',width:st.width+'px',height:height+'px'});
      }
    }
    show(spec,{gate=false,native=false}={}){
      this.stopRinging();const render=++this.renderVersion;this.active={...spec};
      this.layer.hidden=false;this.layer.dataset.mode=spec.mode||'incoming';
      const closeup=!!gate||native&&spec.mode==='incoming'||spec.presentation==='physical';
      this.layer.dataset.layout=closeup?'closeup':'compact';this.root.dataset.phoneLayout=closeup?'closeup':'compact';
      this.layer.classList.toggle('sp-physical',spec.presentation==='physical'&&!gate);this.layer.classList.toggle('sp-gate',gate);this.layer.classList.toggle('sp-native-call',native&&spec.mode==='incoming');
      this.layer.replaceChildren();this.plane=this.physicalImage=this.physicalScreen=this.handset=this.listenerArt=null;
      this.layer.setAttribute('aria-label',this.label(spec.mode||'incoming'));
      const body=this.body=el('div','sp-body');this.layer.append(body);this.actions=null;this.status=null;
      const contact=this.data.contacts?.[spec.who||spec.caller];
      const addAvatar=(host,cls)=>{if(!contact?.avatar)return;const img=el('img',cls);img.src=this.assetBase+contact.avatar;img.alt=this.label('contactPhoto');img.addEventListener('error',()=>img.hidden=true,{once:true});host.append(img);};
      const waveform=host=>{const wave=el('div','sp-wave');wave.setAttribute('role','img');wave.setAttribute('aria-label',this.label('visualWave'));[16,28,19,42,27,52,36,20,45,62,39,24,49,34,55,27].forEach(h=>{const bar=el('i');bar.style.height=h+'%';wave.append(bar);});host.append(wave);};
      if(!closeup){
        const strip=el('div','sp-strip');strip.setAttribute('aria-label',(contact?this.t(contact.name)+' · ':'')+this.label(spec.mode));strip.title=strip.getAttribute('aria-label');body.append(strip);addAvatar(strip,'sp-mini-avatar');
        const text=el('div','sp-strip-copy');strip.append(text);text.append(el('strong','sp-mini-name',contact?this.t(contact.name):this.label(spec.mode)));
        const status=el('span','sp-mini-status',contact?this.label(spec.mode)+(spec.battery!=null?' · '+spec.battery+'%':''):spec.battery!=null?spec.battery+'%':spec.status?this.label(spec.status):'');text.append(status);this.status=status;
        if(['voicemail','recording-playback','recording','charging'].includes(spec.mode))waveform(strip);
        if(spec.listener===true&&spec.mode==='connected'){
          const src=this.asset('listening');if(src){this.listenerArt=el('img','sp-listener-art');this.listenerArt.src=src;this.listenerArt.alt='';this.layer.prepend(this.listenerArt);}
        }
        this.fit();return strip;
      }
      const physical=spec.presentation==='physical'&&!gate;
      if(physical){
        this.layer.classList.add('sp-physical');const plane=this.plane=el('div','sp-physical-plane');body.append(plane);
        const art=this.physicalImage=el('img','sp-art');art.src=this.asset(spec.art);art.alt='';plane.append(art);
        art.addEventListener('load',()=>{if(render===this.renderVersion)this.fit();},{once:true});
        art.addEventListener('error',()=>{if(render===this.renderVersion){art.hidden=true;if(this.physicalScreen)this.physicalScreen.hidden=true;}},{once:true});
        if(spec.screenRect){
          const [x,y,w,h]=spec.screenRect,inside=this.physicalScreen=el('div','sp-physical-screen');Object.assign(inside.style,{left:x+'%',top:y+'%',width:w+'%',height:h+'%'});plane.append(inside);
          inside.append(el('span','sp-physical-kind',this.label(spec.screenMode||spec.mode)));addAvatar(inside,'sp-physical-avatar');
          if(contact)inside.append(el('strong','sp-physical-name',this.t(contact.name)));
          if(spec.screenMode==='voicemail'||spec.screenMode==='charging')waveform(inside);
        }
        if(spec.mode==='incoming'&&!this.auto())this.sound('vibrate');
        this.fit();return plane;
      }
      this.layer.classList.remove('sp-physical');
      const handset=this.handset=el('div','sp-handset');body.append(handset);
      const src=this.asset(spec.shell||'shell');if(src){const img=el('img','sp-shell');img.src=src;img.alt='';handset.append(img);}else handset.classList.add('sp-shell-fallback');
      const screen=el('div','sp-screen');handset.append(screen);
      screen.append(el('p','sp-kind',this.label(spec.mode||'incoming')));addAvatar(screen,'sp-avatar');
      if(contact){screen.append(el('span','sp-photo-label',this.label('contactPhoto')));screen.append(el('h2','sp-name',this.t(contact.name)));}
      if(spec.battery!=null)screen.append(el('strong','sp-battery',spec.battery+'%'));
      if(['voicemail','recording-playback','recording','charging'].includes(spec.mode))waveform(screen);
      const status=this.status=el('p','sp-status',spec.status?this.label(spec.status):'');status.setAttribute('aria-live','polite');screen.append(status);
      this.actions=el('div','sp-actions');screen.append(this.actions);this.fit();return screen;
    }
    blockBackground(){
      if(this.savedInert.length)return;this.input.activate(this);this.previousFocus=document.activeElement;
      this.savedInert=[...this.root.children].filter(x=>x!==this.layer).map(x=>[x,x.inert]);for(const[x]of this.savedInert)x.inert=true;
      document.addEventListener('keydown',this.guard,true);this.layer.setAttribute('role','dialog');this.layer.setAttribute('aria-modal','true');
    }
    releaseBackground(){
      this.input.release(this);for(const[x,value]of this.savedInert)if(x.isConnected)x.inert=value;this.savedInert=[];
      document.removeEventListener('keydown',this.guard,true);this.layer.removeAttribute('role');this.layer.removeAttribute('aria-modal');
    }
    stopRinging(){clearInterval(this.ringTimer);this.ringTimer=0;this.soundHandle?.stop?.(.04);this.soundHandle=null;}
    startRinging(){if(this.auto())return;this.stopRinging();const ring=()=>{this.soundHandle=this.sound('ring');};ring();this.ringTimer=setInterval(ring,1400);}
    silence(){if(this.pending?.action!=='answer')return;this.stopRinging();this.layer.classList.add('sp-silenced');if(this.status)this.status.textContent=this.label('silenced');}
    button(key,fn){const b=el('button','sp-button sp-'+key,this.label(key));b.type='button';b.onclick=e=>{e.preventDefault();e.stopPropagation();fn();};this.actions.append(b);return b;}
    gate(spec,action){
      this.cancel();const token=++this.owner;this.show(spec,{gate:true});this.blockBackground();
      return new Promise(resolve=>{
        this.pending={token,resolve,action,busy:false};
        if(action==='answer'){this.button('silence',()=>this.silence());this.startRinging();}
        const go=this.button(action,()=>this.settle(token,true));go.classList.add('sp-primary');go.focus({preventScroll:true});
        if(this.auto())setTimeout(()=>this.settle(token,true),5);
      });
    }
    mountNative(c){
      const panel=this.root.querySelector('.se-panel.call');if(!panel||!this.actions)return false;
      this.nativeInfo={c,panel,startedAt:performance.now()};panel.dataset.phoneDecorated='1';this.blockBackground();
      for(const[key,label]of [['decline','decline'],['accept','answer']]){
        const target=panel.querySelector('[data-k="'+key+'"]');if(!target)continue;
        const b=this.button(label,()=>{if(!c.live())return;this.actions.querySelectorAll('button').forEach(x=>x.disabled=true);this.sound(key==='accept'?'answer':'end');target.click();this.input.close(this);});
        if(key==='accept')b.classList.add('sp-primary');
      }
      const ring=Number(c.st.call?.ring)||10;
      const timer=el('div','sp-ring-progress');timer.setAttribute('role','img');timer.setAttribute('aria-label',this.label('remaining')+' · '+ring+' s');timer.style.setProperty('--sp-ring-duration',ring+'s');timer.append(el('i'));this.actions.before(timer);
      this.layer.querySelector('.sp-primary')?.focus({preventScroll:true});this.fit();return true;
    }
    unmountNative(){
      if(!this.nativeInfo)return;delete this.nativeInfo.panel.dataset.phoneDecorated;this.nativeInfo=null;this.releaseBackground();
    }
    async settle(token,value){
      const p=this.pending;if(!p||p.token!==token||p.busy)return;p.busy=true;this.input.close(this);this.stopRinging();
      this.layer.querySelectorAll('button').forEach(b=>b.disabled=true);
      if(!this.auto()&&!g.matchMedia?.('(prefers-reduced-motion: reduce)').matches&&this.actions?.animate){const a=this.actions.animate([{opacity:1},{opacity:0}],{duration:120,easing:'ease-out',fill:'forwards'});try{await a.finished;}catch(_){}finally{a.cancel();}}
      if(!this.pending||this.pending.token!==token)return;this.pending=null;this.releaseBackground();this.sound(p.action==='answer'?'answer':p.action==='play'?'voicemail':'key');
      this.actions?.replaceChildren();this.layer.classList.remove('sp-gate','sp-silenced');
      if(this.previousFocus?.isConnected&&!this.previousFocus.inert)this.previousFocus.focus?.({preventScroll:true});p.resolve(value);
    }
    cancel(){
      ++this.owner;++this.renderVersion;const p=this.pending;if(p||this.nativeInfo)this.input.close(this);this.pending=null;this.stopRinging();this.unmountNative();this.releaseBackground();
      this.layer.hidden=true;this.layer.replaceChildren();this.layer.classList.remove('sp-gate','sp-silenced','sp-native-call','sp-physical');this.active=null;
      this.actions=this.status=this.plane=this.physicalImage=this.physicalScreen=this.handset=this.listenerArt=null;
      delete this.root.dataset.phoneLayout;this.root.style.setProperty('--phone-lane-top','-1px');this.root.style.setProperty('--phone-lane-height','0px');if(p)p.resolve(false);
    }
    destroy(){this.cancel();this.observer?.disconnect();this.mutation?.disconnect();g.removeEventListener?.('resize',this.resize);this.layer.remove();}
  }
  const installs=new WeakMap();
  function install(E,data,options={}){
    if(!E||typeof E.def!=='function'||!E.mech||typeof E.on!=='function')return {installed:false,reason:'Required public engine plugin API is unavailable.'};
    const registry=installs.get(E)||new Map();installs.set(E,registry);const id=data.game||data.id||data;if(registry.has(id))return registry.get(id);
    const result={installed:true,revision:'d2',engineBaseline:data.engineBaseline||null,runtimeVersion:E.VERSION||null,handlers:[],unavailableHandlers:[],invalidAnchors:[],gatesEnabled:options.gates!==false};
    let anchors=new WeakMap(),paths=new WeakMap(),surface=null,booted=false,nativeChatOwner=null;
    const language=()=>options.language?options.language():(E.N||((typeof E.nat==='function'&&E.nat({en:'en',vi:'vi'})==='vi'?'vi':'en')));
    const sound=key=>{if(options.sound===false)return;const cues={ring:'phone',vibrate:'buzz',answer:'pick',end:'down',voicemail:'tap',key:'tap',...(data.sounds||{}),...(options.sounds||{})};return E.sfx?.(cues[key]);};
    function ensure(){
      if(data.game&&E.S()?.id!==data.game)return false;const root=options.root?.()||document.querySelector('.se');if(!root)return false;
      if(!surface||surface.root!==root){surface?.destroy();surface=new PhoneSurface(root,{data,language,assetBase:options.assetBase,auto:()=>!!E.auto,sound,layerClass:options.layerClass});}
      if(!booted)index();return true;
    }
    function index(){
      anchors=new WeakMap();paths=new WeakMap();result.invalidAnchors=[];const S=E.S();if(!S||data.game&&S.id!==data.game)return;
      const seen=new Set(),visit=(x,p)=>{if(!x||typeof x!=='object'||seen.has(x))return;seen.add(x);paths.set(x,p);if(Array.isArray(x))x.forEach((v,i)=>visit(v,p+'['+i+']'));else Object.entries(x).forEach(([k,v])=>visit(v,p+'.'+k));};visit(S.nodes,'nodes');
      for(const a of data.anchors||[]){const st=resolvePath(S,a.path);if(checkAnchor(st,a))anchors.set(st,a);else result.invalidAnchors.push(a.path);}booted=true;
    }
    async function before(c,a){
      if(a.clear){surface.cancel();return true;}
      if(a.gate&&result.gatesEnabled){
        c.resumeHere?.(true);const s=surface,promise=s.gate(a,a.gate),ticket=s.pending;
        c.onExit?.(()=>{if(s.pending===ticket)s.cancel();});
        const accepted=await promise;if(!accepted||!c.live())return false;c.resumeHere?.(false);
        if(a.gate==='answer')s.show({...a,mode:'connected',presentation:null});
        else if(a.gate==='open')s.cancel();
        else s.show({...a,presentation:null,status:null});
      }else surface.show(a,{native:!!a.native});return true;
    }
    async function nativeChat(c,original,receiver,rest){
      const root=surface.root;nativeChatOwner=c;root.dataset.phoneNative='chat';
      const release=()=>{if(nativeChatOwner===c){delete root.dataset.phoneNative;nativeChatOwner=null;}};
      c.onExit?.(release);try{return await original.call(receiver,c,...rest);}finally{release();}
    }
    for(const name of options.handlers||['say','n','think','go','call','chat','listen','lock','type','choice']){
      const original=E.mech[name];if(typeof original!=='function'){result.unavailableHandlers.push(name);continue;}
      E.def(name,async function(c,...rest){
        if(!ensure())return original.call(this,c,...rest);const a=anchors.get(c.st);if(!a)return name==='chat'&&data.nativeChat===true?nativeChat(c,original,this,rest):original.call(this,c,...rest);
        if(!await before(c,a)||!c.live())return;
        let output;if(name==='call'&&a.native){
          c.resumeHere?.(true);const s=surface;
          c.onExit?.(()=>{if(s.nativeInfo?.c===c)s.cancel();});
          const running=original.call(this,c,...rest);s.mountNative(c);
          output=await running;if(s.nativeInfo?.c===c){s.unmountNative();s.cancel();}c.resumeHere?.(false);
        }else if(name==='chat'&&data.nativeChat===true)output=await nativeChat(c,original,this,rest);
        else output=await original.call(this,c,...rest);
        if(c.live()&&surface.active?.path===a.path){
          if(a.endAfter){sound('end');surface.show({...a,mode:'ended',presentation:null,listener:false});}
          else if(a.after==='clear')surface.cancel();
          else if(a.after==='ended')surface.show({...a,mode:a.mode==='voicemail'?'message-ended':'ended',presentation:null});
        }
        return output;
      });result.handlers.push(name);
    }
    E.on('boot',()=>{index();ensure();});E.on('chapter',()=>index());
    E.on('step',(_type,st)=>{
      if(!surface||surface.blocking())return;const a=anchors.get(st),p=paths.get(st),active=surface.active;
      if(active&&!a&&p&&!inScope(p,active.scope))surface.cancel();
    });
    const cleanup=()=>{surface?.cancel();if(surface)delete surface.root.dataset.phoneNative;nativeChatOwner=null;};
    for(const[target,key]of [[E,'stop'],[E.ui,'reset']]){if(typeof target?.[key]!=='function')continue;const original=target[key];target[key]=function(...args){cleanup();return original.apply(this,args);};}
    E.on('end',cleanup);result.cancel=cleanup;result.reindex=index;result.surface=()=>surface;registry.set(id,result);return result;
  }
  g.StoryPhone={PhoneSurface,install,words,resolvePath,checkAnchor,inputSnapshot:()=>sharedInputGuard?.snapshot()||null};
})(globalThis);
