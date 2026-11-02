/* Vale 1.0.2 · measured inspection framing and evidence-specific artwork.
 * Load after all 0.9.x and 1.0.1 Vale plugins, before story boot.
 * No story arrays, IDs, spoken lines, rewards or save paths are rewritten.
 */
(() => {
  'use strict';
  const E=globalThis.StoryEngine,V=globalThis.ValeDemo;
  if(!E||!V)return;
  const T=(en,vi)=>({en,vi}),changes=new Map();
  const at=(S,path)=>path.reduce((v,k)=>v?.[k],S);
  const detail=(step,art,title,key)=>{
    if(!step||!(step.n||step.say||step.think))return;
    step.overlay={art,detail:true,aspect:1.5,title,framing:'scene'};
    delete step.inspection101;delete step.valeDetail097;
    step.inspection102=key;
    if(step.focus)delete step.focus;
    changes.set(key,{kind:'detail',art});
  };
  const eachLine=(value,fn)=>{
    if(!value||typeof value!=='object')return;
    if(Array.isArray(value)){value.forEach(v=>eachLine(v,fn));return;}
    if(value.n||value.say||value.think){fn(value);return;}
    for(const k of ['then','else','again'])if(value[k])eachLine(value[k],fn);
  };
  const recordArt={
    sealed_note:'evidence-letter',watermark:'act-watermark',press_cutting:'evidence-newspaper',
    c2_address:'detail102-wren-nameplate',c2_delivery:'evidence-parcel',
    c2_church:'c3_court',c3_register:'evidence-register',c3_name_trace:'c3_chapel',
    c3_cuff:'evidence-pin',c4_photo_seen:'prop-joint-photo',
    c4_hiding_place:'detail101-p1-closed-panel',c4_theatre:'prop-stage-album',
    c4_travel:'detail101-p1-packed-cases',c4_terms:'detail102-terms-draft',
    c4_recovered_photo:'prop-joint-photo',c5_greeting:'c5_door',
    c5_description:'c5_door',c5_follow:'c5_corner',c6_portrait:'evidence-portrait',
    p2_order:'p2_lydia_note_desk',p2_shutters:'detail101-p2-interior-shutter-catch',
    p2_repairs:'p2_note_flat',p2_cord:'p2_cord_raised',
    p2_vent:'detail101-p2-bedroom-wall-opening',p2_bed:'detail101-p2-fixed-bed-fitting',
    p2_night_observation:'p2_action_vent',
    p3_latch:'detail101-p3-stable-latch-hatch',p3_tracks:'detail101-p3-hoof-impressions',
    p3_site:'detail101-p3-inventory-board',
    p3_dog_baseline:'p3_moss_bark',
    p3_instrument:'evidence-p3_instrument',p3_star_mark:'p3_forehead_after',
    p3_sock_mark:'p3_horse',p3_shoe_match:'p3_farrier_check',p3_recovered:'p3_ben_leading_ember_v091'
  };
  function install(){
    const S=E.S();if(!/^vale-dossiers(?:-|$)/.test(S?.id||''))return;
    // The same pixel-space union keeps the writing→offering pair stable.
    // Only these held-book poses opt in; ordinary talking stays close.
    if(S.chars?.reed){
      S.chars.reed.actionFocusBounds={...S.chars.reed.actionFocusBounds,
        'reed-writing-v091':[260,24,804,610],
        'reed-offer-notebook-v091':[260,24,804,610]};
      changes.set('reed-notebook-focus',{kind:'pose-framing',bounds:[260,24,804,610]});
    }
    // Same foot plane, nearer framing: this is the courtyard hotspot, not
    // the conversational actor scale, which already has measured bounds.
    const hart=S.places?.c3_church?.views?.court?.people?.find(p=>p.who==='hart');
    if(hart){hart.r=[54,23,32,57];changes.set('church-hart',{kind:'scale',foot:80,rect:[...hart.r]});}
    const front=S.places?.c2_lane?.views?.front;
    const plate=front?.zones?.find(z=>z.id==='entrances');
    if(plate){
      // A nearby photograph owns the detail. The wide painted doorway is
      // not covered with a floating flat plaque on top of its architecture.
      delete plate.art;delete plate.artR;
      for(const branch of ['then','again'])eachLine(plate[branch],st=>detail(st,'detail102-wren-nameplate',T('Wren House · brass doorplate','Nhà Wren · biển đồng'),'wren-nameplate:'+branch));
    }
    const oldFront=at(S,['nodes','c1_departure',9,'place','views','front']);
    if(oldFront?.props)oldFront.props=oldFront.props.filter(p=>p.id!=='doorplate');
    for(const [node,spotId,art,title] of [
      ['c4_open_explore','draft_terms','detail102-terms-draft',T('The unsigned draft','Bản dự thảo chưa ký')],
      ['c6_terms','signatures','detail102-terms-copies',T('The matching copies · not yet signed','Hai bản giống nhau · chưa ký')]
    ]){
      const x=(S.nodes?.[node]||[]).find(st=>st.explore)?.explore;
      const spot=x?.spots?.find(sp=>sp.id===spotId);if(!spot)continue;
      if(spot.art==='vale-terms'){delete spot.art;delete spot.artR;}
      for(const branch of ['then','again'])eachLine(spot[branch],st=>detail(st,art,title,node+':'+spotId+':'+branch));
    }
    for(const [talk,path,expected]of[
      ['c2_bell',['topics',0,'then',2],'Reed opens the directory against the railings. The name and office are listed as Mrs Bell said.'],
      ['c2_finn',['topics',0,'then',1],'Reed checks the directory at your shoulder: Julian Hart, solicitor, 8 Grange Court.']
    ]){
      const st=path.reduce((v,k)=>v?.[k],S.talks?.[talk]);
      if(st?.n?.en===expected){
        detail(st,'detail102-reed-directory',T('Reed checks Hart’s directory entry','Reed đối chiếu mục tên Hart'),talk+':directory');
      }
    }
    for(const [id,art]of Object.entries(recordArt))if(S.items?.[id]&&E.hasArt('im-'+art)){
      S.items[id].recordArt=art;changes.set('record:'+id,{kind:'record-art',id,art});
    }
    // The witness has already been heard; a record thumbnail must not turn
    // an unconfirmed identity into a portrait of a newly identified person.
  }
  const apply=()=>{install();queueMicrotask(install);};
  E.on('boot',apply);E.on('chapter',apply);
  V.v102Presentation=()=>({version:'1.0.2',changes:[...changes.entries()].map(([key,value])=>({key,...value}))});
})();
