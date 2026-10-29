// THE STATEMENT — KHUNG TRUYỆN (nhân vật, cảnh, cách ghép). Mỗi chương 1 file story/chN.js gọi StoryEngine.chapter({…}).
// Định dạng: tools/games/_lib/story/README.md · kịch bản: docs/games/the-statement-KICH-BAN.md
StoryEngine.story({
  engine: "2",
  genre: { en: "Detective story", vi: "Truyện trinh thám" },
  id: "the-interpreter",
  title: { en: "The Statement", vi: "Lời khai" },
  tagline: { en: "One wrong word can put an innocent man in prison.", vi: "Ghi sai một chữ, người vô tội vào tù." },
  natives: ["vi", "en"], learns: ["en"],
  start: "pro",
  // bạn là ai (màn tổng quan): vai + điều bạn giấu
  me: { role: { en: "Trainee detective, Port Halden police. First week on the job.", vi: "Thám tử tập sự, cảnh sát Port Halden. Tuần làm việc đầu tiên." },
    goal: { en: "Secret: you came to find your little brother Sam, missing for four months.", vi: "Bí mật: bạn đến đây để tìm em trai Sam, mất liên lạc bốn tháng." } },
  titleScene: "pier",
  // XƯNG HÔ theo giới tính người chơi (Bạn là: Nam / Nữ — người dùng 29/10: chọn nữ mà lời dịch vẫn “anh / chị”):
  //   {ac} / {Ac} = anh · chị (Kieran, luật sư gọi bạn) · {cc} / {Cc} = cậu · cô (Ruth, Owen, Jim gọi bạn). Chỉ dùng trong bản tiếng Việt.
  vars: {
    ac: s => (s.G.set.g === "F" ? "chị" : "anh"), Ac: s => (s.G.set.g === "F" ? "Chị" : "Anh"),
    cc: s => (s.G.set.g === "F" ? "cô" : "cậu"), Cc: s => (s.G.set.g === "F" ? "Cô" : "Cậu"),
  },

  chars: {
    ruth: { known: true, name: "DI Ruth Calder", short: "Ruth", g: "F", color: "#8fb3d9", rate: 0.95, pitch: 0.9, role: { en: "Detective Inspector. Your mentor. Trusts evidence, not people.", vi: "Thanh tra. Người kèm cặp bạn. Tin bằng chứng, không tin người." } },
    owen: { known: true, name: "DS Owen Price", short: "Owen", g: "M", color: "#e0a868", rate: 1.06, pitch: 1.05, role: { en: "Detective Sergeant. Friendly. In a hurry to close the case.", vi: "Trung sĩ. Thân thiện. Muốn đóng vụ án thật nhanh." },
      notes: [{ if: s => s.f.owen_lied, t: { en: "He lied about what was shouted at the pub.", vi: "Anh ta nói dối chuyện ai hét gì ở quán." } }, { if: s => s.truth("T11"), t: { en: "He was on the pier when Finch died — and when Danny died.", vi: "Anh ta có mặt trên cầu tàu khi Finch chết — và khi Danny chết." } }] },
    kieran: { alias: { en: "The boy", vi: "Cậu bé" }, hint: { en: "The only witness.", vi: "Nhân chứng duy nhất." }, name: "Kieran Doyle", short: "Kieran", g: "M", color: "#9fd4a3", rate: 1.02, pitch: 1.2, role: { en: "The only witness. 16 years old. Terrified.", vi: "Nhân chứng duy nhất. 16 tuổi. Sợ hãi." } },
    sam: { known: true, name: "Sam", g: "M", color: "#f0c987", rate: 1, pitch: 1.1, role: { en: "Your little brother, 19. Missing for four months.", vi: "Em trai bạn, 19 tuổi. Mất liên lạc bốn tháng." },
      notes: [{ if: s => s.truth("T4"), t: { en: "He was on the pier the night Danny died.", vi: "Nó có mặt trên cầu tàu đêm Danny chết." } }, { if: s => s.f.met_sam, t: { en: "Alive. Hiding at the Gull Head lighthouse.", vi: "Còn sống. Trốn ở ngọn hải đăng Gull Head." } }] },
    jim: { hint: { en: "Somebody at the harbour.", vi: "Một người ở bến cảng." }, name: "Jim Hardy", short: "Jim", g: "M", color: "#d49a9a", rate: 0.94, pitch: 0.85, role: { en: "Owner of The Anchor pub. Sees everything, says little.", vi: "Chủ quán rượu The Anchor. Thấy hết, ít nói." } },
    judge: { name: "Defence lawyer", short: "Lawyer", g: "M", color: "#c9b28a", rate: 0.9, pitch: 0.8, hideInBook: true },
    caller: { name: "???", g: "M", color: "#888", rate: 0.9, pitch: 0.8, hideInBook: true },
    maggie: { name: "Maggie Lane", short: "Maggie", g: "F", color: "#e8a3b8", rate: 0.96, pitch: 1.05, hint: { en: "Everyone at the harbour knows her.", vi: "Cả bến cảng đều biết bà." }, role: { en: "Owner of Maggie's fish and chip shop. 'Mum' of the harbour.", vi: "Chủ quán cá chiên Maggie's. “Mẹ” của cả bến cảng." },
      notes: [{ if: s => s.truth("T7"), t: { en: "She finds runaway kids for Holt's line.", vi: "Bà tìm trẻ bỏ nhà cho đường dây của Holt." } }, { if: s => s.has("gp_key"), t: { en: "She gave you the key to Gull Point.", vi: "Bà đưa bạn chìa khoá Gull Point." } }] },
    tom: { name: "Captain Tom Ward", short: "Tom", g: "M", color: "#9cc0a8", rate: 0.88, pitch: 0.82, hint: { en: "Owen already blames him.", vi: "Owen đã đổ tội cho người này." }, role: { en: "Captain of the trawler Marta. Says very little.", vi: "Thuyền trưởng tàu Marta. Rất ít nói." },
      notes: [{ if: s => s.f.tom_voice, t: { en: "His is the voice on Kieran's voice message.", vi: "Giọng ông chính là giọng trong tin nhắn thoại của Kieran." } }, { if: s => s.truth("T5"), t: { en: "He has secretly helped nine kids escape.", vi: "Ông đã lén giúp chín đứa trẻ trốn đi." } }] },
    ellie: { name: "Ellie Shaw", short: "Ellie", g: "F", color: "#b7a6e8", rate: 1.1, pitch: 1.12, hint: { en: "Someone who patches up kids no one asks about.", vi: "Người băng bó cho những đứa trẻ không ai hỏi tới." }, role: { en: "A&E nurse, 27. Talks fast. Hides something.", vi: "Y tá cấp cứu, 27 tuổi. Nói nhanh. Đang giấu điều gì đó." },
      notes: [{ if: s => s.f.ellie_lie, t: { en: "She lied about Gull Point.", vi: "Cô nói dối về Gull Point." } }, { if: s => s.truth("T8"), t: { en: "She is hiding Sam.", vi: "Cô đang che giấu Sam." } }] },
    holt: { name: "Graham Holt", short: "Holt", g: "M", color: "#d8c27a", rate: 0.9, pitch: 0.86, hint: { en: "The town's great benefactor.", vi: "“Ân nhân” lớn của thị trấn." }, role: { en: "Owner of Holt Seafoods. Pays for half the town.", vi: "Chủ Holt Seafoods. Bỏ tiền nuôi nửa thị trấn." },
      notes: [{ if: s => s.truth("T10"), t: { en: "His money pays for your job.", vi: "Tiền của ông trả lương cho chính bạn." } }, { if: s => s.truth("T1") && s.truth("T7"), t: { en: "The fish boxes carry more than fish.", vi: "Thùng cá chở nhiều thứ hơn cá." } }] },
    finch: { name: "Harold Finch", short: "Finch", g: "M", color: "#a9a9a9", rate: 0.86, pitch: 0.8, hint: { en: "A name in the station's old files.", vi: "Một cái tên trong hồ sơ cũ của đồn." }, role: { en: "The station's statement taker for 30 years. Drowned last October.", vi: "Người ghi lời khai của đồn suốt 30 năm. Chết đuối tháng 10 năm ngoái." },
      notes: [{ if: s => s.truth("T6"), t: { en: "He changed children's statements on purpose.", vi: "Ông cố ý sửa lời khai của bọn trẻ." } }, { if: s => s.truth("T11"), t: { en: "Owen was there when he died.", vi: "Owen có mặt lúc ông chết." } }] },
  },
  // nhãn “… sẽ nhớ điều này”: sus = Owen để ý bạn
  remember: { sus: { who: "owen", up: { en: "Owen is watching you more closely.", vi: "Owen để ý bạn hơn." }, down: { en: "Owen relaxes a little.", vi: "Owen bớt cảnh giác." } } },

  scenes: {
    court: { kind: "court", time: { en: "Six days later", vi: "Sáu ngày sau" }, name: { en: "Crown Court", vi: "Toà án" } },
    room: { kind: "room", time: { en: "3:05 a.m.", vi: "3 giờ 05 sáng" }, rain: true, name: { en: "Your room", vi: "Phòng trọ" } },
    pier: { kind: "pier", time: { en: "3:20 a.m.", vi: "3 giờ 20 sáng" }, fog: true, name: { en: "North pier", vi: "Cầu tàu phía bắc" } },
    car: { kind: "car", time: { en: "4:05 a.m.", vi: "4 giờ 05 sáng" }, rain: true, name: { en: "Police car", vi: "Xe cảnh sát" } },
    pub: { kind: "pub", time: { en: "4:05 a.m.", vi: "4 giờ 05 sáng" }, name: { en: "The Anchor", vi: "Quán The Anchor" } },
    interview: { kind: "interview", time: { en: "4:30 a.m.", vi: "4 giờ 30 sáng" }, name: { en: "Interview Room 2", vi: "Phòng thẩm vấn số 2" } },
    corridor: { kind: "corridor", time: { en: "5:50 a.m.", vi: "5 giờ 50 sáng" }, name: { en: "Station corridor", vi: "Hành lang đồn" } },
    dawn: { kind: "dawn", time: { en: "6:40 a.m.", vi: "6 giờ 40 sáng" }, fog: true, name: { en: "Harbour at dawn", vi: "Bến cảng lúc rạng sáng" } },
    // chương 2–6
    office: { kind: "office", time: { en: "Day 2 · 9:10 a.m.", vi: "Ngày 2 · 9 giờ 10" }, name: { en: "CID office", vi: "Phòng điều tra" } },
    chipshop: { kind: "pub", time: { en: "Day 2 · 12:30 p.m.", vi: "Ngày 2 · 12 giờ 30" }, amb: "room", name: { en: "Maggie's", vi: "Quán Maggie's" } },
    kitchen: { kind: "pub", time: { en: "Day 2 · 12:50 p.m.", vi: "Ngày 2 · 12 giờ 50" }, amb: "room", name: { en: "Maggie's kitchen", vi: "Bếp quán Maggie's" } },
    cells: { kind: "interview", time: { en: "Day 2 · 3:00 p.m.", vi: "Ngày 2 · 3 giờ chiều" }, amb: "hall", name: { en: "Custody cell 4", vi: "Phòng tạm giữ số 4" } },
    morgue: { kind: "corridor", time: { en: "Day 2 · 6:15 p.m.", vi: "Ngày 2 · 6 giờ 15 tối" }, amb: "hall", fx: "night", name: { en: "Hospital mortuary", vi: "Nhà xác bệnh viện" } },
    hospital: { kind: "corridor", time: { en: "Day 3 · 8:00 a.m.", vi: "Ngày 3 · 8 giờ sáng" }, amb: "hall", name: { en: "A&E, Halden General", vi: "Khoa cấp cứu, Bệnh viện Halden" } },
    archive: { kind: "office", time: { en: "Day 3 · 2:00 p.m.", vi: "Ngày 3 · 2 giờ chiều" }, amb: "room", name: { en: "Records room", vi: "Phòng lưu hồ sơ" } },
    street: { kind: "dawn", time: { en: "Day 3 · 11:40 p.m.", vi: "Ngày 3 · 11 giờ 40 đêm" }, rain: true, fx: "night", name: { en: "Your street", vi: "Con phố nhà bạn" } },
    gala: { kind: "court", time: { en: "Day 4 · 8:00 p.m.", vi: "Ngày 4 · 8 giờ tối" }, amb: "hall", fx: "dusk", name: { en: "Holt House", vi: "Dinh thự nhà Holt" } },
    study: { kind: "office", time: { en: "Day 4 · 9:20 p.m.", vi: "Ngày 4 · 9 giờ 20 tối" }, amb: "room", name: { en: "Holt's study", vi: "Phòng làm việc của Holt" } },
    galakitchen: { kind: "pub", time: { en: "Day 4 · 9:45 p.m.", vi: "Ngày 4 · 9 giờ 45 tối" }, amb: "room", name: { en: "Holt House kitchen", vi: "Bếp dinh thự Holt" } },
    storm: { kind: "pier", time: { en: "Day 5 · 10:30 p.m.", vi: "Ngày 5 · 10 giờ 30 đêm" }, rain: true, amb: "rain", fx: "night", name: { en: "Harbour, storm", vi: "Bến cảng trong bão" } },
    gullpoint: { kind: "corridor", time: { en: "Day 5 · 11:10 p.m.", vi: "Ngày 5 · 11 giờ 10 đêm" }, rain: true, amb: "rain", fx: "night", name: { en: "Gull Point cannery", vi: "Xưởng đồ hộp Gull Point" } },
    dorm: { kind: "room", time: { en: "Day 5 · 11:25 p.m.", vi: "Ngày 5 · 11 giờ 25 đêm" }, amb: "rain", fx: "night", name: { en: "The dormitory", vi: "Phòng ngủ tập thể" } },
    coldstore: { kind: "interview", time: { en: "Day 5 · 11:50 p.m.", vi: "Ngày 5 · 11 giờ 50 đêm" }, fx: "night", name: { en: "Cold store", vi: "Kho lạnh" } },
    lighthouse: { kind: "dawn", time: { en: "Day 6 · 12:40 a.m.", vi: "Ngày 6 · 0 giờ 40" }, rain: true, amb: "sea", fx: "night", name: { en: "Gull Head lighthouse", vi: "Hải đăng Gull Head" } },
    lamproom: { kind: "room", time: { en: "Day 6 · 1:00 a.m.", vi: "Ngày 6 · 1 giờ sáng" }, amb: "sea", fx: "night", name: { en: "The lamp room", vi: "Phòng đèn hải đăng" } },
    courthall: { kind: "corridor", time: { en: "Day 6 · 9:30 a.m.", vi: "Ngày 6 · 9 giờ 30" }, amb: "hall", name: { en: "Court corridor", vi: "Hành lang toà án" } },
  },

  truthTotal: 12,
  // danh sách chương ở màn tổng quan (soon = chưa ra, hiện khoá “Sắp ra mắt”) — thêm chương mới: thêm 1 dòng + story/chN.js
  chapters: [
    { ch: 1, title: { en: "Lost for Words", vi: "Một chữ sai" }, sum: { en: "3 a.m., a body under the pier, and a terrified 16-year-old witness. Write down exactly what he says.", vi: "3 giờ sáng, một thi thể dưới cầu tàu và nhân chứng 16 tuổi đang run sợ. Ghi lại đúng từng chữ cậu nói." } },
    { ch: 2, title: { en: "Fish and Lies", vi: "Cá và lời dối" }, sum: { en: "The dead boy is nineteen. A warm chip shop, a silent captain, and a face under a sheet.", vi: "Người chết mới mười chín tuổi. Một quán cá chiên ấm áp, một thuyền trưởng im lặng và một gương mặt dưới tấm vải." } },
    { ch: 3, title: { en: "Witness", vi: "Nhân chứng" }, sum: { en: "A nurse who lies in the present perfect, and a dead man who changed children's words.", vi: "Một cô y tá nói dối bằng thì hiện tại hoàn thành, và một người đã chết từng sửa lời của bọn trẻ." } },
    { ch: 4, title: { en: "The Benefactor", vi: "Ân nhân" }, sum: { en: "A charity gala. A rich man's offer: write carefully, and your brother comes home.", vi: "Một buổi tiệc từ thiện. Lời đề nghị của người giàu: ghi cẩn thận, và em trai bạn sẽ về nhà." } },
    { ch: 5, title: { en: "Undertow", vi: "Sóng ngầm" }, sum: { en: "A storm, the old cannery, a lighthouse — and the person who was really on the pier at 1:47.", vi: "Một cơn bão, xưởng đồ hộp cũ, ngọn hải đăng — và kẻ thật sự có mặt trên cầu tàu lúc 1:47." } },
    { ch: 6, title: { en: "Testimony", vi: "Lời khai" }, sum: { en: "Back to the courtroom. Word for word?", vi: "Trở lại phòng xử. Đúng từng chữ?" } },
  ],
});
