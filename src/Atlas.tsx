/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * The Music Genre Lineage Atlas — main interactive component.
 *
 * Ported faithfully from the Claude Design prototype (design-handoff/project/The Lineage Atlas.dc.html).
 * Deliberately a class component: the map's pan/zoom/pinch transform and hover highlighting are written
 * imperatively to the DOM (never through setState) because a React re-render of ~200 nodes and ~650 edges
 * repaints staggered over several frames and reads as flicker. Everything else is ordinary React state.
 */
import React from 'react';
import { atlasData } from './data';
import type { Edge, Family, FamilyId, Genre, Journey, Rel, Role } from './data';
import { css } from './css';

type GNode = Genre & { x: number; y: number; _root?: boolean };
type GEdge = Edge & { _i: string; _d: string; _mx: number; _my: number };
type Fam = Family & { y: number };

interface State {
  year: number;
  selectedNodeId: string | null;
  selectedEdgeId: string | null;
  hoverNodeId: string | null;
  mode: 'explore' | 'journey';
  activeJourney: Journey | null;
  journeyStep: number;
  breadcrumb: string[];
  showPaths: boolean;
  showListen: boolean;
  playing: boolean;
  bridgeMode: boolean;
  focusFam: FamilyId | null;
  openTrait: string | null;
  legendOpen: boolean;
  isMobile: boolean;
  query: string;
  svc: string;
  isFs: boolean;
  immersive: boolean;
  sheetFull: boolean;
}

/** Display tweaks that were exposed as editor props in the prototype. */
const DIM_INACTIVE = 0.22;
const ALWAYS_LABELS = false;

const REL_LABEL: Record<Rel, string> = { origin: 'Historical origin', stylistic: 'Stylistic influence', production: 'Production influence', scene: 'Scene adjacency', revival: 'Revival / reinterpretation', bridge: 'Cross-family bridge' };
const STATUS_MAP: Record<Role, string> = { foundational: 'Foundational', branch: 'Branch-forming', classic: 'Classic', hybrid: 'Hybrid genre', revival: 'Revivalist', rising: 'Emerging' };
const SVCS = [
  { k: 'spotify', n: 'Spotify', c: '#1ed760', tint: 'rgba(30,215,96,.14)' },
  { k: 'apple', n: 'Apple Music', c: '#fa586a', tint: 'rgba(250,88,106,.14)' },
  { k: 'bandcamp', n: 'Bandcamp', c: '#63b1c0', tint: 'rgba(99,177,192,.14)' },
  { k: 'youtube', n: 'YouTube', c: '#ff4e45', tint: 'rgba(255,78,69,.14)' },
];
const MONO = "'JetBrains Mono',monospace";
const SERIF = "'Spectral',serif";

const btnStyle = css("font-family:'Schibsted Grotesk';font-size:12.5px;padding:9px 15px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.13);color:#dbe0e6;border-radius:9px;cursor:pointer;display:flex;align-items:center;gap:7px;");
const btnOnStyle = css("font-family:'Schibsted Grotesk';font-size:12.5px;padding:9px 15px;background:#e7eaee;border:1px solid #e7eaee;color:#11141a;border-radius:9px;cursor:pointer;font-weight:600;display:flex;align-items:center;gap:7px;");
const ctrlBtn = css('width:40px;height:40px;border-radius:11px;background:rgba(15,17,22,.92);border:1px solid rgba(255,255,255,.11);color:#dbe0e6;font-size:19px;cursor:pointer;line-height:1;');
const sectionHead = css("font-family:'JetBrains Mono',monospace;font-size:9.5px;letter-spacing:.2em;color:#5a626d;text-transform:uppercase;margin:26px 0 12px;");
const legendRow = css('display:flex;align-items:center;gap:9px;margin-bottom:7px;');
const legendTxt = css('font-size:11.5px;color:#c8cdd4;');
const roleRow = css('display:flex;align-items:center;gap:7px;');
const roleTxt = css('font-size:11px;color:#c8cdd4;');
const panelStyle = css('position:absolute;top:0;right:0;height:100%;width:408px;z-index:34;background:#0d1014;border-left:1px solid rgba(255,255,255,.09);overflow-y:auto;box-shadow:-24px 0 70px rgba(0,0,0,.5);');
const sheetHandleBtn = css('display:flex;flex-direction:column;align-items:center;gap:7px;width:100%;background:none;border:none;cursor:pointer;padding:0 0 14px;margin-top:-12px;');

export class Atlas extends React.Component<Record<string, never>, State> {
  viewportRef = React.createRef<HTMLDivElement>();
  worldRef = React.createRef<HTMLDivElement>();
  rootRef = React.createRef<HTMLDivElement>();

  view = { x: 0, y: 0, k: 0.5 };
  dragging = false;
  WW = 3600; WH = 3760; PX0 = 160; PX1 = 560; MX0 = 760; RX = 360; LBX = 156; KMAX = 2.0;
  minYear = -380; maxYear = 2026;
  CP: [number, number][] = [[-380, -0.2164], [900, -0.1418], [1550, -0.0709], [1865, 0], [1897, 0.09], [1915, 0.17], [1935, 0.27], [1945, 0.34], [1955, 0.42], [1965, 0.50], [1972, 0.58], [1978, 0.65], [1985, 0.73], [1992, 0.81], [2000, 0.88], [2010, 0.94], [2026, 1]];

  FAM: Record<string, Fam> = {};
  famOrder: FamilyId[] = [];
  GENRES: GNode[] = [];
  EDGES: GEdge[] = [];
  JOURNEYS: Journey[] = [];
  byId: Record<string, GNode> = {};
  outDeg: Record<string, number> = {};
  inDeg: Record<string, number> = {};
  backbone: Record<string, boolean> = {};
  artistMap: Record<string, { name: string; ids: string[] }> = {};
  rootSpan = { y0: 0, y1: 0 };

  private _ready = false;
  private _ptrs: Record<string, { x: number; y: number }> = {};
  private _pinch: { dist: number; k: number; vx: number; vy: number } | null = null;
  private _glide: number | null = null;
  private _vel = { x: 0, y: 0 };
  private _last: { x: number; y: number; t: number } | null = null;
  private _start = { x: 0, y: 0, vx: 0, vy: 0 };
  private _moved = false;
  private _suppressClick = false;
  private _padUntil = 0;
  private _t: ReturnType<typeof setInterval> | undefined;
  private _pos = 0;
  private _focusT = 0;
  private _focusTick: ReturnType<typeof setInterval> | undefined;
  private _hoverT: ReturnType<typeof setTimeout> | undefined;
  private _hoverId: string | null = null;
  private _hoverDimOn = false;
  private _hEls: { nodes: HTMLElement[]; gs: SVGGElement[] } | null = null;
  private _fitDone = false;
  private _onDown!: (e: PointerEvent) => void;
  private _onMove!: (e: PointerEvent) => void;
  private _onUp!: (e: PointerEvent) => void;
  private _onCancel!: (e: PointerEvent) => void;
  private _onWheel!: (e: WheelEvent) => void;
  private _onClickCapture!: (e: MouseEvent) => void;
  private _onGesture!: (e: Event) => void;
  private _onCtx!: (e: MouseEvent) => void;
  private _onTm!: (e: TouchEvent) => void;
  private _onResize!: () => void;
  private _onFs!: () => void;

  constructor(props: Record<string, never>) {
    super(props);
    const mob = typeof window !== 'undefined' && window.innerWidth <= 720;
    let svc = 'spotify';
    try { svc = localStorage.getItem('la-svc') || 'spotify'; } catch { /* private mode */ }
    this.state = { year: 2026, selectedNodeId: null, selectedEdgeId: null, hoverNodeId: null, mode: 'explore', activeJourney: null, journeyStep: 0, breadcrumb: [], showPaths: false, showListen: false, playing: false, bridgeMode: false, focusFam: null, openTrait: null, legendOpen: !mob, isMobile: mob, query: '', svc, isFs: false, immersive: false, sheetFull: false };
  }

  // ── data + layout ────────────────────────────────────────────────────────
  ensureData(): boolean {
    if (this._ready) return true;
    const D = atlasData;
    this.FAM = {};
    D.families.forEach((f) => { this.FAM[f.id] = { ...f }; });
    this.famOrder = D.families.map((f) => f.id);
    this.GENRES = D.genres.map((g) => ({ ...g, x: 0, y: 0 }));
    this.EDGES = D.edges.map((e, i) => ({ ...e, _i: 'ed' + i, _d: '', _mx: 0, _my: 0 }));
    this.JOURNEYS = D.journeys;
    this.byId = {}; this.outDeg = {}; this.inDeg = {};
    // Densest rows (rock, electronic) get extra height so the declutter pass can separate them without crossing dividers.
    const extra: Record<string, number> = { rock: 90, metal: 90, electronic: 70, roots: 70 };
    let acc = 0;
    this.famOrder.forEach((k) => { acc += extra[k] || 0; this.FAM[k].y += acc; });
    this.WH = this.FAM[this.famOrder[this.famOrder.length - 1]].y + 440;
    this.GENRES.forEach((g) => { this.byId[g.id] = g; g.x = this.xFromYear(g.year); g.y = this.FAM[g.fam].y + (g.yOff || 0); });
    // Pre-1865 art-music roots form a single vertical stem, read top-down, centred on the map
    const roots = this.GENRES.filter((g) => g.year < 1865).sort((a, b) => a.year - b.year);
    const mid = (this.FAM[this.famOrder[0]].y + this.FAM[this.famOrder[this.famOrder.length - 1]].y) / 2, gap = 250;
    const ry0 = mid - (roots.length - 1) * gap / 2;
    roots.forEach((g, i) => { g.x = this.RX; g.y = ry0 + i * gap; g._root = true; });
    this.rootSpan = { y0: ry0 - 150, y1: ry0 + (roots.length - 1) * gap + 120 };
    this.EDGES.forEach((e) => { this.outDeg[e.from] = (this.outDeg[e.from] || 0) + 1; this.inDeg[e.to] = (this.inDeg[e.to] || 0) + 1; });
    this.declutter();
    this.EDGES.forEach((e) => {
      const a = this.byId[e.from], b = this.byId[e.to];
      e._d = this.bez(a, b); e._mx = (a.x + b.x) / 2; e._my = (a.y + b.y) / 2 - 7; // geometry is static — compute once, not per render
    });
    // Main lineage: each genre's strongest same-family parent link (origin preferred), used when a family is focused.
    this.backbone = {};
    const bestIn: Record<string, { e: GEdge; sc: number }> = {};
    this.EDGES.forEach((e) => {
      const a = this.byId[e.from], b = this.byId[e.to]; if (a.fam !== b.fam) return;
      const sc = (e.rel === 'origin' ? 10 : 0) + (e.strength || 0); const cur = bestIn[e.to]; if (!cur || sc > cur.sc) bestIn[e.to] = { e, sc };
    });
    Object.keys(bestIn).forEach((k) => { this.backbone[bestIn[k].e._i] = true; });
    // Artist search index: curated index (primary genre first, parents as roll-up) merged with each genre's representative artists
    this.artistMap = {};
    const addArtist = (name: string, gid: string) => { if (!this.byId[gid]) return; const k = name.toLowerCase(); const rec = this.artistMap[k] || (this.artistMap[k] = { name, ids: [] }); if (rec.ids.indexOf(gid) < 0) rec.ids.push(gid); };
    Object.keys(D.artistIndex).forEach((name) => { D.artistIndex[name].forEach((gid) => addArtist(name, gid)); });
    this.GENRES.forEach((g) => { (g.artists || []).forEach((a) => addArtist(a, g.id)); });
    this._ready = true;
    return true;
  }

