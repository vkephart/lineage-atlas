/* Equipment Map prototype: the studio room.
   The inventory is the owner's equipment sheet reduced to names and groups (no serial numbers).
   Pieces with a record in gear/ are drawn in colour and open their page; the rest are outlined by group. */
const STUDIO = (function(){
  const $ = id => document.getElementById(id);

  const GROUPS = [
    { id:'guitars', label:'Guitars', items:[
      { name:'Fender American Original ’60s Telecaster', note:'2019 · Lake Placid Blue · Bigsby', map:'telecaster' },
      { name:'Fender American Stratocaster', note:'2000' },
      { name:'Gibson Les Paul Standard', note:'2010' },
      { name:'Gibson J-45 Standard', note:'2024 · acoustic' },
      { name:'Taylor 214ce', note:'2011 · acoustic' },
      { name:'J. Reynolds JR12N', note:'3/4 classical' },
      { name:'Charango', note:'ACHA, La Paz' } ] },
    { id:'basses', label:'Basses', items:[
      { name:'Fender Jazz Bass American Deluxe', note:'2002' },
      { name:'Fender American Professional II Precision Bass', note:'2025' },
      { name:'Höfner H500/1 ’62 Reissue', note:'2003' } ] },
    { id:'amps', label:'Amplifiers', items:[
      { name:'Fender Bassman 70', note:'c. 1979 · not on your sheet', map:'bassman-70' } ] },
    { id:'mics', label:'Microphones', items:[
      { name:'Shure SM57', note:'dynamic' }, { name:'Shure SM58', note:'dynamic' }, { name:'Shure Beta 52A', note:'kick' }, { name:'CAD KBM412', note:'kick' },
      { name:'Audix Micro-D', note:'drum condenser' }, { name:'Neumann TLM 103', note:'condenser' }, { name:'Royer R-121', note:'ribbon' },
      { name:'Blue Baby Bottle', note:'condenser' }, { name:'Carvin CM68', note:'dynamic' }, { name:'Dean Markley ProMag Plus', note:'soundhole pickup' } ] },
    { id:'outboard', label:'Preamps and interface', items:[
      { name:'API 512c', note:'500 preamp' }, { name:'Rupert Neve Designs 511', note:'500 preamp' }, { name:'Warm Audio WA273-EQ', note:'preamp and EQ' },
      { name:'Empirical Labs Distressor EL8', note:'compressor' }, { name:'Universal Audio Apollo x6', note:'interface' },
      { name:'Focusrite Scarlett OctoPre', note:'8 preamps, ADAT' }, { name:'LiveWire SPDI', note:'passive DI' } ] },
    { id:'keys', label:'Synths and machines', items:[
      { name:'Moog Sub 37', note:'mono synth' }, { name:'Korg microKORG XL', note:'synth and vocoder' }, { name:'Suzuki QChord QC1', note:'' },
      { name:'Korg volca beats', note:'drum machine' }, { name:'Akai MPK49', note:'controller' } ] },
    { id:'pedals', label:'Pedals and effects', items:[
      { name:'Dunlop Fuzz Face JDF2', note:'fuzz' }, { name:'Boss DD-20 Giga Delay', note:'delay' }, { name:'Moog MF-105 MuRF', note:'filter sequencer' },
      { name:'Electro-Harmonix Synth9', note:'synth pedal' }, { name:'Pigtronix Bob Weir Real Deal', note:'acoustic preamp' }, { name:'Korg Kaoss Pad 3', note:'touch effects' } ] },
    { id:'percussion', label:'Percussion', items:[
      { name:'Sabian 14″ HHX Groove hi-hats', note:'on a Pearl stand' }, { name:'Gon Bops Alex Acuña cajón', note:'' }, { name:'Toca Freestyle djembe', note:'' },
      { name:'Meinl tabla set', note:'' }, { name:'Bodhrán', note:'custom' }, { name:'Slit drum', note:'Guatemala' }, { name:'Pearl 32-note glockenspiel', note:'' },
      { name:'RhythmTech tambourine', note:'' }, { name:'Rhythm Tech cabasa', note:'' }, { name:'LP Multi Guiro', note:'' }, { name:'LP Twist Shaker', note:'' },
      { name:'LP Jam Block', note:'' }, { name:'CODA cowbell', note:'' }, { name:'Promark Hot Rods', note:'' } ] }
  ];
  const total = GROUPS.reduce((n,g)=>n+g.items.length,0);
  const mapped = GROUPS.reduce((n,g)=>n+g.items.filter(i=>i.map).length,0);
  const group = id => GROUPS.find(g=>g.id===id);

  /* ---------- room drawing, 1480 x 710 ---------- */
  const G = (id,inner,label,x) => { const g=group(id), n=g.items.filter(i=>!i.map).length;
    return `<g class="grp" data-group="${id}" tabindex="0" role="button" aria-label="${g.label}: ${n} pieces, not mapped yet">${inner}<text x="${x}" y="686" text-anchor="middle" class="rlbl">${label} · ${n}</text></g>`; };
  /* outlined instrument silhouettes; (cx, y) is the top centre of the body */
  function ghost(cx,y,kind,k=1){
    const neck=kind==='bass'?210:170, hole=kind==='acoustic'?`<circle cx="0" cy="48" r="13"/>`:'';
    return `<g transform="translate(${cx} ${y}) scale(${k})">
      <rect x="-6" y="${-neck}" width="12" height="${neck+6}" rx="2"/><rect x="-10" y="${-neck-34}" width="20" height="36" rx="5"/>
      <path d="M-28 0 C-48 0 -52 40 -40 62 C-58 84 -52 130 0 132 C52 130 58 84 40 62 C52 40 48 0 28 0 Z" fill="#0e1116"/>${hole}
      <rect x="-14" y="92" width="28" height="7" rx="2"/></g>`;
  }
  function drawRoom(){
    const s=[];
    s.push(`<defs>
      <linearGradient id="rWall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0d1016"/><stop offset="1" stop-color="#141821"/></linearGradient>
      <linearGradient id="rFloor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#171a20"/><stop offset="1" stop-color="#0b0d11"/></linearGradient>
      <radialGradient id="rLamp"><stop offset="0" stop-color="rgba(242,184,75,.17)"/><stop offset="1" stop-color="rgba(242,184,75,0)"/></radialGradient>
      <radialGradient id="rPool"><stop offset="0" stop-color="rgba(242,184,75,.26)"/><stop offset="1" stop-color="rgba(242,184,75,0)"/></radialGradient>
      <linearGradient id="rBody" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6f9fd6"/><stop offset=".45" stop-color="#4577b6"/><stop offset="1" stop-color="#2b5590"/></linearGradient>
      <linearGradient id="rChrome" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#eef0f3"/><stop offset="1" stop-color="#9299a3"/></linearGradient>
      <linearGradient id="rMaple" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e0c08c"/><stop offset="1" stop-color="#c7a56f"/></linearGradient>
      <linearGradient id="rPanel" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e6e9ed"/><stop offset="1" stop-color="#b3b8c0"/></linearGradient>
      <pattern id="rGrille" width="6" height="6" patternUnits="userSpaceOnUse"><rect width="6" height="6" fill="#161a21"/><path d="M0 6 L6 0 M0 0 L6 6" stroke="rgba(200,215,235,.13)" stroke-width="1"/></pattern>
    </defs>`);
    /* walls, floor, lamp */
    s.push(`<rect x="0" y="0" width="1480" height="540" fill="url(#rWall)"/><rect x="0" y="540" width="1480" height="170" fill="url(#rFloor)"/>`);
    let planks=''; for(let x=-200;x<=1700;x+=95) planks+=`M${x} 540 L${740+(x-740)*1.55} 710 `;
    s.push(`<path d="${planks}" stroke="rgba(255,255,255,.035)" stroke-width="1"/><path d="M0 540 H1480" stroke="rgba(255,255,255,.14)" stroke-width="1.5"/>`);
    s.push(`<ellipse cx="740" cy="330" rx="520" ry="330" fill="url(#rLamp)"/>`);
    s.push(`<path d="M740 0 V58" stroke="#3a3f47" stroke-width="2"/><path d="M712 58 H768 L758 84 H722 Z" fill="#1c2027" stroke="#4b515b"/><ellipse cx="740" cy="86" rx="15" ry="4" fill="#f2c66d" opacity=".85"/>`);
    s.push(`<path d="M150 96 H438" stroke="#3a3f47" stroke-width="5" stroke-linecap="round"/>`);

    /* ---- outlined groups ---- */
    s.push(G('percussion',`
      <rect x="38" y="452" width="64" height="88" rx="3"/><circle cx="70" cy="498" r="9"/>
      <path d="M112 430 H156 L146 488 Q143 510 150 540 H118 Q125 510 122 488 Z"/>
      <path d="M176 540 V392 M152 394 H200 M154 400 H198 M176 540 L158 556 M176 540 L196 556"/>
      <rect x="40" y="590" width="44" height="26" rx="12"/><rect x="94" y="596" width="34" height="22" rx="10"/>`,'PERCUSSION',100));
    s.push(G('guitars',`${ghost(204,276,'acoustic')}${ghost(296,270,'solid',.94)}${ghost(384,270,'solid',.94)}`,'GUITARS',294).replace('y="686"','y="444"'));
    s.push(G('pedals',`<path d="M210 608 H376 L390 636 H196 Z" fill="#0e1116"/><rect x="220" y="612" width="24" height="18" rx="3"/><rect x="252" y="612" width="24" height="18" rx="9"/><rect x="284" y="612" width="24" height="18" rx="3"/><rect x="316" y="612" width="24" height="18" rx="3"/><rect x="348" y="612" width="22" height="18" rx="3"/>`,'PEDALS',292));
    s.push(G('basses',`<path d="M436 596 L420 610 M436 596 L452 610 M516 596 L500 610 M516 596 L532 610"/>${ghost(436,462,'bass',.98)}${ghost(516,462,'bass',.98)}`,'BASSES',476));
    s.push(G('mics',`
      <path d="M990 606 V310 L1040 276 M990 606 L966 622 M990 606 L1014 622"/><rect x="1036" y="252" width="20" height="40" rx="9" fill="#0e1116"/>
      <path d="M1046 606 V392 M1046 606 L1026 622 M1046 606 L1066 622"/><rect x="1040" y="356" width="12" height="38" rx="5" fill="#0e1116"/>`,'MICS',1018));
    s.push(G('keys',`
      <path d="M1092 612 L1232 476 M1232 612 L1092 476"/>
      <rect x="1072" y="452" width="180" height="22" rx="3" fill="#0e1116"/><path d="M1082 466 H1242" stroke-dasharray="3 5"/>
      <path d="M1112 452 V428 M1212 452 V428"/><rect x="1094" y="410" width="136" height="18" rx="3" fill="#0e1116"/><path d="M1104 421 H1220" stroke-dasharray="3 5"/>`,'SYNTHS',1162));
    let units=''; for(let i=0;i<6;i++) units+=`<rect x="1298" y="${452+i*22}" width="134" height="18" rx="2"/><circle cx="1312" cy="${461+i*22}" r="3"/><circle cx="1326" cy="${461+i*22}" r="3"/><circle cx="1418" cy="${461+i*22}" r="3"/>`;
    s.push(G('outboard',`<rect x="1276" y="430" width="178" height="10" rx="2" fill="#0e1116"/><path d="M1284 440 V612 M1446 440 V612"/><rect x="1290" y="446" width="150" height="140" rx="3" fill="#0e1116"/>${units}<rect x="1302" y="410" width="126" height="18" rx="3" fill="#0e1116"/>`,'RACK',1365));

    /* ---- mapped pieces, in colour ---- */
    const tele=EQ.gear['telecaster'], bass=EQ.gear['bassman-70'];
    s.push(`<g class="open" data-open="telecaster" tabindex="0" role="link" aria-label="Open the Telecaster map">
      <ellipse cx="640" cy="612" rx="96" ry="15" fill="url(#rPool)"/>
      <path d="M640 380 V600 M640 600 L604 614 M640 600 L676 614 M616 596 H664" stroke="#6b7280" stroke-width="3" fill="none" stroke-linecap="round"/>
      <g transform="translate(737.2 159) rotate(90) scale(.36)">${tele.room.draw()}</g>
      <rect x="560" y="160" width="160" height="460" fill="transparent"/>
      <circle class="pulse" cx="640" cy="494" r="14"/>
      <text x="640" y="686" text-anchor="middle" class="rlbl on">${tele.roomLabel} →</text></g>`);
    s.push(`<g class="open" data-open="bassman-70" tabindex="0" role="link" aria-label="Open the Bassman 70 map">
      <ellipse cx="850" cy="612" rx="130" ry="16" fill="url(#rPool)"/>
      <g transform="translate(750 210)">${bass.room.draw()}</g>
      <rect x="745" y="205" width="210" height="410" fill="transparent"/>
      <circle class="pulse" cx="850" cy="253" r="14"/>
      <text x="850" y="686" text-anchor="middle" class="rlbl on">${bass.roomLabel} →</text></g>`);
    $('room').innerHTML=s.join('');
    /* outlines alone are too thin to tap: give every group a transparent target over its whole extent */
    document.querySelectorAll('#room .grp').forEach(g=>{ const b=g.getBBox(), r=document.createElementNS('http://www.w3.org/2000/svg','rect');
      for(const [k,v] of Object.entries({ x:b.x-8, y:b.y-8, width:b.width+16, height:b.height+16, fill:'transparent', stroke:'none', 'pointer-events':'all' })) r.setAttribute(k,v);
      g.insertBefore(r,g.firstChild); });
  }

  /* ---------- panel under the room and the full list ---------- */
  const itemRow = i => i.map
    ? `<a class="inv-row mapped" href="#${i.map}"><span class="inv-n">${i.name}</span><span class="inv-t">${i.note}</span><span class="pill v">Mapped</span></a>`
    : `<div class="inv-row"><span class="inv-n">${i.name}</span><span class="inv-t">${i.note}</span></div>`;
  function info(id){
    const el=$('roominfo');
    document.querySelectorAll('#room .grp').forEach(g=>g.classList.toggle('on',g.dataset.group===id));
    if(!id){ el.innerHTML=`<div class="eyebrow">The room</div><h2>${mapped} of ${total} pieces have a signal map</h2>
      <p class="roomp">The two pieces drawn in colour open their map. Everything outlined is on your equipment sheet and waiting; tap a group to see what is in it.</p>`; return; }
    const g=group(id), rest=g.items.filter(i=>!i.map);
    el.innerHTML=`<div class="eyebrow">Not mapped yet</div><h2>${g.label}</h2><div class="inv-list">${rest.map(itemRow).join('')}</div>`;
  }
  function start(){
    drawRoom(); info(null);
    $('inventory').innerHTML=GROUPS.map(g=>`<div class="inv-card"><h3>${g.label}<span>${g.items.length}</span></h3>${g.items.map(itemRow).join('')}</div>`).join('');
    const act=e=>{ const o=e.target.closest('[data-open]'); if(o){ location.hash=o.dataset.open; return; }
      const g=e.target.closest('[data-group]'); info(g?g.dataset.group:null); };
    $('room').addEventListener('click',act);
    $('room').addEventListener('keydown',e=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); act(e); } });
  }
  /* on a phone the room is wider than the screen: open on the mapped pieces, not the left wall */
  function center(){ const sc=$('roomscroll'); if(sc.scrollWidth>sc.clientWidth+4) sc.scrollLeft=745/1480*sc.scrollWidth-sc.clientWidth/2; }
  return { start, center, GROUPS };
})();
