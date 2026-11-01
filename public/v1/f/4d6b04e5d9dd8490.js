/* Vale 0.9.2 — acknowledge a document already read without a second modal.
 * Only these authored read → record pairs opt in. The record is still granted,
 * saved and emitted by the engine, and its complete text remains in the book.
 * No story steps, words, conditions, IDs or array positions are changed.
 */
(() => {
  'use strict';
  const E = StoryEngine;
  const pairs = {
    'vale-dossiers-part2-v01': [
      { item: 'p2_order', path: ['nodes', 'p2c1_open'], read: 20, grant: 21 },
      { item: 'p2_income', path: ['nodes', 'p2c3_open', 8, 'then'], read: 3, grant: 4 },
      { item: 'p2_income', path: ['nodes', 'p2c3_open', 24, 'then'], read: 3, grant: 4 },
      { item: 'p2_intervention', path: ['nodes', 'p2c5_intervene'], read: 10, grant: 11 },
      { item: 'p2_medical', path: ['nodes', 'p2c6_open'], read: 10, grant: 11 },
      { item: 'p2_repairs', path: ['talks', 'p2c2_owen', 'topics', 0, 'then'], read: 3, grant: 4 },
      { item: 'p2_repairs', path: ['talks', 'p2c2_ruth', 'topics', 0, 'then'], read: 1, grant: 2 }
    ],
    'vale-dossiers-part3-v01': [
      { item: 'p3_meal', path: ['nodes', 'p3c1_open', 20, 'then'], read: 1, grant: 2 },
      { item: 'p3_head_report', path: ['nodes', 'p3c2_open'], read: 35, grant: 36 },
      { item: 'p3_quill_account', path: ['nodes', 'p3c3_open'], read: 8, grant: 9 },
      { item: 'p3_flock', path: ['nodes', 'p3c4_open'], read: 18, grant: 19 },
      { item: 'p3_bill', path: ['nodes', 'p3c4_open', 8, 'explore', 'spots', 0, 'then'], read: 0, grant: 3 },
      { item: 'p3_private_ledger', path: ['nodes', 'p3c4_open', 8, 'explore', 'spots', 1, 'then'], read: 0, grant: 3 },
      { item: 'p3_meal', path: ['talks', 'p3c1_nora', 'topics', 0, 'then'], read: 1, grant: 2 }
    ]
  };
  const normalize = value => String(value || '').replace(/\s+/g, ' ').trim();
  const text = (value, language) => Array.isArray(value)
    ? value.map(line => text(line, language)).join(' ')
    : typeof value === 'object' && value ? value[language] || '' : '';
  function install() {
    const S = E.S();
    for (const pair of pairs[S?.id] || []) {
      const steps = pair.path.reduce((value, key) => value?.[key], S);
      const st = steps?.[pair.grant], spec = steps?.[pair.read]?.read;
      const doc = typeof spec === 'string' ? S.docs?.[spec] || S.items?.[spec]?.doc : spec;
      const item = S.items?.[pair.item];
      if (st?.item !== pair.item || !doc?.lines || (item?.recordType || item?.kind) !== 'document') continue;
      // If later authoring changes either language, retain the ordinary reveal.
      // A shared title or evidence ID alone is not proof of a repeated read.
      if (['en', 'vi'].every(language => {
        const read = normalize(text(doc.lines, language));
        return read && read === normalize(text(item.document?.text, language));
      })) st.receipt = true;
    }
  }
  E.on('boot', install);
  E.on('chapter', install);
})();
