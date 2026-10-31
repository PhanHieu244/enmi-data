/* Physical sound direction; no prose/branch/array changes. */
(() => {'use strict';const E=StoryEngine;
const cues={
'p1-c1-note-first':[[.18,'paper_open']], 'p1-c1-note-again':[[.20,'paper_slide']], 'p1-c1-note-set-down':[[.6,'paper_down']],
'p1-c1-remove-mask':[[.34,'cloth_move']], 'p1-c1-retainer-set-aside':[[.05,'coin_purse'],[.55,'cloth_move']], 'p1-c1-gloves-observed':[[.5,'cloth_move']], 'p1-c1-finn-cab-departs':[[.35,'horse_steps']],
'p1-c1-door-chain-opens':[[.30,'chain_latch'],[.45,'door_move']], 'p1-c1-door-wait':[[.60,'door_move']], 'p1-c1-invitation-handover':[[.20,'door_move'],[.48,'paper_fold']], 'p1-c1-door-final-close':[[.60,'door_move']],
'p1-c3-register-signed':[[.08,'pen_write']], 'p1-c4-frame-revealed':[[.25,'cabinet_slide']], 'p1-c4-frame-protected':[[.25,'cabinet_slide']], 'p1-c4-panel-closed':[[.65,'wood_down']], 'p1-c4-panel-returned':[[.65,'wood_down']], 'p1-c4-panel-taken':[[.35,'cabinet_slide'],[.75,'cloth_move']],
'p1-c5-cab-departs':[[.32,'horse_steps']], 'p1-c5-bell-receives-frame':[[.23,'chain_latch'],[.55,'frame_slide']], 'p1-c6-photo-face-down':[[.56,'wood_down']], 'p1-c6-photo-into-case':[[.55,'cloth_move']], 'p1-c6-empty-recess':[[.22,'cabinet_slide'],[.78,'wood_down']],
'p2-v06-correspondence-set-down':[[.8,'paper_down']], 'p2-v06-shutter-test':[[.27,'wood_down'],[.76,'door_move']], 'p2-v06-carrier-heel':[[.5,'frame_slide']],
'p3-v06-outer-gate':[[.40,'gate_latch']], 'p3-v06-observed-bark':[[.38,'dog_bark'],[.66,'dog_bark']], 'p3-v06-door-sound-check':[[.28,'door_move']], 'p3-v06-private-letters-stored':[[.48,'cabinet_slide']], 'p3-v06-horse-forehead':[[.5,'cloth_move']]};
// Stable authored paths: shortening or translating a line must never silence it.
// A motion's timed sounds take precedence over the fallback line-level foley.
const passageCues={
 'vale-dossiers-p1c1-v01':[
  [['nodes','c1_terms',3,'choice',0,'then',0],'pen_write'],
  [['nodes','c1_terms',3,'choice',0,'then',3],'pen_write'],
  [['nodes','c1_open',15,'place','views','desk','zones',1,'then',2],'paper_fold'],
  [['nodes','c1_open',15,'place','views','window','zones',0,'then',1],'cloth_move'],
  [['nodes','c1_open',15,'place','views','door','zones',0,'then',1],'paper_fold'],
  [['nodes','c5_possession',3,'then',1,'choice',1,'then',3],'paper_fold']
 ],
 'vale-dossiers-part2-v01':[
  [['nodes','p2c1_open',17],'paper_open'],
  [['nodes','p2c1_open',32],'paper_slide'],
  [['nodes','p2c6_open',14],'paper_fold']
 ],
 'vale-dossiers-part3-v01':[
  [['nodes','p3c4_open',17],'paper_slide'],
  [['nodes','p3c5_true_route',7],'bell_soft']
 ]
};
passageCues['vale-dossiers-chapter1-demo03']=passageCues['vale-dossiers-p1c1-v01'];
const at=(value,path)=>path.reduce((v,key)=>v?.[key],value);
function walk(v,fn){if(!v||typeof v!=='object')return;fn(v);for(const[k,x]of Object.entries(v))if(!['motion','interrogation'].includes(k))walk(x,fn);}
function apply(){const S=E.S();if(!S?.id?.startsWith('vale-dossiers'))return;const g=E.G().set;if(!Number.isFinite(g.ambLevel))g.ambLevel=.65;if(!Number.isFinite(g.sfxLevel))g.sfxLevel=.70;
 for(const[id,sc]of Object.entries(S.scenes||{}))if(sc.amb==='rain'&&(['study','hall','room'].includes(sc.kind)||id==='carriage'))sc.amb='rainInside';
 for(const tree of[S.nodes,S.places,S.talks])walk(tree,st=>{const list=cues[st.motion?.id];if(list)st.motion.sounds=list.map(([at,cue])=>({at,cue}));});
 for(const[path,cue]of passageCues[S.id]||[]){const st=at(S,path);if(!st)continue;if(st.motion?.sounds?.length){if(st.foley===cue)delete st.foley;}else st.foley=cue;}
 E.sound.refresh?.();}
const later=()=>queueMicrotask(apply);E.on('boot',later);E.on('chapter',later);
})();
