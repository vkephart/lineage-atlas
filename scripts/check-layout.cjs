// Layout regression check for the map (the project has no unit-test suite; this plus `npm run build` is the test).
// Needs a dev server running (`npm run dev`). Loads the map at a desktop (1440px) and a phone (390px) width and records
// every genre node's position and every pair of overlapping node boxes, plus a screenshot per width.
//
//   node scripts/check-layout.cjs snapshot <out.json> [screenshotDir]   # record the current layout
//   node scripts/check-layout.cjs compare  <before.json> <after.json>   # report new overlaps and displaced nodes
//
// Typical PR check: `git stash` (or check out main) → snapshot before.json → back to the branch → snapshot after.json
// → compare. Exit code 1 when the change introduces an overlap; moved nodes are listed for review, not failed, since
// the de-overlap pass may legitimately nudge a neighbour.
const fs = require('node:fs');
const path = require('node:path');

const URL = process.env.ATLAS_URL || 'http://localhost:5173/';
const WIDTHS = [['desktop', { width: 1440, height: 900 }], ['phone', { width: 390, height: 844 }]];

async function snapshot(out, shotDir) {
  const { chromium } = require('playwright');
  const browser = await chromium.launch();
  const res = {};
  for (const [name, viewport] of WIDTHS) {
    const mobile = name === 'phone';
    const page = await browser.newPage({ viewport, deviceScaleFactor: 1, isMobile: mobile, hasTouch: mobile });
    await page.goto(URL);
    await page.waitForSelector('[data-node]');
    await page.waitForTimeout(1500);
    const nodes = await page.$$eval('[data-node]', (els) => els.map((e) => {
      const kids = [...e.children].map((c) => c.getBoundingClientRect());
      return {
        name: e.innerText.split('\n')[0].trim(),
        x: parseFloat(e.style.left), y: parseFloat(e.style.top),
        box: [Math.min(...kids.map((k) => k.left)), Math.min(...kids.map((k) => k.top)),
          Math.max(...kids.map((k) => k.right)), Math.max(...kids.map((k) => k.bottom))],
      };
    }));
    const overlaps = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i].box, b = nodes[j].box;
        const ox = Math.min(a[2], b[2]) - Math.max(a[0], b[0]), oy = Math.min(a[3], b[3]) - Math.max(a[1], b[1]);
        if (ox > 2 && oy > 2) overlaps.push([nodes[i].name, nodes[j].name].sort().join(' × '));
      }
    }
    res[name] = { nodes: nodes.map(({ name: n, x, y }) => ({ name: n, x, y })), overlaps };
    if (shotDir) await page.screenshot({ path: path.join(shotDir, `layout-${name}.png`) });
    await page.close();
  }
  await browser.close();
  fs.writeFileSync(out, JSON.stringify(res, null, 1));
  for (const [name] of WIDTHS) console.log(`${name}: ${res[name].nodes.length} nodes, ${res[name].overlaps.length} overlapping pairs`);
}

function compare(beforeFile, afterFile) {
  const before = JSON.parse(fs.readFileSync(beforeFile, 'utf8')), after = JSON.parse(fs.readFileSync(afterFile, 'utf8'));
  let fail = false;
  for (const [name] of WIDTHS) {
    const b = before[name], a = after[name];
    const prev = new Map(b.nodes.map((n) => [n.name, n]));
    const added = a.nodes.filter((n) => !prev.has(n.name)).map((n) => n.name);
    const moved = a.nodes.filter((n) => prev.has(n.name) && (Math.abs(prev.get(n.name).x - n.x) > 1 || Math.abs(prev.get(n.name).y - n.y) > 1))
      .map((n) => `${n.name} (${prev.get(n.name).x},${prev.get(n.name).y}) → (${n.x},${n.y})`);
    const newOverlaps = a.overlaps.filter((o) => !b.overlaps.includes(o));
    console.log(`${name}: ${b.nodes.length} → ${a.nodes.length} nodes · overlaps ${b.overlaps.length} → ${a.overlaps.length}`);
    if (added.length) console.log(`  added: ${added.join(', ')}`);
    if (moved.length) console.log(`  moved (review):\n    ${moved.join('\n    ')}`);
    if (newOverlaps.length) { fail = true; console.log(`  NEW OVERLAPS:\n    ${newOverlaps.join('\n    ')}`); }
  }
  console.log(fail ? 'check-layout: FAIL — new overlaps' : 'check-layout: OK — no new overlaps');
  process.exit(fail ? 1 : 0);
}

const [cmd, a1, a2] = process.argv.slice(2);
if (cmd === 'snapshot' && a1) snapshot(a1, a2).catch((e) => { console.error(e); process.exit(2); });
else if (cmd === 'compare' && a1 && a2) compare(a1, a2);
else { console.error('usage: check-layout.cjs snapshot <out.json> [shotDir] | compare <before.json> <after.json>'); process.exit(2); }
