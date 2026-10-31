// Enmi Story Engine 3 — SÂN KHẤU (nạp sau mech-plus.js). Lời dẫn luôn “nhìn vào” một thứ; vật phẩm hiện ra tận mắt.
// Đặc tả: docs/story-engine/MECHANICS.md mục “Engine 3”. Tóm tắt:
//   VÙNG ẢNH   StoryEngine.regions({ "<ảnh>": { size: [w, h], r: { sign: [x, y, w, h] | { box, shape, fx, label } } } })
//              (sinh tự động từ art.json → regions.js bởi art-css.js; truyện cũng ghi tay được ở scenes.<cảnh>.regions)
//              x, y, w, h = % của ẢNH (không phải màn hình) → luôn khớp vật trên ảnh dù màn hình dài / ngắn.
//   look       { look: "sign" } máy quay trượt + phóng tới vùng của ảnh đang hiện · { look: null } lùi ra · gắn vào bất kỳ bước nào: { n: {…}, look: "posts" }
//   shot       { shot: "act-ring" } khung hình cho lời dẫn (toàn màn, chuyển nhanh, trôi nhẹ) · { shot: null } về cảnh · cũng là khoá phụ
//   prop       đạo cụ chuyển động trên ảnh: { prop: { id: "car", art: "it-car", at: [x, y, w], to: [x, y], ms: 1600, rot, fade, wait } } · { prop: { id: "car", off: true } }
//   item       nhận đồ = vật HIỆN RA giữa màn (từ đúng chỗ nó nằm nếu vừa chạm vùng), lật mặt sau (items.<mã>.sides), đọc (items.<mã>.doc) → bay vào túi
//   read       { read: "note" } (đọc giấy tờ của đồ vật) · { read: { paper, hand, title, lines: [{ en, vi, s }] } } · docs.<mã> dùng chung
//   slow       khoá phụ cho lựa chọn: { choice: […], timer: 6, slow: true } — chậm lại kiểu Detroit (màu nhạt, viền tối, tiếng tim)
//   Nhân vật: thở nhẹ khi đứng · chớp mắt nếu có ảnh im-<mã>[-<mặt>]-blink · đổi biểu cảm mờ chéo.
//   Chưa có ảnh: ?art=wire (hoặc Cài đặt dev) → khung dây hiện tên ảnh + các vùng — soát bố cục trước khi vẽ.
(() => {
  const E = globalThis.StoryEngine, def = E.def, esc = E.esc, h = E.h;
  const nat = t => E.nat(t);
  const investigationText = t => E.ui.investigationText?.(t) ?? esc(nat(t));
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const root = () => $(".se");
  const Q = new URLSearchParams(location.search);
  E.wire = Q.get("art") === "wire";
  const cond = (c, s) => (c == null ? true : typeof c === "function" ? !!c(s) : typeof c === "string" ? s.truth(c) || s.has(c) || !!s.f[c] : typeof c === "object" && !Array.isArray(c) ? Object.entries(c).every(([k, v]) => (+s.f[k] || 0) >= v) : !!c);
  E.cond = cond;
  const T = (en, vi) => nat({ en, vi });

  // ═════════ VÙNG ẢNH ═════════
  const REG = {};
  E.regions = o => { for (const k in o) { const a = REG[k] || {}; REG[k] = { ...a, ...o[k], r: { ...(a.r || {}), ...(o[k].r || {}) } }; } };
  E.regionsAll = REG;
  const normR = a => (!a ? null : Array.isArray(a) ? { box: a } : a.box ? a : null);
  // vùng của 1 ảnh: regions.js → scenes.<ảnh>.regions → views của địa điểm (khai báo tại chỗ)
  E.regionOf = (img, name) => {
    if (Array.isArray(name)) return { box: name };
    if (name && typeof name === "object") return normR(name);
    return normR(REG[img]?.r?.[name] ?? E.S()?.scenes?.[img]?.regions?.[name] ?? LOCAL[img]?.[name]);
  };
  const LOCAL = {}; // vùng khai báo trong view của place (regions: {…}) → đăng ký khi vẽ view
  E.regionsOf = img => ({ ...(E.S()?.scenes?.[img]?.regions || {}), ...(LOCAL[img] || {}), ...(REG[img]?.r || {}) });
  const naturalSizes = new Map(), imageLoads = new Map();
  E.imgSize = img => naturalSizes.get(img) || REG[img]?.size || E.S()?.scenes?.[img]?.size || [576, 1024];
  E.curImg = () => (E.ui.bgKey?.() || "").slice(2);
  // One physical image plane is shared by the bitmap, effects, actors and hit regions.
  // Percentages always refer to that plane, including cover crops and resized stages.
  E.fit = (img = E.curImg()) => REG[img]?.fit || E.S()?.scenes?.[img]?.fit || E.S()?.fit || "contain";
  E.coverBox = img => {
    const st = $(".se-stage"); if (!st) return { x: 0, y: 0, w: 1, h: 1 };
    const W = st.clientWidth, H = st.clientHeight, [iw, ih] = E.imgSize(img), sc = (E.fit(img) === "cover" ? Math.max : Math.min)(W / iw, H / ih);
    const f = E._frame && E._frame.img === img ? E._frame : { dx: 0, dy: 0 };
    return { x: (W - iw * sc) / 2 + f.dx, y: (H - ih * sc) / 2 + f.dy, w: iw * sc, h: ih * sc };
  };
  E.syncImagePlanes = layer => {
    const layers = layer ? [layer] : $$(".se-bgl[data-image]");
    for (const L of layers) {
      const img = L.dataset.image; if (!img) continue;
      const b = E.coverBox(img), fit = E.fit(img), [iw, ih] = E.imgSize(img);
      L.style.setProperty("--ar", String(iw / ih)); L.dataset.fit = fit;
      L.style.setProperty("--image-x", b.x + "px"); L.style.setProperty("--image-y", b.y + "px");
      L.style.setProperty("--image-w", b.w + "px"); L.style.setProperty("--image-h", b.h + "px");
      for (const el of L.querySelectorAll(":scope > .ii, .vbx")) {
        Object.assign(el.style, { left: b.x + "px", top: b.y + "px", right: "auto", bottom: "auto", width: b.w + "px", height: b.h + "px", margin: "0", transform: "none" });
        if (el.classList.contains("ii")) { el.style.backgroundSize = "100% 100%"; el.style.backgroundPosition = "center"; }
      }
      const ii = L.querySelector(":scope > .ii[class*='im-']"), bd = L.querySelector(":scope > .bd");
      if (fit === "cover") bd?.remove();
      else if (ii && !bd) L.insertAdjacentHTML("afterbegin", `<div class="bd ${ii.className.replace(/\bii\b/, "").trim()}"></div>`);
      for (const sprite of L.querySelectorAll(".pp.full .pp-i > .ii")) E.fitSprite?.(sprite);
    }
  };
  E._layerHook = (L, key) => {
    const img = key.slice(2); L.dataset.image = img;
    E.syncImagePlanes(L);
    const ii = L.querySelector(":scope > .ii"), bg = ii && getComputedStyle(ii).backgroundImage;
    const url = bg && /url\(["']?(.*?)["']?\)/.exec(bg)?.[1];
    if (!url || naturalSizes.has(img)) return;
    if (!imageLoads.has(url)) imageLoads.set(url, new Promise(resolve => {
      const im = new Image(); im.onload = () => resolve([im.naturalWidth, im.naturalHeight]); im.onerror = () => resolve(null); im.src = url;
    }));
    imageLoads.get(url).then(size => {
      if (!size?.[0] || !size[1]) return;
      naturalSizes.set(img, size);
      if (L.dataset.image === img) { E.syncImagePlanes(L); E.emit("image-plane", img); }
    });
  };
  let planeObserver;
  E.on("boot", () => {
    planeObserver?.disconnect(); const st = $(".se-stage");
    if (st && globalThis.ResizeObserver) { planeObserver = new ResizeObserver(() => { E.syncImagePlanes(); if (E.R()?.look) lookTo(E.R().look, 0, true); }); planeObserver.observe(st); }
    E.syncImagePlanes();
  });
  // LẤY KHUNG CHO MỌI MÀN HÌNH: ảnh phủ kín màn (cover) thì màn dài (điện thoại 19,5:9) cắt 2 bên, màn rộng (máy tính, máy tính bảng ngang) cắt trên dưới.
  //   frame(ảnh, [box…]) dời ảnh (trong giới hạn vẫn phủ kín) để MỌI vùng quan trọng nằm trong phần thấy được — trừ thanh trên (top) và
  //   thanh dưới (bottom, px). Ảnh + vùng chạm + đồ ghép + hiệu ứng dời CÙNG nhau (biến --fx / --fy trên lớp nền) → luôn trùng.
  E.ui.frame = (img, boxes, o = {}) => {
    const st = $(".se-stage"); if (!st) return;
    const layers = $$(".se-bgl[data-image]").filter(L => L.dataset.image === img);
    const W = st.clientWidth, H = st.clientHeight, [iw, ih] = E.imgSize(img), sc = (E.fit(img) === "cover" ? Math.max : Math.min)(W / iw, H / ih), cw = iw * sc, chh = ih * sc;
    const applyFrame = (dx, dy) => { E._frame = { img, dx, dy }; for (const L of layers) { L.style.setProperty("--fx", dx + "px"); L.style.setProperty("--fy", dy + "px"); E.syncImagePlanes(L); } };
    if (E.fit(img) !== "cover") return applyFrame(0, 0);
    const c = { x: (W - cw) / 2, y: (H - chh) / 2 };
    const bs = (boxes || []).filter(Boolean); if (!bs.length) return applyFrame(0, 0);
    const m = 2;
    const x0 = Math.min(...bs.map(b => b[0])) - m, x1 = Math.max(...bs.map(b => b[0] + b[2])) + m, y0 = Math.min(...bs.map(b => b[1])) - m, y1 = Math.max(...bs.map(b => b[1] + b[3])) + m;
    const top = o.top ?? 64, bot = o.bottom ?? 120;
    const fit = (lo, hi, a0, a1, size, base, max) => {
      // khoảng ảnh (px) cần thấy [a0, a1] · cửa sổ thấy được [lo, hi] · base = vị trí mép ảnh khi căn giữa · max = độ dời tối đa mỗi phía
      const p0 = base + a0 / 100 * size, p1 = base + a1 / 100 * size;
      let d = 0;
      if (p1 - p0 > hi - lo) d = (lo + hi) / 2 - (p0 + p1) / 2; else if (p0 < lo) d = lo - p0; else if (p1 > hi) d = hi - p1;
      return Math.max(-max, Math.min(max, d));
    };
    const dx = fit(0, W, x0, x1, cw, c.x, Math.abs(c.x)), dy = fit(top, H - bot, y0, y1, chh, c.y, Math.abs(c.y));
    applyFrame(dx, dy);
  };
  E.rectPx = (img, box) => { const c = E.coverBox(img); return { x: c.x + box[0] / 100 * c.w, y: c.y + box[1] / 100 * c.h, w: box[2] / 100 * c.w, h: box[3] / 100 * c.h }; };
  // HTML khung ảnh có cùng hình học với nền (lớp con đặt theo % của ẢNH): ar = rộng / cao
  // có ẢNH THẬT (luật trong art.css) — khác hasArt (truyện chưa có ảnh nào thì hasArt coi như có)
  let REAL = null;
  E.artReal = cls => { if (!REAL) { REAL = new Set(); try { for (const ss of document.styleSheets) for (const r of ss.cssRules || []) for (const m of (r.selectorText || "").matchAll(/\.(im-[\w-]+)/g)) REAL.add(m[1]); } catch {} } return REAL.has(cls); };
  // A full-body actor's authored region describes the visible person, not the
  // transparent PNG canvas. Read alpha bounds once; only CSS layout is changed.
  // Cross-origin/opaque art falls back to its natural canvas, still unstretched.
  const spriteInfo = new Map();
  E.fitSprite = el => {
    const url = /url\(["']?(.*?)["']?\)/.exec(getComputedStyle(el).backgroundImage)?.[1]; if (!url) return;
    const fit = info => {
      if (!el.isConnected || !info) return;
      const W = el.clientWidth, H = el.clientHeight, [x, y, w, h] = info.bounds;
      if (!W || !H || !w || !h) return;
      const scale = Math.min(W / w, H / h);
      el.style.backgroundSize = `${info.width * scale}px ${info.height * scale}px`;
      el.style.backgroundPosition = `${(W - w * scale) / 2 - x * scale}px ${H - (y + h) * scale}px`;
      const label = el.closest(".pp")?.querySelector(".pp-n"); if (label) label.style.top = Math.max(0, H - h * scale - 5) + "px";
      el.dataset.spriteFit = "visible-bounds";
    };
    let entry = spriteInfo.get(url);
    if (!entry) {
      entry = { info: null, ready: null }; spriteInfo.set(url, entry);
      entry.ready = new Promise(resolve => {
        const im = new Image(); im.onload = () => {
          const W = im.naturalWidth, H = im.naturalHeight, info = { width: W, height: H, bounds: [0, 0, W, H] };
          try {
            const canvas = document.createElement("canvas"); canvas.width = W; canvas.height = H;
            const ctx = canvas.getContext("2d", { willReadFrequently: true }); ctx.drawImage(im, 0, 0);
            const a = ctx.getImageData(0, 0, W, H).data; let x0 = W, y0 = H, x1 = -1, y1 = -1;
            for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (a[(y * W + x) * 4 + 3] >= 32) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
            if (x1 >= x0 && y1 >= y0) info.bounds = [Math.max(0, x0 - 2), Math.max(0, y0 - 2), Math.min(W, x1 + 3) - Math.max(0, x0 - 2), Math.min(H, y1 + 3) - Math.max(0, y0 - 2)];
          } catch { /* Natural-size containment remains a safe fallback. */ }
          entry.info = info; resolve(info);
        };
        im.onerror = () => resolve(null); im.src = url;
      });
    }
    if (entry.info) fit(entry.info); else entry.ready.then(fit);
  };
  E.vbox = (img, inner = "", cls = "") => { const [w, hh] = E.imgSize(img); return `<div class="vbw ${cls}"><div class="vbx" style="--ar:${(w / hh).toFixed(4)}">${inner}</div></div>`; };
  const pct = b => `left:${b[0]}%;top:${b[1]}%;width:${b[2]}%;height:${b[3]}%`;
  E.pctStyle = pct;
  // Physical scene props live separately from the interaction buttons. They
  // remain visible while an authored detail runs and never inherit a minimum
  // touch-target size. The same image plane positions both art and its glint.
  E.scenePropsHTML = (img, props = []) => E.vbox(img, props.map(p => `<i class="scene-prop ii im-${esc(p.art)}" data-scene-prop="${esc(p.id || p.art)}" aria-hidden="true" style="${pct(p.box)};background-size:contain;background-position:center;background-repeat:no-repeat;pointer-events:none;z-index:${p.z ?? 2}${p.rotate ? `;transform:rotate(${p.rotate}deg)` : ""}"></i>`).join(""), "scene-props");
  E.ui.sceneProps = (img, props) => {
    const R = E.R();
    if (props) R.sceneProps = { img, items: props };
    const items = props || (R.sceneProps?.img === img ? R.sceneProps.items : []);
    const signature = JSON.stringify(items);
    for (const L of $$(".se-bgl[data-image]").filter(l => l.dataset.image === img)) {
      const old = L.querySelector(":scope > .scene-props");
      if (old?.dataset.props === signature) { E.syncImagePlanes(L); continue; }
      old?.remove();
      if (items.length) { const zones = L.querySelector(":scope > .zones"); (zones || L).insertAdjacentHTML(zones ? "beforebegin" : "beforeend", E.scenePropsHTML(img, items)); L.querySelector(":scope > .scene-props").dataset.props = signature; }
      E.syncImagePlanes(L);
    }
  };

  // HIỆU ỨNG THEO VÙNG: ripple (nước lăn tăn) · flicker (đèn chập chờn) · glow (sáng nhẹ đập) · smoke (khói bốc) · twinkle (lấp lánh) · drip (giọt rơi) · fog (sương trôi)
  E.regionFx = {}; // plugin thêm: E.regionFx.ten = (vùng) => "<html>"
  const fxHtml = img => Object.entries(E.regionsOf(img)).map(([k, v]) => { const r = normR(v); if (!r?.fx) return ""; return String(r.fx).split(/\s+/).map(f => E.regionFx[f] ? E.regionFx[f](r) : `<i class="rfx rfx-${esc(f)}${r.shape === "ellipse" ? " el" : ""}" style="${pct(r.box)}"></i>`).join(""); }).join("");
  E.fxHtml = fxHtml;
  // khung dây (chưa có ảnh): tên ảnh + các vùng có nhãn
  E.wireHtml = (img, force) => {
    if (!force && !E.wire) return "";
    const rs = E.regionsOf(img);
    return `<div class="wire"><b>${esc(img)}</b>${Object.entries(rs).map(([k, v]) => { const r = normR(v); return r ? `<i class="${r.shape === "ellipse" ? "el" : ""}" style="${pct(r.box)}"><span>${esc(k)}</span></i>` : ""; }).join("")}</div>`;
  };

  // gắn lớp hiệu ứng vùng + khung dây vào cảnh (bg) vừa dựng
  const scene0 = E.ui.scene;
  E.ui.scene = (id, keepCg) => {
    const R = E.R();
    if (R?.shot && !keepCg) { R.shot = null; R.shotBack = null; root()?.classList.remove("shot"); }
    if (!keepCg) lookTo(null, 0, true);
    return Promise.resolve(scene0(id, keepCg)).then(() => {
      if (E.ui.bgKey() === "s:" + id) { decorate(id, !E.hasArt("im-" + id)); if (E.R()?.sceneProps?.img === id) E.ui.sceneProps(id); }
    });
  };
  function decorate(img, missing) {
    const L = $(".se-bgl.on"); if (!L || L.dataset.image !== img || L.querySelector(":scope > .deco")) return;
    const extra = fxHtml(img) + (missing || E.wire ? E.wireHtml(img, true) : "");
    if (extra) L.insertAdjacentHTML("beforeend", E.vbox(img, extra, "deco"));
    E.syncImagePlanes(L);
  }

  // ═════════ MÁY QUAY TỚI VÙNG (look) ═════════
  // đích = giữa phần màn trên hộp lời (≈ 38 % chiều cao); phóng vừa vùng, tối đa ×3,2
  function lookTo(name, ms = 1500, quiet) {
    const w = $(".se-bgw"), R = E.R(); if (!w) return;
    if (E.auto || globalThis.matchMedia?.("(prefers-reduced-motion: reduce)").matches) ms = 0;
    if (name == null || name === false) {
      if (!w.style.transform && !quiet) return;
      w.style.transition = quiet ? "none" : `transform ${ms}ms cubic-bezier(.45,0,.2,1)`;
      w.style.transform = "";
      if (R) R.look = null;
      root()?.classList.remove("looking");
      return;
    }
    const img = E.curImg(), r = E.regionOf(img, name);
    if (!r) { console.warn("[story] look: không có vùng", name, "trên", img); return; }
    const st = $(".se-stage"), W = st.clientWidth, H = st.clientHeight, p = E.rectPx(img, r.box);
    const k = Math.max(1, Math.min(3.2, (W * 0.84) / p.w, (H * 0.5) / p.h));
    const cx = p.x + p.w / 2, cy = p.y + p.h / 2;
    // không để lộ mép ảnh: kẹp tịnh tiến trong phần ảnh
    const c = E.coverBox(img);
    let tx = W / 2 - k * cx, ty = H * 0.38 - k * cy;
    tx = Math.min(-k * c.x, Math.max(W - k * (c.x + c.w), tx));
    ty = Math.min(-k * c.y, Math.max(H - k * (c.y + c.h), ty));
    w.dataset.cam = "";
    w.style.transformOrigin = "0 0";
    w.style.transition = `transform ${ms}ms cubic-bezier(.45,0,.2,1)`;
    w.style.transform = `translate(${tx.toFixed(1)}px,${ty.toFixed(1)}px) scale(${k.toFixed(3)})`;
    root()?.classList.add("looking");
    if (R) R.look = name;
  }
  E.ui.look = lookTo;
  def("look", async ({ st }) => lookTo(st.look, st.ms));
  E.side("look", async v => lookTo(v));

  // ═════════ KHUNG HÌNH CHO LỜI DẪN (shot) ═════════
  E.ui.shot = (name, o = {}) => {
    const R = E.R(), rt = root();
    if (!name) {
      if (!R.shot) return Promise.resolve();
      const back = R.shotBack; R.shot = null; R.shotBack = null; rt.classList.remove("shot");
      let ready;
      if (back?.key?.startsWith("v:")) {
        rt.classList.remove("cg");
        const img = back.key.slice(2), has = E.hasArt("im-" + img);
        E.ui.layer(back.key, `<div class="ph vph"></div>${has ? `<div class="ii im-${esc(img)}"></div>` : ""}` + E.vbox(img, fxHtml(img) + E.wireHtml(img, !has || E.wire), "deco") + (R.sceneProps?.img === img ? E.scenePropsHTML(img, R.sceneProps.items) : "") + E.vbox(img, "", "zones"), { tr: "still" });
        ready = E.ui.layerReady?.();
      } else { rt.classList.remove("cg"); ready = E.ui.scene(back?.scene || R.scene, false); }
      return Promise.resolve(ready).then(() => {
        if (E.R() === R && back?.look && !R.shot && E.ui.bgKey() === back.key) lookTo(back.look, 0, true);
      });
    }
    if (o.clearProps) { R.props = {}; rt.querySelectorAll(".vbw.props").forEach(el => el.remove()); }
    const has = E.hasArt("im-" + name);
    if (!has && !E.wire) return Promise.resolve(); // chưa vẽ → giữ khung đang có
    if (!R.shot && !o.restore) R.shotBack = { key: E.ui.bgKey(), scene: R.scene, look: R.look };
    lookTo(null, 0, true);
    R.shot = name;
    rt.classList.add("cg", "shot");
    E.ui.layer("h:" + name, `<div class="ph cgph"></div>${has ? `<div class="ii im-${esc(name)}"></div>` : ""}` + E.vbox(name, fxHtml(name) + (has && !E.wire ? "" : E.wireHtml(name, true)), "deco"), { cls: "cgl", tr: o.tr ?? "still" });
    return Promise.resolve(E.ui.layerReady?.());
  };
  def("shot", async ({ st }) => E.ui.shot(st.shot, st));
  E.side("shot", async (v, st) => E.ui.shot(v, st));

  // ═════════ ĐẠO CỤ CHUYỂN ĐỘNG (prop) ═════════
  // at / to: [x, y] tâm (% ảnh) hoặc tên vùng (tâm vùng) · w = bề rộng (% ảnh) · ar = rộng/cao · rot: [độ đầu, độ cuối] · fade: "in" | "out"
  const center = (img, v) => { if (Array.isArray(v)) return v; const r = E.regionOf(img, v); return r ? [r.box[0] + r.box[2] / 2, r.box[1] + r.box[3] / 2, r.box[2]] : [50, 50]; };
  def("prop", async ({ st }) => {
    const P = st.prop, img = E.curImg(), L = $(".se-bgl.on"), R = E.R(); if (!L || !P?.id) return;
    let box = L.querySelector(".vbw.props .vbx");
    if (!box) { L.insertAdjacentHTML("beforeend", E.vbox(img, "", "props")); E.syncImagePlanes(L); box = L.querySelector(".vbw.props .vbx"); }
    let el = box.querySelector(`[data-p="${P.id}"]`);
    if (P.off) { if (el) { el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: P.ms || 400, fill: "forwards" }); setTimeout(() => el.remove(), P.ms || 400); } delete (R.props || {})[P.id]; return; }
    const a = center(img, P.at ?? el?.dataset.at?.split(",").map(Number) ?? [50, 50]);
    const w = P.w ?? a[2] ?? 20;
    if (!el) {
      el = h(`<div class="prp" data-p="${esc(P.id)}"><div class="ii im-${esc(P.art || "it-" + P.id)}"></div>${E.hasArt("im-" + (P.art || "it-" + P.id)) ? "" : `<span class="prp-ph">${esc(P.id)}</span>`}</div>`);
      box.appendChild(el);
    }
    el.style.cssText = `left:${a[0]}%;top:${a[1]}%;width:${w}%;aspect-ratio:${P.ar || 1};z-index:${P.z || 1}`;
    const to = P.to != null ? center(img, P.to) : null, rot = P.rot || [0, 0], ms = E.auto ? 1 : P.ms || 1200;
    const b = to || a;
    const kf = [
      { left: a[0] + "%", top: a[1] + "%", transform: `translate(-50%,-50%) rotate(${rot[0]}deg)`, opacity: P.fade === "in" ? 0 : 1 },
      { left: b[0] + "%", top: b[1] + "%", transform: `translate(-50%,-50%) rotate(${rot[1]}deg)`, opacity: P.fade === "out" ? 0 : 1 },
    ];
    const an = el.animate(kf, { duration: ms, easing: P.ease || "cubic-bezier(.45,0,.25,1)", fill: "forwards", delay: P.delay || 0 });
    (R.props ||= {})[P.id] = { art: P.art, at: to || a, w, ar: P.ar, z: P.z, img };
    el.dataset.at = (to || a).join(",");
    if (P.sfx) E.sfx(P.sfx);
    if (P.wait) await an.finished.catch(() => {});
  });

  // ═════════ CHUYỂN ĐỘNG CHẬM khi chọn (Detroit) ═════════
  E.side("slow", async v => {
    if (!v || E.auto) return;
    const rt = root(); rt.classList.add("slowmo"); E.sfx("sting"); E.haptic("MEDIUM");
    let n = 0; const off = E.on("step", () => { if (++n > 1) { rt.classList.remove("slowmo"); off(); } });
  });

  // ═════════ VẬT PHẨM HIỆN RA ═════════
  // items.<mã>.sides = [{ t }, { art: "it-ring-in", t: { en, vi }, note, set, truth }] — mặt 0 = ảnh it-<mã>; lật lần đầu 1 mặt = áp set / ghi chú
  // items.<mã>.doc = { paper, hand, lines } → nút “Đọc”
  const sidesOf = id => { const it = E.S().items?.[id]; return it?.sides?.length ? it.sides : null; };
  const artOf = (id, k) => (k ? sidesOf(id)?.[k]?.art : null) || "it-" + id;
  const bigArt = (id, k = 0) => { const it = E.S().items?.[id]; const a = artOf(id, k); if (!k && !E.artReal?.("im-"+a)) return E.itemArt(id,"rv-a"); return `<span class="se-ia rv-a"><span class="ic">${E.ICON[it?.icon] || E.ICON.box}</span><i class="im-${esc(a)}"></i></span>`; };
  const seeSide = (id, k) => {
    const R = E.R(), sd = sidesOf(id)?.[k]; if (!sd) return;
    const key = `side:${id}:${k}`; if (R.used[key]) return; R.used[key] = 1;
    E.apply(sd);
    if (sd.note) (R.jot ||= []).push({ ch: R.ch, t: sd.note });
    if (sd.truth && !E.G().truths[sd.truth]) { R.truths[sd.truth] = 1; E.G().truths[sd.truth] = Date.now(); E.ui.dot(true); E.ui.toast(`${E.ICON.bulb || ""}<span><small>${esc(T("Truth uncovered", "Sự thật mới"))}</small><b>${esc(nat(E.S().truths?.[sd.truth]?.name))}</b></span>`, 3000, "item"); }
    E.save();
  };
  // khung xem vật: dùng cho lúc nhận đồ (fresh) và khi mở từ túi / hồ sơ
  E.ui.reveal = (id, o = {}) => new Promise(res => {
    const S = E.S(), it = S.items?.[id], rt = root(); if (!it || !rt) return res();
    $(".se-rev", rt)?.remove();
    const sides = sidesOf(id), doc = it.doc || S.docs?.[id];
    let k = 0;
    const v = h(`<div class="se-rev${o.fresh ? " fresh" : ""}"><div class="rv-bg"></div><div class="rv-c">
      ${o.fresh ? `<small class="rv-k">${esc((it.recordType||it.kind)==="testimony"?T("Account recorded", "Đã ghi lời khai"):T("Added to records", "Đã thêm hồ sơ"))}</small>` : ""}
      <div class="rv-st">${bigArt(id, 0)}</div>
      <b class="rv-n">${investigationText(it.name)}</b><p class="rv-d">${investigationText(sides?.[0]?.t || it.desc)}</p>
      <div class="rv-b">${sides ? `<button class="se-btn" data-turn>${E.ICON.flip || "↻"}<span>${esc(T("Turn over", "Lật lại"))}</span></button>` : ""}${doc ? `<button class="se-btn" data-read>${E.ICON.doc || ""}<span>${esc(T("Read", "Đọc"))}</span></button>` : ""}</div>
      <button class="rv-tap" type="button">${esc(o.fresh ? T("Tap to put it in your bag", "Chạm để cất vào túi") : T("Tap to close", "Chạm để đóng"))}</button></div></div>`);
    rt.appendChild(v);
    o.context?.onExit?.(() => { v.remove(); res(); });
    // bay ra từ chỗ vật nằm (vùng vừa chạm) → giữa màn
    const art = $(".rv-st", v);
    if (o.from && !E.auto) { const b = art.getBoundingClientRect(), f = o.from; art.animate([{ transform: `translate(${f.x + f.w / 2 - (b.left + b.width / 2)}px,${f.y + f.h / 2 - (b.top + b.height / 2)}px) scale(${Math.max(.15, Math.min(1, f.w / b.width))})`, opacity: .4 }, { transform: "none", opacity: 1 }], { duration: 620, easing: "cubic-bezier(.2,.9,.25,1)" }); }
    if (o.fresh) { E.sfx("item"); E.haptic("LIGHT"); }
    const turn = () => {
      k = (k + 1) % sides.length; seeSide(id, k);
      art.animate([{ transform: "rotateY(0)" }, { transform: "rotateY(90deg)" }], { duration: 180, easing: "ease-in" }).finished.then(() => {
        art.innerHTML = bigArt(id, k); $(".rv-d", v).innerHTML = investigationText(sides[k].t || it.desc);
        art.animate([{ transform: "rotateY(-90deg)" }, { transform: "rotateY(0)" }], { duration: 220, easing: "ease-out" });
      });
      E.sfx("page");
    };
    let busy = false;
    const close = () => {
      if (busy) return; busy = true;
      const bag = $(".se-top [data-a=book]", rt);
      if (o.fresh && bag && !E.auto) {
        const a = art.getBoundingClientRect(), b = bag.getBoundingClientRect();
        art.animate([{ transform: "none", opacity: 1 }, { transform: `translate(${b.left + b.width / 2 - (a.left + a.width / 2)}px,${b.top + b.height / 2 - (a.top + a.height / 2)}px) scale(.12)`, opacity: .2 }], { duration: 520, easing: "cubic-bezier(.5,0,.75,0)", fill: "forwards" });
        setTimeout(() => { bag.classList.remove("got"); void bag.offsetWidth; bag.classList.add("got"); E.sfx("pick"); }, 480);
      }
      v.classList.add("out");
      setTimeout(() => { v.remove(); res(); }, o.fresh && !E.auto ? 560 : 240);
    };
    v.onclick = async e => {
      if (e.target.closest("[data-turn]")) { e.stopPropagation(); return turn(); }
      if (e.target.closest("[data-read]")) { e.stopPropagation(); v.hidden = true; await E.ui.read(id, o.context); if (v.isConnected) v.hidden = false; return; }
      if (e.target.closest(".rv-c") && !o.fresh && !e.target.closest(".rv-tap")) return;
      close();
    };
    if (E.auto) setTimeout(close, 5);
  });
  // nhận đồ: vật hiện ra (quiet = chỉ chấm đỏ ở túi). from: tên vùng trên ảnh đang hiện (vật bay ra từ đó)
  def("item", async c => {
    const { st } = c;
    const R = E.R(); if (R.items.includes(st.item)) return;
    R.items.push(st.item); E.save(); E.ui.dot(true); E.emit("item", st.item);
    if (st.quiet) return;
    const it=E.S().items?.[st.item];
    if (E.S().recordReceipts && (it?.recordType||it?.kind)==="testimony") { E._zoneRect=null; E.ui.itemNotice(st.item); return; }
    let from = E._zoneRect || null;
    if (st.from) { const img = E.curImg(), r = E.regionOf(img, st.from); if (r) { const p = E.rectPx(img, r.box), sr = $(".se-stage").getBoundingClientRect(); from = { x: sr.left + p.x, y: sr.top + p.y, w: p.w, h: p.h }; } }
    E._zoneRect = null;
    E.ui.hideBox();
    await E.ui.reveal(st.item, { fresh: true, from, context:c });
  });
  // túi / hồ sơ: chạm 1 vật → khung xem có Lật / Đọc (thay khung cũ chỉ có ảnh + mô tả, giữ “Ghép với…”)
  const iv0 = E.ui.itemView;
  E.ui.itemView = id => {
    iv0(id);
    const it = E.S().items?.[id], v = $(".se-iv"); if (!v || !it) return;
    const doc = it.doc || E.S().docs?.[id];
    if (!sidesOf(id) && !doc) return;
    const row = h(`<div class="rv-b">${sidesOf(id) ? `<button class="se-btn" data-turn>${E.ICON.flip || "↻"}<span>${esc(T("Turn over", "Lật lại"))}</span></button>` : ""}${doc ? `<button class="se-btn" data-read>${E.ICON.doc || ""}<span>${esc(T("Read", "Đọc"))}</span></button>` : ""}</div>`);
    $(".se-ivc", v)?.insertBefore(row, $(".se-ivc > small", v));
    row.onclick = e => {
      e.stopPropagation();
      if (e.target.closest("[data-read]")) return E.ui.read(id);
      if (e.target.closest("[data-turn]")) { v.remove(); E.ui.reveal(id); setTimeout(() => $(".se-rev [data-turn]")?.click(), 60); }
    };
  };

  // ═════════ ĐỌC GIẤY TỜ (read) ═════════
  // doc: { paper: "note" | "letter" | "card" | "report" | "log" | "list" | "screen" | "sign" | "label", hand: "caps" | "script" | "type" | "print" | "marker",
  //        title: { en, vi }, art: "doc-x" (ảnh nền giấy tuỳ chọn), lines: [{ en, vi, s: "pencil" | "cross" | "stamp" | "small" | "big" | "red" | "faded" | "gap" }],
  //        note: { en, vi } (ghi vào sổ lần đọc đầu), set, mark: [chỉ số dòng quan trọng — sáng lên khi đọc lại] }
  // Chữ là CHỮ THẬT (không vẽ bằng AI) → sắc nét, chạm từ để tra; dòng dịch hiện theo nút Dịch / “Luôn dịch”.
  E.ui.read = (spec, context) => new Promise(res => {
    const S = E.S(), R = E.R(), rt = root();
    const id = typeof spec === "string" ? spec : null;
    const d = id ? (S.items?.[id]?.doc || S.docs?.[id]) : spec;
    if (!d || !rt) return res();
    const key = "read:" + (id || E.hash?.(JSON.stringify(d).slice(0, 200)) || "x");
    const first = !R.used[key]; R.used[key] = 1;
    if (first) { E.apply(d); if (d.note) (R.jot ||= []).push({ ch: R.ch, t: d.note }); }
    let tr = !!E.G().set.tr;
    const line = (l, i) => {
      if (l.s === "gap") return `<div class="dl gap"></div>`;
      const main = E.tgt(l), sub = E.sub(l);
      return `<div class="dl${l.s ? " " + l.s.split(" ").map(x => "s-" + x).join(" ") : ""}${(d.mark || []).includes(i) && !first ? " mk" : ""}"><span class="dm">${E.words(main, E.L)}</span>${sub ? `<small class="dt">${esc(sub.replace(/\[\[|\]\]/g, ""))}</small>` : ""}</div>`;
    };
    const v = h(`<div class="se-read${tr ? " tr" : ""}" role="dialog" aria-modal="true" aria-label="${esc(nat(d.title)||T("Document", "Tài liệu"))}" tabindex="-1"><div class="rd-bg"></div>
      <div class="rd-p p-${esc(d.paper || "note")} h-${esc(d.hand || "print")}">${d.art ? `<i class="rd-art im-${esc(d.art)}"></i>` : ""}
        ${d.title ? `<div class="rd-t">${esc(E.tgt(d.title))}</div>` : ""}<div class="rd-l">${(d.lines || []).map(line).join("")}</div></div>
      <div class="rd-bar"><button class="se-btn" data-tr>${E.ICON.tr}<span>${esc(T("Translate", "Dịch"))}</span></button><button class="se-btn pri" data-x>${esc(T("Done", "Xong"))}</button></div></div>`);
    rt.appendChild(v);
    E.sfx("page"); E.haptic("LIGHT");
    let closed = false;
    const returnTo = document.activeElement;
    const close = () => { if (closed) return; closed = true; v.classList.add("out"); setTimeout(() => { v.remove(); if (returnTo?.isConnected) returnTo.focus?.({preventScroll:true}); res(); }, 260); };
    context?.onExit?.(() => { closed = true; v.remove(); res(); });
    v.onkeydown = e => { if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); return close(); } if (e.key === "Tab") { const bs=[...v.querySelectorAll('button')].filter(b=>!b.disabled),first=bs[0],last=bs.at(-1); if (e.shiftKey && (document.activeElement===first || document.activeElement===v)) {e.preventDefault();last?.focus();} else if (!e.shiftKey && document.activeElement===last) {e.preventDefault();first?.focus();} } };
    requestAnimationFrame(() => { if (v.isConnected) v.querySelector('[data-x]')?.focus({preventScroll:true}); });
    v.onclick = e => {
      const w = e.target.closest(".w[data-w]"); if (w) return; // tra từ: bộ bắt chạm chung của engine xử lý
      if (e.target.closest("[data-tr]")) { tr = !tr; v.classList.toggle("tr", tr); E.sfx("tap"); return; }
      if (e.target.closest("[data-x]") || e.target.closest(".rd-bg")) close();
    };
    if (E.auto) setTimeout(close, 5);
  });
  def("read", async c => { c.resumeHere?.(); E.ui.hideBox(); await E.ui.read(c.st.read,c); c.resumeHere?.(false); });

  // ═════════ NHÂN VẬT: đổi biểu cảm mờ chéo · chớp mắt ═════════
  const show0 = E.ui.show;
  E.ui.show = (id, at, face) => {
    const el = $(`.se-ch[data-id="${id}"]`);
    if (el && (el.dataset.face || "") !== (face || "") && !E.auto) {
      const cur = el.classList.contains("hasf") ? el.querySelector(".ii.f") : el.querySelector(".ii.im-" + id);
      if (cur) { const g = cur.cloneNode(); g.className = cur.className.replace(/\bf\b/, "") + " fo"; el.querySelector(".se-chi").appendChild(g); setTimeout(() => g.remove(), 260); }
    }
    show0(id, at, face);
    const n = $(`.se-ch[data-id="${id}"]`); if (n && !n.style.getPropertyValue("--bd")) n.style.setProperty("--bd", (-Math.random() * 5).toFixed(2) + "s");
  };
  let blinkT = 0;
  const blink = () => {
    clearTimeout(blinkT);
    blinkT = setTimeout(blink, 2600 + Math.random() * 3600);
    if (E.auto || document.hidden) return;
    for (const el of $$(".se-ch.on")) {
      if (Math.random() < .35) continue;
      const id = el.dataset.id, f = el.dataset.face, cls = `im-${id}${f && el.classList.contains("hasf") ? "-" + f : ""}-blink`;
      if (!E.hasArt(cls)) continue;
      let b = el.querySelector(".ii.bk"); if (!b) { b = h(`<div class="ii bk"></div>`); el.querySelector(".se-chi").appendChild(b); }
      b.className = "ii bk " + cls; b.classList.add("on"); setTimeout(() => b.classList.remove("on"), 130);
    }
  };
  E.on("boot", () => setTimeout(blink, 2000));

  // ═════════ khôi phục / dọn ═════════
  const restore0 = E.ui.restore;
  let restoreToken = 0;
  E.ui.restore = () => {
    const R = E.R(), look = R.look, token = ++restoreToken;
    restore0();
    if (R.shot) { const s = R.shot; R.shot = null; E.ui.shot(s, { tr: "cut", restore: true }); }
    else if (R.scene) decorate(R.scene, !E.hasArt("im-" + R.scene));
    const key = E.ui.bgKey();
    // A restored bitmap may still be decoding. Adding props immediately would
    // attach them to the outgoing title/scene layer and make them disappear.
    return Promise.resolve(E.ui.layerReady?.()).then(() => {
      if (token !== restoreToken || E.R() !== R || E.ui.bgKey() !== key) return;
      if (look) lookTo(look, 0);
      for (const id in R.props || {}) { const p = R.props[id]; if (p.img === E.curImg()) E.mech.prop({ st: { prop: { id, art: p.art, at: p.at, w: p.w, ar: p.ar, z: p.z, ms: 1 } } }); }
    });
  };
  const reset0 = E.ui.reset;
  E.ui.reset = () => { ++restoreToken; const R = E.R(), look = R?.look; reset0(); lookTo(null, 0, true); if (R) R.look = look; const rt = root(); rt?.classList.remove("shot", "slowmo"); $(".se-rev")?.remove(); $(".se-read")?.remove(); };
  // sang cảnh khác → đạo cụ của cảnh cũ không còn
  E.on("step", (type, st) => { if (type === "bg" && E.R()?.props) E.R().props = {}; });

  // icon thêm
  Object.assign(E.ICON, {
    flip: E.ICON.flip || `<svg viewBox="0 0 24 24"><path d="M4 12a8 8 0 0 1 14-5.3M20 4v5h-5M20 12a8 8 0 0 1-14 5.3M4 20v-5h5"/></svg>`,
    doc: E.ICON.doc || `<svg viewBox="0 0 24 24"><path d="M7 3h7l5 5v13H7zM14 3v5h5M10 13h6M10 17h6"/></svg>`,
    left: `<svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg>`,
    right: `<svg viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg>`,
    down: `<svg viewBox="0 0 24 24"><path d="M5 9l7 7 7-7"/></svg>`,
    hint: `<svg viewBox="0 0 24 24"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z"/></svg>`,
    hand: `<svg viewBox="0 0 24 24"><path d="M8 13V5.5a1.5 1.5 0 0 1 3 0V12M11 11V4.5a1.5 1.5 0 0 1 3 0V12M14 11.5V6a1.5 1.5 0 0 1 3 0v7.5c0 4-2.5 7.5-6.5 7.5-2.8 0-4.4-1.4-5.8-3.8L3 13.4a1.5 1.5 0 0 1 2.6-1.4L8 15"/></svg>`,
    talk: `<svg viewBox="0 0 24 24"><path d="M4 5h16v11H9l-5 4z"/></svg>`,
  });
})();

