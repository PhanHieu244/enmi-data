/* Vale 0.9: authored staging and wide narration, using the existing cast/art.
 * No text, branch arrays, evidence grants, or saved interpreter paths change.
 * Presence comes from Vale 0.8's authored context, never a name in narration.
 */
(() => {
  'use strict';
  const E = StoryEngine, V = ValeDemo, q = s => document.querySelector(s);
  const enabled = () => /^vale-dossiers(?:-|$)/.test(E.S()?.id || '');
  const context = () => V.v8Debug?.().context;
  const at = (S, node, path) => path.reduce((v, k) => v?.[k], S.nodes?.[node]);
  const actor = (id, at = 'l', face) => ({ id, at, ...(face === undefined ? {} : { face }) });

  // Exact authoring anchors. A show on the narrated entrance also repairs a
  // resumed save at that line; the following dialogue does not invent anyone.
  const entrances = [
    ['c1_open', [3], 'reed', [actor('reed')]],
    ['c1_open', [9], 'reed', [actor('reed')]],
    ['c1_open', [15, 'place', 'views', 'desk', 'zones', 0, 'then', 2], null, [actor('reed')]],
    ['c1_open', [15, 'place', 'views', 'desk', 'zones', 1, 'then', 2], 'reed', [actor('reed')]],
    ['c1_open', [15, 'place', 'views', 'desk', 'zones', 1, 'then', 3], null, [actor('reed')]],
    ['c1_open', [15, 'place', 'views', 'desk', 'zones', 2, 'then', 2], null, [actor('reed')]],
    ['c1_arrival', [6], 'reed', [actor('reed')]],
    ['c1_terms', [9], 'reed', [actor('reed')]],
    ['c1_terms', [13], 'reed', [actor('reed')]],
    ['c1_departure', [4], 'reed', [actor('reed')]],
    ['c1_departure', [5], null, [actor('reed')]],
    ['c1_departure', [7], null, [actor('reed')]],
    ['c1_observe', [1], 'reed', [actor('reed')]],
    ['c1_observe', [3], null, [actor('reed')]],
    ['c1_observe', [7], null, [actor('reed')]],
    ['c1_direct', [2], null, [actor('reed')]],
    ['c1_neighbourhood', [15], null, [actor('reed')]],
    ['c1_neighbourhood', [20], null, [actor('reed')]],
    ['c2_call', [20], null, [actor('reed')]],
    ['c2_call', [23], 'reed', [actor('reed')]],
    ['c3_open', [49], 'reed', [actor('reed')]],
    ['c3_open', [50], null, [actor('reed')]],
    ['c3_board', [6], 'reed', [actor('reed')]],
    ['c3_open', [12, 'choice', 1, 'then', 2], null, [actor('reed')]],
    ['c4_open_explore', [0, 'explore', 'spots', 0, 'then', 2], null, [actor('hart', 'r')], true],
    ['c4_open_explore', [0, 'explore', 'spots', 1, 'then', 1], null, [actor('celia', 'r')], true],
    ['c4_exit', [8], 'reed', [actor('reed')]],
    ['c6_open_file', [1], null, [actor('bell', 'r')]],
    ['c6_visit', [10, 'explore', 'spots', 2, 'then', 2], null, [actor('bell', 'r')], true],
    ['p2c1_open', [15, 'then', 1], null, [actor('lydia', 'r')]],
    ['p2c1_open', [16, 'then', 0], null, [actor('lydia', 'r')]],
    ['p2c3_open', [4], 'rusk', [actor('reed'), actor('lydia', 'r'), actor('rusk', 'c')]],
    ['p2c3_open', [13], null, [actor('lydia', 'r')]],
    ['p2c3_open', [15], null, [actor('lydia', 'r')]],
    ['p2c3_open', [17], null, [actor('lydia', 'r')]],
    ['p2c3_open', [29], 'reed', [actor('reed'), actor('lydia', 'r')]],
    ['p2c3_open', [31], null, [actor('lydia', 'r')]],
    ['p2c3_open', [33], 'lydia', [actor('lydia', 'r')]],
    ['p2c3_open', [34], null, [actor('lydia', 'r')]],
    ['p2c4_open', [4], 'reed', [actor('reed')]],
    ['p2c4_open', [8], 'reed', [actor('reed'), actor('lydia', 'r')]],
    ['p2c4_open', [9], null, [actor('lydia', 'r')]],
    ['p2c4_open', [12, 'explore', 'spots', 2, 'then', 1], null, [actor('reed')], true],
    ['p2c5_withdraw', [6], 'reed', [actor('reed')]],
    ['p2c5_withdraw', [7], null, [actor('reed')]],
    ['p2c5_intervene', [5], 'rusk', [actor('reed'), actor('rusk', 'r')]],
    ['p2c5_intervene', [12], null, [actor('reed')]],
    ['p2c6_after_true', [7], 'reed', [actor('reed')]],
    ['p3c1_open', [21, 'then', 0], null, [actor('nora', 'r')]],
    ['p3c2_open', [10], 'reed', [actor('reed')]],
    ['p3c2_open', [12], null, [actor('reed')]],
    ['p3c2_open', [26], null, [actor('reed')]],
    ['p3c2_open', [29], null, [actor('reed')]],
    ['p3c2_open', [31], 'reed', [actor('reed')]],
    ['p3c2_open', [34], 'reed', [actor('reed')]],
    ['p3c2_open', [37], null, [actor('reed')]],
    ['p3c3_open', [14], 'ben', [actor('ben', 'r'), actor('reed')]],
    ['p3c3_open', [16], null, [actor('ben', 'r')]],
    ['p3c3_open', [18], 'ben', [actor('ben', 'r')]],
    ['p3c3_open', [12, 'then', 0], null, [actor('nora', 'r')]],
    ['p3c3_open', [29, 'choice', 1, 'then', 2], null, [actor('reed')]],
    ['p3c4_open', [8, 'explore', 'spots', 0, 'then', 2], null, [actor('reed')], true],
    ['p3c4_open', [21], 'reed', [actor('reed')]],
    ['p3c4_open', [25], null, [actor('reed')]],
    ['p3c5_supported', [3], null, [actor('dorn', 'r')]],
    ['p3c5_accuse', [1], null, [actor('reed')]],
    ['p3c5_wrong_route', [1], null, [actor('dorn', 'r')]],
    ['p3c4_open', [37], 'reed', [actor('reed')]],
    ['p3c4_open', [38], null, [actor('reed')]],
    ['p3c4_open', [40], 'reed', [actor('reed')]],
    ['p3c5_late_route', [3], 'elin', [actor('elin', 'r')]],
    ['p3c5_late_route', [4], null, [actor('elin', 'r')]],
    ['p3c5_wrong_route', [5], 'reed', [actor('reed')]],
    ['p3c5_wrong_route', [6], null, [actor('reed')]]
  ];

  // Focus an already-staged actor during their action. These are not triggers
  // for spawning a person mentioned in a letter, recollection or distant view.
  const focus = [
    ['c1_arrival', [10], 'matthias'],
    ['c1_account', [6], 'reed'],
    ['c1_account', [13], 'matthias'],
    ['c1_account', [18], 'reed'],
    ['c2_call', [6], 'celia'],
    ['c3_open', [33], 'hart'],
    ['c3_open', [41], 'celia'],
    ['p2c3_open', [21], 'lydia'],
    ['p2c4_open', [14], 'ruth'],
    ['p2c4_open', [18], 'ruth'],
    ['p2c4_open', [28], 'owen'],
    ['p2c4_open', [37], 'lydia'],
    ['p2c5_watch', [3], 'reed'],
    ['p3c1_open', [8], 'elin'],
    ['p3c2_open', [22], 'dorn'],
    ['p3c3_open', [22], 'elin'],
    ['p3c3_open', [30], 'ben'],
    ['p3c3_open', [33], 'ben'],
    ['p3c4_open', [12], 'nora'],
    ['p3c4_open', [17], 'nora'],
    ['p3c4_open', [30], 'elin']
  ];

  function install() {
    if (!enabled()) return;
    const S = E.S();
    S.visualContinuity = true;
    for (const [node, path, who, show, clearInspection] of entrances) {
      const st = at(S, node, path);
      if (!st || !(st.n || st.say || st.think)) continue;
      st.valePresence = { ...(st.valePresence || {}), show };
      // A companion answers while a detail inspection is suspended. The
      // native explore handler retains xpDetail and restores it on return.
      if (clearInspection) { st.look = null; st.actionFrame = null; }
      if (who && st.n) st.on = who;
      // Motion side-effects run before the later presence side. Opt in only
      // these explicitly authored entrances so an existing expression cue can
      // act on the same actor from its first frame.
      for (const a of st.motion?.actors || []) {
        if (show.some(x => x.id === a.id) && !a.hide) a.show = true;
      }
    }
    for (const [node, path, who] of focus) {
      const st = at(S, node, path); if (st?.n) st.on = who;
    }
    // The gate action is over before Reed comments; the return walk really
    // moves back onto the moor. Keeping the shot here hid every later speaker.
    const gateReply = at(S, 'p3c2_open', [26]);
    if (gateReply) {
      delete gateReply.shot;
      gateReply.scene = 'p3_dorn_gate_closed'; gateReply.look = null;
      gateReply.valePresence = { ...gateReply.valePresence, hide: ['dorn'] };
    }
    const returnWalk = at(S, 'p3c2_open', [28]);
    if (returnWalk) { delete returnWalk.shot; returnWalk.scene = 'p3_moor'; returnWalk.look = null; }
  }

  E.side('valePresence', async p => {
    if (!enabled() || !p) return;
    const a = context();
    for (const id of p.hide || []) E.ui.hide(id);
    for (const c of p.show || []) {
      if (!a?.present.includes(c.id) || a.remote?.[c.id] || !E.S().chars[c.id]) continue;
      const old = E.R().cast?.[c.id];
      E.ui.show(c.id, old?.at || c.at || 'l', c.face === undefined ? old?.face || '' : c.face);
    }
  });

  function restoreFocus() {
    const root = q('.se');
    if (root && enabled()) { root.dataset.stage = E.S().stage || 'focus'; root.classList.remove('v9-narration'); }
  }
  let layoutFrame = 0;
  function frameNarration() {
    cancelAnimationFrame(layoutFrame);
    layoutFrame = requestAnimationFrame(() => {
      const root = q('.se'), box = q('.se-box');
      if (!root?.classList.contains('v9-narration') || !box || box.hidden) return;
      const rr = root.getBoundingClientRect();
      const bars = [q('.se-top'), q('.v8-contextbar')].filter(el => el && !el.hidden && getComputedStyle(el).display !== 'none');
      const top = Math.max(0, ...bars.map(el => el.getBoundingClientRect().bottom - rr.top)) + 8;
      root.style.setProperty('--v9-cast-top', top + 'px');
      // The dialogue's entrance translates its paint box for a few frames.
      // Use its stable layout top so the final text cannot cover the portrait.
      const boxTop = box.offsetParent === root ? box.offsetTop : box.getBoundingClientRect().top - rr.top;
      const bottom = Math.max(0, root.clientHeight - boxTop) + 6;
      root.style.setProperty('--v9-cast-bottom', bottom + 'px');
      const a = context(), ids = new Set((a?.present || []).filter(id => !a.remote?.[id]));
      const cast = [...root.querySelectorAll('.se-ch')].filter(el => E.R().cast?.[el.dataset.id] && ids.has(el.dataset.id) && !el.classList.contains('out'));
      const slots = {1:[50],2:[28,72],3:[18,50,82],4:[12,38,62,88]}[Math.min(4,cast.length)] || [];
      cast.forEach((el,i) => { el.style.setProperty('--v9-left',(slots[i] ?? 50)+'%'); el.style.setProperty('--v9-width',(cast.length<2?90:cast.length===2?54:cast.length===3?36:25)+'%'); });
    });
  }
  const originalLine = E.ui.line;
  E.ui.line = line => {
    if (enabled()) {
      const R = E.R(), a = context(), root = q('.se');
      const present = new Set((a?.present || []).filter(id => !a?.remote?.[id]));
      // Place exploration clears native sprites, including a companion who
      // may speak inside a named topic. The talk handler also hides its owner
      // before the farewell branch. Restore only an explicitly present live
      // conversation speaker, never a quoted/remote voice or baked action.
      const who = line.who;
      if ((line.kind || 'say') === 'say' && who && who !== 'me' &&
          a?.conversationWith && present.has(who) && E.S().chars[who] &&
          !R.shot && !R.cg && !R.actionFrame &&
          (!R.cast?.[who] || !root?.querySelector('.se-ch[data-id="' + CSS.escape(who) + '"]'))) {
        const active = V.active;
        const step = active ? E.walk({n: active.n, p: JSON.parse(active.p)})?.[active.i] : null;
        E.ui.show(who, R.cast?.[who]?.at || (who === a.conversationWith ? 'c' : 'l'), step?.face || R.cast?.[who]?.face || '');
      }
      for (const el of root?.querySelectorAll('.se-ch') || []) {
        el.classList.toggle('v9-out-of-scene', !!a && !present.has(el.dataset.id));
      }
      const wide = !R.shot && !R.cg && !R.look && !R.actionFrame && !R.vw;
      const ensemble = a && wide && !line.on && /^(n|think)$/.test(line.kind) &&
        Object.keys(R.cast || {}).some(id => present.has(id));
      if (root) {
        root.dataset.stage = ensemble ? 'ensemble' : E.S().stage || 'focus';
        root.classList.toggle('v9-narration', !!a && wide && /^(n|think)$/.test(line.kind) && Object.keys(R.cast || {}).some(id => present.has(id)));
      }
    }
    const pending = originalLine(line); frameNarration(); return pending;
  };

  E.on('boot', () => {
    if (!enabled()) return;
    const style = document.createElement('style');
    style.dataset.valeContinuity = 'v09';
    style.textContent = `
      .se.vd .se-ch.v9-out-of-scene{visibility:hidden!important;pointer-events:none!important}
      .se.vd.v9-narration .se-chars{top:var(--v9-cast-top,140px);bottom:var(--v9-cast-bottom,250px)}
      .se.vd.v9-narration .se-chars .se-ch{height:100%;bottom:0;transform:translateX(-50%)!important;transform-origin:50% 100%}
      .se.vd.v9-narration[data-stage="ensemble"] .se-chars .se-ch{left:var(--v9-left,50%)!important;width:var(--v9-width,70%)!important;max-width:none;filter:brightness(.94) saturate(.98)}
      @media(max-height:660px) and (max-aspect-ratio:1/1){
        .se.vd.v9-narration .se-box{max-height:min(50dvh,calc(100dvh - var(--v9-cast-top,140px) - 176px))}
      }`;
    document.head.append(style);
    const resize = new ResizeObserver(frameNarration);
    for (const el of [q('.se'), q('.se-box'), q('.se-top'), q('.v8-contextbar')]) if (el) resize.observe(el);
    install(); queueMicrotask(install);
  });
  E.on('chapter', () => { install(); queueMicrotask(install); });
  E.on('step', type => { if (!/^(n|think)$/.test(type)) restoreFocus(); });
  E.on('end', restoreFocus);
  const reset = E.ui.reset;
  E.ui.reset = (...args) => { restoreFocus(); return reset(...args); };
  V.v9Continuity = () => ({ enabled: enabled(), stage: q('.se')?.dataset.stage,
    context: context(), authoredAnchors: entrances.length + focus.length });
})();
