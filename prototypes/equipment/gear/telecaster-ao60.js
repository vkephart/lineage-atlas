/* Equipment Map record: Fender American Original '60s Telecaster (2019, Lake Placid Blue, Bigsby and brass saddles added).
   Registers itself with the engine: the record, the drawing and a small view for the studio room. */
(function(){
const { coil, zig, ground } = EQ.helpers;
let tag, wire, block;

const LAYERS = [
  { id:'all',    label:'Everything' },
  { id:'mech',   label:'Strings and hardware', color:'var(--mech)' },
  { id:'signal', label:'Pickups and controls', color:'var(--sig)' },
  { id:'load',   label:'What it plugs into',   color:'var(--load)' }
];

const BASIS = {
  era:  { label:'Original era',  cls:'m', text:'players of the 1960s Telecasters this model copies. Widely published, recalled here and not re-checked' },
  fit:  { label:'Design fit',    cls:'u', text:'inferred from how the guitar works' },
  crowd:{ label:'Crowd-sourced', cls:'u', text:'from gear-listing sites, unconfirmed' }
};

const CONF = { v:['Checked','v'], m:['Partly from memory','m'], o:['From you','o'] };

const EQUIPMENT = {
  id:'fender-ao60-telecaster-2019', name:'Fender American Original ’60s Telecaster', maker:'Fender', kind:'Solid-body electric guitar', years:[2019,2019],
  specs:[['Year','2019'],['Finish','Lake Placid Blue'],['Scale','25.5″'],['Body','bound alder'],['Board','rosewood · 9.5″'],['Bridge pickup','6.0 kΩ · 2.8 H'],['Neck pickup','7.4 kΩ · 2.1 H'],['Saddles','brass, swapped in'],['Vibrato','Bigsby, added']],
  overview:{ title:'Bright, direct and simple on purpose', sub:'Follow the strings left to right, then the amber wiring',
    wired:'Six strings on a 25.5-inch scale cross three brass saddles and end at a Bigsby. Two single-coil pickups sense them at very different points: one beside the saddles, one at the end of the fingerboard. A three-way switch, one volume and one tone control are all that stand between the pickups and the jack.',
    sound:'A hard, fast attack with a lot of upper harmonics at the bridge and a round, soft voice at the neck. Nothing in the circuit adds gain or colour, so the guitar passes along exactly what the strings and the player do, and the cable and the first thing it plugs into finish the sound.',
    start:'Nine stages: four follow the strings and hardware, four the pickups and controls, and one the cable and input.' },

  stages:[
    { id:'strings', layer:'mech', mk:[430,222], title:'Strings and scale', sub:'25.5 in · bone nut · six-in-line tuners',
      wired:'Six strings run from the tuners over a bone nut, along a 25.5-inch scale and across the saddles. On this guitar they carry on past the saddles to the Bigsby.',
      sound:'The long scale puts more tension on each string than a Les Paul’s 24.75 inches at the same pitch. Notes start faster, the low strings stay tight and the top end is brighter. That is the base layer of the Telecaster snap.',
      conf:'v', confText:'Scale length and the bone nut are in dealer listings. The tension comparison is ordinary string physics.' },
    { id:'neckbody', layer:'mech', mk:[1098,428], title:'Neck and body', sub:'Bolt-on maple · rosewood board · bound alder slab',
      wired:'A maple neck with a ’60s C profile is bolted to a solid alder body with binding on both edges and a nitro lacquer finish. The round-laminated rosewood fingerboard has a 9.5-inch radius and 21 vintage-tall frets.',
      sound:'A solid slab with a bolted maple neck gives a quick attack and a clear fundamental, and it resists feedback at stage volume. How much the rosewood or the alder adds is argued over; the hardware and pickups matter more.',
      conf:'v', confText:'Woods, profile, radius, frets and finish agree across dealer listings (one says ash, which looks like an error). The tonal remarks are general.' },
    { id:'bridge', layer:'mech', mk:[1036,342], title:'Bridge plate and saddles', sub:'Three brass saddles on a stamped steel plate · saddles swapped by you',
      wired:'Three barrel saddles sit on a steel plate screwed to the body. Each saddle carries two strings, and the same plate holds the bridge pickup. The stock saddles are steel; you replaced them with brass for more accurate intonation.',
      sound:'With one saddle for each pair of strings, intonation is a compromise within the pair. Compensated saddles, angled or notched so each string gets its own break point, narrow that gap. Brass is softer than steel and is generally heard as rounder, with a less glassy attack, closer to the earliest 1950s Telecasters. The steel plate still sits inside the pickup’s magnetic field.',
      conf:'o', confText:'The brass saddles come from you. That they are a compensated set is assumed from your reason for the swap. Stock steel saddles are confirmed by listings; the tonal difference is player consensus, and brass on the first Telecasters is from memory.' },
    { id:'bigsby', layer:'mech', mk:[1140,342], title:'Bigsby vibrato', sub:'Added to this guitar · the stock model has a fixed bridge',
      wired:'Behind the bridge the strings wrap around a bar that turns against a spring when the arm moves. The travel is small: about a semitone down and a little up. The drawing assumes a B5 unit mounted behind the original bridge plate.',
      sound:'Slow shimmer on chords and soft dips into notes, not dive bombs. Ending the strings at a tailpiece also changes how hard they press on the saddles, which owners describe as a rounder attack and a little less sustain. Tuning return depends on the strings sliding freely at the nut and saddles.',
      conf:'o', confText:'The Bigsby comes from your equipment list. Listings show no factory version, so the model and mounting are assumed, and the attack and sustain remarks are owner opinion.' },

    { id:'bridgepu', layer:'signal', mk:[972,342], title:'Bridge pickup', sub:'Pure Vintage ’64 · 6.0 kΩ · 2.8 H',
      wired:'A single coil with alnico 5 magnets, staggered pole pieces, enamel wire and a metal plate under the bobbin hangs from the bridge plate. It is slanted so the treble strings are sensed closer to the saddles.',
      sound:'This close to the bridge a string barely moves but is rich in upper harmonics, so the pickup hears bright, wiry notes with lean lows. The slant gives the wound strings a little more body. The base plate and the steel around the coil raise its inductance and push the mids forward. Together that is twang.',
      conf:'v', confText:'Resistance, inductance, magnets, wire and the base plate are from Fender’s parts listing. Why it sounds that way is standard pickup theory, summarised from memory.' },
    { id:'neckpu', layer:'signal', mk:[836,342], title:'Neck pickup', sub:'Pure Vintage ’64 · 7.4 kΩ · 2.1 H',
      wired:'A smaller coil of finer wire under a metal cover, screwed into the body just past the end of the fingerboard.',
      sound:'Here the string swings widely and the fundamental dominates, so the sound is round and warm, and the cover takes a little off the very top. It measures higher in resistance than the bridge pickup but has less inductance and less output, which is why it sounds softer, not hotter.',
      conf:'v', confText:'Resistance and inductance are from Fender’s parts listing. The effect of the cover is general pickup theory.' },
    { id:'switch', layer:'signal', mk:[932,116], title:'Three-way switch', sub:'Bridge · both · neck',
      wired:'A blade switch on the control plate selects the bridge pickup, both pickups in parallel, or the neck pickup. Telecasters before late 1967 were wired differently, with a preset bassy neck sound and no both-pickups position.',
      sound:'Both together in parallel is quieter and scooped, with a hollow, glassy quality that suits clean rhythm parts. Whether that position also cancels hum depends on the neck pickup being reverse-wound, which was not confirmed for this set.',
      conf:'m', confText:'A three-position switch is in the listings and the 1967 change is documented. The position order on this reissue is assumed to be the modern one.' },
    { id:'controls', layer:'signal', mk:[1040,116], title:'Volume and tone', sub:'One of each, passive',
      wired:'A master volume and a master tone control sit behind the switch. The tone control bleeds treble to ground through a capacitor. Fender’s usual pots for single coils are 250 kΩ.',
      sound:'Even wide open the pots load the pickups a little and smooth the top end. Turning the volume down darkens the sound as well as quietening it. Both knobs sit under the little finger, so volume swells and tone sweeps while playing are part of the instrument’s vocabulary.',
      conf:'m', confText:'Master volume and master tone are confirmed. Pot and capacitor values were not found for this model.' },

    { id:'load', layer:'load', mk:[1262,104], title:'Cable and input', sub:'The last part of the circuit',
      wired:'A passive pickup is not finished at the jack. Its inductance and the capacitance of the cable form a resonant peak, and whatever the cable plugs into loads that peak.',
      sound:'A longer cable moves the peak lower and the guitar gets darker. A high-impedance input, about 1 MΩ on an amp or an instrument DI, keeps the peak; a low-impedance input flattens it and dulls the sound. A fuzz pedal placed first reacts to all of this directly.',
      conf:'m', confText:'General electronics, not specific to this guitar. No frequencies are quoted because nothing was measured.' }
  ],

  signatures:[
    { stage:'bridgepu', what:'Bridge pickup in a steel plate beside the saddles', hear:'Bright, wiry attack with forward mids and lean lows.',                 use:'Leads and rhythm that sit above bass and keys without EQ.' },
    { stage:'strings',  what:'25.5-inch scale on a bolted maple neck',            hear:'Fast note starts, tight low strings.',                                   use:'Articulate picking, double-stops, parts that must stay clear when layered.' },
    { stage:'neckpu',   what:'Covered neck pickup',                               hear:'Round and warm with a soft top.',                                        use:'Comping, soul rhythm, a second guitar that stays out of the vocal’s way.' },
    { stage:'switch',   what:'Both pickups in parallel',                          hear:'Quieter, scooped and glassy.',                                           use:'Clean funk and pop rhythm, jangly arpeggios.' },
    { stage:'controls', what:'Passive controls under the little finger',          hear:'Volume doubles as a gain and brightness control for whatever follows.', use:'Cleaning up a fuzz from the guitar, swells, tone sweeps.' },
    { stage:'bigsby',   what:'Bigsby behind the bridge',                          hear:'Slow pitch shimmer and a slightly softer attack.',                       use:'Chords that drift under reverb and delay.' }
  ],

  usesIntro:'A 2019 reissue has no recording history of its own, so the tracks below were played on the 1960s guitars it copies, or on their close relatives. Each one names the player and the guitar and says how well that is sourced.',
  uses:[
    { title:'Twang: country and its offshoots', basis:['era'],
      text:'The bridge pickup into a clean amp is the lead voice of Bakersfield country and of rockabilly, and it carried from there into country rock.',
      genres:['country','rockabilly','countryrock','cosmicamerican'],
      tracks:[
        { g:'country', t:'Buckaroo', a:'Buck Owens and His Buckaroos', y:1965, src:'v', note:'Don Rich’s Telecaster lead on the only instrumental to top the country chart. Which of his Telecasters is not identified.' },
        { g:'country', t:'Act Naturally', a:'Buck Owens', y:1963, src:'v', note:'Don Rich on Telecaster. George Harrison tried to match the part on the Beatles’ cover.' },
        { g:'rockabilly', t:'Susie Q', a:'Dale Hawkins', y:1957, src:'v', note:'James Burton, aged 17, on his 1953 Telecaster. He wrote the riff.' },
        { g:'countryrock', t:'Chestnut Mare', a:'The Byrds', y:1970, src:'m', note:'Clarence White’s string-bender Telecaster.' }
      ] },
    { title:'Bite: soul, blues, hard rock, punk', basis:['era'],
      text:'A Telecaster into a small amp pushed hard is the rhythm sound of Stax soul and of mid-60s electric blues. The same bite carried into hard rock, punk and new wave.',
      genres:['soul','folkrock','chicago','hardrock','punk','newwave'],
      tracks:[
        { g:'soul', t:'Soul Man', a:'Sam & Dave', y:1967, src:'v', note:'Steve Cropper’s white early-60s Telecaster. By one account he played the intro lick with a lighter as a slide.' },
        { g:'soul', t:'(Sittin’ On) The Dock of the Bay', a:'Otis Redding', y:1968, src:'v', atlas:'Soul', note:'Cropper again, on a 1961 Esquire according to the Smithsonian. The Esquire is the single-pickup version of the same guitar.' },
        { g:'folkrock', t:'Like a Rolling Stone', a:'Bob Dylan', y:1965, src:'v', note:'Mike Bloomfield’s 1963 Telecaster, the guitar he played at Newport that summer.' },
        { g:'chicago', t:'Born in Chicago', a:'The Paul Butterfield Blues Band', y:1965, src:'v', note:'The same 1963 Telecaster is credited on this debut album.' },
        { g:'hardrock', t:'Stairway to Heaven', a:'Led Zeppelin', y:1971, src:'v', note:'Jimmy Page recorded the solo on his 1959 Telecaster, his main guitar until spring 1969.' },
        { g:'punk', t:'London Calling', a:'The Clash', y:1979, src:'d', atlas:'Punk', note:'Joe Strummer’s rhythm guitar. Most accounts give his 1966 Telecaster; Fender credits an Esquire for this era.' },
        { g:'newwave', t:'Message in a Bottle', a:'The Police', y:1979, src:'v', note:'Andy Summers’s early-60s Telecaster Custom, bound like this one but heavily modified, through a chorus pedal.' }
      ] },
    { title:'With the Bigsby: drift and shimmer', basis:['fit','crowd'],
      text:'A vibrato adds slow pitch movement to an otherwise dry, direct guitar, which suits styles built on reverb and delay. Gear listings credit Bigsby Telecasters to Mark Arm of Mudhoney and Dean DeLeo of Stone Temple Pilots.',
      genres:['dreampop','shoegaze','cosmiccountry','indie','grunge','alternative'],
      noTracks:'No track is documented for a Bigsby Telecaster yet.' }
  ],

  lineage:[
    { year:'1950', name:'Esquire and Broadcaster', note:'The first mass-produced solid-body electric guitar.', bridge:'<b>1948 · Bigsby–Travis guitar</b> Paul Bigsby’s solid-body for Merle Travis comes first. His vibrato follows a few years later.' },
    { year:'1951', name:'Telecaster', note:'The Broadcaster renamed.' },
    { year:'1959', name:'Rosewood board', note:'Rosewood fingerboards arrive in September. The Custom Telecaster adds a bound body.' },
    { year:'1967', name:'Modern wiring', note:'The both-pickups position becomes standard, and Fender offers a factory Bigsby.' },
    { year:'2018', name:'American Original ’60s', note:'Mid-60s features on a flatter 9.5-inch fingerboard.' },
    { year:'2019', name:'This guitar', note:'Lake Placid Blue, with a Bigsby added.', here:true }
  ],

  notes:[
    ['Straight in','API 512c as the DI, bridge pickup, tone slightly back. A fast, forward preamp suits clean funk and soul rhythm parts.'],
    ['Amp and two mics','Shure SM57 near the cone edge for bite and the Royer R-121 for body, summed. The ribbon takes the edge off the bridge pickup without EQ.'],
    ['Fuzz Face first','Plug straight into the Fuzz Face with nothing before it. With single coils, the guitar’s volume knob cleans a germanium fuzz up to a bright crunch.'],
    ['Swells','Volume knob or Bigsby into the DD-20 on a long, dark repeat. The swell hides the hard attack, so each note blooms.'],
    ['Synth9 and MuRF','Feed them the bridge pickup with the tone wide open. Both work on harmonics, and the bridge position has the most.'],
    ['Hum','Single coils pick up screens, dimmers and power supplies. Turn until you find the quiet angle before a take, and check whether the both-pickups position cancels it.']
  ],

  sources:[
    ['Chicago Music Exchange: American Original ’60s Telecaster','https://www.chicagomusicexchange.com/products/fender-american-original-60s-telecaster-lake-placid-2392086'],
    ['The Music Zoo: American Original ’60s Telecaster','https://www.themusiczoo.com/products/fender-american-original-60s-telecaster-lake-placid-blue-1'],
    ['Eddie’s Guitars: American Original ’60s Telecaster','https://eddiesguitars.com/product/electric/electric-guitar-categories/solid-body-electric-guitars/fender-american-original-60s-telecaster-lake-placid-blue-19013/'],
    ['Fender: Pure Vintage ’64 Telecaster pickup set','https://www.fender.com/products/pure-vintage-64-telecaster-pickup-set'],
    ['Andertons: Pure Vintage ’64 set','https://www.andertons.co.uk/fender-pure-vintage-64-telecaster-pickup-set/'],
    ['Premier Guitar: factory Telecaster wirings','https://www.premierguitar.com/gear/factory-telecaster-wirings-pt-1'],
    ['Fat Bottom Guitars: the Telecaster in the 1960s','https://fatbottomguitars.co.uk/blogs/news/the-evolution-of-the-fender-telecaster-in-the-1960s'],
    ['Guitar World: history of the Telecaster','https://guitarworld.com/features/history-of-the-fender-telecaster'],
    ['Ask Zac: Bigsby-equipped Telecasters','https://askzac.com/post/everything-you-wanted-to-know-about-bigsby-equipped-fender-telecasters'],
    ['Equipboard: Telecaster with Bigsby (crowd-sourced)','https://equipboard.com/items/fender-telecaster-bigsby'],
    ['Wikipedia: Don Rich','https://en.wikipedia.org/wiki/Don_Rich'],
    ['Guitar Player: James Burton’s career tracks','https://www.guitarplayer.com/players/james-burton-career-defining-tracks-elvis-presley-ricky-nelson-dale-hawkins'],
    ['Smithsonian: Steve Cropper’s instruments','https://www.si.edu/newsdesk/releases/smithsonian-accepts-donation-four-historic-instruments-celebrated-musician-steve-cropper'],
    ['Vintage Guitar: Bloomfield’s ’63 Telecaster','https://vintageguitar.com/25061/michael-bloomfields-63-telecaster'],
    ['Ground Guitar: Jimmy Page’s 1959 Telecaster','https://www.groundguitar.com/jimmy-page-gear/jimmy-pages-1959-fender-telecaster-dragon-tele/'],
    ['Fender: Joe Strummer Esquire announcement','https://www.fender.com/newsroom/272114-fender-launches-joe-strummer-campfire-acoustic-and-limited-edition-joe-strummer-esquire-guitars-to-celebrate-the-legacy-of-one-of-the-/'],
    ['Guitar World: Andy Summers’s Telecaster','https://www.guitarworld.com/features/andy-summers-modded-fender-telecaster']
  ]
};


const TEXT = {
  hash:'telecaster', eyebrow:'Guitar', title:'American Original ’60s Telecaster', roomLabel:'TELECASTER',
  lede:'A 2019 Lake Placid Blue reissue of the mid-1960s rosewood-board Telecaster, with a Bigsby and brass saddles added. Two single-coil pickups, one switch, two knobs. Most of how it sounds comes from where those two pickups sit and what they are bolted to.',
  viewBox:[1480,770], builtLabel:'How it is built',
  aria:'A Telecaster with a Bigsby seen from the front, headstock to the left. Strings run from the tuners across the nut, the fingerboard and three brass bridge saddles to the vibrato. Wiring runs from the neck and bridge pickups to a three-way switch, volume and tone controls and the output jack. Below, the same circuit is drawn as a schematic and continued through the cable to an amplifier input.',
  caption:'Workbench view: headstock left, treble side up. Drag sideways on a phone. The body is drawn solid and the <span style="color:var(--sig)">amber</span> lines show the wiring that runs inside it. The strip underneath is the same circuit as a schematic, continued in <span style="color:var(--load)">red</span> through the cable to whatever it plugs into. Proportions are approximate.',
  lineageTitle:'From the Broadcaster to this guitar',
  lineageIntro:'The design changed very little in seventy years. These are the changes that this particular guitar carries.',
  notesEyebrow:'In your room', notesTitle:'Chains from your equipment list',
  notesIntro:'Built from the other items on your list. They follow from how the guitar works; test them by ear.',
  provenance:{ intro:'Reference pages could not be opened from this session, so checked facts come from search summaries of dealer listings, Fender’s parts catalogue and guitar press. No measurements were taken from your guitar.',
    lists:[
      { pill:'Checked', cls:'v', title:'Listings, Fender’s catalogue, guitar press', items:[
        'Double-bound alder body in nitro lacquer; maple neck with a ’60s C profile; round-laminated rosewood board, 9.5-inch radius, 21 vintage-tall frets; bone nut, 1.650 inches.',
        '25.5-inch scale; three-saddle vintage-style bridge, stock with steel saddles; three-position switch, master volume, master tone.',
        'Pure Vintage ’64 pickups: alnico 5, enamel wire, staggered bridge poles, a metal plate under the bridge pickup. Neck 7.4 kΩ and 2.1 H, bridge 6.0 kΩ and 2.8 H.',
        'The stock model has a fixed bridge. No factory Bigsby version turned up.',
        'Rosewood boards arrived in September 1959. The both-pickups switch position became standard in late 1967.',
        'Track credits marked Checked: the player and the guitar, at the level each note states.' ] },
      { pill:'From you', cls:'o', title:'Your sheet and what you told me', items:[
        'Model year 2019.', 'Lake Placid Blue.', 'A Bigsby vibrato is fitted.', 'The saddles were changed to brass for better intonation.', 'The other gear named in the chains.' ] },
      { pill:'From memory', cls:'m', title:'Not confirmed for this guitar', items:[
        'Which Bigsby it is and how it is mounted. The drawing assumes a B5 behind the original bridge plate.',
        'Whether the brass saddles are a compensated set, and what brass does to the tone, which is player consensus and not a measurement.',
        '250 kΩ pots, the tone capacitor value, and the order of the switch positions.',
        'Whether the neck pickup is reverse-wound, which decides if the middle position cancels hum.',
        'Track credits marked Recalled, the model’s 2018 start, the 1948 Bigsby guitar and the 1967 factory Bigsby option.',
        'The explanations of why each part sounds the way it does. They are standard guitar electronics, summarised.' ] }
    ] },
  footer:'Reference drawing for understanding how the instrument works, not a wiring or setup guide. Fender and Telecaster are trademarks of Fender Musical Instruments Corporation and Bigsby is a trademark of its owner; all are used descriptively. This page is not affiliated with or endorsed by them.'
};

/* ---- drawing: 1480 x 770 box, about 31 px to the inch; the string centreline is y = 270 ---- */
const Y0=270, NUT=241, SCALE=790.5, SADDLE=NUT+SCALE;
const fretX=n=>NUT+SCALE*(1-Math.pow(2,-n/12));
const BODY='M709 304 C709 330 708 360 722 392 C736 424 770 440 812 441 C850 442 875 414 912 413 C960 412 990 467 1066 467 C1150 467 1197 370 1197 270 C1197 170 1150 73 1066 73 C990 73 960 130 912 131 C870 132 850 106 806 104 C775 102 742 112 738 136 C735 160 772 160 790 186 C800 202 800 226 798 236 L709 236 Z';
const GUARD='M714 300 C714 340 720 372 736 396 C750 418 780 429 806 429 C846 429 878 388 902 352 C918 330 940 322 958 322 L958 218 C940 214 920 200 906 184 L900 146 C872 144 850 119 806 117 C780 116 753 123 751 138 C749 154 780 156 800 188 C808 204 808 232 806 240 L714 240 Z';
const HEAD='M241 296 C236 301 232 307 225 308 L62 262 C44 257 30 244 31 228 C32 212 46 205 64 206 L188 214 C214 216 224 243 241 244 Z';

function drawGuitar(){
  const s=[];
  s.push(`<defs>
    <linearGradient id="gBody" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6f9fd6"/><stop offset=".45" stop-color="#4577b6"/><stop offset="1" stop-color="#2b5590"/></linearGradient>
    <linearGradient id="gChrome" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#eef0f3"/><stop offset=".5" stop-color="#c3c8cf"/><stop offset="1" stop-color="#9299a3"/></linearGradient>
    <linearGradient id="gBrass" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#f0d68c"/><stop offset="1" stop-color="#b8923f"/></linearGradient>
    <linearGradient id="gAlu" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#dcdfe3"/><stop offset="1" stop-color="#a4a9b1"/></linearGradient>
    <linearGradient id="gRose" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4a3026"/><stop offset="1" stop-color="#33211b"/></linearGradient>
    <linearGradient id="gMaple" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e0c08c"/><stop offset="1" stop-color="#c7a56f"/></linearGradient>
  </defs>`);

  /* ---- body, pickguard ---- */
  s.push(`<g ${tag('neckbody')}>
    <path d="${BODY}" fill="url(#gBody)" stroke="#efe8d2" stroke-width="3.5" stroke-linejoin="round"/>
    <path d="${GUARD}" fill="#e3ecdf" stroke="#aab4a6" stroke-width="1.2"/>
    <circle cx="1199" cy="270" r="5" fill="url(#gChrome)" stroke="#5c626b"/>
  </g>`);

  /* ---- neck, fingerboard, headstock ---- */
  let frets='', dots='';
  const edge=(x,side)=>{ const t=(x-NUT)/(806-NUT); return Y0+side*(25.5+8.5*t); };
  for(let n=1;n<=21;n++){ const x=fretX(n); frets+=`M${x.toFixed(1)} ${edge(x,-1).toFixed(1)} V${edge(x,1).toFixed(1)} `; }
  for(const n of [3,5,7,9,15,17,19,21]){ const x=(fretX(n-1)+fretX(n))/2; dots+=`<circle cx="${x.toFixed(1)}" cy="${Y0}" r="3.6"/>`; }
  { const x=(fretX(11)+fretX(12))/2; dots+=`<circle cx="${x.toFixed(1)}" cy="${Y0-13}" r="3.6"/><circle cx="${x.toFixed(1)}" cy="${Y0+13}" r="3.6"/>`; }
  s.push(`<g ${tag('neckbody')}>
    <path d="${HEAD}" fill="url(#gMaple)" stroke="#8a6f43" stroke-width="1.2"/>
    <path d="M${NUT} ${Y0-25.5} L806 ${Y0-34} Q812 ${Y0} 806 ${Y0+34} L${NUT} ${Y0+25.5} Z" fill="url(#gRose)" stroke="#1b110d" stroke-width="1"/>
    <path d="${frets}" stroke="#c9ced6" stroke-width="1.4"/>
    <g fill="#d9d2bd">${dots}</g>
    <text x="300" y="327" class="lbl-s">MAPLE NECK · ROSEWOOD BOARD · 21 FRETS</text>
  </g>`);

  /* ---- hardware on the body ---- */
  s.push(`<g ${tag('neckpu')}><rect x="824" y="227" width="24" height="86" rx="11" fill="url(#gChrome)" stroke="#5c626b"/></g>`);
  s.push(`<g ${tag('bridge')}>
    <rect x="958" y="222" width="102" height="96" rx="3" fill="url(#gChrome)" stroke="#5c626b"/>
    <path d="M958 225 H1060 M1056 222 V318" stroke="#7b828c" stroke-width="2"/>
    ${[-26.4,0,26.4].map(o=>`<rect x="1024" y="${Y0+o-11.5}" width="14" height="23" rx="4" fill="url(#gBrass)" stroke="#6b5622" stroke-width="1.2"/><path d="M1037 ${Y0+o} H1056" stroke="#4d535c" stroke-width="1.5"/>`).join('')}
  </g>`);
  let poles='';
  for(let i=0;i<6;i++){ const y=Y0+(i-2.5)*12.8; poles+=`<circle cx="${(992-(y-Y0)*0.306).toFixed(1)}" cy="${y.toFixed(1)}" r="3.2"/>`; }
  s.push(`<g ${tag('bridgepu')}><rect x="-10" y="-43" width="20" height="86" rx="9" transform="translate(992 ${Y0}) rotate(17)" fill="#14171c" stroke="#4d535c"/><g fill="#aeb4bd">${poles}</g></g>`);
  s.push(`<g ${tag('bigsby')}>
    <rect x="1070" y="224" width="116" height="92" rx="18" fill="url(#gAlu)" stroke="#5c626b"/>
    <rect x="1100" y="238" width="52" height="64" rx="8" fill="#2b5590" opacity=".55"/>
    <rect x="1086" y="230" width="7" height="80" rx="3.5" fill="url(#gChrome)" stroke="#4d535c"/>
    <rect x="1116" y="228" width="11" height="84" rx="5.5" fill="url(#gChrome)" stroke="#4d535c"/>
    <circle cx="1152" cy="243" r="10" fill="#c3c8cf" stroke="#4d535c"/><circle cx="1152" cy="243" r="5.5" fill="none" stroke="#4d535c"/>
  </g>`);

  /* ---- strings, nut, tuners ---- */
  const posts=[73,101,129,157,185,213], wid=[0.8,0.9,1.1,1.5,1.8,2.1];
  const baseEdge=x=>308-(225-x)*0.282;
  let str='', tun='';
  for(let i=0;i<6;i++){
    const yn=Y0+(i-2.5)*8.6, yb=Y0+(i-2.5)*13.2;
    str+=`<path d="M${posts[i]} ${yn} L${NUT} ${yn} L${SADDLE} ${yb} L1121 ${yb}" stroke="#e3e7ec" stroke-width="${wid[i]}" fill="none"/>`;
    tun+=`<ellipse cx="${posts[i]+5}" cy="${baseEdge(posts[i])+11}" rx="8" ry="5.5" transform="rotate(16 ${posts[i]+5} ${baseEdge(posts[i])+11})" fill="url(#gChrome)" stroke="#5c626b"/><circle cx="${posts[i]}" cy="${yn}" r="5" fill="url(#gChrome)" stroke="#5c626b"/>`;
  }
  s.push(`<g ${tag('strings')}>${tun}<rect x="${NUT-3}" y="${Y0-26}" width="5" height="52" rx="1" fill="#efe8d2" stroke="#8a836f" stroke-width=".8"/>
    <circle cx="143" cy="${Y0-17}" r="3.4" fill="url(#gChrome)" stroke="#5c626b"/>
    <g style="filter:drop-shadow(0 1px 0 rgba(0,0,0,.45))">${str}</g>
    <path d="M${NUT} 300 V494 M${SADDLE} 322 V494" class="dim"/>
    <path d="M${NUT} 486 H${SADDLE} M${NUT} 480 V492 M${SADDLE} 480 V492" fill="none" stroke="#aab1bb" stroke-width="1.2"/>
    <rect x="492" y="476" width="288" height="20" fill="#0b0d11"/><text x="636" y="490" text-anchor="middle" class="lbl">SCALE LENGTH 25.5 in · NUT TO SADDLES</text>
  </g>`);
  /* bigsby arm over the strings */
  s.push(`<g ${tag('bigsby')}><path d="M1121 228 C1104 208 1052 202 1010 205" fill="none" stroke="#3c4149" stroke-width="9" stroke-linecap="round"/><path d="M1121 228 C1104 208 1052 202 1010 205" fill="none" stroke="#d5d9de" stroke-width="6" stroke-linecap="round"/><ellipse cx="1004" cy="205" rx="13" ry="6.5" fill="url(#gChrome)" stroke="#4d535c"/></g>`);

  /* ---- control plate ---- */
  s.push(`<rect x="907" y="140" width="196" height="40" rx="7" fill="url(#gChrome)" stroke="#5c626b" ${tag('switch controls')}/>`);
  s.push(`<g ${tag('switch')}><rect x="920" y="157" width="34" height="6" rx="3" fill="#14171c"/><path d="M930 160 L925 148" stroke="#14171c" stroke-width="5" stroke-linecap="round"/></g>`);
  s.push(`<g ${tag('controls')}>${[1008,1068].map(x=>`<circle cx="${x}" cy="160" r="14" fill="#d9dde2" stroke="#4d535c"/><circle cx="${x}" cy="160" r="9" fill="url(#gChrome)" stroke="#7b828c"/>`).join('')}</g>`);

  /* ---- wiring inside the body ---- */
  s.push(wire('M836 230 C846 196 892 172 922 162','sig','neckpu',{flow:1}));
  s.push(wire('M1000 238 C1000 214 986 198 984 181','sig','bridgepu',{flow:1}));
  s.push(wire('M1092 150 C1100 128 1092 108 1090 92','sig','controls',{flow:1}));

  /* ---- jack, cable, input ---- */
  s.push(`<g ${tag('load')}><circle cx="1090" cy="82" r="10" fill="url(#gChrome)" stroke="#5c626b"/><circle cx="1090" cy="82" r="4" fill="#14171c"/><rect x="1084" y="46" width="12" height="30" rx="3" fill="#191c21" stroke="#4d535c"/></g>`);
  s.push(wire('M1090 46 C1090 8 1206 4 1244 58 C1268 92 1250 150 1300 172','load','load',{flow:1}));
  s.push(block(1300,142,156,60,'load','load',['AMP OR DI INPUT','about 1 MΩ']));
  s.push(`<text x="1218" y="24" class="lbl-s" ${tag('load')} style="fill:var(--load)">CABLE</text>`);

  /* ---- the circuit as a schematic ---- */
  const HOT=615, GND=725;
  s.push(`<path d="M40 530 H1440" stroke="rgba(255,255,255,.09)"/><text x="40" y="556" class="lbl-s">THE SAME CIRCUIT AS A SCHEMATIC · EVERYTHING LEFT OF THE JACK IS UNDER THE CONTROL PLATE</text>`);
  s.push(`<path d="M110 ${GND} H1320" stroke="#5c626b" stroke-width="1.2"/><text x="1330" y="${GND+4}" class="lbl-s">GROUND</text>`);
  /* pickups */
  s.push(`<g ${tag('bridgepu')}><path d="${coil(140,625,5,15,0)}" class="sym"/><path d="M140 700 V${GND}" class="sym"/><text x="124" y="652" text-anchor="end" class="blk-t">BRIDGE</text><text x="124" y="667" text-anchor="end" class="lbl-s">6.0 kΩ · 2.8 H</text></g>`);
  s.push(wire([[140,625],[140,598],[390,598]],'sig','bridgepu',{flow:1}));
  s.push(`<g ${tag('neckpu')}><path d="${coil(262,640,4,15,0)}" class="sym"/><path d="M262 700 V${GND}" class="sym"/><text x="280" y="667" class="blk-t">NECK</text><text x="280" y="682" class="lbl-s">7.4 kΩ · 2.1 H</text></g>`);
  s.push(wire([[262,640],[262,632],[390,632]],'sig','neckpu',{flow:1}));
  s.push(block(390,580,124,70,'sig','switch',['3-WAY SWITCH','bridge·both·neck']));
  /* volume */
  s.push(wire([[514,HOT],[604,HOT]],'sig','controls',{flow:1}));
  s.push(`<g ${tag('controls')}><path d="${zig(604,HOT,GND)}" class="sym"/><path d="M652 670 H618 M626 665 L617 670 L626 675" class="sym"/><text x="604" y="598" text-anchor="middle" class="blk-t">VOLUME</text></g>`);
  s.push(wire([[652,670],[652,HOT],[900,HOT]],'sig','controls',{flow:1}));
  /* tone */
  s.push(`<g ${tag('controls')}><circle cx="776" cy="${HOT}" r="3.4" fill="var(--sig)"/><path d="M776 ${HOT} V628" class="sym"/><path d="${zig(776,628,684)}" class="sym"/><path d="M758 676 L794 636 M786 637 L794 636 L793 644" class="sym"/><path d="M776 684 V696 M764 696 H788 M764 703 H788 M776 703 V${GND}" class="sym"/><text x="776" y="598" text-anchor="middle" class="blk-t">TONE</text><text x="800" y="703" class="lbl-s">CAP</text></g>`);
  /* jack */
  s.push(`<g ${tag('load')}><circle cx="910" cy="${HOT}" r="10" fill="#0b0d11" class="sym"/><circle cx="910" cy="${HOT}" r="3.5" fill="#e7eaee"/><text x="910" y="598" text-anchor="middle" class="blk-t">JACK</text></g>`);
  s.push(wire([[920,HOT],[1318,HOT]],'load','load',{flow:1}));
  s.push(`<g ${tag('load')}>
    <circle cx="1060" cy="${HOT}" r="3.4" fill="var(--load)"/><path d="M1060 ${HOT} V660 M1048 660 H1072 M1048 667 H1072 M1060 667 V${GND}" class="sym" stroke-dasharray="4 4"/>
    <text x="1060" y="598" text-anchor="middle" class="blk-t">CABLE</text><text x="1082" y="667" class="lbl-s">capacitance</text>
    <circle cx="1230" cy="${HOT}" r="3.4" fill="var(--load)"/><path d="${zig(1230,HOT,GND)}" class="sym"/>
    <text x="1230" y="598" text-anchor="middle" class="blk-t">INPUT</text><text x="1252" y="674" class="lbl-s">≈ 1 MΩ</text>
    <path d="M1310 ${HOT-6} L1322 ${HOT} L1310 ${HOT+6}" class="sym" stroke="var(--load)"/><text x="1332" y="${HOT+4}" class="lbl-s">TO THE AMP</text>
  </g>`);

  return s.join('');
}

/* small view for the studio room. Same coordinates as the main drawing; the room rotates and scales it. */
const ROOM = { horizontal:true, draw(){
  let frets=''; for(let n=1;n<=21;n+=1){ const x=fretX(n); frets+=`M${x.toFixed(0)} ${Y0-30} V${Y0+30} `; }
  let str=''; for(let i=0;i<6;i++) str+=`M213 ${Y0+(i-2.5)*8.6} L${NUT} ${Y0+(i-2.5)*8.6} L1121 ${Y0+(i-2.5)*13.2} `;
  return `<path d="${BODY}" fill="url(#rBody)" stroke="#efe8d2" stroke-width="5" stroke-linejoin="round"/>
    <path d="${GUARD}" fill="#e3ecdf"/>
    <path d="${HEAD}" fill="url(#rMaple)" stroke="#8a6f43" stroke-width="2"/>
    <path d="M${NUT} ${Y0-25.5} L806 ${Y0-34} L806 ${Y0+34} L${NUT} ${Y0+25.5} Z" fill="#3d281f"/>
    <path d="${frets}" stroke="#aab1bb" stroke-width="2" opacity=".7"/>
    <rect x="824" y="227" width="24" height="86" rx="11" fill="url(#rChrome)"/>
    <rect x="958" y="222" width="102" height="96" rx="3" fill="url(#rChrome)"/>
    <rect x="-10" y="-43" width="20" height="86" rx="9" transform="translate(992 ${Y0}) rotate(17)" fill="#14171c"/>
    <rect x="1024" y="232" width="14" height="76" rx="4" fill="#d9b85e"/>
    <rect x="1070" y="224" width="116" height="92" rx="18" fill="url(#rChrome)" stroke="#5c626b" stroke-width="2"/>
    <rect x="907" y="140" width="196" height="40" rx="7" fill="url(#rChrome)"/><circle cx="1008" cy="160" r="13" fill="#8f97a3"/><circle cx="1068" cy="160" r="13" fill="#8f97a3"/>
    <path d="${str}" stroke="#e3e7ec" stroke-width="1.6" fill="none" opacity=".8"/>
    <path d="M1121 228 C1104 208 1052 202 1010 205" fill="none" stroke="#d5d9de" stroke-width="8" stroke-linecap="round"/>`;
} };

EQ.register(Object.assign(EQUIPMENT, TEXT, { layers:LAYERS, basis:BASIS, conf:CONF, room:ROOM,
  draw(ctx){ ({tag,wire,block}=ctx); return drawGuitar(); } }));
})();
