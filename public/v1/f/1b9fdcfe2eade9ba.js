/* Keep Enmi's original portrait overview; only add story-specific copy/actions. */
(() => {
 const E=StoryEngine,V=ValeDemo;
 V.decorateTitle=()=>{const panel=V.q('.se-panel.ov'),body=V.q('.se-ovb');if(!body)return;
  const meta=V.caseMeta(),has=E.hasRun(),blurb=body.querySelector('.se-ovd');
  if(blurb)blurb.innerHTML=V.bi(E.S().tagline||{en:'Investigate at your own pace.',vi:'Điều tra theo nhịp của bạn.'});
  const coverTitle=panel.querySelector('.se-ovt');if(coverTitle)coverTitle.insertAdjacentHTML('afterbegin',`<em>PART ${meta.part} · THE VALE DOSSIERS · 0.5</em>`);
  const me=body.querySelector('[data-mebox]');if(me)me.innerHTML='<div class="vd-mobile-intro"><b>You are Adrian Vale · Bạn là thám tử Adrian Vale</b><small>Male protagonist · Nhân vật nam, tên cố định</small><p>Observe, question and draw your own conclusions.<span class="vd-vi">Trực tiếp quan sát, hỏi chuyện và tự suy luận.</span></p></div>';
  // Native collection counts include intermediate chapter outcomes. Keep its
  // history/action intact and distinguish it from the four final case endings.
  const outcomes=body.querySelector('.se-ovend1>span>b');if(outcomes)outcomes.textContent=E.nat({en:'Chapter & case outcomes',vi:'Kết chương và kết vụ án'});
  body.querySelector('.se-ovn')?.remove();
  const start=body.querySelector('[data-go="new"]');if(start)start.innerHTML=has?'Begin again · Chơi lại':'Begin investigation · Bắt đầu điều tra';
  const cont=body.querySelector('[data-go="cont"]');if(cont)cont.innerHTML='Continue · Tiếp tục điều tra';
  body.insertAdjacentHTML('beforeend',`<div class="vd-title-links"><button class="se-btn" data-vd="guide">How to play · Cách chơi</button><button class="se-btn" data-vd="settings">Settings · Cài đặt</button><button class="se-btn" data-vd="routebook">Routes · Sơ đồ nhánh</button><button class="se-btn" data-vd="credits">Sources · Nguồn</button></div><p class="se-mute">${V.demoOnly?'Chapter 1 demo · 3 chapter outcomes<span class="vd-vi">Demo Chương 1 · 3 kết chương</span>':`Part ${meta.part} · ${meta.chapters} chapters · ${meta.endings} case endings<span class="vd-vi">Phần ${meta.part} · ${meta.chapters} chương · ${meta.endings} kết toàn vụ án</span>`}</p>`);
  panel.addEventListener('click',e=>{const a=e.target.closest('[data-vd]')?.dataset.vd;if(a){e.stopImmediatePropagation();V[a]?.();return;}if(e.target.closest('[data-go="new"]')){e.stopImmediatePropagation();has?V.restart():V.start();}},true);
 };
})();
