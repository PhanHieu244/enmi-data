/* THE STATEMENT / direction d1 / shared engine 1.0.4
 * Additive, opt-in presentation adapter. Does not replace the engine's call,
 * chat, listen, lock, type or reward implementation. Does not modify S.nodes,
 * R, G, localStorage, save keys or paths. See PHONE-INTEGRATION.md. */
(function (g) {
  'use strict';
  const words={
    incoming:{en:'Incoming call',vi:'Cuộc gọi đến'},connected:{en:'On the phone',vi:'Đang gọi'},
    voicemail:{en:'Saved voice message',vi:'Tin nhắn thoại đã lưu'},message:{en:'New message',vi:'Tin nhắn mới'},
    ended:{en:'Call ended',vi:'Đã kết thúc cuộc gọi'},'message-ended':{en:'Message finished',vi:'Đã nghe xong tin nhắn'},missed:{en:'Missed call',vi:'Cuộc gọi nhỡ'},
    lock:{en:'Kieran’s phone',vi:'Điện thoại của Kieran'},battery:{en:'Low battery',vi:'Pin yếu'},
    recording:{en:'Recording',vi:'Đang ghi âm'},charging:{en:'Charging · recording',vi:'Đang sạc · ghi âm'},
    poweroff:{en:'Phone powered off',vi:'Điện thoại đã tắt nguồn'},nosignal:{en:'Calls unavailable · one bar',vi:'Không đủ sóng gọi · một vạch'},
    compose:{en:'Message to Ruth',vi:'Tin nhắn cho Ruth'},delivered:{en:'Message delivered',vi:'Tin nhắn đã gửi'},
    unsent:{en:'Reply not sent · signal lost',vi:'Tin nhắn tiếp theo chưa gửi · mất sóng'},
    'recording-playback':{en:'Evidence recording',vi:'Bản ghi âm chứng cứ'},
    answer:{en:'Answer',vi:'Nghe máy'},play:{en:'Play',vi:'Phát'},open:{en:'Open message',vi:'Mở tin nhắn'},
    end:{en:'End call',vi:'Kết thúc cuộc gọi'},silence:{en:'Silence',vi:'Tắt chuông'},silenced:{en:'Ringing silenced',vi:'Đã tắt chuông'},
    saved:{en:'Saved',vi:'Đã lưu'},advert:{en:'Service offer',vi:'Tin quảng cáo dịch vụ'},
    visualWave:{en:'Voice message waveform',vi:'Dải sóng tin nhắn thoại'},
    contactPhoto:{en:'Contact photo',vi:'Ảnh liên hệ'},lockscreen:{en:'Lock screen',vi:'Màn hình khóa'},
    unknown:{en:'Unknown number',vi:'Số lạ'},external:{en:'Owen’s phone',vi:'Điện thoại của Owen'}
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
    constructor(root,{data,language,assetBase}={}){
      this.root=root;this.input=inputGuard();this.data=data||{};this.language=language||(()=> 'en');this.assetBase=assetBase||'';
      this.owner=0;this.renderVersion=0;this.pending=null;this.active=null;this.savedInert=[];this.previousFocus=null;
      this.layer=el('section','statement-phone-layer');this.layer.hidden=true;root.append(this.layer);
      this.layer.addEventListener('click',e=>{if(this.pending)e.stopPropagation();});
      this.guard=e=>{
        if(!this.pending)return;
        if(e.key==='Tab'){
          const buttons=[...this.layer.querySelectorAll('button:not([disabled])')];
          if(!buttons.length)return;e.preventDefault();e.stopImmediatePropagation();
          const i=buttons.indexOf(document.activeElement);buttons[(i+(e.shiftKey?-1:1)+buttons.length)%buttons.length].focus();
        }else if(e.key==='Escape'){
          e.preventDefault();e.stopImmediatePropagation();this.silence();
        }else if((e.key===' '||e.key==='Enter')&&!this.layer.contains(e.target)){
          e.preventDefault();e.stopImmediatePropagation();
        }
      };
      this.resize=()=>this.fit();
      if(g.ResizeObserver){this.observer=new ResizeObserver(this.resize);this.observer.observe(root);}
      g.addEventListener?.('resize',this.resize);
    }
    t(x){if(x==null)return '';if(typeof x==='string')return x;const lang=this.language()==='vi'?'vi':'en';return x[lang]||x.en||x.vi||'';}
    asset(key){const p=this.data.assets?.[key];return p?this.assetBase+p:'';}
    fit(){
      const r=this.root.getBoundingClientRect();const top=this.root.querySelector('.se-top')?.getBoundingClientRect();
      const box=this.root.querySelector('.se-box')?.getBoundingClientRect();
      const visibleBox=box&&box.width>0&&box.height>0;
      const start=Math.max(58,top?top.bottom-r.top+8:58);
      const floor=r.width>r.height&&r.height<=600?72:132;
      const end=visibleBox?Math.max(start+floor,box.top-r.top-8):r.height-16;
      this.layer.style.setProperty('--sp-top',Math.max(0,start)+'px');
      this.layer.style.setProperty('--sp-height',Math.max(floor,Math.min(r.height-start-10,end-start))+'px');
      if(this.plane&&this.physicalImage){
        const body=this.plane.parentElement,ratio=this.physicalImage.naturalWidth/this.physicalImage.naturalHeight||2/3;
        const w=Math.min(body.clientWidth,body.clientHeight*ratio),h=w/ratio;
        this.plane.style.width=w+'px';this.plane.style.height=h+'px';
        if(this.physicalScreen)this.physicalScreen.style.fontSize=Math.max(8,Math.min(17,w*(this.active.screenRect[2]/100)/9))+'px';
      }
    }
    show(spec,{gate=false,native=false}={}){
      const render=++this.renderVersion;this.active={...spec};this.layer.hidden=false;this.layer.dataset.mode=spec.mode||'incoming';
      this.layer.classList.toggle('sp-gate',gate);this.layer.classList.toggle('sp-native',native);
      this.layer.replaceChildren();this.plane=null;this.physicalImage=null;this.physicalScreen=null;this.layer.setAttribute('aria-label',this.t(words[spec.mode]||words.incoming));
      const body=el('div','sp-body');this.layer.append(body);
      const physical=spec.presentation==='physical';
      const listener=spec.mode==='connected'&&spec.listener===true&&spec.scene==='room';
      this.layer.classList.toggle('sp-physical',physical);this.layer.classList.toggle('sp-listener',listener);
      // Only an explicitly located physical beat gets a scenic bitmap. A neutral
      // phone UI never reuses a bedroom background for street/study/court calls.
      const src=physical?this.asset(spec.art):listener?this.asset('listening'):'';
      if(physical){this.plane=el('div','sp-physical-plane');body.append(this.plane);}
      if(src){const art=el('img','sp-art');art.src=src;art.alt='';art.decoding='async';art.addEventListener('error',()=>{art.hidden=true;if(render===this.renderVersion&&this.physicalScreen)this.physicalScreen.hidden=true;},{once:true});(this.plane||body).append(art);if(physical){this.physicalImage=art;art.addEventListener('load',()=>{if(render===this.renderVersion)this.fit();},{once:true});}}
      if(physical){
        if(spec.screenRect){
          const [x,y,w,h]=spec.screenRect,inside=el('div','sp-physical-screen');this.physicalScreen=inside;
          Object.assign(inside.style,{left:x+'%',top:y+'%',width:w+'%',height:h+'%'});this.plane.append(inside);
          inside.append(el('span','sp-physical-kind',this.t(words[spec.screenMode||spec.mode])));
          const contact=this.data.contacts?.[spec.who];
          if(contact?.avatar){const avatar=el('img','sp-physical-avatar');avatar.src=this.assetBase+contact.avatar;avatar.alt='';avatar.addEventListener('error',()=>avatar.hidden=true,{once:true});inside.append(avatar);inside.append(el('small','sp-physical-label',this.t(words.contactPhoto)));}
          if(contact)inside.append(el('strong','sp-physical-name',this.t(contact.name)));
          if(spec.screenMode==='voicemail'||spec.screenMode==='charging'){
            const wave=el('div','sp-wave');wave.setAttribute('role','img');wave.setAttribute('aria-label',this.t(words.visualWave));
            [18,38,25,60,31,47,22,53,35,20,49,30].forEach(h=>{const b=el('i');b.style.height=h+'%';wave.append(b);});inside.append(wave);
          }
        }
        const caption=el('p','sp-caption',this.t(words[spec.mode]||words.incoming));body.append(caption);
        if(spec.screenRect)caption.hidden=true;this.actions=null;this.status=caption;this.fit();return body;
      }
      const screen=el('div','sp-screen');body.append(screen);
      screen.append(el('div','sp-earpiece'));
      screen.append(el('p','sp-kind',this.t(words[spec.mode]||words.incoming)));
      const contact=this.data.contacts?.[spec.who];
      if(contact){
        if(contact.avatar){const avatar=el('img','sp-avatar');avatar.src=this.assetBase+contact.avatar;avatar.alt='';avatar.addEventListener('error',()=>{avatar.hidden=true;},{once:true});screen.append(avatar);screen.append(el('span','sp-photo-label',this.t(words.contactPhoto)));}
        screen.append(el('h2','sp-name',this.t(contact.name)));
      }
      if(spec.battery!=null)screen.append(el('strong','sp-battery',spec.battery+'%'));
      if(['voicemail','recording','recording-playback','charging'].includes(spec.mode)){
        const wave=el('div','sp-wave');wave.setAttribute('role','img');wave.setAttribute('aria-label',this.t(words.visualWave));
        /* Decorative waveform only: no invented audio timing or duration. */
        [16,28,19,42,27,52,36,20,45,62,39,24,49,34,55,27,18,40,25,51,31,18,35,22].forEach(h=>{const bar=el('i');bar.style.height=h+'%';wave.append(bar);});screen.append(wave);
      }
      const status=el('p','sp-status',spec.status?this.t(words[spec.status]||spec.status):'');status.setAttribute('aria-live','polite');screen.append(status);
      const actions=el('div','sp-actions');screen.append(actions);this.actions=actions;this.status=status;
      if(!gate){this.layer.removeAttribute('role');this.layer.removeAttribute('aria-modal');}
      this.fit();return screen;
    }
    blockBackground(){
      this.input.activate(this);this.previousFocus=document.activeElement;
      this.savedInert=[...this.root.children].filter(x=>x!==this.layer).map(x=>[x,x.inert]);
      for(const [x]of this.savedInert)x.inert=true;
      document.addEventListener('keydown',this.guard,true);
      this.layer.setAttribute('role','dialog');this.layer.setAttribute('aria-modal','true');
    }
    releaseBackground(){
      this.input.release(this);for(const [x,value]of this.savedInert)if(x.isConnected)x.inert=value;this.savedInert=[];
      document.removeEventListener('keydown',this.guard,true);
      this.layer.removeAttribute('role');this.layer.removeAttribute('aria-modal');
    }
    silence(){if(this.pending?.action!=='answer')return;this.layer.classList.add('sp-silenced');if(this.status)this.status.textContent=this.t(words.silenced);}
    gate(spec,action){
      this.cancel();const token=++this.owner;this.show(spec,{gate:true});this.blockBackground();
      return new Promise(resolve=>{
        this.pending={token,resolve,action,busy:false};
        if(action==='answer'){
          const mute=el('button','sp-button sp-silence',this.t(words.silence));mute.type='button';mute.onclick=e=>{e.stopPropagation();this.silence();};this.actions.append(mute);
        }
        const go=el('button','sp-button sp-primary',this.t(words[action]||words.answer));go.type='button';
        go.onclick=e=>{e.preventDefault();e.stopPropagation();this.settle(token,true);};this.actions.append(go);go.focus();if(g.StoryEngine?.auto)setTimeout(()=>this.settle(token,true),5); // ?auto: tự chơi tự nhận cuộc gọi
      });
    }
    async settle(token,value){
      const p=this.pending;if(!p||p.token!==token||p.busy)return;p.busy=true;this.input.close(this);
      this.layer.querySelectorAll('button').forEach(b=>b.disabled=true);
      const reduced=g.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
      if(!reduced&&this.actions?.animate){
        const animation=this.actions.animate([{opacity:1},{opacity:0}],{duration:120,easing:'ease-out',fill:'forwards'});
        try{await animation.finished;}catch(_){}finally{animation.cancel();}
      }
      if(!this.pending||this.pending.token!==token)return;
      this.pending=null;this.releaseBackground();this.layer.classList.remove('sp-gate','sp-silenced');
      this.actions?.replaceChildren();if(this.previousFocus?.isConnected&&!this.previousFocus.inert)this.previousFocus.focus?.({preventScroll:true});
      p.resolve(value);
    }
    cancel(){
      ++this.owner;++this.renderVersion;const p=this.pending;if(p)this.input.close(this);this.pending=null;this.releaseBackground();
      this.layer.hidden=true;this.layer.replaceChildren();this.layer.classList.remove('sp-gate','sp-silenced','sp-native','sp-physical','sp-listener');
      this.active=null;this.actions=null;this.status=null;this.plane=null;this.physicalImage=null;this.physicalScreen=null;if(p)p.resolve(false);
    }
    destroy(){this.cancel();this.observer?.disconnect();g.removeEventListener?.('resize',this.resize);this.layer.remove();}
  }
  function install(E,data,options={}){
    if(!E||typeof E.def!=='function'||!E.mech||typeof E.on!=='function')return {installed:false,reason:'Required supplied public plugin API is unavailable.'};
    if(E.__statementPhoneD1)return E.__statementPhoneD1;
    const result={installed:true,revision:'d1',engineBaseline:'1.0.4',handlers:[],unavailableHandlers:[],invalidAnchors:[],gatesEnabled:options.gates!==false};
    let anchors=new WeakMap(),paths=new WeakMap(),surface=null,booted=false;
    const language=()=>options.language?options.language():(typeof E.nat==='function'&&E.nat({en:'en',vi:'vi'})==='vi'?'vi':'en');
    function ensure(){
      if(E.S()?.id!==data.game)return false;
      const root=document.querySelector('.se');if(!root)return false;
      if(!surface||surface.root!==root){surface?.destroy();surface=new PhoneSurface(root,{data,language,assetBase:options.assetBase});}
      if(!booted)index();return true;
    }
    function index(){
      anchors=new WeakMap();paths=new WeakMap();result.invalidAnchors=[];const S=E.S();if(!S||S.id!==data.game)return;
      const visit=(x,p)=>{if(!x||typeof x!=='object')return;paths.set(x,p);if(Array.isArray(x))x.forEach((v,i)=>visit(v,p+'['+i+']'));else Object.entries(x).forEach(([k,v])=>visit(v,p+'.'+k));};visit(S.nodes,'nodes');
      for(const a of data.anchors){const st=resolvePath(S,a.path);if(checkAnchor(st,a))anchors.set(st,a);else result.invalidAnchors.push(a.path);}
      booted=true;
    }
    async function before(c,a){
      if(a.clear){surface.cancel();return true;}
      if(a.gate&&result.gatesEnabled){
        const accepted=await surface.gate(a,a.gate);if(!accepted||!c.live())return false;
        if(a.gate==='answer')surface.show({...a,mode:'connected'});
        else if(a.gate==='play')surface.show({...a,status:null});
        else if(a.gate==='open')surface.cancel();
        else if(a.gate==='end')surface.show({...a,mode:'ended'});
      }else surface.show(a,{native:!!a.native});
      return true;
    }
    /* Only existing handlers are wrapped. No guessed branch runner or audio API. */
    for(const name of ['say','n','think','go','call','chat','listen','lock','type','choice']){
      const original=E.mech[name];if(typeof original!=='function'){result.unavailableHandlers.push(name);continue;}
      E.def(name,async function(c,...rest){
        if(!ensure())return original.call(this,c,...rest);
        const a=anchors.get(c.st);if(!a)return original.call(this,c,...rest);
        if(!await before(c,a)||!c.live())return;
        const out=await original.call(this,c,...rest);
        if(a.endAfter&&result.gatesEnabled&&c.live()&&surface.active?.path===a.path){
          const closed=await surface.gate({...a,mode:'ended',listener:false},'end');
          if(!closed||!c.live())return out;surface.cancel();
        }
        if(c.live()&&surface.active?.path===a.path){if(a.after==='clear')surface.cancel();else if(a.after==='ended')surface.show({...a,mode:a.mode==='voicemail'?'message-ended':'ended'});}
        return out;
      });result.handlers.push(name);
    }
    E.on('boot',()=>{index();ensure();});
    E.on('step',(_type,st)=>{
      if(!surface||surface.pending)return;const a=anchors.get(st),p=paths.get(st),active=surface.active;
      if(active&&!a&&p&&!inScope(p,active.scope))surface.cancel();
    });
    const cleanup=()=>{surface?.cancel();};
    for(const [target,key]of [[E,'stop'],[E.ui,'reset']]){
      if(typeof target?.[key]!=='function')continue;const original=target[key];
      target[key]=function(...args){cleanup();return original.apply(this,args);};
    }
    E.on('end',cleanup);
    result.cancel=cleanup;result.reindex=index;result.surface=()=>surface;
    E.__statementPhoneD1=result;return result;
  }
  g.StatementPhone={PhoneSurface,install,words,resolvePath,checkAnchor,inputSnapshot:()=>sharedInputGuard?.snapshot()||null};
  /* Explicit activation only: integration must test the real engine first. */
  if(g.StatementPhoneEnable===true&&g.StoryEngine&&g.StatementPhoneData)
    install(g.StoryEngine,g.StatementPhoneData,g.StatementPhoneOptions||{});
})(globalThis);
