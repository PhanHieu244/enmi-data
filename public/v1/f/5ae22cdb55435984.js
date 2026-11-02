/* Between Tides D4 addendum: Vale's compact toolbar composition on native
 * StoryEngine controls. The Vale reference is read-only. No story/save keys,
 * source arrays, puzzle handlers or shared engine implementations are changed.
 */
(() => {
  'use strict';
  const E = globalThis.StoryEngine;
  if (!E?.plugin || E.plugins?.['bt-d4-vale-ui']) return;
  const ours = () => E.S()?.id === 'between-tides';
  const $ = s => document.querySelector(s);
  const t = (en, vi) => E.nat({ en, vi });
  const iconInfo = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7v1"/></svg>';
  let frame = 0, observer, statusObserver, abort, scroll = null;
  const status = () => {
    const label = $('.se-stat .st-n')?.textContent?.trim();
    const time = $('.se-stat .st-t')?.textContent?.trim();
    return [label, time].filter(Boolean).join(' · ');
  };
  const objectiveHTML = value => `<div class="bt-d4-objective-copy"><small>${E.esc(t('Objective', 'Mục tiêu'))}</small><p>${E.esc(E.nat(value))}</p><div class="bt-d4-scene-meta" data-bt-d4-scene-meta>${E.esc(status())}</div></div><button type="button" class="se-ib" data-bt-d4-goal-close aria-label="${E.esc(t('Dismiss objective', 'Đóng mục tiêu'))}" title="${E.esc(t('Dismiss objective', 'Đóng mục tiêu'))}">${E.ICON.x}</button>`;

  function sceneInfo() {
    E.btD4Staging.closeMenu(); E.btD4Staging.closeObjective();
    const R = E.R(), S = E.S();
    // Native places render their occupants as .pp, outside the dialogue cast.
    // Read visible active-view people without marking anyone met or revealing
    // a real name before E.cname's existing knowledge gate allows it.
    const placePeople = [...document.querySelectorAll('.se-bgl.on .pp[data-who]')]
      .filter(el => el.getClientRects().length && getComputedStyle(el).visibility !== 'hidden')
      .map(el => el.dataset.who);
    const present = [...new Set([...Object.keys(R.cast || {}), ...placePeople])].filter(id => S.chars?.[id]);
    const names = [E.G().set.name, ...present.map(id => E.cname(S.chars[id], true) || id)].filter(Boolean);
    const goal = E.btD4Staging.objective()?.value;
    const sheet = E.ui.sheet(t('Scene & objective', 'Bối cảnh & mục tiêu'), `<div class="bt-d4-scene-brief"><p class="bt-d4-scene-meta">${E.esc(status())}</p><h3>${E.esc(t('Present in this scene', 'Những người có mặt'))}</h3><p>${names.map(E.esc).join(' · ')}</p><h3>${E.esc(t('What to do next', 'Việc cần làm'))}</h3><p>${E.esc(goal ? E.nat(goal) : t('Continue the current conversation.', 'Tiếp tục cuộc trò chuyện hiện tại.'))}</p><button type="button" class="se-btn wide" data-bt-d4-resume>${E.esc(t('Return to the same moment', 'Trở lại đúng đoạn đang chơi'))}</button></div>`, 'bt-d4-scene-info');
    sheet.querySelector('[data-bt-d4-resume]').onclick = () => E.ui.closeSheet();
  }

  function flashbackReader() {
    const box = $('.se-box');
    if (!box) return;
    const active = ['memory', 'flashback'].includes($('.se')?.dataset.mood);
    const primary = box.querySelector('.se-txt'), secondary = box.querySelector('.se-sub');
    if (!primary || !secondary) return;
    if (active && !scroll?.isConnected) {
      scroll = document.createElement('div'); scroll.className = 'bt-d4-flashback-scroll';
      scroll.setAttribute('tabindex', '0'); scroll.setAttribute('role', 'region');
      scroll.setAttribute('aria-label', t('Flashback dialogue and translation', 'Lời hồi tưởng và bản dịch'));
      primary.before(scroll); scroll.append(primary, secondary);
      let press = null, moved = false;
      scroll.addEventListener('pointerdown', e => { press = [e.clientX, e.clientY, scroll.scrollTop]; moved = false; }, { passive: true });
      scroll.addEventListener('pointermove', e => { if (press && (Math.abs(e.clientX - press[0]) + Math.abs(e.clientY - press[1]) > 12 || Math.abs(scroll.scrollTop - press[2]) > 3)) moved = true; }, { passive: true });
      scroll.addEventListener('pointercancel', () => { press = null; moved = true; });
      scroll.addEventListener('click', e => { if (moved) { e.stopPropagation(); moved = false; } press = null; }, true);
    } else if (!active && scroll?.isConnected) {
      scroll.before(primary, secondary); scroll.remove(); scroll = null;
    }
  }

  function sync() {
    frame = 0;
    if (!ours()) return;
    flashbackReader();
    const box = $('.se-box'), tr = box?.querySelector('[data-a="tr"]'), more = box?.querySelector('.se-more');
    if (tr) {
      const translated = !box.querySelector('.se-sub')?.hidden;
      E.ui.updateTranslationButton(tr, translated);
      tr.querySelector('svg')?.setAttribute('aria-hidden', 'true');
    }
    if (more) {
      const ready = box.classList.contains('done'), label = t(ready ? 'Continue' : 'Show all', ready ? 'Tiếp' : 'Hiện hết');
      if (more.textContent !== label) more.textContent = label;
      more.title = label; more.setAttribute('aria-label', label);
    }
    const toggle = $('[data-bt-d4-menu]');
    if (toggle) {
      const opened = toggle.getAttribute('aria-expanded') === 'true';
      const label = t(opened ? 'Close game menu' : 'Open game menu', opened ? 'Đóng menu trò chơi' : 'Mở menu trò chơi');
      if (toggle.title !== label) { toggle.title = label; toggle.setAttribute('aria-label', label); }
    }
    const text = status();
    for (const el of document.querySelectorAll('[data-bt-d4-scene-meta]')) if (el.textContent !== text) el.textContent = text;
  }
  const schedule = () => { if (!frame) frame = requestAnimationFrame(sync); };

  function install() {
    if (!ours() || !E.btD4Staging) return;
    const root = $('.se'), top = $('.se-top'), goal = $('[data-bt-d4-goal]');
    if (!root || !top || !goal) return;
    root.classList.add('bt-d4-vale-ui');
    const cluster = document.createElement('div'); cluster.className = 'bt-d4-context-tools';
    const info = document.createElement('button'); info.type = 'button'; info.className = 'se-ib'; info.dataset.btD4Info = '';
    info.title = t('Scene details', 'Chi tiết bối cảnh'); info.setAttribute('aria-label', info.title); info.innerHTML = iconInfo;
    info.onclick = event => { event.preventDefault(); event.stopPropagation(); sceneInfo(); };
    cluster.append(goal, info); top.prepend(cluster);
    const source = document.createElement('div'); source.className = 'bt-d4-status-source'; source.hidden = true;
    const stat = $('.se-stat'); if (stat) source.append(stat); root.append(source);
    // Native status remains live for clock/location updates but has no HUD row.
    statusObserver?.disconnect(); statusObserver = new MutationObserver(schedule);
    if (stat) statusObserver.observe(stat, { childList: true, subtree: true, characterData: true });
    observer?.disconnect(); observer = new MutationObserver(schedule);
    observer.observe(root, { attributes: true, attributeFilter: ['data-mood'] });
    observer.observe($('.se-box'), { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'hidden'] });
    observer.observe($('[data-bt-d4-menu]'), { attributes: true, attributeFilter: ['aria-expanded'] });
    abort?.abort(); abort = new AbortController();
    // Vale's dropdown arrow navigation uses the real native buttons.
    const menu = $('#bt-d4-quick-menu');
    menu.addEventListener('keydown', event => {
      if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
      const all = [...menu.querySelectorAll('button')].filter(b => !b.disabled && !b.hidden), i = all.indexOf(document.activeElement);
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? all.length - 1 : event.key === 'ArrowDown' ? (i + 1 + all.length) % all.length : (i - 1 + all.length) % all.length;
      event.preventDefault(); event.stopPropagation(); all[next]?.focus({ preventScroll: true });
    }, { signal: abort.signal });
    sync();
  }
  E.btD4ValeUi = { objectiveHTML, sceneInfo, sync: schedule, status };
  E.plugin({ id: 'bt-d4-vale-ui', on: { boot: install, step: schedule, line() { if (scroll) scroll.scrollTop = 0; schedule(); } } });
})();
