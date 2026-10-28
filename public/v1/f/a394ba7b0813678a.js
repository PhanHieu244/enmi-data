// THE STATEMENT — KHUNG TRUYỆN (nhân vật, cảnh, cách ghép). Mỗi chương 1 file story/chN.js gọi StoryEngine.chapter({…}).
// Định dạng: tools/games/_lib/story/README.md · kịch bản: docs/games/the-statement-KICH-BAN.md
StoryEngine.story({
  id: "the-interpreter",
  title: { en: "The Statement", vi: "Lời khai" },
  tagline: { en: "One wrong word can put an innocent man in prison.", vi: "Ghi sai một chữ, người vô tội vào tù." },
  natives: ["vi", "en"], learns: ["en"],
  start: "pro",
  titleScene: "pier",

  chars: {
    ruth: { name: "DI Ruth Calder", short: "Ruth", g: "F", color: "#8fb3d9", rate: 0.95, pitch: 0.9, role: { en: "Detective Inspector. Your mentor. Trusts evidence, not people.", vi: "Thanh tra. Người kèm cặp bạn. Tin bằng chứng, không tin người." } },
    owen: { name: "DS Owen Price", short: "Owen", g: "M", color: "#e0a868", rate: 1.06, pitch: 1.05, role: { en: "Detective Sergeant. Friendly. In a hurry to close the case.", vi: "Trung sĩ. Thân thiện. Muốn đóng vụ án thật nhanh." } },
    kieran: { name: "Kieran Doyle", short: "Kieran", g: "M", color: "#9fd4a3", rate: 1.02, pitch: 1.2, role: { en: "The only witness. 16 years old. Terrified.", vi: "Nhân chứng duy nhất. 16 tuổi. Sợ hãi." } },
    sam: { name: "Sam", g: "M", color: "#f0c987", rate: 1, pitch: 1.1, hideInBook: true, role: { en: "Your little brother. Missing for four months.", vi: "Em trai bạn. Mất liên lạc bốn tháng." } },
    jim: { name: "Jim Hardy", short: "Jim", g: "M", color: "#d49a9a", rate: 0.94, pitch: 0.85, role: { en: "Owner of The Anchor pub. Sees everything, says little.", vi: "Chủ quán rượu The Anchor. Thấy hết, ít nói." } },
    judge: { name: "Defence lawyer", short: "Lawyer", g: "M", color: "#c9b28a", rate: 0.9, pitch: 0.8, hideInBook: true },
    caller: { name: "???", g: "M", color: "#888", rate: 0.9, pitch: 0.8, hideInBook: true },
  },
  // nhãn “… sẽ nhớ điều này”: sus = Owen để ý bạn
  remember: { sus: { who: "owen", up: { en: "Owen is watching you more closely.", vi: "Owen để ý bạn hơn." }, down: { en: "Owen relaxes a little.", vi: "Owen bớt cảnh giác." } } },

  scenes: {
    court: { kind: "court", time: { en: "Six days later", vi: "Sáu ngày sau" }, name: { en: "Crown Court", vi: "Toà án" } },
    room: { kind: "room", time: { en: "3:05 a.m.", vi: "3 giờ 05 sáng" }, rain: true, name: { en: "Your room", vi: "Phòng trọ" } },
    pier: { kind: "pier", time: { en: "3:20 a.m.", vi: "3 giờ 20 sáng" }, fog: true, name: { en: "North pier", vi: "Cầu tàu phía bắc" } },
    car: { kind: "car", time: { en: "4:05 a.m.", vi: "4 giờ 05 sáng" }, rain: true, name: { en: "Police car", vi: "Xe cảnh sát" } },
    pub: { kind: "pub", time: { en: "4:05 a.m.", vi: "4 giờ 05 sáng" }, name: { en: "The Anchor", vi: "Quán The Anchor" } },
    interview: { kind: "interview", time: { en: "4:30 a.m.", vi: "4 giờ 30 sáng" }, name: { en: "Interview Room 2", vi: "Phòng thẩm vấn số 2" } },
    corridor: { kind: "corridor", time: { en: "5:50 a.m.", vi: "5 giờ 50 sáng" }, name: { en: "Station corridor", vi: "Hành lang đồn" } },
    dawn: { kind: "dawn", time: { en: "6:40 a.m.", vi: "6 giờ 40 sáng" }, fog: true, name: { en: "Harbour at dawn", vi: "Bến cảng lúc rạng sáng" } },
  },

  truthTotal: 12,
});
