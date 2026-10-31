/* Enmi reconstruct — arrange known observations, routes or a plan without a timer.
 * Additive native step: normal story stack, snapshot and cleanup lifecycle.
 * No answer is written into the DOM. Authors supply cards/slots and optional hints.
 */
(() => {
  'use strict';
  const E = globalThis.StoryEngine;
  const esc = E.esc, tr = (en, vi) => E.nat({ en, vi });
  const paths = {
    note: '<path d="M5 3h14v18H5ZM8 8h8M8 12h8M8 16h5"/>',
    move: '<circle cx="9" cy="5" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="19" r="1"/>',
    close: '<path d="m6 6 12 12M18 6 6 18"/>',
    hint: '<path d="M9 18h6M10 22h4M8 14a6 6 0 1 1 8 0c-1 1-1 2-1 3H9c0-1 0-2-1-3Z"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7v1"/>',
    person: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7"/>',
    reset: '<path d="M3 4v6h6M3 10a9 9 0 1 1 1 8"/>',
    check: '<path d="m4 12 5 5L20 6"/>',
    arrow: '<path d="M4 12h16m-6-6 6 6-6 6"/>'
  };
  const icon = k => '<svg viewBox="0 0 24 24" aria-hidden="true">' + (paths[k] || paths.note) + '</svg>';
  const bi = t => '<span lang="' + esc(E.L) + '">' + esc(E.tgt(t)) + '</span>' +
    (E.sub(t) ? '<small data-rc-translation lang="' + esc(E.N) + '"' + (E.G().set.tr ? '' : ' hidden') + '>' + esc(E.sub(t)) + '</small>' : '');
  const shuffle = (ids, seed) => {
    let n = 2166136261;
    for (const char of seed) n = Math.imul(n ^ char.charCodeAt(0), 16777619) >>> 0;
    const a = ids.slice();
    for (let i = a.length - 1; i > 0; i--) {
      n = (Math.imul(n, 1664525) + 1013904223) >>> 0;
      const j = n % (i + 1); [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };
  E.def('reconstruct', c => new Promise(resolve => {
    c.resumeHere?.();
    const D = c.st.reconstruct || {}, R = E.R(), key = c.key('reconstruct');
    const cards = Array.isArray(D.cards) ? D.cards : [], slots = Array.isArray(D.slots) ? D.slots : [];
    const byId = new Map(cards.map(x => [String(x.id), x]));
    const slotById = new Map(slots.map(x => [String(x.id), x]));
    if (!cards.length || !slots.length || byId.size !== cards.length || slotById.size !== slots.length ||
      cards.some(x => !x.id || !x.label) || slots.some(x => !x.id || !x.label || !Array.isArray(x.accept) || !x.accept.some(id => byId.has(String(id))))) {
      throw new Error('reconstruct requires unique cards and slots, labels, and valid accept arrays: ' + (D.id || key));
    }
    R.used ||= {};
    const saved = R.used[key], st = R.used[key] = saved && typeof saved === 'object' ? saved : {};
    st.version = 1;
    st.assign = st.assign && typeof st.assign === 'object' && !Array.isArray(st.assign) ? st.assign : {};
    const occupied = new Set();
    for (const id of Object.keys(st.assign)) {
      const card = String(st.assign[id]);
      if (!slotById.has(id) || !byId.has(card) || occupied.has(card)) delete st.assign[id];
      else { st.assign[id] = card; occupied.add(card); }
    }
    st.selected = byId.has(st.selected) ? st.selected : '';
    st.order = Array.isArray(st.order) ? st.order.filter((id, i, a) => byId.has(id) && a.indexOf(id) === i) : [];
    if (st.order.length !== cards.length) {
      st.order = D.shuffle === false ? [...byId.keys()] : shuffle([...byId.keys()], String(D.id || key));
      // A seeded shuffle can accidentally present the complete solution. Avoid
      // that on a fresh equal-sized tray, while respecting explicit author order
      // and every saved tray. Accepted alternatives remain valid answers.
      if (D.shuffle !== false && cards.length === slots.length && slots.every((s, i) => s.accept.map(String).includes(st.order[i]))) {
        findSwap: for (let i = 0; i < st.order.length; i++) {
          for (let j = i + 1; j < st.order.length; j++) {
            if (!slots[i].accept.map(String).includes(st.order[j]) || !slots[j].accept.map(String).includes(st.order[i])) {
              [st.order[i], st.order[j]] = [st.order[j], st.order[i]];
              break findSwap;
            }
          }
        }
      }
    }
    const hints = Array.isArray(D.hint) && D.hint.length ? D.hint : D.hint && !Array.isArray(D.hint) ? [D.hint] : [
      { en: 'Read the observations before placing them. You can move any card and check again.', vi: 'Đọc các quan sát trước khi xếp. Bạn có thể chuyển bất kỳ thẻ nào rồi kiểm tra lại.' }
    ];
    st.hint = Math.max(-1, Math.min(Number.isInteger(st.hint) ? st.hint : -1, hints.length - 1));
    const matches = () => slots.filter(s => (s.accept || []).map(String).includes(st.assign[s.id])).length;
    st.checked = st.checked === true;
    st.ready = st.checked && matches() === slots.length;
    let done = false, shell, drag = null, ghost = null, ignoreClickUntil = 0, translationObserver, topObserver;
    let message = '', tone = '', popup = '', detailId = '', returnFocus = null;
    const live = () => !done && c.live();
    const persist = () => { if (live()) E.save(); };
    const label = id => E.nat(byId.get(id)?.label || {});
    const slotLabel = id => E.nat(slotById.get(id)?.label || {});
    const assignedSlot = id => slots.find(s => st.assign[s.id] === id)?.id;
    const messageSet = (text, kind = '') => { message = text; tone = kind; updateStatus(); };
    const cardArt = card => {
      if (card.item && E.S().items?.[card.item]) return E.itemArt(card.item, 'sm');
      const img = card.image || card.img || card.artAlias;
      return img ? '<span class="rc-image im-' + esc(img) + '" aria-hidden="true"></span>' : '<span class="rc-symbol">' + (E.ICON?.[card.icon] || icon('note')) + '</span>';
    };
    const button = (data, type, text) => '<button class="rc-icon" ' + data + ' aria-label="' + esc(text) + '" title="' + esc(text) + '">' + icon(type) + '</button>';
    const instruction = () => st.selected
      ? tr('Choose a place for: ', 'Chọn vị trí cho: ') + label(st.selected)
      : tr('Tap a card, then a place. You can also drag its handle.', 'Chạm một thẻ rồi chạm vị trí cần đặt. Bạn cũng có thể kéo nút chấm trên thẻ.');
    const completed = () => {
      if (!live()) return;
      c.resumeHere?.(false); done = true;
      // Save the ok frame before it runs; revisiting never injects it twice.
      if (!st.completed) { st.completed = true; if (Array.isArray(D.ok)) c.push('reconstruct', 'ok'); }
      E.save(); E.ui.clear(); resolve();
    };
    if (st.completed) { c.resumeHere?.(false); resolve(); return; }
    function updateStatus() {
      if (!shell) return;
      const status = shell.querySelector('.rc-status');
      status.textContent = message || instruction(); status.dataset.tone = tone;
      const count = Object.keys(st.assign).length;
      shell.querySelector('[data-rc-count]').textContent = count + '/' + slots.length + ' ' + tr('placed', 'đã đặt');
      const check = shell.querySelector('[data-rc-check]');
      check.innerHTML = icon(st.ready ? 'arrow' : 'check') + '<span>' + esc(st.ready ? tr('Use this arrangement', 'Dùng cách sắp xếp này') : tr('Check', 'Kiểm tra')) + '</span>';
      check.classList.toggle('ready', st.ready);
      shell.querySelector('[data-rc-reset]').disabled = !count;
      shell.querySelector('[data-rc-hint]').setAttribute('aria-expanded', String(popup === 'hint'));
      shell.querySelectorAll('[data-rc-select]').forEach(b => {
        const id = b.dataset.rcSelect, placed = assignedSlot(id);
        b.setAttribute('aria-pressed', String(st.selected === id));
        b.closest('.rc-card').classList.toggle('selected', st.selected === id);
        b.closest('.rc-card').classList.toggle('placed', !!placed);
        const badge = b.querySelector('.rc-placed'); badge.hidden = !placed;
        if (placed) badge.textContent = tr('Placed', 'Đã đặt');
      });
    }
    function renderSlots(focusId = '') {
      const area = shell.querySelector('.rc-slots'), y = area.scrollTop;
      area.innerHTML = slots.map((s, i) => {
        const id = String(s.id), cid = st.assign[id], card = byId.get(cid), feedback = st.checked && cid ? ((s.accept || []).map(String).includes(cid) ? ' supported' : ' review') : '';
        return '<article class="rc-slot' + (card ? ' filled' : '') + feedback + '" data-rc-slot-wrap="' + esc(id) + '"><button class="rc-drop" data-rc-slot="' + esc(id) + '" aria-label="' + esc(slotLabel(id) + (card ? ': ' + label(cid) : ': ' + tr('Empty', 'Chưa đặt'))) + '"><span class="rc-slot-head"><b class="rc-index" aria-hidden="true">' + (D.numbered === false ? '·' : i + 1) + '</b><span>' + bi(s.label) + '</span></span><span class="rc-slot-content">' + (card ? cardArt(card) + '<span>' + bi(card.label) + '</span>' : '<span class="rc-empty">' + esc(tr('Place a card here', 'Đặt thẻ vào đây')) + '</span>') + '</span></button>' + (card ? button('data-rc-remove="' + esc(id) + '"', 'close', tr('Remove ', 'Gỡ ') + label(cid)) : '') + '</article>';
      }).join('');
      area.scrollTop = y;
      if (focusId) [...area.querySelectorAll('[data-rc-slot]')].find(x => x.dataset.rcSlot === focusId)?.focus({ preventScroll: true });
      updateStatus();
    }
    function renderCards() {
      const tray = shell.querySelector('.rc-cards');
      tray.innerHTML = st.order.map(id => {
        const card = byId.get(id);
        return '<article class="rc-card" data-rc-card="' + esc(id) + '"><button class="rc-card-main" data-rc-select="' + esc(id) + '" aria-pressed="false">' + cardArt(card) + '<span class="rc-card-label">' + bi(card.label) + '</span><span class="rc-placed" hidden></span></button><div class="rc-card-tools">' + button('data-rc-drag="' + esc(id) + '"', 'move', tr('Drag or select ', 'Kéo hoặc chọn ') + label(id)) + button('data-rc-detail="' + esc(id) + '"', 'info', tr('Read ', 'Đọc ') + label(id)) + '</div></article>';
      }).join(''); updateStatus();
    }
    function renderPopup() {
      const host = shell.querySelector('.rc-popover'); host.hidden = !popup;
      if (!popup) { host.innerHTML = ''; updateStatus(); return; }
      const card = byId.get(detailId);
      host.innerHTML = '<header><b>' + esc(popup === 'hint' ? tr('A nudge', 'Một gợi ý') : tr('Read the card', 'Đọc thẻ')) + '</b>' + button('data-rc-popup-close', 'close', tr('Close', 'Đóng')) + '</header>' + (popup === 'hint'
        ? '<div class="rc-hint-text">' + bi(hints[Math.max(0, st.hint)]) + '</div>' + (st.hint < hints.length - 1 ? '<button class="rc-next-hint" data-rc-next-hint>' + esc(tr('Another nudge', 'Thêm một gợi ý')) + ' ' + icon('arrow') + '</button>' : '<p class="rc-last-hint">' + esc(tr('You can still move any card and try again.', 'Bạn vẫn có thể chuyển các thẻ rồi thử lại.')) + '</p>')
        : card ? '<div class="rc-detail-art">' + cardArt(card) + '</div><h3>' + bi(card.label) + '</h3><div class="rc-detail-copy">' + bi(card.detail || card.label) + '</div>' : '');
      host.scrollTop = 0; updateStatus();
    }
    function closePopup() {
      popup = ''; renderPopup();
      if (returnFocus?.isConnected) returnFocus.focus({ preventScroll: true });
      returnFocus = null;
    }
    function changed() { st.checked = false; st.ready = false; message = ''; tone = ''; }
    function assign(cid, sid) {
      if (!live() || !byId.has(cid) || !slotById.has(sid)) return;
      const previous = assignedSlot(cid), displaced = st.assign[sid];
      if (previous === sid) { st.selected = ''; updateStatus(); persist(); return; }
      if (previous) delete st.assign[previous]; st.assign[sid] = cid;
      // Placed-to-placed moves swap; a tray card returns the displaced card to the tray.
      if (previous && displaced && displaced !== cid) st.assign[previous] = displaced;
      st.selected = ''; changed(); renderSlots(sid);
      messageSet(tr('Placed ', 'Đã đặt ') + label(cid) + tr(' at ', ' vào ') + slotLabel(sid) + '.');
      E.sfx?.('tap'); persist();
    }
    function choose(cid) {
      st.selected = st.selected === cid ? '' : cid; message = ''; tone = '';
      updateStatus(); persist();
    }
    function check() {
      if (!live()) return;
      if (st.ready) return completed();
      const filled = Object.keys(st.assign).length;
      if (filled < slots.length) return messageSet(tr('Place a card in every space first. Nothing is lost if you change your mind.', 'Đặt thẻ vào các ô trước đã. Bạn có thể đổi lại mà không mất gì.'), 'notice');
      st.checked = true; st.ready = matches() === slots.length;
      if (st.ready) messageSet(tr('The arrangement fits the observations. Use it when you are ready.', 'Cách sắp xếp phù hợp với các quan sát. Khi sẵn sàng, hãy dùng nó.'), 'good');
      else messageSet((D.fail && !Array.isArray(D.fail) ? E.nat(D.fail) + ' ' : '') + tr('Review the amber spaces. The others fit; you can move any card.', 'Xem lại các ô màu hổ phách. Những ô còn lại đã phù hợp; bạn vẫn có thể chuyển mọi thẻ.'), 'notice');
      st.selected = ''; renderSlots(); persist();
    }
    function onClick(event) {
      if (!live() || performance.now() < ignoreClickUntil) return;
      const b = event.target.closest('button'); if (!b || !shell.contains(b)) return;
      if (b.hasAttribute('data-rc-select')) choose(b.dataset.rcSelect);
      else if (b.hasAttribute('data-rc-drag')) choose(b.dataset.rcDrag);
      else if (b.hasAttribute('data-rc-slot')) {
        const sid = b.dataset.rcSlot;
        if (st.selected) assign(st.selected, sid);
        else if (st.assign[sid]) choose(st.assign[sid]);
        else messageSet(tr('Choose a card below, then tap this space.', 'Chọn một thẻ bên dưới rồi chạm vào ô này.'));
      } else if (b.hasAttribute('data-rc-remove')) {
        const sid = b.dataset.rcRemove, cid = st.assign[sid]; delete st.assign[sid]; changed(); renderSlots(sid);
        messageSet(tr('Returned to the cards: ', 'Đã trả về khay thẻ: ') + label(cid)); persist();
      } else if (b.hasAttribute('data-rc-check')) check();
      else if (b.hasAttribute('data-rc-profile')) document.querySelector('.lf-hud')?.click();
      else if (b.hasAttribute('data-rc-reset')) { st.assign = {}; st.selected = ''; changed(); renderSlots(); persist(); }
      else if (b.hasAttribute('data-rc-hint')) {
        if (popup === 'hint') return closePopup();
        popup = 'hint'; if (st.hint < 0) st.hint = 0; returnFocus = b; renderPopup(); persist();
      } else if (b.hasAttribute('data-rc-next-hint')) { st.hint = Math.min(st.hint + 1, hints.length - 1); renderPopup(); persist(); }
      else if (b.hasAttribute('data-rc-popup-close')) closePopup();
      else if (b.hasAttribute('data-rc-detail')) { detailId = b.dataset.rcDetail; popup = 'detail'; returnFocus = b; renderPopup(); }
    }
    function onKey(event) {
      if (!live()) return;
      if (event.key === 'Escape') {
        event.preventDefault();
        if (popup) closePopup();
        else { cancelDrag(); st.selected = ''; message = ''; updateStatus(); persist(); }
      }
      if ((event.key === 'Delete' || event.key === 'Backspace') && event.target.hasAttribute('data-rc-slot')) {
        event.preventDefault(); const sid = event.target.dataset.rcSlot;
        if (st.assign[sid]) { delete st.assign[sid]; changed(); renderSlots(sid); persist(); }
      }
    }
    function onDown(event) {
      if (!live() || popup || event.button > 0 || drag) return;
      const grip = event.target.closest('[data-rc-drag]'); if (!grip) return;
      event.preventDefault();
      drag = { pointerId: event.pointerId, cid: grip.dataset.rcDrag, x: event.clientX, y: event.clientY, moved: false, grip };
      grip.setPointerCapture?.(event.pointerId);
    }
    function dropAt(x, y) {
      const hit = document.elementFromPoint(x, y)?.closest('[data-rc-slot]');
      return hit && shell.contains(hit) ? hit.dataset.rcSlot : '';
    }
    function onMove(event) {
      if (!live() || !drag || event.pointerId !== drag.pointerId) return;
      event.preventDefault();
      if (!drag.moved && Math.hypot(event.clientX - drag.x, event.clientY - drag.y) < 7) return;
      if (!drag.moved) {
        drag.moved = true; st.selected = drag.cid; updateStatus();
        ghost = document.createElement('div'); ghost.className = 'rc-drag-ghost'; ghost.setAttribute('aria-hidden', 'true');
        ghost.textContent = label(drag.cid); shell.appendChild(ghost);
      }
      ghost.style.left = event.clientX + 'px'; ghost.style.top = event.clientY + 'px';
      const sid = dropAt(event.clientX, event.clientY);
      shell.querySelectorAll('[data-rc-slot-wrap]').forEach(el => el.classList.toggle('drop-target', el.dataset.rcSlotWrap === sid));
      const area = shell.querySelector('.rc-slots'), rect = area.getBoundingClientRect();
      if (event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom) {
        if (event.clientY < rect.top + 32) area.scrollTop -= 12;
        else if (event.clientY > rect.bottom - 32) area.scrollTop += 12;
      }
    }
    function cancelDrag() {
      if (drag) { try { drag.grip.releasePointerCapture?.(drag.pointerId); } catch {} }
      drag = null; ghost?.remove(); ghost = null;
      shell?.querySelectorAll('.drop-target').forEach(el => el.classList.remove('drop-target'));
    }
    function onUp(event) {
      if (!live() || !drag || event.pointerId !== drag.pointerId) return;
      const { cid, moved } = drag, sid = moved ? dropAt(event.clientX, event.clientY) : '';
      cancelDrag(); ignoreClickUntil = performance.now() + 350;
      if (sid) assign(cid, sid);
      else if (!moved) choose(cid);
      else { st.selected = ''; messageSet(tr('No placement changed. You can tap a card and then a space instead.', 'Vị trí chưa thay đổi. Bạn cũng có thể chạm thẻ rồi chạm vào một ô.')); updateStatus(); persist(); }
    }
    function onCancel() {
      if (!drag) return; cancelDrag(); st.selected = ''; ignoreClickUntil = performance.now() + 350; updateStatus(); persist();
    }
    c.onExit?.(() => {
      done = true; cancelDrag(); translationObserver?.disconnect(); topObserver?.disconnect();
      if (shell) for (const [type, fn] of [['click', onClick], ['keydown', onKey], ['pointerdown', onDown], ['pointermove', onMove], ['pointerup', onUp], ['pointercancel', onCancel]]) shell.removeEventListener(type, fn);
    });
    E.ui.hideBox();
    E.ui.panel('<section class="rc-root"><header class="rc-head"><div class="rc-eyebrow"><span>' + esc(tr('RECONSTRUCT', 'SẮP XẾP MANH MỐI')) + '</span><span data-rc-count></span></div><div class="rc-title-row"><h2>' + bi(D.title || { en: 'Put the observations together', vi: 'Sắp xếp các quan sát' }) + '</h2>' + button('data-rc-hint', 'hint', tr('Hint', 'Gợi ý')) + '</div><p class="rc-prompt">' + bi(D.prompt || { en: 'Arrange only what the evidence establishes.', vi: 'Sắp xếp những điều chứng cứ đã xác nhận.' }) + '</p></header><div class="rc-work"><div class="rc-slots" role="group" aria-label="' + esc(tr('Places for cards', 'Các ô đặt thẻ')) + '"></div><section class="rc-tray"><h3>' + esc(tr('Your observations', 'Các quan sát của bạn')) + '</h3><div class="rc-cards" role="group" aria-label="' + esc(tr('Available cards', 'Các thẻ có thể đặt')) + '"></div></section></div><footer class="rc-footer"><p class="rc-status" role="status" aria-live="polite"></p><div class="rc-actions">' + button('data-rc-reset', 'reset', tr('Clear placements', 'Gỡ các thẻ đã đặt')) + '<button data-rc-check class="rc-check"></button></div></footer><aside class="rc-popover" aria-label="' + esc(tr('Card information and hints', 'Chi tiết thẻ và gợi ý')) + '" hidden></aside></section>', 'full reconstruct');
    shell = document.querySelector('.rc-root');
    const headTools = document.createElement('div'); headTools.className = 'rc-head-tools';
    headTools.appendChild(shell.querySelector('[data-rc-hint]'));
    // A story may expose a profile/stats button below the global toolbar. Keep
    // it available here without letting its floating hit box cover the puzzle.
    if (document.querySelector('.lf-hud')) { const profile = E.h(button('data-rc-profile', 'person', tr('Profile', 'Cá nhân'))); profile.classList.add('rc-profile'); headTools.appendChild(profile); }
    shell.querySelector('.rc-eyebrow').appendChild(headTools);
    const topEl = document.querySelector('.se-top'), panel = shell.parentElement;
    const topSize = () => { if (topEl?.getClientRects().length && panel?.isConnected) panel.style.setProperty('--rc-top', Math.max(55, Math.ceil(topEl.getBoundingClientRect().bottom + 7)) + 'px'); };
    topSize();
    if (topEl && typeof ResizeObserver !== 'undefined') { topObserver = new ResizeObserver(topSize); topObserver.observe(topEl); }
    renderCards(); renderSlots();
    for (const [type, fn] of [['click', onClick], ['keydown', onKey], ['pointerdown', onDown], ['pointermove', onMove], ['pointerup', onUp], ['pointercancel', onCancel]]) shell.addEventListener(type, fn);
    const translationButton = document.querySelector('.se-trall');
    if (translationButton && typeof MutationObserver !== 'undefined') {
      translationObserver = new MutationObserver(() => shell?.querySelectorAll('[data-rc-translation]').forEach(el => { el.hidden = !E.G().set.tr; }));
      translationObserver.observe(translationButton, { attributes: true, attributeFilter: ['class'] });
    }
    E.autoRun(() => {
      // Backtracking allows accepted alternatives without starving a later slot.
      const fill = (index, used, out) => {
        if (index === slots.length) return out;
        const s = slots[index];
        for (const id0 of s.accept) {
          const id = String(id0); if (!byId.has(id) || used.has(id)) continue;
          const found = fill(index + 1, new Set([...used, id]), { ...out, [s.id]: id }); if (found) return found;
        }
        return null;
      };
      const solution = fill(0, new Set(), {});
      if (!solution) throw new Error('reconstruct has no unique-card solution: ' + (D.id || key));
      st.assign = solution; st.checked = true; st.ready = true; completed();
    });
    persist();
  }));
})();
