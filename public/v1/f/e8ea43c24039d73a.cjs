// Actual v093 interpreter/media regression. Does not certify listening quality.
// BT_BROWSER_PATH=/path/to/chromium node plugins/bt-test-media.cjs
// --without-line-fix reproduces the original pic-first frame dropping its narration.
'use strict';
const fs=require('fs'),path=require('path'),http=require('http'),assert=require('assert');
const {chromium}=require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES?path.join(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES,'playwright'):'playwright');
const game=path.resolve(__dirname,'..'),without=process.argv.includes('--without-line-fix');
const scripts=['bt00-line-order.js','bt00-mobile-compat.js','mobile-base.js','mobile-menu.js','mobile-experience.js','mobile-learning.js','mobile-records.js','mobile-title.js','bt-save-map.js','bt-save-compat.js','bt-save-transfer.js','bt-integrity.js','bt-mobile.js','bt-navigation.js','bt-audio-mix.js'].filter(x=>!without||x!=='bt00-line-order.js');
let html=fs.readFileSync(path.join(game,'index.html'),'utf8').replace(/<script src="plugins\/[^\"]+"><\/script>\n?/g,'');
html=html.replace('<script src="art.js">',scripts.map(s=>'<script src="plugins/'+s+'"></script>').join('\n')+'\n<script src="art.js">');
const sounds=JSON.parse(fs.readFileSync(path.join(game,'audio/sounds.json'),'utf8'));
const css=Object.entries(sounds).map(([k,v])=>'.'+(v.kind==='amb'?'am-':'sx-')+k+'{background-image:url(audio/'+v.file+')}').join('\n');
html=html.replace('</head>','<style>'+css+'</style><link rel="stylesheet" href="plugins/bt-navigation.css"></head>');
const server=http.createServer((req,res)=>{const u=decodeURIComponent(req.url.split('?')[0]);if(u==='/'||u==='/index.html'){res.setHeader('Content-Type','text/html');return res.end(html);}const f=path.resolve(game,'.'+u);if(!f.startsWith(game+'/')){res.statusCode=403;return res.end();}const types={'.js':'text/javascript','.css':'text/css','.mp3':'audio/mpeg','.json':'application/json','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp'};res.setHeader('Content-Type',types[path.extname(f)]||'application/octet-stream');try{res.end(fs.readFileSync(f));}catch{res.statusCode=404;res.end();}});
let activeBrowser;
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const browser=activeBrowser=await chromium.launch({...(process.env.BT_BROWSER_PATH?{executablePath:process.env.BT_BROWSER_PATH}:{}),headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--disable-gpu']});
 const page=await browser.newPage({viewport:{width:390,height:844},hasTouch:true}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>{
  localStorage.setItem('se.between-tides.g',JSON.stringify({set:{mode:'bi',speed:0,vDlg:false,vNarr:false,shadow:false,sfx:true,amb:true,tr:true,vdNativeControls:true},cps:{},chAt:{},truths:{},endings:{},opts:{},words:{},seen:{},known:{},chDone:{}}));
  const Base=window.Audio;window.audioMade=[];window.audioErrors=[];window.clearedAudioSources=0;
  window.Audio=function(url){const a=new Base(url);audioMade.push(a);a.addEventListener('error',()=>{if(!a.getAttribute('src')){clearedAudioSources++;return;}audioErrors.push({src:a.currentSrc||url,code:a.error?.code});});return a;};window.Audio.prototype=Base.prototype;
 });
 await page.goto('http://127.0.0.1:'+server.address().port+'/');await page.waitForSelector('.se[data-m="ov"]');
 const picture=await page.evaluate(async()=>{
  const E=StoryEngine;E.ui.recap=async()=>{};E.newRun();E.stop();await E.ui.scene('lantern');E.ui.show('fergus','c','smile');
  const r=E.R();r.stack=[{n:'@places',p:['c1_bar','views','bar','people',0,'talk','topics',1,'then'],i:5}];r.log=[];r.btRevision=E.btSaveCompat.revision;
  const st=E.walk(r.stack[0])[5];window.fixtureTrace=[];E.on('step',type=>fixtureTrace.push(type));E.play();
  await new Promise(resolve=>setTimeout(resolve,180));
  return {keys:Object.keys(st),trace:fixtureTrace.slice(),text:document.querySelector('.se-txt').textContent,expected:E.narr(st.n).main,log:r.log.map(x=>x.main),pic:r.pic,stack:E.snapshot().stack};
 });
 if(without){
  assert.deepStrictEqual(picture.trace.slice(0,2),['pic','say']);assert(picture.text.includes('To Tom.'));assert(!picture.log.some(x=>x.includes('Nell returns to pour it')));
  assert.deepStrictEqual(errors,[]);console.log(JSON.stringify({pass:true,reproduced:'pic-first narration skipped by native typeOf',picture,jsErrors:errors},null,2));
  await browser.close();server.close();return;
 }
 assert.strictEqual(picture.trace[0],'n');assert.strictEqual(picture.text,picture.expected);assert.strictEqual(picture.pic,'cg-fergus-toast');assert.strictEqual(picture.log.length,1);
 const lineScan=await page.evaluate(async()=>{
  const E=StoryEngine;E.stop();await E.loadUpTo(6);let total=0,bad=0;const seen=new WeakSet();
  const walk=x=>{if(!x||typeof x!=='object'||seen.has(x))return;seen.add(x);if('pic'in x&&['n','say','think'].some(k=>k in x)){total++;if(Object.keys(x).find(k=>E.mech[k])==='pic')bad++;}Object.values(x).forEach(walk);};
  ['nodes','places','talks','events'].forEach(k=>walk(E.S()[k]));const before=E.btLineOrder.count();E.btLineOrder.normalize(E.S());return {total,bad,reordered:before,idempotent:E.btLineOrder.count()===before};
 });
 assert.strictEqual(lineScan.bad,0);assert.strictEqual(lineScan.idempotent,true);
 await page.mouse.click(20,20); // real user activation for browser media policy
 await page.evaluate(async()=>{StoryEngine.stop();await StoryEngine.sound.ctx().resume();StoryEngine.amb('sea');window.phonePlayer=StoryEngine.sfx('phone');});
 await page.waitForFunction(()=>phonePlayer?.a.readyState>=2&&phonePlayer.a.currentTime>.08);
 const phone=await page.evaluate(()=>({src:phonePlayer.a.currentSrc,duration:phonePlayer.a.duration,paused:phonePlayer.a.paused,context:StoryEngine.sound.ctx().state}));
 assert(phone.src.endsWith('bt-sfx-phone.mp3'));assert(phone.duration>2.9&&phone.duration<3.1);assert.strictEqual(phone.paused,false);assert.strictEqual(phone.context,'running');
 const duck=await page.evaluate(()=>{const E=StoryEngine;const normal=E.sound.state();E.duck(true);const lower=E.sound.state();E.amb('hut');const changed=E.sound.state();E.duck(false);const restored=E.sound.state();return {normal,lower,changed,restored};});
 assert.strictEqual(duck.normal.file,true);assert(Math.abs(duck.lower.target/duck.normal.target-.3)<1e-8);assert.strictEqual(duck.changed.file,true);assert.strictEqual(duck.changed.ducked,true);assert.strictEqual(duck.restored.ducked,false);
 assert.strictEqual(duck.normal.ambLevel,.65);assert.strictEqual(duck.normal.sfxLevel,.7);
 await page.evaluate(()=>{phonePlayer.stop(.02);window.bellPlayer=StoryEngine.sfx('bell');});
 await page.waitForFunction(()=>bellPlayer?.a.readyState>=2&&bellPlayer.a.currentTime>.05);
 const bell=await page.evaluate(()=>({src:bellPlayer.a.currentSrc,duration:bellPlayer.a.duration}));assert(bell.src.endsWith('bt-sfx-bell.mp3'));assert(bell.duration>3.9&&bell.duration<4.1);
 // The 20-second hut loop must launch its second real media player before the first ends.
 await page.waitForFunction(()=>audioMade.filter(a=>a.currentSrc.includes('bt-amb-hut.mp3')).length>=2,undefined,{timeout:23000});
 const loop=await page.evaluate(()=>{const players=audioMade.filter(a=>a.currentSrc.includes('bt-amb-hut.mp3'));const E=StoryEngine;E.G().set.ambLevel=0;E.sound.refresh();const muted=E.sound.state();E.emit('step','n',{});const preserved=E.G().set.ambLevel;E.ambStop();return {players:players.map(a=>({time:a.currentTime,duration:a.duration,ready:a.readyState})),muted:muted.target,preserved,errors:audioErrors};});
 assert(loop.players.length>=2);assert.strictEqual(loop.muted,0);assert.strictEqual(loop.preserved,0);assert.deepStrictEqual(loop.errors,[]);assert.deepStrictEqual(errors,[]);
 console.log(JSON.stringify({pass:true,engine:'supplied v093',picture,lineScan,phone,bell,duckingRatio:duck.lower.target/duck.normal.target,ambienceCrossfade:loop,jsErrors:errors.length},null,2));
 await browser.close();server.close();
})().catch(async e=>{console.error(e);await activeBrowser?.close();server.close();process.exitCode=1;});
