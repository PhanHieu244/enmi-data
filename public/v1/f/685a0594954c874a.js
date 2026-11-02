/* Between Tides presentation metadata on the shared engine 1.0.4.
 * Approved record art and the ten final outcomes are story-specific. Native
 * inventory, record ownership, overview actions and ending awards are unchanged.
 */
(() => {
  'use strict';
  const E = globalThis.StoryEngine;
  if (!E?.plugin || E.plugins?.['bt-native-v104-presentation']) return;
  const ours = () => E.S()?.id === 'between-tides';
  const endings = [
    ['e1_tides','E1 · Between Tides','E1 · Giữa hai con nước'],
    ['e2_low_water','E2 · Low Water','E2 · Nước ròng'],
    ['e3_half_truth','E3 · Half the Truth','E3 · Nửa sự thật'],
    ['e4_stranger','E4 · The Outsider','E4 · Người ngoài'],
    ['e5_envelope','E5 · The Envelope','E5 · Phong bì'],
    ['e6_ampoules','E6 · The Ampoules','E6 · Những ống thuốc'],
    ['e7_sand','E7 · Sand','E7 · Cát'],
    ['e8_refuge','The Refuge Box','Chòi trú nạn'],
    ['e9_mercy','E9 · Mercy','E9 · Lòng thương'],
    ['e10_keeper','E10 · The Keeper','E10 · Người gác nước'],
  ];
  // The native record filters accept this metadata hook. Keep the approved
  // BT classification while the shared engine owns the candidate set and UI.
  const previousMeta = E.evidenceMeta;
  E.evidenceMeta = id => {
    if (!ours()) return previousMeta?.(id);
    const item = E.S().items?.[id] || {}, raw = item.recordType || item.kind || 'observation';
    const type = raw === 'document' ? 'object' : ['object','testimony','inference','observation'].includes(raw) ? raw : 'observation';
    return { type, group: type === 'testimony' ? 'testimony' : type === 'inference' ? 'inference' : 'objects',
      who: item.who || '', chapter: +item.chapter || +(String(id).match(/^c(\d)_/)?.[1]) || 1,
      brief: item.brief || item.desc, sourceLabel: item.sourceLabel || item.source };
  };
  const nativeArt = E.itemArt;
  E.itemArt = function (id, cls = '') {
    const item = ours() && E.S().items?.[id];
    // Native inference-art guard still wraps this delegate. The remaining
    // records use their already-approved image, rather than a guessed filename.
    const art = item?.art || (item?.recordType === 'testimony' && (item.portrait || item.who));
    if (!art) return nativeArt.call(this, id, cls);
    return `<span class="se-ia ${E.esc(cls)}" aria-hidden="true"><i class="im-${E.esc(art)}"></i></span>`;
  };
  const decorateEndingCount = () => {
    if (!ours()) return;
    const row = document.querySelector('.se-panel.ov .se-ovend1');
    if (!row) return;
    const unlocked = endings.filter(([id]) => E.G().endings?.[id]);
    row.querySelector('em').textContent = `${unlocked.length}/${endings.length}`;
    row.querySelector('.se-ovdots').innerHTML = endings.map(([id]) => `<u class="${E.G().endings?.[id] ? 'on' : ''}"></u>`).join('');
    row.querySelector('small').textContent = unlocked.length
      ? unlocked.slice(-2).map(([id, en, vi]) => E.nat(E.S().endings?.[id]?.title || { en, vi })).join(' · ')
      : E.nat({ en: 'None yet', vi: 'Chưa có' });
  };
  const overview = E.ui.title;
  E.ui.title = function (...args) {
    const result = overview.apply(this, args);
    decorateEndingCount();
    return result;
  };
  E.plugin({ id: 'bt-native-v104-presentation', on: { boot() {
    if (!ours()) return;
    // These supported options were already enabled by the approved bt-mobile.
    Object.assign(E.S(), { transientHints: true, recordPresentation: 'compact', inspectionZoom: false, collapsibleObjectives: true, recordReceipts: true });
    decorateEndingCount();
  } } });
})();
