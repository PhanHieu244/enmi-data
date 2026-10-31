// Enmi Story Engine — SƠ ĐỒ NHÁNH kiểu Detroit: Become Human (nạp sau core.js, trước mech.js). Thay E.ui.flowSheet cũ.
// Dữ liệu = story.flow (giữ nguyên định dạng cũ, chỉ THÊM trường tuỳ chọn):
//   { ch, row, id, kind: "cp",  label, sum, scene }            mốc (cảnh) — chạm = xem “chuyện tới đây” của nhánh đó + chơi lại từ đây
//   { ch, row, kind: "opt", key, val, label, sum, hint }        1 nhánh của 1 quyết định (các opt cùng row = cùng 1 quyết định)
//   { ch, row, id, kind: "end", label, hint }                   kết thúc chương
//   sum = hậu quả / điều nhánh này dẫn tới (hiện khi đã khám phá) · hint = gợi ý mờ khi CHƯA khám phá (tuỳ chọn)
// 3 trạng thái mỗi ô (như Detroit): ĐANG ĐI (lần chơi này) · ĐÃ KHÁM PHÁ (lần chơi khác) · KHOÁ (chưa ai đi — ô có ổ khoá, không lộ chữ)
// Đường nối giữa các hàng vẽ bằng SVG; đường của lần chơi này sáng màu nhấn.
(() => {
  const E = globalThis.StoryEngine, esc = E.esc, h = E.h;
  const nat = t => E.nat(t);
  const TX = {
    title: { en: "Flowchart", vi: "Sơ đồ nhánh" }, sum: { en: "Your path", vi: "Đường bạn đi" }, ch: { en: "Chapter", vi: "Chương" }, pro: { en: "Prologue", vi: "Mở đầu" },
    now: { en: "This playthrough", vi: "Lần chơi này" }, seen: { en: "Explored", vi: "Đã khám phá" }, lock: { en: "Unexplored", vi: "Chưa khám phá" },
    replay: { en: "Replay from here", vi: "Chơi lại từ đây" }, upto: { en: "What happened up to here (on that path)", vi: "Chuyện tới đây (theo nhánh đó)" },
    picked: { en: "You chose this", vi: "Bạn đã chọn" }, other: { en: "Chosen in another playthrough", vi: "Đã chọn ở lần chơi khác" },
    lockd: { en: "Nobody has taken this path yet. What happens if you choose differently?", vi: "Chưa đi nhánh này. Nếu chọn khác đi thì sao?" },
    end: { en: "Ending", vi: "Kết thúc" }, done: { en: "complete", vi: "hoàn thành" }, none: { en: "Nothing yet. Play to draw your path.", vi: "Chưa có gì. Chơi để vẽ đường đi." },
    cur: { en: "Your path this time", vi: "Đường đi lần này" }, story: { en: "Story so far", vi: "Tóm tắt" }, decisions: { en: "Decisions", vi: "Quyết định" },
  };
  const t = k => esc(nat(TX[k]));
  const chName = ch => (ch ? nat(TX.ch) + " " + ch : nat(TX.pro));

  E.on("end", id => { const ch = E.S().endings?.[id]?.ch ?? E.R().ch; (E.R().chapterEnds ||= {})[ch] = id; E.save(); });

  // trạng thái 1 ô
  const stateOf = (x, R, G) => {
    if (x.kind === "cp") return R.passed?.[x.id] ? "now" : G.cps[x.id] ? "seen" : "lock";
    if (x.kind === "opt") return R.f?.[x.key] === x.val ? "now" : G.opts[x.key + ":" + x.val] ? "seen" : "lock";
    if (x.kind === "end") return (R.done === x.id || R.chapterEnds?.[x.ch] === x.id) ? "now" : G.endings[x.id] ? "seen" : "lock";
    return "lock";
  };
  const chapters = S => {
    const ids = [...new Set((S.flow || []).map(x => x.ch || 0))].sort((a, b) => a - b);
    return ids.map(ch => {
      const rows = {};
      for (const x of S.flow.filter(x => (x.ch || 0) === ch)) (rows[x.row] ||= []).push(x);
      return { ch, rows: Object.keys(rows).map(Number).sort((a, b) => a - b).map(r => rows[r]) };
    });
  };
  const pctOf = (c, R, G) => { const all = c.rows.flat(); return all.length ? Math.round(all.filter(x => stateOf(x, R, G) !== "lock").length / all.length * 100) : 0; };

  const ICON_LOCK = `<svg viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>`;
  const node = (x, i, R, G) => {
    const s = stateOf(x, R, G), en = x.kind === "end" ? E.S().endings?.[x.id] : null;
    const label = s === "lock" ? "" : x.kind === "end" ? nat(en?.title || x.label) : nat(x.label);
    const thumb = (x.kind === "cp" || x.scene) ? `<span class="fx-th">${s !== "lock" && x.scene ? `<i class="im-${esc(x.scene)}"></i>` : ""}${s === "lock" ? ICON_LOCK : ""}</span>` : "";
    return `<button class="fx-n k-${x.kind} s-${s}" data-n="${i}">${thumb}<span class="fx-l">${s === "lock" ? (x.kind === "cp" ? "" : ICON_LOCK) : esc(label)}</span>${x.kind === "end" ? `<em>${t("end")}</em>` : ""}</button>`;
  };

  // vẽ đường nối giữa các hàng sau khi trình duyệt dàn chữ (đo vị trí thật)
  const wire = (wrap, list, R, G) => {
    const svg = wrap.querySelector("svg.fx-wire"); if (!svg) return;
    svg.setAttribute("width", wrap.offsetWidth); svg.setAttribute("height", wrap.scrollHeight);
    const rows = [...wrap.querySelectorAll(".fx-row")];
    let out = "";
    const all=[...wrap.querySelectorAll('.fx-n')], idOf=x=>x.id||(x.kind==='opt'?x.key+':'+x.val:'');
    const pt=(el,bottom)=>{let x=el.offsetWidth/2,y=bottom?el.offsetHeight:0,n=el;while(n&&n!==wrap){x+=n.offsetLeft;y+=n.offsetTop;n=n.offsetParent;}return[x,y];};
    const seen=new Set(),trace=(E.R()?.v8route||[]).filter(x=>all.some(el=>idOf(list[+el.dataset.n])===x.id));
    const runEdges=new Set(trace.slice(1).map((x,i)=>trace[i].id+'>'+x.id));
    const link=(a,b)=>{const key=a.dataset.n+'>'+b.dataset.n;if(seen.has(key))return;seen.add(key);
      const[x1,y1]=pt(a,true),[x2,y2]=pt(b,false),my=(y1+y2)/2;
      const sa=a.className.match(/s-(\w+)/)[1],sb=b.className.match(/s-(\w+)/)[1];
      const cls=runEdges.size?(runEdges.has(idOf(list[+a.dataset.n])+'>'+idOf(list[+b.dataset.n]))?'now':sa!=='lock'&&sb!=='lock'?'seen':'lock'):(sa==='now'&&sb==='now'?'now':sa!=='lock'&&sb!=='lock'?'seen':'lock');
      out+=`<path class="${cls}" data-from="${esc(idOf(list[+a.dataset.n]))}" data-to="${esc(idOf(list[+b.dataset.n]))}" d="M${x1} ${y1} C${x1} ${my} ${x2} ${my} ${x2} ${y2}"/>`;
    };
    // Authored edges may bypass an optional checkpoint; never force adjacent rows.
    for(const a of all){const x=list[+a.dataset.n];if(x.to!=null)for(const id of [].concat(x.to)){
      const b=all.find(el=>idOf(list[+el.dataset.n])===id);if(b)link(a,b);
    }}
    for(let r=0;r<rows.length-1;r++){
      const A=[...rows[r].querySelectorAll('.fx-n')],B=[...rows[r+1].querySelectorAll('.fx-n')];
      for(let i=0;i<A.length;i++)for(let j=0;j<B.length;j++){
        const a=A[i],b=B[j],x=list[+a.dataset.n],y=list[+b.dataset.n];if(x.to!=null)continue;
        if(y.from!=null){if([].concat(y.from).includes(idOf(x)))link(a,b);continue;}
        if(A.length===1||B.length===1||i===j)link(a,b);
      }
    }
    // Recorded skips are real edges, not missing compulsory checkpoints.
    for(let i=1;i<trace.length;i++){const a=all.find(el=>idOf(list[+el.dataset.n])===trace[i-1].id),b=all.find(el=>idOf(list[+el.dataset.n])===trace[i].id);if(a&&b&&a!==b)link(a,b);}
    svg.innerHTML = out;
  };

  E.ui.flowSheet = (startCh) => {
    const S = E.S(), R = E.R(), G = E.G();
    const chs = chapters(S);
    if (!chs.length) return E.ui.sheet(nat(TX.title), `<p class="se-mute">${t("none")}</p>`, "tall");
    let closed = false, scrollTimer = 0;
    let cur = startCh ?? (chs.find(c => c.ch === R.ch)?.ch ?? chs[chs.length - 1].ch), view = "map";
    const truths = Object.keys(G.truths).length;
    const sh = E.ui.sheet(nat(TX.title), `<div class="fx-top"><div class="fx-tabs"></div><div class="fx-seg"><button data-v="map" class="on">${t("title")}</button><button data-v="sum">${t("story")}</button></div></div><div class="fx-body"></div><div class="fx-det" hidden></div>`, "tall flowx");
    const tabs = sh.querySelector(".fx-tabs"), body = sh.querySelector(".fx-body"), det = sh.querySelector(".fx-det");
    const drawTabs = () => { tabs.innerHTML = chs.map(c => `<button data-ch="${c.ch}" class="${c.ch === cur ? "on" : ""}"><b>${c.ch || "0"}</b><small>${pctOf(c, R, G)}%</small></button>`).join(""); };
    const drawMap = () => {
      const c = chs.find(x => x.ch === cur) || chs[0];
      const meta = (S.chapters || []).find(x => x.ch === c.ch);
      let i = 0; const idx = [];
      const rows = c.rows.map(row => `<div class="fx-row k-${row[0].kind}">${row.map(x => (idx.push(x), node(x, i++, R, G))).join("")}</div>`).join("");
      body.innerHTML = `<div class="fx-chh"><small>${esc(chName(c.ch))}</small><b>${esc(nat(meta?.title) || "")}</b><span class="fx-pct"><i style="width:${pctOf(c, R, G)}%"></i></span><em>${pctOf(c, R, G)}% ${esc(nat({en:'routes discovered',vi:'nhánh đã khám phá'}))}${S.truthTotal ? ` · ${truths}/${S.truthTotal} ${esc(nat({ en: "truths", vi: "sự thật" }))}` : ""}</em></div>
        <div class="fx-key"><span class="s-now">${t("now")}</span><span class="s-seen">${t("seen")}</span><span class="s-lock">${t("lock")}</span></div>
        <div class="fx-wrap"><svg class="fx-wire"></svg>${rows}</div>`;
      body._idx = idx;
      const wrap = body.querySelector(".fx-wrap");
      requestAnimationFrame(() => wire(wrap, idx, R, G));
      // ảnh thu nhỏ tải xong / xoay máy / đổi cỡ chữ → ô đổi kích thước → vẽ lại dây
      try { body._ro?.disconnect(); body._ro = new ResizeObserver(() => wire(wrap, idx, R, G)); body._ro.observe(wrap); wrap.querySelectorAll(".fx-n").forEach(n => body._ro.observe(n)); } catch {}
      // cuộn tới ô ĐANG ĐI cuối cùng của lần chơi này
      clearTimeout(scrollTimer); scrollTimer = setTimeout(() => { if (closed || !wrap.isConnected) return; const last = [...wrap.querySelectorAll(".s-now")].pop(); last?.scrollIntoView({ block: "center" }); }, 60);
    };
    // TÓM TẮT THEO NHÁNH: đường đi lần này (các quyết định đã chọn, theo chương) + chuyện đã qua đúng nhánh đó
    const drawSum = () => {
      const byCh = {};
      for (const p of R.path || []) { const x = (S.flow || []).find(f => f.kind === "opt" && f.key === p.k && f.val === p.v); if (x) (byCh[x.ch || 0] ||= []).push(x); }
      const list = E.recapList();
      const recapBy = {};
      for (const x of list) (recapBy[x.ch ?? 0] ||= []).push(x);
      const ids = [...new Set([...Object.keys(byCh), ...Object.keys(recapBy)].map(Number))].sort((a, b) => a - b);
      body.innerHTML = ids.length ? ids.map(ch => `<div class="fx-sch"><h4>${esc(chName(ch))}${(S.chapters || []).find(c => c.ch === ch)?.title ? ` · ${esc(nat(S.chapters.find(c => c.ch === ch).title))}` : ""}</h4>
        ${byCh[ch]?.length ? `<div class="fx-dec"><small>${t("decisions")}</small>${byCh[ch].map(x => `<div class="fx-dc"><b>${esc(nat(x.label))}</b>${x.sum ? `<span>${esc(nat(x.sum))}</span>` : ""}</div>`).join("")}</div>` : ""}
        ${(recapBy[ch] || []).map(x => `<p class="se-rcp">${esc(nat(x.t))}</p>`).join("")}</div>`).join("") : `<p class="se-mute">${t("none")}</p>`;
    };
    const draw = () => { drawTabs(); det.hidden = true; view === "map" ? drawMap() : drawSum(); };
    // CHI TIẾT 1 ô (chạm): mốc = chuyện tới đây theo bản chụp của mốc đó + Chơi lại · nhánh = hậu quả · kết thúc = lời kết
    const detail = x => {
      const s = stateOf(x, R, G);
      let html = `<div class="fx-dh s-${s}"><small>${t(s === "now" ? "now" : s === "seen" ? "seen" : "lock")}</small>`;
      if (s === "lock") html += `<b>???</b><p>${x.hint ? esc(nat(x.hint)) : t("lockd")}</p>`;
      else if (x.kind === "cp") {
        const snap = G.cps[x.id];
        const rc = snap ? E.recapOf(snap, x.ch).filter(r => (r.ch ?? 0) === (x.ch || 0)) : [];
        html += `<b>${esc(nat(x.label))}</b>${x.sum ? `<p>${esc(nat(x.sum))}</p>` : ""}${rc.length ? `<div class="fx-upto"><small>${t("upto")}</small>${rc.slice(-6).map(r => `<p class="se-rcp">${esc(nat(r.t))}</p>`).join("")}</div>` : ""}${E.chOpen(x.ch || 1) ? `<button class="se-btn pri wide" data-cp="${esc(x.id)}">↺ ${t("replay")}</button>` : `<p class="se-mute">${esc(nat({ en: `Finish chapter ${(x.ch || 1) - 1} to replay from here.`, vi: `Xong chương ${(x.ch || 1) - 1} để chơi lại từ đây.` }))}</p>`}`;
      } else if (x.kind === "opt") {
        html += `<b>${esc(nat(x.label))}</b><p class="se-mute">${t(s === "now" ? "picked" : "other")}</p>${x.sum ? `<p>${esc(nat(x.sum))}</p>` : ""}`;
      } else {
        const en = S.endings?.[x.id] || {};
        html += `<b>${esc(nat(en.title || x.label))}</b>${en.sum ? `<p>${esc(nat(en.sum))}</p>` : ""}${en.text ? `<p class="fx-et">${esc(nat(en.text))}</p>` : ""}`;
      }
      det.innerHTML = html + `<button class="fx-dx" data-dx aria-label="×">×</button></div>`;
      det.hidden = false;
      E.sfx("tap");
    };
    // .se-sheet dùng lại 1 phần tử cho mọi bảng → gắn bằng onclick (addEventListener sẽ cộng dồn mỗi lần mở)
    const base = sh.onclick;
    sh.onclick = e => {
      base?.(e);
      const v = e.target.closest("[data-v]");
      if (v) { view = v.dataset.v; sh.querySelectorAll("[data-v]").forEach(b => b.classList.toggle("on", b === v)); E.sfx("tap"); return draw(); }
      const c = e.target.closest("[data-ch]");
      if (c) { cur = +c.dataset.ch; if (view !== "map") { view = "map"; sh.querySelectorAll("[data-v]").forEach(b => b.classList.toggle("on", b.dataset.v === "map")); } E.sfx("page"); return draw(); }
      // nút trong khung chi tiết xét TRƯỚC; ô sơ đồ chỉ nhận .fx-n (gốc .se của game cũng mang data-n = node đang chạy →
      //   closest("[data-n]") từng bắt nhầm mọi cú bấm trong khung chi tiết: “Chơi lại từ đây” và × không ăn)
      if (e.target.closest("[data-dx]")) { det.hidden = true; sh.querySelectorAll(".fx-n.sel").forEach(x => x.classList.remove("sel")); return; }
      const cp = e.target.closest("[data-cp]")?.dataset.cp;
      if (cp) return E.ui.replayAsk({ cp });
      const n = e.target.closest(".fx-n[data-n]");
      if (n) { sh.querySelectorAll(".fx-n.sel").forEach(x => x.classList.remove("sel")); n.classList.add("sel"); return detail(body._idx[+n.dataset.n]); }
    };
    sh.onclose = () => { closed = true; clearTimeout(scrollTimer); body._ro?.disconnect(); };
    draw();
    return sh;
  };
})();