// ═════════ LÀN TRẠNG THÁI + LÀN THÔNG BÁO (engine 3 — người dùng 30/10: “thông báo, tên địa điểm, giờ dễ bị đè UI”) ═════════
// · Tên địa điểm + giờ nằm TRONG thanh trên (viên giữa, giữa nút menu và cụm nút) — đổi cảnh: viên nở ra (tên + giờ) ~3,6 giây rồi thu lại
//   chỉ còn giờ (nếu truyện có đồng hồ). Chạm viên = xem lại địa điểm. Không còn thẻ địa điểm nổi đè lên hình / thông báo.
// · Mọi thông báo (nhận đồ, “X sẽ nhớ”, nhân vật mới, toast) xếp chung 1 cột dưới thanh trên → không chồng lên nhau.
(() => {
  const E = globalThis.StoryEngine, h = E.h, $ = s => document.querySelector(s);
  let tmr = 0, cur = { n: "", t: "" };
  E.ui.loc = (name, time) => {
    const st = $(".se-stat"); if (!st) return;
    if (name != null) cur.n = name; if (time != null) cur.t = time;
    st.querySelector(".st-n").textContent = cur.n || "";
    st.querySelector(".st-t").textContent = cur.t || "";
    st.classList.add("big"); st.classList.toggle("has", !!cur.n);
    clearTimeout(tmr); tmr = setTimeout(() => st.classList.remove("big"), E.auto ? 1 : 3600);
  };
  E.on("boot", () => {
    const top = $(".se-top"), menu = top?.querySelector("[data-a=menu]");
    if (top && !top.querySelector(".se-stat")) {
      const st = h(`<button class="se-stat" aria-label="${E.esc(E.nat({ en: "Where am I", vi: "Đang ở đâu" }))}"><span class="st-l"><b class="st-n"></b><small class="st-t"></small></span><span class="sp-clock" hidden></span></button>`);
      menu ? menu.after(st) : top.prepend(st);
      st.onclick = e => { e.stopPropagation(); if (cur.n) E.ui.loc(); };
    }
    // nhãn lời suy nghĩ theo ngôn ngữ người chơi (CSS content đọc biến)
    document.querySelector(".se")?.classList.toggle("fit-cover", E.fit() === "cover");
    document.querySelector(".se")?.style.setProperty("--se-think-l", JSON.stringify(E.nat({ en: "You think", vi: "Bạn nghĩ" })));
    // “X sẽ nhớ” + nhân vật mới vào chung cột thông báo
    const tb = $(".se-toast"), mem = $(".se-mem");
    if (tb && mem && !$(".se-lane")) { const lane = h(`<div class="se-lane"></div>`); tb.before(lane); lane.append(mem, tb); }
  });
  // cảnh mới (core ghi vào .se-loc cũ) → chuyển sang viên trạng thái
  const sc = E.ui.scene;
  E.ui.scene = (id, keep) => {
    const loc = $(".se-loc"), before = loc?.dataset.n;
    const ready = sc(id, keep);
    if (loc && loc.dataset.n !== before && loc.classList.contains("in")) { loc.classList.remove("in"); const S = E.S().scenes[id] || {}; E.ui.loc(E.nat(S.name) || "", S.time ? E.nat(S.time) : (E.R().clock?.t || "")); }
    return ready;
  };
  // đồng hồ đổi → giờ trong viên cũng đổi
  E.on("step", type => { if (type === "clock") setTimeout(() => { const t = E.R().clock?.t; cur.t = t || cur.t; $(".se-stat")?.classList.toggle("clk", !!E.R().clock); }, 0); });
})();

