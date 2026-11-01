/* Vale 0.9.6 · authored emotional continuity.
 * The original Lydia "calm" painting is visibly smiling. Composure during a
 * death report, a threat or safety planning is not a request for that smile.
 * Reuse the original serious full-body poses; keep prose, timing/IDs of old
 * cues, branching, rewards, arrays and save paths untouched.
 */
(() => {
  'use strict';
  const E = StoryEngine, V = ValeDemo;
  const enabled = () => E.S()?.id === 'vale-dossiers-part2-v01';
  const changes = new Map();
  const at = (S, path) => path.reduce((value, key) => value?.[key], S);
  const mark = (path, kind, reason) => changes.set(path.join('.'), { path: [...path], kind, reason });
  // A listener may be restored from an old save in the middle of somebody
  // else's question. Change only an existing Lydia, in her existing slot.
  // In particular this must not re-enter her after the talk's Leave hides her.
  E.side('valeEmotion096', value => {
    const old = E.R()?.cast?.lydia;
    if (!enabled() || value !== 'full' || !old || old.face === 'full') return;
    E.ui.show('lydia', old.at, 'full');
  });
  function listener(S, path) {
    const step = at(S, path);
    if (!step || !(step.say && step.say !== 'lydia' || step.choice || step.read || step.reconstruct)) return;
    step.valeEmotion096 = 'full';
    mark(path, 'report-listener', 'A resumed question/panel resets an already-present Lydia without spawning or moving her.');
  }
  function face(S, path, text, value) {
    const step = at(S, path);
    if (step?.say !== 'lydia' || step.en !== text) return;
    // "full" resolves the actual original full-body image and is truthy.
    // Empty-string face metadata is ignored by the engine's say handler.
    step.face = value;
    mark(path, 'line-expression', 'Explicit serious expression; no inherited smile.');
  }
  function reportPresence(S, path, text) {
    const step = at(S, path);
    if (step?.n?.en !== text) return;
    step.valePresence = { ...step.valePresence, show: [
      ...(step.valePresence?.show || []).filter(actor => actor.id !== 'lydia'),
      { id: 'lydia', face: 'full' }
    ] };
    mark(path, 'report-narration', 'A saved report narration restores the same serious present actor.');
  }
  function motionFace(S, path, owner, value) {
    const step = at(S, path), motion = step?.motion;
    if (motion?.id !== owner) return;
    step.motion = { ...motion, actors: (motion.actors || []).map(actor => actor.id !== 'lydia' ? actor : {
      ...actor, frames: (actor.frames || []).map(frame => frame.face === 'calm' ? { ...frame, face: value } : { ...frame })
    }) };
    mark(path, 'motion-expression', 'Composed/recovering does not use the smiling calm artwork.');
  }
  function trackArt(S, path, owner, art) {
    const step = at(S, path), motion = step?.motion;
    if (motion?.id !== owner) return;
    step.motion = { ...motion, tracks: (motion.tracks || []).map(track => track.id !== 'v091-stage-lydia' ? track : {
      ...track, art, frames: (track.frames || []).map(frame => frame.art === 'lydia-calm' ? { ...frame, art } : { ...frame })
    }) };
    mark(path, 'exit-track-expression', 'The departure retains a serious full-body pose.');
  }
  function install() {
    if (!enabled()) return;
    const S = E.S();
    const talk = S.talks?.p2c1_lydia;
    if (talk?.with === 'lydia') {
      const hello = talk.hello?.[0];
      if (hello?.en === 'Please ask one thing at a time. Everyone else seems to need the whole night in a single sentence.')
        face(S, ['talks', 'p2c1_lydia', 'hello', 0], hello.en, 'full');
      for (const [index, topic] of (talk.topics || []).entries())
        if (['night', 'words', 'today', 'sister'].includes(topic.id))
          for (const [lineIndex, line] of (topic.then || []).entries()) {
            if (line.say === 'lydia')
              face(S, ['talks', 'p2c1_lydia', 'topics', index, 'then', lineIndex], line.en, 'full');
            else if (line.say)
              listener(S, ['talks', 'p2c1_lydia', 'topics', index, 'then', lineIndex]);
          }
      listener(S, ['talks', 'p2c1_lydia', 'bye', 0]);
      // Saves can resume inside a topic without replaying its first line.
      // Each report statement, and its visible narrator response, declares
      // its own expression. Existing v0.9.5 saves need no cursor migration.
      reportPresence(S, ['talks', 'p2c1_lydia', 'topics', 0, 'then', 4],
        'Her thumb presses a crease into the glove. Reed writes the uncertainty down as carefully as the order of the three events.');
      // A smile belongs precisely to the narrated reminiscence. Its passing
      // is also authored: the endpoint, Skip, Replay and reload are serious.
      const memoryPath = ['talks', 'p2c1_lydia', 'topics', 3, 'then', 1];
      const memory = at(S, memoryPath);
      if (talk.topics?.[3]?.id === 'sister' &&
          memory?.n?.en === 'Lydia almost smiles. The expression passes without becoming an apology.' &&
          (!memory.motion || memory.motion.id === 'p2-v096-lydia-memory-smile')) {
        memory.motion = { id: 'p2-v096-lydia-memory-smile', ms: 1700, actors: [{
          id: 'lydia', frames: [
            { offset: 0, face: 'full' }, { offset: .2, face: 'calm' },
            { offset: .6, face: 'calm' }, { offset: 1, face: 'full' }
          ]
        }] };
        mark(memoryPath, 'authored-brief-smile', 'The text explicitly allows a brief memory smile and says it passes.');
      }
      face(S, ['talks', 'p2c1_lydia', 'topics', 3, 'then', 2],
        'Everyone asks how she died. Thank you for allowing her something else.', 'full');
      const parentPath = ['nodes', 'p2c1_open', 14], parent = at(S, parentPath);
      if (parent?.talk === 'p2c1_lydia') {
        parent.valePresence = { ...parent.valePresence, show: [
          ...(parent.valePresence?.show || []).filter(actor => actor.id !== 'lydia'),
          { id: 'lydia', face: 'full' }
        ] };
        mark(parentPath, 'topic-boundary', 'Returning to the report/topic picker clears a previous emotional beat.');
      }
    }
    for (const path of [[11], [15, 'then', 0], [18], [20], [22], [25], [27], [30], [31],
      [31, 'choice', 0, 'then', 1], [31, 'choice', 1, 'then', 1]])
      listener(S, ['nodes', 'p2c1_open', ...path]);
    for (const [path, text] of [
      [[12], 'My stepfather has told me to move into my sister’s room. Alice died there. Last night I heard the sound she used to ask me about.'],
      [[15, 'then', 1], 'I heard Alice cry out, opened my door, and saw her coming into the corridor. I reached her before she fell, then called for help. There was a whistle earlier and a metal sound I cannot place.'],
      [[16, 'then', 0], 'She said “speckled band”, or that is what I remember. She did not name anyone. I have never known what she meant.'],
      [[23], 'I asked. He said I could see for myself when it was finished.'],
      [[26], 'That is how it happened. The other sounds may fit around it. I wish I knew where.'],
      [[29], 'My aunt lives beyond the village. I could go there. But if I leave without asking what happened to Alice, I shall carry this room with me.']
    ]) face(S, ['nodes', 'p2c1_open', ...path], text, 'full');
    reportPresence(S, ['nodes', 'p2c1_open', 24],
      'You lay three slips beside the note. Lydia reads each before you move it. Separate what she knows from what six months of trying have not made clear.');
    reportPresence(S, ['nodes', 'p2c1_open', 28],
      'She looks towards the window. A milk cart rattles past; for the first time she follows an ordinary sound without shrinking from it. Reed brings the tea, giving her a moment before the next question.');
    face(S, ['nodes', 'p2c1_open', 19],
      'Yes. I brought it because I was afraid I would make his words sound worse than they were.', 'full');
    face(S, ['nodes', 'p2c1_open', 31, 'choice', 1, 'then', 2],
      'I can do that. It is easier to open a door when someone will be beside it.', 'resolute');
    face(S, ['nodes', 'p2c5_watch', 6],
      'I will wait. If I change my mind, Ruth and I leave for my aunt’s.', 'resolute');
    face(S, ['nodes', 'p2c6_intervention', 2],
      'For once, he had to say it where someone could remember it besides me.', 'resolute');
    for (const [node, index, owner, value] of [
      ['p2c1_open', 17, 'p2-v06-voluntary-note', 'full'],
      ['p2c2_open', 17, 'vale08-p2c2_open-17', 'full'],
      ['p2c3_open', 33, 'p2-v094-lydia-recovers-after-crash', 'full'],
      ['p2c5_watch', 5, 'p2-v06-safe-arrangement', 'resolute']
    ]) motionFace(S, ['nodes', node, index], owner, value);
    trackArt(S, ['nodes', 'p2c4_open', 40], 'p2-v091-lydia-ruth-leave-room', 'lydia-resolute');
    trackArt(S, ['nodes', 'p2c6_intervention', 3], 'p2-v091-lydia-passes-study', 'lydia-resolute');
  }
  // Part layouts can be registered after common plugins. Reapply only the
  // known authored expression anchors after that composed-data pass.
  E.on('boot', () => { install(); queueMicrotask(install); });
  E.on('chapter', () => { install(); queueMicrotask(install); });
  V.v096Emotions = () => ({ enabled: enabled(), changes: [...changes.values()],
    preservedSmile: 'talks.p2c1_lydia.topics.3.then.1',
    artPolicy: 'Original full-body assets only; calm is a smile, full/resolute are serious.' });
})();
