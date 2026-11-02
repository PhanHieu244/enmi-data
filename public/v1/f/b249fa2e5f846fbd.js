/* Between Tides — authored record and connected-location scopes for Enmi 1.0.4.
 * Data only: the shared engine owns rendering, ownership checks and saves.
 * Register after the approved story projections, before boot. Lazy chapters
 * receive these same annotations without changing their step paths or text.
 */
(() => {
  'use strict';
  const E = globalThis.StoryEngine;
  if (!E?.plugin || E.plugins?.['bt-native-v104-scopes']) return;

  // Complete question pools, including plausible records from the current
  // investigation. The first board reserves two further slots for its own
  // earned conclusions: five sources + two conclusions = seven cards.
  const pools = [
    { node: 'c1_fergus', index: 32, kind: 'board', cards:
      ['ring', 'note', 'q:fergus_flask', 'claimfile', 'q:nell_tom'] },
    { node: 'c2_slip', index: 41, kind: 'deduce', cards:
      ['draft', 'vial', 'note', 'flask'] },
  ];

  // These are physical areas, not cameras or answer lists. In particular,
  // the bar, shelf, yard and cellar share one inventory; the cottage's door
  // states share another; every view of the refuge shares another.
  const locations = {
    mainland: {
      scenes: ['car'],
    },
    causeway: {
      scenes: ['causeway', 'causeway-sign', 'causeway-night', 'causeway-flooded', 'causeway-dawn'],
      places: ['c1_roadstart'],
    },
    refuge_box: {
      scenes: ['box', 'box-day', 'box-night', 'box-dark', 'box-dawn',
        'box-walls', 'box-door', 'box-line', 'box-roof', 'box-gauge-day'],
      places: ['c1_box'],
    },
    lantern: {
      scenes: ['lantern', 'lantern-bar', 'lantern-shelf', 'lantern-yard',
        'lantern-front', 'lantern-night-parked', 'lantern-night-empty',
        'lantern-bottle-gone', 'lantern-yard-dawn', 'cellar', 'act-handset'],
      places: ['c1_bar', 'c6_cellar'],
      // The letter/identity review and the later 2004 review both happen
      // here. These declarations allow carried records; they grant nothing.
      uses: ['ring', 'note', 'claimfile', 'logbook', 'c5_anna_testimony', 'skull', 'peg'],
    },
    village: {
      scenes: ['village', 'isl-square', 'isl-harbour', 'isl-priory', 'isl-surgery', 'isl-bighouse'],
      places: ['c1_island'],
    },
    harbour: {
      scenes: ['harbour', 'harbour-lamp-car', 'harbour-dawn'],
      // Callum's moored boat is reached from the harbour, where the book
      // and the borrowed jumper are subsequently examined.
      uses: ['logbook', 'jumper'],
    },
    cottage: {
      scenes: ['cottage', 'cottage-closed', 'cottage-open-dog', 'cottage-dog'],
    },
    channel: {
      scenes: ['boat'],
    },
    lifeboat: {
      scenes: ['lifeboat', 'act-pocket-bagged'],
      // These earlier records are physically opened or examined at the
      // station. The draft disappears from this set as soon as it is handed
      // over by its existing drop step; ownership remains authoritative.
      uses: ['claimfile', 'draft', 'vial', 'flask'],
    },
    surgery: {
      scenes: ['surgery', 'surgery-inside'],
    },
    dunes: {
      scenes: ['dunes'],
      uses: ['logbook', 'c5_anna_testimony'],
    },
    estate: {
      scenes: ['yard'],
    },
  };

  // Explicit entry scopes protect save resumes at the existing exploration
  // step. A close image, a neighbouring room or a chosen person cannot narrow
  // the area. None of these annotations changes an exploration's identity.
  const explorationScopes = [
    ['c2_cottage', 17, 'cottage'],
    ['c2_boat', 29, 'refuge_box'],
    ['c3_pocket', 7, 'lifeboat'],
    ['c4_cottage', 16, 'cottage'],
    ['c5_dunes', 15, 'dunes'],
  ];
  const placeScopes = {
    c1_roadstart: 'causeway', c1_box: 'refuge_box', c1_bar: 'lantern',
    c1_island: 'village', c6_cellar: 'lantern',
  };

  function install() {
    const S = E.S();
    if (S?.id !== 'between-tides') return;
    S.contextInventory = true;
    S.locations ||= {};
    for (const [id, config] of Object.entries(locations)) {
      // Copy only data owned by this declaration. No run state is consulted
      // and no record is added, removed, earned or made visible here.
      S.locations[id] = Object.fromEntries(Object.entries(config).map(([key, ids]) => [key, ids.slice()]));
    }
    for (const { node, index, kind, cards } of pools) {
      const config = S.nodes?.[node]?.[index]?.[kind];
      if (config) config.cards = cards.slice();
    }
    for (const [node, index, location] of explorationScopes) {
      const explore = S.nodes?.[node]?.[index]?.explore;
      if (explore) explore.location = location;
    }
    for (const [id, location] of Object.entries(placeScopes)) {
      if (S.places?.[id]) S.places[id].location = location;
    }
    E.rebuildInventoryScopes?.();
  }

  E.plugin({ id: 'bt-native-v104-scopes', on: { boot: install, chapter: install } });
})();
