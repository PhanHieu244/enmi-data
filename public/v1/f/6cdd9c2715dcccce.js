/* Wait for native chapter stylesheets, including SDK-provided blob URLs.
 * bt-chapter-assets.css indexes only real packaged image IDs, so native core's
 * private hasArt cache cannot freeze an incomplete set during background loads.
 * Core still downloads the chapter, injects its script, merges data and owns R/G.
 */
(() => {
  'use strict';
  const E = globalThis.StoryEngine;
  if (!E?.plugin || E.plugins?.['bt-chapter-assets']) return;
  if (typeof document === 'undefined' && typeof E.S !== 'function') return;
  const nativeLoad = E.loadChapter;
  if (typeof nativeLoad !== 'function') throw Error('Between Tides chapter assets requires the native chapter loader');
  const states = new Map(), active = new Map(), sheets = new WeakMap();
  const list = () => [...document.head.querySelectorAll('link[rel="stylesheet"]')];
  const validSheet = sheet => {
    if (!sheet) return false;
    try {
      const rules = sheet.cssRules;
      if (!rules?.length) return false; // A 404 can still expose an empty sheet.
      let opaque = false;
      for (const rule of rules) if (rule.type === 3) {
        const imported = validSheet(rule.styleSheet);
        if (imported === false) return false;
        if (imported === null) opaque = true;
      }
      return opaque ? null : true;
    } catch {
      // Cross-origin CSS rules can be unreadable; a real load event is then
      // the readiness signal. A non-null .sheet alone is never sufficient.
      return null;
    }
  };
  const track = el => {
    if (sheets.has(el)) return sheets.get(el);
    let resolve;
    const record = { el, status: validSheet(el.sheet) === true ? 'loaded' : 'pending', promise: null, finish: null };
    record.promise = new Promise(r => { resolve = r; });
    const done = ok => {
      if (record.status !== 'pending') return;
      ok = ok && validSheet(el.sheet) !== false;
      record.status = ok ? 'loaded' : 'failed';
      el.removeEventListener('load', loaded); el.removeEventListener('error', failed);
      resolve(ok);
    };
    const loaded = () => done(true), failed = () => done(false);
    record.finish = done;
    sheets.set(el, record);
    if (record.status === 'loaded') resolve(true);
    else { el.addEventListener('load', loaded); el.addEventListener('error', failed); }
    return record;
  };
  const wait = async record => {
    if (record.status === 'failed') return false;
    if (record.status === 'loaded') return true;
    if (validSheet(record.el.sheet) === true) { record.finish(true); return true; }
    const timer = setTimeout(() => record.finish(false), 12000);
    try { return await record.promise; } finally { clearTimeout(timer); }
  };
  const retry = record => {
    if (record.status !== 'failed') return record;
    const next = record.el.cloneNode(false);
    const fresh = track(next);
    if (record.el.isConnected) record.el.replaceWith(next); else document.head.append(next);
    return fresh;
  };
  const notify = ch => E.ui.toast(E.esc(E.nat({
    en: `Chapter ${ch} artwork could not load. Your progress is kept. Try Continue again.`,
    vi: `Chưa nạp được hình chương ${ch}. Tiến độ vẫn được giữ. Hãy thử Tiếp tục lần nữa.`,
  })), 4500);
  E.loadChapter = function (ch) {
    if (E.S()?.id !== 'between-tides') return nativeLoad.call(this, ch);
    if (active.has(ch)) return active.get(ch);
    const state = states.get(ch) || { links: [], attempts: 0, ready: false };
    states.set(ch, state);
    if (state.ready) return Promise.resolve(true);
    const task = (async () => {
      const before = new Set(list());
      const again = state.attempts++ > 0;
      const ok = await nativeLoad.call(this, ch);
      // Native SDK downloads return blob URLs without changing the hidden
      // HTML href. Observe the links actually inserted by native loadChapter.
      for (const el of list()) if (!before.has(el) && !state.links.some(r => r.el === el)) state.links.push(track(el));
      if (!ok) return false;
      if (again) state.links = state.links.map(retry);
      const results = await Promise.all(state.links.map(wait));
      if (results.some(x => !x)) { notify(ch); return false; }
      state.ready = true;
      return true;
    })();
    active.set(ch, task);
    task.finally(() => { if (active.get(ch) === task) active.delete(ch); }).catch(() => {});
    return task;
  };
  E.plugin({ id: 'bt-chapter-assets', setup() {
    // Attach before load/error can fire, even when CSS finishes before JS.
    const observer = new MutationObserver(records => {
      for (const r of records) for (const el of r.addedNodes) if (el.nodeType === 1 && el.matches?.('link[rel="stylesheet"]')) track(el);
    });
    observer.observe(document.head, { childList: true });
  } });
  E.btChapterAssets = { status: ch => {
    const s = states.get(ch); return s ? { ready: s.ready, attempts: s.attempts, stylesheets: s.links.map(r => ({ href: r.el.href, status: r.status })) } : null;
  } };
})();
