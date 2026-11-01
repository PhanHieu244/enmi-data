// Actual native explore regression; final artwork alignment is a separate QA.
// BT_BROWSER_PATH=/path/to/chromium node plugins/bt-test-cottage.cjs
'use strict';
const fs=require('fs'),path=require('path'),http=require('http'),assert=require('assert');
const {chromium}=require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES?path.join(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES,'playwright'):'playwright');
const game=path.resolve(__dirname,'..');
const scripts=['bt00-line-order.js','bt00-mobile-compat.js','mobile-base.js','mobile-menu.js','mobile-experience.js','mobile-learning.js','mobile-records.js','mobile-title.js','bt-save-map.js','bt-save-compat.js','bt-save-transfer.js','bt-integrity.js','bt-mobile.js','bt-navigation.js','bt-audio-mix.js','bt-direction.js','bt-cottage.js','bt-record-receipts.js'];
let html=fs.readFileSync(path.join(game,'index.html'),'utf8').replace(/<script src="plugins\/[^\"]+"><\/script>\n?/g,'');
html=html.replace('<script src="art.js">',scripts.map(s=>'<script src="plugins/'+s+'"></script>').join('\n')+'\n<script src="art.js">');
for(const name of ['bt-navigation','bt-cottage','bt-direction','bt-record-receipts'])if(!html.includes('plugins/'+name+'.css'))html=html.replace('</head>','<link rel="stylesheet" href="plugins/'+name+'.css"></head>');
// Match the forthcoming generated CSS while the root art build is in flight.
html=html.replace('</head>','<style>'+['cottage-closed','cottage-open-dog','cottage-dog'].map(id=>'.im-'+id+'{background-image:url(img/'+id+'.png)}').join('\n')+'</style></head>');
const server=http.createServer((req,res)=>{const u=decodeURIComponent(req.url.split('?')[0]);if(u==='/'||u==='/index.html'){res.setHeader('Content-Type','text/html');return res.end(html);}const f=path.resolve(game,'.'+u);if(!f.startsWith(game+'/')){res.statusCode=403;return res.end();}const types={'.js':'text/javascript','.css':'text/css','.mp3':'audio/mpeg','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp'};res.setHeader('Content-Type',types[path.extname(f)]||'application/octet-stream');try{res.end(fs.readFileSync(f));}catch{res.statusCode=404;res.end();}});
let browser;
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 browser=await chromium.launch({...(process.env.BT_BROWSER_PATH?{executablePath:process.env.BT_BROWSER_PATH}:{}),headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--disable-gpu']});
 const page=await browser.newPage({viewport:{width:390,height:844},hasTouch:true}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>localStorage.setItem('se.between-tides.g',JSON.stringify({set:{mode:'bi',speed:0,vDlg:false,vNarr:false,shadow:false,sfx:false,amb:false,tr:true,vdNativeControls:true},cps:{},chAt:{},truths:{},endings:{},opts:{},words:{},seen:{},known:{},chDone:{}})));
 await page.goto('http://127.0.0.1:'+server.address().port+'/');await page.waitForSelector('.se[data-m="ov"]');
 await page.evaluate(async()=>{
  const E=StoryEngine;await E.loadUpTo(2);E.ui.recap=async()=>{};MobileVN.start();E.stop();
  window.doorCues=0;E.on('step',(type,st)=>{if(type==='sfx'&&st.sfx==='door')doorCues++;});
  const node=E.S().nodes.c2_cottage,idx=node.findIndex(st=>st.explore?.spots?.some(sp=>sp.id==='kitchen'));
  window.cottageFixture={idx,shape:node[idx].explore.spots.map(sp=>sp.id),arrays:node[idx].explore.spots.map(sp=>sp.then)};
  E.R().ch=2;E.R().stack=[{n:'c2_cottage',p:[],i:idx}];await E.resume();
 });
 const button=id=>page.locator('[data-sp="'+id+'"]');
 await button('kitchen').waitFor({state:'visible'});
 if(process.argv.includes('--geometry')){
  const samples=[];for(let n=0;n<8;n++){samples.push(await page.evaluate(()=>{const b=document.querySelector('[data-sp="phone"]'),a=[];for(let e=b;e&&a.length<6;e=e.parentElement){const r=e.getBoundingClientRect(),c=getComputedStyle(e);a.push({cls:e.className,x:r.x,y:r.y,w:r.width,h:r.height,anim:c.animation,transform:c.transform});}return a;}));await page.waitForTimeout(150);}console.log(JSON.stringify(samples,null,2));await page.screenshot({path:'/workspace/scratch/f22c146db13d/test-runtime/cottage-geometry.png'});await browser.close();browser=null;server.close();return;
 }
 for(const id of ['cabinet','stove','window','back'])assert.strictEqual(await button(id).isVisible(),false);
 const initial=await page.evaluate(()=>StoryEngine.snapshot());
 await page.evaluate(()=>document.querySelector('[data-sp="cabinet"]').dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true})));
 assert.deepStrictEqual(await page.evaluate(()=>StoryEngine.snapshot().stack),initial.stack);
 assert.strictEqual(await page.evaluate(()=>Object.keys(StoryEngine.R().used).some(k=>k.endsWith('.v.cabinet'))),false);
 const finishBranch=async(returnId='kitchen')=>{
  for(let i=0;i<30;i++){
   if(await page.locator('[data-sp]:visible').count())break;
   await page.keyboard.press('Space');await page.waitForTimeout(70);
  }
  if(await page.locator('[data-xp-back]').isVisible())await page.locator('[data-xp-back]').tap();
  await button(returnId).waitFor({state:'visible'});
 };
 // Every initially reachable clue may be examined before the kitchen.
 for(const id of ['phone','front']){await button(id).tap();await page.waitForTimeout(180);await finishBranch();}
 const noteBefore=await page.evaluate(()=>({stack:StoryEngine.snapshot().stack,jot:structuredClone(StoryEngine.R().jot),height:document.querySelector('.bt-note-receipt')?.getBoundingClientRect().height}));
 assert.strictEqual(noteBefore.jot.length,2);assert(noteBefore.height<=88);assert.strictEqual(await page.locator('.se-t.receipt').count(),1);
 await page.locator('[data-bt-note-open]').tap();await page.waitForSelector('.se-sheet [data-jot].on');
 assert((await page.locator('.se-bookb').innerText()).includes('Cổng trước'));assert.deepStrictEqual(await page.evaluate(()=>StoryEngine.snapshot().stack),noteBefore.stack);
 await page.evaluate(()=>StoryEngine.ui.closeSheet());assert.deepStrictEqual(await page.evaluate(()=>StoryEngine.R().jot),noteBefore.jot);
 assert.strictEqual(await page.locator('[data-done]:visible').count(),0);
 assert.strictEqual(await page.evaluate(()=>StoryEngine.S().nodes.c2_cottage[cottageFixture.idx].explore.need),5);
 assert.strictEqual(await page.evaluate(()=>StoryEngine.S().nodes.c2_cottage[cottageFixture.idx].explore.spots.filter(x=>x.clue).length),5);
 await button('kitchen').tap();await page.waitForFunction(()=>StoryEngine.btCottage.isOpen());
 const middle=await page.evaluate(()=>({run:StoryEngine.snapshot(),doors:doorCues,scene:StoryEngine.R().scene}));
 assert.strictEqual(middle.scene,'cottage-open-dog');assert.strictEqual(middle.doors,1);
 await page.evaluate(async run=>{StoryEngine.stop();StoryEngine.btSaveCompat.installRun(run);await StoryEngine.resume();},middle.run);
 await page.waitForFunction(()=>StoryEngine.btCottage.isOpen());await page.waitForTimeout(150);await finishBranch();
 for(const id of ['cabinet','stove','window','back'])assert.strictEqual(await button(id).isVisible(),true);
 assert.strictEqual(await page.locator('[data-done]:visible').count(),0); // three of five clues
 assert.strictEqual(await page.evaluate(()=>doorCues),1);
 await button('kitchen').tap();await page.waitForTimeout(130);await finishBranch();
 assert.strictEqual(await page.evaluate(()=>doorCues),1); // again text, not another opening
 await button('cabinet').tap();await page.waitForTimeout(100);await finishBranch();
 assert.strictEqual(await page.locator('[data-done]:visible').count(),0);
 await button('back').tap();await page.waitForTimeout(100);await finishBranch();
 assert.strictEqual(await page.locator('[data-done]:visible').count(),1);
 const check=await page.evaluate(()=>{const x=StoryEngine.S().nodes.c2_cottage[cottageFixture.idx].explore;return{shape:x.spots.map(s=>s.id),sameArrays:x.spots.every((s,i)=>s.then===cottageFixture.arrays[i]),scene:StoryEngine.R().scene,flag:StoryEngine.btCottage.isOpen()};});
 assert.deepStrictEqual(check.shape,['kitchen','stove','cabinet','pegs','phone','back','front','window']);assert.strictEqual(check.sameArrays,true);
 // Restore an original-release run at the returned explore: the native visited
 // mark is evidence that its kitchen child has finished, not aggregate knowledge.
 await page.evaluate(async()=>{const E=StoryEngine,r=E.snapshot();delete r.f[E.btCottage.flag];E.stop();E.btSaveCompat.installRun(r);await E.resume();});
 await button('cabinet').waitFor({state:'visible'});assert.strictEqual(await page.evaluate(()=>StoryEngine.btCottage.isOpen()),true);
 await page.evaluate(async()=>{const E=StoryEngine;E.newRun();E.stop();E.R().ch=2;E.R().stack=[{n:'c2_cottage',p:[],i:cottageFixture.idx}];await E.resume();});
 await button('kitchen').waitFor({state:'visible'});assert.strictEqual(await button('cabinet').isVisible(),false);assert.strictEqual(await page.evaluate(()=>StoryEngine.btCottage.isOpen()),false);
 // Two clue spots share a small handset in Chapter 4. Read its label first;
 // both clues remain in native need:2 and no duplicate target is exposed.
 await page.evaluate(async()=>{
  const E=StoryEngine;E.stop();await E.loadUpTo(4);E.newRun();E.stop();
  const idx=E.S().nodes.c4_cottage.findIndex(st=>st.explore?.spots?.some(sp=>sp.id==='label'));
  window.laterCottageIndex=idx;E.R().ch=4;E.R().stack=[{n:'c4_cottage',p:[],i:idx}];
  E.G().truths.T7=1;await E.resume();
 });
 await button('label').waitFor({state:'visible'});assert.strictEqual(await button('phone').isVisible(),false);assert.strictEqual(await page.locator('[data-done]:visible').count(),0);
 const labelStart=await page.evaluate(()=>StoryEngine.snapshot().stack);
 await page.evaluate(()=>document.querySelector('[data-sp="phone"]').dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true})));
 assert.deepStrictEqual(await page.evaluate(()=>StoryEngine.snapshot().stack),labelStart);
 for(const width of [320,390]){
  await page.setViewportSize({width,height:width===320?568:844});await page.waitForTimeout(300);
  const targets=await page.evaluate(()=>[...document.querySelectorAll('[data-sp]')].filter(e=>e.getBoundingClientRect().width>0).map(e=>{const r=e.getBoundingClientRect();return{id:e.dataset.sp,w:r.width,h:r.height,hit:document.elementFromPoint(r.x+r.width/2,r.y+r.height/2)?.closest('[data-sp]')===e};}));
  assert(targets.every(x=>x.w>=43.9&&x.h>=43.9&&x.hit),JSON.stringify(targets));
  await page.screenshot({path:'/workspace/scratch/f22c146db13d/test-runtime/bt-plugin-qa/cottage-c4-'+width+'.png'});
 }
 await button('label').tap();await page.waitForTimeout(130);await finishBranch('phone');
 assert.strictEqual(await button('label').isVisible(),false);assert.strictEqual(await page.locator('[data-done]:visible').count(),0);
 await button('phone').tap();await page.waitForTimeout(130);await finishBranch('phone');
 assert.strictEqual(await page.locator('[data-done]:visible').count(),1);assert.strictEqual(await page.evaluate(()=>!!StoryEngine.R().truths.T7),true);
 // The original game allowed the reverse order. Preserve that used state and
 // present its missing label; opening it must not invent the absent truth.
 await page.evaluate(async()=>{const E=StoryEngine;E.newRun();E.stop();E.R().ch=4;E.R().stack=[{n:'c4_cottage',p:[],i:laterCottageIndex}];E.R().used['c4_cottage.'+laterCottageIndex+'.v.phone']=1;await E.resume();});
 await button('label').waitFor({state:'visible'});assert.strictEqual(await button('phone').isVisible(),false);assert.strictEqual(await page.locator('[data-done]:visible').count(),0);
 await button('label').tap();await page.waitForTimeout(130);await finishBranch('phone');
 assert.strictEqual(await page.locator('[data-done]:visible').count(),1);assert.strictEqual(await page.evaluate(()=>StoryEngine.R().used['c4_cottage.'+laterCottageIndex+'.v.phone']),1);assert.strictEqual(await page.evaluate(()=>!!StoryEngine.R().truths.T7),false);
 assert.deepStrictEqual(errors,[]);
 console.log(JSON.stringify({pass:true,nativeEngine:true,cluesRequired:{chapter2:5,chapter4:2},scenarios:['hidden kitchen input rejected','phone/front first cannot exit','open during native line','mid-line resume','repeat does not reopen','all five clues required','original visited mark restored','new run stays closed','same spot and then arrays','C4 label then receiver','C4 reverse-order original save','320/390 target centres and minimum44px','compact latest note receipt opens full notes without advancing'],pageErrors:errors},null,2));
 await browser.close();browser=null;server.close();
})().catch(async error=>{console.error(error);if(browser)await browser.close();server.close();process.exitCode=1;});
