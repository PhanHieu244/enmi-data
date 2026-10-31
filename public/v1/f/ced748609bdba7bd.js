/* Vale scene presentation — coordinates measured against the scene paintings.
   IDs, choice order, authored interactions, item awards and saved interpreter
   paths stay intact. Legacy door views resume as a detail of the same image.
   Regions are percentages of the actual bitmap, never of the phone screen. */
(() => {
  'use strict';
  const E = StoryEngine;
  const doorBox = [35,39,24,26];
  const oldSize = [941, 1672], newSize = [1024, 1536];
  const sizes = Object.fromEntries([
    ...['study','study_desk','study_window','study_door','carriage','alder_lane','wren_door','cab_stand','c4_study','c4_steps','c4_lane','c5_study','c5_wren','act-watermark'].map(id => [id, oldSize]),
    ...['c2_front_day','c2_lane_day','c2_gate_day','c3_court','c3_chapel','c3_vestry','c4_parlour','c5_door','c5_corner','c6_study','c6_wren','c6_room','c6_after'].map(id => [id, newSize]),
    ['act-unmask', [940, 1672]]
  ]);

  // Exact written/clock clues use authored SVG. Image generators do not choose
  // their wording or the position of clock hands. All remaining art is raster.
  const clock = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><defs><radialGradient id="face"><stop stop-color="#e4d9b6"/><stop offset="1" stop-color="#b9a979"/></radialGradient><linearGradient id="rim" x2="1" y2="1"><stop stop-color="#8b8267"/><stop offset=".5" stop-color="#433f32"/><stop offset="1" stop-color="#948369"/></linearGradient></defs><circle cx="60" cy="60" r="58" fill="url(#rim)" stroke="#25271f" stroke-width="2"/><circle cx="60" cy="60" r="51" fill="url(#face)" stroke="#575342" stroke-width="2"/><circle cx="60" cy="60" r="46" fill="none" stroke="#635f48" stroke-width=".7"/><g fill="#393b2e" font-family="Georgia,serif" font-size="12" text-anchor="middle"><text x="60" y="25">XII</text><text x="99" y="64">III</text><text x="60" y="105">VI</text><text x="21" y="64">IX</text></g><g stroke="#4e4e39" stroke-width="1.4"><path d="M81 24l-2 4M96 39l-4 2M96 81l-4-2M81 96l-2-4M39 96l2-4M24 81l4-2M24 39l4 2M39 24l2 4"/></g><path d="M60 60L35 49" stroke="#2f332a" stroke-width="4.5" stroke-linecap="round"/><path d="M60 60L25 60" stroke="#2f332a" stroke-width="3" stroke-linecap="round"/><circle cx="60" cy="60" r="4" fill="#36392b"/><circle cx="60" cy="60" r="1.5" fill="#a9945b"/></svg>`;
  const plate = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 230 66"><defs><linearGradient id="brass" x2=".3" y2="1"><stop stop-color="#bfa879"/><stop offset=".5" stop-color="#8c764c"/><stop offset="1" stop-color="#b19a68"/></linearGradient></defs><rect x="2" y="2" width="226" height="62" rx="3" fill="url(#brass)" stroke="#4d4936" stroke-width="3"/><rect x="8" y="8" width="214" height="50" rx="1" fill="none" stroke="#e4d6a2" opacity=".35"/><g fill="#514734"><circle cx="13" cy="33" r="3"/><circle cx="217" cy="33" r="3"/></g><text x="115" y="41" text-anchor="middle" fill="#272b23" font-family="Georgia,serif" font-size="24" letter-spacing="1.2">WREN HOUSE</text></svg>`;
  // Two unsigned copies, before the sealing action. The tabletop prop avoids
  // presenting a sealed envelope as the two loose forms described here.
  const terms = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 105"><defs><linearGradient id="paper" x2=".3" y2="1"><stop stop-color="#e6dbbb"/><stop offset="1" stop-color="#c7b893"/></linearGradient></defs><path d="M3 59L112 7l91 13L91 85z" fill="#392f24" opacity=".22"/><path d="M0 55L109 4l91 13L88 81z" fill="url(#paper)" stroke="#b4a787" stroke-width=".8"/><g transform="matrix(.73,-.34,.87,.13,25,54)" fill="#6b604b"><text x="0" y="0" font-family="Georgia,serif" font-size="8">UNDERTAKING</text><path d="M0 16h85v1H0zm0 11h87v1H0zm0 11h84v1H0zm0 11h89v1H0zm0 23h38v1H0zm49 0h38v1H49z"/></g><path d="M112 76L217 26l82 15L193 99z" fill="#392f24" opacity=".2"/><path d="M109 72L214 22l82 15L190 95z" fill="url(#paper)" stroke="#b4a787" stroke-width=".8"/><g transform="matrix(.71,-.34,.8,.15,134,72)" fill="#6b604b"><text x="0" y="0" font-family="Georgia,serif" font-size="8">UNDERTAKING</text><path d="M0 16h85v1H0zm0 11h87v1H0zm0 11h84v1H0zm0 11h89v1H0zm0 23h38v1H0zm49 0h38v1H49z"/></g></svg>`;
  if (typeof document !== 'undefined' && document.head) {
    const style = document.createElement('style');
    style.dataset.valeSceneProps = 'true';
    style.textContent = Object.entries({'vale-clock': clock, 'vale-wren-plate': plate, 'vale-terms': terms}).map(([id, svg]) => `.im-${id}{background-image:url("data:image/svg+xml,${encodeURIComponent(svg)}")}`).join('\n');
    document.head.appendChild(style);
  }

  const layout = {
    c1_desk: { window: { people: { reed: [50,34,40,50] } } },
    c1_alder_walk: {
      corner: { zones: { house: { r:[42,44,8,11] }, cab: { r:[11,64,10,10] } } },
      front: { zones: { bell: { r:[64,36.5,6,4.5] } }, props:[{id:'doorplate',art:'vale-wren-plate',r:[63.7,34,7,2.6]}] },
      cab: { zones: { wheel: { r:[10,49,15,13] } }, people: { reed: [50,34,40,50] } }
    },
    c2_lane: {
      front: { zones: { entrances: { r:[58,33,7,3.5], art:'vale-wren-plate' } }, people: { bell:[16,30,38,48] } },
      rank: { zones: { parcel: { r:[73,71,16,10], art:'prop-parcel' } }, people: { finn:[40,34,29,47] } },
      gate: { zones: { latch: { r:[72,37,10,8] } } }
    },
    c3_church: {
      court: { zones: { church_clock: { r:[43.5,14,12,8], art:'vale-clock' } }, people: { hart:[60,31,22,48] } },
      door: { zones: { ceremony: { r:[41,38,20,10] } }, people: { c3_clerk:[54,43,18,37] } }
    }
  };
  const exploreLayout = {
    c4_open_explore: { img:'c4_parlour', spots:{draft_terms:{r:[43,43,25,6]},stage_album:{r:[15,40,12,7],inspectR:[3,39,24,9],art:'prop-stage-album',artR:[2.73,36.74,22.27,9.90]},cases:{r:[80,54,9,10],inspectR:[81,47,19,19]}} },
    c4_alarm_explore: { img:'c4_parlour', spots:{panel:{r:[72,13,7,18]},album:{r:[15,40,12,7],inspectR:[3,39,24,9],art:'prop-stage-album',artR:[2.73,36.74,22.27,9.90]},luggage:{r:[80,54,9,10],inspectR:[81,47,19,19]}} },
    c5_follow: { img:'c5_corner', spots:{cab:{r:[57,36,20,11]},shop_glass:{r:[28,32,9,9]}} },
    c6_visit: { img:'c6_room', spots:{letter:{r:[52,44,10,2.2]},portrait:{r:[60.5,35.5,14,11],art:'evidence-portrait'},panel:{r:[72,13,7,18]}} },
    c6_terms: { img:'c6_room', spots:{signatures:{r:[44,43,20,5],art:'vale-terms'},packet:{r:[60.5,35.5,14,11],art:'prop-joint-photo'}} }
  };
  function place(P, id) {
    if (!P?.views) return;
    const fix = layout[id || P.id] || {};
    for (const [vk, v] of Object.entries(P.views)) {
      if (typeof v.img === 'string' && sizes[v.img]) v.size = [...sizes[v.img]];
      const f = fix[vk]; if (!f) continue;
      for (const z of v.zones || []) if (f.zones?.[z.id]) Object.assign(z, f.zones[z.id]);
      for (const p of v.people || []) if (f.people?.[p.who]) p.r = [...f.people[p.who]];
      if (f.props) v.props = f.props.map(p => ({...p,r:[...p.r]}));
    }
    if ((id || P.id) === 'c1_alder_walk') {
      const door = P.views.corner?.zones?.find(z => z.id === 'house');
      const bell = P.views.front?.zones?.find(z => z.id === 'bell');
      if (door && bell) {
        // The door is already painted in the street view. Inspect that exact
        // detail instead of treating it as another place or committing a route.
        // Preserve the legacy front view and its arrays for saved child paths.
        delete door.to;
        door.label = {en:'Inspect the front door',vi:'Xem cửa trước'};
        door.inspectR = [...doorBox];
        door.then = bell.then;
        door.again = bell.then;
        P.ring = (P.ring || ['corner','front','cab']).filter(v => v !== 'front');
      }
    }
  }
  function walk(value, node) {
    if (!value || typeof value !== 'object') return;
    if (value.place && typeof value.place === 'object') place(value.place);
    if (value.explore && exploreLayout[node]) {
      const X = value.explore, f = exploreLayout[node]; X.img = f.img;
      for (const sp of X.spots || []) if (f.spots[sp.id]) {
        Object.assign(sp, f.spots[sp.id]); sp.x = sp.r[0] + sp.r[2] / 2; sp.y = sp.r[1] + sp.r[3] / 2;
      }
    }
    for (const v of Object.values(value)) if (v && typeof v === 'object') walk(v, node);
  }
  function apply(S) {
    if (!/^vale-dossiers/.test(S?.id || '')) return;
    for (const [id, size] of Object.entries(sizes)) if (S.scenes?.[id]) S.scenes[id].size = [...size];
    E.regions(Object.fromEntries(Object.entries(sizes).map(([id,size]) => [id,{size:[...size]}])));
    for (const [id, P] of Object.entries(S.places || {})) place(P,id);
    for (const [node, steps] of Object.entries(S.nodes || {})) walk(steps,node);
  }
  E.on('boot',apply);
  E.on('chapter',() => apply(E.S()));
  E.on('step',(type,st) => {
    if (type !== 'place' || !/^vale-dossiers/.test(E.S()?.id || '')) return;
    const P = typeof st.place === 'string' ? E.S().places?.[st.place] : st.place;
    if (P?.id !== 'c1_alder_walk') return;
    const R = E.R(), ps = R?.pl?.c1_alder_walk;
    if (!ps) return;
    if (ps.seen?.['front/bell']) ps.seen['corner/house'] = ps.seen['front/bell'];
    if (ps.v !== 'front') return;
    const door = P.views.corner.zones.find(z => z.id === 'house');
    ps.v = 'corner';
    (ps.vis ||= {}).corner = 1;
    ps.detail = {v:'corner',id:'house',box:[...doorBox],label:door.label};
    if (R.vw?.pid === 'c1_alder_walk') R.vw.v = 'corner';
    // The place mechanism establishes its resumable checkpoint and saves next;
    // do not snapshot from this pre-entry presentation hook.
  });
})();
