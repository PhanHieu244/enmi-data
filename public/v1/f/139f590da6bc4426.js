/* Current-run records, shared by the native casebook and investigation board. */
(() => {
 const E=StoryEngine,V=ValeDemo,{esc}=E;
 const nativeArt=E.itemArt,nativeView=E.ui.itemView,nativeNotice=E.ui.itemNotice;
 const fold=t=>String(t||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d');
 const text=t=>typeof t==='string'?t:Object.values(t||{}).filter(v=>typeof v==='string').join(' ');
 const label={object:{en:'Object / document',vi:'Đồ vật / tài liệu'},testimony:{en:'Testimony',vi:'Lời khai'},observation:{en:'Observed detail',vi:'Chi tiết quan sát'},inference:{en:'Conclusion',vi:'Suy luận'}};
 const artAliases={letter:'letter',paper:'paper',newspaper:'newspaper',photograph:'photo',portrait:'portrait',invitation:'letter',agreement:'agreement',parcel:'parcel',register:'register',pin:'pin',coat:'coat',receipt:'paper',cab:'cab',gate:'gate'};
 V.recordText=t=>E.ui.investigationText(t);
 // Opt in without changing the native engine's default language policy. Keep
 // semantic text nodes alive when translation changes; never redraw a puzzle.
 E.ui.investigationText=t=>{
  const main=E.tgt(t),sub=E.sub(t);
  return `<span class="vd-investigation-copy"><span class="vd-investigation-main" lang="${esc(E.L)}">${esc(main)}</span>${sub?`<span class="vd-investigation-sub" lang="${esc(E.N)}"${E.G().set.tr?'':' hidden'}>${esc(sub)}</span>`:''}</span>`;
 };
 const setTr=E.ui.setTr;
 E.ui.setTr=(...args)=>{const result=setTr(...args);document.querySelectorAll('.vd-investigation-sub').forEach(el=>{el.hidden=!E.G().set.tr;});return result;};
 E.ui.itemNotice=id=>{
  const result=nativeNotice(id),it=E.S()?.items?.[id];if(it&&!E.auto)document.querySelectorAll('.se-item-receipt[data-record-id]').forEach(el=>{if(el.dataset.recordId===id){const title=el.querySelector(':scope>span>b');if(title)title.innerHTML=E.ui.investigationText(it.name);}});return result;
 };
 E.evidenceMeta=id=>{
  const it=E.S()?.items?.[id]||{},raw=it.recordType||it.kind||'observation';
  const type=raw==='document'?'object':['object','testimony','inference','observation'].includes(raw)?raw:'observation';
  const who=it.who||'',portrait=who==='matthias'&&E.known(who)?'matthias-unmasked':who;
  return {type,group:type==='testimony'?'testimony':type==='inference'?'inference':'objects',who,chapter:+it.chapter||+(id.match(/^c(\d)_/)?.[1])||1,art:type==='testimony'&&portrait?'im-'+portrait:id==='visitor_observed'?'im-wren_door':'im-evidence-'+(artAliases[it.artAlias]||it.artAlias||'paper'),brief:it.brief||it.desc,sourceLabel:it.sourceLabel||it.source||label[type]};
 };
 E.itemArt=(id,cls='')=>{
  const it=E.S()?.items?.[id];if(!it)return nativeArt(id,cls);
  const m=E.evidenceMeta(id);
  return `<span class="se-ia vd-record-art ${esc(cls)} is-${m.type}" aria-hidden="true"><i class="${esc(m.art)}"></i>${m.type==='testimony'?'<span class="vd-quote-mark">“</span>':m.type==='inference'?'<span class="vd-inference-mark">∴</span>':''}</span>`;
 };
 E.ui.itemView=id=>{
  nativeView(id);const it=E.S()?.items?.[id],v=V.q('.se-iv');if(!it||!v)return;
  const m=E.evidenceMeta(id),card=v.querySelector('.se-ivc'),heading=card.querySelector(':scope>b'),desc=card.querySelector(':scope>p');
  v.classList.add('vd-record-detail');v.setAttribute('role','dialog');v.setAttribute('aria-modal','true');v.setAttribute('aria-label',E.tgt(it.name));
  heading.innerHTML=E.ui.investigationText(it.name);desc.innerHTML=E.ui.investigationText(it.desc);
  heading.insertAdjacentHTML('beforebegin',`<span class="vd-record-kind is-${m.type}">${E.ui.investigationText(label[m.type])}</span>`);
  desc.insertAdjacentHTML('afterend',`<p class="vd-record-source">${E.ui.investigationText(m.sourceLabel)}</p>${m.type==='testimony'?`<p class="vd-record-note">${E.ui.investigationText({en:'An account to check against other evidence.',vi:'Lời kể cần được đối chiếu với chứng cứ khác.'})}</p>`:''}`);
  const hint=card.querySelector(':scope>small');if(hint)hint.remove();
  const close=document.createElement('button');close.className='se-ib vd-record-close';close.dataset.vdClose='';close.setAttribute('aria-label','Back to records · Về hồ sơ');close.innerHTML='×';card.prepend(close);
  const click=v.onclick;
  v.onclick=e=>{if(e.target===v||e.target.closest('[data-vd-close],[data-cw],[data-cwi],.se-cwl'))click?.(e);};
  v.onkeydown=e=>{if(e.key==='Escape'){e.preventDefault();close.click();}};
  close.focus({preventScroll:true});
 };
 const mountRecords=panel=>{
  const R=E.R(),S=E.S(),ids=R.items.filter(id=>S.items[id]),groups=[...new Set(ids.map(id=>E.evidenceMeta(id).chapter))].sort((a,b)=>b-a);
  const state=V.recordBrowser||={filter:'all',query:''};
  panel.classList.add('vd-record-browser');
  const card=id=>{const it=S.items[id],m=E.evidenceMeta(id);return `<button class="vd-record-card" data-it="${esc(id)}" data-record-group="${m.group}" data-record-search="${esc(fold(text(it.name)+' '+text(it.desc)+' '+text(m.sourceLabel)))}">${E.itemArt(id)}<span class="vd-record-copy"><span class="vd-record-kind is-${m.type}">${esc(E.nat(label[m.type]))}</span><b>${V.recordText(it.name)}</b><span class="vd-record-brief">${V.recordText(m.brief)}</span><small>${V.recordText(m.sourceLabel)}</small></span></button>`;};
  panel.innerHTML=`<div class="vd-record-controls"><div class="vd-record-filters" role="group" aria-label="Record type · Loại hồ sơ">${[['all','All','Tất cả'],['objects','Objects & traces','Đồ vật / dấu vết'],['testimony','Testimony','Lời khai']].map(([id,en,vi])=>`<button class="se-btn sm" data-record-filter="${id}" aria-pressed="false"><span>${en}</span><small>${vi}</small></button>`).join('')}</div><label class="vd-record-search"><span>Search records · Tìm hồ sơ</span><input class="se-in" type="search" autocomplete="off" placeholder="Name, detail or source · Tên, chi tiết, nguồn" value="${esc(state.query)}"></label><p class="vd-record-count" role="status" aria-live="polite"></p></div><div class="vd-record-groups">${groups.map((ch,i)=>`<details class="vd-record-chapter" data-record-chapter="${ch}" ${i===0?'open':''}><summary>Chapter ${ch} · Chương ${ch}<small></small></summary><div class="vd-record-list">${ids.filter(id=>E.evidenceMeta(id).chapter===ch).map(card).join('')}</div></details>`).join('')}</div><p class="vd-record-empty" hidden>No matching records.<span class="vd-vi">Không có hồ sơ phù hợp. Thử đổi bộ lọc hoặc từ tìm kiếm.</span></p>`;
  const apply=()=>{
   const words=fold(state.query).trim().split(/\s+/).filter(Boolean);let shown=0;
   panel.querySelectorAll('[data-record-group]').forEach(el=>{const visible=(state.filter==='all'||el.dataset.recordGroup===state.filter)&&words.every(w=>el.dataset.recordSearch.includes(w));el.hidden=!visible;if(visible)shown++;});
   panel.querySelectorAll('[data-record-chapter]').forEach(el=>{const count=[...el.querySelectorAll('[data-it]')].filter(e=>!e.hidden).length;el.hidden=!count;el.querySelector('summary small').textContent=count?String(count):'';if(state.query.trim())el.open=true;});
   panel.querySelectorAll('[data-record-filter]').forEach(b=>{const on=b.dataset.recordFilter===state.filter;b.classList.toggle('on',on);b.setAttribute('aria-pressed',String(on));});
   panel.querySelector('.vd-record-count').textContent=`${shown} / ${ids.length} records · hồ sơ`;
   panel.querySelector('.vd-record-empty').hidden=shown>0;
  };
  panel.addEventListener('click',e=>{const b=e.target.closest('[data-record-filter]');if(b){state.filter=b.dataset.recordFilter;apply();E.sfx('tap');}});
  panel.querySelector('input').oninput=e=>{state.query=e.target.value;apply();};apply();
 };
 const mountConclusions=panel=>{
  const R=E.R(),S=E.S(),earned=Object.values(R.caseConclusions||{}),inferred=R.items.filter(id=>S.items[id]&&E.evidenceMeta(id).type==='inference'),ending=R.done&&S.endings[R.done]?.final?S.endings[R.done]:null;
  panel.classList.add('vd-conclusions');
  panel.innerHTML=(ending?`<article class="vd-case-resolution"><small>CASE OUTCOME · KẾT QUẢ VỤ ÁN</small><h3>${V.recordText(ending.title)}</h3><p>${V.recordText(ending.sum)}</p></article>`:'')+`<p class="se-mute">Conclusions as recorded at each chapter. Later evidence may settle an earlier open question.<span class="vd-vi">Suy luận được giữ theo thời điểm từng chương. Chứng cứ về sau có thể giải đáp điều trước đó còn bỏ ngỏ.</span></p>`+earned.map(c=>`<article class="vd-conclusion"><small>Recorded in Chapter ${+c.chapter||1} · Ghi ở Chương ${+c.chapter||1}</small><h3>${V.recordText(c.label)}</h3><div>${(c.sources||[]).filter(id=>R.items.includes(id)&&S.items[id]).map(id=>`<button class="se-btn sm" data-it="${esc(id)}">${E.itemArt(id,'sm')}<span>${V.recordText(S.items[id].name)}</span></button>`).join('')}</div></article>`).join('')+inferred.map(id=>`<button class="vd-record-card" data-it="${esc(id)}">${E.itemArt(id)}<span class="vd-record-copy"><small>Recorded in Chapter ${E.evidenceMeta(id).chapter} · Ghi ở Chương ${E.evidenceMeta(id).chapter}</small><b>${V.recordText(S.items[id].name)}</b><span>${V.recordText(E.evidenceMeta(id).brief)}</span></span></button>`).join('')+(!earned.length&&!inferred.length?'<p>No conclusions yet.<span class="vd-vi">Chưa có suy luận được ghi lại.</span></p>':'');
 };
 E.on('bookTab',({tab,panel,first})=>{if(!first)return;if(tab==='items')mountRecords(panel);else if(tab==='truths'&&!Object.keys(E.S().truths||{}).length)mountConclusions(panel);});
})();
