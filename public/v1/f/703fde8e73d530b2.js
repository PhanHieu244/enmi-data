/* Between Tides d4. Optional story-owned art and gestures on shared 1.0.4.
 * Enable before boot: globalThis.BT_D4_ENABLED = true, or ?bt-d4=1.
 * No story-array insertion, inventory/flag writes, new save keys or core copy.
 * Asset absence and ?auto both fall through to the original native step.
 */
(() => {
  'use strict';
  if (typeof document === 'undefined' || typeof location === 'undefined') return;
  const E = globalThis.StoryEngine, D = globalThis.BT_D4_DATA;
  if (!E?.plugin || !D || E.plugins?.['bt-d4-actions']) return;
  if (typeof globalThis.BT_D4_ENABLED !== 'boolean') globalThis.BT_D4_ENABLED = new URLSearchParams(location.search).get(D.query) === '1';
  const ours = () => E.S()?.id === 'between-tides';
  const enabled = () => ours() && globalThis.BT_D4_ENABLED === true;
  const automatic = () => !!E.auto || new URLSearchParams(location.search).has('auto');
  const active = () => enabled() && !automatic();
  const $ = (s, r = document) => r.querySelector(s);
  const pair = (en, vi) => ({ en, vi });
  const copy = x => JSON.parse(JSON.stringify(x));
  const resolve = path => path.split('.').reduce((v, k) => v?.[k], E.S());
  const assets = new Map(), stats = { opened: [], completed: [], skipped: [], cancelled: [], missing: [], details: [], portraits: [], environments: [] };
  let current = null, lineOwner = null;
  const views = new Map();
  const assetURL = id => document.querySelector(`[data-bt-d4-art="${id}"]`)?.getAttribute('src') || new URL((/^r4b-/.test(id) ? 'img/d4b/' : D.assetBase) + id + '.webp', document.baseURI).href;
  const originalURL = id => {
    // The host SDK can rewrite native CSS URLs to blob/CDN assets. Reuse that
    // actual resource for approved end frames instead of guessing its path.
    const probe = document.createElement('i'); probe.className = 'im-' + id; probe.hidden = true;
    document.body.appendChild(probe); const cssURL = getComputedStyle(probe).backgroundImage; probe.remove();
    if (cssURL?.startsWith('url(') && cssURL.endsWith(')')) return cssURL.slice(4, -1).replace(/^["']|["']$/g, '');
    return new URL('img/' + id + '.webp', document.baseURI).href;
  };
  const isNew = id => /^r(?:3|4|4b)-/.test(id);
  const sourceURL = id => isNew(id) ? assetURL(id) : originalURL(id);

  // Register CSS only after a real image decoded; missing files never become
  // artReal/hasArt positives. The native detail renderer owns image continuation.
  function ensureAsset(id) {
    if (!id) return Promise.resolve(null);
    const old = assets.get(id); if (old) return old.promise;
    const entry = { id, status: 'loading', url: sourceURL(id) };
    entry.promise = new Promise(resolvePromise => {
      const img = new Image(); let settled = false;
      const finish = ok => {
        if (settled) return; settled = true; clearTimeout(timer);
        img.onload = img.onerror = null;
        if (!ok || !img.naturalWidth || !img.naturalHeight) {
          entry.status = 'missing'; stats.missing.push(id); return resolvePromise(null);
        }
        // Retain URL/dimensions, not 48 decoded Image objects across chapters.
        entry.status = 'ready'; entry.size = [img.naturalWidth, img.naturalHeight];
        if (isNew(id)) {
          const style = document.createElement('style'); style.dataset.btD4ArtStyle = id;
          style.textContent = `.im-${id}{background-image:url(${JSON.stringify(entry.url)})!important}`;
          document.head.appendChild(style);
          E.regions?.({ [id]: { size: entry.size, fit: 'contain', r: {} } });
        }
        resolvePromise(entry);
      };
      const timer = setTimeout(() => { finish(false); img.src = ''; }, 6500);
      img.onload = () => { if (img.decode) img.decode().then(() => finish(true), () => finish(false)); else finish(true); };
      img.onerror = () => finish(false); img.src = entry.url;
    });
    assets.set(id, entry); return entry.promise;
  }

  function allowed(gate) {
    if (!gate) return true;
    const s = E.state();
    if (gate.all) return gate.all.every(allowed);
    if (gate.item) return s.has(gate.item);
    if (gate.flag) return Object.hasOwn(gate, 'eq') ? s.f[gate.flag] === gate.eq : !!s.f[gate.flag];
    return false;
  }
  function actionFor(spec) {
    const action = D.actions.find(x => x.id === spec?.action);
    if (!action || !Number.isInteger(spec.phase) || !action.phases[spec.phase]) return action;
    // The bottle's lift and return straddle its original native label reader.
    // Each source owner gets only its matching phase, never a repeated lift.
    return { ...action, sourcePhase: spec.phase, art: spec.phase ? action.phases[spec.phase - 1].endArt || action.art : action.art, phases: [action.phases[spec.phase]] };
  }
  const live = owner => !!owner && current === owner && !owner.closed && owner.run === E.R() && owner.ctx.live?.() !== false && active();
  function clearOwner(owner, cancelled = false) {
    if (!owner || owner.closed) return;
    owner.closed = true; owner.phaseToken = (owner.phaseToken || 0) + 1; owner.imageToken = (owner.imageToken || 0) + 1; owner.unbind?.(); owner.unbind = null;
    for (const [el, id] of owner.captures || []) { try { if (el.hasPointerCapture?.(id)) el.releasePointerCapture(id); } catch {} }
    owner.captures?.clear(); owner.observer?.disconnect();
    owner.el?.getAnimations?.({ subtree: true }).forEach(a => a.cancel());
    owner.el?.remove(); if (current === owner) current = null;
    if (cancelled) stats.cancelled.push(owner.id);
    owner.resolve?.(); owner.resolve = null;
    if (!cancelled && owner.returnFocus?.isConnected) owner.returnFocus.focus({ preventScroll: true });
  }
  async function closeOwner(owner, reason) {
    if (!live(owner) || owner.closing) return;
    owner.closing = true; owner.exitReason = reason; owner.unbind?.(); owner.unbind = null;
    if (reason === 'skip') stats.skipped.push(owner.id);
    owner.el.classList.add('bt-d4-out');
    const animations = (owner.el.getAnimations?.() || []).filter(a => Number.isFinite(a.effect?.getComputedTiming().endTime));
    await Promise.allSettled(animations.map(a => a.finished));
    clearOwner(owner, owner.ctx.live?.() === false || owner.run !== E.R());
  }
  function shell(ctx, id, title, mode) {
    if (current) clearOwner(current, true);
    const root = $('.se'); if (!root) return null;
    const owner = { ctx, id, run: E.R(), mode, title, tr: false, closed: false, closing: false, phase: 0, phaseToken: 0, imageToken: 0, captures: new Set(), returnFocus: document.activeElement };
    const el = document.createElement('div'); owner.el = el; current = owner;
    el.className = 'se-iv bt-d4-surface'; el.dataset.btD4Owner = id; el.dataset.btD4Mode = mode; el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); el.tabIndex = -1;
    el.innerHTML = `<section class="bt-d4-dialog"><header><h2></h2><div class="bt-d4-header-tools">${E.ui.translationButton(false, 'data-d4-translate')}<button type="button" data-d4-skip></button></div></header><div class="bt-d4-body"><div class="bt-d4-loading" role="status"></div><div class="bt-d4-image-wrap"><div class="bt-d4-plane"><img class="bt-d4-image" alt=""><div class="se-act bt-d4-gesture-layer"></div></div></div><p class="bt-d4-record-caption" hidden></p><div class="bt-d4-portrait-tabs"></div><p class="bt-d4-status" role="status" aria-live="polite"></p></div><footer><button type="button" class="se-btn" data-d4-replay></button><button type="button" class="se-btn pri" data-d4-perform></button><button type="button" class="se-btn pri" data-d4-done hidden></button></footer></section>`;
    root.appendChild(el);
    el.onpointerdown = e => e.stopPropagation();
    el.onpointerup = e => e.stopPropagation();
    el.onclick = e => {
      e.stopPropagation(); if (!live(owner) || owner.closing) return;
      if (e.target.closest('[data-d4-skip]')) return closeOwner(owner, 'skip');
      if (e.target.closest('[data-d4-translate]')) { owner.tr = !owner.tr; translate(owner); return; }
      if (e.target.closest('[data-d4-perform]')) return owner.perform?.();
      if (e.target.closest('[data-d4-replay]')) return owner.replay?.();
      if (e.target.closest('[data-d4-done]')) return closeOwner(owner, 'done');
    };
    el.onkeydown = e => {
      if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); closeOwner(owner, 'skip'); return; }
      if (e.key === 'Tab') {
        const bs = [...el.querySelectorAll('button,[tabindex="0"]')].filter(b => !b.hidden && !b.disabled && b.getClientRects().length);
        const first = bs[0], last = bs.at(-1);
        if (e.shiftKey && (document.activeElement === first || document.activeElement === el)) { e.preventDefault(); last?.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
      }
      e.stopPropagation();
    };
    const got = e => owner.captures.add([e.target, e.pointerId]); el.addEventListener('gotpointercapture', got);
    owner.promise = new Promise(r => owner.resolve = r);
    ctx.onCancel?.(() => clearOwner(owner, true));
    translate(owner); $('[data-d4-skip]', el).focus({ preventScroll: true });
    return owner;
  }
  const text = (owner, value) => value ? value[owner.tr ? 'vi' : 'en'] || value.en || '' : '';
  function translate(owner) {
    const el = owner.el;
    $('h2', el).textContent = text(owner, owner.title); el.setAttribute('aria-label', text(owner, owner.title));
    $('[data-d4-skip]', el).textContent = text(owner, owner.mode === 'portraits' ? pair('Close', 'Đóng') : pair('Skip', 'Bỏ qua'));
    $('[data-d4-replay]', el).textContent = text(owner, pair('Replay', 'Xem lại'));
    $('[data-d4-done]', el).textContent = text(owner, pair('Continue', 'Tiếp'));
    $('[data-d4-perform]', el).textContent = text(owner, owner.phaseSpec?.label || pair('Loading image…', 'Đang tải ảnh…'));
    $('.bt-d4-loading', el).textContent = text(owner, pair('Loading image…', 'Đang tải ảnh…'));
    $('.bt-d4-status', el).textContent = text(owner, owner.status || pair('Optional. You can skip this action.', 'Tùy chọn. Bạn có thể bỏ qua thao tác.'));
    const caption = $('.bt-d4-record-caption', el); caption.hidden = !owner.record || !owner.showRecord;
    caption.textContent = text(owner, owner.record);
    E.ui.updateTranslationButton?.($('[data-d4-translate]', el), owner.tr);
    for (const b of el.querySelectorAll('[data-portrait-id]')) b.textContent = text(owner, b._label);
  }
  async function showImage(owner, id) {
    const token = ++owner.imageToken;
    if (assets.get(id)?.status !== 'ready') $('.bt-d4-loading', owner.el).hidden = false;
    const a = await ensureAsset(id); if (!live(owner) || token !== owner.imageToken) return null;
    if (!a) { $('.bt-d4-loading', owner.el).hidden = true; return null; }
    const image = $('.bt-d4-image', owner.el); image.src = a.url; image.alt = text(owner, owner.title);
    owner.el.style.setProperty('--bt-d4-aspect', a.size[0] / a.size[1]);
    $('.bt-d4-loading', owner.el).hidden = true;
    const wrap = $('.bt-d4-image-wrap', owner.el), plane = $('.bt-d4-plane', owner.el);
    const resize = () => {
      if (!live(owner)) return;
      const w = wrap.clientWidth, h = wrap.clientHeight, ratio = a.size[0] / a.size[1];
      const ww = Math.min(w, h * ratio); plane.style.width = Math.max(1, ww) + 'px'; plane.style.height = Math.max(1, ww / ratio) + 'px';
    };
    owner.observer?.disconnect(); owner.observer = new ResizeObserver(resize); owner.observer.observe(wrap); resize();
    owner.art = id; return a;
  }
  async function runAction(action, ctx, { replay = false } = {}) {
    if (!active() || !allowed(action.gate) || ctx.live?.() === false) return;
    // Mark the ORIGINAL source step resumable while a side-owned gate waits.
    // No plugin run-state field is serialized; a reload can harmlessly offer
    // this optional presentation again, never rerun a reward or choice.
    if (!replay) ctx.resumeHere?.();
    const owner = shell(ctx, action.id, action.title, 'action'); if (!owner) return;
    owner.action = action; owner.replayOnly = replay; stats.opened.push({ id: action.id, key: ctx.key?.(), replay });
    // These are exact current/already-read source values, not bitmap text or
    // copied clue data. Their original native steps remain the sole authors.
    const record = action.recordPath && resolve(action.recordPath);
    if (record) owner.record = record.lines ? pair(
      [record.title?.en, ...record.lines.map(x => x.en)].filter(Boolean).join('\n'),
      [record.title?.vi, ...record.lines.map(x => x.vi || x.en)].filter(Boolean).join('\n')) : record;
    owner.showRecord = action.captionWhen === 'before';
    const restore = () => { if (ctx.live?.() !== false && !replay) ctx.resumeHere?.(false); };
    owner.replay = () => { if (live(owner) && !owner.closing) { owner.phase = 0; owner.complete = false; owner.busy = false; owner.showRecord = action.captionWhen === 'before'; showPhase(); } };
    const showPhase = async () => {
      if (!live(owner) || owner.closing || !allowed(action.gate)) return clearOwner(owner, true);
      const token = ++owner.phaseToken;
      owner.unbind?.(); owner.unbind = null;
      owner.perform = null;
      const phase = action.phases[owner.phase]; owner.phaseSpec = phase;
      owner.status = pair('Use the marked area, or the action button below.', 'Thao tác tại vùng được đánh dấu, hoặc dùng nút bên dưới.');
      $('[data-d4-done]', owner.el).hidden = true; $('[data-d4-perform]', owner.el).hidden = false;
      $('[data-d4-perform]', owner.el).disabled = true;
      const ready = await showImage(owner, owner.phase === 0 ? action.art : action.phases[owner.phase - 1].endArt || action.art);
      if (!live(owner) || token !== owner.phaseToken) return;
      if (!ready) { clearOwner(owner); return; }
      const L = $('.bt-d4-gesture-layer', owner.el), impl = E.gestures?.[phase.kind];
      // This scoped adapter uses only these existing native contracts. It
      // does not declare a generic drag/drop or phone mechanism for Enmi.
      if (!impl || !['tap', 'swipe', 'hold'].includes(phase.kind)) { clearOwner(owner); return; }
      const A = { ...phase, ms: 0, r: 'bt-d4-target' };
      L.className = 'se-act bt-d4-gesture-layer k-' + phase.kind;
      L.innerHTML = `<div class="ga" style="${E.pctStyle(phase.box)}">${impl.html(A, { to: phase.to || null })}</div>`;
      const complete = async () => {
        if (!live(owner) || owner.closing || owner.busy || token !== owner.phaseToken || !allowed(action.gate)) return;
        owner.busy = true; owner.unbind?.(); owner.unbind = null;
        L.onpointerdown = L.onpointermove = L.onpointerup = L.onpointercancel = null; L.innerHTML = '';
        owner.phase++;
        if (owner.phase < action.phases.length) { owner.busy = false; return showPhase(); }
        owner.complete = true; owner.showRecord = true; stats.completed.push({ id: action.id, key: ctx.key?.(), replay });
        if (phase.endArt) await showImage(owner, phase.endArt);
        if (!live(owner) || token !== owner.phaseToken) return;
        owner.busy = false; owner.phaseSpec = null;
        owner.status = pair('Continue when ready. Replay changes no progress.', 'Tiếp khi sẵn sàng. Xem lại không đổi tiến độ.');
        $('[data-d4-perform]', owner.el).hidden = true; $('[data-d4-done]', owner.el).hidden = false;
        translate(owner); $('[data-d4-done]', owner.el).focus({ preventScroll: true });
      };
      owner.perform = complete;
      const cleanup = impl.bind($('.ga', L), A, { ok: complete, miss: () => { if (live(owner) && token === owner.phaseToken) { owner.status = pair('Try again, use the action button, or Skip.', 'Thử lại, dùng nút thao tác hoặc Bỏ qua.'); translate(owner); } }, pad: 14, live: () => live(owner) && !owner.closing && !owner.busy && token === owner.phaseToken });
      owner.unbind = typeof cleanup === 'function' ? cleanup : null;
      $('[data-d4-perform]', owner.el).disabled = false; translate(owner);
    };
    showPhase(); await owner.promise; restore();
    return { skipped: owner.exitReason === 'skip' };
  }

  async function portraitViewer(ownerContext, entries) {
    if (!active() || ownerContext.ctx.live?.() === false) return;
    const owner = shell(ownerContext.ctx, 'portraits:' + ownerContext.ctx.key(), pair('Portraits', 'Chân dung'), 'portraits'); if (!owner) return;
    owner.status = pair('Choose a portrait to view.', 'Chọn chân dung để xem.');
    $('[data-d4-replay]', owner.el).hidden = true; $('[data-d4-perform]', owner.el).hidden = true;
    const available = (await Promise.all(entries.map(x => ensureAsset(x.id)))).map((a, i) => a ? entries[i] : null).filter(Boolean);
    if (!live(owner)) return;
    if (!available.length) return clearOwner(owner);
    const tabs = $('.bt-d4-portrait-tabs', owner.el);
    for (const entry of available) {
      const b = document.createElement('button'); b.type = 'button'; b.dataset.portraitId = entry.id;
      const name = entry.who === 'callum14' ? 'Callum · 2004' : entry.who === 'dodd' ? 'Mrs Dodd' : 'Anna';
      const mood = entry.id.endsWith('sad') ? ['sad', 'buồn'] : entry.id.endsWith('smile') ? ['smile', 'cười'] : entry.id.endsWith('surprised') ? ['surprised', 'ngạc nhiên'] : ['reserved', 'dè chừng'];
      b._label = pair(name + ' · ' + mood[0], name + ' · ' + mood[1]);
      b.onclick = async e => { e.stopPropagation(); if (!live(owner)) return; const ready = await showImage(owner, entry.id); if (!live(owner) || !ready) return; for (const node of tabs.children) node.setAttribute('aria-pressed', String(node === b)); stats.portraits.push({ id: entry.id, key: ownerContext.ctx.key() }); };
      tabs.appendChild(b);
    }
    translate(owner); tabs.firstElementChild.click(); await owner.promise;
  }

  function applyEnvironments() {
    for (const item of D.environments) {
      const v = resolve(item.path); if (!v) continue;
      if (!views.has(item.path)) views.set(item.path, { view: v, img: v.img, size: v.size, fit: v.fit, regions: v.regions });
      const old = views.get(item.path);
      const cached = assets.get(item.id), art = active() && cached?.status === 'ready' ? cached : null;
      if (art) {
        v.img = item.id; v.size = [...art.size]; v.fit = item.fit || 'contain'; v.regions = copy(item.regions);
        E.regions({ [item.id]: { size: [...art.size], fit: item.fit || 'contain', r: copy(item.regions) } });
        if (!stats.environments.includes(item.id)) stats.environments.push(item.id);
      } else {
        for (const k of ['img', 'size', 'fit', 'regions']) { if (old[k] === undefined) delete v[k]; else v[k] = old[k]; }
      }
    }
  }
  async function prepareEnvironment(placeId) {
    if (active()) await Promise.all(D.environments.filter(item => resolve(item.path) && (!placeId || item.path.startsWith('places.' + placeId + '.'))).map(item => ensureAsset(item.id)));
    applyEnvironments();
  }
  const originalPlace = E.mech.place;
  E.mech.place = async c => {
    if (ours() && ['c1_bar', 'c6_cellar'].includes(c.st.place)) { c.resumeHere?.(); await prepareEnvironment(c.st.place); if (c.live?.() === false) return; }
    return originalPlace(c);
  };
  const originalRestore = E.ui.restore;
  // Core restore callers are synchronous. Never defer an old restore until
  // after a new run has begun; native place owns any awaited asset decoding.
  E.ui.restore = function (...args) { if (ours()) applyEnvironments(); return originalRestore.apply(this, args); };

  function addToStep(path, category, value) {
    const step = resolve(path); if (!step || typeof step !== 'object') return;
    const data = step.btD4 ||= {};
    if (category === 'portraits') { data.portraits ||= []; if (!data.portraits.some(x => x.id === value.id)) data.portraits.push(value); }
    else data[category] = value;
  }
  function install() {
    if (!enabled()) return;
    for (const item of D.art) addToStep(item.path, item.mode === 'read' ? 'readArt' : 'art', item.id);
    for (const item of D.actions) for (const path of item.paths) {
      addToStep(path, 'action', item.id);
      if (Number.isInteger(item.phaseAt?.[path])) addToStep(path, 'phase', item.phaseAt[path]);
    }
    for (const item of D.expressions) addToStep(item.path, item.mode === 'portrait' ? 'portraits' : 'expression', item);
    // The delayed stove path observes the SAME uncollected paper; repeat/ash
    // branches intentionally have no art binding.
    addToStep('nodes.c2_cottage.19.then.1', 'art', 'r3-draft-in-stove');
    addToStep('nodes.c4_cottage.16.explore.spots.0.then.0', 'art', 'r3-cottage-phone-label');
    addToStep('nodes.c4_cottage.16.explore.spots.3.then.0', 'art', 'r3-cabinet-three-ampoules');
  }
  const cleanFace = owner => {
    for (const x of owner?.faceNodes || []) { x.remove(); }
    for (const x of owner?.faceHosts || []) { delete x.dataset.btD4Face; delete x.dataset.btD4Costume; }
  };
  async function paintExpression(owner) {
    const spec = owner?.expression; if (!spec || !active() || owner.ctx.live?.() === false || owner.run !== E.R()) return;
    const asset = await ensureAsset(spec.id); if (!asset || owner.ctx.live?.() === false || owner.run !== E.R() || !active()) return;
    // Never summon a hidden actor. A seated costume is replaced only by an
    // explicitly seated variant; half-body R3 Dodd portraits stay in viewer.
    const actor = $(`.se-ch[data-id="${spec.who}"]`), chi = actor?.querySelector('.se-chi');
    if (!actor || !chi || !E.R().cast?.[spec.who]) return;
    const costume = $('.bt-cast-costume', chi);
    if (spec.mode === 'costume' && !costume || spec.mode === 'live' && costume) return;
    if (actor.querySelector(`[data-d4-expression="${spec.id}"]`)) return;
    const im = document.createElement('div'); im.className = spec.mode === 'costume' ? 'ii bt-d4-face bt-d4-costume-face' : 'ii bt-d4-face'; im.dataset.d4Expression = spec.id;
    im.style.backgroundImage = `url(${JSON.stringify(asset.url)})`; im.setAttribute('aria-hidden', 'true');
    chi.appendChild(im); actor.dataset.btD4Face = spec.id; if (spec.mode === 'costume') actor.dataset.btD4Costume = spec.id;
    (owner.faceNodes ||= []).push(im); (owner.faceHosts ||= []).push(actor); E.btD4Staging?.sync?.();
  }
  E.side('btD4', async (spec, st, ctx) => {
    if (!active() || ctx.live?.() === false) return;
    const owner = { ctx, run: E.R(), spec, expression: spec.expression, buttons: [], faceNodes: [], faceHosts: [] };
    lineOwner = owner;
    ctx.onExit?.(() => { owner.buttons.forEach(x => x.remove()); cleanFace(owner); if (lineOwner === owner) lineOwner = null; if (current?.ctx === ctx) clearOwner(current, true); });
    if (spec.action) {
      const action = owner.action = actionFor(spec);
      if (action && allowed(action.gate)) owner.actionSkipped = (await runAction(action, ctx))?.skipped;
      if (ctx.live?.() === false) return;
    }
    // Skip must not start another wait for an optional bitmap that has not
    // decoded. The original line/native artwork remains the immediate path.
    if (spec.art && active() && !(owner.actionSkipped && assets.get(spec.art)?.status !== 'ready')) {
      ctx.resumeHere?.(); const a = await ensureAsset(spec.art);
      if (ctx.live?.() === false) return;
      if (a && active()) { await E.ui.detailView({ art: spec.art, detail: true, aspect: a.size[0] / a.size[1] }, ctx); owner.detail = true; stats.details.push({ id: spec.art, key: ctx.key() }); }
      ctx.resumeHere?.(false);
    }
    if (spec.readArt) {
      ctx.resumeHere?.(); owner.readAsset = await ensureAsset(spec.readArt);
      if (ctx.live?.() === false) return; ctx.resumeHere?.(false);
    }
    if (spec.expression) {
      ctx.resumeHere?.(); await ensureAsset(spec.expression.id);
      if (ctx.live?.() === false) return; ctx.resumeHere?.(false);
    }
  });
  const originalLine = E.ui.line;
  E.ui.line = function (options) {
    const owner = lineOwner, matches = active() && owner?.run === E.R() && owner.ctx.live?.() !== false;
    const result = originalLine.call(this, matches && owner.detail ? { ...options, pic: undefined } : options);
    if (!matches) return result;
    paintExpression(owner);
    const tools = $('.se-box .se-tools');
    const button = (label, onClick, id) => {
      const b = document.createElement('button'); b.type = 'button'; b.className = 'bt-d4-review'; b.dataset.d4Review = id; b.textContent = label; b.onclick = e => { e.preventDefault(); e.stopPropagation(); if (owner.ctx.live?.() !== false) onClick(); }; tools?.appendChild(b); owner.buttons.push(b);
    };
    if (owner.spec.action) {
      const action = owner.action || actionFor(owner.spec);
      if (action && allowed(action.gate) && assets.get(action.art)?.status === 'ready') button('Replay action', () => runAction(action, owner.ctx, { replay: true }), action.id);
    }
    if (owner.spec.portraits?.length) button('Portraits', () => portraitViewer(owner, owner.spec.portraits), 'portraits');
    return Promise.resolve(result).finally(() => { owner.buttons.forEach(x => x.remove()); if (current?.ctx === owner.ctx) clearOwner(current, true); });
  };
  const originalRead = E.ui.read;
  E.ui.read = function (spec, context) {
    const owner = lineOwner, same = active() && owner?.ctx === context && owner.ctx.live?.() !== false;
    const result = originalRead.call(this, spec, context);
    const action = owner?.action;
    const id = same && (owner.readAsset?.id || action?.phases.at(-1)?.endArt || action?.art);
    const a = id && assets.get(id);
    if (a?.status === 'ready') {
      const paper = $('.se-read .rd-p');
      if (paper && !paper.querySelector('.bt-d4-doc-plate')) {
        const im = document.createElement('img'); im.className = 'bt-d4-doc-plate'; im.src = a.url; im.alt = ''; paper.prepend(im);
      }
    }
    return result;
  };
  E.plugin({ id: 'bt-d4-actions', on: { boot: install, chapter: install } });
  E.btD4 = Object.freeze({ enabled, automatic, install, prepareEnvironment, ensureAsset,
    status: () => ({ enabled: enabled(), autoBypassed: automatic(), owner: current ? { id: current.id, phase: current.phase, complete: !!current.complete, closing: current.closing, key: current.ctx.key?.() } : null, stats: copy(stats), assets: [...assets.values()].map(a => ({ id: a.id, status: a.status, size: a.size })) }),
    // Scoped diagnostic/replay API requires an actual live engine context.
    data: D,
  });
})();
