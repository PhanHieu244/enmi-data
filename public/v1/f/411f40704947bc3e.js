// THE STATEMENT — CHƯƠNG 1 (+ mở đầu) “Lost for Words” (định dạng: tools/games/_lib/story/README.md; kịch bản: docs/games/the-statement-KICH-BAN.md)
// Người dùng chốt 28/10: mọi nhân vật cùng 1 nước, nói 1 thứ tiếng (thứ tiếng đang học — tiếng Anh trước); đổi thứ tiếng học thì cốt truyện
// KHÔNG đổi (chỉ thêm bản lời thoại). Vai: THÁM TỬ TẬP SỰ. Tiếng Anh RÕ RÀNG, không tiếng lóng. Trọng tâm: điều tra + suy luận.
// Lời thoại: en (tự nhiên) · easy (dễ hơn, chỉ câu khó) · vi (nghĩa). Lời dẫn: theo ngôn ngữ gốc. [[từ]] = từ trong sổ từ vụ án.
// câu hỏi Owen trên cầu tàu — dùng cho lần chạm đầu (then) và chạm lại (again); once nhớ theo id (tên riêng theo chương: các file chương nạp chung 1 phạm vi)
const CH1_OWEN_Q = { choice: [
    { speech: true, id: "ow_pub", tag: "open", en: "What happened at the pub last night?", vi: "Tối qua ở quán đã xảy ra chuyện gì?", once: true, then: [
      { say: "owen", en: "Tom and Pete had a big fight. People heard Tom shout 'Run!' — really loud.", easy: "Tom and Pete fought. Tom shouted 'Run!' very loudly.", vi: "Tom với Pete cãi nhau to. Người ta nghe Tom hét “Chạy đi!” — to lắm." },
      { think: { en: "'Run!'? In an argument about money? That's strange.", vi: "Cãi nhau chuyện tiền mà lại hét “Chạy đi!”? Lạ thật." } },
      { set: { heard_run: 1 } }, { item: "leg_it" }, { truth: "T1" } ] },
    { speech: true, id: "ow_hand", tag: "direct", en: "What happened to your hand?", vi: "Tay anh bị sao vậy?", once: true, then: [
      { n: { en: "His [[knuckles]] are red and cut. The cuts are fresh.", vi: "Các khớp ngón tay anh ta đỏ và trầy xước. Vết còn mới." }, on: "owen" },
      { say: "owen", face: "smile", en: "Football on Sunday. You should see the other guy!", vi: "Đá bóng hôm Chủ nhật. Phải xem gã kia thế nào kìa!" },
      { think: { en: "Wednesday. Sunday was three days ago. The cuts look recent; note the mismatch, not a verdict.", vi: "Thứ Tư. Chủ nhật đã qua ba ngày. Vết xước trông còn mới; ghi nhận điểm không khớp, chưa kết luận." } },
      { set: { saw_knuckles: 1 } } ] },
    { speech: true, en: "Nothing. Thanks for the coffee.", vi: "Không có gì. Cảm ơn ly cà phê." },
], loop: true };

