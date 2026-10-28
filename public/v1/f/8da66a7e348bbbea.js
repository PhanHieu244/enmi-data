// THE INTERPRETER — Mở đầu + Chương 1 “Lost in Translation” (định dạng: tools/games/_lib/story/README.md)
// ĐA NGÔN NGỮ: lời dẫn / bản dịch theo NGÔN NGỮ GỐC của người chơi ({ en, vi, … }); lời nhân vật nói thứ tiếng học (en, easy).
// Người cùng quê (Bảo, Minh) nói TIẾNG MẸ ĐẺ của người chơi (lang "@N") — người Việt chơi: nhân chứng nói tiếng Việt; người Nhật chơi: nói
// tiếng Nhật… (bản dịch truyện sang ngôn ngữ gốc mới = thêm khoá ngôn ngữ đó vào mọi { vi: … } + tên ở names, kể cả đồ quê nhà như “dép tổ ong”).
// [[từ]] = từ trong sổ từ vụ án. Bản dịch hiện có: vi (đủ) · en (lời dẫn).
globalThis.TIQ_STORY = {
  id: "the-interpreter",
  title: { en: "The Interpreter", vi: "Người phiên dịch" },
  tagline: { en: "One wrong word can put an innocent man in prison.", vi: "Dịch sai một chữ, người vô tội vào tù." },
  natives: ["vi", "en"], learns: ["en"],
  start: "pro",
  titleScene: "pier",
  vars: {
    // đại từ người cùng quê gọi bạn (tiếng Việt: anh / chị) — ngôn ngữ khác tự thêm
    ac: (s, n) => (n === "vi" ? (s.G.set.g === "F" ? "chị" : "anh") : ""),
    Ac: (s, n) => (n === "vi" ? (s.G.set.g === "F" ? "Chị" : "Anh") : ""),
    pushWord: s => (s.f.push === "off" ? "off" : "away"),
  },

  chars: {
    ruth: { name: "DI Ruth Calder", short: "Ruth", g: "F", color: "#8fb3d9", rate: 0.95, pitch: 0.9, role: { en: "Detective Inspector. Trusts evidence, not people.", vi: "Thanh tra. Tin bằng chứng, không tin người." } },
    owen: { name: "DS Owen Price", short: "Owen", g: "M", color: "#d9a066", rate: 1.07, pitch: 1.05, role: { en: "Detective Sergeant. Friendly. In a hurry to close the case.", vi: "Trung sĩ. Thân thiện. Muốn đóng vụ án thật nhanh." } },
    bao: { name: { vi: "Bảo", en: "Bao" }, g: "M", lang: "@N", color: "#9fd4a3", rate: 1.05, pitch: 1.2, role: { en: "Witness, about 17. Speaks only your language.", vi: "Nhân chứng, khoảng 17 tuổi. Chỉ nói tiếng Việt." } },
    minh: { name: { vi: "Minh", en: "Minh" }, g: "M", lang: "@N", color: "#f0c987", rate: 1, pitch: 1.1, hideInBook: true, role: { en: "Your cousin. Missing for four months.", vi: "Em họ bạn. Mất liên lạc bốn tháng." } },
    jim: { name: "Jim Hardy", short: "Jim", g: "M", color: "#c98f8f", rate: 0.95, pitch: 0.85, role: { en: "Barman at The Anchor. Sees everything, says little.", vi: "Chủ quầy rượu The Anchor. Thấy hết, ít nói." } },
    judge: { name: "Judge Harlow", short: "Judge", g: "M", color: "#c9b28a", rate: 0.88, pitch: 0.75, hideInBook: true },
    caller: { name: "???", g: "M", color: "#888", rate: 0.9, pitch: 0.8, hideInBook: true },
  },

  scenes: {
    court: { kind: "court", name: { en: "Crown Court", vi: "Toà án" } },
    room: { kind: "room", rain: true, name: { en: "Your room", vi: "Phòng trọ" } },
    pier: { kind: "pier", fog: true, name: { en: "North pier", vi: "Cầu tàu phía bắc" } },
    car: { kind: "car", rain: true, name: { en: "Police car", vi: "Xe cảnh sát" } },
    pub: { kind: "pub", name: { en: "The Anchor", vi: "Quán The Anchor" } },
    interview: { kind: "interview", name: { en: "Interview Room 2", vi: "Phòng thẩm vấn số 2" } },
    corridor: { kind: "corridor", name: { en: "Station corridor", vi: "Hành lang đồn" } },
    dawn: { kind: "dawn", fog: true, name: { en: "Harbour at dawn", vi: "Bến cảng lúc rạng sáng" } },
  },

  items: {
    phone: { icon: "phone", name: { en: "Your phone", vi: "Điện thoại của bạn" }, desc: { en: "Battery 31%. It has a torch.", vi: "Pin 31%. Có đèn pin." } },
    minh_photo: { icon: "photo", name: { en: "Photo of Minh", vi: "Ảnh của Minh" }, desc: { en: "You and your cousin Minh, two summers ago. He stopped answering four months ago.", vi: "Bạn và em họ Minh, hai mùa hè trước. Bốn tháng nay em không trả lời." } },
    watch: { icon: "clock", name: { en: "Stopped watch", vi: "Đồng hồ đã dừng" }, desc: { en: "A cheap plastic watch on the victim's wrist. Stopped at 1:47.", vi: "Đồng hồ nhựa rẻ tiền trên cổ tay nạn nhân. Dừng lúc 1:47." } },
    id_card: { icon: "card", name: { en: "ID card", vi: "Thẻ căn cước" }, desc: { en: "Piotr Nowak, 34. A big man with a thick red beard.", vi: "Piotr Nowak, 34 tuổi. Người to lớn, râu đỏ rậm." } },
    sandal: { icon: "sandal", name: { en: "Green sandal", vi: "Chiếc dép xanh" }, desc: { en: "A cheap green plastic sandal — the kind every market back home sells.", vi: "Dép nhựa tổ ong màu xanh. Chợ nào ở quê cũng bán." } },
    doubt: { icon: "doc", name: { en: "A doubt", vi: "Một nghi vấn" }, desc: { en: "A 34-year-old man with a red beard — and the thin, hairless hand of a boy. The ID doesn't match the body.", vi: "Một người 34 tuổi râu đỏ — mà bàn tay lại gầy, nhẵn như tay thiếu niên. Thẻ căn cước không khớp thi thể." } },
    notes: { icon: "pen", name: { en: "Interpreter's notes", vi: "Sổ phiên dịch" }, desc: { en: "Every line you translated tonight, word for word.", vi: "Mọi câu bạn đã dịch đêm nay, từng chữ một." } },
    voicemail: { icon: "phone", name: { en: "Voice message", vi: "Tin nhắn thoại" }, desc: { en: "'Don't go back to Gull Point tonight. They know. The van comes Thursday, four a.m.'", vi: "“Tối nay đừng về Gull Point. Chúng nó biết rồi. Xe tải đến thứ Năm, 4 giờ sáng.”" } },
  },
  // ghép 2 đồ trong túi (cơ chế explore)
  combos: [
    { a: "id_card", b: "watch", make: "doubt", then: [
      { think: { en: "Thirty-four years old. A red beard. And a plastic watch on a thin, hairless wrist.", vi: "Ba mươi tư tuổi. Râu đỏ. Vậy mà đeo đồng hồ nhựa trên cổ tay gầy, nhẵn nhụi." } },
      { think: { en: "The wallet says Piotr. The body says someone else.", vi: "Cái ví nói là Piotr. Thi thể nói là một người khác." } },
      { set: { doubt_id: 1 } } ] },
  ],

  truthTotal: 12,
  truths: {
    T1: { name: { en: "'Dee dee'", vi: "“Đi đi”" }, text: { en: "Owen says Wrona shouted 'dee dee' at the pub. That isn't Polish. In Vietnamese, 'đi đi' means 'go, go!'", vi: "Owen nói Wrona hét “dee dee” ở quán. Đó không phải tiếng Ba Lan. “Đi đi” là tiếng Việt." } },
    T2: { name: { en: "Đức", vi: "Đức" }, text: { en: "Bảo recognised the green sandal: it belongs to someone called Đức. The victim may not be Piotr Nowak.", vi: "Bảo nhận ra chiếc dép xanh là của một người tên Đức. Nạn nhân có thể không phải Piotr Nowak." } },
    T3: { name: { en: "Gull Point", vi: "Gull Point" }, text: { en: "Bảo lives at Gull Point — an old cannery where nobody is supposed to live. He is terrified someone will find out.", vi: "Bảo sống ở Gull Point — xưởng đồ hộp cũ lẽ ra không ai ở. Cậu sợ có người biết." } },
    T4: { name: { en: "Minh", vi: "Minh" }, text: { en: "Bảo knows your cousin Minh. Minh is connected to this night.", vi: "Bảo biết em họ Minh của bạn. Minh có liên quan đến đêm nay." } },
  },

  words: {
    "pier": { vi: "cầu tàu", ex: "The body was found under the pier." },
    "harbour": { vi: "bến cảng", ex: "The harbour is full of fishing boats." },
    "deckhand": { vi: "thuỷ thủ boong (làm việc trên tàu)", ex: "He works as a deckhand on a trawler." },
    "trawler": { vi: "tàu đánh cá lưới kéo", ex: "The trawler goes out every morning." },
    "witness": { vi: "nhân chứng", ex: "The witness saw two men arguing." },
    "sheet": { vi: "tấm vải (phủ)", ex: "The body was under a white sheet." },
    "beard": { vi: "râu (quai nón)", ex: "He has a thick red beard." },
    "sandal": { vi: "dép", ex: "A green sandal was on the steps." },
    "torch": { vi: "đèn pin (Anh-Anh; Anh-Mỹ: flashlight)", ex: "Use your phone's torch." },
    "rope burn": { vi: "vết cọ xát của dây thừng", ex: "There was a rope burn on the rail." },
    "cctv": { vi: "camera giám sát", ex: "The CCTV camera was pointing at the sky." },
    "knuckles": { vi: "khớp ngón tay", ex: "His knuckles were red and scraped." },
    "come off it": { vi: "thôi đi / đừng có bịa", ex: "Oh, come off it. Nobody believes that." },
    "oilskin": { vi: "áo vải dầu (áo mưa ngư dân)", ex: "Fishermen wear yellow oilskins." },
    "splash": { vi: "tiếng (nước) ùm, tõm", ex: "I heard a splash in the water." },
    "leading question": { vi: "câu hỏi dẫn dắt (gợi sẵn câu trả lời)", ex: "That's a leading question. Ask it another way." },
    "formality": { vi: "thủ tục (cho có)", ex: "Signing is just a formality." },
    "statement": { vi: "lời khai", ex: "Read the statement before you sign it." },
    "arrest": { vi: "bắt giữ", ex: "They will arrest him at dawn." },
    "row": { vi: "cuộc cãi vã (Anh-Anh, đọc /raʊ/)", ex: "They had a row at the pub." },
    "fresh eyes": { vi: "góc nhìn mới", ex: "Look around. We need fresh eyes." },
    "uniform": { vi: "cảnh sát mặc sắc phục", ex: "Uniform caught him near the pier." },
    "aye": { vi: "ừ, vâng (tiếng địa phương miền Bắc nước Anh)", ex: "Aye, I saw them." },
    "nowt": { vi: "chẳng có gì (= nothing, tiếng địa phương)", ex: "I heard nowt." },
    "love": { vi: "cưng / bạn (cách gọi thân mật ở miền Bắc nước Anh)", ex: "You all right, love?" },
    "wristband": { vi: "vòng đeo tay", ex: "His birthday was on his wristband." },
  },

  // ───────── TÓM TẮT THEO NHÁNH (Chuyện đã qua · màn kết chương) ─────────
  recap: [
    { ch: 0, t: { en: "Six days from now, you stand in a courtroom. The defendant has said nine words in your language — and only you understood them.", vi: "Sáu ngày nữa, bạn đứng giữa phòng xử. Bị cáo vừa nói chín chữ bằng tiếng Việt — và chỉ mình bạn hiểu." } },
    { ch: 1, t: { en: "You are an interpreter, three weeks in the English port town of Port Halden. Secretly, you came to find your cousin Minh, missing for four months.", vi: "Bạn là phiên dịch viên, mới ba tuần ở thị trấn cảng Port Halden. Lý do thầm kín: tìm em họ Minh, mất liên lạc bốn tháng." } },
    { ch: 1, when: "c1_pier", t: { en: "3 a.m.: a body under the north pier. The wallet says Piotr Nowak, a Polish deckhand. DS Owen Price already blames his captain, Tomasz Wrona.", vi: "3 giờ sáng: một thi thể dưới cầu tàu phía bắc. Ví ghi Piotr Nowak, thuỷ thủ người Ba Lan. Trung sĩ Owen Price đã đổ cho thuyền trưởng Tomasz Wrona." } },
    { ch: 1, if: s => s.has("sandal"), t: { en: "On the steps you found a green plastic sandal — the kind sold in every market back home.", vi: "Trên bậc thang, bạn tìm thấy chiếc dép tổ ong xanh — loại chợ nào ở quê cũng bán." } },
    { ch: 1, if: s => s.f.doubt_id, t: { en: "The ID and the body don't match: the dead hand is young and hairless, not a 34-year-old with a red beard.", vi: "Thẻ căn cước không khớp thi thể: bàn tay người chết trẻ và nhẵn, không phải người 34 tuổi râu đỏ." } },
    { ch: 1, if: s => s.truth("T1") && s.f.heard_dd, t: { en: "Owen claims Wrona shouted 'dee dee'. It sounds like Vietnamese: 'đi đi' — 'go, go'.", vi: "Owen nói Wrona hét “dee dee”. Nghe như tiếng Việt: “đi đi”." } },
    { ch: 1, if: s => s.f.detour === "car", t: { en: "You rode with the witness, Bảo. Alone with you, he asked if you were really from home. His wristband said '14·02'.", vi: "Bạn đi cùng xe với nhân chứng Bảo. Chỉ có hai người, cậu hỏi bạn có thật là người Việt không. Vòng tay cậu ghi “14·02”." } },
    { ch: 1, if: s => s.f.detour === "stay", t: { en: "You stayed at the pier — and saw Owen quietly turn the CCTV camera back down when he thought nobody was looking.", vi: "Bạn ở lại cầu tàu — và thấy Owen lặng lẽ chỉnh camera chĩa xuống lại khi tưởng không ai nhìn." } },
    { ch: 1, if: s => s.f.detour === "pub", t: { en: "At The Anchor, Jim the barman said Wrona and Piotr argued about money — Piotr was going home to Poland. And nobody shouted 'dee dee'.", vi: "Ở quán The Anchor, Jim kể Wrona và Piotr cãi nhau chuyện tiền — Piotr sắp về Ba Lan. Và chẳng ai hét “dee dee” cả." } },
    { ch: 1, if: s => s.f.push === "away", t: { en: "You translated the witness exactly: the man in yellow 'pushed the other man away'.", vi: "Bạn dịch đúng lời nhân chứng: người áo vàng “đẩy anh kia ra”." } },
    { ch: 1, if: s => s.f.push === "off", t: { en: "You said the man in yellow 'pushed the other man off' — and Owen heard 'off the pier'.", vi: "Bạn dịch người áo vàng “pushed the other man off” — và Owen hiểu thành “đẩy khỏi cầu tàu”." } },
    { ch: 1, if: s => s.f.push === "in", t: { en: "You said the man in yellow pushed the victim 'into the water' — words the boy never said.", vi: "Bạn dịch người áo vàng đẩy nạn nhân “xuống nước” — điều cậu bé chưa từng nói." } },
    { ch: 1, if: s => s.f.objected, t: { en: "You refused Owen's leading question. Ruth backed you. Owen didn't forget it.", vi: "Bạn từ chối câu hỏi dẫn dắt của Owen. Ruth đứng về phía bạn. Owen thì nhớ chuyện đó." } },
    { ch: 1, if: s => s.truth("T2") && s.f.saw_duc, t: { en: "Shown the sandal, Bảo whispered: 'That's Đức's.' The dead man may not be Piotr at all.", vi: "Thấy chiếc dép, Bảo thì thầm: “Dép của anh Đức.” Người chết có thể không phải Piotr." } },
    { ch: 1, if: s => s.f.told_minh, t: { en: "You told Ruth — and Owen — about Minh.", vi: "Bạn đã nói với Ruth — và cả Owen — về Minh." } },
    { ch: 1, if: s => s.f.gp === "told", t: { en: "You translated Bảo's whisper in front of Owen: he lives at Gull Point. Bảo will not forgive you easily.", vi: "Bạn dịch lời thì thầm của Bảo trước mặt Owen: cậu sống ở Gull Point. Bảo sẽ khó tha thứ cho bạn." } },
    { ch: 1, if: s => s.f.gp === "lie", t: { en: "Bảo begged you not to mention Gull Point. You lied: 'He's asking for water.'", vi: "Bảo xin bạn đừng nhắc Gull Point. Bạn nói dối: “Cậu ấy xin nước.”" } },
    { ch: 1, if: s => s.f.gp === "private", t: { en: "You told Ruth about Gull Point in private. She asked you to keep it from Owen. You have an ally.", vi: "Bạn kể riêng với Ruth về Gull Point. Bà dặn giấu Owen. Bạn đã có một đồng minh." } },
    { ch: 1, if: s => s.f.fixed_name, t: { en: "Owen's statement claimed the boy named Wrona. You proved he never did.", vi: "Biên bản của Owen ghi cậu bé đã nêu tên Wrona. Bạn chứng minh cậu chưa từng nói." } },
    { ch: 1, if: s => s.f.signed_bad, t: { en: "You signed a statement with words the witness never said.", vi: "Bạn đã ký một biên bản có những chữ nhân chứng chưa từng nói." } },
    { ch: 1, if: s => s.f.van, t: { en: "A voice message on Bảo's phone: 'The van comes Thursday, four a.m.' The caller had a foreign accent.", vi: "Tin nhắn thoại trong máy Bảo: “Xe tải đến thứ Năm, 4 giờ sáng.” Người gọi có giọng nước ngoài." } },
    { ch: 1, if: s => s.f.outcome === "arrest", t: { en: "At dawn, Tomasz Wrona was arrested. He didn't say a word.", vi: "Rạng sáng, Tomasz Wrona bị bắt. Ông không nói một lời." } },
    { ch: 1, if: s => s.f.outcome === "doubt", t: { en: "Ruth refused to charge Wrona. Not enough evidence — yet.", vi: "Ruth không buộc tội Wrona. Chưa đủ bằng chứng." } },
    { ch: 1, if: s => s.truth("T4") && s.f.end_minh, t: { en: "As Bảo left, he said the words that changed everything: 'Minh told me to run.'", vi: "Lúc rời đi, Bảo nói câu làm mọi thứ đảo lộn: “Anh Minh bảo em chạy.”" } },
    { ch: 1, if: s => s.truth("T4") && s.f.end_photo, t: { en: "On Bảo's lock screen: four young men on a boat. One of them was Minh.", vi: "Trên màn hình khoá của Bảo: bốn chàng trai trên một con thuyền. Một người là Minh." } },
  ],

  flow: [
    { ch: 1, row: 0, id: "pro", kind: "cp", label: { en: "Six days from now", vi: "Sáu ngày nữa" }, sum: { en: "The courtroom. Nine words.", vi: "Phòng xử. Chín chữ." } },
    { ch: 1, row: 1, id: "c1_pier", kind: "cp", label: { en: "The north pier", vi: "Cầu tàu phía bắc" }, sum: { en: "Search the scene.", vi: "Khám nghiệm hiện trường." } },
    { ch: 1, row: 2, id: "c1_detour", kind: "cp", label: { en: "Twenty minutes", vi: "Hai mươi phút" }, sum: { en: "Only one place to go.", vi: "Chỉ kịp đến một nơi." } },
    { ch: 1, row: 3, kind: "opt", key: "detour", val: "car", label: { en: "With Bảo", vi: "Đi cùng Bảo" } },
    { ch: 1, row: 3, kind: "opt", key: "detour", val: "stay", label: { en: "Watch Owen", vi: "Ở lại với Owen" } },
    { ch: 1, row: 3, kind: "opt", key: "detour", val: "pub", label: { en: "The Anchor", vi: "Quán The Anchor" } },
    { ch: 1, row: 4, id: "c1_interview", kind: "cp", label: { en: "The witness", vi: "Nhân chứng" }, sum: { en: "Your first interpretation.", vi: "Lần phiên dịch đầu tiên." } },
    { ch: 1, row: 5, id: "c1_push", kind: "cp", label: { en: "'Đẩy anh kia ra'", vi: "“Đẩy anh kia ra”" }, sum: { en: "The sentence that matters.", vi: "Câu dịch quyết định." } },
    { ch: 1, row: 6, kind: "opt", key: "push", val: "away", label: { en: "pushed away", vi: "pushed away" } },
    { ch: 1, row: 6, kind: "opt", key: "push", val: "off", label: { en: "pushed off", vi: "pushed off" } },
    { ch: 1, row: 6, kind: "opt", key: "push", val: "in", label: { en: "pushed in", vi: "pushed in" } },
    { ch: 1, row: 7, id: "c1_whisper", kind: "cp", label: { en: "The whisper", vi: "Lời thì thầm" }, sum: { en: "Translate everything?", vi: "Dịch tất cả?" } },
    { ch: 1, row: 8, kind: "opt", key: "gp", val: "told", label: { en: "Translate all", vi: "Dịch hết" } },
    { ch: 1, row: 8, kind: "opt", key: "gp", val: "lie", label: { en: "Lie", vi: "Nói dối" } },
    { ch: 1, row: 8, kind: "opt", key: "gp", val: "private", label: { en: "Private word", vi: "Nói riêng" } },
    { ch: 1, row: 9, id: "c1_report", kind: "cp", label: { en: "The statement", vi: "Bản lời khai" }, sum: { en: "Sign — or object.", vi: "Ký — hay phản đối." } },
    { ch: 1, row: 10, id: "c1_arrest", kind: "end", label: { en: "Wrona arrested", vi: "Wrona bị bắt" } },
    { ch: 1, row: 10, id: "c1_doubt", kind: "end", label: { en: "Reasonable doubt", vi: "Còn nghi vấn" } },
  ],

  nodes: {
    // ───────────────────────── MỞ ĐẦU ─────────────────────────
    pro: [
      { cp: "pro" },
      { bg: "court" },
      { n: { en: "Newcastle Crown Court. Six days from now.", vi: "Toà án Hình sự Newcastle. Sáu ngày nữa." } },
      { n: { en: "The courtroom is silent. Forty people are looking at you.", vi: "Phòng xử im phăng phắc. Bốn mươi người đang nhìn bạn." } },
      { show: "judge", at: "c" },
      { say: "judge", en: "Interpreter. Please translate the defendant's answer for the court.", easy: "Interpreter, please translate the answer for us.", vi: "Thông dịch viên. Đề nghị dịch câu trả lời của bị cáo cho toà." },
      { think: { en: "Nine words. In your language. Only you understood them.", vi: "Chín chữ. Bằng tiếng Việt. Chỉ mình bạn hiểu." } },
      { think: { en: "Translate them truthfully — and someone you love goes to prison.", vi: "Dịch đúng — một người bạn thương sẽ vào tù." } },
      { think: { en: "Change one word — and nobody will ever know.", vi: "Đổi một chữ — sẽ không ai biết." } },
      { choice: [
        { silent: true, en: "Translate every word.", vi: "Dịch đúng từng chữ.", set: { pro: 1 } },
        { silent: true, en: "Change one word.", vi: "Đổi một chữ.", set: { pro: 2 } },
      ], timer: 9, timeout: [{ think: { en: "You open your mouth. Nothing comes out.", vi: "Bạn mở miệng. Không thốt ra được chữ nào." } }] },
      { fx: "flash" },
      { hide: "*" },
      { title: { en: "SIX DAYS EARLIER", vi: "SÁU NGÀY TRƯỚC" } },
      { go: "call" },
    ],

    // ───────────────────────── CHƯƠNG 1 ─────────────────────────
    call: [
      { title: { ch: 1, en: "Lost in Translation", vi: "Dịch sai một chữ" } },
      { bg: "room" },
      { n: { en: "Port Halden — a fishing town on the cold north-east coast of England. Your third week here.", vi: "Port Halden — thị trấn đánh cá trên bờ biển đông bắc lạnh giá nước Anh. Tuần thứ ba của bạn ở đây." } },
      { n: { en: "3:05 a.m. You can't sleep. You never can. You play the voice message again — the last one Minh ever sent.", vi: "3 giờ 05 sáng. Bạn không ngủ được. Chưa đêm nào ngủ được. Bạn mở lại tin nhắn thoại — tin cuối cùng Minh gửi." } },
      { item: "phone", quiet: true },
      { say: "minh", phone: true, vi: "{Ac} ơi, em đây. Bên này lạnh lắm, nhưng em ổn. Việc nhiều, ông chủ tốt. Tháng sau em gửi tiền về cho mẹ. {Ac} đừng lo nhé. Em… em phải đi rồi.", en: "It's me. It's really cold here, but I'm fine. Lots of work, the boss is nice. Next month I'll send money home to Mum. Don't worry. I… I have to go." },
      { think: { en: "'I have to go.' He said it too fast. Like someone was standing behind him.", vi: "“Em phải đi rồi.” Em nói nhanh quá. Như có ai đứng sau lưng." } },
      { think: { en: "That was four months ago. Since then: nothing.", vi: "Đó là bốn tháng trước. Từ đó: không một tin." } },
      { item: "minh_photo", quiet: true },
      { n: { en: "3:12 a.m. The phone buzzes in your hand. Unknown number.", vi: "3 giờ 12. Điện thoại rung trong tay bạn. Số lạ." } },
      { say: "ruth", phone: true, en: "Is this {name}? Detective Inspector Ruth Calder, Northumbria Police.", easy: "Hello, is this {name}? I'm Ruth Calder. I'm a police detective.", vi: "{name} phải không? Tôi là thanh tra Ruth Calder, cảnh sát Northumbria." },
      { say: "ruth", phone: true, en: "We have a body in the [[harbour]] and a [[witness]] who only speaks Vietnamese. How fast can you get dressed?", easy: "There is a dead body in the harbour. The witness only speaks Vietnamese. Can you come now?", vi: "Chúng tôi có một thi thể ở bến cảng và một nhân chứng chỉ nói tiếng Việt. Bạn mặc đồ nhanh được không?" },
      { choice: [
        { en: "I'll be there in ten minutes.", vi: "Mười phút nữa tôi có mặt.", add: { ruth: 1 }, then: [
          { say: "ruth", phone: true, en: "Good. North pier. Follow the blue lights.", vi: "Tốt. Cầu tàu phía bắc. Cứ theo đèn xanh mà đến." } ] },
        { en: "A body? Who is it?", vi: "Thi thể? Là ai vậy?", then: [
          { think: { en: "Please. Please don't let it be him.", vi: "Xin đừng. Xin đừng là em ấy." } },
          { say: "ruth", phone: true, en: "That's what we'd like to know. North pier. Hurry.", vi: "Đó là điều chúng tôi muốn biết. Cầu tàu phía bắc. Nhanh lên." } ] },
        { en: "It's three in the morning…", vi: "Giờ là ba giờ sáng mà…", add: { ruth: -1 }, then: [
          { say: "ruth", phone: true, en: "Yes. That's usually when people find bodies. North pier.", vi: "Đúng. Người ta thường tìm thấy xác vào giờ này. Cầu tàu phía bắc." } ] },
      ] },
      { n: { en: "You run the whole way. The question runs with you: a body in the harbour, a witness from home.", vi: "Bạn chạy suốt quãng đường. Câu hỏi chạy theo: một thi thể ở bến cảng, một nhân chứng người Việt." } },
      { go: "pier" },
    ],

    pier: [
      { cp: "c1_pier" },
      { bg: "pier" },
      { n: { en: "The north pier. Fog rolls in from the sea. Blue police lights turn slowly in the mist.", vi: "Cầu tàu phía bắc. Sương mù cuộn vào từ biển. Đèn xanh xe cảnh sát xoay chậm trong màn sương." } },
      { show: "ruth", at: "l" },
      { say: "ruth", en: "{name}. Thanks for coming. I'm Calder.", vi: "{name}. Cảm ơn đã đến. Tôi là Calder." },
      { show: "owen", at: "r", face: "smile" },
      { say: "owen", face: "smile", en: "And I'm Owen — DS Price. Here — terrible coffee, but it's hot. Welcome to Port Halden. It's not usually this exciting, I promise.", easy: "I'm Owen, a police officer. Here's a hot coffee. Welcome to Port Halden. Usually it's very quiet here.", vi: "Còn tôi là Owen — trung sĩ Price. Này — cà phê dở tệ, nhưng được cái nóng. Chào mừng đến Port Halden. Thường ở đây không sôi động thế này đâu, thật đấy." },
      { think: { en: "The first kind face in three weeks.", vi: "Gương mặt tử tế đầu tiên sau ba tuần." } },
      { say: "ruth", en: "A fisherman found the body under the [[pier]] at two-forty. The wallet says Piotr Nowak, thirty-four, Polish. A [[deckhand]] on that [[trawler]] — the Marta.", easy: "A fisherman found the body at 2:40. The wallet says Piotr Nowak, 34, from Poland. He works on that fishing boat, the Marta.", vi: "Một ngư dân tìm thấy thi thể dưới cầu tàu lúc 2 giờ 40. Ví ghi Piotr Nowak, 34 tuổi, người Ba Lan. Thuỷ thủ trên con tàu kia — tàu Marta." },
      { think: { en: "Not Minh. Not Minh. You breathe again — and hate yourself a little for it.", vi: "Không phải Minh. Không phải Minh. Bạn thở lại được — và thấy mình hơi đáng ghét vì điều đó." } },
      { say: "owen", en: "His captain, Tomasz Wrona, had a [[row]] with him at the pub last night. Half the town heard it. We [[arrest]] Wrona at dawn — job done.", easy: "His captain, Tomasz Wrona, argued with him at the pub last night. We can arrest Wrona in the morning. Easy.", vi: "Thuyền trưởng của anh ta, Tomasz Wrona, cãi nhau to với anh ta ở quán tối qua. Nửa thị trấn nghe thấy. Bắt Wrona lúc rạng sáng là xong việc." },
      { say: "ruth", face: "cold", en: "We arrest him when we have a reason, Owen.", vi: "Chúng ta bắt khi có lý do, Owen." },
      { say: "ruth", en: "The witness is in the car. A boy — maybe seventeen. [[Uniform]] caught him running from the pier. Before you talk to him, take a look around. [[Fresh eyes]].", easy: "The witness is a boy, about 17. Police caught him running from the pier. Before you talk to him, look around.", vi: "Nhân chứng đang ở trong xe. Một cậu bé — chắc mười bảy. Cảnh sát tuần tra bắt được cậu đang chạy khỏi cầu tàu. Trước khi nói chuyện với cậu, hãy nhìn quanh. Một góc nhìn mới." },
      { explore: {
        goal: { en: "Search the pier. Find at least 3 clues. Tip: tap an item in your bag, then tap the scene — or another item.", vi: "Khám xét cầu tàu. Tìm ít nhất 3 manh mối. Mẹo: chạm 1 món trong túi rồi chạm vào cảnh — hoặc vào món khác." },
        need: 3, done: { en: "Done searching", vi: "Xong khám xét" },
        spots: [
          { id: "body", x: 34, y: 72, clue: true, label: { en: "Body", vi: "Thi thể" }, then: [
            { n: { en: "A shape under a white [[sheet]]. One hand lies outside it.", vi: "Một hình người dưới tấm vải trắng. Một bàn tay thò ra ngoài." } },
            { n: { en: "The hand is thin. Young. A cheap plastic watch on the wrist — stopped at 1:47.", vi: "Bàn tay gầy. Trẻ. Cổ tay đeo chiếc đồng hồ nhựa rẻ tiền — dừng lúc 1:47." } },
            { think: { en: "Minh wore a watch like this. Everyone back home does.", vi: "Minh cũng đeo loại đồng hồ này. Ở quê ai chẳng đeo." } },
            { item: "watch" } ] },
          { id: "wallet", x: 55, y: 58, clue: true, label: { en: "Evidence bag", vi: "Túi tang vật" }, then: [
            { say: "ruth", en: "The wallet. Found in his jacket. Nothing taken — sixty pounds still inside.", vi: "Cái ví. Tìm thấy trong áo khoác. Không mất gì — vẫn còn sáu mươi bảng." },
            { n: { en: "The ID card shows Piotr Nowak: a big man with a thick red [[beard]].", vi: "Thẻ căn cước: Piotr Nowak — người to lớn, râu đỏ rậm." } },
            { think: { en: "Sixty pounds left in the wallet. So whoever did this didn't want money.", vi: "Ví còn nguyên sáu mươi bảng. Vậy kẻ làm chuyện này không cần tiền." } },
            { item: "id_card" } ] },
          { id: "steps", x: 80, y: 84, clue: true, label: { en: "Dark steps", vi: "Bậc thang tối" },
            then: [
              { n: { en: "Stone steps lead down to the water. It's too dark to see anything down there.", vi: "Bậc đá dẫn xuống mặt nước. Tối quá, không thấy gì dưới đó." } },
              { think: { en: "I need light.", vi: "Cần có đèn." } } ],
            use: { phone: [
              { n: { en: "You switch on your phone's [[torch]]. The beam shakes in the fog.", vi: "Bạn bật đèn pin điện thoại. Vệt sáng run run trong sương." } },
              { n: { en: "There — half in the water: a green plastic [[sandal]].", vi: "Kia — nửa chìm dưới nước: một chiếc dép nhựa xanh." } },
              { think: { en: "I know this sandal. Every market back home sells them.", vi: "Mình biết loại dép này. Chợ nào ở quê cũng bán. Dép tổ ong." } },
              { think: { en: "Who wears these in England? In February?", vi: "Ai đi dép này ở Anh? Vào tháng Hai?" } },
              { item: "sandal" } ] } },
          { id: "boat", x: 13, y: 46, clue: true, label: { en: "The Marta", vi: "Tàu Marta" }, then: [
            { n: { en: "The Marta. Dark and silent. On the rail, a fresh [[rope burn]] — the paint is scraped away.", vi: "Tàu Marta. Tối om, im lặng. Trên lan can, một vết dây thừng còn mới — lớp sơn bị cọ trầy." } },
            { n: { en: "A row of yellow oilskins hangs by the cabin door. One hook is empty.", vi: "Một hàng áo vải dầu vàng treo cạnh cửa cabin. Một cái móc trống." } },
            { think: { en: "Someone took a coat tonight.", vi: "Đêm nay có người lấy đi một chiếc áo." } },
            { set: { saw_hook: 1 } } ] },
          { id: "cam", x: 86, y: 20, clue: true, label: { en: "Camera", vi: "Camera" }, then: [
            { n: { en: "A [[CCTV]] camera on the lamp post. Its lens is pointing at the sky.", vi: "Camera giám sát trên cột đèn. Ống kính đang chĩa lên trời." } },
            { say: "owen", en: "The wind does that. Happens all the time round here.", vi: "Gió đấy. Ở đây chuyện thường." },
            { think: { en: "There's hardly any wind tonight.", vi: "Đêm nay gần như không có gió." } },
            { set: { saw_cam: 1 } } ] },
          { id: "owen", x: 66, y: 40, label: { en: "Talk to Owen", vi: "Nói chuyện với Owen" },
            then: [
              { choice: [
                { en: "What did people hear at the pub?", vi: "Ở quán người ta nghe thấy gì?", once: true, then: [
                  { say: "owen", en: "Shouting. Wrona was yelling at Nowak — something like 'dee dee, dee dee!' Polish swearing, probably.", easy: "Shouting. Wrona was yelling 'dee dee, dee dee!' at Nowak. I think it's a bad word in Polish.", vi: "La hét. Wrona quát Nowak — kiểu “dee dee, dee dee!”. Chắc là chửi bằng tiếng Ba Lan." },
                  { think: { en: "Dee dee… That isn't Polish.", vi: "Dee dee… Đó đâu phải tiếng Ba Lan." } },
                  { think: { en: "Đi đi. 'Go, go!' That's Vietnamese.", vi: "Đi đi. Là tiếng Việt." } },
                  { set: { heard_dd: 1 } }, { truth: "T1" },
                  { choice: [
                    { en: "That sounds like Vietnamese, not Polish.", vi: "Nghe như tiếng Việt chứ không phải tiếng Ba Lan.", add: { sus: 1 }, set: { said_dd: 1 }, then: [
                      { say: "owen", face: "cold", en: "…Does it? The pub was noisy. Could be anything.", vi: "…Thế à? Quán ồn lắm. Ai mà biết." },
                      { n: { en: "For one second, his smile disappears.", vi: "Trong một giây, nụ cười của anh ta biến mất." } } ] },
                    { en: "(Keep it to yourself.)", vi: "(Giữ trong lòng.)", then: [
                      { think: { en: "Remember it. Say nothing — yet.", vi: "Nhớ lấy. Chưa nói gì vội." } } ] },
                  ] } ] },
                { en: "What happened to your hand?", vi: "Tay anh bị sao vậy?", once: true, then: [
                  { n: { en: "His [[knuckles]] are red and scraped. Fresh.", vi: "Các khớp ngón tay anh ta đỏ và trầy. Còn mới." } },
                  { say: "owen", face: "smile", en: "Rugby. Sunday league. You should see the other guy.", easy: "I play rugby on Sundays. The other player looks worse!", vi: "Bóng bầu dục. Giải Chủ nhật. Phải xem gã kia thế nào kìa." },
                  { think: { en: "Today is Wednesday.", vi: "Hôm nay là thứ Tư." } },
                  { set: { saw_knuckles: 1 } } ] },
                { en: "Nothing, thanks.", vi: "Không có gì, cảm ơn." },
              ], loop: true } ],
            use: { minh_photo: [
              { say: "me", en: "Have you ever seen this man? He's my cousin.", vi: "Anh đã gặp người này bao giờ chưa? Em họ tôi." },
              { n: { en: "Owen looks at the photo. A beat too long.", vi: "Owen nhìn tấm ảnh. Lâu hơn cần thiết một nhịp." } },
              { say: "owen", face: "smile", en: "Can't say I have. Sorry. Lots of lads come and go on the boats.", easy: "No, I haven't. Sorry. Many young men work on the boats.", vi: "Không nhớ là đã gặp. Xin lỗi. Bến này nhiều cậu đến rồi đi lắm." },
              { say: "owen", en: "Tell you what — I'll keep an eye out. What's his name?", vi: "Thế này nhé — tôi sẽ để ý giúp. Cậu ấy tên gì?" },
              { choice: [
                { en: "Minh. Thank you.", vi: "Minh. Cảm ơn anh.", set: { owen_minh: 1 } },
                { en: "…Never mind. It's not important.", vi: "…Thôi. Không quan trọng." },
              ] } ] } },
        ],
      } },
      // nghi nạn nhân không phải Piotr: biết từ lần chơi trước (Trực giác) HOẶC tự suy ra (ghép thẻ căn cước + đồng hồ)
      { choice: [
        { need: "T2", intuition: true, en: "I don't think the victim is Piotr Nowak.", vi: "Tôi không nghĩ nạn nhân là Piotr Nowak.", add: { ruth: 2 }, set: { early_id: 1 }, then: [
          { say: "ruth", face: "cold", en: "That's a big thing to say. Why?", vi: "Nói thế là to chuyện đấy. Vì sao?" },
          { say: "me", en: "The hand is too young. No red hair. And that sandal is from my country.", vi: "Bàn tay quá trẻ. Không có lông đỏ. Và chiếc dép kia là dép nước tôi." },
          { say: "ruth", en: "…I'll ask the pathologist to hurry. Good catch.", vi: "…Tôi sẽ giục bên pháp y. Tinh mắt đấy." } ] },
        { if: s => s.f.doubt_id && !s.truth("T2"), en: "The ID doesn't match the body.", vi: "Thẻ căn cước không khớp với thi thể.", add: { ruth: 2 }, set: { early_id: 1 }, then: [
          { say: "ruth", face: "cold", en: "Go on.", vi: "Nói tiếp đi." },
          { say: "me", en: "Piotr Nowak is thirty-four with a red beard. That hand belongs to a teenager.", vi: "Piotr Nowak 34 tuổi, râu đỏ. Bàn tay kia là của một thiếu niên." },
          { say: "ruth", en: "…You looked at the hand. Most people can't. I'll ask the pathologist to hurry.", vi: "…Bạn nhìn vào bàn tay. Phần lớn người ta không dám. Tôi sẽ giục bên pháp y." } ] },
        { en: "(Say nothing.)", vi: "(Không nói gì.)" },
      ], skipIfOne: true },
      { go: "detour" },
    ],

    // ───────── CHỌN HƯỚNG ĐI: 20 phút, chỉ 1 nơi ─────────
    detour: [
      { cp: "c1_detour" },
      { say: "ruth", en: "The boy has to be checked by a doctor first. That gives us twenty minutes. Use them well.", easy: "A doctor must check the boy first. We have twenty minutes.", vi: "Cậu bé phải được bác sĩ khám trước. Ta có hai mươi phút. Dùng cho khéo." },
      { hide: "*" },
      { map: {
        goal: { en: "Twenty minutes. Where do you go?", vi: "Hai mươi phút. Bạn đi đâu?" },
        places: [
          { x: 24, y: 62, label: { en: "Police car", vi: "Xe cảnh sát" }, desc: { en: "Ride with the witness.", vi: "Đi cùng nhân chứng." }, set: { detour: "car" }, go: "d_car" },
          { x: 52, y: 34, label: { en: "Stay on the pier", vi: "Ở lại cầu tàu" }, desc: { en: "Keep watching the scene.", vi: "Tiếp tục quan sát hiện trường." }, set: { detour: "stay" }, go: "d_stay" },
          { x: 78, y: 66, label: { en: "The Anchor", vi: "Quán The Anchor" }, desc: { en: "The pub where they argued.", vi: "Quán rượu nơi họ cãi nhau." }, set: { detour: "pub" }, go: "d_pub" },
        ],
      } },
    ],
    d_car: [
      { bg: "car" },
      { n: { en: "The back seat smells of wet wool. Rain taps on the roof. The policeman in front turns up the radio.", vi: "Ghế sau nồng mùi len ướt. Mưa gõ lên nóc xe. Anh cảnh sát ngồi trước vặn to đài." } },
      { show: "bao", at: "c", face: "scared" },
      { say: "bao", face: "scared", vi: "{Ac}… {ac} là người Việt thật hả?", en: "Are you… really from home?" },
      { choice: [
        { en: "(Answer in your language.) Yes. I'm here to help you.", vi: "Ừ. {Ac} đến để giúp em.", add: { bao: 1 }, silent: true, then: [
          { say: "me", lang: "@N", en: "Yes. I'm here to help you.", vi: "Ừ. {Ac} đến để giúp em." },
          { say: "bao", vi: "Ở đây không ai nói tiếng mình hết. Ba tháng rồi em không nói chuyện với ai…", en: "Nobody here speaks our language. I haven't really talked to anyone in three months…" } ] },
        { en: "(Answer in your language.) Yes. But I work for the police.", vi: "Ừ. Nhưng {ac} làm cho cảnh sát.", add: { ruth: 1 }, silent: true, then: [
          { say: "me", lang: "@N", en: "Yes. But I work for the police.", vi: "Ừ. Nhưng {ac} làm cho cảnh sát." },
          { say: "bao", face: "sad", vi: "…Dạ. Em hiểu.", en: "…Okay. I understand." } ] },
      ] },
      { n: { en: "He rubs his wrist. A faded paper [[wristband]], the kind from a hospital or a festival: 'BẢO · 14·02'.", vi: "Cậu xoa cổ tay. Một vòng giấy đã phai, kiểu của bệnh viện hay lễ hội: “BẢO · 14·02”." } },
      { think: { en: "Fourteenth of February. His birthday, maybe. Seventeen years old, on Valentine's Day, in a police car.", vi: "Mười bốn tháng Hai. Có lẽ là sinh nhật cậu. Mười bảy tuổi, đúng ngày Lễ tình nhân, ngồi trên xe cảnh sát." } },
      { set: { saw_band: 1 } },
      { go: "interview" },
    ],
    d_stay: [
      { bg: "pier" },
      { n: { en: "You step back into the shadow of a container and drink your terrible coffee.", vi: "Bạn lùi vào bóng một chiếc container, uống cốc cà phê dở tệ." } },
      { n: { en: "Ruth drives off with the doctor. Two uniformed officers smoke by the van. Owen is alone at the lamp post.", vi: "Ruth lái xe đi cùng bác sĩ. Hai cảnh sát đứng hút thuốc cạnh xe. Owen một mình bên cột đèn." } },
      { show: "owen", at: "c", face: "cold" },
      { n: { en: "He looks left. Right. Then he reaches up and turns the CCTV camera back down towards the pier.", vi: "Anh ta nhìn trái. Nhìn phải. Rồi với tay lên, xoay camera giám sát chĩa xuống cầu tàu lại." } },
      { think: { en: "'The wind does that.'", vi: "“Gió đấy.”" } },
      { set: { saw_owen_cam: 1 } },
      { n: { en: "Then he sees you. The smile comes back so fast it's almost a magic trick.", vi: "Rồi anh ta thấy bạn. Nụ cười quay lại nhanh như làm ảo thuật." } },
      { say: "owen", face: "smile", en: "Fixing it for the morning shift. Nobody else will bother. Coffee okay?", easy: "I'm fixing the camera for the next shift. Is your coffee okay?", vi: "Chỉnh lại cho ca sáng. Chẳng ai buồn làm. Cà phê ổn chứ?" },
      { choice: [
        { en: "Fine. Thanks.", vi: "Ổn. Cảm ơn.", then: [{ think: { en: "Smile back. Remember everything.", vi: "Cười lại. Nhớ hết mọi thứ." } }] },
        { en: "Did the camera record anything tonight?", vi: "Đêm nay camera có quay được gì không?", add: { sus: 2 }, then: [
          { say: "owen", en: "Pointing at the sky? Clouds, maybe. Come on — the boy's ready.", vi: "Chĩa lên trời thì quay được mây thôi. Đi nào — cậu bé xong rồi." } ] },
      ] },
      { go: "interview" },
    ],
    d_pub: [
      { bg: "pub" },
      { n: { en: "The Anchor is closed, but a light is still on. A big man in his sixties is stacking chairs.", vi: "Quán The Anchor đã đóng cửa nhưng đèn còn sáng. Một ông lớn tuổi to con đang xếp ghế." } },
      { show: "jim", at: "c" },
      { say: "jim", en: "We're shut, [[love]]. Oh — you're with the police lot? Terrible business.", easy: "We're closed. Oh, you're with the police? Very bad news.", vi: "Đóng cửa rồi, cưng. Ồ — đi cùng mấy người cảnh sát à? Chuyện kinh khủng thật." },
      { choice: [
        { en: "Did Tomasz Wrona argue with Piotr here last night?", vi: "Tối qua Tomasz Wrona có cãi nhau với Piotr ở đây không?", then: [
          { say: "jim", en: "[[Aye]]. About money. Piotr was going home to Poland — flight from Newcastle this morning. Tomasz owed him wages. Shouted a bit, shook hands, done.", easy: "Yes. About money. Piotr was flying home to Poland this morning. Tomasz owed him money. They shouted, then shook hands.", vi: "Có. Chuyện tiền. Piotr sắp về Ba Lan — chuyến bay từ Newcastle sáng nay. Tomasz nợ lương anh ta. Quát nhau vài câu, bắt tay, xong." },
          { think: { en: "Piotr was flying home this morning. So why was his wallet under the pier?", vi: "Piotr bay về nước sáng nay. Vậy sao ví anh ta lại nằm dưới cầu tàu?" } },
          { set: { piotr_home: 1 } } ] },
      ], skipIfOne: false },
      { choice: [
        { if: s => s.f.heard_dd, en: "Did anyone shout 'dee dee'?", vi: "Có ai hét “dee dee” không?", then: [
          { say: "jim", en: "'Dee dee'? No. I heard [[nowt]] like that. They were speaking Polish and bad English. Who told you that?", easy: "No. I heard nothing like that. Who told you that?", vi: "“Dee dee”? Không. Tôi chẳng nghe thấy gì kiểu đó. Họ nói tiếng Ba Lan với tiếng Anh bồi. Ai bảo cậu thế?" },
          { think: { en: "Owen did. Owen, who wasn't here.", vi: "Owen. Owen — người không hề có mặt ở đây." } },
          { set: { jim_dd: 1 } } ] },
        { en: "Thank you. Good night.", vi: "Cảm ơn. Chúc ông ngủ ngon." },
      ], skipIfOne: true },
      { say: "jim", en: "Mind how you go. And love — that sergeant of yours drinks here for free. Make of that what you will.", easy: "Be careful. And your sergeant, Owen, never pays for his drinks here. Think about that.", vi: "Đi cẩn thận. À này — anh trung sĩ của cậu uống ở đây chẳng bao giờ trả tiền. Tự hiểu nhé." },
      { set: { jim_owen: 1 } },
      { go: "interview" },
    ],

    interview: [
      { bg: "interview" },
      { hide: "*" },
      { n: { en: "Port Halden Police Station. Interview Room 2. 4:30 a.m.", vi: "Đồn cảnh sát Port Halden. Phòng thẩm vấn số 2. 4 giờ 30 sáng." } },
      { show: "bao", at: "c", face: "scared" },
      { n: { en: "The boy is wrapped in a grey blanket. Wet hair. His hands shake around a paper cup.", vi: "Cậu bé quấn trong tấm chăn xám. Tóc ướt. Hai tay run rẩy ôm cốc giấy." } },
      { n: { en: "He looks up at you — the only face in the room that looks like home.", vi: "Cậu ngước lên nhìn bạn — gương mặt duy nhất trong phòng giống người nhà." } },
      { show: "ruth", at: "l" }, { show: "owen", at: "r" },
      { item: "notes", quiet: true },
      { cp: "c1_interview" },
      { say: "ruth", en: "Tell him he's not in trouble. We only want to know what he saw.", easy: "Tell him: he is not in trouble. We want to know what he saw.", vi: "Nói với cậu ấy là cậu không gặp rắc rối gì. Chúng tôi chỉ muốn biết cậu đã thấy gì." },
      { interpret: { dir: "e2v", to: "bao", opts: [
        { t: { vi: "Em không gặp rắc rối gì đâu. Họ chỉ muốn biết em đã thấy gì." }, acc: 2 },
        { t: { vi: "Em đừng sợ, {ac} cũng là người Việt. {Ac} sẽ bảo vệ em." }, acc: 0, add: { bao: 2, ruth: -1 }, then: [
          { say: "ruth", face: "cold", en: "That was a long translation for two short sentences.", vi: "Hai câu ngắn mà dịch dài ghê." },
          { think: { en: "An interpreter speaks for other people. Never for themselves.", vi: "Phiên dịch viên nói thay người khác. Không bao giờ nói thay chính mình." } } ] },
        { t: { vi: "Em gặp rắc rối rồi đấy. Nói hết những gì em thấy đi." }, acc: 0, add: { bao: -1 }, then: [
          { n: { en: "Bảo flinches and pulls the blanket tighter.", vi: "Bảo giật mình, kéo chăn chặt hơn." } } ] },
      ], why: { vi: "“You're not in trouble” = em KHÔNG gặp rắc rối. Phiên dịch dịch đủ ý, không thêm lời hứa của mình.", en: "Translate the whole meaning. Don't add your own promises." } } },
      { say: "bao", face: "scared", vi: "Em… em không thấy gì hết.", en: "I… I didn't see anything." },
      { interpret: { dir: "v2e", opts: [
        { t: "I… I didn't see anything.", acc: 2 },
        { t: "He says he didn't see anything.", acc: 1, then: [
          { say: "ruth", en: "Use 'I', not 'he'. Speak as him. As if you are him.", easy: "Say 'I', not 'he'. Speak like you are him.", vi: "Dùng “I”, đừng dùng “he”. Nói như thể bạn là cậu ấy." } ] },
        { t: "I didn't saw anything.", acc: 0 },
      ], why: { vi: "Phiên dịch nói ở NGÔI THỨ NHẤT (I). Sau didn't dùng động từ nguyên mẫu: didn't see (không phải didn't saw).", en: "Interpreters speak in the first person (I). After 'didn't', use the base verb: didn't see." } } },
      { say: "owen", face: "angry", en: "Oh, [[come off it]]. He was running from the pier at two in the morning. Ask him what he was doing there.", easy: "Don't lie. He was running from the pier at 2 a.m. Ask him why he was there.", vi: "Thôi đi. Nó chạy khỏi cầu tàu lúc hai giờ sáng. Hỏi xem nó làm gì ở đó." },
      { interpret: { dir: "e2v", to: "bao", opts: [
        { t: { vi: "Thôi đừng bịa nữa. Em chạy khỏi cầu tàu lúc hai giờ sáng. Em làm gì ở đó?" }, acc: 2 },
        { t: { vi: "Anh cảnh sát hỏi lúc hai giờ sáng em làm gì ở cầu tàu." }, acc: 1 },
        { t: { vi: "Anh ấy hỏi em có lạnh không." }, acc: 0, add: { ruth: -1 }, then: [
          { say: "bao", vi: "Dạ… có ạ.", en: "Um… yes." },
          { say: "owen", face: "angry", en: "That is NOT what I asked.", vi: "Tôi KHÔNG hỏi thế." } ] },
      ], why: { vi: "“Come off it” = thôi đi / đừng có bịa — thái độ không tin. Làm mềm câu (bỏ thái độ) cũng là đổi lời người nói.", en: "'Come off it' shows he doesn't believe the boy. Softening it changes the speaker's words." } } },
      { say: "bao", vi: "Em đi câu cá. Đêm nào em cũng ra đó câu.", en: "I was fishing. I go there to fish every night." },
      { interpret: { dir: "v2e", opts: [
        { t: "I was fishing. I go fishing there every night.", acc: 2 },
        { t: "I went fishing. I am going fishing there every night.", acc: 0 },
        { t: "He was fishing. Every night.", acc: 0 },
      ], why: { vi: "Việc lặp lại (every night) dùng hiện tại đơn: I go. Đang làm lúc đó: I was fishing.", en: "Habits (every night) use the present simple: I go. An action in progress then: I was fishing." } } },
      { say: "ruth", en: "Then where is his fishing rod?", vi: "Thế cần câu của cậu ấy đâu?" },
      { interpret: { dir: "e2v", to: "bao", opts: [
        { t: { vi: "Vậy cần câu của em đâu?" }, acc: 2 },
        { t: { vi: "Em câu được con cá nào không?" }, acc: 0 },
      ], why: { vi: "fishing rod = cần câu.", en: "A fishing rod is the stick you fish with." } } },
      { n: { en: "Bảo opens his mouth. Closes it. Then he starts to cry — very quietly, like someone who has learned not to make noise.", vi: "Bảo mở miệng. Rồi ngậm lại. Rồi cậu khóc — rất khẽ, như người đã quen không được gây tiếng động." } },
      { cp: "c1_push" },
      { say: "bao", face: "sad", vi: "Em thấy hai người cãi nhau trên cầu tàu. Một người to con, mặc áo vàng. Ông ấy đẩy anh kia ra… rồi em sợ quá, em chạy.", en: "I saw two people arguing on the pier. One was big, in a yellow jacket. He pushed the other one away… then I got scared and ran." },
      { interpret: { dir: "v2e", key: true, prompt: { en: "This sentence matters. Choose carefully.", vi: "Câu này quan trọng. Chọn thật kỹ." }, opts: [
        { t: "I saw two men arguing on the pier. A big man in a yellow jacket. He pushed the other man away… then I got scared, and I ran.", acc: 2, set: { push: "away" } },
        { t: "I saw two men arguing on the pier. A big man in a yellow jacket. He pushed the other man off… then I ran.", acc: 1, set: { push: "off" } },
        { t: "I saw two men fighting on the pier. A big man in a yellow jacket. He pushed the other man into the water… then I ran.", acc: 0, set: { push: "in" } },
      ], why: { vi: "“cãi nhau” = argue (to tiếng), không phải fight (đánh nhau). “đẩy ra” = push away. “push off” dễ hiểu thành đẩy khỏi cầu tàu; “into the water” là chi tiết nhân chứng KHÔNG nói.", en: "'Argue' is with words, 'fight' is with hands. He said 'pushed away'. 'Off' sounds like off the pier; 'into the water' is something he never said." } } },
      { if: s => s.f.push === "in", then: [{ say: "owen", face: "smile", en: "Into the water. There it is.", vi: "Xuống nước. Đấy, rõ rồi." }] },
      { if: s => s.f.push === "off", then: [{ say: "owen", en: "Off the pier? So — into the sea.", vi: "Khỏi cầu tàu? Vậy là — xuống biển." }] },
      { if: s => s.f.push === "away", then: [{ say: "owen", en: "Away? Away where? Into the water?", vi: "Ra? Ra đâu? Xuống nước à?" }] },
      { say: "owen", en: "A big man in a yellow [[oilskin]]. That's Wrona. He wears it every single day.", easy: "A big man in a yellow fisherman's coat. That's Wrona. He wears it every day.", vi: "Người to con mặc áo vải dầu vàng. Wrona đấy. Ngày nào hắn cũng mặc." },
      { say: "ruth", en: "Half the men in this harbour wear yellow oilskins, Owen.", vi: "Nửa đàn ông ở bến này mặc áo vải dầu vàng, Owen." },
      { if: s => s.f.saw_hook, then: [{ think: { en: "And one of them is missing from the hook on the Marta.", vi: "Và một chiếc đã biến khỏi móc treo trên tàu Marta." } }] },
      { say: "owen", face: "angry", en: "Then ask him. Did the man in yellow push the victim into the water? Yes or no.", easy: "Ask him: did the man in yellow push him into the water? Yes or no?", vi: "Thế thì hỏi nó. Người áo vàng có đẩy nạn nhân xuống nước không? Có hay không." },
      { choice: [
        { en: "(Translate the question exactly.)", vi: "(Dịch đúng câu hỏi.)", then: [
          { n: { en: "You translate it word for word. Bảo's eyes move from you, to Owen, to the door.", vi: "Bạn dịch từng chữ. Mắt Bảo đảo từ bạn, sang Owen, rồi ra cửa." } },
          { say: "bao", face: "scared", vi: "Em… em không biết. Trời tối lắm. Em chỉ thấy ông ấy đẩy… rồi có tiếng ùm dưới nước.", en: "I… I don't know. It was really dark. I only saw him push… then there was a splash in the water." },
          { interpret: { dir: "v2e", opts: [
            { t: "I… I don't know. It was very dark. I only saw him push… then I heard a splash.", acc: 2 },
            { t: "Yes. He pushed him into the water. I heard the splash.", acc: 0, set: { push: "in" } },
          ], why: { vi: "Nhân chứng nói “em không biết”. Câu hỏi có / không không biến câu trả lời thành “có”.", en: "He said 'I don't know'. A yes/no question doesn't turn that into 'yes'." } } } ] },
        { en: "That's a [[leading question]]. I can't ask it like that.", vi: "Đó là câu hỏi dẫn dắt. Tôi không thể hỏi như vậy.", add: { ruth: 2, sus: 1 }, set: { objected: 1 }, then: [
          { say: "owen", face: "angry", en: "Excuse me? Who made you the lawyer?", vi: "Gì cơ? Ai cho bạn làm luật sư vậy?" },
          { say: "ruth", en: "{name} is right. Ask him what happened next, Owen. Not what you want to hear.", easy: "{name} is right. Ask what happened next. Don't tell him the answer.", vi: "{name} nói đúng. Hỏi xem chuyện gì xảy ra tiếp, Owen. Đừng hỏi điều anh muốn nghe." },
          { say: "owen", en: "…Fine. What happened next?", vi: "…Được. Rồi sao nữa?" },
          { say: "bao", vi: "Em không biết… trời tối lắm. Em chỉ nghe tiếng ùm dưới nước, rồi có người hét. Rồi em chạy.", en: "I don't know… it was very dark. I only heard a splash, then someone shouted. Then I ran." },
          { interpret: { dir: "v2e", opts: [
            { t: "I don't know… it was very dark. I only heard a splash, then someone shouted. Then I ran.", acc: 2, set: { heard_shout: 1 } },
            { t: "He pushed him in, and someone shouted, and I ran.", acc: 0, set: { push: "in" } },
          ], why: { vi: "Giữ đúng “em không biết” và “chỉ nghe” — đó là tất cả điều nhân chứng chắc chắn.", en: "Keep 'I don't know' and 'only heard' — that is all the witness is sure of." } } } ] },
      ] },
      { n: { en: "Owen sighs. Ruth looks at you. 'Anything you want to show him?'", vi: "Owen thở dài. Ruth nhìn bạn. “Có gì muốn cho cậu ấy xem không?”" } },
      { choice: [
        { item: "sandal", once: true, en: "(Show him the green sandal.)", vi: "(Cho cậu xem chiếc dép xanh.)", then: [
          { n: { en: "You put the evidence bag on the table. Bảo stops breathing.", vi: "Bạn đặt túi tang vật lên bàn. Bảo nín thở." } },
          { say: "bao", face: "shock", vi: "Đó là… dép của anh Đức…", en: "That's… Đức's sandal…" },
          { set: { saw_duc: 1 } }, { truth: "T2" },
          { interpret: { dir: "v2e", opts: [
            { t: "That's… Đức's sandal…", acc: 2, then: [
              { say: "ruth", en: "Who is Đức?", vi: "Đức là ai?" },
              { n: { en: "Bảo shakes his head and stares at the table. He won't say another word about it.", vi: "Bảo lắc đầu, nhìn chằm chằm xuống bàn. Cậu không nói thêm chữ nào về chuyện đó." } },
              { set: { ruth_duc: 1 } } ] },
            { t: "(Say nothing. Pretend he said nothing important.)", acc: 0, add: { lie: 1, bao: 1 }, then: [
              { say: "ruth", en: "What did he say?", vi: "Cậu ấy nói gì?" },
              { say: "me", en: "Just… that he's tired.", vi: "Chỉ… là cậu ấy mệt." },
              { think: { en: "Your first lie as an interpreter. It was easier than you thought.", vi: "Lời nói dối đầu tiên của bạn khi làm phiên dịch. Dễ hơn bạn tưởng." } } ] },
          ], why: { vi: "Phiên dịch phải dịch mọi lời nói trong phòng — kể cả điều bất lợi.", en: "An interpreter must translate everything said in the room." } } } ] },
        { item: "minh_photo", once: true, en: "(Show him the photo of Minh.)", vi: "(Cho cậu xem ảnh của Minh.)", then: [
          { n: { en: "You slide the photo across the table. Bảo looks at it — and goes white.", vi: "Bạn đẩy tấm ảnh qua bàn. Bảo nhìn — rồi mặt cắt không còn giọt máu." } },
          { say: "bao", face: "scared", vi: "Em… em không biết người này.", en: "I… I don't know this person." },
          { think: { en: "His hands are shaking harder than before. He's lying.", vi: "Tay cậu run mạnh hơn lúc nãy. Cậu đang nói dối." } },
          { say: "ruth", face: "cold", en: "Who's that in the photo?", vi: "Người trong ảnh là ai?" },
          { choice: [
            { en: "My cousin, Minh. He's been missing for four months.", vi: "Em họ tôi, Minh. Mất liên lạc bốn tháng rồi.", add: { ruth: 1, sus: 1 }, set: { told_minh: 1 }, then: [
              { say: "ruth", en: "You should have told me that before you walked in here.", vi: "Lẽ ra bạn phải nói chuyện đó trước khi bước vào đây." },
              { say: "owen", face: "cold", en: "Missing, eh? Port Halden's a small town. Maybe I can ask around.", vi: "Mất tích à? Port Halden nhỏ lắm. Để tôi hỏi thử xem." },
              { think: { en: "He said it kindly. So why did it sound like a threat?", vi: "Anh ta nói rất tử tế. Vậy sao nghe như lời đe doạ?" } } ] },
            { en: "Nobody. Just a friend from home.", vi: "Không ai cả. Một người bạn ở quê thôi.", add: { lie: 1 } },
          ] } ] },
        { en: "No more questions.", vi: "Không hỏi gì thêm." },
      ], loop: true },
      { cp: "c1_whisper" },
      { n: { en: "Owen's phone buzzes. He turns away to answer it. Ruth is writing something down.", vi: "Điện thoại Owen rung. Anh ta quay đi nghe máy. Ruth đang cúi viết." } },
      { n: { en: "Bảo leans towards you. His voice is barely a breath.", vi: "Bảo nghiêng người về phía bạn. Giọng cậu chỉ như hơi thở." } },
      { say: "bao", face: "scared", whisper: true, vi: "{Ac} ơi… đừng nói với họ là em ở Gull Point. Họ mà biết… họ giết em mất.", en: "Please… don't tell them I live at Gull Point. If they find out… they'll kill me." },
      { truth: "T3" },
      { think: { en: "An interpreter must translate everything said in the room. Everything.", vi: "Phiên dịch viên phải dịch mọi lời được nói trong phòng. Mọi lời." } },
      { say: "ruth", en: "What did he just say?", vi: "Cậu ấy vừa nói gì?" },
      { choice: [
        { en: "He said: 'Don't tell them I live at Gull Point. If they find out, they'll kill me.'", vi: "Cậu ấy nói: “Đừng nói với họ em ở Gull Point. Họ mà biết thì họ giết em.”", add: { bao: -3, ruth: 1, acc: 2, accN: 2 }, set: { gp: "told" }, then: [
          { n: { en: "Owen's hand freezes on his phone.", vi: "Tay Owen khựng lại trên điện thoại." } },
          { show: "bao", at: "c", face: "shock" },
          { n: { en: "Bảo looks at you as if you had pushed him into the sea yourself.", vi: "Bảo nhìn bạn như thể chính bạn vừa đẩy cậu xuống biển." } } ] },
        { en: "He's asking for some water.", vi: "Cậu ấy xin cốc nước.", add: { lie: 1, bao: 2, accN: 2 }, set: { gp: "lie" }, then: [
          { say: "ruth", en: "Owen. Get the lad some water.", vi: "Owen. Lấy cho cậu bé cốc nước." },
          { think: { en: "Bảo's eyes say thank you. Ruth's pen keeps moving. Did she believe you?", vi: "Mắt Bảo nói lời cảm ơn. Bút của Ruth vẫn chạy. Bà ấy có tin bạn không?" } } ] },
        { need: s => s.f.ruth >= 2, lockHint: { en: "Ruth doesn't trust you enough yet.", vi: "Ruth chưa đủ tin bạn." },
          en: "He wants a private word with me. Can we take a short break?", vi: "Cậu ấy muốn nói riêng với tôi. Ta nghỉ một lát được không?", add: { ruth: 1, bao: 1, acc: 1, accN: 2 }, set: { gp: "private", ally: 1 }, then: [
          { say: "ruth", en: "…Ten minutes. Owen — out.", vi: "…Mười phút. Owen — ra ngoài." },
          { hide: "owen" },
          { n: { en: "In the corridor, away from Owen, you tell Ruth everything Bảo said.", vi: "Ngoài hành lang, xa Owen, bạn kể lại với Ruth mọi điều Bảo nói." } },
          { say: "ruth", en: "Gull Point. The old cannery. Nobody's lived out there for twenty years.", easy: "Gull Point is an old fish factory. Nobody lives there now.", vi: "Gull Point. Xưởng đồ hộp cũ. Hai mươi năm nay chẳng ai sống ở đó." },
          { say: "ruth", face: "cold", en: "Keep this between us. Not a word to Owen. Not yet.", vi: "Chuyện này chỉ ta biết. Không nói với Owen. Chưa phải lúc." },
          { think: { en: "Not a word to Owen. So Ruth has her doubts too.", vi: "Không nói với Owen. Vậy là Ruth cũng có nghi ngờ." } } ] },
      ], timer: 12, timeout: [
        { think: { en: "You hesitate. Too long.", vi: "Bạn ngập ngừng. Quá lâu." } },
        { say: "me", en: "…Nothing. He's just scared.", vi: "…Không có gì. Cậu ấy chỉ sợ thôi." },
        { add: { lie: 1, accN: 2 } }, { set: { gp: "lie" } } ] },
      { go: "report" },
    ],

    report: [
      { cp: "c1_report" },
      { bg: "corridor" },
      { hide: "*" },
      { n: { en: "5:50 a.m. The corridor smells of bleach and old coffee.", vi: "5 giờ 50 sáng. Hành lang nồng mùi thuốc tẩy và cà phê nguội." } },
      { show: "owen", at: "c", face: "smile" },
      { say: "owen", face: "smile", en: "Here's the [[statement]]. You sign as the interpreter — it's just a [[formality]].", easy: "Here is what the boy said. Please sign it. It's a normal thing to do.", vi: "Lời khai đây. Bạn ký với tư cách phiên dịch — thủ tục thôi." },
      { present: {
        title: { en: "WITNESS STATEMENT — 'Bảo', approx. 17", vi: "BIÊN BẢN LỜI KHAI — “Bảo”, khoảng 17 tuổi" },
        goal: { en: "Read carefully. Tap a line that is wrong, then show your evidence. Sign when you're done.", vi: "Đọc kỹ. Chạm vào dòng SAI, rồi đưa bằng chứng. Xong thì ký." },
        segs: [
          { t: "The witness was fishing at the north pier at approximately 2 a.m." },
          { t: "He saw two men arguing on the pier." },
          { t: "The man in the yellow jacket pushed the victim into the water.", fix: "The man in the yellow jacket pushed the other man {pushWord}.", bad: s => s.f.push !== "in", evidence: "notes",
            ok: [
              { say: "me", en: "He never said 'into the water'. My notes say: 'He pushed the other man {pushWord}.'", vi: "Cậu ấy chưa bao giờ nói “xuống nước”. Sổ của tôi ghi: “Ông ấy đẩy anh kia ra.”" },
              { say: "owen", face: "cold", en: "Same thing, isn't it?", vi: "Thì cũng thế cả thôi?" },
              { say: "me", en: "No. One is a fact. The other is a guess.", vi: "Không. Một bên là sự thật. Bên kia là phỏng đoán." },
              { say: "owen", en: "…Fine. I'll change it.", vi: "…Được. Tôi sửa." },
              { set: { fixed_push: 1 } }, { add: { sus: 1 } } ],
            same: [
              { think: { en: "My notes say exactly that. Because that's how I translated it.", vi: "Sổ của mình ghi đúng như vậy. Vì mình đã dịch như vậy." } },
              { think: { en: "Did Bảo really say 'into the water'?", vi: "Bảo có thật sự nói “xuống nước” không?" } } ] },
          { t: "The witness identified the man as Tomasz Wrona.", fix: "The witness did not identify the man.", bad: () => true, evidence: "notes",
            ok: [
              { say: "me", en: "He never said a name. Not once. It's not in my notes.", vi: "Cậu ấy chưa từng nói tên ai. Không một lần. Sổ của tôi không có." },
              { say: "owen", face: "cold", en: "Everyone knows it's Wrona.", vi: "Ai chẳng biết là Wrona." },
              { say: "me", en: "Then everyone can sign it. I won't.", vi: "Vậy để ai cũng biết ký. Tôi thì không." },
              { say: "owen", en: "…Just a typo. Relax.", vi: "…Gõ nhầm thôi. Bình tĩnh." },
              { set: { fixed_name: 1 } }, { add: { sus: 1 } } ] },
        ],
        sign: { en: "Sign the statement", vi: "Ký biên bản" },
        wrong: [{ say: "owen", face: "smile", en: "Something wrong with that line? Looks fine to me.", vi: "Dòng đó có gì sai à? Tôi thấy ổn mà." }],
        noEvidence: [{ think: { en: "That's not proof. I need something in writing.", vi: "Cái đó không chứng minh được. Mình cần thứ gì ghi lại rõ ràng." } }],
      } },
      { if: s => !s.f.fixed_name || (s.f.push !== "in" && !s.f.fixed_push), then: [
        { think: { en: "You signed it. Your name is now under words Bảo never said.", vi: "Bạn đã ký. Tên bạn giờ nằm dưới những chữ Bảo chưa từng nói." } },
        { set: { signed_bad: 1 } } ] },
      { hide: "owen" },
      { show: "ruth", at: "c" },
      { say: "ruth", en: "{name}. The boy's phone keeps buzzing. It's locked. Any ideas?", easy: "This is the boy's phone. It's locked. Can you open it?", vi: "{name}. Điện thoại của cậu bé cứ rung mãi. Nó bị khoá. Có cách nào không?" },
      { if: s => s.f.saw_band, then: [{ think: { en: "His wristband: 'BẢO · 14·02'.", vi: "Vòng tay cậu: “BẢO · 14·02”." } }] },
      { lock: {
        prompt: { en: "Bảo's phone. Enter the 4-digit PIN.", vi: "Điện thoại của Bảo. Nhập mã PIN 4 số." },
        kind: "digits", answer: "1402",
        hints: [
          { en: "Teenagers often use their birthday: day and month.", vi: "Tuổi teen hay đặt mã là ngày sinh: ngày và tháng." },
          { en: "In the car, Bảo was wearing a wristband with a date on it.", vi: "Trên xe, Bảo đeo vòng tay có ghi một ngày." },
          { en: "Valentine's Day. 14 / 02.", vi: "Ngày Lễ tình nhân. 14 / 02." },
        ],
        ok: [{ set: { vm_open: 1 } }],
        giveUp: [{ say: "ruth", en: "Leave it. Tech can open it in the morning.", vi: "Thôi. Sáng mai bên kỹ thuật mở được." }],
      } },
      { if: s => s.f.vm_open, then: [
        { say: "ruth", en: "You're in. There's a voice message — in English. Tell me what it says.", vi: "Mở được rồi. Có tin nhắn thoại — bằng tiếng Anh. Nói tôi biết nội dung." },
        { listen: {
          who: "caller", audio: "It's me. Don't go back to Gull Point tonight. They know. The van comes Thursday, four a.m. Same place. Delete this message.",
          tr: { vi: "Là anh đây. Tối nay đừng về Gull Point. Chúng nó biết rồi. Xe tải đến thứ Năm, 4 giờ sáng. Chỗ cũ. Xoá tin nhắn này đi." },
          qs: [
            { q: { en: "When does the van come?", vi: "Xe tải đến khi nào?" }, opts: ["Thursday, 4 a.m.", "Tuesday, 4 p.m.", "Thursday, 4 p.m."], a: 0, set: { van: 1 } },
            { q: { en: "Where should the boy NOT go tonight?", vi: "Tối nay cậu bé KHÔNG được đến đâu?" }, opts: ["The pier", "Gull Point", "The police station"], a: 1, set: { gp_heard: 1 } },
          ],
        } },
        { item: "voicemail" },
        { think: { en: "The caller had an accent. Not English. Not from home either.", vi: "Người gọi có giọng lơ lớ. Không phải người Anh. Cũng không phải người Việt." } },
        { choice: [
          { silent: true, en: "Tell Ruth everything.", vi: "Kể hết với Ruth.", add: { ruth: 1, bao: -1 }, set: { ruth_van: 1 }, then: [
            { say: "ruth", en: "Thursday, four a.m. A van. Good. Nobody else hears about this.", vi: "Thứ Năm, 4 giờ sáng. Một chiếc xe tải. Tốt. Không ai khác được biết chuyện này." } ] },
          { silent: true, if: s => s.f.gp !== "told" && s.f.gp !== "private", en: "Tell her about the van — but not about Gull Point.", vi: "Kể về chiếc xe tải — nhưng giấu Gull Point.", add: { bao: 1 }, set: { ruth_van: 1 }, then: [
            { say: "ruth", face: "cold", en: "A van. Where from? Where to?", vi: "Một chiếc xe tải. Từ đâu? Đi đâu?" },
            { say: "me", en: "It doesn't say.", vi: "Tin nhắn không nói." },
            { think: { en: "Half a truth. Is that still a lie?", vi: "Một nửa sự thật. Thế có còn là nói dối không?" } } ] },
          { en: "It's just a friend saying good night.", vi: "Chỉ là bạn cậu ấy chúc ngủ ngon.", add: { lie: 1, ruth: -1 } },
        ] } ] },
      { go: "dawn" },
    ],

    dawn: [
      { bg: "dawn" },
      { hide: "*" },
      { n: { en: "6:40 a.m. The fog is lifting. The sea turns from black to grey.", vi: "6 giờ 40 sáng. Sương đang tan. Mặt biển chuyển từ đen sang xám." } },
      { if: s => s.f.push === "in" || !s.f.fixed_push || !s.f.fixed_name, then: [
        { set: { outcome: "arrest" } },
        { n: { en: "At 6:10 a.m., Tomasz Wrona was arrested on board the Marta. He did not resist. He did not say a word.", vi: "6 giờ 10, Tomasz Wrona bị bắt ngay trên tàu Marta. Ông không chống cự. Không nói một lời." } } ],
        else: [
        { set: { outcome: "doubt" } },
        { n: { en: "Ruth decides there isn't enough evidence to charge Tomasz Wrona. He is brought in for questioning — nothing more.", vi: "Ruth quyết định chưa đủ bằng chứng để buộc tội Wrona. Ông chỉ bị gọi lên hỏi — không hơn." } } ] },
      { show: "ruth", at: "c" },
      { say: "ruth", en: "Help me with the timeline for my report. Put tonight in order.", easy: "Help me with my report. Put the events of tonight in order.", vi: "Giúp tôi dựng dòng thời gian cho báo cáo. Xếp lại các việc đêm nay theo thứ tự." },
      { order: {
        prompt: { en: "Tap two events to swap them. First event at the top.", vi: "Chạm 2 sự việc để đổi chỗ. Việc xảy ra trước ở trên cùng." },
        items: [
          { t: "The victim's watch stopped." },
          { t: "Police caught a boy running from the pier." },
          { t: "A fisherman found the body under the pier." },
          { t: "Ruth phoned the interpreter." },
          { t: "The interview began." },
        ],
        tries: 3,
        ok: [{ add: { ruth: 1 } }, { say: "ruth", en: "1:47, around two, 2:40, 3:12, 4:30. Clean. Thank you.", vi: "1 giờ 47, khoảng 2 giờ, 2 giờ 40, 3 giờ 12, 4 giờ 30. Gọn gàng. Cảm ơn." }],
        fail: [{ say: "ruth", en: "Close enough. I'll fix it. Long night.", vi: "Tạm được. Để tôi sửa. Đêm dài quá mà." }],
      } },
      { quiz: { qs: [
        { q: { en: "What time did the victim's watch stop?", vi: "Đồng hồ của nạn nhân dừng lúc mấy giờ?" }, opts: ["1:47", "2:40", "4:30"], a: 0, add: { ruth: 1 } },
        { q: { en: "What colour was the big man's jacket?", vi: "Áo khoác của người to con màu gì?" }, opts: ["Blue", "Green", "Yellow"], a: 2 },
      ] } },
      { if: s => s.acc() >= 0.8, then: [
        { say: "ruth", en: "Every word, exactly as he said it. That's rare. Most interpreters try to help — and 'help' is how innocent men end up in prison.", easy: "You translated his exact words. That's rare. When interpreters 'help', innocent people can go to prison.", vi: "Từng chữ, đúng như cậu ấy nói. Hiếm lắm đấy. Phần lớn phiên dịch đều muốn “giúp” — và chính sự “giúp” ấy đưa người vô tội vào tù." } ],
        else: [
        { say: "ruth", face: "cold", en: "Next time, give me his words. Not yours. Not Owen's. His.", vi: "Lần sau, đưa tôi lời của cậu ấy. Không phải lời bạn. Không phải lời Owen. Lời của cậu ấy." } ] },
      { say: "ruth", en: "My husband was a fisherman. The sea gives things back, eventually. Just never in the shape you want.", easy: "My husband was a fisherman. The sea always gives things back. But not in the way you hope.", vi: "Chồng tôi là ngư dân. Biển rồi sẽ trả lại mọi thứ. Chỉ là không bao giờ trả theo hình dạng mình mong." },
      { review: true },
      { hide: "*" },
      { n: { en: "A social worker leads Bảo to a car. Halfway there, he stops — and looks back at you.", vi: "Một nhân viên xã hội dẫn Bảo ra xe. Đi được nửa đường, cậu dừng lại — và ngoái nhìn bạn." } },
      { show: "bao", at: "c", face: "sad" },
      { if: s => s.f.bao >= 1, then: [
        { say: "bao", whisper: true, vi: "{Ac} ơi… anh Minh bảo em chạy.", en: "…Minh told me to run." },
        { fx: "shake" },
        { think: { en: "Minh.", vi: "Minh." } },
        { think: { en: "My Minh?", vi: "Minh của mình?" } },
        { set: { end_minh: 1 } } ],
        else: [
        { n: { en: "He says nothing. But as he turns away, his phone lights up in his hand.", vi: "Cậu không nói gì. Nhưng lúc quay đi, điện thoại trong tay cậu sáng lên." } },
        { n: { en: "The lock screen: four young men on a fishing boat, smiling. The one on the left is Minh.", vi: "Màn hình khoá: bốn chàng trai trên một chiếc thuyền, đang cười. Người bên trái là Minh." } },
        { fx: "shake" },
        { think: { en: "Minh. Alive — or he was, when this was taken.", vi: "Minh. Còn sống — ít nhất là lúc chụp tấm ảnh này." } },
        { set: { end_photo: 1 } } ] },
      { truth: "T4" },
      { hide: "bao" },
      { n: { en: "The car door shuts. The car disappears into the last of the fog.", vi: "Cửa xe đóng lại. Chiếc xe khuất vào làn sương cuối cùng." } },
      { if: s => s.f.outcome === "arrest", then: [{ end: "c1_arrest" }], else: [{ end: "c1_doubt" }] },
    ],
  },

  endings: {
    c1_arrest: { ch: 1, title: { en: "Wrona Arrested", vi: "Wrona bị bắt" },
      sum: { en: "The captain is in a cell. The real killer sleeps fine.", vi: "Thuyền trưởng vào xà lim. Kẻ thật sự vẫn ngủ ngon." },
      text: { en: "A captain is in a cell. A boy is in a car. And somewhere in this town, the person who was really on the pier at 1:47 is sleeping just fine.", vi: "Một thuyền trưởng nằm trong xà lim. Một cậu bé ngồi trên xe. Và đâu đó trong thị trấn, kẻ thật sự có mặt trên cầu tàu lúc 1:47 vẫn đang ngủ ngon." } },
    c1_doubt: { ch: 1, title: { en: "Reasonable Doubt", vi: "Còn nghi vấn" },
      sum: { en: "No arrest. Your words kept the case open.", vi: "Không ai bị bắt. Lời dịch của bạn giữ vụ án còn mở." },
      text: { en: "No arrest. No answers. Just a sandal, a stopped watch — and a name you haven't heard out loud in four months.", vi: "Không ai bị bắt. Chưa có lời giải. Chỉ có một chiếc dép, một chiếc đồng hồ đã dừng — và một cái tên bốn tháng nay bạn chưa nghe ai gọi." } },
  },
  next: { en: "Chapter 2 — Fish and Lies", vi: "Chương 2 — Cá và lời dối" },
};
