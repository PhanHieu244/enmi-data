/* Story-owned inspection polish. No new mechanic, logical step or save field.
 * Native focus owns camera return/save. Existing bt-d4-actions owns decoded
 * pending artwork, opt-in, ?auto, cancellation and native detail continuation.
 */
(() => {
  'use strict';
  const E = globalThis.StoryEngine, D = globalThis.BT_D4_INSPECTION_DATA;
  if (typeof document === 'undefined' || !E?.plugin || !D || E.plugins?.['bt-d4-inspection']) return;
  const ours = () => E.S()?.id === 'between-tides';
  const resolve = path => path.split('.').reduce((v, k) => v?.[k], E.S());
  const assignedFocus = new WeakSet(), assignedArt = new WeakMap();
  let observed = null, observer = null, scheduled = false, hovered = null;

  function install() {
    if (!ours()) return;
    for (const entry of D.hitRegions) {
      const zone = resolve(entry.path); if (!zone) continue;
      E.regions({ [entry.image]: { r: { [entry.name]: [...entry.box] } } });
      zone.r = entry.name; zone.inspectR = entry.inspectR;
    }
    for (const entry of D.focus) {
      const st = resolve(entry.path);
      // Existing authored shots/looks/inserts retain their intended framing.
      if (!st || !['n', 'think', 'say'].some(k => k in st) || 'look' in st || st.shot || st.overlay) continue;
      if (!st.focus || assignedFocus.has(st)) {
        st.focus = { r: Array.isArray(entry.r) ? [...entry.r] : entry.r, scale: 1.4, ms: 550, returnMs: 350 };
        assignedFocus.add(st);
      }
    }
    for (const entry of D.closeups) {
      const st = resolve(entry.path); if (!st) continue;
      const key = entry.mode === 'read' ? 'readArt' : 'art';
      const previous = assignedArt.get(st);
      if (E.btD4?.enabled?.()) {
        const data = st.btD4 ||= {};
        // Another authored insert/action remains the owner if it already
        // selected different art. Never replace approved source overlays.
        if (!st.overlay && (!data[key] || data[key] === entry.id)) {
          data[key] = entry.id; assignedArt.set(st, { key, id: entry.id });
        }
      } else if (previous && st.btD4?.[previous.key] === previous.id) {
        delete st.btD4[previous.key]; assignedArt.delete(st);
      }
    }
    observe(); schedule();
  }

  function label(target) {
    return target?.getAttribute('aria-label') || target?.querySelector('.pz-l,.pp-n')?.textContent?.trim() || '';
  }
  function sync() {
    scheduled = false;
    const root = document.querySelector('.se'); if (!root || !ours()) return;
    if (!root.classList.contains('bt-d4-inspection')) root.classList.add('bt-d4-inspection');
    for (const b of root.querySelectorAll('.pz,.pp')) {
      const value = label(b); if (value && b.title !== value) b.title = value;
    }
    // The only direct <text> in this refuge SVG is the two-word sign. Numeric
    // evidence uses paths and MUST remain: archive, morning, last and gated
    // keeper rows, plus gauge ticks. Exact sign words remain in source prose.
    for (const node of root.querySelectorAll('.bt-refuge-svg > text')) {
      if (node.textContent.trim() === 'REFUGE BOX') node.dataset.btRefugeSign = 'caption';
    }
    // Debug wireframes are useful when an asset is absent. On a real painted
    // layer they are developer annotations, not diegetic labels or clues.
    for (const layer of root.querySelectorAll('.se-bgl[data-image]')) {
      const real = !!E.artReal?.('im-' + layer.dataset.image) && !E.wire;
      if (layer.classList.contains('bt-inspection-real') !== real) layer.classList.toggle('bt-inspection-real', real);
    }
    const panel = root.querySelector('.se-panel.pl,.se-panel.xp');
    if (!panel) { hovered = null; return; }
    let caption = panel.querySelector(':scope > .bt-inspection-caption');
    const focused = document.activeElement?.closest?.('.pz,.pp');
    const target = focused?.isConnected && root.contains(focused) ? focused : hovered?.isConnected && root.contains(hovered) ? hovered : null;
    // Native level two previously printed all unexamined names on the
    // painting. Keep that exact feedback level in the existing panel, without
    // selecting a correct clue or changing the shared hint algorithm.
    const hinted = [...root.querySelectorAll('.vbx.hint2 .pz:not(.seen)')].map(label).filter(Boolean);
    const value = label(target) || (hinted.length ? hinted.join(' · ') : '');
    if (!caption && value) {
      caption = document.createElement('div'); caption.className = 'bt-inspection-caption';
      caption.setAttribute('role', 'status'); caption.setAttribute('aria-live', 'polite');
      panel.prepend(caption);
    }
    if (caption) {
      if (caption.textContent !== value) caption.textContent = value;
      caption.hidden = !value;
    }
  }
  function schedule() {
    if (scheduled) return; scheduled = true; requestAnimationFrame(sync);
  }
  function observe() {
    const root = document.querySelector('.se'); if (!root || root === observed) return;
    observer?.disconnect(); observed = root;
    observer = new MutationObserver(schedule); observer.observe(root, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
    root.addEventListener('focusin', schedule);
    root.addEventListener('focusout', schedule);
    root.addEventListener('pointerover', e => { if (e.pointerType !== 'touch') { hovered = e.target.closest?.('.pz,.pp') || null; schedule(); } });
    root.addEventListener('pointerout', e => { if (hovered && !hovered.contains(e.relatedTarget)) { hovered = null; schedule(); } });
  }
  E.plugin({ id: 'bt-d4-inspection', on: { boot: install, chapter: install, step: schedule, 'image-plane': schedule } });
  E.btD4Inspection = Object.freeze({ install, sync, data: D,
    status: () => ({ version: D.version, focusEntries: D.focus.length, deferredPlaceFocus: D.deferredPlaceFocus.length, closeupBindings: D.closeups.length,
      optIn: !!E.btD4?.enabled?.(), autoBypassed: !!E.btD4?.automatic?.(),
      registered: D.closeups.filter(x => resolve(x.path)?.btD4?.[x.mode === 'read' ? 'readArt' : 'art'] === x.id).map(x => x.path),
    }),
  });
})();
