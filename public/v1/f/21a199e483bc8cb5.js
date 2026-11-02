/* Between Tides d4b · presentation-only spatial authoring.
 * Map coordinates express adjacency, not survey distances or compass bearings.
 * Old place/view/zone IDs and source arrays remain intact. New views are optional
 * doorway viewpoints; they have native fallbacks even when new art is disabled.
 */
(() => {
  'use strict';
  const T = (en, vi) => ({ en, vi });
  globalThis.BT_D4_SPATIAL_DATA = {
    version: 'd4b',
    assets: [
      { id: 'r4b-lantern-entry', fallback: 'lantern', name: T('The Lantern · entrance', 'The Lantern · lối vào'), regions: { 'bt-d4-threshold': [27, 42, 55, 40] } },
      { id: 'r4b-lantern-exit', fallback: 'lantern', name: T('The Lantern · front door', 'The Lantern · cửa trước'), regions: { 'bt-d4-exit-door': [26, 24, 45, 49] } },
      { id: 'r4b-cottage-approach', fallback: 'cottage-closed', name: T('The keeper’s cottage · front steps', 'Nhà người gác đường · bậc cửa') },
      { id: 'r4b-cottage-exit', fallback: 'cottage-dog', name: T('The keeper’s cottage · looking out', 'Nhà người gác đường · nhìn ra cửa') },
      { id: 'r4b-boat-return', fallback: 'boat', name: T('Returning to the harbour', 'Trở về bến') },
      { id: 'r4b-refuge-entry', fallback: 'box-day', name: T('The refuge · entrance', 'Chòi trú · lối vào') },
      { id: 'r4b-cellar-entry', fallback: 'cellar', name: T('The Lantern · cellar steps', 'The Lantern · thang xuống hầm') },
      { id: 'r4b-yard-cover', fallback: 'lantern-yard', name: T('The Lantern · yard', 'The Lantern · sân trước') },
      { id: 'r4b-cellar-cover', fallback: 'cellar', name: T('The cellar', 'Dưới hầm') }
    ],
    /* These replace the two R3 layout candidates only in the opt-in runtime.
     * The R3 files stay in the package as historical pending candidates.
     * Missing new art restores the approved native view, never an empty layer.
     * Anchors measured against yard 948×1659 and cellar 941×1672 portraits.
     * They cover recognisable parts of the real object; native 44px targets
     * remain available without forcing every distant edge into one frame.
     */
    environments: [
      { id: 'r4b-yard-cover', path: 'places.c1_bar.views.yard', fallback: 'lantern-yard', supersedes: 'r3-yard-central-composition', fit: 'cover', regions: {
        'bt-lantern-landrover': [56, 55, 29, 10], 'bt-lantern-phonebox': [17, 49, 9, 13.5],
        'bt-lantern-door': [39, 50, 7, 11.5], 'bt-lantern-context': [15, 44, 72, 23]
      } },
      { id: 'r4b-cellar-cover', path: 'places.c6_cellar.views.room', fallback: 'cellar', supersedes: 'r3-cellar-central-composition', fit: 'cover', regions: {
        c6_phone: [12.5, 27.2, 4.6, 6.4], c6_sink: [12, 43, 22, 10.5], c6_steps: [76, 38, 14, 27]
      } }
    ],
    // The entry bitmap exposes the same back wall. Reuse only the three
    // documented archive rows as small soot texture; no new current reading.
    refugeViews: [
      { id: 'r4b-refuge-entry', phase: 'afternoon', archive: [[29, 21, 48, 29]] }
    ],
    /* Exact existing source steps: a background argument is adapted at runtime,
     * or a native scene is selected on an existing narration step. No inserts.
     */
    sceneBindings: [
      { path: 'nodes.c1_lantern.10', art: 'r4b-lantern-entry' },
      { path: 'nodes.c1_lantern.13', art: 'r4b-lantern-entry' },
      { path: 'nodes.c1_lantern.14', restore: 'lantern', after: ['r4b-lantern-entry'] },
      { path: 'nodes.c1_box.5', art: 'r4b-refuge-entry' },
      { path: 'nodes.c1_box.9', art: 'r4b-refuge-entry' },
      { path: 'nodes.c2_cottage.1', art: 'r4b-cottage-approach' },
      { path: 'nodes.c2_cottage.8', art: 'r4b-cottage-approach' },
      { path: 'nodes.c2_cottage.9', art: 'r4b-cottage-approach' },
      { path: 'nodes.c2_cottage.10', art: 'r4b-cottage-approach' },
      { path: 'nodes.c2_cottage.11', art: 'r4b-cottage-approach' },
      { path: 'nodes.c2_cottage.12', art: 'r4b-cottage-approach' },
      { path: 'nodes.c2_cottage.15', restore: 'cottage-closed', after: ['r4b-cottage-approach'], cottagePhase: true },
      { path: 'nodes.c2_boat.39', art: 'r4b-boat-return' },
      { path: 'nodes.c2_boat.42', art: 'r4b-boat-return' },
      { path: 'nodes.c4_cottage.60', art: 'r4b-cottage-exit' },
      { path: 'nodes.c4_cottage.62', art: 'r4b-cottage-exit' },
      { path: 'nodes.c4_cottage.63', art: 'r4b-cottage-exit' },
      { path: 'nodes.c6_cellar_entry.4', art: 'r4b-cellar-entry' },
      { path: 'nodes.c6_cellar_entry.6', art: 'r4b-cellar-entry' }
    ],
    cameraPassages: [
      {
        id: 'refuge-first-interior',
        why: 'Entry establishes the confined space; the next existing line turns attention to the wall it describes. The exploration and post-exploration narration return to a wide wall view.',
        steps: [
          { path: 'nodes.c1_box.9', look: null },
          { path: 'nodes.c1_box.10', scene: 'box-walls', look: { box: [14, 23, 72, 35], maxScale: 1.08 } },
          { path: 'nodes.c1_box.12', scene: 'box-walls', look: null }
        ]
      },
      {
        id: 'harbour-evening-light',
        why: 'The arrival line establishes the quay; the moonlight line briefly frames the real reflection painted on the water. The camera resets before the two-person conversation.',
        steps: [
          { path: 'nodes.c1_evening.11', look: null },
          { path: 'nodes.c1_evening.12', look: { box: [57, 34, 41, 33], maxScale: 1.10 } },
          { path: 'nodes.c1_evening.15', look: null }
        ]
      },
      {
        id: 'station-closed-back-room',
        why: 'The room is established first; Tom’s location directs attention to the existing closed back-room door. Return to a wide shot before Leo sits at the table. The absent gold-letter boards are deliberately not targeted.',
        steps: [
          { path: 'nodes.c3_station.7', look: null },
          { path: 'nodes.c3_station.11', look: { box: [82, 29, 17, 39], maxScale: 1.08 } },
          { path: 'nodes.c3_station.15', look: null }
        ]
      }
    ]
  };
})();
