/* Vale 0.8: opt-in UX on the original Enmi player. No story arrays or save IDs change.
 * Context is authored, not inferred from camera visibility. Route journal records
 * events from this run only. Existing saves get a labelled reconstructed prefix.
 */
(() => {
'use strict';
const E=StoryEngine,V=ValeDemo,C=ValeV8Config,q=s=>document.querySelector(s),esc=E.esc;
const nat=t=>E.nat(t), copy=t=>V.recordText?V.recordText(t):esc(nat(t));
const fid=x=>x.id||(x.kind==='opt'?x.key+':'+x.val:'');
const part=()=>V.caseMeta().part;
const currentFrame=()=>[...(E.R()?.stack||[])].reverse().find(f=>C.contexts[f.n]);
const motionOK=()=>!E.auto&&E.G().set.motion!=='reduced'&&(E.G().set.motion==='full'||!matchMedia('(prefers-reduced-motion: reduce)').matches);
const name=id=>id==='me'?'Adrian Vale':E.S().chars[id]?E.cname(E.S().chars[id],true):id;
let context=null,beat=null,lastSection='',lastRun=null,lastSpeaker='',lastBeat='',bar=null;
let nativeObjective=null,objectiveNotice=null,objectiveCurrent=null,objectiveTimer=null,objectiveQueue=null,objectiveEpoch=0;
const outcome=id=>{const a=C.endings[id];return a?{kind:a[0],label:a[1],vi:a[2],reason:{en:a[3],vi:a[4]}}:null;};
V.outcomeInfo=outcome;
function seedJournal(){
 const R=E.R(),S=E.S();if(R.v8route)return R.v8route;
 const prefix=(S.flow||[]).filter(x=>x.kind==='cp'?R.passed?.[x.id]:x.kind==='opt'?R.f[x.key]===x.val:R.chapterEnds?.[x.ch]===x.id||R.done===x.id);
 R.v8route=prefix.map(x=>({id:fid(x),ch:x.ch,scene:x.scene||R.scene,reconstructed:true}));return R.v8route;
}
function record(x){
 if(!x)return;const R=E.R(),a=seedJournal(),id=fid(x),previous=a.at(-1);
 if(previous?.id===id&&previous?.ch===x.ch)return;
 // First encounter after a legacy save may already be in its reconstructed prefix.
 if(a.some(z=>z.id===id&&z.reconstructed))return;
 a.push({id,ch:x.ch??R.ch,scene:x.scene||R.scene});
}
function sceneFor(S,x){
 if(x.scene&&S.scenes[x.scene])return x.scene;
 let found=null;
 for(const steps of Object.values(S.nodes||{})){
  let scene=null;
  for(const st of steps){if(st.bg)scene=st.bg;if(st.scene)scene=st.scene;if(x.id&&st.cp===x.id){found=scene;break;}}
  if(found)break;
 }
 const byPart=part()==='I'?['','study','c2_lane_day','c3_chapel','c4_study','c5_study','c6_study']:part()==='II'?['','study','p2_house','p2_study','p2_room','p2_house_evening','p2_house_dawn']:['','p3_yard','p3_moor','p3_office','p3_office','p3_dorn_yard'];
 return found||byPart[x.ch]||S.titleScene||Object.keys(S.scenes)[0];
}
function extraFlow(S){
 const add=(ch,row,key,vals)=>{for(const [val,en,vi]of vals){if(!S.flow.some(x=>x.kind==='opt'&&x.key===key&&x.val===val))S.flow.push({ch,row,kind:'opt',key,val,label:{en,vi}});}};
 if(part()==='II'){
  add(1,.5,'p2_approach',[['safety','Arrange safety first','Thu xếp an toàn trước'],['together','Visit together','Cùng đến thăm']]);
  add(2,.5,'p2_first_question',[['repairs','Ask about repairs','Hỏi về sửa chữa'],['papers','Read the papers first','Đọc giấy tờ trước']]);
  add(5,.5,'p2_plan_choice',[['watch','Watch with safeguards','Canh phòng có bảo vệ'],['withdraw','Leave safely','Rời đi an toàn'],['intervene','Intervene openly','Can thiệp công khai']]);
 }
 if(part()==='III'){
  add(1,.5,'p3_first',[['ground','Follow the ground','Đọc dấu vết trên đất'],['records','Preserve the records','Giữ hồ sơ trước']]);
  add(2,1.5,'p3_dorn_approach',[['quiet','Request cooperation','Đề nghị hợp tác'],['watched','Ask for a watch','Nhờ canh chừng']]);
  add(3,1.5,'p3_public_claim',[['limited','Keep the report limited','Giới hạn nội dung báo cáo'],['accuse','Make a public accusation','Công khai buộc tội']]);
  add(4,1.5,'p3_priority',[['both','Divide the work','Phân công hai việc'],['explanation','Verify in person first','Tự xác minh trước'],['recovery','Recover the horse first','Tìm ngựa trước']]);
 }
 // Only choices already loaded are visible in the source lazy-loading build.
 S.flow=S.flow.filter(x=>x.kind!=='opt'||S.chapters.some(c=>c.ch===x.ch)&&Object.values(S.nodes).some(a=>JSON.stringify(a).includes('"'+x.key+'"')));
 for(const x of S.flow){x.scene=sceneFor(S,x);if(x.id==='c6_start')x.to=['c6_house','c6_settlement','c6_client'];if(x.id==='c6_house')x.to=['c6_true','c6_unresolved'];}
}
function install(){
 const S=E.S();if(!S||!/^vale-dossiers/.test(S.id))return;
 S.playability={...(S.playability||{}),inlineEvidence:true};
 extraFlow(S);
 const p1=S.nodes.c5_desk?.find(s=>s.present)?.present;
 if(p1){p1.shortlist=['c5_greeting','c5_description','c5_follow','c3_cuff','c3_name_trace','c4_photo_seen'];p1.feedbackWho='reed';p1.hints=C.hints.c5_desk;}
 const p3=S.nodes.p3c3_open?.find(s=>s.present)?.present;
 if(p3){p3.shortlist=['p3_meal','p3_last_seen','p3_night_silence','p3_dog_baseline','p3_quill_account','p3_tracks'];p3.feedbackWho='reed';p3.hints=C.hints.p3c3_open;}
 for(const [n,i,who,from,to,at]of C.motions){const st=S.nodes[n]?.[i];if(!st||!st.n||st.motion)continue;
  if(to&&!E.hasArt('im-'+who+'-'+to))continue;
  // No show:true: a camera cut must not conjure an absent character.
  st.motion={id:'vale08-'+n+'-'+i,ms:1200,actors:[{id:who,at,frames:[{offset:0,face:from},{offset:.6,face:to},{offset:1,face:to}]}]};
 }
}
function activeTalk(){
 // Presence follows the actual named/inline conversation owner, never a
 // quoted name or a stale last-speaker label from the surrounding scene.
 const S=E.S(),resolve=spec=>typeof spec==='string'?S.talks?.[spec]:spec;
 for(const frame of [...(E.R()?.stack||[])].reverse()){
  if(frame.n==='@talks'){
   const talk=resolve(S.talks?.[frame.p?.[0]]);
   if(talk?.with&&S.chars[talk.with])return talk;
  }
  let value=frame.n[0]==='@'?S[frame.n.slice(1)]:S.nodes[frame.n];
  for(const key of frame.p||[]){
   value=value?.[key];
   if(key==='talk'){
    const talk=resolve(value);
    if(talk?.with&&S.chars[talk.with])return talk;
   }
  }
 }
 const a=V.active;
 if(a?.type==='talk'){
  const st=E.walk({n:a.n,p:JSON.parse(a.p)})?.[a.i],talk=resolve(st?.talk);
  if(talk?.with&&S.chars[talk.with])return talk;
 }
 return null;
}
function activeContext(){
 const f=currentFrame();if(!f)return null;
 const i=Number.isInteger(f.p?.[0])?f.p[0]:Math.max(0,f.i-1),entries=C.contexts[f.n],a=[...entries].reverse().find(x=>x.at<=i)||entries[0];
 const present=[...a.present];
 const backInside=f.n==='p2c3_open'&&i===25&&f.p?.[1]==='then'&&E.R().scene==='p2_study';
 if(backInside&&!present.includes('rusk'))present.push('rusk');
 if(f.n==='p3c5_recovery_route'&&i===6){const who=E.R().f.p3_on_time?'nora':'elin';if(!present.includes(who))present.push(who);}
 if(f.n==='p3c5_supported'&&E.R().f.p3_public_claim==='accuse'&&!present.includes('reed'))present.push('reed');
 const remote={...(C.remote?.[f.n+':'+i]||{})},talk=activeTalk();
 // The optional follow-up actually returns to the study. The other branch
 // stays in the corridor and keeps Rusk's doorway/offstage label.
 if(backInside)delete remote.rusk;
 if(f.n==='c5_open'&&i===13&&f.p?.[1]==='choice'&&f.p?.[2]===1){
  remote.c5_walker={en:'Passer-by — farther down the street',vi:'Người đi đường — từ phía cuối phố'};
 }
 if(talk&&!remote[talk.with]&&!present.includes(talk.with))present.push(talk.with);
 return{...a,...(backInside?{beat:{en:'Back inside the study for the agreed follow-up. Rusk is here with you, Reed and Lydia.',vi:'Trở vào phòng làm việc để hỏi thêm như đã thống nhất. Rusk ở đây cùng bạn, Reed và Lydia.'}}:{}),present,node:f.n,index:i,section:f.n+':'+a.at+(backInside?':study-return':''),remote,conversationWith:talk?.with||null};
}
const choiceIsOpen=()=>!!q('.se-ui > .se-panel.chs:not([hidden]) .se-ch-b:not(.picked):not(.off):not(:disabled)');
const talkTopicsOpen=()=>!!q('.se-ui > .se-panel.tk:not([hidden]) .tk-l [data-t]:not(:disabled)');
const controlPromptVisible=type=>type==='choice'?choiceIsOpen():type==='talk'?talkTopicsOpen():true;
// Entering a reply is not a new objective announcement. A nested @talks
// response no longer has type="talk", but the same picker rule still applies.
const pickerIsCommitted=()=>['choice','talk'].includes(V.active?.type)&&!controlPromptVisible(V.active.type)||!!activeTalk()&&!talkTopicsOpen();
const conversationGoal={en:'Follow the current conversation.',vi:'Theo dõi cuộc trò chuyện hiện tại.'};
const statedGoal=(spec,includePrompt=true)=>{
 if(!spec||typeof spec!=='object')return null;
 // Authored goals survive a child response. A question addressed to the
 // picker (e.g. "What will you ask Mrs Bell?") belongs only to its controls.
 for(const key of includePrompt?['goal','prompt','q']:['goal']){const value=spec[key];if(value&&typeof value!=='function')return value;}
 return null;
};
function mechanicGoal(st){
 for(const kind of ['place','explore','talk']){
  let spec=st?.[kind];
  if(typeof spec==='string')spec=E.S()[kind==='talk'?'talks':'places']?.[spec];
  const goal=statedGoal(spec,controlPromptVisible(kind));if(goal)return goal;
 }
 return null;
}
function inheritedObjective(){
 // A line inside an inspection or conversation keeps the current activity's
 // goal. Follow inline paths and shared @places/@talks without revealing a
 // later chapter summary while the player is still examining a detail.
 const S=E.S();
 for(const f of [...(E.R().stack||[])].reverse()){
  let value=f.n[0]==='@'?S[f.n.slice(1)]:S.nodes[f.n];const owners=[];
  for(const [i,key]of f.p.entries()){
   value=value?.[key];
   if(['place','explore','talk'].includes(key))owners.push({spec:value,kind:key});
   else if(i===0&&['@places','@talks'].includes(f.n))owners.push({spec:value,kind:f.n==='@talks'?'talk':'place'});
  }
  for(const owner of owners.reverse()){const goal=statedGoal(owner.spec,controlPromptVisible(owner.kind));if(goal)return goal;}
  const goal=mechanicGoal(E.walk(f)?.[Math.max(0,f.i-1)]);if(goal)return goal;
 }
 return null;
}
function objective(){
 const R=E.R(),a=V.active,type=a?.type,st=a?E.walk({n:a.n,p:JSON.parse(a.p)})?.[a.i]:null;
 const letterGoal=V.letterObjective?.();if(letterGoal)return letterGoal;
 const own=statedGoal(st?.[type],controlPromptVisible(type))||statedGoal(st,controlPromptVisible(type))||mechanicGoal(st);
 if(own)return own;
 const inherited=inheritedObjective();if(inherited)return inherited;
 const tasks={place:{en:'Explore the current room.',vi:'Tìm hiểu căn phòng hiện tại.'},explore:{en:'Examine the scene.',vi:'Quan sát hiện trường.'},present:{en:'Choose a statement, then present a contradicting record.',vi:'Chọn lời khai, rồi đưa hồ sơ mâu thuẫn.'},caseboard:{en:'Connect two records supporting one conclusion.',vi:'Nối hai hồ sơ cùng hỗ trợ một kết luận.'},board:{en:'Compare the records and connect supported findings.',vi:'Đối chiếu hồ sơ, nối các dữ kiện có căn cứ.'},reconstruct:{en:'Arrange the events using what you know.',vi:'Sắp xếp sự kiện theo những gì đã biết.'},deduce:{en:'Choose the records that support this conclusion.',vi:'Chọn hồ sơ có căn cứ cho kết luận này.'},choice:{en:'Choose your next question or action.',vi:'Chọn câu hỏi hoặc hành động tiếp theo.'}};
 // A chapter summary can reveal an event that has not happened yet. Ordinary
 // story beats use their current authored objective, or a neutral fallback.
 // A choice handler remains active while the selected line is spoken or the
 // host is listening. Its buttons, not the handler type, define choosing.
 const taskType=type==='choice'&&!choiceIsOpen()?null:type;
 return tasks[taskType]||activeContext()?.objective||conversationGoal;
}
function objectiveDescriptor(){
 const normalize=value=>String(value||'').replace(/\[\[|\]\]/g,'').replace(/\s+/g,' ').trim();
 const override=nativeObjective?.run===E.R()?nativeObjective:null,fallback=objective(),text=override?.text||fallback;
 const label=normalize(nat(text));
 // Native HUDs may pass an already-localized string. A child inspection uses
 // the authored bilingual goal again; both presentations must share one key.
 const canonical=typeof text==='string'&&label===normalize(nat(fallback))?fallback:text;
 const identity=normalize(typeof canonical==='string'?canonical:canonical?.en||label);
 // Neutral reading guidance is available on demand, including after reload;
 // it is not a new task to announce when a picker disappears.
 return {id:override?.id||activeContext()?.section||'story',text:label,key:(E.R().ch||1)+':'+E.hash(identity),run:E.R(),silent:!override&&fallback===conversationGoal};
}
function closeObjective(focus=false){
 clearTimeout(objectiveTimer);objectiveTimer=null;
 if(objectiveNotice){objectiveNotice.hidden=true;objectiveNotice.setAttribute('aria-hidden','true');}
 const toggle=bar?.querySelector('[data-context-toggle]');toggle?.setAttribute('aria-expanded','false');
 if(focus)toggle?.focus({preventScroll:true});
}
function cancelObjective(){
 ++objectiveEpoch;clearTimeout(objectiveQueue);objectiveQueue=null;closeObjective();
}
function objectiveBlocked(){
 return !bar||bar.hidden||q('.se')?.dataset.m==='ov'||!!E.R()?.done||!!q('.se-end,.se-card:not([hidden]):not(.out),.se-sheet:not([hidden]),.se-read:not(.out),.se-rev:not(.out),.se-iv:not(.out),.se-t.hint-notice:not(.out),.se-t.receipt:not(.out),[data-quick-menu]:not([hidden])');
}
function showObjective(manual=false){
 if(!objectiveCurrent?.text||objectiveCurrent.run!==E.R()||objectiveBlocked()||!objectiveNotice)return;
 if(!manual&&(objectiveCurrent.silent||pickerIsCommitted()))return;
 clearTimeout(objectiveQueue);objectiveQueue=null;clearTimeout(objectiveTimer);
 objectiveNotice.querySelector('[data-objective-text]').textContent=objectiveCurrent.text;
 objectiveNotice.hidden=false;objectiveNotice.setAttribute('aria-hidden','false');
 objectiveNotice.dataset.objectiveId=objectiveCurrent.id;objectiveNotice.dataset.objectiveKey=objectiveCurrent.key;
 bar.querySelector('[data-context-toggle]').setAttribute('aria-expanded','true');
 // This is run-local acknowledgement, not a new branch or clue. Saving it
 // prevents the same goal announcement from replaying after Continue.
 const seen=(E.R().v94ObjectivesSeen||={});seen[objectiveCurrent.key]=true;E.save();
 const epoch=objectiveEpoch,run=E.R();objectiveTimer=setTimeout(()=>{if(epoch===objectiveEpoch&&run===E.R())closeObjective();},manual?7000:4200);
 E.emit('objective-notice',{id:objectiveCurrent.id,key:objectiveCurrent.key,text:objectiveCurrent.text,manual});
}
function scheduleObjective(){
 if(!objectiveCurrent||objectiveCurrent.run!==E.R()||objectiveCurrent.silent||pickerIsCommitted()||E.auto||E.G().set.v8Guide===false||E.R().v94ObjectivesSeen?.[objectiveCurrent.key])return;
 clearTimeout(objectiveQueue);const epoch=objectiveEpoch,run=E.R(),key=objectiveCurrent.key;
 const attempt=()=>{objectiveQueue=null;if(epoch!==objectiveEpoch||run!==E.R()||objectiveCurrent?.key!==key)return;if(objectiveBlocked()||E.ui.actionPeekState?.()){objectiveQueue=setTimeout(attempt,250);return;}showObjective();};
 objectiveQueue=setTimeout(attempt,650);
}
// Optional engine hook: place/explore keep their own authored goal and handlers.
// The top icon presents it; no native HUD element needs to be moved or cloned.
E.ui.setObjective=value=>{nativeObjective=value?.text?{id:value.id||'activity',text:value.text,run:E.R()}:null;syncContext();};
V.currentObjective=()=>objectiveCurrent?{id:objectiveCurrent.id,key:objectiveCurrent.key,text:objectiveCurrent.text}:null;
V.dismissObjective=()=>cancelObjective();
// An interaction response or record receipt has priority over a goal notice.
// Preserve all native arguments, return values and dismissal callbacks.
for(const name of ['hintToast','itemNotice']){
 const notice=E.ui[name];if(typeof notice!=='function')continue;
 E.ui[name]=(...args)=>{cancelObjective();const result=notice.apply(E.ui,args);scheduleObjective();return result;};
}
function syncContext(){
 if(!bar)return;const R=E.R(),active=activeContext(),mode=q('.se')?.dataset.m;
 bar.hidden=(!active&&!nativeObjective)||mode==='ov'||!!q('.se-end')||!!R.done;
 if(bar.hidden){cancelObjective();return;}
 const next=objectiveDescriptor(),changed=objectiveCurrent?.key!==next.key||objectiveCurrent?.run!==R;
 // A committed picker updates the icon quietly. Keep that decision for the
 // same goal after its handler yields to the reply, including accepted speech.
 next.silent=next.silent||pickerIsCommitted()||!changed&&!!objectiveCurrent?.silent;
 if(changed){cancelObjective();objectiveCurrent=next;}
 else objectiveCurrent=next;
 const goalToggle=bar.querySelector('[data-context-toggle]');goalToggle.setAttribute('aria-label',nat({en:'Objective: ',vi:'Mục tiêu: '})+next.text);goalToggle.title=nat({en:'View objective',vi:'Xem mục tiêu'});
 if(!objectiveNotice?.hidden)objectiveNotice.querySelector('[data-objective-text]').textContent=next.text;
 if(changed||!objectiveQueue&&objectiveNotice?.hidden)scheduleObjective();
 if(!active)return;context=active;
 const ids=[...new Set(['me',...active.present,...(lastSpeaker&&lastSpeaker!=='me'&&E.S().chars[lastSpeaker]?[lastSpeaker]:[])])];
 // Speaker is labelled separately if not in the authored on-location group.
 const present=['me',...active.present].map(name).join(' · '),speaking=lastSpeaker&&lastSpeaker!=='me'&&!active.present.includes(lastSpeaker)?name(lastSpeaker):'';
 bar.querySelector('.v8-presence').textContent=nat({en:'With you: ',vi:'Có mặt: '})+present+(speaking?' · '+(active.remote?.[lastSpeaker]?nat(active.remote[lastSpeaker]):nat({en:'Speaking: ',vi:'Đang nói: '})+speaking):'');
 if(bar.querySelector('.v8-mission').textContent!==next.text)bar.querySelector('.v8-mission').textContent=next.text;
 if(active.section!==lastSection){lastSection=active.section;beat=active.beat||null;lastBeat=active.section;}
 const custom=C.beats[active.node];if(custom&&active.index===custom[0]){beat={en:custom[1],vi:custom[2]};lastBeat=active.node+':custom';}
 bar.dataset.mode=V.active?.type||'read';
 const location=E.S().scenes[R.scene]||{};bar.title=[nat(location.name),nat(location.time),present].filter(Boolean).join(' · ');
 const cue=bar.querySelector('.v8-cue');cue.textContent=beat?nat(beat):'';cue.hidden=!beat;

}
V.sceneBrief=()=>{
 cancelObjective();
 const S=E.S(),R=E.R(),a=activeContext(),sc=S.scenes[R.scene]||{},present=['me',...(a?.present||[])];
 const sh=E.ui.sheet(nat({en:'Scene & objective',vi:'Bối cảnh & mục tiêu'}),`<div class="v8-brief"><small>${esc(nat(sc.time)||'')}</small><h3>${esc(nat(sc.name)||nat({en:'Current scene',vi:'Cảnh hiện tại'}))}</h3><p class="v8-context-note">${copy(beat||{en:'Continue from the current conversation. This panel does not move the story forward.',vi:'Tiếp tục từ cuộc trò chuyện hiện tại. Mở bảng này không làm truyện chuyển bước.'})}</p><h4>${esc(nat({en:'Present in this scene',vi:'Những người có mặt'}))}</h4><div class="v8-cast-list">${present.map(id=>`<span>${esc(name(id))}</span>`).join('')}</div><h4>${esc(nat({en:'What to do next',vi:'Việc cần làm'}))}</h4><p>${copy(objective())}</p><button class="se-btn pri wide" data-v8-resume>${esc(nat({en:'Return to the same moment',vi:'Trở lại đúng đoạn đang chơi'}))}</button></div>`,'tall');
 sh.querySelector('[data-v8-resume]').onclick=()=>E.ui.closeSheet();
};
function routeSheet(ch){
 if(q('.se')?.dataset.m==='ov')Object.assign(E.R(),V.clone(V.snapshot()));
 const R=E.R(),S=E.S(),chapters=S.chapters,cur=ch||R.ch||1,journal=seedJournal(),done=R.chapterEnds?.[cur]||((S.endings[R.done]?.ch===cur)?R.done:null);
 const trace=journal.filter(x=>x.ch===cur).map(x=>({...x,def:S.flow.find(f=>fid(f)===x.id&&f.ch===cur)})).filter(x=>x.def);
 const count=S.flow.filter(x=>x.ch===cur).length;
 const sh=E.ui.sheet(nat({en:'Your route',vi:'Tuyến đã chơi'}),`<div class="v8-route-tabs" role="group" aria-label="Chapters">${chapters.map(c=>`<button class="se-btn sm${cur===c.ch?' on':''}" data-v8-ch="${c.ch}" aria-pressed="${cur===c.ch}">${c.ch}</button>`).join('')}</div><p class="v8-route-status">${done?esc(nat({en:'CHAPTER COMPLETE — this route is finished.',vi:'ĐÃ XONG CHƯƠNG — tuyến này đã hoàn tất.'})):esc(nat({en:'Current journey — only events from this run.',vi:'Hành trình hiện tại — chỉ các sự kiện của lượt này.'}))}</p><p class="se-mute">${esc(nat({en:'Other branches are alternatives, not missing tasks. Discovery percentage is not story completion.',vi:'Nhánh khác là lựa chọn thay thế, không phải nhiệm vụ còn thiếu. Tỉ lệ khám phá không phải tiến độ hoàn thành truyện.'}))}</p><div class="v8-journey">${trace.map((x,i)=>{const f=x.def,label=f.kind==='end'?S.endings[f.id]?.title:f.label;return`<article class="v8-route-card" data-route-id="${esc(x.id)}"><span class="v8-route-number">${i+1}</span><span class="v8-route-art" aria-hidden="true"><i class="im-${esc(x.scene||f.scene)}"></i></span><div><small>${esc(nat(f.kind==='end'?{en:'Outcome',vi:'Kết quả'}:f.kind==='opt'?{en:'Your choice',vi:'Lựa chọn của bạn'}:{en:'Checkpoint',vi:'Mốc đã đến'}))}</small><b>${copy(label)}</b>${x.reconstructed?`<em>${esc(nat({en:'Recovered from previous save',vi:'Khôi phục từ bản lưu cũ'}))}</em>`:''}${f.kind==='cp'?`<button class="se-btn sm" data-v8-replay="${esc(f.id)}">${esc(nat({en:'Replay this checkpoint',vi:'Chơi lại mốc này'}))}</button>`:''}</div></article>`;}).join('')||`<p>${esc(nat({en:'No events recorded in this chapter yet.',vi:'Chưa ghi nhận sự kiện ở chương này.'}))}</p>`}</div><button class="se-btn wide" data-v8-all>${esc(nat({en:'View all branches (unvisited details stay hidden)',vi:'Xem mọi nhánh (ẩn nội dung chưa khám phá)'}))}</button>`,'tall v8-routes');
 sh.onclick=e=>{if(e.target.closest('[data-x]')){E.ui.closeSheet();return;}const c=e.target.closest('[data-v8-ch]');if(c)return routeSheet(+c.dataset.v8Ch);if(e.target.closest('[data-v8-all]')){V.nativeFlow(cur);const body=q('.se-sheet .fx-body');body?.insertAdjacentHTML('afterbegin',`<p class="v8-map-note">${esc(nat({en:'Dim nodes are alternative routes. A direct line may bypass an optional scene.',vi:'Nút mờ là tuyến thay thế. Đường nối thẳng có thể bỏ qua một cảnh không bắt buộc.'}))}</p>`);return;}
 const b=e.target.closest('[data-v8-replay]');if(b){V.nativeFlow(cur);const el=[...document.querySelectorAll('.fx-body .fx-n')].find(el=>{const idx=q('.fx-body')._idx;return idx?.[+el.dataset.n]?.id===b.dataset.v8Replay;});el?.click();}
 };
 return sh;
}
function decorateEnding(id){
 const el=q('.se-end'),end=E.S().endings[id];if(!el||!end||el.querySelector('.v8-ending-badge'))return;
 const info=outcome(id),badge=document.createElement('div');badge.className='v8-ending-badge '+(info?.kind||'chapter');badge.setAttribute('role','status');badge.innerHTML=`<b>${esc(info?.label||'CHAPTER COMPLETE')}</b><span>${esc(info?.vi||'Hoàn thành chương — chưa phải kết toàn vụ')}</span>`;
 const heading=el.querySelector('h2');(heading||el.firstElementChild)?.before(badge);
 const why=document.createElement('section');why.className='v8-ending-why';why.innerHTML=`<h3>${esc(nat({en:'Why this outcome?',vi:'Vì sao đạt kết quả này?'}))}</h3><p>${copy(info?.reason||end.sum||end.chapterClose)}</p><button class="se-btn wide" data-v8-end-route>${esc(nat({en:'Review the route you actually took',vi:'Xem lại đúng tuyến vừa đi'}))}</button>${info&&info.kind!=='true'?`<small>${esc(nat({en:'This is a valid ending, not a broken path. Replay an unlocked checkpoint to explore another outcome.',vi:'Đây là một kết thúc hợp lệ, không phải đường đi bị lỗi. Chơi lại mốc đã mở để khám phá kết khác.'}))}</small>`:''}`;
 el.querySelector('.se-col')?.before(why);why.querySelector('[data-v8-end-route]').onclick=()=>routeSheet(end.ch);
}
E.on('boot',()=>{
 install();queueMicrotask(install);
 const root=q('.se');root.classList.add('v8','v94-hud');V.routebook=routeSheet;
 bar=document.createElement('div');bar.className='v8-contextbar';bar.dataset.stageObstruction='top';bar.hidden=true;
 const goalIcon='<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/><path d="M12 2v3M22 12h-3M12 22v-3M2 12h3"/></svg>';
 const infoIcon='<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7v1"/></svg>';
 bar.innerHTML='<button type="button" class="v93-context-toggle" data-context-toggle aria-controls="vale-objective-notice" aria-expanded="false">'+goalIcon+'</button><button type="button" class="v8-context-more" data-context-info aria-label="'+esc(nat({en:'Scene details',vi:'Chi tiết bối cảnh'}))+'" title="'+esc(nat({en:'Scene details',vi:'Chi tiết bối cảnh'}))+'">'+infoIcon+'</button><span class="v8-context-copy" aria-hidden="true"><span class="v8-presence"></span><span class="v8-mission"></span><span class="v8-cue" hidden></span></span>';
 q('.se-top').prepend(bar);
 objectiveNotice=document.createElement('aside');objectiveNotice.className='v94-objective-notice';objectiveNotice.id='vale-objective-notice';objectiveNotice.hidden=true;objectiveNotice.setAttribute('aria-hidden','true');
 objectiveNotice.innerHTML='<div role="status" aria-live="polite" aria-atomic="true"><small>'+esc(nat({en:'Objective',vi:'Mục tiêu'}))+'</small><p data-objective-text></p></div><button type="button" data-objective-dismiss aria-label="'+esc(nat({en:'Dismiss objective',vi:'Đóng mục tiêu'}))+'">'+E.ICON.x+'</button>';
 root.append(objectiveNotice);
 objectiveNotice.onclick=e=>{e.stopPropagation();if(e.target.closest('[data-objective-dismiss]'))closeObjective(e.detail===0);};
 bar.onclick=e=>{e.stopPropagation();if(e.target.closest('[data-context-info]'))return V.sceneBrief();if(e.target.closest('[data-context-toggle]')){if(objectiveNotice.hidden)showObjective(true);else closeObjective();}};
 root.addEventListener('keydown',e=>{if(e.key==='Escape'&&!objectiveNotice.hidden){e.preventDefault();e.stopPropagation();closeObjective(true);}});
 // The existing HUD observer keeps --vale-toolbar-height and --vale-hud-height accurate.
 const uiHost=q('.se-ui');
 const mo=new MutationObserver(records=>{
  // Watch a choice becoming picked/off as well as the panel being replaced.
  // Ignore unrelated subtree styling (e.g. moving a board pin).
  if(!records.some(r=>r.target===root||r.target===uiHost||r.target.closest?.('.se-panel.chs')))return;
  if(root.dataset.m==='ov'||q('.se-end')){bar.hidden=true;cancelObjective();}else queueMicrotask(syncContext);
 });mo.observe(uiHost,{childList:true,subtree:true,attributes:true,attributeFilter:['class','disabled','hidden']});mo.observe(root,{attributes:true,attributeFilter:['data-m']});
 E.on('quick-menu',open=>{if(open)cancelObjective();else scheduleObjective();});
 const stop=E.stop;E.stop=(...args)=>{cancelObjective();nativeObjective=null;objectiveCurrent=null;return stop(...args);};
 const reset=E.ui.reset;E.ui.reset=(...args)=>{cancelObjective();nativeObjective=null;objectiveCurrent=null;return reset(...args);};
 // Keep the concise guide in vale-book.js; the scene strip opens details.
 // Toggle in place so an option near the bottom does not reset scroll.
 const settings=V.settings;V.settings=()=>{
  settings();const body=q('.se-sheet .se-shb');if(!body)return;
  const target=body.querySelector('[data-v92-comfort]')||body;
  target.insertAdjacentHTML('beforeend',`<button class="se-btn wide" data-v8-brief>${esc(nat({en:'Current scene and objective',vi:'Bối cảnh và mục tiêu hiện tại'}))}</button><button class="se-ovo" role="switch" data-v8-guide-toggle><span><b>${esc(nat({en:'Objective notices',vi:'Thông báo mục tiêu'}))}</b><small>${esc(nat({en:'Briefly announce a new objective. The objective icon remains available.',vi:'Hiện ngắn gọn khi mục tiêu đổi. Luôn có thể bấm biểu tượng mục tiêu để xem lại.'}))}</small></span><i class="se-sw"></i></button>`);
  const toggle=target.querySelector('[data-v8-guide-toggle]'),paint=()=>{const on=E.G().set.v8Guide!==false;root.classList.toggle('v8-guide-off',!on);toggle.setAttribute('aria-checked',String(on));toggle.querySelector('.se-sw').classList.toggle('on',on);};
  target.querySelector('[data-v8-brief]').onclick=()=>V.sceneBrief();
  toggle.onclick=()=>{E.G().set.v8Guide=E.G().set.v8Guide===false;paint();if(E.G().set.v8Guide===false)cancelObjective();else scheduleObjective();E.save();};paint();
 };
 root.classList.toggle('v8-guide-off',E.G().set.v8Guide===false);
});
E.on('chapter',()=>{install();queueMicrotask(install);});
E.on('step',(type,st)=>{
 nativeObjective=null;
 const R=E.R();if(lastRun!==R){lastRun=R;context=null;beat=null;lastSection='';lastSpeaker='';lastBeat='';}
 lastSpeaker='';
 if(type==='cp')record(E.S().flow.find(x=>x.kind==='cp'&&x.id===st.cp));
 queueMicrotask(syncContext);
});
E.on('branch',(k,v)=>record(E.S().flow.find(x=>x.kind==='opt'&&x.key===k&&x.val===v)));
E.on('line',line=>{lastSpeaker=line.who||'';queueMicrotask(()=>{
 syncContext();if(!motionOK())return;
 const el=lastSpeaker&&q('.se-ch[data-id="'+lastSpeaker+'"] .se-tagn');
 if(el)el.animate([{opacity:.55},{opacity:1}],{duration:320,easing:'ease-out'});
});});
E.on('end',id=>{cancelObjective();record(E.S().flow.find(x=>x.kind==='end'&&x.id===id));E.save();if(!E.auto)queueMicrotask(()=>decorateEnding(id));});
V.v8Debug=()=>({context:activeContext(),beat,route:E.R().v8route||[],outcome:outcome(E.R().done)});
})();
