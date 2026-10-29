// THE STATEMENT — CHƯƠNG 4 “The Benefactor” (Ngày 4). Trọng tâm tiếng: văn phong LỊCH SỰ, câu hỏi đuôi, modal, nói giảm nói tránh.
// Cơ chế: chọn trang phục (gallery) · trò chuyện ở tiệc (topics + thanh “ấn tượng”) · câu hỏi đuôi (fill) · LỜI ĐỀ NGHỊ (rẽ lớn, có giờ)
//   · lẻn vào phòng làm việc (sneak) · tìm sạc (explore) · két sắt chữ (lock) · bếp: Maggie (lòng tin) · cuộc gọi cuối chương.
StoryEngine.chapter({
  items: {
    invite: { icon: "doc", name: { en: "Gala invitation", vi: "Thiệp mời dạ tiệc" }, desc: { en: "'The Holt Foundation Winter Gala. Black tie.' Your name is handwritten on it.", vi: "“Dạ tiệc mùa đông của Quỹ Holt. Trang phục: lễ phục.” Tên bạn được viết tay." } },
    recorder: { icon: "phone", name: { en: "Recording", vi: "Bản ghi âm" }, desc: { en: "Your phone, recording. Holt's voice: '…write it carefully, and your brother comes home.'", vi: "Điện thoại của bạn, đang ghi âm. Giọng Holt: “…ghi cho cẩn thận, và em trai cậu sẽ về nhà.”" } },
    ledger: { icon: "doc", name: { en: "Holt's ledger", vi: "Sổ cái của Holt" }, desc: { en: "Dates, boats, boxes, payments. 'H.F. — £2,000/month' until October. Then: 'Trainee programme — £38,000.'", vi: "Ngày tháng, tàu, thùng hàng, các khoản trả. “H.F. — £2.000/tháng” tới tháng Mười. Rồi: “Chương trình tập sự — £38.000.”" } },
    gp_key: { icon: "key", name: { en: "Gull Point key", vi: "Chìa khoá Gull Point" }, desc: { en: "A heavy iron key on a rusty ring. Maggie's. It opens the cannery gate.", vi: "Chiếc chìa sắt nặng trên vòng gỉ. Của Maggie. Mở cổng xưởng đồ hộp." } },
  },
  truths: {
    T7: { name: { en: "The recruiter", vi: "Người tìm trẻ" }, text: { en: "Maggie finds runaway kids at bus and train stations, feeds them — then they 'pay back' the debt at Gull Point, packing Holt's boxes.", vi: "Maggie tìm những đứa trẻ bỏ nhà ở bến xe, nhà ga, cho chúng ăn — rồi chúng “trả nợ” ở Gull Point, đóng thùng hàng cho Holt." } },
    T10: { name: { en: "Your salary", vi: "Tiền lương của bạn" }, text: { en: "Holt paid Finch £2,000 a month. When Finch died, Holt paid for a 'trainee programme' — your job. He chose you to be the next pen.", vi: "Holt trả Finch £2.000 mỗi tháng. Finch chết, Holt chi tiền cho “chương trình tập sự” — chính là công việc của bạn. Ông ta chọn bạn làm ngòi bút tiếp theo." } },
  },
  words: {
    "black tie": { vi: "lễ phục (vest đen, nơ đen)", ex: "The invitation says black tie." },
    "benefactor": { vi: "ân nhân, nhà hảo tâm", ex: "Holt is the town's great benefactor." },
    "donation": { vi: "khoản quyên góp", ex: "A generous donation to the police." },
    "ledger": { vi: "sổ cái (sổ kế toán)", ex: "The ledger was in the safe." },
    "safe": { vi: "két sắt", ex: "The safe is behind the painting." },
    "persuade": { vi: "thuyết phục", ex: "He tried to persuade me." },
    "generous": { vi: "hào phóng", ex: "That's very generous of you." },
    "charger": { vi: "cục / dây sạc", ex: "I need a phone charger." },
  },

  recap: [
    { ch: 4, t: { en: "Day 4. The whole station was invited to Graham Holt's charity gala.", vi: "Ngày 4. Cả đồn được mời dự dạ tiệc từ thiện của Graham Holt." } },
    { ch: 4, if: s => s.f.c4_outfit === "suit", t: { en: "You wore black tie. Holt noticed.", vi: "Bạn mặc lễ phục. Holt để ý." } },
    { ch: 4, if: s => s.f.c4_outfit === "uniform", t: { en: "You came in uniform. Everyone remembered you were police.", vi: "Bạn mặc đồng phục. Ai cũng nhớ bạn là cảnh sát." } },
    { ch: 4, if: s => s.f.c4_outfit === "jeans", t: { en: "You came in jeans. Holt smiled as if you were a child.", vi: "Bạn mặc quần jean. Holt cười như nhìn một đứa trẻ." } },
    { ch: 4, if: s => s.f.holt === "yes", t: { en: "Holt made you an offer: write Kieran's new statement 'carefully', and Sam comes home. You said yes.", vi: "Holt đưa ra đề nghị: ghi lời khai mới của Kieran “cho cẩn thận”, Sam sẽ về nhà. Bạn đồng ý." } },
    { ch: 4, if: s => s.f.holt === "fake", t: { en: "Holt made you an offer. You pretended to say yes — and your phone was recording.", vi: "Holt đưa ra đề nghị. Bạn giả vờ đồng ý — và điện thoại của bạn đang ghi âm." } },
    { ch: 4, if: s => s.f.holt === "no", t: { en: "Holt made you an offer. You said no. He smiled and said, 'Pity.'", vi: "Holt đưa ra đề nghị. Bạn từ chối. Ông ta cười: “Tiếc thật.”" } },
    { ch: 4, if: s => s.f.tape_holt, t: { en: "You recorded Holt's offer.", vi: "Bạn đã ghi âm lời đề nghị của Holt." } },
    { ch: 4, if: s => s.truth("T10"), t: { en: "In Holt's safe: a ledger. He paid Finch every month — and now he pays for your job.", vi: "Trong két của Holt: một cuốn sổ cái. Ông ta trả tiền cho Finch hằng tháng — và giờ trả lương cho bạn." } },
    { ch: 4, if: s => s.f.c4_caught, t: { en: "Holt found you in his study.", vi: "Holt bắt gặp bạn trong phòng làm việc." } },
    { ch: 4, if: s => s.truth("T7"), t: { en: "In the kitchen, Maggie broke down. She finds the kids for Holt. She gave you the key to Gull Point.", vi: "Trong bếp, Maggie suy sụp. Bà tìm trẻ cho Holt. Bà đưa bạn chìa khoá Gull Point." } },
    { ch: 4, t: { en: "Near midnight, Ruth called: Kieran had vanished from the shelter.", vi: "Gần nửa đêm, Ruth gọi: Kieran đã biến mất khỏi nhà tạm trú." } },
  ],

  flow: [
    { ch: 4, row: 0, id: "c4_gala", kind: "cp", scene: "gala", label: { en: "Holt House", vi: "Dinh thự Holt" }, sum: { en: "Champagne and small talk.", vi: "Rượu sâm-panh và chuyện phiếm." } },
    { ch: 4, row: 1, kind: "opt", key: "c4_outfit", val: "suit", label: { en: "Black tie", vi: "Lễ phục" } },
    { ch: 4, row: 1, kind: "opt", key: "c4_outfit", val: "uniform", label: { en: "Uniform", vi: "Đồng phục" } },
    { ch: 4, row: 1, kind: "opt", key: "c4_outfit", val: "jeans", label: { en: "Jeans", vi: "Quần jean" } },
    { ch: 4, row: 2, id: "c4_offer", kind: "cp", scene: "study", label: { en: "The offer", vi: "Lời đề nghị" }, sum: { en: "Write it carefully.", vi: "Ghi cho cẩn thận." } },
    { ch: 4, row: 3, kind: "opt", key: "holt", val: "yes", label: { en: "Accept", vi: "Nhận lời" }, sum: { en: "You belong to Holt now.", vi: "Giờ bạn thuộc về Holt." } },
    { ch: 4, row: 3, kind: "opt", key: "holt", val: "fake", label: { en: "Pretend", vi: "Giả vờ" }, sum: { en: "Your phone was recording.", vi: "Điện thoại bạn đang ghi âm." }, hint: { en: "A phone at 3% can't record for long.", vi: "Điện thoại còn 3% pin không ghi được lâu." } },
    { ch: 4, row: 3, kind: "opt", key: "holt", val: "no", label: { en: "Refuse", vi: "Từ chối" }, sum: { en: "'Pity.'", vi: "“Tiếc thật.”" } },
    { ch: 4, row: 4, id: "c4_kitchen", kind: "cp", scene: "galakitchen", label: { en: "The kitchen", vi: "Gian bếp" }, sum: { en: "Maggie, alone.", vi: "Maggie, một mình." } },
    { ch: 4, row: 5, kind: "opt", key: "c4_maggie", val: "confess", label: { en: "Maggie confesses", vi: "Maggie thú nhận" }, sum: { en: "The key to Gull Point.", vi: "Chìa khoá Gull Point." }, hint: { en: "She has to trust you first.", vi: "Bà phải tin bạn trước đã." } },
    { ch: 4, row: 5, kind: "opt", key: "c4_maggie", val: "forced", label: { en: "Maggie gives in", vi: "Maggie chịu thua" }, sum: { en: "She gave you the key — and hates you for it.", vi: "Bà đưa chìa — và ghét bạn vì điều đó." } },
    { ch: 4, row: 5, kind: "opt", key: "c4_maggie", val: "cold", label: { en: "Maggie says nothing", vi: "Maggie im lặng" }, sum: { en: "No key.", vi: "Không có chìa." } },
    { ch: 4, row: 6, id: "c4_deal", kind: "end", label: { en: "The deal", vi: "Thoả thuận" } },
    { ch: 4, row: 6, id: "c4_wire", kind: "end", label: { en: "The wire", vi: "Dây ghi âm" } },
    { ch: 4, row: 6, id: "c4_refuse", kind: "end", label: { en: "Pity", vi: "Tiếc thật" } },
  ],

  nodes: {
    c4: [
      { title: { ch: 4, en: "The Benefactor", vi: "Ân nhân" } },
      { bg: "office" },
      { n: { en: "Day 4. A thick cream envelope is waiting on your desk. Your name is handwritten in gold ink.", vi: "Ngày 4. Một phong bì màu kem dày đợi sẵn trên bàn. Tên bạn được viết tay bằng mực vàng." } },
      { item: "invite" },
      { show: "owen", at: "c", face: "smile" },
      { say: "owen", face: "smile", en: "The Holt gala! You're in, trainee. The whole station goes. Free champagne, tiny food, and the man who pays for our cars.", vi: "Dạ tiệc nhà Holt! Có tên {cc} rồi đấy, tập sự. Cả đồn đi. Sâm-panh miễn phí, đồ ăn bé tí, và người đàn ông trả tiền xe cho tụi mình." },
      { say: "owen", en: "Be nice to him. Holt is very [[generous]] to people he likes.", vi: "Đối xử tử tế với ông ấy nhé. Holt rất hào phóng với người ông ấy quý." },
      { if: s => s.f.owen_knows || s.f.owen_sam, then: [
        { say: "owen", face: "cold", en: "He might even help with your brother. Holt knows everyone on this coast.", vi: "Biết đâu ông ấy còn giúp vụ em trai {cc}. Holt quen hết mọi người trên dải bờ biển này." },
        { think: { en: "How does Owen know Holt would care about Sam?", vi: "Sao Owen biết Holt sẽ quan tâm chuyện Sam?" } } ] },
      { hide: "*" },
      { n: { en: "7 p.m. In your room, you look at the invitation again. 'Black tie.'", vi: "7 giờ tối. Trong phòng, bạn nhìn lại tấm thiệp. “Lễ phục.”" } },
      { gallery: { prompt: { en: "What do you wear?", vi: "Bạn mặc gì?" }, key: "c4_outfit", want: ["formal"], score: "holt",
        opts: [
          { id: "suit", pic: "act-outfit-suit", tags: ["formal"], en: "Black tie", vi: "Lễ phục", desc: { en: "Borrowed. A little too big.", vi: "Đi mượn. Hơi rộng." } },
          { id: "uniform", pic: "act-outfit-uniform", tags: ["police"], en: "Police uniform", vi: "Đồng phục cảnh sát", desc: { en: "Let them remember who you are.", vi: "Để họ nhớ bạn là ai." }, set: { c4_cop: 1 } },
          { id: "jeans", pic: "act-outfit-jeans", tags: [], en: "Jeans and a jacket", vi: "Quần jean và áo khoác", desc: { en: "You are not here to impress anyone.", vi: "Bạn đâu đến để gây ấn tượng với ai." } },
        ],
        match: [{ think: { en: "You look like you belong. That's the point.", vi: "Trông bạn như người trong giới. Chính là mục đích." } }],
        miss: [{ think: { en: "You'll stand out. Maybe that's the point too.", vi: "Bạn sẽ nổi bật. Có lẽ đó cũng là mục đích." } }] } },
      { go: "c4_gala" },
    ],

    c4_gala: [
      { cp: "c4_gala" },
      { bg: "gala" }, { amb: "hall" }, { mood: "warm" }, { cam: "pull", ms: 10000 },
      { fx: "particles", kind: "dust", ms: 9000 },
      { n: { en: "Holt House glows on the hill like a ship. Chandeliers. A string quartet. Half the town in its best clothes.", vi: "Dinh thự Holt rực sáng trên đồi như một con tàu. Đèn chùm. Tứ tấu đàn dây. Nửa thị trấn trong bộ đồ đẹp nhất." } },
      { n: { en: "A waiter offers you champagne from a silver tray.", vi: "Một người phục vụ mời bạn sâm-panh từ khay bạc." }, pic: "act-champagne" },
      { show: "holt", at: "c" },
      { meet: "holt" },
      { say: "holt", en: "Ah — our new detective. Graham Holt. I've heard good things about you.", vi: "À — thám tử mới của chúng ta. Graham Holt. Tôi nghe nhiều điều tốt về {cc}." },
      { if: s => s.f.c4_outfit === "uniform", then: [{ say: "holt", face: "smug", en: "In uniform! How wonderfully serious. Nobody will steal the spoons tonight.", vi: "Mặc đồng phục! Nghiêm túc tuyệt vời. Tối nay chẳng ai dám ăn trộm thìa." }] },
      { if: s => s.f.c4_outfit === "jeans", then: [{ say: "holt", face: "smug", en: "And dressed for the pub. I like that. Honest.", vi: "Lại còn mặc như đi quán rượu. Tôi thích thế. Thật thà." }, { add: { holt: -1 } }] },
      { meter: { key: "holt", label: { en: "Holt's interest", vi: "Holt quan tâm" }, max: 6, min: -2, icon: "♛", color: "#d8c27a" } },
      { fill: { prompt: { en: "Make polite small talk. Choose the right question tag.", vi: "Chuyện phiếm lịch sự. Chọn câu hỏi đuôi đúng." },
        t: { en: "It's a beautiful house, ___?", vi: "Ngôi nhà đẹp quá, phải không ạ?" }, opts: ["isn't it", "is it", "doesn't it"], a: 0,
        why: { en: "Positive sentence with 'is' → negative tag 'isn't it?'", vi: "Câu khẳng định dùng “is” → câu hỏi đuôi phủ định “isn't it?”." },
        ok: [{ add: { holt: 1 } }] } },
      { say: "holt", en: "It is, isn't it? I built it with fish. Forty years ago I had one boat. My mother's name was painted on the side — Marta.", vi: "Đúng vậy, phải không? Tôi xây nó bằng cá đấy. Bốn mươi năm trước tôi có đúng một con tàu. Tên mẹ tôi sơn bên mạn — Marta." },
      { think: { en: "Marta. Tom's boat.", vi: "Marta. Tàu của Tom." } },
      { say: "holt", en: "I sold her to Tom Ward when I bought my first factory. Sentimental of me. Now — tell me about yourself.", vi: "Tôi bán nó cho Tom Ward khi mua xưởng đầu tiên. Uỷ mị thật. Giờ thì — kể tôi nghe về {cc} đi." },
      { note: { en: "Holt's first boat was the Marta — named after his mother.", vi: "Con tàu đầu tiên của Holt là Marta — đặt theo tên mẹ ông." } },
      { topics: { with: "holt", key: "holt", rounds: 3, prompt: { en: "What do you talk to Holt about?", vi: "Bạn nói với Holt chuyện gì?" },
        list: [
          { id: "town", icon: "⚓", en: "His work for the town", vi: "Những gì ông làm cho thị trấn", score: 2, then: [
            { say: "holt", face: "smug", en: "Somebody has to care for this place. The government won't. So I do.", vi: "Phải có ai lo cho chốn này. Chính phủ thì không. Nên tôi làm." } ] },
          { id: "kids", icon: "🧒", en: "The Holt Foundation's youth work", vi: "Việc giúp người trẻ của Quỹ Holt", score: 1, then: [
            { say: "holt", en: "Lost young people. A bed, a meal, a job. Some of them even say thank you.", vi: "Những người trẻ lạc lối. Một chiếc giường, bữa ăn, công việc. Vài đứa còn biết nói cảm ơn." },
            { think: { en: "A bed, a meal, a job. And a debt.", vi: "Một chiếc giường, bữa ăn, công việc. Và một món nợ." } } ] },
          { id: "finch", icon: "✒", en: "Harold Finch", vi: "Harold Finch", score: -1, then: [
            { say: "holt", face: "cold", en: "Poor Harold. A good man. A tired man. The sea is not kind to tired men.", vi: "Harold tội nghiệp. Một người tốt. Một người mệt mỏi. Biển không tử tế với những người mệt mỏi." },
            { add: { sus: 1 } } ] },
          { id: "boats", icon: "🐟", en: "Fishing and boats", vi: "Đánh cá và tàu thuyền", score: 1, then: [
            { say: "holt", en: "You can't fish your way to a house like this any more. You have to be… creative.", vi: "Giờ đánh cá thì chẳng ai xây nổi nhà thế này nữa. Phải… sáng tạo." } ] },
          { id: "sam", icon: "📷", en: "Your missing brother", vi: "Em trai mất tích của bạn", score: 2, then: [
            { say: "holt", face: "smug", en: "Ah. Sam. Yes, I know. A small town, detective. Let's talk about Sam somewhere quieter.", vi: "À. Sam. Vâng, tôi biết. Thị trấn nhỏ mà, thám tử. Ta nói về Sam ở chỗ nào yên tĩnh hơn nhé." },
            { set: { c4_holt_sam: 1 } } ] },
        ],
        end: [{ say: "holt", en: "Come. My study. I have a better whisky there — and a proposal.", vi: "Đi nào. Phòng làm việc của tôi. Ở đó có loại whisky ngon hơn — và một đề nghị." }] } },
      { hide: "*" }, { mood: null }, { cam: null },
      { go: "c4_offer" },
    ],

    c4_offer: [
      { cp: "c4_offer" },
      { bg: "study" }, { amb: "room" },
      { n: { en: "Holt's study. Dark wood, a fire, a painting of a fishing fleet. A small boat at the front: the Marta.", vi: "Phòng làm việc của Holt. Gỗ tối màu, lò sưởi, một bức tranh đội tàu đánh cá. Phía trước là một con thuyền nhỏ: Marta." } },
      { sfx: "buzz" },
      { think: { en: "Your phone buzzes in your pocket: battery 3%. If you want a recording, it won't last.", vi: "Điện thoại rung trong túi: pin 3%. Nếu muốn ghi âm thì không trụ được lâu." } },
      { if: s => (+s.f.ally || 0) >= 2, then: [{ think: { en: "Ruth's words: 'Report only to me.' She'd want proof. Real proof.", vi: "Lời Ruth: “Chỉ báo cáo với tôi.” Bà sẽ cần bằng chứng. Bằng chứng thật." } }] },
      { cg: "cg-holt" },
      { show: "holt", at: "c", face: "smug" },
      { say: "holt", en: "Tomorrow they'll take the boy's statement again — Kieran. You'll write it.", vi: "Ngày mai họ sẽ lấy lại lời khai của thằng bé — Kieran. {Cc} sẽ là người ghi." },
      { say: "holt", face: "cold", en: "Write it carefully. Leave out what doesn't help anyone. And I'll make sure your brother comes home safe.", easy: "Write it carefully. Don't write things that don't help. Then I will make sure your brother comes home safe.", vi: "Ghi cho cẩn thận. Bỏ qua những gì chẳng giúp được ai. Và tôi sẽ đảm bảo em trai {cc} về nhà an toàn." },
      { cg: null },
      { fx: "heartbeat" },
      { choice: [
        { tag: "direct", en: "Yes. I'll write it carefully.", vi: "Vâng. Tôi sẽ ghi cẩn thận.", set: { holt: "yes" }, add: { holt: 3 }, then: [
          { say: "holt", face: "smug", en: "Good. I knew I'd chosen well.", vi: "Tốt. Tôi biết mình chọn không sai." },
          { think: { en: "'Chosen.'", vi: "“Chọn.”" } } ] },
        { tag: "bluff", en: "(Start recording.) …What exactly do you want me to leave out?", vi: "(Bật ghi âm.) …Chính xác thì ông muốn tôi bỏ qua điều gì?", set: { holt: "fake" }, then: [{ go: "c4_wire" }] },
        { tag: "direct", en: "No. I write what people say.", vi: "Không. Tôi ghi những gì người ta nói.", set: { holt: "no" }, add: { holt: -3, sus: 2 }, then: [
          { say: "holt", face: "cold", en: "Pity. Finch said the same thing. Once.", vi: "Tiếc thật. Finch cũng từng nói y như vậy. Một lần." },
          { fx: "shiver" } ] },
      ], timer: 15, timeout: [
        { say: "holt", face: "smug", en: "Silence. I'll take that as a yes.", vi: "Im lặng. Tôi coi như là đồng ý." },
        { set: { holt: "yes" } } ] },
      { hide: "*" },
      { go: "c4_kitchen" },
    ],

    // ── giả vờ nhận lời: cần SẠC điện thoại để ghi trọn, rồi két sắt
    c4_wire: [
      { n: { en: "The screen shows a red dot — then a warning: 'Battery 2%'.", vi: "Màn hình hiện chấm đỏ — rồi cảnh báo: “Pin 2%”." } },
      { say: "holt", en: "Excuse me a moment. The Mayor is waving at me. Don't go anywhere — we're not finished.", vi: "Xin lỗi một lát. Ngài thị trưởng đang vẫy tôi. Đừng đi đâu nhé — ta chưa nói xong." },
      { hide: "holt" },
      { explore: { goal: { en: "Find a way to charge your phone — fast", vi: "Tìm cách sạc điện thoại — nhanh" }, need: 1, done: { en: "Holt is coming back", vi: "Holt đang quay lại" },
        spots: [
          { id: "desk", x: 40, y: 50, label: { en: "Desk", vi: "Bàn làm việc" }, then: [{ n: { en: "Papers, a gold pen, a photo of Holt shaking hands with the Chief Constable.", vi: "Giấy tờ, một cây bút vàng, ảnh Holt bắt tay ngài cảnh sát trưởng." } }] },
          { id: "chair", x: 72, y: 62, clue: true, label: { en: "Behind the armchair", vi: "Sau ghế bành" }, then: [
            { n: { en: "A charger, already plugged into the wall. Holt's own. You plug in your phone and push it under the cushion.", vi: "Một cục sạc cắm sẵn trên tường. Của chính Holt. Bạn cắm điện thoại vào rồi nhét dưới đệm ghế." }, pic: "act-charger" },
            { set: { charged: 1 } } ] },
          { id: "paint", x: 24, y: 28, label: { en: "The painting", vi: "Bức tranh" }, then: [
            { n: { en: "The painting moves when you touch it. Behind it: a wall safe with five letter dials.", vi: "Bức tranh xê dịch khi bạn chạm vào. Phía sau: một két sắt âm tường có năm vòng chữ." } },
            { set: { saw_safe: 1 } } ] },
        ] } },
      { if: s => s.f.saw_safe, then: [
        { lock: { prompt: { en: "Five letters. What would a sentimental man use? Think about what he told you tonight.", vi: "Năm chữ cái. Một người uỷ mị sẽ dùng gì? Nghĩ về điều ông ta kể tối nay." }, kind: "letters", answer: "MARTA",
          hints: [{ en: "His first boat.", vi: "Con tàu đầu tiên của ông." }, { en: "His mother's name.", vi: "Tên mẹ ông." }],
          ok: [
            { sfx: "door" },
            { cg: "cg-safe" },
            { n: { en: "Cash. And a black leather [[ledger]]. You photograph every page with shaking hands.", vi: "Tiền mặt. Và một cuốn sổ cái bìa da đen. Bạn chụp lại từng trang, tay run run." }, pic: "act-ledger" },
            { item: "ledger" },
            { n: { en: "'H.F. — £2,000/month.' Every month for eleven years. It stops in October. Then a new line: 'Trainee programme — £38,000.'", vi: "“H.F. — £2.000/tháng.” Tháng nào cũng vậy, suốt mười một năm. Dừng vào tháng Mười. Rồi một dòng mới: “Chương trình tập sự — £38.000.”" } },
            { fx: "flash" },
            { truth: "T10" },
            { think: { en: "Thirty-eight thousand pounds. That's your salary. He didn't buy a detective. He bought a pen.", vi: "Ba mươi tám nghìn bảng. Đó là lương của bạn. Ông ta không mua một thám tử. Ông ta mua một ngòi bút." } },
            { cg: null } ],
          giveUp: [{ think: { en: "No time. Leave it.", vi: "Không kịp. Bỏ đi." } }] } } ] },
      { sfx: "steps" },
      { qte: { prompt: { en: "Footsteps in the corridor! Get back to your chair — tap fast!", vi: "Tiếng bước chân ngoài hành lang! Về ghế ngồi — chạm thật nhanh!" }, kind: "tap", n: 10, ms: 4500, key: "c4_back",
        fail: [
          { show: "holt", at: "c", face: "angry" },
          { say: "holt", face: "angry", en: "Looking for something, detective?", vi: "Tìm gì thế, thám tử?" },
          { set: { c4_caught: 1 } }, { add: { holt: -2, sus: 2 } } ] } },
      { show: "holt", at: "c" },
      { say: "holt", en: "Where were we? Ah yes. Kieran's statement. Write that the man in yellow was Tom Ward. That's all. Simple.", vi: "Ta đang nói tới đâu nhỉ? À phải. Lời khai của Kieran. Ghi rằng người mặc áo vàng là Tom Ward. Thế thôi. Đơn giản." },
      { if: s => s.f.charged, then: [
        { set: { tape_holt: 1 } },
        { drop: "recorder" }, { item: "recorder" },
        { think: { en: "Under the cushion, your phone is still recording. Every word.", vi: "Dưới đệm ghế, điện thoại vẫn đang ghi. Từng chữ một." } } ],
        else: [
        { think: { en: "Your phone died minutes ago. You have nothing but your memory.", vi: "Điện thoại bạn tắt nguồn từ mấy phút trước. Bạn chẳng có gì ngoài trí nhớ." } } ] },
      { say: "me", en: "Tom Ward. Understood.", vi: "Tom Ward. Tôi hiểu rồi." },
      { hide: "*" },
      { go: "c4_kitchen" },
    ],

    // ── bếp: Maggie
    c4_kitchen: [
      { cp: "c4_kitchen" },
      { bg: "galakitchen" }, { amb: "room" },
      { n: { en: "You need air. The kitchen door is open to the rain. Someone is crying by the bins.", vi: "Bạn cần chút không khí. Cửa bếp mở ra ngoài trời mưa. Có ai đang khóc cạnh mấy thùng rác." } },
      { show: "maggie", at: "c", face: "broken" },
      { say: "maggie", en: "Holt's catering. I do it every year. Seventeen years.", vi: "Tiệc nhà Holt. Năm nào tôi cũng lo. Mười bảy năm rồi." },
      { say: "maggie", en: "Danny used to carry the trays. He'd steal the little sausages. He thought I didn't see.", vi: "Danny từng bưng khay. Nó hay ăn vụng mấy cái xúc xích nhỏ. Nó tưởng tôi không thấy." },
      { if: s => (+s.f.maggie || 0) >= 1, then: [
        { choice: [
          { tag: "kind", en: "You loved him.", vi: "Bà thương nó.", then: [
            { say: "maggie", face: "broken", en: "I found him at the bus station in Newcastle. Sixteen, sleeping in the rain. I gave him chips and a bed.", vi: "Tôi gặp nó ở bến xe Newcastle. Mười sáu tuổi, ngủ dưới mưa. Tôi cho nó ăn, cho nó chỗ ngủ." },
            { say: "maggie", en: "And then I gave him a debt. And Holt gave him a job packing boxes he never looked inside.", vi: "Rồi tôi cho nó một món nợ. Và Holt cho nó việc đóng những cái thùng nó chưa từng nhìn vào trong." },
            { fx: "ripple" },
            { truth: "T7" },
            { say: "maggie", en: "I told myself I was saving them. Here.", vi: "Tôi cứ tự nhủ mình đang cứu chúng. Đây." },
            { n: { en: "She presses something cold into your hand. A heavy iron key.", vi: "Bà dúi vào tay bạn một vật lạnh ngắt. Chiếc chìa sắt nặng trịch." }, pic: "act-key" },
            { item: "gp_key" },
            { say: "maggie", en: "Gull Point. The gate by the old crane. Whatever Sam hid there — Danny said Sam wrote everything down.", vi: "Gull Point. Cổng cạnh cái cần cẩu cũ. Dù Sam giấu gì ở đó — Danny bảo Sam ghi chép hết mọi thứ." },
            { set: { c4_maggie: "confess" } } ] },
        ] } ],
        else: [
        { if: s => s.has("debt_book"), then: [
          { choice: [
            { tag: "press", en: "(Show her the tab book.) Danny owed you 1,840 pounds. Tell me about the boxes.", vi: "(Đưa bà cuốn sổ nợ.) Danny nợ bà 1.840 bảng. Nói tôi nghe về mấy cái thùng.", add: { maggie: -1 }, then: [
              { say: "maggie", face: "cold", en: "Where did you get that? …Fine. Fine! Take it. Take the key. Go and see what you've done to us.", vi: "Lấy ở đâu ra thế? …Được. Được! Cầm lấy. Cầm cái chìa. Đi mà xem cô cậu đã làm gì với chúng tôi." },
              { item: "gp_key" }, { truth: "T7" },
              { set: { c4_maggie: "forced" } } ] },
            { tag: "kind", en: "(Leave her alone.)", vi: "(Để bà yên.)", set: { c4_maggie: "cold" } },
          ] } ],
          else: [
          { say: "maggie", face: "cold", en: "Go back to the party, pet. Nothing for you out here.", vi: "Quay lại bữa tiệc đi cưng. Ngoài này chẳng có gì cho {cc} đâu." },
          { set: { c4_maggie: "cold" } } ] } ] },
      { hide: "*" },
      { call: { from: "ruth", ring: 12,
        accept: [
          { say: "ruth", phone: true, en: "Where are you? Kieran's gone. The shelter says a man came for him at ten — said he was his uncle.", vi: "{Cc} đang ở đâu? Kieran mất tích rồi. Nhà tạm trú nói có người đàn ông đến đón nó lúc mười giờ — xưng là chú." },
          { if: s => s.f.gp === "told", then: [
            { say: "ruth", phone: true, en: "Someone knew where he slept. Someone knew everything in that statement.", vi: "Có kẻ biết thằng bé ngủ ở đâu. Có kẻ biết hết mọi thứ trong biên bản đó." },
            { think: { en: "You wrote 'Gull Point'. In front of Owen.", vi: "Bạn đã ghi “Gull Point”. Ngay trước mặt Owen." } } ] },
          { say: "ruth", phone: true, en: "There's a storm coming in tomorrow night. Get some sleep. You'll need it.", vi: "Tối mai có bão vào. Ngủ chút đi. {Cc} sẽ cần sức đấy." } ],
        missed: [
          { n: { en: "Missed call — Ruth. Then a text: 'Kieran is missing. Call me.'", vi: "Cuộc gọi nhỡ — Ruth. Rồi một tin nhắn: “Kieran mất tích. Gọi tôi.”" } } ],
      } },
      { set: { kieran_gone: 1 } },
      { meter: "holt", off: true },
      { if: s => s.f.holt === "yes", then: [{ end: "c4_deal" }] },
      { if: s => s.f.holt === "fake" && s.f.tape_holt, then: [{ end: "c4_wire" }] },
      { end: "c4_refuse" },
    ],
  },

  endings: {
    c4_deal: { ch: 4, next: "c5", nextTitle: { en: "Chapter 5 — Undertow", vi: "Chương 5 — Sóng ngầm" }, title: { en: "The Deal", vi: "Thoả thuận" },
      sum: { en: "You said yes to Holt. Your brother is the price — or the prize.", vi: "Bạn nhận lời Holt. Em trai bạn là cái giá — hay phần thưởng." },
      text: { en: "Holt shook your hand like a father. Somewhere, a boy is missing, and tomorrow you are supposed to write that he saw Tom Ward.", vi: "Holt bắt tay bạn như một người cha. Đâu đó, một cậu bé mất tích, và ngày mai bạn sẽ phải ghi rằng cậu đã thấy Tom Ward." } },
    c4_wire: { ch: 4, next: "c5", nextTitle: { en: "Chapter 5 — Undertow", vi: "Chương 5 — Sóng ngầm" }, title: { en: "The Wire", vi: "Dây ghi âm" },
      sum: { en: "Holt's offer, recorded word for word.", vi: "Lời đề nghị của Holt, ghi lại từng chữ." },
      text: { en: "For once, the words are on your side. Holt's voice is in your pocket. Now you have to stay alive long enough to use it.", vi: "Lần này, lời nói đứng về phía bạn. Giọng Holt nằm trong túi bạn. Giờ bạn phải sống đủ lâu để dùng nó." } },
    c4_refuse: { ch: 4, next: "c5", nextTitle: { en: "Chapter 5 — Undertow", vi: "Chương 5 — Sóng ngầm" }, title: { en: "Pity", vi: "Tiếc thật" },
      sum: { en: "Holt has no use for you now.", vi: "Holt không còn cần bạn nữa." },
      text: { en: "'Finch said the same thing. Once.' You know what happened to Finch. And tonight, Kieran is gone.", vi: "“Finch cũng từng nói y như vậy. Một lần.” Bạn biết chuyện gì đã xảy ra với Finch. Và tối nay, Kieran biến mất." } },
  },
});