  // Push apart nodes whose disc + label boxes overlap. Greedy placement: most-connected genres first,
  // each takes the free spot nearest its authored position, inside its own family row.
  declutter() {
    const fo = this.famOrder, F = this.FAM;
    const band: Record<string, { lo: number; hi: number }> = {};
    fo.forEach((k, i) => {
      const y = F[k].y, py = i > 0 ? F[fo[i - 1]].y : y - 420, ny = i < fo.length - 1 ? F[fo[i + 1]].y : y + 420;
      band[k] = { lo: (py + y) / 2, hi: (y + ny) / 2 };
    });
    const G = this.GENRES.filter((g) => !g._root);
    type NP = { g: GNode; r: number; hw: number; top: number; bot: number; x0: number; y0: number; b: { lo: number; hi: number }; x: number; y: number };
    const N: NP[] = G.map((g) => {
      const r = this.nodeR(g), lw = Math.min(g.name.length * 7.2 + 14, 2 * r + 150), lines = Math.ceil((g.name.length * 7.2) / (2 * r + 150));
      const bd = band[g.fam];
      const lo = Math.min(bd.lo + r + 8, g.y), hi = Math.max(bd.hi - r - 28, g.y);
      return { g, r, hw: Math.max(r + 8, lw / 2), top: r + 6, bot: r + 20 + lines * 15 + 14, x0: g.x, y0: g.y, b: { lo, hi }, x: g.x, y: g.y };
    });
    const XR = 160, GX = 8, GY = 6;
    N.sort((a, b) => { const da = (this.outDeg[a.g.id] || 0) + (this.inDeg[a.g.id] || 0), db = (this.outDeg[b.g.id] || 0) + (this.inDeg[b.g.id] || 0); return (db - da) || (a.x0 - b.x0); });
    const placed: NP[] = [];
    const hits = (n: NP, x: number, y: number, list: NP[]) => {
      let c = 0;
      for (const p of list) {
        const ox = n.hw + p.hw + GX - Math.abs(x - p.x); if (ox <= 0) continue;
        const oy = Math.min(y + n.bot, p.y + p.bot) - Math.max(y - n.top, p.y - p.top) + GY; if (oy <= 0) continue;
        c += ox * oy;
      }
      return c;
    };
    N.forEach((n) => {
      const near = placed.filter((p) => Math.abs(p.x - n.x0) < XR + n.hw + p.hw + GX);
      const cands: { x: number; y: number; c: number }[] = [];
      for (let dy = -(n.y0 - n.b.lo); dy <= n.b.hi - n.y0 + 0.01; dy += 10) { for (let dx = -XR; dx <= XR; dx += 12) { cands.push({ x: n.x0 + dx, y: n.y0 + dy, c: dy * dy + 2.2 * dx * dx }); } }
      cands.push({ x: n.x0, y: n.y0, c: -1 });
      cands.sort((a, b) => a.c - b.c);
      let best = cands[0], bestHit = Infinity;
      for (const cd of cands) { const h = hits(n, cd.x, cd.y, near); if (h === 0) { best = cd; break; } if (h < bestHit) { bestHit = h; best = cd; } }
      n.g.x = best.x; n.g.y = best.y; n.x = best.x; n.y = best.y; placed.push(n);
    });
  }

  fFromYear(y: number) {
    const cp = this.CP;
    if (y <= cp[0][0]) return cp[0][1];
    if (y >= cp[cp.length - 1][0]) return cp[cp.length - 1][1];
    for (let i = 0; i < cp.length - 1; i++) { if (y >= cp[i][0] && y <= cp[i + 1][0]) { const t = (y - cp[i][0]) / (cp[i + 1][0] - cp[i][0]); return cp[i][1] + t * (cp[i + 1][1] - cp[i][1]); } }
    return 0;
  }
  xFromYear(y: number) {
    const f = this.fFromYear(y);
    if (f < 0) { const f0 = this.CP[0][1]; return this.PX0 + ((f - f0) / (0 - f0)) * (this.PX1 - this.PX0); }
    return this.MX0 + f * (this.WW - this.MX0 - 170);
  }
  posFromYear(y: number) { const f0 = this.CP[0][1]; return (this.fFromYear(y) - f0) / (1 - f0); }
  yearFromPos(p: number) {
    const cp = this.CP, f0 = cp[0][1];
    const f = f0 + Math.max(0, Math.min(1, p)) * (1 - f0);
    if (f <= cp[0][1]) return cp[0][0];
    if (f >= cp[cp.length - 1][1]) return cp[cp.length - 1][0];
    for (let i = 0; i < cp.length - 1; i++) { if (f >= cp[i][1] && f <= cp[i + 1][1]) { const t = (f - cp[i][1]) / (cp[i + 1][1] - cp[i][1]); return Math.round(cp[i][0] + t * (cp[i + 1][0] - cp[i][0])); } }
    return cp[cp.length - 1][0];
  }
  fmtYear(y: number) { return y < 0 ? (-y) + ' BCE' : (y < 1000 ? y + ' CE' : '' + y); }

  rgba(fam: string, a: number) { return 'rgba(' + this.FAM[fam].rgb + ',' + a + ')'; }
  hex(fam: string) { return this.FAM[fam].color; }
  spfy(q: string) { return 'https://open.spotify.com/search/' + encodeURIComponent(q); }
  musicHref(q: string) { const v = this.state.svc; return v === 'apple' ? 'https://music.apple.com/search?term=' + encodeURIComponent(q) : v === 'bandcamp' ? 'https://bandcamp.com/search?q=' + encodeURIComponent(q) : v === 'youtube' ? 'https://www.youtube.com/results?search_query=' + encodeURIComponent(q) : this.spfy(q); }
  setSvc(k: string) { try { localStorage.setItem('la-svc', k); } catch { /* ignore */ } this.setState({ svc: k }); }
  /** Desktop Spotify: try the native app first, fall back to the web player if nothing took focus within ~1.3s. */
  goLink(q: string) {
    return (e: React.MouseEvent) => {
      if (this.state.svc !== 'spotify' || this.state.isMobile) return;
      e.preventDefault(); e.stopPropagation();
      const web = this.spfy(q); let done = false;
      const timer = setTimeout(() => { cleanup(); window.open(web, '_blank', 'noopener'); }, 1300);
      function cleanup() { if (done) return; done = true; clearTimeout(timer); window.removeEventListener('blur', onAway); document.removeEventListener('visibilitychange', onVis); }
      function onAway() { cleanup(); }
      function onVis() { if (document.hidden) cleanup(); }
      window.addEventListener('blur', onAway);
      document.addEventListener('visibilitychange', onVis);
      try { window.location.href = 'spotify:search:' + encodeURIComponent(q); } catch { cleanup(); window.open(web, '_blank', 'noopener'); }
    };
  }
  bez(a: { x: number; y: number }, b: { x: number; y: number }) { const dx = b.x - a.x; return 'M ' + a.x + ' ' + a.y + ' C ' + (a.x + dx * 0.42) + ' ' + a.y + ', ' + (a.x + dx * 0.58) + ' ' + b.y + ', ' + b.x + ' ' + b.y; }
  dashFor(rel: Rel) { return rel === 'origin' ? 'none' : rel === 'stylistic' ? '9 7' : rel === 'production' ? '2 6' : rel === 'scene' ? '1 8' : rel === 'revival' ? '12 5 2 6' : '14 5'; }
  baseR(role: Role) { return role === 'foundational' ? 30 : role === 'hybrid' ? 25 : role === 'revival' ? 23 : role === 'rising' ? 24 : 23; }
  nodeR(g: Genre) { return this.baseR(g.role) + Math.min(9, ((this.outDeg[g.id] || 0) + (this.inDeg[g.id] || 0)) * 0.9); }

  // ── view transform ───────────────────────────────────────────────────────
  private _setPerf(on: boolean) { const r = this.rootRef.current; if (!r) return; if (on) r.classList.add('gx-perf'); else r.classList.remove('gx-perf'); }
  private _stopGlide() { if (this._glide) { cancelAnimationFrame(this._glide); this._glide = null; this._setPerf(false); } }
  private _startGlide() {
    const v = this._vel || { x: 0, y: 0 };
    const speed = Math.hypot(v.x, v.y);
    if (speed < 0.08) return; // not a flick, just a slow release
    let vx = Math.max(-3.2, Math.min(3.2, v.x)), vy = Math.max(-3.2, Math.min(3.2, v.y));
    let prev = performance.now();
    const step = (now: number) => {
      const dt = Math.min(34, now - prev); prev = now;
      const decay = Math.pow(0.9955, dt * 2);
      vx *= decay; vy *= decay;
      this.view.x += vx * dt; this.view.y += vy * dt;
      this.applyTransform(false);
      if (Math.hypot(vx, vy) > 0.02) { this._glide = requestAnimationFrame(step); } else { this._glide = null; this._setPerf(false); }
    };
    this._glide = requestAnimationFrame(step);
  }
  applyTransform(animated: boolean) { const w = this.worldRef.current; if (!w) return; w.style.transition = animated ? 'transform .7s cubic-bezier(.22,.61,.36,1)' : 'none'; w.style.transform = 'translate(' + this.view.x + 'px,' + this.view.y + 'px) scale(' + this.view.k + ')'; }

  fitView(animated: boolean) {
    const vp = this.viewportRef.current; if (!vp || !this.GENRES.length) return;
    const r = vp.getBoundingClientRect();
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    this.GENRES.forEach((g) => { x0 = Math.min(x0, g.x); y0 = Math.min(y0, g.y); x1 = Math.max(x1, g.x); y1 = Math.max(y1, g.y); });
    x0 = this.LBX - 24; y0 -= 120; x1 += 150; y1 += 120;
    const cw = x1 - x0, ch = y1 - y0;
    const k = Math.max(0.16, Math.min(0.7, Math.min((r.width - 60) / cw, (r.height - 200) / ch)));
    const vx = cw * k > r.width - 24 ? 12 - x0 * k : (r.width - cw * k) / 2 - x0 * k;
    this.view = { x: vx, y: (r.height - ch * k) / 2 - y0 * k - 8, k };
    this.applyTransform(animated);
  }

  // Fit a set of nodes into the viewport area not covered by overlays (header, legend, panel, slider).
  fitNodes(list: { x: number; y: number; id?: string }[], opts: { minK?: number; maxK?: number } = {}) {
    const vp = this.viewportRef.current; if (!vp || !list || !list.length) return false;
    const r = vp.getBoundingClientRect(); const mob = this.state.isMobile;
    let top = mob ? 80 : 72, bottom = 40, left = mob ? 16 : 32, right = mob ? 16 : 32; const pad = 20;
    const root: ParentNode = this.rootRef.current || document;
    const els = Array.prototype.slice.call(root.querySelectorAll('[data-ui]')) as HTMLElement[];
    els.forEach((el) => {
      if (el.parentElement && el.parentElement.closest('[data-ui]')) return;
      const b = el.getBoundingClientRect(); if (b.width < 4 || b.height < 4) return;
      const cs = getComputedStyle(el);
      if (cs.visibility === 'hidden' || +cs.opacity === 0) return;
      if (b.right <= r.left || b.left >= r.right || b.bottom <= r.top || b.top >= r.bottom) return;
      const c = [
        { s: 'left', v: b.right - r.left + pad },
        { s: 'right', v: r.right - b.left + pad },
        { s: 'top', v: b.bottom - r.top + pad },
        { s: 'bottom', v: r.bottom - b.top + pad },
      ].map((o) => {
        let L = left, R = right, T = top, B = bottom;
        if (o.s === 'left') L = Math.max(L, o.v); if (o.s === 'right') R = Math.max(R, o.v); if (o.s === 'top') T = Math.max(T, o.v); if (o.s === 'bottom') B = Math.max(B, o.v);
        return { ...o, area: Math.max(0, r.width - L - R) * Math.max(0, r.height - T - B) };
      }).sort((a, b2) => b2.area - a.area)[0];
      if (c.s === 'left') left = Math.max(left, c.v); else if (c.s === 'right') right = Math.max(right, c.v); else if (c.s === 'top') top = Math.max(top, c.v); else bottom = Math.max(bottom, c.v);
    });
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    list.forEach((g) => { const rr = 'id' in g && g.id ? this.nodeR(this.byId[g.id]) : 30; x0 = Math.min(x0, g.x - rr - 60); x1 = Math.max(x1, g.x + rr + 60); y0 = Math.min(y0, g.y - rr - 20); y1 = Math.max(y1, g.y + rr + 56); });
    const aw = Math.max(80, r.width - left - right), ah = Math.max(80, r.height - top - bottom);
    let k = Math.min(aw / (x1 - x0), ah / (y1 - y0));
    if (opts.minK && k < opts.minK) return false;
    k = Math.max(0.16, Math.min(this.KMAX, opts.maxK || 1.1, k));
    const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
    this.view = { x: left + aw / 2 - cx * k, y: top + ah / 2 - cy * k, k };
    this.applyTransform(true);
    return true;
  }
  fitJourney() {
    const j = this.state.activeJourney; if (!j) return;
    const ids = j.steps.map((x) => x.id), i = this.state.journeyStep;
    const all = ids.map((id) => this.byId[id]);
    const minK = this.state.isMobile ? 0.32 : 0.4;
    if (i === 0 && this.fitNodes(all, { minK })) return;
    const win = all.slice(0, Math.min(all.length, i + 2));
    if (this.fitNodes(win, { minK })) return;
    this.fitNodes(all.slice(Math.max(0, i - 1), Math.min(all.length, i + 2)));
  }
  centerOnNode(node: { x: number; y: number }, k: number, panelOpen: boolean) {
    const vp = this.viewportRef.current; if (!vp) return;
    const r = vp.getBoundingClientRect();
    const tx = (panelOpen && !this.state.isMobile) ? (r.width - 408) / 2 : r.width / 2;
    const ty = this.state.isMobile ? Math.max(110, (r.height - 230) * 0.45) : r.height * 0.46;
    this.view = { x: tx - node.x * k, y: ty - node.y * k, k };
    this.applyTransform(true);
  }
  zoom(f: number) {
    const vp = this.viewportRef.current; if (!vp) return;
    const r = vp.getBoundingClientRect(); const mx = r.width / 2, my = r.height / 2;
    const wx = (mx - this.view.x) / this.view.k, wy = (my - this.view.y) / this.view.k;
    const nk = Math.min(this.KMAX, Math.max(0.16, this.view.k * f));
    this.view = { x: mx - wx * nk, y: my - wy * nk, k: nk };
    this.applyTransform(true);
  }

