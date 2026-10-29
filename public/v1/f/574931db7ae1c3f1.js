// THE STATEMENT — CHƯƠNG 2 “Fish and Lies” (Ngày 2). Kịch bản: docs/games/the-statement-KICH-BAN.md mục 5.
// Cơ chế: nhắn tin (chat) · khám phá quán + lẻn vào bếp (sneak) · bảng manh mối nhiều cặp (board) · hỏi chuyện Tom (choice có nhãn + lòng tin)
//   · nghe băng quán rượu (listen) · điền từ câu hỏi lịch sự (fill) · nhà xác (cg + heartbeat). Ảnh: art.json mục “chương 2”.
// Cờ từ chương 1 dùng ở đây: outcome (arrest | doubt) · gp (told | lie | private) · told_sam · kieran / ruth (lòng tin) · saw_danny · van · saw_band
StoryEngine.chapter({
  items: {
    pm_report: { icon: "doc", name: { en: "Post-mortem report", vi: "Biên bản khám nghiệm" }, desc: { en: "Male, around 19. Head injury, then drowning. Time of death: about 1:45 a.m. Not Pete Nolan.", vi: "Nam, khoảng 19 tuổi. Chấn thương đầu, sau đó đuối nước. Tử vong khoảng 1 giờ 45 sáng. Không phải Pete Nolan." } },
    rota: { icon: "doc", name: { en: "The 'price list'", vi: "“Bảng giá”" }, desc: { en: "Maggie's chalkboard. The prices don't match the menu: 'Tue 4 · Thu 4 · Sat 2'. Times, not prices?", vi: "Bảng phấn của Maggie. Giá không khớp thực đơn: “Tue 4 · Thu 4 · Sat 2”. Là giờ, không phải giá?" } },
    sam_jacket: { icon: "box", name: { en: "Sam's parka", vi: "Áo parka của Sam" }, desc: { en: "Sam's old green parka, behind Maggie's kitchen door. A festival wristband in the pocket: '14·02'.", vi: "Chiếc áo parka xanh cũ của Sam, sau cửa bếp nhà Maggie. Trong túi có vòng tay lễ hội: “14·02”." } },
    debt_book: { icon: "doc", name: { en: "The 'tab' book", vi: "Sổ “ghi nợ”" }, desc: { en: "First names and numbers. 'Danny — 1,840.' 'Kieran — 960.' 'Sam — 2,300.' Nobody eats that many chips.", vi: "Tên và con số. “Danny — 1.840.” “Kieran — 960.” “Sam — 2.300.” Không ai ăn nhiều cá chiên đến thế." } },
    pub_tape: { icon: "phone", name: { en: "Pub CCTV audio", vi: "Âm thanh camera quán" }, desc: { en: "Tom and Pete, the night before: 'You go home. I'll look after the lads.'", vi: "Tom và Pete, tối hôm trước: “Cậu về nhà đi. Tôi sẽ lo cho tụi nhỏ.”" } },
  },
  truths: {
    T5: { name: { en: "The captain", vi: "Người thuyền trưởng" }, text: { en: "Tom Ward has been secretly taking runaway kids north on the Marta. Nine so far. Danny was going to be the tenth.", vi: "Tom Ward đã lén đưa những đứa trẻ bỏ trốn lên phía bắc bằng tàu Marta. Đã chín đứa. Danny lẽ ra là đứa thứ mười." } },
  },
  words: {
    "post-mortem": { vi: "khám nghiệm tử thi", ex: "The post-mortem shows he was nineteen." },
    "custody": { vi: "tạm giữ (của cảnh sát)", ex: "Tom has been in custody since dawn." },
    "chips": { vi: "khoai tây chiên (Anh-Anh; Anh-Mỹ: fries)", ex: "Fish and chips, with salt and vinegar." },
    "rota": { vi: "lịch phân ca", ex: "The rota says Thursday, four a.m." },
    "owe": { vi: "nợ", ex: "He owes Maggie two thousand pounds." },
    "lads": { vi: "mấy cậu trai, tụi nhỏ (khẩu ngữ Anh)", ex: "I'll look after the lads." },
    "alibi": { vi: "bằng chứng ngoại phạm", ex: "Where's your alibi for 1:47?" },
    "mortuary": { vi: "nhà xác", ex: "We need you at the mortuary." },
    "identify": { vi: "nhận dạng", ex: "Can you identify him?" },
    "parka": { vi: "áo parka (áo khoác có mũ lông)", ex: "A green parka hung behind the door." },
    "wristband": { vi: "vòng đeo tay (vé lễ hội)", ex: "The wristband says 14·02." },
    "pet": { vi: "cưng (cách gọi thân mật ở miền bắc nước Anh)", ex: "Sit down, pet." },
  },

  recap: [
    { ch: 2, t: { en: "Day 2. The post-mortem: the dead boy was about nineteen, not Pete Nolan. Owen still blamed Tom.", vi: "Ngày 2. Khám nghiệm: người chết khoảng mười chín tuổi, không phải Pete Nolan. Owen vẫn đổ cho Tom." } },
    { ch: 2, if: s => s.f.c2_kieran === "warn", t: { en: "Kieran texted you: someone came to Gull Point in the night. Someone knew.", vi: "Kieran nhắn bạn: đêm qua có người đến Gull Point. Có người đã biết." } },
    { ch: 2, if: s => s.f.c2_kieran === "ok", t: { en: "Kieran texted you. He's scared, but he still trusts you.", vi: "Kieran nhắn tin cho bạn. Cậu sợ, nhưng vẫn tin bạn." } },
    { ch: 2, if: s => s.has("sam_jacket"), t: { en: "Behind Maggie's kitchen door: Sam's green parka.", vi: "Sau cửa bếp nhà Maggie: chiếc áo parka xanh của Sam." } },
    { ch: 2, if: s => s.f.c2_caught, t: { en: "Maggie caught you in her kitchen. Her smile went cold.", vi: "Maggie bắt gặp bạn trong bếp. Nụ cười của bà tắt ngấm." } },
    { ch: 2, if: s => s.f.c2_ask === "front", t: { en: "You asked Maggie about Sam — in front of Owen.", vi: "Bạn hỏi Maggie về Sam — ngay trước mặt Owen." } },
    { ch: 2, if: s => s.f.c2_ask === "private", t: { en: "Maggie gave you her number. 'Come back without your friend, pet.'", vi: "Maggie cho bạn số điện thoại. “Lần sau đến một mình nhé, cưng.”" } },
    { ch: 2, if: s => s.f.c2_rota, t: { en: "Maggie's 'price list' was a rota: the same times as the van on Kieran's voice message.", vi: "“Bảng giá” của Maggie là lịch ca: trùng giờ với chiếc xe tải trong tin nhắn thoại của Kieran." } },
    { ch: 2, if: s => s.f.c2_debt, t: { en: "The 'tab' book: Danny, Kieran, Sam — each owed Maggie thousands.", vi: "Sổ “ghi nợ”: Danny, Kieran, Sam — mỗi đứa nợ Maggie hàng nghìn bảng." } },
    { ch: 2, if: s => s.f.tom_voice, t: { en: "On the pub tape you heard Tom's voice — the same voice as on Kieran's phone.", vi: "Trong băng ở quán, bạn nghe giọng Tom — chính là giọng trong điện thoại của Kieran." } },
    { ch: 2, if: s => s.truth("T5") && s.f.c2_tom === "open", t: { en: "Tom opened up: he has taken nine runaway kids north. 'Ask the lighthouse.'", vi: "Tom mở lòng: ông đã đưa chín đứa trẻ lên phía bắc. “Hỏi ngọn hải đăng ấy.”" } },
    { ch: 2, if: s => s.f.c2_tom === "shut", t: { en: "Tom said nothing more. 'Charge me or let me go.'", vi: "Tom không nói thêm gì. “Buộc tội tôi hoặc thả tôi ra.”" } },
    { ch: 2, if: s => s.f.c2_sam === "told", t: { en: "You told Ruth the truth: Sam is your brother.", vi: "Bạn nói thật với Ruth: Sam là em trai bạn." } },
    { ch: 2, if: s => s.f.c2_sam === "hid", t: { en: "Ruth asked if there was anything else. You said no.", vi: "Ruth hỏi bạn còn gì muốn nói không. Bạn nói không." } },
    { ch: 2, t: { en: "At the mortuary, you saw his face. It was not Sam. It was Danny Reece — Sam's best friend.", vi: "Ở nhà xác, bạn nhìn thấy gương mặt ấy. Không phải Sam. Là Danny Reece — bạn thân nhất của Sam." } },
  ],

  flow: [
    { ch: 2, row: 0, id: "c2_office", kind: "cp", scene: "office", label: { en: "Not Pete", vi: "Không phải Pete" }, sum: { en: "The post-mortem.", vi: "Biên bản khám nghiệm." } },
    { ch: 2, row: 1, kind: "opt", key: "c2_kieran", val: "warn", label: { en: "'They came'", vi: "“Chúng đến”" }, sum: { en: "You wrote 'Gull Point' in front of Owen. Someone visited it that night.", vi: "Bạn ghi “Gull Point” trước mặt Owen. Đêm đó có người tìm tới." }, hint: { en: "What did you write in the statement?", vi: "Bạn đã ghi gì vào biên bản?" } },
    { ch: 2, row: 1, kind: "opt", key: "c2_kieran", val: "ok", label: { en: "'Can I trust u'", vi: "“Em tin đc ko”" }, sum: { en: "Kieran still trusts you.", vi: "Kieran vẫn tin bạn." } },
    { ch: 2, row: 1, kind: "opt", key: "c2_kieran", val: "none", label: { en: "No message", vi: "Không có tin" }, sum: { en: "Kieran didn't trust you enough to text.", vi: "Kieran chưa đủ tin để nhắn." } },
    { ch: 2, row: 2, id: "c2_shop", kind: "cp", scene: "chipshop", label: { en: "Maggie's", vi: "Quán Maggie's" }, sum: { en: "Fish, chips and a kitchen door.", vi: "Cá, khoai chiên và một cánh cửa bếp." } },
    { ch: 2, row: 3, kind: "opt", key: "c2_ask", val: "front", label: { en: "Ask in front of Owen", vi: "Hỏi trước mặt Owen" }, sum: { en: "Owen now knows you are looking for someone.", vi: "Giờ Owen biết bạn đang tìm ai đó." } },
    { ch: 2, row: 3, kind: "opt", key: "c2_ask", val: "private", label: { en: "Ask in private", vi: "Hẹn nói riêng" }, sum: { en: "Maggie gave you her number.", vi: "Maggie đưa bạn số điện thoại." } },
    { ch: 2, row: 3, kind: "opt", key: "c2_ask", val: "silent", label: { en: "Say nothing", vi: "Không hỏi" }, sum: { en: "You kept Sam to yourself.", vi: "Bạn giữ chuyện Sam cho riêng mình." } },
    { ch: 2, row: 4, id: "c2_cells", kind: "cp", scene: "cells", label: { en: "Cell 4", vi: "Phòng giữ số 4" }, sum: { en: "The captain who won't talk.", vi: "Ông thuyền trưởng không chịu nói." } },
    { ch: 2, row: 5, kind: "opt", key: "c2_tom", val: "open", label: { en: "Tom opens up", vi: "Tom mở lòng" }, sum: { en: "'Ask the lighthouse.'", vi: "“Hỏi ngọn hải đăng ấy.”" }, hint: { en: "He doesn't trust police. Does he trust you?", vi: "Ông không tin cảnh sát. Ông có tin bạn không?" } },
    { ch: 2, row: 5, kind: "opt", key: "c2_tom", val: "shut", label: { en: "Tom stays silent", vi: "Tom im lặng" }, sum: { en: "'Charge me or let me go.'", vi: "“Buộc tội tôi hoặc thả tôi ra.”" } },
    { ch: 2, row: 6, kind: "opt", key: "c2_sam", val: "told", label: { en: "Tell Ruth about Sam", vi: "Kể Ruth về Sam" }, sum: { en: "Ruth knows why you came.", vi: "Ruth biết lý do bạn đến đây." } },
    { ch: 2, row: 6, kind: "opt", key: "c2_sam", val: "hid", label: { en: "Keep the secret", vi: "Giữ bí mật" }, sum: { en: "One more lie to Ruth.", vi: "Thêm một lời nói dối với Ruth." } },
    { ch: 2, row: 6, kind: "opt", key: "c2_sam", val: "known", label: { en: "She already knew", vi: "Bà đã biết" }, sum: { en: "You told her in Chapter 1.", vi: "Bạn đã kể từ Chương 1." } },
    { ch: 2, row: 7, id: "c2_morgue", kind: "cp", scene: "morgue", label: { en: "The face", vi: "Gương mặt" }, sum: { en: "Is it Sam?", vi: "Có phải Sam?" } },
    { ch: 2, row: 8, id: "c2_light", kind: "end", label: { en: "The lighthouse", vi: "Ngọn hải đăng" } },
    { ch: 2, row: 8, id: "c2_silent", kind: "end", label: { en: "Silent sea", vi: "Biển lặng" } },
  ],

  nodes: {
    c2: [
      { title: { ch: 2, en: "Fish and Lies", vi: "Cá và lời dối" } },
      { cp: "c2_office" },
      { bg: "office" }, { cam: "push", ms: 9000 },
      { n: { en: "Day 2. You slept for two hours. The office smells of old coffee and wet coats.", vi: "Ngày 2. Bạn ngủ được hai tiếng. Văn phòng nồng mùi cà phê cũ và áo khoác ướt." } },
      { show: "ruth", at: "l" }, { show: "owen", at: "r", face: "smile" },
      { say: "ruth", en: "The [[post-mortem]] is back.", vi: "Kết quả khám nghiệm tử thi có rồi." },
      { item: "pm_report" },
      { n: { en: "You open the folder. A photo is clipped to the first page. You don't look at it. Not yet.", vi: "Bạn mở tập hồ sơ. Một tấm ảnh kẹp ở trang đầu. Bạn chưa nhìn. Chưa phải lúc." }, pic: "act-report" },
      { say: "ruth", en: "Male. Around nineteen years old. A blow to the head, then he drowned. Time of death: about quarter to two.", easy: "A young man, about nineteen. He hit his head, then he drowned. He died at about 1:45.", vi: "Nam. Khoảng mười chín tuổi. Bị đánh vào đầu rồi chết đuối. Thời điểm tử vong: khoảng hai giờ kém mười lăm." },
      { if: s => s.f.doubt_id, then: [
        { say: "ruth", face: "soft", en: "You said it wasn't Pete Nolan. You were right.", vi: "{Cc} nói người chết không phải Pete Nolan. {Cc} đúng." },
        { add: { ruth: 1 } } ] },
      { say: "owen", face: "smile", en: "So it's not Pete. So what? Tom Ward killed some kid instead of his deckhand. Still Tom.", vi: "Thì không phải Pete. Có sao đâu? Tom Ward giết một thằng nhóc thay vì gã thuỷ thủ. Vẫn là Tom." },
      { if: s => s.f.outcome === "arrest", then: [
        { say: "owen", en: "He's been in [[custody]] since six this morning. Not a word. Guilty men love silence.", vi: "Hắn bị tạm giữ từ sáu giờ sáng. Không nói một lời. Kẻ có tội thích im lặng lắm." } ],
        else: [
        { say: "owen", face: "cold", en: "We should have arrested him last night. Now he's back in for questioning. Voluntary. For now.", vi: "Lẽ ra phải bắt hắn từ đêm qua. Giờ hắn quay lại để thẩm vấn. Tự nguyện. Tạm thời là thế." },
        { add: { sus: 1 } } ] },
      { choice: [
        { tag: "direct", en: "A nineteen-year-old with the wallet of a 34-year-old. Someone put it there.", vi: "Một người mười chín tuổi cầm ví của người ba mươi tư tuổi. Có kẻ đã nhét nó vào.", add: { ruth: 1, sus: 1 }, then: [
          { say: "owen", face: "cold", en: "Or he stole it. Kids steal. Don't make this complicated, trainee.", vi: "Hoặc nó ăn cắp. Bọn nhóc hay ăn cắp mà. Đừng làm rối chuyện lên, tập sự." },
          { say: "ruth", en: "Complicated is my favourite kind of case.", vi: "Rối rắm là loại vụ án tôi thích nhất." } ] },
        { tag: "polite", en: "Do we know who he is yet?", vi: "Đã biết cậu ấy là ai chưa ạ?", then: [
          { say: "ruth", en: "No name. No phone. Fingerprints are not on file. Somebody's son, and nobody has called.", vi: "Không tên. Không điện thoại. Vân tay không có trong hồ sơ. Con nhà ai đó, mà chẳng ai gọi đến." } ] },
        { tag: "kind", en: "(Say nothing. Think of Sam.)", vi: "(Không nói gì. Nghĩ về Sam.)", then: [
          { think: { en: "Nineteen. Sam is nineteen.", vi: "Mười chín. Sam cũng mười chín." } } ] },
      ] },
      { hide: "*" },
      { go: "c2_text" },
    ],

    // ── tin nhắn của Kieran: phụ thuộc chương 1 (ghi “Gull Point” trước mặt Owen → có người đến đó)
    c2_text: [
      { sfx: "buzz" },
      { n: { en: "Your phone buzzes. An unknown number.", vi: "Điện thoại rung. Một số lạ." } },
      { if: s => s.f.gp === "told", then: [
        { set: { c2_kieran: "warn" } },
        { chat: { with: "kieran", msgs: [
          { from: "kieran", en: "its kieran. some1 came to gull point last nite", vi: "kieran đây. tối qua có ng đến gull point" },
          { from: "kieran", en: "torches. 2 men. they were looking for me", vi: "có đèn pin. 2 ng. tụi nó tìm em" },
          { from: "kieran", en: "only police knew i sleep there. only YOU knew", vi: "chỉ cảnh sát biết em ngủ ở đó. chỉ {ac} biết" },
        ], reply: [
          { en: "Are you safe? Where are you now?", vi: "Em có an toàn không? Giờ em ở đâu?", add: { kieran: 1 }, then: [
            { chat: { with: "kieran", msgs: [{ from: "kieran", en: "safe ish. not telling u where. sorry", vi: "tạm an toàn. ko nói chỗ đâu. xin lỗi" }] } } ] },
          { en: "I had to write it down. That's the law.", vi: "{Ac} phải ghi lại. Đó là luật.", add: { kieran: -1 }, then: [
            { chat: { with: "kieran", msgs: [{ from: "kieran", en: "the law nearly got me killed", vi: "luật suýt làm em chết đấy" }] } } ] },
        ] } },
        { think: { en: "Only the police knew. Ruth. Owen. You.", vi: "Chỉ cảnh sát biết. Ruth. Owen. Và bạn." } },
        { add: { sus: 1 } } ] },
      { if: s => s.f.gp !== "told" && (+s.f.kieran || 0) >= 1, then: [
        { set: { c2_kieran: "ok" } },
        { chat: { with: "kieran", msgs: [
          { from: "kieran", en: "its kieran. the social worker gave me ur number", vi: "kieran đây. cô công tác xã hội cho em số" },
          { from: "kieran", en: "is it true. the boy on the pier. is it danny", vi: "có thật ko. đứa trên cầu tàu. có phải danny ko" },
        ], reply: [
          { en: "I don't know yet. I'll tell you when I do.", vi: "{Ac} chưa biết. Biết rồi sẽ báo em.", add: { kieran: 1 }, then: [
            { chat: { with: "kieran", msgs: [{ from: "kieran", en: "ok. ur not like the others", vi: "ok. {ac} ko giống mấy ng kia" }] } } ] },
          { en: "Who was Danny to you?", vi: "Danny là gì với em?", then: [
            { chat: { with: "kieran", msgs: [{ from: "kieran", en: "the only one who shared his chips", vi: "đứa duy nhất chia khoai chiên cho em" }, { from: "kieran", en: "him and sam", vi: "nó với sam" }] } },
            { think: { en: "Him and Sam.", vi: "Nó và Sam." } } ] },
        ] } } ] },
      { if: s => !s.f.c2_kieran, then: [
        { set: { c2_kieran: "none" } },
        { n: { en: "Only an advert for cheap phone deals. Kieran hasn't written. Why would he?", vi: "Chỉ là tin quảng cáo gói cước rẻ. Kieran không nhắn. Cậu ấy có lý do gì để nhắn chứ?" } } ] },
      { go: "c2_shop" },
    ],

    // ── quán Maggie's: khám phá, lẻn vào bếp, hỏi về Sam
    c2_shop: [
      { cp: "c2_shop" },
      { bg: "chipshop" }, { amb: "room" }, { cam: "pan-r", ms: 12000 },
      { n: { en: "Lunchtime. Owen insists on coming with you. 'Best chips on the coast,' he says. 'My treat.'", vi: "Giờ trưa. Owen nhất quyết đi cùng bạn. “Khoai chiên ngon nhất vùng biển,” anh ta nói. “Tôi bao.”" } },
      { n: { en: "Maggie's is warm, loud and smells of hot oil and vinegar. The windows are white with steam.", vi: "Quán Maggie's ấm áp, ồn ào, nồng mùi dầu nóng và giấm. Cửa kính mờ trắng hơi nước." } },
      { show: "maggie", at: "c" },
      { say: "maggie", en: "Owen, love! And who's this? New face. Sit down, [[pet]], you look frozen.", vi: "Owen, cưng! Còn ai đây? Gương mặt mới. Ngồi xuống đi cưng, trông {cc} lạnh cóng kìa." },
      { say: "owen", face: "smile", en: "Trainee detective. First week. Be nice, Maggie.", vi: "Thám tử tập sự. Tuần đầu. Nhẹ tay thôi nhé, Maggie." },
      { say: "maggie", en: "I'm always nice. Fish and [[chips]], twice. On the house — you lot work too hard.", vi: "Tôi lúc nào chẳng tử tế. Hai phần cá chiên khoai tây. Quán mời — các cậu làm việc vất vả quá." },
      { n: { en: "The paper is hot in your hands. Salt, vinegar, golden batter. For a moment, it's just lunch.", vi: "Giấy gói nóng hổi trong tay. Muối, giấm, lớp bột vàng ruộm. Trong một khoảnh khắc, đây chỉ là bữa trưa." }, pic: "act-chips" },
      { say: "maggie", en: "Terrible thing on the pier. Terrible. I hear it was a young lad.", vi: "Chuyện trên cầu tàu kinh khủng quá. Kinh khủng. Nghe nói là một cậu trai trẻ." },
      { think: { en: "'I hear'. From who? The report is two hours old.", vi: "“Nghe nói”. Nghe ai? Biên bản mới có hai tiếng trước." }, on: "maggie" },
      { hide: "maggie" },
      { n: { en: "Maggie goes back to the fryer. Owen is busy with his phone. You look around.", vi: "Maggie quay lại bếp chiên. Owen mải nhìn điện thoại. Bạn đưa mắt nhìn quanh." } },
      { explore: {
        goal: { en: "Look around Maggie's shop", vi: "Quan sát quán Maggie's" }, need: 2, done: { en: "Go back to your table", vi: "Về bàn" },
        spots: [
          { id: "board", x: 26, y: 26, clue: true, label: { en: "Price board", vi: "Bảng giá" }, then: [
            { n: { en: "A chalkboard by the till. 'Cod £4' — fine. But under it, in smaller writing: 'Tue 4 · Thu 4 · Sat 2'. Those aren't prices.", vi: "Tấm bảng phấn cạnh quầy tính tiền. “Cá tuyết £4” — bình thường. Nhưng bên dưới, chữ nhỏ hơn: “Tue 4 · Thu 4 · Sat 2”. Đó không phải giá." }, pic: "act-rota" },
            { item: "rota" } ] },
          { id: "photos", x: 74, y: 30, clue: true, label: { en: "Photo wall", vi: "Bức tường ảnh" }, then: [
            { n: { en: "Dozens of photos: football teams, birthdays, fishermen with big fish. In one corner, a group of teenage boys on the harbour wall.", vi: "Hàng chục tấm ảnh: đội bóng, sinh nhật, ngư dân khoe cá to. Ở một góc, một nhóm cậu trai tuổi teen ngồi trên tường bến cảng." } },
            { n: { en: "Someone has torn one face out of the photo. Just one. The boy next to the hole wears a green parka.", vi: "Ai đó đã xé mất một khuôn mặt khỏi tấm ảnh. Chỉ một. Cậu trai cạnh chỗ bị xé mặc áo parka xanh." } },
            { think: { en: "Sam had a green parka. Mum bought it the winter before he left.", vi: "Sam có một chiếc parka xanh. Mẹ mua cho nó mùa đông trước khi nó bỏ đi." } } ] },
          { id: "jar", x: 50, y: 52, label: { en: "Charity jar", vi: "Hũ quyên góp" }, then: [
            { n: { en: "'HOLT FOUNDATION — HELP HALDEN'S YOUNG PEOPLE.' The jar is full of coins.", vi: "“QUỸ HOLT — GIÚP ĐỠ NGƯỜI TRẺ HALDEN.” Hũ đầy tiền xu." } } ] },
          { id: "door", x: 86, y: 60, clue: true, label: { en: "Kitchen door", vi: "Cửa bếp" }, then: [
            { think: { en: "The kitchen door is half open. Maggie is at the front, serving a queue. Three minutes, maybe.", vi: "Cửa bếp khép hờ. Maggie đang ở phía trước, phục vụ một hàng người. Có lẽ được ba phút." } },
            { choice: [
              { en: "(Slip into the kitchen.)", vi: "(Lẻn vào bếp.)", then: [{ go: "c2_kitchen" }] },
              { en: "(Not now.)", vi: "(Không phải lúc này.)" } ] } ] },
        ] } },
      { go: "c2_ask" },
    ],

    c2_kitchen: [
      { bg: "kitchen" }, { mood: "danger" },
      { sneak: { goal: { en: "Search the kitchen before Maggie comes back", vi: "Lục bếp trước khi Maggie quay lại" }, max: 5, key: "c2_sneak",
        rows: [
          { t: { en: "Two big fryers hiss on your left. A coat rack by the back door. A table covered in papers.", vi: "Hai chảo chiên lớn xì xèo bên trái. Một giá treo áo cạnh cửa sau. Một chiếc bàn đầy giấy tờ." },
            opts: [{ en: "Check the coat rack", vi: "Xem giá treo áo", risk: 1, then: [
              { n: { en: "Old jackets. And one you know too well: a green parka, the left cuff torn. You'd know it anywhere.", vi: "Áo khoác cũ. Và một chiếc bạn biết quá rõ: áo parka xanh, cổ tay trái rách. Ở đâu bạn cũng nhận ra." }, pic: "act-jacket" },
              { fx: "heartbeat" }, { item: "sam_jacket" } ] },
            { en: "Check the table", vi: "Xem chiếc bàn", risk: 2, then: [
              { n: { en: "Under the invoices: a small black notebook. First names, numbers, dates. 'Danny — 1,840.' 'Sam — 2,300.'", vi: "Dưới đống hoá đơn: một cuốn sổ đen nhỏ. Tên, con số, ngày tháng. “Danny — 1.840.” “Sam — 2.300.”" }, pic: "act-debtbook" },
              { item: "debt_book" } ] }] },
          { t: { en: "Footsteps. Maggie laughs at the counter — still there. You have a few seconds.", vi: "Tiếng bước chân. Maggie cười ở quầy — vẫn ở đó. Bạn còn vài giây." },
            opts: [{ en: "Grab the other thing too", vi: "Lấy nốt thứ còn lại", risk: 3, then: [
              { if: s => !s.has("sam_jacket"), then: [{ item: "sam_jacket" }], else: [{ item: "debt_book" }] } ] },
            { en: "Leave now, quietly", vi: "Rút ngay, thật khẽ", risk: 0 }] },
          { t: { en: "The kitchen door. Behind it, the shop. Maggie's voice is getting closer.", vi: "Cửa bếp. Phía sau là quán. Giọng Maggie đang lại gần." },
            opts: [{ en: "Walk out as if lost", vi: "Đi ra như thể lạc đường", risk: 1 }, { en: "Wait behind the door", vi: "Nấp sau cánh cửa", risk: 2 }] },
        ],
        caught: [
          { mood: null }, { bg: "kitchen" },
          { show: "maggie", at: "c", face: "cold" },
          { say: "maggie", face: "cold", en: "Lost, pet? Toilets are the other way.", vi: "Lạc à, cưng? Nhà vệ sinh ở hướng kia." },
          { n: { en: "Her smile stays. Her eyes don't.", vi: "Nụ cười vẫn còn. Ánh mắt thì không." } },
          { set: { c2_caught: 1 } }, { add: { maggie: -2 } } ],
        ok: [
          { mood: null },
          { n: { en: "You're back at your table before Maggie turns around. Owen hasn't even looked up.", vi: "Bạn đã về bàn trước khi Maggie quay lại. Owen còn chưa ngẩng lên." } } ],
      } },
      { mood: null },
      { go: "c2_ask" },
    ],

    c2_ask: [
      { bg: "chipshop" },
      { show: "maggie", at: "l", face: s => (s.f.c2_caught ? "cold" : "") }, { show: "owen", at: "r" },
      { say: "maggie", en: "Everything all right? You've hardly touched your chips.", vi: "Mọi thứ ổn chứ? {Cc} gần như chưa đụng vào khoai." },
      { think: { en: "Ask her about Sam? Owen is sitting right there.", vi: "Hỏi bà về Sam? Owen đang ngồi ngay đó." } },
      { choice: [
        { tag: "direct", en: "Have you seen this boy? His name is Sam.", vi: "Bà có thấy cậu này không? Tên cậu ấy là Sam.", set: { c2_ask: "front" }, add: { sus: 2 }, then: [
          { n: { en: "You put Sam's photo on the counter. Maggie looks at it for one second too long.", vi: "Bạn đặt ảnh Sam lên quầy. Maggie nhìn nó lâu hơn một giây so với bình thường." }, on: "maggie" },
          { say: "maggie", face: "worried", en: "Lots of lads come through here, pet. I can't remember them all.", vi: "Nhiều cậu trai qua đây lắm, cưng. Tôi nhớ sao hết được." },
          { say: "owen", face: "cold", en: "Who's Sam?", vi: "Sam là ai?" },
          { choice: [
            { tag: "lie", en: "A missing person case from my old station.", vi: "Một vụ mất tích ở đồn cũ của tôi.", add: { lie: 1 } },
            { tag: "direct", en: "My brother.", vi: "Em trai tôi.", set: { owen_sam: 1 }, then: [
              { say: "owen", face: "smile", en: "Your brother? Why didn't you say? I'll keep an eye out, mate.", vi: "Em trai {cc}? Sao không nói sớm? Tôi sẽ để mắt giúp cho." },
              { think: { en: "He smiled. Why does that feel worse?", vi: "Anh ta cười. Sao điều đó lại khiến bạn thấy tệ hơn?" } } ] },
          ] } ] },
        { tag: "polite", if: s => !s.f.c2_caught, en: "Could I come back later? I'd love to hear more about the harbour.", vi: "Tôi có thể quay lại sau không? Tôi muốn nghe thêm về bến cảng.", set: { c2_ask: "private" }, add: { maggie: 1 }, then: [
          { say: "maggie", face: "", en: "Course you can. Here — my number. Come without your friend next time, pet. He eats too much.", vi: "Tất nhiên rồi. Đây — số của tôi. Lần sau đến một mình nhé cưng. Cậu kia ăn nhiều quá." },
          { say: "owen", face: "smile", en: "Oi!", vi: "Này!" } ] },
        { tag: "kind", en: "(Say nothing. Eat your chips.)", vi: "(Không nói gì. Ăn khoai.)", set: { c2_ask: "silent" } },
      ] },
      { hide: "*" },
      { go: "c2_think" },
    ],

    // ── bảng manh mối: nối đồ vật đã có
    c2_think: [
      { bg: "office" },
      { n: { en: "Back at the station, you spread everything on your desk.", vi: "Về đồn, bạn bày mọi thứ ra bàn." } },
      { board: { q: { en: "What is happening at Maggie's?", vi: "Chuyện gì đang diễn ra ở quán Maggie's?" }, need: 1, key: "c2_board",
        links: [
          { a: "rota", b: "voicemail", label: { en: "The 'prices' are the van's times", vi: "“Giá” chính là giờ của xe tải" }, set: { c2_rota: 1 } },
          { a: "debt_book", b: "sam_photo", label: { en: "Sam owes Maggie money", vi: "Sam nợ tiền Maggie" }, set: { c2_debt: 1 } },
          { a: "sam_jacket", b: "trainer", label: { en: "Sam and Danny were together", vi: "Sam và Danny đã ở cùng nhau" }, set: { c2_together: 1 } },
          { a: "debt_book", b: "pm_report", label: { en: "The dead boy may be on Maggie's list", vi: "Người chết có thể nằm trong sổ của Maggie" }, set: { c2_list: 1 } },
        ],
        ok: [{ think: { en: "Kids. Debts. A van at four in the morning. This isn't a chip shop. It's an office.", vi: "Bọn trẻ. Nợ nần. Một chiếc xe tải lúc bốn giờ sáng. Đây không phải quán cá chiên. Đây là một văn phòng." } }],
        fail: [{ think: { en: "Nothing connects. Not yet. You need more.", vi: "Chưa có gì nối được. Chưa. Bạn cần thêm manh mối." } }] } },
      { go: "c2_cells" },
    ],

    // ── xà lim: Tom Ward
    c2_cells: [
      { cp: "c2_cells" },
      { bg: "cells" }, { amb: "hall" }, { mood: "cold" },
      { n: { en: "Custody cell 4. White tiles, a blue plastic mattress, and a man who has not slept.", vi: "Phòng tạm giữ số 4. Gạch trắng, tấm nệm nhựa xanh và một người đàn ông chưa hề chợp mắt." } },
      { cg: "cg-tom" },
      { n: { en: "Tom Ward sits with his elbows on his knees, looking at his hands. Big hands. Scarred from rope and cold water.", vi: "Tom Ward ngồi chống khuỷu tay lên đầu gối, nhìn đôi tay mình. Đôi tay to. Đầy sẹo vì dây thừng và nước lạnh." } },
      { cg: null },
      { show: "ruth", at: "l" }, { show: "tom", at: "r" },
      { say: "ruth", en: "Before we start — listen to this. It's from the CCTV at The Anchor, the night before.", vi: "Trước khi bắt đầu — nghe cái này. Từ camera quán The Anchor, tối hôm trước." },
      { pic: "act-laptop" },
      { listen: { who: "tom", audio: "Pete. You go home. I'll look after the lads. Don't worry about the money — it was never about the money.", tr: { vi: "Pete. Cậu về nhà đi. Tôi sẽ lo cho tụi nhỏ. Đừng lo chuyện tiền — chuyện này chưa bao giờ là vì tiền." },
        qs: [
          { q: { en: "What does Tom tell Pete to do?", vi: "Tom bảo Pete làm gì?" }, opts: ["Go home", "Find the lads", "Pay the money"], a: 0 },
          { q: { en: "Who will Tom look after?", vi: "Tom sẽ lo cho ai?" }, opts: ["Pete", "The boat", "The lads"], a: 2 },
        ] } },
      { item: "pub_tape", quiet: true },
      { if: s => s.has("voicemail"), then: [
        { fx: "ripple" },
        { think: { en: "That voice. Calm. Older. Used to the sea. You've heard it before — on Kieran's phone. 'Don't go back to Gull Point.'", vi: "Giọng nói ấy. Điềm tĩnh. Lớn tuổi. Quen với biển. Bạn đã nghe nó — trong điện thoại của Kieran. “Đừng về Gull Point.”" } },
        { set: { tom_voice: 1 } } ] },
      { say: "ruth", en: "'The lads.' Which lads, Mr Ward?", vi: "“Tụi nhỏ.” Tụi nhỏ nào, ông Ward?" },
      { say: "tom", en: "Deckhands. I'm a captain. I look after my crew.", vi: "Thuỷ thủ. Tôi là thuyền trưởng. Tôi lo cho thuỷ thủ đoàn của mình." },
      { say: "ruth", en: "My colleague will ask the questions. I'll listen.", vi: "Đồng nghiệp tôi sẽ hỏi. Tôi chỉ nghe." },
      { hide: "ruth" },
      { meter: { key: "tom", label: { en: "Tom", vi: "Tom" }, max: 4, min: -2, icon: "⚓", color: "#9cc0a8" } },
      { set: { tom: 0 } },
      { choice: [
        { tag: "open", en: "Tell me about last night. In your own words.", vi: "Kể tôi nghe về đêm qua. Theo cách của ông.", add: { tom: 1 }, then: [
          { say: "tom", en: "I was on the Marta. Alone. I mended nets till two. I heard the police cars at three.", vi: "Tôi ở trên tàu Marta. Một mình. Vá lưới tới hai giờ. Ba giờ thì nghe tiếng xe cảnh sát." } ] },
        { tag: "press", en: "A boy is dead because of you. Just admit it.", vi: "Một đứa trẻ đã chết vì ông. Nhận đi.", add: { tom: -2 }, then: [
          { say: "tom", face: "angry", en: "Then charge me.", vi: "Vậy thì buộc tội tôi đi." } ] },
        { tag: "lead", en: "You argued with Pete about money, didn't you?", vi: "Ông cãi nhau với Pete về tiền, đúng không?", add: { tom: -1 }, then: [
          { say: "tom", en: "You heard the tape. It was never about the money.", vi: "{Cc} nghe băng rồi đấy. Chưa bao giờ là chuyện tiền." } ] },
      ] },
      { say: "tom", en: "You're the new one. The trainee.", vi: "{Cc} là người mới. Tập sự." },
      { choice: [
        { tag: "kind", en: "Kieran is safe. I thought you'd want to know.", vi: "Kieran an toàn. Tôi nghĩ ông muốn biết điều đó.", if: s => s.f.gp !== "told", add: { tom: 2 }, then: [
          { say: "tom", face: "soft", en: "…Good. That's good.", vi: "…Tốt. Thế là tốt." },
          { think: { en: "He didn't ask 'who is Kieran'.", vi: "Ông ấy không hỏi “Kieran là ai”." } } ] },
        { tag: "direct", need: "T1", lockHint: { en: "You need to know what 'Run!' really means here.", vi: "Cần hiểu tiếng “Chạy đi!” thật ra là gì." }, intuition: true, en: "Someone shouted 'Run!' on the pier. To a boy running away. Was that you?", vi: "Có người hét “Chạy đi!” trên cầu tàu. Với một cậu bé đang chạy trốn. Là ông sao?", add: { tom: 2 }, then: [
          { say: "tom", face: "sad", en: "No. If I'd been there, nobody would have needed to run.", vi: "Không. Nếu tôi có mặt ở đó, đã chẳng ai phải chạy." } ] },
        { tag: "open", en: "Those 'lads'. Where do they come from?", vi: "Những “đứa nhỏ” đó. Chúng từ đâu đến?", add: { tom: 1 }, then: [
          { say: "tom", en: "Bus stations. Train stations. Nowhere. Same place they go back to, if nobody helps.", vi: "Bến xe. Nhà ga. Chẳng nơi nào cả. Rồi cũng quay về chính chỗ đó, nếu không ai giúp." } ] },
        { tag: "press", en: "We have your voice on the boy's phone. Explain that.", vi: "Chúng tôi có giọng ông trong điện thoại thằng bé. Giải thích đi.", if: s => s.f.tom_voice, add: { tom: -1, ruth: 1 }, then: [
          { say: "tom", face: "angry", en: "I told a frightened boy not to go back to a bad place. Arrest me for that.", vi: "Tôi bảo một đứa trẻ đang sợ đừng quay về chỗ tồi tệ. Bắt tôi vì thế đi." } ] },
      ] },
      { if: s => (+s.f.tom || 0) >= 2, then: [
        { set: { c2_tom: "open" } },
        { say: "tom", face: "sad", en: "Nine. I've taken nine of them north. To my sister in Berwick. Away from here.", vi: "Chín. Tôi đã đưa chín đứa lên phía bắc. Tới chỗ em gái tôi ở Berwick. Rời khỏi chốn này." },
        { say: "tom", en: "Danny was going to be number ten. Thursday. Four in the morning.", vi: "Danny lẽ ra là đứa thứ mười. Thứ Năm. Bốn giờ sáng." },
        { fx: "flash" },
        { truth: "T5" },
        { say: "tom", whisper: true, en: "Your brother. I know who you are. He talks about you. Ask the lighthouse.", vi: "Em trai {cc}. Tôi biết {cc} là ai. Nó hay kể về {cc}. Hỏi ngọn hải đăng ấy." },
        { think: { en: "He talks. Present tense. Sam is alive.", vi: "“Nó hay kể.” Thì hiện tại. Sam còn sống." } },
        { fx: "heartbeat" } ],
        else: [
        { set: { c2_tom: "shut" } },
        { say: "tom", face: "angry", en: "I've said enough. Charge me or let me go.", vi: "Tôi nói đủ rồi. Buộc tội tôi hoặc thả tôi ra." },
        { n: { en: "He turns to the wall. The interview is over.", vi: "Ông quay mặt vào tường. Buổi thẩm vấn kết thúc." } } ] },
      { meter: "tom", off: true },
      { hide: "*" }, { mood: null },
      { go: "c2_corridor" },
    ],

    // ── hành lang: nói thật với Ruth về Sam?
    c2_corridor: [
      { bg: "corridor" },
      { show: "ruth", at: "c" },
      { say: "ruth", en: "You did well in there. He doesn't talk to police. He talked to you.", vi: "Trong đó {cc} làm tốt. Ông ta không nói chuyện với cảnh sát. Nhưng đã nói với {cc}." },
      { fill: { prompt: { en: "Ruth asks politely. Choose the polite form.", vi: "Ruth hỏi lịch sự. Chọn cách nói lịch sự." },
        t: { en: "___ you mind if I ask you something personal?", vi: "{Cc} có phiền nếu tôi hỏi một chuyện riêng không?" }, opts: ["Would", "Do", "Can"], a: 0,
        why: { en: "'Would you mind if…' is the most polite way to ask. 'Do you mind' is fine too, but less soft.", vi: "“Would you mind if…” là cách hỏi lịch sự nhất. “Do you mind” cũng được nhưng kém mềm mỏng hơn." } } },
      { say: "ruth", en: "Would you mind if I asked you something personal? Why Port Halden? Nobody asks to come here.", vi: "{Cc} có phiền nếu tôi hỏi chuyện riêng không? Sao lại là Port Halden? Chẳng ai xin về đây cả." },
      { if: s => s.f.told_sam, then: [
        { set: { c2_sam: "known" } },
        { say: "ruth", face: "soft", en: "No — I know. Your brother. I've asked missing persons to send me everything they have on Sam.", vi: "Thôi — tôi biết rồi. Em trai {cc}. Tôi đã nhờ bên người mất tích gửi hết những gì họ có về Sam." },
        { add: { ruth: 1 } } ],
        else: [
        { choice: [
          { tag: "direct", en: "My brother Sam is missing. His last postcard came from here.", vi: "Em trai tôi, Sam, mất tích. Tấm bưu thiếp cuối cùng gửi từ đây.", set: { c2_sam: "told" }, add: { ruth: 2 }, then: [
            { say: "ruth", face: "surprised", en: "…And you didn't think to tell me on day one.", vi: "…Và {cc} không nghĩ tới việc nói với tôi ngay ngày đầu." },
            { say: "ruth", face: "soft", en: "Thank you for telling me now. From today, we look for him together. Properly.", vi: "Cảm ơn vì đã nói bây giờ. Từ hôm nay, ta cùng tìm cậu ấy. Đàng hoàng." } ] },
          { tag: "lie", en: "Cheap rent. Fresh air.", vi: "Tiền thuê rẻ. Không khí trong lành.", set: { c2_sam: "hid" }, add: { lie: 1, ruth: -1 }, then: [
            { say: "ruth", face: "cold", en: "Hm. The rent is cheap because nobody wants to live here.", vi: "Hừm. Tiền thuê rẻ vì chẳng ai muốn sống ở đây." },
            { if: s => s.f.c2_ask === "front" && s.f.owen_sam, then: [
              { think: { en: "Owen already knows about Sam. Sooner or later, Ruth will hear it from him. Not from you.", vi: "Owen đã biết chuyện Sam. Sớm muộn Ruth sẽ nghe từ anh ta. Không phải từ bạn." } },
              { set: { owen_knows: 1 } } ] } ] },
        ] } ] },
      { say: "ruth", en: "The mortuary called. They want someone to look at him. Come with me.", vi: "Nhà xác vừa gọi. Họ cần người nhìn mặt cậu ấy. Đi với tôi." },
      { hide: "*" },
      { go: "c2_morgue" },
    ],

    c2_morgue: [
      { cp: "c2_morgue" },
      { bg: "morgue" }, { mood: "cold" }, { amb: "hall" },
      { n: { en: "6:15 p.m. The mortuary is cold and very quiet. A trolley behind the glass. A white sheet.", vi: "6 giờ 15 tối. Nhà xác lạnh và im phăng phắc. Một chiếc xe đẩy sau tấm kính. Một tấm vải trắng." } },
      { show: "ruth", at: "l" },
      { say: "ruth", en: "You don't have to look. I can do it.", vi: "{Cc} không cần phải nhìn. Để tôi." },
      { think: { en: "Nineteen. Dark hair, the report said. Sam has dark hair.", vi: "Mười chín tuổi. Tóc đen, biên bản ghi vậy. Sam tóc đen." } },
      { choice: [
        { en: "I'll look.", vi: "Tôi sẽ nhìn.", add: { ruth: 1 } },
        { en: "…Please. You do it.", vi: "…Làm ơn. Bà làm đi.", then: [
          { say: "ruth", en: "No. I think you need to see this one yourself.", vi: "Không. Tôi nghĩ người này {cc} cần tự mình thấy." } ] },
      ] },
      { hide: "*" },
      { fx: "heartbeat" },
      { qte: { prompt: { en: "Your hands are shaking. Hold steady…", vi: "Tay bạn run. Giữ cho vững…" }, kind: "hold", hold: 1600, ms: 6000, key: "c2_steady",
        fail: [{ n: { en: "Your hand jerks. The sheet slides off in one go.", vi: "Tay bạn giật lên. Tấm vải tuột hẳn xuống." } }] } },
      { cg: "cg-morgue" }, { cam: "push", ms: 14000 },
      { wait: 900 },
      { n: { en: "Not Sam.", vi: "Không phải Sam." } },
      { n: { en: "Relief hits you so hard you have to hold the wall. Then the guilt comes, right behind it.", vi: "Cảm giác nhẹ nhõm ập tới mạnh đến mức bạn phải vịn tường. Rồi cảm giác tội lỗi theo ngay sau." } },
      { if: s => s.f.saw_danny, then: [
        { think: { en: "Green laces. 'That's Danny's,' Kieran said.", vi: "Dây giày xanh. “Của Danny,” Kieran đã nói vậy." } } ] },
      { if: s => s.has("sam_jacket") || s.f.c2_together, then: [
        { think: { en: "You've seen this face before. In Maggie's photo — next to the boy in the green parka.", vi: "Bạn từng thấy gương mặt này. Trong tấm ảnh ở quán Maggie — cạnh cậu trai mặc parka xanh." } } ] },
      { cg: null }, { cam: null },
      { show: "ruth", at: "c", face: "soft" },
      { say: "ruth", en: "His name is Danny Reece. Nineteen. His mum reported him missing from Leeds last year. Nobody looked very hard.", vi: "Tên cậu ấy là Danny Reece. Mười chín tuổi. Mẹ cậu báo mất tích ở Leeds năm ngoái. Chẳng ai tìm kỹ cả." },
      { word: "identify" },
      { if: s => s.f.c2_sam === "told" || s.f.c2_sam === "known", then: [
        { say: "ruth", face: "soft", en: "Danny and Sam left Leeds in the same month. I think they were friends. I'm sorry.", vi: "Danny và Sam rời Leeds cùng một tháng. Tôi nghĩ hai đứa là bạn. Tôi rất tiếc." } ],
        else: [
        { think: { en: "Leeds. Sam left Leeds the same month. Danny was Sam's best friend. You never told Ruth.", vi: "Leeds. Sam cũng rời Leeds tháng đó. Danny là bạn thân nhất của Sam. Và bạn chưa từng kể với Ruth." } } ] },
      { mood: null },
      { hide: "*" },
      { n: { en: "Outside, the sea is black. Somewhere out there, Sam is alive — or he was, three days ago.", vi: "Bên ngoài, biển đen kịt. Đâu đó ngoài kia, Sam vẫn sống — hoặc ít nhất là ba ngày trước." }, pic: "act-chips" },
      { if: s => s.truth("T5") && s.f.c2_tom === "open", then: [
        { think: { en: "'Ask the lighthouse.' There's only one lighthouse in Port Halden. Gull Head. It's been closed for years.", vi: "“Hỏi ngọn hải đăng ấy.” Port Halden chỉ có một ngọn hải đăng. Gull Head. Đã bỏ hoang nhiều năm." } },
        { note: { en: "Tom: 'Ask the lighthouse.' — Gull Head lighthouse?", vi: "Tom: “Hỏi ngọn hải đăng ấy.” — Hải đăng Gull Head?" } },
        { end: "c2_light" } ],
        else: [{ end: "c2_silent" }] },
    ],
  },

  endings: {
    c2_light: { ch: 2, next: "c3", nextTitle: { en: "Chapter 3 — Witness", vi: "Chương 3 — Nhân chứng" }, title: { en: "The Lighthouse", vi: "Ngọn hải đăng" },
      sum: { en: "Danny is dead. Tom trusted you. Sam is alive — somewhere near the lighthouse.", vi: "Danny đã chết. Tom tin bạn. Sam còn sống — đâu đó gần ngọn hải đăng." },
      text: { en: "A captain who saves children. A chip shop that keeps their debts. And a lighthouse that has been dark for twenty years — but maybe not empty.", vi: "Một thuyền trưởng cứu trẻ con. Một quán cá chiên giữ sổ nợ của chúng. Và ngọn hải đăng đã tắt đèn hai mươi năm — nhưng có lẽ không trống rỗng." } },
    c2_silent: { ch: 2, next: "c3", nextTitle: { en: "Chapter 3 — Witness", vi: "Chương 3 — Nhân chứng" }, title: { en: "Silent Sea", vi: "Biển lặng" },
      sum: { en: "Danny is dead. Tom said nothing. You still don't know where Sam is.", vi: "Danny đã chết. Tom không nói gì. Bạn vẫn chưa biết Sam ở đâu." },
      text: { en: "The captain kept his secrets. The sea kept its own. You have a dead boy's name and a living boy's jacket — and nowhere to go.", vi: "Ông thuyền trưởng giữ bí mật của mình. Biển cũng giữ bí mật của nó. Bạn có tên một cậu bé đã chết và chiếc áo của một cậu bé còn sống — mà chẳng biết đi đâu." } },
  },
});
