/* A document's legible text is authored, never inferred from generated pixels. */
(() => {
 const E=StoryEngine;
 const T=(en,vi)=>({en,vi});
 const excerptNote=T('Recorded excerpt. A full transcription is not supplied for this document.','Trích nội dung đã ghi. Tài liệu này chưa có bản chép nguyên văn đầy đủ.');
 const paragraphs=value=>{
  if(Array.isArray(value))return value.flatMap(paragraphs);
  if(typeof value==='string')return value.split(/\n\s*\n/);
  if(!value||typeof value!=='object')return [];
  const keys=Object.keys(value).filter(k=>k!=='s'&&typeof value[k]==='string'),parts=keys.map(k=>value[k].split(/\n\s*\n/));
  if(parts.length&&parts[0].length>1&&parts.every(p=>p.length===parts[0].length))return parts[0].map((_,i)=>({...value,...Object.fromEntries(keys.map((k,j)=>[k,parts[j][i]]))}));
  return [value]; // Different paragraph counts keep their original linebreaks.
 };
 const excerpt=(title,text)=>({paper:'report',hand:'print',title,lines:paragraphs(text),readingNote:excerptNote});
 const recordedIds=['press_cutting','boundary','c3_register','c4_terms','c5_return_receipt','c6_agreement'];
 const enrich=()=>{
  const S=E.S();if(!S)return;
  for(const it of Object.values(S.items||{}))if(it.document&&(!it.doc||it.doc.valeDocument103)){
   const d=it.document,t=d.text||d;
   it.doc={paper:d.paper||'letter',hand:d.hand||'print',title:d.title||it.name,lines:paragraphs(t),readingNote:d.readingNote||d.note,valeDocument103:true};
  }
  if(S.items?.sealed_note)S.items.sealed_note.doc={paper:'letter',hand:'script',title:T('The unsigned appointment','Thư hẹn không ký tên'),lines:[T('At eight tonight, a gentleman will call on a matter of consequence. Please receive him alone.','Tám giờ tối nay, một quý ông sẽ đến vì một việc hệ trọng. Xin tiếp ông ấy riêng.'),T('Do not consider a covered face a sign of dishonour. The name is precisely what must remain unknown.','Xin đừng coi việc che mặt là dấu hiệu thiếu danh dự. Chính tên tuổi là điều cần được giữ kín.')]};
  if(S.items?.invitation)S.items.invitation.doc={paper:'card',hand:'script',title:T('The final line of the invitation','Dòng cuối trong thư mời'),lines:[T('Come to ask, not to collect.','Hãy đến để hỏi, đừng đến để lấy.'),T('C. Voss','C. Voss')]};
  // These records contain authored summaries, not undisclosed letter bodies.
  for(const id of recordedIds){const it=S.items?.[id];if(it&&!it.doc)it.doc=excerpt(it.name,it.desc);}
  if(S.items?.c6_letter&&S.docs){
   const key=E.R()?.f?.c4_route==='alarm'?'c6_letter_alarm':'c6_letter_open',base=S.docs[key];
   if(base)S.items.c6_letter.doc={...base,lines:[...base.lines,...(E.R()?.f?.c5_returned?S.docs.c6_letter_return?.lines||[]:[])]};
  }
 };
 E.on('boot',enrich);E.on('chapter',enrich);E.on('item',enrich);
 const view=E.ui.itemView;E.ui.itemView=id=>{enrich();return view(id);};
 const reveal=E.ui.reveal;E.ui.reveal=(id,o)=>{enrich();return reveal(id,o);};
 const read=E.ui.read;E.ui.read=(spec,context)=>{enrich();return read(spec,context);};
 // This explicit allowlist binds pictures only to wording already established
 // by the current inspection. Tied private letters stay unopened and unread.
 const detailDocument=E.ui.detailDocument;
 E.ui.detailDocument=(value,step)=>{
  if(!/^vale-dossiers(?:-|$)/.test(E.S()?.id||''))return detailDocument?.(value,step);
  const S=E.S(),art=value?.art;
  if(art==='evidence-newspaper')return S.items?.press_cutting?.doc;
  if(art==='detail102-terms-draft')return S.items?.c4_terms?.doc;
  if(['detail102-terms-copies','detail102-wren-nameplate','detail102-reed-directory','detail101-p3-inventory-board'].includes(art)&&step?.n)return excerpt(value.title,step.n);
  if(art==='evidence-parcel'&&value.caption)return {paper:'label',hand:'print',title:T('Parcel label','Nhãn gói hàng'),lines:paragraphs(value.caption)};
  return detailDocument?.(value,step);
 };
})();
