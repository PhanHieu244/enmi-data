// Enmi Game FX — thư viện hiệu ứng DÙNG CHUNG cho game tải về (publish-data.js chép vào gói thành lib/fx.js khi game.json "use": ["fx.js"]).
// Không phụ thuộc gì ngoài Enmi (host.js). Giảm chuyển động (Enmi.rm = prefers-reduced-motion hoặc Tối giản): ít hạt, không rung, không bay.
//   FX.burst(x, y, { c: [màu], n, ring, power })   hạt nổ phát sáng + sóng vòng (toạ độ màn hình)
//   FX.float(x, y, chữ, { c, size })               chữ điểm bay lên
//   FX.shake(el, mạnh 0–1) · FX.flash(màu) · FX.pop(el) · FX.confetti()
//   FX.end({ title, sub, score, best, record, stars, again, home, againTxt, homeTxt, bestTxt, recordTxt })  màn kết thúc
//   FX.icon.heart / star — SVG nhỏ
(() => {
  const RM = () => !!globalThis.Enmi?.rm;
  const css = `
.fx-cv{position:fixed;inset:0;pointer-events:none;z-index:40}
.fx-fl{position:fixed;z-index:41;pointer-events:none;font:900 22px/1 system-ui,-apple-system,sans-serif;color:#fff;text-shadow:0 2px 0 rgba(0,0,0,.35),0 0 14px currentColor;white-space:nowrap;transform:translate(-50%,-50%);animation:fxUp .9s cubic-bezier(.2,.9,.3,1) forwards}
@keyframes fxUp{0%{opacity:0;transform:translate(-50%,-30%) scale(.5)}18%{opacity:1;transform:translate(-50%,-60%) scale(1.25)}35%{transform:translate(-50%,-80%) scale(1)}100%{opacity:0;transform:translate(-50%,-230%) scale(.95)}}
.fx-fla{position:fixed;inset:0;z-index:39;pointer-events:none;animation:fxFl .45s ease-out forwards}
@keyframes fxFl{from{opacity:.55}to{opacity:0}}
.fx-end{position:fixed;inset:0;z-index:60;display:grid;place-items:center;padding:20px 20px calc(20px + var(--sab,0px));background:rgba(6,8,26,.55);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);animation:fxIn .3s ease-out both;font-family:system-ui,-apple-system,sans-serif}
@keyframes fxIn{from{opacity:0}}
.fx-card{position:relative;width:min(340px,100%);padding:26px 22px 20px;border-radius:28px;text-align:center;color:#fff;background:linear-gradient(160deg,#312e81,#6d28d9 55%,#db2777);box-shadow:0 24px 60px rgba(0,0,0,.5),inset 0 1px 0 rgba(255,255,255,.35);overflow:hidden;animation:fxCard .55s cubic-bezier(.2,1.4,.4,1) both}
@keyframes fxCard{from{transform:translateY(40px) scale(.85);opacity:0}}
.fx-card::before{content:"";position:absolute;inset:-60% -60% auto;height:180%;background:conic-gradient(from 0deg,transparent 0 20deg,rgba(255,255,255,.1) 20deg 40deg,transparent 40deg 60deg,rgba(255,255,255,.1) 60deg 80deg,transparent 80deg 100deg,rgba(255,255,255,.1) 100deg 120deg,transparent 120deg);animation:fxSpin 14s linear infinite;pointer-events:none}
@keyframes fxSpin{to{transform:rotate(1turn)}}
.fx-card>*{position:relative}
.fx-t{font-size:15px;font-weight:800;letter-spacing:.3px;opacity:.9;text-transform:uppercase}
.fx-sub{font-size:14px;opacity:.85;margin-top:4px}
.fx-stars{display:flex;justify-content:center;gap:8px;margin:14px 0 4px}
.fx-stars svg{width:44px;height:44px;filter:drop-shadow(0 4px 10px rgba(0,0,0,.3))}
.fx-stars .on{animation:fxStar .5s cubic-bezier(.2,1.8,.4,1) both;animation-delay:calc(.45s + var(--i)*.22s)}
.fx-stars .off path{fill:rgba(255,255,255,.18)}
@keyframes fxStar{from{transform:scale(0) rotate(-40deg)}}
.fx-sc{font-size:64px;font-weight:900;line-height:1.05;font-variant-numeric:tabular-nums;letter-spacing:-1px;text-shadow:0 4px 0 rgba(0,0,0,.2)}
.fx-best{font-size:14px;font-weight:700;opacity:.85}
.fx-rec{display:inline-block;margin-top:8px;padding:5px 12px;border-radius:999px;background:linear-gradient(135deg,#fde68a,#f59e0b);color:#422006;font-weight:900;font-size:13px;animation:fxStar .5s cubic-bezier(.2,1.8,.4,1) 1.1s both}
.fx-bt{display:grid;gap:10px;margin-top:20px}
.fx-bt button{min-height:52px;border:0;border-radius:18px;font:800 17px system-ui,-apple-system,sans-serif;cursor:pointer;-webkit-tap-highlight-color:transparent}
.fx-bt .a{background:#fff;color:#4c1d95;box-shadow:0 5px 0 rgba(0,0,0,.25)}
.fx-bt .a:active{transform:translateY(3px);box-shadow:0 2px 0 rgba(0,0,0,.25)}
.fx-bt .b{background:rgba(255,255,255,.16);color:#fff}
.rm .fx-fl{animation:fxFl .8s ease-out forwards}
.rm .fx-card,.rm .fx-stars .on,.rm .fx-rec{animation:none}
.rm .fx-card::before{animation:none}`;
  const st = document.createElement("style");
  st.textContent = css;
  document.head.appendChild(st);

  // ---------- lớp hạt (canvas phủ màn hình, chỉ chạy khi còn hạt) ----------
  let cv = null, x = null, W = 0, H = 0, P = [], R = [], raf = 0, last = 0;
  const dpr = Math.min(2, devicePixelRatio || 1);
  const fit = () => { if (!cv) return; W = innerWidth; H = innerHeight; cv.width = W * dpr; cv.height = H * dpr; x.setTransform(dpr, 0, 0, dpr, 0, 0); };
  const layer = () => {
    if (cv) return;
    cv = document.createElement("canvas"); cv.className = "fx-cv"; x = cv.getContext("2d");
    document.body.appendChild(cv); fit(); addEventListener("resize", fit);
  };
  const loop = now => {
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    x.clearRect(0, 0, W, H);
    x.globalCompositeOperation = "lighter";
    for (const r of R) {
      r.t += dt; const k = r.t / r.life;
      x.globalAlpha = Math.max(0, 1 - k) * 0.9; x.strokeStyle = r.c; x.lineWidth = 6 * (1 - k) + 1;
      x.beginPath(); x.arc(r.x, r.y, r.r0 + (r.r1 - r.r0) * (1 - (1 - k) ** 3), 0, 7); x.stroke();
    }
    for (const p of P) {
      p.t += dt;
      const px = p.x, py = p.y;
      p.vx *= 1 - p.drag * dt; p.vy *= 1 - p.drag * dt; p.vy += p.g * dt;
      p.x += p.vx * dt; p.y += p.vy * dt;
      const k = p.t / p.life, a = Math.max(0, 1 - k);
      x.globalAlpha = a;
      if (p.kind === "spark") {
        x.strokeStyle = p.c; x.lineWidth = p.s * a + 0.5; x.lineCap = "round";
        x.beginPath(); x.moveTo(px - (p.x - px) * 2, py - (p.y - py) * 2); x.lineTo(p.x, p.y); x.stroke();
      } else if (p.kind === "star") {
        x.fillStyle = p.c; x.save(); x.translate(p.x, p.y); x.rotate(p.t * p.spin); const s = p.s * (0.6 + 0.4 * a);
        x.beginPath(); x.moveTo(0, -s); x.quadraticCurveTo(0, 0, s, 0); x.quadraticCurveTo(0, 0, 0, s); x.quadraticCurveTo(0, 0, -s, 0); x.quadraticCurveTo(0, 0, 0, -s); x.fill(); x.restore();
      } else if (p.kind === "conf") {
        x.globalCompositeOperation = "source-over";
        x.fillStyle = p.c; x.save(); x.translate(p.x, p.y); x.rotate(p.t * p.spin); x.scale(1, Math.cos(p.t * 9)); x.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2); x.restore();
        x.globalCompositeOperation = "lighter";
      } else {
        const g = x.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.s * 2.4);
        g.addColorStop(0, "#fff"); g.addColorStop(0.25, p.c); g.addColorStop(1, "rgba(0,0,0,0)");
        x.fillStyle = g; x.beginPath(); x.arc(p.x, p.y, p.s * 2.4, 0, 7); x.fill();
      }
    }
    x.globalAlpha = 1; x.globalCompositeOperation = "source-over";
    P = P.filter(p => p.t < p.life && p.y < H + 60); R = R.filter(r => r.t < r.life);
    raf = P.length || R.length ? requestAnimationFrame(loop) : 0;
  };
  const kick = () => { if (!raf) { last = performance.now(); raf = requestAnimationFrame(loop); } };

  const FX = {
    burst(cx, cy, o = {}) {
      layer();
      const cs = [].concat(o.c || ["#fde68a", "#f472b6", "#a78bfa"]), pw = o.power || 1, n = Math.round((o.n || 26) * (RM() ? 0.3 : 1));
      for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2, v = (90 + Math.random() * 260) * pw, c = cs[i % cs.length], r = Math.random();
        P.push({ kind: r < 0.55 ? "spark" : r < 0.8 ? "glow" : "star", x: cx, y: cy, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 40 * pw, g: 360, drag: 2.2, s: 2 + Math.random() * 3.5 * pw, c, t: 0, life: 0.55 + Math.random() * 0.5, spin: (Math.random() - 0.5) * 12 });
      }
      if (o.ring !== false && !RM()) { R.push({ x: cx, y: cy, r0: 8, r1: 70 * pw, t: 0, life: 0.45, c: cs[0] }); if (pw > 1.2) R.push({ x: cx, y: cy, r0: 4, r1: 120 * pw, t: -0.08, life: 0.6, c: cs[1 % cs.length] }); }
      kick();
    },
    confetti(n = 90) {
      if (RM()) return;
      layer();
      const cs = ["#f472b6", "#fbbf24", "#34d399", "#60a5fa", "#a78bfa", "#fb7185"];
      for (let i = 0; i < n; i++) P.push({ kind: "conf", x: Math.random() * W, y: -20 - Math.random() * H * 0.4, vx: (Math.random() - 0.5) * 80, vy: 80 + Math.random() * 160, g: 120, drag: 0.6, s: 7 + Math.random() * 6, c: cs[i % cs.length], t: 0, life: 3.2, spin: (Math.random() - 0.5) * 8 });
      kick();
    },
    float(cx, cy, text, o = {}) {
      const e = document.createElement("div");
      e.className = "fx-fl"; e.textContent = text;
      e.style.left = cx + "px"; e.style.top = cy + "px"; e.style.color = o.c || "#fde68a";
      if (o.size) e.style.fontSize = o.size + "px";
      document.body.appendChild(e);
      setTimeout(() => e.remove(), 1000);
    },
    shake(el, k = 0.5) {
      if (RM() || !el?.animate) return;
      const a = 3 + 9 * k, f = [];
      for (let i = 0; i < 6; i++) f.push({ transform: `translate(${(Math.random() - 0.5) * 2 * a}px,${(Math.random() - 0.5) * 2 * a}px) rotate(${(Math.random() - 0.5) * k * 2}deg)` });
      f.push({ transform: "none" });
      el.animate(f, { duration: 260 + 160 * k, easing: "ease-out" });
    },
    flash(c = "#fff") {
      const e = document.createElement("div");
      e.className = "fx-fla"; e.style.background = `radial-gradient(circle, transparent 35%, ${c})`;
      document.body.appendChild(e); setTimeout(() => e.remove(), 500);
    },
    pop(el, k = 1.25) { if (!RM() && el?.animate) el.animate([{ transform: "scale(1)" }, { transform: `scale(${k})` }, { transform: "scale(1)" }], { duration: 320, easing: "cubic-bezier(.2,1.6,.4,1)" }); },
    icon: {
      heart: `<svg viewBox="0 0 24 24" width="22" height="22"><path d="M12 21s-7.5-4.6-9.6-9.3C.9 8.3 3 4.5 6.7 4.5c2.2 0 3.6 1.2 5.3 3 1.7-1.8 3.1-3 5.3-3 3.7 0 5.8 3.8 4.3 7.2C19.5 16.4 12 21 12 21z" fill="currentColor"/></svg>`,
      star: `<svg viewBox="0 0 24 24"><path d="M12 1.8l3.1 6.4 7 1-5.1 4.9 1.2 7L12 17.8l-6.2 3.3 1.2-7L1.9 9.2l7-1z" fill="url(#fxg)"/><defs><linearGradient id="fxg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fef08a"/><stop offset="1" stop-color="#f59e0b"/></linearGradient></defs></svg>`,
    },
    // màn kết thúc: điểm đếm lên, sao bật ra lần lượt, kỷ lục mới = pháo giấy
    end(o) {
      const T = (k, d) => o[k] || d;
      const e = document.createElement("div");
      e.className = "fx-end";
      const stars = [0, 1, 2].map(i => `<span class="${i < (o.stars || 0) ? "on" : "off"}" style="--i:${i}">${FX.icon.star}</span>`).join("");
      e.innerHTML = `<div class="fx-card"><div class="fx-t"></div>${o.sub ? `<div class="fx-sub"></div>` : ""}<div class="fx-stars">${stars}</div><div class="fx-sc">0</div><div class="fx-best"></div>${o.record ? `<div class="fx-rec"></div>` : ""}
        <div class="fx-bt"><button class="a" data-a></button><button class="b" data-h></button></div></div>`;
      e.querySelector(".fx-t").textContent = o.title || "";
      if (o.sub) e.querySelector(".fx-sub").textContent = o.sub;
      e.querySelector(".fx-best").textContent = T("bestTxt", "");
      if (o.record) e.querySelector(".fx-rec").textContent = T("recordTxt", "★");
      e.querySelector("[data-a]").textContent = T("againTxt", "↻");
      e.querySelector("[data-h]").textContent = T("homeTxt", "✕");
      document.body.appendChild(e);
      const sc = e.querySelector(".fx-sc"), n = o.score || 0, t0 = performance.now(), dur = RM() ? 0 : Math.min(1200, 400 + n * 2);
      const step = now => { const k = dur ? Math.min(1, (now - t0) / dur) : 1; sc.textContent = Math.round(n * (1 - (1 - k) ** 3)).toLocaleString(); if (k < 1) requestAnimationFrame(step); };
      requestAnimationFrame(step);
      if (o.record) setTimeout(() => FX.confetti(), 900);
      const close = () => e.remove();
      e.querySelector("[data-a]").onclick = () => { close(); o.again?.(); };
      e.querySelector("[data-h]").onclick = () => { close(); o.home?.(); };
      return { close };
    },
  };
  globalThis.FX = FX;
})();