StoryEngine.chapter({
  items: {
    phone: { icon: "phone", name: { en: "Your phone", vi: "Điện thoại của bạn" }, desc: { en: "Your phone has a torch, a camera and a recorder. Keep an eye on the charge when recording.", vi: "Điện thoại có đèn pin, camera và máy ghi âm. Cần chú ý pin khi ghi âm." } },
    sam_photo: { icon: "photo", keep: true, name: { en: "Photo of Sam", vi: "Ảnh của Sam" }, desc: { en: "Your little brother Sam, 19. He left home four months ago. His last postcard came from Port Halden.", vi: "Em trai bạn, Sam, 19 tuổi. Bỏ nhà đi bốn tháng trước. Tấm bưu thiếp cuối cùng gửi từ Port Halden." } },
    watch: { icon: "clock", name: { en: "Stopped watch", vi: "Đồng hồ đã dừng" }, desc: { en: "A water-damaged digital watch photographed on the victim's wrist. Its display is frozen at 1:47. This is a lead, not a certified time of death.", vi: "Ảnh đồng hồ điện tử ngấm nước trên cổ tay nạn nhân. Màn hình đứng ở 1:47. Đây là đầu mối, chưa phải thời điểm tử vong được xác nhận." } },
    id_card: { icon: "card", name: { en: "ID card", vi: "Thẻ căn cước" }, desc: { en: "Pete Nolan, 34. A big man with a thick red beard.", vi: "Pete Nolan, 34 tuổi. Người to lớn, râu đỏ rậm." } },
    trainer: { icon: "shoe", name: { en: "White trainer", vi: "Chiếc giày trắng" }, desc: { en: "A small white trainer with bright green laces. Size 8. Found on the steps.", vi: "Chiếc giày thể thao trắng nhỏ, dây xanh lá. Cỡ 8. Tìm thấy trên bậc thang." } },
    hook: { icon: "doc", name: { en: "Empty hook", vi: "Móc áo trống" }, desc: { en: "On the Marta, a row of yellow oilskins. One hook is empty.", vi: "Trên tàu Marta, một hàng áo vải dầu vàng. Một cái móc trống." } },
    leg_it: { icon: "doc", name: { en: "Owen's story", vi: "Lời kể của Owen" }, desc: { en: "Owen says Tom Ward shouted 'Run!' at the pub during the argument.", vi: "Owen nói Tom Ward hét “Chạy đi!” ở quán lúc cãi nhau." } },
    jim_note: { icon: "doc", name: { en: "Jim's words", vi: "Lời của Jim" }, desc: { en: "Jim: Tom and Pete argued about money. Nobody shouted 'Run!'. Pete left for the airport before midnight.", vi: "Jim: Tom và Pete cãi nhau chuyện tiền. Không ai hét “Chạy đi!”. Pete ra sân bay trước nửa đêm." } },
    notes: { icon: "pen", name: { en: "Your notebook", vi: "Sổ tay của bạn" }, desc: { en: "Your contemporaneous notes, with the interview recording reference. Any correction must preserve the original and say why it changed.", vi: "Ghi chép lúc lấy lời khai, kèm mã bản ghi âm. Mọi đính chính phải giữ bản gốc và nêu lý do sửa." } },
    voicemail: { icon: "phone", name: { en: "Voice message", vi: "Tin nhắn thoại" }, desc: { en: "'Don't go back to Gull Point tonight. They know. The van comes Thursday, four a.m.'", vi: "“Tối nay đừng về Gull Point. Chúng nó biết rồi. Xe tải đến thứ Năm, 4 giờ sáng.”" } },
  },

  truths: {
    T1: { name: { en: "'Run!'", vi: "“Chạy đi!”" }, text: { en: "Owen attributes the words 'Run!' to Tom at the pub. Keep the source attached to the claim; another witness may confirm or contradict it.", vi: "Owen nói Tom hét “Chạy đi!” ở quán. Phải giữ tên người cung cấp lời kể; nhân chứng khác có thể xác nhận hoặc bác lại." } },
    T2: { name: { en: "Danny", vi: "Danny" }, text: { en: "Kieran recognises Danny's distinctive green laces. Danny is now a possible identification; the mortuary must confirm it.", vi: "Kieran nhận ra dây giày xanh đặc trưng của Danny. Cậu ấy là một khả năng nhận dạng; nhà xác cần xác nhận." } },
    T3: { name: { en: "Gull Point", vi: "Gull Point" }, text: { en: "Kieran sleeps at Gull Point, an old fish factory where nobody is supposed to live. He is terrified someone will find out.", vi: "Kieran ngủ lén ở Gull Point — một xưởng cá cũ bỏ hoang. Cậu sợ đến mức run lên khi nghĩ có người biết chuyện." } },
    T4: { name: { en: "Sam", vi: "Sam" }, text: { en: "Kieran knows Sam. You now have a link between your brother and the harbour witnesses; how recent it is depends on what Kieran told you.", vi: "Kieran biết Sam. Bạn đã có mối liên hệ giữa em trai và các nhân chứng ở bến cảng; nó mới đến đâu còn tuỳ lời Kieran kể." } },
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
    { ch: 0, t: { en: "Six months from now, a lawyer holds up a statement with your signature: is it word for word what the witness said?", vi: "Sáu tháng nữa, một luật sư giơ biên bản có chữ ký của bạn: đây có đúng từng chữ nhân chứng đã nói?" } },
    { ch: 1, t: { en: "You are a trainee detective, new in the port town of Port Halden. Secretly, you came to find your brother Sam, missing for four months.", vi: "Bạn là thám tử tập sự, mới về thị trấn cảng Port Halden. Lý do thầm kín: tìm em trai Sam, mất liên lạc bốn tháng." } },
    { ch: 1, when: "c1_pier", t: { en: "3 a.m.: a body under the north pier. The wallet says Pete Nolan, a deckhand. DS Owen Price already blames his captain, Tom Ward.", vi: "3 giờ sáng: một thi thể dưới cầu tàu phía bắc. Ví ghi Pete Nolan, thuỷ thủ. Trung sĩ Owen Price đã đổ cho thuyền trưởng Tom Ward." } },
    { ch: 1, if: s => s.has("trainer"), t: { en: "With your phone's torch, you found a small white trainer with green laces on the steps.", vi: "Nhờ đèn pin điện thoại, bạn thấy một chiếc giày trắng nhỏ dây xanh trên bậc thang." } },
    { ch: 1, if: s => s.f.doubt_id, t: { en: "You flagged a mismatch between the ID photograph and the body. The wallet alone could not identify the victim.", vi: "Bạn nhận ra điểm không khớp giữa ảnh căn cước và thi thể. Một chiếc ví chưa đủ để nhận dạng nạn nhân." } },
    { ch: 1, if: s => s.f.heard_run, t: { en: "Owen says Tom shouted 'Run!' at the pub.", vi: "Owen kể Tom hét “Chạy đi!” ở quán." } },
    { ch: 1, if: s => s.f.detour === "car", t: { en: "You rode with the witness, Kieran. Away from the police, he asked if he could trust you. His wristband said '14·02'.", vi: "Bạn đi cùng xe với nhân chứng Kieran. Xa cảnh sát, cậu hỏi có tin được bạn không. Vòng tay ghi “14·02”." } },
    { ch: 1, if: s => s.f.detour === "stay", t: { en: "You stayed on the pier — and saw Owen secretly turn the CCTV camera back down.", vi: "Bạn ở lại cầu tàu — và thấy Owen lén xoay camera chĩa xuống lại." } },
    { ch: 1, if: s => s.f.detour === "pub", t: { en: "At The Anchor, Jim said Tom and Pete argued about money, Pete flew home this morning — and nobody shouted 'Run!'.", vi: "Ở The Anchor, Jim kể Tom và Pete cãi nhau chuyện tiền, Pete ra sân bay trước nửa đêm — và không ai hét “Chạy đi!”." } },
    { ch: 1, if: s => s.f.owen_lied, t: { en: "You proved Owen's story about the pub was false. Why would he lie?", vi: "Bạn chứng minh lời kể của Owen về quán rượu là sai. Vì sao anh ta nói dối?" } },
    { ch: 1, if: s => s.f.push === "away", t: { en: "You wrote down exactly what Kieran said: the man in yellow 'pushed him away'.", vi: "Bạn ghi đúng lời Kieran: người áo vàng “đẩy anh ấy ra”." } },
    { ch: 1, if: s => s.f.push === "in", t: { en: "You wrote that the man in yellow pushed the victim 'into the water' — words Kieran never said.", vi: "Bạn ghi người áo vàng đẩy nạn nhân “xuống nước” — điều Kieran chưa từng nói." } },
    { ch: 1, if: s => s.f.objected, t: { en: "You stopped Owen's leading question. Ruth backed you. Owen did not forget it.", vi: "Bạn chặn câu hỏi dẫn dắt của Owen. Ruth đứng về phía bạn. Owen thì nhớ chuyện đó." } },
    { ch: 1, if: s => s.f.saw_danny, t: { en: "Shown the trainer, Kieran whispered: 'That's Danny's.' The dead boy is not Pete.", vi: "Thấy chiếc giày, Kieran thì thầm: “Của Danny.” Người chết không phải Pete." } },
    { ch: 1, if: s => s.f.told_sam, t: { en: "You told Ruth — and Owen — about your brother Sam.", vi: "Bạn đã nói với Ruth — và cả Owen — về em trai Sam." } },
    { ch: 1, if: s => s.f.gp === "told", t: { en: "Kieran begged you to keep a secret. You put 'Gull Point' in the statement, in front of Owen.", vi: "Kieran xin bạn giữ bí mật. Bạn ghi “Gull Point” vào biên bản, ngay trước mặt Owen." } },
    { ch: 1, if: s => s.f.gp === "lie", t: { en: "Kieran begged you to keep a secret. You lied to Ruth to protect him.", vi: "Kieran xin bạn giữ bí mật. Bạn nói dối Ruth để bảo vệ cậu." } },
    { ch: 1, if: s => s.f.gp === "private", t: { en: "You made a private safeguarding report to Ruth. The exact words were preserved; the sleeping place stayed out of the circulating draft.", vi: "Bạn báo riêng với Ruth để bảo vệ nhân chứng. Lời nói được giữ nguyên; chỗ ngủ không nằm trong dự thảo lưu hành." } },
    { ch: 1, if: s => s.f.fixed_name, t: { en: "Owen's typed statement said Kieran named Tom Ward. Your notebook proved he never did.", vi: "Biên bản Owen đánh máy ghi Kieran đã nêu tên Tom Ward. Sổ tay của bạn chứng minh cậu chưa từng nói." } },
    { ch: 1, if: s => s.f.signed_bad, t: { en: "You signed a statement with words the witness never said.", vi: "Bạn đã ký một biên bản có những chữ nhân chứng chưa từng nói." } },
    { ch: 1, if: s => s.f.van, t: { en: "A voice message on Kieran's phone: 'The van comes Thursday, four a.m.'", vi: "Tin nhắn thoại trong máy Kieran: “Xe tải đến thứ Năm, 4 giờ sáng.”" } },
    { ch: 1, if: s => s.f.outcome === "arrest", t: { en: "At dawn, Tom Ward was arrested. He did not say a word.", vi: "Rạng sáng, Tom Ward bị bắt. Ông không nói một lời." } },
    { ch: 1, if: s => s.f.outcome === "doubt", t: { en: "Ruth refused an arrest on that statement alone. Tom agreed to a voluntary interview.", vi: "Ruth không chấp nhận bắt người chỉ dựa vào bản lời khai đó. Tom đồng ý tới làm việc tự nguyện." } },
    { ch: 1, if: s => s.f.end_sam, t: { en: "As Kieran left, he said the words that changed everything: 'Sam told me to run.'", vi: "Lúc rời đi, Kieran nói câu làm mọi thứ đảo lộn: “Sam bảo em chạy.”" } },
    { ch: 1, if: s => s.f.end_photo, t: { en: "On Kieran's lock screen: four young men on a boat. One of them was Sam.", vi: "Trên màn hình khoá của Kieran: bốn chàng trai trên một con thuyền. Một người là Sam." } },
  ],

  flow: [
    { ch: 1, row: 0, id: "pro", kind: "cp", scene: "court", label: { en: "Six months from now", vi: "Sáu tháng nữa" }, sum: { en: "The courtroom. Word for word?", vi: "Phòng xử. Đúng từng chữ?" } },
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
      { n: { en: "Newcastle Crown Court. Six months from now.", vi: "Toà án Hình sự Newcastle. Sáu tháng nữa." } },
      { n: { en: "The courtroom is silent. Forty people are looking at you.", vi: "Phòng xử im phăng phắc. Bốn mươi người đang nhìn bạn." } },
      { show: "judge", at: "c" },
      { say: "judge", en: "Detective. This is the witness statement. Your signature is at the bottom.", easy: "Detective, this is the statement. You signed it.", vi: "Thưa thám tử. Đây là biên bản lời khai. Chữ ký của {ac} ở cuối trang." },
      { say: "judge", en: "Is this, word for word, what the witness told you?", easy: "Is every word here what the witness said?", vi: "Đây có đúng từng chữ nhân chứng đã nói với {ac} không?" },
      { think: { en: "You recognise the page. The version you signed. The words you chose to challenge — and the ones you let pass.", vi: "Bạn nhận ra trang giấy. Bản bạn đã ký. Những chữ bạn phản đối — và những chữ bạn đã để nguyên." } },
      { think: { en: "What you say next will have to survive the recording. And your own memory.", vi: "Điều bạn nói tiếp theo phải khớp với bản ghi âm. Và với chính ký ức của bạn." } },
      { choice: [
        { speech: true, en: "Yes. Word for word.", vi: "Đúng. Từng chữ một.", set: { pro: 1 } },
        { speech: true, en: "No. Not exactly.", vi: "Không. Không hẳn.", set: { pro: 2 } },
      ], timer: 9, timeout: [{ think: { en: "You open your mouth. Nothing comes out.", vi: "Bạn mở miệng. Không thốt ra được chữ nào." } }] },
      { sfx: "sting" },
      { title: { en: "SIX MONTHS EARLIER", vi: "SÁU THÁNG TRƯỚC" } },
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
      { think: { en: "'I have to go.' He said it too fast. Like someone was standing behind him.", vi: "“Em phải đi rồi.” Nó nói vội quá — như thể có ai đang đứng ngay sau lưng." } },
      { think: { en: "The last thing you said to Sam was: 'Go, then. Don't come back.' He didn't.", vi: "Câu cuối bạn nói với Sam là: “Đi đi. Đừng về nữa.” Và nó không về thật." } },
      { item: "sam_photo", quiet: true },
      { n: { en: "3:12 a.m. The phone buzzes in your hand.", vi: "3 giờ 12. Điện thoại rung trong tay bạn." } },
      { say: "ruth", phone: true, en: "It's Calder. We have a body under the north [[pier]]. Get dressed. You're a detective now.", easy: "This is Ruth Calder. There is a dead body under the north pier. Come now.", vi: "Calder đây. Có một thi thể dưới cầu tàu phía bắc. Mặc đồ đi. Giờ {cc} là thám tử rồi." },
      { choice: [
        { speech: true, en: "I'll be there in ten minutes.", vi: "Mười phút nữa tôi có mặt.", add: { ruth: 1 }, then: [
          { say: "ruth", phone: true, en: "Good. Follow the blue lights.", vi: "Tốt. Cứ theo đèn xanh mà đến." } ] },
        { speech: true, en: "A body? Who is it?", vi: "Thi thể? Là ai vậy?", then: [
          { think: { en: "Please. Please don't let it be Sam.", vi: "Xin đừng. Xin đừng là Sam." } },
          { say: "ruth", phone: true, en: "That's what we need to find out. Hurry.", vi: "Đó là điều ta cần tìm ra. Nhanh lên." } ] },
        { speech: true, en: "It's three in the morning…", vi: "Giờ là ba giờ sáng mà…", add: { ruth: -1 }, then: [
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
      { think: { en: "The first friendly face in a week.", vi: "Gương mặt thân thiện đầu tiên bạn gặp kể từ khi đến đây." } },
      { say: "ruth", en: "A fisherman found the body at two-forty. The wallet says Pete Nolan, thirty-four. A [[deckhand]] on that boat — the Marta.", easy: "A fisherman found the body at 2:40. The wallet says Pete Nolan, age 34. He works on that boat, the Marta.", vi: "Một ngư dân tìm thấy thi thể lúc 2 giờ 40. Ví ghi Pete Nolan, 34 tuổi. Thuỷ thủ trên con tàu kia — tàu Marta." },
      { think: { en: "Pete, perhaps. You catch yourself treating a wallet as an identification because you need it not to be Sam.", vi: "Có thể là Pete. Bạn chợt nhận ra mình đang coi chiếc ví là kết quả nhận dạng, chỉ vì quá mong người chết không phải Sam." } },
      { say: "owen", en: "His captain, Tom Ward, had a big argument with him at the pub last night. We [[arrest]] Tom at dawn. Easy.", vi: "Thuyền trưởng của anh ta, Tom Ward, cãi nhau to với anh ta ở quán tối qua. Rạng sáng bắt Tom. Dễ ợt." },
      { say: "ruth", face: "cold", en: "We arrest people when we have [[evidence]], Owen. Not before.", vi: "Ta bắt người khi có bằng chứng, Owen. Không phải trước đó." },
      { say: "ruth", en: "A sixteen-year-old [[witness]] is being checked by the medic. Start with the pier: what can we actually establish?", easy: "A boy saw something. A medic is helping him. First, look at the pier. What do we know?", vi: "Một nhân chứng mười sáu tuổi đang được nhân viên y tế kiểm tra. Bắt đầu ở cầu tàu: ta thực sự xác định được điều gì?" },
      { explore: {
        goal: { en: "Examine the pier. Keep observations separate from assumptions.", vi: "Khám nghiệm cầu tàu. Tách điều quan sát được khỏi suy đoán." },
        need: 3, done: { en: "Done searching", vi: "Xong khám xét" },
        spots: [
          { id: "body", x: 34, y: 60, clue: true, label: { en: "Body", vi: "Thi thể" }, then: [
            { cg: "cg-body" },
            { n: { en: "A shape under a white [[sheet]]. One hand lies outside it.", vi: "Thi thể nằm dưới tấm vải trắng, một bàn tay thò ra ngoài." } },
            { n: { en: "The wrist is slender. A cheap digital watch is wet inside; its display is frozen at 1:47. You photograph it without touching the body.", vi: "Cổ tay mảnh. Đồng hồ điện tử rẻ tiền ngấm nước bên trong; màn hình đứng ở 1:47. Bạn chụp ảnh, không chạm vào thi thể." } },
            { cg: null },
            { item: "watch" } ],
            again: [
              [{ think: { en: "1:47 on a damaged watch. It could help narrow the timeline, once other evidence supports it.", vi: "1:47 trên một chiếc đồng hồ hỏng. Nó có thể giúp thu hẹp thời gian, nếu có bằng chứng khác đối chiếu." } }],
              [{ think: { en: "The wrist does not resemble the build in the ID photograph. Worth checking; bodies are not identified by build alone.", vi: "Cổ tay không giống vóc dáng trong ảnh căn cước. Đáng kiểm tra; không thể nhận dạng người chỉ bằng vóc dáng." } }] ] },
          { id: "wallet", x: 56, y: 50, clue: true, label: { en: "Evidence bag", vi: "Túi tang vật" }, then: [
            { cg: "cg-wallet" },
            { say: "ruth", en: "The wallet. Sixty pounds still inside. Nothing was taken.", vi: "Cái ví đây. Bên trong vẫn còn sáu mươi bảng Anh. Không mất gì cả." },
            { n: { en: "The ID card shows Pete Nolan: a big man with a thick red [[beard]].", vi: "Ảnh trên thẻ căn cước: Pete Nolan — một người đàn ông to lớn, râu đỏ rậm." } },
            { think: { en: "The cash is still there. That weakens a simple theft motive; it does not explain who carried the wallet.", vi: "Tiền còn nguyên. Động cơ cướp tiền ít thuyết phục hơn, nhưng chưa rõ ai đã mang chiếc ví." } },
            { cg: null },
            { item: "id_card" } ],
            again: [
              [{ say: "ruth", en: "Still checking the wallet? Good. The contents are recorded. Now we need to establish whose pocket it came from.", vi: "Vẫn kiểm tra ví à? Tốt. Đồ bên trong đã được ghi nhận. Giờ cần biết nó nằm trong túi áo của ai." }],
              [{ think: { en: "Pete Nolan. Thirty-four. Thick red beard. Remember that face.", vi: "Pete Nolan. 34 tuổi. Râu đỏ rậm. Nhớ lấy gương mặt đó." } }] ] },
          { id: "steps", x: 80, y: 62, clue: true, dark: true, label: { en: "Dark steps", vi: "Bậc thang tối" },
            then: [
              { cg: "cg-steps" },
              { n: { en: "Stone steps go down to the water. It's too dark to see anything.", vi: "Bậc đá dẫn xuống mặt nước. Tối quá, không thấy gì." } },
              { think: { en: "Too dark. I need something to light it up.", vi: "Tối quá. Cần thứ gì đó để soi." } },
              { cg: null } ],
            stuck: [{ think: { en: "Still pitch black. Your phone has a torch — hold it from your bag, then tap the steps.", vi: "Vẫn tối om. Điện thoại có đèn pin — cầm nó lên từ túi đồ rồi chạm vào bậc thang." } }],
            again: [[{ think: { en: "Nothing else on the steps. Only that one small shoe.", vi: "Trên bậc thang không còn gì khác. Chỉ có chiếc giày nhỏ đó." } }]],
            use: { phone: [
              { n: { en: "You turn on your phone's [[torch]].", vi: "Bạn bật đèn pin điện thoại." } },
              { cg: "cg-sandal" },
              { n: { en: "There — half in the water: a small white [[trainer]] with bright green [[laces]].", vi: "Kia — nửa chìm dưới nước: một chiếc giày thể thao trắng nhỏ, dây xanh lá." } },
              { think: { en: "A single shoe. It might belong to the victim, a witness, or someone else. Keep the exact location.", vi: "Một chiếc giày lẻ. Có thể là của nạn nhân, nhân chứng, hoặc người khác. Phải ghi đúng vị trí tìm thấy." } },
              { cg: null },
              { item: "trainer" } ] } },
          { id: "boat", x: 14, y: 44, clue: true, label: { en: "The Marta", vi: "Tàu Marta" }, then: [
            { cg: "cg-hooks" },
            { n: { en: "The Marta. A row of yellow [[oilskin]] coats hangs by the door. One [[hook]] is empty.", vi: "Tàu Marta. Một hàng áo vải dầu vàng treo cạnh cửa. Một cái móc trống." } },
            { think: { en: "An empty hook. It shows a coat is absent, not when it was taken or who wore it.", vi: "Một móc trống. Nó cho thấy thiếu áo, chưa cho biết áo bị lấy lúc nào hay ai đã mặc." } },
            { cg: null },
            { item: "hook" } ],
            again: [
              [{ think: { en: "One hook empty. One yellow coat gone.", vi: "Một cái móc trống. Một chiếc áo vàng biến mất." } }],
              [{ n: { en: "The Marta rocks gently. The cabin door is locked.", vi: "Tàu Marta khẽ chòng chành. Cửa cabin khoá chặt." } }] ] },
          { id: "cam", x: 86, y: 18, clue: true, label: { en: "Camera", vi: "Camera" }, then: [
            { cg: "cg-cctv" },
            { n: { en: "A [[CCTV]] camera on the lamp post. It is pointing at the sky.", vi: "Camera giám sát trên cột đèn. Nó đang chĩa lên trời." } },
            { cg: null },
            { say: "owen", en: "The wind does that. It happens all the time here.", vi: "Gió đấy. Ở đây chuyện thường." },
            { think: { en: "But there is almost no wind tonight.", vi: "Nhưng đêm nay gần như không có gió." } },
            { set: { saw_cam: 1 } } ],
            again: [
              [{ think: { en: "Pointing at the sky. On a night with almost no wind.", vi: "Chĩa thẳng lên trời. Trong một đêm gần như lặng gió." } }],
              [{ say: "owen", en: "Still staring at that camera? Come on, it's freezing.", vi: "Vẫn nhìn cái camera đó à? Thôi nào, lạnh cóng rồi đây." }] ] },
          { id: "owen", x: 64, y: 34, label: { en: "Talk to Owen", vi: "Nói chuyện với Owen" },
            then: [CH1_OWEN_Q],
            // chạm lại: còn câu chưa hỏi → hỏi tiếp; hỏi hết rồi → Owen nói 1 câu khác (không lặp lại cả màn hỏi)
            again: [[
              { if: s => !s.R.used["o:ow_pub"] || !s.R.used["o:ow_hand"], then: [{ say: "owen", en: "Need something else?", vi: "Cần gì nữa không?" }, CH1_OWEN_Q],
                else: [{ say: "owen", face: "smile", en: "I have told you everything I know. More coffee?", vi: "Tôi kể hết những gì tôi biết rồi. Thêm cà phê không?" }] } ]],
            use: { sam_photo: [
              { say: "me", en: "Have you seen this young man? He's my brother.", vi: "Anh đã thấy cậu này bao giờ chưa? Em trai tôi." },
              { n: { en: "Owen looks at the photo. For one second too long.", vi: "Owen nhìn tấm ảnh — lâu hơn bình thường một chút." }, on: "owen" },
              { say: "owen", face: "smile", en: "No, sorry. Lots of young lads come and go here. I'll keep an eye out.", vi: "Không, xin lỗi. Ở đây nhiều cậu trai đến rồi đi lắm. Tôi sẽ để ý giúp." },
              { set: { owen_sam: 1 } }, { add: { sus: 1 } } ] } },
        ],
      } },
      // SUY LUẬN 1: thi thể có phải Pete?
      { say: "ruth", en: "Well, detective? Tell me one thing you noticed.", vi: "Thế nào, thám tử? Kể tôi nghe một điều {cc} để ý thấy." },
      { deduce: {
        q: { en: "What makes the wallet identification unsafe to accept yet?", vi: "Điều gì khiến ta chưa thể nhận dạng nạn nhân chỉ bằng chiếc ví?" },
        a: [["id_card", "watch"], ["id_card", "trainer"]],
        hint: { en: "Compare the ID card with what you saw on the body.", vi: "So thẻ căn cước với điều bạn thấy trên thi thể." },
        missing: { en: "You may have missed something on the pier — the body, the evidence bag, or the dark steps.", vi: "Có thể bạn đã bỏ sót gì đó trên cầu tàu — thi thể, túi tang vật, hay bậc thang tối." },
        tries: 3,
        ok: [
          { set: { doubt_id: 1 } }, { add: { ruth: 2 } },
          { say: "me", en: "The ID photograph and the body don't seem to match. We need an independent identification before we call him Pete.", easy: "The body may not be the man in the photo. We need to check who he is.", vi: "Ảnh căn cước và thi thể có vẻ không khớp. Cần nhận dạng độc lập trước khi gọi cậu ấy là Pete." },
          { say: "ruth", face: "soft", en: "Good. A reason to check, not a name guessed twice. I'll ask the identification team to compare the records.", vi: "Tốt. Một lý do cần kiểm tra, không phải đoán tên lần nữa. Tôi sẽ nhờ tổ nhận dạng đối chiếu hồ sơ." } ],
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
      { show: "kieran", at: "c", face: "scared" },
      { n: { en: "Rain on the roof. The boy sits in the back, wrapped in a grey blanket.", vi: "Mưa gõ lên nóc xe. Cậu bé ngồi ghế sau, quấn chăn xám." } },
      { show: "kieran", at: "c", face: "scared" },
      { say: "kieran", face: "scared", en: "Are you police too? You don't look like police.", easy: "Are you a police officer? You don't look like one.", vi: "{Ac} cũng là cảnh sát à? Trông {ac} không giống cảnh sát lắm." },
      { choice: [
        { speech: true, tag: "kind", en: "I'm new. I just want to help you.", vi: "Tôi mới vào nghề. Tôi chỉ muốn giúp em.", add: { kieran: 1 }, then: [
          { say: "kieran", en: "Nobody here helps kids like me.", vi: "Ở đây chẳng ai giúp mấy đứa như em." } ] },
        { speech: true, tag: "direct", en: "Yes. And I need to know what you saw.", vi: "Đúng. Và tôi cần biết em đã thấy gì.", add: { ruth: 1 }, then: [
          { say: "kieran", face: "sad", en: "…Okay. I understand.", vi: "…Vâng. Em hiểu." } ] },
      ] },
      { n: { en: "He rubs his wrist. A paper festival wristband: 'KIERAN · 14·02'.", vi: "Cậu xoa cổ tay, nơi có chiếc vòng giấy vào cửa lễ hội ghi: “KIERAN · 14·02”." }, on: "kieran" },
      { think: { en: "The fourteenth of February. His birthday, maybe.", vi: "Mười bốn tháng Hai. Có lẽ là sinh nhật cậu." } },
      { set: { saw_band: 1 } },
      { go: "interview" },
    ],
    d_stay: [
      { bg: "pier" },
      { n: { en: "You stand in the shadow of a container and drink your terrible coffee.", vi: "Bạn đứng trong bóng một chiếc container, uống cốc cà phê dở tệ." } },
      { show: "ruth", at: "l", face: "cold" }, { show: "owen", at: "r", face: "cold" },
      { n: { en: "Ruth leaves with the doctor. Owen is alone by the lamp post.", vi: "Ruth đi cùng bác sĩ. Owen ở lại một mình bên cột đèn." } },
      { hide: "ruth" },
      { cg: "cg-camera" },
      { n: { en: "He looks left. Right. Then he reaches up and turns the camera back down to the pier.", vi: "Anh ta nhìn quanh. Rồi với tay lên, xoay camera chĩa trở lại xuống cầu tàu." } },
      { think: { en: "'The wind does that.'", vi: "“Gió đấy” cơ đấy." } },
      { cg: null },
      { set: { saw_owen_cam: 1 } },
      { show: "owen", at: "c", face: "smile" },
      { say: "owen", face: "smile", en: "Oh! You scared me. I'm just fixing the camera for the morning team. Coffee okay?", vi: "Ồ! Làm tôi giật mình. Tôi chỉnh camera cho ca sáng thôi. Cà phê ổn chứ?" },
      { choice: [
        { speech: true, tag: "polite", en: "It's fine. Thanks.", vi: "Ổn. Cảm ơn.", then: [{ think: { en: "Smile back. Remember everything.", vi: "Cười lại. Nhớ hết mọi thứ." } }] },
        { speech: true, tag: "direct", en: "Did the camera record anything tonight?", vi: "Đêm nay camera có quay được gì không?", add: { sus: 2 }, then: [
          { say: "owen", face: "cold", en: "Pointing at the sky? Only clouds. Come on — the boy is ready.", vi: "Chĩa lên trời thì chỉ quay được mây. Đi nào — cậu bé xong rồi." } ] },
      ] },
      { go: "interview" },
    ],
    d_pub: [
      { bg: "pub" },
      { show: "jim", at: "c" },
      { n: { en: "The Anchor is closed, but a light is still on. A big old man is putting chairs on the tables.", vi: "Quán The Anchor đã đóng cửa nhưng đèn còn sáng. Một ông lớn tuổi to con đang xếp ghế lên bàn." } },
      { show: "jim", at: "c" },
      { say: "jim", en: "We're closed. Oh — you're with the police? Terrible news.", vi: "Đóng cửa rồi. Ồ — {cc} là cảnh sát à? Tin dữ thật." },
      { choice: [
        { speech: true, tag: "open", en: "Can you tell me about the argument last night?", vi: "Ông kể tôi nghe về trận cãi nhau tối qua được không?", then: [
          { say: "jim", en: "Tom owed Pete some money. They shouted, then they shook hands. Pete left for the airport before midnight.", easy: "Tom had to pay Pete. They shouted, then shook hands. Pete left for the airport before midnight.", vi: "Tom nợ Pete ít tiền. Họ quát nhau, rồi bắt tay. Pete ra sân bay trước nửa đêm rồi." },
          { think: { en: "Pete left for the airport before midnight. So why is his wallet under the pier?", vi: "Pete ra sân bay trước nửa đêm. Vậy sao ví anh ta lại ở dưới cầu tàu?" } },
          { set: { piotr_home: 1 } } ] },
      ] },
      { choice: [
        { speech: true, if: s => s.f.heard_run, tag: "direct", en: "Did Tom shout 'Run!'?", vi: "Tom có hét “Chạy đi!” không?", then: [
          { say: "jim", en: "'Run'? No. Nobody shouted that. Who told you?", vi: "“Chạy đi”? Không. Chẳng ai hét thế cả. Ai bảo {cc} vậy?" },
          { think: { en: "Owen did. Jim can contradict the pub story, but he cannot tell me what happened on the pier.", vi: "Là Owen kể. Jim có thể bác lại chuyện ở quán, nhưng không thể cho biết chuyện trên cầu tàu." } } ] },
        { speech: true, en: "Thank you. Good night.", vi: "Cảm ơn ông. Chúc ngủ ngon." },
      ], skipIfOne: true },
      { say: "jim", en: "Be careful. And your sergeant, Owen… he never pays for his drinks here. Think about that.", vi: "Cẩn thận nhé. À, anh trung sĩ Owen của {cc}… uống ở đây chẳng bao giờ trả tiền. Nghĩ đi." },
      { item: "jim_note" },
      { go: "interview" },
    ],

    interview: [
      { bg: "interview" },
      { hide: "*" },
      { n: { en: "Port Halden Police Station. Interview Room 2. 4:30 a.m. The medic has cleared a short initial account. A support worker sits beside Kieran, just outside your view; the recorder is running.", vi: "Đồn cảnh sát Port Halden. Phòng lấy lời khai số 2. 4 giờ 30 sáng. Nhân viên y tế đồng ý cho ghi nhận ngắn ban đầu. Một nhân viên hỗ trợ ngồi bên Kieran, ngoài góc nhìn của bạn; máy ghi âm đang chạy." } },
      { show: "kieran", at: "c", face: "scared" },
      { n: { en: "The boy holds a paper cup with both hands. His hands are shaking.", vi: "Cậu bé ôm cốc giấy bằng cả hai tay. Tay cậu run." } },
      { show: "ruth", at: "l" }, { show: "owen", at: "r" },
      { item: "notes", quiet: true },
      { cp: "c1_interview" },
      { say: "ruth", en: "I lead the interview. You take notes and ask follow-up questions. Kieran, you are a witness, not a prisoner. We can stop whenever you need.", vi: "Tôi phụ trách buổi lấy lời khai. {Cc} ghi chép và hỏi thêm. Kieran, em là nhân chứng, không phải người bị giam. Em cần nghỉ lúc nào thì nói." },
      { choice: [
        { speech: true, tag: "open", en: "Kieran, can you tell me what you saw tonight?", vi: "Kieran, em kể tôi nghe đêm nay em đã thấy gì được không?", add: { kieran: 1, ruth: 1 } },
        { speech: true, tag: "lead", en: "You saw the captain kill that man, didn't you?", vi: "Em thấy thuyền trưởng giết người đó, đúng không?", add: { ruth: -1 }, set: { led: 1 }, then: [
          { say: "ruth", face: "cold", en: "Don't put words in his mouth. Ask, don't tell.", vi: "Đừng nhét chữ vào miệng cậu ấy. Hỏi, đừng kể." } ] },
        { speech: true, tag: "press", en: "Stop wasting our time. What did you see?", vi: "Đừng làm mất thời gian. Em đã thấy gì?", add: { kieran: -1 }, then: [
          { n: { en: "Kieran pulls the blanket tighter.", vi: "Kieran kéo chăn quấn chặt hơn." }, on: "kieran" } ] },
      ] },
      { say: "kieran", face: "scared", en: "I… I didn't see anything.", vi: "Em… em không thấy gì hết." },
      { say: "owen", face: "angry", en: "Come on! You were running from the pier at two in the morning!", easy: "You ran from the pier at 2 a.m.!", vi: "Thôi đi! Em chạy khỏi cầu tàu lúc hai giờ sáng!" },
      { say: "ruth", face: "cold", en: "Lower your voice, Owen. Kieran can answer without being shouted at.", vi: "Hạ giọng xuống, Owen. Kieran có thể trả lời mà không bị quát." },
      { choice: [
        { speech: true, tag: "kind", en: "It's okay, Kieran. Take your time. Why were you on the pier?", vi: "Không sao đâu, Kieran. Cứ từ từ. Sao em lại ở cầu tàu?", add: { kieran: 1 } },
        { speech: true, tag: "press", en: "He's right. Why were you running?", vi: "Anh ấy nói đúng. Sao em lại chạy?", add: { kieran: -1, sus: -1 } },
      ] },
      { say: "kieran", en: "I go fishing there every night. It's quiet.", vi: "Đêm nào em cũng ra đó câu cá. Ở đó yên tĩnh." },
      { say: "ruth", en: "Then where is your fishing rod, Kieran?", vi: "Thế cần câu của em đâu, Kieran?" },
      { n: { en: "Kieran opens his mouth. Closes it. Then he starts to cry — very quietly, like someone who learned not to make noise.", vi: "Kieran mở miệng. Rồi ngậm lại. Rồi cậu khóc — rất khẽ, như người đã quen không được gây tiếng động." }, on: "kieran" },
      { cp: "c1_push" },
      { say: "kieran", face: "sad", en: "I saw two people on the pier. They were arguing. One was big, in a yellow coat. He pushed the other one away… and then I heard a splash. And I ran.", easy: "Two people were arguing on the pier. A big man in a yellow coat pushed the other one away. Then I heard a splash. I ran.", vi: "Em thấy hai người trên cầu tàu. Họ đang cãi nhau. Một người to con, mặc áo vàng. Ông ấy đẩy người kia ra… rồi em nghe tiếng ùm. Và em chạy." },
      { interpret: { dir: "rec", key: true, prompt: { en: "This line matters. Write exactly what he said.", vi: "Câu này quan trọng. Ghi đúng điều cậu ấy nói." }, opts: [
        { t: { en: "The witness saw two men arguing. A big man in a yellow coat pushed the other man away. Then the witness heard a splash.", vi: "Nhân chứng thấy hai người đàn ông đang cãi nhau. Một người to con mặc áo vàng đẩy người kia ra. Sau đó nhân chứng nghe thấy một tiếng ùm." }, acc: 2, set: { push: "away" } },
        { t: { en: "The witness saw two men arguing. A big man in a yellow coat pushed the other man off the pier.", vi: "Nhân chứng thấy hai người đàn ông đang cãi nhau. Một người to con mặc áo vàng đẩy người kia rơi khỏi cầu tàu." }, acc: 1, set: { push: "off" } },
        { t: { en: "The witness saw two men fighting. A big man in a yellow coat pushed the other man into the water.", vi: "Nhân chứng thấy hai người đàn ông đang đánh nhau. Một người to con mặc áo vàng đẩy người kia xuống nước." }, acc: 0, set: { push: "in" } },
      ], why: { vi: "Kieran nói “arguing” (cãi nhau bằng lời), không phải “fighting” (đánh nhau). Cậu nói “pushed him away” (đẩy ra) và “heard a splash” (nghe tiếng nước) — cậu KHÔNG thấy ai bị đẩy xuống nước.", en: "He said 'arguing', not 'fighting'. He said 'pushed him away' and 'heard a splash' — he did NOT see anyone pushed into the water." } } },
      { if: s => s.f.push === "in", then: [{ say: "owen", face: "smile", en: "Into the water. There it is.", vi: "Xuống nước. Đấy, rõ rồi." }] },
      { if: s => s.f.push !== "in", then: [{ say: "owen", en: "Away? Away where? Into the water, obviously.", vi: "Ra? Ra đâu? Xuống nước, rõ ràng thế." }] },
      { say: "owen", en: "A big man in a yellow coat. That's Tom Ward. He wears a yellow [[oilskin]] every day.", vi: "Người to con mặc áo vàng. Tom Ward đấy. Ngày nào hắn cũng mặc áo vải dầu vàng." },
      { if: s => s.has("hook"), then: [{ think: { en: "And one yellow coat is missing from the Marta tonight.", vi: "Và đêm nay một chiếc áo vàng đã biến khỏi tàu Marta." } }] },
      { say: "owen", face: "angry", en: "Kieran. Did Tom Ward push that man into the water? Yes or no?", vi: "Kieran. Tom Ward có đẩy người đó xuống nước không? Có hay không?" },
      { choice: [
        { speech: false, silent: true, en: "(Say nothing. Let him answer.)", vi: "(Im lặng. Để cậu trả lời.)", then: [
          { say: "kieran", face: "scared", en: "I… I don't know. It was dark. Maybe… yes?", vi: "Em… em không biết. Trời tối. Có lẽ… có?" },
          { think: { en: "He's saying yes because he's scared. Not because he saw it.", vi: "Cậu nói “có” vì sợ. Không phải vì cậu thấy." } },
          { set: { kieran_yes: 1 } } ] },
        { speech: true, tag: "direct", en: "That's a [[leading question]], Owen. Ask him what he saw.", vi: "Đó là câu hỏi dẫn dắt, Owen. Hỏi xem cậu ấy thấy gì.", add: { ruth: 2, sus: 1 }, set: { objected: 1 }, then: [
          { say: "owen", face: "angry", en: "Excuse me? You've been a detective for one week!", vi: "Gì cơ? {Cc} mới làm thám tử được một tuần!" },
          { say: "ruth", en: "That is right. Kieran, what did you see? Only what you saw.", easy: "That is right. Kieran, tell us only what you saw.", vi: "Đúng vậy. Kieran, em đã thấy gì? Chỉ điều em thấy thôi." },
          { say: "kieran", en: "It was dark. I didn't see his face. I only heard the splash. Then someone shouted 'Run!'. So I ran.", vi: "Trời tối. Em không thấy mặt ông ấy. Em chỉ nghe tiếng ùm. Rồi có người hét “Chạy đi!”. Thế là em chạy." },
          { think: { en: "'Run!' — on the pier. Not at the pub.", vi: "Vậy tiếng hét “Chạy đi!” vang lên trên cầu tàu — không phải ở quán." } },
          { set: { heard_shout: 1 } } ] },
      ] },
      { n: { en: "Owen sighs and looks at his watch.", vi: "Owen thở dài, liếc đồng hồ." }, on: "owen" },
      { say: "ruth", en: "Do you want to show him anything?", vi: "{Cc} có muốn cho cậu bé xem gì không?" },
      { choice: [
        { speech: false, silent: true, item: "trainer", once: true, en: "(Show him the white trainer.)", vi: "(Cho cậu xem chiếc giày trắng.)", then: [
          { n: { en: "You put the evidence bag on the table. Kieran stops breathing.", vi: "Bạn đặt túi tang vật lên bàn. Kieran nín thở." }, on: "kieran" },
          { say: "kieran", face: "shock", en: "Green laces… That's Danny's. Danny always has green laces.", vi: "Dây xanh lá… Của Danny. Danny lúc nào cũng dùng dây xanh lá." },
          { set: { saw_danny: 1 } }, { truth: "T2" },
          { say: "ruth", en: "Who is Danny?", vi: "Danny là ai?" },
          { n: { en: "Kieran shakes his head. He won't say any more about it.", vi: "Kieran lắc đầu. Cậu không chịu nói thêm gì nữa." }, on: "kieran" } ] },
        { speech: false, silent: true, item: "sam_photo", once: true, en: "(Show him the photo of Sam.)", vi: "(Cho cậu xem ảnh Sam.)", then: [
          { n: { en: "You slide the photo across the table. Kieran looks at it — and goes white.", vi: "Bạn đẩy tấm ảnh qua bàn. Kieran nhìn — rồi mặt cắt không còn giọt máu." }, on: "kieran" },
          { say: "kieran", face: "scared", en: "I… I don't know him.", vi: "Em… em không biết anh ấy." },
          { think: { en: "His hands are shaking harder now. He's lying.", vi: "Tay cậu run mạnh hơn. Cậu đang nói dối." } },
          { say: "ruth", face: "cold", en: "Who is that in the photo?", vi: "Người trong ảnh là ai?" },
          { choice: [
            { speech: true, tag: "direct", en: "My brother, Sam. He's been missing for four months.", vi: "Em trai tôi, Sam. Mất liên lạc bốn tháng rồi.", add: { ruth: 1, sus: 1 }, set: { told_sam: 1 }, then: [
              { say: "ruth", en: "You should have told me that before you came in here.", vi: "Lẽ ra {cc} phải nói chuyện đó trước khi vào đây." },
              { say: "owen", face: "cold", en: "Missing, eh? It's a small town. I'll ask around.", vi: "Mất tích à? Thị trấn nhỏ mà. Để tôi hỏi thử." },
              { think: { en: "He said it kindly. So why did it sound like a threat?", vi: "Anh ta nói rất tử tế. Vậy sao nghe như lời đe doạ?" } } ] },
            { speech: true, tag: "lie", en: "Nobody. Just a friend.", vi: "Không ai cả. Một người bạn thôi.", add: { lie: 1 } },
          ] } ] },
        { speech: true, en: "No more questions.", vi: "Không hỏi gì thêm." },
      ], loop: true },
      { cp: "c1_whisper" },
      { n: { en: "Owen's phone buzzes. He goes to the corner to answer it. Ruth is writing.", vi: "Điện thoại Owen rung. Anh ta ra góc phòng nghe máy. Ruth đang cúi viết." } },
      { cg: "cg-whisper" },
      { n: { en: "Kieran leans towards you. His voice is very quiet.", vi: "Kieran nghiêng người về phía bạn. Giọng cậu rất khẽ." } },
      { say: "kieran", whisper: true, en: "Please… don't tell them I sleep at Gull Point. If they find out… they'll kill me.", easy: "Please don't tell them I live at Gull Point. They will kill me.", vi: "Làm ơn… đừng nói với họ là em ngủ ở Gull Point. Họ mà biết… họ giết em mất." },
      { cg: null },
      { truth: "T3" },
      { think: { en: "Preserve his words. Protect his location. Those are two separate duties; a restricted safeguarding note can do both.", vi: "Giữ nguyên lời em nói. Bảo vệ nơi em ở. Đó là hai việc riêng; một ghi chép bảo vệ nhân chứng giới hạn người xem có thể làm được cả hai." } },
      { say: "ruth", en: "What did he just say?", vi: "Cậu ấy vừa nói gì?" },
      { choice: [
        { speech: true, tag: "direct", en: "He said: 'Don't tell them I sleep at Gull Point. They'll kill me.'", vi: "Cậu ấy nói: “Đừng nói với họ em ngủ ở Gull Point. Họ giết em mất.”", add: { kieran: -3, ruth: 1, acc: 2, accN: 2 }, set: { gp: "told" }, then: [
          { n: { en: "In the corner, Owen stops talking.", vi: "Ở góc phòng, Owen bỗng im bặt." }, on: "owen" },
          { show: "kieran", at: "c", face: "shock" },
          { n: { en: "Kieran looks at you like you just pushed him into the sea.", vi: "Kieran nhìn bạn như thể bạn vừa đẩy cậu xuống biển." }, on: "kieran" } ] },
        { speech: true, tag: "lie", en: "He asked for some water.", vi: "Cậu ấy xin cốc nước.", add: { lie: 1, kieran: 2, accN: 2 }, set: { gp: "lie" }, then: [
          { say: "ruth", en: "Owen. Get the boy some water.", vi: "Owen. Lấy cho cậu bé cốc nước." },
          { think: { en: "Kieran's eyes say thank you. Ruth keeps writing. Did she believe you?", vi: "Mắt Kieran nói lời cảm ơn. Ruth vẫn viết. Bà có tin bạn không?" } } ] },
        { speech: true, tag: "polite", en: "Can we talk outside for a minute? Just us.", vi: "Ta ra ngoài nói chuyện một chút được không? Chỉ hai ta.", add: { ruth: 1, kieran: 1, acc: 2, accN: 2 }, set: { gp: "private", ally: 1 }, then: [
          { hide: "*" }, { bg: "corridor" }, { show: "ruth", at: "c", face: "cold" },
          { n: { en: "In the corridor, away from Owen, you tell Ruth everything.", vi: "Ngoài hành lang, xa Owen, bạn kể hết với Ruth." } },
          { say: "ruth", en: "Gull Point. The old fish factory. Nobody has lived there for twenty years.", vi: "Gull Point. Xưởng cá cũ. Hai mươi năm nay chẳng ai sống ở đó." },
          { say: "ruth", face: "cold", en: "I'll record this separately with the safeguarding team. We won't put his sleeping place in the circulating draft. The original recording stays intact.", vi: "Tôi sẽ ghi riêng với tổ bảo vệ nhân chứng. Không đưa chỗ em ngủ vào bản dự thảo lưu hành. Bản ghi âm gốc vẫn được giữ nguyên." },
          { think: { en: "Ruth writes down the exact words and limits who can see the address. Nothing has to be invented or erased.", vi: "Ruth ghi nguyên lời nói và giới hạn người được xem địa chỉ. Không cần bịa hay xoá điều gì." } } ] },
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
      { say: "owen", face: "smile", en: "I typed up the [[statement]] for you. Just sign it. It's a normal thing.", vi: "Tôi đánh máy biên bản lời khai giúp {cc} rồi. Ký đi. Việc bình thường mà." },
      { present: {
        title: { en: "WITNESS STATEMENT — Kieran Doyle, 16", vi: "BIÊN BẢN LỜI KHAI — Kieran Doyle, 16 tuổi" },
        goal: { en: "Owen wrote this. Find every line the witness never said, prove it with evidence, then sign.", vi: "Owen viết bản này. Tìm mọi dòng nhân chứng KHÔNG hề nói, đưa bằng chứng chứng minh, rồi ký." },
        segs: [
          { t: { en: "The witness was on the north pier at about 2 a.m.", vi: "Khoảng 2 giờ sáng, nhân chứng có mặt ở cầu tàu phía bắc." } },
          { t: { en: "He saw two men arguing.", vi: "Cậu thấy hai người đàn ông đang cãi nhau." } },
          { t: { en: "The man in the yellow coat pushed the victim into the water.", vi: "Người mặc áo vàng đẩy nạn nhân xuống nước." }, fix: { en: "The man in the yellow coat pushed the other man away.", vi: "Người mặc áo vàng đẩy người kia ra." }, bad: true, evidence: "notes",
            ok: [
              { say: "me", en: "Let's check the recording against the draft. He said 'pushed the other one away'. He heard a splash; he didn't say he saw a fall.", vi: "Đối chiếu bản ghi âm với dự thảo. Cậu ấy nói “đẩy người kia ra”. Cậu nghe tiếng ùm, không nói mình thấy ai ngã." },
              { say: "owen", face: "cold", en: "It's the same thing.", vi: "Thì cũng thế cả." },
              { say: "me", en: "No. One is what he saw. The other is a guess.", vi: "Không. Một bên là điều cậu ấy thấy. Bên kia là phỏng đoán." },
              { say: "owen", en: "…Fine. I'll change it.", vi: "…Được. Tôi sửa." },
              { set: { fixed_push: 1, corrected_original: 1 } }, { add: { sus: 1 } } ],
            same: [
              { think: { en: "My notebook says the same thing. Because that's what I wrote.", vi: "Sổ tay của mình cũng ghi y vậy. Vì mình đã ghi như vậy." } },
              { think: { en: "Did Kieran really say 'into the water'?", vi: "Kieran có thật sự nói “xuống nước” không?" } } ] },
          { t: { en: "The witness said the man was Tom Ward.", vi: "Nhân chứng nói người đó là Tom Ward." }, fix: { en: "The witness did not say who the man was.", vi: "Nhân chứng không nói người đó là ai." }, bad: () => true, evidence: "notes",
            ok: [
              { say: "me", en: "He did not identify a face. Owen supplied Tom's name; the answer after that was 'I don't know'. The draft removes that uncertainty.", vi: "Cậu ấy không nhận ra mặt. Owen đưa tên Tom vào; câu trả lời sau đó là “em không biết”. Dự thảo đã xoá đi sự không chắc chắn ấy." },
              { say: "owen", face: "cold", en: "Everyone knows it's Tom.", vi: "Ai chẳng biết là Tom." },
              { say: "me", en: "Then everyone can sign it. I won't.", vi: "Vậy ai biết thì người đó ký. Tôi thì không." },
              { say: "owen", en: "…Just a small mistake. Relax.", vi: "…Nhầm chút thôi. Bình tĩnh." },
              { set: { fixed_name: 1 } }, { add: { sus: 1 } } ] },
        ],
        sign: { en: "Sign the statement", vi: "Ký biên bản" },
        wrong: [{ say: "owen", face: "smile", en: "Something wrong with that line? It looks fine to me.", vi: "Dòng đó có gì sai à? Tôi thấy ổn mà." }],
        noEvidence: [{ think: { en: "That doesn't prove it. I need something in writing.", vi: "Cái đó không chứng minh được. Mình cần thứ gì ghi lại rõ ràng." } }],
      } },
      { if: s => !s.f.fixed_name || !s.f.fixed_push, then: [
        { think: { en: "You signed it. Your name is now under words Kieran never said.", vi: "Bạn đã ký. Tên bạn giờ nằm dưới những chữ Kieran chưa từng nói." } },
        { set: { signed_bad: 1 } } ] },
      // SUY LUẬN 2: vì sao Owen biết câu “Chạy đi!”?
      { if: s => s.has("leg_it") && (s.has("jim_note") || s.f.heard_shout), then: [
        { think: { en: "Something about Owen's story doesn't fit.", vi: "Có gì đó trong lời kể của Owen không khớp." } },
        { deduce: {
          q: { en: "Which sources make Owen's version of the shout unreliable?", vi: "Đối chiếu những nguồn nào cho thấy lời Owen kể về tiếng hét không đáng tin?" },
          a: [["leg_it", "jim_note"], ["leg_it", "notes"]],
          hint: { en: "Who else told you about the shout — and where?", vi: "Còn ai kể cho bạn về tiếng hét — và ở đâu?" },
          tries: 3,
          ok: [
            { set: { owen_lied: 1 } },
            { think: { en: "Jim disputes the pub account; Kieran's recording places a shout after a splash on the pier. That challenges Owen's story. It does not yet identify who shouted.", vi: "Jim bác lời kể về quán; bản ghi Kieran nhắc tiếng hét sau tiếng ùm trên cầu tàu. Lời Owen đáng ngờ. Chưa thể xác định ai đã hét." } },
            { think: { en: "So how does Owen know those words?", vi: "Vậy làm sao Owen biết câu đó?" } } ],
        } } ] },
      { hide: "owen" },
      { show: "ruth", at: "c" },
      { say: "ruth", en: "Kieran wants us to hear a warning he received. He's given permission to open the message. His support worker has written down his clue: the festival date on his wristband.", vi: "Kieran muốn ta nghe lời cảnh báo em nhận được. Em đồng ý cho mở tin nhắn. Nhân viên hỗ trợ ghi gợi nhớ em đưa: ngày lễ hội trên vòng tay." },
      { n: { en: "On the consent slip, Kieran has drawn his wristband: KIERAN · 14·02. He wants to enter the code himself, with you reading it back.", vi: "Trên phiếu đồng ý, Kieran vẽ chiếc vòng: KIERAN · 14·02. Em muốn tự nhập mã, nhờ bạn đọc lại giúp." } },
      { lock: {
        prompt: { en: "Kieran's phone. Enter the 4-digit PIN.", vi: "Điện thoại của Kieran. Nhập mã PIN 4 số." },
        kind: "digits", answer: "1402",
        hints: [
          { en: "Kieran chose the four digits printed on his wristband.", vi: "Kieran chọn bốn chữ số trên chiếc vòng của em." },
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
          { speech: false, silent: true, tag: "direct", en: "Tell Ruth everything.", vi: "Kể hết với Ruth.", add: { ruth: 1, kieran: -1 }, set: { ruth_van: 1 }, then: [
            { say: "ruth", en: "Thursday, four a.m. A van. Good. Nobody else hears about this.", vi: "Thứ Năm, 4 giờ sáng. Một chiếc xe tải. Tốt. Không ai khác được biết chuyện này." } ] },
          { speech: false, silent: true, if: s => s.f.gp !== "told" && s.f.gp !== "private", en: "Tell her about the van — but not about Gull Point.", vi: "Kể về chiếc xe tải — nhưng giấu Gull Point.", add: { kieran: 1 }, set: { ruth_van: 1 }, then: [
            { say: "ruth", face: "cold", en: "A van. Where from? Where to?", vi: "Một chiếc xe tải. Từ đâu? Đi đâu?" },
            { say: "me", en: "The message doesn't say.", vi: "Tin nhắn không nói." },
            { think: { en: "Half a truth. Is that still a lie?", vi: "Một nửa sự thật. Thế có còn là nói dối không?" } } ] },
          { speech: true, tag: "lie", en: "It's just a friend saying good night.", vi: "Chỉ là bạn cậu ấy chúc ngủ ngon.", add: { lie: 1, ruth: -1 } },
        ] } ] },
      { go: "dawn" },
    ],

    dawn: [
      { bg: "dawn" },
      { hide: "*" },
      { n: { en: "6:40 a.m. The fog is lifting. The sea turns from black to grey.", vi: "6 giờ 40 sáng. Sương đang tan. Mặt biển chuyển từ đen sang xám." } },
      { if: s => !s.f.fixed_push || !s.f.fixed_name, then: [
        { set: { outcome: "arrest" } },
        { n: { en: "At 6:10, Tom Ward was arrested on the Marta. He did not fight. He did not say a word.", vi: "6 giờ 10, Tom Ward bị bắt ngay trên tàu Marta. Ông không chống cự. Không nói một lời." } } ],
        else: [
        { set: { outcome: "doubt" } },
        { n: { en: "Ruth refuses an arrest on that statement alone. Tom agrees to return for a voluntary interview; his movements still need checking.", vi: "Ruth không chấp nhận bắt người chỉ bằng bản lời khai đó. Tom đồng ý quay lại làm việc tự nguyện; vẫn cần xác minh ông đã ở đâu." } } ] },
      { show: "ruth", at: "c" },
      { say: "ruth", en: "Put the reported times in order. Keep the watch reading labelled as unverified.", vi: "Xếp các mốc được báo lại theo thứ tự. Nhớ ghi rõ mốc đồng hồ chưa được xác minh." },
      { order: {
        prompt: { en: "Drag ≡ to reorder. The earliest event goes at the top.", vi: "Kéo ≡ để đổi chỗ. Việc xảy ra trước nằm trên cùng." },
        items: [
          { t: { en: "The damaged watch displays 1:47 — an unverified marker.", vi: "Đồng hồ hỏng hiển thị 1:47 — một mốc chưa được xác minh." } },
          { t: { en: "Police found a boy running from the pier.", vi: "Cảnh sát thấy một cậu bé chạy khỏi cầu tàu." } },
          { t: { en: "A fisherman found the body under the pier.", vi: "Một ngư dân tìm thấy thi thể dưới cầu tàu." } },
          { t: { en: "Ruth phoned you.", vi: "Ruth gọi điện cho bạn." } },
          { t: { en: "The interview started.", vi: "Buổi hỏi cung bắt đầu." } },
        ],
        tries: 3,
        ok: [{ add: { ruth: 1 } }, { say: "ruth", en: "1:47. Around two. 2:40. 3:12. 4:30. Clean. Thank you.", vi: "1 giờ 47. Khoảng 2 giờ. 2 giờ 40. 3 giờ 12. 4 giờ 30. Gọn gàng. Cảm ơn." }],
        fail: [{ say: "ruth", en: "Close enough. I'll fix it. It's been a long night.", vi: "Tạm được. Để tôi sửa. Đêm dài quá mà." }],
      } },
      { if: s => s.acc() >= 0.8, then: [
        { say: "ruth", face: "soft", en: "You wrote down his exact words. That's rare. Many detectives try to 'help' — and that's how innocent people go to prison.", easy: "You wrote his exact words. That's rare. When detectives 'help', innocent people can go to prison.", vi: "{Cc} ghi đúng từng chữ cậu ấy nói. Hiếm lắm đấy. Nhiều thám tử muốn “giúp” — và chính thế mà người vô tội vào tù." } ],
        else: [
        { say: "ruth", face: "cold", en: "Next time, write his words. Not yours. Not Owen's. His.", vi: "Lần sau, ghi lời của cậu ấy. Không phải lời {cc}. Không phải lời Owen. Lời của cậu ấy." } ] },
      { say: "ruth", en: "My husband was a fisherman. The sea always gives things back. Just never in the shape you want.", vi: "Chồng tôi là ngư dân. Biển rồi sẽ trả lại mọi thứ. Chỉ là không bao giờ trả theo hình dạng mình mong." },
      { review: true },
      { hide: "*" },
      { show: "kieran", at: "c", face: "sad" },
      { n: { en: "A social worker walks Kieran to a car. Halfway there, he stops — and looks back at you.", vi: "Một nhân viên xã hội dẫn Kieran ra xe. Đi được nửa đường, cậu dừng lại — và ngoái nhìn bạn." } },
      { show: "kieran", at: "c", face: "sad" },
      { if: s => s.f.kieran >= 1, then: [
        { say: "kieran", whisper: true, en: "…Sam told me to run.", vi: "…Sam bảo em chạy." },
        { sfx: "sting" },
        { think: { en: "Sam.", vi: "Sam." } },
        { think: { en: "Your Sam.", vi: "Sam của bạn." } },
        { set: { end_sam: 1 } } ],
        else: [
        { n: { en: "He says nothing. But as he turns away, his phone lights up in his hand.", vi: "Cậu không nói gì. Nhưng lúc quay đi, điện thoại trong tay cậu sáng lên." }, on: "kieran" },
        { cg: "cg-lockscreen" },
        { n: { en: "The lock screen: four young men on a fishing boat, smiling. The one on the left is Sam.", vi: "Màn hình khoá: bốn chàng trai trên một chiếc thuyền, đang cười. Người bên trái là Sam." } },
        { sfx: "sting" },
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
    c1_arrest: { ch: 1, next: "c2", nextTitle: { en: "Chapter 2 — Fish and Lies", vi: "Chương 2 — Cá và lời dối" }, title: { en: "Tom Arrested", vi: "Tom bị bắt" },
      sum: { en: "The captain is in a cell. The real killer sleeps well.", vi: "Thuyền trưởng vào xà lim. Kẻ thật sự vẫn ngủ ngon." },
      text: { en: "A captain is in a cell. A boy is in a car. And somewhere in this town, the person who was really on the pier at 1:47 is sleeping very well.", vi: "Một thuyền trưởng nằm trong xà lim. Một cậu bé ngồi trên xe. Và đâu đó trong thị trấn, kẻ thật sự có mặt trên cầu tàu lúc 1:47 vẫn đang ngủ rất ngon." } },
    c1_doubt: { ch: 1, next: "c2", nextTitle: { en: "Chapter 2 — Fish and Lies", vi: "Chương 2 — Cá và lời dối" }, title: { en: "Reasonable Doubt", vi: "Còn nghi vấn" },
      sum: { en: "No arrest. Your notebook kept the case open.", vi: "Không ai bị bắt. Sổ tay của bạn giữ vụ án còn mở." },
      text: { en: "No arrest. No answers. Just a shoe with green laces, a stopped watch — and a name you haven't heard out loud in four months.", vi: "Không ai bị bắt. Chưa có lời giải. Chỉ có một chiếc giày dây xanh, một chiếc đồng hồ đã dừng — và một cái tên bốn tháng nay bạn chưa nghe ai gọi." } },
  },
  next: { en: "Chapter 2 — Fish and Lies", vi: "Chương 2 — Cá và lời dối" },
});