// ═════════ HỘP LỜI kiểu visual novel: màu người nói · TỰ CHẠY (auto) ═════════
// · Bảng tên + viền trên hộp lời mang màu nhân vật đang nói (bạn = màu chủ đạo).
// · TỰ CHẠY (người dùng 30/10: bản đầu “chưa ổn”): chờ chữ hiện HẾT + giọng đọc XONG → đếm thời gian đọc (thanh mảnh trên hộp lời chạy hết)
//   → sang câu sau. Chạm màn = sang câu ngay (KHÔNG tắt tự chạy, như Ren'Py). Gặp lựa chọn / câu đố / thẻ sự thật / bảng / sổ tay → tự đứng chờ.
//   Tắt / bật: nút trên hộp lời (nhớ giữa các lần chơi).
(() => {
  const E = globalThis.StoryEngine, h = E.h, $ = s => document.querySelector(s), T = (en, vi) => E.nat({ en, vi });
  let seq = 0, tm = 0, voice = null;
  const box = () => $(".se-box");
  // giọng đọc của câu hiện tại (lời hội thoại / lời dẫn khi bật đọc lời dẫn) — tự chạy chờ đọc xong
  const say0 = E.say;
  E.say = (...a) => { const p = say0(...a); voice = p; return p; };
  const on = () => !!E.G()?.set.autoAdv;
  const busy = () => $(".se-sheet:not([hidden]), .se-rev, .se-read, .se-card:not([hidden]), .se-iv, .se-pop");
  const bar = () => { let b = box()?.querySelector(".se-ap"); if (!b && box()) { b = h(`<i class="se-ap"></i>`); box().appendChild(b); } return b; };
  const stopBar = () => { const b = box()?.querySelector(".se-ap"); if (b) { b.style.transition = "none"; b.style.transform = "scaleX(0)"; } };
  const setAuto = v => { E.G().set.autoAdv = !!v; E.save(); $(".se-autob")?.classList.toggle("on", !!v); $(".se")?.classList.toggle("autoing", !!v); if (v) arm(); else { clearTimeout(tm); stopBar(); } };
  async function arm() {
    clearTimeout(tm); stopBar();
    const b = box(); if (!on() || !b || b.hidden || E.auto) return;
    const my = seq, v = voice;
    // 1) chữ hiện hết (lớp done do core gắn)
    while (my === seq && !b.classList.contains("done")) await new Promise(r => setTimeout(r, 80));
    // 2) giọng đọc xong (tối đa 30 giây)
    let spoke = false;
    if (v) { const t0 = Date.now(); await Promise.race([v, new Promise(r => setTimeout(r, 30000))]); spoke = Date.now() - t0 > 300; }
    if (my !== seq || !on() || b.hidden) return;
    // 3) thời gian đọc: đã nghe giọng → nghỉ ngắn; không giọng → theo độ dài câu (kèm dòng dịch nếu đang hiện)
    const sp = Math.max(.7, E.G().set.speed || 1), n = (b.querySelector(".se-txt")?.textContent || "").length + (b.querySelector(".se-sub:not([hidden])")?.textContent || "").length * .5;
    const wait = (spoke ? 700 : Math.min(9000, 900 + n * 42)) / sp;
    const pb = bar(); pb.style.transition = "none"; pb.style.transform = "scaleX(0)"; void pb.offsetWidth;
    pb.style.transition = `transform ${wait}ms linear`; pb.style.transform = "scaleX(1)";
    const fire = () => {
      if (my !== seq || !on() || b.hidden) return;
      if (busy()) { tm = setTimeout(fire, 400); return; }
      stopBar(); b.click();
    };
    tm = setTimeout(fire, wait);
  }
  E.on("line", d => {
    seq++; voice = null;
    const b = box(); if (!b) return;
    const ch = d.who === "me" ? null : E.S().chars[d.who];
    b.style.setProperty("--sc", d.kind !== "say" ? "transparent" : d.who === "me" ? "var(--se-ac)" : ch?.color || "#aaa");
    // E.say gọi NGAY SAU sự kiện line → đợi 1 nhịp mới bắt được lời hứa của giọng đọc
    setTimeout(arm, 0);
  });
  E.on("boot", () => {
    const tools = $(".se-tools"); if (!tools || $(".se-autob")) return;
    const bt = h(`<button class="se-autob${on() ? " on" : ""}" aria-label="${E.esc(T("Auto", "Tự chạy"))}"><svg viewBox="0 0 24 24"><path d="M6 5l8 7-8 7zM14 5l8 7-8 7z"/></svg><span>${E.esc(T("Auto", "Tự chạy"))}</span></button>`);
    tools.querySelector(".se-more")?.before(bt);
    bt.addEventListener("click", e => { e.stopPropagation(); setAuto(!on()); E.sfx("tap"); if (on()) E.ui.toast(E.esc(T("Auto on — tap anywhere to skip ahead", "Đã bật tự chạy — chạm màn để sang câu nhanh")), 1600); });
    $(".se")?.classList.toggle("autoing", on());
  });
})();
