/* Optional, non-punitive interview preparation on native choice.
   Native choice remains the only executor of once/cost/effects/voice/branches.
   This module sorts the questions and compares known records; it never guesses a lie. */
(() => {
  const E = globalThis.StoryEngine, esc = E.esc, original = E.mech.choice;
  const T = (en, vi) => ({ en, vi }), nat = t => E.nat(t);
  const read = (x, s) => typeof x === 'function' ? x(s) : x;
  const condition = (x, s) => x == null ? true : typeof x === 'function' ? !!x(s) : typeof x === 'string' ? !!s.f[x] || s.has(x) : !!x;
  const indexOf = (st, key) => Number.isInteger(key) ? key : st.choice.findIndex(o => o.id === key);
  const optionKey = (o, i) => o.id || String(i);
  const text = t => E.ui.investigationText ? E.ui.investigationText(t) : `<span class="se-ig-copy"><span lang="${esc(E.L)}">${esc(E.tgt(t))}</span>${E.sub(t) ? `<small data-ig-tr lang="${esc(E.N)}"${E.G().set.tr ? '' : ' hidden'}>${esc(E.sub(t))}</small>` : ''}</span>`;
  const labels = {
    calm: T('Calm', 'Nhẹ nhàng'), direct: T('Direct', 'Hỏi thẳng'),
    records: T('Records', 'Hồ sơ'), all: T('All questions', 'Mọi câu hỏi'),
    back: T('Back', 'Quay lại'), compare: T('Compare an account', 'Đối chiếu lời kể'),
    claim: T('One point to check', 'Một điều cần kiểm tra'),
    held: T('Records you have', 'Hồ sơ đang có'),
    ask: T('Review question', 'Xem câu hỏi'), asked: T('Already asked', 'Đã hỏi'),
    next: T('A question to follow up', 'Câu hỏi tiếp theo'),
    hint: T('A nudge', 'Gợi ý'), detail: T('Read the record', 'Đọc hồ sơ'),
    empty: T('You have no records to compare yet. You can return to the questions.', 'Bạn chưa có hồ sơ để đối chiếu. Có thể quay lại hỏi chuyện.'),
    filtered: T('No unanswered questions in this approach. Try another approach or show all questions.', 'Đã hỏi hết nhóm này. Bạn có thể đổi cách hỏi hoặc xem mọi câu hỏi.'),
    unknown: T('This record does not address that point. Choose another, or return to the questions.', 'Hồ sơ này chưa trả lời được điều đang kiểm tra. Bạn có thể chọn hồ sơ khác hoặc quay lại hỏi chuyện.'),
    help: T('Choose a way to ask, or compare one account with a record. You can change your mind before asking. These observations describe the exchange, not whether someone is lying.', 'Chọn cách hỏi, hoặc đối chiếu một lời kể với hồ sơ. Bạn có thể đổi ý trước khi hỏi. Phản hồi mô tả cuộc trò chuyện, không kết luận ai nói dối.'),
    observation: T('What changed in the exchange', 'Điều vừa thay đổi trong cuộc trò chuyện'),
    participation: T('Willingness to answer', 'Mức sẵn lòng trả lời'),
    tension: T('Observed tension', 'Vẻ căng thẳng quan sát được')
  };

  // Also usable by build tools/tests without starting an interaction.
  function validate(st, story = E.S()) {
    const errors = [], C = st?.interrogation, options = st?.choice || [];
    const validRef = ref => { const i = indexOf({ choice: options }, ref); return i >= 0 && i < options.length; };
    if (!C || typeof C !== 'object' || Array.isArray(C)) return ['interrogation needs an object'];
    if (!Array.isArray(st.choice)) return ['interrogation requires a native choice'];
    for (const k of ['approaches', 'always', 'claims', 'recordIds']) if (C[k] != null && !Array.isArray(C[k])) errors.push(k + ' needs an array');
    if (C.questions != null && (typeof C.questions !== 'object' || Array.isArray(C.questions))) errors.push('questions needs an object');
    if (errors.length) return errors;
    if (!C.id || typeof C.id !== 'string') errors.push('interrogation needs a stable id');
    if (C.who && !story?.chars?.[C.who]) errors.push('unknown interview character: ' + C.who);
    if (st.timer) errors.push('interrogation preparation cannot share a timed choice');
    const ids = new Set();
    for (const a of C.approaches || []) {
      if (!a || typeof a !== 'object' || Array.isArray(a)) { errors.push('approach needs an object'); continue; }
      if (!a.id || typeof a.id !== 'string' || ['all', 'records'].includes(a.id) || ids.has(a.id)) errors.push('approach id is missing, reserved or duplicated');
      ids.add(a?.id);
      if (!a?.label || !Array.isArray(a.questions) || !a.questions.length) errors.push('approach needs a label and questions');
      if (Array.isArray(a.questions)) for (const ref of a.questions) if (!validRef(ref)) errors.push('unknown approach question: ' + ref);
    }
    for (const id of C.recordIds || []) if (!story?.items?.[id]) errors.push('unknown interview record: ' + id);
    for (const ref of C.always || []) if (!validRef(ref)) errors.push('unknown always-visible question: ' + ref);
    for (const [ref, q] of Object.entries(C.questions || {})) {
      if (!validRef(ref)) errors.push('unknown reaction question: ' + ref);
      if (!q || typeof q !== 'object' || Array.isArray(q)) { errors.push('question reaction needs an object: ' + ref); continue; }
      if (q.reaction && q.complete == null) errors.push('reaction needs an explicit completion condition: ' + ref);
    }
    const claims = new Set();
    for (const claim of C.claims || []) {
      if (!claim || typeof claim !== 'object' || Array.isArray(claim)) { errors.push('claim needs an object'); continue; }
      if (!claim?.id || claims.has(claim.id)) errors.push('claim id is missing or duplicated');
      claims.add(claim?.id);
      if (!claim?.quote || !claim?.title) errors.push('claim needs a title and known words');
      if (claim.question != null && !validRef(claim.question)) errors.push('unknown follow-up question: ' + claim.question);
      if (claim.records != null && (typeof claim.records !== 'object' || Array.isArray(claim.records))) { errors.push('claim records needs an object'); continue; }
      for (const [id, result] of Object.entries(claim.records || {})) {
        if (!story?.items?.[id]) errors.push('unknown comparison record: ' + id);
        if (!result?.note) errors.push('comparison needs an explanation: ' + id);
      }
    }
    return errors;
  }
  E.interrogation = { validate };
  const setTr = E.ui.setTr;
  E.ui.setTr = (...args) => { const r = setTr(...args); document.querySelectorAll('[data-ig-tr]').forEach(el => { el.hidden = !E.G().set.tr; }); document.querySelectorAll('.se-ig-exit small:not(.se-lh)').forEach(el => { el.hidden = !E.G().set.tr && E.G().set.mode !== 'easy'; }); return r; };

  E.def('choice', c => {
    const C = c.st.interrogation;
    if (!C) return original(c);
    const errors = validate(c.st);
    if (errors.length) { console.warn('[story] interrogation metadata; using native choice', errors); return original(c); }
    const pending = original(c), box = document.querySelector('.se-ui > .se-panel.chs');
    // Native empty/skipIfOne/auto may already have moved on. Never intercept it.
    if (!box || (c.live && !c.live())) return pending;
    const R = E.R(), st = c.st, key = C.id, owner = c.key('interrogation');
    const runs = R.interrogations && typeof R.interrogations === 'object' && !Array.isArray(R.interrogations) ? R.interrogations : (R.interrogations = {});
    const old = runs[key], saved = runs[key] = old && typeof old === 'object' && !Array.isArray(old) ? old : {};
    saved.version = 1;
    saved.approach = (C.approaches || []).some(a => a.id === saved.approach) ? saved.approach : 'all';
    saved.history = Array.isArray(saved.history) ? saved.history.filter(x => C.questions?.[x]).slice(-12) : [];
    if (saved.pending) {
      const q = C.questions?.[saved.pending];
      if (q && condition(q.complete, E.state())) { saved.last = saved.pending; saved.history.push(saved.pending); saved.history = saved.history.slice(-12); }
      delete saved.pending;
    }
    if (!C.questions?.[saved.last]) delete saved.last;
    let disposed = false, selecting = false, sheet = null, suppressClose = false;
    const live = () => !disposed && !selecting && E.R() === R && (!c.live || c.live());
    const buttons = [...box.querySelectorAll('.se-chs > .se-ch-b[data-i]')];
    const buttonFor = ref => buttons.find(b => +b.dataset.i === indexOf(st, ref));
    const available = ref => { const b = buttonFor(ref); return b && !b.disabled && !b.classList.contains('off'); };
    const reaction = read(C.questions?.[saved.last]?.reaction, E.state()) || read(C.initial, E.state()) || {};
    const name = C.who ? E.cname(E.S().chars[C.who], true) : nat(C.title || T('Interview', 'Hỏi chuyện'));
    const head = E.h(`<div class="se-ig-head"><div class="se-ig-person"><b>${esc(name)}</b><button type="button" class="se-ig-help" data-ig-help aria-label="${esc(nat(labels.hint))}">?</button></div><div class="se-ig-state" aria-label="${esc(nat(labels.observation))}">${reaction.openness ? `<span title="${esc(nat(labels.participation))}">${esc(nat(reaction.openness))}</span>` : ''}${reaction.tension ? `<span title="${esc(nat(labels.tension))}">${esc(nat(reaction.tension))}</span>` : ''}</div>${reaction.note ? `<p class="se-ig-reaction" role="status">${esc(nat(reaction.note))}</p>` : ''}<div class="se-ig-approaches" role="group" aria-label="${esc(nat(T('Ways to ask', 'Cách hỏi')))}">${(C.approaches || []).map(a => `<button type="button" data-ig-approach="${esc(a.id)}" aria-pressed="false">${esc(nat(a.label))}</button>`).join('')}${C.claims?.length ? `<button type="button" data-ig-records>${esc(nat(labels.records))}</button>` : ''}</div><div class="se-ig-tools"><button type="button" data-ig-all aria-pressed="true">${esc(nat(labels.all))}</button><span class="se-ig-count" aria-live="polite"></span></div><p class="se-ig-helptext" hidden></p></div>`);
    box.classList.add('se-interrogation'); box.dataset.interrogation = key;
    // Keep the native last reply, including its dictionary words, in a compact
    // disclosure within the scrolling list rather than losing that VN feature.
    const lastQuote = box.querySelector(':scope > .se-q');
    box.querySelector(':scope > .se-ask')?.setAttribute('hidden', '');
    box.prepend(head);
    const list = box.querySelector('.se-chs'), empty = E.h('<p class="se-ig-empty" role="status" hidden></p>');
    if (lastQuote) {
      const last = E.h(`<details class="se-ig-last"><summary>${esc(nat(T('Last reply', 'Lời vừa nói')))}</summary></details>`);
      last.append(lastQuote); list.prepend(last);
    }
    empty.textContent = nat(labels.filtered); list.append(empty);
    const foot = E.h('<div class="se-ig-exit"></div>');
    for (const ref of C.always || []) { const b = buttonFor(ref); if (b) foot.append(b); }
    if (foot.children.length) box.append(foot);
    function applyApproach(reset = false) {
      const a = (C.approaches || []).find(x => x.id === saved.approach), wanted = a ? new Set(a.questions.map(ref => indexOf(st, ref))) : null;
      let count = 0;
      for (const b of buttons) {
        if (foot.contains(b)) continue;
        b.hidden = !!wanted && !wanted.has(+b.dataset.i);
        if (!b.hidden) count++;
      }
      for (const b of buttons) b.classList.toggle('se-ig-prepared', saved.prepared != null && +b.dataset.i === indexOf(st, saved.prepared));
      const prepared = saved.prepared != null && available(saved.prepared) ? buttonFor(saved.prepared) : null;
      if (prepared && !foot.contains(prepared)) list.prepend(prepared);
      empty.hidden = !!count;
      head.querySelectorAll('[data-ig-approach]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.igApproach === saved.approach)));
      head.querySelector('[data-ig-all]').setAttribute('aria-pressed', String(!a));
      head.querySelector('.se-ig-count').textContent = nat(T(`${count} remaining`, `Còn ${count} câu`));
      if (reset) list.scrollTop = 0;
    }
    function remember() { if (live()) E.save(); }
    function choose(ref) {
      if (!live() || !available(ref)) return;
      const b = buttonFor(ref);
      closeComparison();
      // The full wording must be visible before committing a question. A small
      // phone may have scrolled the comparison's preview out of sight.
      saved.approach = 'all'; saved.prepared = ref; applyApproach();
      b.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'instant' });
      b.focus({ preventScroll: true }); remember();
    }
    function closeComparison() {
      saved.view = 'questions';
      if (sheet && !sheet.hidden && sheet.dataset.igOwner === owner) E.ui.closeSheet();
      sheet = null;
    }
    function openComparison() {
      if (!live() || E.auto) return;
      const claims = (C.claims || []).filter(x => condition(x.if, E.state()));
      if (!claims.length) return;
      if (!claims.some(x => x.id === saved.claim)) saved.claim = claims[0].id;
      saved.view = 'records';
      sheet = E.ui.sheet(nat(labels.compare), '<div class="se-ig-scroll"></div><div class="se-ig-compare-foot"></div>', 'tall se-ig-sheet');
      sheet.dataset.igOwner = owner;
      sheet.onclose = () => { if (!suppressClose) { saved.view = 'questions'; remember(); } };
      const scroll = sheet.querySelector('.se-ig-scroll'), footer = sheet.querySelector('.se-ig-compare-foot');
      function draw(reset = false) {
        if (!live() || sheet.hidden || sheet.dataset.igOwner !== owner) return;
        const claim = claims.find(x => x.id === saved.claim), ids = R.items.filter(id => E.S().items[id] && (!C.recordIds || C.recordIds.includes(id)));
        if (!ids.includes(saved.record)) delete saved.record;
        const record = E.S().items[saved.record], outcome = record && claim.records?.[saved.record];
        const next = claim.question != null && st.choice[indexOf(st, claim.question)];
        scroll.innerHTML = `<label class="se-ig-claim-select"><span>${esc(nat(labels.claim))}</span><select aria-label="${esc(nat(labels.claim))}">${claims.map(x => `<option value="${esc(x.id)}"${x.id === claim.id ? ' selected' : ''}>${esc(nat(x.title))}</option>`).join('')}</select></label><blockquote class="se-ig-quote">${text(claim.quote)}${claim.source ? `<cite>${esc(nat(claim.source))}</cite>` : ''}</blockquote>${record ? `<article class="se-ig-selected"><div class="se-ig-record-title">${E.itemArt?.(saved.record, 'sm') || ''}<b>${text(record.name)}</b></div><div class="se-ig-explanation" role="status">${text(outcome?.note || claim.unrelated || labels.unknown)}</div><button type="button" class="se-btn" data-ig-read>${esc(nat(labels.detail))}</button></article>` : ''}${next && record ? `<div class="se-ig-follow"><small>${esc(nat(labels.next))}</small><p>${text(next)}</p></div>` : ''}<p class="se-ig-inline-hint" role="status" hidden></p><h3>${esc(nat(labels.held))}</h3><div class="se-ig-record-list">${ids.map(id => `<button type="button" data-ig-record="${esc(id)}" aria-pressed="${id === saved.record}">${E.itemArt?.(id, 'sm') || ''}<span>${text(E.S().items[id].name)}</span></button>`).join('')}</div>${!ids.length ? `<p class="se-ig-empty">${text(labels.empty)}</p>` : ''}`;
        scroll.querySelector('.se-ig-selected')?.prepend(E.h(`<small class="se-ig-checking">${esc(nat(claim.title))}</small>`));
        footer.innerHTML = `<button type="button" class="se-btn" data-ig-back>${E.ICON?.back || '‹'}<span>${esc(nat(labels.back))}</span></button><button type="button" class="se-ig-help" data-ig-hint aria-label="${esc(nat(labels.hint))}">?</button>${record && next ? `<button type="button" class="se-btn pri" data-ig-ask${available(claim.question) ? '' : ' disabled'}>${esc(nat(available(claim.question) ? labels.ask : labels.asked))}</button>` : ''}`;
        if (reset) scroll.scrollTop = 0;
        // A short landscape sheet cannot fit the claim and a whole result at
        // once. Put the newly selected record/explanation in the visible area.
        if (reset === 'record') {
          const selected = scroll.querySelector('.se-ig-selected');
          if (selected) scroll.scrollTop = Math.max(0, selected.getBoundingClientRect().top - scroll.getBoundingClientRect().top - 6);
        }
      }
      const change = e => {
        if (!live() || !e.target.matches('.se-ig-claim-select select')) return;
        saved.claim = e.target.value; delete saved.record; draw(true); remember();
      };
      sheet.addEventListener('change', change);
      const click = e => {
        if (!live()) return;
        const b = e.target.closest('button'); if (!b) return;
        if (b.hasAttribute('data-x')) return;
        const claim = claims.find(x => x.id === saved.claim);
        if (b.hasAttribute('data-ig-back')) { closeComparison(); remember(); }
        else if (b.dataset.igRecord) { saved.record = b.dataset.igRecord; draw('record'); remember(); }
        else if (b.hasAttribute('data-ig-read')) E.ui.itemView?.(saved.record);
        else if (b.hasAttribute('data-ig-ask')) choose(claim.question);
        else if (b.hasAttribute('data-ig-hint')) {
          const hint = scroll.querySelector('.se-ig-inline-hint');
          hint.innerHTML = text(claim.hint || C.hint || labels.help); hint.hidden = false;
          scroll.prepend(hint); scroll.scrollTop = 0;
        }
      };
      sheet.addEventListener('click', click);
      // A shared native sheet is reused; remove this session's handlers on close.
      const onclose = sheet.onclose, sh = sheet;
      sheet.onclose = () => { sh.removeEventListener('click', click); sh.removeEventListener('change', change); if (sh.dataset.igOwner === owner) delete sh.dataset.igOwner; if (sheet === sh) sheet = null; onclose?.(); };
      draw(saved.record ? 'record' : true); remember();
    }
    function capture(e) {
      if (!live() || e.target.closest('[data-hear]')) return;
      const b = e.target.closest('.se-ch-b[data-i]');
      if (!b || b.disabled || !box.contains(b)) return;
      const i = +b.dataset.i, ref = optionKey(st.choice[i], i);
      selecting = true;
      if (C.questions?.[ref]) saved.pending = ref;
      delete saved.prepared;
      saved.view = 'questions';
      // Do not prevent or re-dispatch: the native handler executes exactly once.
    }
    function controls(e) {
      if (!live()) return;
      const b = e.target.closest('button'); if (!b) return;
      if (b.dataset.igApproach) { saved.approach = b.dataset.igApproach; applyApproach(true); remember(); }
      else if (b.hasAttribute('data-ig-all')) { saved.approach = 'all'; applyApproach(true); remember(); }
      else if (b.hasAttribute('data-ig-records')) openComparison();
      else if (b.hasAttribute('data-ig-help')) {
        const p = head.querySelector('.se-ig-helptext'); p.textContent = [st.prompt, C.hint || labels.help].filter(Boolean).map(nat).join('\n\n'); p.hidden = !p.hidden;
      }
    }
    box.addEventListener('click', capture, true); head.addEventListener('click', controls);
    const clean = () => {
      if (disposed) return; disposed = true;
      box.removeEventListener('click', capture, true); head.removeEventListener('click', controls);
      if (sheet && !sheet.hidden && sheet.dataset.igOwner === owner) { suppressClose = true; E.ui.closeSheet(); }
    };
    (c.onExit || c.onCancel)?.(clean);
    applyApproach();
    if (saved.view === 'records') openComparison();
    return Promise.resolve(pending).finally(clean);
  });
})();
