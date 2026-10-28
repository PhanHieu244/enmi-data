// THE STATEMENT — CHƯƠNG 1 (+ mở đầu) “Lost for Words” (định dạng: tools/games/_lib/story/README.md; kịch bản: docs/games/the-statement-KICH-BAN.md)
// Người dùng chốt 28/10: mọi nhân vật cùng 1 nước, nói 1 thứ tiếng (thứ tiếng đang học — tiếng Anh trước); đổi thứ tiếng học thì cốt truyện
// KHÔNG đổi (chỉ thêm bản lời thoại). Vai: THÁM TỬ TẬP SỰ. Tiếng Anh RÕ RÀNG, không tiếng lóng. Trọng tâm: điều tra + suy luận.
// Lời thoại: en (tự nhiên) · easy (dễ hơn, chỉ câu khó) · vi (nghĩa). Lời dẫn: theo ngôn ngữ gốc. [[từ]] = từ trong sổ từ vụ án.
StoryEngine.chapter({
  items: {
    phone: { icon: "phone", name: { en: "Your phone", vi: "Điện thoại của bạn" }, desc: { en: "Battery 31%. It has a torch.", vi: "Pin 31%. Có đèn pin." } },
    sam_photo: { icon: "photo", name: { en: "Photo of Sam", vi: "Ảnh của Sam" }, desc: { en: "Your little brother Sam, 19. He left home four months ago. His last postcard came from Port Halden.", vi: "Em trai bạn, Sam, 19 tuổi. Bỏ nhà đi bốn tháng trước. Tấm bưu thiếp cuối cùng gửi từ Port Halden." } },
    watch: { icon: "clock", name: { en: "Stopped watch", vi: "Đồng hồ đã dừng" }, desc: { en: "A cheap plastic watch on the victim's thin, young wrist. It stopped at 1:47.", vi: "Đồng hồ nhựa rẻ tiền trên cổ tay gầy, trẻ của nạn nhân. Dừng lúc 1:47." } },
    id_card: { icon: "card", name: { en: "ID card", vi: "Thẻ căn cước" }, desc: { en: "Pete Nolan, 34. A big man with a thick red beard.", vi: "Pete Nolan, 34 tuổi. Người to lớn, râu đỏ rậm." } },
    trainer: { icon: "shoe", name: { en: "White trainer", vi: "Chiếc giày trắng" }, desc: { en: "A small white trainer with bright green laces. Size 8. Found on the steps.", vi: "Chiếc giày thể thao trắng nhỏ, dây xanh lá. Cỡ 8. Tìm thấy trên bậc thang." } },
    hook: { icon: "doc", name: { en: "Empty hook", vi: "Móc áo trống" }, desc: { en: "On the Marta, a row of yellow oilskins. One hook is empty.", vi: "Trên tàu Marta, một hàng áo vải dầu vàng. Một cái móc trống." } },
    leg_it: { icon: "doc", name: { en: "Owen's story", vi: "Lời kể của Owen" }, desc: { en: "Owen says Tom Ward shouted 'Run!' at the pub during the argument.", vi: "Owen nói Tom Ward hét “Chạy đi!” ở quán lúc cãi nhau." } },
    jim_note: { icon: "doc", name: { en: "Jim's words", vi: "Lời của Jim" }, desc: { en: "Jim: Tom and Pete argued about money. Nobody shouted 'Run!'. Pete flew home to Ireland this morning.", vi: "Jim: Tom và Pete cãi nhau chuyện tiền. Không ai hét “Chạy đi!”. Pete bay về Ireland sáng nay." } },
    notes: { icon: "pen", name: { en: "Your notebook", vi: "Sổ tay của bạn" }, desc: { en: "Everything the witness said tonight, written down by you.", vi: "Mọi điều nhân chứng nói đêm nay, do chính bạn ghi lại." } },
    voicemail: { icon: "phone", name: { en: "Voice message", vi: "Tin nhắn thoại" }, desc: { en: "'Don't go back to Gull Point tonight. They know. The van comes Thursday, four a.m.'", vi: "“Tối nay đừng về Gull Point. Chúng nó biết rồi. Xe tải đến thứ Năm, 4 giờ sáng.”" } },
  },

  truths: {
    T1: { name: { en: "'Run!'", vi: "“Chạy đi!”" }, text: { en: "Owen says Tom shouted 'Run!' in an argument about money. That makes no sense — unless someone shouted it on the pier, to someone running away.", vi: "Owen nói Tom hét “Chạy đi!” trong một trận cãi nhau về tiền. Thật vô lý — trừ khi ai đó hét câu ấy trên cầu tàu, với một người đang chạy trốn." } },
    T2: { name: { en: "Danny", vi: "Danny" }, text: { en: "Kieran knew the green laces: they belong to Danny. The dead boy is not Pete Nolan.", vi: "Kieran nhận ra dây giày xanh: của Danny. Người chết không phải Pete Nolan." } },
    T3: { name: { en: "Gull Point", vi: "Gull Point" }, text: { en: "Kieran sleeps at Gull Point, an old fish factory where nobody is supposed to live. He is terrified someone will find out.", vi: "Kieran ngủ ở Gull Point, xưởng cá cũ lẽ ra không ai ở. Cậu sợ có người biết." } },
    T4: { name: { en: "Sam", vi: "Sam" }, text: { en: "Kieran knows your brother Sam. Sam was here, tonight.", vi: "Kieran biết em trai bạn, Sam. Đêm nay Sam đã ở đây." } },
  },

  words: {
    "pier": { vi: "cầu tàu", ex: "The body was found under the pier." },
    "harbour": { vi: "bến cảng", ex: "The harbour is full of fishing boats." },
    "deckhand": { vi: "thuỷ thủ (làm việc trên boong tàu)", ex: "He works as a deckhand on a fishing boat." },
    "witness": { vi: "nhân chứng", ex: "The witness saw two men arguing." },
    "sheet": { vi: "tấm vải (phủ)", ex: "The body was under a white sheet." },
    "beard": { vi: "râu (quai nón)", ex: "He has a thick red beard." },
    "trainer": { vi: "giày thể thao (Anh-Anh; Anh-Mỹ: sneaker)", ex: "A white trainer was on the steps." },
    "laces": { vi: "dây giày", ex: "His trainers have green laces." },
    "torch": { vi: "đèn pin (Anh-Anh; Anh-Mỹ: flashlight)", ex: "Use your phone's torch." },
    "hook": { vi: "cái móc", ex: "One hook was empty." },
    "cctv": { vi: "camera giám sát", ex: "The CCTV camera was pointing at the sky." },
    "knuckles": { vi: "khớp ngón tay", ex: "His knuckles were red." },
    "oilskin": { vi: "áo vải dầu (áo mưa ngư dân)", ex: "Fishermen wear yellow oilskins." },
    "splash": { vi: "tiếng (nước) ùm, tõm", ex: "I heard a splash." },
    "leading question": { vi: "câu hỏi dẫn dắt (gợi sẵn câu trả lời)", ex: "That's a leading question." },
    "statement": { vi: "lời khai / biên bản lời khai", ex: "Read the statement before you sign it." },
    "evidence": { vi: "bằng chứng", ex: "We need evidence, not opinions." },
    "arrest": { vi: "bắt giữ", ex: "They arrested him at dawn." },
    "argue": { vi: "cãi nhau (bằng lời)", ex: "They argued about money." },
    "trainee": { vi: "tập sự", ex: "She is a trainee detective." },
  },

  // ───────── TÓM TẮT THEO NHÁNH ─────────
  recap: [
    { ch: 0, t: { en: "Six days from now, a lawyer holds up a statement with your signature: is it word for word what the witness said?", vi: "Sáu ngày nữa, một luật sư giơ biên bản có chữ ký của bạn: đây có đúng từng chữ nhân chứng đã nói?" } },
    { ch: 1, t: { en: "You are a trainee detective, new in the port town of Port Halden. Secretly, you came to find your brother Sam, missing for four months.", vi: "Bạn là thám tử tập sự, mới về thị trấn cảng Port Halden. Lý do thầm kín: tìm em trai Sam, mất liên lạc bốn tháng." } },
    { ch: 1, when: "c1_pier", t: { en: "3 a.m.: a body under the north pier. The wallet says Pete Nolan, a deckhand. DS Owen Price already blames his captain, Tom Ward.", vi: "3 giờ sáng: một thi thể dưới cầu tàu phía bắc. Ví ghi Pete Nolan, thuỷ thủ. Trung sĩ Owen Price đã đổ cho thuyền trưởng Tom Ward." } },
    { ch: 1, if: s => s.has("trainer"), t: { en: "With your phone's torch, you found a small white trainer with green laces on the steps.", vi: "Nhờ đèn pin điện thoại, bạn thấy một chiếc giày trắng nhỏ dây xanh trên bậc thang." } },
    { ch: 1, if: s => s.f.doubt_id, t: { en: "You worked it out: a 34-year-old with a red beard does not have the thin wrist of a teenager. The body is not Pete.", vi: "Bạn suy ra: người 34 tuổi râu đỏ không có cổ tay gầy như thiếu niên. Thi thể không phải Pete." } },
    { ch: 1, if: s => s.f.heard_run, t: { en: "Owen says Tom shouted 'Run!' at the pub.", vi: "Owen kể Tom hét “Chạy đi!” ở quán." } },
    { ch: 1, if: s => s.f.detour === "car", t: { en: "You rode with the witness, Kieran. Away from the police, he asked if he could trust you. His wristband said '14·02'.", vi: "Bạn đi cùng xe với nhân chứng Kieran. Xa cảnh sát, cậu hỏi có tin được bạn không. Vòng tay ghi “14·02”." } },
    { ch: 1, if: s => s.f.detour === "stay", t: { en: "You stayed on the pier — and saw Owen secretly turn the CCTV camera back down.", vi: "Bạn ở lại cầu tàu — và thấy Owen lén xoay camera chĩa xuống lại." } },
    { ch: 1, if: s => s.f.detour === "pub", t: { en: "At The Anchor, Jim said Tom and Pete argued about money, Pete flew home this morning — and nobody shouted 'Run!'.", vi: "Ở The Anchor, Jim kể Tom và Pete cãi nhau chuyện tiền, Pete bay về sáng nay — và không ai hét “Chạy đi!”." } },
    { ch: 1, if: s => s.f.owen_lied, t: { en: "You proved Owen's story about the pub was false. Why would he lie?", vi: "Bạn chứng minh lời kể của Owen về quán rượu là sai. Vì sao anh ta nói dối?" } },
    { ch: 1, if: s => s.f.push === "away", t: { en: "You wrote down exactly what Kieran said: the man in yellow 'pushed him away'.", vi: "Bạn ghi đúng lời Kieran: người áo vàng “đẩy anh ấy ra”." } },
    { ch: 1, if: s => s.f.push === "in", t: { en: "You wrote that the man in yellow pushed the victim 'into the water' — words Kieran never said.", vi: "Bạn ghi người áo vàng đẩy nạn nhân “xuống nước” — điều Kieran chưa từng nói." } },
    { ch: 1, if: s => s.f.objected, t: { en: "You stopped Owen's leading question. Ruth backed you. Owen did not forget it.", vi: "Bạn chặn câu hỏi dẫn dắt của Owen. Ruth đứng về phía bạn. Owen thì nhớ chuyện đó." } },
    { ch: 1, if: s => s.f.saw_danny, t: { en: "Shown the trainer, Kieran whispered: 'That's Danny's.' The dead boy is not Pete.", vi: "Thấy chiếc giày, Kieran thì thầm: “Của Danny.” Người chết không phải Pete." } },
    { ch: 1, if: s => s.f.told_sam, t: { en: "You told Ruth — and Owen — about your brother Sam.", vi: "Bạn đã nói với Ruth — và cả Owen — về em trai Sam." } },
    { ch: 1, if: s => s.f.gp === "told", t: { en: "Kieran begged you to keep a secret. You put 'Gull Point' in the statement, in front of Owen.", vi: "Kieran xin bạn giữ bí mật. Bạn ghi “Gull Point” vào biên bản, ngay trước mặt Owen." } },
    { ch: 1, if: s => s.f.gp === "lie", t: { en: "Kieran begged you to keep a secret. You lied to Ruth to protect him.", vi: "Kieran xin bạn giữ bí mật. Bạn nói dối Ruth để bảo vệ cậu." } },
    { ch: 1, if: s => s.f.gp === "private", t: { en: "You told Ruth about Gull Point in private. She asked you to keep it from Owen. You have an ally.", vi: "Bạn kể riêng với Ruth về Gull Point. Bà dặn giấu Owen. Bạn đã có một đồng minh." } },
    { ch: 1, if: s => s.f.fixed_name, t: { en: "Owen's typed statement said Kieran named Tom Ward. Your notebook proved he never did.", vi: "Biên bản Owen đánh máy ghi Kieran đã nêu tên Tom Ward. Sổ tay của bạn chứng minh cậu chưa từng nói." } },
    { ch: 1, if: s => s.f.signed_bad, t: { en: "You signed a statement with words the witness never said.", vi: "Bạn đã ký một biên bản có những chữ nhân chứng chưa từng nói." } },
    { ch: 1, if: s => s.f.van, t: { en: "A voice message on Kieran's phone: 'The van comes Thursday, four a.m.'", vi: "Tin nhắn thoại trong máy Kieran: “Xe tải đến thứ Năm, 4 giờ sáng.”" } },
    { ch: 1, if: s => s.f.outcome === "arrest", t: { en: "At dawn, Tom Ward was arrested. He did not say a word.", vi: "Rạng sáng, Tom Ward bị bắt. Ông không nói một lời." } },
    { ch: 1, if: s => s.f.outcome === "doubt", t: { en: "Ruth refused to charge Tom Ward. Not enough evidence — yet.", vi: "Ruth không buộc tội Tom Ward. Chưa đủ bằng chứng." } },
    { ch: 1, if: s => s.f.end_sam, t: { en: "As Kieran left, he said the words that changed everything: 'Sam told me to run.'", vi: "Lúc rời đi, Kieran nói câu làm mọi thứ đảo lộn: “Sam bảo em chạy.”" } },
    { ch: 1, if: s => s.f.end_photo, t: { en: "On Kieran's lock screen: four young men on a boat. One of them was Sam.", vi: "Trên màn hình khoá của Kieran: bốn chàng trai trên một con thuyền. Một người là Sam." } },
  ],

  flow: [
    { ch: 1, row: 0, id: "pro", kind: "cp", scene: "court", label: { en: "Six days from now", vi: "Sáu ngày nữa" }, sum: { en: "The courtroom. Word for word?", vi: "Phòng xử. Đúng từng chữ?" } },
    { ch: 1, row: 1, id: "c1_pier", kind: "cp", scene: "pier", label: { en: "The north pier", vi: "Cầu tàu phía bắc" }, sum: { en: "Search the scene.", vi: "Khám nghiệm hiện trường." } },
    { ch: 1, row: 2, id: "c1_detour", kind: "cp", scene: "cg-camera", label: { en: "Twenty minutes", vi: "Hai mươi phút" }, sum: { en: "Only one place to go.", vi: "Chỉ kịp đến một nơi." } },
    { ch: 1, row: 3, kind: "opt", key: "detour", val: "car", label: { en: "With Kieran", vi: "Đi cùng Kieran" } },
    { ch: 1, row: 3, kind: "opt", key: "detour", val: "stay", label: { en: "Watch Owen", vi: "Ở lại với Owen" } },
    { ch: 1, row: 3, kind: "opt", key: "detour", val: "pub", label: { en: "The Anchor", vi: "Quán The Anchor" } },
    { ch: 1, row: 4, id: "c1_interview", kind: "cp", scene: "interview", label: { en: "The witness", vi: "Nhân chứng" }, sum: { en: "Your first interview.", vi: "Lần hỏi cung đầu tiên." } },
    { ch: 1, row: 5, id: "c1_push", kind: "cp", scene: "interview", label: { en: "'He pushed him…'", vi: "“Ông ấy đẩy…”" }, sum: { en: "The sentence that matters.", vi: "Câu ghi quyết định." } },
    { ch: 1, row: 6, kind: "opt", key: "push", val: "away", label: { en: "pushed away", vi: "pushed away" } },
    { ch: 1, row: 6, kind: "opt", key: "push", val: "off", label: { en: "pushed off", vi: "pushed off" } },
    { ch: 1, row: 6, kind: "opt", key: "push", val: "in", label: { en: "pushed in", vi: "pushed in" } },
    { ch: 1, row: 7, id: "c1_whisper", kind: "cp", scene: "cg-whisper", label: { en: "The whisper", vi: "Lời thì thầm" }, sum: { en: "Write everything down?", vi: "Ghi lại tất cả?" } },
    { ch: 1, row: 8, kind: "opt", key: "gp", val: "told", label: { en: "Write it all", vi: "Ghi hết" } },
    { ch: 1, row: 8, kind: "opt", key: "gp", val: "lie", label: { en: "Lie", vi: "Nói dối" } },
    { ch: 1, row: 8, kind: "opt", key: "gp", val: "private", label: { en: "Private word", vi: "Nói riêng" } },
    { ch: 1, row: 9, id: "c1_report", kind: "cp", scene: "corridor", label: { en: "The statement", vi: "Bản lời khai" }, sum: { en: "Sign — or object.", vi: "Ký — hay phản đối." } },
    { ch: 1, row: 10, id: "c1_arrest", kind: "end", label: { en: "Tom arrested", vi: "Tom bị bắt" } },
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
      { say: "judge", en: "Detective. This is the witness statement. Your signature is at the bottom.", easy: "Detective, this is the statement. You signed it.", vi: "Thưa thám tử. Đây là biên bản lời khai. Chữ ký của anh / chị ở cuối trang." },
      { say: "judge", en: "Is this, word for word, what the witness told you?", easy: "Is every word here what the witness said?", vi: "Đây có đúng từng chữ nhân chứng đã nói với anh / chị không?" },
      { think: { en: "One word in it is wrong. You know which one.", vi: "Có một chữ sai. Bạn biết là chữ nào." } },
      { think: { en: "Tell the truth — and someone you love goes to prison.", vi: "Nói thật — một người bạn thương sẽ vào tù." } },
      { choice: [
        { en: "Yes. Word for word.", vi: "Đúng. Từng chữ một.", set: { pro: 1 } },
        { en: "No. Not exactly.", vi: "Không. Không hẳn.", set: { pro: 2 } },
      ], timer: 9, timeout: [{ think: { en: "You open your mouth. Nothing comes out.", vi: "Bạn mở miệng. Không thốt ra được chữ nào." } }] },
      { fx: "flash" },
      { title: { en: "SIX DAYS EARLIER", vi: "SÁU NGÀY TRƯỚC" } },
      { go: "call" },
    ],

    // ───────────────────────── CHƯƠNG 1 ─────────────────────────
    call: [
      { title: { ch: 1, en: "Lost for Words", vi: "Một chữ sai" } },
      { bg: "room" },
      { n: { en: "Port Halden — a small fishing town on the cold north-east coast of England. Your first week as a trainee detective.", vi: "Port Halden — thị trấn đánh cá nhỏ trên bờ biển đông bắc lạnh giá nước Anh. Tuần đầu tiên bạn làm thám tử tập sự." } },
      { n: { en: "3:05 a.m. You can't sleep. You play the voice message again — the last one your brother ever sent.", vi: "3 giờ 05 sáng. Bạn không ngủ được. Bạn mở lại tin nhắn thoại — tin cuối cùng em trai bạn gửi." } },
      { item: "phone", quiet: true },
      { say: "sam", phone: true, en: "Hey. It's me. I'm fine, okay? I've got a job by the sea. Don't come looking for me. I'm sorry about… everything. I have to go.", easy: "Hi, it's me. I'm okay. I have a job by the sea. Don't look for me. I'm sorry. I have to go.", vi: "Này. Em đây. Em ổn, được chưa? Em có việc ở gần biển. Đừng đi tìm em. Em xin lỗi về… mọi chuyện. Em phải đi rồi." },
      { think: { en: "'I have to go.' He said it too fast. Like someone was standing behind him.", vi: "“Em phải đi rồi.” Nó nói nhanh quá. Như có ai đứng sau lưng." } },
      { think: { en: "The last thing you said to Sam was: 'Go, then. Don't come back.' He didn't.", vi: "Câu cuối bạn nói với Sam là: “Đi đi. Đừng về nữa.” Và nó không về thật." } },
      { item: "sam_photo", quiet: true },
      { n: { en: "3:12 a.m. The phone buzzes in your hand.", vi: "3 giờ 12. Điện thoại rung trong tay bạn." } },
      { say: "ruth", phone: true, en: "It's Calder. We have a body under the north [[pier]]. Get dressed. You're a detective now.", easy: "This is Ruth Calder. There is a dead body under the north pier. Come now.", vi: "Calder đây. Có một thi thể dưới cầu tàu phía bắc. Mặc đồ đi. Giờ bạn là thám tử rồi." },
      { choice: [
        { en: "I'll be there in ten minutes.", vi: "Mười phút nữa tôi có mặt.", add: { ruth: 1 }, then: [
          { say: "ruth", phone: true, en: "Good. Follow the blue lights.", vi: "Tốt. Cứ theo đèn xanh mà đến." } ] },
        { en: "A body? Who is it?", vi: "Thi thể? Là ai vậy?", then: [
          { think: { en: "Please. Please don't let it be Sam.", vi: "Xin đừng. Xin đừng là Sam." } },
          { say: "ruth", phone: true, en: "That's what we need to find out. Hurry.", vi: "Đó là điều ta cần tìm ra. Nhanh lên." } ] },
        { en: "It's three in the morning…", vi: "Giờ là ba giờ sáng mà…", add: { ruth: -1 }, then: [
          { say: "ruth", phone: true, en: "Yes. That's usually when people find bodies.", vi: "Đúng. Người ta thường tìm thấy xác vào giờ này." } ] },
      ] },
      { go: "pier" },
    ],

    pier: [
      { cp: "c1_pier" },
      { bg: "pier" },
      { n: { en: "The north pier. Fog rolls in from the sea. Blue police lights turn slowly in the mist.", vi: "Cầu tàu phía bắc. Sương mù cuộn vào từ biển. Đèn xanh xe cảnh sát xoay chậm trong màn sương." } },
      { show: "ruth", at: "l" },
      { say: "ruth", en: "There you are. First rule: look before you talk.", vi: "Đến rồi đấy. Quy tắc đầu tiên: nhìn trước, nói sau." },
      { show: "owen", at: "r", face: "smile" },
      { say: "owen", face: "smile", en: "Hi! I'm Owen — DS Price. Here, have a coffee. It's terrible, but it's hot. Welcome to Port Halden!", easy: "Hi, I'm Owen, a police officer. Here's a hot coffee. Welcome to Port Halden!", vi: "Chào! Tôi là Owen — trung sĩ Price. Này, cà phê đây. Dở tệ, nhưng nóng. Chào mừng đến Port Halden!" },
      { think: { en: "The first friendly face in a week.", vi: "Gương mặt thân thiện đầu tiên sau một tuần." } },
      { say: "ruth", en: "A fisherman found the body at two-forty. The wallet says Pete Nolan, thirty-four. A [[deckhand]] on that boat — the Marta.", easy: "A fisherman found the body at 2:40. The wallet says Pete Nolan, age 34. He works on that boat, the Marta.", vi: "Một ngư dân tìm thấy thi thể lúc 2 giờ 40. Ví ghi Pete Nolan, 34 tuổi. Thuỷ thủ trên con tàu kia — tàu Marta." },
      { think: { en: "Not Sam. You breathe again.", vi: "Không phải Sam. Bạn thở lại được." } },
      { say: "owen", en: "His captain, Tom Ward, had a big argument with him at the pub last night. We [[arrest]] Tom at dawn. Easy.", vi: "Thuyền trưởng của anh ta, Tom Ward, cãi nhau to với anh ta ở quán tối qua. Rạng sáng bắt Tom. Dễ ợt." },
      { say: "ruth", face: "cold", en: "We arrest people when we have [[evidence]], Owen. Not before.", vi: "Ta bắt người khi có bằng chứng, Owen. Không phải trước đó." },
      { say: "ruth", en: "There's a [[witness]] in the car. A boy, about sixteen. Search the pier first. Find me three clues.", easy: "A boy saw something. He is in the car. First, look around. Find three clues.", vi: "Có một nhân chứng trong xe. Một cậu bé, chừng mười sáu. Khám xét cầu tàu trước. Tìm cho tôi ba manh mối." },
      { explore: {
        goal: { en: "Search the pier. Find at least 3 clues. Tip: tap something in your bag, then tap the scene.", vi: "Khám xét cầu tàu. Tìm ít nhất 3 manh mối. Mẹo: chạm 1 món trong túi rồi chạm vào cảnh." },
        need: 3, done: { en: "Done searching", vi: "Xong khám xét" },
        spots: [
          { id: "body", x: 34, y: 60, clue: true, label: { en: "Body", vi: "Thi thể" }, then: [
            { cg: "cg-body" },
            { n: { en: "A shape under a white [[sheet]]. One hand lies outside it.", vi: "Một hình người dưới tấm vải trắng. Một bàn tay thò ra ngoài." } },
            { n: { en: "The hand is thin and young. A cheap plastic watch on the wrist — stopped at 1:47.", vi: "Bàn tay gầy và trẻ. Cổ tay đeo chiếc đồng hồ nhựa rẻ tiền — dừng lúc 1:47." } },
            { cg: null },
            { item: "watch" } ] },
          { id: "wallet", x: 56, y: 50, clue: true, label: { en: "Evidence bag", vi: "Túi tang vật" }, then: [
            { say: "ruth", en: "The wallet. Sixty pounds still inside. Nothing was taken.", vi: "Cái ví. Vẫn còn sáu mươi bảng. Không mất gì." },
            { n: { en: "The ID card shows Pete Nolan: a big man with a thick red [[beard]].", vi: "Thẻ căn cước: Pete Nolan — người to lớn, râu đỏ rậm." } },
            { think: { en: "The money is still there. So this was not a robbery.", vi: "Tiền vẫn còn. Vậy đây không phải vụ cướp." } },
            { item: "id_card" } ] },
          { id: "steps", x: 80, y: 62, clue: true, label: { en: "Dark steps", vi: "Bậc thang tối" },
            then: [
              { n: { en: "Stone steps go down to the water. It's too dark to see anything.", vi: "Bậc đá dẫn xuống mặt nước. Tối quá, không thấy gì." } },
              { think: { en: "I need some light.", vi: "Cần có ánh sáng." } } ],
            use: { phone: [
              { n: { en: "You turn on your phone's [[torch]].", vi: "Bạn bật đèn pin điện thoại." } },
              { cg: "cg-sandal" },
              { n: { en: "There — half in the water: a small white [[trainer]] with bright green [[laces]].", vi: "Kia — nửa chìm dưới nước: một chiếc giày thể thao trắng nhỏ, dây xanh lá." } },
              { think: { en: "A small shoe. Too small for a big man.", vi: "Một chiếc giày nhỏ. Quá nhỏ với một người đàn ông to lớn." } },
              { cg: null },
              { item: "trainer" } ] } },
          { id: "boat", x: 14, y: 44, clue: true, label: { en: "The Marta", vi: "Tàu Marta" }, then: [
            { n: { en: "The Marta. A row of yellow [[oilskin]] coats hangs by the door. One [[hook]] is empty.", vi: "Tàu Marta. Một hàng áo vải dầu vàng treo cạnh cửa. Một cái móc trống." } },
            { think: { en: "Someone took a yellow coat tonight.", vi: "Đêm nay có người lấy đi một chiếc áo vàng." } },
            { item: "hook" } ] },
          { id: "cam", x: 86, y: 18, clue: true, label: { en: "Camera", vi: "Camera" }, then: [
            { n: { en: "A [[CCTV]] camera on the lamp post. It is pointing at the sky.", vi: "Camera giám sát trên cột đèn. Nó đang chĩa lên trời." } },
            { say: "owen", en: "The wind does that. It happens all the time here.", vi: "Gió đấy. Ở đây chuyện thường." },
            { think: { en: "But there is almost no wind tonight.", vi: "Nhưng đêm nay gần như không có gió." } },
            { set: { saw_cam: 1 } } ] },
          { id: "owen", x: 64, y: 34, label: { en: "Talk to Owen", vi: "Nói chuyện với Owen" },
            then: [
              { choice: [
                { tag: "open", en: "What happened at the pub last night?", vi: "Tối qua ở quán đã xảy ra chuyện gì?", once: true, then: [
                  { say: "owen", en: "Tom and Pete had a big fight. People heard Tom shout 'Run!' — really loud.", easy: "Tom and Pete fought. Tom shouted 'Run!' very loudly.", vi: "Tom với Pete cãi nhau to. Người ta nghe Tom hét “Chạy đi!” — to lắm." },
                  { think: { en: "'Run!'? In an argument about money? That's strange.", vi: "“Chạy đi!”? Trong một trận cãi nhau về tiền? Lạ thật." } },
                  { set: { heard_run: 1 } }, { item: "leg_it" }, { truth: "T1" } ] },
                { tag: "direct", en: "What happened to your hand?", vi: "Tay anh bị sao vậy?", once: true, then: [
                  { n: { en: "His [[knuckles]] are red and cut. The cuts are fresh.", vi: "Các khớp ngón tay anh ta đỏ và trầy. Vết còn mới." } },
                  { say: "owen", face: "smile", en: "Football on Sunday. You should see the other guy!", vi: "Đá bóng hôm Chủ nhật. Phải xem gã kia thế nào kìa!" },
                  { think: { en: "Today is Wednesday. Those cuts are from tonight.", vi: "Hôm nay là thứ Tư. Mấy vết đó là của đêm nay." } },
                  { set: { saw_knuckles: 1 } } ] },
                { en: "Nothing. Thanks for the coffee.", vi: "Không có gì. Cảm ơn ly cà phê." },
              ], loop: true } ],
            use: { sam_photo: [
              { say: "me", en: "Have you seen this young man? He's my brother.", vi: "Anh đã thấy cậu này bao giờ chưa? Em trai tôi." },
              { n: { en: "Owen looks at the photo. For one second too long.", vi: "Owen nhìn tấm ảnh. Lâu hơn cần thiết một giây." } },
              { say: "owen", face: "smile", en: "No, sorry. Lots of young lads come and go here. I'll keep an eye out.", vi: "Không, xin lỗi. Ở đây nhiều cậu trai đến rồi đi lắm. Tôi sẽ để ý giúp." },
              { set: { owen_sam: 1 } }, { add: { sus: 1 } } ] } },
        ],
      } },
      // SUY LUẬN 1: thi thể có phải Pete?
      { say: "ruth", en: "Well, detective? Tell me one thing you noticed.", vi: "Thế nào, thám tử? Kể tôi một điều bạn để ý." },
      { deduce: {
        q: { en: "Is the dead man really Pete Nolan, 34, with a red beard?", vi: "Người chết có thật là Pete Nolan, 34 tuổi, râu đỏ?" },
        a: [["id_card", "watch"], ["id_card", "trainer"]],
        hint: { en: "Compare the ID card with what you saw on the body.", vi: "So thẻ căn cước với điều bạn thấy trên thi thể." },
        tries: 3,
        ok: [
          { set: { doubt_id: 1 } }, { add: { ruth: 2 } },
          { say: "me", en: "The ID says a big man of thirty-four. But the body has the thin wrist and small feet of a teenager. It's not Pete.", easy: "The ID is a big man, 34. But the body is small and young. It is not Pete.", vi: "Thẻ ghi một người to lớn 34 tuổi. Nhưng thi thể có cổ tay gầy và bàn chân nhỏ của thiếu niên. Không phải Pete." },
          { say: "ruth", face: "soft", en: "…Good. Most people can't look at the body. You did. I'll ask the doctor to hurry.", vi: "…Tốt. Phần lớn người ta không dám nhìn thi thể. Bạn thì dám. Tôi sẽ giục bên pháp y." } ],
        fail: [
          { say: "ruth", en: "Look again tomorrow. The body always tells you something.", vi: "Mai nhìn lại đi. Thi thể luôn nói với ta điều gì đó." } ],
      } },
      { go: "detour" },
    ],

    // ───────── CHỌN HƯỚNG ĐI: 20 phút, chỉ 1 nơi ─────────
    detour: [
      { cp: "c1_detour" },
      { say: "ruth", en: "A doctor must check the boy first. We have twenty minutes. Use them well.", vi: "Bác sĩ phải khám cậu bé trước. Ta có hai mươi phút. Dùng cho khéo." },
      { hide: "*" },
      { map: {
        goal: { en: "Twenty minutes. Where do you go?", vi: "Hai mươi phút. Bạn đi đâu?" },
        places: [
          { x: 24, y: 62, label: { en: "Police car", vi: "Xe cảnh sát" }, desc: { en: "Talk to the witness.", vi: "Nói chuyện với nhân chứng." }, set: { detour: "car" }, go: "d_car" },
          { x: 52, y: 34, label: { en: "Stay on the pier", vi: "Ở lại cầu tàu" }, desc: { en: "Keep watching the scene.", vi: "Tiếp tục quan sát hiện trường." }, set: { detour: "stay" }, go: "d_stay" },
          { x: 78, y: 66, label: { en: "The Anchor", vi: "Quán The Anchor" }, desc: { en: "The pub where they argued.", vi: "Quán rượu nơi họ cãi nhau." }, set: { detour: "pub" }, go: "d_pub" },
        ],
      } },
    ],
    d_car: [
      { bg: "car" },
      { n: { en: "Rain on the roof. The boy sits in the back, wrapped in a grey blanket.", vi: "Mưa gõ lên nóc xe. Cậu bé ngồi ghế sau, quấn chăn xám." } },
      { show: "kieran", at: "c", face: "scared" },
      { say: "kieran", face: "scared", en: "Are you police too? You don't look like police.", easy: "Are you a police officer? You don't look like one.", vi: "Chị / anh cũng là cảnh sát à? Trông không giống cảnh sát." },
      { choice: [
        { tag: "kind", en: "I'm new. I just want to help you.", vi: "Tôi mới vào nghề. Tôi chỉ muốn giúp em.", add: { kieran: 1 }, then: [
          { say: "kieran", en: "Nobody here helps kids like me.", vi: "Ở đây chẳng ai giúp mấy đứa như em." } ] },
        { tag: "direct", en: "Yes. And I need to know what you saw.", vi: "Đúng. Và tôi cần biết em đã thấy gì.", add: { ruth: 1 }, then: [
          { say: "kieran", face: "sad", en: "…Okay. I understand.", vi: "…Vâng. Em hiểu." } ] },
      ] },
      { n: { en: "He rubs his wrist. A paper festival wristband: 'KIERAN · 14·02'.", vi: "Cậu xoa cổ tay. Một vòng giấy lễ hội: “KIERAN · 14·02”." } },
      { think: { en: "The fourteenth of February. His birthday, maybe.", vi: "Mười bốn tháng Hai. Có lẽ là sinh nhật cậu." } },
      { set: { saw_band: 1 } },
      { go: "interview" },
    ],
    d_stay: [
      { bg: "pier" },
      { n: { en: "You stand in the shadow of a container and drink your terrible coffee.", vi: "Bạn đứng trong bóng một chiếc container, uống cốc cà phê dở tệ." } },
      { n: { en: "Ruth leaves with the doctor. Owen is alone by the lamp post.", vi: "Ruth đi cùng bác sĩ. Owen ở lại một mình bên cột đèn." } },
      { cg: "cg-camera" },
      { n: { en: "He looks left. Right. Then he reaches up and turns the camera back down to the pier.", vi: "Anh ta nhìn trái. Nhìn phải. Rồi với tay lên, xoay camera chĩa xuống cầu tàu lại." } },
      { think: { en: "'The wind does that.'", vi: "“Gió đấy.”" } },
      { cg: null },
      { set: { saw_owen_cam: 1 } },
      { show: "owen", at: "c", face: "smile" },
      { say: "owen", face: "smile", en: "Oh! You scared me. I'm just fixing the camera for the morning team. Coffee okay?", vi: "Ồ! Làm tôi giật mình. Tôi chỉnh camera cho ca sáng thôi. Cà phê ổn chứ?" },
      { choice: [
        { tag: "polite", en: "It's fine. Thanks.", vi: "Ổn. Cảm ơn.", then: [{ think: { en: "Smile back. Remember everything.", vi: "Cười lại. Nhớ hết mọi thứ." } }] },
        { tag: "direct", en: "Did the camera record anything tonight?", vi: "Đêm nay camera có quay được gì không?", add: { sus: 2 }, then: [
          { say: "owen", face: "cold", en: "Pointing at the sky? Only clouds. Come on — the boy is ready.", vi: "Chĩa lên trời thì chỉ quay được mây. Đi nào — cậu bé xong rồi." } ] },
      ] },
      { go: "interview" },
    ],
    d_pub: [
      { bg: "pub" },
      { n: { en: "The Anchor is closed, but a light is still on. A big old man is putting chairs on the tables.", vi: "Quán The Anchor đã đóng cửa nhưng đèn còn sáng. Một ông lớn tuổi to con đang xếp ghế lên bàn." } },
      { show: "jim", at: "c" },
      { say: "jim", en: "We're closed. Oh — you're with the police? Terrible news.", vi: "Đóng cửa rồi. Ồ — đi cùng cảnh sát à? Tin dữ thật." },
      { choice: [
        { tag: "open", en: "Can you tell me about the argument last night?", vi: "Ông kể tôi nghe về trận cãi nhau tối qua được không?", then: [
          { say: "jim", en: "Tom owed Pete some money. They shouted, then they shook hands. Pete flew home to Ireland this morning.", easy: "Tom had to pay Pete. They shouted, then shook hands. Pete flew home to Ireland this morning.", vi: "Tom nợ Pete ít tiền. Họ quát nhau, rồi bắt tay. Sáng nay Pete bay về Ireland rồi." },
          { think: { en: "Pete flew home this morning. So why is his wallet under the pier?", vi: "Sáng nay Pete bay về nước. Vậy sao ví anh ta lại ở dưới cầu tàu?" } },
          { set: { piotr_home: 1 } } ] },
      ] },
      { choice: [
        { if: s => s.f.heard_run, tag: "direct", en: "Did Tom shout 'Run!'?", vi: "Tom có hét “Chạy đi!” không?", then: [
          { say: "jim", en: "'Run'? No. Nobody shouted that. Who told you?", vi: "“Chạy đi”? Không. Chẳng ai hét thế cả. Ai bảo cậu?" },
          { think: { en: "Owen did. And Owen wasn't even here.", vi: "Owen. Mà Owen còn chẳng có mặt ở đây." } } ] },
        { en: "Thank you. Good night.", vi: "Cảm ơn ông. Chúc ngủ ngon." },
      ], skipIfOne: true },
      { say: "jim", en: "Be careful. And your sergeant, Owen… he never pays for his drinks here. Think about that.", vi: "Cẩn thận nhé. À, anh trung sĩ Owen của cậu… uống ở đây chẳng bao giờ trả tiền. Nghĩ đi." },
      { item: "jim_note" },
      { go: "interview" },
    ],

    interview: [
      { bg: "interview" },
      { hide: "*" },
      { n: { en: "Port Halden Police Station. Interview Room 2. 4:30 a.m.", vi: "Đồn cảnh sát Port Halden. Phòng thẩm vấn số 2. 4 giờ 30 sáng." } },
      { show: "kieran", at: "c", face: "scared" },
      { n: { en: "The boy holds a paper cup with both hands. His hands are shaking.", vi: "Cậu bé ôm cốc giấy bằng cả hai tay. Tay cậu run." } },
      { show: "ruth", at: "l" }, { show: "owen", at: "r" },
      { item: "notes", quiet: true },
      { cp: "c1_interview" },
      { say: "ruth", en: "Your interview, detective. I am watching. Owen is watching. Ask him.", vi: "Buổi hỏi cung của bạn, thám tử. Tôi xem. Owen xem. Hỏi đi." },
      { choice: [
        { tag: "open", en: "Kieran, can you tell me what you saw tonight?", vi: "Kieran, em kể tôi nghe đêm nay em đã thấy gì được không?", add: { kieran: 1, ruth: 1 } },
        { tag: "lead", en: "You saw the captain kill that man, didn't you?", vi: "Em thấy thuyền trưởng giết người đó, đúng không?", add: { ruth: -1 }, set: { led: 1 }, then: [
          { say: "ruth", face: "cold", en: "Don't put words in his mouth. Ask, don't tell.", vi: "Đừng nhét chữ vào miệng cậu ấy. Hỏi, đừng kể." } ] },
        { tag: "press", en: "Stop wasting our time. What did you see?", vi: "Đừng làm mất thời gian. Em đã thấy gì?", add: { kieran: -1 }, then: [
          { n: { en: "Kieran pulls the blanket tighter.", vi: "Kieran kéo chăn chặt hơn." } } ] },
      ] },
      { say: "kieran", face: "scared", en: "I… I didn't see anything.", vi: "Em… em không thấy gì hết." },
      { say: "owen", face: "angry", en: "Come on! You were running from the pier at two in the morning!", easy: "Don't lie! You ran from the pier at 2 a.m.!", vi: "Thôi đi! Mày chạy khỏi cầu tàu lúc hai giờ sáng!" },
      { choice: [
        { tag: "kind", en: "It's okay, Kieran. Take your time. Why were you on the pier?", vi: "Không sao đâu, Kieran. Cứ từ từ. Sao em lại ở cầu tàu?", add: { kieran: 1 } },
        { tag: "press", en: "He's right. Why were you running?", vi: "Anh ấy nói đúng. Sao em lại chạy?", add: { kieran: -1, sus: -1 } },
      ] },
      { say: "kieran", en: "I go fishing there every night. It's quiet.", vi: "Đêm nào em cũng ra đó câu cá. Ở đó yên tĩnh." },
      { say: "ruth", en: "Then where is your fishing rod, Kieran?", vi: "Thế cần câu của em đâu, Kieran?" },
      { n: { en: "Kieran opens his mouth. Closes it. Then he starts to cry — very quietly, like someone who learned not to make noise.", vi: "Kieran mở miệng. Rồi ngậm lại. Rồi cậu khóc — rất khẽ, như người đã quen không được gây tiếng động." } },
      { cp: "c1_push" },
      { say: "kieran", face: "sad", en: "I saw two people on the pier. They were arguing. One was big, in a yellow coat. He pushed the other one away… and then I heard a splash. And I ran.", easy: "Two people were arguing on the pier. A big man in a yellow coat pushed the other one away. Then I heard a splash. I ran.", vi: "Em thấy hai người trên cầu tàu. Họ đang cãi nhau. Một người to con, mặc áo vàng. Ông ấy đẩy người kia ra… rồi em nghe tiếng ùm. Và em chạy." },
      { interpret: { dir: "rec", key: true, prompt: { en: "This line matters. Write exactly what he said.", vi: "Câu này quan trọng. Ghi đúng điều cậu ấy nói." }, opts: [
        { t: "The witness saw two men arguing. A big man in a yellow coat pushed the other man away. Then the witness heard a splash.", acc: 2, set: { push: "away" } },
        { t: "The witness saw two men arguing. A big man in a yellow coat pushed the other man off the pier.", acc: 1, set: { push: "off" } },
        { t: "The witness saw two men fighting. A big man in a yellow coat pushed the other man into the water.", acc: 0, set: { push: "in" } },
      ], why: { vi: "Kieran nói “arguing” (cãi nhau bằng lời), không phải “fighting” (đánh nhau). Cậu nói “pushed him away” (đẩy ra) và “heard a splash” (nghe tiếng nước) — cậu KHÔNG thấy ai bị đẩy xuống nước.", en: "He said 'arguing', not 'fighting'. He said 'pushed him away' and 'heard a splash' — he did NOT see anyone pushed into the water." } } },
      { if: s => s.f.push === "in", then: [{ say: "owen", face: "smile", en: "Into the water. There it is.", vi: "Xuống nước. Đấy, rõ rồi." }] },
      { if: s => s.f.push !== "in", then: [{ say: "owen", en: "Away? Away where? Into the water, obviously.", vi: "Ra? Ra đâu? Xuống nước, rõ ràng thế." }] },
      { say: "owen", en: "A big man in a yellow coat. That's Tom Ward. He wears a yellow [[oilskin]] every day.", vi: "Người to con mặc áo vàng. Tom Ward đấy. Ngày nào hắn cũng mặc áo vải dầu vàng." },
      { if: s => s.has("hook"), then: [{ think: { en: "And one yellow coat is missing from the Marta tonight.", vi: "Và đêm nay một chiếc áo vàng đã biến khỏi tàu Marta." } }] },
      { say: "owen", face: "angry", en: "Kieran. Did Tom Ward push that man into the water? Yes or no?", vi: "Kieran. Tom Ward có đẩy người đó xuống nước không? Có hay không?" },
      { choice: [
        { en: "(Say nothing. Let him answer.)", vi: "(Im lặng. Để cậu trả lời.)", then: [
          { say: "kieran", face: "scared", en: "I… I don't know. It was dark. Maybe… yes?", vi: "Em… em không biết. Trời tối. Có lẽ… có?" },
          { think: { en: "He's saying yes because he's scared. Not because he saw it.", vi: "Cậu nói “có” vì sợ. Không phải vì cậu thấy." } },
          { set: { kieran_yes: 1 } } ] },
        { tag: "direct", en: "That's a [[leading question]], Owen. Ask him what he saw.", vi: "Đó là câu hỏi dẫn dắt, Owen. Hỏi xem cậu ấy thấy gì.", add: { ruth: 2, sus: 1 }, set: { objected: 1 }, then: [
          { say: "owen", face: "angry", en: "Excuse me? You've been a detective for one week!", vi: "Gì cơ? Bạn mới làm thám tử được một tuần!" },
          { say: "ruth", en: "{name} is right. Kieran, what did you see? Only what you saw.", easy: "{name} is right. Kieran, tell us only what you saw.", vi: "Và {name} nói đúng. Kieran, em đã thấy gì? Chỉ điều em thấy thôi." },
          { say: "kieran", en: "It was dark. I didn't see his face. I only heard the splash. Then someone shouted 'Run!'. So I ran.", vi: "Trời tối. Em không thấy mặt ông ấy. Em chỉ nghe tiếng ùm. Rồi có người hét “Chạy đi!”. Thế là em chạy." },
          { think: { en: "'Run!' — on the pier. Not at the pub.", vi: "“Chạy đi!” — trên cầu tàu. Không phải ở quán." } },
          { set: { heard_shout: 1 } } ] },
      ] },
      { n: { en: "Owen sighs. Ruth looks at you. 'Do you want to show him anything?'", vi: "Owen thở dài. Ruth nhìn bạn. “Muốn cho cậu ấy xem gì không?”" } },
      { choice: [
        { item: "trainer", once: true, en: "(Show him the white trainer.)", vi: "(Cho cậu xem chiếc giày trắng.)", then: [
          { n: { en: "You put the evidence bag on the table. Kieran stops breathing.", vi: "Bạn đặt túi tang vật lên bàn. Kieran nín thở." } },
          { say: "kieran", face: "shock", en: "Green laces… That's Danny's. Danny always has green laces.", vi: "Dây xanh lá… Của Danny. Danny lúc nào cũng dùng dây xanh lá." },
          { set: { saw_danny: 1 } }, { truth: "T2" },
          { say: "ruth", en: "Who is Danny?", vi: "Danny là ai?" },
          { n: { en: "Kieran shakes his head. He won't say any more about it.", vi: "Kieran lắc đầu. Cậu không nói thêm gì về chuyện đó." } } ] },
        { item: "sam_photo", once: true, en: "(Show him the photo of Sam.)", vi: "(Cho cậu xem ảnh Sam.)", then: [
          { n: { en: "You slide the photo across the table. Kieran looks at it — and goes white.", vi: "Bạn đẩy tấm ảnh qua bàn. Kieran nhìn — rồi mặt trắng bệch." } },
          { say: "kieran", face: "scared", en: "I… I don't know him.", vi: "Em… em không biết anh ấy." },
          { think: { en: "His hands are shaking harder now. He's lying.", vi: "Tay cậu run mạnh hơn. Cậu đang nói dối." } },
          { say: "ruth", face: "cold", en: "Who is that in the photo?", vi: "Người trong ảnh là ai?" },
          { choice: [
            { tag: "direct", en: "My brother, Sam. He's been missing for four months.", vi: "Em trai tôi, Sam. Mất liên lạc bốn tháng rồi.", add: { ruth: 1, sus: 1 }, set: { told_sam: 1 }, then: [
              { say: "ruth", en: "You should have told me that before you came in here.", vi: "Lẽ ra bạn phải nói chuyện đó trước khi vào đây." },
              { say: "owen", face: "cold", en: "Missing, eh? It's a small town. I'll ask around.", vi: "Mất tích à? Thị trấn nhỏ mà. Để tôi hỏi thử." },
              { think: { en: "He said it kindly. So why did it sound like a threat?", vi: "Anh ta nói rất tử tế. Vậy sao nghe như lời đe doạ?" } } ] },
            { tag: "lie", en: "Nobody. Just a friend.", vi: "Không ai cả. Một người bạn thôi.", add: { lie: 1 } },
          ] } ] },
        { en: "No more questions.", vi: "Không hỏi gì thêm." },
      ], loop: true },
      { cp: "c1_whisper" },
      { n: { en: "Owen's phone buzzes. He goes to the corner to answer it. Ruth is writing.", vi: "Điện thoại Owen rung. Anh ta ra góc phòng nghe máy. Ruth đang cúi viết." } },
      { cg: "cg-whisper" },
      { n: { en: "Kieran leans towards you. His voice is very quiet.", vi: "Kieran nghiêng người về phía bạn. Giọng cậu rất khẽ." } },
      { say: "kieran", whisper: true, en: "Please… don't tell them I sleep at Gull Point. If they find out… they'll kill me.", easy: "Please don't tell them I live at Gull Point. They will kill me.", vi: "Làm ơn… đừng nói với họ là em ngủ ở Gull Point. Họ mà biết… họ giết em mất." },
      { cg: null },
      { truth: "T3" },
      { think: { en: "A detective must write down everything a witness says. Everything.", vi: "Thám tử phải ghi lại mọi điều nhân chứng nói. Mọi điều." } },
      { say: "ruth", en: "What did he just say?", vi: "Cậu ấy vừa nói gì?" },
      { choice: [
        { tag: "direct", en: "He said: 'Don't tell them I sleep at Gull Point. They'll kill me.'", vi: "Cậu ấy nói: “Đừng nói với họ em ngủ ở Gull Point. Họ giết em mất.”", add: { kieran: -3, ruth: 1, acc: 2, accN: 2 }, set: { gp: "told" }, then: [
          { n: { en: "In the corner, Owen stops talking.", vi: "Ở góc phòng, Owen ngừng nói." } },
          { show: "kieran", at: "c", face: "shock" },
          { n: { en: "Kieran looks at you like you just pushed him into the sea.", vi: "Kieran nhìn bạn như thể bạn vừa đẩy cậu xuống biển." } } ] },
        { tag: "lie", en: "He asked for some water.", vi: "Cậu ấy xin cốc nước.", add: { lie: 1, kieran: 2, accN: 2 }, set: { gp: "lie" }, then: [
          { say: "ruth", en: "Owen. Get the boy some water.", vi: "Owen. Lấy cho cậu bé cốc nước." },
          { think: { en: "Kieran's eyes say thank you. Ruth keeps writing. Did she believe you?", vi: "Mắt Kieran nói lời cảm ơn. Ruth vẫn viết. Bà có tin bạn không?" } } ] },
        { need: s => s.f.ruth >= 2, lockHint: { en: "Ruth doesn't trust you enough yet.", vi: "Ruth chưa đủ tin bạn." },
          tag: "polite", en: "Can we talk outside for a minute? Just us.", vi: "Ta ra ngoài nói chuyện một chút được không? Chỉ hai ta.", add: { ruth: 1, kieran: 1, acc: 1, accN: 2 }, set: { gp: "private", ally: 1 }, then: [
          { hide: "owen" }, { hide: "kieran" },
          { n: { en: "In the corridor, away from Owen, you tell Ruth everything.", vi: "Ngoài hành lang, xa Owen, bạn kể hết với Ruth." } },
          { say: "ruth", en: "Gull Point. The old fish factory. Nobody has lived there for twenty years.", vi: "Gull Point. Xưởng cá cũ. Hai mươi năm nay chẳng ai sống ở đó." },
          { say: "ruth", face: "cold", en: "Keep this between us. Don't tell Owen. Not yet.", vi: "Chuyện này chỉ ta biết. Đừng nói với Owen. Chưa phải lúc." },
          { think: { en: "Don't tell Owen. So Ruth has doubts too.", vi: "Đừng nói với Owen. Vậy là Ruth cũng có nghi ngờ." } } ] },
      ], timer: 12, timeout: [
        { think: { en: "You wait too long.", vi: "Bạn ngập ngừng quá lâu." } },
        { say: "me", en: "…Nothing. He's just scared.", vi: "…Không có gì. Cậu ấy chỉ sợ thôi." },
        { add: { lie: 1, accN: 2 } }, { set: { gp: "lie" } } ] },
      { go: "report" },
    ],

    report: [
      { cp: "c1_report" },
      { bg: "corridor" },
      { hide: "*" },
      { n: { en: "5:50 a.m. The corridor smells of old coffee.", vi: "5 giờ 50 sáng. Hành lang nồng mùi cà phê nguội." } },
      { show: "owen", at: "c", face: "smile" },
      { say: "owen", face: "smile", en: "I typed up the [[statement]] for you. Just sign it. It's a normal thing.", vi: "Tôi đánh máy biên bản lời khai giúp bạn rồi. Ký đi. Việc bình thường mà." },
      { present: {
        title: { en: "WITNESS STATEMENT — Kieran Doyle, 16", vi: "BIÊN BẢN LỜI KHAI — Kieran Doyle, 16 tuổi" },
        goal: { en: "Read carefully. Tap a line that is wrong, then show your evidence. Sign when you're done.", vi: "Đọc kỹ. Chạm vào dòng SAI, rồi đưa bằng chứng. Xong thì ký." },
        segs: [
          { t: "The witness was on the north pier at about 2 a.m." },
          { t: "He saw two men arguing." },
          { t: "The man in the yellow coat pushed the victim into the water.", fix: "The man in the yellow coat pushed the other man away.", bad: s => s.f.push !== "in", evidence: "notes",
            ok: [
              { say: "me", en: "He never said 'into the water'. My notebook says: 'pushed the other man away'.", vi: "Cậu ấy chưa bao giờ nói “xuống nước”. Sổ tay của tôi ghi: “đẩy người kia ra”." },
              { say: "owen", face: "cold", en: "It's the same thing.", vi: "Thì cũng thế cả." },
              { say: "me", en: "No. One is what he saw. The other is a guess.", vi: "Không. Một bên là điều cậu ấy thấy. Bên kia là phỏng đoán." },
              { say: "owen", en: "…Fine. I'll change it.", vi: "…Được. Tôi sửa." },
              { set: { fixed_push: 1 } }, { add: { sus: 1 } } ],
            same: [
              { think: { en: "My notebook says the same thing. Because that's what I wrote.", vi: "Sổ tay của mình cũng ghi y vậy. Vì mình đã ghi như vậy." } },
              { think: { en: "Did Kieran really say 'into the water'?", vi: "Kieran có thật sự nói “xuống nước” không?" } } ] },
          { t: "The witness said the man was Tom Ward.", fix: "The witness did not say who the man was.", bad: () => true, evidence: "notes",
            ok: [
              { say: "me", en: "He never said a name. Not once. Look — it's not in my notebook.", vi: "Cậu ấy chưa từng nói tên ai. Không một lần. Nhìn đi — sổ tay tôi không có." },
              { say: "owen", face: "cold", en: "Everyone knows it's Tom.", vi: "Ai chẳng biết là Tom." },
              { say: "me", en: "Then everyone can sign it. I won't.", vi: "Vậy ai biết thì người đó ký. Tôi thì không." },
              { say: "owen", en: "…Just a small mistake. Relax.", vi: "…Nhầm chút thôi. Bình tĩnh." },
              { set: { fixed_name: 1 } }, { add: { sus: 1 } } ] },
        ],
        sign: { en: "Sign the statement", vi: "Ký biên bản" },
        wrong: [{ say: "owen", face: "smile", en: "Something wrong with that line? It looks fine to me.", vi: "Dòng đó có gì sai à? Tôi thấy ổn mà." }],
        noEvidence: [{ think: { en: "That doesn't prove it. I need something in writing.", vi: "Cái đó không chứng minh được. Mình cần thứ gì ghi lại rõ ràng." } }],
      } },
      { if: s => !s.f.fixed_name || (s.f.push !== "in" && !s.f.fixed_push), then: [
        { think: { en: "You signed it. Your name is now under words Kieran never said.", vi: "Bạn đã ký. Tên bạn giờ nằm dưới những chữ Kieran chưa từng nói." } },
        { set: { signed_bad: 1 } } ] },
      // SUY LUẬN 2: vì sao Owen biết câu “Chạy đi!”?
      { if: s => s.has("leg_it") && (s.has("jim_note") || s.f.heard_shout), then: [
        { think: { en: "Something about Owen's story doesn't fit.", vi: "Có gì đó trong lời kể của Owen không khớp." } },
        { deduce: {
          q: { en: "Owen says Tom shouted 'Run!' at the pub. Where was it really shouted?", vi: "Owen nói Tom hét “Chạy đi!” ở quán. Thật ra câu đó được hét ở đâu?" },
          a: [["leg_it", "jim_note"], ["leg_it", "notes"]],
          hint: { en: "Who else told you about the shout — and where?", vi: "Còn ai kể cho bạn về tiếng hét — và ở đâu?" },
          tries: 3,
          ok: [
            { set: { owen_lied: 1 } },
            { think: { en: "Nobody shouted 'Run!' at the pub. Someone shouted it on the pier, at 1:47 — to someone running away.", vi: "Không ai hét “Chạy đi!” ở quán. Có người hét câu đó trên cầu tàu, lúc 1:47 — với một người đang chạy trốn." } },
            { think: { en: "So how does Owen know those words?", vi: "Vậy làm sao Owen biết câu đó?" } } ],
        } } ] },
      { hide: "owen" },
      { show: "ruth", at: "c" },
      { say: "ruth", en: "The boy's phone keeps buzzing. It's locked. Can you open it?", vi: "Điện thoại của cậu bé cứ rung mãi. Nó bị khoá. Bạn mở được không?" },
      { if: s => s.f.saw_band, then: [{ think: { en: "His wristband: 'KIERAN · 14·02'.", vi: "Vòng tay cậu: “KIERAN · 14·02”." } }] },
      { lock: {
        prompt: { en: "Kieran's phone. Enter the 4-digit PIN.", vi: "Điện thoại của Kieran. Nhập mã PIN 4 số." },
        kind: "digits", answer: "1402",
        hints: [
          { en: "Teenagers often use their birthday: day and month.", vi: "Tuổi teen hay đặt mã là ngày sinh: ngày và tháng." },
          { en: "In the car, Kieran wore a wristband with a date on it.", vi: "Trên xe, Kieran đeo vòng tay có ghi một ngày." },
          { en: "Valentine's Day. 14 / 02.", vi: "Ngày Lễ tình nhân. 14 / 02." },
        ],
        ok: [{ set: { vm_open: 1 } }],
        giveUp: [{ say: "ruth", en: "Leave it. The tech team can open it in the morning.", vi: "Thôi. Sáng mai bên kỹ thuật mở được." }],
      } },
      { if: s => s.f.vm_open, then: [
        { say: "ruth", en: "You're in. There's a voice message. Listen, and tell me what it says.", vi: "Mở được rồi. Có tin nhắn thoại. Nghe và nói tôi biết nội dung." },
        { listen: {
          who: "caller", audio: "It's me. Don't go back to Gull Point tonight. They know. The van comes on Thursday, at four a.m. Same place. Delete this message.",
          tr: { vi: "Là chú đây. Tối nay đừng về Gull Point. Chúng nó biết rồi. Xe tải đến thứ Năm, 4 giờ sáng. Chỗ cũ. Xoá tin nhắn này đi." },
          qs: [
            { q: { en: "When does the van come?", vi: "Xe tải đến khi nào?" }, opts: ["Thursday, 4 a.m.", "Tuesday, 4 p.m.", "Thursday, 4 p.m."], a: 0, set: { van: 1 } },
            { q: { en: "Where should Kieran NOT go tonight?", vi: "Tối nay Kieran KHÔNG được đến đâu?" }, opts: ["The pier", "Gull Point", "The police station"], a: 1, set: { gp_heard: 1 } },
          ],
        } },
        { item: "voicemail" },
        { think: { en: "The man sounded older. Calm. A voice used to the sea.", vi: "Giọng người đàn ông nghe lớn tuổi. Điềm tĩnh. Giọng của người quen với biển." } },
        { choice: [
          { silent: true, tag: "direct", en: "Tell Ruth everything.", vi: "Kể hết với Ruth.", add: { ruth: 1, kieran: -1 }, set: { ruth_van: 1 }, then: [
            { say: "ruth", en: "Thursday, four a.m. A van. Good. Nobody else hears about this.", vi: "Thứ Năm, 4 giờ sáng. Một chiếc xe tải. Tốt. Không ai khác được biết chuyện này." } ] },
          { silent: true, if: s => s.f.gp !== "told" && s.f.gp !== "private", en: "Tell her about the van — but not about Gull Point.", vi: "Kể về chiếc xe tải — nhưng giấu Gull Point.", add: { kieran: 1 }, set: { ruth_van: 1 }, then: [
            { say: "ruth", face: "cold", en: "A van. Where from? Where to?", vi: "Một chiếc xe tải. Từ đâu? Đi đâu?" },
            { say: "me", en: "The message doesn't say.", vi: "Tin nhắn không nói." },
            { think: { en: "Half a truth. Is that still a lie?", vi: "Một nửa sự thật. Thế có còn là nói dối không?" } } ] },
          { tag: "lie", en: "It's just a friend saying good night.", vi: "Chỉ là bạn cậu ấy chúc ngủ ngon.", add: { lie: 1, ruth: -1 } },
        ] } ] },
      { go: "dawn" },
    ],

    dawn: [
      { bg: "dawn" },
      { hide: "*" },
      { n: { en: "6:40 a.m. The fog is lifting. The sea turns from black to grey.", vi: "6 giờ 40 sáng. Sương đang tan. Mặt biển chuyển từ đen sang xám." } },
      { if: s => s.f.push === "in" || !s.f.fixed_push || !s.f.fixed_name, then: [
        { set: { outcome: "arrest" } },
        { n: { en: "At 6:10, Tom Ward was arrested on the Marta. He did not fight. He did not say a word.", vi: "6 giờ 10, Tom Ward bị bắt ngay trên tàu Marta. Ông không chống cự. Không nói một lời." } } ],
        else: [
        { set: { outcome: "doubt" } },
        { n: { en: "Ruth decides there is not enough evidence to charge Tom Ward. He is only asked some questions.", vi: "Ruth quyết định chưa đủ bằng chứng để buộc tội Tom Ward. Ông chỉ bị hỏi vài câu." } } ] },
      { show: "ruth", at: "c" },
      { say: "ruth", en: "Help me with my report. Put tonight in the right order.", vi: "Giúp tôi viết báo cáo. Xếp lại các việc đêm nay cho đúng thứ tự." },
      { order: {
        prompt: { en: "Tap two events to swap them. The first event goes at the top.", vi: "Chạm 2 sự việc để đổi chỗ. Việc xảy ra trước ở trên cùng." },
        items: [
          { t: "The victim's watch stopped." },
          { t: "Police found a boy running from the pier." },
          { t: "A fisherman found the body under the pier." },
          { t: "Ruth phoned you." },
          { t: "The interview started." },
        ],
        tries: 3,
        ok: [{ add: { ruth: 1 } }, { say: "ruth", en: "1:47. Around two. 2:40. 3:12. 4:30. Clean. Thank you.", vi: "1 giờ 47. Khoảng 2 giờ. 2 giờ 40. 3 giờ 12. 4 giờ 30. Gọn gàng. Cảm ơn." }],
        fail: [{ say: "ruth", en: "Close enough. I'll fix it. It's been a long night.", vi: "Tạm được. Để tôi sửa. Đêm dài quá mà." }],
      } },
      { if: s => s.acc() >= 0.8, then: [
        { say: "ruth", face: "soft", en: "You wrote down his exact words. That's rare. Many detectives try to 'help' — and that's how innocent people go to prison.", easy: "You wrote his exact words. That's rare. When detectives 'help', innocent people can go to prison.", vi: "Bạn ghi đúng từng chữ cậu ấy nói. Hiếm lắm đấy. Nhiều thám tử muốn “giúp” — và chính thế mà người vô tội vào tù." } ],
        else: [
        { say: "ruth", face: "cold", en: "Next time, write his words. Not yours. Not Owen's. His.", vi: "Lần sau, ghi lời của cậu ấy. Không phải lời bạn. Không phải lời Owen. Lời của cậu ấy." } ] },
      { say: "ruth", en: "My husband was a fisherman. The sea always gives things back. Just never in the shape you want.", vi: "Chồng tôi là ngư dân. Biển rồi sẽ trả lại mọi thứ. Chỉ là không bao giờ trả theo hình dạng mình mong." },
      { review: true },
      { hide: "*" },
      { n: { en: "A social worker walks Kieran to a car. Halfway there, he stops — and looks back at you.", vi: "Một nhân viên xã hội dẫn Kieran ra xe. Đi được nửa đường, cậu dừng lại — và ngoái nhìn bạn." } },
      { show: "kieran", at: "c", face: "sad" },
      { if: s => s.f.kieran >= 1, then: [
        { say: "kieran", whisper: true, en: "…Sam told me to run.", vi: "…Sam bảo em chạy." },
        { fx: "shake" },
        { think: { en: "Sam.", vi: "Sam." } },
        { think: { en: "Your Sam.", vi: "Sam của bạn." } },
        { set: { end_sam: 1 } } ],
        else: [
        { n: { en: "He says nothing. But as he turns away, his phone lights up in his hand.", vi: "Cậu không nói gì. Nhưng lúc quay đi, điện thoại trong tay cậu sáng lên." } },
        { cg: "cg-lockscreen" },
        { n: { en: "The lock screen: four young men on a fishing boat, smiling. The one on the left is Sam.", vi: "Màn hình khoá: bốn chàng trai trên một chiếc thuyền, đang cười. Người bên trái là Sam." } },
        { fx: "shake" },
        { think: { en: "Sam. Alive — at least when this photo was taken.", vi: "Sam. Còn sống — ít nhất là lúc chụp tấm ảnh này." } },
        { cg: null },
        { set: { end_photo: 1 } } ] },
      { truth: "T4" },
      { hide: "kieran" },
      { n: { en: "The car door shuts. The car disappears into the last of the fog.", vi: "Cửa xe đóng lại. Chiếc xe khuất vào làn sương cuối cùng." } },
      { if: s => s.f.outcome === "arrest", then: [{ end: "c1_arrest" }], else: [{ end: "c1_doubt" }] },
    ],
  },

  endings: {
    c1_arrest: { ch: 1, title: { en: "Tom Arrested", vi: "Tom bị bắt" },
      sum: { en: "The captain is in a cell. The real killer sleeps well.", vi: "Thuyền trưởng vào xà lim. Kẻ thật sự vẫn ngủ ngon." },
      text: { en: "A captain is in a cell. A boy is in a car. And somewhere in this town, the person who was really on the pier at 1:47 is sleeping very well.", vi: "Một thuyền trưởng nằm trong xà lim. Một cậu bé ngồi trên xe. Và đâu đó trong thị trấn, kẻ thật sự có mặt trên cầu tàu lúc 1:47 vẫn đang ngủ rất ngon." } },
    c1_doubt: { ch: 1, title: { en: "Reasonable Doubt", vi: "Còn nghi vấn" },
      sum: { en: "No arrest. Your notebook kept the case open.", vi: "Không ai bị bắt. Sổ tay của bạn giữ vụ án còn mở." },
      text: { en: "No arrest. No answers. Just a shoe with green laces, a stopped watch — and a name you haven't heard out loud in four months.", vi: "Không ai bị bắt. Chưa có lời giải. Chỉ có một chiếc giày dây xanh, một chiếc đồng hồ đã dừng — và một cái tên bốn tháng nay bạn chưa nghe ai gọi." } },
  },
  next: { en: "Chapter 2 — Fish and Lies", vi: "Chương 2 — Cá và lời dối" },
});
