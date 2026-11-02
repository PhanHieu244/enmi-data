// Preserve an audited cursor map across a text/art-only release. Never guess
// alignment again: all authored paths, gates and effects must remain identical.
// Capture: node bt-refresh-save-map.cjs capture PREVIOUS_GAME_DIR LINEAGE_JSON
// Refresh: node bt-refresh-save-map.cjs refresh LINEAGE_JSON CURRENT_GAME_DIR
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm'), crypto = require('crypto');
const [mode, input, output] = process.argv.slice(2);
if (!['capture', 'refresh'].includes(mode) || !input || !output) throw Error('Usage: bt-refresh-save-map.cjs capture PREVIOUS_GAME_DIR LINEAGE_JSON | refresh LINEAGE_JSON CURRENT_GAME_DIR');
const hash = x => crypto.createHash('sha256').update(x).digest('hex');
const serial = x => JSON.stringify(x, (k, v) => typeof v === 'function' ? String(v).replace(/\s+/g, '') : v);
const textOrAppearance = new Set(['en', 'vi', 'easy', 'tone', 'face']);
function shape(x, p = []) {
  // One reviewed presentation rewrite turns an idle narrator beat into the
  // player's question. It is still one blocking line at exactly the same
  // cursor, with no gate, effect or choice. Do not generalize this exception.
  if (JSON.stringify(p) === '["nodes","c1_lantern",30]' && x && typeof x === 'object') {
    const keys = Object.keys(x).filter(k => !textOrAppearance.has(k)).sort().join(',');
    if ((keys === 'n,on' && x.on === 'nell' && typeof x.n?.en === 'string') ||
      (keys === 'say' && x.say === 'me' && typeof x.en === 'string'))
      return { reviewedBlockingLine: 'c1_lantern:30' };
  }
  if (typeof x === 'function') return String(x).replace(/\s+/g, '');
  if (Array.isArray(x)) return x.map((item, i) => shape(item, [...p, i]));
  if (x && typeof x === 'object') return Object.fromEntries(Object.keys(x).filter(k => !textOrAppearance.has(k) && !(k === 'tag' && typeof x.set?.took_draft === 'boolean')).sort().map(k => [k, shape(x[k], [...p, k])]));
  return x;
}
function load(dir) {
  const parts = [], ctx = vm.createContext({ StoryEngine: { story: s => parts.push(s), chapter: s => parts.push(s), regions() {} } });
  const files = ['story.js', ...fs.readdirSync(path.join(dir, 'story')).filter(f => /^ch\d+\.js$/.test(f)).sort((a, b) => parseInt(a.slice(2)) - parseInt(b.slice(2)))];
  const scriptHashes = {};
  for (const file of files) {
    const bytes = fs.readFileSync(path.join(dir, 'story', file));
    scriptHashes['story/' + file] = hash(bytes);
    vm.runInContext(bytes.toString('utf8'), ctx, { filename: file });
  }
  const merge = selected => {
    const story = { nodes: {}, places: {}, talks: {}, events: {}, flow: [] };
    for (const item of selected) for (const key of Object.keys(story)) {
      if (Array.isArray(story[key])) story[key].push(...item[key] || []);
      else Object.assign(story[key], item[key] || {});
    }
    // Native place.js creates these nested cursor paths at normalization.
    const seen = new WeakSet();
    function normalize(x) {
      if (!x || typeof x !== 'object' || seen.has(x)) return;
      seen.add(x);
      if (x.views) for (const view of Object.values(x.views)) {
        for (const person of view.people || []) person.go = [{ talk: typeof person.talk === 'string' ? person.talk : { with: person.who, ...person.talk } }];
        for (const zone of view.zones || []) if (zone.talk) zone.go = [{ talk: typeof zone.talk === 'string' ? zone.talk : { with: zone.who, ...zone.talk } }];
      }
      for (const value of Object.values(x)) normalize(value);
    }
    normalize(story);
    return story;
  };
  const all = merge(parts), five = merge(parts.slice(0, 6));
  const fields = ['nodes', 'places', 'talks', 'events', 'combos', 'flow', 'chapters'];
  const projection = parts.map(part => Object.fromEntries(fields.map(key => [key, shape(part[key], [key])])));
  // Identifier catalogs must also survive: save evidence and character IDs
  // remain meaningful even when their descriptions/portraits are rewritten.
  const ids = parts.map(part => Object.fromEntries(['items', 'truths', 'chars', 'words'].map(key => [key, Object.keys(part[key] || {}).sort()])));
  const arrays = {};
  function catalog(x, n, p) {
    if (Array.isArray(x)) arrays[JSON.stringify([n, p])] = x.length;
    if (x && typeof x === 'object') for (const [key, value] of Object.entries(x)) {
      if (value && typeof value === 'object') catalog(value, n, [...p, Array.isArray(x) ? +key : key]);
    }
  }
  for (const [n, steps] of Object.entries(all.nodes)) catalog(steps, n, []);
  for (const key of ['places', 'talks', 'events']) catalog(all[key], '@' + key, []);
  for (const n of ['@__seen', '@__take']) arrays[JSON.stringify([n, []])] = 1;
  return { scriptHashes, digest: hash(serial(scriptHashes)), shapeDigest: hash(serial({ projection, ids })), arrays, all, five };
}
function readMap(file) {
  const ctx = vm.createContext({ StoryEngine: {} });
  vm.runInContext(fs.readFileSync(file, 'utf8'), ctx, { filename: file });
  return JSON.parse(JSON.stringify(ctx.StoryEngine.btSaveMap));
}
if (mode === 'capture') {
  if (fs.existsSync(output)) throw Error('Refusing to overwrite frozen release lineage: ' + output);
  const old = load(input), map = readMap(path.join(input, 'plugins/bt-save-map.js'));
  if (serial(map.targetScriptHashes) !== serial(old.scriptHashes) || map.targetDigest !== old.digest || map.revision !== 'bt-complete-' + old.digest.slice(0, 16)) throw Error('Previous source files do not match their released revision');
  const auditFile = path.join(input, 'plugins/bt-save-map-audit.json');
  const record = { format: 1, purpose: 'Frozen previous release: prove identity of saved cursor paths, gates and effects before accepting its revision.', ignoredFields: [...textOrAppearance], presentationExceptions: [{ field: 'tag', selector: 'choice.set.took_draft is boolean', reason: 'Native mech.js uses choice.tag only as a stance badge. Remove misleading bluff/polite badges from Take/Leave physical evidence actions; preserve every choice effect and index.' }], previousRevision: map.revision, scriptHashes: old.scriptHashes, shapeDigest: old.shapeDigest, arrays: old.arrays, legacyMap: map, legacyAudit: JSON.parse(fs.readFileSync(auditFile, 'utf8')) };
  record.presentationExceptions.push({ path: 'nodes.c1_lantern[30]', allowed: ['n with on:nell', 'say:me'], reason: 'One blocking narrator beat becomes one player question, preserving cursor and all gates/effects. Extra side effects at this path are not ignored.' });
  fs.mkdirSync(path.dirname(path.resolve(output)), { recursive: true });
  fs.writeFileSync(output, JSON.stringify(record) + '\n');
  console.log(JSON.stringify({ captured: record.previousRevision, shapeDigest: record.shapeDigest, arrays: Object.keys(record.arrays).length, file: output }, null, 2));
} else {
  const record = JSON.parse(fs.readFileSync(input, 'utf8')), current = load(output), base = record.legacyMap;
  if (record.format !== 1 || base?.revision !== record.previousRevision || hash(serial(record.scriptHashes)) !== base.targetDigest || serial(record.scriptHashes) !== serial(base.targetScriptHashes)) throw Error('Invalid frozen release lineage');
  if (record.shapeDigest !== current.shapeDigest || serial(record.arrays) !== serial(current.arrays)) throw Error('Authored frame/path/gate/effect contract changed. Identity migration is not safe; provide an explicit migration.');
  const revision = 'bt-complete-' + current.digest.slice(0, 16);
  const compatibleRevisions = { ...(base.compatibleRevisions || {}) };
  if (revision !== record.previousRevision) compatibleRevisions[record.previousRevision] = { mode: 'identity', sourceDigest: base.targetDigest, shapeDigest: record.shapeDigest };
  const next = { ...base, targetMappingDigest: hash(serial(current.five)), targetScriptHashes: current.scriptHashes, targetDigest: current.digest, revision, targetNodes: Object.keys(current.all.nodes), targetArrays: current.arrays, compatibleRevisions };
  for (const [key, [n, p, i]] of Object.entries(next.frames)) {
    const length = current.arrays[JSON.stringify([n, p])];
    if (!Number.isInteger(length) || i < 0 || i > length) throw Error('Legacy mapping no longer resolves: ' + key);
  }
  const file = path.join(output, 'plugins/bt-save-map.js');
  fs.writeFileSync(file, '// Audited original cursor map plus verified identity lineage. Generated by bt-refresh-save-map.cjs; do not edit by hand.\nStoryEngine.btSaveMap = ' + JSON.stringify(next) + ';\n');
  const audit = { ...record.legacyAudit, targetMappingDigest: next.targetMappingDigest, targetScriptHashes: next.targetScriptHashes, targetDigest: next.targetDigest, revision, outputBytes: fs.statSync(file).size, identityMigration: { from: record.previousRevision, to: revision, shapeDigest: current.shapeDigest, unchangedArrayCount: Object.keys(current.arrays).length, unchangedCursorCount: Object.values(current.arrays).reduce((total, length) => total + length + 1, 0), ignoredFields: record.ignoredFields, presentationExceptions: record.presentationExceptions, legacyFramesPreserved: Object.keys(next.frames).length, lineageFile: path.basename(input) } };
  fs.writeFileSync(path.join(output, 'plugins/bt-save-map-audit.json'), JSON.stringify(audit, null, 2) + '\n');
  console.log(JSON.stringify({ revision, identityMigration: audit.identityMigration, compatibleRevisions: Object.keys(compatibleRevisions) }, null, 2));
}
