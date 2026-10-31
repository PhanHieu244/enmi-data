/* Ordinary client conversations use the native visual-novel question list.
   Advanced preparation/comparison remains opt-in through the engine's
   `interrogation` metadata, for a later confrontation that actually needs it.
   Do not reorder questions or replace their IDs, branches or once flags:
   older C1 saves must resume the same authored conversation. */
(() => {
  const E = StoryEngine;
  const install = () => {
    const S = E.S();
    if (S?.id !== 'vale-dossiers-p1c1-v01') return;
    const step = S.nodes?.c1_questions?.[0];
    if (step?.interrogation?.id === 'c1-matthias') delete step.interrogation;
  };
  E.on('boot', install);
  E.on('chapter', install);
})();
