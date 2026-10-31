(() => {
 const E=StoryEngine,V=ValeDemo;
 E.on('end',(id,hasNext)=>{if(E.auto)return;queueMicrotask(()=>{
  const el=V.q('.se-end'),ending=E.S().endings?.[id];if(!el||!ending)return;
  const ch=ending.ch||E.R().ch||1,totalCh=V.caseMeta().chapters||E.S().chapters.length;el.querySelector('small').textContent=ending.final?((ending.open||/unresolved|limited|overstated|partial/.test(id))?'CASE LEFT OPEN · VỤ ÁN CÒN BỎ NGỎ':'CASE OUTCOME · KẾT QUẢ VỤ ÁN'):`CHAPTER ${ch} COMPLETE · XONG CHƯƠNG ${ch}`;
  const progress=document.createElement('div');progress.className='vd-chapter-progress';progress.style.gridTemplateColumns=`repeat(${totalCh},1fr)`;progress.setAttribute('aria-label',`Chapter ${ch} of ${totalCh} · Chương ${ch} trên ${totalCh}`);progress.innerHTML=Array.from({length:totalCh},(_,i)=>`<i class="${i<ch?'done':''}"></i>`).join('');el.querySelector('small').after(progress);
  const anchor=el.querySelector('.se-stats')||el.querySelector('.se-col');
  if(ending.chapterClose&&anchor)anchor.insertAdjacentHTML('beforebegin',`<div class="vd-chapter-close">${(V.recordText||V.bi)(ending.chapterClose)}</div>`);
  if(ending.nextObjective&&hasNext&&anchor)anchor.insertAdjacentHTML('beforebegin',`<div class="vd-next-objective"><small>Next step · Bước tiếp theo</small>${(V.recordText||V.bi)(ending.nextObjective)}</div>`);
  const tr=el.querySelector('details');if(tr)tr.open=!!E.G().set.tr;
  const stats=el.querySelector('.se-stats');if(stats){const total=Object.keys(E.S().endings||{}).filter(k=>E.S().endings[k].ch===ch),unlocked=total.filter(k=>E.G().endings[k]).length;stats.innerHTML=`<div><b>${unlocked}/${total.length}</b><small>Outcomes · Kết chương</small></div><div><b>${E.R().items.length}</b><small>Records · Hồ sơ</small></div><div><b>${Object.keys(E.G().words).length}</b><small>Saved words · Từ đã lưu</small></div>`;}
  const recap=el.querySelector('.se-recap');if(recap)recap.innerHTML='<b>Your route · Tuyến bạn đã đi</b>'+E.recapList(ch).filter(x=>x.ch===ch).map(x=>'<p>'+V.bi(x.t)+'</p>').join('');
  if(V.demoOnly)el.querySelector('.se-col')?.insertAdjacentHTML('beforebegin','<p class="se-mute">End of the Chapter 1 demo. The complete Part I is included in the ZIP.<span class="vd-vi">Hết demo Chương 1. Bản đầy đủ Phần I nằm trong gói ZIP.</span></p>');
  if(!ending.final&&hasNext)el.querySelector('.se-col')?.insertAdjacentHTML('beforebegin','<p class="se-mute">Your choices and evidence carry into the next chapter.<span class="vd-vi">Lựa chọn và chứng cứ của bạn được giữ sang chương tiếp theo.</span></p>');
 });});
})();
