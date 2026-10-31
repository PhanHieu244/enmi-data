/* Vale0.6: visual metadata only; original spoken text, paths, grants and branches stay authoritative. */
(()=>{'use strict';const E=StoryEngine,q=s=>document.querySelector(s),isP1=()=>['vale-dossiers-p1c1-v01','vale-dossiers-chapter1-demo03'].includes(E.S()?.id);let queued=false,observer;
const sizes={'act-mask-before':[940,1672],'act-mask-mid':[940,1672],'matthias-entry-full':[1024,1536],'cab_stand_departed':[941,1672],'wren-door-chain':[941,1672],'wren-door-note':[941,1671],'wren-observed-gloves':[941,1672],'act-finn-care':[941,1672],'act-finn-turn':[941,1672],study_clear:[941,1672],study_desk_clear:[941,1672],'prop-held-letter':[941,1672],'celia-holding':[1024,1536],'parlour-terms':[1024,1536],'parlour-panel-open':[1024,1536],c5_corner_departed:[1024,1536],'c5-walker-salute':[1024,1536],'act-cuff-pin':[1024,1536],'act-sealed-packet':[1024,1536]};
Object.assign(sizes,{'parlour-day-empty-panel':[1024,1536],'act-retainer-place':[941,1672],'act-retainer-moved':[941,1671],'act-wedding-ring':[1024,1536],'act-wedding-hands':[1024,1536],'act-register-sign':[1254,1254],'act-register-ready':[1254,1254],'act-photo-return-offer':[941,1672],'act-photo-return-received':[941,1672],'act-client-photo-held':[1024,1536],'act-client-photo-down':[1024,1536],'act-client-photo-packed':[1024,1536],'act-client-empty-wrapping':[1024,1536]});
const contactRegions={'act-retainer-place':[46,44,25,13],'act-retainer-moved':[53,43,25,11],'act-wedding-ring':[34,41,25,11],'act-wedding-hands':[34,41,25,11],'act-register-sign':[58,59,21,9],'act-register-ready':[58,59,21,9],'act-photo-return-offer':[22,60,25,10],'act-photo-return-received':[36,53,28,10],'act-client-photo-held':[35,61,29,8],'act-client-photo-down':[36,72,31,6],'act-client-photo-packed':[70,69,25,7],'act-client-empty-wrapping':[35,72,30,7]};

Object.assign(sizes,{'c6_study':[941,1672],'c6_after':[941,1672],'act-hart-envelope-search':[1024,1536],'act-hart-envelope-gloves':[1024,1536],'act-hart-envelope-tucked':[1024,1536],'act-hart-envelope-away':[1024,1536],'act-vale-disguise-mirror':[1024,1536],'act-vale-disguise-ready':[1024,1536],'act-vale-stumble-pov':[1024,1536],'act-vale-support-pov':[1024,1536],'act-bell-water-pov':[1024,1536],'act-frame-retrieve-pov':[1024,1536],'act-frame-conceal-pov':[1024,1536],'act-vale-undisguise-pov':[941,1672]});
Object.assign(contactRegions,{'act-register-sign':[40,64,17,7],'act-register-ready':[43,58,18,7],'act-hart-envelope-search':[41,32,15,10],'act-hart-envelope-gloves':[41,32,15,10],'act-hart-envelope-tucked':[48,32,9,6],'act-hart-envelope-away':[41,34,18,8],'act-vale-disguise-mirror':[36,24,30,13],'act-vale-disguise-ready':[36,24,30,13],'act-vale-stumble-pov':[75,52,15,10],'act-vale-support-pov':[56,52,23,10],'act-bell-water-pov':[39,51,31,9],'act-frame-retrieve-pov':[38,48,31,10],'act-frame-conceal-pov':[40,55,27,10],'act-vale-undisguise-pov':[35,64,36,12]});
// Every study plate uses the original fireplace-left/window-right camera and left desk lamp.
for(const id of ['study','study_desk','study_clear','study_desk_clear','study_by_lamp','study_desk_lamp','act-letter-setdown','act-retainer-place','act-retainer-moved','act-terms-write','act-terms-slide','act-terms-sign','act-terms-copy','act-frame-desk','act-frame-wrap','act-frame-wrapped','act-client-photo-held','act-client-photo-down','act-client-photo-packed','act-client-empty-wrapping'])sizes[id]=[941,1672];
sizes['act-retainer-place']=[941,1671];sizes['act-retainer-moved']=[941,1671];
for(const id of ['act-bell-water-smoke-pov','act-celia-signs','act-matthias-signs','act-sealed-packet','act-pike-receipts','act-hart-copies'])sizes[id]=[1024,1536];
Object.assign(contactRegions,{'act-letter-setdown':[47,73,16,6],study_desk_lamp:[21,76,27,5],'act-retainer-place':[44,69,27,9],'act-retainer-moved':[12,62,20,8],'act-terms-write':[48,82,12,4],'act-terms-slide':[42,73,18,6],'act-terms-sign':[47,72,13,5],'act-terms-copy':[40,71,14,5],'act-frame-desk':[32,82,29,6],'act-frame-wrap':[36,78,28,6],'act-frame-wrapped':[36,78,28,6],'act-bell-water-smoke-pov':[13,16,12,17],'act-celia-signs':[57,64,12,6],'act-matthias-signs':[64,63,12,6],'act-sealed-packet':[50,58,16,7],'act-pike-receipts':[57,59,17,6],'act-hart-copies':[59,70,22,7],'act-client-photo-held':[45,59,29,8],'act-client-photo-down':[42,72,26,5],'act-client-photo-packed':[76,69,16,6],'act-client-empty-wrapping':[38,73,26,6]});
Object.assign(contactRegions,{'act-terms-write':{box:[48,82,12,4],maxScale:5},'act-frame-desk':{box:[63,82,12,3],maxScale:5.5},'act-frame-wrap':{box:[58,83,16,5],maxScale:5.5},'act-frame-wrapped':{box:[40,81,22,4],maxScale:4.5},'act-hart-copies':[68,72,14,4]});
const letterRegions={c6_after:{r:{'p1-final-portrait':{box:[50.3,75,7.4,4],maxScale:4}}}};for(const id of ['study_desk','study_desk_clear','study_desk_lamp'])letterRegions[id]={r:{'p1-letter':id==='study_desk_lamp'?[25,77,21,4]:[40,79,22,5],'p1-letter-inspect':id==='study_desk_lamp'?[19,74,31,9]:[31,77,35,10],'p1-lamp':[4,56,12,6],'p1-lamp-inspect':[0,50,24,27],'p1-news':[6,81,27,6],'p1-news-inspect':[3,78,40,12]}};
function letter(){if(!isP1()||!E.R())return'desk';const R=E.R();if(['desk','held','by-lamp'].includes(R.f.p1_letter_location))return R.f.p1_letter_location;const rep=(R.stack||[]).some(f=>f.n==='c1_open'&&f.p?.join('.')==='15.place.views.desk.zones.1.again');let s='desk';if(rep)s='by-lamp';else if(R.shot==='act-watermark')s='held';else{const l=[...(R.log||[])].reverse().flatMap(l=>[{main:l.main},{main:l.sub}]).find(l=>/^(The maker is established\.|The message is short\.|A (?:\[\[)?watermark|Eight tonight\.)/.test(l.main||''));if(l?.main?.startsWith('The maker is established.'))s='by-lamp';else if(R.items?.includes('sealed_note')||R.items?.includes('watermark')||R.pl?.c1_desk?.seen?.['desk/note_text']||R.pl?.c1_desk?.seen?.['desk/note_paper'])s='held';}R.f.p1_letter_location=s;return s;}
const held=()=>letter()==='held';
const roomLetter=()=>held()?'study_clear':letter()==='by-lamp'?'study_by_lamp':'study',deskLetter=()=>held()?'study_desk_clear':letter()==='by-lamp'?'study_desk_lamp':'study_desk';
function retarget(){if(!isP1())return;const b=E.R()?.shotBack;if(b&&/^v:study_desk(?:_clear|_lamp)?$/.test(b.key||''))b.key='v:'+deskLetter();if(b&&['study','study_clear','study_by_lamp'].includes(b.scene))b.scene=roomLetter();}
const sh=E.ui.shot;E.ui.shot=(id,o)=>{if(isP1()&&!id)retarget();return sh(id,o);};
const sc=E.ui.scene;E.ui.scene=(id,keep)=>{if(isP1()){if(['study','study_clear','study_by_lamp'].includes(id)&&(E.R()?.ch||1)===1)id=roomLetter();if(id==='cab_stand'&&E.R()?.f?.p1_finn_cab_departed)id='cab_stand_departed';if(id==='c5_corner'&&E.R()?.f?.p1_cab_departed)id='c5_corner_departed';}return sc(id,keep);};
const nativeSceneProps=E.ui.sceneProps;E.ui.sceneProps=(img,props)=>{if(isP1()&&img==='parlour-terms'&&E.R()?.f?.p1_photo_sealed&&props)props=props.filter(p=>p.id!=='packet');return nativeSceneProps(img,props);};
function remove(ids){for(const id of ids||[]){delete(E.R().props||{})[id];document.querySelectorAll('.prp').forEach(e=>{if(e.dataset.p===id)e.remove();});}}
E.side('valePhysical',async p=>{if(!isP1()||!p)return;if(p.letter)E.R().f.p1_letter_location=p.letter;if(p.finnCabDeparted)E.R().f.p1_finn_cab_departed=true;if(p.wrenDoor)E.R().f.p1_wren_door=p.wrenDoor;if(p.invitation)E.R().f.p1_invitation_location=p.invitation;if(p.cabDeparted)E.R().f.p1_cab_departed=true;if('photoSealed'in p){E.R().f.p1_photo_sealed=!!p.photoSealed;if(p.photoSealed&&E.R().sceneProps?.img==='parlour-terms')E.R().sceneProps.items=E.R().sceneProps.items.filter(x=>x.id!=='packet');}remove(p.remove);retarget();queue();});
E.side('valeStage',async p=>{if(!isP1()||!p)return;for(const id of p.hide||[])E.ui.hide(id);for(const a of p.show||[])E.ui.show(a.id,a.at||E.R()?.cast?.[a.id]?.at||'c',a.face||'');if('look'in p){await E.ui.layerReady?.();E.ui.look(p.look,E.G()?.set.motion==='reduced'?0:(p.ms??650));}});
function queue(){if(queued)return;queued=true;queueMicrotask(()=>{queued=false;control();});}
function control(){if(!isP1()||!E.R())return;const h=held(),ps=E.R().pl?.c1_desk,p=q('.se-panel.pl'),d=p&&E.R().vw?.pid==='c1_desk'&&ps?.v==='desk'&&!ps.detail; q('.se')?.classList.toggle('vale-note-held',h);const z=q('.se-bgl.on [data-zone-id="note_text"]');if(z){z.setAttribute('aria-hidden',h?'true':'false');z.tabIndex=h?-1:0;}let b=q('[data-vale-held-note]');if(!h||!d){b?.remove();return;}if(!b){const host=p.querySelector('.pl-bar');if(!host)return;b=document.createElement('button');b.type='button';b.className='pl-ib vale-held-note';b.dataset.valeHeldNote='true';b.setAttribute('aria-label',E.nat({en:'Read the letter in your hand',vi:'Đọc lá thư đang cầm'}));b.title=b.getAttribute('aria-label');b.innerHTML=(E.ICON.book||E.ICON.doc||E.ICON.box)+'<span>'+E.esc(E.nat({en:'Letter',vi:'Thư'}))+'</span>';b.onclick=e=>{e.stopPropagation();q('.se-bgl.on [data-zone-id="note_text"]')?.click();};host.insertBefore(b,host.querySelector('.pl-go'));}}
const at=(o,p)=>p.reduce((v,k)=>v?.[k],o);function patch(S,n,p,d){const s=at(S.nodes?.[n],p);if(s)Object.assign(s,d);return s;}
function walk(v,fn){if(!v||typeof v!=='object')return;fn(v);for(const[k,x]of Object.entries(v))if(!['motion','valeStage','valePhysical'].includes(k))walk(x,fn);}
const actor=(id,face='')=>({id,show:true,frames:[{offset:0,face},{offset:1,face}]});
const hand=()=>({id:'p1-held-letter',art:'prop-held-letter',at:[50,50],w:100,ar:941/1672,z:4,frames:[{offset:0,at:[50,65],opacity:0},{offset:.25,opacity:1},{offset:1,at:[50,50],opacity:1}]});
const photo=(from,to,o={})=>({id:'p1-photo',art:'prop-joint-photo',at:from,w:o.w||14,ar:1,z:3,frames:[{offset:0,at:from,opacity:o.fadeIn?0:1,scale:.92},{offset:.2,opacity:1},{offset:1,at:to,scale:1,opacity:o.fadeOut?0:1}],remove:!!o.remove});
function apply(){if(!isP1())return;const S=E.S();E.regions(letterRegions);E.regions(Object.fromEntries(Object.entries(contactRegions).map(([id,box])=>[id,{r:{'p1-contact':box}}])));E.regions(Object.fromEntries(Object.entries(sizes).map(([id,size])=>[id,{size}])));for(const[id,base]of[['study_clear','study'],['study_by_lamp','study'],['cab_stand_departed','cab_stand'],['parlour-terms','c6_room'],['parlour-panel-open','c4_parlour'],['c5_corner_departed','c5_corner']])if(S.scenes[base])S.scenes[id]={...S.scenes[base],size:sizes[id]};
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
const entry=S.nodes.c1_open?.[15],desk=entry?.place?.views?.desk;if(desk){
 desk.img=deskLetter;desk.size=[941,1672];entry.shot=null;entry.valePhysical={remove:['p1-held-letter']};
 const r=desk.zones.find(z=>z.id==='note_text'),p=desk.zones.find(z=>z.id==='note_paper'),news=desk.zones.find(z=>z.id==='evening_news');
 Object.assign(r,{r:'p1-letter',inspectR:'p1-letter-inspect'});Object.assign(p,{r:'p1-lamp',inspectR:'p1-lamp-inspect'});Object.assign(news,{r:'p1-news',inspectR:'p1-news-inspect'});
 for(const[k,a]of[['first',r.then],['again',r.again]])if(a?.[0])Object.assign(a[0],{shot:'study_desk_clear',look:null,valePhysical:{letter:'held'},motion:{id:'p1-c1-note-'+k,ms:1050,tracks:[hand()]}});
 Object.assign(r.then.at(-1),{shot:null,valePhysical:{remove:['p1-held-letter']}});Object.assign(p.then[0],{valePhysical:{letter:'held',remove:['p1-held-letter']}});Object.assign(p.then[1],{valeStage:{look:[38,26,26,12],ms:850}});
 Object.assign(p.again[0],{shot:'act-letter-setdown',look:'p1-contact',valePhysical:{letter:'by-lamp',remove:['p1-held-letter']},motion:{id:'p1-c1-note-set-down',ms:1700,backdrop:{frames:[{offset:0,art:'act-letter-setdown'},{offset:.6,art:'study_desk_lamp'},{offset:1,art:'study_desk_lamp'}]}}});
}
// Chapter1 actions are performed on the existing lines. No branch or save index moves.
patch(S,'c1_arrival',[1],{shot:'study_door',look:[36,27,43,38],motion:{id:'p1-c1-masked-entrance',ms:1650,tracks:[{id:'p1-masked-visitor',art:'matthias-entry-full',at:[58,51],w:48,ar:2/3,z:2,frames:[{offset:0,at:[58,51],w:48,opacity:0},{offset:.22,opacity:1},{offset:1,at:[58,48],w:54,opacity:1}]}]}});
patch(S,'c1_arrival',[3],{shot:null,valePhysical:{remove:['p1-masked-visitor']}});
patch(S,'c1_arrival',[16],{shot:'act-mask-before',look:[17,10,70,56],motion:{id:'p1-c1-remove-mask',ms:2350,backdrop:{frames:[{offset:0,art:'act-mask-before'},{offset:.34,art:'act-mask-mid'},{offset:.72,art:'act-unmask'},{offset:1,art:'act-unmask'}]}}});
// Observation is witnessed action, not an identification: no character meet/name cue.
patch(S,'c1_terms',[0],{shot:'act-retainer-place',look:'p1-contact',motion:{id:'p1-c1-retainer-set-aside',ms:2400,backdrop:{frames:[{offset:0,art:'act-retainer-place'},{offset:.55,art:'act-retainer-moved'},{offset:1,art:'act-retainer-moved'}]}}});
patch(S,'c1_terms',[1],{shot:null});
patch(S,'c1_terms',[3,'choice',0,'then',0],{shot:'act-terms-write',look:'p1-contact',motion:{id:'p1-c1-terms-written-and-slid',ms:2800,sounds:[{at:.08,cue:'pen_write'},{at:.55,cue:'paper_slide'}],backdrop:{frames:[{offset:0,art:'act-terms-write'},{offset:.55,art:'act-terms-slide'},{offset:1,art:'act-terms-slide'}]}}});
patch(S,'c1_terms',[3,'choice',0,'then',1],{shot:null});
patch(S,'c1_terms',[3,'choice',0,'then',3],{shot:'act-terms-sign',look:'p1-contact',motion:{id:'p1-c1-terms-signed-and-copied',ms:3200,sounds:[{at:.08,cue:'pen_write'},{at:.58,cue:'pen_write'}],backdrop:{frames:[{offset:0,art:'act-terms-sign'},{offset:.55,art:'act-terms-copy'},{offset:1,art:'act-terms-copy'}]}}});
patch(S,'c1_terms',[4],{shot:null});
patch(S,'c1_observe',[6],{look:null,motion:{id:'p1-c1-gloves-observed',ms:1300,backdrop:{frames:[{offset:0,art:'wren_door'},{offset:.5,art:'wren-observed-gloves'}]}}});
patch(S,'c1_observe',[7],{shot:null});
// Horse care remains a single baked Finn, followed by the original native speaker.
patch(S,'c1_neighbourhood',[1],{shot:'act-finn-care',look:[32,34,38,30]});
patch(S,'c1_neighbourhood',[2],{look:[32,34,38,30],motion:{id:'p1-c1-finn-finishes-ear',ms:1700,backdrop:{frames:[{offset:0,art:'act-finn-care'},{offset:.5,art:'act-finn-turn'},{offset:1,art:'act-finn-turn'}]}}});
patch(S,'c1_neighbourhood',[3],{shot:null});
patch(S,'c1_neighbourhood',[22],{motion:{id:'p1-c1-finn-boards',ms:850,actors:[{id:'finn',hide:true}]}});
patch(S,'c1_neighbourhood',[24],{look:null,valePhysical:{finnCabDeparted:true},motion:{id:'p1-c1-finn-cab-departs',ms:1500,backdrop:{frames:[{offset:0,art:'cab_stand'},{offset:.6,art:'cab_stand_departed'},{offset:1,art:'cab_stand_departed'}]}}});
// Bell stays behind the chain. Each handover resolves to the empty hand, not a duplicate note.
patch(S,'c1_direct',[4],{look:[36,27,29,29],valePhysical:{wrenDoor:'chained'},motion:{id:'p1-c1-door-chain-opens',ms:1450,backdrop:{frames:[{offset:0,art:'wren_door'},{offset:.45,art:'wren-door-chain'},{offset:1,art:'wren-door-chain'}]}}});
patch(S,'c1_direct',[12],{valePhysical:{wrenDoor:'closed'},motion:{id:'p1-c1-door-wait',ms:1100,backdrop:{frames:[{offset:0,art:'wren-door-chain'},{offset:.65,art:'wren_door'}]}}});
patch(S,'c1_direct',[16],{look:[36,27,29,29],valePhysical:{wrenDoor:'chained',invitation:'held'},motion:{id:'p1-c1-invitation-handover',ms:2600,backdrop:{frames:[{offset:0,art:'wren_door'},{offset:.23,art:'wren-door-chain'},{offset:.48,art:'wren-door-note'},{offset:.85,art:'wren-door-chain'},{offset:1,art:'wren-door-chain'}]}}});
patch(S,'c1_direct',[22],{valePhysical:{wrenDoor:'closed'},motion:{id:'p1-c1-door-final-close',ms:1150,backdrop:{frames:[{offset:0,art:'wren-door-chain'},{offset:.65,art:'wren_door'}]}}});
// The envelope stays with Hart throughout; native portrait appears only after the action shot.
patch(S,'c2_call',[8],{shot:'act-hart-envelope-search',look:'p1-contact',motion:{id:'p1-c2-hart-finds-gloves',ms:1900,backdrop:{frames:[{offset:0,art:'act-hart-envelope-search'},{offset:.5,art:'act-hart-envelope-gloves'},{offset:1,art:'act-hart-envelope-gloves'}]}}});
patch(S,'c2_call',[11],{shot:null});
patch(S,'c2_call',[14],{shot:'act-hart-envelope-tucked',look:'p1-contact'});
patch(S,'c2_call',[15],{shot:null});
patch(S,'c2_call',[18],{shot:'act-hart-envelope-away',look:'p1-contact',motion:{id:'p1-c2-couple-leaves-on-foot',ms:2600,actors:[{id:'hart',hide:true},{id:'celia',hide:true}],backdrop:{frames:[{offset:0,art:'act-hart-envelope-away'},{offset:.7,art:'c2_front_day'},{offset:1,art:'c2_front_day'}]}}});
patch(S,'c2_call',[20],{shot:null});

// Witnessed wedding and register actions; no historical claim is dramatised as fact.
patch(S,'c3_open',[14],{shot:'act-wedding-ring',look:'p1-contact',motion:{id:'p1-c3-ring-and-hand',ms:2100,backdrop:{frames:[{offset:0,art:'act-wedding-ring'},{offset:.5,art:'act-wedding-hands'},{offset:1,art:'act-wedding-hands'}]}}});
patch(S,'c3_open',[16],{shot:null});
patch(S,'c3_open',[18],{shot:'act-register-sign',look:'p1-contact',motion:{id:'p1-c3-register-signed',ms:2200,backdrop:{frames:[{offset:0,art:'act-register-sign'},{offset:.55,art:'act-register-ready'},{offset:1,art:'act-register-ready'}]}}});
patch(S,'c3_open',[22],{shot:null});
patch(S,'c3_open',[29],{valeStage:{look:[31,38,66,44],ms:800}});
patch(S,'c3_open',[41],{on:'celia',motion:{id:'p1-c3-wedding-to-resolve',ms:1050,actors:[{id:'celia',show:true,frames:[{offset:0,face:'smiling'},{offset:.65,face:'resolute'},{offset:1,face:'resolute'}]}]}});
// First-person physical chain: reflected dressing, own forearm, visible helpers, then concealment.
patch(S,'c4_disguise',[0],{shot:'act-vale-disguise-mirror',look:'p1-contact',motion:{id:'p1-c4-disguise-fitted',ms:2200,backdrop:{frames:[{offset:0,art:'act-vale-disguise-mirror'},{offset:.55,art:'act-vale-disguise-ready'},{offset:1,art:'act-vale-disguise-ready'}]}}});
patch(S,'c4_disguise',[3],{shot:'act-vale-stumble-pov',look:'p1-contact'});
patch(S,'c4_disguise',[4],{shot:null});
patch(S,'c4_disguise',[5],{shot:'act-vale-support-pov',look:'p1-contact'});
patch(S,'c4_disguise',[7],{shot:'act-bell-water-pov',look:'p1-contact',motion:{id:'p1-c4-water-and-smoke',ms:2800,backdrop:{frames:[{offset:0,art:'act-bell-water-pov'},{offset:.55,art:'act-bell-water-smoke-pov'},{offset:1,art:'act-bell-water-smoke-pov'}]}}});
patch(S,'c4_exit',[6,'then',0],{shot:'act-vale-undisguise-pov',look:'p1-contact'});
patch(S,'c4_exit',[7],{shot:null});
// One Celia silhouette; both gloved hands support the original framed photograph.
for(const[n,p,id]of[['c4_open_visit',[12],'p1-c4-frame-revealed'],['c4_disguise',[9],'p1-c4-frame-protected']])
 patch(S,n,p,{shot:'parlour-panel-open',look:[53,35,17,13],motion:{id,ms:1350,actors:[{id:'celia',hide:true}],tracks:[{id:'p1-celia-holding',art:'celia-full',at:[58,49],w:40,ar:2/3,z:2,frames:[{offset:0,opacity:0},{offset:.2,opacity:1},{offset:.45,art:'celia-holding'},{offset:1,art:'celia-holding'}]}]}});
patch(S,'c4_disguise',[10],{look:[53,35,17,13]});
patch(S,'c4_open_visit',[15],{shot:null,valePhysical:{remove:['p1-celia-holding']}});
patch(S,'c4_open_explore',[0],{shot:null,valePhysical:{remove:['p1-celia-holding']}});
for(const[n,p,id]of[['c4_open_explore',[1],'p1-c4-panel-closed'],['c4_disguise',[14],'p1-c4-panel-returned']])
 patch(S,n,p,{valePhysical:{remove:['p1-celia-holding']},motion:{id,ms:1100,backdrop:{frames:[{offset:0,art:'parlour-panel-open'},{offset:.65,art:'c4_parlour'}]}}});
patch(S,'c4_open_explore',[2],{shot:null});
patch(S,'c4_alarm_explore',[0],{shot:null,valePhysical:{remove:['p1-celia-holding']}});
patch(S,'c4_alarm_explore',[1,'choice',1,'then',0],{shot:'act-frame-retrieve-pov',look:'p1-contact',motion:{id:'p1-c4-panel-taken',ms:2700,backdrop:{frames:[{offset:0,art:'act-frame-retrieve-pov'},{offset:.55,art:'act-frame-conceal-pov'},{offset:1,art:'act-frame-conceal-pov'}]}}});
patch(S,'c4_alarm_explore',[2],{shot:null});
patch(S,'c5_open',[4],{look:null,motion:{id:'p1-c5-passerby',ms:1450,tracks:[{id:'p1-walker',art:'c5_walker-full',at:[32,43],w:38,ar:2/3,z:3,frames:[{offset:0,at:[25,43],opacity:0},{offset:.2,opacity:1},{offset:1,at:[51,43],opacity:1}]}]}});
patch(S,'c5_open',[6],{motion:{id:'p1-c5-two-fingers',ms:2000,tracks:[{id:'p1-walker',art:'c5_walker-full',at:[51,43],w:38,ar:2/3,z:3,frames:[{offset:0,at:[51,43]},{offset:.15,art:'c5-walker-salute'},{offset:.55,at:[54,43],art:'c5-walker-salute'},{offset:.7,art:'c5_walker-full'},{offset:1,at:[88,43],opacity:0}],remove:true}]}});
const cab=S.nodes.c5_follow?.[2]?.explore?.spots.find(s=>s.id==='cab');if(cab?.then?.[0])Object.assign(cab.then[0],{valePhysical:{cabDeparted:true},motion:{id:'p1-c5-cab-departs',ms:1200,backdrop:{frames:[{offset:0,art:'c5_corner'},{offset:.55,art:'c5_corner_departed'}]}}});
patch(S,'c5_possession',[3,'then',0],{shot:'act-frame-desk',look:'p1-contact'});
patch(S,'c5_possession',[3,'then',1,'choice',1,'then',3],{shot:'act-frame-wrap',look:'p1-contact',motion:{id:'p1-c5-frame-wrapped',ms:2500,sounds:[{at:.1,cue:'paper_fold'},{at:.58,cue:'paper_fold'}],backdrop:{frames:[{offset:0,art:'act-frame-wrap'},{offset:.6,art:'act-frame-wrapped'},{offset:1,art:'act-frame-wrapped'}]}}});
patch(S,'c5_close',[1],{shot:null});
// The original item drop/receipt remains at c5_return[8–10]; the shot shows who holds it now.
patch(S,'c5_return',[1],{shot:'act-photo-return-offer',look:'p1-contact'});
patch(S,'c5_return',[3],{look:'p1-contact',motion:{id:'p1-c5-bell-receives-frame',ms:1800,backdrop:{frames:[{offset:0,art:'act-photo-return-offer'},{offset:.55,art:'act-photo-return-received'},{offset:1,art:'act-photo-return-received'}]}}});
patch(S,'c5_return',[4],{look:[34,20,27,16]});
patch(S,'c5_return',[11],{shot:null,valeStage:{hide:['bell']}});
patch(S,'c6_terms',[4],{bg:'parlour-terms',valePhysical:{photoSealed:false}});patch(S,'c6_terms',[16],{motion:{id:'p1-c6-departure',ms:1300,backdrop:{frames:[{offset:0,art:'parlour-terms'},{offset:.75,art:'c6_room'}]}}});patch(S,'c6_terms',[10],{shot:'act-celia-signs',look:'p1-contact',valePhysical:{photoSealed:true},valeStage:{},motion:{id:'p1-c6-signatures-seal-and-receipts',ms:10000,sounds:[{at:.03,cue:'pen_write'},{at:.23,cue:'pen_write'},{at:.41,cue:'paper_fold'},{at:.46,cue:'wax_press'},{at:.64,cue:'pen_write'},{at:.84,cue:'paper_slide'}],backdrop:{frames:[{offset:0,art:'act-celia-signs'},{offset:.2,art:'act-matthias-signs'},{offset:.4,art:'act-sealed-packet'},{offset:.62,art:'act-pike-receipts'},{offset:.82,art:'act-hart-copies'},{offset:1,art:'act-hart-copies'}]}}});
patch(S,'c6_visit',[10,'explore','spots',2,'then',1],{shot:'c6_room',look:[70,13,12,20],motion:{id:'p1-c6-empty-recess',ms:2300,backdrop:{frames:[{offset:0,art:'c6_room'},{offset:.22,art:'parlour-day-empty-panel'},{offset:.78,art:'c6_room'},{offset:1,art:'c6_room'}]}}});
patch(S,'c6_visit',[10,'explore','spots',2,'then',2],{shot:null});
patch(S,'c6_truth',[6],{look:'p1-final-portrait',motion:{id:'p1-c6-solo-portrait-kept',ms:1400,tracks:[{id:'p1-final-portrait',art:'evidence-portrait',at:[54,77],w:7,ar:1,z:2,frames:[{offset:0,at:[54,87],opacity:0,rotate:-6},{offset:.2,opacity:1},{offset:1,at:[54,77],rotate:0}]}]}});
// One frame changes custody and orientation; the client's departure leaves only its wrapping.
patch(S,'c6_delivery',[0],{shot:'act-client-photo-held',look:'p1-contact',motion:{id:'p1-c6-photo-face-down',ms:2400,backdrop:{frames:[{offset:0,art:'act-client-photo-held'},{offset:.56,art:'act-client-photo-down'},{offset:1,art:'act-client-photo-down'}]}}});
patch(S,'c6_delivery',[1],{look:[40,27,22,13]});
patch(S,'c6_delivery',[4],{shot:'act-client-photo-down',look:'p1-contact',motion:{id:'p1-c6-photo-into-case',ms:1650,backdrop:{frames:[{offset:0,art:'act-client-photo-down'},{offset:.55,art:'act-client-photo-packed'},{offset:1,art:'act-client-photo-packed'}]}}});
patch(S,'c6_delivery',[6],{shot:'act-client-photo-packed',look:'p1-contact',valeStage:{hide:['matthias']},motion:{id:'p1-c6-client-departed',ms:1400,backdrop:{frames:[{offset:0,art:'act-client-photo-packed'},{offset:.6,art:'act-client-empty-wrapping'},{offset:1,art:'act-client-empty-wrapping'}]}}});
patch(S,'c6_delivery',[9],{shot:null});
}
E.on('boot',()=>{if(!isP1())return;apply();letter();observer?.disconnect();observer=new MutationObserver(queue);observer.observe(q('.se'),{childList:true,subtree:true});queueMicrotask(apply);queue();});E.on('chapter',()=>{if(isP1()){apply();queueMicrotask(apply);}});E.on('step',(type,st)=>{if(!isP1())return;if(type==='explore'){if(st===E.S().nodes.c5_follow?.[2])st.explore.img=E.R().f.p1_cab_departed?'c5_corner_departed':'c5_corner';if(st===E.S().nodes.c6_terms?.[9]){st.explore.img='parlour-terms';const p=st.explore.spots.find(p=>p.id==='packet');if(p)Object.assign(p,{art:'celia-holding',artR:[18,28,39,39],r:[32,36,12,10],inspectR:[20,26,38,35],x:38,y:41});}}queue();});E.on('line',queue);
})();
