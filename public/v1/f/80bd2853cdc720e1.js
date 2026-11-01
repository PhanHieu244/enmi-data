// BETWEEN TIDES · CHƯƠNG 6 — GIỮA HAI CON NƯỚC (02:21 → bình minh).
// Chương dữ liệu; không thay runtime, khóa lưu hoặc cơ chế của engine.
// Sự thật chỉ đọc từ lượt hiện tại. T13 được xác minh tại máy hầm; T14 cần lời nhận tội.
// Không bù T1–T12 đã bỏ lỡ. Đồng hành đã nhận lời không rút đi khi người chơi chọn sai.
(() => {
  const L = (en, vi) => ({ en, vi });
  const N = (en, vi, extra = {}) => ({ n: L(en, vi), ...extra });
  const D = (say, en, vi, face = undefined, tone = "quiet, natural") => ({ say, en, vi, tone, ...(face ? { face } : {}) });
  const G = go => ({ go });
  const I = (cond, then, otherwise = []) => ({ if: cond, then, else: otherwise });
  // Chapter-six choices are actions or evidence labels; spoken dialogue lives in D frames.
  const C = (en, vi, then, extra = {}) => ({ en, vi, then, silent: true, ...extra });
  const localTruth = (s, id) => !!s.R?.truths?.[id];
  const sand = s => s.f.dunes_with === "wait";
  const leoHere = s => s.f.c6_companion === "leo";
  const nearLeo = s => (s.f.leo || 0) >= 2;
  const knownHome = s => !!s.f.c5_back_door && (!!s.f.c5_mam_account || !!s.f.c5_referred_mam);
  const paperCase = s => !!s.f.p_fetched && !!s.f.p_anna_talking && knownHome(s) && localTruth(s, "T10");
  const physicalCase = s => s.has("skull") && !!s.f.p_anna_talking && !!s.f.p_second_blow;
  const wholeCase = s => !!s.f.c6_2004_chain || (!!s.f.c6_fetched_nell && physicalCase(s));
  const hiddenEnd = s => !sand(s) && s.f.leo >= 3 && !!s.f.helen_promise && !s.f.c6_mistakes
    && (s.f.c6_proved || 0) >= 3 && Array.from({ length: 14 }, (_, i) => "T" + (i + 1)).every(id => localTruth(s, id));
  const testimony = (en, vi, de, dv) => ({ icon: "doc", kind: "testimony", art: "it-testimony", name: L(en, vi), desc: L(de, dv) });

  // Vùng lấy từ ảnh gốc đang đóng gói; không đặt cử chỉ ngoài vật trên ảnh.
  StoryEngine.regions({
    cellar: { size: [941, 1672], r: { c6_phone: [7.5, 27.5, 16, 12], c6_sink: [8, 44, 32, 14], c6_steps: [66, 8, 32, 72] } },
    "act-handset": { size: [1448, 1086], r: { c6_keys: [44, 40, 17, 12], c6_screen: [43, 18, 17, 18] } },
    "cg-dawn-wall": { size: [941, 1672], r: { c6_last_line: [17, 45, 55, 7] } },
  });

  const items = {
    c6_home_account: testimony("Callum: home through the back", "Callum: về bằng cửa sau",
      "Callum came home through the back. The guest rooms were empty. He told his mother; she put him to bed.",
      "Callum về bằng cửa sau. Các phòng trọ trống. Anh kể với mẹ; bà cho anh đi ngủ."),
    c6_home_referral: testimony("Callum: ask my mother", "Callum: hỏi mẹ tôi",
      "Callum came through the back to empty guest rooms. Asked who knew, he sent you to his mother.",
      "Callum vào bằng cửa sau, các phòng trọ trống. Khi được hỏi ai biết chuyện, anh chỉ bạn tới mẹ mình."),
    c6_truck_account: testimony("Callum had Tom's truck", "Callum giữ xe tải của Tom",
      "Callum drove Tom's truck, then abandoned it on the causeway. Tom's pencil line says someone fetched him at 20:45.",
      "Callum lái xe tải của Tom rồi bỏ xe trên đường ngầm. Dòng bút chì của Tom ghi có người đón ông lúc 20:45."),
    c6_helen_bar: testimony("Helen: Nell was absent", "Helen: Nell vắng ở quầy",
      "At 21:10 Helen stood inside the phone box without dialling. She could see Fergus at the bar, but not Nell.",
      "Lúc 21:10 Helen ở trong bốt điện thoại nhưng không bấm số. Bà nhìn thấy Fergus ở quầy, không thấy Nell."),
    c6_slipway_accounts: testimony("22:30: who was on the slipway", "22:30: những người ở dốc bến",
      "Helen places herself, Gideon and Fergus on the slipway at 22:30. Nell had gone back to fetch blankets.",
      "Helen xác nhận mình, Gideon và Fergus ở dốc bến lúc 22:30. Nell đã quay về lấy chăn."),
    c6_nell_letter: {
      icon: "doc", keep: true, name: L("Nell's letter", "Thư của Nell"),
      desc: L("She claims the 2004 collision. She says Callum was in bed. There is no account of Tom's death tonight.",
        "Bà nhận gây ra vụ tông năm 2004, nói Callum đang ngủ. Thư không kể về cái chết của Tom đêm nay."),
      doc: { paper: "letter", hand: "script", title: L("A page from the order pad", "Một trang giấy ghi món"), lines: [
        L("It was me. 14th November 2004.", "Là tôi. Ngày 14 tháng Mười một năm 2004."),
        L("I hit Anna Rowe on the causeway in the dark.", "Tôi tông Anna Rowe trên đường ngầm trong bóng tối."),
        L("I put her in the north dunes. I asked Tom to see to her car, and he did.", "Tôi để bà ấy ở cồn cát phía bắc. Tôi nhờ Tom lo chiếc xe, và anh ấy đã làm."),
        L("He thought it was the crash.", "Anh ấy tưởng là do cú tông."),
        L("Callum was home in bed. He was fourteen. He knew nothing.", "Callum ở nhà, nằm trên giường. Nó mới mười bốn tuổi. Nó không biết gì cả."),
        L("They'd have taken him off me, after Rob. I'd lost one.", "Người ta hẳn đã tước nó khỏi tay tôi, sau chuyện Rob. Tôi đã mất một người rồi."),
        L("I'm sorry. Nell", "Tôi xin lỗi. Nell"),
      ] },
    },
  };

  const nodes = {
    c6_open: [
      { cp: "c6_open" }, { hide: "*" }, { bg: "lantern" }, { clock: "02:21" },
      { set: { goal: "c6_lantern" } },
      I(s => !s.f.c6_started, [{ set: { c6_started: true, c6_proved: 0, c6_mistakes: 0, c6_fetched_nell: false,
        c6_2004_chain: false, c6_companion: "none", c6_resolution: "", c6_nell_admitted: false } }]),
      { title: { ch: 6, ...L("Between Tides", "Giữa hai con nước") } },
      N("The Lantern is unlocked. Skerry follows you inside. Every glass is washed; every chair is pushed in.",
        "Cửa The Lantern không khóa. Skerry theo bạn vào. Ly đã rửa sạch; ghế đã đẩy sát bàn."),
      N("The clock says 02:21. Nell's Land Rover is gone from the yard.", "Đồng hồ chỉ 02:21. Chiếc Land Rover của Nell không còn trong sân."),
      I(sand, [N("You brought no remains back from the dunes. Now the woman who warmed your hands is missing too.",
        "Bạn không mang được hài cốt nào về từ cồn cát. Giờ người đàn bà từng sưởi ấm đôi tay bạn cũng biến mất.")],
      [N("Leo is securing the skull at the station. You wait beside the little step Nell uses to ring the bell.",
        "Leo đang cất giữ hộp sọ ở trạm. Bạn đứng chờ cạnh cái bậc Nell dùng để rung chuông.")]),
      N("An empty place on the bottle shelf. A square of light above the open cellar hatch.",
        "Một chỗ trống trên kệ chai. Một ô ánh sáng phía trên nắp hầm đang mở."),
      I(s => s.f.c5_mam_account && s.f.c5_back_door, [{ item: "c6_home_account" }]),
      I(s => s.f.c5_referred_mam && s.f.c5_back_door && !s.f.c5_mam_account, [{ item: "c6_home_referral" }]),
      I(s => localTruth(s, "T10") && s.f.p_fetched, [{ item: "c6_truck_account" }]),
      { choice: [
        C("Review who fetched Tom in 2004", "Xem lại ai đã đón Tom năm 2004", [G("c6_deduction")]),
        C("Inspect the cellar first", "Xuống xem hầm trước", [G("c6_cellar_entry")]),
      ] },
    ],

    c6_deduction: [
      { cp: "c6_deduction" },
      I(s => !s.f.p_fetched || !localTruth(s, "T10"), [
        N("That connection is missing from your own notes. A name alone would be a guess.",
          "Ghi chép của bạn còn thiếu mắt xích đó. Chỉ nêu một cái tên sẽ là đoán mò."), G("c6_deduction_done"),
      ]),
      N("Tom wrote 'Fetched 20:45'. Callum had his truck. Someone else brought Tom to the causeway.",
        "Tom ghi “Được đón lúc 20:45”. Callum đang giữ xe tải. Một người khác đã đưa Tom ra đường ngầm."),
      { deduce: {
        q: L("Who at home knew enough to fetch Tom?", "Ai ở nhà đã biết đủ chuyện để tới đón Tom?"),
        a: [["logbook", "c6_home_account"], ["c6_truck_account", "c6_home_account"],
          ["logbook", "c6_home_referral"], ["c6_truck_account", "c6_home_referral"]],
        cards: ["logbook", "c6_home_account", "c6_home_referral", "c6_truck_account", "ring", "peg"],
        nudge: L("Look for two accounts that explain each other's missing detail.",
          "Tìm hai lời kể có thể giải thích chỗ còn thiếu của nhau."),
        hint: L("Connect the collection at 20:45 with Callum's account of coming home.",
          "Nối việc đón Tom lúc 20:45 với lời kể của Callum khi về nhà."),
        review: { with: [
          { id: "ring", text: L("The ring identifies Anna. It does not say who knew about the crash at home.",
            "Chiếc nhẫn xác định Anna. Nó không cho biết ai ở nhà đã nghe về vụ tông.") },
          { id: "peg", text: L("The peg places the survey in the dunes. It does not account for Tom's journey.",
            "Cái cọc đặt việc khảo sát ở cồn cát. Nó không giải thích chuyến đi của Tom.") },
        ], text: L("One account must establish the journey; the other must establish who knew why Tom was needed.",
          "Một lời kể cần xác định chuyến đi; lời kia cần xác định ai biết vì sao phải tìm Tom.") },
        missing: L("You need Tom's pencil entry and Callum's actual account, not a suspect's name.",
          "Bạn cần dòng bút chì của Tom và lời kể đã nghe từ Callum, không chỉ tên nghi phạm."),
        tries: 1, ok: [G("c6_deduction_yes")], fail: [
          { add: { c6_mistakes: 1 } },
          N("The clues don't meet yet. You can look once more, or leave this question open.",
            "Các manh mối chưa khớp. Bạn có thể xem lại một lần, hoặc để ngỏ câu hỏi này."),
          { choice: [C("Look again", "Xem lại", [G("c6_deduction_retry")]), C("Leave it open", "Tạm để ngỏ", [G("c6_deduction_done")])] },
        ],
      } },
    ],
    c6_deduction_retry: [
      { deduce: {
        q: L("Who heard about the crash before Tom was fetched?", "Ai đã nghe chuyện vụ tông trước khi Tom được đón?"),
        a: [["logbook", "c6_home_account"], ["c6_truck_account", "c6_home_account"],
          ["logbook", "c6_home_referral"], ["c6_truck_account", "c6_home_referral"]],
        cards: ["logbook", "c6_home_account", "c6_home_referral", "c6_truck_account", "ring", "peg"],
        nudge: L("Keep the journey separate from the news that prompted it.",
          "Tách chuyến đi khỏi tin tức đã khiến người ta phải đi."),
        hint: L("He came through the back. The guest rooms were empty. Who does his account point to?",
          "Anh vào bằng cửa sau. Các phòng trọ trống. Lời anh kể hướng tới ai?"),
        review: { text: L("A shared name is not enough. The pair must connect Tom's journey with news of the crash.",
          "Trùng một cái tên chưa đủ. Hai thẻ cần nối chuyến đi của Tom với tin về vụ tông.") },
        tries: 1, ok: [G("c6_deduction_yes")], fail: [
          N("You cannot support the link yet. Keep it as a question, not a finding.",
            "Bạn chưa chứng minh được liên hệ ấy. Hãy giữ nó như một câu hỏi, chưa phải kết luận."), G("c6_deduction_done"),
        ],
      } },
    ],
    c6_deduction_yes: [
      { set: { c6_fetched_nell: true } },
      N("Nell knew. Callum had come home to her; Tom could not drive his own truck.",
        "Nell biết chuyện. Callum đã về nhà với bà; Tom không thể lái chiếc xe tải của mình."),
      N("That makes her the person to ask about 20:45. It does not yet prove what she did to Anna.",
        "Vậy bà là người cần hỏi về mốc 20:45. Điều đó chưa chứng minh bà đã làm gì với Anna."),
      { note: L("2004: Nell is the supported lead for fetching Tom. What happened before that still needs evidence.",
        "2004: có căn cứ để hỏi Nell về việc đón Tom. Chuyện xảy ra trước đó vẫn cần chứng cứ.") },
      G("c6_deduction_done"),
    ],
    c6_deduction_done: [I(s => !!s.f.c6_phone_verified, [G("c6_after_letter")], [G("c6_cellar_entry")])],

    c6_cellar_entry: [
      { cp: "c6_cellar_entry" }, { set: { goal: "c6_phone" } },
      I(nearLeo, [
        { show: "leo", at: "r", face: "sad" },
        N("Leo returns from the empty rooms upstairs. He stops beside the hatch.",
          "Leo từ những phòng trống trên lầu quay xuống. Anh dừng cạnh nắp hầm."),
        D("leo", "Her bed's made. She hasn't been in it.", "Giường bác ấy vẫn trải phẳng. Bác ấy chưa nằm."),
        D("leo", "I'll come down with you. Leave everything where it is.", "Tôi xuống cùng {ac}. Cứ để nguyên mọi thứ.", "determined"),
      ], [
        N("Leo is still at the station. You call through the hatch. No answer.",
          "Leo vẫn ở trạm. Bạn gọi xuống hầm. Không có tiếng đáp."),
      ]),
      { hide: "*" }, { bg: "cellar" }, { clock: "02:23" },
      N("Cold stone. Beer barrels. Beside the sink, a cordless handset glows in its cradle.",
        "Đá lạnh. Những thùng bia. Bên cạnh bồn rửa, chiếc máy không dây sáng lên trên giá."),
      { place: "c6_cellar" },
      G("c6_phone_check"),
    ],
    c6_phone_check: [
      { cp: "c6_phone_check" },
      { read: { paper: "screen", hand: "type", title: L("Two records from the same handset", "Hai mục trên cùng một máy"), lines: [
        L("CALLS MADE · 21:11 — 141 01289 381214", "CUỘC GỌI ĐI · 21:11 — 141 01289 381214"),
        L("DIRECTORY · TOM ASHBY — 01289 381214", "DANH BẠ · TOM ASHBY — 01289 381214"),
        L("141 hides the caller's number. It is not part of Tom's number.",
          "141 dùng để giấu số người gọi. Nó không thuộc số của Tom."),
      ] } },
      { choice: [
        C("The cellar handset called Tom at 21:11", "Máy dưới hầm gọi cho Tom lúc 21:11", [
          { set: { c6_phone_verified: true, p_cellar_call: true } }, { truth: "T13" },
          { note: L("Verified: outgoing 21:11, prefix 141, Tom's exact stored number. The source handset was in the Lantern cellar.",
            "Đã đối chiếu: cuộc gọi đi 21:11, tiền tố 141, đúng số Tom trong danh bạ. Máy gọi đặt trong hầm The Lantern.") },
          G("c6_helen"),
        ]),
        C("Tom called the cellar at 21:11", "Tom gọi xuống hầm lúc 21:11", [
          N("The heading says CALLS MADE. These calls went out from this handset.",
            "Tiêu đề ghi CUỘC GỌI ĐI. Các cuộc gọi này được thực hiện từ máy đang xem."), G("c6_phone_check"),
        ], { add: { c6_mistakes: 1 } }),
      ] },
    ],
    c6_helen: [
      { bg: "lantern" }, { show: "helen", at: "c", face: "sad" },
      I(nearLeo, [D("helen", "Leo? I saw the light. There's something I should have told you.",
        "Leo? Tôi thấy đèn sáng. Có chuyện tôi đáng ra phải nói với cậu.")],
      [D("helen", "I saw the light. Is Nell here? There's something I should have told Leo.",
        "Tôi thấy đèn sáng. Nell có ở đây không? Có chuyện tôi đáng ra phải nói với Leo.")]),
      I(s => s.f.helen_box_early, [
        D("helen", "You know about the phone box. I'll put it on record now.",
          "{Ac} đã biết chuyện bốt điện thoại. Giờ tôi sẽ khai lại chính thức.", "ashamed"),
      ], [
        I(s => s.f.helen_promise, [D("helen", "You kept your word. I need to keep mine.",
          "{Ac} đã giữ lời. Tôi cũng phải giữ lời mình.", "ashamed")],
        [D("helen", "I told Leo about the ampoules. I left something out.", "Tôi đã kể Leo chuyện những ống thuốc. Tôi bỏ sót một việc.", "ashamed")]),
      ]),
      { talk: {
        with: "helen", prompt: L("Ask about the two times on the handset", "Hỏi về hai mốc giờ trên máy"),
        topics: [
          { id: "c6_helen_2110", label: L("21:10 · the phone box", "21:10 · bốt điện thoại"), then: [
            D("helen", "I picked it up three times. I couldn't dial.", "Tôi nhấc ống nghe ba lần. Tôi không bấm nổi.", "ashamed"),
            D("helen", "From there I could see the bar. Fergus was on his stool. Nell wasn't behind the counter.",
              "Từ đó nhìn thấy quầy. Fergus ngồi trên ghế. Nell không đứng sau quầy."),
            { item: "c6_helen_bar" }, { set: { c6_helen_2110: true } },
          ] },
          { id: "c6_helen_2230", label: L("22:30 · the slipway", "22:30 · dốc bến"), then: [
            D("helen", "I was on the slipway. Gideon was beside me. Fergus hadn't gone back up yet.",
              "Tôi ở dốc bến. Gideon đứng cạnh tôi. Fergus vẫn chưa quay lên quán."),
            D("helen", "Nell said she'd fetch blankets. She went back alone.",
              "Nell bảo sẽ đi lấy chăn. Bà ấy quay về một mình."),
            { item: "c6_slipway_accounts" }, { set: { c6_helen_2230: true } },
          ] },
          { id: "c6_helen_why", label: L("Why didn't you say this earlier?", "Sao bà không nói sớm hơn?"), then: [
            D("helen", "Because I'd have had to explain why I was there.", "Vì tôi sẽ phải giải thích tại sao mình ở đó.", "ashamed"),
            D("helen", "That isn't an excuse. It's the answer.", "Đó không phải lời bào chữa. Đó là câu trả lời."),
          ] },
        ],
      } },
      // Không bắt buộc hỏi hết: bỏ qua lời nhân chứng sẽ thiếu lựa chọn tương ứng khi đối chất.
      I(nearLeo, [
        { show: "leo", at: "r", face: "determined" },
        D("leo", "I'll preserve the handset. Your photographs stay with your notes.", "Tôi sẽ giữ nguyên chiếc máy. Ảnh chụp để cùng ghi chép của {ac}."),
      ], [N("You send Leo the two photographs, with the times and the location. He acknowledges receipt.",
        "Bạn gửi Leo hai ảnh, kèm giờ và địa điểm. Anh xác nhận đã nhận được.")]),
      { hide: "*" }, G("c6_letter"),
    ],
    c6_letter: [
      { cp: "c6_letter" }, { clock: "02:26" }, { set: { goal: "c6_nell" } },
      N("Helen switches on the bar lights. In the gap where TOM stood, a sheet of paper lies folded in three.",
        "Helen bật đèn quầy. Ở chỗ trống từng đặt chai TOM, một tờ giấy gấp làm ba nằm đó."),
      { item: "c6_nell_letter" }, { read: "c6_nell_letter" },
      N("Round, careful handwriting. Not Tom's hard capitals. You read it twice.",
        "Nét chữ tròn, cẩn thận. Không phải chữ in hoa cứng của Tom. Bạn đọc hai lần."),
      N("The second time, you read the omission: not one word about Tom tonight.",
        "Lần thứ hai, bạn đọc điều bị bỏ trống: không một chữ về Tom đêm nay."),
      I(s => s.f.c5_mam_account, [
        N("'Home in bed.' Yes. After he came through the back. After he told her.",
          "“Ở nhà, nằm trên giường.” Phải. Sau khi cậu vào bằng cửa sau. Sau khi cậu kể với bà."),
      ], [N("'He knew nothing.' That does not match the boy who described the crash to you.",
        "“Nó không biết gì cả.” Điều đó không khớp với cậu bé đã kể cho bạn nghe về vụ tông.")]),
      { set: { c6_read_letter: true } },
      { choice: [
        C("Check the 2004 connection before leaving", "Kiểm tra liên hệ năm 2004 trước khi đi", [G("c6_deduction")], { if: s => !s.f.c6_fetched_nell }),
        C("Find Nell", "Tìm Nell", [G("c6_after_letter")]),
      ] },
    ],
    c6_after_letter: [
      { show: "gideon", at: "c", face: "scared" },
      D("gideon", "Torches on the dunes. Someone at my old car. What's happened?",
        "Đèn pin trên cồn cát. Có người tới chiếc xe cũ của tôi. Có chuyện gì vậy?"),
      { choice: [
        C("Ask why the engine was warm", "Hỏi vì sao máy xe còn ấm", [
          D("me", "Your old Land Rover was warm. You said you weren't driving.", "Chiếc Land Rover cũ của ông còn ấm máy. Ông bảo không lái xe."),
          D("gideon", "I pulled the survey pegs. Tom asked me last month. I should have listened then.",
            "Tôi nhổ cọc khảo sát. Tom nhờ tôi từ tháng trước. Lẽ ra khi ấy tôi nên nghe ông ấy.", "sad"),
          D("gideon", "I was home by twenty to two. Ask my housekeeper. Three pegs, then home.",
            "Hai giờ kém hai mươi tôi đã về nhà. Cứ hỏi người quản gia. Ba cái cọc, rồi về.", "cold"),
          N("You record the account for checking. A warm engine alone cannot tell you who moved the remains.",
            "Bạn ghi lời kể để kiểm tra. Chỉ máy xe ấm chưa cho biết ai đã dời hài cốt."),
          { set: { c6_gideon_explained: true } },
          { note: L("Gideon says he removed three pegs and returned at 01:40. His account needs independent checking.",
            "Gideon nói đã nhổ ba cọc rồi về lúc 01:40. Lời kể cần được kiểm tra độc lập.") },
        ]),
        C("There isn't time to ask now", "Giờ không còn thời gian để hỏi", [{ set: { c6_gideon_explained: false } }]),
      ] },
      { hide: "*" },
      N("Skerry stands at the window. Far out beside the refuge box, headlights switch on. They stay still.",
        "Skerry đứng bên cửa sổ. Xa ngoài chòi trú nạn, một cặp đèn pha bật lên. Đứng yên."),
      N("The Lantern's yard is empty. The road is coming back out of the water.",
        "Sân The Lantern trống trơn. Con đường đang hiện dần khỏi mặt nước."),
      { clock: "02:30" }, G("c6_depart"),
    ],
    c6_depart: [
      { cp: "c6_depart" }, { set: { goal: "c6_reach" } },
      I(nearLeo, [{ set: { c6_companion: "leo", c6_transport: "leo_car" } }, G("c6_leo_drive")], [
        I(s => (s.f.callum || 0) >= 2, [{ set: { c6_companion: "callum" } }, G("c6_callum_ride")], [G("c6_alone")]),
      ]),
    ],
    c6_leo_drive: [
      { show: "leo", at: "c", face: "determined" },
      D("leo", "The water's low enough. I'll drive. Helen's calling the mainland. Bring the dog.",
        "Nước đã đủ thấp. Tôi lái. Helen đang gọi đất liền. Mang theo con chó."),
      { hide: "*" }, { bg: "causeway" },
      N("Skerry lies across your feet. Leo takes the marked road slowly, checking the water against the posts.",
        "Skerry nằm vắt ngang chân bạn. Leo đi chậm theo đường có cọc đánh dấu, kiểm tra mực nước."),
      I(s => localTruth(s, "T9"), [D("leo", "Dad and me at the window. Two lots of lights. Tonight someone goes out to look.",
        "Hai bố con ở cửa sổ. Hai cặp đèn. Đêm nay sẽ có người ra xem.", undefined, "quiet, resolved")],
      [D("leo", "Whatever is out there, we go together.", "Ngoài đó có gì thì mình cũng tới cùng nhau.", undefined, "steady")]),
      G("c6_channel"),
    ],
    c6_callum_ride: [
      { bg: "harbour" }, { show: "callum", at: "c", face: "scared" },
      N("Callum is looking at the same headlights. You show him the letter and the photographs.",
        "Callum đang nhìn đúng cặp đèn ấy. Bạn cho anh xem lá thư và ảnh chụp."),
      D("callum", "That's Mam's car.", "Xe của mẹ tôi."),
      I(s => s.f.gideon_private, [
        N("Gideon has lent you his keys. Callum drives; you send Leo your destination.",
          "Gideon đã cho bạn mượn chìa khóa. Callum lái; bạn gửi Leo nơi hai người sắp tới."),
        { set: { c6_transport: "gideon_car" } }, { hide: "*" }, { bg: "causeway" },
      ], [
        D("callum", "Lifejackets first. Then aboard. I'll keep us inside the channel markers.", "Mặc áo phao trước. Rồi lên thuyền. Tôi sẽ đi trong hàng cọc đánh dấu kênh."),
        { set: { c6_transport: "callum_boat" } }, { hide: "*" }, { bg: "boat" },
        N("You fasten your lifejackets. The Mairi Rose moves against the falling tide. You radio Leo your destination.",
          "Hai người cài áo phao. Thuyền Mairi Rose ngược dòng nước đang rút. Bạn báo qua bộ đàm cho Leo nơi mình tới."),
      ]),
      N("Callum looks once at the phone screen. After that, only at the lights.",
        "Callum nhìn màn hình điện thoại một lần. Sau đó, anh chỉ nhìn cặp đèn."), G("c6_channel"),
    ],
    c6_alone: [
      N("Leo acknowledges your message, but stays with the station radio. Callum doesn't answer your call.",
        "Leo nhận tin nhưng vẫn ở bên bộ đàm của trạm. Callum không trả lời cuộc gọi của bạn."),
      N("You send the exact location and ask for immediate help. There is nobody beside you.",
        "Bạn gửi vị trí chính xác và yêu cầu hỗ trợ ngay. Không có ai ở bên bạn."),
      { choice: [
        C("Go towards the headlights", "Đi về phía cặp đèn", [G("c6_too_late")]),
        C("Keep the evidence safe and wait for police", "Giữ chứng cứ và chờ cảnh sát", [
          I(sand, [G("c6_sand_end")], [G("c6_stranger")]),
        ]),
      ] },
    ],
    c6_channel: [
      { cp: "c6_channel" }, { hide: "*" }, { bg: "causeway" }, { clock: "02:35" },
      N("The Lantern's Land Rover stands beside the refuge box. Pale dune sand packs the wheel arches.",
        "Land Rover của The Lantern đỗ cạnh chòi trú nạn. Cát cồn nhạt màu lèn trong các hốc bánh xe.", { pic: "cg-confront" }),
      N("Nell stands at the channel's edge, in her rain-dark blouse and apron. Skerry goes straight to her.",
        "Nell đứng ở mép kênh, áo sẫm vì mưa, vẫn đeo tạp dề. Skerry đi thẳng tới chỗ bà."),
      { show: "nell", at: "c", face: "sad" },
      I(sand, [N("Her hands are empty. On the open passenger seat: sand and the cut end of a rope.",
        "Hai tay bà trống không. Trên ghế phụ đang mở cửa: cát và một đầu dây bị cắt.")],
      [N("A rope trails from the open vehicle. She holds it in one hand, the other resting on Skerry.",
        "Một sợi dây kéo từ chiếc xe mở cửa. Bà giữ bằng một tay; tay kia đặt lên Skerry.")]),
      D("nell", "You'll catch your death out here, pet. In those shoes.",
        "Ngoài này chết cóng mất, cháu ạ. Lại còn đi đôi giày ấy.", "sad", "gentle, distracted"),
      I(leoHere, [
        { show: "leo", at: "r", face: "determined" },
        D("leo", "Nell. Step away from the edge. We're here.", "Bác Nell. Lùi khỏi mép nước đi. Có chúng tôi ở đây rồi.", "determined", "calm, firm"),
        N("He stands within reach. His radio stays open.", "Anh đứng đủ gần để giữ bà. Bộ đàm vẫn mở."),
      ], [
        { show: "callum", at: "r", face: "scared" },
        N("Callum reaches his mother and holds her. Between her and the deep water.",
          "Callum tới bên mẹ, giữ lấy bà. Anh đứng giữa bà và chỗ nước sâu.", { pic: "cg-confront-callum" }),
        D("nell", "Let go of me, pet.", "Buông mẹ ra, con.", "pleading"),
        D("callum", "I turned my back on that lamp once.", "Con đã quay lưng với ngọn đèn ấy một lần rồi.", "sad", "low, resolute"),
        N("He does not let go. He stays while you speak, his arms never loosening.",
          "Anh không buông. Trong lúc bạn nói, vòng tay anh vẫn không nới lỏng.")
      ]),
      G("c6_accuse"),
    ],
    c6_accuse: [
      { cp: "c6_accuse" }, { set: { goal: "c6_case" } },
      { choice: [
        C("Ask Nell to answer the evidence", "Yêu cầu Nell trả lời chứng cứ", [G("c6_nell_case")]),
        C("Accuse Callum", "Buộc tội Callum", [G("c6_accuse_callum")]),
        C("Accuse Gideon", "Buộc tội Gideon", [G("c6_accuse_gideon")]),
        C("Accuse Dr Vosper", "Buộc tội bác sĩ Vosper", [G("c6_accuse_helen")]),
        C("Submit the evidence without an accusation", "Nộp chứng cứ, chưa buộc tội ai", [G("c6_stranger")]),
      ] },
    ],
    c6_nell_case: [
      D("me", "The call came from your cellar, Nell. Your letter leaves tonight out.",
        "Cuộc gọi từ hầm nhà {c6addr}, {c6addr} Nell. Thư của {c6addr} không nhắc tới đêm nay.", undefined, "controlled, direct"),
      N("A question, then a record. You need to test what she says against what you actually found.",
        "Một câu hỏi, rồi một chứng cứ. Bạn cần đối chiếu lời bà với những gì mình thực sự tìm được."),
      G("c6_lie1"),
    ],
  };

  const places = {
    c6_cellar: {
      id: "c6_cellar", name: L("The cellar", "Dưới hầm"), goal: L("Inspect the handset's outgoing calls and saved contact", "Xem cuộc gọi đi và danh bạ trên máy"),
      start: "room", ring: ["room"], need: ["calls", "contact"], leave: false,
      views: {
        room: { img: "cellar", name: L("The cellar", "Dưới hầm"), loc: true, zones: [
          { id: "handset", r: "c6_phone", label: L("Handset", "Máy điện thoại"), to: "phone" },
          { id: "sink", r: "c6_sink", label: L("Sink", "Bồn rửa"), then: [
            N("A faint smell of whisky. No bottle. The sink alone cannot tell you what was washed, or when.",
              "Thoảng mùi whisky. Không có chai. Chỉ cái bồn không cho biết thứ gì đã được rửa, hay rửa lúc nào."),
          ], again: [N("The smell is a lead. The call list can give you a time.", "Mùi chỉ là đầu mối. Danh sách cuộc gọi có thể cho bạn một mốc giờ.")] },
          { id: "stairs", r: "c6_steps", label: L("Back upstairs", "Trở lên quầy"), exit: true },
        ] },
        phone: { img: "act-handset", up: "room", name: L("The wall handset", "Máy trên tường"), loc: true, zones: [
          { id: "calls", r: "c6_keys", label: L("Outgoing calls", "Cuộc gọi đi"), clue: true, then: [
            { act: { kind: "tap", r: "c6_keys", prompt: L("Tap the call-history key", "Chạm phím nhật ký cuộc gọi"), sfx: "tap" } },
            { read: { paper: "screen", hand: "type", title: L("CALLS MADE", "CUỘC GỌI ĐI"), lines: [
              L("22:30 — NSECH CRAMLINGTON", "22:30 — NSECH CRAMLINGTON"),
              L("21:11 — 141 01289 381214", "21:11 — 141 01289 381214"),
              L("Outgoing calls, made from this handset.", "Các cuộc gọi đi, được thực hiện từ máy này."),
            ] } },
            { item: "calllist" }, { set: { c6_read_calls: true } },
            N("You photograph the screen in place. The original stays in its cradle.",
              "Bạn chụp màn hình ngay tại chỗ. Chiếc máy vẫn nằm trên giá."),
          ], again: [{ read: { paper: "screen", title: L("CALLS MADE", "CUỘC GỌI ĐI"), lines: [
            L("22:30 — NSECH CRAMLINGTON", "22:30 — NSECH CRAMLINGTON"), L("21:11 — 141 01289 381214", "21:11 — 141 01289 381214") ] } }] },
          { id: "contact", r: "c6_screen", label: L("Saved contacts", "Danh bạ đã lưu"), clue: true, then: [
            { read: { paper: "screen", hand: "type", title: L("DIRECTORY", "DANH BẠ"), lines: [
              L("TOM ASHBY", "TOM ASHBY"), L("01289 381214", "01289 381214"),
              L("The same digits after 141 in the 21:11 outgoing call.", "Đúng dãy số sau 141 trong cuộc gọi đi lúc 21:11."),
            ] } }, { set: { c6_read_contact: true } },
          ], again: [N("TOM ASHBY · 01289 381214. You have the comparison photographed.",
            "TOM ASHBY · 01289 381214. Bạn đã chụp lại để đối chiếu.")] },
        ] },
      },
    },
  };

  // Các nút đối chất và kết thúc được nối ở dưới; tên ổn định để lưu/khôi phục giữa câu hỏi.
  const supportLoss = [
    { add: { c6_mistakes: 1 } },
    I(leoHere, [{ add: { leo: -1 } }], [{ add: { callum: -1 } }]),
  ];
  const challenges = [
    {
      line: D("nell", "I never rang Tom. Why would I?", "Bác có gọi cho Tom đâu. Gọi làm gì cơ chứ?", "cold"),
      hint: L("Check which record shows an outgoing call to Tom, rather than a missed call from him.",
        "Tìm mục ghi cuộc gọi đi cho Tom, không phải cuộc gọi nhỡ từ ông ấy."),
      evidence: [
        { id: "log", en: "21:11 outgoing log + Tom's saved number", vi: "Nhật ký gọi đi 21:11 + số Tom đã lưu", good: true,
          need: s => !!s.f.c6_phone_verified && s.has("calllist") },
        { id: "witness", en: "Helen's account + the verified cellar call", vi: "Lời Helen + cuộc gọi từ hầm đã xác minh", good: true,
          need: s => s.has("c6_helen_bar") && !!s.f.c6_phone_verified },
        { id: "missed", en: "Tom's missed call to Callum at 21:12", vi: "Cuộc gọi nhỡ của Tom cho Callum lúc 21:12", good: false,
          need: s => !!s.f.c5_callum_missed },
        { id: "ring", en: "The ring Tom sent you", vi: "Chiếc nhẫn Tom gửi bạn", good: false, need: s => s.has("ring") },
      ],
      proof: [
        D("me", "Your cellar handset. 21:11. Tom's number, with 141 in front. Someone called him from your cellar.",
          "Máy dưới hầm nhà {c6addr}. 21:11. Số Tom, thêm 141 phía trước. Có người từ hầm nhà {c6addr} gọi cho ông ấy."),
        D("nell", "I rang. Everything I told him was true. Callum had been in, in a right state. No lifejacket.",
          "Bác có gọi. Bác nói gì cũng thật cả. Callum vừa ghé vào, trông bấn loạn lắm. Không mặc áo phao.", "sad"),
        D("nell", "Tom would have gone out for that boy in his slippers. He always would.",
          "Vì thằng bé ấy, Tom đi dép lê cũng chạy ra. Lần nào cũng vậy."),
        { set: { c6_call_confession: true } },
        N("The log established the source. Nell has now identified the caller herself.",
          "Nhật ký xác định máy gọi. Giờ Nell đã tự xác nhận người gọi là mình."),
      ],
    },
    {
      line: D("nell", "I fetched the blankets and came straight back. Never went down the cellar again.",
        "Bác lấy chăn rồi xuống ngay. Không xuống hầm thêm lần nào cả.", "cold"),
      hint: L("The later call matters. Who rang the hospital from downstairs while Nell was fetching blankets?",
        "Cuộc gọi muộn hơn mới liên quan. Ai gọi bệnh viện từ dưới hầm khi Nell đi lấy chăn?"),
      evidence: [
        { id: "later_call", en: "The cellar's 22:30 hospital call", vi: "Cuộc gọi bệnh viện từ hầm lúc 22:30", good: true,
          need: s => s.has("calllist") && !!s.f.c6_read_calls },
        { id: "accounts", en: "22:30 call + the slipway witnesses", vi: "Cuộc gọi 22:30 + nhân chứng ở dốc bến", good: true,
          need: s => s.has("calllist") && s.has("c6_slipway_accounts") },
        { id: "early", en: "The earlier 21:11 call", vi: "Cuộc gọi trước đó lúc 21:11", good: false,
          need: s => !!s.f.c6_phone_verified },
        { id: "pegs", en: "The survey pegs in the dunes", vi: "Cọc khảo sát ở cồn cát", good: false,
          need: s => s.has("peg") },
      ],
      proof: [
        D("me", "At 22:30 this handset called Cramlington. Who was down there then?",
          "Lúc 22:30 máy này gọi Cramlington. Khi ấy ai ở dưới hầm?"),
        I(s => s.has("c6_slipway_accounts"), [D("me", "Helen places the others on the slipway. You'd gone to fetch blankets.",
          "Helen xác nhận những người kia ở dốc bến. {c6Addr} thì đi lấy chăn.")]),
        D("nell", "Somebody had to ring ahead. I went down to do it.",
          "Phải có người gọi báo trước chứ. Bác xuống đó để gọi.", "sad"),
        D("me", "And the bottle?", "Còn cái chai?"),
        D("nell", "I rinsed it. I watched the label run. I couldn't stop it.",
          "Bác xả nó. Bác nhìn cái nhãn nhòe đi. Không ngăn được.", "sad"),
        { set: { c6_rinse_confession: true } },
        N("She has placed herself downstairs and admitted the rinse. You record her words, exactly.",
          "Bà xác nhận đã xuống hầm và xả chai. Bạn ghi đúng từng lời."),
      ],
    },
    {
      line: D("nell", "He did it himself, pet. He wanted it over. I only cleaned up.",
        "Ông ấy tự làm đấy, cháu ạ. Ông ấy muốn cho xong. Bác chỉ dọn dẹp thôi.", "sad"),
      hint: L("The marks are grounds for questioning, not a laboratory result. Ask her to explain the bottle's route.",
        "Dấu vết là căn cứ để hỏi, chưa phải xét nghiệm. Hãy yêu cầu bà giải thích đường đi của chai rượu."),
      evidence: [
        { id: "vial", en: "The clean vial among soot-black belongings", vi: "Lọ sạch giữa đồ đạc lem muội", good: true,
          need: s => s.has("vial") && !!s.f.p_not_suicide },
        { id: "whisky", en: "The rinsed TOM bottle and Fergus's pouring", vi: "Chai TOM bị xả và việc Fergus rót bình", good: true,
          need: s => s.has("tombottle") && !!s.f.p_bottle_route },
        { id: "flask", en: "The full flask, medicinal smell and sticky residue", vi: "Bình đầy, mùi thuốc và chất dính", good: true,
          need: s => s.has("flask") && !!s.f.p_not_suicide && !!s.f.p_bottle_route },
        { id: "ampoules", en: "Helen's sealed ampoules", vi: "Những ống thuốc còn niêm phong của Helen", good: false,
          need: s => localTruth(s, "T4") },
        { id: "letter", en: "Nell's letter about 2004", vi: "Thư Nell về năm 2004", good: false,
          need: s => s.has("c6_nell_letter") },
      ],
      proof: [
        I(s => s.f.c6_evidence3 === "vial", [
          D("me", "His pocket was black with soot. The vial was clean. Someone handled it separately.",
            "Túi áo ông ấy đen muội. Lọ thuốc lại sạch. Có người đã cầm nó riêng ra."),
        ], [
          D("me", "Fergus filled the flask from TOM. Later that bottle was rinsed, and the flask had a medicinal smell.",
            "Fergus rót bình từ chai TOM. Sau đó chai bị xả, còn trong bình có mùi thuốc."),
        ]),
        D("me", "That needs testing. But it doesn't fit your account of simply putting things away.",
          "Còn phải xét nghiệm. Nhưng chuyện đó không khớp với lời {c6addr} bảo chỉ cất dọn đồ."),
        D("me", "You prepared his bottle. Tell us what you put in it.",
          "{c6Addr} chuẩn bị chai của ông ấy. Hãy nói {c6addr} đã bỏ gì vào đó."),
        N("Her hand finds the towel in her apron. She folds it once, then stops.",
          "Tay bà tìm chiếc khăn trên tạp dề. Bà gấp một lần rồi dừng."),
        D("nell", "His medicine. In the TOM bottle. At three, before the bar opened.",
          "Thuốc của ông ấy. Vào chai TOM. Lúc ba giờ, trước khi mở quán.", "broken", "low, flat, ashamed"),
        D("nell", "Then the empty vial in his pocket. Forty years behind a bar. You wipe things without thinking.",
          "Rồi để lọ rỗng vào túi ông ấy. Bốn mươi năm đứng quầy. Cái gì cũng lau, chẳng nghĩ nữa.", "broken"),
        { set: { c6_tom_confession: true, c6_nell_admitted: true } },
        N("The traces raised a question. Her account supplies the act, the route and the time. The samples still need examination.",
          "Dấu vết đặt ra câu hỏi. Lời bà cho biết hành động, đường đi và thời gian. Các mẫu vẫn cần được giám định."),
      ],
    },
    {
      line: D("nell", "Anna died in the crash. I was driving. It's in my letter.",
        "Anna chết vì cú tông. Bác lái xe. Bác viết trong thư rồi.", "cold"),
      hint: L("Separate who drove, who heard Anna alive, and who fetched Tom afterwards. A ring cannot answer those questions.",
        "Tách rõ ai lái xe, ai nghe Anna còn nói, ai đón Tom sau đó. Chiếc nhẫn không trả lời được những câu ấy."),
      evidence: [
        { id: "injury", en: "Callum heard Anna speak + the injury Helen examined", vi: "Callum nghe Anna nói + thương tích Helen đã xem", good: true,
          need: physicalCase },
        { id: "paper", en: "Callum's account + the 20:45 pencil entry", vi: "Lời Callum + dòng bút chì 20:45", good: true,
          need: paperCase },
        { id: "seat", en: "The driver's seat pushed back", vi: "Ghế lái bị đẩy lùi", good: false,
          need: s => localTruth(s, "T11") },
        { id: "ring", en: "Anna's ring", vi: "Nhẫn của Anna", good: false, need: s => s.has("ring") },
      ],
      proof: [
        I(s => s.f.c6_evidence4 === "injury", [
          D("me", "Callum heard her speaking after the crash. Helen found a serious injury at the back of her skull.",
            "Callum nghe mẹ {c6self} nói sau cú tông. Helen thấy thương tích nặng phía sau hộp sọ."),
          D("me", "Helen says a pathologist must confirm it. But your letter leaves out someone reaching her while she was alive.",
            "Helen nói cần pháp y xác nhận. Nhưng thư {c6addr} bỏ qua người đã tới chỗ mẹ khi mẹ còn sống."),
        ], [
          D("me", "Callum drove Tom's truck. He heard her speak. Then he came home through the back.",
            "Callum lái xe tải của Tom. Anh nghe mẹ nói. Rồi về nhà bằng cửa sau."),
          I(s => s.f.c5_mam_account, [D("me", "He told you. Tom wrote: 'Fetched 20:45. Told the crash did it.' Who told him?",
            "Anh kể với {c6addr}. Tom ghi: “Được đón 20:45. Người ta bảo do cú tông.” Ai bảo ông ấy?")],
          [D("me", "He sent me to ask you. The rooms were empty. Who fetched Tom, and told him it was the crash?",
            "Anh bảo {c6self} hỏi {c6addr}. Phòng trọ trống. Ai đón Tom, rồi bảo ông là do cú tông?")]),
        ]),
        N("For a long time there is only water against the road.", "Rất lâu chỉ còn tiếng nước vỗ vào đường."),
        D("nell", "She was still talking when I got there.", "Lúc bác tới, bà ấy vẫn còn nói.", "broken", "barely above a whisper"),
        D("nell", "I struck her. Then I fetched Tom. I told him the crash had done it.",
          "Bác đánh bà ấy. Rồi tới đón Tom. Bác bảo là do cú tông.", "broken", "quiet, halting"),
        { set: { c6_2004_chain: true, c6_anna_confession: true, c6_nell_admitted: true } },
        N("That is her admission. You keep it separate from Helen's provisional opinion and Callum's account.",
          "Đó là lời thừa nhận của bà. Bạn ghi riêng, phân biệt với nhận định sơ bộ của Helen và lời Callum."),
      ],
    },
  ];

  // Feedback explains the actual selected item without silently supplying the next answer.
  const wrongFeedback = [
    {
      missed: ["That missed call shows Tom tried Callum. It says nothing about who rang Tom.",
        "Cuộc gọi nhỡ cho thấy Tom đã gọi Callum. Nó không cho biết ai đã gọi Tom."],
      ring: ["The ring connects Tom to your mother. It does not identify tonight's caller.",
        "Chiếc nhẫn nối Tom với mẹ bạn. Nó không xác định người gọi đêm nay."],
    },
    {
      early: ["21:11 proves an earlier call. Nell is denying a later visit to the cellar.",
        "21:11 chứng minh cuộc gọi trước đó. Nell đang phủ nhận lần xuống hầm muộn hơn."],
      pegs: ["The pegs show work in the dunes. They cannot place someone in the cellar at 22:30.",
        "Những cọc cho thấy có người làm việc ở cồn cát. Chúng không xác định ai ở hầm lúc 22:30."],
    },
    {
      ampoules: ["The sealed ampoules concern Helen. They do not explain what was in Tom's whisky.",
        "Những ống thuốc niêm phong liên quan đến Helen. Chúng không giải thích trong whisky của Tom có gì."],
      letter: ["The letter describes 2004. It offers no account of tonight's bottle.",
        "Lá thư kể về năm 2004. Nó không nói gì về chai rượu đêm nay."],
    },
    {
      seat: ["The seat suggests another driver moved the car. It cannot tell you how or when Anna died.",
        "Vị trí ghế gợi ý người khác đã lái xe đi. Nó không cho biết Anna chết thế nào, hay lúc nào."],
      ring: ["The ring belonged to Anna. It cannot establish who drove, or whether she survived the collision.",
        "Chiếc nhẫn là của Anna. Nó không xác định ai lái xe, hay bà còn sống sau cú tông không."],
    },
  ];
  challenges.forEach((q, index) => {
    const n = index + 1, base = "c6_lie" + n, next = n === 4 ? "c6_case_result" : "c6_lie" + (n + 1);
    const makeOptions = retry => q.evidence.map(o => C(o.en, o.vi, [
      { set: { ["c6_evidence" + n]: o.id } }, G(base + (o.good ? "_proved" : retry ? "_unproved" : "_wrong")),
    ], { id: base + "_" + o.id, if: o.need })).concat([
      C("I cannot support this challenge yet", "Chưa đủ căn cứ để phản bác", [
        ...(retry ? [] : supportLoss), G(base + "_unproved"),
      ], { id: base + "_skip" }),
    ]);
    nodes[base] = [q.line, { choice: makeOptions(false), prompt: L("Choose the evidence that tests this claim", "Chọn chứng cứ kiểm tra lời này") }];
    nodes[base + "_wrong"] = [
      ...supportLoss,
      D("nell", "That isn't what you asked me, pet.", "Đấy đâu phải chuyện cháu vừa hỏi bác.", "cold"),
      Object.entries(wrongFeedback[index]).reduceRight((fallback, [id, lines]) =>
        I(s => s.f["c6_evidence" + n] === id, [N(...lines)], [fallback]),
        N("That item does not test this claim. Compare its time and subject with what Nell just said.",
          "Vật ấy không kiểm tra được lời này. Hãy so thời điểm và nội dung với điều Nell vừa nói.")),
      N("You have one more attempt. Your companion stays beside Nell.",
        "Bạn còn một lượt thử. Người đồng hành vẫn ở bên Nell."),
      G(base + "_retry"),
    ];
    nodes[base + "_retry"] = [q.line, { choice: makeOptions(true) }];
    nodes[base + "_proved"] = [
      I(s => !s.f[base + "_proved"], [{ set: { [base + "_proved"]: true } }, { add: { c6_proved: 1 } }]),
      ...q.proof, G(next),
    ];
    nodes[base + "_unproved"] = [
      { set: { [base + "_unproved"]: true } },
      N("You record that answer as disputed. It does not become a confession because you suspect it is false.",
        "Bạn ghi lời ấy là điều còn tranh chấp. Nghi nó sai không biến nó thành một lời nhận tội."), G(next),
    ];
  });

  Object.assign(nodes, {
    c6_case_result: [
      { cp: "c6_case_result" },
      I(s => (s.f.c6_proved || 0) < 3, [
        { set: { c6_resolution: "mercy", c6_shallow: true } },
        N("Too many links remain untested. The letter can be preserved; you cannot turn it into a complete account tonight.",
          "Còn quá nhiều mắt xích chưa được kiểm tra. Có thể giữ lá thư làm chứng cứ; đêm nay chưa thể thành lời khai đầy đủ."),
        I(leoHere, [D("leo", "I'll record her letter and everything you've shown me. The gaps stay open.",
          "Tôi ghi lại lá thư và mọi chứng cứ {ac} đưa ra. Những chỗ thiếu vẫn để ngỏ.")],
        [D("callum", "Then tell Leo exactly that. No more guessing.", "Vậy nói đúng thế với Leo. Đừng đoán thêm nữa.")]),
        G("c6_arrest"),
      ], [G("c6_moral")]),
    ],
    c6_moral: [
      { set: { goal: "c6_truth" } },
      I(leoHere, [
        I(s => !!s.f.c5_callum_missed && !!s.f.p_anna_talking, [
          D("me", "Callum saw Tom's lamp. He turned away. He thinks that killed him.",
            "Callum thấy đèn bão của Tom. Anh quay đi. Anh nghĩ thế là mình đã giết ông ấy."),
        ], [D("me", "Callum is still blaming himself. Did you mean him to carry that too?",
          "Callum vẫn tự trách mình. {c6Addr} định để anh gánh cả chuyện đó sao?")]),
      ], [D("callum", "I saw his lamp, Mam. I thought it was another row. I turned my back.",
        "Con thấy đèn bác ấy, mẹ ạ. Con tưởng bác muốn cãi tiếp. Con quay lưng.", "crying", "strained, quiet")]),
      D("nell", "I never thought he'd look back at the lamp.", "Bác không ngờ nó lại ngoái nhìn ngọn đèn.", "broken"),
      I(s => s.f.c6_anna_confession, [
        D("nell", "Your mother would've done the same. For her child.",
          "Mẹ cháu hẳn cũng làm thế. Vì con mình.", "cold"),
        I(s => !!s.f.p_anna_talking, [
          D("me", "No. She asked for an ambulance. She told him he was a child, and it was an accident.",
            "Không. Mẹ {c6self} xin gọi xe cấp cứu. Mẹ bảo anh còn nhỏ, và đó là tai nạn.", undefined, "steady, restrained"),
        ], [D("me", "You don't get to tell me what she would have done.",
          "{c6Addr} không có quyền nói với {c6self} mẹ sẽ làm gì.", undefined, "steady")]),
      ]),
      D("nell", "I gave you his jumper. He never grew into it.",
        "Bác đưa cháu cái áo len của nó. Nó chẳng bao giờ lớn tới mức mặc vừa.", "sad"),
      D("nell", "I wanted something of ours to keep you warm. Daft.",
        "Bác muốn có chút gì của nhà bác giữ ấm cho cháu. Dở hơi thật.", "sad"),
      N("The grey darning presses against your thumb. You keep your hand there.",
        "Chỗ mạng len xám cọ vào ngón cái. Bạn để yên bàn tay ở đó."),
      I(s => !!s.f.c6_anna_confession, [
        I(sand, [D("nell", "What was left of her is in the channel. I thought I could go too.",
          "Phần còn lại của bà ấy ở dưới kênh. Bác tưởng mình cũng có thể đi theo.", "broken")], [
          N("Your companion checks the open vehicle. A wrapped bundle lies inside, still dusted with pale sand.",
            "Người đồng hành nhìn vào xe đang mở cửa. Một bọc nằm bên trong, vẫn phủ cát nhạt màu."),
          D("nell", "I took what was left from the dunes. I was going to take her with me.",
            "Bác mang phần còn lại từ cồn cát đi. Bác định đưa bà ấy đi cùng.", "broken"),
          { set: { c6_bones_seen: true } },
        ]),
        D("nell", "Let the letter carry it. Let me carry all of it. He's got a little girl.",
          "Cứ để lá thư nhận hết. Để bác gánh tất cả. Nó có một đứa con gái nhỏ.", "pleading"),
        { truth: "T14" },
        { note: L("Nell admits the second attack, taking the remains and intending her letter to shield Callum. Her words are recorded separately.",
          "Nell thừa nhận cú đánh sau, việc mang hài cốt đi và định dùng lá thư che chở Callum. Lời bà được ghi riêng.") },
      ], [
        D("nell", "Let my letter stand. He's got a little girl.", "Cứ để lá thư của bác như thế. Nó có một đứa con gái nhỏ.", "pleading"),
      ]),
      N("Mairi is five. You have to choose what to put on record, not what makes this night easier.",
        "Mairi mới năm tuổi. Bạn phải chọn điều sẽ ghi vào lời khai, không phải điều khiến đêm nay dễ chịu hơn."),
      { choice: [
        C("Tell the whole supported account", "Kể đầy đủ những gì có căn cứ", [{ set: { c6_resolution: "truth" } }, G("c6_whole_truth")],
          { need: wholeCase, lockHint: L("The 2004 chain is still incomplete. You cannot state it as fact.",
            "Chuỗi sự kiện năm 2004 còn thiếu. Bạn chưa thể kể như sự thật đã rõ.") }),
        C("Let the letter stand", "Để lá thư nói thay", [{ set: { c6_resolution: "mercy" } }, G("c6_mercy")]),
      ] },
    ],
    c6_whole_truth: [
      D("me", "All of it. Callum drove the truck. Anna was alive afterwards. Nell went out, then fetched Tom.",
        "Tất cả. Callum lái xe tải. Sau đó Anna vẫn sống. Nell ra ngoài, rồi tới đón Tom.", undefined, "clear, measured"),
      I(s => s.f.c6_anna_confession, [D("me", "You heard Nell admit the second attack. Keep that with her exact words, not somebody else's summary.",
        "Mọi người đã nghe Nell nhận cú đánh sau. Hãy giữ đúng lời bà, không phải lời tóm tắt của ai khác.")],
      [D("me", "The second attack is supported by Callum's account and Helen's examination. Record the remaining uncertainty too.",
        "Lời Callum và việc Helen xem thương tích củng cố giả thuyết cú đánh sau. Ghi cả những điều còn chưa chắc.")]),
      I(leoHere, [D("leo", "His statement. Hers. Yours. Separate pages.", "Lời anh ấy. Lời bà ấy. Lời {ac}. Từng trang riêng.", "determined")], [
        D("me", "You said you'd tell it yourself, Callum. In the morning. Properly.",
          "Anh nói sẽ tự kể, Callum. Sáng mai. Đàng hoàng."),
        D("callum", "I will.", "Tôi sẽ kể.", "sad"),
      ]),
      N("Nell closes her eyes. You do not take the words back.", "Nell nhắm mắt. Bạn không rút lại những lời ấy."), G("c6_arrest"),
    ],
    c6_mercy: [
      N("You look away from the notebook. For a moment, nobody writes.",
        "Bạn nhìn khỏi cuốn sổ. Một thoáng, không ai viết."),
      D("me", "Keep the letter as her statement.", "Giữ lá thư làm lời khai của bà ấy.", undefined, "low, conflicted"),
      I(s => !s.f.c6_mistakes && (s.f.c6_proved || 0) === 4, [
        D("nell", "Thank you, pet.", "Cảm ơn cháu.", "sad"),
        N("You wish she had said anything else.", "Bạn ước bà nói bất kỳ câu gì khác."),
      ], [N("Nell says nothing. The silence accepts what you have offered.",
        "Nell không nói gì. Sự im lặng nhận lấy điều bạn vừa trao.")]),
      G("c6_arrest"),
    ],
    c6_arrest: [
      I(leoHere, [
        D("leo", "Come away from the edge, Nell. One step towards me.",
          "Rời mép nước đi, bác Nell. Bước về phía tôi một bước.", "determined", "calm, firm"),
      ], [D("callum", "Stay with me, Mam. Just here.", "Ở lại với con, mẹ. Ngay đây thôi.", "sad", "quiet, steady")]),
      I(sand, [N("She lets him take her arm.", "Bà để anh nắm lấy cánh tay.")],
      [N("Her hand opens. He guides her away from the water. The rope stays behind.",
        "Bàn tay bà mở ra. Anh dìu bà rời mép nước. Sợi dây nằm lại phía sau.")]),
      { hide: "*" }, { clock: "03:05" }, { cg: "cg-police" },
      N("At 03:05, mainland police cross on the printed timetable. Blue lights move between the black posts.",
        "Lúc 03:05, cảnh sát từ đất liền sang theo giờ in trên bảng. Đèn xanh đi giữa những cọc đen."),
      { cg: null }, { show: "leo", at: "r", face: "determined" }, { show: "nell", at: "c", face: "sad" },
      I(s => s.f.c6_tom_confession, [
        D("leo", "Nell Calloway, I'm arresting you on suspicion of killing Tom Ashby and Anna Rowe.",
          "Nell Calloway, tôi bắt giữ bà vì tình nghi sát hại Tom Ashby và Anna Rowe.", "determined", "formal, steady"),
      ], [D("leo", "Nell Calloway, I'm arresting you on suspicion of killing Anna Rowe. We also need to investigate Tom's death.",
        "Nell Calloway, tôi bắt giữ bà vì tình nghi sát hại Anna Rowe. Chúng tôi cũng cần điều tra cái chết của Tom.", "determined", "formal, steady")]),
      N("He explains the rest. Then he puts a blanket around her shoulders. His voice is steady. His hands are not.",
        "Anh nói tiếp những điều cần nói. Rồi khoác chăn lên vai bà. Giọng vững. Tay thì không."),
      I(s => s.f.c6_resolution === "truth" && (s.f.c6_proved || 0) === 4, [
        D("nell", "She said please. Your mam. 'He's a child. Please. An ambulance.'",
          "Bà ấy nói “làm ơn”. Mẹ cháu ấy. “Thằng bé còn nhỏ. Làm ơn. Gọi xe cấp cứu.”", "sad", "very quiet"),
        D("nell", "I wanted you to have that. It's true.", "Bác muốn cháu giữ lấy câu ấy. Đó là sự thật."),
      ]),
      { hide: "*" },
      N("The car door closes. You remain beside the road until the lights have gone.",
        "Cửa xe đóng lại. Bạn đứng bên đường tới khi những ánh đèn khuất hẳn."),
      G("c6_dawn"),
    ],
    c6_dawn: [
      { cp: "c6_dawn" }, { bg: "lifeboat" }, { clock: "06:00" }, { set: { goal: "c6_morning" } },
      N("At the station, a kettle boils. Officers label the evidence. Every witness is asked for a separate account.",
        "Ở trạm, ấm nước sôi. Cảnh sát ghi nhãn vật chứng. Từng nhân chứng được yêu cầu khai riêng."),
      I(hiddenEnd, [
        { set: { c6_hidden_earned: true } }, G("c6_keeper"),
      ], [G("c6_dawn_return")]),
    ],
    c6_keeper: [
      { show: "helen", at: "c", face: "sad" },
      D("helen", "I promised to tell you myself, Leo. About the ampoules. And the boy's wrist.",
        "Tôi đã hứa sẽ tự kể, Leo. Chuyện mấy ống thuốc. Và cổ tay cậu bé."),
      N("You never have to break your word to her. Afterwards Leo asks if you want to see the water.",
        "Bạn không phải thất hứa với bà. Sau đó Leo hỏi bạn có muốn ra xem nước không."),
      { hide: "*" }, { bg: "box-dawn" }, { clock: "06:12" },
      N("Leo relights Tom's lamp. Its light finds the old numbers on the refuge walls. Outside, the road is dry.",
        "Leo thắp lại đèn của Tom. Ánh đèn soi những con số cũ trên vách chòi. Bên ngoài, đường đã khô."),
      { shot: "cg-dawn-wall" },
      N("Leo checks the gauge. You touch a little soot beside the lamp, then hold your finger beneath Tom's final line.",
        "Leo xem cọc đo. Bạn chạm chút muội cạnh đèn, rồi đặt ngón tay dưới dòng cuối của Tom."),
      { act: { kind: "hold", r: "c6_last_line", hold: 700, prompt: L("Hold to add the new reading", "Giữ để ghi số đo mới"), sfx: "tap" } },
      { read: { paper: "log", hand: "print", title: L("The next line", "Dòng kế tiếp"), lines: [
        L("06:12 — 0.0", "06:12 — 0.0"),
        L("Observed water level: no difference from the printed table.", "Mực nước quan sát: không lệch so với bảng in."),
      ] } },
      D("leo", "Wind's gone. The sea's back on the table.", "Gió đã tắt. Biển lại khớp bảng giờ.", undefined, "soft, tired"),
      N("Your numbers are not as small as his. Not yet. But they are even.",
        "Số của bạn không nhỏ bằng số của ông. Chưa đâu. Nhưng chúng đều."),
      { shot: null }, G("c6_dawn_return"),
    ],
    c6_dawn_return: [
      { bg: "harbour-dawn" }, { clock: "07:30" },
      N("Callum comes along the harbour wall. He stops at the station door.",
        "Callum đi dọc tường chắn sóng tới. Anh dừng trước cửa trạm."),
      { show: "callum", at: "c", face: "sad" },
      I(s => s.f.c6_resolution === "truth", [
        N("You take off the jumper, fold it, and hold it out. The morning goes cold through your shirt.",
          "Bạn cởi áo len, gấp lại rồi đưa ra. Khí lạnh buổi sáng xuyên qua áo bạn."),
        D("me", "This is yours.", "Cái này của anh.", undefined, "gentle, tired"),
        D("callum", "She sat up and darned it that night. I heard her through the wall.",
          "Đêm ấy mẹ ngồi thức mạng nó. Tôi nghe thấy qua tường.", "sad"),
        D("callum", "I thought that was a dream as well.", "Tôi cứ tưởng chuyện đó cũng là mơ."),
        D("callum", "Mairi might grow into it. One day.", "Biết đâu Mairi lớn lên sẽ mặc vừa. Một ngày nào đó."),
        N("He folds the jumper over his arm, knocks twice, and goes in to give his account.",
          "Anh vắt áo lên tay, gõ cửa hai lần, rồi vào khai lại mọi chuyện."),
      ], [
        I(s => !!s.f.c6_shallow, [
          D("me", "They have her letter. I couldn't settle the rest.", "Họ có thư của bà ấy. Tôi chưa làm rõ được phần còn lại."),
          N("Callum looks at the door. Then down at the harbour. You do not know what he will choose.",
            "Callum nhìn cánh cửa. Rồi nhìn xuống bến. Bạn không biết anh sẽ chọn gì."),
        ], [
          D("me", "They have her statement. Go home, Callum. Be there for Mairi.",
            "Họ có lời khai của bà ấy rồi. Về nhà đi, Callum. Có mặt bên Mairi."),
          D("callum", "It wasn't her. Not the truck. Not—", "Không phải mẹ tôi. Không phải chiếc xe tải. Không—", "ashamed"),
          N("You do not answer. Eventually he turns towards his boat. He does not knock.",
            "Bạn không đáp. Cuối cùng anh quay về phía thuyền. Anh không gõ cửa."),
        ]),
        N("You keep the jumper on. Nobody asks for it back.", "Bạn vẫn mặc áo len. Không ai đòi lại."),
      ]),
      { hide: "*" }, { show: "leo", at: "c", face: "sad" },
      D("leo", "They'll need you back for statements. We will keep looking at what is missing.",
        "Họ sẽ cần {ac} quay lại khai. Những điều còn thiếu, chúng tôi sẽ tiếp tục tìm."),
      I(sand, [D("leo", "The search boat is going out again at low water.",
        "Thuyền tìm kiếm sẽ lại ra lúc nước ròng.")],
      [D("leo", "She'll have a proper funeral. We'll make sure of it.",
        "Mẹ {ac} sẽ có một đám tang tử tế. Chúng tôi sẽ lo.")]),
      N("He puts your car keys in your hand. They are warm from his pocket.",
        "Anh đặt chìa khóa xe vào tay bạn. Chìa còn ấm hơi túi áo."),
      { hide: "*" }, { bg: "lantern-yard-dawn" }, { show: "fergus", at: "c", face: "sad" },
      N("Police tape crosses the back door. Fergus waits in the yard, his woolly hat pulled down.",
        "Dây phong tỏa căng ngang cửa sau. Fergus đứng đợi trong sân, kéo thấp chiếc mũ len."),
      D("me", "You'll freeze out here, Fergus.", "Ở ngoài này ông chết cóng mất, ông Fergus."),
      D("fergus", "Nowt to shift for.", "Chả có gì mà phải nhúc nhích.", "sad", "rough, tired, restrained"),
      N("Skerry climbs into your passenger seat when you open the door.", "Bạn mở cửa xe; Skerry leo lên ghế phụ."),
      D("fergus", "Picked you, has he.", "Nó chọn cháu rồi đấy.", "sad"),
      { hide: "*" }, { bg: "causeway-dawn" },
      I(s => s.f.c6_resolution === "truth", [
        N("You drive slowly. For the first time, you are not looking for a clue.",
          "Bạn lái chậm. Lần đầu tiên, bạn không tìm kiếm manh mối."),
        N("Your wrists are cold without the sleeves. On one finger, a ring fits.",
          "Cổ tay lạnh khi không còn tay áo len. Trên một ngón tay, chiếc nhẫn vừa khít."),
      ], [
        N("The Mairi Rose moves across your mirror. You pull the short sleeves down over your wrists.",
          "Thuyền Mairi Rose lướt qua gương chiếu hậu. Bạn kéo tay áo ngắn xuống che cổ tay."),
        N("The grey darning is rough against your skin. Warm. The account you left behind is not complete.",
          "Chỗ mạng xám cọ vào da, thô ráp. Ấm. Lời khai bạn để lại chưa đầy đủ."),
      ]),
      I(sand, [
        N("At low water they search the channel. The sea keeps what it was given.",
          "Lúc nước ròng, người ta dò tìm dưới kênh. Biển giữ lại những gì nó đã nhận."),
        N("Twenty years ago the island said the tide had taken her. Now it is true.",
          "Hai mươi năm trước, cả đảo bảo nước đã cuốn mẹ đi. Giờ điều ấy là thật."),
      ]),
      I(s => !!s.f.c6_hidden_earned, [{ end: "e10_keeper" }], [
        I(s => s.f.c6_resolution === "truth", [{ end: "e1_tides" }], [{ end: "e9_mercy" }]),
      ]),
    ],
  });

  Object.assign(nodes, {
    c6_too_late: [
      { hide: "*" }, { bg: "causeway" },
      I(s => !!s.f.gideon_private, [
        { clock: "02:36" },
        N("Gideon lets you take the four-by-four. You reach the box alone and call for Nell to step back.",
          "Gideon cho bạn mượn xe hai cầu. Bạn tới chòi một mình, gọi Nell lùi lại."),
      ], [
        { clock: "02:50" },
        N("You run as far as the shallow water. Every marker seems further away. Skerry stays beside you.",
          "Bạn chạy tới chỗ nước nông. Mỗi cọc đánh dấu như xa hơn. Skerry vẫn bên bạn."),
        N("By the time you reach the headlights, there is still too much road between you and Nell.",
          "Khi tới gần cặp đèn, bạn và Nell vẫn cách nhau một quãng đường quá xa."),
      ]),
      { show: "nell", at: "c", face: "sad" },
      D("nell", "Go home, pet.", "Về đi, cháu.", "sad", "quiet, exhausted"),
      N("You call her name. She turns towards the channel. You call the emergency number again, shouting the position.",
        "Bạn gọi tên bà. Bà quay về phía kênh. Bạn gọi lại số khẩn cấp, hét vị trí của mình."),
      { hide: "*" }, { bg: "causeway" },
      N("Then you cannot see her. You keep calling. The headlights shine across empty water.",
        "Rồi bạn không nhìn thấy bà nữa. Bạn vẫn gọi. Đèn pha rọi lên mặt nước trống trơn.", { pic: "cg-e2-channel" }),
      { clock: "03:05" }, { show: "leo", at: "c", face: "sad" },
      D("leo", "Stay on the road. Rescue is coming. Stay with me.",
        "Ở trên mặt đường. Cứu hộ đang tới. Ở lại với tôi.", "sad", "firm, reassuring"),
      N("Searchlights arrive. Her letter and your photographs survive the night. Her answers do not.",
        "Đèn tìm kiếm tới. Lá thư và ảnh của bạn còn lại sau đêm ấy. Những câu trả lời của bà thì không."),
      I(sand, [N("They search for your mother as well. You have no remains to take home.",
        "Họ tìm cả mẹ bạn. Bạn không có hài cốt nào để đưa về.")]),
      { end: "e2_low_water" },
    ],
    c6_false_accusation_arrival: [
      I(s => !leoHere(s), [
        N("Callum keeps his mother away from the edge while you radio Leo. He arrives at 02:45.",
          "Callum giữ mẹ xa mép nước trong khi bạn gọi bộ đàm cho Leo. Anh tới lúc 02:45."),
        { clock: "02:45" }, { show: "leo", at: "l", face: "determined" },
      ]),
      I(s => s.f.c6_wrong_accused === "callum", [G("c6_half_truth")], [
        I(s => s.f.c6_wrong_accused === "gideon", [G("c6_envelope")], [G("c6_ampoules")]),
      ]),
    ],
    c6_accuse_callum: [
      { set: { c6_wrong_accused: "callum" } },
      D("me", "Callum fought with Tom. Tom went out for him. And Callum was driving in 2004.",
        "Callum xô xát với Tom. Tom ra ngoài vì anh ta. Năm 2004 Callum cũng là người lái xe."),
      G("c6_false_accusation_arrival"),
    ],
    c6_half_truth: [
      D("leo", "I'll need Callum's statement. An argument is not proof of murder.",
        "Tôi cần lời khai của Callum. Cãi nhau chưa phải chứng cứ giết người.", "determined"),
      D("nell", "No. Not him. I rang Tom. I put his medicine in the bottle. I rinsed it afterwards.",
        "Không. Không phải nó. Bác gọi Tom. Bác bỏ thuốc của ông ấy vào chai. Rồi xả sạch chai.", "scared", "urgent, cracking"),
      { set: { c6_tom_confession: true } },
      D("me", "And my mother?", "Còn mẹ {c6self}?"),
      D("nell", "I wrote what I wrote.", "Bác viết gì thì là thế.", "cold"),
      N("After that she asks for a solicitor. Her letter remains a claim, not a settled history.",
        "Sau đó bà yêu cầu luật sư. Lá thư vẫn là lời bà khai, chưa phải lịch sử đã được xác minh."),
      { hide: "*" }, { bg: "harbour-dawn" }, { clock: "07:30" },
      N("By dawn Callum has been interviewed and released. He passes you on the harbour wall without looking up.",
        "Rạng sáng, Callum đã được hỏi rồi cho về. Anh đi ngang bạn trên tường chắn sóng, không ngẩng đầu."),
      N("You have an admission about Tom. The account of Anna still contradicts itself. Neither mother nor son will help you join it.",
        "Bạn có lời nhận tội về Tom. Chuyện Anna vẫn mâu thuẫn. Cả mẹ lẫn con đều không giúp bạn nối lại."),
      I(sand, [N("The search boat returns without your mother's remains.", "Thuyền tìm kiếm trở về, không có hài cốt của mẹ.")]),
      { end: "e3_half_truth" },
    ],
    c6_accuse_gideon: [
      { set: { c6_wrong_accused: "gideon" } },
      D("me", "Gideon had the car. He wanted that site cleared. Ask him about Tom.",
        "Gideon có chiếc xe. Ông ta muốn khu đất được dọn sạch. Hãy hỏi ông ta về Tom."),
      G("c6_false_accusation_arrival"),
    ],
    c6_envelope: [
      D("leo", "Enough to ask him. Not enough to call him a murderer.",
        "Đủ để hỏi ông ấy. Chưa đủ để gọi ông ấy là kẻ giết người.", "determined"),
      N("He keeps Nell safe and preserves her letter. You give him Gideon's name instead of testing her account.",
        "Anh giữ Nell an toàn và giữ lại lá thư. Bạn đưa tên Gideon thay vì kiểm tra lời bà."),
      { hide: "*" }, { bg: "yard" },
      N("The envelope leads to a separate corruption inquiry. The bridge vote is cancelled. No bridge follows.",
        "Chiếc phong bì dẫn tới một cuộc điều tra tham nhũng riêng. Cuộc bỏ phiếu xây cầu bị hủy. Cây cầu không thành."),
      N("The bottle and handset still need explaining. Gideon's wrongdoing cannot supply those missing answers.",
        "Cái chai và chiếc máy vẫn cần lời giải. Việc Gideon làm sai không cung cấp những câu trả lời còn thiếu."),
      N("Tom's death remains unresolved. Twice a day the sea still closes the road.",
        "Cái chết của Tom vẫn chưa được làm rõ. Mỗi ngày hai lần, biển vẫn đóng đường."),
      I(sand, [N("And the dunes no longer hold what you went there to find.", "Cồn cát cũng không còn giữ thứ bạn tới tìm.")]),
      { end: "e5_envelope" },
    ],
    c6_accuse_helen: [
      { set: { c6_wrong_accused: "helen" } },
      D("me", "Dr Vosper took morphine to Tom. She was outside his cottage at 21:15. Question her.",
        "Bác sĩ Vosper mang morphine tới Tom. Bà ở ngoài nhà ông lúc 21:15. Hãy hỏi bà."),
      G("c6_false_accusation_arrival"),
    ],
    c6_ampoules: [
      I(s => localTruth(s, "T4"), [D("leo", "The ampoules were sealed. You found that. We still need an explanation for Tom's whisky.",
        "Các ống thuốc còn niêm phong. {Ac} đã tìm ra mà. Whisky của Tom vẫn cần lời giải.", "determined")],
      [D("leo", "Then the ampoules need examination. Being outside the house doesn't establish what she did.",
        "Vậy phải kiểm tra các ống thuốc. Có mặt ngoài nhà chưa xác định được bà ấy đã làm gì.", "determined")]),
      N("Nell gives no account of tonight. Leo preserves the letter and takes your allegation down separately.",
        "Nell không kể về đêm nay. Leo giữ lá thư rồi ghi riêng lời tố cáo của bạn."),
      { hide: "*" }, { bg: "surgery" },
      N("Helen's conduct in 2004 becomes a separate inquiry. The altered injury record matters; it cannot identify Tom's killer.",
        "Hành vi của Helen năm 2004 bị điều tra riêng. Bệnh án sai lệch có ý nghĩa; nó không xác định kẻ giết Tom."),
      N("By spring her brass plate has gone from the surgery door. Tom's case is still open.",
        "Tới mùa xuân, tấm biển đồng của bà không còn trên cửa phòng khám. Vụ Tom vẫn để ngỏ."),
      I(sand, [N("There is no skull for the pathologist. That absence remains in the report.",
        "Không có hộp sọ để pháp y xem xét. Chỗ thiếu ấy còn nguyên trong báo cáo.")]),
      { end: "e6_ampoules" },
    ],
    c6_stranger: [
      { hide: "*" }, { bg: "lifeboat" }, { clock: "03:05" },
      N("You give the police the letter, the photographs and the gaps in your account. You name no killer.",
        "Bạn giao cảnh sát lá thư, ảnh chụp và những chỗ còn thiếu trong lời kể. Bạn không chỉ tên hung thủ."),
      N("They take you to the mainland for a statement. The case continues without your questions at the water's edge.",
        "Họ đưa bạn về đất liền lấy lời khai. Vụ án tiếp tục, thiếu những câu hỏi của bạn bên mép nước."),
      N("The road closes behind you at the next tide. This is where your investigation stops.",
        "Đường khép lại sau bạn khi con nước sau lên. Cuộc điều tra của bạn dừng tại đây."),
      { end: "e4_stranger" },
    ],
    c6_sand_end: [
      { hide: "*" }, { bg: "harbour" }, { clock: "03:05" },
      N("You give the phone records and letter to the police. You tell them where the grave had been.",
        "Bạn giao nhật ký cuộc gọi và lá thư cho cảnh sát. Bạn chỉ chỗ từng có ngôi mộ."),
      N("At low water the search boat goes out. It comes back without the remains.",
        "Lúc nước ròng, thuyền tìm kiếm ra khơi. Nó trở về không có hài cốt."),
      N("The case is not closed. But your mother has gone from the place where she waited twenty years.",
        "Vụ án chưa khép lại. Nhưng mẹ đã rời nơi bà nằm đợi hai mươi năm."),
      { end: "e7_sand" },
    ],
  });

  const endings = {
    e1_tides: { ch: 6, final: true, title: L("E1 · Between Tides", "E1 · Giữa hai con nước"),
      sum: L("True ending · The full account goes on record.", "Kết thật · Lời khai đầy đủ được ghi lại."),
      text: L("You kept the accident, the later attack and tonight's death separate. Nell is in custody; Callum gives his own account. Questions that need testing remain questions. You return the jumper and leave with your mother's ring.",
        "Bạn phân biệt vụ tai nạn, cú đánh sau đó và cái chết đêm nay. Nell bị giữ; Callum tự khai. Những điều cần giám định vẫn được ghi là câu hỏi. Bạn trả áo len rồi rời đảo với chiếc nhẫn của mẹ.") },
    e2_low_water: { ch: 6, final: true, title: L("E2 · Low Water", "E2 · Nước ròng"),
      sum: L("Tragic ending · The evidence survives; the final answers are lost.", "Kết bi kịch · Chứng cứ còn, câu trả lời cuối đã mất."),
      text: L("You reached the causeway without someone who could help in time. The rescue search continues. Nell's letter and your photographs remain, but the account you came to hear cannot be completed tonight.",
        "Bạn tới đường ngầm mà thiếu người có thể hỗ trợ kịp lúc. Cuộc tìm kiếm tiếp tục. Lá thư của Nell và ảnh bạn chụp còn lại, nhưng lời kể bạn tới nghe không thể hoàn tất đêm nay.") },
    e3_half_truth: { ch: 6, final: true, title: L("E3 · Half the Truth", "E3 · Nửa sự thật"),
      sum: L("Incomplete ending · Tom's death has an admission; Anna's history remains disputed.",
        "Kết chưa trọn · Có lời nhận tội về Tom; chuyện Anna vẫn còn mâu thuẫn."),
      text: L("Your accusation against Callum drew Nell's confession about Tom. It did not untangle 2004. Her letter and her son's account remain at odds, and neither will bridge the gap for you.",
        "Lời buộc tội Callum khiến Nell nhận chuyện Tom. Nó chưa gỡ được năm 2004. Lá thư và lời con bà vẫn trái nhau; không ai chịu giúp bạn nối chỗ thiếu.") },
    e4_stranger: { ch: 6, final: true, title: L("E4 · The Outsider", "E4 · Người ngoài"),
      sum: L("Incomplete ending · You hand the case over before the final confrontation.",
        "Kết chưa trọn · Bạn giao lại vụ án trước cuộc đối chất cuối."),
      text: L("You submit what you found without pretending the gaps are solved. The police continue their work. You leave without the full account of what happened to your mother.",
        "Bạn nộp những gì tìm được, không coi những chỗ thiếu là đã giải xong. Cảnh sát tiếp tục công việc. Bạn rời đi khi chưa biết đầy đủ chuyện đã xảy ra với mẹ.") },
    e5_envelope: { ch: 6, final: true, title: L("E5 · The Envelope", "E5 · Phong bì"),
      sum: L("Incomplete ending · Corruption exposed; the death investigation unresolved.",
        "Kết chưa trọn · Lộ việc tham nhũng; án mạng chưa được làm rõ."),
      text: L("Gideon's secret was real. It was not an explanation for every other clue. The bridge project collapses; the questions about Tom's bottle, Nell's movements and Anna remain.",
        "Bí mật của Gideon là có thật. Nó không giải thích mọi manh mối khác. Dự án cầu sụp đổ; câu hỏi về chai của Tom, hành động của Nell và Anna còn đó.") },
    e6_ampoules: { ch: 6, final: true, title: L("E6 · The Ampoules", "E6 · Những ống thuốc"),
      sum: L("Incomplete ending · Helen's conduct is investigated; Tom's killer is not established.",
        "Kết chưa trọn · Hành vi Helen bị điều tra; chưa xác định kẻ giết Tom."),
      text: L("You followed the doctor's guilt instead of testing its limits. The old injury record matters, but it cannot answer who prepared the whisky and made the cellar call. Tom's file remains open.",
        "Bạn đi theo cảm giác tội lỗi của bác sĩ mà chưa kiểm tra nó tới đâu. Bệnh án cũ có ý nghĩa, nhưng không trả lời ai chuẩn bị whisky và gọi từ hầm. Hồ sơ Tom vẫn để ngỏ.") },
    e7_sand: { ch: 6, final: true, title: L("E7 · Sand", "E7 · Cát"),
      sum: L("Incomplete ending · You stop after the grave has been emptied.",
        "Kết chưa trọn · Bạn dừng lại sau khi ngôi mộ bị dọn trống."),
      text: L("Waiting cost the physical evidence in the dunes. You passed on what remained instead of going to the final confrontation. The investigation continues, but you have no remains to take home.",
        "Việc chờ đã khiến vật chứng ở cồn cát mất đi. Bạn giao lại những gì còn lại thay vì tới cuộc đối chất cuối. Điều tra tiếp tục, nhưng bạn không có hài cốt để đưa về.") },
    e9_mercy: { ch: 6, final: true, title: L("E9 · Mercy", "E9 · Lòng thương"),
      sum: L("Incomplete ending · Nell's letter stands; part of the account stays unspoken.",
        "Kết chưa trọn · Lá thư Nell đứng lại; một phần sự thật chưa được nói."),
      text: L("Nell is safe and in custody. Her letter becomes the account left on the table. Whether from mercy or missing evidence, you did not put the full chain on record. You leave wearing the jumper.",
        "Nell an toàn và bị giữ. Lá thư trở thành lời kể nằm lại trên bàn. Vì lòng thương hay vì thiếu chứng cứ, bạn chưa ghi đủ chuỗi sự kiện. Bạn rời đi, vẫn mặc chiếc áo len.") },
    e10_keeper: { ch: 6, final: true, title: L("E10 · The Keeper", "E10 · Người gác nước"),
      sum: L("Hidden ending · Fourteen truths earned on this path, and a promise kept.",
        "Kết ẩn · Tự tìm đủ mười bốn sự thật trong lượt này và giữ lời hứa."),
      text: L("At 06:12 you add a new reading beneath Tom's last line. The sea matches the table again. You earned every truth on this journey; the account you chose to give remains your responsibility.",
        "Lúc 06:12, bạn ghi số đo mới dưới dòng cuối của Tom. Biển lại khớp bảng. Bạn đã tự tìm mọi sự thật trong hành trình này; lời khai bạn chọn vẫn là trách nhiệm của bạn.") },
  };
  const checkpoints = [
    ["c6_open", "lantern", "The empty Lantern", "The Lantern trống vắng"],
    ["c6_deduction", "lantern", "Who fetched Tom?", "Ai đón Tom?"],
    ["c6_cellar_entry", "cellar", "The cellar", "Dưới hầm"],
    ["c6_phone_check", "cellar", "Verify the outgoing call", "Xác minh cuộc gọi đi"],
    ["c6_letter", "lantern", "The letter's omission", "Điều lá thư bỏ trống"],
    ["c6_depart", "lantern", "Who comes with you?", "Ai đi cùng bạn?"],
    ["c6_channel", "causeway", "At the channel", "Bên mép kênh"],
    ["c6_accuse", "causeway", "The accusation", "Lời buộc tội"],
    ["c6_case_result", "causeway", "Four claims tested", "Kiểm tra bốn lời khai"],
    ["c6_dawn", "lifeboat", "What goes on record", "Điều được ghi lại"],
  ];
  const flow = checkpoints.map(([id, scene, en, vi], row) => ({ ch: 6, row, id, kind: "cp", scene, label: L(en, vi) }));
  flow.push(
    { ch: 6, row: 5, kind: "opt", key: "c6_companion", val: "leo", label: L("Leo drives", "Leo lái xe") },
    { ch: 6, row: 5, kind: "opt", key: "c6_companion", val: "callum", label: L("Callum comes", "Callum đi cùng") },
    { ch: 6, row: 5, kind: "opt", key: "c6_companion", val: "none", label: L("Alone", "Một mình") },
    { ch: 6, row: 8, kind: "opt", key: "c6_resolution", val: "truth", label: L("The full account", "Lời khai đầy đủ") },
    { ch: 6, row: 8, kind: "opt", key: "c6_resolution", val: "mercy", label: L("The letter stands", "Để lá thư đứng") },
    ...Object.entries(endings).map(([id, en]) => ({ ch: 6, row: 10, id, kind: "end", label: en.title })),
  );
  StoryEngine.chapter({
    scenes: {
      "box-dawn": { kind: "study", name: L("The refuge box", "Chòi trú nạn"), amb: "hut" },
      "harbour-dawn": { kind: "causeway", name: L("The harbour", "Bến thuyền"), amb: "harbour" },
      "causeway-dawn": { kind: "causeway", name: L("Kellholm causeway", "Đường ngầm Kellholm"), amb: "sea" },
      "lantern-yard-dawn": { kind: "dining", name: L("The Lantern", "Quán The Lantern"), amb: "room" },
      "it-calllist": {},
    },
    vars: {
      c6self: s => s.f.told_nell ? "cháu" : "tôi",
      c6Self: s => s.f.told_nell ? "Cháu" : "Tôi",
      c6addr: s => s.f.told_nell ? "bác" : "bà",
      c6Addr: s => s.f.told_nell ? "Bác" : "Bà",
    },
    words: {
      "outgoing": { vi: "gọi đi, từ máy đang xem", ex: "An outgoing call from the cellar." },
      "provisional": { vi: "sơ bộ, còn cần xác minh", ex: "Helen's opinion is provisional." },
      "on record": { vi: "được ghi lại chính thức", ex: "Put the full account on record." },
      "nowt": { vi: "nothing; cách nói vùng Bắc Anh", ex: "Nowt to shift for." },
      "darning": { vi: "chỗ mạng vá bằng sợi len", ex: "The grey darning is rough against your skin." },
    },
    items, places, nodes, endings, flow,
    recap: [
      { ch: 6, if: s => !!s.f.c6_phone_verified, t: L("You compared the outgoing 21:11 entry with Tom's stored number. The call came from the cellar handset.",
        "Bạn đối chiếu cuộc gọi đi 21:11 với số Tom đã lưu. Cuộc gọi xuất phát từ máy dưới hầm.") },
      { ch: 6, if: s => !!s.f.c6_read_letter, t: L("Nell's letter claimed the 2004 collision and said Callum was in bed. It said nothing about Tom tonight.",
        "Thư Nell nhận vụ tông năm 2004, nói Callum đang ngủ. Thư không kể chuyện Tom đêm nay.") },
      { ch: 6, if: leoHere, t: L("Leo took you to the channel and stayed beside Nell.", "Leo đưa bạn ra kênh và ở lại bên Nell.") },
      { ch: 6, if: s => s.f.c6_companion === "callum", t: L("Callum brought you to his mother and stayed with her.", "Callum đưa bạn tới chỗ mẹ rồi ở lại giữ bà.") },
      { ch: 6, if: s => !!s.f.c6_tom_confession, t: L("Nell admitted putting Tom's medicine into the TOM bottle and later rinsing it.",
        "Nell nhận đã bỏ thuốc của Tom vào chai TOM rồi xả sạch chai.") },
      { ch: 6, if: s => !!s.f.c6_anna_confession, t: L("Nell admitted Anna was alive when she arrived, and that she struck her before fetching Tom.",
        "Nell nhận Anna còn sống khi bà tới, và bà đã đánh Anna trước khi đón Tom.") },
      { ch: 6, if: sand, t: L("You did not recover the skull. The missing remains stay missing, even if a witness speaks about them.",
        "Bạn không tìm được hộp sọ. Hài cốt mất đi vẫn chưa thấy, kể cả khi nhân chứng lên tiếng về chúng.") },
      { ch: 6, if: s => !!s.f.c6_hidden_earned, t: L("At 06:12, after earning all fourteen truths on this path, you added the next reading to Tom's wall.",
        "Lúc 06:12, sau khi tự tìm đủ mười bốn sự thật trong lượt này, bạn ghi số đo tiếp theo lên vách của Tom.") },
    ],
  });
})();
