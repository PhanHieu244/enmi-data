/* Part I interview preparation, attached without inserting/reordering story steps.
   The original questions, spoken replies, once flags and board remain unchanged. */
(() => {
  const E = StoryEngine, T = (en, vi) => ({ en, vi });
  const install = () => {
    const S = E.S();
    if (S?.id !== 'vale-dossiers-p1c1-v01') return;
    const step = S.nodes?.c1_questions?.[0]; if (!step?.choice) return;
    step.interrogation = {
      id: 'c1-matthias', who: 'matthias',
      approaches: [
        { id: 'calm', label: T('Calm', 'Nhẹ nhàng'), questions: ['ask_celia', 'ask_scope'] },
        { id: 'direct', label: T('Direct', 'Hỏi thẳng'), questions: ['ask_warning', 'ask_searches'] }
      ],
      always: [4],
      hint: T('The way you ask changes which question comes first. It does not change an answer you have already heard. Take your time, compare a record, or return to all questions. His manner is not proof of a lie.', 'Cách hỏi giúp bạn chọn điều muốn hỏi trước. Nó không đổi câu trả lời đã nghe. Cứ thong thả đối chiếu hồ sơ hoặc quay lại mọi câu hỏi. Thái độ của ông không phải bằng chứng nói dối.'),
      initial: s => ['asked_warning', 'asked_searches', 'asked_celia', 'client_accepts_assurance'].some(k => s.f[k]) ? {
        openness: T('Interview in progress', 'Đang hỏi chuyện'),
        note: T('Review the answers in History, or choose the next question.', 'Bạn có thể xem lại câu trả lời trong Lịch sử, hoặc chọn câu hỏi tiếp theo.')
      } : {
        openness: T('Answering', 'Vẫn trả lời'), tension: T('Guarded', 'Dè chừng'),
        note: T('He has returned to the deadline and the fee. You still need the details of the danger.', 'Ông vừa quay lại chuyện thời hạn và tiền công. Bạn vẫn cần làm rõ nguy cơ.')
      },
      questions: {
        ask_warning: {
          complete: s => !!s.f.asked_warning,
          reaction: {
            openness: T('More specific', 'Cụ thể hơn'), tension: T('Still guarded', 'Còn dè chừng'),
            note: T('He adds a condition to the warning. These are still words he recalls, not a letter you have read.', 'Ông bổ sung điều kiện trong lời cảnh báo. Đây vẫn là lời ông nhớ lại, chưa phải lá thư bạn đã đọc.')
          }
        },
        ask_searches: {
          complete: s => !!s.f.asked_searches,
          reaction: {
            openness: T('Keeps answering', 'Vẫn trả lời'), tension: T('Tense', 'Căng thẳng'),
            note: T('He admits both searches failed. He has not established where the photograph is.', 'Ông thừa nhận cả hai lần tìm kiếm thất bại. Vị trí bức ảnh vẫn chưa được xác định.')
          }
        },
        ask_celia: {
          complete: s => !!s.f.asked_celia,
          reaction: {
            openness: T('Briefly open', 'Thoáng cởi mở'), tension: T('Softened, then guarded', 'Dịu lại rồi dè chừng'),
            note: T('He recalls a song and her laugh, then sets his feelings aside. That tells you little about what she intends now.', 'Ông nhớ bài hát và tiếng cười của cô, rồi gạt cảm xúc sang một bên. Điều đó chưa nói rõ ý định hiện tại của cô.')
          }
        },
        ask_scope: {
          complete: s => !!s.f.client_accepts_assurance,
          reaction: {
            openness: T('Clarifies his need', 'Nói rõ điều cần'), tension: T('Still uncertain', 'Còn do dự'),
            note: T('He accepts that a reliable assurance could meet his need. He still asks how he could trust one.', 'Ông chấp nhận rằng một sự bảo đảm đáng tin có thể giải quyết việc này. Nhưng ông vẫn chưa biết nên tin bằng cách nào.')
          }
        }
      },
      recordIds: ['press_cutting', 'warning_words', 'prior_searches', 'wren_address', 'sealed_note', 'watermark'],
      claims: [
        {
          id: 'deadline', title: T('The Sunday deadline', 'Thời hạn Chủ nhật'),
          quote: T('The announcement is on Sunday.', 'Thông báo sẽ công bố vào Chủ nhật.'),
          source: T('Matthias · what he just said', 'Matthias · lời vừa nói'), question: 'ask_scope',
          records: {
            press_cutting: { note: T('The newspaper gives the same date. It supports the deadline, but says nothing about whether Celia will send the photograph. You can ask what outcome would make him feel safe.', 'Tờ báo ghi cùng ngày. Nó xác nhận thời hạn, nhưng không cho biết Celia có gửi ảnh đi hay không. Bạn có thể hỏi kết quả nào sẽ khiến ông yên tâm.') }
          },
          unrelated: T('This record does not establish the date of the announcement. The newspaper is a separate source for that date; his fear still needs its own questions.', 'Hồ sơ này chưa xác định ngày công bố. Tờ báo là nguồn riêng cho ngày ấy; nỗi lo của ông vẫn cần được hỏi cho rõ.'),
          hint: T('Check the date in a source separate from his account. A confirmed deadline does not confirm every fear attached to it.', 'Đối chiếu ngày với một nguồn khác lời ông. Thời hạn đúng không có nghĩa mọi nỗi lo gắn với nó đều đã được xác nhận.')
        },
        {
          id: 'warning', title: T('What Celia may do', 'Celia có thể làm gì'),
          quote: T('She must not be allowed to use it.', 'Không được để cô ta sử dụng nó.'),
          source: T('Matthias · his opening account', 'Matthias · lời kể ban đầu'), question: 'ask_warning',
          records: {
            press_cutting: { note: T('The announcement explains the urgency. It does not tell you what Celia actually said. Ask for her exact words before deciding what the danger is.', 'Thông báo giải thích vì sao ông sốt ruột. Nó không cho biết Celia đã nói gì. Hãy hỏi nguyên văn trước khi xác định nguy cơ.') },
            warning_words: { note: T('His fuller recollection includes a condition: if his men trouble her again. You have his account of a spoken warning, not a written demand or Celia’s own explanation.', 'Lời ông nhớ đầy đủ hơn có điều kiện: nếu người của ông lại quấy rầy cô. Bạn có lời ông kể về một cảnh báo bằng miệng, chưa có yêu cầu bằng văn bản hay lời giải thích từ Celia.') }
          },
          unrelated: T('This record does not contain Celia’s warning. You can ask what she said, without deciding in advance why she said it.', 'Hồ sơ này không có lời cảnh báo của Celia. Bạn có thể hỏi cô đã nói gì, chưa cần kết luận trước vì sao cô nói vậy.'),
          hint: T('Separate the words he remembers from the meaning he gives them. Ask whether there was a condition, a demand or a written message.', 'Tách những từ ông nhớ khỏi cách ông hiểu chúng. Hỏi xem có điều kiện, yêu cầu hay lời nhắn bằng văn bản nào không.')
        },
        {
          id: 'searches', title: T('Where he thinks the photograph is', 'Nơi ông cho rằng có bức ảnh'),
          quote: T('My men believe the stolen photograph is still inside.', 'Người của ta tin rằng bức ảnh bị đánh cắp vẫn ở trong đó.'),
          source: T('Matthias · speaking of Wren House', 'Matthias · nói về nhà Wren'), question: 'ask_searches',
          records: {
            wren_address: { note: T('The address comes from Matthias. It tells you where he says Celia lives, not where anyone last saw the photograph. Ask what his men actually checked.', 'Địa chỉ do Matthias cung cấp. Nó cho biết nơi ông nói Celia đang sống, chưa cho biết ai đã thấy ảnh ở đâu lần gần nhất. Hãy hỏi người của ông đã kiểm tra những gì.') },
            prior_searches: { note: T('The searches found no photograph. That leaves two possibilities in his own account: it was absent, or his men missed it. Neither proves its present location.', 'Những lần lục soát không tìm được ảnh. Chính lời ông để ngỏ hai khả năng: ảnh không ở đó, hoặc người của ông tìm sót. Cả hai đều chưa xác định vị trí hiện tại.') }
          },
          unrelated: T('This record does not show a recent sighting of the photograph. Keep an address separate from evidence of what is inside the house.', 'Hồ sơ này không ghi nhận lần nhìn thấy ảnh gần đây. Cần phân biệt một địa chỉ với bằng chứng về những gì ở trong nhà.'),
          hint: T('An address and an unsuccessful search answer different questions. Start with what his men did and what they actually found.', 'Địa chỉ và một cuộc tìm kiếm thất bại trả lời hai câu hỏi khác nhau. Bắt đầu từ việc người của ông đã làm và thật sự tìm thấy gì.')
        }
      ]
    };
  };
  E.on('boot', install); E.on('chapter', install);
})();
