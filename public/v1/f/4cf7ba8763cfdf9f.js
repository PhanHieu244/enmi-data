/* Retain the native mobile overview, protagonist card and reading preferences. */
(() => {
  const E=StoryEngine,V=MobileVN;
  // Metadata hiển thị có sẵn từ đầu; không tải cả sáu chương để đếm kết thúc.
  // c1_end…c5_end là mốc kết chương, không phải một trong mười kết truyện.
  const endings=[
    ['e1_tides','E1 · Between Tides','E1 · Giữa hai con nước'],
    ['e2_low_water','E2 · Low Water','E2 · Nước ròng'],
    ['e3_half_truth','E3 · Half the Truth','E3 · Nửa sự thật'],
    ['e4_stranger','E4 · The Outsider','E4 · Người ngoài'],
    ['e5_envelope','E5 · The Envelope','E5 · Phong bì'],
    ['e6_ampoules','E6 · The Ampoules','E6 · Những ống thuốc'],
    ['e7_sand','E7 · Sand','E7 · Cát'],
    ['e8_refuge','The Refuge Box','Chòi trú nạn'],
    ['e9_mercy','E9 · Mercy','E9 · Lòng thương'],
    ['e10_keeper','E10 · The Keeper','E10 · Người gác nước'],
  ];
  V.decorateTitle=()=>{
    const panel=V.q('.se-panel.ov'),body=V.q('.se-ovb');
    if(!panel||!body)return;
    const has=E.hasRun(),blurb=body.querySelector('.se-ovd');
    if(blurb)blurb.innerHTML=V.bi(E.S().tagline);
    panel.querySelector('.se-ovt')?.insertAdjacentHTML('afterbegin','<em>BETWEEN TIDES · SIX CHAPTERS</em>');
    const start=body.querySelector('[data-go="new"]'),cont=body.querySelector('[data-go="cont"]');
    if(start)start.textContent=has?'Begin again · Chơi lại':'Begin the story · Bắt đầu câu chuyện';
    if(cont)cont.textContent='Continue · Tiếp tục';
    const endingRow=panel.querySelector('.se-ovend1'),unlocked=endings.filter(([id])=>E.G().endings?.[id]);
    if(endingRow){
      endingRow.querySelector('em').textContent=`${unlocked.length}/${endings.length}`;
      endingRow.querySelector('.se-ovdots').innerHTML=endings.map(([id])=>`<u class="${E.G().endings?.[id]?'on':''}"></u>`).join('');
      endingRow.querySelector('small').textContent=unlocked.length?unlocked.slice(-2).map(([id,en,vi])=>E.nat(E.S().endings?.[id]?.title||{en,vi})).join(' · '):E.nat({en:'None yet',vi:'Chưa có'});
    }
    body.insertAdjacentHTML('beforeend','<div class="vd-title-links"><button class="se-btn" data-mobile="guide">How to play · Cách chơi</button><button class="se-btn" data-mobile="settings">Settings · Cài đặt</button><button class="se-btn" data-mobile="routebook">Routes · Sơ đồ nhánh</button><button class="se-btn" data-mobile="credits">About · Thông tin</button></div><p class="vd-build-note">Six chapters · Ten endings · English & Vietnamese<br>Sáu chương · Mười kết thúc · Anh–Việt</p>');
    panel.addEventListener('click',event=>{
      const action=event.target.closest('[data-mobile]')?.dataset.mobile;
      if(action){event.stopImmediatePropagation();V[action]?.();return;}
      if(event.target.closest('[data-go="new"]')){event.stopImmediatePropagation();has?V.restart():V.start();}
    },true);
  };
})();
