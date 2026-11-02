/* Between Tides d4b · native 1.0.4 spatial graph and authored camera.
 * Uses the same P.spatial / VIEW.space / routes / upKind API as Vale 0.9.6.
 * No core fork; no new mechanism, clue, reward, story branch or save namespace.
 */
(() => {
  'use strict';
  const E = globalThis.StoryEngine, D = globalThis.BT_D4_SPATIAL_DATA;
  // check.js imports story/plugin declarations with a non-browser stub. Leave
  // that static pass intact; this adapter needs the actual shared runtime.
  if (!E || !D || typeof document === 'undefined' || typeof E.mech?.bg !== 'function' || typeof E.mech?.place !== 'function' || typeof E.ui?.scene !== 'function') return;
  const T = (en, vi) => ({ en, vi });
  const ours = () => E.S()?.id === 'between-tides';
  const active = () => ours() && E.btD4?.enabled() && !E.btD4?.automatic();
  const at = path => path.split('.').reduce((v, k) => v?.[k], E.S());
  const assetById = new Map(D.assets.map(a => [a.id, a]));
  const ready = new Map(), places = new Map(), cameras = new WeakSet();

  async function ensureArt(id) {
    if (!active()) return null;
    const asset = await E.btD4.ensureAsset(id);
    if (!asset) return null;
    ready.set(id, asset);
    const spec = assetById.get(id);
    E.regions({ [id]: { size: asset.size, fit: 'cover', r: spec?.regions || {} } });
    return asset;
  }
  function spatial(P, id, title) {
    if (!P?.views) return false;
    P.spatial = { ...P.spatial, title };
    places.set(id, P);
    return true;
  }
  function view(P, id, space, x, y) {
    const v = P.views[id];
    if (!v) return null;
    Object.assign(v, { space, map: { x, y }, left: null, right: null });
    return v;
  }
  function route(v, id, to, label, kind = 'walk') {
    const value = { id, to, label, kind };
    const old = (v.routes ||= []).find(x => x.id === id);
    if (old) Object.assign(old, value); else v.routes.push(value);
  }
  function portal(v, id, to, label, kind, r) {
    const value = { id, to, label, kind, r, clue: false, glint: false, look: false };
    const old = (v.zones ||= []).find(x => x.id === id);
    if (old) Object.assign(old, value); else v.zones.push(value);
  }
  function back(v, to, label, kind = 'back') { Object.assign(v, { up: to, upKind: kind, upLabel: label }); }
  function presentationView(P, id, art, fallback, name) {
    // Always declared, including opt-out and missing-file sessions. A save in
    // this added viewpoint is therefore never an orphan on the next load.
    const v = (P.views[id] ||= { name, zones: [] });
    v.name = name;
    v.img = () => active() && ready.has(art) ? art : fallback;
    v.fit = 'cover';
    return v;
  }
  function applyGraphs() {
    const S = E.S(), bar = S.places?.c1_bar;
    if (spatial(bar, 'c1_bar', T('The Lantern · doors and viewpoints', 'The Lantern · cửa và góc nhìn'))) {
      const counter = view(bar, 'bar', 'lantern-bar', 2, 1);
      const shelf = view(bar, 'shelf', 'lantern-bar-detail', 3, 1);
      const yard = view(bar, 'yard', 'lantern-yard', 2, 3);
      presentationView(bar, 'bt_d4_entry', 'r4b-lantern-entry', 'lantern-front', T('At the front entrance', 'Ngưỡng cửa trước'));
      presentationView(bar, 'bt_d4_exit', 'r4b-lantern-exit', 'lantern', T('Inside the front door · looking out', 'Phía trong cửa trước · nhìn ra'));
      const entry = view(bar, 'bt_d4_entry', 'lantern-entry-threshold', 1, 2);
      const exit = view(bar, 'bt_d4_exit', 'lantern-exit-threshold', 3, 2);
      // A named route is honest when the door is outside a close counter frame;
      // an arbitrary hotspot on Fergus or the foreground counter would not be.
      route(counter, 'bt_d4_to_front_door', 'bt_d4_exit', T('Walk to the front door', 'Đi tới cửa trước'));
      const bottle = counter.zones?.find(z => z.to === 'shelf');
      if (bottle) bottle.kind = 'detail';
      back(shelf, 'bar', T('Back to the bar', 'Về quầy'), 'detail');
      portal(yard, 'bt_d4_front_entry', 'bt_d4_entry', T('Approach the front door', 'Đến cửa trước'), 'walk', 'bt-lantern-door');
      route(entry, 'bt_d4_enter_bar', 'bar', T('Go inside to the bar', 'Vào quầy'), 'enter');
      back(entry, 'yard', T('Step back into the yard', 'Lùi ra sân'), 'exit');
      portal(exit, 'bt_d4_front_exit', 'yard', T('Step outside into the yard', 'Bước ra sân'), 'exit', 'bt-d4-exit-door');
      back(exit, 'bar', T('Turn back towards the bar', 'Quay về quầy'));
      E.regions({
        'lantern-front': { r: { 'bt-d4-threshold': [36, 49, 11, 18] } },
        'lantern-yard': { r: { 'bt-lantern-door': [36, 49, 11, 18] } },
        'lantern': { r: { 'bt-d4-exit-door': [5, 34, 15, 28] } }
      });
    }
    const island = S.places?.c1_island;
    if (spatial(island, 'c1_island', T('The island · walking routes', 'Trên đảo · đường đi bộ'))) {
      const square = view(island, 'square', 'island-square', 2, 2);
      const configs = [
        ['harbour', 1, 3, T('Walk to the harbour', 'Đi bộ xuống bến')],
        ['priory', 1, 1, T('Take the priory road', 'Đi đường lên tu viện')],
        ['surgery', 3, 3, T('Walk to the surgery', 'Đi tới phòng khám')],
        ['bighouse', 3, 1, T('Walk to the Hall', 'Đi tới điền trang')]
      ];
      for (const [id, x, y, label] of configs) {
        const v = view(island, id, 'island-' + id, x, y);
        route(square, 'bt_d4_walk_' + id, id, label);
        back(v, 'square', T('Return to the square', 'Trở lại quảng trường'), 'walk');
      }
    }
    const box = S.places?.c1_box;
    if (spatial(box, 'c1_box', T('The refuge · interior views', 'Chòi trú · các góc bên trong'))) {
      const positions = { walls: [1, 1], door: [2, 2], roof: [3, 1] };
      const order = ['walls', 'door', 'roof'];
      order.forEach((id, i) => {
        const v = view(box, id, 'refuge-interior', ...positions[id]);
        v.left = order[(i + order.length - 1) % order.length];
        v.right = order[(i + 1) % order.length];
      });
      const line = view(box, 'line', 'refuge-door-detail', 2, 3);
      back(line, 'door', T('Back to the door', 'Về cạnh cửa'), 'detail');
      const detail = box.views.door.zones?.find(z => z.to === 'line');
      if (detail) detail.kind = 'detail';
      const ladder = box.views.door.zones?.find(z => z.id === 'ladder');
      if (ladder) ladder.kind = 'exit';
    }
    const cellar = S.places?.c6_cellar;
    if (spatial(cellar, 'c6_cellar', T('The cellar · handset and stairs', 'Dưới hầm · điện thoại và thang'))) {
      const room = view(cellar, 'room', 'lantern-cellar', 1, 1);
      const phone = view(cellar, 'phone', 'lantern-cellar-phone-detail', 2, 1);
      const handset = room.zones?.find(z => z.to === 'phone');
      if (handset) handset.kind = 'detail';
      back(phone, 'room', T('Step back from the handset', 'Lùi khỏi máy điện thoại'), 'detail');
      const stairs = room.zones?.find(z => z.id === 'stairs');
      if (stairs) stairs.kind = 'exit';
    }
  }
  function install() {
    if (!ours()) return;
    const S = E.S();
    // This approved wall bitmap originally existed only as a place view.
    // Register its native scene identity for the preceding wall narration.
    S.scenes['box-walls'] ||= { ...(S.scenes['box-day'] || S.scenes.box || {}), kind: 'box-walls', time: undefined };
    for (const a of D.assets) {
      // Native scene restoration knows every opt-in ID, even with art off.
      S.scenes[a.id] ||= { ...(S.scenes[a.fallback] || {}), kind: a.id, name: a.name, fit: 'cover', time: undefined };
    }
    if (E.btRefuge?.views) for (const spec of D.refugeViews || []) {
      const boxes = (spec.archive || []).filter(b => Array.isArray(b) && b.length === 4 && b.every(Number.isFinite) && b[0] >= 0 && b[1] >= 0 && b[2] > 0 && b[3] > 0 && b[0] + b[2] <= 100 && b[1] + b[3] <= 100);
      if (spec.id === 'r4b-refuge-entry' && spec.phase === 'afternoon' && boxes.length) {
        // Archive-only by construction: do not copy current/readableArchive
        // or invent another row while adding a new physical camera angle.
        E.btRefuge.views[spec.id] = { phase: spec.phase, archive: boxes.map(b => [...b]) };
      }
    }
    E.btRefuge?.refresh?.();
    const environments = E.btD4?.data?.environments;
    if (environments) for (const value of D.environments) {
      const old = environments.find(x => x.path === value.path);
      if (old) Object.assign(old, value); else environments.push({ ...value });
    }
    applyGraphs();
    for (const binding of D.sceneBindings) {
      const st = at(binding.path);
      if (st) st.btD4Spatial = binding;
    }
    for (const passage of D.cameraPassages) for (const cue of passage.steps) {
      const st = at(cue.path);
      if (!st || cameras.has(st)) continue;
      if ('scene' in cue) st.scene = cue.scene;
      st.look = cue.look;
      cameras.add(st);
    }
  }
  function apply() { install(); queueMicrotask(install); }

  async function chooseScene(binding, ctx) {
    if (binding?.art) {
      if (!active()) return null;
      ctx.resumeHere?.();
      const art = await ensureArt(binding.art);
      if (!art || ctx.live?.() === false || !active()) return null;
      return binding.art;
    }
    if (binding?.restore && binding.after?.includes(E.R()?.scene)) {
      return binding.cottagePhase && E.R().f?.bt_cottage_kitchen_open ? 'cottage-open-dog' : binding.restore;
    }
    return null;
  }
  E.side('btD4Spatial', async (binding, st, ctx) => {
    if (!ours() || ctx.type === 'bg') return;
    const id = await chooseScene(binding, ctx);
    if (!id || ctx.live?.() === false) return;
    // Repeated reader anchors support Continue without re-entering, refading
    // or resetting the camera during the next line in the same location.
    if (E.R().scene !== id || E.ui.bgKey() !== 's:' + id) await E.ui.scene(id);
  });
  // Adapt only the image argument of the native bg mechanism. Story arrays,
  // original st.bg, frame path and callback ownership remain untouched.
  const background = E.mech.bg;
  E.mech.bg = async function (ctx) {
    const binding = ours() && ctx.st.btD4Spatial;
    if (!binding) return background.call(this, ctx);
    const id = await chooseScene(binding, ctx);
    if (ctx.live?.() === false) return;
    return background.call(this, id ? { ...ctx, st: { ...ctx.st, bg: id } } : ctx);
  };
  const place = E.mech.place;
  E.mech.place = async function (ctx) {
    if (ours()) {
      install();
      if (active() && ctx.st.place === 'c1_bar') {
        ctx.resumeHere?.();
        await Promise.all(['r4b-lantern-entry', 'r4b-lantern-exit'].map(ensureArt));
        if (ctx.live?.() === false) return;
      }
    }
    return place.call(this, ctx);
  };
  const restore = E.ui.restore;
  E.ui.restore = function (...args) {
    if (ours()) {
      install();
      const R = E.R(), a = assetById.get(R?.scene);
      if (a && (!active() || !ready.has(a.id))) R.scene = a.fallback;
    }
    return restore.apply(this, args);
  };
  E.on('boot', apply);
  E.on('chapter', apply);
  E.btD4Spatial = Object.freeze({
    install, ensureArt, ready: id => ready.has(id),
    status: () => ({ version: D.version, active: !!active(), assets: [...ready.keys()], places: [...places].map(([id, p]) => ({
      id, views: Object.entries(p.views).map(([id, v]) => ({ id, space: v.space, map: v.map, up: v.up, upKind: v.upKind, left: v.left, right: v.right, routes: v.routes || [], portals: (v.zones || []).filter(z => z.id?.startsWith('bt_d4_')).map(z => ({ id: z.id, to: z.to, kind: z.kind, r: z.r })) }))
    })), cameraPassages: D.cameraPassages.map(({ id, why }) => ({ id, why })) })
  });
})();
