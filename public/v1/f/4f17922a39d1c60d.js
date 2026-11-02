/* THE STATEMENT — direction candidate d2; engine baseline remains 1.0.4.
   Sidecar presentation anchors. No story nodes, conditions, rewards or save fields. */
(function (g) {
  'use strict';
  const base='img/';
  g.StatementPhoneData={
    schema:1, nativeChat:true, revision:'d2', game:'the-interpreter', engineBaseline:'1.0.4', approved:false,
    assets:{
      incoming:base+'phone-hand-incoming-d1.webp', voicemail:base+'phone-voicemail-d1.webp',
      handset:base+'phone-closeup-base-d1.webp', messages:base+'phone-message-compose-d1.webp',
      listening:base+'player-listening-room-d1.webp', charging:base+'phone-charging-record-d1.webp',
      lockscreen:base+'phone-lockscreen-reveal-d1.webp', lockShell:base+'phone-lockscreen-kieran-d1.webp', shell:base+'phone-shell-neutral-d1.webp'
    },
    labels:{lock:{en:'Kieran’s phone',vi:'Điện thoại của Kieran'},compose:{en:'Message to Ruth',vi:'Tin nhắn cho Ruth'},external:{en:'Owen’s phone',vi:'Điện thoại của Owen'}},
    contacts:{
      sam:{name:'Sam',avatar:base+'avatar-sam-d1.webp'},
      ruth:{name:'Ruth Calder',avatar:base+'avatar-ruth-d1.webp'},
      kieran:{name:'Kieran Doyle',avatar:base+'avatar-kieran-d1.webp'},
      maggie:{name:'Maggie Lane',avatar:base+'avatar-maggie-d1.webp'},
      ellie:{name:'Ellie Shaw'},
      caller:{name:{en:'Unknown sender',vi:'Người gửi chưa xác định'}},
      unknown:{name:{en:'Unknown number',vi:'Số lạ'}},
      holt:{name:'Graham Holt'}, finch:{name:'Harold Finch'}
    },
    anchors:[
      {path:'nodes.call[3]',expect:'3:05 a.m.',mode:'voicemail',who:'sam',status:'saved',scope:'nodes.call',presentation:'physical',art:'voicemail',scene:'room',screenRect:[35,28,33,42],screenMode:'voicemail'},
      {path:'nodes.call[5]',expect:"Hey. It’s me.",expectAscii:"Hey. It's me.",mode:'voicemail',who:'sam',gate:'play',scope:'nodes.call',after:'ended'},
      {path:'nodes.call[9]',expect:'3:12 a.m.',mode:'incoming',who:'ruth',scope:'nodes.call',presentation:'physical',art:'incoming',scene:'room',screenRect:[34,23,39,49],screenMode:'incoming'},
      {path:'nodes.call[10]',expect:"It's Calder.",mode:'incoming',who:'ruth',gate:'answer',scope:'nodes.call',listener:true,scene:'room'},
      {path:'nodes.call[11].choice[0].then[0]',expect:'Good. Follow',mode:'connected',who:'ruth',scope:'nodes.call',listener:true,scene:'room',endAfter:true},
      {path:'nodes.call[11].choice[1].then[1]',expect:"That's what we need",mode:'connected',who:'ruth',scope:'nodes.call',listener:true,scene:'room',endAfter:true},
      {path:'nodes.call[11].choice[2].then[0]',expect:"Yes. That's usually",mode:'connected',who:'ruth',scope:'nodes.call',listener:true,scene:'room',endAfter:true},
      {path:'nodes.call[12]',expectGo:'pier',mode:'ended',clear:true},
      {path:'nodes.report[13]',expectLock:'Kieran',mode:'lock',who:'kieran',native:true},
      {path:'nodes.report[14].then[1]',expectListen:"It's me.",mode:'voicemail',who:'caller',gate:'play',after:'clear'},
      {path:'nodes.dawn[14].else[2]',expect:'The lock screen:',mode:'lockscreen',who:'kieran',presentation:'physical',art:'lockscreen',scope:'nodes.dawn[14].else'},
      {path:'nodes.c2_text[2].then[1]',expectChat:'its kieran.',mode:'message',who:'unknown',gate:'open',after:'clear'},
      {path:'nodes.c2_text[3].then[1]',expectChat:'its kieran.',mode:'message',who:'unknown',gate:'open',after:'clear'},
      {path:'nodes.c2_text[4].then[1]',expect:'Only an advert',mode:'message',who:'unknown',status:'advert',after:'clear'},
      {path:'nodes.c3_night[5].then[0]',expectCall:'maggie',mode:'incoming',who:'maggie',native:true,scope:'nodes.c3_night[5]'},
      {path:'nodes.c3_night[5].then[0].call.accept[0]',expect:"Pet, it's Maggie.",mode:'connected',who:'maggie',scope:'nodes.c3_night[5]'},
      {path:'nodes.c3_night[5].then[0].call.accept[2]',expect:'The line goes dead.',mode:'ended',who:'maggie',after:'clear'},
      {path:'nodes.c3_night[5].then[0].call.decline[0]',expect:'You let it ring.',mode:'missed',who:'maggie',after:'clear'},
      {path:'nodes.c3_night[21].choice[0].then[0]',expect:"Don't touch it again.",mode:'connected',who:'ruth',scope:'nodes.c3_night[21]',listener:true,scene:'room',endAfter:true,after:'clear'},
      {path:'nodes.c4_offer[5]',expect:'Your phone buzzes',mode:'battery',who:'unknown',battery:3,after:'clear'},
      {path:'nodes.c4_wire[0]',expect:'The screen shows',mode:'recording',battery:2,after:'clear'},
      {path:'nodes.c4_wire[3].explore.spots[1].then[0]',expect:'A charger is plugged',mode:'charging',presentation:'physical',art:'charging',scene:'study',screenRect:[30,27,40,41],screenMode:'charging',after:'clear'},
      {path:'nodes.c4_wire[9].then[3]',expect:'Beside the chair',mode:'recording',status:'saved',after:'clear'},
      {path:'nodes.c4_wire[9].else[0]',expect:'Your phone died',mode:'poweroff',after:'clear'},
      {path:'nodes.c4_kitchen[10]',expectCall:'ruth',mode:'incoming',who:'ruth',native:true,scope:'nodes.c4_kitchen[10]'},
      {path:'nodes.c4_kitchen[10].call.accept[0].then[0]',expect:'Kieran is missing.',mode:'connected',who:'ruth',scope:'nodes.c4_kitchen[10]'},
      {path:'nodes.c4_kitchen[10].call.accept[0].else[0]',expect:'Kieran is safe',mode:'connected',who:'ruth',scope:'nodes.c4_kitchen[10]'},
      {path:'nodes.c4_kitchen[10].call.accept[1].then[0]',expect:'Someone knew',mode:'connected',who:'ruth',scope:'nodes.c4_kitchen[10]'},
      {path:'nodes.c4_kitchen[10].call.accept[2]',expect:'Send me anything',mode:'connected',who:'ruth',scope:'nodes.c4_kitchen[10]',endAfter:true,after:'clear'},
      {path:'nodes.c4_kitchen[10].call.missed[0]',expect:'Missed call',mode:'missed',who:'ruth',after:'clear'},
      {path:'nodes.c5[13].then[0]',expectChat:'help',mode:'message',who:'kieran',gate:'open',after:'clear'},
      {path:'nodes.c5[13].else[0]',expectChat:'They held me',mode:'message',who:'ellie',gate:'open',after:'clear'},
      {path:'nodes.c5_cold[12]',expect:'No signal for calls.',mode:'nosignal',who:'ruth',presentation:'physical',art:'messages',scene:'coldstore',screenRect:[24,16,54,64],screenMode:'nosignal',after:'clear'},
      {path:'nodes.c5_cold[13]',expectType:'Draft a precise',mode:'compose',who:'ruth',native:true},
      {path:'nodes.c5_cold[14]',mode:'compose',who:'ruth',native:true},
      {path:'nodes.c5_cold[14].choice[0].then[0]',expect:'Delivered. Ruth replies',mode:'delivered',who:'ruth',after:'clear'},
      {path:'nodes.c5_cold[14].choice[1].then[0]',expect:'Delivered. Ruth asks',mode:'unsent',who:'ruth',after:'clear'},
      {path:'nodes.c6_court[6].present.segs[4].ok[1]',expect:"Kieran's statement.",mode:'recording-playback',who:'holt',gate:'play',after:'clear'},
      {path:'nodes.c6_court[6].present.segs[5].ok[0]',expect:'Owen has asked me',mode:'recording-playback',who:'finch',gate:'play',after:'clear'},
      {path:'nodes.c6_finch[4]',expect:'I made frightened',mode:'letter-voice',clear:true}
    ]
  };
})(globalThis);
