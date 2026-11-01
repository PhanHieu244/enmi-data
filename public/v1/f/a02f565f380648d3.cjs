// Native v093 + SDK chapter stub: the returned CSS is a blob URL containing a
// delayed import. Proves the wrapper waits for the inserted link, not the raw
// hidden href. Local normal/error/retry cases are also exercised here.
'use strict';
const fs=require('fs'),path=require('path'),http=require('http'),assert=require('assert');
const {chromium}=require(path.join(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES,'playwright'));
const dir=path.resolve(__dirname,'..');
const server=http.createServer((req,res)=>{const url=decodeURIComponent(req.url.split('?')[0]);const file=path.resolve(dir,'.'+(url==='/'?'/index.html':url));if(!file.startsWith(dir+'/')){res.statusCode=403;return res.end();}const ext=path.extname(file);res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css','.webp':'image/webp','.mp3':'audio/mpeg'})[ext]||'application/octet-stream');try{res.end(fs.readFileSync(file));}catch{res.statusCode=404;res.end();}});
let browser;
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin='http://127.0.0.1:'+server.address().port;
 browser=await chromium.launch({executablePath:process.env.BT_BROWSER_PATH,headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--disable-gpu']});
 const results=[];
 for(const mode of ['local delayed','local failure and retry','SDK blob delayed']){
  const page=await browser.newPage({viewport:{width:390,height:844},hasTouch:true}),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(({mode})=>{
   localStorage.clear();window.sdkChapterCalls=0;
   if(mode==='SDK blob delayed')window.Enmi={lang:'vi',learn:'en',load:async()=>({}),save:async()=>{},chapter:async ch=>{
    sdkChapterCalls++;
    const js=await(await fetch('/story/ch'+ch+'.js')).text();
    const css='@import url("'+location.origin+'/sdk-ch'+ch+'-delayed.css");';
    return{ok:true,urls:{['story/ch'+ch+'.js']:URL.createObjectURL(new Blob([js],{type:'text/javascript'})),['art-ch'+ch+'.css']:URL.createObjectURL(new Blob([css],{type:'text/css'}))}};
   }};
  },{mode});
  let requests=0;
  if(mode==='SDK blob delayed')await page.route('**/sdk-ch2-delayed.css',async route=>{await new Promise(r=>setTimeout(r,400));const css=fs.readFileSync(path.join(dir,'art-ch2.css'),'utf8').replace(/url\((img\/|audio\/)/g,'url('+origin+'/$1');await route.fulfill({status:200,contentType:'text/css',body:css});});
  else await page.route('**/art-ch2.css',async route=>{requests++;if(mode==='local failure and retry'&&requests===1)return route.fulfill({status:404,contentType:'text/css',body:''});await new Promise(r=>setTimeout(r,400));await route.continue();});
  await page.goto(origin+'/');await page.waitForSelector('.se[data-m="ov"]');
  assert.strictEqual(await page.evaluate(()=>!!StoryEngine.plugins['bt-chapter-assets']),true,'Rebuild source index with the new chapter-assets plugin first.');
  const initial=await page.evaluate(()=>JSON.stringify(StoryEngine.snapshot()));
  const first=await page.evaluate(async()=>{const t=performance.now(),ok=await StoryEngine.loadUpTo(2);return{ok,ms:performance.now()-t,status:StoryEngine.btChapterAssets.status(2)};});
  let outcome=first;
  if(mode==='local failure and retry'){
   assert.strictEqual(first.ok,false);assert.strictEqual(await page.evaluate(()=>JSON.stringify(StoryEngine.snapshot())),initial);assert((await page.locator('.se-toast').innerText()).includes('Tiến độ vẫn được giữ'));
   outcome=await page.evaluate(async()=>{const t=performance.now(),ok=await StoryEngine.loadUpTo(2);return{ok,ms:performance.now()-t,status:StoryEngine.btChapterAssets.status(2)};});assert.strictEqual(requests,2);
  }
  assert.strictEqual(outcome.ok,true);assert(outcome.ms>=350);assert.strictEqual(outcome.status.ready,true);assert(outcome.status.stylesheets.every(s=>s.status==='loaded'));
  if(mode==='SDK blob delayed')assert(outcome.status.stylesheets.some(s=>s.href.startsWith('blob:')));
  const rendering=await page.evaluate(()=>{
   const E=StoryEngine,probe=document.createElement('i');probe.className='im-nell-full-outside';document.body.append(probe);const costume=getComputedStyle(probe).backgroundImage;probe.remove();
   E.R().ch=2;E.R().met.leo=1;E.ui.show('leo','c','determined');const actor=document.querySelector('.se-ch[data-id="leo"]');const face={hasf:actor.classList.contains('hasf'),image:getComputedStyle(actor.querySelector('.im-leo-determined')).backgroundImage};E.ui.cg('cg-tom-dead');const cg=document.querySelector('.im-cg-tom-dead');return{costume,face,cg:getComputedStyle(cg).backgroundImage,hasArt:E.hasArt('im-nell-full-outside'),chapter6:!!E.S().nodes.c6_open,sdkChapterCalls};
  });
  assert.notStrictEqual(rendering.costume,'none');assert.strictEqual(rendering.face.hasf,true);assert.notStrictEqual(rendering.face.image,'none');assert.notStrictEqual(rendering.cg,'none');assert.strictEqual(rendering.chapter6,false);assert.strictEqual(rendering.hasArt,true);if(mode==='SDK blob delayed')assert.strictEqual(rendering.sdkChapterCalls,1);assert.deepStrictEqual(errors,[]);
  results.push({mode,first,outcome,rendering,pageErrors:errors});await page.close();
 }
 console.log(JSON.stringify({pass:true,engine:'native supplied v093',results},null,2));await browser.close();browser=null;server.close();
})().catch(async error=>{console.error(error);if(browser)await browser.close();server.close();process.exitCode=1;});
