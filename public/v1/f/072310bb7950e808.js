/* Vale 0.9.3 — questions and review cues for the existing investigations.
 * Add presentation metadata only. Original questions, spoken text, arrays,
 * accepted pairs, consequences, inventory and save paths remain unchanged.
 */
(() => {
  'use strict';
  const E = StoryEngine, T = (en, vi) => ({ en, vi });
  const greeting = {
    prompt: T('What can the greeting and the passer-by’s appearance establish?', 'Lời chào và dáng vẻ người đi đường xác nhận được điều gì?'),
    nudge: T('Separate the name that was spoken from the identity of the person speaking.', 'Tách cái tên được gọi khỏi danh tính của người gọi.'),
    review: {
      text: T('These records do not establish the same point. Knowing Vale’s name and identifying the passer-by are separate questions.', 'Hai hồ sơ này chưa xác lập cùng một điều. Biết tên Vale và xác định người đi đường là hai câu hỏi riêng.'),
      with: [
        { id: 'c3_cuff', text: T('A pin or a familiar appearance can support a resemblance. It does not by itself identify the person who spoke.', 'Chiếc ghim hoặc dáng vẻ quen có thể cho thấy nét giống nhau. Riêng nó chưa xác định người đã lên tiếng.') },
        { id: 'c4_photo_seen', text: T('Seeing the photograph establishes where it was then. It does not identify the person who later greeted Vale.', 'Việc thấy bức ảnh xác nhận nó ở đâu lúc đó. Nó chưa xác định người chào Vale sau này.') }
      ]
    }
  };
  const rows = [
    { game: 'vale-dossiers-p1c1-v01', path: ['c1_review', 1, 'then', 0], kind: 'caseboard', fields: {
      prompt: T('What contradicts the claim that the photograph was stolen?', 'Điều gì mâu thuẫn với lời nói bức ảnh bị đánh cắp?'),
      nudge: T('Distinguish a present accusation from an account of how the photograph changed hands. Can both accounts be true?', 'Tách lời buộc tội hiện tại khỏi lời kể về cách bức ảnh đổi chủ. Hai lời kể có thể cùng đúng không?'),
      review: {
        text: T('This pair does not establish how Celia obtained the photograph. Urgency or a later warning cannot establish theft.', 'Cặp này chưa xác định Celia có bức ảnh bằng cách nào. Sự cấp bách hay lời cảnh báo về sau chưa chứng minh việc đánh cắp.'),
        with: [
          { id: 'watermark', text: T('A paper mark concerns the letter’s material. It cannot establish how the photograph changed hands.', 'Dấu giấy nói về chất liệu lá thư. Nó không xác định bức ảnh đã đổi chủ bằng cách nào.') },
          { id: 'press_cutting', text: T('The notice explains the deadline. It does not establish who gave or took the photograph.', 'Mẩu báo giải thích thời hạn. Nó chưa xác định ai đã trao hay lấy bức ảnh.') }
        ]
      }
    } },
    { game: 'vale-dossiers-p1c1-v01', path: ['c3_board', 1], kind: 'caseboard', fields: {
      prompt: T('What did Hart know, and what makes Celia’s warning urgent?', 'Hart đã biết gì, và vì sao lời cảnh báo của Celia trở nên cấp bách?'),
      nudge: T('Prior knowledge and the deadline are two separate points. Check each against a second source.', 'Điều đã biết trước và thời hạn là hai điểm riêng. Đối chiếu từng điểm với một nguồn khác.'),
      review: { text: T('These records do not verify either point together. Check what was known before the marriage, then the timing of the warning.', 'Hai hồ sơ này chưa cùng xác minh một điểm. Xét điều đã biết trước hôn lễ, rồi xét thời điểm của lời cảnh báo.') }
    } },
    { game: 'vale-dossiers-p1c1-v01', path: ['c5_desk', 6, 'then', 0], kind: 'caseboard', fields: greeting },
    { game: 'vale-dossiers-p1c1-v01', path: ['c5_desk', 6, 'else', 0], kind: 'caseboard', fields: greeting },
    { game: 'vale-dossiers-p1c1-v01', path: ['c6_visit', 11], kind: 'deduce', fields: {
      prompt: T('Which two records identify the person who greeted Vale?', 'Hai hồ sơ nào xác định người đã chào Vale?'),
      nudge: T('Look for an account of that encounter whose source can be checked. Resemblance alone is not identification.', 'Tìm lời kể về lần gặp ấy có nguồn kiểm chứng được. Chỉ giống dáng vẻ chưa đủ để xác định danh tính.'),
      review: {
        text: T('This pair does not identify the speaker. Clothes, departure timing or a separate portrait cannot alone establish who gave the greeting.', 'Cặp này chưa xác định người nói. Quần áo, giờ rời đi hay chân dung riêng chưa đủ để biết ai đã chào.'),
        with: [{ id: 'c3_name_trace', text: T('Knowing Vale’s name identifies the person being addressed. It does not by itself identify the speaker.', 'Biết tên Vale xác định người được gọi. Riêng điều đó chưa xác định người lên tiếng.') }]
      }
    } },
    { game: 'vale-dossiers-part2-v01', path: ['p2c3_open', 30], kind: 'caseboard', fields: {
      prompt: T('Do the room explanation and the money account fit the records?', 'Lời giải thích về phòng và tiền có khớp hồ sơ không?'),
      nudge: T('Test each explanation against another source before combining motive and action.', 'Kiểm từng lời giải thích bằng một nguồn khác trước khi ghép động cơ với hành vi.'),
      review: {
        text: T('These records do not check the same explanation against another source. Keep the room arrangements and financial pressure separate.', 'Hai hồ sơ này chưa kiểm cùng một lời giải thích bằng nguồn khác. Tách việc sắp xếp phòng khỏi sức ép tài chính.'),
        pairs: [{ ids: ['p2_order', 'p2_income'], text: T('An order and financial pressure may suggest a motive. Neither independently checks whether the repairs required the move.', 'Lệnh chuyển phòng và sức ép tiền bạc có thể gợi động cơ. Chúng chưa kiểm chứng việc sửa chữa có buộc phải chuyển phòng hay không.') }]
      }
    } },
    { game: 'vale-dossiers-part2-v01', path: ['p2c4_open', 36], kind: 'caseboard', fields: {
      prompt: T('Does a locked window rule out every route into this room?', 'Cửa sổ khóa có loại trừ mọi đường vào phòng này không?'),
      nudge: T('Separate a route that has been ruled out from a route that has not yet been checked.', 'Tách đường đã bị loại trừ khỏi đường chưa được kiểm tra.'),
      review: { text: T('This pair does not establish another route. A strange object or remembered phrase is not yet a traced connection between rooms.', 'Cặp này chưa xác lập một đường khác. Đồ vật lạ hay câu nói được nhớ lại chưa phải đường thông giữa hai phòng đã kiểm tra.') }
    } },
    { game: 'vale-dossiers-part2-v01', path: ['p2c6_open', 7, 'then', 8], kind: 'deduce', fields: {
      prompt: T('Which two records establish the route of the movement you saw?', 'Hai hồ sơ nào xác lập đường đi của chuyển động bạn đã thấy?'),
      nudge: T('Separate the movement witnessed that night from the physical connection between the rooms.', 'Tách chuyển động được chứng kiến trong đêm khỏi cấu trúc nối hai căn phòng.'),
      review: { text: T('Money or remembered words do not record a route. Connect what was seen moving with a checked feature of the rooms.', 'Tiền bạc hay lời được nhớ lại chưa ghi nhận đường đi. Đối chiếu chuyển động đã thấy với cấu trúc phòng đã kiểm tra.') }
    } },
    { game: 'vale-dossiers-part3-v01', path: ['p3c3_open', 13], kind: 'caseboard', fields: {
      prompt: T('How should we interpret Moss’s silence during the night?', 'Hiểu việc Moss im lặng trong đêm thế nào?'),
      nudge: T('Ask what the witness could hear and what that can reasonably exclude. Avoid naming someone from silence alone.', 'Xét điều nhân chứng nghe được và điều có thể loại trừ từ đó. Đừng chỉ từ sự im lặng mà nêu tên một người.'),
      review: { text: T('This pair does not establish what the silence means. A dispute or the supper does not show how Moss usually reacts to visitors.', 'Cặp này chưa xác lập ý nghĩa của sự im lặng. Tranh cãi hay bữa tối không cho biết Moss thường phản ứng với khách ra sao.') }
    } },
    { game: 'vale-dossiers-part3-v01', path: ['p3c4_open', 22], kind: 'caseboard', fields: {
      prompt: T('Separate financial pressure from evidence of a plan.', 'Tách sức ép tài chính khỏi dấu hiệu của một kế hoạch.'),
      nudge: T('Keep financial strain, a possible means and evidence of an act separate. Seek independent support for each link.', 'Tách khó khăn tiền bạc, phương tiện có thể dùng và bằng chứng hành vi. Tìm nguồn độc lập củng cố từng liên hệ.'),
      review: { text: T('Financial pressure alone does not establish an act. A possible use of a tool still needs support from an independent observation.', 'Sức ép tiền bạc chưa xác lập hành vi. Công dụng có thể có của dụng cụ vẫn cần một quan sát độc lập củng cố.') }
    } }
  ];
  const presentations = [
    { game: 'vale-dossiers-p1c1-v01', path: ['c5_desk', 5], focus: T('Does this record contradict the exact sentence, or only concern the same journey?', 'Hồ sơ bác bỏ chính câu này, hay chỉ cùng liên quan chuyến đi?'), segs: [
      T('Does the record contradict Vale having seen the joint photograph?', 'Hồ sơ có bác việc Vale đã thấy bức ảnh chụp chung không?'),
      T('Separate knowing Vale’s name from knowing the passer-by’s identity. What was actually said?', 'Tách việc biết tên Vale khỏi biết danh tính người đi đường. Câu nào đã thực sự được nói?'),
      T('Does this record reliably name the passer-by, or only describe an appearance?', 'Hồ sơ xác định đáng tin cậy người đi đường, hay chỉ mô tả dáng vẻ?')
    ] },
    { game: 'vale-dossiers-part3-v01', path: ['p3c3_open', 25], focus: T('Which part of the sentence goes beyond what the source actually establishes?', 'Phần nào của câu vượt quá điều nguồn tin thực sự xác lập?'), segs: [
      T('Does this record confirm where the horse is now?', 'Hồ sơ này có xác nhận hiện ngựa ở đâu không?'),
      T('Does the record establish why Larkin lost awareness, and whether he chose it?', 'Hồ sơ xác lập vì sao Larkin mất tỉnh táo, và anh có chủ ý làm vậy không?'),
      T('Does the record actually contradict the direction of the observed tracks?', 'Hồ sơ có thực sự bác hướng đi của dấu vết đã quan sát không?')
    ] }
  ];
  function install() {
    const S = E.S();
    for (const row of rows) if (row.game === S?.id) {
      const step = row.path.reduce((v, k) => v?.[k], S.nodes), mechanic = step?.[row.kind];
      if (mechanic?.q) Object.assign(mechanic, row.fields);
    }
    for (const row of presentations) if (row.game === S?.id) {
      const P = row.path.reduce((v, k) => v?.[k], S.nodes)?.present;
      if (!P || P.segs?.length !== row.segs.length) continue;
      P.focus = row.focus;
      P.segs.forEach((g, i) => { g.focus = row.segs[i]; });
    }
  }
  E.on('boot', install);
  E.on('chapter', install);
  globalThis.ValeReasoningV093 = Object.freeze({ anchors: rows.map(({ game, path, kind }) => ({ game, path, kind })), presentations: presentations.map(({ game, path }) => ({ game, path })) });
})();
