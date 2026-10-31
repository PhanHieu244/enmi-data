/* Original WebAudio foley. motion.sounds follows action progress. No external samples. */
(() => {'use strict';
const E=StoryEngine,cache=new Map(),active=new Set();
const recipes={
paper_open:[[0,.20,.22,'paper',1800],[.13,.29,.28,'paper',2400],[.38,.25,.15,'paper',1200]],
paper_fold:[[0,.27,.20,'paper',1600],[.20,.32,.18,'paper',2100]],paper_slide:[[0,.34,.16,'paper',1100]],paper_down:[[0,.16,.15,'paper',900],[.05,.08,.055,'wood',170]],
pen_write:[[0,.16,.09,'scratch',2500],[.18,.15,.08,'scratch',2000],[.37,.22,.08,'scratch',2300]],cloth_move:[[0,.42,.14,'cloth',450]],chain_latch:[[0,.12,.11,'metal',1550],[.13,.15,.09,'metal',2150]],
door_move:[[0,.39,.10,'cloth',250],[.32,.16,.09,'wood',130]],wood_down:[[0,.18,.12,'wood',150]],coin_purse:[[0,.20,.11,'cloth',400],[.06,.20,.07,'metal',2900]],frame_slide:[[0,.35,.12,'cloth',600],[.28,.13,.08,'wood',220]],
wax_press:[[0,.16,.08,'wood',210],[.12,.16,.07,'cloth',700]],cabinet_slide:[[0,.43,.12,'cloth',360],[.36,.16,.08,'wood',130]],gate_latch:[[0,.19,.09,'metal',850],[.17,.20,.12,'wood',110]],cup_down:[[0,.20,.07,'metal',1800]],
horse_steps:[[0,.12,.10,'wood',190],[.20,.11,.08,'wood',240],[.47,.11,.07,'wood',190],[.68,.11,.05,'wood',240]],dog_bark:[[0,.25,.12,'bark',145]],bell_soft:[[0,.9,.045,'metal',880]]};
function samples(a,key){
 const ck=a.sampleRate+':'+key;if(cache.has(ck))return cache.get(ck);
 const pulses=recipes[key],seconds=Math.max(...pulses.map(p=>p[0]+p[1]))+.025,b=a.createBuffer(1,Math.ceil(seconds*a.sampleRate),a.sampleRate),d=b.getChannelData(0);
 let seed=[...key].reduce((v,c)=>(v*31+c.charCodeAt(0))>>>0,29),low=0,previous=0;
 for(let i=0;i<d.length;i++){
  seed^=seed<<13;seed^=seed>>>17;seed^=seed<<5;
  const white=(seed>>>0)/2147483648-1,t=i/a.sampleRate;low=low*.93+white*.07;let value=0;
  for(const[start,dur,level,material,f]of pulses){
   const u=(t-start)/dur;if(u<0||u>1)continue;
   const env=Math.min(1,u/.06)*Math.pow(1-u,['wood','metal'].includes(material)?3:1.1);let texture;
   if(material==='paper')texture=(white-previous*.6)*(.35+.65*Math.abs(Math.sin((t-start)*f*.11)));
   else if(material==='scratch')texture=(white-low)*(.25+.75*Math.abs(Math.sin(t*92)));
   else if(material==='wood')texture=Math.sin(2*Math.PI*f*(t-start))*Math.exp(-u*8)+low*.4;
   else if(material==='metal')texture=(Math.sin(2*Math.PI*f*(t-start))+.4*Math.sin(2*Math.PI*f*2.71*(t-start)))*.5;
   else if(material==='bark'){const phase=2*Math.PI*(f*(t-start)-30*(t-start)**2);texture=(.44*Math.sin(phase)+.23*Math.sin(3*phase)+.12*Math.sin(5*phase)+white*.21)*Math.sin(Math.PI*u);}
   else texture=low*3;
   value+=texture*level*env;
  }
  previous=white;d[i]=Math.max(-.4,Math.min(.4,value));
 }
 cache.set(ck,b);return b;
}
function play(key){
 const a=E.sound.ctx();if(!a)return;
 const s=a.createBufferSource(),g=a.createGain();s.buffer=samples(a,key);g.gain.value=E.sound.level('sfx')*(E.voice?.busy ? .62 : 1);s.connect(g).connect(a.destination);let stopped=false;
 const h={cue:key,stop(seconds=.04){if(stopped)return;stopped=true;const t=a.currentTime;g.gain.cancelScheduledValues(t);g.gain.setTargetAtTime(.0001,t,Math.max(.003,seconds/3));try{s.stop(t+Math.max(.01,seconds));}catch{}}};
 active.add(h);s.onended=()=>{active.delete(h);try{s.disconnect();g.disconnect();}catch{}};s.start();E.emit('foley-play',{cue:key,duration:s.buffer.duration,gain:g.gain.value});return h;
}
for(const key of Object.keys(recipes))E.SFX[key]=()=>play(key);
E.sound.foleyCatalog=()=>Object.keys(recipes);
E.sound.stopFoley=()=>{for(const h of active)h.stop();};
E.sound.foleyState=()=>({active:[...active].map(h=>h.cue),cached:cache.size});
E.sound.foleySamples=key=>{const a=E.sound.ctx();return a&&recipes[key]?samples(a,key):null;};
E.side('foley',(v,st,c)=>{const cue=typeof v==='string'?v:v?.cue;if(!cue)return;const k=c.key('foley',cue),used=E.R().used||={};if(used[k]&&v?.repeat!==true)return;used[k]=true;const h=E.sfx(cue);c.onExit?.(()=>h?.stop?.(.04));});
E.on('boot',()=>E.sound.stopFoley());
document.addEventListener('visibilitychange',()=>{if(document.hidden)E.sound.stopFoley();});
})();
