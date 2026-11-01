// Between Tides: one refuge, explicit physical phases, exact native inscriptions.
// The original v093 engine and every existing dialogue/choice array stay intact.
(() => {
  "use strict";
  const E = globalThis.StoryEngine;
  if (!E?.plugin || E.plugins?.["bt-refuge"]) return;
  // Turn on after the replacement art and the final camera registrations pass QA.
  const READY = true;
  const LOCAL_ID = "between-tides";
  const isStory = () => E.S()?.id === LOCAL_ID;
  const esc = value => E.esc ? E.esc(value) : String(value).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const rows = Object.freeze({
    archive2140: Object.freeze({ id: "refuge_old_2140", text: "21:40 — 0.1", date: null, style: "archive" }),
    archive0310: Object.freeze({ id: "refuge_old_0310", text: "03:10 — 0.2 U", date: null, style: "archive" }),
    archive0455: Object.freeze({ id: "refuge_old_0455", text: "04:55 — 0.0", date: null, style: "archive" }),
    morning: Object.freeze({ id: "refuge_140601", text: "14.11 06:01 — 0.5 U", date: "2024-11-14", style: "steady" }),
    last: Object.freeze({ id: "refuge_142144", text: "21:44 — 0.6 U", date: "2024-11-14", style: "descending" }),
    keeper: Object.freeze({ id: "refuge_150612", text: "06:12 — 0.0", date: "2024-11-15", style: "larger-steady" }),
  });
  const archive = [rows.archive2140, rows.archive0310, rows.archive0455];
  const nodeOf = run => (run?.stack || []).find(f => /^c\d_/.test(f.n))?.n || "";
  const keeperWritten = run => !!run?.f?.c6_hidden_earned && run?.f?.c6_wall_written === true;
  const phaseFor = (image, run = E.R?.()) => {
    if (/^(?:act-wallphoto|act-gaugephoto|cg-tom-dead)$/.test(image)) return "capture2230";
    if (/^(?:box-day|box-door|box-line|box-walls|box-roof|box-gauge-day|box-outside|act-ladder)$/.test(image)) return "afternoon";
    if (image === "box-night") return "rescue";
    if (image === "box-dark") return "after-rescue";
    if (image === "box-dawn" || image === "cg-dawn-wall") return keeperWritten(run) ? "keeper-after" : "keeper-before";
    if (image === "box") {
      if (nodeOf(run) === "c6_keeper") return keeperWritten(run) ? "keeper-after" : "keeper-before";
      return (run?.ch || 1) === 1 ? "afternoon" : run?.ch === 2 ? "rescue" : "after-rescue";
    }
    return null;
  };
  const rowsFor = (image, run) => {
    const phase = phaseFor(image, run);
    if (!phase) return [];
    if (phase === "afternoon") return [rows.morning];
    return phase === "keeper-after" ? [rows.morning, rows.last, rows.keeper] : [rows.morning, rows.last];
  };
  const boxFor = run => {
    const phase = phaseFor("box", run);
    return phase.startsWith("keeper") ? "box-dawn" : phase === "afternoon" ? "box-day" : phase === "rescue" ? "box-night" : "box-dark";
  };

  // Monoline numeral paths keep physical writing offline, exact and independent
  // of installed fonts. The 4s in the last row have an explicit second stroke.
  const glyphs = Object.freeze({
    "0": [7, "M3.6 1C.9 1 .8 4.5 1 7.3C1.1 10.8 2 12 3.5 12C5.4 12 6.1 9 6 6C5.9 2.9 5.2 1 3.6 1Z"],
    "1": [6, "M.8 3.2L3.1 1L3.3 12M1 12H5.5"],
    "2": [7, "M.8 3.4C1.2.5 5.6.3 6 3C6.7 6 2.8 8.5.9 11.8L6.5 12"],
    "3": [7, "M1 1.5C6-.2 7 4.4 3.1 6C7.8 6.1 6.6 13.5.9 11.5"],
    "4": [7, "M5.4.8L.7 8.4L6.6 8.6M5.2 3.9L5.3 12.4"],
    "5": [7, "M6 1.2L1.4 1L1.1 6C7.5 3.3 8 13.5.7 11.5"],
    "6": [7, "M5.6 1C1.8 1.4.4 5.7 1 9.3C1.9 13.9 6.9 12.1 6.2 8.5C5.7 5.7 2.7 5.6 1.2 8"],
    "7": [7, "M.7 1.2L6.2 1L2.8 12M2.4 6.1L5.2 6"],
    "8": [7, "M3.4 1C-.6 1.1.3 5.2 3.4 6C7.5 7.1 7.1 12 3.3 12C-1 12-.2 7.5 3.4 6C7.2 4.5 6.7.6 3.4 1Z"],
    "9": [7, "M5.8 5.7C4.2 7.7.8 7.5.8 4C.8.1 6.2-.3 6.2 4.7C6.3 8.6 4.7 11.2 1.9 12"],
    ":": [3, "M1.5 4L1.6 4.1M1.4 9.5L1.5 9.6"],
    ".": [3, "M1.4 11.5L1.6 11.6"],
    "—": [10, "M.7 6.5L9.1 6.6"],
    "U": [8, "M1 1L1 8.4C.9 13.5 7 13.1 7 8.3L7.1 1"],
    " ": [4, ""],
  });
  const inkLine = (text, { slope = 0, retrace = false } = {}) => {
    let x = 0;
    const paths = [];
    for (const char of text) {
      const glyph = glyphs[char];
      if (!glyph) continue;
      const y = x * slope;
      if (glyph[1]) {
        paths.push(`<path d="${glyph[1]}" transform="translate(${x.toFixed(2)} ${y.toFixed(2)})"/>`);
        if (retrace && char === "4") paths.push(`<path data-retrace="4" d="${glyph[1]}" opacity=".68" transform="translate(${(x + .48).toFixed(2)} ${(y + .36).toFixed(2)}) rotate(-1.4)"/>`);
      }
      x += glyph[0] + 1.8;
    }
    return { markup: paths.join(""), width: Math.max(1, x - 1.8), height: 14 + x * slope };
  };

  // Measured on the accepted painted masters. Current entries sit below the
  // lantern and above Tom's head; archive ink is occluded by physical objects.
  const front = { current: [11.2, 36.2, 30.8, 7.5], rowsY: [0, 2.5, 5], archive: [[10.3, 18.2, 32.5, 17.5], [10.3, 48.8, 32.5, 14], [0.5, 19, 4.7, 18], [91, 47, 8, 14]], exclude: [[19, 20.8, 15.5, 16.4]] };
  const occupied = { ...front, exclude: [...front.exclude, [3, 41, 43, 47]] };
  const views = {
    "box-day": { ...front }, "box-night": occupied, "box-dark": { ...front }, "box-dawn": { ...front },
    "box": { ...front }, "cg-tom-dead": occupied, "box-door": { ...front },
    "box-line": { current: [18, 37.3, 58, 15], rowsY: [0, 4.5, 9], archive: [[18, 2, 58, 29], [18, 63, 58, 20]] },
    "act-wallphoto": { ...front, photo: true },
    "cg-dawn-wall": { current: [18, 37.3, 58, 15], rowsY: [0, 4.5, 9], archive: [[18, 2, 58, 29], [18, 66, 48, 17]] },
    "box-walls": { archive: [[16, 18, 70, 36], [22, 61, 55, 3.5], [1, 47, 10, 15], [93, 44, 6, 18]], readableArchive: [20, 30, 33], exclude: [[18.5, 28, 36, 12]] },
    "box-roof": { archive: [[2, 35.5, 59, 55]], exclude: [[25, 42, 16, 18]] },
    "box-outside": { sign: [42.7, 17.1, 12.7, 2.7] },
    "box-gauge-day": { gauge: { x: 39.2, y: 6.5, w: 7.5, h: 72.5, min: 0, max: 2 } },
    "act-gaugephoto": { gauge: { x: 39.1, y: 9.2, w: 8.3, h: 63.1, min: 1.1, max: 2 }, photo: true },
  };
  const sizeOf = image => E.imgSize?.(image) || [941, 1672];
  const svgFor = (image, run = E.R?.()) => {
    const v = views[image], phase = phaseFor(image, run);
    if (!v || !phase) return "";
    const [W, H] = sizeOf(image), X = p => p * W / 100, Y = p => p * H / 100;
    const id = "bt-rf-" + image.replace(/[^a-z0-9-]/g, "") + "-" + phase;
    const current = rowsFor(image, run);
    const parts = [], defs = [];
    const pathStyle = 'fill="none" stroke="currentColor" stroke-width="1.05" stroke-linecap="round" stroke-linejoin="round"';
    const archiveStyle = pathStyle.replace('stroke-width="1.05"', 'stroke-width="1.8"');
    archive.forEach((r, i) => defs.push(`<g id="${id}-a${i}" ${archiveStyle}>${inkLine(r.text).markup}</g>`));
    if (v.exclude?.length) defs.push(`<mask id="${id}-mask"><rect width="${W}" height="${H}" fill="white"/>${v.exclude.map(b => `<rect x="${X(b[0])}" y="${Y(b[1])}" width="${X(b[2])}" height="${Y(b[3])}" fill="black"/>`).join("")}</mask>`);
    // Background archive density reuses only documented, undated source rows.
    // At this scale it is texture, not an invented set of new clue readings.
    for (const [p, b] of (v.archive || []).entries()) {
      const x = X(b[0]), y = Y(b[1]), width = X(b[2]), height = Y(b[3]);
      const scale = Math.min(width / 320, 1), lineH = 20 * scale;
      const uses = [];
      for (let line = 0; line < Math.floor(height / lineH); line++) for (let col = 0; col < 2; col++) {
        const k = (line + col + p) % 3;
        uses.push(`<use href="#${id}-a${k}" transform="translate(${(x + col * width * .51).toFixed(2)} ${(y + line * lineH).toFixed(2)}) scale(${scale.toFixed(4)})" opacity="${(.48 + (line % 4) * .05).toFixed(3)}"/>`);
      }
      parts.push(`<g class="bt-refuge-archive"${v.exclude?.length ? ` mask="url(#${id}-mask)"` : ""}>${uses.join("")}</g>`);
    }
    if (v.readableArchive) {
      const [px, py, pw] = v.readableArchive;
      archive.forEach((r, i) => {
        const l = inkLine(r.text), scale = X(pw) / Math.max(...archive.map(a => inkLine(a.text).width));
        parts.push(`<g data-refuge-record="${r.id}" data-exact-text="${esc(r.text)}" transform="translate(${X(px)} ${Y(py) + i * 23 * scale}) scale(${scale})" opacity=".75" ${pathStyle}>${l.markup}</g>`);
      });
    }
    if (v.current) {
      const [px, py, pw] = v.current;
      const baseWidth = inkLine(rows.morning.text).width;
      current.forEach((r, i) => {
        const l = inkLine(r.text, { slope: r === rows.last ? .038 : 0, retrace: r === rows.last });
        const scale = X(pw) / baseWidth * (r === rows.keeper ? 1.08 : 1);
        parts.push(`<g class="bt-refuge-row" data-refuge-record="${r.id}" data-exact-text="${esc(r.text)}" transform="translate(${X(px)} ${Y(py + v.rowsY[i])}) scale(${scale})" ${pathStyle}>${l.markup}</g>`);
      });
    }
    if (v.sign) {
      const [px, py, pw, ph] = v.sign;
      parts.push(`<text x="${X(px)}" y="${Y(py + ph)}" textLength="${X(pw)}" lengthAdjust="spacingAndGlyphs" font-family="Georgia,serif" font-size="${Y(ph)}" fill="currentColor">REFUGE BOX</text>`);
    }
    if (v.gauge) {
      const g = v.gauge;
      for (let n = Math.ceil(g.min * 10); n <= Math.floor(g.max * 10); n++) {
        const level = n / 10, py = g.y + (g.max - level) / (g.max - g.min) * g.h;
        const label = inkLine(level.toFixed(1)), scale = X(g.w * .53) / label.width;
        parts.push(`<g data-gauge-m="${level.toFixed(1)}" transform="translate(${X(g.x)} ${Y(py) - 6 * scale}) scale(${scale})" ${pathStyle}>${label.markup}</g>`);
        parts.push(`<path d="M${X(g.x + g.w * .67)} ${Y(py)}H${X(g.x + g.w)}" stroke="currentColor" stroke-width="${W * .002}"/>`);
      }
    }
    const values = [...(v.current ? current : []), ...(v.readableArchive ? archive : [])].map(r => r.text).join("; ");
    return `<svg class="bt-refuge-svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" aria-hidden="true" data-refuge-phase="${phase}" data-refuge-lines="${esc(values)}"><defs>${defs.join("")}</defs>${parts.join("")}</svg>`;
  };

  const visit = (value, fn, seen = new WeakSet()) => {
    if (!value || typeof value !== "object" || seen.has(value)) return;
    seen.add(value); if (!Array.isArray(value)) fn(value);
    for (const child of Object.values(value)) visit(child, fn, seen);
  };
  const enOf = st => typeof st.n === "string" ? st.n : st.n?.en || "";
  const patchMetadata = () => {
    if (!READY || !isStory()) return;
    const S = E.S();
    for (const id of ["box-day", "box-night", "box-dark", "box-dawn"]) S.scenes[id] = { ...S.scenes.box, ...S.scenes[id], amb: "hut" };
    for (const [node, image] of [["c1_box", "box-day"], ["c2_boat", "box-night"], ["c3_refuge", "box-dark"]]) {
      visit(S.nodes[node], st => { if (st.bg === "box") st.bg = image; });
    }
    visit(S.nodes.c2_boat, st => {
      if (st.explore?.spots?.some(x => x.id === "tom")) {
        st.explore.img = "box-night";
        const zones = { tom: [12, 42, 32, 22], flask: [2.5, 65.5, 17, 9], wall: [9.5, 35.9, 34, 5.4], lamp: [19, 26.5, 17, 8.7] };
        st.explore.spots.forEach(sp => { if (zones[sp.id]) { sp.r = zones[sp.id]; sp.inspectR = zones[sp.id]; } });
      }
      if (st.pic === "act-wallphoto") { delete st.pic; st.shot = "act-wallphoto"; st.look = "refuge_readings"; }
      if (enOf(st).startsWith("Then he leans out of the door")) { delete st.pic; st.shot = "act-gaugephoto"; st.look = null; }
      if (enOf(st).startsWith("When you look round, Callum")) { st.shot = null; st.look = null; }
    });
    visit(S.nodes.c2_slip, st => { if (enOf(st).startsWith("Then the wall. Under this morning's line")) { st.shot = "act-wallphoto"; st.look = "refuge_readings"; } });
    visit(S.nodes.c4_cottage, st => {
      const t = enOf(st);
      if (t.startsWith("The wall. Small even numbers") || t === "You look at the two lines on the little screen.") { st.shot = "act-wallphoto"; st.look = "refuge_readings"; }
      if (t.startsWith("Leo swipes to the next picture.")) { st.shot = "act-gaugephoto"; st.look = null; }
      if (t.startsWith("Leo turns to a clean page in his notebook")) { st.shot = null; st.look = null; }
    });
    visit(S.nodes.c6_keeper, st => {
      // Native action.set is applied only by action.js's completion handler.
      // Cancelled/interrupted holds never write the row; no new array is needed.
      if (st.act?.kind === "hold" && st.act.r === "c6_last_line") st.act.set = "c6_wall_written";
    });
    const P = S.places.c1_box;
    const gauge = P?.views?.door?.zones?.find(z => z.id === "gauge");
    if (gauge) {
      gauge.to = "gauge";
      P.views.gauge = { img: "box-gauge-day", up: "door", name: { en: "Gauge from the doorway", vi: "Cọc đo nhìn từ cửa" }, zones: [
        { id: "gauge_read", r: "gauge", label: gauge.label, then: gauge.then },
      ] };
    }
    E.regions({
      "box-day": { size: [941, 1671], r: { line: [10, 34.5, 34, 10], hook: [20, 21, 16, 15] } },
      "box-door": { size: [941, 1671], r: { line: [10, 34.5, 34, 10], gauge: [49, 45, 22, 13], ladder: [48, 59, 24, 12] } },
      "box-line": { size: [941, 1672], r: { line: [16, 35, 62, 11] } },
      "box-walls": { size: [941, 1672], r: { soot: [16, 25, 69, 21], bench: [13, 56, 76, 11] } },
      "box-roof": { size: [941, 1671], r: { hook: [24, 42, 18, 18] } },
      "box-gauge-day": { size: [941, 1672], r: { gauge: [34, 6, 20, 74] } },
      "act-wallphoto": { size: [941, 1671], r: { refuge_readings: { box: [10, 35.5, 33.5, 7.8], maxScale: 3.2 } } },
      "act-gaugephoto": { size: [1448, 1086], r: { gauge: [37, 8, 14, 66] } },
      "act-ladder": { size: [941, 1672], r: { ladder: [16, 42, 66, 43] } },
      "cg-dawn-wall": { size: [941, 1672], r: { c6_last_line: [17, 45, 55, 7] } },
    });
  };

  let observer, raf = 0, cleanup = () => {};
  const paint = () => {
    raf = 0;
    if (!READY || !isStory()) return;
    const run = E.R();
    document.querySelectorAll(".se-bgl[data-image]").forEach(layer => {
      const image = layer.dataset.image;
      const old = layer.querySelector(":scope > .bt-refuge-ink");
      if (!views[image]) { old?.remove(); return; }
      const signature = image + "|" + phaseFor(image, run);
      if (old?.dataset.signature === signature) return;
      old?.remove();
      const svg = svgFor(image, run);
      if (!svg) return;
      layer.insertAdjacentHTML("beforeend", E.vbox(image, svg, "bt-refuge-ink"));
      const ink = layer.querySelector(":scope > .bt-refuge-ink");
      ink.dataset.signature = signature;
      E.syncImagePlanes?.(layer);
    });
    document.querySelectorAll(".se-pic:not(.out) .fr > i").forEach(el => {
      const image = [...el.classList].find(c => c.startsWith("im-"))?.slice(3);
      if (!views[image]) return;
      const signature = image + "|" + phaseFor(image, run);
      if (el.dataset.refugeSignature === signature) return;
      el.classList.add("bt-refuge-photo");
      el.dataset.refugeSignature = signature;
      el.querySelector(".bt-refuge-svg")?.remove();
      el.insertAdjacentHTML("beforeend", svgFor(image, run).replace('preserveAspectRatio="xMidYMid meet"', 'preserveAspectRatio="xMidYMid slice"'));
    });
  };
  const schedule = () => { if (READY && !raf) raf = requestAnimationFrame(paint); };
  const install = () => {
    cleanup();
    if (!READY || !isStory()) return;
    patchMetadata();
    const root = document.querySelector(".se-stage");
    if (!root) return;
    observer = new MutationObserver(schedule);
    observer.observe(root, { childList: true, subtree: true, attributes: true, attributeFilter: ["data-image", "class"] });
    cleanup = () => { observer?.disconnect(); cancelAnimationFrame(raf); raf = 0; };
    schedule();
  };

  E.plugin({
    id: "bt-refuge",
    css: ".bt-refuge-ink{pointer-events:none;z-index:1;color:#241f19}.bt-refuge-svg{position:absolute;inset:0;display:block;width:100%;height:100%;overflow:hidden;pointer-events:none;mix-blend-mode:multiply}.bt-refuge-photo{position:relative}.bt-refuge-photo .bt-refuge-svg{color:#241f19}.bt-refuge-ink .vbx{pointer-events:none}",
    on: { boot: install, chapter: patchMetadata, step: schedule, line: schedule, "image-plane": schedule },
    setup() {
      const nativeScene = E.ui?.scene;
      if (nativeScene) E.ui.scene = function (id, ...args) { return nativeScene.call(this, READY && isStory() && id === "box" ? boxFor(E.R()) : id, ...args); };
      E.btRefuge = Object.freeze({ ready: READY, rows, phaseFor, rowsFor, boxFor, svgFor, inkLine, patchMetadata, views, refresh: schedule, capture: Object.freeze({ date: "2024-11-14", time: "22:30", actualMetres: 1.1, printedMetres: 1.7 }) });
    },
  });
})();
