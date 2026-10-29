// CAFÉ LUNE — truyện hẹn hò / đời thường 4 tập (Enmi Story Engine 2). Bible ở cuối file.
// Cơ chế chính: hẹn hò (topics · gift · date · gallery · meter ♥) · nhắn tin / cuộc gọi · lịch tuần (schedule) + chỉ số · cửa hàng · xúc xắc
//   tự tin · so hợp đồng (compare) · vạch lời ở hội đồng (present) · bấm nhanh (pha cà phê) · điền từ (cách nói tán tỉnh lịch sự).
StoryEngine.story({
  id: "cafe-lune",
  engine: "2",
  genre: { en: "Romance · slice of life", vi: "Tình cảm · đời thường" },
  title: { en: "Café Lune", vi: "Café Lune" },
  tagline: { en: "One summer by the sea. Three people who might change your life. One café about to disappear.", vi: "Một mùa hè bên biển. Ba người có thể thay đổi đời bạn. Một quán cà phê sắp biến mất." },
  natives: ["vi", "en"], learns: ["en"],
  start: "e1", titleScene: "promenade", stage: "focus",
  theme: { ac: "#f0a868" },
  me: { role: { en: "New barista at Café Lune, Brighton. Four weeks of summer work.", vi: "Pha chế mới ở Café Lune, Brighton. Bốn tuần làm thêm mùa hè." },
    goal: { en: "Secret: you want a reason to stay in England after the summer.", vi: "Bí mật: bạn muốn có một lý do để ở lại Anh sau mùa hè." } },
  chars: {
    rosa: { known: true, name: "Rosa Bellini", short: "Rosa", g: "F", color: "#f0b27a", rate: 0.95, pitch: 1.0, role: { en: "Owner of Café Lune. 68, warm, stubborn. Hired you over a video call.", vi: "Chủ Café Lune. 68 tuổi, ấm áp, cứng đầu. Nhận bạn qua một cuộc gọi video." },
      notes: [{ if: s => s.truth("T1"), t: { en: "Mila is her granddaughter. They haven't spoken in three years.", vi: "Mila là cháu gái bà. Hai bà cháu không nói chuyện ba năm rồi." } }] },
    mila: { name: "Mila", g: "F", color: "#ff8fb1", rate: 1.06, pitch: 1.12, hint: { en: "Someone singing on the pier.", vi: "Ai đó đang hát trên cầu tàu." }, role: { en: "Street musician, 24. Swims in the sea every morning. Never plans anything.", vi: "Nhạc công đường phố, 24 tuổi. Sáng nào cũng bơi biển. Chẳng bao giờ lên kế hoạch." },
      notes: [{ t: { en: "Likes: vinyl, sea swimming, honesty. Dislikes: plans, small talk.", vi: "Thích: đĩa than, bơi biển, sự thật thà. Ghét: kế hoạch, chuyện phiếm." } }, { if: s => s.truth("T1"), t: { en: "Rosa's granddaughter.", vi: "Cháu gái bà Rosa." } }] },
    ines: { name: "Inês Duarte", short: "Inês", g: "F", color: "#8fc1e8", rate: 1.0, pitch: 1.04, hint: { en: "A regular who orders very precisely.", vi: "Một khách quen gọi món cực kỳ chính xác." }, role: { en: "Architect, 27, from Lisbon. Precise, funny when she relaxes. Always on time.", vi: "Kiến trúc sư, 27 tuổi, người Lisbon. Chính xác, vui tính khi thả lỏng. Luôn đúng giờ." },
      notes: [{ t: { en: "Likes: old buildings, books, being on time. Dislikes: lateness, loud places.", vi: "Thích: nhà cổ, sách, đúng giờ. Ghét: trễ hẹn, chỗ ồn ào." } }, { if: s => s.truth("T3"), t: { en: "She designed the new Blanc building — on the café's land.", vi: "Cô thiết kế toà nhà Blanc mới — trên đất của quán." } }] },
    theo: { name: "Theo Okafor", short: "Theo", g: "M", color: "#9fd49a", rate: 1.03, pitch: 0.96, hint: { en: "The rival kitchen.", vi: "Căn bếp đối thủ." }, role: { en: "Chef at Blanc, 26. Ambitious, kind under the noise. Plays five-a-side on Sundays.", vi: "Đầu bếp ở Blanc, 26 tuổi. Tham vọng, tốt bụng dưới vẻ ồn ào. Chủ nhật đá bóng năm người." },
      notes: [{ t: { en: "Likes: cooking, football, people who try. Dislikes: arrogance, fake praise.", vi: "Thích: nấu ăn, bóng đá, người chịu cố gắng. Ghét: kiêu ngạo, khen giả." } }, { if: s => s.truth("T2"), t: { en: "He hates working for Victor. He dreams of his own place.", vi: "Anh ghét làm cho Victor. Anh mơ có quán riêng." } }] },
    victor: { name: "Victor Crane", short: "Victor", g: "M", color: "#c9a7e0", rate: 0.92, pitch: 0.85, hint: { en: "Whoever owns Blanc.", vi: "Chủ của Blanc." }, role: { en: "Owner of Blanc. Smiles like a contract.", vi: "Chủ nhà hàng Blanc. Cười như một bản hợp đồng." } },
  },
  scenes: {
    train: { kind: "car", name: { en: "Train to Brighton", vi: "Tàu đi Brighton" }, time: { en: "Week 1 · Monday", vi: "Tuần 1 · Thứ Hai" }, amb: "room" },
    promenade: { kind: "dawn", name: { en: "Seafront", vi: "Đường ven biển" }, fx: "sun", amb: "sea" },
    cafe: { kind: "pub", name: { en: "Café Lune", vi: "Café Lune" }, amb: "room" },
    pier: { kind: "pier", name: { en: "Palace Pier", vi: "Cầu tàu Palace" }, fx: "dusk", amb: "sea" },
    blanc: { kind: "court", name: { en: "Blanc", vi: "Nhà hàng Blanc" }, amb: "hall" },
    lanes: { kind: "corridor", name: { en: "The Lanes", vi: "Phố The Lanes" }, amb: "room" },
    beachnight: { kind: "dawn", name: { en: "Beach at night", vi: "Bãi biển về đêm" }, fx: "night", amb: "sea" },
    flat: { kind: "room", name: { en: "Your room above the café", vi: "Phòng bạn trên tầng quán" }, amb: "room" },
    basement: { kind: "interview", name: { en: "The café cellar", vi: "Hầm quán" }, amb: "room", fx: "night" },
    festival: { kind: "pier", name: { en: "Summer festival", vi: "Lễ hội mùa hè" }, fx: "dusk", amb: "hall" },
    council: { kind: "court", name: { en: "Town hall", vi: "Toà thị chính" }, amb: "hall" },
  },
  truthTotal: 6,
  chapters: [
    { ch: 1, title: { en: "First Shift", vi: "Ca đầu tiên" }, sum: { en: "A new town, a broken coffee machine and three strangers who keep coming back.", vi: "Thị trấn mới, máy pha cà phê hỏng và ba người lạ cứ quay lại mãi." } },
    { ch: 2, title: { en: "Mixed Signals", vi: "Tín hiệu lẫn lộn" }, sum: { en: "A first date, a letter from the landlord, and a secret under the café floor.", vi: "Buổi hẹn đầu, lá thư của chủ nhà, và bí mật dưới sàn quán." } },
    { ch: 3, title: { en: "The Festival", vi: "Lễ hội" }, sum: { en: "One night to save Café Lune. Music, lights — and a kitchen you shouldn't enter.", vi: "Một đêm để cứu Café Lune. Âm nhạc, đèn hoa — và một căn bếp bạn không nên bước vào." } },
    { ch: 4, title: { en: "Last Summer Night", vi: "Đêm cuối mùa hè" }, sum: { en: "The council decides. You decide who you tell.", vi: "Hội đồng quyết định. Bạn quyết định nói với ai." } },
  ],
});
/* BIBLE (người viết biết, người chơi ghép dần)
  T1 Mila là cháu gái Rosa; bỏ đi sau trận cãi nhau về việc Mila không chịu học nghề quán. Ch2 (ảnh trong hầm) / Ch3.
  T2 Theo ghét làm cho Victor; mơ quán riêng “nơi người ta ăn như ở nhà”. Ch2–3 nếu thân Theo.
  T3 Inês thiết kế toà Blanc mới trên đất của quán — cô không biết đó là Café Lune. Ch2 (bản vẽ).
  T4 Tranh gạch men 1923 dưới lớp sơn tường hầm → toà nhà có thể được công nhận di sản → không bán được. Ch2 hầm.
  T5 Victor mua món nợ của Rosa và hối lộ ông chủ nhà (Mr Hale) để ép bán. Ch3 (lẻn vào bếp Blanc / Theo giúp).
  T6 Rosa giữ lá thư xin lỗi chưa gửi cho Mila. Ch4.
  KẾT: tình yêu với Mila / Inês / Theo (♥ ≥ 8 + tỏ tình) · Bạn tốt của tất cả · quán được cứu / mất · ở lại / rời Anh.
*/
