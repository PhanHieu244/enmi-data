// THE STATEMENT — CHƯƠNG 3 “Witness” (Ngày 3). Trọng tâm tiếng: THÌ HIỆN TẠI HOÀN THÀNH ↔ QUÁ KHỨ ĐƠN, câu tường thuật.
// Cơ chế: khám phá hành lang bệnh viện · vạch lời khai Ellie (present) · khoá số ngăn kéo Finch (lock) · so băng gốc ↔ biên bản (compare)
//   · suy luận áo vàng (deduce) · cuộc gọi đến (call) · phong bì dưới cửa (cg) · chọn: đưa Ruth / đốt / giữ.
StoryEngine.chapter({
  items: {
    ticket: { icon: "doc", name: { en: "Car park ticket", vi: "Vé gửi xe" }, desc: { en: "Found on the dashboard of Ellie's car: 'GULL POINT CAR PARK — TUE 23:41'. This Tuesday.", vi: "Trên bảng táp-lô xe của Ellie: “BÃI XE GULL POINT — THỨ BA 23:41”. Thứ Ba tuần này." } },
    finch_tape: { icon: "phone", name: { en: "Finch's tape", vi: "Cuộn băng của Finch" }, desc: { en: "An interview tape from two years ago. A boy called Lewis, 15, arrested at Gull Point.", vi: "Băng ghi âm thẩm vấn hai năm trước. Một cậu bé tên Lewis, 15 tuổi, bị bắt ở Gull Point." } },
    finch_note: { icon: "doc", name: { en: "Finch's note", vi: "Mẩu giấy của Finch" }, desc: { en: "In shaky handwriting: 'The rest of the tapes are where the gulls sleep. I'm sorry, Lewis.'", vi: "Nét chữ run run: “Số băng còn lại ở nơi lũ mòng biển ngủ. Ta xin lỗi, Lewis.”" } },
    finch_report: { icon: "doc", name: { en: "Finch's death report", vi: "Báo cáo cái chết của Finch" }, desc: { en: "'Accidental drowning, north pier, 14 October.' Signed: DS Owen Price. A photo of the pier that night: a figure in a yellow oilskin.", vi: "“Chết đuối do tai nạn, cầu tàu phía bắc, 14 tháng 10.” Ký tên: Trung sĩ Owen Price. Một tấm ảnh cầu tàu đêm đó: một bóng người mặc áo vải dầu vàng." } },
    letter: { icon: "doc", name: { en: "Envelope", vi: "Phong bì" }, desc: { en: "No name, no stamp. 'A good detective knows what to leave out.' Inside: a photo of Sam at a lighthouse window.", vi: "Không tên, không tem. “Một thám tử giỏi biết điều gì nên bỏ qua.” Bên trong: ảnh Sam đứng bên cửa sổ một ngọn hải đăng." } },
  },
  truths: {
    T6: { name: { en: "The pen", vi: "Ngòi bút" }, text: { en: "Harold Finch changed children's statements on purpose. 'They took our phones' became 'I gave them my phone'. Victims became criminals.", vi: "Harold Finch cố ý sửa lời khai của bọn trẻ. “Họ lấy điện thoại của tụi cháu” thành “Tôi đưa điện thoại cho họ”. Nạn nhân biến thành tội phạm." } },
    T8: { name: { en: "The nurse", vi: "Cô y tá" }, text: { en: "Ellie Shaw stitches up the Gull Point kids off the books. And she has been taking food to Sam.", vi: "Ellie Shaw khâu vết thương cho bọn trẻ Gull Point mà không ghi sổ. Và cô vẫn mang đồ ăn cho Sam." } },
    T9: { name: { en: "The yellow coat", vi: "Chiếc áo vàng" }, text: { en: "The figure in yellow on the pier wore an oilskin from the Marta — the empty hook. Anyone who saw him would think it was Tom.", vi: "Bóng người áo vàng trên cầu tàu mặc áo vải dầu lấy từ tàu Marta — chính cái móc trống. Ai nhìn thấy cũng sẽ tưởng là Tom." } },
  },
  words: {
    "since": { vi: "từ (khi) — đi với thì hiện tại hoàn thành", ex: "I haven't been there since the summer." },
    "stitches": { vi: "mũi khâu (vết thương)", ex: "Someone gave him six stitches." },
    "off the books": { vi: "không ghi sổ, ngoài sổ sách", ex: "She treated them off the books." },
    "records": { vi: "hồ sơ lưu trữ", ex: "The records room is in the basement." },
    "drawer": { vi: "ngăn kéo", ex: "The drawer is locked." },
    "transcript": { vi: "bản ghi lời (từ băng)", ex: "Compare the tape with the transcript." },
    "envelope": { vi: "phong bì", ex: "An envelope under the door." },
    "leave out": { vi: "bỏ qua, không đưa vào", ex: "Don't leave anything out." },
    "car park": { vi: "bãi đỗ xe (Anh-Anh; Anh-Mỹ: parking lot)", ex: "The ticket is from the car park." },
    "drown": { vi: "chết đuối", ex: "He drowned off the north pier." },
  },

  recap: [
    { ch: 3, t: { en: "Day 3. Someone had stitched Danny's arm two weeks ago — but there was no hospital record. Ruth sent you to A&E.", vi: "Ngày 3. Có người đã khâu tay cho Danny hai tuần trước — nhưng bệnh viện không có hồ sơ. Ruth cử bạn đến khoa cấp cứu." } },
    { ch: 3, if: s => s.f.c3_caught_lie, t: { en: "Ellie said she hadn't been to Gull Point since the summer. Her car park ticket said Tuesday night.", vi: "Ellie nói từ mùa hè chưa đến Gull Point. Vé gửi xe của cô ghi tối thứ Ba." } },
    { ch: 3, if: s => s.f.c3_ellie === "kind", t: { en: "You spoke to Ellie gently. In the stairwell, she cried — and told you the truth about Sam.", vi: "Bạn nói chuyện nhẹ nhàng với Ellie. Ở cầu thang, cô bật khóc — và nói thật về Sam." } },
    { ch: 3, if: s => s.f.c3_ellie === "press", t: { en: "You pushed Ellie hard. She asked for a lawyer and said nothing more.", vi: "Bạn ép Ellie quá mạnh. Cô đòi luật sư và không nói gì thêm." } },
    { ch: 3, if: s => s.truth("T6"), t: { en: "In the records room, you compared an old tape with Finch's typed statement. He had changed the boy's words — again and again.", vi: "Trong phòng lưu hồ sơ, bạn so một cuộn băng cũ với biên bản Finch đánh máy. Ông đã sửa lời cậu bé — hết lần này tới lần khác." } },
    { ch: 3, if: s => s.has("finch_report"), t: { en: "Finch's 'accidental' drowning report was signed by Owen.", vi: "Báo cáo về cái chết “do tai nạn” của Finch do Owen ký." } },
    { ch: 3, if: s => s.f.c3_tell_ruth === "yes", t: { en: "You told Ruth about Owen. She already suspected him. You now have an ally.", vi: "Bạn kể với Ruth về Owen. Bà đã nghi từ trước. Giờ bạn có một đồng minh." } },
    { ch: 3, if: s => s.f.c3_call === "warn", t: { en: "Maggie called you late at night: 'Don't trust Owen.' Then she hung up.", vi: "Maggie gọi bạn lúc khuya: “Đừng tin Owen.” Rồi cúp máy." } },
    { ch: 3, t: { en: "An envelope under your door: 'A good detective knows what to leave out.' Inside, a photo of Sam at a lighthouse window.", vi: "Một phong bì dưới cửa: “Một thám tử giỏi biết điều gì nên bỏ qua.” Bên trong là ảnh Sam bên cửa sổ một ngọn hải đăng." } },
    { ch: 3, if: s => s.f.c3_letter === "ruth", t: { en: "You took the letter straight to Ruth.", vi: "Bạn mang lá thư đến thẳng chỗ Ruth." } },
    { ch: 3, if: s => s.f.c3_letter === "burn", t: { en: "You burned the letter. You kept the photo.", vi: "Bạn đốt lá thư. Giữ lại tấm ảnh." } },
    { ch: 3, if: s => s.f.c3_letter === "keep", t: { en: "You kept the letter to yourself.", vi: "Bạn giữ lá thư cho riêng mình." } },
  ],

  flow: [
    { ch: 3, row: 0, id: "c3_hosp", kind: "cp", scene: "hospital", label: { en: "A&E", vi: "Khoa cấp cứu" }, sum: { en: "The nurse who stitches without records.", vi: "Cô y tá khâu vết thương không ghi sổ." } },
    { ch: 3, row: 1, kind: "opt", key: "c3_ellie", val: "kind", label: { en: "Gentle", vi: "Nhẹ nhàng" }, sum: { en: "Ellie told you about Sam.", vi: "Ellie kể cho bạn về Sam." }, hint: { en: "She's scared, not guilty.", vi: "Cô sợ, chứ không có tội." } },
    { ch: 3, row: 1, kind: "opt", key: "c3_ellie", val: "press", label: { en: "Pressure", vi: "Gây sức ép" }, sum: { en: "Ellie asked for a lawyer.", vi: "Ellie đòi luật sư." } },
    { ch: 3, row: 2, id: "c3_arch", kind: "cp", scene: "archive", label: { en: "Finch's files", vi: "Hồ sơ của Finch" }, sum: { en: "A dead man's drawer.", vi: "Ngăn kéo của một người đã chết." } },
    { ch: 3, row: 3, kind: "opt", key: "c3_tell_ruth", val: "yes", label: { en: "Tell Ruth about Owen", vi: "Kể Ruth về Owen" }, sum: { en: "Ruth has been watching Owen for a year.", vi: "Ruth đã theo dõi Owen cả năm nay." } },
    { ch: 3, row: 3, kind: "opt", key: "c3_tell_ruth", val: "no", label: { en: "Keep it quiet", vi: "Im lặng" }, sum: { en: "You trust no one.", vi: "Bạn không tin ai." } },
    { ch: 3, row: 4, id: "c3_night", kind: "cp", scene: "street", label: { en: "The envelope", vi: "Phong bì" }, sum: { en: "Someone knows where you live.", vi: "Có người biết bạn sống ở đâu." } },
    { ch: 3, row: 5, kind: "opt", key: "c3_letter", val: "ruth", label: { en: "Show Ruth", vi: "Đưa Ruth" } },
    { ch: 3, row: 5, kind: "opt", key: "c3_letter", val: "burn", label: { en: "Burn it", vi: "Đốt đi" } },
    { ch: 3, row: 5, kind: "opt", key: "c3_letter", val: "keep", label: { en: "Keep it", vi: "Giữ lại" } },
    { ch: 3, row: 6, id: "c3_ally", kind: "end", label: { en: "Two pens", vi: "Hai ngòi bút" } },
    { ch: 3, row: 6, id: "c3_alone", kind: "end", label: { en: "Alone", vi: "Một mình" } },
  ],

  nodes: {
    c3: [
      { title: { ch: 3, en: "Witness", vi: "Nhân chứng" } },
      { bg: "office" },
      { show: "ruth", at: "c" },
      { say: "ruth", en: "Danny had six [[stitches]] in his arm. Two weeks old. Neat work — a professional. But no hospital has a record.", easy: "Danny had stitches in his arm. A professional did them. But there is no hospital record.", vi: "Danny có sáu mũi khâu ở tay. Hai tuần tuổi. Khâu gọn — dân chuyên. Nhưng không bệnh viện nào có hồ sơ." },
      { say: "ruth", en: "A&E has a nurse who works nights. Ellie Shaw. People say she helps kids who can't go to a doctor. Go and talk to her.", vi: "Khoa cấp cứu có một y tá làm ca đêm. Ellie Shaw. Người ta nói cô hay giúp những đứa trẻ không đi khám được. Đi nói chuyện với cô ấy." },
      { if: s => s.f.c2_sam === "told" || s.f.c2_sam === "known", then: [
        { say: "ruth", face: "soft", en: "And take Sam's photo. If Danny went to her, maybe Sam did too.", vi: "Và mang ảnh Sam theo. Nếu Danny tìm cô ấy, có lẽ Sam cũng vậy." } ] },
      { hide: "*" },
      { go: "c3_hosp" },
    ],

    c3_hosp: [
      { cp: "c3_hosp" },
      { bg: "hospital" }, { amb: "hall" },
      { n: { en: "8 a.m. A&E is full: a man with a cut hand, a crying baby, a drunk asleep on three chairs.", vi: "8 giờ sáng. Khoa cấp cứu chật kín: một người đàn ông đứt tay, một em bé đang khóc, một kẻ say ngủ trên ba chiếc ghế." } },
      { n: { en: "Ellie's shift ends in twenty minutes. You have time to look around first.", vi: "Hai mươi phút nữa Ellie hết ca. Bạn có thời gian quan sát trước." } },
      { explore: { goal: { en: "Find out more about Ellie before you talk", vi: "Tìm hiểu về Ellie trước khi nói chuyện" }, need: 1, done: { en: "Go and find Ellie", vi: "Đi tìm Ellie" },
        spots: [
          { id: "rota", x: 22, y: 30, label: { en: "Staff rota", vi: "Lịch trực" }, clue: true, then: [
            { n: { en: "The nurses' rota. 'E. SHAW — nights, Mon to Thu.' Tuesday night she wasn't on shift — she swapped with someone.", vi: "Lịch trực điều dưỡng. “E. SHAW — ca đêm, thứ Hai đến thứ Năm.” Tối thứ Ba cô không trực — cô đổi ca với ai đó." } } ] },
          { id: "car", x: 80, y: 40, label: { en: "Staff car park (window)", vi: "Bãi xe nhân viên (qua cửa sổ)" }, clue: true, then: [
            { n: { en: "Through the window: a small blue car with a hospital parking badge. 'E. SHAW'. A paper ticket on the dashboard.", vi: "Qua cửa sổ: một chiếc xe nhỏ màu xanh có thẻ đỗ xe bệnh viện. “E. SHAW”. Một tấm vé giấy trên bảng táp-lô." } },
            { n: { en: "You go outside and read it through the glass. 'GULL POINT CAR PARK — TUE 23:41.'", vi: "Bạn ra ngoài và đọc qua lớp kính. “BÃI XE GULL POINT — THỨ BA 23:41.”" }, pic: "act-ticket" },
            { item: "ticket" } ] },
          { id: "bin", x: 50, y: 58, label: { en: "Supply cupboard", vi: "Tủ vật tư" }, then: [
            { n: { en: "A note taped inside: 'Whoever keeps taking the suture kits — PLEASE sign for them.'", vi: "Một tờ giấy dán bên trong: “Ai cứ lấy bộ dụng cụ khâu — LÀM ƠN ký nhận giùm.”" } },
            { think: { en: "Someone is stitching people outside the hospital.", vi: "Có người đang khâu vết thương cho ai đó bên ngoài bệnh viện." } } ] },
        ] } },
      { show: "ellie", at: "c" },
      { say: "ellie", en: "You're police? I've got five minutes. I've been on my feet for twelve hours, so — quickly, please.", vi: "{Cc} là cảnh sát à? Tôi có năm phút. Tôi đứng suốt mười hai tiếng rồi, nên — nhanh giúp nhé." },
      { say: "me", en: "A boy called Danny Reece. Nineteen. Someone stitched his arm two weeks ago.", vi: "Một cậu tên Danny Reece. Mười chín tuổi. Hai tuần trước có người khâu tay cho cậu ấy." },
      { say: "ellie", face: "angry", en: "Lots of people come through here.", vi: "Nhiều người qua đây lắm." },
      { present: {
        title: { en: "Ellie Shaw — what she says", vi: "Ellie Shaw — lời cô nói" },
        goal: { en: "Two of these sentences are lies. Tap a sentence, then show the evidence.", vi: "Hai câu trong số này là nói dối. Chạm vào câu, rồi đưa bằng chứng." },
        segs: [
          { t: { en: "I've worked at Halden General for three years.", vi: "Tôi đã làm ở Bệnh viện Halden ba năm rồi." } },
          { t: { en: "I haven't been to Gull Point since the summer.", vi: "Từ mùa hè tới giờ tôi chưa đến Gull Point." }, bad: true, evidence: "ticket",
            fix: { en: "I went to Gull Point on Tuesday night.", vi: "Tối thứ Ba tôi đã đến Gull Point." },
            ok: [
              { say: "me", en: "'Since the summer'? Your car was in the Gull Point car park on Tuesday at 11:41 p.m.", vi: "“Từ mùa hè”? Xe của cô ở bãi Gull Point lúc 11 giờ 41 tối thứ Ba." },
              { say: "ellie", face: "angry", en: "…I went for a walk. It's a free country.", vi: "…Tôi đi dạo. Đây là đất nước tự do mà." },
              { set: { c3_caught_lie: 1, ellie_lie: 1 } } ] },
          { t: { en: "Kids get hurt all the time round here.", vi: "Quanh đây trẻ con bị thương suốt." } },
          { t: { en: "I've never met anyone called Danny.", vi: "Tôi chưa từng gặp ai tên Danny." }, bad: true, evidence: "pm_report",
            fix: { en: "I stitched Danny's arm two weeks ago.", vi: "Hai tuần trước tôi khâu tay cho Danny." },
            ok: [
              { say: "me", en: "Six stitches. The report says it was a professional job — the kind A&E nurses do.", vi: "Sáu mũi. Biên bản ghi là khâu rất chuyên nghiệp — kiểu y tá cấp cứu hay làm." },
              { say: "ellie", face: "crying", en: "Stop. Please. Not here.", vi: "Thôi. Làm ơn. Đừng ở đây." },
              { set: { c3_danny: 1 } } ] },
          { t: { en: "If I knew something, I'd have told the police.", vi: "Nếu biết gì, tôi đã báo cảnh sát rồi." } },
        ],
        sign: { en: "Enough", vi: "Đủ rồi" },
        wrong: [{ say: "ellie", en: "That's true. Check if you want.", vi: "Câu đó là thật. Muốn thì cứ kiểm tra." }],
        noEvidence: [{ think: { en: "Something's wrong with that sentence — but that's not the proof.", vi: "Câu đó có gì sai — nhưng đây không phải bằng chứng." } }],
      } },
      { if: s => s.f.c3_caught_lie || s.f.c3_danny, then: [
        { n: { en: "Ellie looks at the door. At the people in the waiting room. Then at you.", vi: "Ellie nhìn ra cửa. Nhìn những người trong phòng chờ. Rồi nhìn bạn." }, on: "ellie" },
        { choice: [
          { tag: "kind", en: "Let's talk somewhere quiet. I'm not here to arrest you.", vi: "Ta ra chỗ nào yên tĩnh nói chuyện. Tôi không đến để bắt cô.", set: { c3_ellie: "kind" }, add: { ellie: 2 }, then: [{ go: "c3_stairs" }] },
          { tag: "press", en: "Lying to the police is a crime, Ms Shaw. Start talking.", vi: "Nói dối cảnh sát là phạm tội, cô Shaw. Nói đi.", set: { c3_ellie: "press" }, add: { ellie: -2 }, then: [
            { say: "ellie", face: "angry", en: "Then arrest me. And get me a lawyer. I'm not saying another word.", vi: "Vậy thì bắt tôi đi. Và gọi luật sư cho tôi. Tôi không nói thêm câu nào nữa." },
            { hide: "ellie" } ] },
        ] } ],
        else: [
        { set: { c3_ellie: "press" } },
        { say: "ellie", en: "Are we done? Good.", vi: "Xong chưa? Tốt." },
        { hide: "ellie" } ] },
      { go: "c3_arch" },
    ],

    c3_stairs: [
      { bg: "hospital" }, { hide: "*" },
      { cg: "cg-ellie" },
      { n: { en: "The fire stairs. Ellie sits on a step and covers her mouth with both hands. For a long time, she just breathes.", vi: "Cầu thang thoát hiểm. Ellie ngồi xuống bậc thang, hai tay che miệng. Một lúc lâu cô chỉ thở." } },
      { cg: null },
      { show: "ellie", at: "c", face: "crying" },
      { say: "ellie", en: "They can't go to a doctor. A doctor asks for a name, an address. Then the police come, and the police… write things down.", vi: "Tụi nhỏ không đi khám được. Bác sĩ sẽ hỏi tên, địa chỉ. Rồi cảnh sát tới, và cảnh sát thì… ghi chép." },
      { say: "ellie", en: "I've seen what they write. A boy says 'they hit me', and the paper says 'I fell'.", vi: "Tôi từng thấy họ ghi gì. Một đứa nói “họ đánh cháu”, còn tờ giấy ghi “cháu bị ngã”." },
      { if: s => s.has("sam_photo"), then: [
        { choice: [
          { tag: "kind", en: "(Show her Sam's photo.) He's my brother.", vi: "(Đưa cô ảnh Sam.) Đây là em trai tôi.", add: { ellie: 1 }, then: [
            { say: "ellie", face: "relief", en: "…You've got his eyes.", vi: "…{Cc} có đôi mắt giống nó." },
            { say: "ellie", en: "He's alive. He's hurt his ankle, but he's alive. I take him food. Bread, painkillers, batteries for his torch.", vi: "Nó còn sống. Bị đau mắt cá chân, nhưng còn sống. Tôi mang đồ ăn cho nó. Bánh mì, thuốc giảm đau, pin cho đèn pin." },
            { fx: "whiteout" },
            { truth: "T8" },
            { say: "ellie", face: "angry", en: "And I'm not telling you where. Not yet. He made me promise. He's terrified of police — and he's right to be.", vi: "Và tôi sẽ không nói ở đâu. Chưa đâu. Nó bắt tôi hứa. Nó sợ cảnh sát lắm — mà nó sợ là đúng." },
            { set: { ellie_sam: 1 } } ] },
          { tag: "lead", en: "So you've been helping the kids at Gull Point.", vi: "Vậy là cô đã giúp bọn trẻ ở Gull Point.", then: [
            { say: "ellie", en: "Someone has to. Nobody else has.", vi: "Phải có ai làm chứ. Chưa có ai làm cả." } ] },
        ] } ] },
      { say: "ellie", en: "If you want to know who writes those lies, look in your own station. Look for a man called Finch.", vi: "Muốn biết ai viết những lời dối trá đó thì tìm ngay trong đồn {cc}. Tìm một người tên Finch." },
      { note: { en: "Ellie: 'Look for a man called Finch.'", vi: "Ellie: “Tìm một người tên Finch.”" } },
      { hide: "*" },
      { go: "c3_arch" },
    ],

    c3_arch: [
      { cp: "c3_arch" },
      { bg: "archive" }, { amb: "room" }, { mood: "noir" },
      { n: { en: "2 p.m. The records room under the station. Metal shelves, cardboard boxes, the smell of dust and old paper.", vi: "2 giờ chiều. Phòng lưu hồ sơ dưới tầng hầm đồn. Kệ sắt, thùng các-tông, mùi bụi và giấy cũ." } },
      { meet: "finch" },
      { n: { en: "A desk in the corner still has a name plate: 'H. FINCH — STATEMENTS'. Thirty years of other people's words passed across this desk.", vi: "Chiếc bàn ở góc vẫn còn biển tên: “H. FINCH — LỜI KHAI”. Ba mươi năm lời nói của người khác đi qua chiếc bàn này." } },
      { n: { en: "The bottom drawer has a small combination lock. Four numbers. On the wall above, an old calendar — October, last year. One date circled in red.", vi: "Ngăn kéo dưới cùng có khoá số nhỏ. Bốn chữ số. Trên tường là tờ lịch cũ — tháng Mười năm ngoái. Một ngày khoanh đỏ." }, pic: "act-calendar" },
      { lock: { prompt: { en: "The circled date is 9 October. British dates: day first, then month.", vi: "Ngày khoanh đỏ là 9 tháng 10. Người Anh viết ngày trước, tháng sau." }, kind: "digits", answer: "0910",
        hints: [{ en: "Two numbers for the day, two for the month.", vi: "Hai số cho ngày, hai số cho tháng." }, { en: "0 9 … 1 0", vi: "0 9 … 1 0" }], giveUp: [{ n: { en: "You find a screwdriver and force the drawer. It's not pretty.", vi: "Bạn tìm được cái tua vít và cạy ngăn kéo. Chẳng đẹp đẽ gì." } }] } },
      { n: { en: "Inside: a cassette tape and a folded note.", vi: "Bên trong: một cuộn băng cassette và một mẩu giấy gấp." }, pic: "act-drawer" },
      { item: "finch_tape" }, { item: "finch_note" },
      { n: { en: "You find the old player on a shelf and press PLAY. A boy's voice, two years ago. Then the typed statement Finch filed the same day.", vi: "Bạn tìm thấy máy phát cũ trên kệ và bấm PLAY. Giọng một cậu bé, hai năm trước. Rồi bản biên bản đánh máy Finch nộp cùng ngày." }, pic: "act-tape" },
      { compare: {
        title: { en: "Lewis, 15 — tape vs. statement", vi: "Lewis, 15 tuổi — băng ghi âm và biên bản" },
        left: { title: { en: "Tape", vi: "Băng gốc" }, lines: [
          { en: "They found me at the bus station.", vi: "Họ tìm thấy cháu ở bến xe." },
          { en: "They took our phones when we got there.", vi: "Tới nơi là họ lấy điện thoại của tụi cháu." },
          { en: "We packed boxes every night.", vi: "Đêm nào tụi cháu cũng đóng thùng." },
          { en: "I couldn't leave. I owed them money.", vi: "Cháu không đi được. Cháu nợ tiền họ." },
          { en: "A man hit me when I said no.", vi: "Có người đánh cháu khi cháu nói không." },
          { en: "I want to go home.", vi: "Cháu muốn về nhà." },
        ] },
        right: { title: { en: "Finch's statement", vi: "Biên bản của Finch" }, lines: [
          { en: "They found me at the bus station.", vi: "Họ tìm thấy tôi ở bến xe." },
          { en: "I gave them my phone when we got there.", vi: "Tới nơi tôi đưa điện thoại cho họ." },
          { en: "We packed boxes every night.", vi: "Đêm nào chúng tôi cũng đóng thùng." },
          { en: "I chose to stay. I was paid well.", vi: "Tôi chọn ở lại. Tôi được trả lương hậu." },
          { en: "I fell and hurt my face.", vi: "Tôi bị ngã và đau mặt." },
          { en: "I want to go home.", vi: "Tôi muốn về nhà." },
        ] },
        diffs: [1, 3, 4], tries: 4, key: "c3_cmp",
        ok: [{ think: { en: "Three changes in six lines. Every one turns a victim into a volunteer.", vi: "Sáu dòng, ba chỗ sửa. Chỗ nào cũng biến nạn nhân thành kẻ tự nguyện." } }],
        fail: [{ think: { en: "You missed some. But you've seen enough to feel sick.", vi: "Bạn bỏ sót vài chỗ. Nhưng thấy chừng ấy đã đủ buồn nôn." } }],
      } },
      { truth: "T6" },
      { think: { en: "Thirty years at this desk. How many children? How many 'I fell'?", vi: "Ba mươi năm ở chiếc bàn này. Bao nhiêu đứa trẻ? Bao nhiêu câu “tôi bị ngã”?" } },
      { think: { en: "And now this is your job. You are the new Finch.", vi: "Và giờ đây là công việc của bạn. Bạn là Finch mới." } },
      { fx: "shiver" },
      { n: { en: "Under the drawer, taped to the wood: a thin report. Finch's own death.", vi: "Dưới đáy ngăn kéo, dán băng dính vào gỗ: một bản báo cáo mỏng. Về cái chết của chính Finch." } },
      { item: "finch_report" },
      { n: { en: "'Accidental drowning, north pier, 14 October.' Five days after the circled date. Signed: DS Owen Price.", vi: "“Chết đuối do tai nạn, cầu tàu phía bắc, 14 tháng 10.” Năm ngày sau ngày khoanh đỏ. Ký tên: Trung sĩ Owen Price." } },
      { n: { en: "A photo of the pier that night is clipped to it. At the edge of the picture, half in the fog, a figure in a yellow oilskin.", vi: "Kèm theo là ảnh cầu tàu đêm đó. Ở rìa bức ảnh, nửa người khuất trong sương, một bóng người mặc áo vải dầu vàng." } },
      { deduce: { q: { en: "Who wears a yellow oilskin on the pier — and why does everyone think it's Tom?", vi: "Ai mặc áo vải dầu vàng trên cầu tàu — và vì sao ai cũng tưởng là Tom?" },
        a: [["hook", "finch_report"]], hint: { en: "Where do yellow oilskins hang in a row — with one missing?", vi: "Áo vải dầu vàng treo thành hàng ở đâu — và thiếu một chiếc?" },
        missing: { en: "You need something from the pier on the first night.", vi: "Bạn cần một thứ từ cầu tàu đêm đầu tiên." },
        ok: [{ truth: "T9" }, { think: { en: "The empty hook on the Marta. Someone borrows Tom's coat — and becomes Tom, in the fog.", vi: "Chiếc móc trống trên tàu Marta. Ai đó mượn áo của Tom — và trong sương, hắn trở thành Tom." } }],
        fail: [{ think: { en: "A yellow coat. Every fisherman has one. It means nothing — yet.", vi: "Một chiếc áo vàng. Ngư dân nào chẳng có. Chưa nói lên gì — tạm thời." } }] } },
      { mood: null },
      { show: "ruth", at: "c" },
      { say: "ruth", en: "Find anything down here?", vi: "Tìm được gì dưới này không?" },
      { choice: [
        { tag: "direct", en: "Finch's death report. Owen signed it. And Finch was changing statements.", vi: "Báo cáo cái chết của Finch. Owen ký. Và Finch từng sửa lời khai.", set: { c3_tell_ruth: "yes" }, add: { ruth: 1 }, then: [
          { if: s => (+s.f.ruth || 0) >= 2, then: [
            { say: "ruth", face: "cold", en: "Close the door.", vi: "Đóng cửa lại." },
            { say: "ruth", en: "I've been watching Owen Price for a year. I couldn't prove anything. Finch was going to help me. Then Finch drowned.", vi: "Tôi theo dõi Owen Price cả năm nay rồi. Không chứng minh được gì. Finch định giúp tôi. Rồi Finch chết đuối." },
            { say: "ruth", face: "soft", en: "From now on, you report to me. Only me.", vi: "Từ giờ {cc} chỉ báo cáo với tôi. Chỉ tôi thôi." },
            { set: { ally: 2 } } ],
            else: [
            { say: "ruth", face: "cold", en: "Owen signs a lot of things. That's not proof. Be careful who you say that to.", vi: "Owen ký nhiều thứ lắm. Chưa phải bằng chứng. Cẩn thận khi nói câu đó với ai." } ] } ] },
        { tag: "lie", en: "Just dust.", vi: "Chỉ có bụi.", set: { c3_tell_ruth: "no" }, add: { lie: 1 }, then: [
          { say: "ruth", en: "Mm. Dust doesn't usually make people go that pale.", vi: "Ừm. Bụi thường không làm người ta tái mặt thế đâu." } ] },
      ] },
      { hide: "*" },
      { go: "c3_night" },
    ],

    c3_night: [
      { cp: "c3_night" },
      { bg: "street" }, { amb: "rain" }, { mood: "night" },
      { n: { en: "11:40 p.m. Rain. The street outside your room is empty except for one parked car with its lights off.", vi: "11 giờ 40 đêm. Mưa. Con phố trước phòng bạn vắng tanh, chỉ có một chiếc xe đỗ, tắt đèn." } },
      { if: s => s.f.c2_ask === "private", then: [
        { call: { from: "maggie", ring: 9,
          accept: [
            { say: "maggie", phone: true, whisper: true, en: "Pet, it's Maggie. I can't talk long. Don't trust Owen. Whatever he tells you. Don't—", vi: "Cưng, Maggie đây. Tôi không nói lâu được. Đừng tin Owen. Hắn nói gì cũng đừng. Đừng—" },
            { sfx: "buzz" },
            { n: { en: "The line goes dead.", vi: "Đầu dây tắt ngấm." } },
            { set: { c3_call: "warn" } }, { add: { maggie: 1 } } ],
          decline: [{ n: { en: "You let it ring. Maggie's name glows on the screen, then goes dark.", vi: "Bạn để chuông reo. Tên Maggie sáng lên trên màn hình, rồi tắt." } }, { set: { c3_call: "missed" } }],
        } } ] },
      { sfx: "knock" },
      { n: { en: "A sound at your door. Not a knock — paper, sliding across the floor.", vi: "Có tiếng động ở cửa. Không phải tiếng gõ — mà tiếng giấy trượt trên sàn." } },
      { cg: "cg-letter" },
      { n: { en: "A white envelope. No name, no stamp. One typed line: 'A good detective knows what to [[leave out]].'", vi: "Một phong bì trắng. Không tên, không tem. Một dòng đánh máy: “Một thám tử giỏi biết điều gì nên bỏ qua.”" } },
      { cg: "cg-lighthouse" },
      { n: { en: "And a photo. Grainy, taken from far away. An old white lighthouse on a cliff. At the top window, a young man in a dark hoodie.", vi: "Và một tấm ảnh. Nhoè hạt, chụp từ rất xa. Một ngọn hải đăng trắng cũ trên vách đá. Ở cửa sổ trên cùng, một chàng trai mặc áo hoodie tối màu." } },
      { fx: "heartbeat" },
      { think: { en: "Sam.", vi: "Sam." } },
      { think: { en: "They know where he is. They know where you are. And they want you to know that.", vi: "Chúng biết nó ở đâu. Chúng biết bạn ở đâu. Và chúng muốn bạn biết điều đó." } },
      { cg: null },
      { item: "letter" },
      { n: { en: "You run to the window. The parked car's lights come on. It drives away slowly — as if it has all the time in the world.", vi: "Bạn chạy tới cửa sổ. Đèn chiếc xe đỗ bật sáng. Nó chầm chậm lăn bánh — như thể có cả thế giới thời gian." } },
      { choice: [
        { en: "Call Ruth. Now.", vi: "Gọi Ruth. Ngay bây giờ.", set: { c3_letter: "ruth" }, add: { ruth: 1 }, then: [
          { say: "ruth", phone: true, en: "Don't touch it again. I'm coming over. And lock your door.", vi: "Đừng chạm vào nó nữa. Tôi qua ngay. Và khoá cửa lại." } ] },
        { tag: "lie", en: "(Burn the letter. Keep the photo. Tell no one.)", vi: "(Đốt lá thư. Giữ tấm ảnh. Không nói với ai.)", set: { c3_letter: "burn" }, add: { lie: 1 }, then: [
          { n: { en: "The paper curls in the sink. The words go last: '…what to leave out.'", vi: "Tờ giấy quăn lại trong bồn rửa. Mấy chữ cháy sau cùng: “…điều gì nên bỏ qua.”" } },
          { fx: "particles", kind: "embers", ms: 3500 } ] },
        { en: "(Keep it. Think. Decide tomorrow.)", vi: "(Giữ lại. Suy nghĩ. Mai quyết.)", set: { c3_letter: "keep" } },
      ] },
      { mood: null },
      { if: s => s.f.c3_tell_ruth === "yes" && (+s.f.ruth || 0) >= 3, then: [{ end: "c3_ally" }], else: [{ end: "c3_alone" }] },
    ],
  },

  endings: {
    c3_ally: { ch: 3, next: "c4", nextTitle: { en: "Chapter 4 — The Benefactor", vi: "Chương 4 — Ân nhân" }, title: { en: "Two Pens", vi: "Hai ngòi bút" },
      sum: { en: "Ruth is on your side. Someone else knows where Sam is.", vi: "Ruth đứng về phía bạn. Kẻ khác cũng biết Sam ở đâu." },
      text: { en: "Finch's pen wrote lies for thirty years. Now there are two pens in Port Halden that refuse to. It may not be enough.", vi: "Ngòi bút của Finch viết lời dối suốt ba mươi năm. Giờ Port Halden có hai ngòi bút không chịu làm thế. Có thể vẫn chưa đủ." } },
    c3_alone: { ch: 3, next: "c4", nextTitle: { en: "Chapter 4 — The Benefactor", vi: "Chương 4 — Ân nhân" }, title: { en: "Alone", vi: "Một mình" },
      sum: { en: "You trust no one — and someone is watching you.", vi: "Bạn không tin ai — và có kẻ đang theo dõi bạn." },
      text: { en: "A dead man's drawer, a nurse's secret, a photo of your brother. You are holding all of it alone, and the town is very quiet.", vi: "Ngăn kéo của một người đã chết, bí mật của một cô y tá, tấm ảnh em trai bạn. Bạn ôm tất cả một mình, và thị trấn thì im lặng đến lạ." } },
  },
});
