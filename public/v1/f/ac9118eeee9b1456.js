/* A document's legible text is authored, never inferred from generated pixels. */
(() => {
 const E=StoryEngine;
 const T=(en,vi)=>({en,vi});
 const enrich=()=>{
  const S=E.S();if(!S)return;
  for(const it of Object.values(S.items||{}))if(it.document&&!it.doc){
   const d=it.document,t=d.text||d;
   it.doc={paper:'letter',hand:'print',title:d.title||it.name,lines:Array.isArray(t)?t:[t]};
  }
  if(S.items?.sealed_note)S.items.sealed_note.doc={paper:'letter',hand:'script',title:T('The unsigned appointment','Thư hẹn không ký tên'),lines:[T('At eight tonight, a gentleman will call on a matter of consequence. Please receive him alone.','Tám giờ tối nay, một quý ông sẽ đến vì một việc hệ trọng. Xin tiếp ông ấy riêng.'),T('Do not consider a covered face a sign of dishonour. The name is precisely what must remain unknown.','Xin đừng coi việc che mặt là dấu hiệu thiếu danh dự. Chính tên tuổi là điều cần được giữ kín.')]};
  if(S.items?.invitation)S.items.invitation.doc={paper:'card',hand:'script',title:T('The final line of the invitation','Dòng cuối trong thư mời'),lines:[T('Come to ask, not to collect.','Hãy đến để hỏi, đừng đến để lấy.'),T('C. Voss','C. Voss')]};
  if(S.items?.c6_letter&&S.docs){const key=E.R()?.f?.c4_route==='alarm'?'c6_letter_alarm':'c6_letter_open';if(S.docs[key])S.items.c6_letter.doc=S.docs[key];}
 };
 E.on('boot',enrich);E.on('chapter',enrich);E.on('item',enrich);
 const view=E.ui.itemView;E.ui.itemView=id=>{enrich();return view(id);};
 const reveal=E.ui.reveal;E.ui.reveal=(id,o)=>{enrich();return reveal(id,o);};
})();
