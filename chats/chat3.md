# Missing music genres

_Started 2026-07-12 18:20 UTC_

---

## User

Ok, no design changes, but we're missing some key genres: Synth Pop, Coldwave, Jangle Pop, City Pop, New Age, Synth Wave, and the either their descendants or existing connections.

## Assistant

_[tool: read_file]_

_[tool: read_file]_

_[tool: grep]_

Adding the six genres to `la-data.js` with lineage wiring — no design changes.

_[tool: str_replace_edit]_

_[tool: ready_for_verification]_

Added six genres and 31 new lineage edges to the atlas:

- **Synth Pop** (1979, Rock) — from New Wave/Kraftwerk/disco; feeds Detroit techno, Coldwave, Hyperpop, Synthwave
- **Coldwave** (1980, Gaze) — from Post-Punk + Synth Pop; feeds Ethereal Wave, New Post-Punk, Synthwave
- **Jangle Pop** (1983, Rock) — from folk-rock chime + The Smiths; feeds Alternative, Indie, Dream Pop, Nu-Gaze
- **City Pop** (1978, Global) — from disco/funk/jazz-funk; Future Funk's core sample source
- **New Age** (1975, Jazz/Ambient) — from minimalism + Hindustani drone; ties to Ambient and Ambient Techno
- **Synthwave** (2010, Electronic) — revival of Synth Pop/New Wave/Coldwave; links to Melodic Techno and Future Funk

Each has full traits, "why," and three tracks like the rest. No design changes.

## User

A UI bug looks to have been introduced, when zoom in a cluster moving the mouse pointer between lines causes a 'blinking' behavior.  Also, while we're fixing UI behavior, the mobile browser experience is still challenging, you can't click a genre and see it's lines, it pops up the more information which takes over, and the Tweaks menu always initially overlays every thing, is there a better responsive design approach for mobile?

## Assistant

_[tool: read_file]_

_[tool: read_file]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: ready_for_verification]_

Done, two fixes:

**Blinking between lines** — hovering in a zoomed cluster was toggling the highlight state every time the pointer crossed a node's invisible bounding box. Hover-off is now debounced (~170ms), so sweeping the pointer between lines no longer flashes the dim/undim state.

**Mobile genre tap** — tapping a genre no longer takes over the screen. It now opens a compact "peek" sheet (~220px: family, name, drag handle) so you can still see the node's highlighted lineage lines on the map. Tap "Tap for full details" (or the handle) to expand to the full sheet, and again to collapse. Same for edge taps.

One caveat: the Tweaks panel that overlays on load is the host app's UI, not something the design file controls — I can't reposition it. If it's a nuisance on mobile I can remove the two tweak props (dim amount, always-show-labels) entirely, which removes the panel; just say the word.

## User

I don't see any of the "metal" genres?  Could we add that, clean up the visual a little bit e.g., where it's getting to concentrated visually, and also because Musique Concrete is so foundation to 20th century electronic music, let's review that for accuracy of connections.

## Assistant

_[tool: str_replace_edit]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: ready_for_verification]_

Done — three changes:

**New Metal super-family** (deep red band between Rock and Gaze): Heavy Metal (1970, foundational), Thrash (1983), Doom (1984), Death Metal (1987), Black Metal (1991), Post-Metal (2000, hybrid with rock), and Blackgaze (2013, hybrid with gaze — the Deafheaven shoegaze bridge). Wired in from Chicago blues, psych rock, garage and punk; grunge-era link into Alternative.

**Visual decluttering**: resting edge opacity lowered (0.28→0.22, bridges 0.4→0.34) so the lattice reads calmer at full zoom-out; Coldwave nudged out of Noise Pop's row; the world canvas grew taller for the ninth band.

**Musique Concrète accuracy pass** — existing links (modern classical → concrète; concrète → ambient, krautrock, IDM, drone) hold up. Two genuinely missing ones added:
- → **Minimalism** (production): Reich's phase pieces were literally tape-loop works
- → **Hip-Hop** (bridge): sampling is concrète's compose-with-recordings method reborn in the break

I left dub as an independent parallel invention (King Tubby wasn't drawing on Schaeffer) — happy to add a scene-adjacency link if you'd rather show the kinship. A "Metal lineage" curated journey could also be a nice add.

## User

Found issues — fixing…

## Assistant

_[tool: str_replace_edit]_

_[tool: grep]_

_[tool: str_replace_edit]_

_[tool: ready_for_verification]_

Fixed the two stacked-node overlaps: Musique Concrète moved to the jazz band's open upper row (clear of Cool Jazz), and Progressive House moved below Ambient Techno's row. Loads clean.

## User

1. is there not modern lineage for Metal?
2. Where is Prog-Rock?
3. What has Post Rock evolved into, if anything?

## Assistant

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: ready_for_verification]_

Answers to all three, now on the map:

1. **Modern metal lineage added** — Progressive Metal (1990, Dream Theater/Meshuggah), Metalcore (2002, Killswitch/Converge — punk × thrash × death hybrid), and Modern Metalcore (2026, rising — Knocked Loose, Spiritbox, Lorna Shore) carrying the family right up to the present alongside Blackgaze.

2. **Prog Rock added** (1971, Rock family — King Crimson, Yes, Genesis), rooted in psych rock + classical form, scene-adjacent to jazz fusion, and feeding Progressive Metal and Post-Rock.

3. **Post-Rock's descendants**: it evolved into **Post-Metal** (2000) and, through that, **Blackgaze** (2013) — I also added a direct Post-Rock → Blackgaze link, since Deafheaven's crescendo form comes straight from it. Beyond that its DNA mostly dissolved into film scoring and ambient practice rather than a named genre, so the map ends that line at blackgaze.

## User

Add the genre Madchester and its related connections.

## Assistant

_[tool: grep]_

_[tool: grep]_

_[tool: str_replace_edit]_

_[tool: grep]_

_[tool: str_replace_edit]_

_[tool: ready_for_verification]_

Added **Madchester** (1988, Rock × Electronic hybrid — Stone Roses, Happy Mondays, Charlatans) with five connections: from Psychedelic Rock, Jangle Pop, Acid House (the Haçienda bridge) and Funk; feeding into 90s Indie/Britpop.

## User

Found issues — fixing…

## Assistant

_[tool: grep]_

_[tool: grep]_

_[tool: grep]_

_[tool: str_replace_edit]_

_[tool: ready_for_verification]_

Fixed — Madchester was sitting on top of Space Rock (both 1988, same row). Moved it to a clear row below.

## User

Re-running the check

