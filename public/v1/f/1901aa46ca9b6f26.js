// THE STATEMENT — CHƯƠNG 5 “Undertow” (Ngày 5, đêm bão). Trọng tâm tiếng: GIỚI TỪ CHỈ VỊ TRÍ, câu mệnh lệnh, chuỗi quá khứ.
// Cơ chế: dựng lại đêm án (order) → ai không có bằng chứng ngoại phạm (whom) · bão (thanh “Thời gian”) · Gull Point trong bóng tối
//   (explore + dùng đồ: chìa khoá / xà beng / đèn pin) · băng thú tội của Finch (listen) · kho lạnh (qte) · nhắn Ruth đúng chỗ (type)
//   · hải đăng: gặp Sam · đối đầu Owen trong bão (qte seq + lựa chọn có giờ). 3 kết: Two Tickets North (hết truyện) · Low Tide · đi tiếp.
StoryEngine.chapter({
  items: {
    crowbar: { icon: "key", name: { en: "Crowbar", vi: "Xà beng" }, desc: { en: "Rusty, heavy. Found by the harbour wall.", vi: "Gỉ sét, nặng trịch. Nhặt được cạnh tường bến cảng." } },
    finch_tape2: { icon: "phone", name: { en: "Finch's last tape", vi: "Cuộn băng cuối của Finch" }, desc: { en: "Finch's own voice, 12 October. A confession — and a name.", vi: "Giọng chính Finch, ngày 12 tháng 10. Một lời thú tội — và một cái tên." } },
    sam_book: { icon: "doc", name: { en: "Sam's notebook", vi: "Sổ tay của Sam" }, desc: { en: "Every child's name. Every debt. Every van, every date, every box. Sam wrote it all down.", vi: "Tên từng đứa trẻ. Từng món nợ. Từng chuyến xe, từng ngày, từng thùng hàng. Sam đã ghi lại tất cả." } },
    oilskin: { icon: "box", name: { en: "Yellow oilskin", vi: "Áo vải dầu vàng" }, desc: { en: "Torn from Owen in the storm. A name tag in the collar: 'MARTA — 3'.", vi: "Giật được từ Owen trong bão. Nhãn tên trong cổ áo: “MARTA — 3”." } },
  },
  truths: {
    T11: { name: { en: "Finch's voice", vi: "Giọng của Finch" }, text: { en: "On his last tape, Finch named Owen Price as Holt's man in the station. Two days later, Owen was with him on the pier when he 'slipped'.", vi: "Trong cuộn băng cuối, Finch gọi tên Owen Price là người của Holt trong đồn. Hai ngày sau, Owen ở cạnh ông trên cầu tàu lúc ông “trượt chân”." } },
    T12: { name: { en: "The notebook", vi: "Cuốn sổ" }, text: { en: "Sam's notebook: names, debts, vans and dates. Everything a court needs to bring Holt's line down.", vi: "Sổ tay của Sam: tên, nợ, xe tải và ngày giờ. Mọi thứ toà án cần để triệt phá đường dây của Holt." } },
  },
  words: {
    "behind": { vi: "phía sau", ex: "The gate is behind the cannery." },
    "next to": { vi: "bên cạnh", ex: "It's next to the old crane." },
    "opposite": { vi: "đối diện", ex: "Opposite the lighthouse." },
    "cannery": { vi: "xưởng đồ hộp", ex: "The old cannery has been closed for years." },
    "crane": { vi: "cần cẩu", ex: "A rusty crane stands by the water." },
    "floorboard": { vi: "tấm ván sàn", ex: "A loose floorboard." },
    "confession": { vi: "lời thú tội", ex: "It's Finch's confession." },
    "undertow": { vi: "dòng nước ngầm (kéo ra khơi)", ex: "The undertow pulls you out to sea." },
    "frostbite": { vi: "tê cóng (bỏng lạnh)", ex: "Ten more minutes and it's frostbite." },
  },

  recap: [
    { ch: 5, t: { en: "Day 5. You put the night of the murder in order. Only one person had no alibi between 1:40 and 1:50: Owen.", vi: "Ngày 5. Bạn xếp lại đêm án theo thứ tự. Chỉ một người không có chứng cứ ngoại phạm từ 1:40 đến 1:50: Owen." } },
    { ch: 5, if: s => s.f.danger === "kieran", t: { en: "In the storm you went to Gull Point to find Kieran.", vi: "Giữa cơn bão, bạn đến Gull Point tìm Kieran." } },
    { ch: 5, if: s => s.f.danger === "ellie", t: { en: "Ellie went to take food to Sam and never came back. You went after her.", vi: "Ellie đi mang đồ ăn cho Sam và không quay về. Bạn đi tìm cô." } },
    { ch: 5, if: s => s.truth("T11"), t: { en: "Under Sam's bed: Finch's last tape. He named Owen.", vi: "Dưới giường của Sam: cuộn băng cuối của Finch. Ông gọi tên Owen." } },
    { ch: 5, if: s => s.f.c5_saved, t: { en: "You got them out of the cold store in time.", vi: "Bạn kịp đưa người ra khỏi kho lạnh." } },
    { ch: 5, if: s => s.f.c5_msg === "clear", t: { en: "Your message to Ruth was clear: behind the cannery, next to the old crane.", vi: "Tin nhắn cho Ruth rất rõ: phía sau xưởng đồ hộp, cạnh cái cần cẩu cũ." } },
    { ch: 5, if: s => s.f.c5_msg === "vague", t: { en: "Your message to Ruth was too vague. She went to the wrong place.", vi: "Tin nhắn cho Ruth quá mơ hồ. Bà đến nhầm chỗ." } },
    { ch: 5, if: s => s.f.met_sam, t: { en: "At the top of the Gull Head lighthouse, you found Sam.", vi: "Trên đỉnh hải đăng Gull Head, bạn tìm thấy Sam." } },
    { ch: 5, if: s => s.f.c5_sorry, t: { en: "You finally said it: 'I'm sorry I told you not to come back.'", vi: "Cuối cùng bạn cũng nói ra: “Xin lỗi vì đã bảo em đừng về nữa.”" } },
    { ch: 5, if: s => s.truth("T12") && s.has("sam_book"), t: { en: "Sam gave you his notebook.", vi: "Sam đưa bạn cuốn sổ của nó." } },
    { ch: 5, if: s => s.f.c5_book === "kept", t: { en: "Sam would not give the notebook to someone who works for Holt.", vi: "Sam không chịu đưa cuốn sổ cho người làm việc cho Holt." } },
    { ch: 5, if: s => s.f.owen_caught, t: { en: "On the storm pier, Owen came for you in a yellow coat. Ruth arrived in time. Owen was arrested.", vi: "Trên cầu tàu giữa bão, Owen lao đến trong chiếc áo vàng. Ruth đến kịp. Owen bị bắt." } },
    { ch: 5, if: s => s.f.owen_gone, t: { en: "Owen got away into the storm.", vi: "Owen trốn thoát vào cơn bão." } },
  ],

  flow: [
    { ch: 5, row: 0, id: "c5_board", kind: "cp", scene: "office", label: { en: "1:47", vi: "1:47" }, sum: { en: "Rebuild the night.", vi: "Dựng lại đêm án." } },
    { ch: 5, row: 1, kind: "opt", key: "danger", val: "kieran", label: { en: "Kieran is missing", vi: "Kieran mất tích" }, sum: { en: "Because someone knew where he slept.", vi: "Vì có kẻ biết cậu ngủ ở đâu." } },
    { ch: 5, row: 1, kind: "opt", key: "danger", val: "ellie", label: { en: "Ellie is missing", vi: "Ellie mất tích" }, sum: { en: "Kieran was safe — so they went for Ellie.", vi: "Kieran an toàn — nên chúng nhắm vào Ellie." } },
    { ch: 5, row: 2, id: "c5_gp", kind: "cp", scene: "gullpoint", label: { en: "Gull Point", vi: "Gull Point" }, sum: { en: "The cannery in the storm.", vi: "Xưởng đồ hộp trong bão." } },
    { ch: 5, row: 3, kind: "opt", key: "c5_msg", val: "clear", label: { en: "Clear message", vi: "Tin nhắn rõ ràng" }, sum: { en: "Ruth came to the right place.", vi: "Ruth đến đúng chỗ." } },
    { ch: 5, row: 3, kind: "opt", key: "c5_msg", val: "vague", label: { en: "Vague message", vi: "Tin nhắn mơ hồ" }, sum: { en: "Ruth was late.", vi: "Ruth đến muộn." }, hint: { en: "Prepositions matter.", vi: "Giới từ rất quan trọng." } },
    { ch: 5, row: 4, id: "c5_light", kind: "cp", scene: "lamproom", label: { en: "The lighthouse", vi: "Ngọn hải đăng" }, sum: { en: "Sam.", vi: "Sam." } },
    { ch: 5, row: 5, kind: "opt", key: "c5_run", val: "run", label: { en: "Run away together", vi: "Cùng bỏ trốn" } },
    { ch: 5, row: 5, kind: "opt", key: "c5_run", val: "stay", label: { en: "Stay and fight", vi: "Ở lại" } },
    { ch: 5, row: 6, id: "c5_pier", kind: "cp", scene: "storm", label: { en: "Owen", vi: "Owen" }, sum: { en: "The man in the yellow coat.", vi: "Người đàn ông áo vàng." } },
    { ch: 5, row: 7, kind: "opt", key: "c5_owen", val: "caught", label: { en: "Owen arrested", vi: "Owen bị bắt" } },
    { ch: 5, row: 7, kind: "opt", key: "c5_owen", val: "gone", label: { en: "Owen escapes", vi: "Owen trốn thoát" } },
    { ch: 5, row: 8, id: "c5_north", kind: "end", label: { en: "Two tickets north", vi: "Hai vé lên phía bắc" } },
    { ch: 5, row: 8, id: "c5_lowtide", kind: "end", label: { en: "Low tide", vi: "Nước ròng" } },
    { ch: 5, row: 8, id: "c5_dawn", kind: "end", label: { en: "After the storm", vi: "Sau cơn bão" } },
  ],

  nodes: {
    c5: [
      { title: { ch: 5, en: "Undertow", vi: "Sóng ngầm" } },
      { cp: "c5_board" },
      { bg: "office" }, { amb: "rain" }, { fx: "lightning" },
      { n: { en: "Day 5, 9 p.m. The storm arrives early. The windows shake. The station is almost empty.", vi: "Ngày 5, 9 giờ tối. Cơn bão đến sớm. Cửa kính rung bần bật. Đồn gần như vắng tanh." } },
      { if: s => (+s.f.ally || 0) >= 2, then: [
        { show: "ruth", at: "c" },
        { say: "ruth", en: "Let's do this properly. The whole night, minute by minute. Put it in order.", vi: "Làm cho đàng hoàng. Cả đêm hôm đó, từng phút một. Xếp lại cho đúng thứ tự." } ],
        else: [
        { n: { en: "Alone at your desk, you write the whole night on cards and spread them out.", vi: "Một mình bên bàn, bạn viết cả đêm hôm đó lên từng tấm thẻ rồi trải ra." } } ] },
      { order: { prompt: { en: "The night of the murder. Drag the events into order — earliest at the top.", vi: "Đêm xảy ra án mạng. Kéo các sự việc theo thứ tự — sớm nhất ở trên." }, tries: 4,
        items: [
          { t: { en: "Owen leaves the pub, 'to go home'.", vi: "Owen rời quán, “để về nhà”." }, tag: "1:15" },
          { t: { en: "Tom is mending nets alone on the Marta.", vi: "Tom vá lưới một mình trên tàu Marta." }, tag: "1:30" },
          { t: { en: "Sam and Danny run onto the pier with the notebook.", vi: "Sam và Danny chạy lên cầu tàu cùng cuốn sổ." }, tag: "1:40" },
          { t: { en: "A man in a yellow oilskin blocks their way.", vi: "Một người mặc áo vải dầu vàng chặn đường." }, tag: "1:43" },
          { t: { en: "Danny shouts 'Run, Sam!'", vi: "Danny hét “Chạy đi, Sam!”" }, tag: "1:45" },
          { t: { en: "Danny's watch stops in the water.", vi: "Đồng hồ của Danny dừng dưới nước." }, tag: "1:47" },
          { t: { en: "The CCTV camera is turned to the sky.", vi: "Camera giám sát bị xoay lên trời." }, tag: "1:50" },
          { t: { en: "Owen arrives 'from home' after the call.", vi: "Owen “từ nhà” tới sau cuộc gọi." }, tag: "3:15" },
        ],
        ok: [{ fx: "solve" }], fail: [{ think: { en: "Not perfect. But the gap is obvious.", vi: "Chưa hoàn hảo. Nhưng khoảng trống thì quá rõ." } }] } },
      { whom: { prompt: { en: "Who has NO alibi between 1:40 and 1:50?", vi: "Ai KHÔNG có chứng cứ ngoại phạm từ 1:40 đến 1:50?" }, chars: ["tom", "owen", "maggie", "holt"], set: "c5_accuse",
        then: {
          owen: [{ think: { en: "Owen left the pub at 1:15 'to go home'. Nobody saw him again until 3:15. He lives four minutes from the pier.", vi: "Owen rời quán lúc 1:15 “để về nhà”. Không ai thấy anh ta tới tận 3:15. Nhà anh ta cách cầu tàu bốn phút." } }, { set: { c5_owen_alibi: 1 } }],
          tom: [{ think: { en: "Tom was alone on the Marta — but the Marta's deck camera shows him there all night.", vi: "Tom ở một mình trên tàu Marta — nhưng camera boong tàu cho thấy ông ở đó suốt đêm." } }],
          maggie: [{ think: { en: "Maggie was closing the shop. Six customers saw her.", vi: "Maggie đang đóng cửa quán. Sáu vị khách thấy bà." } }],
          holt: [{ think: { en: "Holt was at a dinner in Newcastle. Forty witnesses. Men like Holt never hold the knife themselves.", vi: "Holt dự bữa tối ở Newcastle. Bốn mươi nhân chứng. Người như Holt không bao giờ tự tay cầm dao." } }],
        } } },
      { hide: "*" },
      // ai gặp nguy: Kieran (nếu kẻ xấu biết chỗ cậu ngủ) hoặc Ellie
      { if: s => s.f.gp === "told" || s.f.holt === "no" || s.f.owen_knows, then: [{ set: { danger: "kieran" } }], else: [{ set: { danger: "ellie" } }] },
      { sfx: "phone" },
      { if: s => s.f.danger === "kieran", then: [
        { chat: { with: "kieran", msgs: [
          { from: "kieran", en: "help", vi: "cứu" },
          { from: "kieran", en: "gull point. cold. they locked me in", vi: "gull point. lạnh lắm. tụi nó nhốt em" },
          { from: "kieran", en: "battery dying", vi: "sắp hết pin" },
        ] } } ],
        else: [
        { chat: { with: "ellie", msgs: [
          { from: "ellie", en: "Going to take food to S. Back by 10.", vi: "Đi mang đồ ăn cho S. 10 giờ về." },
          { from: "ellie", en: "Someone is following my car.", vi: "Có người bám theo xe tôi." },
          { from: "ellie", en: "Gull Point. Help", vi: "Gull Point. Cứu" },
        ] } } ] },
      { meter: { key: "time", label: { en: "Time", vi: "Thời gian" }, max: 6, min: 0, icon: "⏱", color: "#7fb2e5" } },
      { set: { time: 6 } },
      { go: "c5_storm" },
    ],

    c5_storm: [
      { bg: "storm" }, { amb: "rain" }, { mood: "danger" }, { cam: "sway" },
      { fx: "particles", kind: "rain", ms: 0 },
      { n: { en: "The harbour is a war. Waves break over the wall and run across the road. The wind pulls at your coat like hands.", vi: "Bến cảng như một chiến trường. Sóng vượt tường, tràn qua mặt đường. Gió giật áo bạn như những bàn tay." } },
      { fx: "lightning" },
      { explore: { goal: { en: "Get through the harbour to Gull Point", vi: "Băng qua bến cảng tới Gull Point" }, need: 0, done: { en: "Run to Gull Point", vi: "Chạy tới Gull Point" },
        spots: [
          { id: "wall", x: 30, y: 52, label: { en: "Harbour wall", vi: "Tường bến cảng" }, then: [
            { n: { en: "Something metal in the water at the bottom of the wall. A rusty crowbar, left by the fishermen.", vi: "Có thứ gì bằng kim loại dưới chân tường. Một cây xà beng gỉ ngư dân bỏ lại." } },
            { item: "crowbar" }, { add: { time: -1 } } ] },
          { id: "marta", x: 72, y: 40, label: { en: "The Marta", vi: "Tàu Marta" }, then: [
            { n: { en: "The Marta pulls at her ropes. Another hook is empty tonight. Someone has borrowed a yellow coat again.", vi: "Tàu Marta giật căng dây neo. Đêm nay lại thêm một cái móc trống. Lại có kẻ mượn áo vàng." } },
            { fx: "shiver" }, { add: { time: -1 } } ] },
        ] } },
      { mood: null }, { cam: null },
      { go: "c5_gp" },
    ],

    c5_gp: [
      { cp: "c5_gp" },
      { bg: "gullpoint" }, { mood: "night" },
      { n: { en: "Gull Point. A dead factory with broken windows. Chains swing in the wind and knock against the iron.", vi: "Gull Point. Một nhà xưởng chết với những ô cửa vỡ. Xích sắt đung đưa trong gió, gõ vào khung sắt." } },
      { n: { en: "The gate by the old crane is chained shut.", vi: "Cánh cổng cạnh cái cần cẩu cũ bị xích chặt." } },
      { explore: { goal: { en: "Get inside the cannery", vi: "Vào trong xưởng" }, need: 0, done: { en: "Go in", vi: "Đi vào" }, noUse: { en: "That won't open it.", vi: "Thứ đó không mở được." },
        spots: [
          { id: "gate", x: 50, y: 50, clue: true, label: { en: "Chained gate", vi: "Cổng bị xích" }, dark: true,
            stuck: [{ n: { en: "A heavy padlock. You need a key — or something strong.", vi: "Một ổ khoá nặng. Cần chìa khoá — hoặc thứ gì thật chắc." } }],
            use: {
              gp_key: [{ n: { en: "Maggie's key turns with a scream of rust. The gate swings open.", vi: "Chìa của Maggie xoay trong tiếng rít gỉ sét. Cánh cổng bật mở." } }, { sfx: "door" }, { set: { c5_in: "key" } }],
              crowbar: [{ n: { en: "You jam the crowbar into the chain and pull with everything you have.", vi: "Bạn chêm xà beng vào sợi xích và kéo bằng toàn bộ sức lực." } },
                { qte: { prompt: { en: "Pull! Tap as fast as you can!", vi: "Kéo! Chạm thật nhanh!" }, kind: "tap", n: 14, ms: 5000,
                  ok: [{ sfx: "hit" }, { n: { en: "The chain snaps.", vi: "Sợi xích đứt phựt." } }],
                  fail: [{ n: { en: "Your hands slip — but the third time, the chain snaps. Minutes lost.", vi: "Tay bạn trượt — nhưng tới lần thứ ba, sợi xích đứt. Mất mấy phút." } }, { add: { time: -1 } }] } },
                { set: { c5_in: "bar" } }],
            } },
          { id: "window", x: 82, y: 34, label: { en: "Broken window", vi: "Cửa sổ vỡ" }, then: [
            { n: { en: "Too high. And the glass is sharp as teeth.", vi: "Cao quá. Mà kính sắc như răng." } } ] },
        ] } },
      { if: s => !s.f.c5_in, then: [
        { n: { en: "In the end you climb the fence and fall hard on the other side. Your wrist screams.", vi: "Cuối cùng bạn trèo hàng rào và ngã mạnh xuống phía bên kia. Cổ tay đau buốt." } },
        { fx: "redflash" }, { add: { time: -2 } } ] },
      { bg: "dorm" },
      { n: { en: "Inside, behind the machines: a hidden room. Mattresses on the floor. Sleeping bags. Drawings on the wall. Candles burned down to nothing.", vi: "Bên trong, sau những cỗ máy: một căn phòng bí mật. Đệm trải trên sàn. Túi ngủ. Tranh vẽ trên tường. Nến cháy tới tận đáy." }, pic: "act-torch" },
      { think: { en: "This is where they lived. Kieran. Danny. Sam.", vi: "Đây là nơi chúng sống. Kieran. Danny. Sam." } },
      { explore: { goal: { en: "Search the dormitory (quickly)", vi: "Lục soát phòng ngủ (nhanh lên)" }, need: 1, done: { en: "Find the cold store", vi: "Tìm kho lạnh" },
        spots: [
          { id: "bed", x: 30, y: 58, clue: true, dark: true, label: { en: "Bed by the wall", vi: "Giường cạnh tường" }, then: [
            { n: { en: "Carved into the wooden frame: 'S + D — WE GET OUT'.", vi: "Khắc trên khung gỗ: “S + D — TỤI MÌNH SẼ THOÁT”." }, pic: "act-carving" },
            { n: { en: "One floorboard under the bed is loose.", vi: "Một tấm ván sàn dưới giường bị lỏng." } },
            { n: { en: "Under it: a cassette tape wrapped in plastic. 'H.F. — 12 OCT'.", vi: "Bên dưới: một cuộn băng bọc túi nhựa. “H.F. — 12 THÁNG 10”." }, pic: "act-floor" },
            { item: "finch_tape2" }, { add: { time: -1 } } ] },
          { id: "wall", x: 70, y: 30, label: { en: "Drawings", vi: "Tranh vẽ" }, then: [
            { n: { en: "Children's drawings. A boat. A house with smoke from the chimney. A boy and a dog. 'HOME', in big letters.", vi: "Tranh trẻ con vẽ. Một con thuyền. Một ngôi nhà có khói bay từ ống khói. Một cậu bé với con chó. Chữ “NHÀ” thật to." } } ] },
        ] } },
      { if: s => s.has("finch_tape2"), then: [
        { n: { en: "You hold your phone to the old player in the corner and press PLAY.", vi: "Bạn đặt điện thoại cạnh chiếc máy phát cũ trong góc và bấm PLAY." }, pic: "act-tape" },
        { mood: "flashback" },
        { listen: { who: "finch", audio: "My name is Harold Finch. For eleven years I changed the children's statements. Graham Holt paid me. Detective Sergeant Owen Price is his man in the station. If anything happens to me — it was Owen.", tr: { vi: "Tôi là Harold Finch. Mười một năm nay tôi sửa lời khai của bọn trẻ. Graham Holt trả tiền cho tôi. Trung sĩ Owen Price là người của hắn trong đồn. Nếu tôi có mệnh hệ gì — đó là Owen." },
          qs: [
            { q: { en: "Who paid Finch?", vi: "Ai trả tiền cho Finch?" }, opts: ["Owen Price", "Graham Holt", "Tom Ward"], a: 1 },
            { q: { en: "Who is Holt's man in the station?", vi: "Ai là người của Holt trong đồn?" }, opts: ["Ruth Calder", "Owen Price", "Jim Hardy"], a: 1 },
          ] } },
        { mood: null },
        { truth: "T11" }, { set: { c5_finch_full: 1 } } ] },
      { go: "c5_cold" },
    ],

    c5_cold: [
      { bg: "coldstore" }, { mood: "cold" }, { fx: "particles", kind: "snow", ms: 0 },
      { n: { en: "The cold store. The door is jammed with a pallet. Through the small window: frost — and someone curled up on the floor.", vi: "Kho lạnh. Cửa bị chặn bằng một tấm pallet. Qua ô cửa nhỏ: lớp băng — và một người co ro trên sàn." } },
      { if: s => (+s.f.time || 0) <= 2, then: [{ think: { en: "Too long. You took too long. Ten more minutes in there means [[frostbite]] — or worse.", vi: "Quá lâu. Bạn mất quá nhiều thời gian. Thêm mười phút trong đó là tê cóng — hoặc tệ hơn." } }] },
      { qte: { prompt: { en: "Drag the pallet away! Left, up, right — follow the arrows!", vi: "Kéo tấm pallet ra! Trái, lên, phải — theo mũi tên!" }, kind: "seq", seq: ["◀", "◀", "▲", "▶"], ms: 7000, key: "c5_door",
        ok: [{ sfx: "door" }], fail: [{ n: { en: "It moves at last — slowly. Too slowly.", vi: "Cuối cùng nó cũng dịch ra — chậm. Quá chậm." } }, { add: { time: -1 } }] } },
      { cg: "cg-rescue" },
      { if: s => s.f.danger === "kieran", then: [
        { n: { en: "Kieran. Blue lips. Eyes open. Alive.", vi: "Kieran. Môi tím tái. Mắt mở. Còn sống." } },
        { cg: null },
        { show: "kieran", at: "c", face: "relief" },
        { say: "kieran", en: "You came. You actually came.", vi: "{Ac} đến thật. {Ac} đến thật rồi." },
        { say: "kieran", en: "It was Owen. In the yellow coat. Same as the pier. He said I talk too much.", vi: "Là Owen. Mặc áo vàng. Y như hôm ở cầu tàu. Hắn bảo em nhiều chuyện quá." } ],
        else: [
        { n: { en: "Ellie. Wrapped in a sleeping bag, shaking so hard her teeth knock together. Alive.", vi: "Ellie. Quấn trong túi ngủ, run lẩy bẩy tới mức răng va lập cập. Còn sống." } },
        { cg: null },
        { show: "ellie", at: "c", face: "relief" },
        { say: "ellie", en: "He took the food. He asked where Sam was. I didn't tell him. I didn't.", vi: "Hắn lấy đồ ăn. Hắn hỏi Sam ở đâu. Tôi không nói. Tôi không nói đâu." } ] },
      { set: { c5_saved: 1 } },
      { mood: null }, { fx: "particles-off" },
      { say: "me", en: "I need to call for help.", vi: "Phải gọi người tới giúp." },
      { n: { en: "No signal for calls. One bar — enough for a text. Ruth needs to know exactly where you are.", vi: "Không đủ sóng để gọi. Một vạch — đủ gửi tin nhắn. Ruth cần biết chính xác bạn ở đâu." }, pic: "act-message" },
      { type: { prompt: { en: "Text Ruth where you are. You're behind the cannery, next to the old crane.", vi: "Nhắn Ruth vị trí của bạn. Bạn ở PHÍA SAU xưởng đồ hộp, CẠNH cái cần cẩu cũ. (gõ bằng tiếng Anh)" },
        ph: { en: "Gull Point. Behind…", vi: "Gull Point. Behind…" },
        accept: ["behind the cannery next to the old crane", "behind the cannery next to the crane", "gull point behind the cannery next to the old crane", "gull point behind the cannery next to the crane", "behind the cannery by the old crane", "we are behind the cannery next to the old crane", "im behind the cannery next to the old crane", "i'm behind the cannery next to the old crane"],
        tries: 2, hint: { en: "behind the cannery, next to the old crane", vi: "behind the cannery, next to the old crane" },
        ok: [{ set: { c5_msg: "clear" } }, { think: { en: "Sent. Clear. She'll find you.", vi: "Đã gửi. Rõ ràng. Bà sẽ tìm ra." } }],
        fail: [{ set: { c5_msg: "vague" } }, { think: { en: "Sent — but you're not sure she'll understand where.", vi: "Đã gửi — nhưng bạn không chắc bà hiểu là ở đâu." } }] } },
      { if: s => !s.f.c5_msg, then: [{ set: { c5_msg: "clear" } }] },
      { hide: "*" },
      { if: s => s.f.danger === "ellie" || s.truth("T8") || s.truth("T5"), then: [
        { n: { en: "'He's at the lighthouse,' comes the whisper behind you. 'Gull Head. Go. Before Owen finds him.'", vi: "“Nó ở hải đăng,” giọng thì thầm sau lưng bạn. “Gull Head. Đi đi. Trước khi Owen tìm ra nó.”" } } ],
        else: [{ n: { en: "The photo in the envelope. A white lighthouse on a cliff. There's only one: Gull Head.", vi: "Tấm ảnh trong phong bì. Ngọn hải đăng trắng trên vách đá. Chỉ có một: Gull Head." } }] },
      { meter: "time", off: true },
      { go: "c5_light" },
    ],

    c5_light: [
      { cp: "c5_light" },
      { bg: "lighthouse" }, { amb: "sea" }, { fx: "lightning" },
      { n: { en: "Gull Head. One hundred and twelve steps. Your legs burn. At the top, a thin line of light under a door.", vi: "Gull Head. Một trăm mười hai bậc thang. Chân bạn bỏng rát. Trên cùng, một vệt sáng mảnh dưới khe cửa." } },
      { bg: "lamproom" }, { amb: "sea" },
      { show: "sam", at: "c", face: "scared" },
      { set: { met_sam: 1 } },
      { say: "sam", face: "scared", en: "Stay back! I've got— …", vi: "Đứng yên! Em có—…" },
      { say: "sam", face: "crying", en: "…{name}?", vi: "…{name}?" },
      { cg: "cg-reunion" }, { mood: "warm" }, { fx: "particles", kind: "dust", ms: 7000 },
      { n: { en: "Four months. Four months of phone calls that went nowhere, and now he is here, thinner, smelling of sea and smoke, holding on to you like he's six years old.", vi: "Bốn tháng. Bốn tháng gọi điện vào hư không, và giờ nó ở đây, gầy hơn, mùi biển và khói, ôm chặt lấy bạn như hồi sáu tuổi." } },
      { cg: null },
      { show: "sam", at: "c", face: "sad" },
      { choice: [
        { tag: "kind", en: "I'm sorry. I'm so sorry I told you not to come back.", vi: "Xin lỗi em. {Ac} xin lỗi vì đã bảo em đừng về nữa.", set: { c5_sorry: 1 }, add: { sam: 2 }, then: [
          { say: "sam", face: "crying", en: "I did want to come back. Every day. But I owed them. And then I saw what they write about kids like me.", vi: "Em muốn về mà. Ngày nào cũng muốn. Nhưng em nợ tụi nó. Rồi em thấy tụi nó viết gì về những đứa như em." } ] },
        { tag: "direct", en: "What happened on the pier, Sam?", vi: "Chuyện gì đã xảy ra trên cầu tàu, Sam?", then: [
          { say: "sam", face: "sad", en: "Danny told me to run. So I ran. I left him there.", vi: "Danny bảo em chạy. Thế là em chạy. Em bỏ nó lại." } ] },
      ] },
      { say: "sam", face: "sad", en: "Danny and me, we were going north with Tom. We had the notebook. Then a man in a yellow coat came out of the fog.", vi: "Em với Danny định đi lên phía bắc với Tom. Tụi em có cuốn sổ. Rồi một người mặc áo vàng bước ra từ màn sương." },
      { say: "sam", en: "Danny jumped on him. Shouted 'Run, Sam!' I heard him hit the post. I heard the water. And I ran.", vi: "Danny lao vào hắn. Hét lên “Chạy đi, Sam!” Em nghe tiếng nó đập vào cọc. Nghe tiếng nước. Và em chạy." },
      { fx: "heartbeat" },
      { if: s => s.f.holt === "yes", then: [
        { say: "sam", face: "scared", en: "They say you work for Holt now. That you said yes. Is it true?", vi: "Người ta nói giờ {ac} làm cho Holt. Rằng {ac} đã nhận lời. Có thật không?" },
        { choice: [
          { tag: "lie", en: "It's not what it looks like.", vi: "Không phải như em nghĩ đâu.", add: { lie: 1 }, then: [
            { say: "sam", face: "sad", en: "That's what Finch used to say.", vi: "Finch cũng hay nói thế." },
            { set: { c5_book: "kept" } } ] },
          { tag: "direct", en: "I said yes. To get you home.", vi: "{Ac} nhận lời. Để đưa em về nhà.", then: [
            { say: "sam", face: "sad", en: "Then I can't give you this. I'm sorry. Not while he owns you.", vi: "Vậy em không đưa cái này được. Em xin lỗi. Chừng nào hắn còn nắm {ac}." },
            { set: { c5_book: "kept" } } ] },
        ] } ],
        else: [
        { say: "sam", en: "Here. Take it. Danny died for this. Don't let them change one word of it.", vi: "Đây. Cầm lấy. Danny chết vì nó đấy. Đừng để tụi nó sửa một chữ nào." },
        { n: { en: "A battered school notebook. Every page: names, numbers, dates, vans.", vi: "Một cuốn vở học trò sờn cũ. Trang nào cũng có: tên, con số, ngày tháng, xe tải." }, pic: "act-notebook" },
        { item: "sam_book" }, { truth: "T12" }, { set: { c5_book: "given" } } ] },
      { mood: null },
      { say: "sam", face: "scared", en: "There's a boat. Tom's sister. It leaves at dawn. We could just… go. Both of us. Forget all this.", vi: "Có một chiếc thuyền. Của em gái Tom. Rạng sáng nó đi. Mình có thể cứ… đi thôi. Cả hai. Quên hết mọi chuyện." },
      { choice: [
        { en: "…Let's go. Together. Right now.", vi: "…Đi thôi. Cùng nhau. Ngay bây giờ.", set: { c5_run: "run" }, then: [{ go: "c5_north" }] },
        { tag: "direct", en: "No. If we run, Danny's death becomes Tom's crime. We finish this.", vi: "Không. Nếu mình chạy, cái chết của Danny sẽ thành tội của Tom. Mình phải làm cho xong.", set: { c5_run: "stay" }, add: { sam: 1 } },
      ], timer: 20, timeout: [{ set: { c5_run: "stay" } }] },
      { hide: "*" },
      { go: "c5_pier" },
    ],

    c5_north: [
      { bg: "dawn" }, { hide: "*" }, { mood: "memory" },
      { cg: "cg-north" },
      { n: { en: "At dawn, a small boat slips out past Gull Head. Nobody sees it go.", vi: "Rạng sáng, một chiếc thuyền nhỏ lặng lẽ rời Gull Head. Không ai thấy nó đi." } },
      { n: { en: "By evening you are on a train going north. Sam sleeps with his head on your shoulder.", vi: "Đến chiều tối bạn đã ngồi trên tàu hoả lên phía bắc. Sam ngủ gục đầu trên vai bạn." } },
      { n: { en: "Back in Port Halden, Tom Ward is charged with murder. Kieran goes back to the bus station. The van comes on Thursday, four a.m.", vi: "Ở Port Halden, Tom Ward bị buộc tội giết người. Kieran quay lại bến xe. Chiếc xe tải vẫn đến vào thứ Năm, lúc 4 giờ sáng." } },
      { mood: null },
      { end: "c5_north" },
    ],

    c5_pier: [
      { cp: "c5_pier" },
      { bg: "storm" }, { amb: "rain" }, { mood: "danger" }, { fx: "lightning" },
      { n: { en: "You take Sam down the cliff path towards the town. The north pier. The only way back.", vi: "Bạn đưa Sam xuống con đường vách đá về phía thị trấn. Cầu tàu phía bắc. Lối duy nhất để quay về." } },
      { cg: "cg-owen" },
      { n: { en: "In the middle of the pier, in the white light of a torch: a man in a yellow oilskin.", vi: "Giữa cầu tàu, trong ánh đèn pin trắng loá: một người đàn ông mặc áo vải dầu vàng." } },
      { cg: null },
      { show: "owen", at: "c", face: "desperate" },
      { say: "owen", face: "desperate", en: "Evening, trainee. Hello, Sam. You've grown.", vi: "Chào buổi tối, tập sự. Chào Sam. Mày lớn rồi nhỉ." },
      { say: "owen", en: "We're the same, you and me. We write down what people can live with. Give me the notebook and everyone goes home.", vi: "Mày với tao giống nhau thôi. Ta ghi lại những gì người ta có thể sống chung được. Đưa tao cuốn sổ, ai về nhà nấy." },
      { choice: [
        { tag: "direct", need: "T11", intuition: true, lockHint: { en: "You need proof of what happened to Finch.", vi: "Cần bằng chứng về cái chết của Finch." }, en: "Finch said those words too. On tape. Right before you pushed him.", vi: "Finch cũng nói câu đó. Trong băng. Ngay trước khi anh đẩy ông ấy.", add: { sus: 3 }, then: [
          { say: "owen", face: "angry", en: "Finch slipped.", vi: "Finch trượt chân." },
          { say: "me", en: "Danny slipped too?", vi: "Danny cũng trượt chân à?" } ] },
        { tag: "bluff", en: "Ruth is on her way. It's over, Owen.", vi: "Ruth đang tới. Hết rồi, Owen.", then: [
          { if: s => s.f.c5_msg === "clear", then: [{ think: { en: "Please let that be true.", vi: "Mong là thật." } }], else: [{ think: { en: "You don't even know if she got the message.", vi: "Bạn còn chẳng biết bà có nhận được tin không." } }] } ] },
        { tag: "kind", en: "You can still stop this. Walk away.", vi: "Anh vẫn còn dừng lại được. Đi đi.", then: [
          { say: "owen", face: "cold", en: "There's nowhere to walk to. Holt owns every road out of this town.", vi: "Chẳng còn đường nào mà đi. Holt nắm hết mọi con đường ra khỏi thị trấn này." } ] },
      ], timer: 12, timeout: [{ say: "owen", face: "desperate", en: "No more talking.", vi: "Thôi nói đủ rồi." }] },
      { say: "owen", face: "desperate", en: "Give it to me!", vi: "Đưa đây!" },
      { fx: "hit" },
      { qte: { prompt: { en: "He lunges! Dodge — follow the arrows!", vi: "Hắn lao tới! Né — theo mũi tên!" }, kind: "seq", seq: ["◀", "▼", "▶"], ms: 4500, key: "c5_dodge",
        ok: [{ n: { en: "You twist away. His hand catches only the collar of his own coat — and it tears.", vi: "Bạn xoay người né. Tay hắn chỉ túm được cổ chiếc áo của chính hắn — và nó rách toạc." } }, { item: "oilskin" }],
        fail: [{ fx: "redflash" }, { n: { en: "His shoulder hits you. Your back slams into the railing. Below: black water and the undertow.", vi: "Vai hắn húc vào bạn. Lưng bạn đập mạnh vào lan can. Bên dưới: nước đen và dòng nước ngầm." } }, { set: { c5_hurt: 1 } }] } },
      { if: s => s.f.c5_msg === "clear", then: [
        { sfx: "sting" },
        { n: { en: "Blue lights at the end of the pier. A voice through the wind: 'Owen Price! Stand still!'", vi: "Đèn xanh ở đầu cầu tàu. Một giọng nói xuyên qua gió: “Owen Price! Đứng yên!”" } },
        { show: "ruth", at: "l", face: "cold" },
        { say: "ruth", face: "cold", en: "Behind the cannery, next to the old crane. Clear as day. Good message.", vi: "Phía sau xưởng đồ hộp, cạnh cái cần cẩu cũ. Rõ như ban ngày. Tin nhắn tốt đấy." },
        { say: "ruth", en: "Owen Price, I am arresting you for the murder of Daniel Reece.", vi: "Owen Price, tôi bắt anh vì tội giết Daniel Reece." },
        { set: { owen_caught: 1, c5_owen: "caught" } } ],
        else: [
        { if: s => s.f.c5_hurt && !s.has("oilskin") && !(+s.f.ally >= 2), then: [{ go: "c5_lowtide" }] },
        { n: { en: "Sam swings the torch. It hits Owen's arm. The light spins into the sea. In the darkness, footsteps — running away.", vi: "Sam vung cây đèn pin. Nó trúng tay Owen. Ánh sáng xoay tròn rơi xuống biển. Trong bóng tối, tiếng bước chân — chạy xa dần." } },
        { set: { owen_gone: 1, c5_owen: "gone" } },
        { n: { en: "When Ruth finally arrives, twenty minutes later, the pier is empty except for the two of you.", vi: "Khi Ruth tới được, hai mươi phút sau, cầu tàu vắng tanh, chỉ còn hai anh em bạn." } } ] },
      { hide: "*" }, { mood: null }, { fx: "particles-off" },
      { end: "c5_dawn" },
    ],

    c5_lowtide: [
      { cg: "cg-cliff" }, { fx: "blackout" },
      { n: { en: "The railing breaks.", vi: "Lan can gãy." } },
      { n: { en: "The water is so cold it feels like fire. The undertow takes you, gently, the way it took Finch.", vi: "Nước lạnh tới mức như lửa đốt. Dòng nước ngầm cuốn bạn đi, nhẹ nhàng, như đã cuốn Finch." } },
      { n: { en: "The last thing you hear is Sam, shouting your name into the storm.", vi: "Điều cuối cùng bạn nghe thấy là tiếng Sam gào tên bạn vào cơn bão." } },
      { cg: null }, { fx: "particles-off" },
      { end: "c5_lowtide" },
    ],
  },

  endings: {
    c5_north: { ch: 5, final: true, title: { en: "Two Tickets North", vi: "Hai vé lên phía bắc" },
      sum: { en: "You and Sam escaped. Nobody solved the case.", vi: "Bạn và Sam trốn thoát. Không ai phá được vụ án." },
      text: { en: "Peace, of a kind. Sam is safe. Danny's name is written on a charge sheet next to the wrong man's. And on Thursdays, at four in the morning, a van still comes to Gull Point.", vi: "Một kiểu bình yên. Sam an toàn. Tên Danny nằm trên bản buộc tội cạnh tên một người vô tội. Và cứ thứ Năm, bốn giờ sáng, một chiếc xe tải vẫn đến Gull Point." } },
    c5_lowtide: { ch: 5, final: true, title: { en: "Low Tide", vi: "Nước ròng" },
      sum: { en: "The sea took you. Go back to a turning point.", vi: "Biển đã cuốn bạn đi. Quay về một điểm rẽ." },
      text: { en: "Three days later the sea gave you back, the way it always does — never in the shape anyone wanted. Owen signed the report: accidental drowning.", vi: "Ba ngày sau biển trả bạn về, như mọi lần — không bao giờ theo hình dạng người ta mong. Owen ký biên bản: chết đuối do tai nạn." } },
    c5_dawn: { ch: 5, next: "c6", nextTitle: { en: "Chapter 6 — Testimony", vi: "Chương 6 — Lời khai" }, title: { en: "After the Storm", vi: "Sau cơn bão" },
      sum: { en: "You survived the night. Now the court.", vi: "Bạn sống sót qua đêm. Giờ là toà án." },
      text: { en: "The storm moves out to sea. In the grey morning, you sit in Ruth's car with Sam asleep in the back. One day left. One question waiting.", vi: "Cơn bão lui ra khơi. Trong buổi sáng xám, bạn ngồi trong xe Ruth, Sam ngủ ở ghế sau. Còn một ngày. Một câu hỏi đang chờ." } },
  },
});
