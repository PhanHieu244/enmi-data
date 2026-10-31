/* Vale Dossiers, Part III. Native Enmi story data; all prose is newly written.
 * Source plot: Arthur Conan Doyle, Silver Blaze (1892). English is master.
 * Separate save identity; no previous-case inventory or knowledge is imported. */
StoryEngine.story({
 id:'vale-dossiers-part3-v01',engine:'3',title:{en:'The Vale Dossiers · Part III',vi:'Hồ sơ Vale · Phần III'},
 tagline:{en:'The Horse That Vanished · A missing horse. A dead trainer. Two questions.',vi:'Con ngựa biến mất · Một con ngựa mất tích. Một người huấn luyện thiệt mạng. Hai câu hỏi.'},
 natives:['vi','en'],learns:['en'],start:'p3c1_open',titleScene:'p3_yard',stage:'focus',fit:'cover',detailExplore:true,theme:{ac:'#d6b878'},
 me:{name:'Adrian Vale',g:'M',fixed:true,role:{en:'You are Adrian Vale, a consulting detective. This story uses a fixed name and male protagonist.',vi:'Bạn là Adrian Vale, thám tử tư. Truyện có nhân vật chính nam với tên cố định.'},goal:{en:'Find Ember Star. Establish what happened to Thomas Greaves without forcing both questions into one answer.',vi:'Tìm Ember Star. Xác minh chuyện xảy ra với Thomas Greaves, không ép hai câu hỏi vào một lời giải.'}},
 chars:{
  reed:{name:'Eleanor Reed',short:'Reed',g:'F',known:true,color:'#9bc1bc',rate:.95,role:{en:'Your research assistant, formerly a court reporter.',vi:'Trợ lý nghiên cứu của bạn, từng ghi chép tại tòa.'}},
  elin:{name:'Lady Elin Wycliffe',short:'Lady Wycliffe',g:'F',known:true,color:'#b8c2d5',role:{en:'Owner of Ember Star and the Wycliffe training stable.',vi:'Chủ ngựa Ember Star và trại huấn luyện Wycliffe.'}},
  ben:{name:'Ben Larkin',short:'Ben',g:'M',known:true,color:'#c4b196',role:{en:'A stable worker who was on duty the night Ember Star disappeared.',vi:'Nhân viên trại ngựa trực đêm Ember Star mất tích.'}},
  nora:{name:'Nora Finch',short:'Nora',g:'F',known:true,color:'#aac2a4',role:{en:'A veterinary assistant who knows the horses and keeps their care records.',vi:'Trợ lý thú y quen đàn ngựa và phụ trách ghi chép chăm sóc.'}},
  dorn:{name:'Felix Dorn',short:'Dorn',g:'M',known:true,color:'#c2aaa0',role:{en:'Trainer at the neighbouring Greybank stable.',vi:'Người huấn luyện tại trại Greybank gần đó.'}}
 },
 scenes:{
  p3_stable:{kind:'hall',size:[1024,1536],name:{en:'Wycliffe stable · the empty stall',vi:'Trại Wycliffe · chuồng trống'},amb:'wind'},
  p3_yard:{kind:'house',size:[1024,1536],name:{en:'Wycliffe stable · yard',vi:'Trại Wycliffe · sân'},amb:'wind'},
  p3_moor:{kind:'street',size:[1024,1536],name:{en:'The moor · drainage path',vi:'Đồng hoang · lối ven rãnh nước'},amb:'wind'},
  p3_hollow:{kind:'street',size:[1024,1536],name:{en:'The hollow · preserved ground',vi:'Hõm đất · khu vực được giữ nguyên'},amb:'wind'},
  p3_dorn_yard:{kind:'house',size:[1024,1536],name:{en:'Greybank · Dorn’s stable',vi:'Greybank · trại ngựa của Dorn'},amb:'wind'},
  p3_office:{kind:'study',size:[1024,1536],name:{en:'Wycliffe stable · office',vi:'Trại Wycliffe · văn phòng'}},
  p3_finish:{kind:'house',size:[1024,1536],name:{en:'Wessex course · preparation enclosure',vi:'Trường đua Wessex · khu chuẩn bị'},amb:'wind'}
 },
 chapters:[
  {ch:1,start:'p3c1_open',title:{en:'An Empty Stall',vi:'Chuồng trống'},sum:{en:'Meet the people left behind. Record the last confirmed sighting.',vi:'Gặp những người ở lại. Ghi lại lần cuối có người xác nhận đã thấy con ngựa.'}},
  {ch:2,start:'p3c2_open',title:{en:'The Moor’s Two Trails',vi:'Hai dấu vết trên đồng hoang'},sum:{en:'Walk the route and separate a trail from a story about it.',vi:'Đi theo dấu vết và phân biệt nó với câu chuyện người ta gán cho nó.'}},
  {ch:3,start:'p3c3_open',title:{en:'What the Dog Did Not Do',vi:'Điều con chó đã không làm'},sum:{en:'Learn what the dog normally does before judging its silence.',vi:'Tìm hiểu phản ứng thường ngày của con chó trước khi nhận xét về sự im lặng.'}},
  {ch:4,start:'p3c4_open',title:{en:'The Trainer’s Other Life',vi:'Cuộc đời khác của người huấn luyện'},sum:{en:'Compare private bills, care records and the objects taken onto the moor.',vi:'Đối chiếu hóa đơn riêng, sổ chăm sóc và đồ vật được mang ra đồng hoang.'}},
  {ch:5,start:'p3c5_open',title:{en:'Before the Starting Bell',vi:'Trước tiếng chuông xuất phát'},sum:{en:'Verify the horse, then decide which explanation your report can support.',vi:'Xác minh con ngựa, rồi quyết định báo cáo có thể đưa ra lời giải nào có căn cứ.'}}
 ],truthTotal:0,
 tags:{observe:{en:'Observe',vi:'Quan sát',c:'#95b8bf'},inquire:{en:'Ask',vi:'Hỏi',c:'#c9b7df'},commit:{en:'Choose',vi:'Lựa chọn',c:'#d6b878'}}
});
