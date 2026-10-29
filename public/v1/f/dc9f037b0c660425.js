// Enmi Game Kit (28/10/2026) — khung DÙNG CHUNG cho game tải về: publish-data.js chép thành lib/gk.js khi game.json "use": ["gk.js", …].
// Cần lib/fx.js (hiệu ứng) nạp trước. Không phụ thuộc gì ngoài Enmi (mobile/game/host.js).
//   GK.t(k, v)            chữ của game (strings.json) → thiếu thì chữ CHUNG có sẵn ở đây (13 ngôn ngữ gốc của app)
//   await GK.words(n, min) từ + nghĩa (Enmi.words) — ít hơn min → màn “cần thêm từ” + nút Đóng, trả null
//   GK.shuffle(a) · GK.pick(a) · GK.chars(w) (tách chữ theo ký tự hiển thị, giữ dấu tiếng Việt / Hàn ghép)
//   GK.intro(icon, how, start)  màn giới thiệu (nút Bắt đầu) · GK.pw(keys, onUse) thanh vật phẩm (trả { sync })
//   GK.snd("tap" | "pick" | "flip") tiếng bấm CC0 (Kenney UI Audio, lib/snd — thẻ <audio data-s> trong index.html)
//   GK.tone("ok" | "bad" | "win" | "lose") âm tổng hợp WebAudio (không file)
//   GK.end({ win, score, stars, sub }) → báo điểm (Enmi.score) + màn kết thúc của FX (Chơi lại = again())
//   GK.mid(el) tâm phần tử · GK.again = hàm bắt đầu lại (game gán)
// Âm: tắt theo Enmi.rm? Không — giảm chuyển động không tắt tiếng. Tiếng nhỏ, ngắn.
(() => {
  const E = globalThis.Enmi, FX = globalThis.FX;
  const L = String(E?.lang || "en").slice(0, 2);
  // chữ chung (game chỉ cần viết chữ riêng của mình trong strings.json)
  const C = {
    vi: { start: "Bắt đầu", again: "Chơi lại", home: "Về sảnh", close: "Đóng", few: "Cần thêm vài từ có nghĩa — lưu thêm từ rồi chơi nhé.", best: "Kỷ lục: {n}", record: "Kỷ lục mới!", combo: "Combo ×{n}", win: "Tuyệt vời!", over: "Hết lượt!", timeup: "Hết giờ!", score: "Điểm", lives: "Mạng", next: "Tiếp" },
    en: { start: "Start", again: "Play again", home: "Back to games", close: "Close", few: "You need a few more words with meanings — save some, then play.", best: "Best: {n}", record: "New record!", combo: "Combo ×{n}", win: "Awesome!", over: "Game over!", timeup: "Time's up!", score: "Score", lives: "Lives", next: "Next" },
    de: { start: "Los geht's", again: "Nochmal", home: "Zu den Spielen", close: "Schließen", few: "Du brauchst noch ein paar Wörter mit Bedeutung — speichere welche und spiel dann.", best: "Rekord: {n}", record: "Neuer Rekord!", combo: "Combo ×{n}", win: "Super!", over: "Vorbei!", timeup: "Zeit um!", score: "Punkte", lives: "Leben", next: "Weiter" },
    es: { start: "Empezar", again: "Otra vez", home: "Volver", close: "Cerrar", few: "Necesitas algunas palabras más con significado: guarda unas y juega.", best: "Récord: {n}", record: "¡Nuevo récord!", combo: "Combo ×{n}", win: "¡Genial!", over: "¡Fin!", timeup: "¡Tiempo!", score: "Puntos", lives: "Vidas", next: "Siguiente" },
    fr: { start: "Commencer", again: "Rejouer", home: "Retour aux jeux", close: "Fermer", few: "Il te faut encore quelques mots avec leur sens — enregistre-en puis joue.", best: "Record : {n}", record: "Nouveau record !", combo: "Combo ×{n}", win: "Bravo !", over: "Partie finie !", timeup: "Temps écoulé !", score: "Score", lives: "Vies", next: "Suivant" },
    hi: { start: "शुरू करें", again: "फिर खेलें", home: "गेम्स पर लौटें", close: "बंद करें", few: "कुछ और अर्थ वाले शब्द चाहिए — शब्द सहेजें, फिर खेलें।", best: "रिकॉर्ड: {n}", record: "नया रिकॉर्ड!", combo: "कॉम्बो ×{n}", win: "शानदार!", over: "खेल खत्म!", timeup: "समय खत्म!", score: "अंक", lives: "जान", next: "आगे" },
    id: { start: "Mulai", again: "Main lagi", home: "Kembali", close: "Tutup", few: "Butuh beberapa kata lagi yang ada artinya — simpan dulu, lalu main.", best: "Rekor: {n}", record: "Rekor baru!", combo: "Kombo ×{n}", win: "Keren!", over: "Selesai!", timeup: "Waktu habis!", score: "Skor", lives: "Nyawa", next: "Lanjut" },
    ja: { start: "スタート", again: "もう一度", home: "ゲーム一覧へ", close: "閉じる", few: "意味つきの単語がもう少し必要です。単語を保存してから遊びましょう。", best: "ベスト：{n}", record: "新記録！", combo: "コンボ ×{n}", win: "すごい！", over: "ゲームオーバー", timeup: "時間切れ！", score: "スコア", lives: "ライフ", next: "次へ" },
    ko: { start: "시작", again: "다시 하기", home: "게임 목록", close: "닫기", few: "뜻이 있는 단어가 조금 더 필요해요. 단어를 저장하고 다시 해 보세요.", best: "최고: {n}", record: "신기록!", combo: "콤보 ×{n}", win: "멋져요!", over: "게임 끝!", timeup: "시간 끝!", score: "점수", lives: "목숨", next: "다음" },
    pt: { start: "Começar", again: "Jogar de novo", home: "Voltar", close: "Fechar", few: "Você precisa de mais algumas palavras com significado — salve algumas e jogue.", best: "Recorde: {n}", record: "Novo recorde!", combo: "Combo ×{n}", win: "Incrível!", over: "Fim de jogo!", timeup: "Tempo esgotado!", score: "Pontos", lives: "Vidas", next: "Próximo" },
    ru: { start: "Начать", again: "Ещё раз", home: "К играм", close: "Закрыть", few: "Нужно ещё несколько слов со значением — сохрани их и играй.", best: "Рекорд: {n}", record: "Новый рекорд!", combo: "Комбо ×{n}", win: "Отлично!", over: "Игра окончена!", timeup: "Время вышло!", score: "Очки", lives: "Жизни", next: "Дальше" },
    th: { start: "เริ่ม", again: "เล่นอีกครั้ง", home: "กลับหน้าเกม", close: "ปิด", few: "ต้องมีคำที่มีความหมายเพิ่มอีกนิด — บันทึกคำแล้วค่อยเล่น", best: "สถิติ: {n}", record: "สถิติใหม่!", combo: "คอมโบ ×{n}", win: "ยอดเยี่ยม!", over: "จบเกม!", timeup: "หมดเวลา!", score: "คะแนน", lives: "ชีวิต", next: "ถัดไป" },
    zh: { start: "开始", again: "再玩一次", home: "返回游戏", close: "关闭", few: "还需要几个带释义的单词——先保存一些再来玩吧。", best: "最高：{n}", record: "新纪录！", combo: "连击 ×{n}", win: "太棒了！", over: "游戏结束！", timeup: "时间到！", score: "得分", lives: "生命", next: "下一个" },
  };
  const fill = (s, v) => String(s).replace(/\{(\w+)\}/g, (m, k) => (v && v[k] != null ? v[k] : m));
  const t = (k, v) => { const r = E.t(k, v); return r !== k ? r : fill((C[L] || C.en)[k] ?? C.en[k] ?? k, v); };
  const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const pick = a => a[Math.floor(Math.random() * a.length)];
  // ký tự hiển thị (Intl.Segmenter nếu có: “ệ”, emoji, Hangul ghép đều là 1 ô)
  const chars = w => { try { return [...new Intl.Segmenter(undefined, { granularity: "grapheme" }).segment(String(w))].map(s => s.segment); } catch { return [...String(w)]; } };
  const mid = el => { const r = el.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; };
  const app = () => document.getElementById("app") || document.body;

  async function words(n = 24, min = 4) {
    const all = (await E.words(n).catch(() => [])).filter(x => x && x.w && x.m);
    if (all.length >= min) return all;
    const f = document.createElement("div");
    f.className = "gk-few";
    f.innerHTML = `<p></p><button class="gk-btn"></button>`;
    f.querySelector("p").textContent = t("few");
    f.querySelector("button").textContent = t("close");
    f.querySelector("button").onclick = () => E.close();
    app().appendChild(f);
    return null;
  }

  function intro(icon, how, start) {
    const d = document.createElement("div");
    d.className = "gk-intro";
    d.innerHTML = `<div class="gk-ic">${icon || ""}</div><p></p><button class="gk-btn big"></button>`;
    d.querySelector("p").textContent = how;
    d.querySelector("button").textContent = t("start");
    d.querySelector("button").onclick = () => { snd("pick"); d.remove(); start(); };
    app().appendChild(d);
  }

  // thanh vật phẩm: chỉ các vật phẩm game dùng (keys) — onUse(k) trả true nếu dùng được (đã trừ ở app)
  function pw(keys, onUse) {
    const bar = document.createElement("div");
    bar.className = "gk-pw";
    let inv = {};
    bar.innerHTML = keys.map(k => `<button data-pw="${k}" style="--pc:${E.pw?.[k]?.c || "#888"}" aria-label="${String(E.pw?.[k]?.name || k).replace(/"/g, "")}">${E.pw?.[k]?.svg || ""}<b>0</b></button>`).join("");
    const sync = () => { for (const k of keys) { const b = bar.querySelector(`[data-pw="${k}"]`); b.querySelector("b").textContent = inv[k] || 0; b.classList.toggle("zero", !(inv[k] > 0)); } };
    E.inv().then(v => { inv = v || {}; sync(); }).catch(() => {});
    bar.addEventListener("click", async e => {
      const b = e.target.closest("[data-pw]"); if (!b) return;
      const k = b.dataset.pw;
      if (api.can && !api.can(k)) { FX?.shake(b, 0.3); return; }
      const r = await E.use(k).catch(() => ({ ok: false }));
      if (!r.ok) { FX?.shake(b, 0.4); return; }
      inv[k] = r.n; sync();
      const [x, y] = mid(b); FX?.burst(x, y - 20, { c: [E.pw[k].c, "#fff"], n: 14, power: 0.6, ring: false });
      E.haptic("MEDIUM"); snd("pick");
      onUse(k);
    });
    app().appendChild(bar);
    const api = { el: bar, sync, can: null };   // can(k) → false = chưa dùng được lúc này (không trừ vật phẩm)
    return api;
  }

  // tiếng bấm CC0: <audio data-s="tap" src="lib/snd/click3.m4a"> trong index.html (host đổi src sang blob) — phát bản sao để chồng được
  const AUD = {};
  function snd(k) {
    try {
      const a = AUD[k] ||= document.querySelector(`audio[data-s="${k}"]`); if (!a) return;
      const c = a.cloneNode(); c.volume = 0.5; c.play().catch(() => {});
    } catch {}
  }
  let ac = null;
  function tone(kind) {
    try {
      const A = globalThis.AudioContext || globalThis.webkitAudioContext; if (!A) return;
      ac ||= new A(); if (ac.state !== "running") ac.resume().catch(() => {});
      const seq = { ok: [[784, 0], [1047, 0.08]], bad: [[330, 0], [247, 0.1]], win: [[523, 0], [659, 0.09], [784, 0.18], [1047, 0.27]], lose: [[392, 0], [330, 0.14], [262, 0.28]] }[kind] || [];
      const t0 = ac.currentTime + 0.01;
      for (const [f, dt] of seq) {
        const o = ac.createOscillator(), g = ac.createGain();
        o.type = kind === "bad" || kind === "lose" ? "triangle" : "sine"; o.frequency.value = f;
        g.gain.setValueAtTime(0.0001, t0 + dt); g.gain.exponentialRampToValueAtTime(0.09, t0 + dt + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dt + 0.32);
        o.connect(g).connect(ac.destination); o.start(t0 + dt); o.stop(t0 + dt + 0.36);
      }
    } catch {}
  }

  async function end({ win, score, stars = 0, sub = "", title }) {
    tone(win ? "win" : "lose");
    const r = await E.score(score).catch(() => ({ best: score, record: false }));
    setTimeout(() => FX.end({ title: title || t(win ? "win" : "over"), sub, score, stars, record: r.record,
      bestTxt: t("best", { n: r.best }), recordTxt: t("record"), againTxt: t("again"), homeTxt: t("home"),
      again: () => GK.again?.(), home: () => E.close() }), win ? 600 : 300);
  }

  const GK = { t, words, shuffle, pick, chars, mid, intro, pw, snd, tone, end, again: null };
  globalThis.GK = GK;
})();
