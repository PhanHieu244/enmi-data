// BETWEEN TIDES · GIỮA HAI CON NƯỚC — KHUNG TRUYỆN. Trinh thám đảo thủy triều, 6 chương, 14 sự thật, 10 kết thúc.
// Thiết kế (nguồn sự thật): ../../GiuaHaiConNuoc-thiet-ke.md · Văn song ngữ: ../../GiuaHaiConNuoc-truyen-chN.md · Quy tắc dịch: ../../GiuaHaiConNuoc-quy-tac-dich.md
// Mọi nhân vật nói tiếng Anh (en = thoại gốc); vi = bản dịch thoại / lời dẫn chế độ VI.
/* ═══════════ SỔ MÃ CHUNG — mọi chương PHẢI dùng đúng các mã này ═══════════
 NODE: mỗi chương mở bằng node "cN_open" (N = 1…6) và chỉ đặt tên node có tiền tố "cN_". Kết chương: { end: "cN_end" } (endings ở file chương,
   next = "c(N+1)_open"). Kết thúc giữa truyện: e7_sand (Ch5 chần chừ), e8_refuge (Ch3 trốn Leo), e4_stranger (Ch3 không lật được nghi án).
 CỜ (set): told_nell (true) · held_bottle · climbed_box · leo_id ("truth"|"lie") · at_harbour (true = xuống bến, false = ở quầy)
   took_draft · told_leo ("full"|"few") · gideon_private · helen_promise · helen_box_early (Helen bậc 2 kể chuyện bốt ở Ch4)
   callum_threat (dọa ở Ch4) · dunes_with ("leo"|"helen"|"callum"|"alone"|"wait")
 NIỀM TIN (add, bộ đếm theo mã nhân vật — “X will remember that”): leo · helen · fergus · gideon · callum · nell · dodd
 ĐIỂM LÕI BUỘC TỘI (set khi người chơi có được, từ BẤT KỲ đường nào — thiết kế §10b):
   p_not_suicide (L1) · p_bottle_route (L2) · p_cellar_call (L3) · p_nell_knew (L4) · p_others_cleared (L5)
   2004 (cho E1 trọn vẹn): p_anna_talking · p_second_blow · p_fetched
 ĐỒ VẬT (khai báo ở đây; chương nào trao thì { item: "<mã>" }):
   ring · note · claimfile · cutting · draft · vial · tombottle · flask · logbook · skull · calllist · peg
 CẢNH: village · car · causeway · box · lantern · cellar · harbour · cottage · boat · lifeboat · surgery · dunes · yard
 GIỜ TRÊN MÀN HÌNH: theo dòng thời gian gốc §4 của thiết kế — không tự đổi.
═══════════════════════════════════════════════════════════════════════ */
StoryEngine.story({
  id: "between-tides",
  engine: "3",
  title: { en: "Between Tides", vi: "Giữa hai con nước" },
  tagline: { en: "Your mother didn't drown. Tonight, between two tides, you find out who was there.", vi: "Mẹ bạn không chết đuối. Đêm nay, giữa hai con nước, bạn sẽ biết ai đã ở đó." },
  natives: ["vi", "en"],
  learns: ["en"],
  start: "c1_open",
  titleScene: "causeway",
  stage: "focus",
  theme: { ac: "#d9a441" },
  me: {
    role: { en: "Insurance claims assessor from Leeds. Twenty years ago your mother was 'taken by the tide' on Kellholm causeway.", vi: "Thẩm định viên bảo hiểm ở Leeds. Hai mươi năm trước, mẹ bạn bị “thủy triều cuốn” trên con đường ngầm Kellholm." },
    goal: { en: "Find out what happened to your mother — and who killed the man who wrote to you — before the police cross at 3:05.", vi: "Tìm ra chuyện gì đã xảy ra với mẹ — và ai đã giết người viết thư cho bạn — trước khi cảnh sát qua lúc 3:05." },
  },
  // BẢNG CÁ NHÂN (nút góc phải): mục tiêu lúc này theo cờ goal (chương đặt { set: { goal } }) — người chơi luôn biết đang làm gì
  profile: {
    lines: [
      { label: { en: "Right now", vi: "Lúc này" }, value: s => ({
        find_ta: { en: "Cross to Kellholm before the causeway closes. Find whoever signed 'T.A.'", vi: "Qua đảo Kellholm trước khi đường ngầm đóng. Tìm người ký “T.A.”" },
        wait_tom: { en: "Tom Ashby comes to The Lantern every night. Walk the island until he does.", vi: "Tối nào Tom Ashby cũng tới The Lantern. Đi một vòng đảo trong lúc chờ ông." },
        cottage: { en: "Tom's cottage, ten o'clock. Don't be late.", vi: "Nhà Tom, mười giờ tối. Đừng tới muộn." },
      })[s.f.goal] || { en: "Find out what happened to your mother.", vi: "Tìm ra chuyện gì đã xảy ra với mẹ." } },
      { label: { en: "The causeway", vi: "Đường ngầm" }, value: { en: "Closes 20:50 · opens again 03:05", vi: "Đóng 20:50 · mở lại 03:05" } },
    ],
  },
  vars: {
    ac: s => (s.G.set.g === "F" ? "chị" : "anh"),
    Ac: s => (s.G.set.g === "F" ? "Chị" : "Anh"),
  },
  chars: {
    nell: { name: "Nell Calloway", short: "Nell", g: "F", color: "#e0a875", rate: 1.0, pitch: 1.0,
      hint: { en: "The landlady.", vi: "Bà chủ quán." },
      role: { en: "Landlady of The Lantern. Tom's sister. Callum's mother.", vi: "Chủ quán The Lantern. Em gái Tom. Mẹ của Callum." } },
    tom: { name: "Tom Ashby", short: "Tom", g: "M", color: "#a9b8c4", rate: 0.85, pitch: 0.8,
      hint: { en: "The causeway keeper.", vi: "Người gác đường ngầm." },
      role: { en: "Keeper of the causeway for forty years. Very ill. He wrote to you.", vi: "Người gác đường ngầm bốn mươi năm. Bệnh rất nặng. Ông đã viết thư cho bạn." } },
    fergus: { name: "Fergus", short: "Fergus", g: "M", color: "#b9a27a", rate: 0.9, pitch: 0.75,
      hint: { en: "The old man at the bar.", vi: "Ông già ở quầy." },
      role: { en: "Tom's friend for sixty years. He pours Tom's flask.", vi: "Bạn Tom sáu mươi năm. Ông rót bình rượu cho Tom." } },
    callum: { name: "Callum Calloway", short: "Callum", g: "M", color: "#7fa3b8", rate: 1.05, pitch: 0.9,
      hint: { en: "The fisherman.", vi: "Người đánh cá." },
      role: { en: "Fisherman. Nell's son. A custody hearing next month.", vi: "Ngư dân. Con trai Nell. Tháng sau ra tòa giành quyền nuôi con." } },
    leo: { name: "Leo Hart", short: "Leo", g: "M", color: "#8fb3d9", rate: 1.0, pitch: 1.0,
      hint: { en: "The young constable.", vi: "Viên cảnh sát trẻ." },
      role: { en: "Special constable and volunteer coastguard. His father wrote the 2004 report.", vi: "Cảnh sát đặc biệt kiêm tình nguyện viên cứu hộ. Bố anh viết biên bản năm 2004." } },
    helen: { name: "Dr Helen Vosper", short: "Helen", g: "F", color: "#b7c99a", rate: 1.0, pitch: 1.05,
      hint: { en: "The island doctor.", vi: "Bác sĩ của đảo." },
      role: { en: "The island GP. Tom's doctor.", vi: "Bác sĩ đa khoa của đảo. Bác sĩ của Tom." } },
    gideon: { name: "Gideon Marsh", short: "Gideon", g: "M", color: "#c9a0dc", rate: 1.0, pitch: 0.95,
      hint: { en: "The man from the big house.", vi: "Người ở ngôi nhà lớn." },
      role: { en: "Owns the big house. Chairs the council. Wants a bridge.", vi: "Chủ ngôi nhà lớn. Chủ tịch hội đồng. Muốn có một cây cầu." } },
    dodd: { name: "Mrs Dodd", short: "Mrs Dodd", g: "F", color: "#d8c3a5", rate: 0.9, pitch: 1.1,
      hint: { en: "The woman on the harbour bench.", vi: "Bà cụ trên ghế ở bến." },
      role: { en: "Counts the boats out and in. Every night.", vi: "Đếm thuyền ra thuyền vào. Đêm nào cũng vậy." } },
    anna: { name: "Anna Rowe", short: "Anna", g: "F", color: "#f0c987", reveal: "manual", hideInBook: true,
      role: { en: "Your mother. A hydrographic surveyor.", vi: "Mẹ bạn. Nhà khảo sát thủy văn." } },
  },
  remember: {},
  // NHÃN LỰA CHỌN riêng của truyện (người dùng 30/10: nhãn hỏi cung có sẵn nhiều chỗ không hợp) — chỉ gắn khi đúng sắc thái
  tags: {
    curious: { en: "Curious", vi: "Tò mò", c: "#3b82f6" }, careful: { en: "Careful", vi: "Thận trọng", c: "#64748b" },
    honest: { en: "Honest", vi: "Thành thật", c: "#16a34a" }, guarded: { en: "Guarded", vi: "Giữ kẽ", c: "#7c3aed" },
    kind: { en: "Kind", vi: "Tử tế", c: "#d97706" }, firm: { en: "Firm", vi: "Cứng rắn", c: "#dc2626" },
    press: { en: "Press", vi: "Dồn ép", c: "#b91c1c" }, open: { en: "Open question", vi: "Hỏi mở", c: "#2563eb" },
    lead: { en: "Leading", vi: "Dẫn dắt", c: "#b45309" }, bluff: { en: "Bluff", vi: "Tố khống", c: "#9333ea" },
    direct: { en: "Direct", vi: "Thẳng", c: "#ea580c" }, lie: { en: "Lie", vi: "Nói dối", c: "#475569" }, polite: { en: "Polite", vi: "Lịch sự", c: "#0284c7" },
  },
  scenes: {
    car: { kind: "causeway", name: { en: "The mainland side", vi: "Bờ đất liền" }, time: { en: "4:40 p.m.", vi: "16:40" }, amb: "sea" },
    causeway: { kind: "causeway", name: { en: "Kellholm causeway", vi: "Đường ngầm Kellholm" }, amb: "sea" },
    box: { kind: "study", name: { en: "The refuge box", vi: "Chòi trú nạn" }, amb: "hut" },
    lantern: { kind: "dining", name: { en: "The Lantern", vi: "Quán The Lantern" }, amb: "room" },
    cellar: { kind: "kitchen", name: { en: "The Lantern cellar", vi: "Hầm quán The Lantern" }, time: { en: "2:20 a.m.", vi: "2:20" }, fx: "night" },
    village: { kind: "cliff", name: { en: "Kellholm village", vi: "Làng Kellholm" }, time: { en: "5:40 p.m.", vi: "17:40" }, amb: "sea" },
    harbour: { kind: "causeway", name: { en: "The harbour", vi: "Bến thuyền" }, amb: "harbour" },
    cottage: { kind: "study", name: { en: "The keeper's cottage", vi: "Nhà người gác đường" }, fx: "night", amb: "room" },
    boat: { kind: "cliff", name: { en: "The channel", vi: "Kênh chính" }, time: { en: "10:20 p.m.", vi: "22:20" }, fx: "night", amb: "sea" },
    lifeboat: { kind: "hall", name: { en: "The old lifeboat station", vi: "Trạm xuồng cứu hộ cũ" }, fx: "night", amb: "hall" },
    surgery: { kind: "bedroom", name: { en: "The surgery", vi: "Phòng khám" }, time: { en: "2:10 a.m.", vi: "2:10" }, fx: "night", amb: "night" },
    dunes: { kind: "cliff", name: { en: "The north dunes", vi: "Cồn cát phía bắc" }, time: { en: "2:00 a.m.", vi: "2:00" }, fx: "night", amb: "sea" },
    yard: { kind: "cliff", name: { en: "The estate yard", vi: "Sân điền trang" }, time: { en: "2:10 a.m.", vi: "2:10" }, fx: "night", amb: "night" },
  },
  items: {
    ring: { icon: "ring", keep: true, name: { en: "Your mother's ring", vi: "Nhẫn của mẹ" }, desc: { en: "A wedding ring, engraved 'A & D'. It came in an envelope from Berwick.", vi: "Nhẫn cưới, khắc “A & D”. Đến trong một phong bì gửi từ Berwick." },
      sides: [{ t: { en: "A plain gold wedding ring, polished as if someone had cleaned it yesterday.", vi: "Một chiếc nhẫn cưới vàng trơn, sáng như vừa có người đánh bóng hôm qua." } },
        { art: "it-ring-in", t: { en: "Inside, still sharp: A & D. Anna and Daniel.", vi: "Mặt trong, vẫn rõ nét: A & D. Anna và Daniel." }, note: { en: "The ring: engraved 'A & D' — Anna and Daniel.", vi: "Chiếc nhẫn: khắc “A & D” — Anna và Daniel." } }] },
    note: { icon: "doc", keep: true, name: { en: "The note", vi: "Mẩu thư" }, desc: { en: "'YOUR MOTHER DIDN'T DROWN… — T.A.' Hard capitals, black biro.", vi: "“YOUR MOTHER DIDN'T DROWN… — T.A.” Chữ in hoa ấn mạnh, bút bi đen." },
      doc: { paper: "note", hand: "caps", lines: [
        { en: "YOUR MOTHER DIDN'T DROWN.", vi: "MẸ CHÁU KHÔNG CHẾT ĐUỐI." },
        { en: "SHE HAS BEEN HERE FOR TWENTY YEARS.", vi: "BÀ ẤY Ở ĐÂY HAI MƯƠI NĂM RỒI." },
        { en: "COME ON THE 14TH, AT [[LOW WATER]].", vi: "ĐẾN VÀO NGÀY 14, LÚC NƯỚC RÒNG." },
        { en: "TELL NO ONE WHO YOU ARE.", vi: "ĐỪNG CHO AI BIẾT CHÁU LÀ AI." },
        { s: "gap" }, { en: "— T.A.", vi: "— T.A.", s: "big" }] } },
    claimfile: { icon: "doc", name: { en: "The 2004 claim file", vi: "Hồ sơ bồi thường 2004" }, desc: { en: "Your mother's life-insurance claim. You have never looked at the photographs.", vi: "Hồ sơ bảo hiểm nhân thọ của mẹ. Bạn chưa bao giờ xem phần ảnh." },
      doc: { paper: "report", hand: "type", title: { en: "Life claim · Rowe, Anna · Ref. 04/11/7731", vi: "Hồ sơ nhân thọ · Rowe, Anna · Số 04/11/7731" }, lines: [
        { en: "Date of loss: 14 November 2004.", vi: "Ngày xảy ra: 14 tháng 11 năm 2004." },
        { en: "Cause: drowning (presumed). Body not recovered.", vi: "Nguyên nhân: chết đuối (giả định). Không tìm thấy thi thể." },
        { en: "Claimant: Ms J. Rowe (sister). Paid in full, 2005.", vi: "Người yêu cầu: bà J. Rowe (em gái). Đã chi trả đủ, 2005." },
        { s: "gap" }, { en: "PHOTOGRAPHS — sealed envelope, unopened.", vi: "ẢNH — phong bì dán kín, chưa mở.", s: "faded" }] } },
    cutting: { icon: "doc", name: { en: "A newspaper cutting", vi: "Mẩu báo" }, desc: { en: "'PLANNING INQUIRY OPENS MONDAY; DEVELOPER G. MARSH IN ATTENDANCE.'", vi: "Tin phiên điều trần quy hoạch khai mạc thứ Hai; có mặt nhà phát triển G. Marsh." } },
    draft: { icon: "doc", name: { en: "Half-burnt draft", vi: "Bản nháp cháy dở" }, desc: { en: "'…told the family today… the ring… your mother… low water on the 14th…'", vi: "“…told the family today… the ring… your mother… low water on the 14th…”" } },
    vial: { icon: "bottle", name: { en: "The Oramorph bottle", vi: "Lọ Oramorph" }, desc: { en: "Empty. Polished clean. Not even sticky — though everything else in Tom's pocket is black with soot.", vi: "Rỗng. Sạch bóng. Không hề dính — dù mọi thứ khác trong túi Tom đều đen muội." } },
    tombottle: { icon: "bottle", name: { en: "The TOM bottle", vi: "Chai TOM" }, desc: { en: "Tom's whisky. The felt-tip label has run; the paper is cockled. Someone had it under the tap.", vi: "Chai whisky của Tom. Nhãn bút dạ đã nhòe, giấy quăn. Có người đã xả nó dưới vòi nước." } },
    flask: { icon: "flask", name: { en: "Tom's flask", vi: "Bình rượu của Tom" }, desc: { en: "Filled to the top at nine. It smells sweet. The bottom is tacky.", vi: "Rót đầy lúc chín giờ. Có mùi ngọt. Đáy bình dính." } },
    logbook: { icon: "book", name: { en: "Tom's tide logbook", vi: "Sổ đo nước của Tom" }, desc: { en: "14 Nov 2004: 'road flooded 20:30' in blue ink. Below, in pencil: 'Fetched 20:45. Told the crash did it. I believed it.'", vi: "14/11/2004: “road flooded 20:30” bằng mực xanh. Bên dưới, bút chì: “Fetched 20:45. Told the crash did it. I believed it.”" } },
    skull: { icon: "bone", name: { en: "The skull", vi: "Hộp sọ" }, desc: { en: "A round fracture at the back. 'Whoever had that wasn't talking after it.'", vi: "Vết vỡ tròn ở phía sau. “Ai bị thế thì không nói thêm được câu nào.”" } },
    calllist: { icon: "phone", name: { en: "The cellar phone list", vi: "Danh sách cuộc gọi máy hầm" }, desc: { en: "CALLS MADE: 22:30 — NSECH CRAMLINGTON · 21:11 — 141 01289 381214", vi: "CALLS MADE: 22:30 — NSECH CRAMLINGTON · 21:11 — 141 01289 381214" } },
    peg: { icon: "stick", name: { en: "A survey peg", vi: "Cọc mốc khảo sát" }, desc: { en: "N-08 — BOREHOLE. Pulled up tonight.", vi: "N-08 — BOREHOLE. Bị nhổ lên đêm nay." } },
  },
  truths: {
    T1: { name: { en: "She didn't drown", vi: "Mẹ không chết đuối" }, text: { en: "Your mother never drowned. She has been on the island for twenty years.", vi: "Mẹ bạn không chết đuối. Bà đã ở trên đảo hai mươi năm." } },
    T2: { name: { en: "Someone on the water", vi: "Một người trên mặt nước" }, text: { en: "Tom went out to the box for someone on the water.", vi: "Tom ra chòi vì một người trên mặt nước." } },
    T3: { name: { en: "Under the tap", vi: "Dưới vòi nước" }, text: { en: "Someone rinsed Tom's bottle while the boat was out.", vi: "Có người đã xả chai của Tom trong lúc xuồng ra khơi." } },
    T4: { name: { en: "Still sealed", vi: "Vẫn còn niêm phong" }, text: { en: "Helen's three ampoules were never opened.", vi: "Ba ống thuốc của Helen chưa từng được mở." } },
    T5: { name: { en: "Under the table", vi: "Thấp hơn bảng giờ" }, text: { en: "The sea ran 0.6 m below the printed table. The road really closed at 21:32.", vi: "Biển thấp hơn bảng in 0,6 m. Đường thật sự đóng lúc 21:32." } },
    T6: { name: { en: "21:22", vi: "21:22" }, text: { en: "Gideon drove past Tom at 21:22 and didn't stop.", vi: "Gideon lái xe ngang qua Tom lúc 21:22 và không dừng lại." } },
    T7: { name: { en: "21:11, withheld", vi: "21:11, giấu số" }, text: { en: "Someone rang Tom at 21:11 and hid their number.", vi: "Có người gọi cho Tom lúc 21:11 và giấu số." } },
    T8: { name: { en: "The back gate", vi: "Cổng sau" }, text: { en: "Callum saw Tom at 21:02 — and lied about it.", vi: "Callum đã gặp Tom lúc 21:02 — và nói dối chuyện đó." } },
    T9: { name: { en: "Two lots of lights", vi: "Hai cặp đèn" }, text: { en: "In 2004 there were two vehicles on the causeway.", vi: "Năm 2004 có hai chiếc xe trên đường ngầm." } },
    T10: { name: { en: "Uncle Tom's truck", vi: "Xe tải của chú Tom" }, text: { en: "Callum, fourteen, was driving Tom's truck that night.", vi: "Callum, mười bốn tuổi, lái xe tải của Tom đêm đó." } },
    T11: { name: { en: "The seat", vi: "Ghế lái" }, text: { en: "Someone much taller drove your mother's car into the channel.", vi: "Một người cao hơn nhiều đã lái xe của mẹ xuống kênh." } },
    T12: { name: { en: "Not the crash", vi: "Không phải cú tông" }, text: { en: "Your mother was struck after she was down, and buried in the dunes.", vi: "Mẹ bạn bị đập khi đã ngã xuống, rồi bị chôn ở cồn cát." } },
    T13: { name: { en: "The cellar phone", vi: "Máy điện thoại dưới hầm" }, text: { en: "The 21:11 call came from the Lantern cellar.", vi: "Cuộc gọi 21:11 xuất phát từ hầm quán The Lantern." } },
    T14: { name: { en: "All of it", vi: "Gánh tất cả" }, text: { en: "Nell meant to carry all of it — and follow the bones into the channel.", vi: "Nell định gánh tất cả — rồi theo những mảnh xương xuống kênh." } },
  },
  truthTotal: 14,
  chapters: [
    { ch: 1, start: "c1_open", title: { en: "Low Water", vi: "Nước ròng" }, sum: { en: "A ring, a note, and a road that stays dry after the bell.", vi: "Một chiếc nhẫn, một mẩu thư, và con đường vẫn khô sau tiếng chuông." } },
    { ch: 2, start: "c2_open", title: { en: "The Lamp in the Box", vi: "Ngọn đèn trong chòi" }, sum: { en: "A light in the refuge box, and a man who never came home.", vi: "Một ngọn đèn trong chòi trú nạn, và một người không bao giờ về." } },
    { ch: 3, start: "c3_open", title: { en: "The Outsider", vi: "Người ngoài" }, sum: { en: "Everyone says suicide. You are the stranger in the room.", vi: "Ai cũng nói là tự tử. Bạn là người lạ trong phòng." } },
    { ch: 4, start: "c4_open", title: { en: "The Sea Doesn't Read the Table", vi: "Biển không đọc bảng giờ" }, sum: { en: "A withheld call, a doctor's confession, a boy's.", vi: "Một cuộc gọi giấu số, lời thú của bác sĩ, lời thú của một cậu bé." } },
    { ch: 5, start: "c5_open", title: { en: "What the Dunes Kept", vi: "Điều cồn cát giữ" }, sum: { en: "What happened on the causeway in 2004 — and what the sand kept.", vi: "Chuyện gì đã xảy ra trên đường ngầm năm 2004 — và cát đã giữ lại gì." } },
    { ch: 6, soon: true, title: { en: "Between Tides", vi: "Giữa hai con nước" } },
  ],
});
