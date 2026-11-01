// Regression dữ liệu save. Node VM mô phỏng API công khai; không thay thế test UI.
// node plugins/bt-test-save-compat.cjs
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert');
const clone=x=>JSON.parse(JSON.stringify(x));
// Static checker facades do not execute runtime adapters. A real runtime with
// bad load order must still report missing dependencies, rather than skip.
for(const file of ['bt-cottage.js','bt-save-compat.js']) {
  const code=fs.readFileSync(path.join(__dirname,file),'utf8');
  assert.doesNotThrow(()=>vm.runInNewContext(code,{StoryEngine:{plugin(){}}}));
  assert.throws(()=>vm.runInNewContext(code,{StoryEngine:{plugin(){},S:()=>({id:'between-tides'})},document:{}}),file==='bt-cottage.js'?/requires native explore/:/save map missing/);
}
let R={stack:[],f:{},items:[],truths:{},log:[],used:{}},G={set:{},cps:{},chAt:{},truths:{T14:1}},writes=0;
const hooks={},E={plugins:{},S:()=>({id:'between-tides',flow:[]}),R:()=>R,G:()=>G,
  snapshot:()=>clone(R),save:()=>writes++,newRun(){R={stack:[{n:'c1_open',p:[],i:0}],f:{},items:[],truths:{},log:[],used:{}};E.save();E.play();},
  play(){},stop(){},resume:async()=>{},fromCp(){},playCh(){},loadUpTo:async()=>true,walk:()=>Array(10000),
  esc:x=>x,nat:x=>x.en,ui:{toast(){},title(){}},plugin(p){this.plugins[p.id]=p;for(const[k,f]of Object.entries(p.on||{}))(hooks[k]||=[]).push(f);},
};
const ctx=vm.createContext({StoryEngine:E,console,document:{querySelector:()=>null},URLSearchParams,location:{search:''}});
for(const file of ['bt-save-map.js','bt-save-compat.js'])vm.runInContext(fs.readFileSync(path.join(__dirname,file),'utf8'),ctx,{filename:file});
const M=E.btSaveMap,C=E.btSaveCompat,base=stack=>({stack,f:{leo:4,callum_threat:true},items:['note'],truths:{T1:1},log:[],used:{'o:stable':1},jot:[],ch:1,path:['c1_open'],passed:{c1_open:1}});
let count=0;
for(const[key,target]of Object.entries(M.frames)){
  const[n,p,i]=JSON.parse(key),original=base([{n,p,i}]),copy=clone(original),r=C.migrate(original);
  assert.deepStrictEqual(clone(r.stack),clone([{n:target[0],p:target[1],i:target[2]}]));
  assert.deepStrictEqual(original,copy);assert.deepStrictEqual(clone(r.items),original.items);assert.deepStrictEqual(clone(r.truths),original.truths);
  assert.deepStrictEqual(clone(C.migrate(r)),clone(r));count++;
}
const med=base([{n:'c5_reading',p:[],i:7},{n:'c5_reading',p:[6,'deduce','fail'],i:0}]);med.ch=5;
const reset=C.migrate(med);assert.deepStrictEqual(clone(reset.stack),[{n:'c5_reading',p:[],i:0}]);assert.strictEqual(reset.btRecovery.pending,true);assert.deepStrictEqual(clone(reset.truths),{T1:1});assert.strictEqual(reset.f.p_second_blow,undefined);
// The original "alone" branch became nested under a new "Leo stays" branch.
// Never map old then -> new then just because both arrays are named then.
for(const companion of ['alone','leo','helen','callum']){
  const dunes=base([{n:'c5_dunes',p:[],i:11},{n:'c5_dunes',p:[10,companion==='alone'?'then':'else'],i:0}]);
  dunes.f.dunes_with=companion;dunes.ch=5;
  const restored=C.migrate(dunes);
  assert.deepStrictEqual(clone(restored.stack),[{n:'c5_dunes',p:[],i:0}]);
  assert.strictEqual(restored.btRecovery.pending,true);assert.deepStrictEqual(clone(restored.f),dunes.f);
  assert.deepStrictEqual(clone(restored.items),dunes.items);assert.deepStrictEqual(clone(restored.truths),dunes.truths);
}
const invalid=base([{n:'c1_open',p:[],i:99999}]);assert.throws(()=>C.migrate(invalid),/original release/);
const unknown={...base([{n:'c1_open',p:[],i:0}]),btRevision:'future-not-supported'};assert.throws(()=>C.migrate(unknown),/different story revision/);
assert.strictEqual(unknown.btRevision,'future-not-supported');
const changed=Object.entries(M.prefixes).find(([a,b])=>a!==b);assert(changed);
const progress=base([{n:'c1_open',p:[],i:0}]);progress.used[changed[0]+'.v.spot']=1;progress.used[changed[0]+'.bd']={pos:{note:[10,20]},str:[],got:[0]};progress.f['board_'+changed[0]]=1;progress.pl={[changed[0]]:{v:'door'}};progress.vw={pid:changed[0],v:'door'};
const shifted=C.migrate(progress);assert.strictEqual(shifted.used[changed[1]+'.v.spot'],1);assert.strictEqual(shifted.used[changed[0]+'.v.spot'],undefined);assert.strictEqual(shifted.f['board_'+changed[1]],1);assert.strictEqual(shifted.vw.pid,changed[1]);assert.strictEqual(shifted.pl[changed[1]].v,'door');assert.strictEqual(shifted.used['o:stable'],1);
const proof=base([{n:'c1_open',p:[],i:0}]);proof.log=[{main:"I ran home. Went in the back. Didn't want the bar seeing my arm. Rooms were empty. November."},{main:'Ask my mother where I was that night. Go on.'}];proof.jot=[{ch:5,t:{en:"Callum, 2004: 'I told Mam… She put me to bed and said I'd dreamed it.'"}},{ch:3,t:{en:"Gideon's phone: Cllr R. Hale, incoming, 21:08, 7 min 12 s (to about 21:15)."}}];
const observed=C.migrate(proof);for(const k of ['c5_back_door','c5_mam_account','c5_referred_mam','c3_gideon_call_seen'])assert.strictEqual(observed.f[k],true);
assert.strictEqual(observed.f.c5_callum_missed,undefined);assert.deepStrictEqual(clone(observed.truths),proof.truths);assert.deepStrictEqual(clone(observed.items),proof.items);
const unproven=C.migrate(base([{n:'c1_open',p:[],i:0}]));assert.strictEqual(unproven.f.c5_back_door,undefined);assert.strictEqual(unproven.truths.T14,undefined);
G.cps.legacy=base([{n:'c1_open',p:[],i:0}]);G.cps.future=clone(unknown);G.chAt[5]=clone(med);const globalBefore=clone(G.truths);C.migrateGlobal(G);assert.strictEqual(G.cps.legacy.btRevision,M.revision);assert.strictEqual(G.cps.future.btRevision,'future-not-supported');assert.strictEqual(G.chAt[5].btRecovery.pending,true);assert.deepStrictEqual(G.truths,globalBefore);assert.strictEqual(writes,0);assert.throws(()=>C.migrateGlobal({cps:{bad:unknown}},true),/different story revision/);
R=unknown;assert.deepStrictEqual(clone(E.snapshot()),unknown);R=base([{n:'c1_open',p:[],i:0}]);const snap=E.snapshot();assert.strictEqual(snap.btRevision,M.revision);assert.strictEqual(R.btRevision,undefined);E.newRun();assert.strictEqual(R.btRevision,M.revision);
console.log(JSON.stringify({pass:true,revision:M.revision,mappedCursorsChecked:count,compilerGuardChecks:4,scenarios:['source immutability','idempotent revision','all mapped frames','changed T12 scene recovery','restructured companion branch recovery','invalid cursor refusal','unknown revision preserved','path-keyed exploration and board state','evidence-based flag recovery only','global checkpoints and chapter snapshots','snapshot safety','new-run marker']},null,2));
