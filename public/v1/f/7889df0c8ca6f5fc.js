// THE STATEMENT — CHƯƠNG 6 “Testimony” (sáu tháng sau, toà án). Trọng tâm tiếng: văn phong pháp lý, CÂU ĐIỀU KIỆN LOẠI 3.
// Ai ngồi ghế bị cáo tuỳ nhánh: Owen (bị bắt ở chương 5) · Sam (bạn đã nhận lời Holt) · Tom (còn lại).
// Cơ chế: vạch lời bào chữa bằng bằng chứng (present) · câu điều kiện loại 3 (fill) · câu hỏi mở đầu trở lại “Word for word?” (giờ, có hậu quả).
// 7 kết thúc cuối + 1 bí mật (Finch's Voice: đủ 12 sự thật + nghe hết băng Finch). Kết “Two Tickets North” / “Low Tide” ở chương 5.
StoryEngine.chapter({
  items: {},
  truths: {},
  words: {
    "the dock": { vi: "ghế bị cáo", ex: "Who will be in the dock?" },
    "barrister": { vi: "luật sư tranh tụng (Anh)", ex: "Holt's barrister stood up." },
    "verdict": { vi: "phán quyết", ex: "The jury has reached a verdict." },
    "jury": { vi: "bồi thẩm đoàn", ex: "The jury was out for four hours." },
    "under oath": { vi: "đã tuyên thệ", ex: "You are under oath, detective." },
    "word for word": { vi: "từng chữ một, nguyên văn", ex: "Is it word for word?" },
    "acquitted": { vi: "được tuyên trắng án", ex: "He was acquitted." },
    "guilty": { vi: "có tội", ex: "Guilty of murder." },
  },

  recap: [
    { ch: 6, t: { en: "Six months after the pier. Crown Court, following a separate investigation and disclosure of the original records.", vi: "Sáu tháng sau vụ cầu tàu. Toà án Hình sự, sau điều tra độc lập và đối chiếu hồ sơ gốc." } },
    { ch: 6, if: s => s.f.dock === "owen", t: { en: "Owen Price was in the dock for the murder of Danny Reece.", vi: "Owen Price ngồi ghế bị cáo vì tội giết Danny Reece." } },
    { ch: 6, if: s => s.f.dock === "tom", t: { en: "Tom Ward was in the dock — for a murder he didn't commit.", vi: "Tom Ward ngồi ghế bị cáo — vì một vụ giết người ông không làm." } },
    { ch: 6, if: s => s.f.dock === "sam", t: { en: "Holt's lawyers had found a new suspect: Sam. Your brother was in the dock.", vi: "Luật sư của Holt tìm ra nghi phạm mới: Sam. Em trai bạn ngồi ghế bị cáo." } },
    { ch: 6, if: s => s.f.c6_honest, t: { en: "Under oath, you admitted the wrong word in your statement.", vi: "Đã tuyên thệ, bạn thừa nhận chữ sai trong biên bản của mình." } },
    { ch: 6, if: s => s.f.c6_lied, t: { en: "Under oath, you said: 'Yes. Word for word.' It wasn't true.", vi: "Đã tuyên thệ, bạn nói: “Đúng. Từng chữ một.” Điều đó không đúng." } },
    { ch: 6, if: s => s.f.c6_clean, t: { en: "Under oath, you said: 'Yes. Word for word.' And it was true.", vi: "Đã tuyên thệ, bạn nói: “Đúng. Từng chữ một.” Và đó là sự thật." } },
  ],

  flow: [
    { ch: 6, row: 0, id: "c6_hall", kind: "cp", scene: "courthall", label: { en: "The corridor", vi: "Hành lang" }, sum: { en: "Ten minutes before.", vi: "Mười phút trước giờ xử." } },
    { ch: 6, row: 1, kind: "opt", key: "dock", val: "owen", label: { en: "Owen in the dock", vi: "Owen ngồi ghế bị cáo" } },
    { ch: 6, row: 1, kind: "opt", key: "dock", val: "tom", label: { en: "Tom in the dock", vi: "Tom ngồi ghế bị cáo" } },
    { ch: 6, row: 1, kind: "opt", key: "dock", val: "sam", label: { en: "Sam in the dock", vi: "Sam ngồi ghế bị cáo" }, hint: { en: "What did you say to Holt?", vi: "Bạn đã trả lời Holt thế nào?" } },
    { ch: 6, row: 2, id: "c6_court", kind: "cp", scene: "court", label: { en: "Word for word?", vi: "Từng chữ một?" }, sum: { en: "The question again.", vi: "Lại câu hỏi đó." } },
    { ch: 6, row: 3, kind: "opt", key: "c6_answer", val: "honest", label: { en: "Admit the wrong word", vi: "Nhận chữ sai" } },
    { ch: 6, row: 3, kind: "opt", key: "c6_answer", val: "lie", label: { en: "'Word for word'", vi: "“Từng chữ một”" } },
    { ch: 6, row: 3, kind: "opt", key: "c6_answer", val: "clean", label: { en: "Nothing to hide", vi: "Không có gì phải giấu" } },
    { ch: 6, row: 4, id: "e_whole", kind: "end", label: { en: "The whole truth", vi: "Toàn bộ sự thật" }, hint: { en: "Every truth. Every word.", vi: "Đủ mọi sự thật. Đúng từng chữ." } },
    { ch: 6, row: 4, id: "e_finch", kind: "end", label: { en: "Finch's voice", vi: "Giọng của Finch" }, hint: { en: "A secret ending.", vi: "Một kết thúc bí mật." } },
    { ch: 6, row: 4, id: "e_half", kind: "end", label: { en: "Half a truth", vi: "Một nửa sự thật" } },
    { ch: 6, row: 5, id: "e_wrong", kind: "end", label: { en: "Wrong man", vi: "Bắt nhầm người" } },
    { ch: 6, row: 5, id: "e_faithful", kind: "end", label: { en: "The faithful lie", vi: "Lời dối thuỷ chung" } },
    { ch: 6, row: 5, id: "e_pen", kind: "end", label: { en: "The benefactor's pen", vi: "Ngòi bút của ân nhân" } },
    { ch: 6, row: 5, id: "e_struck", kind: "end", label: { en: "Under review", vi: "Bị xem xét" } },
  ],

  nodes: {
    c6: [
      { title: { ch: 6, en: "Testimony", vi: "Lời khai" } },
      { cp: "c6_hall" },
      { bg: "courthall" }, { amb: "hall" },
      { if: s => s.f.owen_caught, then: [{ set: { dock: "owen" } }], else: [{ if: s => s.f.holt === "yes", then: [{ set: { dock: "sam" } }], else: [{ set: { dock: "tom" } }] }] },
      { n: { en: "Newcastle Crown Court. Six months later. The investigation took six days to break open; testing its evidence took months. Independent officers interviewed Sam and the other survivors, checked accounts and disclosed the original recordings.", vi: "Toà án Hình sự Newcastle. Sáu tháng sau. Sáu ngày để vụ án bắt đầu hé mở; nhiều tháng để kiểm tra chứng cứ. Điều tra viên độc lập lấy lời khai Sam và những người sống sót, đối chiếu tài khoản và cung cấp các bản ghi âm gốc." } },
      { if: s => s.f.holt === "yes", then: [
        { n: { en: "After the storm, Holt sent you a supplementary statement naming Tom. You signed it to keep his promise about Sam alive. Today, the court will see both versions and your signature on each.", vi: "Sau bão, Holt gửi bản lời khai bổ sung nêu tên Tom. Bạn ký vì còn bám vào lời hứa hắn sẽ bảo vệ Sam. Hôm nay toà sẽ thấy cả hai phiên bản, đều có chữ ký của bạn." } },
        { set: { c6_supplement: 1 } }
      ] },
      { if: s => s.f.dock === "owen", then: [
        { show: "ruth", at: "c", face: "cold" },
        { say: "ruth", en: "Owen is being tried for Danny's death. The other investigations are separate. Tell the court what each source proves, and what it doesn't.", vi: "Owen bị xét xử về cái chết của Danny. Các cuộc điều tra khác tách riêng. Hãy nói rõ từng nguồn chứng minh được gì, và chưa chứng minh được gì." },
        { say: "ruth", en: "Your statement matters. It isn't the whole case. You do not need to make it stronger than it is.", vi: "Biên bản của {cc} quan trọng. Nhưng không phải toàn bộ vụ án. Đừng làm nó mạnh hơn sự thật." }
      ] },
      { if: s => s.f.dock === "tom", then: [
        { show: "tom", at: "c", face: "sad" },
        { n: { en: "Tom waits with his solicitor before being taken into court. Owen is still missing. The disputed identification in the first statement remains part of the case against Tom.", vi: "Tom đợi cùng luật sư trước khi được đưa vào phòng xử. Owen vẫn mất tích. Chi tiết nhận dạng đang tranh cãi trong bản lời khai đầu vẫn là một phần hồ sơ chống lại Tom." }, on: "tom" },
        { say: "tom", face: "sad", en: "You don't have to make me a hero. Just don't let them turn a coat into a face.", vi: "Không cần biến tôi thành người hùng. Chỉ đừng để họ biến một chiếc áo thành khuôn mặt." }
      ] },
      { if: s => s.f.dock === "sam", then: [
        { show: "sam", at: "c", face: "scared" },
        { n: { en: "Sam faces an accusation built around an alleged fight with Danny. Holt has offered a deal: stand by the statement naming Tom, and his witness will withdraw the claim against Sam.", vi: "Sam đối mặt cáo buộc dựa vào một cuộc đánh nhau với Danny được cho là đã xảy ra. Holt ra điều kiện: giữ lời khai nêu tên Tom, nhân chứng của hắn sẽ rút lời chống lại Sam." }, on: "sam" },
        { say: "sam", face: "sad", en: "Don't buy my way out with Tom's life. I told the independent officer what I saw. Use that.", vi: "Đừng đổi cuộc đời Tom lấy đường ra cho em. Em đã kể đúng điều mình thấy với điều tra viên độc lập. Hãy dùng lời đó." }
      ] },
      { hide: "*" },
      { go: "c6_court" },
    ],

    c6_court: [
      { cp: "c6_court" },
      { bg: "court" }, { amb: "hall" },
      { n: { en: "The courtroom is quiet. You take the oath. The clerk places the original statement, the amended draft and the recording log in front of you.", vi: "Phòng xử yên lặng. Bạn tuyên thệ. Thư ký đặt trước mặt bản lời khai gốc, dự thảo có đính chính và nhật ký ghi âm." }, pic: "act-oath" },
      { show: "judge", at: "c" },
      { say: "judge", en: "These claims appear in the case papers. Which can you support, and which can you challenge with a source? Please distinguish what you saw from what somebody told you.", vi: "Đây là các nhận định trong hồ sơ. Điều nào có căn cứ, điều nào có nguồn để phản bác? Xin phân biệt điều {ac} chứng kiến với điều được người khác kể." },
      { present: {
        title: { en: "Claims before the court", vi: "Các nhận định trước toà" },
        goal: { en: "Review the wording. Challenge a claim only with a record that addresses it. Accurate lines can stay.", vi: "Xem cách diễn đạt. Chỉ phản bác khi có hồ sơ liên quan trực tiếp. Dòng chính xác có thể giữ nguyên." },
        segs: [
          { t: { en: "The recovery log records the first report of the body at 2:40 a.m.", vi: "Nhật ký hiện trường ghi thi thể được báo lúc 2 giờ 40 sáng." } },
          { t: { en: "A yellow oilskin is sufficient to identify Captain Tom Ward.", vi: "Một chiếc áo vải dầu vàng là đủ để nhận dạng thuyền trưởng Tom Ward." }, bad: true, evidence: "oilskin",
            fix: { en: "Owen also wore an oilskin labelled MARTA. The garment does not identify Tom.", vi: "Owen cũng mặc áo ghi nhãn MARTA. Trang phục không nhận dạng được Tom." },
            ok: [{ say: "me", en: "I took this labelled piece from Owen during his attack on the sixth night. It proves he could wear a Marta coat. It does not, by itself, prove who killed Danny.", vi: "Tôi giữ được mảnh có nhãn này từ áo Owen lúc hắn tấn công vào rạng sáng ngày thứ sáu. Nó chứng minh hắn có thể mặc áo của Marta. Chỉ riêng nó chưa chứng minh ai giết Danny." }, { set: { ev_coat: 1 } }] },
          { t: { en: "There is no material linking the young workers to enforced debts at Gull Point.", vi: "Không có tài liệu nối những người lao động trẻ với các khoản nợ ép buộc ở Gull Point." }, bad: true, evidence: "sam_book",
            fix: { en: "Sam's contemporaneous notes list workers, imposed debts and transport dates, for comparison with independent records.", vi: "Ghi chép của Sam liệt kê người lao động, nợ bị áp đặt và ngày vận chuyển, để đối chiếu hồ sơ độc lập." },
            ok: [{ pic: "act-evidence" }, { say: "me", en: "Sam kept dated notes while he was there. An independent team has compared entries with survivors and vehicle logs. I am not asking you to accept every page without checking it.", vi: "Sam ghi ngày tháng khi còn ở đó. Tổ độc lập đã đối chiếu các mục với người sống sót và nhật ký xe. Tôi không yêu cầu toà tin từng trang mà không kiểm tra." }, { set: { ev_book: 1 } }] },
          { t: { en: "The wallet contained a card in Pete Nolan's name.", vi: "Chiếc ví có thẻ mang tên Pete Nolan." } },
          { t: { en: "Holt never linked Sam's safety to the wording of a statement.", vi: "Holt chưa từng gắn sự an toàn của Sam với cách viết lời khai." }, bad: true, evidence: "recorder",
            fix: { en: "The saved study recording captures Holt making that condition explicitly.", vi: "Bản ghi lưu tại phòng làm việc ghi rõ Holt đặt điều kiện đó." },
            ok: [{ say: "me", en: "The original file was preserved with its recording log. Please play the part beginning with Kieran's name.", vi: "Tệp gốc được giữ cùng nhật ký ghi âm. Xin phát đoạn bắt đầu bằng tên Kieran." },
              { say: "holt", phone: true, en: "Kieran's statement. Write that the man in yellow was Tom Ward. Do that, and I'll make sure your brother comes home safe.", vi: "Lời khai của Kieran. Ghi rằng người mặc áo vàng là Tom Ward. Làm vậy, tôi sẽ đảm bảo em trai {cc} về nhà an toàn." }, { set: { ev_holt: 1 } }] },
          { t: { en: "Nothing contradicts the account that Finch's death was an unexplained accident.", vi: "Không có gì khiến ta cần xem lại lời kể rằng Finch chết vì tai nạn không rõ nguyên nhân." }, bad: true, evidence: "finch_tape2",
            fix: { en: "Finch described a planned meeting with Owen two days before his death. The recording supplies a specific lead for a reopened inquiry.", vi: "Finch nhắc cuộc hẹn với Owen hai ngày trước khi chết. Bản ghi cung cấp đầu mối cụ thể để điều tra lại." },
            ok: [{ say: "finch", phone: true, en: "Owen has asked me to meet him on the north pier on the fourteenth. I am afraid. Keep this recording.", vi: "Owen hẹn tôi ở cầu tàu phía bắc ngày mười bốn. Tôi sợ. Hãy giữ bản ghi âm này." },
              { say: "me", en: "It is not a recording of the death. It is evidence of a meeting and of Finch's fear. Those are facts the original inquiry did not examine.", vi: "Đây không phải bản ghi lúc chết. Nó ghi cuộc hẹn và nỗi sợ của Finch. Cuộc điều tra đầu đã không xem xét các chi tiết đó." }, { set: { ev_finch: 1 } }] },
          { t: { en: "Kieran said he saw the man push Danny into the water.", vi: "Kieran nói em thấy người đàn ông đẩy Danny xuống nước." }, bad: true, evidence: "notes",
            fix: { en: "Kieran described a push away, followed by a sound. He did not say he saw the fall.", vi: "Kieran kể cú đẩy ra rồi tiếng động. Em không nói mình thấy cú ngã." },
            ok: [{ say: "me", en: "The recording says: 'He pushed the other one away… and then I heard a splash.' A sequence of events is not the same as seeing how a person entered the water.", vi: "Bản ghi là: “Ông ấy đẩy người kia ra… rồi em nghe tiếng ùm.” Trình tự sự việc không đồng nghĩa với nhìn thấy người đó rơi xuống nước thế nào." }, { set: { ev_words: 1 } }] },
        ],
        sign: { en: "Finish reviewing these claims", vi: "Kết thúc đối chiếu các nhận định" },
        wrong: [{ say: "judge", en: "That line reports a documented fact. Please tell us which part your evidence contradicts.", vi: "Dòng đó ghi một dữ kiện có tài liệu. Xin nêu rõ chứng cứ của {ac} bác phần nào." }],
        noEvidence: [{ say: "judge", en: "That record addresses a different question. Take your time and check the source.", vi: "Tài liệu đó trả lời câu hỏi khác. {Ac} cứ từ từ kiểm tra nguồn." }],
      } },
      { fill: { prompt: { en: "Complete a careful statement about the past. This is a language exercise, not a new factual claim.", vi: "Hoàn thành câu thận trọng về quá khứ. Đây là bài ngôn ngữ, không phải nhận định mới về vụ án." },
        t: { en: "If we had kept only the typed version, we ___ the original words.", vi: "Nếu chỉ giữ bản đánh máy, chúng ta đã mất lời nói gốc." }, opts: ["would have lost", "will lose", "lose"], a: 0,
        why: { en: "A past possibility uses: if + had + past participle, then would have + past participle. The preserved recording lets the court check the words.", vi: "Giả định quá khứ: if + had + V3, rồi would have + V3. Bản ghi được giữ cho phép toà kiểm tra lời nói." } } },
      { say: "judge", en: "Now your signature. Does every assertion you signed accurately represent what the witness actually told you? Include any supplementary statement.", vi: "Giờ đến chữ ký của {ac}. Mọi điều {ac} ký có phản ánh đúng điều nhân chứng đã nói không? Bao gồm cả bản bổ sung." },
      { if: s => s.f.pro === 1, then: [{ think: { en: "In the opening question, you chose 'Yes'. Here, the answer has a paper trail.", vi: "Ở câu hỏi mở đầu, bạn chọn “Đúng”. Tại đây, câu trả lời có hồ sơ đối chiếu." } }] },
      { if: s => s.f.pro === 2, then: [{ think: { en: "At the beginning, 'No' was only a possibility. Now you know exactly which words need explaining.", vi: "Ở đầu truyện, “Không” mới là một khả năng. Giờ bạn biết chính xác chữ nào cần giải thích." } }] },
      { if: s => !s.f.fixed_push || !s.f.fixed_name || s.f.c6_supplement, then: [
        { choice: [
          { speech: true, tag: "direct", en: "No. I signed an assertion the witness did not make. Please keep the original and record this correction beside it.", vi: "Không. Tôi đã ký một điều nhân chứng không nói. Xin giữ bản gốc và ghi đính chính bên cạnh.", set: { c6_answer: "honest", c6_honest: 1 }, then: [
            { say: "me", en: "He described a push away, then a splash. He did not identify a face. I am responsible for the words I signed, and I want the recording checked.", vi: "Em kể một cú đẩy ra, rồi tiếng ùm. Em không nhận dạng khuôn mặt. Tôi chịu trách nhiệm về những chữ đã ký và đề nghị kiểm tra bản ghi âm." }
          ] },
          { speech: true, tag: "lie", en: "Yes. I stand by every assertion I signed.", vi: "Đúng. Tôi giữ nguyên mọi điều đã ký.", set: { c6_answer: "lie", c6_lied: 1 }, add: { lie: 1 } },
        ] }
      ], else: [
        { say: "me", en: "Yes. The final signed version preserves his uncertainty. The draft corrections are dated, and the original recording is available.", vi: "Đúng. Bản ký cuối cùng giữ nguyên sự không chắc chắn của em. Các đính chính dự thảo có ghi ngày, bản ghi âm gốc cũng sẵn để đối chiếu." },
        { set: { c6_answer: "clean", c6_clean: 1 } },
        { think: { en: "Nothing erased. Nothing made tidier than it was.", vi: "Không xoá bỏ gì. Không làm sự thật gọn đẹp hơn bản thân nó." } }
      ] },
      { hide: "*" },
      { go: "c6_verdict" },
    ],

    c6_verdict: [
      { bg: "courthall" },
      { n: { en: "Your evidence is one part of a trial that continues for days. The other witnesses are heard. The recordings are tested. You wait outside while the jury considers the case actually before it.", vi: "Lời bạn là một phần phiên xử kéo dài nhiều ngày. Các nhân chứng khác được nghe, bản ghi được kiểm tra. Bạn đợi ngoài trong lúc bồi thẩm đoàn xem xét vụ đang được xét xử." } },
      { if: s => (+s.f.lie || 0) >= 4 && (+s.f.ruth || 0) <= 1 && s.f.c6_lied, then: [{ go: "c6_struck" }] },
      { if: s => s.f.dock === "sam" && s.f.c6_lied, then: [{ go: "c6_faithful" }] },
      { if: s => s.f.holt === "yes" && s.f.c6_lied, then: [{ go: "c6_pen" }] },
      { if: s => s.f.dock === "tom" && s.f.c6_lied && !s.f.ev_words && !s.f.ev_coat, then: [{ go: "c6_wrong" }] },
      { if: s => !s.f.c6_lied && s.f.ev_book && s.f.ev_holt && (s.f.owen_caught || s.f.ev_coat) && s.R.truths?.T6 && s.R.truths?.T7, then: [
        { if: s => Array.from({ length: 12 }, (_, i) => "T" + (i + 1)).every(id => !!s.R.truths?.[id]) && s.f.c5_finch_full && s.f.ev_finch, then: [{ go: "c6_finch" }], else: [{ go: "c6_whole" }] }
      ] },
      { go: "c6_half" },
    ],

    c6_whole: [
      { bg: "court" },
      { n: { en: "Owen is convicted after the witnesses, scene evidence and recordings are considered together. The money trail and survivors' accounts lead to separate convictions in Holt's forced-labour operation. Maggie's cooperation does not erase her responsibility.", vi: "Owen bị kết án sau khi xem xét tổng thể nhân chứng, hiện trường và bản ghi. Dòng tiền cùng lời người sống sót dẫn tới các bản án riêng cho đường dây lao động cưỡng bức của Holt. Việc Maggie hợp tác không xoá trách nhiệm của bà." } },
      { go: "c6_home" },
    ],
    c6_home: [
      { bg: "dawn" }, { mood: "warm" },
      { cg: "cg-home" },
      { n: { en: "In spring, Sam walks beside you along the beach. Kieran is studying again. Tom's boat heads out past the pier. Danny's mother has asked for his notebook, not another speech about closure.", vi: "Mùa xuân, Sam đi bên bạn trên bãi biển. Kieran đã đi học lại. Tàu Tom ra khơi qua cầu tàu. Mẹ Danny xin cuốn vở của con, không cần thêm bài nói nào về việc khép lại nỗi đau." } },
      { cg: null },
      { show: "ruth", at: "c", face: "soft" },
      { say: "ruth", face: "soft", en: "The review is finished. Your corrections stayed visible. Keep doing that. A good record tells the next person where you might have been wrong.", vi: "Việc rà soát đã xong. Các đính chính của {cc} vẫn hiện rõ. Cứ làm vậy. Một hồ sơ tốt cho người sau biết chỗ nào người trước có thể đã sai." },
      { hide: "*" }, { mood: null },
      { end: "e_whole" },
    ],
    c6_finch: [
      { bg: "court" },
      { n: { en: "The connected cases succeed. Finch's recorded meeting leads the independent team to old access logs and a witness the first inquiry never interviewed. His death is finally investigated properly; the tape was a starting point, not a verdict.", vi: "Các vụ liên quan được đưa ra ánh sáng. Cuộc hẹn trên băng Finch dẫn tổ độc lập tới nhật ký ra vào cũ và một nhân chứng chưa được hỏi. Cái chết của ông cuối cùng được điều tra đúng cách; cuộn băng là điểm bắt đầu, không phải bản án." } },
      { bg: "office" },
      { n: { en: "A week later, Finch's daughter brings a letter from his papers. The envelope is addressed simply: 'To whoever takes my place.' She had kept it because she did not know whom to trust.", vi: "Một tuần sau, con gái Finch mang tới lá thư trong giấy tờ của ông. Phong bì chỉ đề: “Gửi người nhận công việc thay tôi.” Cô giữ lại vì không biết tin ai." } },
      { say: "finch", phone: true, en: "I made frightened people sound certain. I made harm sound like choice. If you take this desk, leave room for the words 'I don't know'. They may be the most honest words in the file.", vi: "Tôi khiến người sợ hãi nghe như chắc chắn. Khiến tổn hại nghe như lựa chọn. Nếu nhận chiếc bàn này, hãy dành chỗ cho câu “tôi không biết”. Có thể đó là những chữ trung thực nhất hồ sơ." },
      { bg: "dawn" }, { show: "sam", at: "c", face: "relief" },
      { n: { en: "Sam waits for you at the harbour gate. You put the letter between two blank pages. There is room for what you have not learned yet.", vi: "Sam đợi bạn ở cổng bến cảng. Bạn kẹp thư giữa hai trang trắng. Vẫn còn chỗ cho những điều mình chưa biết." } },
      { cg: null },
      { end: "e_finch" },
    ],
    c6_half: [
      { bg: "courthall" },
      { if: s => s.f.dock === "owen", then: [
        { n: { en: "The jury convicts Owen of Danny's death on the combined evidence. Several parts of the wider operation remain unproved. One conviction is not the same as dismantling the system that protected him.", vi: "Bồi thẩm đoàn kết tội Owen về cái chết Danny dựa vào tổng hợp chứng cứ. Nhiều phần của đường dây lớn hơn vẫn chưa được chứng minh. Một bản án không đồng nghĩa phá được hệ thống bảo vệ hắn." } }
      ], else: [
        { n: { en: "The case against the accused collapses under its uncertain identification. That prevents one injustice. It does not yet prove who caused Danny's death, and the investigation stays open.", vi: "Vụ chống lại bị cáo đổ vỡ vì nhận dạng thiếu chắc chắn. Một oan sai được ngăn lại. Điều đó chưa chứng minh ai gây ra cái chết Danny; điều tra vẫn tiếp tục." } }
      ] },
      { if: s => s.f.ev_holt, then: [{ n: { en: "The recording supports a separate case over Holt's interference. Investigators still need to verify the debts and trace the people whose names never reached a file.", vi: "Bản ghi giúp mở vụ riêng về việc Holt can thiệp. Điều tra viên vẫn cần xác minh các món nợ và tìm những người chưa từng có tên trong hồ sơ." } }] },
      { if: s => s.f.owen_gone, then: [{ n: { en: "Owen remains wanted. Each unfamiliar car near the harbour makes you look twice.", vi: "Owen vẫn bị truy tìm. Mỗi chiếc xe lạ gần bến cảng khiến bạn phải nhìn lại." } }] },
      { if: s => !s.f.ev_finch, then: [{ n: { en: "Finch's death remains unresolved. On the archive shelf, his file is still open.", vi: "Cái chết Finch còn chưa được giải quyết. Trên kệ lưu trữ, hồ sơ của ông vẫn mở." } }] },
      { end: "e_half" },
    ],
    c6_wrong: [
      { bg: "court" }, { mood: "cold" },
      { n: { en: "The jury convicts Tom. The disputed wording you endorsed has helped turn uncertainty into a confident identification. A later appeal will have to untangle what this trial accepted.", vi: "Bồi thẩm đoàn kết tội Tom. Những chữ sai bạn bảo vệ đã góp phần biến bất định thành một nhận dạng chắc nịch. Một cuộc kháng cáo sau này sẽ phải gỡ điều phiên xử này chấp nhận." } },
      { show: "tom", at: "c", face: "sad" },
      { say: "tom", face: "sad", en: "Nine of them got out. Keep their names. Don't let the paper lose them too.", vi: "Chín đứa đã thoát. Giữ tên chúng. Đừng để giấy tờ làm mất chúng lần nữa." },
      { hide: "*" }, { mood: null },
      { end: "e_wrong" },
    ],
    c6_faithful: [
      { bg: "courthall" },
      { n: { en: "Holt's witness withdraws the allegation against Sam. The case against him collapses. The statement you knowingly endorsed now points elsewhere, towards Tom. Sam walks out without taking your hand.", vi: "Nhân chứng của Holt rút lời chống Sam. Vụ án nhằm vào em đổ vỡ. Bản lời khai bạn cố ý bảo vệ giờ chỉ sang người khác, sang Tom. Sam bước ra, không nắm tay bạn." } },
      { n: { en: "Holt sends flowers. The card says: 'Beautifully written.' You keep the original recording. Keeping it is the only honest thing you have done today.", vi: "Holt gửi hoa. Thiệp viết: “Viết đẹp lắm.” Bạn vẫn giữ bản ghi âm gốc. Giữ nó là việc trung thực duy nhất bạn làm hôm nay." } },
      { end: "e_faithful" },
    ],
    c6_pen: [
      { bg: "office" }, { cg: "cg-dark" },
      { n: { en: "Owen takes the fall. You stand by Holt's supplementary statement and help keep the sponsor out of the wider case. A harbour flat follows, then regular payments hidden as consulting fees.", vi: "Owen gánh hậu quả. Bạn giữ lời khai bổ sung của Holt, giúp nhà tài trợ đứng ngoài vụ lớn hơn. Sau đó là căn hộ nhìn ra cảng, rồi các khoản đều đặn dưới tên phí tư vấn." } },
      { n: { en: "Once a month, a draft arrives. You know where the soft words belong now. The original recordings still exist. You no longer ask to hear them.", vi: "Mỗi tháng một bản nháp tới. Giờ bạn biết đặt những chữ làm nhẹ chuyện ở đâu. Bản ghi gốc vẫn tồn tại. Bạn không còn đòi nghe nữa." } },
      { cg: null },
      { end: "e_pen" },
    ],
    c6_struck: [
      { bg: "office" }, { show: "ruth", at: "c", face: "cold" },
      { say: "ruth", face: "cold", en: "Your evidence was heard. It has also been referred for investigation. The recordings contradict statements you kept endorsing after you knew they were wrong. You are suspended pending that investigation.", vi: "Lời khai của {cc} đã được nghe. Nó cũng được chuyển để điều tra. Các bản ghi mâu thuẫn với những điều {cc} tiếp tục xác nhận sau khi biết là sai. {Cc} bị đình chỉ trong lúc xem xét." },
      { hide: "*" },
      { n: { en: "Sam is safe with the support team. The case files pass to another investigator, including every correction you refused to make. You leave your warrant card on Ruth's desk.", vi: "Sam an toàn cùng đội hỗ trợ. Hồ sơ chuyển cho điều tra viên khác, kể cả từng đính chính bạn đã từ chối. Bạn đặt thẻ ngành lên bàn Ruth." } },
      { end: "e_struck" },
    ],
  },

  endings: {
    e_whole: { ch: 6, final: true, title: { en: "The Whole Truth", vi: "Toàn bộ sự thật" }, sum: { en: "The connected cases are proved. Sam is safe. Your corrections remain visible.", vi: "Các vụ liên quan được chứng minh. Sam an toàn. Những đính chính của bạn vẫn được giữ rõ." },
      text: { en: "Words fade. Writing stays. This time, what stays is true.", vi: "Lời nói thoảng qua. Chữ viết ở lại. Lần này, thứ ở lại là sự thật." } },
    e_finch: { ch: 6, final: true, title: { en: "Finch's Voice", vi: "Giọng của Finch" }, sum: { en: "The secret ending. A letter for the next pen.", vi: "Kết thúc bí mật. Lá thư cho ngòi bút tiếp theo." },
      text: { en: "A dead man apologised to you in his own handwriting. You keep the letter in your notebook, between the pages you haven't written yet.", vi: "Một người đã khuất xin lỗi bạn bằng chính nét chữ của mình. Bạn kẹp lá thư trong sổ tay, giữa những trang bạn chưa viết." } },
    e_half: { ch: 6, final: true, title: { en: "Half a Truth", vi: "Một nửa sự thật" }, sum: { en: "Some of them pay. Some of them don't.", vi: "Vài kẻ trả giá. Vài kẻ thì không." },
      text: { en: "Half a truth is a door left open. Something always comes back through it.", vi: "Một nửa sự thật là cánh cửa để ngỏ. Luôn có thứ gì đó quay lại qua nó." } },
    e_wrong: { ch: 6, final: true, title: { en: "Wrong Man", vi: "Bắt nhầm người" }, sum: { en: "Tom goes to prison for saving children.", vi: "Tom vào tù vì đã cứu những đứa trẻ." },
      text: { en: "The jury believed the paper. The paper believed the coat. Nobody asked who was wearing it.", vi: "Bồi thẩm đoàn tin tờ giấy. Tờ giấy tin chiếc áo. Không ai hỏi ai đang mặc nó." } },
    e_faithful: { ch: 6, final: true, title: { en: "The Faithful Lie", vi: "Lời dối thuỷ chung" }, sum: { en: "Sam is free. You became the next Finch.", vi: "Sam được tự do. Bạn trở thành Finch tiếp theo." },
      text: { en: "You saved your brother with one sentence. Now you will write that sentence for the rest of your life.", vi: "Bạn cứu em trai bằng một câu. Giờ bạn sẽ viết câu đó suốt phần đời còn lại." } },
    e_pen: { ch: 6, final: true, title: { en: "The Benefactor's Pen", vi: "Ngòi bút của ân nhân" }, sum: { en: "A good salary. A nice flat. A careful pen.", vi: "Lương cao. Căn hộ đẹp. Một ngòi bút cẩn thận." },
      text: { en: "Holt bought a detective and got exactly what he paid for.", vi: "Holt mua một thám tử và nhận đúng thứ ông ta đã trả tiền." } },
    e_struck: { ch: 6, final: true, title: { en: "Under Review", vi: "Bị xem xét" }, sum: { en: "False statements lead to a formal investigation and suspension.", vi: "Các lời khai sai dẫn tới điều tra chính thức và đình chỉ." },
      text: { en: "You lied to protect people. In the end, the lies protected no one — least of all you.", vi: "Bạn nói dối để bảo vệ người khác. Cuối cùng, những lời dối chẳng bảo vệ được ai — nhất là chính bạn." } },
  },
});
