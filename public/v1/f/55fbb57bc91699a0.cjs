// Reproduce or reject a native chapter CSS/hasArt timing risk without changing core.
'use strict';
const fs = require('fs'), path = require('path'), http = require('http');
const { chromium } = require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES ? path.join(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES, 'playwright') : 'playwright');
const root = path.resolve(__dirname, '../../../..');
const game = path.join(root, 'tools/games/between-tides');
const failFirst=process.env.BT_FAIL_FIRST_CSS==='1';
const server = http.createServer((req, res) => {
 const u=decodeURIComponent(req.url.split('?')[0]); const f=path.resolve(game,'.'+(u==='/'?'/index.html':u));
 if(!f.startsWith(game+'/')){res.statusCode=403;return res.end();}
 res.setHeader('Content-Type',f.endsWith('.js')?'text/javascript':f.endsWith('.css')?'text/css':f.endsWith('.html')?'text/html':'application/octet-stream');
 try{res.end(fs.readFileSync(f));}catch{res.statusCode=404;res.end();}
});
let browser;
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 browser=await chromium.launch({executablePath:process.env.BT_BROWSER_PATH,headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--disable-gpu']});
 const page=await browser.newPage({viewport:{width:320,height:568},hasTouch:true}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>localStorage.clear());
 let cssRequests=0;
 await page.route('**/art-ch2.css',async route=>{cssRequests++;if(failFirst&&cssRequests===1)return route.fulfill({status:404,contentType:'text/css',body:''});await new Promise(r=>setTimeout(r,400));await route.continue();});
 await page.goto('http://127.0.0.1:'+server.address().port+'/'); await page.waitForSelector('.se[data-m="ov"]');
 const data=await page.evaluate(async failFirst=>{
  const E=StoryEngine,t=performance.now(); const firstOk=await E.loadUpTo(2),statusAfterFirst=E.btChapterAssets?.status(2);
  const retryOk=failFirst?await E.loadUpTo(2):null;
  const link=[...document.querySelectorAll('link[rel=stylesheet]')].find(l=>/art-ch2\.css(?:\?|$)/.test(l.href));
  if(!link)throw Error('The current index does not load art-ch2.css; wait for the split source build.');
  const before={hasArt:E.hasArt('im-nell-full-outside'),loaded:!!link.sheet,milliseconds:performance.now()-t};
  if(!link.sheet) await new Promise((res,rej)=>{link.addEventListener('load',res,{once:true});link.addEventListener('error',()=>rej(Error('CSS load failed')),{once:true});});
  const probe=document.createElement('div');probe.className='im-nell-full-outside';document.body.appendChild(probe);
  const after={hasArt:E.hasArt('im-nell-full-outside'),loaded:!!link.sheet,background:getComputedStyle(probe).backgroundImage,milliseconds:performance.now()-t};probe.remove();
  E.quiet=true; E.newRun(); E.stop(); E.quiet=false; E.R().ch=2; E.R().met.leo=1; E.ui.show('leo','c','determined');
  const face=document.querySelector('.se-ch[data-id=leo]'); const faceImage=face.querySelector('.im-leo-determined');
  const nativeFace={who:'leo',face:'determined',hasf:face.classList.contains('hasf'),background:faceImage?getComputedStyle(faceImage).backgroundImage:'none'};
  E.ui.cg('cg-tom-dead'); const cgImage=document.querySelector('.im-cg-tom-dead');
  const nativeCg={state:E.R().cg,background:cgImage?getComputedStyle(cgImage).backgroundImage:'none'};
  return{firstOk,retryOk,statusAfterFirst,before,after,nativeFace,nativeCg,chapter6Loaded:!!E.S().nodes.c6_open,stylesheets:[...document.querySelectorAll('link[rel=stylesheet]')].map(l=>l.getAttribute('href'))};
 },failFirst);
 const result={cssDelayMs:400,failFirst,cssRequests,errors,...data};
 const out=path.join(root,'docs/games/between-tides/qa',failFirst?'cast-css-failure-retry.json':'cast-css-delay-after.json');fs.mkdirSync(path.dirname(out),{recursive:true});fs.writeFileSync(out,JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result,null,2));
 await browser.close();browser=null;server.close();
 if((failFirst?(data.firstOk!==false||data.retryOk!==true):(data.firstOk!==true)) || !data.before.hasArt || !data.before.loaded || !data.after.hasArt || data.after.background==='none' || !data.nativeFace.hasf || data.nativeFace.background==='none' || data.nativeCg.state!=='cg-tom-dead' || data.nativeCg.background==='none' || errors.length)process.exitCode=1;
})().catch(async e=>{console.error(e);if(browser)await browser.close();server.close();process.exitCode=1;});
