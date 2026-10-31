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
const passages=[['You write the limits on a fresh sheet','pen_write'],['He signs. The signature is impatient','pen_write'],['Reed finds the maker in a trade directory.','paper_fold'],['You draw the curtain just far enough','cloth_move'],['Inside, Reed turns a fresh page.','paper_fold'],['You wrap the frame in clean paper.','paper_fold'],['Lydia opens her bag and takes out a folded note.','paper_open'],['When Lydia rises, she leaves the note on your desk','paper_slide'],['She folds the copy along its old crease.','paper_fold'],['She hands you a second note.','paper_slide'],['Later, the starting bell','bell_soft']];
function walk(v,fn){if(!v||typeof v!=='object')return;fn(v);for(const[k,x]of Object.entries(v))if(!['motion','interrogation'].includes(k))walk(x,fn);}
function apply(){const S=E.S();if(!S?.id?.startsWith('vale-dossiers'))return;const g=E.G().set;if(!Number.isFinite(g.ambLevel))g.ambLevel=.65;if(!Number.isFinite(g.sfxLevel))g.sfxLevel=.70;
 for(const[id,sc]of Object.entries(S.scenes||{}))if(sc.amb==='rain'&&(['study','hall','room'].includes(sc.kind)||id==='carriage'))sc.amb='rainInside';
 for(const tree of[S.nodes,S.places,S.talks])walk(tree,st=>{const list=cues[st.motion?.id];if(list)st.motion.sounds=list.map(([at,cue])=>({at,cue}));const text=typeof st.n==='string'?st.n:st.n?.en;const hit=text&&passages.find(([prefix])=>text.startsWith(prefix));if(hit&&!st.motion?.sounds?.length)st.foley=hit[1];});E.sound.refresh?.();}
const later=()=>queueMicrotask(apply);E.on('boot',later);E.on('chapter',later);
})();
