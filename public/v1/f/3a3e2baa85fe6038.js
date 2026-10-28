// Tranh TẠM cho từng cảnh (SVG, nhẹ) — có ảnh FLUX thì ghi scenes.<id>.img trong story là engine tự dùng ảnh, bỏ tranh này.
(() => {
  const S = (body, sky) => `<svg viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice"><defs>${sky}</defs>${body}</svg>`;
  const sky = (id, a, b, c) => `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset=".55" stop-color="${b}"/><stop offset="1" stop-color="${c}"/></linearGradient>`;
  const glow = (id, col) => `<radialGradient id="${id}"><stop offset="0" stop-color="${col}" stop-opacity=".9"/><stop offset="1" stop-color="${col}" stop-opacity="0"/></radialGradient>`;
  globalThis.TIQ_ART = {
    pier: S(`<rect width="400" height="800" fill="url(#pk)"/>
      <circle cx="70" cy="250" r="90" fill="url(#lp)"/><circle cx="330" cy="200" r="110" fill="url(#lp)"/><circle cx="210" cy="300" r="70" fill="url(#bl)"/>
      <path d="M0 470 L400 455 L400 800 L0 800Z" fill="#0b1219"/>
      <path d="M0 470 Q100 462 200 466 T400 455" stroke="#3f5566" stroke-width="1.5" fill="none" opacity=".6"/>
      <g fill="#05080c"><rect x="64" y="236" width="6" height="250"/><rect x="326" y="186" width="6" height="290"/><rect x="58" y="232" width="18" height="6"/><rect x="320" y="182" width="18" height="6"/></g>
      <g fill="#070b10"><path d="M-10 420 L120 412 L130 470 L-10 480Z"/><rect x="20" y="360" width="56" height="54"/><rect x="32" y="300" width="4" height="70"/><path d="M36 300 L90 360" stroke="#070b10" stroke-width="2"/></g>
      <g fill="#0a1017"><rect x="150" y="520" width="12" height="280"/><rect x="250" y="530" width="12" height="270"/><rect x="350" y="520" width="12" height="280"/><path d="M120 520 L400 505 L400 530 L120 545Z"/></g>
      <path d="M140 640 C170 625 230 630 260 646 C230 660 170 660 140 640Z" fill="#d9dde2" opacity=".55"/>
      <g opacity=".5" fill="#2a5ea8"><circle cx="210" cy="300" r="4"/></g>`,
      sky("pk", "#0a1520", "#1b2d3c", "#0d1823") + glow("lp", "#e2a24a") + glow("bl", "#3b7fd9")),
    court: S(`<rect width="400" height="800" fill="url(#ck)"/>
      <rect x="40" y="120" width="320" height="300" fill="#2a1d14" opacity=".8"/><rect x="60" y="140" width="280" height="260" fill="none" stroke="#5a4127" stroke-width="3"/>
      <g stroke="#8a6a3c" stroke-width="3" fill="none" opacity=".7"><path d="M200 172 V252 M182 252 H218 M156 190 H244"/><path d="M164 190 L150 222 H178 Z M236 190 L222 222 H250 Z"/><circle cx="200" cy="168" r="5"/></g>
      <rect x="0" y="470" width="400" height="330" fill="#1a120c"/><rect x="0" y="470" width="400" height="14" fill="#3b2a1a"/>
      <g fill="#24180f">${Array.from({ length: 7 }, (_, i) => `<rect x="${i * 60}" y="500" width="40" height="300"/>`).join("")}</g>
      <circle cx="200" cy="80" r="160" fill="url(#cg)"/>`,
      sky("ck", "#120c08", "#2b1d13", "#0e0905") + glow("cg", "#f0c27a")),
    room: S(`<rect width="400" height="800" fill="url(#rk)"/>
      <rect x="230" y="150" width="130" height="190" fill="#1d3550"/><rect x="230" y="150" width="130" height="190" fill="url(#rw)"/><path d="M295 150 V340 M230 245 H360" stroke="#0a0f16" stroke-width="6"/>
      <rect x="60" y="230" width="90" height="70" fill="#d9c9a6" opacity=".85" transform="rotate(-3 105 265)"/><rect x="66" y="236" width="78" height="58" fill="#6d7f74" opacity=".7" transform="rotate(-3 105 265)"/>
      <rect x="0" y="520" width="400" height="280" fill="#0b0d12"/><rect x="20" y="470" width="260" height="70" rx="8" fill="#151922"/>
      <circle cx="160" cy="500" r="120" fill="url(#rp)"/>`,
      sky("rk", "#0c1017", "#131a24", "#07090d") + sky("rw", "#24496d", "#1a3350", "#0f2236") + glow("rp", "#6fa3d9")),
    car: S(`<rect width="400" height="800" fill="url(#ak)"/>
      <rect x="20" y="140" width="360" height="260" rx="30" fill="#162231"/><rect x="20" y="140" width="360" height="260" rx="30" fill="url(#aw)"/>
      <circle cx="90" cy="250" r="50" fill="url(#ab)"/><circle cx="320" cy="230" r="40" fill="url(#ar)"/>
      <rect x="0" y="420" width="400" height="380" fill="#090b10"/><rect x="40" y="440" width="320" height="200" rx="40" fill="#11141b"/>`,
      sky("ak", "#07090d", "#0e131b", "#05070a") + sky("aw", "#1f3a57", "#14273b", "#0b1622") + glow("ab", "#3b7fd9") + glow("ar", "#d94a3b")),
    pub: S(`<rect width="400" height="800" fill="url(#pb)"/>
      <rect x="0" y="420" width="400" height="380" fill="#1e140c"/><rect x="0" y="420" width="400" height="22" fill="#4a3220"/>
      <g fill="#2e2015">${Array.from({ length: 5 }, (_, i) => `<rect x="${30 + i * 75}" y="220" width="50" height="120" rx="6"/>`).join("")}</g>
      <g fill="#c28b3c" opacity=".55">${Array.from({ length: 5 }, (_, i) => `<rect x="${42 + i * 75}" y="240" width="26" height="70" rx="4"/>`).join("")}</g>
      <circle cx="120" cy="120" r="150" fill="url(#pg)"/><circle cx="310" cy="130" r="120" fill="url(#pg)"/>`,
      sky("pb", "#1a110a", "#2a1b10", "#120b06") + glow("pg", "#f0b25a")),
    interview: S(`<rect width="400" height="800" fill="url(#ik)"/>
      <path d="M150 0 L250 0 L380 560 L20 560Z" fill="url(#il)" opacity=".5"/>
      <rect x="185" y="0" width="30" height="16" fill="#c9d2c4"/>
      <rect x="0" y="560" width="400" height="240" fill="#141714"/><rect x="40" y="540" width="320" height="30" rx="4" fill="#2c302a"/>
      <rect x="300" y="140" width="80" height="50" fill="#0e110f" opacity=".7"/>`,
      sky("ik", "#141a16", "#20271f", "#0d100d") + `<linearGradient id="il" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e8f0d8"/><stop offset="1" stop-color="#e8f0d8" stop-opacity="0"/></linearGradient>`),
    corridor: S(`<rect width="400" height="800" fill="url(#hk)"/>
      <path d="M0 0 L160 300 L240 300 L400 0Z" fill="#1d2326"/><path d="M0 800 L160 480 L240 480 L400 800Z" fill="#101415"/>
      <rect x="160" y="300" width="80" height="180" fill="#2c383b"/><g fill="#e8f2f0" opacity=".6"><rect x="190" y="40" width="20" height="6"/><rect x="194" y="160" width="12" height="4"/><rect x="196" y="240" width="8" height="3"/></g>
      <rect x="40" y="320" width="60" height="230" fill="#1a2022" transform="skewY(18)"/>`,
      sky("hk", "#151a1b", "#222a2c", "#0c0f10")),
    dawn: S(`<rect width="400" height="800" fill="url(#dk)"/>
      <circle cx="270" cy="420" r="140" fill="url(#dg)"/>
      <path d="M0 450 L400 440 L400 800 L0 800Z" fill="#4a5560"/><path d="M0 450 Q200 446 400 440" stroke="#c9b0a0" stroke-width="2" opacity=".6" fill="none"/>
      <g fill="#262c33"><path d="M-10 430 L130 420 L140 470 L-10 480Z"/><rect x="30" y="370" width="56" height="54"/></g>
      <g fill="#2b323a"><rect x="150" y="520" width="12" height="280"/><rect x="250" y="530" width="12" height="270"/><path d="M120 520 L400 505 L400 530 L120 545Z"/></g>`,
      sky("dk", "#5d6c7d", "#b09aa0", "#d8b8a0") + glow("dg", "#ffd9b0")),
  };
})();
