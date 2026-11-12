/* Equipment Map record: Fender Bassman 70 (drawn as a c.1979 silver-panel head).
   Registers itself with the engine: the record, the cutaway drawing and a small view for the studio room. */
(function(){
const { coil } = EQ.helpers;
let tag, wire, block, node;

const LAYERS = [
  { id:'all',    label:'Everything' },
  { id:'signal', label:'Signal path',       color:'var(--sig)' },
  { id:'power',  label:'Power supply',      color:'var(--pwr)' },
  { id:'loop',   label:'Bias and feedback', color:'var(--ctl)' }
];

const BASIS = {
  documented:{ label:'Documented', cls:'v', text:'a sourced use of this exact model (none yet)' },
  family:    { label:'Family',     cls:'m', text:'reported for sibling silver-panel Bassman heads, mostly crowd-sourced' },
  fit:       { label:'Design fit', cls:'u', text:'inferred from the circuit and the production years' },
  lineage:   { label:'Lineage',    cls:'u', text:'belongs to an ancestor of this model' }
};

const CONF = { v:['Checked','v'], m:['Partly from memory','m'] };

const EQUIPMENT = {
  id:'fender-bassman-70', name:'Fender Bassman 70', maker:'Fender', kind:'Tube bass amplifier head', years:[1977,1983], drawnAs:1979,
  specs:[['Built','1977–83'],['Output','70 W RMS'],['Preamp','3 × 7025'],['Inverter','12AT7'],['Power','2 × 6L6GC'],['Output stage','ultralinear'],['Rectifier','silicon'],['Load','4 Ω'],['Cabinet','2 × 15″']],

  stages:[
    { id:'inputs', layer:'signal', mk:[50,205], title:'Inputs', sub:'Two channels, two jacks each',
      wired:'Each channel has a full-sensitivity jack (1) and a padded jack (2) that halves the signal for hot instruments. The Bass Instrument and Normal channels are separate preamps that only meet at the mixer.',
      sound:'Jack 2 keeps an active bass or a humbucker from overdriving the first tube. Because the channels stay separate until the mix, each keeps its own voicing all the way through.',
      conf:'m', confText:'Two channels with two inputs each are confirmed by listings. The half-level pad on jack 2 is standard Fender practice, not checked for this model.' },
    { id:'preamp', layer:'signal', mk:[114,336], title:'First gain stage', sub:'V1 and V2 · 7025',
      wired:'Each channel starts with one half of a 7025, the low-noise grade of the 12AX7. That triode lifts the pickup signal by a factor of several dozen before any tone shaping happens.',
      sound:'Kept in its linear range the stage is clean and wide-band. At this point the character comes from the instrument and from how hard it is played into the tube.',
      conf:'m', confText:'7025 preamp tubes are confirmed. Which half of which tube does this job is the usual Bassman arrangement, not read from the factory drawing.' },
    { id:'tone', layer:'signal', mk:[326,173], title:'Tone stacks', sub:'Treble · Bass · Deep · Bright',
      wired:'A passive resistor and capacitor network sits between the two halves of each channel’s tube. It can only cut, and it discards most of the signal even with both knobs up, which is why a second triode follows it. The Bass channel’s network is tuned lower and adds the Deep switch. The Normal channel has a Bright switch, a small capacitor (120 pF in this family) that lets treble slip past the volume control at low settings.',
      sound:'The network has a dip in the mids built in: the scooped Fender curve. Neither channel has a Middle control, so the depth of that dip is fixed. On guitar the Bass channel is darker and rounder, and the Normal channel with Bright on is the glassy one.',
      conf:'v', confText:'Control layout and both switches are confirmed by 1979 and 1980 listings; the 120 pF bright cap and the bass-voiced Deep network come from tech discussion of the wider Bassman family.' },
    { id:'volmix', layer:'signal', mk:[633,205], title:'Volume, recovery and mix', sub:'V1b · V2b · V3',
      wired:'After each tone stack come that channel’s Volume control and a second triode, which makes up the level the stack lost. The two channels then meet through mixing resistors, and the third 7025 adds make-up gain for the combined signal.',
      sound:'Volume decides how hard everything downstream is driven, so once the Master is in play it works as a gain control. Both channels reach the power amp at similar strength, so either can be the main voice.',
      conf:'m', confText:'Value guides list three 7025s; some listings show two. The split of duties across V1 to V3 follows the Bassman 50 era circuit from memory.' },
    { id:'master', layer:'signal', mk:[737,207], title:'Master volume', sub:'The addition over the Bassman 50',
      wired:'One control after the mixer and ahead of the phase inverter sets how much of the preamp’s output reaches the power amp.',
      sound:'Volume up with Master down gives preamp-only overdrive at room level. The 6L6s and the output transformer are not being pushed, so that distortion is thinner and buzzier than a cranked amp without a master. Most players leave Master high and use the amp clean.',
      conf:'m', confText:'The master volume itself is confirmed. Its position ahead of the phase inverter follows Fender’s other silver-panel master-volume circuits.' },
    { id:'pi', layer:'signal', mk:[711,340], title:'Phase inverter', sub:'V4 · 12AT7 long-tailed pair',
      wired:'The 12AT7 splits the signal into two mirror-image copies, one for each power tube. It is also where the feedback signal from the speaker output comes back in.',
      sound:'A long-tailed pair has gain of its own and stays symmetrical when pushed, so the power tubes receive clean drive right up to full output.',
      conf:'v', confText:'A 12AT7 long-tailed pair is confirmed by listings.' },
    { id:'power', layer:'signal', mk:[817,400], title:'Power tubes', sub:'V5 and V6 · 6L6GC push-pull',
      wired:'Two 6L6GC beam tetrodes work in push-pull: each handles one half of the waveform and the output transformer joins the halves again. Bias is fixed, set by a negative voltage on the grids instead of a cathode resistor.',
      sound:'Fixed-bias 6L6s give the firm lows and hard, bell-like top of large Fenders. Push-pull cancels hum and even-order distortion, which is a large part of why the amp reads as clean.',
      conf:'v', confText:'Two 6L6GC in fixed bias are confirmed.' },
    { id:'ot', layer:'signal', mk:[1073,250], title:'Ultralinear output transformer', sub:'The part that defines this amp',
      wired:'In earlier Bassmans the 6L6 screen grids run from their own filtered supply through a choke. Here each screen connects to a tap partway along its half of the transformer primary, so a fraction of the output voltage returns to the screen on every cycle. That local feedback puts the tube between pentode and triode operation. Fender deleted the choke when it adopted the design.',
      sound:'More clean power from the same two tubes (70 W against the Bassman 50’s 50), lower distortion and a firmer grip on the speaker. The cost is feel: less compression, and clipping that arrives late and abruptly. This is why players call these amps loud, clean and stiff, and why some rewire them for conventional pentode operation.',
      conf:'v', confText:'Ultralinear operation and the rise to 70 W are confirmed; the choke deletion is documented for the Twin Reverb of the same years.' },
    { id:'cab', layer:'signal', mk:[1284,172], title:'Speaker cabinet', sub:'2 × 15″ · 4 Ω',
      wired:'The matching enclosure holds two 15-inch, 8 Ω speakers wired in parallel for a 4 Ω load. Surviving cabinets carry CTS, Eminence or JBL drivers.',
      sound:'Fifteens move a lot of air and roll off early at the top, so the full stack is deep and soft-edged. Through 10s or 12s the same head is noticeably brighter and reads as a guitar amp.',
      conf:'v', confText:'2×15 at 4 Ω is confirmed by cabinet listings. The factory driver for 1979 is not settled.' },

    { id:'mains', layer:'power', mk:[1166,250], title:'Mains and power transformer', sub:'Three secondary windings',
      wired:'Wall power passes the fuse and power switch on the rear panel into the power transformer. Its secondaries supply high voltage for the plates, a tap for the negative bias supply, and 6.3 V AC for every tube heater and the pilot lamp.',
      sound:'It has no voice of its own, but its size sets how much current the amp can deliver before the supply droops under a loud low note.',
      conf:'m', confText:'Standard arrangement for the type; winding details were not read from the schematic.' },
    { id:'rect', layer:'power', mk:[1155,607], title:'Solid-state rectifier', sub:'Silicon diodes, no rectifier tube',
      wired:'Silicon diodes turn the high-voltage AC into DC.',
      sound:'A rectifier tube loses voltage as the amp draws current, which players feel as sag, a soft squeeze on each attack. Diodes do not, so notes start hard and hold their level. That suits bass definition and clean pedal tones.',
      conf:'v', confText:'A solid-state rectifier is confirmed.' },
    { id:'filter', layer:'power', mk:[1077,607], title:'Filter caps and B+ rail', sub:'About 500 V DC at the top of the chain',
      wired:'Electrolytic capacitors smooth the rectified DC into the B+ supply. It is near 500 V at the output transformer centre tap, and dropping resistors step it down for the phase inverter and then the preamp. The standby switch interrupts this supply while the heaters warm up.',
      sound:'High voltage and stiff filtering are where the headroom comes from. Tired filter capacitors are the usual cause of hum and loose lows in a 45-year-old example.',
      conf:'m', confText:'The voltage is one owner’s measurement (523 V) from a tech forum, not a factory figure.' },

    { id:'bias', layer:'loop', mk:[880,160], title:'Bias supply and balance', sub:'About −52 V on the 6L6 grids',
      wired:'A tap on the power transformer is rectified to a negative voltage and applied to both 6L6 grids to set their idle current. The trim pot on this model is a balance control: it shifts one tube against the other across roughly −45 to −57 V and is set for minimum hum. It does not set the overall level.',
      sound:'Balanced tubes keep hum down. Because the overall idle current is fixed by resistor values, many techs convert the pot to a true level adjustment so that current-production 6L6s can be set correctly.',
      conf:'v', confText:'Voltage, range and the set-for-minimum-hum procedure come from owner and tech reports on this model.' },
    { id:'nfb', layer:'loop', mk:[826,538], title:'Negative feedback loop', sub:'Speaker output back to the phase inverter',
      wired:'A portion of the speaker output returns to the phase inverter in opposite polarity, so the power amp corrects its own errors.',
      sound:'Flatter response, lower distortion and a damped, controlled low end. Together with the ultralinear taps there are two feedback mechanisms at work, which is how the amp stays clean so far up the dial.',
      conf:'m', confText:'Standard for Fender amps of the period; the loop was not read from the schematic.' }
  ],

  signatures:[
    { stage:'ot',     what:'Ultralinear output stage',            hear:'Clean almost to full power, then a late, hard clip. Little compression.', use:'Loud clean bass. A guitar or keyboard platform where pedals supply the colour.' },
    { stage:'rect',   what:'Silicon rectifier on a 500 V supply', hear:'No sag. Attacks stay sharp and level under heavy playing.',               use:'Tight low end, percussive parts, fast picked lines.' },
    { stage:'nfb',    what:'Global negative feedback',            hear:'Flat, wide response with a damped speaker.',                              use:'Predictable EQ. What you put in front is what comes out.' },
    { stage:'tone',   what:'Passive stacks with no Middle knob',  hear:'A fixed mid scoop; Bass channel dark, Normal channel glassy.',            use:'Sits under vocals and horns. Add mids outside the amp for guitar.' },
    { stage:'master', what:'Master ahead of the phase inverter',  hear:'Preamp-only overdrive: thin and buzzy next to power-tube breakup.',       use:'A quiet grit layer, not the main roar.' },
    { stage:'cab',    what:'Two 15-inch speakers',                hear:'Deep lows and a soft top end.',                                           use:'Change the cabinet to re-voice the whole amp.' }
  ],

  usesIntro:'Every link carries its basis. The search found no sourced recording credit for the 70 itself, so nothing is marked documented. The tracks listed belong to sibling and ancestor amps, and each one says which.',
  uses:[
    { title:'As built: a working bass rig', basis:['fit','family'],
      text:'Seventy clean watts into two 15s is a club and studio bass rig, not an arena one. The stiff supply and heavy feedback keep fingerstyle and picked lines even and defined, which suits bass parts that sit under horns, keys and vocals. Its production years put it on the same small stages as the first wave of bands buying used and mid-priced Fender heads.',
      genres:['beat','funk','soul','disco','reggae','country','newwave','postpunk'],
      tracks:[
        { g:'beat', t:'Get Back', a:'The Beatles', y:1969, src:'v', note:'Paul McCartney’s bass ran through a 1968 silver-panel Bassman head and 2×15 cabinet for these sessions. That is the 50-watt predecessor, before the ultralinear output.' }
      ] },
    { title:'Second life: a clean guitar platform', basis:['family','fit'],
      text:'Low used prices and the late, hard clip made silver-panel Bassman heads a common guitar amp for players who get dirt and space from pedals. Owners of the 70 describe a classic Fender clean that takes pedals well and is quieter than its rating suggests. Crowd-sourced gear listings attribute silver-panel Bassman heads to Steve Albini, Kurt Vile and Billy Corgan and to records by Electric Wizard and the Smashing Pumpkins. None of those entries is confirmed for the 70 itself.',
      genres:['indie','noiserock','shoegaze','garage','alternative','neopsych','stonerrock','doom'],
      noTracks:'The crowd-sourced credits name players and albums, not tracks, so none is listed.' },
    { title:'Ancestry: the bass amp guitarists took over', basis:['lineage'],
      text:'The 1958 tweed 5F6-A Bassman was adopted by guitarists almost at once, and its circuit was the template for the first Marshall, the JTM45. The 70 is the last and cleanest branch of that line. Each revision after the tweed moved further from the breakup the original was loved for.',
      genres:['rockabilly','hardrock','chicago','rocknroll','beat'],
      tracks:[
        { g:'rockabilly', t:'Stray Cat Strut', a:'Stray Cats', y:1981, src:'r', note:'Brian Setzer’s documented rig is a Gretsch into blonde 6G6-B Bassman heads, the early-60s piggyback. No source ties this track to one amp.' },
        { g:'hardrock', t:'All Your Love', a:'John Mayall & the Bluesbreakers with Eric Clapton', y:1966, src:'v', note:'Recorded on a Marshall 1962 combo, a JTM45 in combo form, whose circuit was copied from the Bassman. The British blues tone that hard rock grew from.' }
      ] }
  ],

  lineage:[
    { year:'1952', name:'Bassman 5B6', note:'1×15 combo launched as the partner to the Precision Bass.' },
    { year:'1958', name:'5F6-A tweed', note:'4×10 combo. Guitarists adopt it.', bridge:'<b>1962 · Marshall JTM45</b> copies the circuit and seeds British hard rock.' },
    { year:'1961', name:'6G6 blonde', note:'First piggyback head and cabinet.' },
    { year:'1964', name:'AA864 · AB165', note:'Black-panel heads. Silicon rectifier, more feedback, cleaner.' },
    { year:'1968', name:'Silver-panel Bassman', note:'Renamed Bassman 50 in 1972.' },
    { year:'1977', name:'Bassman 70', note:'Ultralinear output and a master volume. Discontinued 1983.', here:true }
  ],

  notes:[
    ['Bass','Bass channel, Deep off, Master high. Blend a DI with a microphone on one of the 15s to get string definition and cone together.'],
    ['Guitar','Normal channel with Bright on. Expect headroom well past the point where a small room needs it, and shape breakup with pedals in front.'],
    ['Low-volume dirt','Volume high and Master low gives preamp fizz. It works better as a texture under a clean take than as the main rhythm sound.'],
    ['Re-voice with the cabinet','A 2×12 or 4×10 presenting 4 Ω brings back the upper mids that 15s remove.'],
    ['Keys and re-amping','Flat, loud and clean makes it a useful re-amp target for electric piano, synths and drum machines when the aim is air and cone movement without grit.'],
    ['Look after it','Always keep a 4 Ω load connected. A tube output stage run with no speaker can destroy its output transformer.']
  ],

  sources:[
    ['Mojotone field guide: silverface Bassman','https://mojotone.com/blogs/fender-field-guide/fender-silverface-bassman'],
    ['Wikipedia: Fender Bassman','https://en.wikipedia.org/wiki/Fender_Bassman'],
    ['GuitarPoint: 1979 Bassman 70','https://guitarpoint.de/product/1979-fender-bassman-70-silverface/'],
    ['Blue Book: Bassman 70','https://bluebookofguitarvalues.com/products/fender-bassman-70'],
    ['Reverb: 1979 2×15 Bassman 70 enclosure','https://reverb.com/item/90439510-1979-fender-2x15-speaker-enclosure-bassman-70-cabinet-cab-with-cts-alnico-speaker'],
    ['diyAudio: Fender Bassman 70','https://www.diyaudio.com/community/threads/fender-bassman-70.356898/'],
    ['EL34 World: Bassman 70 troubles','https://el34world.com/Forum/index.php?topic=23948.0'],
    ['Amp Repair Parts: ultralinear transformers','https://amprepairparts.com/xformer.htm'],
    ['TDPRI: 1979 Bassman 70 owner thread','https://www.tdpri.com/threads/new-old-amp-day-1979-fender-bassman-70.565357/'],
    ['Equipboard: Bassman 70 (crowd-sourced)','https://equipboard.com/items/fender-bassman-70-silverface-head'],
    ['Reverb: the gear of Let It Be','https://reverb.com/news/the-gear-of-the-beatles-let-it-be'],
    ['Guitar World: Clapton’s Beano tone','https://www.guitarworld.com/artists/guitarists/how-eric-clapton-got-his-tone-on-john-mayall-and-the-bluesbreakers-beano-album'],
    ['Reverb: the gear of Brian Setzer','https://reverb.com/news/rock-this-tone-the-gear-and-sound-of-brian-setzer']
  ]
};


const TEXT = {
  hash:'bassman-70', eyebrow:'Amplifier', title:'Fender Bassman 70', roomLabel:'BASSMAN 70',
  lede:'A 70-watt tube bass head built from 1977 to 1983, drawn here as a 1979 silver-panel unit. It is the Bassman 50 circuit with a master volume and an ultralinear output stage, and that one change at the output transformer explains most of how it sounds.',
  viewBox:[1480,650], builtLabel:'How it is wired',
  aria:'Cutaway of a Fender Bassman 70 head and its 2 by 15 cabinet. Signal runs left to right from the input jacks through three 7025 preamp tubes, a 12AT7 phase inverter and two 6L6GC power tubes into an ultralinear output transformer. The power supply feeds every stage from below.',
  caption:'Front view with the grille cloth cut away. Drag sideways on a phone. Parts sit in their real left-to-right order; wiring is simplified to one line per connection and the cabinet is not to scale. <span style="color:var(--sig)">Amber</span> is audio, <span style="color:var(--pwr)">red</span> is the high-voltage supply, <span style="color:var(--ctl)">blue</span> is bias and feedback, dashed amber is the pair of ultralinear screen taps.',
  overview:{ title:'Built to stay clean', sub:'Follow the amber line from left to right',
    wired:'Two separate preamp channels, each a tube stage, a passive tone stack and a recovery stage, are mixed and passed through one master volume. A 12AT7 splits the result for a push-pull pair of 6L6GCs, whose screen grids are tied to taps on the output transformer. Silicon diodes and a supply near 500 V feed all of it from the right.',
    sound:'Every large decision points the same way: more clean power and less give. Loud, flat and firm in the lows, with breakup that arrives late and suddenly. Players who want the amp to stay out of the way prize it; players who want it to sing when pushed usually modify it.',
    start:'Fourteen stages: nine follow the signal, three the power supply, two the control loops.' },
  lineageTitle:'The Bassman line, 1952 to 1983',
  lineageIntro:'Equipment has descent the same way genres do. The 70 is the last tube branch of a line whose most famous member was a bass amp that guitarists adopted.',
  notesEyebrow:'In the room', notesTitle:'Using one',
  notesIntro:'These follow from the circuit and from owner reports. Treat them as starting points to test by ear.',
  provenance:{ intro:'The factory schematic could not be opened while this was drawn, so the wiring is shown at block level and no component values are claimed beyond the ones listed as checked.',
    lists:[
      { pill:'Checked', cls:'v', title:'Against listings, value guides and tech forums', items:[
        'Built 1977 to 1983 as the Bassman 50 with 70 W RMS, an ultralinear output section and a master volume.',
        'Two 6L6GC power tubes, a 12AT7 long-tailed phase inverter, 7025 preamp tubes, solid-state rectifier, fixed bias.',
        'Bass channel: Deep switch, Volume, Treble, Bass. Normal channel: Bright switch, Volume, Treble, Bass. No Middle control.',
        'Bias trim is a balance control, about −52 V, adjustable roughly −45 to −57 V, set for minimum hum.',
        'Matching 2×15 enclosure, two 8 Ω speakers in parallel for 4 Ω.',
        'Silver panel until 1980, black panel from late 1980.',
        'Ultralinear means screen grids fed from taps on the output transformer primary; Fender dropped the screen choke when it adopted the design.',
        'Track credits marked Checked, at the level each note states.' ] },
      { pill:'From memory', cls:'m', title:'General Fender practice, not confirmed for this model', items:[
        'Which triode does which job in V1 to V3. Sources also disagree on the count: value guides list three 7025s, some listings two.',
        'Master volume placed after the channel mix and ahead of the phase inverter.',
        'Global feedback returned from the speaker output to the phase inverter.',
        'Input 2 padded to half level; standby interrupting the high-voltage supply.',
        'B+ near 500 V comes from a single owner measurement (523 V), not a factory chart.',
        'Lineage dates before 1972, and the vertical layout of the 2×15 cabinet.',
        'This amp is not on your equipment sheet; it is in the room because you asked for it first.' ] }
    ] },
  footer:'Reference drawing for understanding signal flow. It is not a service guide: filter capacitors in a tube amplifier hold a lethal charge after the amp is unplugged. Fender and Bassman are trademarks of Fender Musical Instruments Corporation, used here descriptively; this page is not affiliated with or endorsed by Fender.'
};

/* ---- drawing: 1480 x 650 box, one helper per kind of part ---- */
const PIN=272;
function smallTube(cx,name,type,stage){
  return `<g ${tag(stage)}>
    <rect x="${cx-40}" y="${PIN}" width="80" height="12" rx="3" class="lnf"/>
    <path d="M${cx-22} 284 V378 Q${cx-22} 398 ${cx-6} 400 L${cx} 408 L${cx+6} 400 Q${cx+22} 398 ${cx+22} 378 V284 Z" fill="url(#gGlass)" class="ln"/>
    <ellipse cx="${cx}" cy="334" rx="17" ry="40" fill="url(#gGlow)"/>
    <rect x="${cx-15}" y="304" width="11" height="58" rx="2" class="ln"/><rect x="${cx+4}" y="304" width="11" height="58" rx="2" class="ln"/>
    <path d="M${cx-9.5} 300 V366 M${cx+9.5} 300 V366" stroke="#ffb866" stroke-width="1" opacity=".75"/>
    <path d="M${cx-17} 372 H${cx+17}" class="ln"/>
    <text x="${cx}" y="446" text-anchor="middle" class="tname">${name}</text>
    <text x="${cx}" y="459" text-anchor="middle" class="lbl-s">${type}</text>
  </g>`;
}
function bigTube(cx,name,stage){
  return `<g ${tag(stage)}>
    <rect x="${cx-45}" y="${PIN}" width="90" height="12" rx="3" class="lnf"/>
    <path d="M${cx-32} 284 V428 Q${cx-32} 462 ${cx} 464 Q${cx+32} 462 ${cx+32} 428 V284 Z" fill="url(#gGlass)" class="ln"/>
    <ellipse cx="${cx}" cy="356" rx="24" ry="60" fill="url(#gGlow)"/>
    <rect x="${cx-19}" y="308" width="38" height="98" rx="5" class="ln"/>
    <path d="M${cx-11} 316 V398 M${cx} 316 V398 M${cx+11} 316 V398" class="ln" opacity=".55"/>
    <path d="M${cx} 302 V412" stroke="#ffb866" stroke-width="1.2" opacity=".8"/>
    <path d="M${cx-24} 296 H${cx+24}" class="ln"/>
    <text x="${cx}" y="432" text-anchor="middle" class="tname">${name}</text>
    <text x="${cx}" y="446" text-anchor="middle" class="lbl-s">6L6GC</text>
  </g>`;
}
const knob=(x,label,stage)=>`<g ${tag(stage)}><circle class="kring" cx="${x}" cy="84" r="21"/><circle cx="${x}" cy="84" r="16" fill="#191c21" stroke="#3a3f47"/><circle cx="${x}" cy="84" r="8.5" fill="#cdd1d7"/><path d="M${x} 84 L${x+6} 71" stroke="#191c21" stroke-width="2" stroke-linecap="round"/><text x="${x}" y="119" text-anchor="middle" class="pan-t">${label}</text></g>`;
const jack=(x,label,stage)=>`<g ${tag(stage)}><circle class="kring" cx="${x}" cy="88" r="13"/><circle cx="${x}" cy="88" r="8.5" fill="#8e949d" stroke="#4b5059"/><circle cx="${x}" cy="88" r="3.6" fill="#0b0d11"/><text x="${x}" y="119" text-anchor="middle" class="pan-t">${label}</text></g>`;
const sw=(x,label,stage)=>`<g ${tag(stage)}><rect class="kring" x="${x-11}" y="68" width="22" height="34" rx="6"/><rect x="${x-6}" y="73" width="12" height="24" rx="3" fill="#191c21" stroke="#3a3f47"/><rect x="${x-3.5}" y="76" width="7" height="10" rx="2" fill="#cdd1d7"/><text x="${x}" y="119" text-anchor="middle" class="pan-t">${label}</text></g>`;
function drawAmp(){
  const s=[];
  s.push(`<defs>
    <linearGradient id="gPanel" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e6e9ed"/><stop offset=".55" stop-color="#cfd3d9"/><stop offset="1" stop-color="#b3b8c0"/></linearGradient>
    <linearGradient id="gGlass" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="rgba(190,210,230,.16)"/><stop offset=".5" stop-color="rgba(190,210,230,.03)"/><stop offset="1" stop-color="rgba(190,210,230,.12)"/></linearGradient>
    <radialGradient id="gGlow"><stop offset="0" stop-color="rgba(255,160,60,.5)"/><stop offset="1" stop-color="rgba(255,160,60,0)"/></radialGradient>
    <radialGradient id="gCone"><stop offset="0" stop-color="#1c2027"/><stop offset=".3" stop-color="#11141a"/><stop offset="1" stop-color="#171b21"/></radialGradient>
    <pattern id="grille" width="7" height="7" patternUnits="userSpaceOnUse"><path d="M0 7 L7 0 M0 0 L7 7" stroke="rgba(190,205,225,.055)" stroke-width="1"/></pattern>
  </defs>`);

  /* ---- head cabinet ---- */
  s.push(`<rect x="20" y="20" width="1180" height="605" rx="14" fill="#0c0e12" stroke="#4b515b" stroke-width="1.6"/>`);
  s.push(`<rect x="70" y="625" width="46" height="9" rx="2" fill="#1a1d22"/><rect x="1104" y="625" width="46" height="9" rx="2" fill="#1a1d22"/>`);
  s.push(`<rect x="40" y="276" width="1140" height="333" rx="4" fill="url(#grille)" stroke="rgba(255,255,255,.07)"/>`);
  /* chassis interior */
  s.push(`<rect x="40" y="138" width="1140" height="128" rx="4" fill="#0f1218" stroke="rgba(255,255,255,.09)"/>`);
  s.push(`<text x="1172" y="154" text-anchor="end" class="lbl-s">INSIDE THE CHASSIS</text>`);
  s.push(`<path d="M40 269 H1180" stroke="#6d7480" stroke-width="3.5" stroke-linecap="round"/>`);
  s.push(`<text x="48" y="600" class="lbl-s">GRILLE CLOTH CUT AWAY · TUBES HANG FROM THE CHASSIS</text>`);

  /* ---- control panel ---- */
  s.push(`<rect x="40" y="40" width="1140" height="88" rx="4" fill="url(#gPanel)"/>`);
  s.push(`<path d="M322 48 V120 M626 48 V120 M758 48 V120" stroke="#1d3f86" stroke-width="1" opacity=".45"/>`);
  s.push(`<text x="182" y="58" text-anchor="middle" class="pan-t">BASS INSTRUMENT</text><text x="462" y="58" text-anchor="middle" class="pan-t">NORMAL</text>`);
  s.push(jack(72,'1','inputs')+jack(104,'2','inputs')+sw(142,'DEEP','tone')+knob(192,'VOLUME','volmix')+knob(242,'TREBLE','tone')+knob(288,'BASS','tone'));
  s.push(jack(352,'1','inputs')+jack(384,'2','inputs')+sw(422,'BRIGHT','tone')+knob(472,'VOLUME','volmix')+knob(522,'TREBLE','tone')+knob(568,'BASS','tone'));
  s.push(knob(690,'MASTER VOLUME','master'));
  s.push(`<text x="950" y="95" text-anchor="middle" style="font-family:'Spectral',Georgia,serif;font-style:italic;font-weight:500;font-size:30px;fill:#1d3f86">Bassman 70</text>`);
  s.push(`<g ${tag('mains')}><circle cx="1146" cy="84" r="11" fill="#7c1f1b" stroke="#3a3f47"/><circle cx="1146" cy="84" r="6.5" fill="#ff5a4d"/><circle cx="1143.5" cy="81.5" r="2" fill="#ffd0c8"/></g>`);

  /* ---- power: drawn first so audio sits on top at crossings ---- */
  s.push(wire([[1226,330],[1186,330]],'mains','mains'));
  s.push(`<g ${tag('mains')}><rect x="1226" y="321" width="16" height="18" rx="3" class="lnf"/><path d="M1242 326 H1250 M1242 334 H1250" class="ln" stroke-width="2"/><text x="1232" y="312" text-anchor="middle" class="lbl-s">MAINS</text></g>`);
  s.push(wire([[1160,470],[1160,535]],'pwr','rect'));
  s.push(wire([[1124,562],[1112,562]],'pwr','filter'));
  s.push(wire([[1054,385],[1066,385],[1066,535]],'pwr','filter'));
  s.push(wire([[1042,562],[134,562]],'pwr','filter'));
  for(const x of [734,596,414,134]) s.push(wire([[x,562],[x,284]],'pwr','filter'));
  for(const x of [734,596,414]) s.push(node(x,562,'pwr','filter'));
  for(const x of [900,668]) s.push(`<g ${tag('filter')}><rect x="${x-15}" y="556" width="30" height="12" rx="2" fill="#0b0d11" stroke="var(--pwr)" stroke-width="1.6"/></g>`);
  s.push(`<g ${tag('filter')}><text x="1032" y="553" text-anchor="end" class="lbl" fill="var(--pwr)" style="fill:var(--pwr)">≈ 500 V</text><text x="300" y="580" class="lbl-s">B+ RAIL · STEPPED DOWN AT EACH RESISTOR ON ITS WAY TO THE PREAMP</text></g>`);

  /* ---- loops ---- */
  s.push(wire([[1136,290],[1136,191],[996,191]],'ctl','bias'));
  s.push(wire([[896,214],[896,230],[858,230],[858,PIN]],'ctl','bias'));
  s.push(wire([[962,214],[962,PIN]],'ctl','bias'));
  s.push(wire([[1092,516],[802,516],[802,284]],'ctl','nfb'));

  /* ---- audio ---- */
  /* bass channel */
  s.push(wire([[72,98],[72,262],[143,262],[143,PIN]],'sig','inputs'));
  s.push(wire([[104,98],[104,150],[72,150]],'sig','inputs',{noflow:1})+node(72,150,'sig','inputs'));
  s.push(wire([[161,PIN],[161,165],[220,165]],'sig','tone'));
  s.push(wire([[232,196],[232,232],[215,232]],'sig','volmix'));
  s.push(wire([[179,250],[179,PIN]],'sig','volmix'));
  s.push(wire([[197,PIN],[197,262],[255,262],[255,425],[578,425],[578,250]],'sig','volmix'));
  /* normal channel */
  s.push(wire([[352,98],[352,262],[423,262],[423,PIN]],'sig','inputs'));
  s.push(wire([[384,98],[384,150],[352,150]],'sig','inputs',{noflow:1})+node(352,150,'sig','inputs'));
  s.push(wire([[441,PIN],[441,165],[500,165]],'sig','tone'));
  s.push(wire([[512,196],[512,232],[495,232]],'sig','volmix'));
  s.push(wire([[459,250],[459,PIN]],'sig','volmix'));
  s.push(wire([[477,PIN],[477,262],[524,262],[524,232],[540,232]],'sig','volmix'));
  /* mix, V3, master, inverter */
  s.push(wire([[590,232],[603,232],[603,PIN]],'sig','volmix'));
  s.push(wire([[621,PIN],[621,232],[664,232]],'sig','master'));
  s.push(wire([[716,232],[752,232],[752,PIN]],'sig','master'));
  s.push(wire([[779,PIN],[779,258],[845,258],[845,PIN]],'sig','pi'));
  s.push(wire([[794,PIN],[794,246],[949,246],[949,PIN]],'sig','pi'));
  /* plates to the transformer */
  s.push(wire([[904,284],[904,502],[1030,502],[1030,445],[1054,445]],'sig','power'));
  s.push(wire([[1014,284],[1014,325],[1054,325]],'sig','power'));
  /* screens to the ultralinear taps */
  s.push(wire([[910,284],[910,490],[1022,490],[1022,415],[1054,415]],'sig','ot',{dash:'6 4',noflow:1}));
  s.push(wire([[1008,284],[1008,355],[1054,355]],'sig','ot',{dash:'6 4',noflow:1}));
  s.push(`<text x="938" y="483" class="lbl-s" ${tag('ot')} style="fill:var(--sig)">SCREEN TAPS</text>`);
  /* speaker line */
  s.push(wire([[1092,425],[1092,516],[1200,516],[1262,516]],'sig','cab'));
  s.push(node(1092,516,'sig','cab'));
  s.push(`<text x="1231" y="507" text-anchor="middle" class="lbl" ${tag('cab')}>4 Ω</text>`);
  s.push(`<text x="843" y="542" class="lbl-s" ${tag('nfb')} style="fill:var(--ctl)">FEEDBACK LOOP</text>`);

  /* ---- blocks in the chassis ---- */
  s.push(block(220,150,90,46,'sig','tone',['TONE STACK','bass-voiced']));
  s.push(block(170,214,45,36,'sig','volmix',['VOL']));
  s.push(block(500,150,90,46,'sig','tone',['TONE STACK','+ bright cap']));
  s.push(block(450,214,45,36,'sig','volmix',['VOL']));
  s.push(block(540,214,50,36,'sig','volmix',['MIX']));
  s.push(block(664,214,52,36,'sig','master',['MASTER']));
  s.push(block(884,168,112,46,'ctl','bias',['BIAS −52 V','balance trim']));

  /* ---- tubes ---- */
  s.push(smallTube(170,'V1','7025','preamp volmix')+smallTube(450,'V2','7025','preamp volmix')+smallTube(630,'V3','7025','volmix')+smallTube(770,'V4','12AT7','pi'));
  s.push(bigTube(867,'V5','power')+bigTube(971,'V6','power'));

  /* ---- output transformer ---- */
  s.push(`<g ${tag('ot')}>
    <rect x="1038" y="296" width="70" height="174" rx="6" class="lnf" fill="#12161c"/>
    <path d="${coil(1054,310,10,15,0)}" class="ln" stroke="#e7eaee" stroke-width="1.5"/>
    <path d="M1076 312 V458 M1081 312 V458" class="ln"/>
    <path d="${coil(1092,350,5,15,1)}" class="ln" stroke="#e7eaee" stroke-width="1.5"/>
    <path d="M1092 350 V338 M1085 338 H1099 M1088 334 H1096" class="ln"/>
    <text x="1073" y="306" text-anchor="middle" class="lbl-s" style="font-size:8.5px">OUTPUT TX</text>
  </g>`);
  for(const y of [325,355,415,445]) s.push(`<circle cx="1054" cy="${y}" r="2.8" fill="var(--sig)" ${tag(y===355||y===415?'ot':'power')}/>`);
  s.push(`<circle cx="1054" cy="385" r="2.8" fill="var(--pwr)" ${tag('filter')}/>`);

  /* ---- power transformer, rectifier, filter caps ---- */
  let lam=''; for(let y=306;y<458;y+=8) lam+=`M1130 ${y} H1174 `;
  s.push(`<g ${tag('mains')}>
    <rect x="1118" y="290" width="68" height="180" rx="6" class="lnf"/><rect x="1126" y="298" width="52" height="164" rx="3" class="ln"/>
    <path d="${lam}" class="ln" opacity=".4"/>
    <rect x="1136" y="366" width="32" height="28" rx="3" fill="#12161c"/><text x="1152" y="384" text-anchor="middle" class="tname">PT</text>
  </g>`);
  s.push(`<g ${tag('rect')}>
    <rect x="1124" y="535" width="62" height="55" rx="7" class="blk blk-pwr"/>
    <path d="M1138 552 L1150 559 L1138 566 Z M1150 552 V566 M1160 552 L1172 559 L1160 566 Z M1172 552 V566" fill="none" stroke="var(--pwr)" stroke-width="1.5" stroke-linejoin="round"/>
    <text x="1155" y="580" text-anchor="middle" class="lbl-s">RECTIFIER</text>
  </g>`);
  s.push(`<g ${tag('filter')}>
    <rect x="1042" y="535" width="70" height="55" rx="7" class="blk blk-pwr"/>
    <rect x="1050" y="543" width="13" height="26" rx="4" class="ln" stroke="var(--pwr)"/><rect x="1070.5" y="543" width="13" height="26" rx="4" class="ln" stroke="var(--pwr)"/><rect x="1091" y="543" width="13" height="26" rx="4" class="ln" stroke="var(--pwr)"/>
    <text x="1077" y="582" text-anchor="middle" class="lbl-s">FILTER CAPS</text>
  </g>`);

  /* ---- cabinet ---- */
  s.push(`<g ${tag('cab')}>
    <rect x="1262" y="150" width="200" height="475" rx="12" fill="#0c0e12" stroke="#4b515b" stroke-width="1.6"/>
    <rect x="1276" y="164" width="172" height="420" rx="5" fill="url(#grille)" stroke="rgba(255,255,255,.07)"/>
    ${[278,474].map(cy=>`<circle cx="1362" cy="${cy}" r="80" fill="url(#gCone)" class="ln"/><circle cx="1362" cy="${cy}" r="70" class="ln" opacity=".5"/><circle cx="1362" cy="${cy}" r="46" class="ln" opacity=".3"/><circle cx="1362" cy="${cy}" r="22" fill="#191c21" class="ln"/>`).join('')}
    <text x="1362" y="606" text-anchor="middle" class="lbl">2 × 15″ · 8 Ω + 8 Ω</text>
    <circle cx="1262" cy="516" r="5" fill="#8e949d" stroke="#4b5059"/>
  </g>`);
  s.push(`<rect x="1284" y="632" width="46" height="9" rx="2" fill="#1a1d22"/><rect x="1394" y="632" width="46" height="9" rx="2" fill="#1a1d22"/>`);

  return s.join('');
}

/* small front view for the studio room, in a 200 x 400 box */
const ROOM = { w:200, h:400, draw(){
  let k=''; for(const x of [22,34,50,64,78,98,110,126,140,154,172]) k+=`<circle cx="${x}" cy="19" r="${x===50||x===126?2.2:3.6}" fill="#191c21"/>`;
  return `<rect x="0" y="0" width="200" height="86" rx="7" fill="#0c0e12" stroke="#5b616b" stroke-width="1.5"/>
    <rect x="8" y="8" width="184" height="22" rx="2" fill="url(#rPanel)"/>${k}<circle cx="184" cy="19" r="3.2" fill="#ff5a4d"/>
    <rect x="8" y="34" width="184" height="44" rx="2" fill="url(#rGrille)" stroke="rgba(255,255,255,.1)"/>
    <rect x="0" y="92" width="200" height="300" rx="9" fill="#0c0e12" stroke="#5b616b" stroke-width="1.5"/>
    <rect x="10" y="102" width="180" height="270" rx="3" fill="url(#rGrille)" stroke="rgba(255,255,255,.1)"/>
    ${[172,304].map(cy=>`<circle cx="100" cy="${cy}" r="60" fill="rgba(20,24,30,.7)" stroke="#6b7280" stroke-width="1"/><circle cx="100" cy="${cy}" r="18" fill="#191c21" stroke="#6b7280" stroke-width="1"/>`).join('')}
    <rect x="18" y="392" width="30" height="8" rx="2" fill="#1a1d22"/><rect x="152" y="392" width="30" height="8" rx="2" fill="#1a1d22"/>`;
} };

EQ.register(Object.assign(EQUIPMENT, TEXT, { layers:LAYERS, basis:BASIS, conf:CONF, room:ROOM,
  draw(ctx){ ({tag,wire,block,node}=ctx); return drawAmp(); } }));
})();
