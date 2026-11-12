/* Equipment Map prototype: page engine.
   Each file in gear/ registers one record (data + a draw function). This file turns a record into the
   equipment page (drawing, stage stepper, design-to-sound table, genre links with tracks, lineage, provenance)
   and routes between the studio room and the pages by URL hash. Plain scripts, no build step. */
const EQ = (function(){
  const VBW = 1480;
  const FAMILY_COLOR = { soul:'#e0a23c', rock:'#e8743f', metal:'#d95a5a', gaze:'#b08cf0', jazz:'#4fc28a', electronic:'#54c6d6', roots:'#b6c05a', hiphop:'#e87bb4', global:'#6f8cf0' };
  /* id -> [display name, family]; every id exists in data/genres/*.json */
  const GENRE = {
    funk:['Funk','soul'], soul:['Soul','soul'], disco:['Disco','soul'], chicago:['Chicago Blues','soul'],
    reggae:['Reggae','global'], country:['Country','roots'], countryrock:['Country Rock','roots'], cosmicamerican:['Cosmic American Music','roots'], cosmiccountry:['Cosmic Country','roots'],
    newwave:['New Wave','rock'], postpunk:['Post-Punk','gaze'], indie:['Indie Rock','rock'], noiserock:['Noise Rock','rock'], garage:['Garage Rock','rock'],
    alternative:['Alternative Rock','rock'], grunge:['Grunge','rock'], shoegaze:['Shoegaze','gaze'], dreampop:['Dream Pop','gaze'], neopsych:['Neo-Psychedelia','gaze'],
    stonerrock:['Stoner Rock / Metal','metal'], doom:['Doom Metal','metal'],
    rocknroll:["Rock 'n' Roll",'rock'], rockabilly:['Rockabilly','rock'], beat:['Beat / British Invasion','rock'], hardrock:['Hard Rock','rock'], folkrock:['Folk Rock','rock'], punk:['Punk','rock']
  };
  /* how well a track credit is sourced */
  const TRACK_SRC = { v:['Checked','v'], m:['Recalled','m'], d:['Sources differ','u'], r:['Rig, not this track','u'] };

  const gear = {}, order = [];
  const $ = id => document.getElementById(id);

  /* ---------- drawing helpers shared by every record ---------- */
  function route(pts, r=6){
    let d=`M${pts[0][0]} ${pts[0][1]}`;
    for(let i=1;i<pts.length-1;i++){
      const [x0,y0]=pts[i-1],[x1,y1]=pts[i],[x2,y2]=pts[i+1];
      const d1=Math.hypot(x1-x0,y1-y0), d2=Math.hypot(x2-x1,y2-y1), rr=Math.min(r,d1/2,d2/2);
      d+=` L${x1-(x1-x0)/d1*rr} ${y1-(y1-y0)/d1*rr} Q${x1} ${y1} ${x1+(x2-x1)/d2*rr} ${y1+(y2-y1)/d2*rr}`;
    }
    const l=pts[pts.length-1]; return d+` L${l[0]} ${l[1]}`;
  }
  function coil(x,y0,n,step,side){ let d=`M${x} ${y0}`; for(let i=0;i<n;i++) d+=` a${step/2} ${step/2} 0 0 ${side} 0 ${step}`; return d; }
  function zig(x,y0,y1){ const n=6, h=(y1-y0)/n; let d=`M${x} ${y0}`; for(let i=0;i<n;i++) d+=` L${x+(i%2?-7:7)} ${(y0+h*(i+.5)).toFixed(1)}`; return d+` L${x} ${y1}`; }
  const ground=(x,y)=>`<path d="M${x-9} ${y} H${x+9} M${x-6} ${y+4} H${x+6} M${x-3} ${y+8} H${x+3}" class="sym"/>`;

  /* helpers that need to know which layer a stage belongs to */
  function context(rec){
    const layerOf = Object.fromEntries(rec.stages.map(s=>[s.id,s.layer]));
    const tag = ids => `data-stage="${ids}" data-layer="${layerOf[ids.split(' ')[0]]}"`;
    function wire(p, kind, stage, o={}){
      const d=typeof p==='string'?p:route(p), dash=o.dash?` stroke-dasharray="${o.dash}"`:'';
      const flow=(o.flow ?? (kind==='sig'&&!o.noflow))?`<path d="${d}" class="flow"/>`:'';
      return `<g ${tag(stage)}><path d="${d}" class="halo"/><path d="${d}" class="w w-${kind}"${dash}/>${flow}</g>`;
    }
    const node=(x,y,kind,stage)=>`<circle cx="${x}" cy="${y}" r="3.4" fill="var(--${kind})" ${tag(stage)}/>`;
    function block(x,y,w,h,kind,stage,lines){
      const t=lines.map((s,i)=>`<text x="${x+w/2}" y="${y+h/2+(i-(lines.length-1)/2)*12.5}" text-anchor="middle" dominant-baseline="central" class="${i?'lbl-s':'blk-t'}">${s}</text>`).join('');
      return `<g ${tag(stage)}><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="7" class="blk blk-${kind}"/>${t}</g>`;
    }
    return { tag, wire, node, block };
  }

  /* ---------- equipment page ---------- */
  let REC=null, current=-1, layer='all';
  const layerColor = id => REC.layers.find(l=>l.id===id).color;
  const genreChip = id => { const g=GENRE[id]; return `<span class="genre"><span class="dot" style="background:${FAMILY_COLOR[g[1]]}"></span>${g[0]}</span>`; };
  const listen = t => 'https://open.spotify.com/search/'+encodeURIComponent(t.t.replace(/[()’]/g,' ')+' '+t.a);

  function trackRow(t){
    const s=TRACK_SRC[t.src];
    return `<div class="trk">
      <div class="trk-top">${genreChip(t.g)}<span class="pill ${s[1]}">${s[0]}</span>${t.atlas?`<span class="pill a" title="Also a representative track for ${t.atlas} in the atlas">In the atlas</span>`:''}</div>
      <div class="trk-t">${t.t}</div>
      <div class="trk-a">${t.a} · ${t.y} · <a href="${listen(t)}" target="_blank" rel="noopener">Listen</a></div>
      <div class="trk-n">${t.note}</div>
    </div>`;
  }
  function useCard(u){
    const withTracks = new Set((u.tracks||[]).map(t=>t.g));
    const rest = u.genres.filter(g=>!withTracks.has(g));
    return `<div class="use-card">
      <div class="basis">${u.basis.map(b=>`<span class="pill ${REC.basis[b].cls}">${REC.basis[b].label}</span>`).join('')}</div>
      <h3>${u.title}</h3><p>${u.text}</p>
      ${u.tracks?`<div class="tracks"><h4>Representative tracks</h4>${u.tracks.map(trackRow).join('')}</div>`:''}
      ${u.noTracks?`<div class="tracks"><h4>Representative tracks</h4><div class="trk-n">${u.noTracks}</div></div>`:''}
      ${rest.length?`<div class="genres"><span class="also">${u.tracks?'Also linked, no track yet':'Linked genres'}</span>${rest.map(genreChip).join('')}</div>`:''}
    </div>`;
  }

  function drawFigure(){
    const svg=$('amp'), ctx=context(REC);
    svg.setAttribute('viewBox',`0 0 ${REC.viewBox[0]} ${REC.viewBox[1]}`);
    svg.setAttribute('aria-label',REC.aria);
    const marks=REC.stages.map((st,i)=>{ const c=layerColor(st.layer), [x,y]=st.mk;
      return `<g class="mk" data-mk="${st.id}" data-layer="${st.layer}" tabindex="0" role="button" aria-label="Stage ${i+1}: ${st.title}" style="color:${c}">
        <circle cx="${x}" cy="${y}" r="22" fill="transparent"/><circle class="mkc" cx="${x}" cy="${y}" r="11" stroke="${c}"/><text x="${x}" y="${y+.5}" style="fill:${c}">${i+1}</text></g>`; }).join('');
    svg.innerHTML=REC.draw(ctx)+marks;
  }
  function renderStatic(){
    const R=REC;
    $('g-eyebrow').textContent=R.eyebrow; $('g-title').textContent=R.title; $('g-lede').textContent=R.lede; $('g-caption').innerHTML=R.caption;
    $('specs').innerHTML=R.specs.map(([k,v])=>`<span class="spec">${k} <b>${v}</b></span>`).join('');
    $('layers').innerHTML=R.layers.map(l=>`<button class="chip" data-layer-btn="${l.id}" aria-pressed="${l.id==='all'}">${l.color?`<span class="dot" style="background:${l.color}"></span>`:''}${l.label}</button>`).join('');
    $('steps').innerHTML=`<button class="step" data-step="-1">Overview</button>`+R.stages.map((s,i)=>`<button class="step" data-step="${i}"><span class="n" style="color:${layerColor(s.layer)}">${i+1}</span>${s.title}</button>`).join('');
    $('sigs').innerHTML=R.signatures.map((g,i)=>`<button class="sigrow" data-goto="${g.stage}"><span class="num">0${i+1}</span><span class="what">${g.what}</span><span class="hear">${g.hear}</span><span class="use">${g.use}</span></button>`).join('');
    $('g-uses-intro').textContent=R.usesIntro;
    $('basiskey').innerHTML=Object.values(R.basis).map(b=>`<span><span class="pill ${b.cls}">${b.label}</span>${b.text}</span>`).join('');
    $('uses').innerHTML=R.uses.map(useCard).join('');
    $('g-lin-title').textContent=R.lineageTitle; $('g-lin-intro').textContent=R.lineageIntro;
    $('lineage').innerHTML=R.lineage.map(l=>`<div class="lin${l.here?' this':''}"><span class="yr">${l.year}</span><span class="nm">${l.name}</span><span class="nt">${l.note}</span>${l.bridge?`<span class="br">${l.bridge}</span>`:''}</div>`).join('');
    $('g-notes-eyebrow').textContent=R.notesEyebrow; $('g-notes-title').textContent=R.notesTitle; $('g-notes-intro').textContent=R.notesIntro;
    $('notes').innerHTML=R.notes.map(([k,v])=>`<div class="note"><b>${k}</b><span>${v}</span></div>`).join('');
    $('g-prov-intro').textContent=R.provenance.intro;
    const pv=$('g-prov'); pv.className='checked'+(R.provenance.lists.length===3?' three':'');
    pv.innerHTML=R.provenance.lists.map(l=>`<div><h3><span class="pill ${l.cls}">${l.pill}</span>${l.title}</h3><ul>${l.items.map(i=>`<li>${i}</li>`).join('')}</ul></div>`).join('');
    $('srcs').innerHTML='Sources consulted through search: '+R.sources.map(([t,u])=>`<a href="${u}" target="_blank" rel="noopener">${t}</a>`).join(' · ');
    $('g-footer').textContent=R.footer;
    const st=R.stages, u=R.uses.find(x=>x.tracks)||R.uses[0];
    $('shape').textContent=JSON.stringify({ id:R.id, name:R.name, maker:R.maker, kind:R.kind, years:R.years,
      stages:[{ id:st[0].id, layer:st[0].layer, title:st[0].title, wired:'…', sound:'…', conf:st[0].conf },`… ${st.length-1} more`],
      signatures:[{ stage:R.signatures[0].stage, what:R.signatures[0].what, hear:'…', use:'…' },`… ${R.signatures.length-1} more`],
      uses:[{ title:u.title, basis:u.basis, genres:u.genres, tracks:(u.tracks||[]).slice(0,1).map(t=>({ genre:t.g, t:t.t, a:t.a, year:t.y, src:t.src, note:'…' })) },`… ${R.uses.length-1} more`],
      lineage:[{ year:R.lineage[0].year, name:R.lineage[0].name },'…'] },null,2);
  }
  function renderDetail(){
    const d=$('detail'), n=REC.stages.length, built=REC.builtLabel;
    if(current<0){ const o=REC.overview;
      d.innerHTML=`<div class="detail-head"><div class="eyebrow">Overview</div><h2>${o.title}</h2><div class="sub">${o.sub}</div></div>
        <div class="cols"><div class="col"><h4>${built}</h4><p>${o.wired}</p></div><div class="col"><h4>What you hear</h4><p>${o.sound}</p></div></div>
        <div class="conf"><span class="pill u">Start</span><span>Step through with the arrows, or tap a part in the drawing. ${o.start}</span></div>`;
      return; }
    const s=REC.stages[current], L=REC.layers.find(l=>l.id===s.layer), c=REC.conf[s.conf];
    d.innerHTML=`<div class="detail-head"><div class="eyebrow"><span class="dot" style="background:${L.color}"></span>Stage ${String(current+1).padStart(2,'0')} of ${n} · ${L.label}</div><h2>${s.title}</h2><div class="sub">${s.sub}</div></div>
      <div class="cols"><div class="col"><h4>${built}</h4><p>${s.wired}</p></div><div class="col"><h4>What you hear</h4><p>${s.sound}</p></div></div>
      <div class="conf"><span class="pill ${c[1]}">${c[0]}</span><span>${s.confText}</span></div>`;
  }
  function apply(scroll){
    const amp=$('amp'), id=current<0?null:REC.stages[current].id;
    amp.classList.toggle('sel',!!id);
    amp.querySelectorAll('[data-stage]').forEach(e=>e.classList.toggle('on',!!id&&e.dataset.stage.split(' ').includes(id)));
    amp.querySelectorAll('.mk').forEach(e=>e.classList.toggle('on',e.dataset.mk===id));
    amp.querySelectorAll('[data-layer]').forEach(e=>e.classList.toggle('layer-off',layer!=='all'&&e.dataset.layer!==layer));
    document.querySelectorAll('[data-layer-btn]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.layerBtn===layer));
    document.querySelectorAll('.step').forEach(b=>{ const on=+b.dataset.step===current; b.setAttribute('aria-current',on); if(on&&scroll) b.scrollIntoView({block:'nearest',inline:'center',behavior:'smooth'}); });
    renderDetail();
    /* on a phone the drawing is wider than the screen: bring the selected part into view */
    const sc=$('figscroll');
    if(scroll&&id&&sc.scrollWidth>sc.clientWidth+4){
      const x=REC.stages[current].mk[0]/VBW*sc.scrollWidth;
      sc.scrollTo({left:Math.max(0,x-sc.clientWidth/2),behavior:'smooth'});
    }
  }
  function select(i,scroll=true){ current=i; if(i>=0&&layer!=='all'&&REC.stages[i].layer!==layer) layer='all'; apply(scroll); }
  const selectId = id => select(REC.stages.findIndex(s=>s.id===id));

  function openGear(rec){ REC=rec; current=-1; layer='all'; drawFigure(); renderStatic(); apply(false); $('figscroll').scrollLeft=0; }

  function bind(){
    $('amp').addEventListener('click',e=>{
      const mk=e.target.closest('[data-mk]'); if(mk) return selectId(mk.dataset.mk);
      const st=e.target.closest('[data-stage]'); if(!st) return select(-1);
      const ids=st.dataset.stage.split(' '), cur=current<0?null:REC.stages[current].id;
      selectId(ids[(ids.indexOf(cur)+1)%ids.length]);   /* a part shared by two stages alternates between them */
    });
    $('amp').addEventListener('keydown',e=>{ const mk=e.target.closest('[data-mk]'); if(mk&&(e.key==='Enter'||e.key===' ')){ e.preventDefault(); selectId(mk.dataset.mk); } });
    $('steps').addEventListener('click',e=>{ const b=e.target.closest('.step'); if(b) select(+b.dataset.step); });
    $('layers').addEventListener('click',e=>{ const b=e.target.closest('[data-layer-btn]'); if(!b) return; layer=b.dataset.layerBtn; if(current>=0&&layer!=='all'&&REC.stages[current].layer!==layer) current=-1; apply(false); });
    $('prev').addEventListener('click',()=>select(current<=-1?REC.stages.length-1:current-1));
    $('next').addEventListener('click',()=>select(current>=REC.stages.length-1?-1:current+1));
    $('sigs').addEventListener('click',e=>{ const b=e.target.closest('[data-goto]'); if(!b) return; selectId(b.dataset.goto); $('figscroll').scrollIntoView({behavior:'smooth',block:'start'}); });
    document.addEventListener('keydown',e=>{ if(!REC||$('view-gear').hidden) return; if(e.key==='ArrowRight') $('next').click(); if(e.key==='ArrowLeft') $('prev').click(); });
  }

  /* ---------- routing: #studio (default) or #<record hash> ---------- */
  function routeTo(){
    const h=location.hash.replace('#',''), rec=order.map(id=>gear[id]).find(r=>r.hash===h);
    $('view-studio').hidden=!!rec; $('view-gear').hidden=!rec;
    if(rec) openGear(rec); else STUDIO.center();
    window.scrollTo(0,0);
  }
  function start(){ bind(); window.addEventListener('hashchange',routeTo); routeTo(); }

  return { register(rec){ gear[rec.hash]=rec; order.push(rec.hash); }, gear, order, start, GENRE, FAMILY_COLOR, helpers:{ route, coil, zig, ground } };
})();