  // ── hover (imperative) ───────────────────────────────────────────────────
  // Hover highlighting is applied via direct DOM writes, never through setState: a React re-render of the
  // full map repaints staggered over several frames and reads as a blink. Any real state change clears it.
  setState<K extends keyof State>(u: Pick<State, K> | State | null | ((p: Readonly<State>) => Pick<State, K> | State | null), cb?: () => void) {
    this._clearHoverDim();
    return super.setState(u as any, cb);
  }
  private _hoverEls() {
    const w = this.worldRef.current; if (!w) return null;
    if (!this._hEls || this._hEls.nodes.length !== this.GENRES.length) {
      this._hEls = { nodes: Array.prototype.slice.call(w.querySelectorAll('[data-node]')), gs: Array.prototype.slice.call(w.querySelectorAll('svg > g')) };
    }
    return this._hEls;
  }
  private _clearHoverDim() {
    this._hoverId = null;
    if (!this._hoverDimOn) return;
    this._hoverDimOn = false;
    const E = this._hEls; if (!E) return;
    E.nodes.forEach((el) => { el.style.opacity = ''; });
    E.gs.forEach((g) => { const c = g.children as HTMLCollectionOf<SVGElement>; if (c[0]) c[0].style.opacity = ''; if (c[2]) c[2].style.opacity = ''; });
  }
  private _applyHover(id: string | null) {
    const s = this.state;
    // hover dim only in neutral explore mode — selection, journeys, bridge and family focus own the highlight
    if (s.selectedNodeId || s.selectedEdgeId || s.bridgeMode || s.focusFam || s.playing || s.mode === 'journey') { this._clearHoverDim(); return; }
    const E = this._hoverEls(); if (!E) return;
    if (!id) { this._clearHoverDim(); return; }
    const rel = new Set([id]);
    this.EDGES.forEach((e) => { if (e.from === id) rel.add(e.to); if (e.to === id) rel.add(e.from); });
    this._hoverDimOn = true;
    this.GENRES.forEach((g, i) => { const el = E.nodes[i]; if (!el || g.year > s.year) return; el.style.opacity = rel.has(g.id) ? '1' : String(DIM_INACTIVE); });
    this.EDGES.forEach((e, i) => {
      const gEl = E.gs[i]; if (!gEl) return;
      const a = this.byId[e.from], b = this.byId[e.to];
      if (a.year > s.year || b.year > s.year) return;
      const act = (e.from === id || e.to === id), c = gEl.children as HTMLCollectionOf<SVGElement>;
      if (c[0]) c[0].style.opacity = act ? '0.95' : '0.05';
      if (c[2]) { if (act) { c[2].style.display = 'block'; c[2].style.opacity = '0.92'; } else { c[2].style.opacity = ''; } }
    });
  }
  setHover(id: string | null) {
    if (this.dragging || this.state.playing) return;
    clearTimeout(this._hoverT);
    if (id) {
      if (this._hoverId === id) return;
      if (this._hoverId) { this._hoverId = id; this._applyHover(id); }
      else this._hoverT = setTimeout(() => { if (!this.dragging) { this._hoverId = id; this._applyHover(id); } }, 90);
    } else { this._hoverT = setTimeout(() => { this._clearHoverDim(); }, 250); }
  }

  // ── actions ──────────────────────────────────────────────────────────────
  selectNode(id: string, viaLink: boolean) {
    clearInterval(this._t);
    this.setState((p) => {
      let bc = p.breadcrumb.slice();
      if (viaLink) { const i = bc.indexOf(id); bc = i >= 0 ? bc.slice(0, i + 1) : bc.concat([id]); } else bc = [id];
      return { selectedNodeId: id, selectedEdgeId: null, mode: 'explore', activeJourney: null, showPaths: false, showListen: false, breadcrumb: bc, year: Math.max(p.year, this.byId[id].year), playing: false, hoverNodeId: null, bridgeMode: false, focusFam: null, openTrait: null, sheetFull: false, query: '' } as State;
    });
    const node = this.byId[id];
    const k = this.state.isMobile ? Math.max(this.view.k, 0.6) : Math.max(this.view.k, 0.85);
    requestAnimationFrame(() => { this.centerOnNode(node, k, true); });
  }
  selectEdge(i: string) {
    clearInterval(this._t);
    this.setState({ selectedEdgeId: i, selectedNodeId: null, showPaths: false, showListen: false, playing: false, hoverNodeId: null, sheetFull: false });
    const e = this.EDGES.find((x) => x._i === i);
    if (e) { const a = this.byId[e.from], b = this.byId[e.to]; requestAnimationFrame(() => { this.centerOnNode({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }, Math.max(this.view.k, 0.8), true); }); }
  }
  closePanel() { this.setState({ selectedNodeId: null, selectedEdgeId: null, breadcrumb: [], showListen: false, showPaths: false, sheetFull: false }); }
  togglePlay() {
    if (this.state.playing) { clearInterval(this._t); this.setState({ playing: false }); return; }
    this._pos = this.state.year >= this.maxYear ? 0 : this.posFromYear(this.state.year);
    this.setState({ year: this.yearFromPos(this._pos), playing: true, selectedNodeId: null, selectedEdgeId: null });
    this._t = setInterval(() => {
      this._pos += 0.008;
      if (this._pos >= 1) { clearInterval(this._t); this.setState({ year: this.maxYear, playing: false }); return; }
      this.setState({ year: this.yearFromPos(this._pos) });
    }, 110);
  }
  startJourney(id: string) {
    clearInterval(this._t);
    const j = this.JOURNEYS.find((x) => x.id === id) || null;
    this.setState({ mode: 'journey', activeJourney: j, journeyStep: 0, selectedNodeId: null, selectedEdgeId: null, showPaths: false, showListen: false, breadcrumb: [], year: this.maxYear, playing: false, hoverNodeId: null, bridgeMode: false, focusFam: null });
    requestAnimationFrame(() => { requestAnimationFrame(() => { this.fitJourney(); }); });
  }
  journeyGo(delta: number) {
    this.setState((p) => { const ns = Math.max(0, Math.min(p.activeJourney!.steps.length - 1, p.journeyStep + delta)); return { journeyStep: ns } as State; }, () => { requestAnimationFrame(() => { this.fitJourney(); }); });
  }
  exitJourney() { this.setState({ mode: 'explore', activeJourney: null, journeyStep: 0 }); this.fitView(true); }
  toggleBridges() { clearInterval(this._t); this.setState((p) => ({ bridgeMode: !p.bridgeMode, focusFam: null, selectedNodeId: null, selectedEdgeId: null, breadcrumb: [] as string[], mode: 'explore' as const, activeJourney: null, showPaths: false, playing: false })); }
  focusFamily(k: FamilyId) {
    this._focusT = Date.now(); clearInterval(this._focusTick);
    this._focusTick = setInterval(() => { if (Date.now() - this._focusT > 3600 || !this.state.focusFam) { clearInterval(this._focusTick); } this.forceUpdate(); }, 90);
    this.setState((p) => ({ focusFam: p.focusFam === k ? null : k, bridgeMode: false, selectedNodeId: null, selectedEdgeId: null } as State), () => {
      const f = this.state.focusFam; if (!f) return;
      const yr = this.state.year, list = this.GENRES.filter((g) => g.fam === f && g.year <= yr);
      requestAnimationFrame(() => { this.fitNodes(list, { maxK: 0.95 }); });
    });
  }
  resetView() { clearInterval(this._t); this.setState({ year: this.maxYear, selectedNodeId: null, selectedEdgeId: null, breadcrumb: [], mode: 'explore', activeJourney: null, showPaths: false, showListen: false, hoverNodeId: null, playing: false, bridgeMode: false, focusFam: null, openTrait: null, query: '' }); this.fitView(true); }
  toggleImmersive() { this.setState((p) => ({ immersive: !p.immersive } as State), () => { this.fitView(true); }); }
  toggleFs() {
    const el: any = this.rootRef.current || document.documentElement, d: any = document;
    const canFs = !!(el.requestFullscreen || el.webkitRequestFullscreen);
    if (!canFs) { this.toggleImmersive(); return; }
    const fsEl = d.fullscreenElement || d.webkitFullscreenElement;
    try {
      const p = fsEl ? (d.exitFullscreen || d.webkitExitFullscreen).call(d) : (el.requestFullscreen || el.webkitRequestFullscreen).call(el);
      if (p && p.catch) { p.catch(() => { this.toggleImmersive(); }); }
    } catch { this.toggleImmersive(); }
  }
  toggleTrait(key: string) { this.setState((p) => ({ openTrait: p.openTrait === key ? null : key } as State)); }
  doFit() { const vp = this.viewportRef.current; if (!vp) return false; const r = vp.getBoundingClientRect(); if (r.width < 60 || r.height < 60) return false; this.fitView(false); this._fitDone = true; return true; }

