/* Compact native receipts for free-form notes. Full text stays in R.jot. */
(() => {
  'use strict';
  const E = globalThis.StoryEngine, nativeNote = E?.mech?.note;
  if (!E?.plugin || !nativeNote || E.plugins?.['bt-record-receipts']) return;
  const tr = (en, vi) => E.esc(E.nat({ en, vi }));
  E.plugin({ id: 'bt-record-receipts', mechs: {
    async note(c) {
      if (E.S()?.id !== 'between-tides' || E.S().recordPresentation !== 'compact') return nativeNote(c);
      // Delegate the append/dot to native exactly once, suppress only its
      // legacy full-paragraph toast. No story object or save cursor is changed.
      const result = await nativeNote({ ...c, st: { ...c.st, quiet: true } });
      if (c.st.quiet || E.auto || c.live?.() === false) return result;
      const el = E.ui.toast(`<div class="bt-note-row"><button type="button" class="bt-note-open" data-bt-note-open>${E.ICON.pen}<span><b>${tr('Note saved', 'Đã lưu ghi chú')}</b><small>${tr('Open notes', 'Mở ghi chú')}</small></span></button><button type="button" class="se-record-dismiss" data-bt-note-dismiss aria-label="${tr('Dismiss notification', 'Đóng thông báo')}">×</button></div>`, 2200, 'receipt bt-note-receipt');
      if (el) el.onclick = event => {
        event.preventDefault(); event.stopPropagation();
        if (event.target.closest('[data-bt-note-dismiss]')) { el.remove(); return; }
        if (!event.target.closest('[data-bt-note-open]')) return;
        el.remove(); E.hush(); E.ui.book();
        document.querySelector('.se-sheet [data-jot]')?.click();
      };
      return result;
    },
  } });
})();
