/* Vale 0.9.4 · authored choice semantics.
 * All 90 options across 39 choice containers are explicitly classified.
 * True means the printed sentence is the protagonist's actual dialogue.
 * False means an action, a topic/route decision, or writing a note; its
 * continuation contains any actual dialogue. Labels below are identity guards,
 * never replacement prose. Existing arrays, branches and save paths stay put.
 */
(() => {
  'use strict';
  const E = StoryEngine, V = ValeDemo;
  const authored = [
    ["nodes.c1_arrival.9.choice", [
      [true, "What can I call you for the next ten minutes?"],
      [true, "Do you speak for this person, or are you this person?"],
    ]],
    ["nodes.c1_questions.0.choice", [
      [true, "What exactly did Celia say she would do?"],
      [true, "What have your men already tried?"],
      [true, "Tell me something about Celia that is not about the photograph."],
      [true, "What would you accept if the photograph cannot be recovered?"],
      [false, "Review what we can actually support."],
    ]],
    ["nodes.c1_review.2.else.1.choice", [
      [false, "Ask the remaining questions before leaving."],
      [false, "Keep those gaps in the record and investigate independently."],
    ]],
    ["nodes.c1_terms.3.choice", [
      [false, "Put the limits in writing: facts first, no entry without permission."],
      [false, "Agree verbally to establish the facts; keep the conversation open."],
    ]],
    ["nodes.c1_departure.10.choice", [
      [false, "Watch from the public lane. Learn who comes and goes."],
      [false, "Speak to a nearby cab driver. Learn the household’s routine."],
      [false, "Leave your calling card. Give Celia the choice to answer."],
    ]],
    ["nodes.c1_observe.13.choice", [
      [false, "Record the departure; keep watching the house."],
      [false, "Note the cab’s direction; plan to identify the visitor tomorrow."],
    ]],
    ["nodes.c1_neighbourhood.9.choice", [
      [true, "Tell me what you have seen yourself. Leave the rest out."],
      [true, "What did the other gentlemen ask you?"],
    ]],
    ["nodes.c1_direct.9.choice", [
      [false, "Write: “I have heard one account. I would like to hear yours.”"],
      [false, "Write: “I am making inquiries about a private photograph.”"],
    ]],
    ["nodes.c2_call.7.choice", [
      [false, "Name your client and ask for her account."],
      [false, "Ask only whether Hart is here."],
    ]],
    ["nodes.c2_call.16.choice", [
      [false, "Agree to wait in the courtyard."],
      [false, "Say you may be passing; promise nothing."],
    ]],
    ["nodes.c3_open.12.choice", [
      [false, "Stand with Reed and sign your real name."],
      [false, "Let Reed and the porter witness; watch from the side."],
    ]],
    ["nodes.c3_open.44.choice", [
      [false, "Ask what would let her feel safe."],
      [false, "Say that marriage does not settle the photograph."],
      [false, "Ask Hart to join a witnessed discussion."],
    ]],
    ["nodes.c3_board.4.choice", [
      [false, "Practise the polite request from the wedding. (Optional)"],
      [false, "Continue with the case."],
    ]],
    ["nodes.c4_open.11.choice", [
      [false, "Attend openly at seven and discuss an agreement."],
      [false, "Use the disguise and a staged alarm to expose the hiding place."],
    ]],
    ["nodes.c4_alarm_explore.1.choice", [
      [false, "Leave the photograph. Record only its position."],
      [false, "Take the photograph without permission."],
    ]],
    ["nodes.c5_open.13.choice", [
      [false, "Follow as far as the corner, keeping your distance."],
      [false, "Call out and ask whether you have met."],
      [false, "Let the passer-by go. Record the greeting."],
    ]],
    ["nodes.c5_possession.3.then.1.choice", [
      [false, "Return it to Celia through Mrs Bell tonight."],
      [false, "Keep it for delivery to Matthias in the morning."],
    ]],
    ["nodes.c5_plan.0.choice", [
      [false, "Listen again to the condition in Celia’s warning. (Optional)"],
      [false, "Keep working on the case."],
    ]],
    ["nodes.c5_plan.2.choice", [
      [false, "Verify the house in the morning. Report only what you can support."],
      [false, "Ask Matthias to sign the mutual terms; arrange a witnessed exchange."],
      [false, "Tell Matthias that blackmail is established and demand the photograph at dawn."],
    ]],
    ["nodes.c6_visit.17.choice", [
      [false, "Report the confirmed facts, retract any unsupported accusation, and advise him to stop."],
      [false, "Maintain that the letter proves blackmail and ask for another search."],
    ]],
    ["nodes.c6_terms.2.choice", [
      [false, "Ask whether possession or a quiet announcement matters more."],
      [false, "Point out that both sides make a promise before anything is handed over."],
    ]],
    ["nodes.c6_delivery.2.choice", [
      [false, "State that it was a gift and that you took it without permission."],
      [false, "Accept the praise and say nothing about the method."],
    ]],
    ["talks.c2_bell.topics.2.then.0.else.1.choice", [
      [false, "Give your real name and wait outside."],
      [false, "Wait outside without leaving a message."],
    ]],
    ["nodes.p2c1_open.31.choice", [
      [false, "Arrange a safe place first, then inspect Blackthorn."],
      [false, "Go together in daylight and ask to see the repairs."],
    ]],
    ["nodes.p2c2_open.18.choice", [
      [false, "Ask Rusk to explain the repair order first."],
      [false, "Read the family papers before questioning Rusk."],
    ]],
    ["nodes.p2c3_open.11.choice", [
      [false, "Keep the question specific: why the middle room?"],
      [false, "Press him about the mismatch in the two written accounts."],
    ]],
    ["nodes.p2c4_open.33.choice", [
      [false, "Ask whether he knows why the work was ordered."],
      [false, "Ask him to check your drawing for mistakes."],
    ]],
    ["nodes.p2c5_open.11.choice", [
      [false, "Watch the empty room, with Lydia safely elsewhere and help nearby."],
      [false, "Leave with Lydia and preserve the papers for a formal inquiry."],
      [false, "Bring the constable openly and challenge the room order now."],
    ]],
    ["nodes.p2c5_watch.12.choice", [
      [false, "Watch the opening in the shared wall."],
      [false, "Keep your attention on the window fastening."],
    ]],
    ["nodes.p2c5_watch.12.choice.1.then.2.choice", [
      [false, "Turn your attention to the shared wall."],
      [false, "Withdraw now and take Lydia away."],
    ]],
    ["nodes.p2c6_report.0.choice", [
      [false, "Report the observed route and supporting evidence; reopen Alice’s death inquiry."],
      [false, "Report the prevented room arrangement and the unanswered method."],
      [false, "Report the reasons for leaving and ask for further investigation."],
      [false, "Conclude that the new evidence fully explains Alice’s death as well."],
    ]],
    ["nodes.p2c6_caution.2.choice", [
      [false, "Revise the conclusion to match what you established."],
      [false, "Keep the complete explanation despite the missing proof."],
    ]],
    ["nodes.p3c1_open.26.choice", [
      [false, "Walk the moor while the ground can be seen clearly."],
      [false, "Have the constable preserve the records, then walk the moor."],
    ]],
    ["nodes.p3c2_open.23.choice", [
      [false, "Explain the tracks and ask him to preserve the yard."],
      [false, "Ask the constable to keep watch while you verify the evidence."],
    ]],
    ["nodes.p3c3_open.29.choice", [
      [false, "Keep the public statement to the trail and the search."],
      [false, "Name Dorn as the suspected killer as well as the horse thief."],
    ]],
    ["nodes.p3c4_open.23.choice", [
      [false, "Ask Nora what can be done for the animals now."],
      [false, "Ask whether anyone raised the problem before the disappearance."],
    ]],
    ["nodes.p3c4_open.39.choice", [
      [false, "Visit Dorn with Nora; let Reed obtain the written confirmation."],
      [false, "Verify the shop account in person first, accepting that the race deadline will be missed."],
      [false, "Prioritise recovery; leave the cause of death open for a further inquiry."],
    ]],
    ["nodes.p3c5_open.25.choice", [
      [false, "Report the supported explanation of the death and the separate concealment."],
      [false, "Report recovery now; leave the death open for further examination."],
      [false, "Accuse Dorn of the death as well as concealment."],
    ]],
    ["nodes.p3c5_accuse.2.choice", [
      [false, "Correct the accusation and give the supported account."],
      [false, "Maintain the accusation in the public report."],
    ]],
  ];
  function install() {
    const S = E.S();
    if (!/^vale-dossiers(?:-|$)/.test(S?.id || '')) return;
    const audit = { options: 0, dialogue: 0, actions: 0, mismatches: [], unclassified: [] };
    for (const [path, expected] of authored) {
      const choices = path.split('.').reduce((value, key) => value?.[key], S);
      if (!choices) continue; // Chapters may arrive lazily.
      if (!Array.isArray(choices) || choices.length !== expected.length) {
        audit.mismatches.push(path); continue;
      }
      expected.forEach(([speech, text], i) => {
        const option = choices[i];
        if (option?.en !== text) { audit.mismatches.push(path + '.' + i); return; }
        option.speech = speech;
        audit.options++; audit[speech ? 'dialogue' : 'actions']++;
      });
    }
    const visit = (value, path) => {
      if (!value || typeof value !== 'object') return;
      if (Array.isArray(value.choice)) value.choice.forEach((option, i) => {
        if (typeof option.speech !== 'boolean') audit.unclassified.push(path + '.choice.' + i);
      });
      for (const [key, child] of Object.entries(value)) visit(child, path + '.' + key);
    };
    for (const key of ['nodes', 'places', 'talks']) visit(S[key], key);
    V.choiceSpeechAudit = audit;
    if (audit.mismatches.length || audit.unclassified.length)
      console.warn('[vale choices] Review authored speech metadata', audit);
  }
  E.on('boot', install);
  E.on('chapter', install);
})();
