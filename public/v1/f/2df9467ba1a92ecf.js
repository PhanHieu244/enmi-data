// BETWEEN TIDES · CHƯƠNG 5 — ĐIỀU CỒN CÁT GIỮ (01:20 → 02:20).
// Văn: ../../../GiuaHaiConNuoc-truyen-ch5.md (+ Nhánh rẽ) · Thiết kế §5 Ch5, §10b, “Luật cân bằng cho game”.
// Đọc cờ: callum_threat (Ch4 dọa → lạnh, đã ném sổ cho bạn, không kể “I told Mam”) · helen_promise (Helen ở phòng khám / ở buổi canh)
//   · helen_box_early · gideon_private (“Keys are in it”) · leo (độ ấm khi tới + tín hiệu cuối chương) · callum.
// Đặt cờ: p_anna_talking · p_nell_knew (nếu không dọa) · c5_callum_missed (cuộc gọi nhỡ 21:12) · p_fetched (dòng bút chì) · p_second_blow (suy luận đúng)
// p_others_cleared chỉ đặt sớm khi đã có nhật ký cuộc gọi Gideon + lời Helen về bốt; Ch6 kiểm lại từng nguồn.
//   · dunes_with ("leo"|"helen"|"callum"|"alone"|"wait"). “wait” = THẤT BẠI MỀM: bỏ cảnh cồn cát (không hộp sọ), vẫn tới hết chương.
// Đồ vật: logbook (nếu chưa có từ Ch4) · peg · skull. Sự thật: T10, T1, T12.
StoryEngine.chapter({
  scenes: {
    "surgery-inside": { kind: "bedroom", name: { en: "The surgery", vi: "Phòng khám" }, amb: "night" },
    "act-cuff-callum": {}, "it-peg": {}, "it-skull": {}, "it-testimony": {},
  },
  // Lời khai là thẻ hồ sơ, dùng cùng hộp sọ trong suy luận. Không tự trao ở nhánh bỏ lỡ.
  items: {
    c5_anna_testimony: { kind: "testimony", icon: "doc", art: "it-testimony", keep: true,
      name: { en: "Callum: Anna spoke after the crash", vi: "Callum: Anna còn nói sau cú tông" },
      brief: { en: "A broken leg. She asked for an ambulance and the police.", vi: "Chân bị gãy. Bà nhờ gọi xe cấp cứu và cảnh sát." },
      desc: { en: "Callum says Anna spoke to him after his truck struck her. This is his testimony, not a medical finding.", vi: "Callum nói Anna còn nói với anh sau khi bị xe tải tông. Đây là lời khai của anh, chưa phải kết luận y khoa." } },
  },
  words: {
    "was stood": { vi: "văn nói vùng Bắc Anh, = was standing (đang đứng)", ex: "She was stood behind her car with a torch." },
    "windscreen": { vi: "kính chắn gió (ô tô)", ex: "I didn't see her till she was in the windscreen." },
    "strapped": { vi: "(vết thương) được băng lại", ex: "Next morning Dr Vosper strapped it up." },
    "X-ray": { vi: "chụp X-quang", ex: "Never sent me for an X-ray." },
    "logbook": { vi: "sổ ghi chép (ở đây: sổ đo nước)", ex: "It is a cheap logbook with a cracked spine." },
    "survey pegs": { vi: "cọc mốc khảo sát", ex: "Wooden survey pegs with orange tape." },
    "borehole": { vi: "lỗ khoan thăm dò", ex: "N-07 · N-08 · N-09 — BOREHOLE" },
    "marram grass": { vi: "cỏ gai cát (cỏ mọc trên cồn cát ven biển)", ex: "The marram grass hisses in the wind." },
    "evidence bag": { vi: "túi vật chứng", ex: "He takes an evidence bag from his jacket." },
    "bonnet": { vi: "nắp ca-pô (nắp máy ô tô)", ex: "He lays his hand flat on the bonnet." },
    "fracture": { vi: "chỗ vỡ, chỗ gãy (xương)", ex: "Fracture at the back. Round, like a fist." },
    "pathologist": { vi: "bác sĩ pháp y (giải phẫu bệnh)", ex: "I'm a GP. Not a pathologist." },
    "darning": { vi: "chỗ mạng (vá bằng len)", ex: "The grey darning. The big clumsy stitches." },
  },

  recap: [
    { ch: 5, t: { en: "On the Mairi Rose, Callum told you about 2004: he was fourteen, driving Uncle Tom's truck with the lights off. Your mother was alive after the crash — she was talking to him.", vi: "Trên thuyền Mairi Rose, Callum kể chuyện năm 2004: anh mười bốn tuổi, lái xe tải của bác Tom, tắt đèn. Mẹ bạn còn sống sau cú tông — bà còn nói với anh." } },
    { ch: 5, if: s => !s.f.callum_threat, t: { en: "Callum ran home and told his mother. She put him to bed and said he'd dreamed it.", vi: "Callum chạy về nhà, kể với mẹ. Bà đặt anh lên giường và bảo anh nằm mơ." } },
    { ch: 5, if: s => !!s.f.callum_threat, t: { en: "Callum wouldn't say what happened after he got home. Not to you. Not tonight.", vi: "Callum không chịu nói chuyện gì xảy ra sau khi anh về nhà. Không với bạn. Không phải đêm nay." } },
    { ch: 5, t: { en: "Callum's phone: MISSED CALL — Tom — 21:12. Tom rang him, then went out to the box.", vi: "Điện thoại Callum: cuộc gọi nhỡ — Tom — 21:12. Tom gọi cho anh, rồi ra chòi." } },
    { ch: 5, t: { en: "Tom's logbook: 'road flooded 20:30' in blue ink over a crossed-out reading. Under it, in pencil: 'Fetched 20:45. Told the crash did it. I believed it.' And a map of the north dunes with an X.", vi: "Sổ của Tom: “road flooded 20:30” bằng mực xanh đè lên số đo bị gạch. Bên dưới, bút chì: “Fetched 20:45. Told the crash did it. I believed it.” Và bản đồ cồn cát phía bắc có một dấu X." } },
    { ch: 5, t: { en: "At the vigil Fergus said: Gideon walked home at one. Nell went up about one.", vi: "Ở buổi canh, Fergus nói: Gideon đi bộ về lúc một giờ. Nell lên lầu khoảng một giờ." } },
    { ch: 5, if: s => s.f.dunes_with === "leo", t: { en: "You went up to the north dunes with Leo.", vi: "Bạn lên cồn cát phía bắc cùng Leo." } },
    { ch: 5, if: s => s.f.dunes_with === "helen", t: { en: "You fetched Dr Vosper and went up to the north dunes with her.", vi: "Bạn gọi bác sĩ Vosper và cùng bà lên cồn cát phía bắc." } },
    { ch: 5, if: s => s.f.dunes_with === "callum", t: { en: "You went back for Callum. He came up to the dunes with you.", vi: "Bạn quay lại tìm Callum. Anh đi cùng bạn lên cồn cát." } },
    { ch: 5, if: s => s.f.dunes_with === "alone", t: { en: "You went up to the dunes alone with Skerry.", vi: "Bạn lên cồn cát một mình với Skerry." } },
    { ch: 5, if: s => s.f.dunes_with === "wait", t: { en: "You waited for the morning. Leo went up alone and found the sand raked smooth. Nothing was left.", vi: "Bạn chờ tới sáng. Leo lên một mình và thấy cát đã bị cào phẳng. Không còn gì." } },
    { ch: 5, if: s => s.f.dunes_with && s.f.dunes_with !== "wait", t: { en: "In the dunes: pegs pulled up, a spade, someone crawling away through the grass, an old diesel starting with no lights. Skerry didn't bark. Then the skull. You put on your mother's ring.", vi: "Ở cồn cát: cọc mốc bị nhổ, một cái xẻng, có người bò đi trong cỏ, một máy diesel cũ nổ máy không bật đèn. Skerry không sủa. Rồi hộp sọ. Bạn đeo nhẫn của mẹ." } },
    { ch: 5, if: s => !!s.f.dunes_with, t: { en: "At ten past two the estate's old Land Rover in Gideon's yard was still warm.", vi: "Hai giờ mười, chiếc Land Rover cũ của điền trang trong sân nhà Gideon vẫn còn ấm máy." } },
    { ch: 5, if: s => !!s.f.p_second_blow, t: { en: "Dr Vosper read the skull: a round fracture at the back. 'A serious blow. I wouldn't expect anyone to speak after that.'", vi: "Bác sĩ Vosper đọc hộp sọ: vết vỡ tròn ở phía sau. “Một cú đập nặng. Tôi không nghĩ người bị như vậy còn nói được.”" } },
    { ch: 5, if: s => !!s.f.helen_promise && s.f.dunes_with && s.f.dunes_with !== "wait", t: { en: "Dr Vosper admitted she strapped Callum's broken wrist the morning after, in 2004, and never asked.", vi: "Bác sĩ Vosper thừa nhận năm 2004 bà băng cổ tay gãy cho Callum sáng hôm sau, và không hề hỏi." } },
    { ch: 5, t: { en: "Callum touched the darned cuff of your jumper: 'That's my jumper. I tore it that night. Getting out of the truck.'", vi: "Callum chạm vào cổ tay áo len đã mạng của bạn: “Đó là áo len của tôi. Tôi làm rách nó đúng đêm ấy. Lúc nhảy ra khỏi xe tải.”" } },
    { ch: 5, if: s => (s.f.leo || 0) >= 2, t: { en: "Leo, going back to the station: 'Whatever you find, you ring me first.'", vi: "Leo, trên đường về trạm: “Tìm thấy gì thì gọi tôi trước tiên.”" } },
    { ch: 5, if: s => (s.f.leo || 0) < 2, t: { en: "Leo, going back to the station: 'Stay at the Lantern.'", vi: "Leo, trên đường về trạm: “Ở yên trong quán The Lantern.”" } },
  ],

  flow: [
    { ch: 5, row: 0, id: "c5_open", kind: "cp", scene: "harbour", label: { en: "The Mairi Rose", vi: "Thuyền Mairi Rose" }, sum: { en: "Callum tells you about 2004.", vi: "Callum kể chuyện năm 2004." } },
    { ch: 5, row: 1, id: "c5_book", kind: "cp", scene: "harbour", label: { en: "Tom's book", vi: "Cuốn sổ của Tom" }, sum: { en: "Blue ink, and pencil underneath.", vi: "Mực xanh, và bút chì bên dưới." } },
    { ch: 5, row: 2, id: "c5_vigil", kind: "cp", scene: "lantern", label: { en: "The vigil", vi: "Buổi canh" }, sum: { en: "Who has gone home?", vi: "Ai đã về nhà?" } },
    { ch: 5, row: 3, kind: "opt", key: "dunes_with", val: "leo", label: { en: "With Leo", vi: "Cùng Leo" }, sum: { en: "Leo stays beside you as you follow the map.", vi: "Leo đi cạnh bạn khi hai người lần theo bản đồ." }, hint: { en: "Leo is going up to the dunes.", vi: "Leo lên cồn cát." } },
    { ch: 5, row: 3, kind: "opt", key: "dunes_with", val: "helen", label: { en: "With Dr Vosper", vi: "Cùng bác sĩ Vosper" }, sum: { en: "The doctor reads the skull by torchlight.", vi: "Bà bác sĩ đọc hộp sọ dưới đèn pin." }, hint: { en: "Only if you kept your promise to her.", vi: "Chỉ khi bạn đã hứa với bà." } },
    { ch: 5, row: 3, kind: "opt", key: "dunes_with", val: "callum", label: { en: "With Callum", vi: "Cùng Callum" }, sum: { en: "Callum knows the spade.", vi: "Callum nhận ra cái xẻng." }, hint: { en: "He doesn't ask to come.", vi: "Anh không xin đi theo." } },
    { ch: 5, row: 3, kind: "opt", key: "dunes_with", val: "alone", label: { en: "Alone", vi: "Một mình" }, sum: { en: "Just you, the dog and the moon.", vi: "Chỉ có bạn, con chó và vầng trăng." }, hint: { en: "Leo is going up to the dunes.", vi: "Leo lên cồn cát." } },
    { ch: 5, row: 3, kind: "opt", key: "dunes_with", val: "wait", label: { en: "Wait for the morning", vi: "Chờ tới sáng" }, sum: { en: "The sand is raked smooth. Nothing is left.", vi: "Cát bị cào phẳng. Không còn gì." }, hint: { en: "It's the middle of the night.", vi: "Đang giữa đêm." } },
    { ch: 5, row: 4, id: "c5_dunes", kind: "cp", scene: "dunes", label: { en: "The north dunes", vi: "Cồn cát phía bắc" }, sum: { en: "Pulled pegs. A spade. Something pale in the sand.", vi: "Cọc bị nhổ. Một cái xẻng. Một thứ nhợt nhạt trong cát." } },
    { ch: 5, row: 4, id: "c5_wait", kind: "cp", scene: "harbour", label: { en: "Waiting for the light", vi: "Chờ trời sáng" }, sum: { en: "Leo goes up alone.", vi: "Leo đi một mình." } },
    { ch: 5, row: 5, id: "c5_surgery", kind: "cp", scene: "surgery", label: { en: "The surgery", vi: "Phòng khám" }, sum: { en: "The doctor reads the skull.", vi: "Bà bác sĩ đọc hộp sọ." } },
    { ch: 5, row: 6, id: "c5_jumper", kind: "cp", scene: "harbour", label: { en: "The cuff", vi: "Cổ tay áo" }, sum: { en: "'That's my jumper.'", vi: "“Đó là áo len của tôi.”" } },
    { ch: 5, row: 9, id: "c5_end", kind: "end", label: { en: "What the Dunes Kept", vi: "Điều cồn cát giữ" } },
  ],

  nodes: {
    // ── 01:20 · THUYỀN MAIRI ROSE: Callum kể chuyện 2004
    c5_open: [
      { set: { goal: "c5_account" } },
      { cp: "c5_open" },
      { title: { ch: 5, en: "What the Dunes Kept", vi: "Điều cồn cát giữ" } },
      { bg: "harbour" }, { clock: "01:20" }, { amb: "sea" }, { mood: "night" },
      { if: s => s.f.callum_threat, then: [
        { show: "callum", at: "c", face: "angry" },
        { n: { en: "Callum moves to the wheelhouse door and folds his arms. Twenty past one. Your threat still hangs between you.", vi: "Callum lui tới cửa buồng lái, khoanh tay. Một giờ hai mươi. Lời đe dọa của bạn vẫn treo giữa hai người." }, on: "callum" },
        { n: { en: "Tom's book is inside your coat, where he shoved it. You can feel its corner against your ribs.", vi: "Cuốn sổ của Tom nằm trong áo khoác bạn, chỗ anh dúi vào. Bạn cảm thấy góc sổ cấn vào sườn." }, on: "callum" },
      ], else: [
        { show: "callum", at: "c", face: "sad" },
        { n: { en: "Twenty past one. Callum sits on the deck edge, hands between his knees. Out on the channel, the buoy light keeps blinking.", vi: "Một giờ hai mươi. Callum ngồi ở mép boong, hai tay buông giữa hai đầu gối. Ngoài kênh, ngọn đèn phao vẫn nhấp nháy." }, on: "callum" },
      ] },
      { n: { en: "You take one step back. His mouth keeps moving. For a moment, you cannot make the words join up.", vi: "Bạn lùi một bước. Miệng anh vẫn mấp máy. Một thoáng, bạn không ghép nổi những lời vừa nghe thành nghĩa." }, on: "callum" },
      {"say":"me","en":"Start again. Tell me what you did.","vi":"Nói lại đi. Kể cho tôi anh đã làm gì.","tone":"very quiet, containing shock"},
      { say: "callum", en: "I was fourteen. Small for my age. I had a girl on the mainland, or I thought I did.", vi: "Hồi đó tôi mười bốn. Nhỏ con so với tuổi. Tôi có một đứa bạn gái bên đất liền, hoặc tôi tưởng thế." },
      { say: "callum", en: "I took Uncle Tom's truck over that afternoon. He never locked it. Keys on the seat.", vi: "Chiều hôm đó tôi lấy xe tải của bác Tom chạy sang. Bác ấy chẳng bao giờ khóa xe. Chìa để sẵn trên ghế." },
      { say: "callum", en: "Coming back, I kept the lights off. So Mam wouldn't see from the pub.", vi: "Lúc về, tôi không bật đèn. Để mẹ tôi ở quán không nhìn thấy." },
      { truth: "T10" },
      { n: { en: "He looks out at the causeway. It is under water now, a flat black road with nothing on it.", vi: "Anh nhìn ra con đường ngầm. Giờ nó chìm dưới nước, một con đường đen phẳng lặng, không có gì trên đó." }, on: "callum" },
      { mood: "flashback" }, { amb: null }, { title: { en: "14 NOVEMBER 2004", vi: "14 THÁNG MƯỜI MỘT, 2004" } },
      { cg: "cg-2004-post" }, { cam: "push", ms: 12000 },
      { cam: null },
      { say: "callum", en: "Quarter past eight, near enough. There was a car stopped in the middle. Lights on.", vi: "Khoảng tám giờ mười lăm tối. Có một chiếc ô tô dừng giữa đường ngầm. Đèn bật." },
      { say: "callum", en: "She [[was stood]] behind her car with a torch, reading the post.", easy: "She was standing behind her car with a torch, reading the tide post.", vi: "Bà ấy đứng sau xe, cầm đèn pin, đọc số trên cọc đo." },
      { say: "callum", en: "I didn't see her till she was in the [[windscreen]].", vi: "Tới lúc bà ấy hiện ra ngay trước kính chắn gió tôi mới thấy." },
      { n: { en: "He stops. His right hand closes round his left wrist, like an old break that aches before rain.", vi: "Anh dừng lại. Bàn tay phải anh nắm lấy cổ tay trái, như một chỗ gãy cũ nhức lên trước cơn mưa." }, on: "callum" },
      { cam: null }, { sfx: "hit" }, { fx: "shake" }, { cg: "cg-2004-kneel" },
      { say: "callum", en: "Her leg went. My wrist went on the wheel. I got out. I knelt by her on the sand.", easy: "Her leg broke. My wrist broke on the wheel. I got out and knelt by her.", vi: "Chân bà ấy gãy. Cổ tay tôi gãy vì đập vào vô-lăng. Tôi xuống xe. Tôi quỳ bên bà ấy trên cát." },
      { say: "callum", face: "crying", en: "She was talking. She was talking to me.", vi: "Bà ấy còn nói. Bà ấy nói với tôi." },
      { set: { p_anna_talking: true } },
      { item: "c5_anna_testimony", quiet: true },
      { n: { en: "You find that you are holding the cuff of the jumper in your fist.", vi: "Bạn nhận ra mình đang nắm chặt cổ tay áo len trong lòng bàn tay." }, on: "callum" },
      { fx: "blur" },
      { say: "callum", whisper: true, en: "“Get help — ambulance —", vi: "“Đi gọi người — xe cấp cứu —" },
      { wait: 1400 },
      { say: "callum", whisper: true, en: "and the police, love —", vi: "cả cảnh sát nữa, cháu —" },
      { wait: 1400 },
      { say: "callum", whisper: true, en: "it's all right — you're a child —", vi: "không sao đâu — cháu còn nhỏ —" },
      { wait: 1800 },
      { say: "callum", whisper: true, en: "it was an accident…”", vi: "chỉ là tai nạn thôi…”" },
      { wait: 2200 },
      { n: { en: "You have never heard what your mother said after the crash. Now a fisherman gives you those words, twenty years late.", vi: "Bạn chưa bao giờ được nghe mẹ nói gì sau cú tông. Giờ một người đánh cá kể lại những lời ấy, muộn hai mươi năm." } },
      { think: { en: "It's all right. She said that. Lying on the sand with her leg broken, she said that to the boy who did it.", vi: "Không sao đâu. Mẹ đã nói thế. Nằm trên cát, chân gãy, mẹ nói thế với chính cậu bé đã gây ra chuyện ấy." } },
      { note: { en: "Callum, 2004: 'She was talking. She was talking to me.' — after the crash.", vi: "Callum, 2004: “Bà ấy còn nói. Bà ấy nói với tôi.” — sau cú tông." } },
      { n: { en: "For a while you can't see the buoy light at all.", vi: "Một lúc lâu, bạn không còn nhìn thấy ngọn đèn phao nữa." } },
      { cg: null }, { mood: "night" }, { amb: "sea" }, { wait: 1200 },
      { go: "c5_after" },
    ],

    // ── Sau cú tông: chạy về, “I told Mam” (không dọa) · bác sĩ băng tay · đêm nay · cuộc gọi nhỡ 21:12
    c5_after: [
      { say: "callum", en: "I heard “police”. That's all I heard. I left the truck and I ran.", vi: "Tôi nghe thấy chữ “cảnh sát”. Chỉ nghe thấy mỗi chữ ấy. Tôi bỏ xe lại và chạy." },
      { say: "callum", en: "I ran home. Went in the back. Didn't want the bar seeing my arm. Rooms were empty. November.", vi: "Tôi chạy về nhà. Vào bằng cửa sau. Không muốn người trong quán thấy cánh tay tôi. Phòng trọ thì trống. Tháng Mười một mà." },
      { set: { c5_back_door: true } },
      { if: s => !s.f.callum_threat, then: [
        { say: "callum", en: "I told Mam. I don't remember what. She put me to bed and said I'd dreamed it.", vi: "Tôi kể với mẹ. Tôi không nhớ đã kể những gì. Mẹ đưa tôi lên giường rồi bảo là tôi nằm mơ." },
        { say: "callum", en: "I let her say it. That was easier than asking who she'd called.", vi: "Tôi để mẹ nói thế. Làm vậy dễ hơn hỏi xem mẹ đã gọi cho ai." },
        { set: { p_nell_knew: true, c5_mam_account: true } },
        { note: { en: "Callum, 2004: 'I told Mam… She put me to bed and said I'd dreamed it.'", vi: "Callum, 2004: “Tôi kể với mẹ… Mẹ đưa tôi lên giường rồi bảo là tôi nằm mơ.”" } },
        { n: { en: "He says it carefully. Each word gives him somewhere to stop. He doesn't stop.", vi: "Anh nói từng lời thận trọng. Mỗi từ đều cho anh một chỗ để dừng. Nhưng anh vẫn nói tiếp." }, on: "callum" },
      ], else: [
        { say: "callum", face: "angry", en: "I don't remember the rest. I was fourteen and my arm was broke.", vi: "Phần sau tôi không nhớ. Hồi đó tôi mười bốn tuổi, tay thì gãy." },
        { n: { en: "He says it to the deck, not to you. Whatever he remembers, he isn't giving it to you tonight.", vi: "Anh nói điều đó với mặt boong, không phải với bạn. Anh nhớ gì thì nhớ, đêm nay anh không trao nó cho bạn." }, on: "callum" },
      ] },
      { say: "callum", en: "Next morning Dr Vosper [[strapped]] it up. Never sent me for an [[X-ray]]. Wrote I'd fallen off the harbour wall.", vi: "Sáng hôm sau bác sĩ Vosper băng tay cho tôi. Chẳng cho tôi đi chụp X-quang. Ghi là tôi ngã từ tường chắn sóng." },
      { say: "callum", en: "By dinner the whole island knew a woman had gone off the causeway in the night. Taken by the tide.", vi: "Tới trưa cả đảo đều biết có một người đàn bà mất tích trên đường ngầm trong đêm. Bị nước cuốn đi." },
      { say: "callum", face: "crying", en: "After that I knew. Twenty years I've known. I killed her and let the sea take the blame.", vi: "Sau đó thì tôi biết. Hai mươi năm nay tôi biết. Tôi đã giết bà ấy rồi để biển gánh tội thay." },
      {"say":"me","en":"You didn't go back?","vi":"Anh không quay lại sao?"},
      {"say":"callum","en":"I watched the window till morning. Never opened the door.","vi":"Tôi nhìn ra cửa sổ tới sáng. Không hề mở cửa.","tone":"ashamed, without seeking sympathy"},
      { n: { en: "He turns his face to you for the first time.", vi: "Lần đầu tiên, anh quay mặt về phía bạn." }, on: "callum" },
      { say: "callum", face: "sad", en: "Every big tide, I go out to the buoys. Every one. I sit out there by the box.", vi: "Đợt triều lớn nào tôi cũng ra chỗ phao. Đợt nào cũng ra. Tôi ngồi ngoài đó, cạnh cái chòi." },
      { n: { en: "You ask him about tonight. He doesn't pretend any more.", vi: "Bạn hỏi anh về đêm nay. Anh không còn giả vờ nữa." }, on: "callum" },
      { say: "callum", en: "After nine I went to his back gate. I'd been every week since the summer. Begging.", vi: "Sau chín giờ tối tôi ra cổng sau nhà bác ấy. Từ mùa hè tới giờ tuần nào tôi cũng tới. Van xin." },
      { say: "callum", en: "I had him by the arms. Hard. I know I did.", vi: "Tôi túm lấy hai cánh tay bác ấy. Chặt lắm. Tôi biết." },
      { say: "callum", en: "He tapped his chest. Here. “It's all in the book. Anna's child is at the bar. Come with me to the police.”", vi: "Bác ấy gõ gõ vào ngực. Chỗ này. “Mọi chuyện ở cả trong cuốn sổ. Con của Anna đang ở quán. Đi với bác tới cảnh sát.”" },
      { say: "callum", en: "I said no. I said, I've got a little girl. He said, she had a child too.", vi: "Tôi bảo không. Tôi bảo, cháu có đứa con gái nhỏ. Bác ấy bảo, bà ấy cũng có con." },
      { n: { en: "Callum takes a long, long breath.", vi: "Callum hít một hơi thật dài." }, on: "callum" },
      { say: "callum", en: "I had one at the pub door and I took the boat out. Out at the buoys I saw his lamp. Waving.", vi: "Tôi đứng uống một ly ở cửa quán rồi đưa thuyền ra. Ngoài chỗ phao tôi thấy đèn bão của bác ấy. Đang vẫy." },
      { say: "callum", face: "ashamed", pic: "act-turnback", en: "I thought he wanted another row. I turned my back on him.", vi: "Tôi nghĩ bác ấy muốn cãi tiếp. Tôi quay lưng lại." },
      {"say":"me","en":"You saw him standing there.","vi":"Anh đã nhìn thấy ông ấy đứng đó."},
      {"say":"callum","en":"Standing. Waving. I didn't see what was happening to him. That's what I keep telling myself.","vi":"Đứng đó. Vẫy đèn. Tôi không thấy ông ấy đang bị làm sao. Tôi cứ tự nhủ như vậy.","tone":"flat with shame"},
      { n: { en: "Callum takes out his phone and opens the call list. The screen lights his face. He holds it out to you.", vi: "Callum lấy điện thoại ra, mở nhật ký cuộc gọi. Màn hình hắt sáng lên mặt anh. Anh đưa máy cho bạn." }, on: "callum" },
      { sfx: "buzz" }, { fx: "pulse" },
      { n: { en: "MISSED CALL — Tom — 21:12", vi: "MISSED CALL — Tom — 21:12 · Cuộc gọi nhỡ — Tom — 21:12." }, pic: "act-missed" },
      { say: "callum", en: "He never rings anyone. I didn't hear it. Engine.", vi: "Bác ấy chẳng bao giờ gọi cho ai. Tôi không nghe thấy. Tiếng máy." },
      { say: "callum", en: "He rang me. And then he went out there. For me.", vi: "Bác ấy gọi cho tôi. Rồi bác ấy ra ngoài đó. Vì tôi." },
      { n: { en: "You look at the time. Neither of you says what it means.", vi: "Bạn nhìn giờ cuộc gọi. Cả hai không ai nói ra điều đó nghĩa là gì." } },
      { note: { en: "Callum's phone: MISSED CALL — Tom — 21:12. (He was preparing the boat at the harbour. Engine.)", vi: "Điện thoại Callum: cuộc gọi nhỡ — Tom — 21:12. (Anh đang chuẩn bị thuyền ở bến. Tiếng máy.)" } },
      { set: { c5_callum_missed: true } },
      // Một cuộc gọi nhỡ không tự xóa nghi vấn với mọi người; Ch6 phải kiểm từng nguồn.
      { if: s => !!s.f.c3_gideon_call_seen && !!s.f.helen_box_early, then: [{ set: { p_others_cleared: true } }] },
      { go: "c5_book" },
    ],

    // ── Leo tới · cuốn sổ (compare: mắt thẩm định) · bản đồ dấu X
    c5_book: [
      { cp: "c5_book" },
      { sfx: "steps" },
      { n: { en: "Footsteps on the slipway. A torch. Leo comes down, out of breath from the station, and stops when he sees your faces.", vi: "Tiếng bước chân trên dốc bến. Một ánh đèn pin. Leo từ trạm đi xuống, thở hổn hển, rồi dừng lại khi nhìn thấy mặt hai người." } },
      { if: s => (s.f.leo || 0) >= 2, then: [
        { show: "leo", at: "l", face: "soft" },
        { n: { en: "He looks at you first. Not at Callum. You.", vi: "Anh nhìn bạn trước. Không phải Callum. Bạn." }, on: "leo" },
      ], else: [
        { show: "leo", at: "l", face: "cold" },
        { n: { en: "He looks at Callum, then at you — the way he looked at you in the station. Weighing.", vi: "Anh nhìn Callum, rồi nhìn bạn — đúng cái nhìn ở trạm cứu hộ. Cân nhắc." }, on: "leo" },
      ] },
      { say: "leo", en: "What's happened?", vi: "Có chuyện gì vậy ạ?" },
      { say: "me", en: "He's told me about 2004.", vi: "Anh ấy vừa kể với tôi chuyện năm 2004." },
      { if: s => s.f.callum_threat || s.has("logbook"), then: [
        { n: { en: "Callum doesn't move. You take Tom's book out of your coat, still in its plastic bag.", vi: "Callum không nhúc nhích. Bạn lấy cuốn sổ của Tom trong áo khoác ra, vẫn bọc trong túi ni-lông." } },
        { say: "callum", face: "angry", en: "From his coat. In the box. Inside pocket.", vi: "Lấy từ áo bác ấy. Trong chòi. Túi trong." },
        { n: { en: "He says it to Leo, not to you.", vi: "Anh nói với Leo, không phải với bạn." }, on: "callum" },
        { say: "callum", en: "I couldn't make myself read it.", vi: "Tôi không dám đọc nó." },
      ], else: [
        { n: { en: "Callum stands up. He unzips his oilskin and takes out something flat, wrapped in a plastic bag.", vi: "Callum đứng dậy. Anh kéo khóa áo vải dầu, lấy ra một vật dẹt bọc trong túi ni-lông." }, on: "callum" },
        { say: "callum", en: "From his coat. In the box. Inside pocket.", vi: "Lấy từ áo bác ấy. Trong chòi. Túi trong." },
        { say: "callum", en: "I couldn't make myself read it.", vi: "Tôi không dám đọc nó." },
      ] },
      { n: { en: "Leo writes Callum's words down before he takes the book. Then he checks the wrapper and holds it under the lamp.", vi: "Leo ghi lời Callum trước khi nhận cuốn sổ. Rồi anh kiểm tra lớp bọc, đưa sổ xuống dưới đèn." }, on: "leo" },
      { say: "leo", face: "cold", en: "You'll not go anywhere tonight, Callum.", easy: "You won't go anywhere tonight, Callum.", vi: "Đêm nay anh không được đi đâu hết, Callum." },
      { say: "callum", en: "Where would I go? Tide's in.", vi: "Tôi đi đâu được? Nước còn lớn thế kia." },
      { say: "callum", en: "I'll say it again. To you. In the morning. Properly.", vi: "Tôi sẽ kể lại. Với cậu. Sáng mai. Đàng hoàng." },
      { hide: "callum" },
      { sfx: "page" },
      { n: { en: "Under the harbour lamp, Leo opens the book. It is a cheap [[logbook]] with a cracked spine, the pages soft with salt.", vi: "Dưới ngọn đèn bến, Leo mở cuốn sổ. Một cuốn sổ nhật ký rẻ tiền, gáy nứt, giấy mềm đi vì muối." }, pic: "act-logbook", on: "leo" },
      { n: { en: "Forty years of tides. The same small, even numbers, page after page.", vi: "Bốn mươi năm con nước. Vẫn những con số nhỏ và đều ấy, trang này qua trang khác." }, on: "leo" },
      { sfx: "page" },
      { n: { en: "He turns back to November 2004. He doesn't need to search. The book falls open there by itself.", vi: "Anh lật về tháng Mười một năm 2004. Anh không cần tìm. Cuốn sổ tự mở ra đúng trang ấy." }, on: "leo" },
      { n: { en: "14.11.04 — 20:30 — 0.5 U (crossed out) · road flooded 20:30", vi: "14.11.04 — 20:30 — 0.5 U (crossed out) · road flooded 20:30 — dòng “20:30 — 0.5 U” bị gạch đi; bên dưới: “đường ngập lúc 20:30”." } },
      { say: "leo", en: "Blue ink. Everything else is pencil.", vi: "Mực xanh. Mọi chỗ khác đều viết bút chì." },
      { say: "leo", face: "sad", en: "Dad wrote his report from this page. “Road flooded at half past eight.” I've read it a hundred times.", vi: "Bố tôi viết biên bản dựa vào trang này. “Đường ngập lúc tám rưỡi tối.” Tôi đọc nó cả trăm lần rồi." },
      { n: { en: "He tilts the page to the lamp. Under the blue ink, very small, very faint, there is a line in pencil.", vi: "Anh nghiêng trang giấy về phía ánh đèn. Dưới dòng mực xanh, rất nhỏ, rất mờ, có một dòng bút chì." }, on: "leo" },
      { fx: "spotlight" }, { sfx: "sting" },
      { n: { en: "Fetched 20:45. Told the crash did it. I believed it.", vi: "Fetched 20:45. Told the crash did it. I believed it. — “Được đón lúc 20:45. Người ta bảo là do cú tông. Tôi đã tin.”" } },
      { if: s => s.f.callum_threat, then: [
        { think: { en: "You read that line already, on the boat, by the cabin light. Hearing it under the lamp is worse.", vi: "Bạn đã đọc dòng ấy rồi, trên thuyền, dưới ánh đèn ca-bin. Nghe nó dưới ngọn đèn bến còn tệ hơn." } },
      ] },
      { n: { en: "Nobody says anything. Callum reads it over Leo's shoulder. His lips move on the last three words.", vi: "Không ai nói gì. Callum đọc qua vai Leo. Môi anh mấp máy theo ba chữ cuối." } },
      { think: { en: "You have read a thousand amended claim forms. You know what a correction made afterwards looks like.", vi: "Bạn đã đọc cả nghìn tờ khai bồi thường bị sửa. Bạn biết một chỗ sửa sau khi sự việc xảy ra trông thế nào." } },
      {"think":{"en":"First separate the original measurement from the later account. Neither tells you yet who was with Anna.","vi":"Trước hết, tách số đo gốc khỏi lời ghi thêm. Chưa phần nào cho biết ai đã ở cùng Anna."}},
      { compare: {
        title: { en: "Assessor's eye — Tom's book, 14 November 2004", vi: "Mắt thẩm định — sổ của Tom, 14/11/2004" },
        left: { title: { en: "Any other night in the book", vi: "Mọi đêm khác trong sổ" }, lines: [
          { en: "Written in pencil, like every entry for forty years.", vi: "Viết bút chì, như mọi dòng suốt bốn mươi năm." },
          { en: "One reading: the time, then the height of the water.", vi: "Một số đo: giờ, rồi mực nước." },
          { en: "Nothing crossed out.", vi: "Không có gì bị gạch." },
          { en: "Nothing written underneath.", vi: "Không có gì viết bên dưới." },
          { en: "Small, even numbers.", vi: "Những con số nhỏ, đều." },
        ] },
        right: { title: { en: "14.11.04", vi: "14.11.04" }, lines: [
          { en: "'road flooded 20:30' — in blue ink.", vi: "“road flooded 20:30” — bằng mực xanh." },
          { en: "The real reading, 20:30 — 0.5 U: half a metre under the table. The road was dry.", vi: "Số đo thật, 20:30 — 0.5 U: thấp hơn bảng nửa mét. Mặt đường còn khô." },
          { en: "That reading is crossed out.", vi: "Số đo ấy bị gạch đi." },
          { en: "Under it, faint pencil: 'Fetched 20:45. Told the crash did it. I believed it.'", vi: "Bên dưới, bút chì mờ: “Fetched 20:45. Told the crash did it. I believed it.”" },
          { en: "Small, even numbers.", vi: "Những con số nhỏ, đều." },
        ] },
        diffs: [0, 2, 3], tries: 4,
        ok: [
          { think: { en: "At 20:30 the road was dry. Someone later changed that to 'flooded', using another pen. At 20:45, someone fetched Tom.", vi: "Lúc 20:30, đường còn khô. Về sau, có người dùng bút khác sửa thành “ngập”. Lúc 20:45, có người tới đón Tom." } },
        ],
        fail: [
          { think: { en: "Ink, not pencil. A number crossed out. A line written under it. Tom never wrote a page like this — except once.", vi: "Mực, không phải bút chì. Một con số bị gạch. Một dòng viết bên dưới. Tom chưa từng viết trang nào như thế — trừ một lần." } },
        ],
      } },
      { if: s => !s.has("logbook"), then: [{ item: "logbook" }] },
      { set: { p_fetched: true } },
      { sfx: "page" },
      { n: { en: "On the last page of the book there is a map. The north dunes, drawn in pencil, every hollow marked. And an X.", vi: "Ở trang cuối cuốn sổ có một tấm bản đồ. Cồn cát phía bắc, vẽ bút chì, từng chỗ trũng đều được đánh dấu. Và một dấu X." }, pic: "act-mapx" },
      { say: "leo", en: "That's where Gideon's rigs go in. Monday.", vi: "Đó là chỗ giàn khoan của ông Gideon sẽ đặt. Thứ Hai." },
      { say: "leo", en: "If there's a grave under those footings, the rigs can't simply dig through it.", vi: "Nếu dưới chân móng có một ngôi mộ, giàn khoan đâu thể cứ thế đào xuyên qua." },
      { n: { en: "Leo closes the book and puts it inside his jacket. He keeps one hand flat on it.", vi: "Leo gấp cuốn sổ lại, cất vào trong áo khoác. Anh để một bàn tay áp lên đó." }, on: "leo" },
      { say: "leo", face: "determined", en: "Before I go up there, I want to know who's still about.", vi: "Trước khi lên đó, tôi muốn biết ai còn đang thức." },
      { n: { en: "Callum sits down again on the deck. He doesn't ask to come.", vi: "Callum lại ngồi xuống boong. Anh không xin đi theo." } },
      { n: { en: "Leo runs up to the station for a torch and evidence bags. Then you walk up to the Lantern together.", vi: "Leo chạy lên trạm lấy đèn pin và túi vật chứng. Rồi hai người cùng đi lên The Lantern." } },
      { hide: "*" },
      { go: "c5_vigil" },
    ],

    // ── 01:35 · BUỔI CANH ở The Lantern: ai đã về
    c5_vigil: [
      { cp: "c5_vigil" },
      { bg: "lantern" }, { clock: "01:45" }, { amb: "room" }, { mood: "warm" },
      { n: { en: "The yard beside the porch is dark. The phone box is lit for nobody.", vi: "Cái sân cạnh hiên tối om. Bốt điện thoại sáng đèn mà chẳng ai dùng." } },
      { n: { en: "Quarter to two. The Lantern is still lit. Gideon's four-by-four stands outside, salt to the doors, where he left it.", vi: "Hai giờ kém mười lăm. The Lantern vẫn sáng đèn. Chiếc xe hai cầu của Gideon đỗ ngoài cửa, muối bám tới cửa xe, đúng chỗ ông để lại." } },
      { if: s => s.f.gideon_private, then: [
        { think: { en: "“Keys are in it. If you need it tonight.” He meant this one.", vi: "“Chìa khóa cắm sẵn trong xe. Nếu đêm nay cần.” Ông nói chiếc này." } },
      ], else: [
        { think: { en: "At one o'clock he walked past you in the lane and didn't look at you once.", vi: "Lúc một giờ ông đi ngang bạn trong con ngõ, không nhìn bạn lấy một lần." } },
      ] },
      { n: { en: "Inside, a handful of people are sitting up for Tom. Nobody is drinking much.", vi: "Bên trong, dăm người đang ngồi thức canh cho Tom. Chẳng ai uống mấy." } },
      { n: { en: "The shelf behind the bar has a gap where one bottle used to stand.", vi: "Trên kệ sau quầy có một khoảng trống, chỗ trước kia đặt một cái chai." } },
      { n: { en: "Mrs Dodd has her coat on and her hands round a cup of tea.", vi: "Bà Dodd vẫn mặc áo khoác, hai tay ôm cốc trà." } },
      { n: { en: "Fergus is on his stool. He looks at Skerry, then at you, then at the gap on the shelf.", vi: "Fergus ngồi trên ghế của ông. Ông nhìn Skerry, rồi nhìn bạn, rồi nhìn khoảng trống trên kệ." } },
      { if: s => !s.f.helen_promise, then: [
        { n: { en: "Dr Vosper is sitting at the end of the bar with a glass of water she hasn't touched. She doesn't look at you.", vi: "Bác sĩ Vosper ngồi ở cuối quầy với một cốc nước chưa đụng tới. Bà không nhìn bạn." } },
      ] },
      { show: "leo", at: "l" }, { show: "fergus", at: "r", face: "sad" },
      { say: "leo", en: "Fergus. Who's gone home?", vi: "Ông Fergus. Ai về nhà rồi ạ?" },
      { if: s => s.f.helen_promise, then: [
        { say: "fergus", en: "Doctor went back to the surgery. Gideon walked home at one, left his motor out front. Nell went up about one.", vi: "Bác sĩ về phòng khám rồi. Gideon đi bộ về lúc một giờ sáng, để xe ngoài cửa. Nell lên lầu khoảng một giờ." },
      ], else: [
        { say: "fergus", en: "Doctor's been here since she talked to Leo. Gideon walked home at one, left his motor out front. Nell went up about one.", vi: "Bác sĩ ngồi đây từ lúc nói chuyện với Leo. Gideon đi bộ về lúc một giờ sáng, để xe ngoài cửa. Nell lên lầu khoảng một giờ." },
      ] },
      { say: "fergus", en: "The Pattersons went at half twelve. Mrs Dodd's been here since the boat. So have I. That's the lot.", vi: "Nhà Patterson về lúc mười hai rưỡi. Bà Dodd ngồi đây từ lúc xuồng về. Ông cũng thế. Có thế thôi." },
      { note: { en: "Vigil, 01:45 — Gideon walked home at one. Nell went up about one.", vi: "Buổi canh, 01:45 — Gideon đi bộ về lúc một giờ. Nell lên lầu khoảng một giờ." } },
      { if: s => s.f.helen_box_early, then: [
        { think: { en: "You think of the phone box at ten past nine, and of what the doctor could see from it.", vi: "Bạn nghĩ tới cái bốt điện thoại lúc chín giờ mười, và những gì bà bác sĩ nhìn thấy được từ đó." } },
      ] },
      { hide: "fergus" }, { show: "dodd", at: "r" },
      { say: "dodd", en: "Someone should sit with him. Tom. He shouldn't be on his own in that station.", vi: "Phải có ai ngồi với ông ấy chứ. Ông Tom ấy. Không để ông ấy một mình trong cái trạm ấy được." },
      { say: "leo", face: "soft", en: "I'll sit with him myself, Mrs Dodd. Before three.", vi: "Cháu sẽ tự ngồi với ông ấy, bà Dodd ạ. Trước ba giờ sáng." },
      { clock: "01:50" },
      { hide: "dodd" }, { show: "fergus", at: "r", face: "sad" },
      { n: { en: "At ten to two Fergus gets down off his stool, one hand on the bar. Mrs Dodd buttons her coat. The vigil is over.", vi: "Hai giờ kém mười, Fergus chống một tay lên quầy, bước xuống khỏi ghế. Bà Dodd cài khuy áo. Buổi canh tan." } },
      { say: "fergus", en: "Forty years I sat next to him. I'll sit there tomorrow and all.", easy: "I sat next to him for forty years. I'll sit there tomorrow too.", vi: "Bốn mươi năm ông ngồi cạnh Tom. Mai ông vẫn sẽ ngồi đó." },
      { if: s => !s.f.helen_promise, then: [
        { n: { en: "Dr Vosper puts down the glass she never touched and goes out with them. Back to the surgery, without a word.", vi: "Bác sĩ Vosper đặt cốc nước chưa hề đụng tới xuống rồi ra về cùng họ. Về phòng khám, không một lời." } },
      ] },
      { hide: "*" }, { mood: "night" },
      { go: "c5_choose" },
    ],

    // ── 01:52 · NGOÀI QUÁN: chọn người đi cùng lên cồn cát
    c5_choose: [
      { set: { goal: "c5_map" } },
      { sfx: "door" }, { bg: "harbour" }, { amb: "sea" },
      { n: { en: "Outside, the moon is almost full. It turns the harbour silver and the lane white.", vi: "Bên ngoài, trăng gần rằm. Trăng nhuộm bến thành màu bạc, con ngõ thành màu trắng." } },
      { show: "leo", at: "c" },
      { say: "leo", face: "determined", en: "I'm going up to the north dunes. Now. Before Monday. Before anyone else gets there.", vi: "Tôi lên cồn cát phía bắc. Ngay bây giờ. Trước thứ Hai. Trước khi có ai khác tới đó." },
      {"n":{"en":"Tom's map gives you a place. It doesn't say what is still there. Leo waits for your answer.","vi":"Bản đồ của Tom chỉ cho bạn một nơi. Nó không cho biết nơi đó còn lại gì. Leo chờ bạn trả lời."}},
      { choice: [
        { tag: "direct", en: "(Go with Leo.) I'm coming with you.", vi: "(Đi cùng Leo.) Tôi đi với anh.", set: { dunes_with: "leo" }, then: [
          { say: "leo", face: "soft", en: "All right. We stay together. Tell me if you need to stop.", vi: "Được. Mình đi cùng nhau. Cần dừng thì cứ nói với tôi." },
          { go: "c5_dunes" } ] },
        { tag: "lead", if: s => !!s.f.helen_promise, en: "(Fetch Dr Vosper from the surgery.)", vi: "(Gọi bác sĩ Vosper ở phòng khám.)", set: { dunes_with: "helen" }, then: [
          { hide: "leo" }, { bg: "surgery" },
          { n: { en: "The surgery is on the way. She opens the door in her coat, as if she had been waiting for someone to ask.", vi: "Phòng khám nằm trên đường đi. Bà mở cửa, áo khoác đã mặc sẵn, như thể bà đang chờ có người tới hỏi." } },
          { show: "helen", at: "c", face: "sad" },
          { say: "helen", en: "I'll get my bag.", vi: "Để tôi lấy túi." },
          { go: "c5_dunes" } ] },
        { tag: "kind", en: "(Go back for Callum.)", vi: "(Quay lại tìm Callum.)", set: { dunes_with: "callum" }, add: { callum: 1 }, then: [
          { hide: "leo" },
          { n: { en: "You go back down the slipway. Callum is where you left him, on the edge of the deck.", vi: "Bạn quay xuống dốc bến. Callum vẫn ở chỗ bạn để anh lại, trên mép boong." } },
          { show: "callum", at: "c", face: s => (s.f.callum_threat ? "angry" : "sad") },
          { if: s => s.f.callum_threat, then: [
            { n: { en: "He looks at you for a long time, as if deciding whether you are still the person who said his daughter's name. Then he stands.", vi: "Anh nhìn bạn rất lâu, như đang cân xem bạn có còn là người đã nhắc tên con gái anh không. Rồi anh đứng dậy." }, on: "callum" },
          ], else: [
            { n: { en: "You don't have to say anything. He stands up before you reach the boat.", vi: "Bạn không cần nói gì. Anh đứng dậy trước khi bạn tới chỗ thuyền." }, on: "callum" },
          ] },
          { say: "callum", en: "Aye. All right.", vi: "Ừ. Được." },
          {"say":"leo","en":"Callum stays in sight. I want to hear his account again when we get back.","vi":"Callum phải ở trong tầm mắt. Khi về tôi cần nghe anh ấy kể lại."},
          { go: "c5_dunes" } ] },
        { tag: "press", en: "(Go on ahead.) You take the north side. I'll go straight up.", vi: "(Đi trước một mình.) Anh đi phía bắc. Tôi đi thẳng lên.", set: { dunes_with: "alone" }, then: [
          { say: "leo", face: "cold", en: "Stay with the dog, then.", vi: "Vậy thì đừng rời con chó." },
          { go: "c5_dunes" } ] },
        { tag: "polite", en: "(Wait for the morning.)", vi: "(Chờ tới sáng.)", set: { dunes_with: "wait" }, then: [
          { go: "c5_wait" } ] },
      ] },
    ],

    // ── ~02:00 · CỒN CÁT PHÍA BẮC
    c5_dunes: [
      { cp: "c5_dunes" },
      { hide: "*" },
      { title: { en: "1:58 A.M.", vi: "1:58 SÁNG" } },
      { bg: "dunes" }, { clock: "01:58" }, { amb: "sea" }, { mood: "night" },
      { fx: "particles", kind: "dust", ms: 0 }, { cam: "pan-r", ms: 14000 },
      { n: { en: "You take the footpath along the top of the dunes, below the big house. Gideon's windows are dark.", vi: "Bạn đi theo lối mòn trên đỉnh cồn cát, bên dưới ngôi nhà lớn. Cửa sổ nhà Gideon tối om." } },
      { n: { en: "Lower down, the vehicle track for his rigs runs along the shore.", vi: "Thấp hơn, con đường xe dành cho giàn khoan chạy dọc bờ biển." } },
      { cam: null },
      { if: s => s.f.dunes_with === "leo", then: [
        { show: "leo", at: "l", face: "determined" },
        { n: { en: "Leo stays beside you, torch low. You follow the map together.", vi: "Leo đi cạnh bạn, hạ thấp đèn pin. Hai người cùng lần theo bản đồ." }, on: "leo" },
        { say: "leo", en: "Watch your footing. I'll watch the track.", vi: "{Ac} coi chừng dưới chân. Tôi sẽ canh đường xe." },
      ], else: [
        { if: s => s.f.dunes_with === "alone", then: [
          { n: { en: "Leo takes the north path. You go straight on, alone, with Skerry.", vi: "Leo đi lối phía bắc. Bạn đi thẳng, một mình, với Skerry." } },
        ], else: [
          { show: "leo", at: "c" },
          { n: { en: "At the top of the dunes Leo stops and checks the track below.", vi: "Tới đỉnh cồn cát, Leo dừng lại, quan sát con đường xe bên dưới." }, on: "leo" },
          { say: "leo", en: "Stay in sight of the hollow. I'll be just above you, watching the track.", vi: "Đừng đi khuất khỏi chỗ trũng. Tôi sẽ ở ngay phía trên, canh đường xe." },
          { hide: "leo" },
          { if: s => s.f.dunes_with === "helen", then: [
            { n: { en: "The doctor stays beside you. Above the grass, Leo's torch moves slowly along the ridge.", vi: "Bà bác sĩ ở cạnh bạn. Phía trên ngọn cỏ, đèn pin của Leo chậm rãi đi dọc sống cát." } },
          ], else: [
            { n: { en: "Callum stays beside you. Above the grass, Leo's torch moves slowly along the ridge.", vi: "Callum ở cạnh bạn. Phía trên ngọn cỏ, đèn pin của Leo chậm rãi đi dọc sống cát." } },
          ] },
        ] },
      ] },
      { sfx: "wind" },
      { n: { en: "The [[marram grass]] hisses in the wind. The sand is cold through your shoes.", vi: "Cỏ gai cát rít lên trong gió. Cát lạnh xuyên qua đế giày." } },
      { explore: { goal: { en: "Search the dunes by moonlight", vi: "Tìm quanh cồn cát dưới trăng" }, need: 2, done: { en: "Stand still and listen", vi: "Đứng yên lắng nghe" }, spots: [
        { id: "pegs", x: 30, y: 62, clue: true, label: { en: "Pegs in a heap", vi: "Đống cọc" }, then: [
          { n: { en: "Then you see the pegs.", vi: "Rồi bạn thấy những cái cọc." } },
          { n: { en: "Wooden [[survey pegs]], orange tape: markers hammered in before drilling. Someone pulled them up and threw them aside in a heap.", vi: "Những cọc mốc khảo sát bằng gỗ, băng cam: cọc đánh dấu được đóng trước khi khoan. Có người nhổ chúng, vứt sang bên thành đống." }, pic: "act-pegs" },
          { n: { en: "N-07 · N-08 · N-09 — BOREHOLE", vi: "N-07 · N-08 · N-09 — BOREHOLE · Cọc mốc N-07, N-08, N-09 — lỗ khoan thăm dò." } },
          { item: "peg" },
        ], again: [
          { n: { en: "Three uprooted pegs. Damp sand still clings to their points.", vi: "Ba cái cọc bị nhổ lên. Cát ẩm vẫn bám trên mũi cọc." } },
        ] },
        { id: "hollow", x: 58, y: 72, clue: true, label: { en: "The hollow", vi: "Chỗ trũng" }, then: [
          { n: { en: "Beyond them, in a hollow, the sand is dark and fresh. A spade stands upright in it, as if someone has only just let go.", vi: "Phía sau đống cọc, trong một chỗ trũng, cát sẫm màu và còn mới. Một cái xẻng cắm thẳng đứng, như thể có người vừa mới buông tay." } },
          { if: s => s.f.dunes_with === "callum", then: [
            { show: "callum", at: "c", face: "scared" },
            { n: { en: "Callum pulls the spade out of the sand and turns it in his hands.", vi: "Callum rút cái xẻng khỏi cát, xoay trong tay." }, on: "callum" },
            { n: { en: "The blade is worn bright. The handle is wrapped in old blue tape.", vi: "Lưỡi xẻng mòn sáng. Cán quấn băng dính xanh dương đã cũ." }, on: "callum" },
            { say: "callum", en: "That's ours. From the yard.", vi: "Cái này của nhà tôi. Ở ngoài sân." },
            { say: "callum", en: "Or it's anyone's. Every yard on this island has one like it.", vi: "Hoặc của bất kỳ ai. Sân nhà nào trên đảo này chẳng có một cái như thế." },
            { n: { en: "He puts it down, carefully, where it was. He doesn't look at it again.", vi: "Anh đặt nó xuống, cẩn thận, đúng chỗ cũ. Anh không nhìn nó lần nào nữa." }, on: "callum" },
            { hide: "callum" },
          ] },
        ], again: [
          { n: { en: "Dark sand, freshly disturbed. You cannot tell how long the digging took.", vi: "Cát sẫm màu, vừa bị xới. Bạn không biết người ta đã mất bao lâu để đào." } },
        ] },
        { id: "house", x: 76, y: 22, label: { en: "The big house", vi: "Ngôi nhà lớn" }, then: [
          { n: { en: "Above the dunes, the big house is black against the sky. Not one window lit. Below it, the rig track runs down past the yard.", vi: "Phía trên cồn cát, ngôi nhà lớn đen sẫm trên nền trời. Không một ô cửa sáng. Bên dưới, con đường mòn cho giàn khoan chạy xuống ngang sân." } },
        ] },
      ] } },
      { cam: null }, { wait: 900 },
      { n: { en: "Skerry's head comes up.", vi: "Skerry ngẩng phắt đầu lên." } },
      { sfx: "steps" },
      { n: { en: "He runs. Not at you — past you, into the dark at the edge of the hollow. His tail is going. He doesn't bark.", vi: "Nó chạy. Không phải về phía bạn — mà vượt qua bạn, lao vào bóng tối ở mép chỗ trũng. Đuôi nó vẫy. Nó không sủa." }, pic: "act-skerry" },
      { amb: null }, { wait: 2000 },
      { n: { en: "For a few seconds you can't see him. Then he comes back, slowly, and stands against your legs.", vi: "Mấy giây liền bạn không thấy nó đâu. Rồi nó quay lại, chậm rãi, đứng tựa vào chân bạn." } },
      { n: { en: "Something low moves away through the marram grass. Not running. Crawling. The grass bends and closes behind it.", vi: "Có gì đó thấp, sát mặt đất, đang rời xa dần qua đám cỏ gai cát. Không chạy. Bò. Cỏ rạp xuống rồi khép lại sau lưng nó." } },
      { say: "me", en: "Who's there?", vi: "Ai đấy?" },
      { wait: 1200 }, { sfx: "wind" }, { amb: "sea" },
      { n: { en: "Nobody answers. The wind answers.", vi: "Không ai trả lời. Chỉ có gió đáp lại." } },
      { note: { en: "North dunes, ~02:00 — Skerry ran to someone in the dark, tail going. He didn't bark.", vi: "Cồn cát phía bắc, ~02:00 — Skerry chạy tới ai đó trong bóng tối, đuôi vẫy. Nó không sủa." } },
      { sfx: "beat" }, { sfx: "buzz" }, { fx: "shiver" },
      { n: { en: "On the shore track below the big house, an engine starts. Rough. No lights. The sound recedes along the shore and disappears.", vi: "Dưới con đường xe ven bờ, bên dưới ngôi nhà lớn, có tiếng máy nổ. Khàn đục. Không có đèn. Tiếng máy xa dần dọc bờ rồi mất hẳn." } },
      { if: s => s.f.dunes_with === "alone", then: [
        { think: { en: "By the time anyone comes, you have stood alone long enough to hear your own heart.", vi: "Tới lúc có người tới, bạn đã đứng một mình đủ lâu để nghe thấy tim mình." } },
      ] },
      { if: s => s.f.dunes_with === "leo", then: [
        { n: { en: "Leo starts towards the lower track, then stops. The engine is already beyond the dune.", vi: "Leo bước về phía đường xe thấp bên dưới, rồi dừng lại. Tiếng máy đã ở bên kia cồn cát." }, on: "leo" },
        { say: "leo", en: "No lights. We can't catch it safely from here.", vi: "Không đèn. Từ đây không thể đuổi theo an toàn được." },
      ], else: [
        { sfx: "steps" },
        { n: { en: "A minute later Leo comes over the top of the dune, bent double, breathing hard.", vi: "Một phút sau, Leo trèo qua đỉnh cồn cát, gập người, thở dốc." } },
        { show: "leo", at: "c", face: "surprised" },
        { say: "leo", en: "I heard it.", vi: "Tôi nghe thấy rồi." },
        { n: { en: "He stands listening to the last of it, his hands on his knees.", vi: "Anh đứng nghe nốt chút âm thanh cuối, hai tay chống lên đầu gối." }, on: "leo" },
      ] },
      { say: "leo", en: "Diesel. Old one.", vi: "Máy dầu. Máy cũ." },
      { hide: "leo" },
      { n: { en: "In the moonlight you can see where it stood: a hollow off the track, the marram crushed flat.", vi: "Dưới trăng, bạn thấy chỗ nó đã đỗ: một chỗ trũng bên đường xe, cỏ gai cát bị đè bẹp." } },
      { n: { en: "Skerry has gone to the hollow. He stands in the dark sand and begins to dig.", vi: "Skerry đã tới chỗ trũng. Nó đứng giữa lớp cát sẫm màu và bắt đầu đào." } },
      { n: { en: "Leo catches Skerry's collar and draws him back. A pale curve already shows through the disturbed sand.", vi: "Leo giữ cổ áo Skerry, kéo nó lùi lại. Một đường cong nhợt nhạt đã lộ ra giữa lớp cát bị xới." } },
      { n: { en: "Leo photographs the hollow before he touches anything. Whoever came before you has left the sand loose.", vi: "Leo chụp lại chỗ trũng trước khi chạm vào bất cứ thứ gì. Người đến trước đã làm lớp cát tơi ra." } },
      { cam: "push", ms: 6000 },
      { fx: "heartbeat" },
      { n: { en: "In the torchlight, in the sand, there is something round and pale.", vi: "Dưới ánh đèn pin, giữa lớp cát, có một thứ gì đó tròn và nhợt nhạt." } },
      { cam: null }, { wait: 1500 },
      { show: "leo", at: "c", face: "sad" },
      {"n":{"en":"He radios the location, then pulls on fresh gloves.","vi":"Anh báo vị trí qua bộ đàm, rồi đeo một đôi găng mới."}},
      { n: { en: "Leo kneels. He takes an [[evidence bag]] from his jacket. His hands are steady and his face is not.", vi: "Leo quỳ xuống. Anh lấy một túi vật chứng trong áo khoác ra. Tay anh vững, còn mặt anh thì không." }, on: "leo" },
      { say: "leo", en: "I'm sorry. I'm so sorry.", vi: "Tôi xin lỗi. Tôi rất xin lỗi." },
      { n: { en: "You don't know if he is saying it to you, or to her, or to his father.", vi: "Bạn không biết anh đang nói với bạn, với mẹ bạn, hay với bố anh." } },
      { n: { en: "He sweeps the torch over the exposed hollow, keeping his feet outside its edge.", vi: "Anh quét đèn pin qua hố cát đã lộ, giữ chân ở bên ngoài mép hố." }, on: "leo" },
      { say: "leo", en: "Only this is exposed. The rest may have been moved. We need a proper search.", vi: "Chỉ phần này lộ ra. Phần còn lại có thể đã bị chuyển đi. Cần khám xét kỹ nơi này." },
      { note: { en: "The dunes: a skull in a freshly disturbed hollow. No other remains visible. Someone drove away without lights.", vi: "Cồn cát: một hộp sọ trong hố cát vừa bị xới. Không thấy phần hài cốt nào khác. Có người lái xe đi không bật đèn." } },
      { item: "skull" },
      { hide: "*" },
      { n: { en: "You take the envelope out of your pocket. The Berwick postmark. The paper napkin.", vi: "Bạn lấy phong bì trong túi ra. Dấu bưu điện Berwick. Tờ khăn giấy." } },
      { n: { en: "The ring is lighter than you remember. A & D.", vi: "Chiếc nhẫn nhẹ hơn bạn nhớ. A & D." } },
      { mood: "memory" }, { cg: "cg-skull-ring" },
      { n: { en: "You put it on. It only fits one finger. You leave it there.", vi: "Bạn đeo nó vào. Nó chỉ vừa một ngón. Bạn để nó ở đó." } },
      { if: s => s.f.dunes_with === "callum", then: [{"n":{"en":"Callum takes one step towards you, then stops. You give him no sign to come closer.","vi":"Callum bước về phía bạn một bước, rồi dừng. Bạn không ra dấu để anh tới gần hơn."}}], else: [{ if: s => s.f.dunes_with === "helen", then: [{"n":{"en":"Helen holds out a hand, then lets it fall. She waits until you can move.","vi":"Helen đưa tay ra, rồi buông xuống. Bà đợi tới khi bạn có thể cử động."}}], else: [{"n":{"en":"Leo looks away while you put the ring on. For once, he asks no questions.","vi":"Leo nhìn đi chỗ khác khi bạn đeo nhẫn. Lần này, anh không hỏi gì."}}] }] },
      { n: { en: "You stand there with your hand closed around it. The sea is going out. You can hear it, far off, letting go of the sand.", vi: "Bạn đứng đó, bàn tay nắm lại quanh chiếc nhẫn. Biển đang rút. Bạn nghe thấy nó, xa xa, đang buông dần bãi cát." } },
      { n: { en: "For a long time, nobody speaks. Skerry lies down beside the hollow and puts his chin on his paws.", vi: "Rất lâu, không ai nói gì. Skerry nằm xuống cạnh chỗ trũng, gác cằm lên hai chân trước." } },
      { wait: 3500 },
      { think: { en: "She has been here for twenty years.", vi: "Mẹ đã ở đây hai mươi năm." } },
      { n: { en: "Not drowned. Not taken by the tide. Here, under the grass, a mile from the road, waiting for someone to stop lying.", vi: "Không chết đuối. Không bị nước cuốn. Ở đây, dưới lớp cỏ, cách đường ngầm hơn một cây số, chờ có ai đó thôi nói dối." } },
      { truth: "T1" },
      { cg: null }, { mood: "night" },
      { if: s => s.f.dunes_with === "callum", then: [
        { show: "callum", at: "c", face: "crying" },
        { n: { en: "Callum hasn't moved. His eyes go to your hand, and the ring. Then to your sleeve.", vi: "Callum vẫn chưa cử động. Mắt anh dừng ở bàn tay bạn, và chiếc nhẫn. Rồi tới tay áo bạn." }, on: "callum" },
        { n: { en: "The moon is bright enough to show the cuff. The grey darning. The big clumsy stitches.", vi: "Trăng đủ sáng để thấy cổ tay áo. Chỗ mạng len xám. Những mũi khâu to và vụng." }, on: "callum" },
        { n: { en: "Callum reaches out, very slowly, and touches it with one finger.", vi: "Callum đưa tay ra, thật chậm, chạm vào đó bằng một ngón tay." }, pic: "act-cuff", on: "callum" },
        { sfx: "sting" },
        { say: "callum", face: "ashamed", en: "That's my jumper.", vi: "Đó là áo len của tôi." },
        { say: "callum", en: "I tore it that night. Getting out of the truck.", vi: "Tôi làm rách nó đúng đêm ấy. Lúc nhảy ra khỏi xe tải." },
        { note: { en: "Callum, touching the darned cuff: 'That's my jumper. I tore it that night. Getting out of the truck.'", vi: "Callum, chạm vào cổ tay áo đã mạng: “Đó là áo len của tôi. Tôi làm rách nó đúng đêm ấy. Lúc nhảy ra khỏi xe tải.”" } },
        { hide: "callum" },
      ] },
      { if: s => s.f.dunes_with === "helen", then: [
        { show: "helen", at: "c", face: "cold" },
        { n: { en: "Dr Vosper kneels beside the hollow. She holds the bag by its edges and turns it towards the torch. She never touches the skull.", vi: "Bác sĩ Vosper quỳ xuống cạnh chỗ trũng. Bà giữ mép túi, xoay về phía đèn pin. Bà không hề chạm vào hộp sọ." }, on: "helen" },
        { go: "c5_reading" },
      ], else: [
        { go: "c5_yard" },
      ] },
    ],

    // ── 02:10 · SÂN ĐIỀN TRANG: máy Land Rover cũ còn ấm
    c5_yard: [
      { hide: "*" }, { fx: "particles-off" },
      { bg: "yard" }, { clock: "02:10" },
      { if: s => s.f.dunes_with === "helen", then: [
        { n: { en: "Ten past two. Leo is waiting at the estate gate below the big house.", vi: "Hai giờ mười. Leo đang chờ ở cổng điền trang, bên dưới ngôi nhà lớn." } },
        { n: { en: "The estate's old Land Rover stands in Gideon's yard, mud to the roof.", vi: "Chiếc Land Rover cũ của điền trang đỗ trong sân nhà Gideon, bùn bám tới nóc." } },
        { show: "leo", at: "c", face: "cold" },
        { fx: "pulse" },
        { say: "leo", pic: "act-bonnet", en: "I put my hand on the bonnet. Still warm.", vi: "Tôi áp tay lên nắp máy. Còn ấm." },
        { say: "leo", en: "Three brandies. He said he wasn't driving.", vi: "Ba ly brandy. Ông ấy bảo không lái xe." },
      ], else: [
        { n: { en: "Ten past two. You come back down the track below the big house.", vi: "Hai giờ mười. Bạn đi xuống theo con đường mòn bên dưới ngôi nhà lớn." } },
        { n: { en: "The estate's old Land Rover stands in Gideon's yard, mud to the roof.", vi: "Chiếc Land Rover cũ của điền trang đỗ trong sân nhà Gideon, bùn bám tới nóc." } },
        { show: "leo", at: "c", face: "cold" },
        { n: { en: "Leo stops. He walks into the yard and lays his hand flat on the [[bonnet]].", vi: "Leo dừng lại. Anh bước vào sân, áp bàn tay lên nắp máy." }, pic: "act-bonnet", on: "leo" },
        { n: { en: "He keeps it there for a few seconds. Then he looks up at the dark windows of the house.", vi: "Anh để tay ở đó mấy giây. Rồi anh ngẩng lên nhìn những ô cửa sổ tối om của ngôi nhà." }, on: "leo" },
        { wait: 1200 }, { fx: "pulse" },
        { say: "leo", en: "Still warm.", vi: "Còn ấm." },
        { say: "leo", en: "Three brandies. He said he wasn't driving.", vi: "Ba ly brandy. Ông ấy bảo không lái xe." },
      ] },
      { if: s => s.f.gideon_private, then: [
        { think: { en: "He offered you one car tonight. He said nothing about this one.", vi: "Đêm nay ông cho bạn mượn một chiếc xe. Ông không nói gì về chiếc này." } },
      ] },
      { n: { en: "He keeps the bag close. One officer, an unsecured house, and people he has to get back safely.", vi: "Anh giữ túi sát người. Một cảnh sát, một ngôi nhà chưa được kiểm tra, và những người anh phải đưa về an toàn." }, on: "leo" },
      { say: "leo", en: "We'll come back with CID. Nobody goes in there now.", vi: "Chúng ta sẽ quay lại cùng bên điều tra. Giờ không ai vào đó cả." },
      { n: { en: "He writes something in his notebook, under the moon, and walks on.", vi: "Anh ghi gì đó vào sổ tay, dưới ánh trăng, rồi đi tiếp." }, on: "leo" },
      { note: { en: "02:10 — the estate's old Land Rover in Gideon's yard: engine still warm.", vi: "02:10 — Land Rover cũ của điền trang trong sân nhà Gideon: máy còn ấm." } },
      { hide: "*" },
      { if: s => s.f.dunes_with === "helen", then: [
        { bg: "surgery" },
        { n: { en: "On the way back, Helen stops at the surgery. She touches your sleeve, then goes inside.", vi: "Trên đường về, Helen dừng trước phòng khám. Bà chạm nhẹ tay áo bạn, rồi bước vào." } },
        { hide: "helen" }, { go: "c5_jumper" },
      ], else: [{ go: "c5_surgery" }] },
    ],

    // ── 02:12 · PHÒNG KHÁM
    c5_surgery: [
      { cp: "c5_surgery" },
      { bg: "surgery" }, { clock: "02:12" },
      { if: s => s.f.helen_promise, then: [
        { n: { en: "The surgery has one light on, at the back. Dr Vosper opens the door before you knock. She hasn't been to bed.", vi: "Phòng khám còn một ngọn đèn sáng, ở phía sau. Bác sĩ Vosper mở cửa trước khi bạn kịp gõ. Bà chưa đi ngủ." } },
      ], else: [
        { n: { en: "The surgery light is on. Dr Vosper is still in her coat; she came back from the Lantern twenty minutes ago.", vi: "Đèn phòng khám vẫn sáng. Bác sĩ Vosper còn mặc áo khoác; bà từ The Lantern về được hai mươi phút." } },
        { n: { en: "She opens the door, but not wide.", vi: "Bà mở cửa, nhưng không mở rộng." } },
      ] },
      { show: "helen", at: "c", face: "scared" },
      { n: { en: "She sees the bag in Leo's hands. For a moment she holds on to the door frame.", vi: "Bà thấy cái túi trong tay Leo. Một thoáng, bà vịn vào khung cửa." }, on: "helen" },
      { say: "helen", en: "Bring it into the light.", vi: "Mang vào chỗ sáng." },
      { n: { en: "She doesn't open the bag. She turns it under the lamp, slowly, with two fingers, the way she would turn a patient's head.", vi: "Bà không mở túi. Bà xoay nó dưới ngọn đèn, chậm rãi, bằng hai ngón tay, như cách bà vẫn xoay đầu một bệnh nhân." }, on: "helen" },
      { go: "c5_reading" },
    ],

    // ── Helen đọc hộp sọ (ở cồn cát hoặc ở cửa phòng khám) → cú đập thứ hai
    c5_reading: [
      { say: "helen", face: "cold", en: "I'm a GP. Not a [[pathologist]]. You understand that.", vi: "Tôi là bác sĩ đa khoa. Không phải bác sĩ pháp y. {Ac} hiểu điều đó." },
      { say: "helen", en: "[[Fracture]] at the back. Round, like a fist.", vi: "Vỡ xương ở phía sau. Tròn, như một nắm tay." },
      { say: "helen", face: "sad", en: "A serious blow. I wouldn't expect anyone to speak after that.", easy: "That looks like a serious blow. I would not expect speech afterwards.", vi: "Một cú đập nặng. Tôi không nghĩ người bị như vậy còn nói được." },
      { say: "helen", tone: "careful, professionally restrained", en: "A pathologist must confirm it.", vi: "Cần bác sĩ pháp y xác nhận." },
      { set: { c5_helen_examined: true } },
      { fx: "heartbeat" }, { wait: 1500 },
      { if: s => !!s.f.p_anna_talking && s.has("c5_anna_testimony") && s.has("skull"), then: [
        { n: { en: "You remember Callum's words. She was talking after the crash. Now there is an injury he never described.", vi: "Bạn nhớ lời Callum. Mẹ còn nói sau cú tông. Giờ đây có một vết thương anh chưa từng nhắc tới." } },
        { go: "c5_second_blow" },
      ], else: [
        { think: { en: "An injury is not a timeline. I need the account of what happened after the crash.", vi: "Một vết thương chưa cho biết trình tự. Mình cần lời kể về chuyện xảy ra sau cú tông." } },
        { go: "c5_reading_after" },
      ] },
    ],

    // Chỉ xác nhận suy luận khi nối đúng hai nguồn đã quan sát trong lượt này.
    c5_second_blow: [
      { deduce: {
        q: { en: "Does the crash explain this injury?", vi: "Vụ đâm xe có giải thích được vết thương này không?" },
        a: [["skull", "c5_anna_testimony"]],
        cards: ["logbook", "skull", "peg", "c5_anna_testimony"],
        nudge: { en: "An injury shows what happened to a body. What could help establish when?", vi: "Vết thương cho biết điều đã xảy ra với cơ thể. Điều gì có thể giúp xác định thời điểm?" },
        hint: { en: "Pair the injury with the witness who heard her after the crash.", vi: "Nối vết thương với lời nhân chứng từng nghe mẹ nói sau cú tông." },
        missing: { en: "These records do not yet establish the sequence after the crash.", vi: "Những hồ sơ này chưa xác lập được trình tự sau vụ đâm xe." },
        review: { with: [
          { id: "peg", text: { en: "The peg marks a future drilling site. It cannot establish when Anna was injured.", vi: "Cọc mốc đánh dấu chỗ sắp khoan. Nó không xác lập được lúc Anna bị thương." } },
          { id: "logbook", text: { en: "Tom's log records a later visit. It does not describe Anna immediately after the crash.", vi: "Sổ của Tom ghi một lần tới sau đó. Nó không mô tả Anna ngay sau vụ đâm xe." } },
        ] },
        tries: 3,
        ok: [
          { think: { en: "Callum says she spoke after the crash. This injury suggests a later blow. His account and the skull need checking together.", vi: "Callum nói mẹ còn nói sau cú tông. Vết thương này gợi ý một cú đập xảy ra sau đó. Cần đối chiếu lời anh với hộp sọ." } },
          { set: { p_second_blow: true } },
          { truth: "T12" },
          { go: "c5_reading_after" },
        ],
        fail: [
          { think: { en: "The pegs locate the drilling. The logbook places Tom later. Neither describes Anna's condition just after the crash.", vi: "Cọc mốc chỉ chỗ khoan. Cuốn sổ ghi thời điểm Tom tới sau. Chưa thứ nào tả tình trạng Anna ngay sau vụ đâm xe." } },
          {"think":{"en":"To time the injury, I need an account from then and the physical finding.","vi":"Muốn xác định lúc bị thương, tôi cần lời kể về lúc đó và dấu vết trên hài cốt."}},
          { choice: [
            { en: "Try the connection again.", vi: "Thử nối lại chứng cứ.", silent: true, if: s => !!s.f.p_anna_talking && s.has("skull") && s.has("c5_anna_testimony"), then: [{ go: "c5_second_blow" }] },
            { en: "Leave this question open.", vi: "Tạm để ngỏ câu hỏi này.", silent: true, then: [{ go: "c5_reading_after" }] },
          ] },
        ],
      } },
      { go: "c5_reading_after" },
    ],

    c5_reading_after: [
      { if: s => s.f.dunes_with === "helen", then: [
        { say: "helen", face: "ashamed", en: "I wrote “fell from the harbour wall”. No X-ray. I knew that wall. I knew the causeway too.", vi: "Tôi ghi “ngã từ tường chắn sóng”. Không cho chụp X-quang. Tôi biết bức tường ấy. Tôi cũng biết đường ngầm." },
        { n: { en: "Leo seals the bag and stands. He goes down the track ahead of you, fast, one hand flat on his jacket.", vi: "Leo niêm phong túi rồi đứng dậy. Anh đi xuống con đường mòn trước, rất nhanh, một bàn tay áp lên áo khoác." } },
        { hide: "*" },
        { go: "c5_yard" },
      ], else: [
        { if: s => s.f.helen_promise, then: [
          { go: "c5_card" },
        ], else: [
          { n: { en: "She hands the bag back to Leo without another word and closes the door. The light at the back goes out.", vi: "Bà trả cái túi cho Leo, không thêm một lời, rồi đóng cửa. Ngọn đèn phía sau tắt." } },
          { hide: "*" },
          { if: s => s.f.dunes_with === "callum", then: [{ go: "c5_close" }], else: [{ go: "c5_jumper" }] },
        ] },
      ] },
    ],

    // ── (đã hứa) bệnh án năm 2004
    c5_card: [
      { n: { en: "Dr Vosper goes to a grey cabinet in the corner.", vi: "Bác sĩ Vosper tới cái tủ hồ sơ màu xám trong góc." }, pic: "act-card", on: "helen" },
      { n: { en: "She takes out a card, old and soft at the edges, and puts it on the desk in front of you.", vi: "Bà lấy ra một tấm thẻ, cũ và mềm ở mép, đặt lên bàn trước mặt bạn." }, pic: "act-card", on: "helen" },
      { n: { en: "CALLOWAY, Callum · 15.11.2004 · L. wrist. Fall from harbour wall. Strapped. — H.V.", vi: "CALLOWAY, Callum · 15.11.2004 · L. wrist. Fall from harbour wall. Strapped. — H.V. · Cổ tay trái. Ngã từ tường chắn sóng. Đã băng." } },
      { say: "helen", face: "sad", en: "My handwriting. A fourteen-year-old with a broken wrist, the morning after a woman went off the causeway.", vi: "Nét chữ của tôi. Một đứa mười bốn tuổi gãy cổ tay, đúng buổi sáng sau cái đêm một người đàn bà mất tích trên đường ngầm." },
      { say: "helen", face: "ashamed", en: "I didn't send him for an X-ray. I didn't ask. I didn't want to know.", vi: "Tôi không cho nó đi chụp X-quang. Tôi không hỏi. Tôi không muốn biết." },
      { n: { en: "She puts the card down very carefully, as if it were the skull.", vi: "Bà đặt tấm thẻ xuống thật cẩn thận, như thể đó là hộp sọ." }, on: "helen" },
      { say: "helen", face: "crying", en: "I've told myself one morning didn't make me a bad doctor. It didn't make that morning go away.", vi: "Tôi vẫn tự nhủ một buổi sáng không biến mình thành bác sĩ tồi. Nhưng buổi sáng ấy đâu vì thế mà biến mất." },
      {"say":"me","en":"Did you believe the story you wrote?","vi":"Bà có tin câu chuyện mình đã ghi không?"},
      {"say":"helen","en":"I believed asking would hurt people I knew. I never asked who my silence would hurt.","vi":"Tôi tin hỏi ra sẽ làm đau những người mình quen. Tôi chưa từng hỏi sự im lặng của mình làm đau ai.","tone":"ashamed, without defence"},
      { note: { en: "Surgery card: CALLOWAY, Callum · 15.11.2004 · L. wrist. Fall from harbour wall. Strapped. — H.V.", vi: "Thẻ bệnh án: CALLOWAY, Callum · 15.11.2004 · cổ tay trái, “ngã từ tường chắn sóng”, đã băng. — H.V." } },
      { hide: "*" },
      { if: s => s.f.dunes_with === "callum", then: [{ go: "c5_close" }], else: [{ go: "c5_jumper" }] },
    ],

    // ── THẤT BẠI MỀM: chờ tới sáng (không cảnh cồn cát, không hộp sọ)
    c5_wait: [
      { cp: "c5_wait" },
      { say: "me", en: "I can't face what might be up there tonight. Go. I'll stay here.", vi: "Đêm nay tôi không chịu nổi việc đối mặt với thứ có thể nằm trên đó. Anh đi đi. Tôi sẽ ở đây." },
      { show: "leo", at: "c", face: "cold" },
      { say: "leo", en: "All right. I'll record Callum's account before I go up. Stay here with Skerry.", vi: "Được. Tôi sẽ ghi lời khai của Callum trước khi lên đó. {Ac} ở đây với Skerry." },
      { n: { en: "Leo goes down to the Mairi Rose. You wait under the harbour lamp while he talks to Callum.", vi: "Leo xuống thuyền Mairi Rose. Bạn đợi dưới đèn bến trong lúc anh nói chuyện với Callum." }, on: "leo" },
      { hide: "leo" },
      { clock: "02:05" },
      { n: { en: "At five past two, Leo takes the north path alone. Skerry stays by the bench, watching him go.", vi: "Hai giờ năm, Leo một mình đi lối phía bắc. Skerry ở lại bên ghế, nhìn theo anh." } },
      { n: { en: "You sit on the bench under the harbour lamp with Skerry. He won't lie down. He keeps looking up the lane, towards the north.", vi: "Bạn ngồi trên chiếc ghế dưới ngọn đèn bến với Skerry. Nó không chịu nằm. Nó cứ ngóng lên con ngõ, về phía bắc." } },
      { go: "c5_jumper" },
    ],

    // ── ~02:18 · ĐẦU DỐC BẾN: “That's my jumper.”
    c5_jumper: [
      { cp: "c5_jumper" },
      { fx: "particles-off" },
      { bg: "harbour" }, { clock: "02:16" }, { amb: "sea" },
      { if: s => s.f.dunes_with === "wait", then: [
        { n: { en: "Someone comes up the slipway. Callum. He couldn't stay on the boat.", vi: "Có người đi lên dốc bến. Callum. Anh không ngồi yên trên thuyền được." } },
        { show: "callum", at: "c", face: "sad" },
        { n: { en: "He stops beside the bench. He doesn't ask why you are still here.", vi: "Anh dừng lại cạnh chiếc ghế. Anh không hỏi vì sao bạn vẫn còn ở đây." }, on: "callum" },
        { n: { en: "Then his eyes move to your hands. To your sleeve.", vi: "Rồi mắt anh chuyển sang tay bạn. Sang tay áo bạn." }, on: "callum" },
      ], else: [
        { n: { en: "At the top of the slipway, under the harbour lamp, someone is waiting. Callum. He couldn't stay on the boat.", vi: "Ở đầu dốc bến, dưới ngọn đèn bến, có người đang chờ. Callum. Anh không ngồi yên trên thuyền được." } },
        { show: "callum", at: "c", face: "sad" },
        { n: { en: "He sees the bag. He doesn't ask what is in it.", vi: "Anh thấy cái túi. Anh không hỏi trong đó có gì." }, on: "callum" },
        { n: { en: "Then his eyes move to you. To your hand, and the ring. To your sleeve.", vi: "Rồi mắt anh chuyển sang bạn. Sang bàn tay bạn, và chiếc nhẫn. Sang tay áo bạn." }, on: "callum" },
      ] },
      { n: { en: "Under the lamp you can see the cuff clearly. The grey [[darning]]. The big clumsy stitches.", vi: "Dưới ngọn đèn, bạn thấy rõ cổ tay áo. Chỗ mạng len xám. Những mũi khâu to và vụng." }, on: "callum" },
      { n: { en: "Callum reaches out, very slowly, and touches it with one finger.", vi: "Callum đưa tay ra, thật chậm, chạm vào đó bằng một ngón tay." }, pic: "act-cuff", on: "callum" },
      { sfx: "sting" },
      { say: "callum", face: "ashamed", en: "That's my jumper.", vi: "Đó là áo len của tôi." },
      { say: "callum", en: "I tore it that night. Getting out of the truck.", vi: "Tôi làm rách nó đúng đêm ấy. Lúc nhảy ra khỏi xe tải." },
      { note: { en: "Callum, touching the darned cuff: 'That's my jumper. I tore it that night. Getting out of the truck.'", vi: "Callum, chạm vào cổ tay áo đã mạng: “Đó là áo len của tôi. Tôi làm rách nó đúng đêm ấy. Lúc nhảy ra khỏi xe tải.”" } },
      { n: { en: "He goes back down to the Mairi Rose without another word.", vi: "Anh quay xuống thuyền Mairi Rose, không nói thêm lời nào." }, on: "callum" },
      { hide: "*" },
      { go: "c5_close" },
    ],

    // ── 02:20 · KẾT CHƯƠNG: tín hiệu của Leo
    c5_close: [
      { set: { goal: "c5_return" } },
      { bg: "harbour" }, { clock: "02:20" },
      { if: s => s.f.dunes_with === "wait", then: [
        { n: { en: "At twenty past two Leo comes back down the lane with nothing in his hands.", vi: "Hai giờ hai mươi, Leo quay về theo con ngõ, tay không." } },
        { show: "leo", at: "c", face: "sad" },
        { say: "leo", en: "Someone's been. The pegs are pulled. The sand's raked smooth. There's nothing there now.", vi: "Có người tới rồi. Cọc bị nhổ hết. Cát bị cào phẳng. Giờ chẳng còn gì ở đó." },
        { say: "leo", en: "Old Land Rover up in Gideon's yard. I put my hand on the bonnet. Still warm.", vi: "Chiếc Land Rover cũ trong sân nhà ông Gideon. Tôi áp tay lên nắp máy. Còn ấm." },
        { note: { en: "02:20 — Leo: the north dunes raked smooth, pegs pulled. Gideon's old Land Rover still warm.", vi: "02:20 — Leo: cồn cát phía bắc bị cào phẳng, cọc bị nhổ. Land Rover cũ nhà Gideon còn ấm máy." } },
        { think: { en: "Whatever the X on Tom's map was marking, the sand has given it to someone else.", vi: "Dấu X trên bản đồ của Tom đánh dấu thứ gì đi nữa, cát đã trao nó cho người khác rồi." } },
      ], else: [
        { if: s => s.f.dunes_with === "callum", then: [
          { n: { en: "At the slipway Callum stops. One last look at Leo's bag. Then he returns to the Mairi Rose without a word.", vi: "Tới dốc bến, Callum dừng lại. Nhìn cái túi của Leo lần cuối. Rồi anh trở xuống thuyền Mairi Rose, không một lời." } },
        ] },
        { show: "leo", at: "c" },
        { n: { en: "Leo looks at his watch. The station. The bag. Tom, on his own in the back room.", vi: "Leo nhìn đồng hồ. Trạm cứu hộ. Cái túi. Ông Tom, một mình ở phòng trong." }, on: "leo" },
      ] },
      { if: s => (s.f.leo || 0) >= 2, then: [
        { say: "leo", face: "soft", en: "Whatever you find, you ring me first.", vi: "Dù {ac} tìm thấy gì, gọi cho tôi trước tiên." },
      ], else: [
        { say: "leo", face: "cold", en: "Stay at the Lantern.", vi: "{Ac} ở yên trong The Lantern." },
      ] },
      { n: { en: "Then he goes up the lane towards the station, one hand flat on his jacket.", vi: "Rồi anh đi ngược con ngõ về phía trạm, một bàn tay áp lên áo khoác." }, on: "leo" },
      { hide: "*" },
      { n: { en: "Behind you, at the top of the lane, the Lantern's windows are still lit.", vi: "Sau lưng bạn, ở đầu con ngõ, cửa sổ quán The Lantern vẫn sáng đèn." } },
      { sfx: "bell" }, { wait: 1500 }, { mood: null },
      { end: "c5_end" },
    ],
  },

  endings: {
    c5_end: { ch: 5,
      title: { en: "What the Dunes Kept", vi: "Điều cồn cát giữ" },
      sum: { en: "The road opens at 2:25. The police cross at 3:05.", vi: "Đường mở lúc 2:25. Cảnh sát qua lúc 3:05." },
      text: { en: "Twenty years ago a boy ran home in the dark, and someone fetched Tom at a quarter to nine. Tonight the dunes gave up what they could. Between this tide and the next, someone will have to stop lying. The Lantern is still lit. One last conversation before the road opens.", vi: "Hai mươi năm trước, một cậu bé chạy về nhà trong bóng tối, và có người đã tới đón Tom lúc chín giờ kém mười lăm. Đêm nay cồn cát đã trả lại những gì nó có thể. Giữa con nước này và con nước sau, sẽ có người phải thôi nói dối. The Lantern vẫn sáng đèn. Một cuộc trò chuyện cuối trước khi đường ngầm mở." },
      next: "c6_open", nextTitle: { en: "Chapter 6", vi: "Chương 6" } },
  },
});
