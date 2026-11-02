/* Between Tides d4 — story-owned blocking and compact access to native UI.
 * Loaded after bt-native-v104-ui.js. Shared mechanisms, story arrays and save
 * identities are untouched. Reviewed camera cuts retain their actors, and
 * Fergus/Dodd remain in the vigil until its existing final hide.
 */
(() => {
  'use strict';
  const E = globalThis.StoryEngine;
  if (!E?.plugin || E.plugins?.['bt-d4-staging']) return;
  const ours = () => E.S()?.id === 'between-tides';
  const $ = selector => document.querySelector(selector);
  const root = () => $('.se');
  const t = (en, vi) => E.nat({ en, vi });
  const iconGoal = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/><path d="M12 1v3M12 20v3M1 12h3M20 12h3"/></svg>';
  const ranks = { ll: 0, l: 1, c: 2, r: 3, rr: 4 };
  const slots = { 1: [50], 2: [25, 75], 3: [16, 50, 84], 4: [12, 37, 63, 88] };
  // Reviewed hide/show pairs that are camera cuts, not physical departures.
  // Actual cellar/boat/brandy trips and the cottage doorway are not retained.
  const cameraCuts = [
    { node: 'c1_fergus', id: 'fergus', hide: 11, show: 21, at: 'c', face: '', offscreen: true },
    { node: 'c2_slip', id: 'helen', hide: 14, show: 19, at: 'c', face: 'cold', offscreen: false },
    { node: 'c2_slip', id: 'helen', hide: 27, show: 35, at: 'c', face: 'cold', offscreen: true },
    { node: 'c5_dunes', id: 'leo', hide: 38, show: 48, at: 'c', face: '', offscreen: true },
  ];
  let raf = 0, resize, mutation, abort, menu, menuButton, goalButton, notice;
  let goalContext = null, goalRun = null, goalId = '', goalValue = null, announced = new Set(), noticeTimer;
  const active = () => { const frame = E.R()?.stack?.at(-1); return frame && { frame, index: frame.i - 1, step: E.walk(frame)?.[frame.i - 1] }; };
  const inVigil = () => { const a = active(), index = a?.frame.p.length ? a.frame.p[0] : a?.index; return a?.frame.n === 'c5_vigil' && index >= 13 && index <= 29; };
  const css = (el, key, value) => { if (el.style.getPropertyValue(key) !== value) el.style.setProperty(key, value); };

  function syncCast() {
    const rt = root(), stage = $('.se-stage');
    if (!ours() || !rt || !stage) return;
    const actors = [...rt.querySelectorAll('.se-chars > .se-ch')].filter(el => E.R()?.cast?.[el.dataset.id] && !el.classList.contains('out'));
    actors.sort((a, b) => (ranks[a.dataset.at] ?? 2) - (ranks[b.dataset.at] ?? 2));
    const n = actors.length, W = stage.clientWidth, H = stage.clientHeight;
    const headerTop = Math.min(84, ($('.se-top')?.getBoundingClientRect().height || 60) + 12);
    // Portrait crop is a decision of the cast and viewport, never of the
    // speaker, translation length, question list or current reader height.
    const paintHeight = Math.max(200, Math.min(H * (n <= 1 ? .96 : n === 2 ? .91 : n === 3 ? .80 : .72), W * (n <= 1 ? 1.85 : n === 2 ? 1.65 : n === 3 ? 1.30 : 1.05)));
    const top = Math.max(headerTop, Math.round(H * .94 - paintHeight));
    css(rt, '--bt-d4-cast-top', top + 'px');
    css(rt, '--bt-d4-cast-height', Math.round(paintHeight) + 'px');
    css(rt, '--bt-d4-cast-width', Math.round(paintHeight * 2 / 3) + 'px');
    if (rt.dataset.btD4Cast !== String(n)) rt.dataset.btD4Cast = String(n);
    actors.forEach((el, i) => css(el, '--bt-d4-slot', (slots[n]?.[i] ?? 10 + 80 * i / Math.max(1, n - 1)) + '%'));
    const panel = $('.se-panel.pl');
    if (rt.dataset.m === 'pl' && panel) {
      // Reserve the actual compact lower control lane. Do not resize the
      // scene for an expanded bag, hint, target list or confirmation sheet.
      const controls = [...panel.querySelectorAll(':scope > .pl-location, :scope > .pl-doorways, :scope > .pl-bar')]
        .filter(el => el.getClientRects().length);
      const panelStyle = getComputedStyle(panel);
      const gap = parseFloat(panelStyle.rowGap) || 8;
      const base = Math.ceil(controls.reduce((height, el) => height + el.getBoundingClientRect().height, 0)
        + Math.max(0, controls.length - 1) * gap + 28);
      // Named native doorways are persistent controls, unlike the optional
      // map/bag/target drawers. Reserve their height so seated boots remain
      // visible after the spatial graph adds a route beneath the bar scene.
      css(rt, '--bt-d4-place-bottom', Math.max(74, Math.min(rt.clientHeight * .46, base)) + 'px');
    }
  }
  function sync() { raf = 0; syncCast(); syncObjective(false); moveNativeControls(); }
  function schedule() { if (!raf) raf = requestAnimationFrame(sync); }

  const show = E.ui.show, hide = E.ui.hide;
  E.ui.show = function (id, at, face) {
    if (ours() && inVigil() && id === 'dodd') at = 'rr';
    const result = show.call(this, id, at, face);
    if (ours() && inVigil() && id === 'dodd') $(`.se-chars > .se-ch[data-id="${id}"]`)?.classList.add('on');
    schedule();
    return result;
  };
  E.ui.hide = function (id) {
    const a = active();
    // The phone-time title is a cut within the same bar scene. Native title
    // clears all actors, so retain only Fergus here; it is not a new visit.
    if (ours() && id === '*' && a?.frame.n === 'c1_fergus' && !a.frame.p.length && a.index === 12 && a.step?.title) {
      for (const who of Object.keys(E.R().cast || {})) if (who !== 'fergus') hide.call(this, who);
      schedule(); return;
    }
    const retained = ours() && a && !a.frame.p.length && (
      (a.frame.n === 'c5_vigil' && ((a.index === 20 && id === 'fergus') || (a.index === 25 && id === 'dodd'))) ||
      cameraCuts.some(cut => cut.node === a.frame.n && cut.id === id && cut.hide === a.index)
    );
    if (retained) { schedule(); return; }
    const result = hide.call(this, id); schedule(); return result;
  };
  function vigilContinuity() {
    if (!inVigil()) return;
    // Both are explicitly seated in the opening narration. Retain each after
    // their original show, and repair old saves after those exact boundaries.
    // Never meet Dodd or Fergus earlier than the approved native show step.
    const a = active(), index = a.frame.p.length ? a.frame.p[0] : a.index;
    const people = [];
    if (index > 14) people.push(['fergus', 'r', 'sad']);
    if (index > 21) people.push(['dodd', 'rr', '']);
    for (const [id, at, face] of people) {
      if (E.R().cast[id] || !E.R().met?.[id]) continue;
      E.ui.show(id, at, face);
      const actor = $(`.se-chars > .se-ch[data-id="${id}"]`);
      actor?.classList.add('on');
    }
  }

  function cameraContinuity(repair = true) {
    const a = active(), index = a?.frame.p.length ? a.frame.p[0] : a?.index;
    const cuts = cameraCuts.filter(cut => cut.node === a?.frame.n && index >= cut.hide && index < cut.show);
    if (repair) for (const cut of cuts) {
      if (index <= cut.hide || E.R().cast[cut.id] || !E.R().met?.[cut.id]) continue;
      E.ui.show(cut.id, cut.at, cut.face);
      $(`.se-chars > .se-ch[data-id="${cut.id}"]`)?.classList.add('on');
    }
    for (const actor of root()?.querySelectorAll('.se-chars > .se-ch') || []) {
      actor.classList.toggle('bt-d4-offscreen', cuts.some(cut => cut.offscreen && cut.id === actor.dataset.id));
    }
  }
  const restore = E.ui.restore;
  E.ui.restore = function (...args) { const result = restore.apply(this, args); if (ours()) cameraContinuity(false); schedule(); return result; };
  function closeMenu() {
    if (!menu || menu.hidden) return;
    menu.hidden = true; menuButton?.setAttribute('aria-expanded', 'false');
    root()?.classList.remove('bt-d4-menu-open'); E.emit('quick-menu', false);
  }
  function toggleMenu() {
    if (!menu) return;
    if (!menu.hidden) return closeMenu();
    closeNotice(); moveNativeControls();
    menu.hidden = false; menuButton.setAttribute('aria-expanded', 'true');
    root()?.classList.add('bt-d4-menu-open'); E.emit('quick-menu', true);
  }
  function closeNotice() {
    clearTimeout(noticeTimer);
    if (!notice) return;
    const paused = notice.hasAttribute('data-quick-menu');
    E.ui.releaseReading?.(notice); notice.remove(); notice = null;
    if (paused) E.emit('quick-menu', false);
    goalButton?.setAttribute('aria-expanded', 'false');
  }
  function renderNotice(automatic = false) {
    if (!goalValue || !root() || $('.se-top')?.hidden) return;
    closeNotice(); closeMenu();
    root().querySelectorAll('.bt-d4-note').forEach(el => el.remove());
    notice = document.createElement('section');
    notice.className = 'bt-d4-objective'; notice.id = 'bt-d4-current-objective';
    notice.dataset.automatic = String(automatic); notice.setAttribute('role', automatic ? 'status' : 'region');
    notice.setAttribute('aria-label', t('Current objective', 'Mục tiêu hiện tại'));
    const toolbarMarkup = E.btD4ValeUi?.objectiveHTML?.(goalValue);
    if (toolbarMarkup) notice.innerHTML = toolbarMarkup;
    else if (automatic) {
      notice.innerHTML = `<button type="button" data-bt-d4-goal-open>${E.esc(t('Objective updated', 'Mục tiêu đã cập nhật'))}</button><button type="button" class="se-ib" data-bt-d4-goal-close aria-label="${E.esc(t('Close', 'Đóng'))}">${E.ICON.x}</button>`;
      notice.querySelector('[data-bt-d4-goal-open]').onclick = event => { event.stopPropagation(); renderNotice(false); };
    } else notice.innerHTML = `<header><b>${E.esc(t('Objective', 'Mục tiêu'))}</b>${E.ui.readingToggle()}<button type="button" class="se-ib" data-bt-d4-goal-close aria-label="${E.esc(t('Close', 'Đóng'))}">${E.ICON.x}</button></header><p>${E.ui.readingText(goalValue, { compact: true })}</p>`;
    notice.querySelector('[data-bt-d4-goal-close]').onclick = event => { event.stopPropagation(); closeNotice(); };
    notice.addEventListener('click', event => event.stopPropagation());
    root().append(notice); E.ui.bindReading(notice, { native: false });
    if (!automatic) { notice.dataset.quickMenu = ''; E.emit('quick-menu', true); }
    goalButton?.setAttribute('aria-expanded', 'true');
    if (automatic) noticeTimer = setTimeout(closeNotice, 5200);
  }
  function narrativeGoal() {
    const profile = E.S()?.profile?.lines?.[0], state = E.state();
    return typeof profile?.value === 'function' ? profile.value(state) : profile?.value || E.S()?.me?.goal;
  }
  function syncObjective(allowNotice) {
    if (!ours() || !E.R()) return;
    if (goalRun !== E.R()) { goalRun = E.R(); goalId = ''; announced = new Set(); goalContext = null; closeNotice(); }
    const value = goalContext?.value || narrativeGoal();
    const id = goalContext?.id || 'story:' + (E.R().f?.goal || 'start');
    const changed = id !== goalId;
    goalId = id; goalValue = value;
    if (goalButton) {
      goalButton.title = t('Current objective', 'Mục tiêu hiện tại');
      goalButton.setAttribute('aria-label', goalButton.title);
      goalButton.disabled = !value;
    }
    if (changed && allowNotice && !announced.has(id) && !E.auto && !$('.se-top')?.hidden) {
      announced.add(id); renderNotice(true);
    }
  }
  const objective = E.ui.setObjective;
  E.ui.setObjective = function (spec) {
    const result = objective?.call(this, spec);
    if (!ours()) return result;
    if (!spec) goalContext = null;
    else {
      const a = active(), pid = String(spec.id || '').startsWith('place:') ? String(spec.id).slice(6) : '';
      const detail = pid && E.R()?.pl?.[pid]?.detail;
      let value = pid && !detail ? E.ui.explorationObjective?.({ place: pid }) || E.S().places?.[pid]?.goal : null;
      if (!value && a?.step?.explore) value = E.ui.explorationObjective?.({ explore: a.step.explore }) || a.step.explore.goal;
      if (detail) value = { en: 'Tap the detail to inspect it again. Use Back to return to the scene.', vi: 'Chạm chi tiết để xem lại. Bấm Lùi để trở về cảnh.' };
      goalContext = { id: spec.id || 'exploration', value: value || spec.text };
    }
    syncObjective(false); return result;
  };
  const toast = E.ui.toast;
  E.ui.toast = function (html, ms, cls) {
    const note = ours() && cls === 'item' && active()?.step?.note;
    const element = toast.call(this, html, ms, cls);
    if (!note || !element) return element;
    // A note is already stored by the native note mechanism. Keep its exact
    // text in a readable local sheet; its receipt must not cover group faces.
    closeNotice();
    element.classList.add('bt-d4-note');
    element.innerHTML = `<button type="button" data-bt-d4-note-open>${E.ICON.pen}<span>${E.esc(t('Noted · Read', 'Đã ghi · Đọc'))}</span></button><button type="button" data-bt-d4-note-close aria-label="${E.esc(t('Close', 'Đóng'))}">${E.ICON.x}</button>`;
    element.onclick = event => {
      event.stopPropagation();
      if (event.target.closest('[data-bt-d4-note-close]')) { element.remove(); return; }
      if (!event.target.closest('[data-bt-d4-note-open]')) return;
      element.remove();
      const sheet = E.ui.sheet(t('Note', 'Ghi chú'), `<div class="bt-d4-note-reader">${E.ui.readingToggle()}<p>${E.ui.readingText(note, { compact: true })}</p></div>`, 'bt-d4-note-sheet');
      E.ui.bindReading(sheet, { native: false });
    };
    return element;
  };
  function moveNativeControls() {
    if (!menu) return;
    const stat = $('.se-stat'), profile = $('.lf-hud');
    if (stat && stat.parentElement !== menu && !root()?.classList.contains('bt-d4-vale-ui')) menu.prepend(stat);
    if (profile && profile.parentElement !== menu) {
      profile.classList.add('bt-d4-native-menu-control');
      if (!profile.querySelector('.bt-d4-control-label')) profile.insertAdjacentHTML('beforeend', `<span class="bt-d4-control-label">${E.esc(t('Profile', 'Cá nhân'))}</span>`);
      menu.querySelector('[data-bt-d4-home]')?.before(profile);
    }
  }
  function install() {
    if (!ours()) return;
    const rt = root(), top = $('.se-top');
    rt.classList.add('bt-d4-staging');
    abort?.abort(); abort = new AbortController();
    menuButton = top.querySelector('[data-a="menu"]');
    menuButton.removeAttribute('data-a'); menuButton.dataset.btD4Menu = '';
    menuButton.setAttribute('aria-expanded', 'false'); menuButton.setAttribute('aria-controls', 'bt-d4-quick-menu');
    menu = document.createElement('nav'); menu.className = 'bt-d4-quick-menu'; menu.id = 'bt-d4-quick-menu';
    menu.dataset.quickMenu = ''; menu.hidden = true; menu.setAttribute('aria-label', t('Menu', 'Menu'));
    for (const button of [...top.querySelectorAll('.se-grp > button')]) {
      const label = button.getAttribute('aria-label') || button.dataset.a;
      button.classList.add('bt-d4-native-menu-control');
      button.insertAdjacentHTML('beforeend', `<span class="bt-d4-control-label">${E.esc(label)}</span>`);
      menu.append(button);
    }
    top.querySelector('.se-grp')?.remove();
    const settings = document.createElement('button'); settings.type = 'button'; settings.className = 'bt-d4-native-menu-control'; settings.dataset.a = 'menu';
    settings.innerHTML = `${E.ICON.menu}<span>${E.esc(t('Settings and saves', 'Cài đặt và bản lưu'))}</span>`; menu.append(settings);
    const home = document.createElement('button'); home.type = 'button'; home.className = 'bt-d4-native-menu-control'; home.dataset.btD4Home = '';
    home.innerHTML = `${E.ICON.home || E.ICON.flow}<span>${E.esc(t('Exit to overview', 'Thoát về tổng quan'))}</span>`;
    home.onclick = event => { event.stopPropagation(); closeMenu(); closeNotice(); E.save(); E.ui.closeSheet(); E.stop(); E.ui.title(); }; menu.append(home);
    goalButton = document.createElement('button'); goalButton.type = 'button'; goalButton.className = 'se-ib'; goalButton.dataset.btD4Goal = '';
    goalButton.setAttribute('aria-expanded', 'false'); goalButton.setAttribute('aria-controls', 'bt-d4-current-objective'); goalButton.innerHTML = iconGoal;
    top.append(goalButton, menu); moveNativeControls();
    menuButton.onclick = event => { event.stopPropagation(); toggleMenu(); };
    goalButton.onclick = event => { event.stopPropagation(); if (notice && notice.dataset.automatic !== 'true') closeNotice(); else renderNotice(false); };
    // The outside press belongs to closing the menu, even if its release lands
    // on Continue. Capture before the engine's bubbling continuation handler.
    let dismissPointer = false;
    rt.addEventListener('pointerdown', event => { dismissPointer = (!!menu && !menu.hidden && !event.target.closest('#bt-d4-quick-menu,[data-bt-d4-menu],[data-bt-d4-goal],[data-bt-d4-info]')) || (!!notice?.hasAttribute('data-quick-menu') && !event.target.closest('#bt-d4-current-objective,[data-bt-d4-goal],[data-bt-d4-info],[data-bt-d4-menu]'));  }, { capture: true, signal: abort.signal });
    rt.addEventListener('click', event => {
      if (dismissPointer || (!menu.hidden && !event.target.closest('#bt-d4-quick-menu,[data-bt-d4-menu],[data-bt-d4-goal],[data-bt-d4-info]'))) {
        dismissPointer = false; event.preventDefault(); event.stopImmediatePropagation(); closeMenu(); closeNotice(); return;
      }
      dismissPointer = false;
      if (!menu.hidden && event.target.closest('#bt-d4-quick-menu button')) closeMenu();
    }, { capture: true, signal: abort.signal });
    document.addEventListener('keydown', event => {
      // An automatic status pill must not consume the native Escape of an
      // evidence card, reader or puzzle that happens to be open below it.
      if (menu.hidden && !notice?.hasAttribute('data-quick-menu')) return;
      if (event.key === 'Escape') { event.preventDefault(); event.stopImmediatePropagation(); closeMenu(); closeNotice(); menuButton.focus(); }
      else if (!menu.hidden && !event.target.closest('#bt-d4-quick-menu,button,input,select,textarea')) { event.preventDefault(); event.stopImmediatePropagation(); }
    }, { capture: true, signal: abort.signal });
    resize?.disconnect(); resize = new ResizeObserver(schedule); resize.observe(rt); resize.observe($('.se-stage')); resize.observe($('.se-ui'));
    mutation?.disconnect(); mutation = new MutationObserver(schedule);
    mutation.observe($('.se-chars'), { childList: true, attributes: true, subtree: true, attributeFilter: ['class', 'data-at', 'data-face'] });
    goalRun = null; syncObjective(false); syncCast();
  }
  const reset = E.ui.reset;
  E.ui.reset = function (...args) { closeMenu(); closeNotice(); goalContext = null; const result = reset.apply(this, args); schedule(); return result; };
  E.plugin({ id: 'bt-d4-staging', on: {
    boot: install,
    step(type, st) {
      if (!ours()) return;
      vigilContinuity(); cameraContinuity();
      if (!['place', 'explore'].includes(type) && !['@pl', '@xp'].includes(active()?.frame.n)) goalContext = null;
      schedule();
      if (st.set?.goal != null || type === 'set') queueMicrotask(() => syncObjective(true));
    },
    line: schedule,
    end() { closeMenu(); closeNotice(); },
  } });
  E.btD4Staging = { sync: schedule, closeMenu, closeObjective: closeNotice, objective: () => ({ id: goalId, value: goalValue }), continuity: { vigil: 'c5_vigil:13..29', cameraCuts: cameraCuts.map(cut => ({ ...cut })) } };
})();
