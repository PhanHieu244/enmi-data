/* Save compatibility: 0.2 -> 0.3 -> 0.4. Story IDs deliberately stay stable. */
(() => {
 const E=StoryEngine,V=ValeDemo,REV=4;
 const INSERTS={"c1_observe":[17],"c1_neighbourhood":[24],"c1_direct":[24],"c2_call":[23],"c3_board":[6],"c4_exit":[8],"c5_close":[3],"c6_truth":[10],"c6_open_file":[8],"c6_terms":[21],"c6_delivery":[9]};
 const topIndex=(node,i)=>i+(INSERTS[node]||[]).filter(before=>i>=before).length;
 const key04=key=>String(key).replace(/^([^.|]+)\.(\d+)(?=\.|\||$)/,(m,n,i)=>n+'.'+topIndex(n,+i)).replace(/^c3_board\.1\.board(?=\.|\||$)/,'c3_board.1.caseboard');
 const upgrade02=r=>{
  const inspecting=[];
  for(const f of r.stack||[]){
   if(f.n==='c1_departure'){if(!f.p.length&&f.i>=9)f.i++;else if(f.p[0]>=9)f.p[0]++;}
   if(f.n==='c1_review')f.p=f.p.map(k=>k==='deduce'?'caseboard':k);
   if(f.n==='c1_open'&&f.p[0]===15&&f.p[1]==='explore'&&f.p[2]==='spots'){
    const zone=f.p[3],tail=f.p.slice(4);inspecting.push(zone);f.p=[15,'place','views','desk','zones',zone,...tail];if(zone===1&&tail[0]==='then')f.i++;
   }
  }
  if(inspecting.length||(r.items||[]).some(id=>['sealed_note','watermark','press_cutting'].includes(id))){
   const pl=((r.pl||={}).c1_desk||={v:'desk',seen:{},took:{},vis:{},hint:0,solved:{},n:{}});
   for(const [i,[item,zone]]of [['sealed_note','note_text'],['watermark','note_paper'],['press_cutting','evening_news']].entries())if((r.items||[]).includes(item)||inspecting.includes(i))pl.seen['desk/'+zone]=1;
  }
  if(r.done)(r.chapterEnds||={})[r.ch||1]=r.done;
  r.vdSaveRevision=3;
 };
 const c3Links=[
  {sources:['c3_register','c3_hart_account'],flag:'c3_marriage_link',label:{en:'Hart says he knew about the earlier relationship when he married Celia.',vi:'Hart nói lúc cưới Celia, anh đã biết về mối quan hệ trước đó.'}},
  {sources:['c3_celia_warning','press_cutting'],flag:'c3_warning_link',label:{en:'The threatened disclosure is conditional; the royal deadline makes it urgent.',vi:'Lời dọa tiết lộ có điều kiện; hạn công bố hôn ước khiến chuyện trở nên cấp bách.'}}
 ];
 V.upgradeRun=(input,legacy=false)=>{
  const r=V.clone(input);if(!r||typeof r!=='object'||r.vdSaveRevision>=REV)return r;
  if(legacy&&(+r.vdSaveRevision||2)<3)upgrade02(r);
  for(const f of r.stack||[]){
   if(!Array.isArray(f.p))continue;
   // Persisted snapshots are next-instruction cursors; active reading / puzzles
   // were already rewound by E.snapshot. Map that authored instruction directly.
   if(f.p.length&&Number.isInteger(f.p[0]))f.p[0]=topIndex(f.n,f.p[0]);
   else if(!f.p.length&&Number.isInteger(f.i))f.i=topIndex(f.n,f.i);
   if(f.n==='c3_board'&&f.p[0]===1&&f.p[1]==='board')f.p[1]='caseboard';
  }
  r.used=Object.fromEntries(Object.entries(r.used||{}).map(([k,v])=>[key04(k),v]));
  if(r.caseConclusions)r.caseConclusions=Object.fromEntries(Object.entries(r.caseConclusions).map(([k,v])=>[key04(k),v]));
  r.f||={};for(const key of Object.keys(r.f))if(key.startsWith('board_')){const mapped='board_'+key04(key.slice(6));if(mapped!==key){r.f[mapped]=r.f[key];delete r.f[key];}}
  const old=r.used['c3_board.1.bd'],legacyGot=r.used['c3_board.1.got'];
  const fromFlags=c3Links.flatMap((l,i)=>r.f[l.flag]?[i]:[]);
  if(old||legacyGot!=null||fromFlags.length){
   const key='c3_board.1.caseboard',st=r.used[key]||={};
   const got=[...new Set([...(Array.isArray(st.got)?st.got:[]),...(Array.isArray(old?.got)?old.got:[]),...String(legacyGot??'').split(',').filter(Boolean).map(Number),...fromFlags])].filter(i=>Number.isInteger(i)&&c3Links[i]);
   const validEdge=k=>typeof k==='string'&&k.split('|').length===2&&c3Links.some(l=>k.split('|').every(id=>l.sources.includes(id)))&&k.split('|').every(id=>(r.items||[]).includes(id));
   st.edges=[...new Set([...(st.edges||[]),...(old?.str||[])].filter(validEdge).map(k=>k.split('|').sort().join('|')))];st.got=got;
   st.pos||={};for(const [id,xy]of Object.entries(old?.pos||{}))if(!st.pos[id]&&Array.isArray(xy)&&xy.length===2&&xy.every(Number.isFinite))st.pos[id]={x:xy[0],y:xy[1]};
   if(old?.pos)st.pinned=[...new Set([...(Array.isArray(st.pinned)?st.pinned:[]),...Object.keys(old.pos)])].filter(id=>(r.items||[]).includes(id));
   st.mistakes=Number(st.mistakes??old?.miss)||0;st.selected=[];st.version=4;
   r.caseConclusions||={};for(const i of got){const l=c3Links[i];r.f[l.flag]=true;r.caseConclusions[key+'|L'+i]||={label:l.label,sources:l.sources,chapter:3,boardTitle:{en:'The chapel evidence',vi:'Chứng cứ ở nhà thờ'}};}
  }
  r.vdSaveRevision=REV;return r;
 };
 const upgradeGlobal=(g,legacy)=>{
  for(const group of ['cps','chAt'])for(const id in g[group]||{})g[group][id]=V.upgradeRun(g[group][id],legacy);
  (g.set||={}).vdSaveRevision=REV;
 };
 V.prepareSave=async d=>{
  const legacy=!!d.global.set.vdInitialized&&!d.global.set.vdNativeControls;
  d.run=V.upgradeRun(d.run,legacy);upgradeGlobal(d.global,legacy);
  const chapter=Math.max(1,d.run.ch||1,E.chapterOf(d.run.stack?.[0]?.n)||1);
  if(chapter>Math.max(...E.S().chapters.map(c=>c.ch)))throw Error('This build does not include that chapter · Bản này chưa có chương đó');
  if(!(await E.loadUpTo(chapter)))throw Error('Could not load the saved chapter · Chưa nạp được chương đã lưu');
 };
 E.on('boot',()=>{
  const G=E.G(),legacy=V.wasLegacy;
  try{
   const key=V.key(),raw=localStorage.getItem(key+'.r'),graw=localStorage.getItem(key+'.g');
   if(raw){const r=JSON.parse(raw);if(Array.isArray(r?.stack)&&(+r.vdSaveRevision||0)<REV){
    if(!localStorage.getItem(key+'.pre04'))localStorage.setItem(key+'.pre04',JSON.stringify({run:r,global:JSON.parse(graw||'{}')}));
    if(legacy&&!localStorage.getItem(key+'.pre03'))localStorage.setItem(key+'.pre03',JSON.stringify({run:r,global:JSON.parse(graw||'{}')}));
    localStorage.setItem(key+'.r',JSON.stringify(V.upgradeRun(r,legacy)));
   }}
  }catch{V.storage=false;}
  upgradeGlobal(G,legacy);try{localStorage.setItem(V.key()+'.g',JSON.stringify(G));}catch{V.storage=false;}
  const resume=E.resume;E.resume=async()=>{const r=E.R();if((+r.vdSaveRevision||0)<REV)Object.assign(r,V.upgradeRun(r,legacy));return resume();};
 });
 E.on('step',()=>{E.R().vdSaveRevision=REV;});
})();
