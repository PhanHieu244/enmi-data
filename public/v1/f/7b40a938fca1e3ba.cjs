// Native Enmi v0.9.3 cast staging audit. Test-only fixtures do not mutate production files.
'use strict';
const fs = require('fs'), path = require('path'), http = require('http'), assert = require('assert');
const { chromium } = require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES ? path.join(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES, 'playwright') : 'playwright');
const root = path.resolve(__dirname, '../../../..');
const game = path.join(root, 'tools/games/between-tides');
const runtimeAssets = process.env.BT_RUNTIME_ASSETS !== '0';
const maxChapter = Number(process.env.BT_LOAD_UPTO || 6);
const out = process.env.BT_CAST_OUT || path.join(root, 'docs/games/between-tides/qa', (runtimeAssets ? 'cast-runtime-current' : 'cast-source-current') + (maxChapter < 6 ? '-ch' + maxChapter : ''));
const crypto = require('crypto');
const fingerprint = () => Object.fromEntries(['index.html', 'art.css', 'regions.js', ...fs.readdirSync(game).filter(n => /^art-ch\d+\.css$/.test(n)), ...fs.readdirSync(path.join(game, 'plugins')).filter(n => /\.(js|css)$/.test(n)).map(n => 'plugins/' + n), ...fs.readdirSync(path.join(game, 'story')).filter(n => /^(story|ch[1-6])\.js$/.test(n)).map(n => 'story/' + n), 'lib/story/core.js', 'lib/story/stage.js', 'lib/story/place.js'].map(n => [n, crypto.createHash('sha256').update(fs.readFileSync(path.join(game, n))).digest('hex')]));
const inputHashes = fingerprint();
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'docs/games/between-tides/ART-CHARACTER-MANIFEST-GOUACHE.json')));
const pngs = fs.readdirSync(path.join(game, 'img')).filter(n => n.endsWith('.png'));
const dims = Object.fromEntries(pngs.map(n => { const b = fs.readFileSync(path.join(game, 'img', n)); return [n.slice(0, -4), { size: [b.readUInt32BE(16), b.readUInt32BE(20)] }]; }));
let html = fs.readFileSync(path.join(game, 'index.html'), 'utf8');
// Only equivalent final-build asset URLs and actual PNG dimensions, after the
// current generated art.css; every production plugin and engine file is kept.
if (!runtimeAssets) {
  html = html.replace('</head>', '<style id="cast-qa-art">' + pngs.map(n => '.im-' + n.slice(0, -4) + '{background-image:url(img/' + n + ')}').join('\n') + '</style></head>');
  html = html.replace('<script src="boot.js"></script>', '<script>StoryEngine.regions(' + JSON.stringify(dims) + ');</script><script src="boot.js"></script>');
}
const types = { '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.mp3': 'audio/mpeg' };
const server = http.createServer((req, res) => {
  const u = decodeURIComponent(req.url.split('?')[0]);
  if (u === '/' || u === '/index.html') { res.setHeader('Content-Type', 'text/html'); return res.end(html); }
  const f = path.resolve(game, '.' + u); if (!f.startsWith(game + '/')) { res.statusCode = 403; return res.end(); }
  res.setHeader('Content-Type', types[path.extname(f)] || 'application/octet-stream');
  try { res.end(fs.readFileSync(f)); } catch { res.statusCode = 404; res.end(); }
});
let browser;
(async () => {
  fs.mkdirSync(out, { recursive: true });
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  browser = await chromium.launch({ executablePath: process.env.BT_BROWSER_PATH, headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu'] });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, hasTouch: true }), errors = [], failed = [], results = [];
  page.on('pageerror', e => { errors.push(e.message); console.error('pageerror:', e.message); });
  page.on('response', r => { if (r.status() >= 400 && /\/img\//.test(r.url())) failed.push(r.url()); });
  await page.addInitScript(() => localStorage.setItem('se.between-tides.g', JSON.stringify({ set: { mode: 'bi', speed: 0, vDlg: false, vNarr: false, shadow: false, sfx: false, amb: false, tr: true, vdNativeControls: true }, cps: {}, chAt: {}, truths: {}, endings: {}, opts: {}, words: {}, seen: {}, known: {}, chDone: {} })));
  await page.goto('http://127.0.0.1:' + server.address().port + '/');
  await page.waitForSelector('.se[data-m="ov"]');
  await page.evaluate(async ch => { const E = StoryEngine; await E.loadUpTo(ch); E.ui.recap = async () => {}; E.quiet = true; MobileVN.start(); E.stop(); E.quiet = false; }, maxChapter);
  const cases = [
    { id: 'actual-fergus-bar', place: 'c1_bar', view: 'bar', actors: ['fergus'] },
    { id: 'actual-callum-harbour', place: 'c1_island', view: 'harbour', actors: ['callum'] },
    { id: 'actual-leo-priory', place: 'c1_island', view: 'priory', actors: ['leo'] },
    { id: 'actual-helen-surgery', place: 'c1_island', view: 'surgery', actors: ['helen'] },
    { id: 'actual-gideon-gate', place: 'c1_island', view: 'bighouse', actors: ['gideon'] },
    { id: 'fixture-pair-tom-leo', fixture: true, actors: ['tom', 'leo'], people: [{ who: 'tom', r: [8, 21, 38, 69] }, { who: 'leo', r: [53, 27, 36, 63] }] },
    { id: 'fixture-pair-nell-gideon', fixture: true, actors: ['nell', 'gideon'], people: [{ who: 'nell', r: [7, 39, 38, 51] }, { who: 'gideon', r: [50, 28, 45, 62] }] },
    { id: 'fixture-dodd-seated', fixture: true, actors: ['dodd'], people: [{ who: 'dodd', pose: 'sit', r: [20, 31, 58, 59] }] },
    { id: 'fixture-nell-outside', fixture: true, actors: ['nell'], people: [{ who: 'nell', pose: 'outside', r: [24, 23, 48, 67] }] },
    { id: 'portrait-helen-crying', portrait: true, who: 'helen', face: 'crying' },
    { id: 'portrait-nell-broken', portrait: true, who: 'nell', face: 'broken' },
    { id: 'portrait-callum-ashamed', portrait: true, who: 'callum', face: 'ashamed' },
    { id: 'actual-dodd-harbour-coat', portrait: true, story: true, node: 'c2_harbour', at: 7, who: 'dodd', scene: 'harbour', costume: 'dodd-full-sit' },
    { id: 'actual-dodd-vigil-coat', portrait: true, story: true, node: 'c5_vigil', at: 22, who: 'dodd', scene: 'lantern', costume: 'dodd-full-sit' },
    { id: 'actual-nell-fetch-coat', portrait: true, story: true, node: 'c2_tellfull', at: 34, who: 'nell', scene: 'harbour', costume: 'nell-full-outside' },
    { id: 'actual-nell-armful-narration', portrait: true, story: true, node: 'c2_wait', at: 36, who: 'nell', scene: 'harbour', costume: 'nell-full-outside', hidden: true },
    { id: 'actual-nell-kneel-narration', portrait: true, story: true, node: 'c2_slip', at: 47, who: 'nell', face: 'sad', scene: 'harbour', costume: 'nell-full-outside', hidden: true },
    { id: 'actual-nell-c6-apron', portrait: true, story: true, node: 'c6_channel', at: 8, who: 'nell', face: 'sad', scene: 'causeway-night', costume: '' },
  ].filter(c => !process.env.BT_CAST_CASES || process.env.BT_CAST_CASES.split(',').includes(c.id));
  for (const width of [320, 390]) {
    await page.setViewportSize({ width, height: width === 320 ? 568 : 844 });
    for (const c of cases) {
      await page.evaluate(async c => {
        const E = StoryEngine; E.stop(); E.newRun(); E.stop(); const S = E.S(), R = E.R(); R.ch = 1;
        for (const id of Object.keys(S.chars)) R.met[id] = 1;
        if (c.story) {
          R.ch = Number(c.node[1]); R.scene = c.scene; R.cast = { [c.who]: { at: 'c', face: c.face || '' } };
          R.stack = [{ n: c.node, p: [], i: c.at }]; E.play(); return;
        } else if (c.portrait) {
          S.nodes.__cast_audit = [{ bg: 'lantern' }, { hide: '*' }, { show: c.who, at: 'c', face: c.face }, { say: c.who, face: c.face, en: 'The tide is turning.', vi: 'Con nước đang đổi.' }];
        } else {
          const id = c.fixture ? '__cast_audit_place' : c.place;
          if (c.fixture) S.places[id] = { id, name: { en: 'Cast staging fixture', vi: 'Kiểm bố cục nhân vật' }, start: 'main', direct: true, views: { main: { img: 'harbour', people: c.people, zones: [] } }, need: 0, leave: true };
          S.nodes.__cast_audit = [{ place: id }];
          R.pl = { [id]: { v: c.fixture ? 'main' : c.view, seen: {}, took: {}, vis: {}, hint: 0, solved: {}, n: {} } };
        }
        R.stack = [{ n: '__cast_audit', p: [], i: 0 }]; await E.resume();
      }, c);
      if (c.portrait) await page.waitForSelector('.se-ch[data-id="' + c.who + '"].on');
      else await page.waitForSelector('.pp[data-who="' + c.actors[0] + '"]');
      await page.waitForTimeout(650);
      const data = await page.evaluate(() => {
        const rect = el => { const r = el.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; };
        return { mode: document.querySelector('.se').dataset.m, scene: StoryEngine.R().scene, view: StoryEngine.R().vw, actors: [...document.querySelectorAll('.se-bgl.on .pp')].map(e => { const im = e.querySelector('.ii'); return { who: e.dataset.who, full: e.classList.contains('full'), box: rect(e), sprite: rect(im), art: im.className, url: getComputedStyle(im).backgroundImage, fit: im.dataset.spriteFit || null, mask: getComputedStyle(im).maskImage }; }), portraits: [...document.querySelectorAll('.se-ch.on')].map(e => ({ who: e.dataset.id, face: e.dataset.face, costume: e.dataset.btCostume || '', opacity: getComputedStyle(e).opacity, box: rect(e), active: e.classList.contains('hold') || e.classList.contains('talk'), layers: [...e.querySelectorAll('.ii')].map(i => ({ cls: i.className, display: getComputedStyle(i).display, opacity: getComputedStyle(i).opacity, url: getComputedStyle(i).backgroundImage })) })), width: document.documentElement.scrollWidth, viewport: innerWidth };
      });
      if (!c.portrait) { assert.strictEqual(data.actors.length, c.actors.length, c.id); assert(data.actors.every(a => a.full && /\.(png|webp)/.test(a.url) && a.mask === 'none'), JSON.stringify(data)); }
      if (c.story) { const actor = data.portraits.find(p => p.who === c.who); assert(actor, c.id); assert.strictEqual(actor.costume, c.costume, c.id); if (c.hidden) assert.strictEqual(Number(actor.opacity), 0, c.id); else assert(Number(actor.opacity) > 0.9, c.id); }
      assert(data.width <= data.viewport, c.id + ' horizontal overflow');
      const screenshot = path.join(out, c.id + '-' + width + '.png'); await page.screenshot({ path: screenshot });
      if (!c.portrait && !c.fixture) {
        const actor = page.locator('.se-bgl.on .pp[data-who="' + c.actors[0] + '"]');
        const hit = await actor.evaluate(e => { const r = e.getBoundingClientRect(); return document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2)?.closest('.pp') === e; });
        assert(hit, c.id + ' actor centre obscured');
        const exitTop = await page.locator('[data-leave]').isVisible() ? (await page.locator('[data-leave]').boundingBox()).y : page.viewportSize().height;
        assert(data.actors.every(a => a.box.y + a.box.h < exitTop), c.id + ' actor feet overlap exit');
        await actor.tap();
        await page.waitForFunction(() => StoryEngine.R().stack.some(f => f.n === '@places'));
        data.nativeTalkTap = true;
      }
      results.push({ id: c.id, width, coverage: c.story ? 'actual authored story frame restored with required prior cast/scene state' : c.fixture || c.portrait ? 'native renderer fixture, not a story scene' : 'actual authored place and region', screenshot, ...data });
    }
  }
  const loading = await page.evaluate(() => ({ stylesheets: [...document.querySelectorAll('link[rel=stylesheet]')].map(e => e.getAttribute('href')), chapter6NodesLoaded: !!StoryEngine.S().nodes.c6_open }));
  if (maxChapter < 6) { assert(!loading.chapter6NodesLoaded, 'early-chapter test loaded Ch6'); assert(!loading.stylesheets.some(h => /art-ch(\d+)\.css/.test(h) && Number(h.match(/art-ch(\d+)\.css/)[1]) > maxChapter), 'early-chapter test loaded later CSS'); }
  assert.deepStrictEqual(fingerprint(), inputHashes, 'production CSS/index/plugin changed while test was running');
  const result = { maxChapterRequested: maxChapter, loading, inputHashes, nativeEngine: true, nativeCoreModified: false, allProductionPlugins: true, finalPngOverrideOnly: !runtimeAssets, runtimeAssets, castAssets: manifest.assets.length, errors, failedImageRequests: [...new Set(failed)], cases: results };
  fs.writeFileSync(path.join(out, 'result.json'), JSON.stringify(result, null, 2));
  assert.deepStrictEqual(errors, []); assert.deepStrictEqual(failed, []);
  console.log(JSON.stringify({ pass: true, cases: results.length, screenshots: out, errors, failedImageRequests: failed }));
  await browser.close(); browser = null; server.close();
})().catch(async e => { console.error(e); if (browser) await browser.close(); server.close(); process.exitCode = 1; });
