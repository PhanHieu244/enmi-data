/* Vale 0.9.6 · authored spatial connections.
 * A view of another room is reached through its door, not by rotating an
 * implicit image carousel. Existing view IDs, clue/person arrays and saved
 * interpreter paths are retained. New portals are appended, never inserted.
 * Map coordinates describe connections only; they are not a measured plan.
 */
(() => {
  'use strict';
  const E = StoryEngine, V = ValeDemo;
  const T = (en, vi) => ({ en, vi });
  const enabled = () => /^vale-dossiers(?:-|$)/.test(E.S()?.id || '');
  const entries = new Map();
  const at = (S, path) => path.reduce((v, k) => v?.[k], S);

  function spatial(P, id, title) {
    if (!P?.views) return false;
    P.spatial = { ...P.spatial, title };
    entries.set(id, P);
    return true;
  }
  function view(P, id, space, x, y) {
    const v = P?.views?.[id];
    if (!v) return null;
    Object.assign(v, { space, map: { x, y }, left: null, right: null });
    return v;
  }
  function portal(v, id, to, label, kind, r) {
    if (!v) return;
    const value = { id, to, label, kind, r: [...r], clue: false, glint: true, look: false };
    const prior = (v.zones ||= []).find(z => z.id === id);
    if (prior) Object.assign(prior, value);
    else v.zones.push(value);
  }
  function route(v, id, to, label, kind = 'walk') {
    if (!v) return;
    const value = { id, to, label, kind };
    const prior = (v.routes ||= []).find(r => r.id === id);
    if (prior) Object.assign(prior, value);
    else v.routes.push(value);
  }
  function back(v, to, label, kind = 'exit') {
    if (v) Object.assign(v, { up: to, upKind: kind, upLabel: label });
  }
  function sameArea(P, id, title, space, order, positions) {
    if (!spatial(P, id, title)) return;
    for (let i = 0; i < order.length; i++) {
      const k = order[i], v = view(P, k, space, ...positions[k]);
      if (!v) continue;
      // The original three viewpoints are a rotation within the same area.
      // A two-view pair has only one real side in each view, never two aliases.
      v.left = order.length === 2 ? (i ? order[i - 1] : null) : order[(i + order.length - 1) % order.length];
      v.right = order.length === 2 ? (i ? null : order[i + 1]) : order[(i + 1) % order.length];
    }
  }
  function stable(P, id) {
    if (!spatial(P, id, T('Wycliffe · yard and stable', 'Wycliffe · sân và chuồng'))) return;
    const yard = view(P, 'yard', 'wycliffe-yard', 1, 1);
    const stall = view(P, 'stall', 'wycliffe-stable', 1, 2);
    // Use the right portion of the actual left opening. A broad doorway ROI
    // pulls cover framing left and clips Nora on a tall phone. The narrow ROI
    // retains the original camera/actor frame and gets the engine's 44px hit.
    portal(yard, 'v096_enter_stable', 'stall', T('Enter the stable', 'Vào chuồng ngựa'), 'enter', [28, 24, 8, 30]);
    // Inside, the far-left exterior door cannot share a tall cover frame with
    // the original latch on the right. The named return is the honest exit;
    // do not add an off-door hotspot or sacrifice an original clue to fit it.
    back(stall, 'yard', T('Back to the yard', 'Trở ra sân trại'));
  }

  function install() {
    if (!enabled()) return;
    const S = E.S();
    if (!['vale-dossiers-part2-v01', 'vale-dossiers-part3-v01'].includes(S.id)) {
      const study = at(S, ['nodes', 'c1_open', 15, 'place']);
      sameArea(study, 'c1_desk', T('Vale’s study · views', 'Phòng Vale · các góc nhìn'),
        'vale-study', ['desk', 'window', 'door'], { desk: [2, 1], window: [3, 2], door: [1, 2] });
      // This bitmap is viewed from inside the study, looking through its door.
      if (study?.views?.door) study.views.door.name = T('Door to the landing', 'Cửa ra chiếu nghỉ');
      const lane = at(S, ['nodes', 'c1_departure', 9, 'place']);
      sameArea(lane, 'c1_alder_walk', T('Alder Lane · views', 'Ngõ Alder · các góc nhìn'),
        'alder-lane-evening', ['cab', 'corner'], { cab: [1, 1], corner: [2, 1] });
      // v093 already migrates the obsolete playable front view to an in-place
      // door inspection. Retain its original definition for saved child paths.
      if (lane?.views?.front) {
        const legacy = view(lane, 'front', 'alder-lane-evening', 2, 2);
        back(legacy, 'corner', T('Back to the lane', 'Về ngõ Alder'), 'back');
      }
      sameArea(S.places?.c2_lane, 'c2_lane', T('Alder Lane · views', 'Ngõ Alder · các góc nhìn'),
        'alder-lane-day', ['front', 'rank', 'gate'], { front: [2, 1], rank: [3, 2], gate: [1, 2] });

      const church = S.places?.c3_church;
      if (spatial(church, 'c3_church', T('St Anselm’s · access', 'St Anselm · lối đi'))) {
        const court = view(church, 'court', 'st-anselm-courtyard', 1, 1);
        const door = view(church, 'door', 'st-anselm-threshold', 1, 2);
        // Original dialogue still takes place on the threshold; Celia invites
        // the player fully inside only after the original inspection/meeting.
        portal(court, 'v096_chapel_door', 'door', T('Approach the chapel door', 'Đến cửa gian lễ'), 'walk', [42, 33, 16, 20]);
        back(door, 'court', T('Back to the churchyard', 'Về sân nhà thờ'), 'back');
      }
    }
    if (S.id === 'vale-dossiers-part2-v01') {
      const house = S.places?.p2c2_house;
      if (spatial(house, 'p2c2_house', T('Blackthorn · access', 'Blackthorn · lối đi'))) {
        const yard = view(house, 'yard', 'blackthorn-courtyard', 1, 1);
        const corridor = view(house, 'corridor', 'blackthorn-west-corridor', 1, 2);
        const room = view(house, 'room', 'blackthorn-alice-room', 1, 3);
        portal(yard, 'v096_enter_house', 'corridor', T('Enter Blackthorn', 'Vào nhà Blackthorn'), 'enter', [76, 40, 11, 13]);
        portal(corridor, 'v096_enter_alice_room', 'room', T('Enter Alice’s former room', 'Vào phòng cũ của Alice'), 'enter', [50, 25, 14, 35]);
        back(corridor, 'yard', T('Go out to the courtyard', 'Ra sân trước'));
        back(room, 'corridor', T('Return to the corridor', 'Ra hành lang'));
        // Owen previously occupied the entire painted front door. Move only
        // his horizontal anchor to the cottage side; keep scale/feet intact.
        const owen = yard?.people?.find(p => p.who === 'owen');
        if (owen?.r) owen.r = [20, owen.r[1], owen.r[2], owen.r[3]];
        // Keep the existing observation on the visible broad path, clear of
        // Owen's foreground body. Its text, ID and saved child path stay put.
        const yardPath = yard?.zones?.find(z => z.id === 'yard_path');
        if (yardPath) yardPath.r = [50, 65, 24, 17];
        // The clue describes the order of all three doors. Its old rectangle
        // covered the open middle entrance; place it on the left door instead.
        const order = corridor?.zones?.find(z => z.id === 'door_order');
        if (order) order.r = [24, 33, 8, 26];
      }
    }
    if (S.id === 'vale-dossiers-part3-v01') {
      stable(S.places?.p3c1_stable_walk, 'p3c1_stable_walk');
      stable(S.places?.p3c3_yard_walk, 'p3c3_yard_walk');
      const ground = S.places?.p3c2_ground;
      if (spatial(ground, 'p3c2_ground', T('Moor · paths', 'Đồng hoang · lối đi'))) {
        // The preceding narration has already brought the player to the
        // cordon. start applies only when no saved PS.v exists for this place.
        ground.start = 'hollow';
        const path = view(ground, 'path', 'moor-drainage-path', 1, 1);
        const hollow = view(ground, 'hollow', 'moor-cordon-edge', 1, 2);
        // The cordon is not visible in the path painting. A named walking
        // route is honest; a glint on an arbitrary patch of heather is not.
        route(path, 'v096_walk_to_cordon', 'hollow', T('Walk to the edge of the hollow', 'Đi tới mép hõm đất'));
        back(hollow, 'path', T('Back to the drainage path', 'Về lối ven rãnh nước'), 'back');
        hollow.name = T('Edge of the hollow', 'Mép hõm đất');
      }
    }
  }
  function apply() {
    install();
    // Per-part layout hooks load after common plugins. Converge after those
    // hooks without changing any interpreter cursor or runtime progress.
    queueMicrotask(install);
  }
  E.on('boot', apply);
  E.on('chapter', apply);
  V.v096Spatial = () => ({
    version: '0.9.6',
    places: [...entries].filter(([, P]) => P.spatial).map(([id, P]) => ({
      id, start: P.start,
      views: Object.fromEntries(Object.entries(P.views).map(([key, v]) => [key, {
        space: v.space, map: v.map, left: v.left, right: v.right,
        up: v.up, upKind: v.upKind,
        portals: (v.zones || []).filter(z => z.id?.startsWith('v096_')).map(z => ({ id: z.id, to: z.to, kind: z.kind, r: z.r })),
        routes: (v.routes || []).map(r => ({ id: r.id, to: r.to, kind: r.kind }))
      }]))
    }))
  });
})();
