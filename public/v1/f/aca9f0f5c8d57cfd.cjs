// Native Chromium regression with actual Enmi engine; SDK transport is stubbed.
// npm install playwright; BT_BROWSER_PATH=/path/to/chromium node bt-test-native.cjs
// BT_QA_DIR chooses the screenshot directory. No external network is used.
const fs=require('fs'),path=require('path'),http=require('http'),assert=require('assert');
const {chromium}=require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES ? path.join(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES,'playwright') : 'playwright');
const dir=path.resolve(__dirname,'..'),engine=fs.existsSync(path.join(dir,'lib/story/core.js'))?path.join(dir,'lib/story'):path.resolve(dir,'../_lib/story');
const qaDir=process.env.BT_QA_DIR||path.resolve(process.cwd(),'bt-plugin-qa');
const scripts=['bt00-line-order.js','bt00-mobile-compat.js','mobile-base.js','mobile-menu.js','mobile-experience.js','mobile-learning.js','mobile-records.js','mobile-title.js','bt-save-map.js','bt-save-compat.js','bt-save-transfer.js','bt-integrity.js','bt-mobile.js','bt-navigation.js','bt-audio-mix.js'];
let html=fs.readFileSync(path.join(dir,'index.html'),'utf8').replace(/<script src="plugins\/[^\"]+"><\/script>\n?/g,'');
html=html.replace('<script src="art.js">',scripts.map(s=>'<script src="plugins/'+s+'"></script>').join('\n')+'\n<script src="art.js">');
if(!html.includes('plugins/bt-navigation.css'))html=html.replace('</head>','<link rel="stylesheet" href="plugins/bt-navigation.css"></head>');
const memory=new Map();
function capture(d,prefix=''){for(const f of fs.readdirSync(d,{withFileTypes:true})){if(f.isDirectory()){if(['story','plugins','theme'].includes(f.name))capture(path.join(d,f.name),prefix+f.name+'/');}else if(/\.(js|css)$/.test(f.name))memory.set('/'+prefix+f.name,fs.readFileSync(path.join(d,f.name)));}}
capture(dir);for(const f of fs.readdirSync(engine))if(/\.(js|css)$/.test(f))memory.set('/lib/story/'+f,fs.readFileSync(path.join(engine,f)));
const server=http.createServer((q,s)=>{const u=decodeURIComponent(q.url.split('?')[0]);if(u==='/'||u==='/index.html'){s.setHeader('Content-Type','text/html');s.end(html);return;}const ext=path.extname(u),types={'.js':'text/javascript','.css':'text/css','.png':'image/png','.webp':'image/webp','.jpg':'image/jpeg','.mp3':'audio/mpeg','.json':'application/json'};s.setHeader('Content-Type',types[ext]||'application/octet-stream');if(memory.has(u))return s.end(memory.get(u));const fp=path.resolve(dir,'.'+u);if(!fp.startsWith(dir+'/')){s.statusCode=403;return s.end();}try{s.end(fs.readFileSync(fp));}catch{s.statusCode=404;s.end();}});
const original={stack:[{n:'c3_station',p:[],i:17},{n:'c3_station',p:[16,'then'],i:0}],f:{leo:2,told_leo:'omit',kept:'yes'},items:['note'],truths:{T1:1},used:{'o:stable':1},notes:[],log:[],met:{},scene:'lifeboat',cast:{leo:{at:'c',face:''}},last:null,ch:3,path:['c1_open'],passed:{c1_open:1}};
const globalSave={truths:{T1:1,T14:1},endings:{c1_end:1},cps:{c3_station:structuredClone(original)},chDone:{1:1,2:1},chAt:{3:structuredClone(original)},opts:{},words:{},seen:{},known:{},set:{mode:'bi',speed:0,vDlg:false,vNarr:false,shadow:false,sfx:false,amb:false,tr:true}};
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const url='http://127.0.0.1:'+server.address().port+'/';
 const browser=await chromium.launch({...(process.env.BT_BROWSER_PATH?{executablePath:process.env.BT_BROWSER_PATH}:{}),headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--disable-gpu']});
 const results=[]; fs.mkdirSync(qaDir,{recursive:true});
 const pickFile=async(page,data)=>{const picked=page.waitForEvent('filechooser');await page.evaluate(()=>MobileVN.importSave());await(await picked).setFiles({name:'test-save.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(data))});};
 const downloadSave=async page=>{const wait=page.waitForEvent('download');await page.evaluate(()=>MobileVN.exportSave());const d=await wait;assert.strictEqual(d.suggestedFilename(),'Between_Tides_Save.json');return JSON.parse(fs.readFileSync(await d.path(),'utf8'));};
 for(const sdk of [false,true]){
  const page=await browser.newPage({viewport:{width:390,height:844},hasTouch:true});const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(({r,g,sdk})=>{
   window.seed={r,g};window.sdkWrites=[];window.sdkLoads=0;
   if(sdk){const mem={'se.between-tides.r':r,'se.between-tides.g':g};window.Enmi={lang:'vi',learn:'en',load:async()=>{sdkLoads++;return JSON.parse(JSON.stringify(mem));},save:async d=>{sdkWrites.push(JSON.parse(JSON.stringify(d)));Object.assign(mem,JSON.parse(JSON.stringify(d)));}};Object.defineProperty(window,'localStorage',{get(){throw new Error('SDK sandbox: no localStorage');}});}
   else {localStorage.setItem('se.between-tides.r',JSON.stringify(r));localStorage.setItem('se.between-tides.g',JSON.stringify(g));}
  },{r:original,g:globalSave,sdk});
  await page.goto(url);await page.waitForSelector('.se[data-m="ov"]');
  const initial=await page.evaluate(()=>({r:StoryEngine.R(),set:StoryEngine.G().set,revision:StoryEngine.btSaveCompat.revision,cp:StoryEngine.G().cps.c3_station,collection:StoryEngine.G().truths,runTruth:StoryEngine.state().truth('T14')}));
  assert.strictEqual(await page.locator('.se-ovend1 em').innerText(),'0/10'); assert.strictEqual(await page.locator('.se-ovdots u').count(),10); assert.strictEqual(initial.r.stack.length,0);assert.strictEqual(initial.set.mode,'bi');assert.strictEqual(initial.set.speed,0);for(const k of ['vDlg','vNarr','shadow','sfx','amb'])assert.strictEqual(initial.set[k],false);
  assert.strictEqual(initial.cp.btRevision,initial.revision);assert.strictEqual(initial.collection.T14,1);assert.strictEqual(initial.runTruth,false);
  await page.evaluate(()=>{MobileVN.persist();});await page.waitForTimeout(600);
  const saved=await page.evaluate(sdk=>sdk?sdkWrites.at(-1)['se.between-tides.r']:JSON.parse(localStorage.getItem('se.between-tides.r')),sdk);
  assert(saved.stack.length===2);assert.strictEqual(saved.f.kept,'yes');assert.strictEqual(saved.btRevision,initial.revision);assert.deepStrictEqual(saved.truths,original.truths);assert.deepStrictEqual(saved.items,original.items);
  await page.evaluate(()=>StoryEngine.ui.menu());await page.waitForSelector('[data-bt-easy]:visible');await page.locator('[data-bt-easy]:visible').click();await page.waitForTimeout(500);
  const easy=await page.evaluate(sdk=>({setting:StoryEngine.G().set.easyAct,save:sdk?sdkWrites.at(-1)['se.between-tides.r']:JSON.parse(localStorage.getItem('se.between-tides.r'))}),sdk);assert.strictEqual(easy.setting,true);assert.deepStrictEqual(easy.save.stack,saved.stack);
  await page.evaluate(()=>{StoryEngine.ui.closeSheet();StoryEngine.ui.recap=async()=>{};});
  await page.evaluate(async()=>{StoryEngine.stop();const r=StoryEngine.R();for(const k of Object.keys(r))delete r[k];Object.assign(r,structuredClone(seed.r));await StoryEngine.resume();});
  await page.waitForTimeout(100);
  const resumed=await page.evaluate(()=>({r:StoryEngine.snapshot(),text:document.querySelector('.se-txt').textContent,valid:StoryEngine.R().stack.every(f=>Array.isArray(StoryEngine.walk(f)))}));
  assert.strictEqual(resumed.valid,true);assert(resumed.text.length>30);assert.strictEqual(resumed.r.btRevision,initial.revision);assert.strictEqual(resumed.r.f.kept,'yes');assert.strictEqual(resumed.r.truths.T14,undefined);
  const imported=await page.evaluate(async()=>{const d={run:{...structuredClone(seed.r),ch:5,stack:[{n:'c5_reading',p:[],i:7},{n:'c5_reading',p:[6,'deduce','fail'],i:0}]},global:structuredClone(seed.g)};await MobileVN.prepareSave(d);return d;}); assert.strictEqual(imported.run.btRecovery.pending,true); assert.deepStrictEqual(imported.run.stack,[{n:'c5_reading',p:[],i:0}]); assert.strictEqual(imported.run.truths.T12,undefined); assert.strictEqual(imported.run.f.p_second_blow,undefined);
  const exported=await downloadSave(page);assert.strictEqual(exported.run.btRevision,initial.revision);await page.waitForTimeout(500);
  const stable=await page.evaluate(sdk=>({run:StoryEngine.snapshot(),global:StoryEngine.G(),writes:sdk?sdkWrites.length:JSON.stringify(localStorage)}),sdk);
  const badFile=structuredClone(exported);badFile.run.btRevision='future-revision';await pickFile(page,badFile);await page.waitForTimeout(150);
  const unchanged=await page.evaluate(sdk=>({run:StoryEngine.snapshot(),global:StoryEngine.G(),writes:sdk?sdkWrites.length:JSON.stringify(localStorage)}),sdk);assert.deepStrictEqual(unchanged,stable);assert.strictEqual(await page.locator('[data-load]:visible').count(),0);
  const malformed=structuredClone(exported);malformed.run.stack[0].i=99999;await pickFile(page,malformed);await page.waitForTimeout(150);assert.deepStrictEqual(await page.evaluate(()=>StoryEngine.snapshot()),stable.run);
  await page.evaluate(()=>{window.beforeImportR=StoryEngine.R();window.beforeImportG=StoryEngine.G();StoryEngine.R().f.kept='changed';StoryEngine.R().items=[];StoryEngine.G().truths={};});
  await pickFile(page,exported);await page.waitForSelector('[data-load]:visible');await page.locator('[data-load]:visible').tap();await page.waitForTimeout(180);
  const reloaded=await page.evaluate(()=>({run:StoryEngine.snapshot(),g:StoryEngine.G(),identity:beforeImportR===StoryEngine.R()&&beforeImportG===StoryEngine.G()}));assert.strictEqual(reloaded.identity,true);assert.strictEqual(reloaded.run.f.kept,'yes');assert.deepStrictEqual(reloaded.run.items,exported.run.items);assert.deepStrictEqual(reloaded.g.truths,exported.global.truths);
  // Actual native touch menus at the narrow and normal mobile widths.
  for(const width of [320,390]){
   await page.setViewportSize({width,height:width===320?568:844});await page.waitForTimeout(80);
   assert.strictEqual(await page.locator('.se-top>button:visible').count(),2);const read=await page.evaluate(()=>JSON.stringify(StoryEngine.snapshot().stack));
   await page.locator('[data-bt-menu]').tap();assert.strictEqual(await page.locator('[data-quick-menu]:visible').count(),1);assert.strictEqual(await page.locator('[data-bt-home]:visible').count(),1); await page.waitForTimeout(180); assert.strictEqual(await page.evaluate(()=>getComputedStyle(document.querySelector('.se-mem')).visibility),'hidden'); const topmost=await page.evaluate(()=>[...document.querySelectorAll('.bt-quick-menu button')].every(b=>{const r=b.getBoundingClientRect();return document.elementFromPoint(r.x+r.width/2,r.y+r.height/2)?.closest('button')===b;})); assert.strictEqual(topmost,true);
   await page.screenshot({path:path.join(qaDir,'menu-'+width+'-'+(sdk?'sdk':'local')+'.png')});
   await page.touchscreen.tap(width/2,width===320?500:700);assert.strictEqual(await page.locator('[data-quick-menu]:visible').count(),0);assert.strictEqual(await page.evaluate(()=>JSON.stringify(StoryEngine.snapshot().stack)),read);
   await page.locator('[data-bt-goal]').tap();assert.strictEqual(await page.locator('#bt-current-objective:visible').count(),1);await page.locator('[data-bt-goal-close]').tap();assert.strictEqual(await page.evaluate(()=>JSON.stringify(StoryEngine.snapshot().stack)),read);
   assert.strictEqual(await page.locator('.se>.lf-hud').count(),0);assert.strictEqual(await page.locator('.lf-hud').count(),1);
   await page.locator('[data-bt-menu]').tap();const profile=page.locator('.bt-quick-menu .lf-hud:visible');assert.strictEqual(await profile.count(),1);const profileBox=await profile.boundingBox();assert(profileBox.height>=44&&profileBox.width>=44);await profile.tap();await page.waitForSelector('.se-sheet .lf-pt:visible');assert.strictEqual(await page.locator('[data-quick-menu]:visible').count(),0);assert.strictEqual(await page.evaluate(()=>JSON.stringify(StoryEngine.snapshot().stack)),read);await page.locator('.se-sheet button[data-x]').tap();
  }
  // v093 owns Auto timers; quick-menu must pause and restart the whole wait.
  await page.evaluate(()=>{StoryEngine.G().set.speed=3;});await page.locator('.se-autob').tap();await page.locator('[data-bt-menu]').tap();const autoStack=await page.evaluate(()=>JSON.stringify(StoryEngine.snapshot().stack));await page.waitForTimeout(3600);assert.strictEqual(await page.evaluate(()=>JSON.stringify(StoryEngine.snapshot().stack)),autoStack);await page.touchscreen.tap(195,700);await page.waitForTimeout(80);assert.strictEqual(await page.evaluate(()=>JSON.stringify(StoryEngine.snapshot().stack)),autoStack);await page.locator('.se-autob').tap();
  // Import/export while the native hold action is unresolved.
  const holdBefore=await page.evaluate(()=>{StoryEngine.stop();const i=StoryEngine.S().nodes.c6_keeper.findIndex(x=>x.act?.kind==='hold'),r={...structuredClone(seed.r),btRevision:StoryEngine.btSaveCompat.revision,ch:6,scene:'box',stack:[{n:'c6_keeper',p:[],i}]};StoryEngine.btSaveCompat.installRun(r);StoryEngine.G().set.autoAdv=false;StoryEngine.play();return i;});await page.waitForSelector('.se-act');
  const holdFile=await downloadSave(page);assert.strictEqual(holdFile.run.stack.at(-1).i,holdBefore);await page.evaluate(()=>{StoryEngine.stop();StoryEngine.ui.title();});await pickFile(page,holdFile);await page.waitForSelector('[data-load]:visible');await page.locator('[data-load]:visible').tap();await page.waitForSelector('.se-act');assert.strictEqual(await page.evaluate(()=>StoryEngine.snapshot().stack.at(-1).i),holdBefore);assert.strictEqual(await page.evaluate(()=>StoryEngine.R().f.c6_hidden_earned),undefined);
  await page.waitForTimeout(500);
  const beforeBad=await page.evaluate(sdk=>sdk?sdkWrites.at(-1)['se.between-tides.r']:JSON.parse(localStorage.getItem('se.between-tides.r')),sdk);
  await page.evaluate(async()=>{StoryEngine.stop();StoryEngine.R().btRevision='not-a-supported-revision';await StoryEngine.resume();});
  assert.strictEqual(await page.locator('.se').getAttribute('data-m'),'ov');assert((await page.locator('.se-toast').innerText()).includes('Bản lưu thuộc bản truyện khác'));
  const afterBad=await page.evaluate(sdk=>sdk?sdkWrites.at(-1)['se.between-tides.r']:JSON.parse(localStorage.getItem('se.between-tides.r')),sdk);assert.deepStrictEqual(afterBad,beforeBad); const frozen=await page.evaluate(()=>StoryEngine.snapshot()); await page.evaluate(()=>MobileVN.persist()); await page.waitForTimeout(500); const frozenStored=await page.evaluate(sdk=>sdk?sdkWrites.at(-1)['se.between-tides.r']:JSON.parse(localStorage.getItem('se.between-tides.r')),sdk); assert.deepStrictEqual(frozenStored,frozen);
  assert.deepStrictEqual(errors,[]);results.push({mode:sdk?'Enmi SDK stub / storage denied':'localStorage',preferencePreserved:true,overviewMainRunPreserved:true,nativeEasySetting:true,legacyNestedResume:true,noCrossRunTruth:true,unknownRevisionRefused:true,refusalSnapshotPreserved:true,revisedPuzzleImportRecovery:true,finalEndingsCount:'0/10',fileChooserImportExport:['mid dialogue','mid hold action'],invalidFileNoWrite:true,touchMenuWidths:[320,390],nativeProfileInMenu:true,autoPausedByMenu:true,jsErrors:errors.length});await page.close();
 }
 console.log(JSON.stringify({pass:true,engine:'user-supplied v093',viewport:'390x844 touch',results},null,2));await browser.close();server.close();
})().catch(e=>{console.error(e);server.close();process.exit(1);});
