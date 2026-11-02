/* Current-run records, shared by the native casebook and investigation board. */
(() => {
 const E=StoryEngine,V=ValeDemo,{esc}=E;
 const nativeArt=E.itemArt,nativeView=E.ui.itemView,nativeNotice=E.ui.itemNotice;
 const fold=t=>String(t||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d');
 const text=t=>typeof t==='string'?t:Object.values(t||{}).filter(v=>typeof v==='string').join(' ');
 const searchAliases={invitation:{en:'invitation appointment reply blue ink note',vi:'lời mời thư mời hồi âm mực xanh giấy hẹn'},sealed_note:{en:'unsigned letter envelope appointment',vi:'thư hẹn phong bì thư không ký tên'},wren_address:{en:'Wren House address Alder Lane',vi:'địa chỉ nhà Wren ngõ Alder'}};
 E.recordSearchText=id=>{const it=E.S()?.items?.[id]||{};return [it.name,it.desc,it.brief,it.sourceLabel,it.source,searchAliases[id]].map(text).join(' ');};
 const label={object:{en:'Object / document',vi:'Đồ vật / tài liệu'},testimony:{en:'Testimony',vi:'Lời khai'},observation:{en:'Observed detail',vi:'Chi tiết quan sát'},inference:{en:'Conclusion',vi:'Suy luận'}};
 const artAliases={letter:'letter',paper:'paper',newspaper:'newspaper',photograph:'photo',portrait:'portrait',invitation:'letter',agreement:'agreement',parcel:'parcel',register:'register',pin:'pin',coat:'coat',receipt:'paper',cab:'cab',gate:'gate'};
 V.recordText=t=>E.ui.investigationText(t);
 // A local Translate button switches dense records without duplicating text.
 E.ui.investigationText=t=>E.ui.readingText(t,{compact:true});
 E.ui.itemNotice=id=>{
  const result=nativeNotice(id),it=E.S()?.items?.[id];if(it&&!E.auto)document.querySelectorAll('.se-item-receipt[data-record-id]').forEach(el=>{if(el.dataset.recordId===id){const title=el.querySelector(':scope>span>b');if(title)title.innerHTML=E.ui.investigationText(it.name);}});return result;
 };
 E.evidenceMeta=id=>{
  const it=E.S()?.items?.[id]||{},raw=it.recordType||it.kind||'observation';
  const type=raw==='document'?'object':['object','testimony','inference','observation'].includes(raw)?raw:'observation';
  const who=it.who||'',person=E.S()?.chars?.[who]||{},portrait=who==='matthias'&&E.known(who)?'matthias-unmasked':person.portrait||who;
  return {type,group:type==='testimony'?'testimony':type==='inference'?'inference':'objects',who,chapter:+it.chapter||+(id.match(/^c(\d)_/)?.[1])||1,art:it.recordArt?'im-'+it.recordArt:type==='testimony'&&portrait?'im-'+portrait:id==='visitor_observed'?'im-wren_door':'im-evidence-'+(artAliases[it.artAlias]||it.artAlias||'paper'),portrait:!it.recordArt&&type==='testimony'&&!!portrait,brief:it.brief||it.desc,sourceLabel:it.sourceLabel||it.source||label[type]};
 };
 E.itemArt=(id,cls='')=>{
  if(E.recordKind?.(id)==='inference')return E.inferenceArt(cls);
  const it=E.S()?.items?.[id];if(!it)return nativeArt(id,cls);
  const m=E.evidenceMeta(id),person=E.S()?.chars?.[m.who]||{};
  const real=E.artReal?E.artReal(m.art):E.hasArt?.(m.art)!==false;
  if(!real)return `<span class="se-ia vd-record-empty-art ${esc(cls)}" aria-hidden="true">${E.ICON?.doc||E.ICON?.box||''}</span>`;
  const crop=!person.portrait&&(person.portraitCrop??E.S()?.portraitCrop),cfg=typeof crop==='object'?crop:{};
  const portraitStyle=m.portrait&&crop?` style="--portrait-height:${Number(cfg.height)||310}%;--portrait-top:${Number.isFinite(cfg.top)?cfg.top:-6}%;--portrait-ar:${Number(cfg.aspect)||.5}"`:'';
  return `<span class="se-ia vd-record-art ${esc(cls)} is-${m.type}${m.portrait?' has-portrait':''}" style="--record-color:${esc(person.color||'#526b65')}" aria-hidden="true"><i class="${esc(m.art)}${m.portrait?' se-record-portrait'+(crop?' cropped':''):''}"${portraitStyle}></i></span>`;
 };
 E.ui.itemView=id=>{
  const origin=document.activeElement?.closest?.('[data-reading-scope]'),preferred=origin?origin.dataset.readingLanguage==='native':undefined;
  nativeView(id);const it=E.S()?.items?.[id],v=V.q('.se-iv:not(.se-record-modal)');if(!it||!v)return;
  const m=E.evidenceMeta(id),card=v.querySelector('.se-ivc'),heading=card?.querySelector(':scope>b'),desc=card?.querySelector(':scope>p');
  if(!card||!heading||!desc)return;
  v.classList.add('vd-record-detail');v.setAttribute('role','dialog');v.setAttribute('aria-modal','true');v.setAttribute('aria-label',E.nat(it.name));
  heading.innerHTML=E.ui.investigationText(it.name);desc.innerHTML=E.ui.investigationText(it.desc);
  heading.insertAdjacentHTML('beforebegin',`<span class="vd-record-kind is-${m.type}">${E.ui.investigationText(label[m.type])}</span>`);
  desc.insertAdjacentHTML('afterend',`<details class="vd-record-provenance"><summary>${esc(E.nat({en:'Source',vi:'Nguồn ghi chép'}))}</summary><p class="vd-record-source">${E.ui.investigationText(m.sourceLabel)}</p>${m.type==='testimony'?`<p class="vd-record-note">${E.ui.investigationText({en:'An account to compare with other evidence.',vi:'Lời kể cần đối chiếu với chứng cứ khác.'})}</p>`:''}</details>`);
  const hint=card.querySelector(':scope>small');if(hint)hint.remove();
  let close=card.querySelector('[data-vd-close],[data-item-close]');
  if(!close){close=document.createElement('button');close.className='se-ib vd-record-close';close.dataset.vdClose='';close.setAttribute('aria-label',E.nat({en:'Back to records',vi:'Về hồ sơ'}));close.innerHTML='×';card.prepend(close);}
  if(!card.querySelector('[data-reading-toggle]'))card.insertAdjacentHTML('afterbegin',`<div class="vd-record-reading">${E.ui.readingToggle()}</div>`);
  const tools=document.createElement('header');tools.className='vd-record-detail-tools';
  const language=card.querySelector('.vd-record-reading')||card.querySelector('[data-reading-toggle]');
  if(language)tools.append(language);tools.append(close);card.prepend(tools);
  E.ui.bindReading(v,{native:preferred});
  const click=v.onclick;
  v.onclick=e=>{if(e.target===v||e.target.closest('[data-vd-close],[data-item-close],[data-cw],[data-cwi],.se-cwl,[data-doc]')){if(e.target===v||e.target.closest('[data-vd-close],[data-item-close]'))E.ui.releaseReading(v);click?.(e);}};
  v.onkeydown=e=>{if(e.key==='Escape'){e.preventDefault();e.stopPropagation();close.click();}};
  close.focus({preventScroll:true});
 };
 const mountRecords=panel=>{
  const R=E.R(),S=E.S(),ids=R.items.filter(id=>S.items[id]),groups=[...new Set(ids.map(id=>E.evidenceMeta(id).chapter))].sort((a,b)=>b-a);
  const state=V.recordBrowser||={filter:'all',query:''};
  panel.classList.add('vd-record-browser','vd-records-compact');
  const card=id=>{const it=S.items[id],m=E.evidenceMeta(id);return `<button class="vd-record-card" data-it="${esc(id)}" data-record-group="${m.group}" data-record-search="${esc(fold(E.recordSearchText(id)))}">${E.itemArt(id,'sm')}<span class="vd-record-copy"><b>${V.recordText(it.name)}</b><span class="vd-record-kind is-${m.type}">${esc(E.nat(label[m.type]))}</span></span><span class="se-record-chevron" aria-hidden="true">${E.ICON.right}</span></button>`;};
  panel.innerHTML=`<div class="vd-record-controls"><div class="vd-record-filters" role="group" aria-label="${esc(E.nat({en:'Record type',vi:'Loại hồ sơ'}))}">${[['all','All','Tất cả'],['objects','Objects & traces','Vật & dấu vết'],['testimony','Testimony','Lời khai']].map(([id,en,vi])=>`<button class="se-btn sm" data-record-filter="${id}" aria-pressed="false">${esc(E.nat({en,vi}))}</button>`).join('')}</div><label class="vd-record-search"><span class="se-sr-only">${esc(E.nat({en:'Search records',vi:'Tìm hồ sơ'}))}</span><input class="se-in" type="search" autocomplete="off" placeholder="${esc(E.nat({en:'Search name, detail or source',vi:'Tìm tên, chi tiết hoặc nguồn'}))}" value="${esc(state.query)}"></label><p class="vd-record-count" role="status" aria-live="polite"></p></div><div class="vd-record-groups">${groups.map((ch,i)=>`<details class="vd-record-chapter" data-record-chapter="${ch}" ${i===0?'open':''}><summary>${esc(E.nat({en:`Chapter ${ch}`,vi:`Chương ${ch}`}))}<small></small></summary><div class="vd-record-list">${ids.filter(id=>E.evidenceMeta(id).chapter===ch).map(card).join('')}</div></details>`).join('')}</div><p class="vd-record-empty" hidden>${esc(E.nat({en:'No matching records. Try another filter or search.',vi:'Không có hồ sơ phù hợp. Thử đổi bộ lọc hoặc từ tìm.'}))}</p>`;
  const apply=()=>{
   const words=fold(state.query).trim().split(/\s+/).filter(Boolean);let shown=0;
   panel.querySelectorAll('[data-record-group]').forEach(el=>{const visible=(state.filter==='all'||el.dataset.recordGroup===state.filter)&&words.every(w=>el.dataset.recordSearch.includes(w));el.hidden=!visible;if(visible)shown++;});
   panel.querySelectorAll('[data-record-chapter]').forEach(el=>{const count=[...el.querySelectorAll('[data-it]')].filter(e=>!e.hidden).length;el.hidden=!count;el.querySelector('summary small').textContent=count?String(count):'';if(state.query.trim())el.open=true;});
   panel.querySelectorAll('[data-record-filter]').forEach(b=>{const on=b.dataset.recordFilter===state.filter;b.classList.toggle('on',on);b.setAttribute('aria-pressed',String(on));});
   panel.querySelector('.vd-record-count').textContent=E.nat({en:`${shown} / ${ids.length} records`,vi:`${shown} / ${ids.length} hồ sơ`});
   panel.querySelector('.vd-record-empty').hidden=shown>0;
  };
  panel.addEventListener('click',e=>{const b=e.target.closest('[data-record-filter]');if(b){state.filter=b.dataset.recordFilter;apply();E.sfx('tap');}});
  panel.querySelector('input').oninput=e=>{state.query=e.target.value;apply();};apply();
 };
 const mountConclusions=panel=>{
  panel.classList.add('vd-conclusions','vd-records-compact');
 };
 E.on('bookTab',({tab,panel,first})=>{if(!first)return;if(tab==='items')mountRecords(panel);else if(tab==='truths'&&!Object.keys(E.S().truths||{}).length)mountConclusions(panel);});
})();
