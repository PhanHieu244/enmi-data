// THE STATEMENT — CHƯƠNG 5 “Undertow” (Ngày 5, đêm bão). Trọng tâm tiếng: GIỚI TỪ CHỈ VỊ TRÍ, câu mệnh lệnh, chuỗi quá khứ.
// Cơ chế: dựng lại đêm án (order) → ai không có bằng chứng ngoại phạm (whom) · bão (thanh “Thời gian”) · Gull Point trong bóng tối
//   (explore + dùng đồ: chìa khoá / xà beng / đèn pin) · băng thú tội của Finch (listen) · kho lạnh (qte) · nhắn Ruth đúng chỗ (type)
//   · hải đăng: gặp Sam · đối đầu Owen trong bão (qte seq + lựa chọn có giờ). 3 kết: Two Tickets North (hết truyện) · Low Tide · đi tiếp.
StoryEngine.chapter({
  items: {
    crowbar: { icon: "key", name: { en: "Crowbar", vi: "Xà beng" }, desc: { en: "Rusty, heavy. Found by the harbour wall.", vi: "Gỉ sét, nặng trịch. Nhặt được cạnh tường bến cảng." } },
    finch_tape2: { icon: "phone", name: { en: "Finch's last tape", vi: "Cuộn băng cuối của Finch" }, desc: { en: "Finch's own voice, 12 October. A confession — and a name.", vi: "Giọng chính Finch, ngày 12 tháng 10. Một lời thú tội — và một cái tên." } },
    sam_book: { icon: "doc", name: { en: "Sam's notebook", vi: "Sổ tay của Sam" }, desc: { en: "Every child's name. Every debt. Every van, every date, every box. Sam wrote it all down.", vi: "Tên từng đứa trẻ. Từng món nợ. Từng chuyến xe, từng ngày, từng thùng hàng. Sam đã ghi lại tất cả." } },
    oilskin: { icon: "box", name: { en: "Yellow oilskin", vi: "Áo vải dầu vàng" }, desc: { en: "A torn strip from the shoulder of Owen's yellow oilskin, taken during his attack. Its sewn-in label reads 'MARTA — 3'.", vi: "Mảnh vai áo vải dầu vàng bị giật khỏi Owen khi hắn tấn công. Nhãn khâu bên trong ghi “MARTA — 3”." } },
  },
  truths: {
    T11: { name: { en: "Finch's voice", vi: "Giọng của Finch" }, text: { en: "Finch's last recording names Owen as Holt's contact and describes a planned meeting on the pier. Owen's later incident account says he witnessed Finch fall. Both sources need checking.", vi: "Băng cuối của Finch gọi Owen là đầu mối của Holt, nhắc cuộc hẹn trên cầu tàu. Tường trình sau đó của Owen nói anh ta thấy Finch ngã. Cả hai nguồn đều cần kiểm tra." } },
    T12: { name: { en: "The notebook", vi: "Cuốn sổ" }, text: { en: "Sam's notebook connects names, alleged debts and transport dates. Independent investigators can test it against survivors, bank records and vehicle logs.", vi: "Sổ Sam nối các tên, khoản nợ bị áp đặt và ngày vận chuyển. Điều tra viên độc lập có thể đối chiếu với người sống sót, hồ sơ ngân hàng và nhật ký xe." } },
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
    { ch: 5, t: { en: "Day 5. You organised the recorded times and witness accounts. Owen's journey remained unverified; the gap was a lead, not proof of murder.", vi: "Ngày 5. Bạn sắp các mốc có ghi chép và lời nhân chứng. Lộ trình Owen vẫn chưa xác minh; khoảng trống là đầu mối, chưa phải chứng cứ giết người." } },
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
      { n: { en: "Sunday, Day 5, 9 p.m. Searches have run all day without finding the missing witness. The storm cuts the coastal road. At the station, the outside team sends its first verified timeline.", vi: "Chủ nhật, ngày 5, 9 giờ tối. Tìm kiếm cả ngày vẫn chưa thấy nhân chứng. Bão cắt đường ven biển. Ở đồn, tổ bên ngoài gửi các mốc đầu tiên đã xác minh." } },
      { if: s => (+s.f.ally || 0) >= 2, then: [
        { show: "ruth", at: "c" },
        { say: "ruth", en: "Let's do this properly. The whole night, minute by minute. Put it in order.", vi: "Làm cho đàng hoàng. Cả đêm hôm đó, từng phút một. Xếp lại cho đúng thứ tự." } ],
        else: [
        { n: { en: "Alone at your desk, you write the whole night on cards and spread them out.", vi: "Một mình bên bàn, bạn viết cả đêm hôm đó lên từng tấm thẻ rồi trải ra." } } ] },
      { n: { en: "The briefing distinguishes records from accounts: pub camera, Owen leaving at 1:15; Tom's own account, repairing nets until two; Kieran, a push followed by a splash around two; recovery log, body found at 2:40; duty log, Owen arriving at 3:15. The damaged watch reads 1:47, but cannot time a death by itself.", vi: "Bản tin tách hồ sơ và lời kể: camera quán, Owen rời đi lúc 1:15; Tom tự khai vá lưới tới hai giờ; Kieran kể có cú đẩy rồi tiếng ùm khoảng hai giờ; nhật ký tìm thấy thi thể lúc 2:40; nhật ký trực ghi Owen đến lúc 3:15. Đồng hồ hỏng chỉ 1:47, không tự xác định được giờ chết." } },
      { order: { prompt: { en: "Order the documented or reported events. Keep each source attached to its claim.", vi: "Sắp các sự kiện được ghi hoặc kể lại. Giữ nguồn đi cùng từng nhận định." }, tries: 4,
        items: [
          { t: { en: "Pub camera: Owen leaves the bar.", vi: "Camera quán: Owen rời quầy." }, tag: "1:15" },
          { t: { en: "Kieran's account: a push, then a splash; he runs.", vi: "Lời Kieran: cú đẩy, rồi tiếng ùm; cậu chạy." }, tag: "~2:00" },
          { t: { en: "Recovery log: a fisherman reports the body.", vi: "Nhật ký hiện trường: ngư dân báo thi thể." }, tag: "2:40" },
          { t: { en: "Ruth's call log: she rings you.", vi: "Nhật ký cuộc gọi: Ruth gọi bạn." }, tag: "3:12" },
          { t: { en: "Duty log: Owen signs in at the pier.", vi: "Nhật ký trực: Owen có mặt ở cầu tàu." }, tag: "3:15" },
          { t: { en: "Recorder: Kieran's initial account begins.", vi: "Máy ghi âm: bắt đầu ghi nhận lời Kieran." }, tag: "4:30" },
        ],
        ok: [{ fx: "solve" }], fail: [{ think: { en: "Keep uncertain times labelled. A neat timeline is no use if it invents the missing minutes.", vi: "Giữ nhãn cho những giờ chưa chắc. Dòng thời gian đẹp không có ích nếu bịa ra các phút còn thiếu." } }] } },
      { whom: { prompt: { en: "Whose claim that he came straight from home should be checked against the pub camera?", vi: "Cần đối chiếu lời ai nói rằng mình từ nhà tới thẳng với camera quán?" }, chars: ["tom", "owen", "maggie", "holt"], set: "c5_accuse",
        then: {
          owen: [{ think: { en: "Owen was at the pub earlier. We still cannot place him between 1:15 and 3:15. Check his route and devices; an unexplained gap is not itself a conviction.", vi: "Owen đã ở quán trước đó. Vẫn chưa xác định được anh ta ở đâu từ 1:15 tới 3:15. Cần kiểm tra lộ trình và thiết bị; khoảng trống chưa phải bản án." } }, { set: { c5_owen_alibi: 1 } }],
          tom: [{ think: { en: "Tom says he stayed on the Marta. That is still being checked. The camera contradiction here concerns Owen's journey from home.", vi: "Tom nói ở lại tàu Marta. Việc đó vẫn đang xác minh. Điểm cần đối chiếu với camera ở đây là lời Owen về hành trình từ nhà." } }],
          maggie: [{ think: { en: "The shop till and witnesses place Maggie at the shop for much of the evening. The disputed journey is Owen's.", vi: "Máy tính tiền và nhân chứng đặt Maggie ở quán phần lớn buổi tối. Hành trình bị nghi ở đây là của Owen." } }],
          holt: [{ think: { en: "Holt's guests place him in Newcastle. That does not rule out giving orders. The route we can check now is Owen's.", vi: "Khách dự tiệc nói Holt ở Newcastle. Điều đó không loại trừ việc ra lệnh. Lộ trình hiện có thể kiểm tra là của Owen." } }],
        } } },
      { hide: "*" },
      // ai gặp nguy: Kieran (nếu kẻ xấu biết chỗ cậu ngủ) hoặc Ellie
      { if: s => s.f.gp === "told" || s.f.holt === "no" || s.f.owen_knows, then: [{ set: { danger: "kieran" } }], else: [{ set: { danger: "ellie" } }] },
      { sfx: "phone" },
      { if: s => s.f.danger === "kieran", then: [
        { chat: { with: "kieran", msgs: [
          { from: "kieran", en: "help", vi: "cứu" },
          { from: "kieran", en: "gull point. they just moved me into a cold room. locked the door", vi: "gull point. tụi nó vừa chuyển em vào phòng lạnh. khóa cửa rồi" },
          { from: "kieran", en: "battery dying", vi: "sắp hết pin" },
        ] } } ],
        else: [
        { chat: { with: "ellie", msgs: [
          { from: "ellie", en: "They held me in a van since last night. I got my phone back.", vi: "Chúng giữ tôi trong xe từ tối qua. Tôi vừa lấy lại được điện thoại." },
          { from: "ellie", en: "They have just moved me. Freezer room. Gull Point.", vi: "Chúng vừa chuyển tôi đi. Phòng lạnh. Gull Point." },
          { from: "ellie", en: "Door blocked. Help", vi: "Cửa bị chặn. Cứu" },
        ] } } ] },
      { n: { en: "You forward the message to emergency control immediately. The nearest crew is on the far side of a flooded road; you are at the harbour. Ruth tells you to stay on the radio and approach only the public gate.", vi: "Bạn chuyển tin ngay cho trực ban khẩn cấp. Tổ gần nhất bị chặn bên kia đường ngập; bạn đang ở bến cảng. Ruth dặn giữ liên lạc và chỉ tiếp cận cổng phía đường công cộng." } },
      { meter: { key: "time", label: { en: "Time", vi: "Thời gian" }, max: 6, min: 0, icon: "⏱", color: "#7fb2e5" } },
      { set: { time: 6 } },
      { go: "c5_storm" },
    ],

    c5_storm: [
      { bg: "storm" }, { amb: "rain" }, { mood: "danger" },
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
      { explore: { goal: { en: "Find an entry to the cannery", vi: "Tìm lối vào xưởng" }, need: 0, done: { en: "Try another way in", vi: "Tìm lối khác để vào" }, noUse: { en: "That won't open it.", vi: "Thứ đó không mở được." },
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
            { n: { en: "Broken glass covers the sill. There is nowhere safe to put your hands.", vi: "Kính vỡ phủ kín bậu cửa. Không có chỗ an toàn để đặt tay." } } ] },
        ] } },
      { if: s => !s.f.c5_in, then: [
        { n: { en: "In the end you climb the fence and fall hard on the other side. Your wrist screams.", vi: "Cuối cùng bạn trèo hàng rào và ngã mạnh xuống phía bên kia. Cổ tay đau buốt." } },
        { fx: "redflash" }, { add: { time: -2 } } ] },
      { bg: "dorm" },
      { n: { en: "Inside, behind the machines: a hidden room. Narrow iron beds. Thin bedding. Drawings on the wall. Candle stubs beside a lantern.", vi: "Bên trong, sau những cỗ máy: một căn phòng bí mật. Những chiếc giường sắt hẹp. Chăn đệm mỏng. Tranh vẽ trên tường. Mẩu nến cạnh chiếc đèn lồng." }, pic: "act-torch" },
      { think: { en: "This is where they lived. Kieran. Danny. Sam.", vi: "Đây là nơi chúng sống. Kieran. Danny. Sam." } },
      { explore: { goal: { en: "Search the dormitory (quickly)", vi: "Lục soát phòng ngủ (nhanh lên)" }, need: 1, done: { en: "Find the cold store", vi: "Tìm kho lạnh" },
        spots: [
          { id: "bed", x: 30, y: 58, clue: true, label: { en: "Bed by the wall", vi: "Giường cạnh tường" }, then: [
            { n: { en: "Carved into the wooden frame: 'S + D — WE GET OUT'.", vi: "Khắc trên khung gỗ: “S + D — TỤI MÌNH SẼ THOÁT”." }, pic: "act-carving" },
            { n: { en: "One floorboard under the bed is loose.", vi: "Một tấm ván sàn dưới giường bị lỏng." } },
            { n: { en: "Under it: a cassette tape wrapped in plastic. 'H.F. — 12 OCT'.", vi: "Bên dưới: một cuộn băng bọc túi nhựa. “H.F. — 12 THÁNG 10”." }, pic: "act-floor" },
            { item: "finch_tape2" }, { add: { time: -1 } } ] },
          { id: "wall", x: 70, y: 30, label: { en: "Drawings", vi: "Tranh vẽ" }, then: [
            { n: { en: "Children's drawings. A boat. A house with smoke from the chimney. A boy and a dog. 'HOME', in big letters.", vi: "Tranh trẻ con vẽ. Một con thuyền. Một ngôi nhà có khói bay từ ống khói. Một cậu bé với con chó. Chữ “NHÀ” thật to." } } ] },
        ] } },
      { if: s => s.has("finch_tape2"), then: [
        { n: { en: "You bag the tape and mark where you found it. Somewhere beyond the machinery, a weak knock answers the wind. The recording can wait.", vi: "Bạn cho băng vào túi, ghi nơi tìm thấy. Phía sau máy móc, tiếng gõ yếu đáp lại gió. Nghe băng để sau." } }
      ] },
      { go: "c5_cold" },
    ],

    c5_cold: [
      { bg: "coldstore" }, { mood: "cold" }, { fx: "particles", kind: "snow", ms: 0 },
      { n: { en: "The cold store. The door is jammed with a pallet. Through the small window: frost — and someone curled up on the floor.", vi: "Kho lạnh. Cửa bị chặn bằng một tấm pallet. Qua ô cửa nhỏ: lớp băng — và một người co ro trên sàn." } },
      { if: s => (+s.f.time || 0) <= 2, then: [{ think: { en: "Their hands barely move behind the glass. You stop searching and put everything into shifting the pallet.", vi: "Bàn tay phía sau kính gần như không cử động. Bạn ngừng tìm đồ, dồn sức dịch tấm pallet." } }] },
      { qte: { prompt: { en: "Drag the pallet away! Left, up, right — follow the arrows!", vi: "Kéo tấm pallet ra! Trái, lên, phải — theo mũi tên!" }, kind: "seq", seq: ["◀", "◀", "▲", "▶"], ms: 7000, key: "c5_door",
        ok: [{ sfx: "door" }], fail: [{ n: { en: "It moves at last — slowly. Too slowly.", vi: "Cuối cùng nó cũng dịch ra — chậm. Quá chậm." } }, { add: { time: -1 } }] } },
      { if: s => s.f.danger === "kieran", then: [{ cg: "cg-rescue" }], else: [{ cg: "cg-rescue-ellie" }] },
      { if: s => s.f.danger === "kieran", then: [
        { n: { en: "Kieran. Blue lips. Eyes open. Alive.", vi: "Kieran. Môi tím tái. Mắt mở. Còn sống." } },
        { cg: null },
        { show: "kieran", at: "c", face: "scared" },
        { say: "kieran", en: "You came. You actually came.", vi: "{Ac} đến thật. {Ac} đến thật rồi." },
        { say: "kieran", en: "This time I saw his face. Owen. A yellow coat again. I still couldn't see the face on the first night — don't write that I could.", vi: "Lần này em nhìn rõ mặt. Owen. Lại áo vàng. Đêm đầu em vẫn không thấy mặt — đừng ghi thành em đã thấy." } ],
        else: [
        { n: { en: "Ellie. Wrapped in a sleeping bag, shaking so hard her teeth knock together. Alive.", vi: "Ellie. Quấn trong túi ngủ, run lẩy bẩy tới mức răng va lập cập. Còn sống." } },
        { cg: null },
        { show: "ellie", at: "c", face: "scared" },
        { say: "ellie", en: "He took the food. He asked where Sam had moved. I didn't tell him. I didn't.", vi: "Hắn lấy đồ ăn. Hắn hỏi Sam chuyển tới đâu. Tôi không nói. Tôi không nói đâu." } ] },
      { set: { c5_saved: 1 } },
      { mood: null }, { fx: "particles-off" },
      { say: "me", en: "I need to call for help.", vi: "Phải gọi người tới giúp." },
      { n: { en: "No signal for calls. One bar — enough for a text. Ruth needs to know exactly where you are.", vi: "Không đủ sóng để gọi. Một vạch — đủ gửi tin nhắn. Ruth cần biết chính xác bạn ở đâu." }, pic: "act-message" },
      { type: { prompt: { en: "Draft a precise message in English: Gull Point, behind the cannery, beside the old crane. You will review it before sending.", vi: "Soạn tin rõ vị trí bằng tiếng Anh: Gull Point, phía sau xưởng, cạnh cần cẩu cũ. Bạn sẽ xem lại trước khi gửi." },
        ph: { en: "Gull Point. Behind…", vi: "Gull Point. Behind…" },
        accept: ["behind the cannery next to the old crane", "behind the cannery next to the crane", "gull point behind the cannery next to the old crane", "gull point behind the cannery next to the crane", "behind the cannery by the old crane", "we are behind the cannery next to the old crane", "im behind the cannery next to the old crane", "i'm behind the cannery next to the old crane", "gull point behind the cannery beside the old crane"],
        tries: 2, hint: { en: "Name the site, which side of the building, and a landmark.", vi: "Nêu địa điểm, phía nào của toà nhà và vật làm mốc." },
        ok: [{ set: { c5_draft_clear: 1 } }],
        fail: [{ n: { en: "The draft needs checking. Nothing has been sent yet.", vi: "Cần kiểm tra lại bản nháp. Chưa gửi tin nào." } }] } },
      { choice: [
        { silent: true, speech: false, en: "Send: Gull Point. Rear gate, behind the cannery, next to the old crane. Ambulance needed.", vi: "Gửi: Gull Point. Cổng sau xưởng, cạnh cần cẩu cũ. Cần xe cấp cứu.", set: { c5_msg: "clear" }, then: [
          { n: { en: "Delivered. Ruth replies: 'Rear gate confirmed. Crew approaching by the service road.'", vi: "Đã nhận. Ruth trả lời: “Xác nhận cổng sau. Tổ đang tới theo đường dịch vụ.”" } }
        ] },
        { silent: true, speech: false, en: "Send only: At Gull Point. Hurry.", vi: "Chỉ gửi: Ở Gull Point. Nhanh lên.", set: { c5_msg: "vague" }, then: [
          { n: { en: "Delivered. Ruth asks which gate. Your next message stays unsent as the signal drops; the crew must check both approaches.", vi: "Đã nhận. Ruth hỏi cổng nào. Tin tiếp theo không gửi được khi mất sóng; tổ phải kiểm tra cả hai đường vào." } }
        ] },
      ] },
      { n: { en: "A local rescue volunteer reaches you on foot and takes over warming and monitoring the survivor. You give them the gate location and keep the phone with you.", vi: "Một tình nguyện viên cứu hộ địa phương đi bộ tới, tiếp nhận việc giữ ấm và theo dõi người bị nạn. Bạn chỉ rõ vị trí cổng, giữ điện thoại bên mình." } },
      { hide: "*" },
      { if: s => s.f.danger === "ellie" || s.truth("T8") || s.truth("T5"), then: [
        { n: { en: "'Sam went back to Gull Head after the other shelter was compromised,' comes the whisper. 'There is a storm room above the lamp room. Please tell your team.'", vi: "“Sam quay lại Gull Head sau khi chỗ trốn khác bị lộ,” có tiếng thì thầm. “Trên phòng đèn có một phòng trú bão. Làm ơn báo cho đội của {ac}.”" } } ],
        else: [{ n: { en: "The photo in the envelope. A white lighthouse on a cliff. There's only one: Gull Head.", vi: "Tấm ảnh trong phong bì. Ngọn hải đăng trắng trên vách đá. Chỉ có một: Gull Head." } }] },
      { n: { en: "You leave a written note for the rescue crew: 'Going to Gull Head with the harbour volunteer's directions. Sam may be inside.' The cliff footpath starts behind the cannery; it does not cross the water.", vi: "Bạn để lại giấy cho tổ cứu hộ: “Tới Gull Head theo chỉ đường của tình nguyện viên. Sam có thể ở trong.” Đường bộ ven vách bắt đầu sau xưởng; không phải băng qua mặt nước." } },
      { meter: "time", off: true },
      { go: "c5_light" },
    ],

    c5_light: [
      { cp: "c5_light" },
      { bg: "lighthouse" }, { amb: "sea" }, { fx: "lightning" },
      { n: { en: "You reach the lighthouse entrance by the cliff path. Inside, one hundred and twelve stairs rise to the lamp room. At the top, light shows beneath a closed door.", vi: "Bạn theo đường vách tới cửa hải đăng. Bên trong, một trăm mười hai bậc dẫn lên phòng đèn. Trên cùng, ánh sáng lọt dưới cánh cửa đóng." } },
      { bg: "lamproom" }, { amb: "sea" },
      { show: "sam", at: "c", face: "scared" },
      { set: { met_sam: 1 } },
      { say: "sam", face: "scared", en: "Stay back! I've got— …", vi: "Đứng yên! Em có—…" },
      { say: "sam", face: "crying", en: "…Is that really you?", vi: "…Là {ac} thật sao?" },
      { cg: "cg-reunion" }, { mood: "warm" }, { fx: "particles", kind: "dust", ms: 7000 },
      { n: { en: "Four months. Four months of phone calls that went nowhere, and now he is here, thinner, smelling of sea and smoke, holding on to you like he's six years old.", vi: "Bốn tháng. Bốn tháng gọi điện vào hư không, và giờ nó ở đây, gầy hơn, mùi biển và khói, ôm chặt lấy bạn như hồi sáu tuổi." } },
      { cg: null },
      { show: "sam", at: "c", face: "sad" },
      { choice: [
        { speech: true, tag: "kind", en: "I'm sorry. I'm so sorry I told you not to come back.", vi: "Xin lỗi em. {Ac} xin lỗi vì đã bảo em đừng về nữa.", set: { c5_sorry: 1 }, add: { sam: 2 }, then: [
          { say: "sam", face: "crying", en: "I did want to come back. Every day. But I owed them. And then I saw what they write about kids like me.", vi: "Em muốn về mà. Ngày nào cũng muốn. Nhưng em nợ tụi nó. Rồi em thấy tụi nó viết gì về những đứa như em." } ] },
        { speech: true, tag: "direct", en: "What happened on the pier, Sam?", vi: "Chuyện gì đã xảy ra trên cầu tàu, Sam?", then: [
          { say: "sam", face: "sad", en: "Danny told me to run. So I ran. I left him there.", vi: "Danny bảo em chạy. Thế là em chạy. Em bỏ nó lại." } ] },
      ] },
      { say: "sam", face: "sad", en: "Danny and me, we were going north with Tom. We had the notebook. Then a man in a yellow coat came out of the fog.", vi: "Em với Danny định đi lên phía bắc với Tom. Tụi em có cuốn sổ. Rồi một người mặc áo vàng bước ra từ màn sương." },
      { say: "sam", en: "Danny grabbed his sleeve to give me room. The man shoved him away. Danny hit the post. I heard the water. I shouted for Kieran to run, and I ran too.", vi: "Danny túm tay áo hắn để em lách qua. Hắn đẩy Danny ra. Danny đập vào cọc. Em nghe tiếng nước. Em hét bảo Kieran chạy, rồi em cũng chạy." },
      { fx: "heartbeat" },
      { if: s => s.f.holt === "yes", then: [
        { say: "sam", face: "scared", en: "They say you work for Holt now. That you said yes. Is it true?", vi: "Người ta nói giờ {ac} làm cho Holt. Rằng {ac} đã nhận lời. Có thật không?" },
        { choice: [
          { speech: true, tag: "lie", en: "It's not what it looks like.", vi: "Không phải như em nghĩ đâu.", add: { lie: 1 }, then: [
            { say: "sam", face: "sad", en: "That's what Finch wrote in the papers we found. Words that made people stop asking.", vi: "Trên giấy tờ tụi em tìm được, Finch cũng viết vậy. Những chữ khiến người ta thôi hỏi." },
            { set: { c5_book: "kept" } } ] },
          { speech: true, tag: "direct", en: "I said yes. To get you home.", vi: "{Ac} nhận lời. Để đưa em về nhà.", then: [
            { say: "sam", face: "sad", en: "Then I can't give you this. I'm sorry. Not while he owns you.", vi: "Vậy em không đưa cái này được. Em xin lỗi. Chừng nào hắn còn nắm {ac}." },
            { set: { c5_book: "kept" } } ] },
        ] } ],
        else: [
        { say: "sam", en: "Here. Take it. Danny died for this. Don't let them change one word of it.", vi: "Đây. Cầm lấy. Danny chết vì nó đấy. Đừng để tụi nó sửa một chữ nào." },
        { n: { en: "A battered school notebook. Every page: names, numbers, dates, vans.", vi: "Một cuốn vở học trò sờn cũ. Trang nào cũng có: tên, con số, ngày tháng, xe tải." }, pic: "act-notebook" },
        { item: "sam_book" }, { truth: "T12" }, { set: { c5_book: "given" } } ] },
      { say: "sam", face: "sad", en: "Danny found Finch's tape behind a loose brick at Gull Point. Finch had marked the hiding place in a note. We hid it under the bed until we could get it to someone outside this town.", vi: "Danny tìm thấy băng Finch sau viên gạch lỏng ở Gull Point. Finch đánh dấu chỗ giấu trong giấy. Tụi em cất dưới giường, định gửi người ở ngoài thị trấn." },
      { mood: null },
      { say: "sam", face: "scared", en: "There's a boat. Tom's sister. It leaves at dawn. We could just… go. Both of us. Forget all this.", vi: "Có một chiếc thuyền. Của em gái Tom. Rạng sáng nó đi. Mình có thể cứ… đi thôi. Cả hai. Quên hết mọi chuyện." },
      { choice: [
        { speech: true, en: "…Let's go. Together. Right now.", vi: "…Đi thôi. Cùng nhau. Ngay bây giờ.", set: { c5_run: "run" }, then: [{ go: "c5_north" }] },
        { speech: true, tag: "direct", en: "No. If we run, Danny's death becomes Tom's crime. We finish this.", vi: "Không. Nếu mình chạy, cái chết của Danny sẽ thành tội của Tom. Mình phải làm cho xong.", set: { c5_run: "stay" }, add: { sam: 1 } },
      ], timer: 20, timeout: [{ set: { c5_run: "stay" } }] },
      { hide: "*" },
      { go: "c5_pier" },
    ],

    c5_north: [
      { bg: "dawn" }, { hide: "*" }, { mood: "memory" },
      { n: { en: "At dawn, a small boat slips out past Gull Head. Nobody sees it go.", vi: "Rạng sáng, một chiếc thuyền nhỏ lặng lẽ rời Gull Head. Không ai thấy nó đi." } },
      { cg: "cg-north" },
      { n: { en: "By evening you are on a train going north. Sam sleeps with his head on your shoulder.", vi: "Đến chiều tối bạn đã ngồi trên tàu hoả lên phía bắc. Sam ngủ gục đầu trên vai bạn." } },
      { n: { en: "Back in Port Halden, the case against Tom remains unresolved. Kieran is still protected, but Sam's evidence is missing from the investigation. Holt has more time to move the operation.", vi: "Ở Port Halden, vụ chống Tom còn chưa ngã ngũ. Kieran vẫn được bảo vệ, nhưng điều tra thiếu lời Sam. Holt có thêm thời gian chuyển đường dây đi." } },
      { mood: null },
      { end: "c5_north" },
    ],

    c5_pier: [
      { cp: "c5_pier" },
      { bg: "storm" }, { amb: "rain" }, { mood: "danger" }, { fx: "lightning" },
      { show: "sam", at: "r", face: "scared" },
      { n: { en: "You take Sam down the cliff path to the harbour access road. Storm debris blocks the upper road; the route marked for the rescue crew runs along the sheltered side of the north pier.", vi: "Bạn đưa Sam xuống đường vách về lối ra bến cảng. Cây đổ chặn đường trên; lộ trình dành cho cứu hộ đi dọc phía khuất gió của cầu tàu phía bắc." } },
      { cg: "cg-owen" },
      { n: { en: "In the middle of the pier, in the white light of a torch: a man in a yellow oilskin.", vi: "Giữa cầu tàu, trong ánh đèn pin trắng loá: một người đàn ông mặc áo vải dầu vàng." } },
      { cg: null },
      { show: "owen", at: "c", face: "desperate" },
      { say: "owen", face: "desperate", en: "Evening, trainee. Hello, Sam. You've grown.", vi: "Chào buổi tối, tập sự. Chào Sam. Mày lớn rồi nhỉ." },
      { say: "owen", en: "We're the same, you and me. We write down what people can live with. Give me the notebook and everyone goes home.", vi: "Mày với tao giống nhau thôi. Ta ghi lại những gì người ta có thể sống chung được. Đưa tao cuốn sổ, ai về nhà nấy." },
      { choice: [
        { speech: true, tag: "direct", item: "finch_tape2", intuition: true, lockHint: { en: "You need proof of what happened to Finch.", vi: "Cần bằng chứng về cái chết của Finch." }, en: "I found Finch's last tape. Your report says you watched him fall. I want the tape and your account examined together.", vi: "Tôi tìm được cuộn băng cuối của Finch. Tường trình của anh nói anh thấy ông ngã. Tôi muốn đối chiếu băng với lời anh.", add: { sus: 3 }, then: [
          { say: "owen", face: "angry", en: "Finch slipped.", vi: "Finch trượt chân." },
          { say: "me", en: "Danny slipped too?", vi: "Danny cũng trượt chân à?" } ] },
        { speech: true, tag: "bluff", en: "Ruth is on her way. It's over, Owen.", vi: "Ruth đang tới. Hết rồi, Owen.", then: [
          { if: s => s.f.c5_msg === "clear", then: [{ think: { en: "Please let that be true.", vi: "Mong là thật." } }], else: [{ think: { en: "You don't even know if she got the message.", vi: "Bạn còn chẳng biết bà có nhận được tin không." } }] } ] },
        { speech: true, tag: "kind", en: "You can still stop this. Walk away.", vi: "Anh vẫn còn dừng lại được. Đi đi.", then: [
          { say: "owen", face: "cold", en: "There's nowhere to walk to. Holt owns every road out of this town.", vi: "Chẳng còn đường nào mà đi. Holt nắm hết mọi con đường ra khỏi thị trấn này." } ] },
      ], timer: 12, timeout: [{ say: "owen", face: "desperate", en: "No more talking.", vi: "Thôi nói đủ rồi." }] },
      { say: "owen", face: "desperate", en: "Give it to me!", vi: "Đưa đây!" },
      { fx: "hit" },
      { qte: { prompt: { en: "He lunges! Dodge — follow the arrows!", vi: "Hắn lao tới! Né — theo mũi tên!" }, kind: "seq", seq: ["◀", "▼", "▶"], ms: 4500, key: "c5_dodge",
        ok: [{ n: { en: "You twist away and catch his coat at the shoulder. A strip tears free, including the sewn-in label. You keep hold of it.", vi: "Bạn xoay né, túm vai áo hắn. Một mảnh vải rách ra, kèm nhãn được khâu bên trong. Bạn giữ chặt nó." } }, { item: "oilskin" }],
        fail: [{ fx: "redflash" }, { n: { en: "His shoulder hits you. Your back slams into the railing. Below: black water and the undertow.", vi: "Vai hắn húc vào bạn. Lưng bạn đập mạnh vào lan can. Bên dưới: nước đen và dòng nước ngầm." } }, { set: { c5_hurt: 1 } }] } },
      { if: s => s.f.c5_msg === "clear", then: [
        { sfx: "sting" },
        { n: { en: "Blue lights at the end of the pier. A voice through the wind: 'Owen Price! Stand still!'", vi: "Đèn xanh ở đầu cầu tàu. Một giọng nói xuyên qua gió: “Owen Price! Đứng yên!”" } },
        { show: "ruth", at: "l", face: "cold" },
        { say: "ruth", face: "cold", en: "The rear gate message got us to the survivor. The rescue crew showed us your note for Gull Head; we followed the path down here.", vi: "Tin cổng sau đưa chúng tôi tới người bị nạn. Tổ cứu hộ cho xem giấy {cc} để lại về Gull Head; chúng tôi theo đường xuống đây." },
        { say: "ruth", en: "Owen Price, you are under arrest on suspicion of murder. Step away from them and keep your hands where I can see them.", vi: "Owen Price, anh bị bắt vì nghi liên quan tới án mạng. Lùi khỏi họ, để tay ở chỗ tôi nhìn thấy." },
        { set: { owen_caught: 1, c5_owen: "caught" } } ],
        else: [
        { if: s => s.f.c5_hurt && !s.has("oilskin") && !(+s.f.ally >= 2), then: [{ go: "c5_lowtide" }] },
        { n: { en: "Sam swings the torch. It hits Owen's arm. The light spins into the sea. In the darkness, footsteps — running away.", vi: "Sam vung cây đèn pin. Nó trúng tay Owen. Ánh sáng xoay tròn rơi xuống biển. Trong bóng tối, tiếng bước chân — chạy xa dần." } },
        { set: { owen_gone: 1, c5_owen: "gone" } },
        { n: { en: "When Ruth finally arrives, twenty minutes later, the pier is empty except for the two of you.", vi: "Khi Ruth tới được, hai mươi phút sau, cầu tàu vắng tanh, chỉ còn hai anh em bạn." } } ] },
      { hide: "*" }, { mood: null }, { fx: "particles-off" },
      { if: s => s.has("finch_tape2"), then: [
        { bg: "office" },
        { n: { en: "Monday morning. The survivors are in medical care. An independent officer logs the recovered tape, makes a working copy and plays it while you listen.", vi: "Sáng thứ Hai. Những người sống sót đang được chăm sóc y tế. Một điều tra viên độc lập lập biên bản cuộn băng, tạo bản làm việc rồi phát cho bạn nghe." }, pic: "act-tape" },
        { listen: { who: "finch", audio: "My name is Harold Finch. For eleven years I changed the children's statements. Graham Holt paid me. Detective Sergeant Owen Price is his contact in the station. Owen has asked me to meet him on the north pier on the fourteenth. I am afraid. Keep this recording.", tr: { vi: "Tôi là Harold Finch. Mười một năm nay tôi sửa lời khai trẻ em. Graham Holt trả tiền cho tôi. Trung sĩ Owen Price là đầu mối của hắn trong đồn. Owen hẹn tôi ở cầu tàu phía bắc ngày mười bốn. Tôi sợ. Hãy giữ bản ghi âm này." },
          qs: [
            { q: { en: "Who does Finch say paid him?", vi: "Finch nói ai trả tiền cho mình?" }, opts: ["Owen Price", "Graham Holt", "Tom Ward"], a: 1 },
            { q: { en: "What does the tape establish directly?", vi: "Bản băng trực tiếp xác nhận điều gì?" }, opts: ["Who killed Finch", "That Finch described a planned meeting with Owen", "That every entry in every file is false"], a: 1 },
          ] } },
        { truth: "T11" }, { set: { c5_finch_full: 1 } }
      ] },
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
      text: { en: "Sam is safe, and for tonight that is all you can hold. But the unanswered case travels north with you. On every station platform, he checks the people behind him.", vi: "Sam an toàn, và tối nay bạn chỉ đủ sức giữ điều đó. Nhưng vụ án chưa giải đáp đi cùng hai người lên phía bắc. Ở mỗi sân ga, em đều nhìn những người phía sau." } },
    c5_lowtide: { ch: 5, final: true, title: { en: "Low Tide", vi: "Nước ròng" },
      sum: { en: "The sea took you. Go back to a turning point.", vi: "Biển đã cuốn bạn đi. Quay về một điểm rẽ." },
      text: { en: "Three days later the search team finds you. The first report says a fall during the storm. Ruth keeps your messages beside it, refusing to let that description become the end of the inquiry.", vi: "Ba ngày sau đội tìm kiếm thấy bạn. Báo cáo đầu nói một cú ngã trong bão. Ruth giữ tin nhắn của bạn bên cạnh, không để mô tả đó trở thành dấu chấm hết điều tra." } },
    c5_dawn: { ch: 5, next: "c6", nextTitle: { en: "Chapter 6 — Testimony", vi: "Chương 6 — Lời khai" }, title: { en: "After the Storm", vi: "Sau cơn bão" },
      sum: { en: "You survived the night. Now the court.", vi: "Bạn sống sót qua đêm. Giờ là toà án." },
      text: { en: "The storm moves out to sea. Sam sleeps in the back of Ruth's car. The originals go to an outside team. Months of interviews, checks and hearings lie ahead — and one question you cannot avoid.", vi: "Cơn bão lui ra khơi. Sam ngủ ở ghế sau xe Ruth. Bản gốc được chuyển cho tổ độc lập. Phía trước là nhiều tháng lấy lời khai, kiểm tra và xét xử — cùng một câu hỏi bạn không thể tránh." } },
  },
});
