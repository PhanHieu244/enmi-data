/* THE VALE DOSSIERS — an original bilingual adaptation of public-domain fiction.
 * English is the master text; Vietnamese preserves its evidence and uncertainty.
 * Build 0.4: Part I has six chapters; the player follows Adrian Vale. */
StoryEngine.story({
  id: globalThis.VALE_CHAPTER_DEMO ? "vale-dossiers-chapter1-demo03" : "vale-dossiers-p1c1-v01",
  engine: "3",
  title: { en: "The Vale Dossiers", vi: "Hồ sơ Vale" },
  tagline: { en: "The Portrait and the Crown · A client is not a witness to everything.", vi: "Bức chân dung và vương miện · Không phải chuyện gì khách hàng cũng tận mắt chứng kiến." },
  natives: ["vi", "en"], learns: ["en"], start: "c1_open", titleScene: "study", stage: "focus", fit: "cover", detailExplore: true,
  theme: { ac: "#d6b878" },
  me: {
    name: "Adrian Vale", g: "M",
    role: { en: "You are Adrian Vale, a consulting detective in Victorian London.", vi: "Bạn là Adrian Vale, thám tử tư ở London thời Victoria." },
    goal: { en: "Find out what happened before deciding whom to believe.", vi: "Tìm hiểu chuyện đã xảy ra trước khi quyết định tin ai." }
  },
  tags: {
    observe: { en: "Observe", vi: "Quan sát", c: "#95b8bf" },
    inquire: { en: "Ask", vi: "Hỏi", c: "#c9b7df" },
    challenge: { en: "Challenge", vi: "Chất vấn", c: "#d7a07e" },
    commit: { en: "Choose a route", vi: "Chọn hướng đi", c: "#d6b878" }
  },
  chars: {
    reed: { name: "Eleanor Reed", short: "Reed", g: "F", known: true, color: "#9bc1bc", rate: 0.95,
      role: { en: "Your research assistant. A former court reporter with a precise ear.", vi: "Trợ lý nghiên cứu của bạn. Từng ghi chép tại tòa và rất tinh ý với lời nói." } },
    matthias: { name: "King Matthias of Varenne", short: "Matthias", alias: { en: "The masked visitor", vi: "Vị khách đeo mặt nạ" }, reveal: "manual", g: "M", color: "#d9b584", rate: 0.92,
      role: { en: "A powerful client who wants a private photograph recovered.", vi: "Một khách hàng quyền thế muốn lấy lại bức ảnh riêng tư." } },
    finn: { name: "Finn Mercer", short: "Finn", g: "M", color: "#b7c1d1", rate: 0.98,
      role: { en: "A cab driver who works near Alder Lane.", vi: "Người đánh xe thường đón khách gần ngõ Alder." } },
    bell: { name: "Mrs Bell", short: "Mrs Bell", g: "F", color: "#c5b3a2",
      role: { en: "The housekeeper at Wren House.", vi: "Quản gia của nhà Wren." } },
    celia: { name: "Celia Voss", short: "Celia", alias: { en: "An unfamiliar woman", vi: "Người phụ nữ chưa quen" }, reveal: "manual", g: "F", color: "#c8a7b9",
      role: { en: "A former concert singer. The photograph is said to be in her possession.", vi: "Cựu ca sĩ hòa nhạc. Cô được cho là đang giữ bức ảnh." } },
    hart: { name: "Julian Hart", short: "Hart", alias: { en: "The evening visitor", vi: "Vị khách buổi tối" }, reveal: "manual", g: "M", color: "#a5b7c5",
      role: { en: "A solicitor who regularly visits Wren House.", vi: "Một luật sư thường đến thăm nhà Wren." } }
  },
  scenes: {
    study_desk: { kind: "study", size: [941,1672], name: { en: "The writing desk", vi: "Bàn viết" }, amb: "rain" },
    study_window: { kind: "study", size: [941,1672], name: { en: "By the window", vi: "Bên cửa sổ" }, amb: "rain" },
    study_door: { kind: "hall", size: [941,1672], name: { en: "The landing", vi: "Chiếu nghỉ" }, amb: "rain" },
    cab_stand: { kind: "street", size: [941,1672], name: { en: "Alder Lane · cab stand", vi: "Ngõ Alder · chỗ xe ngựa đỗ" }, time: { en: "9:10 p.m.", vi: "9 giờ 10 tối" }, rain: true, amb: "rain" },
    "act-watermark": { size: [941,1672] },
    "act-unmask": { size: [940,1672] },
    study: { kind: "study", name: { en: "Vale's rooms · 14 Wicker Street", vi: "Văn phòng Vale · 14 phố Wicker" }, time: { en: "London · Thursday evening, 1887", vi: "London · Tối thứ Năm, năm 1887" }, rain: false, amb: "rain" },
    carriage: { kind: "street", name: { en: "The road to Alder Lane", vi: "Đường đến ngõ Alder" }, time: { en: "Later that evening", vi: "Tối hôm ấy, sau đó" }, rain: true, amb: "rain" },
    alder_lane: { kind: "street", name: { en: "Alder Lane", vi: "Ngõ Alder" }, time: { en: "9:10 p.m.", vi: "9 giờ 10 tối" }, rain: true, amb: "rain" },
    service_lane: { kind: "street", name: { en: "Opposite Wren House", vi: "Đối diện nhà Wren" }, time: { en: "9:10 p.m.", vi: "9 giờ 10 tối" }, rain: false },
    wren_door: { kind: "house", name: { en: "Wren House · front steps", vi: "Nhà Wren · bậc cửa trước" }, time: { en: "9:10 p.m.", vi: "9 giờ 10 tối" }, rain: false }
  },
  truthTotal: 0,
  chapters: [
    { ch: 1, start: 'c1_open', title: { en: "The Man Behind the Mask", vi: "Người sau lớp mặt nạ" }, sum: { en: "Question a masked client. Decide how to approach the woman he fears.", vi: "Hỏi chuyện vị khách che mặt. Chọn cách tiếp cận người phụ nữ khiến ông ta lo sợ." } },
    { ch: 2, start: 'c2_open', title: { en: "A House with Two Doors", vi: "Ngôi nhà hai cửa" }, sum: { en: "Follow the comings and goings at Wren House. Ask who can confirm what you have seen.", vi: "Theo dõi người ra vào nhà Wren. Hỏi xem ai có thể xác nhận điều bạn đã thấy." } },
    { ch: 3, start: 'c3_open', title: { en: "An Unexpected Witness", vi: "Nhân chứng bất ngờ" }, sum: { en: "Keep an unusual appointment. Decide what part to play when plans change.", vi: "Đến một cuộc hẹn khác thường. Chọn vai trò của mình khi kế hoạch thay đổi." } },
    { ch: 4, start: 'c4_open', title: { en: "A Small Alarm", vi: "Một tiếng báo động" }, sum: { en: "Choose how to get closer to the photograph, and what limits you will keep.", vi: "Chọn cách đến gần bức ảnh, và những giới hạn bạn sẽ giữ." } },
    { ch: 5, start: 'c5_open', title: { en: "Someone at Your Door", vi: "Người bên cửa nhà bạn" }, sum: { en: "A greeting on your own doorstep tests what you thought you knew.", vi: "Một lời chào ngay trước cửa nhà khiến bạn phải xét lại điều mình tưởng đã biết." } },
    { ch: 6, start: 'c6_open', title: { en: "What a Portrait Is Worth", vi: "Giá trị một bức chân dung" }, sum: { en: "Read the final evidence. Decide what you can stand behind when your client returns.", vi: "Đọc chứng cứ cuối cùng. Quyết định bạn có thể khẳng định điều gì khi khách hàng trở lại." } }
  ]
});