  // ── lifecycle: pointer / wheel / gesture plumbing ────────────────────────
  componentDidMount() {
    this.ensureData();
    const vp = this.viewportRef.current!;
    this._onDown = (e) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      if ((e.target as Element).closest('[data-ui]')) return;
      this._stopGlide(); this._suppressClick = false;
      this._ptrs[e.pointerId] = { x: e.clientX, y: e.clientY };
      const ids = Object.keys(this._ptrs);
      if (ids.length >= 2) { try { vp.setPointerCapture(e.pointerId); } catch { /* ignore */ } }
      if (ids.length === 1) {
        this.dragging = true; this._moved = false; this._start = { x: e.clientX, y: e.clientY, vx: this.view.x, vy: this.view.y };
        this._vel = { x: 0, y: 0 }; this._last = { x: e.clientX, y: e.clientY, t: (e.timeStamp || performance.now()) };
        vp.style.cursor = 'grabbing'; clearTimeout(this._hoverT); this._clearHoverDim();
      } else if (ids.length >= 2) { this.dragging = false; this._pinch = null; this._moved = true; this._suppressClick = true; this._vel = { x: 0, y: 0 }; }
    };
    // a pan that started on a node must not fire that node's click
    this._onClickCapture = (e) => {
      if (this._suppressClick && !(e.target as Element).closest('[data-ui]')) { this._suppressClick = false; e.stopPropagation(); e.preventDefault(); }
    };
    vp.addEventListener('click', this._onClickCapture, true);
    this._onMove = (e) => {
      if (this._ptrs[e.pointerId]) this._ptrs[e.pointerId] = { x: e.clientX, y: e.clientY };
      const ids = Object.keys(this._ptrs);
      if (ids.length >= 2) {
        const a = this._ptrs[ids[0]], b = this._ptrs[ids[1]];
        const dist = Math.hypot(a.x - b.x, a.y - b.y); if (dist < 1) return;
        const r = vp.getBoundingClientRect();
        const midX = (a.x + b.x) / 2 - r.left, midY = (a.y + b.y) / 2 - r.top;
        if (!this._pinch) { this._pinch = { dist, k: this.view.k, vx: this.view.x, vy: this.view.y }; this._setPerf(true); return; }
        const nk = Math.min(this.KMAX, Math.max(0.12, this._pinch.k * (dist / this._pinch.dist)));
        const wx = (midX - this._pinch.vx) / this._pinch.k, wy = (midY - this._pinch.vy) / this._pinch.k;
        this.view = { x: midX - wx * nk, y: midY - wy * nk, k: nk }; this.applyTransform(false);
        return;
      }
      if (!this.dragging) return;
      const dx = e.clientX - this._start.x, dy = e.clientY - this._start.y;
      const thresh = e.pointerType === 'mouse' ? 4 : 7;
      if (!this._moved && Math.abs(dx) + Math.abs(dy) > thresh) {
        this._moved = true; this._suppressClick = true;
        if (e.pointerType !== 'mouse') this._setPerf(true);
        const w0 = this.worldRef.current; if (w0) w0.style.pointerEvents = 'none';
      }
      if (this._moved) {
        const t = (e.timeStamp || performance.now()), L = this._last || { x: e.clientX, y: e.clientY, t }, dt = Math.max(1, t - L.t);
        const vx = (e.clientX - L.x) / dt, vy = (e.clientY - L.y) / dt;
        this._vel = { x: this._vel.x * 0.7 + vx * 0.3, y: this._vel.y * 0.7 + vy * 0.3 };
        this._last = { x: e.clientX, y: e.clientY, t };
      }
      this.view.x = this._start.vx + dx; this.view.y = this._start.vy + dy; this.applyTransform(false);
    };
    this._onUp = (e) => {
      delete this._ptrs[e.pointerId];
      const ids = Object.keys(this._ptrs);
      if (ids.length < 2) this._pinch = null;
      if (ids.length === 1) { const rem = this._ptrs[ids[0]]; this.dragging = true; this._moved = true; this._start = { x: rem.x, y: rem.y, vx: this.view.x, vy: this.view.y }; this._vel = { x: 0, y: 0 }; this._last = { x: rem.x, y: rem.y, t: performance.now() }; return; }
      if (ids.length === 0 && this.dragging) {
        this.dragging = false; vp.style.cursor = 'grab';
        const w1 = this.worldRef.current; if (w1) w1.style.pointerEvents = '';
        if (this._moved) { this._startGlide(); }
        if (!this._glide) this._setPerf(false);
        const s = this.state;
        if (!this._moved && s.mode !== 'journey') { if (s.selectedNodeId || s.selectedEdgeId || s.showListen || s.showPaths || s.focusFam) { this.setState({ selectedNodeId: null, selectedEdgeId: null, breadcrumb: [], showListen: false, showPaths: false, focusFam: null }); } }
      }
    };
    this._onWheel = (e) => {
      e.preventDefault(); this._stopGlide();
      // Trackpad vs wheel: trackpads emit 2D/fractional pixel deltas where wheelDeltaY === -3*deltaY; wheels/trackballs don't.
      const now = Date.now(); const we = e as WheelEvent & { wheelDeltaY?: number };
      const padSig = e.deltaMode === 0 && !e.ctrlKey && ((e.deltaX !== 0 && !e.shiftKey) || (we.wheelDeltaY !== undefined && we.wheelDeltaY !== 0 && we.wheelDeltaY === -3 * e.deltaY) || (we.wheelDeltaY === undefined && !Number.isInteger(e.deltaY)));
      if (padSig) this._padUntil = now + 400; else if (this._padUntil && now < this._padUntil && e.deltaMode === 0) this._padUntil = now + 400;
      const isPad = !!(this._padUntil && now < this._padUntil);
      const notched = !isPad && !e.shiftKey;
      const isZoom = e.ctrlKey || e.metaKey || notched;
      if (!isZoom) {
        if (e.shiftKey && e.deltaX === 0) { const m0 = e.deltaMode === 1 ? 16 : 1; this.view.x -= e.deltaY * m0; this.applyTransform(false); return; }
        const m = e.deltaMode === 1 ? 16 : 1; this.view.x -= e.deltaX * m; this.view.y -= e.deltaY * m; this.applyTransform(false); return;
      }
      const r = vp.getBoundingClientRect(); const mx = e.clientX - r.left, my = e.clientY - r.top;
      const wx = (mx - this.view.x) / this.view.k, wy = (my - this.view.y) / this.view.k;
      const dy = e.deltaY * (e.deltaMode === 1 ? 33 : e.deltaMode === 2 ? 800 : 1);
      const f = notched ? Math.exp(-Math.max(-150, Math.min(150, dy)) * 0.0012) : Math.exp(-e.deltaY * 0.012);
      const nk = Math.min(this.KMAX, Math.max(0.16, this.view.k * f));
      this.view = { x: mx - wx * nk, y: my - wy * nk, k: nk }; this.applyTransform(false);
    };
    vp.addEventListener('pointerdown', this._onDown);
    window.addEventListener('pointermove', this._onMove);
    window.addEventListener('pointerup', this._onUp);
    this._onCancel = (e) => {
      delete this._ptrs[e.pointerId]; this._pinch = null;
      const ids = Object.keys(this._ptrs);
      if (ids.length === 1) { const rem = this._ptrs[ids[0]]; this.dragging = true; this._moved = true; this._start = { x: rem.x, y: rem.y, vx: this.view.x, vy: this.view.y }; }
      else if (ids.length === 0) { this.dragging = false; this._moved = true; vp.style.cursor = 'grab'; const w2 = this.worldRef.current; if (w2) w2.style.pointerEvents = ''; this._setPerf(false); }
    };
    window.addEventListener('pointercancel', this._onCancel);
    vp.addEventListener('wheel', this._onWheel, { passive: false });
    // iOS Safari: block native page pinch-zoom (it ignores user-scalable=no) so our pointer pinch owns the gesture
    this._onGesture = (e) => { e.preventDefault(); };
    ['gesturestart', 'gesturechange', 'gestureend'].forEach((n) => { document.addEventListener(n, this._onGesture, { passive: false }); });
    // iOS: block long-press context menu / callout on the map surface
    this._onCtx = (e) => { if (!(e.target as Element).closest('.gx-panel')) e.preventDefault(); };
    vp.addEventListener('contextmenu', this._onCtx);
    // belt-and-braces: kill Safari's scaling touchmove inside the viewport
    this._onTm = (e) => { const te = e as TouchEvent & { scale?: number }; if (te.scale !== undefined && te.scale !== 1) e.preventDefault(); };
    vp.addEventListener('touchmove', this._onTm, { passive: false });

    this._onResize = () => { const m = window.innerWidth <= 720; if (m !== this.state.isMobile) this.setState({ isMobile: m }); requestAnimationFrame(() => { this.fitView(false); }); };
    window.addEventListener('resize', this._onResize);
    this._onFs = () => { const d: any = document; this.setState({ isFs: !!(d.fullscreenElement || d.webkitFullscreenElement) }); requestAnimationFrame(() => { this.fitView(false); }); };
    document.addEventListener('fullscreenchange', this._onFs);
    document.addEventListener('webkitfullscreenchange', this._onFs);

