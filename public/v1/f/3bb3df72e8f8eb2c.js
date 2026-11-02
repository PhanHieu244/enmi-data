/* Between Tides: compact controls on the shared 1.0.4 reading surfaces.
 * Only decoration and reading APIs are used. Native mechanics retain every
 * selection, reward, close action and continuation owner.
 */
(() => {
  'use strict';
  const E = globalThis.StoryEngine;
  if (!E?.plugin || E.plugins?.['bt-native-v104-ui']) return;
  const ours = () => E.S()?.id === 'between-tides';
  const root = () => document.querySelector('.se');
  const label = (en, vi) => E.nat({ en, vi });
  let observer, frame = 0, disposeScroll = () => {};

  // Shared detail ownership is left intact. Only exact authored visible text
  // gains a local reading scope; an image-only beat invents no caption/reader.
  const nativeDetail = E.ui.detailView;
  E.ui.detailView = async function (spec, context) {
    const element = await nativeDetail.call(this, spec, context);
    if (!ours() || !element?.isConnected || context?.live?.() === false) return element;
    const value = typeof spec === 'string' ? { art: spec } : spec;
    const insert = element.querySelector('.se-action-insert');
    const fresh = !element.hasAttribute('data-bt-detail-reading');
    const spoken = context?.st?.n || context?.st?.think || (context?.st?.say ? context.st : null);
    if (spoken) insert.querySelector('[role="img"]')?.setAttribute('aria-label', E.tgt(spoken).replace(/\[\[|\]\]/g, ''));
    let hasText = false;
    for (const key of ['title', 'caption']) {
      const target = insert.querySelector('.se-detail-' + key);
      if (!target || !value?.[key]) continue;
      target.innerHTML = E.ui.readingText(value[key], { compact: true });
      hasText = true;
    }
    if (hasText && !insert.querySelector('[data-reading-toggle]')) {
      insert.insertAdjacentHTML('beforeend', E.ui.readingToggle());
      insert.querySelector('[data-reading-toggle]').classList.add('bt-corner-reading');
    }
    if (hasText || !fresh) {
      element.dataset.btDetailReading = '';
      E.ui.bindReading(element, fresh ? { native: false } : {});
    }
    return element;
  };

  // The native item viewer already owns dismissal and combining. Render its
  // existing name/description through the shared replacement-text API.
  const nativeItem = E.ui.itemView;
  E.ui.itemView = function (id, ...args) {
    const result = nativeItem.call(this, id, ...args);
    if (!ours()) return result;
    const item = E.S().items?.[id], modal = root()?.querySelector('.se-iv:not(.se-record-modal)');
    const card = modal?.querySelector('.se-ivc');
    if (!item || !card || card.querySelector('.bt-item-tools')) return result;
    const title = card.querySelector(':scope > b'), description = card.querySelector(':scope > p');
    if (title) title.innerHTML = E.ui.readingText(item.name, { compact: true });
    if (description) description.innerHTML = E.ui.readingText(item.desc, { compact: true });
    const tools = document.createElement('header');
    tools.className = 'bt-item-tools';
    tools.innerHTML = E.ui.readingToggle() + `<button type="button" class="se-ib" aria-label="${E.esc(label('Close', 'Đóng'))}">${E.ICON.x}</button>`;
    card.prepend(tools);
    E.ui.bindReading(modal);
    return result;
  };

  const pending = () => {
    const frame = E.R()?.stack?.at(-1);
    return frame && E.walk?.(frame)?.[frame.i - 1];
  };
  const textInto = (element, value) => { element.innerHTML = E.ui.readingText(value, { compact: true }); };
  const decorateAuthoredTask = host => {
    const step = pending(), panel = host.querySelector('.se-panel');
    if (!step || !panel) return;
    // Only the two released ordering prompts. The native single-button
    // translation control still owns its order array, redraw and preference.
    const orders = [E.S().nodes?.c2_wait?.[46], E.S().nodes?.c4_cottage?.[34]];
    if (orders.includes(step) && panel.classList.contains('orderp')) {
      const title = panel.querySelector('.se-askr > span:first-child');
      const toggle = panel.querySelector('[data-trv]');
      if (title && toggle && !title.hasAttribute('data-bt-authored-reading')) {
        title.dataset.btAuthoredReading = '';
        textInto(title, step.order.prompt);
        E.ui.bindReading(panel, { native: toggle.getAttribute('aria-pressed') === 'true' });
      }
      return;
    }
    // The one BT theory has three authored lines whose EN/VI placeholders
    // have the same order. Decorate text around the existing native buttons;
    // never replace their IDs/nodes or the engine's selection/answer handlers.
    if (step !== E.S().nodes?.c1_bell?.[54] || !panel.classList.contains('theory')) return;
    const form = panel.querySelector('.lf-th'), T = step.theory;
    if (!form || form.hasAttribute('data-bt-authored-reading')) return;
    const rows = [...form.querySelectorAll('.lf-tl')];
    if (rows.length !== T.lines.length) return;
    const words = new Map(T.words.map(word => [word.id, word]));
    const parts = rows.map((row, index) => {
      const primary = E.tgt(T.lines[index]).split(/\[(\w+)\](?!\])/g);
      const secondary = (E.sub(T.lines[index]) || E.tgt(T.lines[index])).split(/\[(\w+)\](?!\])/g);
      const buttons = [...row.querySelectorAll(':scope > [data-b]')];
      const slots = primary.filter((_, i) => i % 2);
      if (primary.length !== secondary.length || slots.some((id, i) => id !== secondary[i * 2 + 1] || id !== buttons[i]?.dataset.b) || buttons.length !== slots.length) return null;
      const labels = buttons.map(button => {
        if (!button.classList.contains('on')) return T.kinds?.[words.get(T.answer[button.dataset.b])?.kind];
        const candidates = T.words.filter(word => E.tgt(word) === button.textContent);
        return candidates.length === 1 ? candidates[0] : null;
      });
      return labels.every(Boolean) ? { row, primary, secondary, buttons, labels } : null;
    });
    if (parts.some(part => !part)) return; // Unsupported text/slot order stays native.
    form.dataset.btAuthoredReading = '';
    const heading = form.querySelector('.se-ddh');
    textInto(heading.querySelector('small'), T.title);
    heading.insertAdjacentHTML('beforeend', E.ui.readingToggle());
    for (const { row, primary, secondary, buttons, labels } of parts) {
      const duplicate = row.nextElementSibling;
      const nodes = primary.map((text, i) => i % 2 ? buttons[(i - 1) / 2]
        : E.h(E.ui.readingText(null, { primary: text, secondary: secondary[i], compact: true })));
      buttons.forEach((button, i) => textInto(button, labels[i]));
      row.replaceChildren(...nodes);
      if (duplicate?.classList.contains('sp-sub')) duplicate.remove();
    }
    for (const button of form.querySelectorAll('.lf-w[data-w]')) {
      const word = words.get(button.dataset.w);
      if (word) textInto(button, word);
    }
    for (const group of form.querySelectorAll('.lf-grp')) {
      const label = group.querySelector('em'), word = words.get(group.querySelector('[data-w]')?.dataset.w);
      if (label && T.kinds?.[word?.kind]) textInto(label, T.kinds[word.kind]);
    }
    E.ui.bindReading(panel); // Existing panel scope keeps its local choice on redraw.
  };

  const decorate = () => {
    frame = 0;
    if (!ours()) return;
    const host = root();
    if (!host) return;
    decorateAuthoredTask(host);
    for (const sheet of host.querySelectorAll('.se-sheet')) {
      const header = sheet.querySelector('.se-shh');
      if (!header) continue;
      // Move the existing button within its same native reading owner.
      const toggle = [...sheet.querySelectorAll('[data-reading-toggle]')].find(button => button.closest('[data-reading-scope]') === sheet);
      if (toggle && toggle.parentElement !== header) header.prepend(toggle);
    }
    for (const reader of host.querySelectorAll('.se-read')) {
      const toggle = reader.querySelector('.rd-bar [data-tr]'), paper = reader.querySelector('.rd-p');
      if (toggle && paper) {
        toggle.classList.add('bt-corner-reading');
        paper.prepend(toggle);
      }
    }
    for (const receipt of host.querySelectorAll('.se-rev')) {
      const toggle = receipt.querySelector('.rv-b [data-reading-toggle]'), card = receipt.querySelector('.rv-c');
      if (toggle && card) {
        toggle.classList.add('bt-corner-reading');
        card.prepend(toggle);
      }
    }
    const box = host.querySelector('.se-box'), toggle = box?.querySelector('[data-a="tr"]'), secondary = box?.querySelector('.se-sub');
    if (toggle && secondary) {
      const native = !secondary.hidden && !!secondary.textContent;
      toggle.setAttribute('aria-pressed', String(native));
      toggle.setAttribute('aria-label', label(native ? 'Hide translation' : 'Show translation', native ? 'Ẩn bản dịch' : 'Hiện bản dịch'));
    }
  };
  const schedule = () => { if (!frame) frame = requestAnimationFrame(decorate); };

  E.plugin({ id: 'bt-native-v104-ui', on: {
    boot() {
      if (!ours()) return;
      const host = root(), settings = E.G().set;
      host.classList.add('vd', 'bt-native-v104');
      // Let shared detail/action layout measure the real notification lane.
      // This replaces the old picture fitter's private obstruction maths.
      host.querySelector('.se-lane')?.setAttribute('data-stage-obstruction', 'top');
      // English is the first-use default. Existing and imported explicit
      // language/translation preferences remain the player's choice.
      if (!settings.bt104ReadingDefaults) {
        settings.bt104ReadingDefaults = true;
        if (!E.btPersistence?.hasSavedPreferences?.()) {
          settings.mode = 'imm';
          E.ui.setTr(false);
        }
      }
      const box = host.querySelector('.se-box'), tools = box.querySelector('.se-tools');
      const oldMore = tools.querySelector('.se-more');
      if (oldMore && oldMore.tagName !== 'BUTTON') {
        const more = document.createElement('button');
        more.type = 'button'; more.className = oldMore.className;
        more.innerHTML = oldMore.innerHTML;
        more.setAttribute('aria-label', label('Continue', 'Tiếp tục'));
        more.title = label('Continue', 'Tiếp tục');
        oldMore.replaceWith(more); // The shared root handler receives its click.
      }
      if (!tools.querySelector('[data-a="log"]')) {
        const history = document.createElement('button');
        history.type = 'button'; history.dataset.a = 'log';
        history.className = 'bt-history-shortcut';
        history.setAttribute('aria-label', label('Read recent dialogue again', 'Đọc lại lời thoại vừa qua'));
        history.title = history.getAttribute('aria-label');
        history.innerHTML = E.ICON.log;
        tools.querySelector('.se-more')?.before(history);
      }
      // Preserve the approved no-advance-on-scroll gesture guard. The shared
      // engine continues to own all clicks that are actual continuation input.
      disposeScroll();
      const abort = new AbortController();
      let press = null, moved = false;
      box.addEventListener('pointerdown', event => { press = [event.clientX, event.clientY, box.querySelector('.se-txt').scrollTop]; moved = false; }, { passive: true, signal: abort.signal });
      box.addEventListener('pointermove', event => { if (press && (Math.abs(event.clientX - press[0]) + Math.abs(event.clientY - press[1]) > 12 || Math.abs(box.querySelector('.se-txt').scrollTop - press[2]) > 3)) moved = true; }, { passive: true, signal: abort.signal });
      box.addEventListener('pointercancel', () => { press = null; moved = true; }, { signal: abort.signal });
      box.addEventListener('click', event => { if (moved) { event.stopPropagation(); moved = false; } press = null; }, { capture: true, signal: abort.signal });
      disposeScroll = () => abort.abort();
      observer?.disconnect();
      observer = new MutationObserver(schedule);
      observer.observe(host, { childList: true, subtree: true, attributes: true, attributeFilter: ['hidden'] });
      decorate();
    },
    line: schedule,
  } });
})();
