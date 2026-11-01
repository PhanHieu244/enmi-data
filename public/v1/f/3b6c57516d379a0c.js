/* Vale 1.0.1: explicit, state-specific object views. No changes to story
 * arrays, route IDs, recorded evidence, choices, ownership or spoken text. */
(() => {
  'use strict';
  const E=StoryEngine, V=ValeDemo;
  const bindings=[{"part":1,"path":["nodes","c1_open",15,"place","views","desk","zones",2],"id":"evening_news","art":"evidence-newspaper","title":{"en":"The evening paper","vi":"Tờ báo chiều"}},{"part":1,"path":["nodes","c1_departure",9,"place","views","corner","zones",0],"id":"house","art":"detail101-p1-front-bell","title":{"en":"Wren House · front bell","vi":"Nhà Wren · chuông cửa trước"}},{"part":1,"path":["nodes","c1_departure",9,"place","views","front","zones",0],"id":"bell","art":"detail101-p1-front-bell","title":{"en":"Wren House · front bell","vi":"Nhà Wren · chuông cửa trước"}},{"part":1,"path":["places","c2_lane","views","front","zones",0],"id":"entrances","art":"vale-wren-plate","title":{"en":"The brass doorplate","vi":"Biển đồng trước cửa"},"aspect":3.485},{"part":1,"path":["places","c2_lane","views","gate","zones",0],"id":"latch","art":"detail101-p1-service-latch","title":{"en":"The service-gate latch","vi":"Chốt cổng bên"}},{"part":1,"path":["places","c3_church","views","court","zones",0],"id":"church_clock","art":"vale-clock","title":{"en":"The courtyard clock","vi":"Đồng hồ sân nhà thờ"},"branches":["again"]},{"part":1,"path":["nodes","c4_open_explore",0,"explore","spots",0],"id":"draft_terms","art":"vale-terms","title":{"en":"The proposed terms","vi":"Bản điều khoản đề xuất"},"aspect":2.857},{"part":1,"path":["nodes","c4_open_explore",0,"explore","spots",1],"id":"stage_album","art":"prop-stage-album","title":{"en":"The open theatre album","vi":"Album sân khấu đang mở"},"aspect":1.5},{"part":1,"path":["nodes","c4_alarm_explore",0,"explore","spots",1],"id":"album","art":"prop-stage-album","title":{"en":"The open theatre album","vi":"Album sân khấu đang mở"},"aspect":1.5},{"part":1,"path":["nodes","c4_open_explore",0,"explore","spots",2],"id":"cases","art":"detail101-p1-packed-cases","title":{"en":"The travelling cases","vi":"Hai va li du lịch"}},{"part":1,"path":["nodes","c4_alarm_explore",0,"explore","spots",2],"id":"luggage","art":"detail101-p1-packed-cases","title":{"en":"The travelling cases","vi":"Hai va li du lịch"}},{"part":1,"path":["nodes","c4_alarm_explore",0,"explore","spots",0],"id":"panel","art":"detail101-p1-closed-panel","title":{"en":"The panel beside the bell","vi":"Tấm ốp cạnh chuông"}},{"part":1,"path":["nodes","c6_visit",10,"explore","spots",1],"id":"portrait","art":"evidence-portrait","title":{"en":"Celia’s portrait","vi":"Chân dung Celia"}},{"part":1,"path":["nodes","c6_visit",10,"explore","spots",2],"id":"panel","art":"detail101-p1-empty-recess","title":{"en":"The recess Bell showed you","vi":"Hốc tường Bell đã cho xem"},"branches":["again"],"caption":{"en":"Recorded view · Bell has closed the panel again.","vi":"Hình đã quan sát · Bell đã đóng tấm ốp lại."}},{"part":1,"path":["nodes","c6_terms",9,"explore","spots",0],"id":"signatures","art":"vale-terms","title":{"en":"The two copies","vi":"Hai bản điều khoản"},"aspect":2.857},{"part":1,"path":["nodes","c6_terms",9,"explore","spots",1],"id":"packet","art":"prop-joint-photo","title":{"en":"The framed photograph","vi":"Bức ảnh có khung"}},{"part":2,"path":["places","p2c2_house","views","corridor","zones",0],"id":"door_order","art":"evidence-p2_plan","title":{"en":"The west-wing plan","vi":"Sơ đồ cánh nhà phía tây"},"onlyNarration":true,"firstIndexes":[2]},{"part":3,"path":["nodes","p3c5_open",19,"explore","spots",0],"id":"forehead","art":"p3_horse","title":{"en":"The recorded markings","vi":"Các dấu nhận dạng đã ghi"},"caption":{"en":"Compare all the markings; one mark alone is not enough.","vi":"Đối chiếu các dấu nhận dạng; một dấu riêng lẻ chưa đủ."}},{"part":3,"path":["nodes","p3c5_open",19,"explore","spots",1],"id":"sock","art":"p3_horse","title":{"en":"The recorded markings","vi":"Các dấu nhận dạng đã ghi"},"caption":{"en":"Anatomical left hind leg · the image is not mirrored.","vi":"Chân sau bên trái của ngựa · hình không bị lật gương."}},{"part":3,"path":["places","p3c1_stable_walk","views","yard","zones",0],"id":"kennel","art":"p3_moss_alert","title":{"en":"Moss by the kennel","vi":"Moss bên chuồng"},"onlyNarration":true},{"part":2,"path":["places","p2c2_house","views","room","zones",1],"id":"sewing_box","art":"detail101-p2-bedside-table-books","title":{"en":"The bedside table","vi":"Bàn đầu giường"}},{"part":2,"path":["nodes","p2c4_open",12,"explore","spots",1],"id":"vent","art":"detail101-p2-bedroom-wall-opening","title":{"en":"The high wall opening","vi":"Ô thông trên tường"}},{"part":2,"path":["nodes","p2c4_open",12,"explore","spots",2],"id":"bed","art":"detail101-p2-fixed-bed-fitting","title":{"en":"The bed’s fixing","vi":"Chân giường cố định"}},{"part":2,"path":["places","p2c2_house","views","room","zones",0],"id":"shutter","art":"detail101-p2-interior-shutter-catch","title":{"en":"The inside fastening","vi":"Chốt cửa phía trong"}},{"part":2,"path":["places","p2c2_house","views","yard","zones",1],"id":"outside_window","art":"detail101-p2-exterior-window-sill","title":{"en":"The window from outside","vi":"Cửa sổ nhìn từ bên ngoài"}},{"part":3,"path":["places","p3c1_stable_walk","views","stall","zones",0],"id":"door","art":"detail101-p3-stable-latch-hatch","title":{"en":"The stable door","vi":"Cửa chuồng ngựa"}},{"part":3,"path":["places","p3c1_stable_walk","views","stall","zones",1],"id":"bucket","art":"detail101-p3-feed-bucket","title":{"en":"The feed bucket","vi":"Xô thức ăn"}},{"part":3,"path":["places","p3c2_ground","views","path","zones",0],"id":"hooves","art":"detail101-p3-hoof-impressions","title":{"en":"The marks in the wet ground","vi":"Dấu trên đất ướt"}},{"part":3,"path":["places","p3c2_ground","views","path","zones",1],"id":"water","art":"detail101-p3-drainage-rut-overlap","title":{"en":"The drainage cut","vi":"Rãnh thoát nước"}},{"part":3,"path":["places","p3c2_ground","views","hollow","zones",0],"id":"coat","art":"detail101-p3-constable-coat-sketch","title":{"en":"The constable’s sketch","vi":"Bản phác của cảnh sát"}},{"part":3,"path":["nodes","p3c4_open",8,"explore","spots",2],"id":"letters","art":"detail101-p3-tied-private-letters","title":{"en":"The tied letters","vi":"Bó thư còn buộc"}},{"part":3,"path":["places","p3c2_ground","views","hollow","zones",1],"id":"exhibits","art":"detail101-p3-inventory-board","title":{"en":"The scene inventory","vi":"Các vật ghi nhận ở hiện trường"},"caption":{"en":"Scarf · candle · protective case, still closed","vi":"Khăn · nến · hộp bảo vệ còn đóng"}}];
  const installed=new Map(), missing=new Map();
  const at=path=>path.reduce((obj,key)=>obj?.[key],E.S());
  function bind(entry){
    const object=at(entry.path);
    if(!object)return;
    if(object.id!==entry.id){missing.set(entry.path.join('.'),'Unexpected hotspot ID');return;}
    const key=entry.path.join('.');let count=0,skipped=0;
    const visit=(value,path,branch,topIndex)=>{
      if(!value||typeof value!=='object')return;
      if(Array.isArray(value)){value.forEach((child,i)=>visit(child,path.concat(i),branch,topIndex??i));return;}
      const isLine=value.n||value.say||value.think;
      if(isLine){
        // Preserved/legacy views may share the same line object. A matching
        // view we own is reusable; it is not an unrelated authored overlay.
        const own=!!value.inspection101&&value.overlay?.detail===true;
        if(own&&value.overlay.art!==entry.art){missing.set(key,'Shared line has incompatible inspection art');return;}
        const authoredAction=value.shot||value.cg||value.motion||value.actionFrame||value.overlay&&!own;
        // Earlier game hooks may attach an action in a later chapter pass.
        // Remove our provisional detail, not merely skip reassigning it, or
        // the still image would cover the subsequently authored action.
        if(own&&authoredAction){delete value.overlay;delete value.inspection101;skipped++;return;}
        const selected=(!entry.onlyNarration||value.n||value.think)&&
          (branch!=='then'||!entry.firstIndexes||entry.firstIndexes.includes(topIndex));
        if(selected&&!authoredAction){
          value.overlay={art:entry.art,detail:true,title:entry.title,aspect:entry.aspect||1};
          if(entry.caption)value.overlay.caption=entry.caption;
          value.inspection101=key;
          // The object view owns this line; an old room zoom must not run
          // underneath it and surprise the reader when the image closes.
          if(value.focus)delete value.focus;
          count++;
        }else if(selected)skipped++;
        return;
      }
      for(const field of ['then','else','again'])if(value[field])visit(value[field],path.concat(field),branch,topIndex);
    };
    for(const branch of entry.branches||['then','again'])visit(object[branch],entry.path.concat(branch),branch,null);
    installed.set(key,{part:entry.part,id:entry.id,path:entry.path,art:entry.art,lines:count,retainedActions:skipped});
  }
  function install(){
    if(!/^vale-dossiers(?:-|$)/.test(E.S()?.id||''))return;
    bindings.forEach(bind);
  }
  E.on('boot',()=>{install();queueMicrotask(install);});
  E.on('chapter',()=>{install();queueMicrotask(install);});
  V.inspections101=()=>({version:'1.0.1',bindings:[...installed.values()],missing:[...missing.entries()],authoredArraysUnchanged:true});
})();
