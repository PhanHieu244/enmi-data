/* Vale0.6: visual metadata only; original spoken text, paths, grants and branches stay authoritative. */
(()=>{'use strict';const E=StoryEngine,q=s=>document.querySelector(s),isP1=()=>['vale-dossiers-p1c1-v01','vale-dossiers-chapter1-demo03'].includes(E.S()?.id);let queued=false,observer;
const sizes={study_clear:[941,1672],study_desk_clear:[941,1672],'prop-held-letter':[941,1672],'celia-holding':[1024,1536],'parlour-terms':[1024,1536],'parlour-panel-open':[1024,1536],c5_corner_departed:[1024,1536],'c5-walker-salute':[1024,1536],'act-cuff-pin':[1024,1536],'act-sealed-packet':[1024,1536]};
function letter(){if(!isP1()||!E.R())return'desk';const R=E.R();if(['desk','held','by-lamp'].includes(R.f.p1_letter_location))return R.f.p1_letter_location;const rep=(R.stack||[]).some(f=>f.n==='c1_open'&&f.p?.join('.')==='15.place.views.desk.zones.1.again');let s='desk';if(rep)s='by-lamp';else if(R.shot==='act-watermark')s='held';else{const l=[...(R.log||[])].reverse().flatMap(l=>[{main:l.main},{main:l.sub}]).find(l=>/^(The maker is established\.|The message is short\.|A (?:\[\[)?watermark|Eight tonight\.)/.test(l.main||''));if(l?.main?.startsWith('The maker is established.'))s='by-lamp';else if(R.items?.includes('sealed_note')||R.items?.includes('watermark')||R.pl?.c1_desk?.seen?.['desk/note_text']||R.pl?.c1_desk?.seen?.['desk/note_paper'])s='held';}R.f.p1_letter_location=s;return s;}
const held=()=>letter()==='held';
function retarget(){if(!isP1())return;const b=E.R()?.shotBack;if(b&&/^v:study_desk(?:_clear)?$/.test(b.key||''))b.key='v:'+(held()?'study_desk_clear':'study_desk');if(b?.scene==='study'&&held())b.scene='study_clear';}
const sh=E.ui.shot;E.ui.shot=(id,o)=>{if(isP1()&&!id)retarget();return sh(id,o);};
const sc=E.ui.scene;E.ui.scene=(id,keep)=>{if(isP1()){if((id==='study'||id==='study_clear')&&(E.R()?.ch||1)===1)id=held()?'study_clear':'study';if(id==='c5_corner'&&E.R()?.f?.p1_cab_departed)id='c5_corner_departed';}return sc(id,keep);};
const nativeSceneProps=E.ui.sceneProps;E.ui.sceneProps=(img,props)=>{if(isP1()&&img==='parlour-terms'&&E.R()?.f?.p1_photo_sealed&&props)props=props.filter(p=>p.id!=='packet');return nativeSceneProps(img,props);};
function remove(ids){for(const id of ids||[]){delete(E.R().props||{})[id];document.querySelectorAll('.prp').forEach(e=>{if(e.dataset.p===id)e.remove();});}}
E.side('valePhysical',async p=>{if(!isP1()||!p)return;if(p.letter)E.R().f.p1_letter_location=p.letter;if(p.cabDeparted)E.R().f.p1_cab_departed=true;if('photoSealed'in p){E.R().f.p1_photo_sealed=!!p.photoSealed;if(p.photoSealed&&E.R().sceneProps?.img==='parlour-terms')E.R().sceneProps.items=E.R().sceneProps.items.filter(x=>x.id!=='packet');}remove(p.remove);retarget();queue();});
E.side('valeStage',async p=>{if(!isP1()||!p)return;for(const id of p.hide||[])E.ui.hide(id);for(const a of p.show||[])E.ui.show(a.id,a.at||E.R()?.cast?.[a.id]?.at||'c',a.face||'');if('look'in p){await E.ui.layerReady?.();E.ui.look(p.look,E.G()?.set.motion==='reduced'?0:(p.ms??650));}});
function queue(){if(queued)return;queued=true;queueMicrotask(()=>{queued=false;control();});}
function control(){if(!isP1()||!E.R())return;const h=held(),ps=E.R().pl?.c1_desk,p=q('.se-panel.pl'),d=p&&E.R().vw?.pid==='c1_desk'&&ps?.v==='desk'&&!ps.detail; q('.se')?.classList.toggle('vale-note-held',h);const z=q('.se-bgl.on [data-zone-id="note_text"]');if(z){z.setAttribute('aria-hidden',h?'true':'false');z.tabIndex=h?-1:0;}let b=q('[data-vale-held-note]');if(!h||!d){b?.remove();return;}if(!b){const host=p.querySelector('.pl-bar');if(!host)return;b=document.createElement('button');b.type='button';b.className='pl-ib vale-held-note';b.dataset.valeHeldNote='true';b.setAttribute('aria-label',E.nat({en:'Read the letter in your hand',vi:'Đọc lá thư đang cầm'}));b.title=b.getAttribute('aria-label');b.innerHTML=(E.ICON.book||E.ICON.doc||E.ICON.box)+'<span>'+E.esc(E.nat({en:'Letter',vi:'Thư'}))+'</span>';b.onclick=e=>{e.stopPropagation();q('.se-bgl.on [data-zone-id="note_text"]')?.click();};host.insertBefore(b,host.querySelector('.pl-go'));}}
const at=(o,p)=>p.reduce((v,k)=>v?.[k],o);function patch(S,n,p,d){const s=at(S.nodes?.[n],p);if(s)Object.assign(s,d);return s;}
function walk(v,fn){if(!v||typeof v!=='object')return;fn(v);for(const[k,x]of Object.entries(v))if(!['motion','valeStage','valePhysical'].includes(k))walk(x,fn);}
const actor=(id,face='')=>({id,show:true,frames:[{offset:0,face},{offset:1,face}]});
const hand=()=>({id:'p1-held-letter',art:'prop-held-letter',at:[50,50],w:100,ar:941/1672,z:4,frames:[{offset:0,at:[50,65],opacity:0},{offset:.25,opacity:1},{offset:1,at:[50,50],opacity:1}]});
const photo=(from,to,o={})=>({id:'p1-photo',art:'prop-joint-photo',at:from,w:o.w||14,ar:1,z:3,frames:[{offset:0,at:from,opacity:o.fadeIn?0:1,scale:.92},{offset:.2,opacity:1},{offset:1,at:to,scale:1,opacity:o.fadeOut?0:1}],remove:!!o.remove});
function apply(){if(!isP1())return;const S=E.S();E.regions(Object.fromEntries(Object.entries(sizes).map(([id,size])=>[id,{size}])));for(const[id,base]of[['study_clear','study'],['parlour-terms','c6_room'],['parlour-panel-open','c4_parlour'],['c5_corner_departed','c5_corner']])if(S.scenes[base])S.scenes[id]={...S.scenes[base],size:sizes[id]};
// Staging is explicit: remote letter authors and quoted testimony never appear.
for(const[n,p,id,at,face]of[
 ['c3_open',[16],'hart','l','smiling'],['c3_open',[35],'hart','l',''],
 ['c4_open_visit',[2],'bell','c',''],['c4_open_visit',[9],'hart','l',''],['c4_open_visit',[15],'celia','r',''],['c4_open_explore',[2],'celia','r',''],
 ['c4_disguise',[4],'celia','r','resolute'],['c4_disguise',[13],'bell','l',''],
 ['c4_alarm_explore',[3],'celia','r',''],['c5_return',[1],'bell','c',''],
 ['c6_visit',[4],'bell','c',''],['c6_terms',[7],'c3_clerk','l',''],
 ['c6_terms',[8],'celia','r',''],['c6_terms',[12],'celia','r','smiling'],
 ['c6_terms',[15],'celia','r','smiling'],['c6_truth',[7],'reed','l',''],
 ['c6_open_file',[5],'reed','l','']
])patch(S,n,p,{valeStage:{show:[{id,at,face}]}});
const entry=S.nodes.c1_open?.[15],desk=entry?.place?.views?.desk;if(desk){desk.img=()=>held()?'study_desk_clear':'study_desk';desk.size=[941,1672];entry.shot=null;entry.valePhysical={remove:['p1-held-letter']};const r=desk.zones.find(z=>z.id==='note_text'),p=desk.zones.find(z=>z.id==='note_paper');for(const[k,a]of[['first',r.then],['again',r.again]])if(a?.[0])Object.assign(a[0],{shot:'study_desk_clear',look:null,valePhysical:{letter:'held'},motion:{id:'p1-c1-note-'+k,ms:1050,tracks:[hand()]}});Object.assign(r.then.at(-1),{shot:null,valePhysical:{remove:['p1-held-letter']}});Object.assign(p.then[0],{valePhysical:{letter:'held',remove:['p1-held-letter']}});Object.assign(p.then[1],{valeStage:{look:[11,19,80,50],ms:850}});Object.assign(p.again[0],{valePhysical:{letter:'by-lamp',remove:['p1-held-letter']},motion:{id:'p1-c1-note-set-down',ms:750,backdrop:{frames:[{offset:0,art:'study_desk_clear'},{offset:.6,art:'study_desk'}]}}});}
patch(S,'c1_arrival',[16],{valeStage:{look:[17,10,70,56],ms:750}});
patch(S,'c2_call',[8],{on:'hart',motion:{id:'p1-c2-hart-arrives',ms:1000,actors:[actor('hart','smiling')]}});
patch(S,'c3_open',[29],{valeStage:{look:[31,38,66,44],ms:800}});
patch(S,'c3_open',[41],{on:'celia',motion:{id:'p1-c3-wedding-to-resolve',ms:1050,actors:[{id:'celia',show:true,frames:[{offset:0,face:'smiling'},{offset:.65,face:'resolute'},{offset:1,face:'resolute'}]}]}});
// One Celia silhouette; both gloved hands support the original framed photograph.
for(const[n,p,id]of[['c4_open_visit',[12],'p1-c4-frame-revealed'],['c4_disguise',[9],'p1-c4-frame-protected']])
 patch(S,n,p,{shot:'parlour-panel-open',motion:{id,ms:1350,actors:[{id:'celia',hide:true}],tracks:[{id:'p1-celia-holding',art:'celia-full',at:[58,49],w:40,ar:2/3,z:2,frames:[{offset:0,opacity:0},{offset:.2,opacity:1},{offset:.45,art:'celia-holding'},{offset:1,art:'celia-holding'}]}]}});
patch(S,'c4_disguise',[10],{valeStage:{look:[43,31,34,30],ms:650}});
patch(S,'c4_open_visit',[15],{shot:null,valePhysical:{remove:['p1-celia-holding']}});
patch(S,'c4_open_explore',[0],{shot:null,valePhysical:{remove:['p1-celia-holding']}});
for(const[n,p,id]of[['c4_open_explore',[1],'p1-c4-panel-closed'],['c4_disguise',[14],'p1-c4-panel-returned']])
 patch(S,n,p,{valePhysical:{remove:['p1-celia-holding']},motion:{id,ms:1100,backdrop:{frames:[{offset:0,art:'parlour-panel-open'},{offset:.65,art:'c4_parlour'}]}}});
patch(S,'c4_open_explore',[2],{shot:null});
patch(S,'c4_alarm_explore',[0],{shot:null,valePhysical:{remove:['p1-celia-holding']}});
patch(S,'c4_alarm_explore',[1,'choice',1,'then',0],{motion:{id:'p1-c4-panel-taken',ms:1300,backdrop:{frames:[{offset:0,art:'c4_parlour'},{offset:.35,art:'parlour-panel-open'},{offset:1,art:'c4_parlour'}]}}});
patch(S,'c4_alarm_explore',[2],{shot:null});
patch(S,'c5_open',[4],{look:null,motion:{id:'p1-c5-passerby',ms:1450,tracks:[{id:'p1-walker',art:'c5_walker-full',at:[32,43],w:38,ar:2/3,z:3,frames:[{offset:0,at:[25,43],opacity:0},{offset:.2,opacity:1},{offset:1,at:[51,43],opacity:1}]}]}});
patch(S,'c5_open',[6],{motion:{id:'p1-c5-two-fingers',ms:2000,tracks:[{id:'p1-walker',art:'c5_walker-full',at:[51,43],w:38,ar:2/3,z:3,frames:[{offset:0,at:[51,43]},{offset:.15,art:'c5-walker-salute'},{offset:.55,at:[54,43],art:'c5-walker-salute'},{offset:.7,art:'c5_walker-full'},{offset:1,at:[88,43],opacity:0}],remove:true}]}});
const cab=S.nodes.c5_follow?.[2]?.explore?.spots.find(s=>s.id==='cab');if(cab?.then?.[0])Object.assign(cab.then[0],{valePhysical:{cabDeparted:true},motion:{id:'p1-c5-cab-departs',ms:1200,backdrop:{frames:[{offset:0,art:'c5_corner'},{offset:.55,art:'c5_corner_departed'}]}}});
patch(S,'c5_return',[3],{on:'bell',motion:{id:'p1-c5-bell-checks-frame',ms:1150,actors:[actor('bell','')]}});
patch(S,'c6_terms',[4],{bg:'parlour-terms',valePhysical:{photoSealed:false}});patch(S,'c6_terms',[16],{motion:{id:'p1-c6-departure',ms:1300,backdrop:{frames:[{offset:0,art:'parlour-terms'},{offset:.75,art:'c6_room'}]}}});patch(S,'c6_terms',[10],{valePhysical:{photoSealed:true},valeStage:{look:[17,24,66,48],ms:850}});
patch(S,'c6_truth',[6],{look:[46,74,16,12],motion:{id:'p1-c6-solo-portrait-kept',ms:1400,tracks:[{id:'p1-final-portrait',art:'evidence-portrait',at:[54,80],w:14,ar:1,z:2,frames:[{offset:0,at:[54,90],opacity:0,rotate:-6},{offset:.2,opacity:1},{offset:1,at:[54,80],rotate:0}]}]}});
patch(S,'c6_delivery',[0],{on:'matthias',motion:{id:'p1-c6-photo-reaction',ms:1050,actors:[actor('matthias','resolute')]}});
}
E.on('boot',()=>{if(!isP1())return;apply();letter();observer?.disconnect();observer=new MutationObserver(queue);observer.observe(q('.se'),{childList:true,subtree:true});queueMicrotask(apply);queue();});E.on('chapter',()=>{if(isP1()){apply();queueMicrotask(apply);}});E.on('step',(type,st)=>{if(!isP1())return;if(type==='explore'){if(st===E.S().nodes.c5_follow?.[2])st.explore.img=E.R().f.p1_cab_departed?'c5_corner_departed':'c5_corner';if(st===E.S().nodes.c6_terms?.[9]){st.explore.img='parlour-terms';const p=st.explore.spots.find(p=>p.id==='packet');if(p)Object.assign(p,{art:'celia-holding',artR:[18,28,39,39],r:[32,36,12,10],inspectR:[20,26,38,35],x:38,y:41});}}queue();});E.on('line',queue);
})();

;

