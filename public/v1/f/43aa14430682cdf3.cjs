// Sinh bảng đường dẫn save từ đúng bản nguồn đính kèm sang bản truyện hiện tại.
// Chỉ chạy ở bước đóng gói; không nạp file .cjs này trong trình duyệt.
const fs = require('fs'), path = require('path'), vm = require('vm'), crypto = require('crypto');
const source = process.argv[2], target = process.argv[3];
if (!source || !target) throw Error('Usage: node bt-build-save-map.cjs OLD_GAME_DIR NEW_GAME_DIR');
const TYPES = new Set('bg show hide n think say set add item drop truth word go if cp wait fx title choice explore map interpret present listen quiz lock order type review end cg deduce meet mood cam pic sfx amb chat call meter board caseboard reconstruct compare sneak qte whom note gift topics date gallery check shop schedule gauge spin fill memory rewind clock look shot prop motion read place talk act beat reveal theory vibe serve pressure tail compose bargain cipher eavesdrop lineup heartbeat swipe cook budget sort route scramble match defuse tune event quote hud guess pack rhythm wear wardrobe wearLock'.split(' '));
const textKeys = new Set('en vi easy tone prompt hint missing label name title desc sum text t q goal done lockHint noUse'.split(' '));
const hash = x => crypto.createHash('sha256').update(x).digest('hex');
const serial = x => JSON.stringify(x, (k,v) => typeof v === 'function' ? String(v).replace(/\s+/g,'') : v);
const kind = x => x && typeof x === 'object' && !Array.isArray(x) ? Object.keys(x).find(k=>TYPES.has(k)) || '' : '';
const words = x => String(x||'').toLowerCase().replace(/\[\[|\]\]/g,'').replace(/[^a-z0-9]+/g,' ').trim();
const en = x => typeof x?.en==='string' ? x.en : ['n','think','note','title'].map(k=>x?.[k]?.en).find(Boolean)||x?.label?.en||'';
const stripped = x => {
  if (Array.isArray(x)) return x.map(stripped);
  if (!x || typeof x !== 'object') return typeof x === 'function' ? String(x).replace(/\s+/g,'') : x;
  return Object.fromEntries(Object.entries(x).filter(([k])=>!textKeys.has(k)).map(([k,v])=>[k,stripped(v)]));
};
function load(dir) {
  let base={}, parts=[];
  const ctx=vm.createContext({StoryEngine:{story:x=>base=x,chapter:x=>parts.push(x)}});
  for(const file of ['story.js',...Array.from({length:5},(_,i)=>`ch${i+1}.js`)]) vm.runInContext(fs.readFileSync(path.join(dir,'story',file),'utf8'),ctx,{filename:file});
  const story={nodes:{},places:{},talks:{},events:{},flow:[]};
  for(const item of [base,...parts]) for(const key of Object.keys(story)) {
    if(Array.isArray(story[key])) story[key].push(...item[key]||[]); else Object.assign(story[key],item[key]||{});
  }
  // Đúng phép chuẩn hóa duy nhất có tạo đường dẫn con trong place.js.
  const seen=new WeakSet();
  function norm(x){if(!x||typeof x!=='object'||seen.has(x))return;seen.add(x);if(x.views){for(const v of Object.values(x.views)){for(const p of v.people||[])p.go=[{talk:typeof p.talk==='string'?p.talk:{with:p.who,...p.talk}}];for(const z of v.zones||[])if(z.talk)z.go=[{talk:typeof z.talk==='string'?z.talk:{with:z.who,...z.talk}}];}}for(const v of Object.values(x))norm(v);}
  norm(story);return story;
}
const old=load(source), fresh=load(target);
function score(a,b) {
  if (serial(a)===serial(b)) return 160;
  if(a==null||b==null) return a===b?160:-Infinity;
  if(typeof a!=='object'||typeof b!=='object')return serial(a)===serial(b)?160:-Infinity;
  if(a.id||b.id) {if(a.id!==b.id)return-Infinity;return 130;}
  const ka=kind(a),kb=kind(b);
  if(a.n?.en==='You look down at your hand. One fingertip is still black.'&&kb==='if'&&b.then?.some(x=>x.n?.en===a.n.en))return 130;
  if(ka!==kb)return-Infinity;
  if(ka==='set'&&serial(a.set)==='{"p_others_cleared":true}'&&serial(b.set)==='{"c5_callum_missed":true}')return 100;
  if(ka==='if')return String(a.if).replace(/\s/g,'')===String(b.if).replace(/\s/g,'')?100:4;
  if(['go','cp','truth','item','drop','end','show','hide','bg','cg','clock','place'].includes(ka))return serial(a[ka])===serial(b[kb])?130:-Infinity;
  if(['set','add'].includes(ka)){
    const ak=Object.keys(a[ka]),bk=Object.keys(b[ka]);
    return (ak.length&&ak.every(k=>serial(a[ka][k])===serial(b[ka][k])))||(bk.length&&bk.every(k=>serial(a[ka][k])===serial(b[ka][k])))?100:-Infinity;
  }
  if(ka==='say'&&a.say!==b.say)return-Infinity;
  const ta=words(en(a)),tb=words(en(b));
  if(ta&&tb){
    if(ta===tb)return 145;
    if(ta.startsWith(tb))return 130;
    if(ta.includes(tb))return 95;
    const aa=new Set(ta.split(' ')),bb=new Set(tb.split(' '));
    const overlap=[...aa].filter(x=>bb.has(x)).length;
    return 12+60*overlap/Math.max(1,aa.size+bb.size-overlap);
  }
  if(serial(stripped(a))===serial(stripped(b)))return 95;
  if(ka)return 50;
  return Object.keys(a).join('|')===Object.keys(b).join('|')?40:10;
}
function align(a,b) {
  const dp=Array.from({length:a.length+1},()=>new Float64Array(b.length+1));
  const match=Array.from({length:a.length},()=>new Float64Array(b.length));
  for(let i=a.length-1;i>=0;i--)for(let j=b.length-1;j>=0;j--){match[i][j]=score(a[i],b[j]);dp[i][j]=Math.max(match[i][j]+dp[i+1][j+1],dp[i+1][j]-.1,dp[i][j+1]-.1);}
  const pairs=[];let i=0,j=0;
  while(i<a.length&&j<b.length){if(Math.abs(dp[i][j]-(match[i][j]+dp[i+1][j+1]))<.001){pairs.push([i,j]);i++;j++;}else if(dp[i+1][j]>=dp[i][j+1])i++;else j++;}
  return pairs;
}
const frames={}, prefixes={}, unsafe=[], review=[], stats={pairedArrays:0,persistentIndexContracts:0};
const sourceArrays={};
const refKey=(n,p,i)=>JSON.stringify([n,p,i]);
const ck=(n,p)=>[n,...p].join('.');
function catalog(x,n,p){
  if(Array.isArray(x))sourceArrays[JSON.stringify([n,p])]=x.length;
  if(x&&typeof x==='object')for(const[k,v]of Object.entries(x))if(v&&typeof v==='object')catalog(v,n,[...p,Array.isArray(x)?+k:k]);
}
for(const[n,a]of Object.entries(old.nodes))catalog(a,n,[]);
for(const key of ['places','talks','events'])catalog(old[key],'@'+key,[]);
function recordArray(a,b,an,ap,bn,bp,options={}){
  const pairs=options.pairs||align(a,b);stats.pairedArrays++;
  if(ap.at(-1)==='topics'&&a.some(x=>!x.id)){
    stats.persistentIndexContracts++;
    if(pairs.length<a.length||pairs.some(([i,j])=>!a[i].id&&i!==j))throw Error('Un-IDed talk topics changed order: '+ck(an,ap));
  }
  const matched=new Map(pairs);
  for(let i=0;i<=a.length;i++){
    const j=i===a.length?b.length:matched.get(i);
    if(j===undefined){unsafe.push({n:an,p:ap,i,kind:kind(a[i]),text:en(a[i]).slice(0,110)});continue;}
    frames[refKey(an,ap,i)]=[bn,bp,j];
  }
  for(const[i,j]of pairs){
    if(kind(a[i])&&score(a[i],b[j])<45)review.push({n:an,p:ap,i,to:[bn,bp,j],kind:kind(a[i]),score:+score(a[i],b[j]).toFixed(1),old:en(a[i]).slice(0,140),new:en(b[j]).slice(0,140)});
    if(kind(a[i])) prefixes[ck(an,[...ap,i])]=ck(bn,[...bp,j]);
    recordObject(a[i],b[j],an,[...ap,i],bn,[...bp,j]);
  }
}
function recordObject(a,b,an,ap,bn,bp){
  if(Array.isArray(a)&&Array.isArray(b))return recordArray(a,b,an,ap,bn,bp);
  if(!a||!b||typeof a!=='object'||typeof b!=='object')return;
  // A branch may have been wrapped/reordered while its surrounding scene survived.
  // Mapping the upcoming if step is safe: it will evaluate the new condition.
  // Mapping an already active then/else to the same spelling is not safe.
  // Preserve these source paths in the catalog but let their saved cursors recover
  // visibly at the node, rather than putting the player into another companion route.
  if(a.if&&b.if&&String(a.if).replace(/\s/g,'')!==String(b.if).replace(/\s/g,'')){
    unsafe.push({n:an,p:ap,kind:'if',reason:'Changed condition: active nested branch recovers at preserved node.'});
    return;
  }
  if(a.choice&&b.choice&&a.choice.some(o=>o.once&&!o.id)){
    stats.persistentIndexContracts++;
    const pairs=new Map(align(a.choice,b.choice));
    if(a.choice.some((o,i)=>o.once&&!o.id&&pairs.get(i)!==i))throw Error('Un-IDed once choice changed index: '+ck(an,ap));
  }
  if(a.board&&b.board){
    stats.persistentIndexContracts++;
    if(a.board.links.some((l,i)=>{const t=b.board.links?.[i];return !t||l.id!==t.id||serial((l.ids||[l.a,l.b]).slice().sort())!==serial((t.ids||[t.a,t.b]).slice().sort());}))throw Error('Saved board conclusion indexes need explicit migration: '+ck(an,ap));
  }
  for(const key of Object.keys(a))if(a[key]&&b[key]&&typeof a[key]==='object'&&typeof b[key]==='object')recordObject(a[key],b[key],an,[...ap,key],bn,[...bp,key]);
}
for(const[n,a]of Object.entries(old.nodes)){
  if(!fresh.nodes[n])continue;
  if(n==='c5_reading')continue;
  recordArray(a,fresh.nodes[n],n,[],n,[]);
}
for(const key of ['places','talks','events'])recordObject(old[key],fresh[key],'@'+key,[],'@'+key,[]);
// Câu đố T12 đổi căn cứ và tách node: tuyệt đối không map vào nhánh ok mới.
const a=old.nodes.c5_reading,b=fresh.nodes.c5_reading;
const d=a.findIndex(x=>x.deduce);
const tail=d+3;
recordArray(a.slice(0,d),b,'c5_reading',[],'c5_reading',[]);
delete frames[refKey('c5_reading',[],d)];
for(let i=d;i<tail;i++){
  delete frames[refKey('c5_reading',[],i)];
  unsafe.push({n:'c5_reading',p:[],i,kind:kind(a[i]),reason:'Revised evidence puzzle; restart its preserved scene.'});
}
const after=fresh.nodes.c5_reading_after;
const afterPairs=align(a.slice(tail),after);
// Ghi riêng đoạn hậu cảnh dưới tên node mới, nhưng giữ index nguồn đầy đủ.
for(const[local,j]of afterPairs){
  const i=tail+local;
  frames[refKey('c5_reading',[],i)]=['c5_reading_after',[],j];
  prefixes[ck('c5_reading',[i])]=ck('c5_reading_after',[j]);
  recordObject(a[i],after[j],'c5_reading',[i],'c5_reading_after',[j]);
}
frames[refKey('c5_reading',[],a.length)]=['c5_reading_after',[],after.length];
// Hai phản hồi dùng chung của place.js giống hệt trong engine nguồn và handoff.
for(const n of ['@__seen','@__take']){
  sourceArrays[JSON.stringify([n,[]])]=1;
  for(let i=0;i<=1;i++)frames[refKey(n,[],i)]=[n,[],i];
}
function walk(s,n,p){let x=n[0]==='@'?s[n.slice(1)]:s.nodes[n];for(const k of p)x=x?.[k];return x;}
for(const [key,[n,p,i]]of Object.entries(frames)){
  const [an,ap,ai]=JSON.parse(key),length=sourceArrays[JSON.stringify([an,ap])];
  if(!Number.isInteger(length)||ai<0||ai>length)throw Error('Invalid source cursor '+key);
  const arr=['@__seen','@__take'].includes(n)?[{}]:walk(fresh,n,p);
  if(!Array.isArray(arr)||!Number.isInteger(i)||i<0||i>arr.length)throw Error('Invalid target cursor '+JSON.stringify([n,p,i]));
}
const sourceDigest=hash(serial(old)),targetMappingDigest=hash(serial(fresh));
// Cursor alignment still concerns the original five chapters. The release
// lineage must also cover chapter six and non-frame source metadata: otherwise
// a changed ending condition or chapter catalog can retain an old revision.
const targetScriptHashes=Object.fromEntries(['story.js',...fs.readdirSync(path.join(target,'story')).filter(f=>/^ch\d+\.js$/.test(f)).sort((a,b)=>parseInt(a.slice(2))-parseInt(b.slice(2)))].map(f=>['story/'+f,hash(fs.readFileSync(path.join(target,'story',f)))]));
const targetDigest=hash(serial(targetScriptHashes));
const out={format:1,source:'between-tides-upload-ch1-5',sourceDigest,targetMappingDigest,targetScriptHashes,targetDigest,revision:'bt-complete-'+targetDigest.slice(0,16),sourceArrays,frames,prefixes,
  sourceNodes:Object.keys(old.nodes),targetNodes:Object.keys(fresh.nodes),
  changedPuzzle:{node:'c5_reading',from:d,to:tail},
};
const output=path.join(target,'plugins','bt-save-map.js');
fs.writeFileSync(output,'// Map từ chương 1–5 bản gốc; revision bao gồm story.js và mọi chương của bản phát hành. Không sửa tay.\nStoryEngine.btSaveMap = '+JSON.stringify(out)+';\n');
const audit={...stats,sourceArrayCount:Object.keys(sourceArrays).length,sourceCursorCount:Object.values(sourceArrays).reduce((sum,n)=>sum+n+1,0),mappedCursorCount:Object.keys(frames).length,sourceDigest,targetMappingDigest,targetScriptHashes,targetDigest,revision:out.revision,unsafe,review,outputBytes:fs.statSync(output).size};
fs.writeFileSync(path.join(target,'plugins','bt-save-map-audit.json'),JSON.stringify(audit,null,2)+'\n');
console.log(JSON.stringify(audit,null,2));
