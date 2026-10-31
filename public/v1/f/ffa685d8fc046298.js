// BETWEEN TIDES · CHƯƠNG 1 · NƯỚC RÒNG (16:40 → 20:50) — ENGINE 3 (30/10/2026: place / talk / read / look / shot). Văn: ../../../GiuaHaiConNuoc-truyen-ch1.md · Thiết kế §5 Ch1, §10b.
// Cờ đặt ở đây: climbed_box (true/false) · told_nell (true/false) · held_bottle (true / false = để yên / 0 = mời Fergus nửa vại)
//   · leo_id ("truth"/"lie"). Niềm tin: leo +1 (nói thật), fergus +1 (mời nửa vại), nell +1 (nói thật danh tính).
//   held_bottle = 0 (falsy) để mọi chương sau kiểm `s.f.held_bottle` vẫn đúng nghĩa “đã cầm chai”; 0 ≠ false để sơ đồ tách nhánh.
// Gieo manh mối (không ai nói ra): nhãn TOM phẳng, sạch, bút dạ · nắp hầm mở + giọng Nell từ dưới hầm · “He's not shifted since we opened”
//   · “Been at these since dinner” · “Raised him upstairs” · “Half, mind” (để “Fill it” ở Ch2 nổi lên) · Land Rover THE LANTERN · chòi: dòng 06:01 ngay ngắn.
// Không trao T1 ở đây: mẩu thư chỉ *nói* vậy.
StoryEngine.chapter({
  words: {
    "causeway": { vi: "đường ngầm qua bãi triều", ex: "Everyone's here about the causeway, one way or another." },
    "low water": { vi: "nước ròng", ex: "Come on the 14th, at low water." },
    "tide tables": { vi: "bảng giờ thủy triều", ex: "Check the tide tables." },
    "refuge box": { vi: "chòi trú nạn", ex: "Someone has repainted two words over the door: REFUGE BOX." },
    "soot": { vi: "muội (đèn)", ex: "Numbers written in lamp soot, small and black." },
    "claim": { vi: "(hồ sơ) yêu cầu bồi thường", ex: "I'm just here about a claim." },
    "pet": { vi: "cách gọi thân mật vùng Đông Bắc Anh, kiểu “cháu”", ex: "Sit down, pet." },
    "darned": { vi: "mạng lại (chỗ rách trên đồ len)", ex: "The left cuff has been darned in a different wool." },
    "felt-tip": { vi: "bút dạ", ex: "Written in fat black felt-tip capitals." },
    "cellar": { vi: "hầm (rượu, bia)", ex: "If the bar's empty, I'm down the cellar swearing at a barrel." },
    "dinner": { vi: "(miền Bắc nước Anh) bữa trưa", ex: "Been at these since dinner." },
    "glass": { vi: "áp suất (phong vũ biểu)", ex: "Glass is high. Wind's off the land." },
    "surgery": { vi: "phòng khám (không phải phẫu thuật)", ex: "Outside the surgery, a woman is locking the door." },
    "play it safe": { vi: "chơi chắc, trừ hao", ex: "Tables always play it safe. Sea doesn't." },
  },
  recap: [
    { ch: 1, t: { en: "Your mother's ring came in an envelope from Berwick, with a note: 'YOUR MOTHER DIDN'T DROWN… — T.A.'", vi: "Nhẫn của mẹ đến trong một phong bì gửi từ Berwick, kèm mẩu thư: “YOUR MOTHER DIDN'T DROWN… — T.A.”" } },
    { ch: 1, if: s => s.f.climbed_box === true, t: { en: "You climbed into the refuge box. Its walls are covered in soot numbers; the newest reads '14.11 06:01 — 0.5 U'.", vi: "Bạn leo vào chòi trú nạn. Vách chòi kín những con số viết bằng muội; dòng mới nhất là “14.11 06:01 — 0.5 U”." } },
    { ch: 1, if: s => s.f.climbed_box === false, t: { en: "You drove past the refuge box without stopping.", vi: "Bạn lái ngang chòi trú nạn mà không dừng lại." } },
    { ch: 1, t: { en: "Nell Calloway, landlady of The Lantern, gave you room three and her son's old green jumper. Her brother Tom Ashby keeps the causeway: T.A.", vi: "Nell Calloway, chủ quán The Lantern, giao cho bạn phòng ba và chiếc áo len xanh cũ của con trai bà. Anh trai bà, Tom Ashby, là người gác đường ngầm: T.A." } },
    { ch: 1, if: s => s.f.told_nell === true, t: { en: "You told Nell who you are. She held you and said, 'Twenty years.'", vi: "Bạn nói với Nell mình là ai. Bà ôm chặt bạn: “Hai mươi năm rồi.”" } },
    { ch: 1, if: s => s.f.told_nell === false, t: { en: "You kept your cover: just an insurance assessor, here about a claim.", vi: "Bạn giữ vỏ bọc: chỉ là người thẩm định bảo hiểm tới vì một hồ sơ." } },
    { ch: 1, t: { en: "Fergus pours Tom's flask from the bottle marked TOM — half a flask, these days. The phone behind the bar rang twice; Nell answered it from the cellar.", vi: "Fergus rót bình cho Tom từ chai dán nhãn TOM — dạo này chỉ nửa bình. Điện thoại sau quầy reo hai hồi; Nell nghe máy từ dưới hầm." } },
    { ch: 1, if: s => s.f.held_bottle === true, t: { en: "You took the TOM bottle down. The label is in the same hand as your note. Fergus saw you.", vi: "Bạn lấy chai TOM xuống. Nét chữ trên nhãn giống hệt mẩu thư của bạn. Fergus đã thấy." } },
    { ch: 1, if: s => s.f.held_bottle === false, t: { en: "You left Tom's bottle alone.", vi: "Bạn để yên chai rượu của Tom." } },
    { ch: 1, if: s => s.f.held_bottle === 0, t: { en: "You bought Fergus a half. He drank it to Tom.", vi: "Bạn mời Fergus nửa vại. Ông nâng ly mời Tom." } },
    { ch: 1, t: { en: "On your walk: Callum mending nets at the harbour since dinner; Dr Vosper in a hurry; Gideon Marsh and his bridge — rigs on the north dunes on Monday.", vi: "Đi dạo quanh đảo: Callum vá lưới ở bến từ trưa; bác sĩ Vosper vội vã; Gideon Marsh và cây cầu của ông — thứ Hai giàn khoan lên cồn cát phía bắc." } },
    { ch: 1, if: s => s.f.leo_id === "truth", t: { en: "You told Leo Hart, the young constable, that you're staying at The Lantern.", vi: "Bạn nói thật với Leo Hart, viên cảnh sát trẻ, rằng bạn ở The Lantern." } },
    { ch: 1, if: s => s.f.leo_id === "lie", t: { en: "You told Leo Hart, the young constable, that you're staying on the mainland.", vi: "Bạn nói với Leo Hart, viên cảnh sát trẻ, rằng bạn ở bên đất liền." } },
    { ch: 1, t: { en: "At ten to eight Gideon told Tom, 'Friday will finish me.' At the pub Tom passed your table: 'Not here. My cottage. Ten o'clock.'", vi: "Tám giờ kém mười, Gideon nói với Tom: “Thứ Sáu này là tôi sạt nghiệp.” Ở quán, Tom đi ngang bàn bạn: “Không nói ở đây. Nhà tôi. Mười giờ tối.”" } },
    { ch: 1, t: { en: "At 20:50 Nell rang the bell: the causeway closed. Outside, the road was still bone dry.", vi: "20:50 Nell rung chuông: đường ngầm đóng. Bên ngoài, con đường vẫn khô rang." } },
  ],
  flow: [
    { ch: 1, row: 0, id: "c1_open", kind: "cp", scene: "car", label: { en: "The ring", vi: "Chiếc nhẫn" }, sum: { en: "A ring, a note, a road across the sand.", vi: "Một chiếc nhẫn, một mẩu thư, một con đường băng qua bãi cát." } },
    { ch: 1, row: 1, kind: "opt", key: "climbed_box", val: true, label: { en: "Climbed the box", vi: "Leo lên chòi" }, sum: { en: "You read the soot numbers on the walls.", vi: "Bạn đọc những con số bằng muội trên vách." }, hint: { en: "A white hut on iron legs.", vi: "Một cái chòi trắng trên chân sắt." } },
    { ch: 1, row: 1, kind: "opt", key: "climbed_box", val: false, label: { en: "Drove on", vi: "Lái tiếp" }, sum: { en: "The hut slid past in your mirror.", vi: "Cái chòi lướt qua trong gương chiếu hậu." }, hint: { en: "A white hut on iron legs.", vi: "Một cái chòi trắng trên chân sắt." } },
    { ch: 1, row: 2, id: "c1_lantern", kind: "cp", scene: "lantern", label: { en: "The Lantern", vi: "Quán The Lantern" }, sum: { en: "Tea, a key, a jumper — and a bottle nobody touches.", vi: "Trà, chìa khóa, áo len — và một cái chai không ai được đụng." } },
    { ch: 1, row: 3, kind: "opt", key: "told_nell", val: true, label: { en: "Told Nell", vi: "Nói thật với Nell" }, sum: { en: "Nell knows you are Anna's child.", vi: "Nell biết bạn là con của Anna." }, hint: { en: "Who are you, really?", vi: "Thật ra bạn là ai?" } },
    { ch: 1, row: 3, kind: "opt", key: "told_nell", val: false, label: { en: "Kept your cover", vi: "Giữ vỏ bọc" }, sum: { en: "Just the insurance.", vi: "Chỉ là người bên bảo hiểm." }, hint: { en: "Who are you, really?", vi: "Thật ra bạn là ai?" } },
    { ch: 1, row: 4, kind: "opt", key: "held_bottle", val: true, label: { en: "Read the label", vi: "Đọc nhãn chai" }, sum: { en: "The same hand as your note. Fergus saw.", vi: "Nét chữ giống hệt mẩu thư. Fergus đã thấy." }, hint: { en: "The bottle marked TOM.", vi: "Chai dán nhãn TOM." } },
    { ch: 1, row: 4, kind: "opt", key: "held_bottle", val: false, label: { en: "Left it", vi: "Để yên" }, sum: { en: "Nobody touches that.", vi: "Không ai được đụng vào." }, hint: { en: "The bottle marked TOM.", vi: "Chai dán nhãn TOM." } },
    { ch: 1, row: 4, kind: "opt", key: "held_bottle", val: 0, label: { en: "Bought Fergus a half", vi: "Mời Fergus nửa vại" }, sum: { en: "Fergus will remember that.", vi: "Fergus sẽ nhớ điều đó." }, hint: { en: "The bottle marked TOM.", vi: "Chai dán nhãn TOM." } },
    { ch: 1, row: 5, id: "c1_island", kind: "cp", scene: "village", label: { en: "The island", vi: "Hòn đảo" }, sum: { en: "Thirty-one people, one road, one tide.", vi: "Ba mươi mốt con người, một con đường, một con nước." } },
    { ch: 1, row: 6, kind: "opt", key: "leo_id", val: "truth", label: { en: "Told Leo the truth", vi: "Nói thật với Leo" }, sum: { en: "Leo knows where you are tonight.", vi: "Leo biết đêm nay bạn ở đâu." }, hint: { en: "The constable asks where you're staying.", vi: "Viên cảnh sát hỏi bạn nghỉ ở đâu." } },
    { ch: 1, row: 6, kind: "opt", key: "leo_id", val: "lie", label: { en: "Said 'the mainland'", vi: "Nói “bên đất liền”" }, sum: { en: "A small lie on a small island.", vi: "Một lời nói dối nhỏ trên một hòn đảo nhỏ." }, hint: { en: "The constable asks where you're staying.", vi: "Viên cảnh sát hỏi bạn nghỉ ở đâu." } },
    { ch: 1, row: 7, id: "c1_bell", kind: "cp", scene: "lantern", label: { en: "The bell", vi: "Tiếng chuông" }, sum: { en: "Ten to nine. The causeway is closed. The road is dry.", vi: "Chín giờ kém mười. Đường ngầm đóng. Con đường vẫn khô." } },
    { ch: 1, row: 9, id: "c1_end", kind: "end", label: { en: "Low Water", vi: "Nước ròng" } },
  ],
  items: {
    roomkey: { icon: "key", keep: true, name: { en: "Room key", vi: "Chìa khoá phòng" }, desc: { en: "A brass key on a wooden tag: 3 · THE LANTERN · KELLHOLM 207.", vi: "Chìa khoá đồng buộc thẻ gỗ: 3 · THE LANTERN · KELLHOLM 207." },
      doc: { paper: "label", hand: "print", lines: [{ en: "3 · THE LANTERN · KELLHOLM 207" }] } },
    jumper: { icon: "box", keep: true, name: { en: "Green jumper", vi: "Áo len xanh" }, desc: { en: "Nell's son's old jumper. The left cuff is darned in grey wool, big clumsy stitches.", vi: "Áo len cũ của con trai Nell. Cổ tay trái mạng bằng len xám, mũi to, vụng." },
      sides: [{ t: { en: "Nell's son's old jumper, worn at the elbows, smelling of mothballs.", vi: "Áo len cũ của con trai Nell, sờn khuỷu, mùi băng phiến." } },
        { art: "it-jumper-cuff", t: { en: "The left cuff: darned in a different wool — grey, big clumsy stitches.", vi: "Cổ tay trái: mạng bằng len khác màu — len xám, mũi to, vụng." } }] },
  },
  // ═════════ ENGINE 3 (30/10/2026): mỗi câu dẫn nhìn vào 1 thứ (look / shot), đồ vật hiện ra + đọc được (item / read),
  //   khám phá kiểu Rusty Lake (place), bấm người để hỏi (talk). Cờ / lựa chọn / ghi chép GIỮ NGUYÊN cho các chương sau.
  docs: {
    sign: { paper: "sign", lines: [
      { en: "CHECK THE [[TIDE TABLES]].", vi: "XEM BẢNG GIỜ THỦY TRIỀU." },
      { en: "DO NOT CROSS WHEN WATER IS ON THE ROAD.", vi: "KHÔNG ĐI QUA KHI CÓ NƯỚC TRÊN MẶT ĐƯỜNG." } ] },
    tidecard: { paper: "card", hand: "type", title: { en: "Kellholm causeway · 14 November", vi: "Đường ngầm Kellholm · 14 tháng 11" }, lines: [
      { en: "Safe crossing until 20:50.", vi: "Đi qua an toàn tới 20:50." },
      { en: "Next safe crossing from 03:05.", vi: "Lần đi qua an toàn tiếp theo từ 03:05." },
      { s: "gap" },
      { en: "Times are a guide only. Check the road, not your watch.", vi: "Giờ chỉ để tham khảo. Hãy nhìn mặt đường, đừng nhìn đồng hồ.", s: "small" } ],
      note: { en: "Tide card: safe crossing until 20:50. Next safe crossing from 03:05.", vi: "Tờ giờ in: đi qua an toàn tới 20:50. Lần đi qua an toàn tiếp theo từ 03:05." } },
    report2004: { paper: "report", hand: "type", title: { en: "Northumbria Police · Incident report · 14.11.2004", vi: "Cảnh sát Northumbria · Biên bản sự việc · 14.11.2004" }, lines: [
      { en: "Vehicle: blue Ford Fiesta, registered to Mrs A. Rowe.", vi: "Phương tiện: Ford Fiesta xanh, chủ xe bà A. Rowe." },
      { en: "The vehicle was recovered from the main channel, approximately midway along the causeway.", vi: "Phương tiện được trục vớt tại kênh chính, khoảng giữa đường ngầm." },
      { en: "No occupant found. Presumed taken by the tide.", vi: "Không tìm thấy người trong xe. Coi như bị thủy triều cuốn." },
      { s: "gap" },
      { en: "Reporting officer: PC D. Hart", vi: "Cán bộ lập biên bản: PC D. Hart", s: "small" } ] },
  },
  places: {
    // ── đầu đường ngầm: 1 view (cột biển báo) — bài học đầu: chạm chỗ loé sáng, lau tấm nhựa mờ
    c1_roadstart: {
      name: { en: "The start of the causeway", vi: "Đầu đường ngầm" }, goal: { en: "Read the signs before you cross", vi: "Đọc biển trước khi qua" },
      need: 2, done: { en: "Drive on", vi: "Lái xe đi" },
      views: { sign: { img: "causeway-sign", zones: [
        { id: "sign", r: "sign", clue: true, label: { en: "The red sign", vi: "Tấm biển đỏ" }, hint: { en: "Read the big sign.", vi: "Đọc tấm biển lớn." }, then: [{ read: "sign" }, { note: { en: "Sign: 'Check the tide tables. Do not cross when water is on the road.'", vi: "Biển báo: “Xem bảng giờ thủy triều. Không đi qua khi có nước trên mặt đường.”" }, quiet: true }] },
        { id: "card", r: "card", clue: true, label: { en: "Fogged plastic", vi: "Tấm nhựa mờ" }, hint: { en: "Rub the fog off the little card under the sign.", vi: "Miết lau hơi nước trên tờ giấy nhỏ dưới biển." },
          widget: { type: "wipe", ok: [{ read: "tidecard" }] } },
      ] } },
    },
    // ── chòi trú nạn: 3 hướng + cận cảnh dòng muội mới nhất
    c1_box: {
      name: { en: "The refuge box", vi: "Chòi trú nạn" }, goal: { en: "Look around the refuge box", vi: "Nhìn quanh chòi trú nạn" },
      start: "walls", ring: ["walls", "door", "roof"], need: 2, done: { en: "Climb back down", vi: "Leo xuống" },
      views: {
        walls: { img: "box-walls", name: { en: "The back wall", vi: "Vách sau" }, zones: [
          { id: "walls", r: "soot", clue: true, label: { en: "Soot numbers", vi: "Số viết bằng muội" }, hint: { en: "Read the numbers on the wall.", vi: "Đọc những con số trên vách." }, then: [
            { n: { en: "Line after line, the same small, steady hand:", vi: "Dòng này nối dòng kia, cùng một nét chữ nhỏ, vững:" } },
            { read: { paper: "label", hand: "type", lines: [{ en: "21:40 — 0.1" }, { en: "03:10 — 0.2 U" }, { en: "04:55 — 0.0" }] } },
            { note: { en: "Box walls: '21:40 — 0.1 · 03:10 — 0.2 U · 04:55 — 0.0'", vi: "Vách chòi: “21:40 — 0.1 · 03:10 — 0.2 U · 04:55 — 0.0”" } } ] },
          { id: "bench", r: "bench", label: { en: "The bench", vi: "Băng ghế" }, then: [
            { n: { en: "A narrow bench, worn pale where people have sat and waited for the sea to change its mind.", vi: "Một băng ghế hẹp, mòn bạc ở chỗ người ta từng ngồi chờ biển đổi ý." } } ] },
        ] },
        door: { img: "box-door", name: { en: "By the door", vi: "Cạnh cửa" }, zones: [
          { id: "door", r: "line", to: "line", label: { en: "The newest line", vi: "Dòng mới nhất" }, hint: { en: "Something by the door is still black and sharp.", vi: "Có gì đó cạnh cửa vẫn đen và sắc nét." } },
          { id: "gauge", r: "gauge", label: { en: "The tide gauge", vi: "Cọc đo nước" }, then: [
            { n: { en: "Through the doorway: the painted post on the iron leg, marked in tenths of a metre. Dry to the last mark.", vi: "Qua khung cửa: cây cọc sơn vạch trên chân sắt, chia từng mười phân. Khô tới tận vạch cuối." } } ] },
          { id: "ladder", r: "ladder", exit: true, label: { en: "Climb down", vi: "Leo xuống" } },
        ] },
        line: { img: "box-line", up: "door", name: { en: "The newest line", vi: "Dòng mới nhất" }, zones: [
          { id: "line0601", r: "line", clue: true, label: { en: "14.11 06:01", vi: "14.11 06:01" }, then: [
            { n: { en: "By the door, lower down, the newest line is still black and sharp:", vi: "Cạnh cửa, thấp hơn, dòng mới nhất vẫn đen và sắc nét:" } },
            { read: { paper: "label", hand: "type", lines: [{ en: "14.11 06:01 — 0.5 U", s: "big" }] } },
            { note: { en: "Newest line, by the door: '14.11 06:01 — 0.5 U' — neat and sharp.", vi: "Dòng mới nhất, cạnh cửa: “14.11 06:01 — 0.5 U” — ngay ngắn, sắc nét." } },
            { fx: "shiver" },
            { think: { en: "The 14th. Today. Someone stood here this morning.", vi: "Ngày 14. Hôm nay. Sáng nay đã có người đứng ở đây." } } ] },
        ] },
        roof: { img: "box-roof", name: { en: "The roof", vi: "Mái chòi" }, zones: [
          { id: "hook", r: "hook", label: { en: "The lamp hook", vi: "Móc treo đèn" }, then: [
            { n: { en: "An empty hook, black above it where a lamp has burned on a great many nights.", vi: "Một cái móc trống, phía trên đen muội, nơi ngọn đèn đã cháy qua rất nhiều đêm." } } ] },
        ] },
      },
    },
    // ── quán The Lantern sau khi Nell đi: quầy · kệ chai (cận cảnh) · sân sau
    c1_bar: {
      name: { en: "The Lantern", vi: "Quán The Lantern" }, goal: { en: "Look around the bar", vi: "Nhìn quanh quầy" },
      start: "bar", need: s => s.f.held_bottle !== undefined, progress: s => [s.f.held_bottle !== undefined ? 1 : 0, 1],
      done: { en: "Go out and walk the island", vi: "Ra ngoài đi một vòng đảo" },
      views: {
        bar: { img: "lantern-bar", name: { en: "The bar", vi: "Quầy bar" }, right: "yard", zones: [
          { id: "shelf", r: "shelf", to: "shelf", label: { en: "The shelf of bottles", vi: "Kệ chai" }, hint: { en: "Look at the bottles behind the bar.", vi: "Nhìn hàng chai sau quầy." } },
          { id: "hatch", r: "hatch", label: { en: "The cellar hatch", vi: "Nắp hầm" }, then: [
            { n: { en: "The cellar hatch behind the bar is shut now. Cold air still breathes up through the cracks.", vi: "Nắp hầm sau quầy giờ đã đóng. Hơi lạnh vẫn phả lên qua khe ván." } } ] },
          { id: "phone", r: "phone", label: { en: "The phone", vi: "Điện thoại" }, then: [
            { n: { en: "An old cream telephone on a shelf behind the bar, its cord long enough to reach the cellar steps.", vi: "Một chiếc điện thoại màu kem cũ trên kệ sau quầy, dây đủ dài để kéo tới bậc thang xuống hầm." } } ] },
        ], people: [{ who: "fergus", r: "stool", pose: "sit", talk: {
          prompt: { en: "Fergus, on his stool.", vi: "Fergus, trên ghế cao." },
          topics: [
            { id: "tom", label: { en: "Ask about Tom", vi: "Hỏi về Tom" }, then: [
              { say: "me", en: "You know Tom well?", vi: "Ông thân với Tom lắm ạ?" },
              { say: "fergus", tone: "gruff, fond", en: "Sixty year. Since we were lads pinching apples off the priory.", easy: "Sixty years. Since we were boys.", vi: "Sáu mươi năm. Từ hồi hai đứa còn là thằng nhóc đi hái trộm táo trên tu viện." } ] },
            { id: "half", label: { en: "Buy him a half", vi: "Mời ông nửa vại" }, if: s => s.f.held_bottle === undefined, then: [
              { set: { held_bottle: 0 } }, { add: { fergus: 1 } },
              { show: "fergus", at: "c", face: "smile" },
              { say: "fergus", tone: "grudging", en: "Aye. Go on, then.", vi: "Ờ. Thì mời." },
              { sfx: "glass" },
              { pic: "cg-fergus-toast", n: { en: "Nell pulls it without a word. Fergus lifts the glass an inch towards you, then towards the bottle on the shelf.", vi: "Nell rót bia, không nói một lời. Fergus nhấc ly lên một chút về phía bạn, rồi về phía cái chai trên kệ." }, on: "fergus" },
              { say: "fergus", tone: "raising a glass, quiet and heartfelt", en: "To Tom. Sixty year I've drunk with him.", easy: "To Tom. I've been drinking with him for sixty years.", vi: "Mời Tom. Sáu mươi năm nay ông uống với lão." } ] },
          ] } }] },
        shelf: { img: "lantern-shelf", up: "bar", name: { en: "The shelf", vi: "Kệ chai" }, zones: [
          { id: "bottle", r: "bottle", label: { en: "The TOM bottle", vi: "Chai TOM" }, then: [
            { if: s => s.f.held_bottle === 0, then: [
              { think: { en: "Fergus is watching the bottle over his half. You leave it where it is.", vi: "Fergus vừa nhấp bia vừa canh cái chai. Bạn để nó yên đó." } } ],
            else: [
              { n: { en: "Among the bottles stands one whisky with a clean, flat square of paper for a label, written in fat black [[felt-tip]] capitals: TOM.", vi: "Giữa hàng chai có một chai whisky dán một mảnh giấy vuông, phẳng, sạch làm nhãn, chữ in hoa to bằng bút dạ đen: TOM." } },
              { choice: [
                { tag: "curious", en: "(Take the bottle down and read the label.)", vi: "(Lấy chai xuống đọc nhãn.)", set: { held_bottle: true }, then: [
                  { sfx: "glass" }, { fx: "spotlight" },
                  { read: { paper: "label", hand: "marker", lines: [{ en: "TOM", s: "big" }] } },
                  { n: { en: "The label is in the same hand as your note: the same hard capitals, in felt-tip this time.", vi: "Nhãn viết tay: chữ in hoa cứng, nét chữ giống hệt tờ giấy của bạn, lần này bằng bút dạ." } },
                  { n: { en: "The bottle is about two-thirds full. You put it back exactly where it was.", vi: "Chai còn chừng hai phần ba. Bạn đặt lại đúng chỗ cũ." } },
                  { note: { en: "The TOM label is in the same hand as the note. The bottle is about two-thirds full.", vi: "Nhãn chai TOM cùng nét chữ với mẩu thư. Chai còn chừng hai phần ba." } },
                  { show: "fergus", at: "c", face: "angry" }, { fx: "shake" },
                  { pic: "cg-fergus-glare", say: "fergus", tone: "suspicious and slow, a quiet threat", en: "Saw that, I did. Tom'll want to know who's had their hands on his whisky. Hope you're insured.", easy: "I saw that. Tom will want to know who touched his whisky.", vi: "Thấy cả rồi đấy nhé. Thế nào Tom cũng muốn biết ai đã sờ vào chai rượu của lão. Mong là cháu có bảo hiểm." },
                  { hide: "fergus" } ] },
                { tag: "careful", en: "(Leave it.)", vi: "(Để yên.)", set: { held_bottle: false }, then: [
                  { n: { en: "You leave the bottle where it stands, among the others, with its clean square label.", vi: "Bạn để cái chai yên chỗ cũ, giữa hàng chai, với mảnh nhãn vuông sạch sẽ." } } ] },
              ] } ] } ] },
        ] },
        yard: { img: "lantern-yard", name: { en: "The yard", vi: "Sân quán" }, loc: true, left: "bar", zones: [
          { id: "landrover", r: "landrover", label: { en: "The Land Rover", vi: "Chiếc Land Rover" }, then: [
            { n: { en: "An old Land Rover, paint flaking, THE LANTERN lettered on the door. The bonnet is cold.", vi: "Một chiếc Land Rover cũ, sơn tróc, cửa xe kẻ chữ THE LANTERN. Nắp máy lạnh ngắt." } } ] },
          { id: "phonebox", r: "phonebox", label: { en: "The phone box", vi: "Bốt điện thoại" }, then: [
            { n: { en: "A red phone box beside the porch, lit for nobody. Inside, a laminated card of island numbers, curling at the corners.", vi: "Bốt điện thoại đỏ cạnh hiên, sáng đèn mà chẳng ai dùng. Bên trong, một tấm thẻ ép nhựa ghi số điện thoại trên đảo, quăn góc." } } ] },
        ] },
      },
    },
    // ── đi quanh đảo: 5 chỗ lân cận (◀ ▶), bấm người để nói chuyện; gặp đủ 4 người mới về
    c1_island: {
      name: { en: "Kellholm village", vi: "Làng Kellholm" }, goal: { en: "Walk the island", vi: "Đi một vòng quanh đảo" },
      start: "square", ring: ["square", "harbour", "priory", "surgery", "bighouse"],
      need: s => ["callum", "leo", "helen", "gideon"].every(k => s.R.met?.[k]), progress: s => [["callum", "leo", "helen", "gideon"].filter(k => s.R.met?.[k]).length, 4],
      done: { en: "Head back as the light goes", vi: "Quay về khi trời sẩm tối" }, leave: false,
      views: {
        square: { img: "isl-square", name: { en: "The square", vi: "Quảng trường" }, loc: true, zones: [
          { id: "fingerpost", r: "fingerpost", label: { en: "The fingerpost", vi: "Cột chỉ đường" }, then: [
            { n: { en: "A wooden fingerpost: HARBOUR · PRIORY · SURGERY · THE HALL. Turn left or right to walk there.", vi: "Một cột chỉ đường bằng gỗ: BẾN · TU VIỆN · PHÒNG KHÁM · ĐIỀN TRANG. Quay trái hoặc phải để đi tới." } } ] },
        ] },
        harbour: { img: "isl-harbour", name: { en: "The harbour", vi: "Bến thuyền" }, loc: true, people: [{ who: "callum", r: "nets", pose: "kneel", talk: { hello: [
          { n: { en: "At the harbour, a man in his thirties is mending a net, hands red with cold. He doesn't look up.", vi: "Ở bến thuyền, một người đàn ông ngoài ba mươi đang vá lưới, tay đỏ vì lạnh. Anh không ngẩng lên." } },
          { meet: "callum" },
          { say: "callum", tone: "wary and cold, not looking up from his work", en: "Insurance. What's insurance want with the causeway?", easy: "Insurance? What does insurance want with the causeway?", vi: "Bảo hiểm. Bảo hiểm thì dính dáng gì tới đường ngầm?" },
          { say: "me", tone: "careful, neutral", en: "Someone made a claim.", vi: "Có người yêu cầu bồi thường." },
          { say: "callum", tone: "flat and bitter", en: "Someone always does. Sea doesn't pay out, though.", vi: "Lúc nào chả có người đòi. Biển thì có trả bao giờ." },
          { say: "callum", tone: "short and tired", en: "Been at these since [[dinner]].", easy: "I've been mending these since lunch.", vi: "Ngồi vá từ trưa tới giờ đấy." },
          { n: { en: "He bites through the line. His phone is propped against the net. On the lock screen, a girl of about five grins with a front tooth missing.", vi: "Anh cắn đứt sợi cước. Điện thoại của anh dựa vào lưới; trên màn hình khóa, một bé gái chừng năm tuổi cười toe, sún một răng cửa." }, on: "callum" },
          { say: "callum", tone: "matter-of-fact, reading the weather", en: "[[Glass]] is high. Wind's off the land. She'll run low tonight.", easy: "The pressure is high and the wind blows out to sea. The water will be low tonight.", vi: "Áp suất cao. Gió từ đất liền thổi ra. Đêm nay nước sẽ thấp." },
          { say: "callum", tone: "brisk, ending the conversation", en: "Big tide. I'll be down the buoys at nine, if the wind lets me. There.", easy: "A big tide. I'm going out to the buoys at nine. There — found it.", vi: "Triều lớn. Chín giờ tối tôi ra chỗ phao, gió có cho thì đi. Đây rồi." },
          { n: { en: "He has found the hole. He doesn't look at you again.", vi: "Thấy lỗ thủng rồi. Anh không nhìn bạn thêm lần nào nữa." }, on: "callum" },
          { note: { en: "Callum (harbour): mending nets 'since dinner'. Out to the buoys at nine.", vi: "Callum (bến): vá lưới “từ trưa”. Chín giờ ra chỗ phao." }, quiet: true } ] } }] },
        priory: { img: "isl-priory", name: { en: "The priory road", vi: "Đường lên tu viện" }, loc: true, zones: [
          { id: "ruin", r: "ruin", label: { en: "The ruined priory", vi: "Tu viện đổ nát" }, then: [
            { n: { en: "The ruined bell tower you saw from the causeway. Up close, gulls have taken the windows.", vi: "Tháp chuông đổ nát bạn thấy từ đường ngầm. Lại gần mới thấy mòng biển đã chiếm hết các ô cửa." } } ] },
        ], people: [{ who: "leo", r: "leo", pose: "stand", talk: { hello: [
          { n: { en: "On the road up to the priory, a white Land Rover with yellow-and-blue chequers and HM COASTGUARD on the bonnet pulls over. The young man inside wears a coastguard jacket.", vi: "Trên đường lên tu viện, một chiếc Land Rover trắng kẻ ô vàng–xanh, chữ HM COASTGUARD trên nắp máy, tấp vào lề. Anh thanh niên trong xe mặc áo của đội cứu hộ bờ biển." } },
          { meet: "leo" },
          { say: "leo", tone: "friendly but official, a touch proud", en: "Evening. Leo Hart. I'm the police round here when the tide's in, which is when it counts.", easy: "Good evening. I'm Leo Hart. When the tide is in, I am the police here.", vi: "Chào {ac}. Leo Hart. Lúc nước lên thì tôi là cảnh sát ở đây, mà đó mới là lúc cần." },
          { say: "leo", tone: "polite but probing", en: "Mind telling me who you are? Small island. I like to know who's on it when the tide shuts.", easy: "Who are you, please? It's a small island. I want to know who is here when the road closes.", vi: "{Ac} cho tôi biết {ac} là ai được không ạ? Đảo nhỏ. Nước lên đóng đường rồi thì tôi muốn biết trên đảo có những ai." },
          { pic: "cg-leo-licence", n: { en: "You show him your driving licence. He reads it as carefully as a contract, then hands it back.", vi: "Bạn đưa anh xem bằng lái. Anh đọc kỹ như đọc hợp đồng, rồi trả lại." }, on: "leo" },
          { say: "leo", tone: "casual, testing", en: "And where are you staying?", vi: "Còn {ac} nghỉ lại ở đâu ạ?" },
          { choice: [
            { tag: "honest", en: "(Tell the truth.) The Lantern.", vi: "(Nói thật.) Ở The Lantern.", set: { leo_id: "truth" }, add: { leo: 1 }, then: [
              { say: "me", en: "The Lantern. Room three.", vi: "Ở The Lantern. Phòng ba." },
              { say: "leo", tone: "warmer, half a smile", en: "Nell's. You'll be fed, then.", face: "soft", vi: "Quán bà Nell. Vậy là {ac} sẽ được ăn no." } ] },
            { tag: "guarded", en: "(Say you're staying on the mainland.)", vi: "(Nói là ở bên đất liền.)", set: { leo_id: "lie" }, then: [
              { say: "me", tone: "evasive", en: "On the mainland.", vi: "Bên đất liền." },
              { n: { en: "He looks at the sky, then at his watch, and says nothing.", vi: "Anh nhìn trời, nhìn đồng hồ, rồi không nói gì." }, on: "leo" } ] },
          ] },
          { say: "leo", tone: "easy and reassuring", en: "Big tide tonight. Tom'll be out reading the channel, I expect. In and out in ten minutes, always is.", easy: "It's a big tide tonight. Tom will go out to check the water. He's always back in ten minutes.", vi: "Đêm nay triều lớn. Chắc ông Tom sẽ ra đọc nước ở kênh. Đi có mười phút là về, lần nào cũng vậy." },
          { sfx: "buzz" },
          { say: "leo", tone: "nostalgic and fond, quiet", en: "He taught me the road when I was a kid. Made me say it back to him, like a times table. Never walk it at the flood. If it catches you, climb.", easy: "Tom taught me the rule when I was a child: never walk the road when the water is coming in. If it catches you, climb.", vi: "Hồi tôi còn bé, ông ấy dạy tôi thuộc đường ngầm. Bắt tôi đọc lại cho ông ấy nghe, như đọc bảng cửu chương. Nước đang lên thì đừng bao giờ đi bộ qua. Nước mà đuổi kịp thì leo lên." },
          { note: { en: "Tom's rule (Leo): 'Never walk it at the flood. If it catches you, climb.'", vi: "Luật của Tom (Leo kể): “Nước đang lên thì đừng bao giờ đi bộ qua. Nước mà đuổi kịp thì leo lên.”" }, quiet: true } ] } }] },
        surgery: { img: "isl-surgery", name: { en: "The surgery", vi: "Phòng khám" }, loc: true, zones: [
          { id: "plate", r: "plate", label: { en: "The brass plate", vi: "Biển đồng" }, then: [
            { read: { paper: "label", hand: "print", lines: [{ en: "DR H. VOSPER · GENERAL PRACTITIONER", vi: "BS H. VOSPER · BÁC SĨ ĐA KHOA" }, { en: "Out of hours: ring the bell", vi: "Ngoài giờ: bấm chuông", s: "small" }] } } ] },
        ], people: [{ who: "helen", r: "helen", pose: "bag", face: "cold", talk: { hello: [
          { n: { en: "Outside the [[surgery]], a woman is locking the door in a hurry, a medical bag on her shoulder.", vi: "Trước phòng khám, một người phụ nữ đang khóa cửa vội, túi y tế đeo vai." } },
          { meet: "helen" },
          { say: "helen", tone: "clipped, hurried, firm", en: "If it's about Tom Ashby, he's my patient and I can't discuss him. If it's about anything else, I'm late.", easy: "Tom Ashby is my patient. I can't talk about him. And I'm late.", vi: "Nếu là chuyện Tom Ashby thì ông ấy là bệnh nhân của tôi và tôi không thể trao đổi về ông ấy. Còn nếu chuyện khác thì tôi đang trễ giờ." } ] } }] },
        bighouse: { img: "isl-bighouse", name: { en: "The big house", vi: "Điền trang" }, loc: true, zones: [
          { id: "estate_lr", r: "landrover", label: { en: "The muddy Land Rover", vi: "Chiếc Land Rover bám bùn" }, then: [
            { n: { en: "Behind the gates, in the yard, the estate's old Land Rover sits caked in mud up to the roof.", vi: "Sau cánh cổng, trong sân, một chiếc Land Rover cũ của điền trang bám bùn tới tận nóc." } } ] },
        ], people: [{ who: "gideon", r: "gideon", pose: "stand", talk: { hello: [
          { n: { en: "At the gates of the big house, a man in an expensive waxed jacket shakes your hand for slightly too long.", vi: "Ở cổng điền trang, một người đàn ông khoác chiếc áo sáp đắt tiền bắt tay bạn lâu hơn cần thiết một chút." } },
          { meet: "gideon" },
          { say: "gideon", tone: "booming, theatrical enthusiasm", en: "Insurance! Splendid. You'll see for yourself. One bad tide and this island has a tragedy on its hands.", easy: "Insurance! Wonderful. One bad tide here and something terrible happens.", vi: "Bảo hiểm! Quả là tuyệt. Rồi {ac} sẽ tự thấy. Chỉ một con nước dữ thôi là hòn đảo này gặp thảm kịch." },
          { say: "gideon", tone: "fast confident salesman's patter", en: "A bridge, that's the answer. The council votes on Friday. Rigs are booked for Monday. North dunes. Boreholes for the footings. Done deal.", easy: "We need a bridge. The council votes on Friday. On Monday the drilling starts on the north dunes.", vi: "Một cây cầu, đó là lời giải. Thứ Sáu này hội đồng bỏ phiếu. Giàn khoan đã đặt cho thứ Hai. Cồn cát phía bắc. Khoan thăm dò làm móng. Xong xuôi cả rồi." },
          { note: { en: "Gideon Marsh: council votes Friday; survey rigs on the north dunes on Monday.", vi: "Gideon Marsh: thứ Sáu hội đồng bỏ phiếu; thứ Hai giàn khoan khảo sát lên cồn cát phía bắc." }, quiet: true } ] } }] },
      },
    },
  },
  nodes: {
    // ── 16:40 TRONG XE: mỗi câu 1 khung — nhẫn trong lòng bàn tay, đáy kênh tưởng tượng, phong bì; nhẫn / thư / hồ sơ HIỆN RA, đọc được
    c1_open: [
      { cp: "c1_open" },
      { title: { ch: 1, en: "Low Water", vi: "Nước ròng" } },
      { bg: "car" }, { amb: "sea" }, { mood: "memory" },
      { shot: "act-ring-palm" }, { cam: "push", ms: 9000 },
      { n: { en: "The ring is lighter than you expected.", vi: "Chiếc nhẫn nhẹ hơn bạn tưởng." } },
      { shot: "act-ring-seabed" }, { fx: "ripple" },
      { n: { en: "For twenty years you pictured it at the bottom of the channel, crusted with barnacles, green with weed. A thing that belonged to the sea.", vi: "Hai mươi năm, bạn hình dung nó nằm dưới đáy kênh, bám đầy hà, phủ rong xanh. Một thứ đã thuộc về biển." } },
      { shot: "act-envelope" },
      { n: { en: "Instead it came in a brown envelope with a Berwick postmark, wrapped in a paper napkin, shining as if someone had polished it.", vi: "Vậy mà nó đến trong một phong bì nâu đóng dấu bưu điện Berwick, gói trong một tờ giấy ăn, sáng loáng như có ai đã đánh bóng." } },
      { n: { en: "The engraving inside is still sharp. Turn it over and look.", vi: "Mặt trong vẫn khắc rõ. Lật nhẫn lại mà xem." } },
      { item: "ring" },
      { shot: null }, { cam: null },
      { mood: "flashback" }, { cg: "cg-mem-nails" },
      { n: { en: "You don't remember your father. You remember your mother. Her nails tapping on the car window at red lights.", vi: "Bố thì bạn chẳng nhớ gì. Mẹ thì bạn nhớ: tiếng móng tay bà gõ lên kính xe mỗi lần chờ đèn đỏ;" } },
      { cg: "cg-mem-seat" },
      { n: { en: "The seat pulled right up against the wheel, so there was never room for your feet behind her. The salt on her coat when she came home from measuring the water.", vi: "cái ghế lái lúc nào cũng kéo sát vô-lăng, ngồi sau bà chẳng có chỗ để chân; vệt muối trên áo khoác bà mỗi lần đi đo nước về." } },
      { cg: null }, { mood: null }, { fx: "blur" }, { sfx: "page" },
      { shot: "act-note-fold" },
      { n: { en: "The note is four lines in black biro, capital letters pressed hard into the paper: the hand of someone who doesn't write letters.", vi: "Tờ giấy đi kèm có bốn dòng, bút bi đen, chữ in hoa ấn mạnh tới hằn giấy — nét chữ của người không quen viết thư." } },
      { item: "note", quiet: true }, { read: "note" },
      { note: { en: "The note: 'Your mother didn't drown. She has been here for twenty years. Come on the 14th, at low water. Tell no one who you are. — T.A.'", vi: "Mẩu thư: “Mẹ cháu không chết đuối. Bà ấy ở đây hai mươi năm rồi. Đến vào ngày 14, lúc nước ròng. Đừng cho ai biết cháu là ai. — T.A.”" } },
      { n: { en: "You've read it so many times the fold has split.", vi: "Bạn đọc đi đọc lại tới mức tờ giấy rách cả nếp gấp." } },
      { set: { goal: "find_ta" } },
      { think: { en: "Whoever T.A. is, they're on that island. And today is the 14th.", vi: "T.A. là ai thì cũng đang ở trên hòn đảo kia. Và hôm nay là ngày 14." } },
      { shot: null }, { look: "seat" },
      { n: { en: "On the passenger seat, under the envelope, is a grey folder with your company's logo: the life-insurance [[claim]] your aunt made in 2004.", vi: "Trên ghế phụ, dưới phong bì, là một bìa hồ sơ màu xám in logo công ty bạn: hồ sơ bồi thường bảo hiểm nhân thọ dì bạn nộp năm 2004." } },
      { n: { en: "You requested a copy in your first week at the firm. You have never been able to look at the photographs.", vi: "Bạn xin bản sao ngay tuần đầu đi làm. Phần ảnh, bạn chưa bao giờ xem nổi." } },
      { sfx: "page" }, { item: "claimfile", from: "seat" }, { look: null }, { fx: "blackout" },
      { go: "c1_causeway" },
    ],

    // ── ĐƯỜNG NGẦM: máy quay theo từng câu (đường · cọc · đảo) → dừng ở biển báo (đọc biển, lau tờ giờ) → biên bản 2004 → chòi trú nạn
    c1_causeway: [
      { bg: "causeway" }, { amb: "sea" }, { sfx: "wind" }, { clock: "16:40" },
      { n: { en: "Twenty to five. The sea has gone out so far it looks as if it has left for good.", vi: "Năm giờ kém hai mươi. Biển rút xa tới mức tưởng như đã bỏ đi hẳn." }, look: "sand" },
      { n: { en: "The [[causeway]] runs between two plains of wet sand, straight and grey, a mile and a half long.", vi: "Con đường ngầm xám, thẳng tắp, chạy giữa hai bãi cát ướt, dài gần hai cây số rưỡi." }, look: "road" },
      { n: { en: "Two rows of black posts keep watch along it, for when the water hides everything else. No railings. Nothing between your tyres and the mud.", vi: "Hai hàng cọc đen đứng canh dọc hai bên, để dẫn lối khi nước phủ kín mọi thứ khác. Không lan can. Không gì ngăn giữa bánh xe và bùn." }, look: "posts" },
      { n: { en: "Far ahead, the island lies low on the water: a ruined bell tower, a few roofs, a pale line of dunes.", vi: "Phía xa, hòn đảo nằm thấp trên mặt nước: một tháp chuông đổ nát, vài mái nhà, một dải cồn cát nhạt màu." }, look: "island" },
      { look: null },
      { n: { en: "At the start of the road, a sign in red capitals. You get out to read it.", vi: "Ở đầu đường có một tấm biển kẻ chữ in hoa màu đỏ. Bạn xuống xe đọc." } },
      { place: "c1_roadstart" },
      { think: { en: "Ten to nine. After that, the island is cut off until three in the morning.", vi: "Chín giờ kém mười. Sau đó hòn đảo bị cắt rời tới tận ba giờ sáng." } },
      { bg: "causeway" },
      { sfx: "car" },
      { n: { en: "You drive slowly. Not because you're afraid. Because you're looking for a place and you don't know where it is.", vi: "Bạn lái chậm. Không phải vì sợ. Mà vì đang tìm một chỗ mà chẳng biết nó ở đâu." }, look: "road" },
      { n: { en: "In the folder, the 2004 police report gives the place in one line.", vi: "Trong bìa hồ sơ, biên bản cảnh sát năm 2004 ghi chỗ ấy bằng đúng một dòng." } },
      { read: "report2004" }, { look: null },
      { think: { en: "Approximately midway. As if the sea had an address.", vi: "Khoảng giữa. Như thể biển có địa chỉ." } },
      { mood: "cold" }, { cg: "box-outside" }, { cam: "tilt", ms: 6000 },
      { n: { en: "Midway, there is a hut.", vi: "Giữa đường có một cái chòi." } },
      { n: { en: "It stands on four iron legs, higher than a man, white paint peeling, a rusty ladder fixed to one side.", vi: "Chòi đứng trên bốn chân sắt cao hơn đầu người, sơn trắng bong tróc, một cái thang gỉ bắt vào một bên." }, look: "legs" },
      { n: { en: "A post painted with numbers is bolted to one leg: a tide gauge. Someone has repainted two words over the door: [[REFUGE BOX]].", vi: "Một cây cọc sơn vạch số gắn vào một chân chòi: cọc đo nước. Phía trên cửa, có ai đó đã sơn lại hai chữ: REFUGE BOX." }, look: "door" },
      { note: { en: "REFUGE BOX: a shelter on the causeway.", vi: "REFUGE BOX: chòi trú nạn trên đường ngầm." }, quiet: true },
      { look: null },
      { n: { en: "A shelter for the ones who come too late, who get the water wrong.", vi: "Chỗ trú cho người tới muộn, người tính nhầm con nước." } },
      { cam: null }, { wait: 500 },
      { n: { en: "You stop the car.", vi: "Bạn dừng xe." } },
      { choice: [
        { tag: "curious", en: "(Climb up and look.)", vi: "(Leo lên xem.)", set: { climbed_box: true }, then: [{ go: "c1_box" }] },
        { tag: "careful", en: "(Drive on.)", vi: "(Lái tiếp.)", set: { climbed_box: false } },
      ] },
      { go: "c1_drive" },
    ],

    // ── TRONG CHÒI (climbed_box): ◀ ▶ 3 vách, cận cảnh dòng 06:01 (đối chiếu ở Ch4 với dòng 21:44 run)
    c1_box: [
      { cg: null }, { shot: "act-ladder" },
      { act: { kind: "swipe", r: "ladder", dir: "u", prompt: { en: "Swipe up to climb", vi: "Vuốt lên để leo" }, ok: [{ sfx: "steps" }], fail: [{ sfx: "steps" }] } },
      { n: { en: "The rungs are cold and gritty with salt. The whole hut creaks as you climb.", vi: "Bậc thang lạnh ngắt, sạn muối. Cả cái chòi kẽo kẹt theo từng bước leo." } },
      { shot: null },
      { bg: "box" }, { amb: "hut" }, { sfx: "wind" }, { fx: "particles", kind: "dust", ms: 0 },
      { n: { en: "Inside, it's as narrow as a wardrobe and smells of damp wood and salt. A bench. A hook for a lamp.", vi: "Bên trong hẹp như cái tủ áo, mùi gỗ ẩm và muối. Một băng ghế. Một cái móc treo đèn." } },
      { n: { en: "And on all four walls, from floor to roof, numbers. Written in lamp [[soot]], small and black and perfectly even.", vi: "Và trên cả bốn vách, từ sàn tới mái, là những con số. Viết bằng muội đèn, nhỏ, đen, đều tăm tắp." } },
      { place: "c1_box" },
      { n: { en: "There are hundreds of lines. Maybe thousands. Some have faded to shadows. You don't know what they mean.", vi: "Hàng trăm dòng như thế. Có lẽ hàng nghìn. Có những dòng đã mờ gần mất. Bạn không biết chúng nghĩa là gì." } },
      { n: { en: "You only know that someone has stood here on a great many nights, read the water, and written it down.", vi: "Bạn chỉ biết đã có người đứng ở đây rất nhiều đêm, đọc mực nước, rồi ghi lại." } },
      { fx: "particles-off" }, { sfx: "steps" },
      { bg: "causeway" }, { amb: "sea" },
      { go: "c1_drive" },
    ],

    c1_drive: [
      { cg: null }, { mood: null }, { bg: "causeway" }, { cam: "pull", ms: 5000 }, { sfx: "car" },
      { n: { en: "You drive on. The hut slides past in your mirror, white on grey.", vi: "Bạn lái tiếp. Cái chòi lướt qua trong gương chiếu hậu, trắng trên nền xám." }, shot: "act-mirror-hut" },
      { shot: null }, { cam: null }, { fx: "blackout" },
      { go: "c1_lantern" },
    ],

    // ── 17:10 THE LANTERN: mặt tiền (bốt điện thoại, Land Rover) · Nell (trà, chìa khoá, áo len) → told_nell · Fergus + chai TOM · chuông điện thoại
    c1_lantern: [
      { cp: "c1_lantern" }, { clock: "17:10" },
      { shot: "lantern-front" }, { amb: "sea" }, { mood: "warm" },
      { n: { en: "The Lantern is a low stone house with small windows and yellow light.", vi: "The Lantern là một ngôi nhà đá thấp, cửa sổ nhỏ, đèn vàng." } },
      { n: { en: "A phone box stands beside the porch, lit for nobody.", vi: "Cạnh hiên có một bốt điện thoại, sáng đèn mà chẳng ai dùng." }, look: "phonebox" },
      { n: { en: "In the yard beside it stands an old Land Rover, paint flaking, THE LANTERN lettered on the door.", vi: "Ngoài sân cạnh quán đỗ một chiếc Land Rover cũ, sơn tróc, cửa xe kẻ chữ THE LANTERN." }, look: "landrover" },
      { look: null }, { shot: null },
      { bg: "lantern" }, { amb: "room" }, { sfx: "door" },
      { n: { en: "Inside, the heat hits your face like a hand.", vi: "Vừa bước vào, hơi nóng đã táp vào mặt bạn như một bàn tay." } },
      { n: { en: "The woman behind the bar looks up before the door has swung shut behind you.", vi: "Người phụ nữ sau quầy ngẩng lên trước cả khi cánh cửa khép lại sau lưng bạn." } },
      { show: "nell", at: "c", face: "smile" }, { meet: "nell" },
      { say: "nell", tone: "brisk and warm, fussing over a cold guest, a little teasing", en: "You'll be the insurance. Look at you, you're blue. Sit down, [[pet]].", easy: "You're from the insurance company. You look cold. Sit down.", vi: "Chắc cháu là người bên bảo hiểm. Nhìn cháu xem, tím tái cả rồi. Ngồi xuống đi cháu." },
      { n: { en: "She's in her sixties, grey hair cut short, sleeves pushed to the elbow, moving like someone who has never once had help.", vi: "Bà ngoài sáu mươi, tóc bạc cắt ngắn, tay áo xắn tới khuỷu, làm gì cũng thoăn thoắt, như người cả đời chưa có ai đỡ một tay." }, on: "nell" },
      { sfx: "kettle" },
      { pic: "cg-nell-tea", n: { en: "Before your coat is off, there's a mug of tea in front of you and a hot-water bottle in your hands. Then a brass key on a wooden tag.", vi: "Bạn chưa kịp cởi áo khoác thì đã có một cốc trà trước mặt, một túi chườm nóng trong tay, và một chiếc chìa khóa đồng buộc thẻ gỗ." }, on: "nell" },
      { item: "roomkey" },
      { say: "nell", tone: "busy and cheerful, rattling off instructions", en: "Room three, top of the stairs. The radiator bangs — ignore it. If the bar's empty, I'm down the [[cellar]] swearing at a barrel.", easy: "Room three is upstairs. If I'm not at the bar, I'm in the cellar.", vi: "Phòng ba, đầu cầu thang. Lò sưởi kêu ầm ầm, kệ nó. Quầy mà vắng thì là bác đang ở dưới hầm chửi cái thùng bia." },
      { say: "nell", tone: "practical and kind, mothering", en: "And put this on. The wind here goes through a coat like it's paper.", vi: "Mặc thêm cái này vào. Gió ở đây xuyên áo khoác như xuyên giấy." },
      { item: "jumper" },
      { say: "nell", tone: "softer and wistful, a catch in her voice at the end", en: "My boy's, from when he was a lad. Raised him upstairs, I did. I never threw it out. You don't, do you?", easy: "It was my son's when he was young. I brought him up here, upstairs. I kept it.", vi: "Áo thằng con bác hồi nó mới lớn. Bác nuôi nó ngay trên lầu này đấy. Bác không nỡ vứt. Mấy thứ ấy ai nỡ vứt, cháu nhỉ?" },
      { n: { en: "You put it on. The sleeves are a little short. You don't mind.", vi: "Bạn mặc vào. Tay áo hơi ngắn. Bạn không để tâm." }, pic: "act-jumper" },
      { choice: [
        { tag: "honest", en: "(Tell her who you are.)", vi: "(Nói thật mình là ai.)", set: { told_nell: true }, add: { nell: 1 }, then: [
          { say: "me", en: "My name's {name}. Anna Rowe was my mother.", vi: "Tôi tên là {name}. Anna Rowe là mẹ tôi." },
          { show: "nell", at: "c", face: "surprised" }, { wait: 700 },
          { pic: "cg-nell-hug", n: { en: "For a moment Nell doesn't move at all. Then she comes round the bar and holds you, hard, smelling of soap and beer.", vi: "Một thoáng, Nell đứng sững. Rồi bà vòng ra khỏi quầy và ôm chặt lấy bạn, người thoang thoảng mùi xà phòng và bia." }, on: "nell" },
          { say: "nell", tone: "shocked, then very gentle, close to tears", en: "Oh, pet. Oh, you poor thing. Twenty years.", face: "sad", vi: "Ôi, cháu ơi. Tội nghiệp cháu. Hai mươi năm rồi." },
          { n: { en: "Over her shoulder, you see an old man at the end of the bar watching. He doesn't say anything.", vi: "Qua vai bà, bạn thấy một ông già ở cuối quầy đang nhìn. Ông không nói gì." } } ] },
        { tag: "guarded", en: "(Keep your cover.)", vi: "(Giữ vỏ bọc.)", set: { told_nell: false }, then: [
          { say: "me", tone: "guarded, answering a little too quickly", en: "I'm just here about a [[claim]]. The causeway.", vi: "Tôi chỉ đến vì một hồ sơ bồi thường. Liên quan tới đường ngầm." },
          { say: "nell", tone: "knowing and dry, with a sad little laugh", en: "Course you are. Everyone's here about the causeway, one way or another.", easy: "Of course. Everyone here talks about the causeway.", vi: "Ừ, chắc rồi. Ai tới đây mà chẳng vì đường ngầm, cách này hay cách khác." } ] },
      ] },
      { show: "nell", at: "c" },
      { n: { en: "She dries a glass that is already dry.", vi: "Bà lau một cái ly vốn đã khô." }, on: "nell" },
      { say: "nell", tone: "proud but tired", quote: "nell_tom", en: "My brother's the keeper. Forty years. Tom Ashby. You'll want a word with him, I expect.", easy: "My brother Tom Ashby looks after the causeway. You'll want to talk to him.", vi: "Anh trai bác gác đường ngầm. Bốn mươi năm rồi. Tom Ashby. Chắc cháu sẽ muốn gặp." },
      { say: "nell", tone: "worried, lowering her voice", en: "He's poorly, pet. I took him his soup at one and he never touched it. Don't tire him out.", easy: "He's ill. I took him soup at one o'clock and he didn't eat it.", vi: "Ông ấy yếu lắm, cháu ạ. Lúc một giờ trưa bác mang súp sang mà ông ấy không động thìa. Đừng làm ông ấy mệt nhé." },
      { say: "nell", tone: "fond exasperation", en: "Don't bother with a mobile, he won't carry one. Says the sea doesn't ring ahead. There's the house phone, if he hears it.", easy: "He has no mobile phone. Ring his house phone.", vi: "Đừng mất công gọi di động, ông ấy chả chịu mang. Bảo biển có gọi báo trước bao giờ. Có máy bàn ở nhà đấy, nếu ông ấy nghe thấy." },
      { hide: "nell" },
      { fx: "heartbeat" }, { wait: 500 },
      { think: { en: "T.A. … Tom Ashby?", vi: "T.A. … Tom Ashby?" } },
      { sfx: "glass" },
      { n: { en: "You put your mug down before it starts to rattle.", vi: "Bạn đặt cốc xuống, kẻo tay run làm nó khua lách cách." } },
      { go: "c1_fergus" },
    ],

    // ── FERGUS VÀ CHAI TOM (tự chạy) · chuông quầy reo hai hồi, Nell nghe từ dưới hầm → rồi TỰ ĐI quanh quầy (held_bottle)
    c1_fergus: [
      { n: { en: "At the end of the bar an old man sits on a high stool as if it had been built around him.", vi: "Ở cuối quầy, một ông già ngồi trên chiếc ghế cao, như thể người ta đóng cái ghế quanh ông." } },
      { show: "fergus", at: "c" }, { meet: "fergus" },
      { n: { en: "Eighty, maybe more. Woolly hat, half a pint, eyes that have stopped expecting new stories.", vi: "Tám mươi, có khi hơn. Mũ len, nửa vại bia, đôi mắt đã thôi chờ chuyện mới." }, on: "fergus" },
      { say: "fergus", tone: "dry, sardonic, unimpressed old man", en: "Insurance. Aye. You'll be wanting to insure the sea, then. Good luck.", easy: "Insurance? So you want to insure the sea? Good luck.", vi: "Bảo hiểm. Ờ. Thế cháu định bảo hiểm cho cả biển à? Chúc may mắn." },
      { n: { en: "He tips his chin at the shelf behind the bar, at one bottle with a hand-written label.", vi: "Ông hất cằm về phía kệ sau quầy, về một cái chai có nhãn viết tay." }, on: "fergus", pic: "act-label-clean" },
      { say: "fergus", tone: "sharp warning, protective", en: "That's Tom's. Nobody touches that. Not even the vicar.", vi: "Chai của Tom đấy. Không ai được đụng vào. Đến ông mục sư cũng không." },
      { say: "fergus", tone: "slow and matter-of-fact, quieter on the last words", quote: "fergus_flask", en: "Fills his flask from it before he goes home. Every night for forty years. I do the pouring these days. His hands.", easy: "Every night he fills his flask from that bottle. Now I pour it for him. His hands shake.", vi: "Tom rót đầy bình bẹt từ chai đó rồi mới về. Tối nào cũng thế, bốn mươi năm nay. Dạo này ông rót hộ. Tại cái tay Tom ấy." },
      { say: "fergus", tone: "gruff but affectionate", en: "Half, mind. He's not the head for a full one these days.", easy: "Only half a flask. A full one is too much for him now.", vi: "Nửa bình thôi, nhớ đấy. Dạo này lão chả chịu nổi cả bình đâu." },
      { note: { en: "The TOM bottle: a clean, flat paper label, fat black felt-tip capitals.", vi: "Chai TOM: nhãn giấy phẳng, sạch, chữ in hoa to bằng bút dạ đen." }, quiet: true },
      { note: { en: "Fergus pours Tom's flask from the TOM bottle every night — half a flask, these days.", vi: "Tối nào Fergus cũng rót bình cho Tom từ chai TOM — dạo này chỉ nửa bình." }, quiet: true },
      { hide: "fergus" },
      { title: { en: "5:30 p.m.", vi: "17:30" } }, { clock: "17:30" },
      { sfx: "phone" }, { wait: 900 }, { sfx: "phone" }, { wait: 400 },
      { n: { en: "Behind the bar the phone rings. Twice. Then it stops.", vi: "Sau quầy, điện thoại reo. Hai hồi chuông. Rồi im bặt." }, pic: "act-handset" },
      { n: { en: "Nell is nowhere to be seen. The cellar hatch behind the bar stands open, and her voice comes up through it.", vi: "Không thấy Nell đâu. Nắp hầm sau quầy đang mở, và giọng bà vọng lên từ dưới đó." }, pic: "act-hatch-open" },
      { say: "nell", tone: "on the telephone, brisk and distracted", en: "Lantern? … No, pet, we're full Friday.", vi: "The Lantern đây. … Không cháu ạ, thứ Sáu hết phòng rồi." },
      { show: "fergus", at: "c" },
      { n: { en: "Fergus doesn't look up from his pint.", vi: "Fergus vẫn cúi nhìn vại bia, không ngẩng lên." }, on: "fergus" },
      { show: "nell", at: "c" },
      { n: { en: "When Nell comes back up, she nods at him.", vi: "Lúc Nell trở lên, bà hất đầu về phía ông." }, on: "nell" },
      { say: "nell", tone: "teasing, affectionate", en: "He's not shifted since we opened. Have you, Fergus?", easy: "He hasn't moved since we opened.", vi: "Ông ấy ngồi lì từ lúc quán mở cửa tới giờ. Phải không, Fergus?" },
      { show: "fergus", at: "c" },
      { say: "fergus", tone: "deadpan grumble", en: "Nowt to shift for.", easy: "There's nothing to move for.", vi: "Có gì đâu mà phải nhích." },
      { hide: "*" },
      { n: { en: "Nell goes back to her barrels. For a few minutes, the bar is yours.", vi: "Nell quay về với mấy thùng bia. Vài phút, cả quầy là của bạn." } },
      { place: "c1_bar" },
      // BẢNG ĐIỀU TRA nhỏ: người chơi tự nối “T.A.” với Tom Ashby (trước đây truyện nói hộ) + biết Tom tối nào cũng tới quán
      { n: { en: "You go up to room three, sit on the bed, and lay it all out: the note, and what you've heard downstairs.", vi: "Bạn lên phòng ba, ngồi xuống giường, bày hết ra: mẩu thư, và những gì vừa nghe dưới nhà." } },
      { board: { q: { en: "Who wrote the note — and where will you find him?", vi: "Ai viết mẩu thư — và tìm ông ấy ở đâu?" },
        links: [
          { id: "ta", ids: ["note", "q:nell_tom"], label: { en: "'T.A.' is Tom Ashby — Nell's brother, the causeway keeper.", vi: "“T.A.” là Tom Ashby — anh trai Nell, người gác đường ngầm." }, set: { ta_tom: true } },
          { id: "comes", ids: ["q:nell_tom", "q:fergus_flask"], label: { en: "Tom comes into The Lantern every night for his flask. He'll be here tonight.", vi: "Tối nào Tom cũng tới The Lantern lấy bình rượu. Đêm nay ông sẽ tới." } },
        ], need: 2, hint: { en: "Look at the signature on the note. Whose name did Nell say?", vi: "Nhìn chữ ký trên mẩu thư. Nell vừa nhắc tên ai?" },
        ok: [{ think: { en: "Tom Ashby wrote to me. And tonight he'll walk through that door.", vi: "Tom Ashby đã viết cho mình. Và tối nay ông sẽ bước qua cánh cửa kia." } }],
        fail: [{ think: { en: "T.A. Tom Ashby. It has to be. He'll be in for his flask tonight.", vi: "T.A. Tom Ashby. Chỉ có thể là ông ấy. Tối nay ông sẽ tới lấy bình rượu." } }] } },
      { set: { goal: "wait_tom" } },
      { go: "c1_island" },
    ],

    // ── ĐI QUANH ĐẢO: 5 chỗ lân cận, bấm người để nói chuyện (thứ tự tùy người chơi)
    c1_island: [
      { cp: "c1_island" }, { clock: "17:40" },
      { bg: "village" },
      { mood: null }, { amb: "sea" }, { sfx: "door" }, { sfx: "gulls" },
      { n: { en: "Tom won't be in for hours. You leave your bag in room three and go back out. The island is small enough to walk before dark.", vi: "Còn mấy tiếng nữa Tom mới tới. Bạn để túi trong phòng ba rồi ra ngoài. Hòn đảo nhỏ, đi bộ một vòng là kịp trước khi trời tối." } },
      { think: { en: "Thirty-one people. One of them signed my note. The others will want to know who I am.", vi: "Ba mươi mốt con người. Một người đã ký mẩu thư của mình. Những người còn lại sẽ muốn biết mình là ai." } },
      { place: "c1_island" },
      { go: "c1_evening" },
    ],

    // ── 18:00 NƯỚC ĐỔI CHIỀU · 19:50 BẾN: Gideon – Tom · 20:00 Tom vào quán
    c1_evening: [
      { title: { en: "6:00 p.m.", vi: "18:00" } }, { clock: "18:00" },
      { bg: "causeway" }, { cam: "sway", ms: 8000 },
      { n: { en: "Six o'clock. The sea starts to come back. Not wave by wave: it's as if someone is slowly pulling a grey sheet across the sand.", vi: "Sáu giờ. Biển bắt đầu quay về. Không phải từng đợt sóng một, mà như có ai chậm rãi kéo một tấm vải xám phủ qua bãi cát." }, look: "sand" },
      { look: null }, { cam: null },
      { bg: "harbour" }, { amb: "harbour" }, { mood: "night" }, { clock: "19:50" },
      { n: { en: "By the time you walk down to the harbour the sky has cleared completely.", vi: "Khi bạn đi bộ xuống bến, trời đã quang hẳn." } },
      { n: { en: "A hard wind blows off the land, and the moon, almost full, lays a white road across the water.", vi: "Gió thổi mạnh từ đất liền ra, và vầng trăng gần rằm trải một con đường trắng trên mặt nước." }, look: "moon" },
      { look: null }, { cg: "harbour-lamp" },
      { n: { en: "Ten to eight. Voices under the lamp on the quay: Gideon, and an old man so thin his coat still seems to be on its hanger.", vi: "Tám giờ kém mười. Có tiếng người dưới ngọn đèn ở bến: Gideon, và một ông già gầy tới mức chiếc áo khoác như vẫn còn treo trên mắc." } },
      { cg: null }, { sfx: "steps" },
      { show: "gideon", at: "l", face: "cold" },
      { say: "gideon", tone: "strained and pleading, anger under his breath", en: "Friday will finish me, Tom.", easy: "Friday will ruin me, Tom.", vi: "Thứ Sáu này là tôi sạt nghiệp đấy, ông Tom." },
      { show: "tom", at: "r", face: "cold" }, { meet: "tom" },
      { say: "tom", tone: "cold, flat, final", en: "Then be finished.", vi: "Thì cứ việc sạt nghiệp." },
      { pic: "cg-gideon-tom", n: { en: "Neither of them raises his voice. Gideon turns away.", vi: "Không ai lớn tiếng. Gideon quay đi." } },
      { hide: "*" },
      { wait: 800 }, { sfx: "wind" },
      { n: { en: "A few minutes later you hear his engine on the causeway, fading towards the mainland.", vi: "Vài phút sau, tiếng máy xe ông vọng lại từ con đường ngầm, nhỏ dần về phía đất liền." }, shot: "act-taillights" },
      { shot: null },
      { title: { en: "8:00 p.m.", vi: "20:00" } }, { clock: "20:00" },
      { bg: "lantern" }, { amb: "pub" }, { mood: "warm" },
      { n: { en: "Eight o'clock. The Lantern is so full you wonder if all thirty-one people on the island are here.", vi: "Tám giờ. The Lantern đông tới mức bạn ngờ cả ba mươi mốt người trên đảo đều ở đây." } },
      { sfx: "door" }, { sfx: "wind" },
      { n: { en: "The door opens. The wind comes in, then an old grey dog, then him.", vi: "Cửa mở. Gió lùa vào trước, rồi một con chó già lông xám, rồi đến ông." } },
      { show: "tom", at: "c" },
      { n: { en: "Tom Ashby has to duck under the ship's bell above the door. He hangs his coat on the pegs by the door.", vi: "Tom Ashby phải cúi đầu né quả chuông tàu treo trên khung cửa. Ông treo áo khoác lên hàng móc cạnh cửa." }, on: "tom", pic: "act-bell-duck" },
      { n: { en: "Then he walks slowly to the bar, like a man stepping onto a boat in a swell. Someone pulls out a chair for him.", vi: "Rồi ông chậm rãi đi về phía quầy, như người bước lên thuyền giữa sóng lừng. Có người kéo ghế cho ông." }, on: "tom" },
      { sfx: "glass" },
      { n: { en: "Before he has even sat down, Nell has poured a glass from the bottle marked TOM.", vi: "Nell đã rót một ly từ chai dán nhãn TOM trước khi ông kịp ngồi." }, pic: "act-bottle-hand" },
      { n: { en: "He looks around the room, the way old men look around a room they know by heart.", vi: "Ông đưa mắt nhìn quanh quán một lượt, kiểu các ông già vẫn nhìn quanh một căn phòng đã thuộc lòng." }, on: "tom" },
      { cam: "push", ms: 4000 },
      { mood: "noir" }, { fx: "spotlight" },
      { n: { en: "Then he looks at you.", vi: "Rồi ông nhìn bạn." }, on: "tom" },
      { n: { en: "One second too long. Long enough to see that his eyes are pale grey, the colour of the water this afternoon. Long enough to see that he knows.", vi: "Lâu hơn bình thường một giây. Đủ để bạn thấy mắt ông màu xám nhạt, màu nước biển chiều nay. Đủ để bạn thấy ông biết." }, on: "tom" },
      { cam: null }, { mood: "warm" },
      { hide: "tom" },
      { pic: "cg-tom-pass", n: { en: "Later, on his way to the gents, he passes your table. He doesn't stop. He doesn't bend down.", vi: "Lát sau, trên đường ra nhà vệ sinh, ông đi ngang bàn bạn. Không dừng. Không cúi xuống." } },
      { sfx: "steps" }, { fx: "heartbeat" },
      { say: "tom", tone: "whispering, urgent and secretive", en: "Not here. My cottage. Ten o'clock.", whisper: true, face: "soft", vi: "Không nói ở đây. Nhà tôi. Mười giờ tối." },
      { note: { en: "Tom Ashby: 'Not here. My cottage. Ten o'clock.'", vi: "Tom Ashby: “Không nói ở đây. Nhà tôi. Mười giờ tối.”" } },
      { set: { goal: "cottage" } },
      { go: "c1_bell" },
    ],

    // ── 20:50 CHUÔNG: Nell rung chuông, đường đóng — mà đường vẫn khô. Mắt thẩm định: bảng giờ ↔ con đường
    c1_bell: [
      { cp: "c1_bell" },
      { title: { en: "8:50 p.m.", vi: "20:50" } }, { clock: "20:50" },
      { amb: "pub" }, { mood: "warm" },
      { n: { en: "Ten to nine.", vi: "Chín giờ kém mười." } },
      { cg: "cg-bell" }, { cam: "tilt", ms: 6000 },
      { n: { en: "Nell climbs onto the step by the door to reach the rope of the ship's bell.", vi: "Nell bước lên bậc cạnh cửa mới với tới dây chuông tàu." } },
      { sfx: "bell" }, { fx: "pulse" }, { wait: 600 }, { sfx: "bell" }, { fx: "pulse" }, { wait: 600 }, { sfx: "bell" }, { fx: "pulse" }, { wait: 900 },
      { amb: "room" },
      { n: { en: "She pulls it three times, and the whole pub goes quiet out of habit, as it has every tide for two hundred years.", vi: "Bà giật dây ba lần, và cả quán lặng đi theo thói quen, như vẫn thế mỗi con nước suốt hai trăm năm nay." } },
      { say: "nell", tone: "solemn and ominous", en: "That's the causeway closed. Nobody leaves tonight.", easy: "The causeway is closed now. Nobody can leave tonight.", vi: "Thế là đường ngầm đóng rồi. Đêm nay không ai đi đâu được nữa." },
      { cg: null }, { cam: null },
      { sfx: "glass" },
      { amb: "pub" },
      { n: { en: "Someone laughs. Someone raises a glass.", vi: "Có người cười. Có người nâng ly." } },
      { mood: "cold" }, { amb: "sea" },
      { bg: "causeway" }, { fx: "zoomout" },
      { n: { en: "You look out of the window. Between the black posts the road is still there, pale and bone dry.", vi: "Bạn nhìn ra cửa sổ. Giữa hai hàng cọc đen, con đường ngầm vẫn còn đó, nhợt nhạt, khô rang." }, look: "road" },
      { look: null }, { bg: "lantern" },
      { show: "fergus", at: "c" },
      { say: "fergus", tone: "dry, ominous, low", en: "Tables always [[play it safe]]. Sea doesn't.", easy: "The tide tables are always careful. The sea isn't.", vi: "Bảng giờ bao giờ chẳng trừ hao. Biển thì không." },
      { hide: "fergus" },
      // MẮT THẨM ĐỊNH (trước: compare “tìm chữ bị sửa” — không hợp, người chơi khó hiểu): nhìn con đường khô rồi tự trả lời
      { bg: "causeway" }, { look: "road" },
      { quiz: { key: "c1_eye", pass: 1, reveal: false, qs: [
        { q: { en: "Assessor's eye. The bell says the causeway is closed. What's wrong with that?", vi: "Mắt thẩm định. Chuông báo đường ngầm đã đóng. Có gì không ổn?" },
          opts: ["The road is still dry: the sea is lower than the printed table.", "The bell rang an hour early.", "Someone has moved the black posts."], a: 0 } ],
        ok: [{ think: { en: "The table says the road is closed. The road hasn't heard.", vi: "Bảng giờ nói đường đã đóng. Con đường thì chưa hay biết." } }],
        fail: [{ think: { en: "Look again. The bell says closed. The road is still bone dry.", vi: "Nhìn lại đi. Chuông bảo đã đóng. Con đường vẫn khô rang." } }] } },
      { look: null },
      { bg: "causeway" }, { cam: "push", ms: 8000 },
      { n: { en: "Far out in the middle, the white hut stands alone on its four iron legs.", vi: "Xa tít ở giữa, cái chòi trắng đứng một mình trên bốn chân sắt." }, look: "hut" },
      { fx: "ripple" }, { wait: 600 },
      { think: { en: "She has been here for twenty years.", vi: "Bà ấy ở đây hai mươi năm rồi." } },
      { look: null }, { cam: null }, { bg: "lantern" }, { mood: "warm" },
      { n: { en: "You pull the sleeve of the jumper down over your wrist. The grey darning is rough against your skin. Warm.", vi: "Bạn kéo tay áo len xuống che cổ tay. Mũi mạng xám cọ vào da, thô ráp. Ấm." }, pic: "act-cuff" },
      { wait: 800 }, { mood: null },
      // DỰNG LẠI (kiểu Golden Idol): người chơi tự điền lại điều đã biết — nắm chắc tình tiết trước Chương 2
      { theory: { key: "c1_theory", title: { en: "Before ten o'clock: what do you know?", vi: "Trước mười giờ: bạn biết những gì?" }, near: 1, tries: 4, giveUp: true,
        lines: [
          { en: "The note was signed by [who], the causeway keeper.", vi: "Mẩu thư do [who], người gác đường ngầm, ký." },
          { en: "Nell rang the bell at [shut]: the causeway is closed. But the road was still [road].", vi: "Nell rung chuông lúc [shut]: đường ngầm đã đóng. Nhưng con đường vẫn [road]." },
          { en: "Tom wants to see you at [where], at [when].", vi: "Tom muốn gặp bạn ở [where], lúc [when]." } ],
        kinds: { who: { en: "Person", vi: "Người" }, shut: { en: "Bell", vi: "Giờ chuông" }, when: { en: "Meeting", vi: "Giờ hẹn" }, road: { en: "Road", vi: "Mặt đường" }, where: { en: "Place", vi: "Nơi" } },
        answer: { who: "tom", shut: "t2050", road: "dry", where: "cottage", when: "t2200" },
        words: [
          { id: "tom", en: "Tom Ashby", kind: "who" }, { id: "fergus", en: "Fergus", kind: "who" }, { id: "gideon", en: "Gideon Marsh", kind: "who" }, { id: "callum", en: "Callum", kind: "who" },
          { id: "t2050", en: "8:50", vi: "20:50", kind: "shut" }, { id: "t0305", en: "3:05", vi: "3:05", kind: "shut" }, { id: "t1640", en: "4:40", vi: "16:40", kind: "shut" },
          { id: "dry", en: "bone dry", vi: "khô rang", kind: "road" }, { id: "flooded", en: "under water", vi: "ngập nước", kind: "road" },
          { id: "cottage", en: "his cottage", vi: "nhà ông", kind: "where" }, { id: "box", en: "the refuge box", vi: "chòi trú nạn", kind: "where" }, { id: "harbour", en: "the harbour", vi: "bến thuyền", kind: "where" },
          { id: "t2200", en: "ten o'clock", vi: "mười giờ tối", kind: "when" }, { id: "t2100", en: "nine o'clock", vi: "chín giờ tối", kind: "when" } ],
        ok: [{ think: { en: "Ten o'clock. Tom's cottage. Whatever he knows, I'll hear it tonight.", vi: "Mười giờ. Nhà Tom. Ông biết gì, đêm nay mình sẽ nghe." } }],
        fail: [{ think: { en: "Tom Ashby. His cottage, at ten. The road was still dry when the bell rang.", vi: "Tom Ashby. Nhà ông, lúc mười giờ. Chuông rung rồi mà con đường vẫn khô." } }] } },
      { end: "c1_end" },
    ],
  },

  endings: {
    c1_end: { ch: 1, title: { en: "Low Water", vi: "Nước ròng" },
      sum: { en: "The bell has rung. The road is still dry. Tom Ashby is waiting at ten.", vi: "Chuông đã rung. Con đường vẫn khô. Tom Ashby hẹn bạn lúc mười giờ." },
      text: { en: "Ten to nine. The causeway is closed, and nobody leaves the island tonight — not you, not whoever wrote 'T.A.' Tom Ashby has asked you to his cottage at ten. Outside, between the black posts, the road is still bone dry.", vi: "Chín giờ kém mười. Đường ngầm đã đóng, đêm nay không ai rời đảo được — cả bạn lẫn người đã ký “T.A.”. Tom Ashby hẹn bạn tới nhà lúc mười giờ. Bên ngoài, giữa hai hàng cọc đen, con đường vẫn khô rang." },
      next: "c2_open", nextTitle: { en: "Chapter 2", vi: "Chương 2" } },
  },
});
