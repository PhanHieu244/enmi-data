// Native picture layout at mobile widths, with actual current PNG dimensions.
// The fixture mirrors generated CSS while artwork is still being installed.
'use strict';
const fs=require('fs'),path=require('path'),http=require('http'),assert=require('assert');
const {chromium}=require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES?path.join(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES,'playwright'):'playwright');
const game=path.resolve(__dirname,'..'),qa=process.env.BT_QA_DIR||'/workspace/scratch/f22c146db13d/test-runtime/bt-plugin-qa';
const scripts=['bt00-line-order.js','bt00-mobile-compat.js','mobile-base.js','mobile-menu.js','mobile-experience.js','mobile-learning.js','mobile-records.js','mobile-title.js','bt-save-map.js','bt-save-compat.js','bt-save-transfer.js','bt-integrity.js','bt-mobile.js','bt-navigation.js','bt-audio-mix.js','bt-direction.js','bt-cottage.js','bt-record-receipts.js'];
let html=fs.readFileSync(path.join(game,'index.html'),'utf8').replace(/<script src="plugins\/[^\"]+"><\/script>\n?/g,'');
html=html.replace('<script src="art.js">',scripts.map(s=>'<script src="plugins/'+s+'"></script>').join('\n')+'\n<script src="art.js">');
for(const file of fs.readdirSync(path.join(game,'plugins')).filter(x=>x.endsWith('.css')))if(!html.includes('plugins/'+file))html=html.replace('</head>','<link rel="stylesheet" href="plugins/'+file+'"></head>');
const regions={},css=[];
for(const file of fs.readdirSync(path.join(game,'img')).filter(x=>x.endsWith('.png'))){const b=fs.readFileSync(path.join(game,'img',file));if(b.length<24||b.toString('hex',0,8)!=='89504e470d0a1a0a')continue;const id=file.slice(0,-4);regions[id]={size:[b.readUInt32BE(16),b.readUInt32BE(20)]};css.push('.im-'+id+'{background-image:url(img/'+file+')}');}
html=html.replace('</head>','<style>'+css.join('\n')+'</style></head>');
html=html.replace('<script src="boot.js">','<script>StoryEngine.regions('+JSON.stringify(regions)+')</script><script src="boot.js">');
const server=http.createServer((req,res)=>{const u=decodeURIComponent(req.url.split('?')[0]);if(u==='/'||u==='/index.html'){res.setHeader('Content-Type','text/html');return res.end(html);}const f=path.resolve(game,'.'+u);if(!f.startsWith(game+'/')){res.statusCode=403;return res.end();}const types={'.js':'text/javascript','.css':'text/css','.mp3':'audio/mpeg','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp'};res.setHeader('Content-Type',types[path.extname(f)]||'application/octet-stream');try{res.end(fs.readFileSync(f));}catch{res.statusCode=404;res.end();}});
let browser;
(async()=>{
 fs.mkdirSync(qa,{recursive:true});await new Promise(r=>server.listen(0,'127.0.0.1',r));
 browser=await chromium.launch({...(process.env.BT_BROWSER_PATH?{executablePath:process.env.BT_BROWSER_PATH}:{}),headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--disable-gpu']});
 const page=await browser.newPage({viewport:{width:390,height:844},hasTouch:true}),errors=[],results=[];page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>localStorage.setItem('se.between-tides.g',JSON.stringify({set:{mode:'bi',speed:0,vDlg:false,vNarr:false,shadow:false,sfx:false,amb:false,tr:true,vdNativeControls:true},cps:{},chAt:{},truths:{},endings:{},opts:{},words:{},seen:{},known:{},chDone:{}})));
 await page.goto('http://127.0.0.1:'+server.address().port+'/');await page.waitForSelector('.se[data-m="ov"]');
 const frames=await page.evaluate(async()=>{
  const E=StoryEngine;await E.loadUpTo(6);E.ui.recap=async()=>{};MobileVN.start();E.stop();
  const wanted=new Set(['act-cuff','cg-fergus-toast','cg-fergus-glare']),out=[],seen=new WeakSet();
  function walk(value,n,p){if(!value||typeof value!=='object'||seen.has(value))return;seen.add(value);if(Array.isArray(value)){value.forEach((st,i)=>{if(st&&wanted.has(st.pic)&&(st.n||st.say||st.think)&&!out.some(f=>f.pic===st.pic))out.push({pic:st.pic,frame:{n,p,i}});walk(st,n,p.concat(i));});}else for(const [k,v]of Object.entries(value))walk(v,n,p.concat(k));}
  for(const [n,a]of Object.entries(E.S().nodes))walk(a,n,[]);for(const [n,a]of Object.entries(E.S().places))walk(a,'@places',[n]);return out;
 });
 assert.strictEqual(frames.length,3);
 for(const width of [320,390])for(const f of frames){
  await page.setViewportSize({width,height:width===320?568:844});
  await page.evaluate(async f=>{const E=StoryEngine;E.stop();E.ui.reset();E.R().ch=1;E.R().scene='lantern';E.R().met.fergus=1;E.R().cast={fergus:{at:'c',face:'smile'}};E.R().stack=[f.frame];await E.resume();},f);
  await page.locator('.se-pic:not(.out)').waitFor({state:'visible'});await page.waitForTimeout(700);
  const measure=()=>page.evaluate(()=>{const E=StoryEngine,p=document.querySelector('.se-pic:not(.out)'),i=p.querySelector('i'),d=document.querySelector('.se-box'),h=document.querySelector('.se-top'),r=p.getBoundingClientRect(),b=d.getBoundingClientRect(),t=h.getBoundingClientRect(),s=getComputedStyle(i),[iw,ih]=E.imgSize(E.R().pic);return{pic:E.R().pic,x:r.x,y:r.y,w:r.width,h:r.height,right:r.right,bottom:r.bottom,dialogueTop:b.top,headerBottom:t.bottom,headerHidden:h.hidden,backgroundSize:s.backgroundSize,animation:s.animationName,castOpacity:getComputedStyle(document.querySelector('.se-chars')).opacity,expectedRatio:iw/ih,stack:JSON.stringify(E.snapshot().stack)};});
  const m=await measure();assert.strictEqual(m.headerHidden,false);assert(m.x>=-1&&m.right<=width+1,JSON.stringify(m));assert(m.y>=m.headerBottom+8,JSON.stringify(m));assert(m.bottom<=m.dialogueTop,JSON.stringify(m));assert(Math.abs(m.w/m.h-m.expectedRatio)<.02,JSON.stringify(m));assert.strictEqual(m.backgroundSize,'contain');assert.strictEqual(m.animation,'none');assert.strictEqual(m.castOpacity,'0');
  await page.evaluate(()=>{StoryEngine.ui.pic(StoryEngine.R().pic);StoryEngine.ui.pic(StoryEngine.R().pic);});await page.waitForTimeout(100);const again=await measure();assert.strictEqual(again.stack,m.stack);assert(Math.abs(again.x-m.x)<.2&&Math.abs(again.y-m.y)<.2&&Math.abs(again.w-m.w)<.2,JSON.stringify({m,again}));
  await page.screenshot({path:path.join(qa,'picture-'+f.pic+'-'+width+'.png')});results.push({width,...m});
 }
 assert.deepStrictEqual(errors,[]);console.log(JSON.stringify({pass:true,nativeEngine:true,assetMetadata:'derived from current PNG files in test fixture',results,pageErrors:errors},null,2));await browser.close();browser=null;server.close();
})().catch(async error=>{console.error(error);if(browser)await browser.close();server.close();process.exitCode=1;});