    this._fitDone = false;
    requestAnimationFrame(() => { this.doFit(); });
    setTimeout(() => { this.doFit(); }, 120);
    setTimeout(() => { this.doFit(); }, 360);
  }

  componentDidUpdate() {
    if (this._ready && !this._fitDone) { this.doFit(); return; }
    const w = this.worldRef.current;
    if (w && !w.style.transform) { this.applyTransform(false); }
  }

  componentWillUnmount() {
    clearInterval(this._t); clearTimeout(this._hoverT); this._stopGlide(); clearInterval(this._focusTick);
    const vp = this.viewportRef.current;
    if (vp) vp.removeEventListener('click', this._onClickCapture, true);
    window.removeEventListener('pointermove', this._onMove);
    window.removeEventListener('pointerup', this._onUp);
    window.removeEventListener('pointercancel', this._onCancel);
    window.removeEventListener('resize', this._onResize);
    document.removeEventListener('fullscreenchange', this._onFs);
    document.removeEventListener('webkitfullscreenchange', this._onFs);
    ['gesturestart', 'gesturechange', 'gestureend'].forEach((n) => { document.removeEventListener(n, this._onGesture); });
    if (vp) { vp.removeEventListener('pointerdown', this._onDown); vp.removeEventListener('wheel', this._onWheel); vp.removeEventListener('contextmenu', this._onCtx); vp.removeEventListener('touchmove', this._onTm); }
  }

  // ── derived helpers for the panel ────────────────────────────────────────
  jEdge(e: GEdge) {
    const st = this.state.activeJourney; if (!st) return false;
    const steps = st.steps;
    for (let i = 0; i < this.state.journeyStep; i++) { const f = steps[i].id, t = steps[i + 1].id; if ((e.from === f && e.to === t) || (e.from === t && e.to === f)) return true; }
    return false;
  }
  dot(fam: string): React.CSSProperties { return { width: '9px', height: '9px', borderRadius: '50%', background: this.hex(fam), flex: '0 0 auto', boxShadow: '0 0 10px ' + this.rgba(fam, 0.6) }; }

  // ── render ───────────────────────────────────────────────────────────────
  render() {
    const ok = this.ensureData();
    const s = this.state;
    const year = s.year;
    const inJourney = s.mode === 'journey' && !!s.activeJourney;
    const active = s.selectedNodeId || s.hoverNodeId;
    let rel: Set<string> | null = null;
    if (active && ok) { rel = new Set([active]); this.EDGES.forEach((e) => { if (e.from === active) rel!.add(e.to); if (e.to === active) rel!.add(e.from); }); }
    let jset: Set<string> | null = null, curJ: string | null = null;
    if (inJourney) { jset = new Set(s.activeJourney!.steps.map((x) => x.id)); curJ = s.activeJourney!.steps[s.journeyStep].id; }
    let bridgeSet: Set<string> | null = null;
    if (s.bridgeMode && ok) { bridgeSet = new Set(); this.EDGES.forEach((e) => { if (e.rel === 'bridge') { bridgeSet!.add(e.from); bridgeSet!.add(e.to); } }); }

    // Family focus: light the family's internal lineage in chronological order instead of all at once.
    const famOnly = !inJourney && !s.bridgeMode && !active && s.focusFam;
    const famRank: Record<string, number> = {}; let famStep = 0, famElapsed = 0;
    if (famOnly && ok) {
      const intra = this.EDGES.filter((e) => { const a = this.byId[e.from], b = this.byId[e.to]; return a.fam === s.focusFam && b.fam === s.focusFam && a.year <= year && b.year <= year && this.backbone[e._i]; });
      intra.sort((x, y) => Math.max(this.byId[x.from].year, this.byId[x.to].year) - Math.max(this.byId[y.from].year, this.byId[y.to].year));
      intra.forEach((e, i) => { famRank[e._i] = i; });
      famStep = Math.min(220, 3200 / Math.max(1, intra.length));
      famElapsed = Date.now() - (this._focusT || 0);
    }

    const curSvc = SVCS.find((v) => v.k === s.svc) || SVCS[0];
    const visCount = this.GENRES.filter((g) => g.year <= year).length;
    const sel = s.selectedNodeId ? this.byId[s.selectedNodeId] : null;
    const selEdge = s.selectedEdgeId ? this.EDGES.find((x) => x._i === s.selectedEdgeId) : null;
    const rootClass = 'gx-root' + (s.immersive ? ' gx-immersive' : '') + ((s.isMobile && (s.selectedNodeId || s.selectedEdgeId)) ? ' gx-sheet' : '') + ((s.isMobile && (s.selectedNodeId || s.selectedEdgeId) && !s.sheetFull) ? ' gx-peek' : '');
    const subtitle = s.bridgeMode ? 'Cross-Family Bridge Mode' : (s.focusFam ? this.FAM[s.focusFam].label : 'Genre Evolution · 380 BCE — Now');
    const q = s.query.trim().toLowerCase();
    const rs = this.rootSpan;
    const mobileSheet = s.isMobile && (!!s.selectedNodeId || !!s.selectedEdgeId);
    const sheetHint = s.sheetFull ? 'Collapse — see the map' : 'Tap for full details';

    // ── search ──
    let sres: { g: GNode; sc: number; via: string }[] = [], noRes = false;
    if (ok && q) {
      const scored: { g: GNode; sc: number; via: string }[] = []; const seen: Record<string, { g: GNode; sc: number; via: string }> = {};
      const push = (g: GNode, sc: number, via?: string) => { const cur = seen[g.id]; if (cur) { if (sc < cur.sc) { cur.sc = sc; cur.via = via || ''; } return; } const it = { g, sc, via: via || '' }; seen[g.id] = it; scored.push(it); };
      this.GENRES.forEach((g) => {
        const n = g.name.toLowerCase(), aka = (g.aka || '').toLowerCase();
        if (n.indexOf(q) === 0) push(g, 0);
        else if (aka && aka.indexOf(q) === 0) push(g, 0.2, g.aka);
        else if (n.indexOf(q) >= 0) push(g, 1);
        else if (aka && aka.indexOf(q) >= 0) push(g, 1.2, g.aka);
        else if (this.FAM[g.fam].label.toLowerCase().indexOf(q) >= 0) push(g, 4);
      });
      if (q.length >= 2) {
        Object.keys(this.artistMap).forEach((an) => {
          const pos = an.indexOf(q); if (pos < 0) return;
          const rec = this.artistMap[an];
          const base = pos === 0 ? 2 : (an.indexOf(' ' + q) >= 0 ? 2.3 : 2.6); // prefix > word start > substring
          rec.ids.forEach((gid, i) => { push(this.byId[gid], base + i * 0.01, rec.name); }); // i preserves specific-first order
        });
      }
      scored.sort((a, b) => a.sc - b.sc || a.g.year - b.g.year);
      sres = scored.slice(0, 10);
      noRes = scored.length === 0;
    }

    const svcPicker = (
      <>
        {SVCS.map((v) => { const on = s.svc === v.k; return (
          <button key={v.k} onClick={() => this.setSvc(v.k)} style={{ fontFamily: "'Schibsted Grotesk'", fontSize: '11px', padding: '5px 11px', borderRadius: '999px', cursor: 'pointer', transition: 'background .25s, color .25s', background: on ? v.c : 'rgba(255,255,255,.04)', color: on ? '#0a0c10' : '#aab0b8', border: '1px solid ' + (on ? v.c : 'rgba(255,255,255,.12)'), fontWeight: on ? 600 : 400 }}>{v.n}</button>
        ); })}
      </>
    );

    const linkRow = (e: GEdge, otherId: string, key: string) => {
      const o = this.byId[otherId];
      return (
        <div key={key} style={css('margin-bottom:13px;')}>
          <div style={css('display:flex;align-items:center;gap:9px;cursor:pointer;')} onClick={() => this.selectNode(otherId, true)}>
            <span style={this.dot(o.fam)}></span>
            <span style={css('flex:1;font-size:14.5px;color:#e7eaee;font-weight:500;')}>{o.name}</span>
            <span style={css("font-family:'JetBrains Mono',monospace;font-size:10px;color:#7b828d;")}>{Math.round(e.strength * 100)}%</span>
          </div>
          <div style={css('padding-left:18px;margin-top:6px;height:3px;background:rgba(255,255,255,.07);border-radius:2px;overflow:hidden;')}><div style={{ width: Math.round(e.strength * 100) + '%', height: '100%', background: this.hex(o.fam), borderRadius: '2px', transition: 'width .4s' }}></div></div>
          <div onClick={() => this.selectEdge(e._i)} className="hv-mid" style={css('padding-left:18px;margin-top:6px;font-size:11.5px;color:#868d97;cursor:pointer;')}>{REL_LABEL[e.rel]} ↗</div>
        </div>
      );
    };

    let preds: React.ReactNode[] = [], descs: React.ReactNode[] = [], cross: React.ReactNode[] = [];
    if (sel) {
      this.EDGES.forEach((e) => {
        if (e.rel === 'scene' || e.rel === 'bridge' || e.rel === 'revival') {
          const otherId = e.from === sel.id ? e.to : e.to === sel.id ? e.from : null;
          if (!otherId) return;
          const o = this.byId[otherId];
          cross.push(
            <div key={e._i} onClick={() => this.selectEdge(e._i)} className="hv-bg03" style={css('margin-bottom:10px;padding:11px 12px;border:1px dashed rgba(255,255,255,.12);border-radius:11px;cursor:pointer;')}>
              <div style={css('display:flex;align-items:center;gap:8px;')}>
                <span style={this.dot(o.fam)}></span>
                <span style={css('flex:1;font-size:14px;color:#e7eaee;font-weight:500;')} onClick={(ev) => { ev.stopPropagation(); this.selectNode(otherId, true); }}>{o.name}</span>
                <span style={{ fontFamily: MONO, fontSize: '9px', letterSpacing: '.06em', color: this.hex(o.fam), textTransform: 'uppercase' }}>{REL_LABEL[e.rel]}</span>
              </div>
              <div style={css('font-size:12px;color:#868d97;line-height:1.45;margin-top:6px;')}>{e.note}</div>
            </div>,
          );
        } else {
          if (e.to === sel.id) preds.push(linkRow(e, e.from, e._i));
          else if (e.from === sel.id) descs.push(linkRow(e, e.to, e._i));
        }
      });
    }

    const plq = sel ? (s.svc === 'spotify' ? sel.name + ' essential' : s.svc === 'youtube' ? sel.name + ' music mix' : sel.name) : '';

    return (
      <div ref={this.rootRef} className={rootClass} style={css('position:fixed;inset:0;overflow:hidden;background:radial-gradient(125% 95% at 72% -5%, #11151c 0%, #0a0c10 52%, #07080b 100%);color:#e7eaee;')}>

        <div ref={this.viewportRef} style={css('position:absolute;inset:0;cursor:grab;overflow:hidden;touch-action:none;')}>
          <div ref={this.worldRef} style={{ position: 'absolute', left: 0, top: 0, width: this.WW + 'px', height: this.WH + 'px', transformOrigin: '0 0', willChange: 'transform', backfaceVisibility: 'hidden' }}>

            {ok && this.famOrder.slice(0, -1).map((k, di) => {
              const y = (this.FAM[k].y + this.FAM[this.famOrder[di + 1]].y) / 2;
              return <div key={'dv' + k} style={{ position: 'absolute', left: '-620px', top: y + 'px', width: (this.WW + 620) + 'px', height: '1px', background: 'linear-gradient(90deg,transparent,rgba(255,255,255,.045),transparent)' }}></div>;
            })}

            <div style={{ position: 'absolute', left: (this.RX - 170) + 'px', top: rs.y0 + 'px', width: '340px', height: (rs.y1 - rs.y0) + 'px', borderRadius: '26px', background: 'linear-gradient(180deg,rgba(255,255,255,.022),rgba(255,255,255,.012))', border: '1px solid rgba(255,255,255,.05)' }}></div>
            <div style={{ position: 'absolute', left: this.RX + 'px', top: (rs.y0 + 26) + 'px', transform: 'translateX(-50%)', textAlign: 'center', fontFamily: MONO, letterSpacing: '.16em', color: '#6b727d', width: '290px', lineHeight: 1.6, textWrap: 'balance', textTransform: 'uppercase' } as React.CSSProperties}>
              <div style={css('font-size:12.5px;')}>Root · antiquity → 1865</div>
              <div style={css('font-size:9.5px;color:#565d68;margin-top:5px;letter-spacing:.12em;')}>the Western art-music stem · read downward</div>
            </div>
            <div style={{ position: 'absolute', left: '700px', top: 0, width: '1px', height: this.WH + 'px', background: 'linear-gradient(180deg,transparent 0,rgba(255,255,255,.11) 2%,rgba(255,255,255,.11) 98%,transparent)' }}></div>
            <div style={css("position:absolute;left:700px;top:52px;transform:translateX(-50%);text-align:center;font-family:'JetBrains Mono',monospace;letter-spacing:.2em;color:#6b7280;white-space:nowrap;text-transform:uppercase;")}>
              <div style={css('font-size:12.5px;')}>1865 · recorded era ▶</div>
              <div style={css('font-size:9.5px;color:#4d545f;margin-top:5px;')}>true scale, stretched toward now</div>
            </div>
            {ok && [1900, 1925, 1950, 1975, 2000, 2026].map((y) => { const x = this.xFromYear(y); return (
              <React.Fragment key={'tk' + y}>
                <div style={{ position: 'absolute', left: x + 'px', top: 0, width: '1px', height: this.WH + 'px', background: 'linear-gradient(180deg,transparent 0,rgba(255,255,255,.035) 2%,rgba(255,255,255,.035) 98%,transparent)' }}></div>
                <div style={{ position: 'absolute', left: x + 'px', top: '56px', transform: 'translateX(-50%)', fontFamily: MONO, fontSize: '11px', letterSpacing: '.18em', color: '#4d545f' }}>{y === 2026 ? 'NOW' : '' + y}</div>
              </React.Fragment>
            ); })}
            {ok && this.famOrder.map((k) => { const fam = this.FAM[k]; return (
              <div key={'band' + k} data-band="" onClick={() => this.focusFamily(k)} style={{ position: 'absolute', left: this.LBX + 'px', top: fam.y + 'px', transform: 'translate(-50%,-50%) rotate(-90deg)', transformOrigin: 'center', whiteSpace: 'nowrap', fontFamily: SERIF, fontSize: '13px', letterSpacing: '.12em', color: s.focusFam === k ? this.rgba(k, 1) : this.rgba(k, 0.62), cursor: 'pointer', pointerEvents: 'auto', transition: 'color .4s' }}>{fam.short.toUpperCase()}</div>
            ); })}

            <svg width={this.WW} height={this.WH} style={css('position:absolute;left:0;top:0;overflow:visible;pointer-events:none;')}>
              {ok && this.EDGES.map((e) => {
                const a = this.byId[e.from], b = this.byId[e.to];
                const vis = a.year <= year && b.year <= year;
                let act = false, side = false;
                if (inJourney) act = this.jEdge(e);
                else if (s.bridgeMode) act = (e.rel === 'bridge');
                else if (active) act = (e.from === active || e.to === active);
                else if (s.focusFam) { act = (e._i in famRank); side = !act && (a.fam === s.focusFam || b.fam === s.focusFam); }
                if (active && s.focusFam && !act && (a.fam === s.focusFam && b.fam === s.focusFam)) side = true;
                const anyMode = inJourney || s.bridgeMode || active || s.focusFam;
                const dim = anyMode ? !act : false;
                const selE = e._i === s.selectedEdgeId, hot = act || selE;
                let op = !vis ? 0 : (side ? ((a.fam === b.fam) ? 0.16 : 0.07) : (dim ? 0.04 : (hot ? 0.95 : (e.rel === 'bridge' ? 0.12 : 0.08))));
                const lop = !vis ? 0 : ((hot && !famOnly) || selE ? 0.92 : (ALWAYS_LABELS && !dim ? 0.38 : 0));
                if (famOnly && act && famElapsed < famRank[e._i] * famStep) { op = vis ? 0.04 : 0; }
                const w = (1 + e.strength * 2.7) + (e.rel === 'bridge' ? 0.6 : 0) + (hot ? 1.2 : 0);
                const color = this.hex(a.fam);
                return (
                  <g key={e._i}>
                    <path d={e._d} fill="none" stroke={color} strokeWidth={w} strokeDasharray={this.dashFor(e.rel)} strokeLinecap="round" opacity={op} style={{ transition: 'opacity .45s ease', pointerEvents: 'none' }}></path>
                    <path d={e._d} fill="none" stroke="transparent" strokeWidth={16} style={{ pointerEvents: 'stroke', cursor: 'pointer' }} onClick={() => this.selectEdge(e._i)}></path>
                    <text x={e._mx} y={e._my} fill={color} fontSize={12.5} textAnchor="middle" opacity={lop} style={{ display: lop > 0 ? 'block' : 'none', pointerEvents: 'none', fontFamily: MONO, letterSpacing: '.05em' }}>{REL_LABEL[e.rel]}</text>
                  </g>
                );
              })}
            </svg>

            {ok && this.GENRES.map((g) => {
              const vis = g.year <= year;
              let dim: boolean;
              if (inJourney) dim = !jset!.has(g.id);
              else if (s.bridgeMode) dim = !(g.role === 'hybrid' || bridgeSet!.has(g.id));
              else if (active) dim = !rel!.has(g.id);
              else if (s.focusFam) dim = g.fam !== s.focusFam;
              else dim = false;
              const isSel = g.id === s.selectedNodeId, cur = g.id === curJ, glow = isSel || cur;
              const r = this.nodeR(g);
              const scale = !vis ? 0.4 : 1;
              const op = !vis ? 0 : (dim ? ((active && s.focusFam && g.fam === s.focusFam) ? 0.42 : DIM_INACTIVE) : 1);
              const hx = this.hex(g.fam);
              let bg: string, border: string, boxShadow: string;
              if (g.role === 'hybrid' && g.fam2) {
                bg = 'linear-gradient(135deg, ' + this.rgba(g.fam, glow ? 0.62 : 0.5) + ', ' + this.rgba(g.fam2, glow ? 0.6 : 0.46) + ')';
                border = '1px solid ' + this.rgba(g.fam2, glow ? 0.95 : 0.5);
              } else if (g.role === 'revival') {
                bg = 'radial-gradient(circle at 50% 33%, ' + this.rgba(g.fam, glow ? 0.4 : 0.22) + ', ' + this.rgba(g.fam, 0.05) + ' 78%)';
                border = '1.5px dashed ' + this.rgba(g.fam, glow ? 0.95 : 0.6);
              } else {
                bg = 'radial-gradient(circle at 50% 33%, ' + this.rgba(g.fam, glow ? 0.64 : 0.46) + ', ' + this.rgba(g.fam, 0.06) + ' 76%)';
                border = '1px solid ' + this.rgba(g.fam, glow ? 0.95 : 0.45);
              }
              bg += ', #0d1015';
              if (g.role === 'foundational') boxShadow = (glow ? '0 0 0 4px ' + this.rgba(g.fam, 0.12) + ', ' : '0 0 0 3px ' + this.rgba(g.fam, 0.07) + ', ') + '0 0 ' + (glow ? 40 : 12) + 'px ' + this.rgba(g.fam, glow ? 0.5 : 0.24);
              else boxShadow = '0 0 ' + (glow ? 36 : 9) + 'px ' + this.rgba(g.fam, glow ? 0.5 : 0.18);
              const ringOn = g.role === 'rising' || g.role === 'revival';
              return (
                <div key={g.id} data-node="" onClick={() => this.selectNode(g.id, false)} style={{ position: 'absolute', left: g.x + 'px', top: g.y + 'px', transform: 'translate(-50%,-50%) scale(' + scale + ')', opacity: op, pointerEvents: vis ? 'auto' : 'none', transition: 'opacity .22s ease, transform .35s cubic-bezier(.22,.61,.36,1)', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', width: (2 * r + 64) + 'px', zIndex: isSel ? 7 : (cur ? 6 : 2) }}>
                  <div onMouseEnter={() => this.setHover(g.id)} onMouseLeave={() => this.setHover(null)} style={{ position: 'relative', width: (2 * r) + 'px', height: (2 * r) + 'px', borderRadius: '50%', background: bg, border, boxShadow, transition: 'box-shadow .3s ease, border-color .3s ease' }}>
                    <div style={{ position: 'absolute', inset: '-7px', borderRadius: '50%', border: (g.role === 'revival' ? '1.5px dotted ' : '2px solid ') + hx, opacity: ringOn ? (g.role === 'rising' ? 0.9 : 0.55) : 0, display: ringOn ? 'block' : 'none', animation: g.role === 'rising' ? 'gxpulse 2.6s ease-out infinite' : 'none', pointerEvents: 'none' }}></div>
                  </div>
                  <div style={{ textAlign: 'center', transition: 'opacity .4s', maxWidth: (2 * r + 150) + 'px', background: 'rgba(11,13,17,.84)', padding: '2px 6px 3px', borderRadius: '6px' }}>
                    <div style={{ fontSize: (isSel ? 14.5 : 12.5) + 'px', fontWeight: 600, color: isSel ? '#ffffff' : (dim ? '#5a626d' : '#e7eaee'), letterSpacing: '.005em', lineHeight: 1.12, transition: 'color .4s, font-size .3s', textShadow: '0 1px 4px rgba(0,0,0,.7)' }}>{g.name}</div>
                    <div style={{ fontFamily: MONO, fontSize: '9.5px', color: g.role === 'rising' ? hx : (dim ? '#454c56' : '#7b828d'), letterSpacing: '.06em', marginTop: '2px', transition: 'color .4s' }}>{g.role === 'rising' ? (this.fmtYear(g.year) + ' · rising') : this.fmtYear(g.year)}</div>
                  </div>
                </div>
              );
            })}

          </div>
        </div>

        {/* title */}
        <div data-ui="" className="gx-title-wrap" style={css('position:absolute;top:22px;left:28px;z-index:20;pointer-events:none;')}>
          <div className="gx-title-main" style={css("font-family:'Spectral',serif;font-size:22px;color:#f2f4f6;letter-spacing:.005em;")}>The Music Genre Lineage Atlas</div>
          <div className="gx-title-sub" style={css("font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.22em;color:#6b7280;text-transform:uppercase;margin-top:5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;")}>{subtitle}</div>
        </div>

        {/* top bar: search + mode buttons */}
        <div data-ui="" className="gx-top" style={css('position:absolute;top:20px;right:26px;z-index:24;display:flex;gap:10px;')}>
          <div className="gx-search" style={css('position:relative;')}>
            <input value={s.query} onChange={(e) => this.setState({ query: e.target.value })} placeholder="Search genres or artists…" aria-label="Search genres or artists" style={css("font-family:'Schibsted Grotesk';font-size:12.5px;padding:9px 30px 9px 13px;width:196px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.13);color:#eef0f3;border-radius:9px;outline:none;")} />
            {q.length > 0 && (
              <>
                <button onClick={() => this.setState({ query: '' })} className="hv-white" aria-label="Clear search" style={css('position:absolute;right:6px;top:50%;transform:translateY(-50%);background:none;border:none;color:#8a919b;font-size:12px;cursor:pointer;line-height:1;padding:4px;')}>✕</button>
                <div className="gxscroll gx-srch-dd" style={css('position:absolute;top:44px;right:0;width:min(302px,88vw);max-height:56vh;overflow-y:auto;background:#13161c;border:1px solid rgba(255,255,255,.12);border-radius:13px;padding:7px;box-shadow:0 24px 70px rgba(0,0,0,.6);z-index:40;')}>
                  {sres.map((x) => { const g = x.g; return (
                    <button key={g.id} onClick={() => this.selectNode(g.id, false)} className="hv-bg06" style={css('display:flex;align-items:center;gap:10px;width:100%;text-align:left;background:none;border:none;border-radius:9px;padding:9px 10px;cursor:pointer;')}>
                      <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: this.hex(g.fam), boxShadow: '0 0 8px ' + this.rgba(g.fam, 0.6), flex: '0 0 auto' }}></span>
                      <span style={css('flex:1;min-width:0;')}>
                        <span style={css("display:block;font-family:'Schibsted Grotesk';font-size:13.5px;color:#eef0f3;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;")}>{g.name}</span>
                        <span style={css("display:block;font-family:'JetBrains Mono',monospace;font-size:9.5px;color:#7b828d;margin-top:2px;letter-spacing:.04em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;")}>{(x.via ? x.via + ' · ' : '') + this.fmtYear(g.year) + ' · ' + this.FAM[g.fam].short}</span>
                      </span>
                    </button>
                  ); })}
                  {noRes && <div style={css('padding:12px 10px;font-size:12.5px;color:#8a919b;')}>No genres or artists match "{s.query}"</div>}
                </div>
              </>
            )}
          </div>
          <button onClick={() => this.setState((p) => ({ showPaths: !p.showPaths } as State))} className="hv-bg10" style={btnStyle}><span style={{ opacity: .7 }}>◇</span>{s.isMobile ? '' : ' Guided Paths'}</button>
          <button onClick={() => this.toggleBridges()} className={s.bridgeMode ? '' : 'hv-bg10'} style={s.bridgeMode ? btnOnStyle : btnStyle}><span style={{ opacity: .8 }}>⤬</span>{s.isMobile ? '' : ' Bridges'}</button>
          <button onClick={() => this.resetView()} className="hv-bg10" style={css("font-family:'Schibsted Grotesk';font-size:12.5px;padding:9px 15px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.13);color:#dbe0e6;border-radius:9px;cursor:pointer;")}>{s.isMobile ? '↺' : 'Reset'}</button>
        </div>

        {/* guided paths list */}
        {s.showPaths && (
          <div data-ui="" className="gxscroll" style={css('position:absolute;top:68px;right:26px;width:318px;max-height:74vh;overflow-y:auto;z-index:30;background:#13161c;border:1px solid rgba(255,255,255,.1);border-radius:16px;padding:16px;box-shadow:0 24px 70px rgba(0,0,0,.55);')}>
            <div style={css("font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.2em;color:#6b7280;text-transform:uppercase;margin-bottom:12px;")}>Curated Journeys</div>
            {this.JOURNEYS.map((j) => (
              <button key={j.id} onClick={() => this.startJourney(j.id)} className="hv-bg07" style={css('display:block;width:100%;text-align:left;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);border-radius:11px;padding:13px 14px;margin-bottom:9px;cursor:pointer;')}>
                <div style={css("font-family:'Spectral',serif;font-size:15.5px;color:#f2f4f6;margin-bottom:3px;")}>{j.title}</div>
                <div style={css('font-size:12px;color:#8a919b;line-height:1.4;')}>{j.subtitle}</div>
              </button>
            ))}
          </div>
        )}

        {/* breadcrumb */}
        {!inJourney && !s.bridgeMode && s.breadcrumb.length > 0 && (
          <div data-ui="" className="gx-crumb" style={css('position:absolute;top:26px;left:50%;transform:translateX(-50%);z-index:18;display:flex;align-items:center;gap:6px;background:rgba(15,17,22,.94);border:1px solid rgba(255,255,255,.08);border-radius:999px;padding:7px 15px;max-width:54vw;overflow:hidden;')}>
            <span style={css("font-family:'JetBrains Mono',monospace;font-size:9.5px;letter-spacing:.18em;color:#5a626d;margin-right:3px;")}>LINEAGE</span>
            {s.breadcrumb.map((id, i) => (
              <React.Fragment key={id + i}>
                <span style={css('color:#4a515c;font-size:13px;')}>{i === 0 ? '' : '›'}</span>
                <button onClick={() => this.selectNode(id, true)} style={{ background: id === s.selectedNodeId ? 'rgba(255,255,255,.1)' : 'transparent', border: 'none', color: id === s.selectedNodeId ? '#f2f4f6' : '#aab0b8', fontSize: '13px', fontFamily: "'Schibsted Grotesk'", padding: '3px 9px', borderRadius: '7px', cursor: 'pointer', whiteSpace: 'nowrap' }}>{this.byId[id].name}</button>
              </React.Fragment>
            ))}
          </div>
        )}

        {/* family focus chip */}
        {s.focusFam && (
          <div data-ui="" className="gx-focus" style={css('position:absolute;top:26px;left:50%;transform:translateX(-50%);z-index:18;display:flex;align-items:center;gap:9px;background:rgba(15,17,22,.94);border:1px solid rgba(255,255,255,.08);border-radius:999px;padding:7px 8px 7px 14px;')}>
            <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: this.FAM[s.focusFam].color, boxShadow: '0 0 9px ' + this.FAM[s.focusFam].color }}></span>
            <span style={css('font-size:12.5px;color:#dbe0e6;')}>Focused · {this.FAM[s.focusFam].label}</span>
            <button onClick={() => this.setState({ focusFam: null })} className="hv-white" aria-label="Clear focus" style={css('background:rgba(255,255,255,.07);border:none;color:#aab0b8;width:20px;height:20px;border-radius:50%;cursor:pointer;font-size:11px;line-height:1;')}>✕</button>
          </div>
        )}

        {/* legend */}
        <div data-ui="" className="gxscroll gx-legend" style={css('position:absolute;left:28px;bottom:28px;z-index:18;max-height:72vh;overflow-y:auto;background:rgba(13,16,20,.95);border:1px solid rgba(255,255,255,.08);border-radius:13px;width:228px;')}>
          <button onClick={() => this.setState((p) => ({ legendOpen: !p.legendOpen } as State))} style={css("display:flex;align-items:center;justify-content:space-between;width:100%;background:none;border:none;color:#dbe0e6;cursor:pointer;padding:13px 15px;font-family:'Schibsted Grotesk';")}>
            <span style={css("font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:#8a919b;")}>Legend &amp; Filter</span>
            <span style={{ display: 'inline-block', transition: 'transform .3s', transform: s.legendOpen ? 'rotate(0deg)' : 'rotate(180deg)', color: '#8a919b', fontSize: '12px' }}>⌃</span>
          </button>
          {s.legendOpen && (
            <div style={css('padding:2px 15px 15px;')}>
              <div style={css("font-family:'JetBrains Mono',monospace;font-size:8.5px;letter-spacing:.18em;color:#565d68;margin:6px 0 9px;")}>SUPER-FAMILY · tap to focus</div>
              {this.famOrder.map((k) => { const fam = this.FAM[k], on = s.focusFam === k; return (
                <button key={k} onClick={() => this.focusFamily(k)} style={{ display: 'flex', alignItems: 'center', gap: '9px', width: '100%', textAlign: 'left', background: on ? 'rgba(255,255,255,.07)' : 'none', border: 'none', borderRadius: '7px', padding: '5px 7px', marginBottom: '2px', cursor: 'pointer', color: on ? '#f2f4f6' : '#c8cdd4' }}>
                  <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: fam.color, boxShadow: '0 0 8px ' + this.rgba(k, 0.6), flex: '0 0 auto' }}></span>
                  <span style={css('font-size:12px;')}>{fam.short}</span>
                </button>
              ); })}
              <div style={css("font-family:'JetBrains Mono',monospace;font-size:8.5px;letter-spacing:.18em;color:#565d68;margin:14px 0 9px;")}>EDGE TYPE</div>
              <div style={legendRow}><svg width="26" height="6"><line x1="1" y1="3" x2="25" y2="3" stroke="#9aa2ad" strokeWidth="2"></line></svg><span style={legendTxt}>Historical origin</span></div>
              <div style={legendRow}><svg width="26" height="6"><line x1="1" y1="3" x2="25" y2="3" stroke="#9aa2ad" strokeWidth="2" strokeDasharray="9 7"></line></svg><span style={legendTxt}>Stylistic influence</span></div>
              <div style={legendRow}><svg width="26" height="6"><line x1="1" y1="3" x2="25" y2="3" stroke="#9aa2ad" strokeWidth="2" strokeDasharray="2 5"></line></svg><span style={legendTxt}>Production influence</span></div>
              <div style={legendRow}><svg width="26" height="6"><line x1="1" y1="3" x2="25" y2="3" stroke="#9aa2ad" strokeWidth="2" strokeDasharray="1 7"></line></svg><span style={legendTxt}>Scene adjacency</span></div>
              <div style={legendRow}><svg width="26" height="6"><line x1="1" y1="3" x2="25" y2="3" stroke="#9aa2ad" strokeWidth="2" strokeDasharray="11 5 2 5"></line></svg><span style={legendTxt}>Revival / reinterpretation</span></div>
              <div style={css('display:flex;align-items:center;gap:9px;')}><svg width="26" height="6"><line x1="1" y1="3" x2="25" y2="3" stroke="#e7eaee" strokeWidth="3" strokeDasharray="13 5"></line></svg><span style={legendTxt}>Cross-family bridge</span></div>
              <div style={css("font-family:'JetBrains Mono',monospace;font-size:8.5px;letter-spacing:.18em;color:#565d68;margin:14px 0 9px;")}>NODE ROLE</div>
              <div style={css('display:flex;flex-wrap:wrap;gap:9px 14px;')}>
                <div style={roleRow}><svg width="16" height="16"><circle cx="8" cy="8" r="6" fill="none" stroke="#aab0b8" strokeWidth="1.4"></circle><circle cx="8" cy="8" r="3" fill="#aab0b8"></circle></svg><span style={roleTxt}>Foundational</span></div>
                <div style={roleRow}><svg width="16" height="16"><circle cx="8" cy="8" r="4.5" fill="#aab0b8"></circle></svg><span style={roleTxt}>Branch</span></div>
                <div style={roleRow}><svg width="16" height="16"><rect x="3.5" y="3.5" width="9" height="9" transform="rotate(45 8 8)" fill="#aab0b8"></rect></svg><span style={roleTxt}>Hybrid</span></div>
                <div style={roleRow}><svg width="16" height="16"><circle cx="8" cy="8" r="6" fill="none" stroke="#aab0b8" strokeWidth="1.4" strokeDasharray="2 2"></circle></svg><span style={roleTxt}>Revival</span></div>
                <div style={roleRow}><svg width="16" height="16"><circle cx="8" cy="8" r="6" fill="none" stroke="#aab0b8" strokeWidth="1"></circle><circle cx="8" cy="8" r="3.5" fill="#aab0b8"></circle></svg><span style={roleTxt}>Rising</span></div>
              </div>
              <div style={css("font-family:'JetBrains Mono',monospace;font-size:9px;letter-spacing:.06em;line-height:1.6;color:#565d68;margin-top:14px;")}>Drag to pan · mouse wheel or pinch to zoom · trackpad scroll to pan</div>
            </div>
          )}
        </div>

        {/* zoom / fullscreen controls */}
        <div data-ui="" className="gx-ctrl" style={css('position:absolute;right:26px;bottom:120px;z-index:18;display:flex;flex-direction:column;gap:8px;')}>
          <button onClick={() => this.toggleFs()} className="hv-bg10" aria-label="Toggle fullscreen" style={{ ...ctrlBtn, fontSize: '16px' }}>{(s.isFs || s.immersive) ? '⤡' : '⛶'}</button>
          <button onClick={() => this.zoom(1.25)} className="hv-bg10" aria-label="Zoom in" style={ctrlBtn}>+</button>
          <button onClick={() => this.zoom(1 / 1.25)} className="hv-bg10" aria-label="Zoom out" style={ctrlBtn}>−</button>
          <button onClick={() => this.fitView(true)} className="hv-bg10" aria-label="Fit to screen" style={{ ...ctrlBtn, fontSize: '15px' }}>⤢</button>
        </div>

        {/* time slider */}
        {!inJourney && (
          <div data-ui="" className="gx-slider" style={css('position:absolute;left:50%;transform:translateX(-50%);bottom:28px;width:min(640px,62vw);z-index:18;background:rgba(15,17,22,.94);border:1px solid rgba(255,255,255,.08);border-radius:15px;padding:14px 22px 16px;')}>
            <div style={css('display:flex;align-items:center;justify-content:space-between;margin-bottom:9px;')}>
              <button onClick={() => this.togglePlay()} className="hv-bg12" style={css("font-family:'Schibsted Grotesk';font-size:12.5px;padding:7px 14px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.14);color:#eef0f3;border-radius:8px;cursor:pointer;display:flex;align-items:center;gap:7px;")}>{s.playing ? '❚❚ Pause' : '▶ Play history'}</button>
              <div style={css('text-align:right;')}>
                <div style={css("font-family:'JetBrains Mono',monospace;font-size:15px;color:#f2f4f6;letter-spacing:.04em;")}>{s.year >= this.maxYear ? 'Present' : this.fmtYear(s.year)}</div>
                <div style={css("font-family:'JetBrains Mono',monospace;font-size:9.5px;color:#6b7280;letter-spacing:.1em;")}>{visCount} of {this.GENRES.length} genres</div>
              </div>
            </div>
            <input type="range" className="gxr" min={0} max={1000} value={Math.round(this.posFromYear(s.year) * 1000)} aria-label="Year" onChange={(e) => { clearInterval(this._t); this.setState({ year: this.yearFromPos(+e.target.value / 1000), playing: false }); }} />
            <div style={css("display:flex;justify-content:space-between;margin-top:3px;font-family:'JetBrains Mono',monospace;font-size:9px;color:#565d68;letter-spacing:.05em;")}>
              <span>380 BCE</span><span>1875</span><span>1935</span><span>1965</span><span>1987</span><span>NOW</span>
            </div>
          </div>
        )}

        {/* journey card */}
        {inJourney && (() => {
          const st = s.activeJourney!, step = st.steps[s.journeyStep], sn = this.byId[step.id];
          const last = s.journeyStep === st.steps.length - 1;
          return (
            <div data-ui="" className="gx-journey" style={css('position:absolute;left:50%;transform:translateX(-50%);bottom:28px;width:min(700px,72vw);z-index:26;background:#12151b;border:1px solid rgba(255,255,255,.12);border-radius:18px;padding:19px 24px 18px;box-shadow:0 28px 80px rgba(0,0,0,.6);')}>
              <div style={css('display:flex;align-items:center;justify-content:space-between;margin-bottom:11px;')}>
                <div style={css("font-family:'JetBrains Mono',monospace;font-size:9.5px;letter-spacing:.2em;color:#6b7280;text-transform:uppercase;")}>{st.title} · {s.journeyStep + 1} / {st.steps.length}</div>
                <button onClick={() => this.exitJourney()} className="hv-light" style={css("background:none;border:none;color:#8a919b;font-size:12px;cursor:pointer;font-family:'Schibsted Grotesk';")}>Exit ✕</button>
              </div>
              <div style={{ fontFamily: SERIF, fontSize: '21px', marginBottom: '8px', color: this.hex(sn.fam) }}>{sn.name}</div>
              <div style={{ fontFamily: SERIF, fontSize: '16px', lineHeight: 1.55, color: '#cbd0d7', textWrap: 'pretty' } as React.CSSProperties}>{step.text}</div>
              <div style={css('display:flex;align-items:center;justify-content:space-between;margin-top:16px;')}>
                <div style={css('display:flex;gap:6px;align-items:center;')}>
                  {st.steps.map((x, i) => <span key={x.id + i} style={{ width: '7px', height: '7px', borderRadius: '50%', background: i === s.journeyStep ? this.hex(this.byId[x.id].fam) : 'rgba(255,255,255,.2)', transition: 'background .3s' }}></span>)}
                </div>
                <div style={css('display:flex;gap:9px;')}>
                  <button onClick={() => this.journeyGo(-1)} className="hv-bg10" style={css("font-family:'Schibsted Grotesk';font-size:13px;padding:8px 16px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.13);color:#cbd0d7;border-radius:9px;cursor:pointer;")}>← Prev</button>
                  <button onClick={() => (last ? this.exitJourney() : this.journeyGo(1))} className="hv-bright-white" style={css("font-family:'Schibsted Grotesk';font-size:13px;padding:8px 18px;background:#e7eaee;border:1px solid #e7eaee;color:#11141a;border-radius:9px;cursor:pointer;font-weight:600;")}>{last ? 'Finish' : 'Next →'}</button>
                </div>
              </div>
            </div>
          );
        })()}

        {/* genre detail panel */}
        {sel && (
          <div data-ui="" className="gxscroll gx-panel" style={panelStyle}>
            <div style={css('padding:26px 26px 48px;')}>
              {mobileSheet && (
                <button onClick={() => this.setState((p) => ({ sheetFull: !p.sheetFull } as State))} style={sheetHandleBtn}>
                  <span style={css('width:44px;height:4px;border-radius:2px;background:rgba(255,255,255,.24);')}></span>
                  <span style={css("font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.14em;color:#8a919b;text-transform:uppercase;")}>{sheetHint}</span>
                </button>
              )}
              <div style={css('display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:16px;')}>
                <div style={css('display:flex;align-items:center;gap:7px;flex-wrap:wrap;')}>
                  <span style={{ fontSize: '10.5px', fontFamily: MONO, letterSpacing: '.08em', textTransform: 'uppercase', color: this.hex(sel.fam), background: this.rgba(sel.fam, 0.12), border: '1px solid ' + this.rgba(sel.fam, 0.3), padding: '4px 9px', borderRadius: '6px' }}>{this.FAM[sel.fam].label}</span>
                  {sel.fam2 && <span style={{ fontSize: '10.5px', fontFamily: MONO, letterSpacing: '.08em', textTransform: 'uppercase', color: this.hex(sel.fam2), background: this.rgba(sel.fam2, 0.1), border: '1px solid ' + this.rgba(sel.fam2, 0.28), padding: '4px 9px', borderRadius: '6px' }}>+ {this.FAM[sel.fam2].label}</span>}
                </div>
                <button onClick={() => this.closePanel()} className="hv-white" aria-label="Close" style={css('background:none;border:none;color:#8a919b;font-size:18px;cursor:pointer;line-height:1;margin:-4px -4px 0 0;')}>✕</button>
              </div>
              <div style={css('display:flex;align-items:center;gap:9px;margin-bottom:12px;flex-wrap:wrap;')}>
                <span style={{ fontSize: '10.5px', fontFamily: MONO, letterSpacing: '.08em', textTransform: 'uppercase', color: '#0a0c10', background: this.hex(sel.fam), padding: '4px 9px', borderRadius: '6px', fontWeight: 500 }}>{STATUS_MAP[sel.role] || 'Classic'}</span>
                <span style={css("font-family:'JetBrains Mono',monospace;font-size:11px;color:#7b828d;")}>emerged {this.fmtYear(sel.year)}</span>
              </div>
              <div style={css("font-family:'Spectral',serif;font-size:33px;line-height:1.05;color:#f4f6f8;margin-bottom:14px;")}>{sel.name}</div>
              <div style={{ fontFamily: SERIF, fontSize: '16.5px', lineHeight: 1.6, color: '#b6bcc4', textWrap: 'pretty' } as React.CSSProperties}>{sel.def}</div>

              {sel.tempo && (
                <div style={css('margin-top:16px;padding:11px 14px;border:1px solid rgba(255,255,255,.08);border-radius:10px;background:rgba(255,255,255,.02);')}>
                  <div style={css('display:flex;align-items:baseline;gap:10px;flex-wrap:wrap;')}>
                    <span style={css("font-family:'JetBrains Mono',monospace;font-size:9px;letter-spacing:.18em;color:#5a626d;text-transform:uppercase;")}>Avg Tempo</span>
                    <span style={css("font-family:'JetBrains Mono',monospace;font-size:13.5px;color:#eef0f3;letter-spacing:.03em;")}>{sel.tempo}</span>
                  </div>
                  {sel.tempoNote && <div style={css('margin-top:7px;font-size:12px;line-height:1.5;color:#8a919b;')}>{sel.tempoNote}</div>}
                </div>
              )}

              <div style={{ ...sectionHead, margin: '26px 0 11px' }}>Key Traits · tap to expand</div>
              {(sel.traits || []).map((t, i) => { const key = sel.id + ':' + i, open = s.openTrait === key; return (
                <div key={key} style={css('margin-bottom:8px;border:1px solid rgba(255,255,255,.08);border-radius:10px;overflow:hidden;background:rgba(255,255,255,.02);')}>
                  <button onClick={() => this.toggleTrait(key)} className="hv-bg03" style={css("display:flex;align-items:center;justify-content:space-between;width:100%;background:none;border:none;cursor:pointer;padding:10px 13px;color:#dbe0e6;font-family:'Schibsted Grotesk';")}>
                    <span style={css('font-size:13px;font-weight:500;')}>{t.k}</span>
                    <span style={{ display: 'inline-block', transition: 'transform .3s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)', color: '#8a919b', fontSize: '12px' }}>⌄</span>
                  </button>
                  {open && <div style={css('padding:0 13px 12px;font-size:13px;line-height:1.5;color:#9aa2ad;')}>{t.v}</div>}
                </div>
              ); })}

              <div style={css('margin-top:24px;padding:16px 17px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);border-radius:13px;')}>
                <div style={{ fontFamily: MONO, fontSize: '9px', letterSpacing: '.18em', color: this.hex(sel.fam), textTransform: 'uppercase', marginBottom: '9px' }}>◷ Why it sounds this way</div>
                <div style={{ fontFamily: SERIF, fontSize: '15.5px', lineHeight: 1.55, color: '#d4d9df', textWrap: 'pretty' } as React.CSSProperties}>{sel.why}</div>
              </div>

              {preds.length > 0 && (<><div style={sectionHead}>Predecessors</div>{preds}</>)}
              {descs.length > 0 && (<><div style={sectionHead}>Descendants</div>{descs}</>)}
              {cross.length > 0 && (<><div style={sectionHead}>Cross-Scene Connections</div>{cross}</>)}

              <div style={{ ...sectionHead, margin: '26px 0 10px' }}>Representative Artists</div>
              <div style={css('font-size:14.5px;color:#cbd0d7;line-height:1.6;')}>{(sel.artists || []).join('  ·  ')}</div>

              <div style={css('display:flex;align-items:center;gap:6px;margin:26px 0 0;flex-wrap:wrap;')}>
                <span style={css("font-family:'JetBrains Mono',monospace;font-size:9px;letter-spacing:.16em;color:#5a626d;text-transform:uppercase;margin-right:3px;")}>Listen via</span>
                {svcPicker}
              </div>
              {(sel.albums || []).length > 0 && (
                <>
                  <div style={{ ...sectionHead, margin: '24px 0 11px' }}>Gateway Albums</div>
                  {sel.albums.map((al, i) => (
                    <a key={i} href={this.musicHref(al.t + ' ' + al.a)} onClick={this.goLink(al.t + ' ' + al.a)} target="_blank" rel="noopener noreferrer" className="hv-fade" style={css('display:flex;align-items:center;gap:12px;padding:9px 0;border-bottom:1px solid rgba(255,255,255,.05);text-decoration:none;')}>
                      <span style={{ width: '34px', height: '34px', borderRadius: '5px', flex: '0 0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', color: this.rgba(sel.fam, 0.9), background: 'linear-gradient(135deg,' + this.rgba(sel.fam, 0.22) + ',' + this.rgba(sel.fam, 0.05) + ')', border: '1px solid ' + this.rgba(sel.fam, 0.25) }}>◾</span>
                      <div style={css('flex:1;min-width:0;')}>
                        <div style={css("font-family:'Spectral',serif;font-size:14.5px;color:#eef0f3;font-style:italic;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;")}>{al.t}</div>
                        <div style={css('font-size:11.5px;color:#868d97;')}>{al.a}</div>
                      </div>
                      <span style={{ fontFamily: MONO, fontSize: '11px', color: curSvc.c, flex: '0 0 auto' }}>↗</span>
                    </a>
                  ))}
                </>
              )}

              <div style={css('display:flex;align-items:center;justify-content:space-between;margin:26px 0 4px;')}>
                <div style={css("font-family:'JetBrains Mono',monospace;font-size:9.5px;letter-spacing:.2em;color:#5a626d;text-transform:uppercase;")}>Representative Tracks</div>
                <button onClick={() => this.setState({ showListen: true })} className="hv-cyan" style={css("background:none;border:none;color:#54c6d6;font-size:11.5px;cursor:pointer;font-family:'Schibsted Grotesk';")}>Listen ↗</button>
              </div>
              {(sel.tracks || []).map((t, i) => (
                <div key={i} style={css('padding:11px 0;border-bottom:1px solid rgba(255,255,255,.05);')}>
                  <a href={this.musicHref(t.t + ' ' + t.a)} onClick={this.goLink(t.t + ' ' + t.a)} target="_blank" rel="noopener noreferrer" className="hv-fade" style={css('display:flex;align-items:center;gap:12px;text-decoration:none;')}>
                    <span style={{ width: '34px', height: '34px', borderRadius: '50%', background: curSvc.c, color: '#0a0c10', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto', fontSize: '12px', paddingLeft: '2px' }}>▶</span>
                    <div style={css('flex:1;min-width:0;')}>
                      <div style={css('font-size:13.5px;color:#e7eaee;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;')}>{t.t}</div>
                      <div style={css('font-size:11.5px;color:#868d97;')}>{t.a}</div>
                    </div>
                    <span style={{ fontFamily: MONO, fontSize: '9px', color: curSvc.c, letterSpacing: '.08em', flex: '0 0 auto' }}>{curSvc.n.toUpperCase()} ↗</span>
                  </a>
                  {t.why && <div style={css('font-size:12px;color:#7e858f;line-height:1.45;margin:7px 0 0 46px;font-style:italic;')}>{t.why}</div>}
                </div>
              ))}
              <div style={css('font-size:10.5px;color:#565d68;line-height:1.5;margin-top:14px;')}>Listening links are discovery aids — representative, not a definition of lineage.</div>
            </div>
          </div>
        )}

        {/* edge detail panel */}
        {selEdge && (() => {
          const ea = this.byId[selEdge.from], eb = this.byId[selEdge.to];
          return (
            <div data-ui="" className="gxscroll gx-panel" style={panelStyle}>
              <div style={css('padding:26px;')}>
                {mobileSheet && (
                  <button onClick={() => this.setState((p) => ({ sheetFull: !p.sheetFull } as State))} style={sheetHandleBtn}>
                    <span style={css('width:44px;height:4px;border-radius:2px;background:rgba(255,255,255,.24);')}></span>
                    <span style={css("font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.14em;color:#8a919b;text-transform:uppercase;")}>{sheetHint}</span>
                  </button>
                )}
                <div style={css('display:flex;justify-content:space-between;align-items:center;margin-bottom:22px;')}>
                  <span style={css("font-family:'JetBrains Mono',monospace;font-size:9.5px;letter-spacing:.2em;color:#5a626d;text-transform:uppercase;")}>Influence Relationship</span>
                  <button onClick={() => this.closePanel()} className="hv-white" aria-label="Close" style={css('background:none;border:none;color:#8a919b;font-size:18px;cursor:pointer;line-height:1;')}>✕</button>
                </div>
                <div style={css('display:flex;align-items:center;gap:11px;margin-bottom:24px;flex-wrap:wrap;')}>
                  <div style={css('display:flex;align-items:center;gap:7px;')}><span style={{ width: '11px', height: '11px', borderRadius: '50%', background: this.hex(ea.fam), boxShadow: '0 0 11px ' + this.hex(ea.fam) }}></span><span style={css('font-size:15px;color:#e7eaee;font-weight:500;')}>{ea.name}</span></div>
                  <span style={css('color:#5a626d;font-size:16px;')}>→</span>
                  <div style={css('display:flex;align-items:center;gap:7px;')}><span style={{ width: '11px', height: '11px', borderRadius: '50%', background: this.hex(eb.fam), boxShadow: '0 0 11px ' + this.hex(eb.fam) }}></span><span style={css('font-size:15px;color:#e7eaee;font-weight:500;')}>{eb.name}</span></div>
                </div>
                <div style={css("font-family:'Spectral',serif;font-size:25px;color:#f4f6f8;margin-bottom:18px;")}>{REL_LABEL[selEdge.rel]}</div>
                <div style={css('display:flex;align-items:center;justify-content:space-between;margin-bottom:7px;')}><span style={css("font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.14em;color:#7b828d;")}>STRENGTH OF INFLUENCE</span><span style={css("font-family:'JetBrains Mono',monospace;font-size:12px;color:#e7eaee;")}>{Math.round(selEdge.strength * 100)}%</span></div>
                <div style={css('height:5px;background:rgba(255,255,255,.07);border-radius:3px;overflow:hidden;margin-bottom:26px;')}><div style={{ width: Math.round(selEdge.strength * 100) + '%', height: '100%', background: 'linear-gradient(90deg,' + this.hex(ea.fam) + ',' + this.hex(eb.fam) + ')', borderRadius: '3px' }}></div></div>
                <div style={{ fontFamily: SERIF, fontSize: '17px', lineHeight: 1.6, color: '#c4cad1', textWrap: 'pretty' } as React.CSSProperties}>{selEdge.note}</div>
                <div style={css('display:flex;gap:10px;margin-top:28px;')}>
                  <button onClick={() => this.selectNode(selEdge.from, true)} className="hv-bg09" style={css("flex:1;font-family:'Schibsted Grotesk';font-size:13px;padding:10px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.12);color:#cbd0d7;border-radius:10px;cursor:pointer;")}>View {ea.name}</button>
                  <button onClick={() => this.selectNode(selEdge.to, true)} className="hv-bg09" style={css("flex:1;font-family:'Schibsted Grotesk';font-size:13px;padding:10px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.12);color:#cbd0d7;border-radius:10px;cursor:pointer;")}>View {eb.name}</button>
                </div>
              </div>
            </div>
          );
        })()}

        {/* listen modal */}
        {s.showListen && sel && (
          <div data-ui="" onClick={() => this.setState({ showListen: false })} style={css('position:absolute;inset:0;z-index:60;display:flex;align-items:center;justify-content:center;background:rgba(4,5,7,.72);')}>
            <div onClick={(e) => e.stopPropagation()} className="gxscroll" style={css('width:min(470px,90vw);max-height:84vh;overflow-y:auto;background:#13161c;border:1px solid rgba(255,255,255,.12);border-radius:20px;padding:28px;box-shadow:0 40px 110px rgba(0,0,0,.6);')}>
              <div style={css('display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:6px;')}>
                <div style={css("font-family:'JetBrains Mono',monospace;font-size:9.5px;letter-spacing:.2em;color:#5a626d;text-transform:uppercase;")}>Representative Listening</div>
                <button onClick={() => this.setState({ showListen: false })} className="hv-white" aria-label="Close" style={css('background:none;border:none;color:#8a919b;font-size:18px;cursor:pointer;line-height:1;margin-top:-4px;')}>✕</button>
              </div>
              <div style={css("font-family:'Spectral',serif;font-size:27px;color:#f4f6f8;margin-bottom:14px;")}>{sel.name}</div>
              <div style={css('display:flex;align-items:center;gap:6px;margin-bottom:18px;flex-wrap:wrap;')}>{svcPicker}</div>
              <a href={this.musicHref(plq)} onClick={this.goLink(plq)} target="_blank" rel="noopener noreferrer" className="hv-border35" style={{ borderRadius: '14px', padding: '20px', background: 'linear-gradient(135deg, ' + curSvc.tint + ', rgba(255,255,255,.02)), repeating-linear-gradient(45deg, rgba(255,255,255,.025) 0 10px, transparent 10px 20px)', border: '1px solid rgba(255,255,255,.09)', display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px', textDecoration: 'none' }}>
                <div style={{ width: '46px', height: '46px', borderRadius: '50%', background: curSvc.c, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto', color: '#0a0c10', fontSize: '18px', paddingLeft: '2px' }}>▶</div>
                <div style={css('flex:1;')}><div style={css('font-size:14px;color:#e7eaee;font-weight:600;')}>Open the {sel.name} playlist</div><div style={{ fontSize: '11.5px', color: curSvc.c, fontFamily: MONO, marginTop: '3px' }}>Search on {curSvc.n} ↗</div></div>
              </a>
              {(sel.tracks || []).map((t, i) => (
                <a key={i} href={this.musicHref(t.t + ' ' + t.a)} onClick={this.goLink(t.t + ' ' + t.a)} target="_blank" rel="noopener noreferrer" className="hv-fade" style={css('display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid rgba(255,255,255,.05);text-decoration:none;')}>
                  <span style={css("font-family:'JetBrains Mono',monospace;font-size:11px;color:#565d68;width:18px;flex:0 0 auto;")}>{(i + 1 < 10 ? '0' : '') + (i + 1)}</span>
                  <div style={css('flex:1;min-width:0;')}><div style={css('font-size:13.5px;color:#e7eaee;')}>{t.t}</div><div style={css('font-size:11.5px;color:#868d97;')}>{t.a}</div></div>
                  <span style={{ color: curSvc.c, fontSize: '11px', flex: '0 0 auto' }}>↗</span>
                </a>
              ))}
            </div>
          </div>
        )}

      </div>
    );
  }
}
