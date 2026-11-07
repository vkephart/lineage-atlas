# Missing music genres

_Started 2026-07-14 19:54 UTC_

---

## User

We're missing Hardcore, Post-Hardcore, Screamo, Emo, emo-revival, Math Rock(also it's variations).

## Assistant

_[tool: read_file]_

_[tool: read_file]_

_[tool: grep]_

_[tool: read_file]_

_[tool: grep]_

_[tool: read_file]_

_[tool: grep]_

_[tool: grep]_

_[tool: grep]_

_[tool: grep]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: run_script]_

_[tool: show_html]_

_[tool: ready_for_verification]_

Out for review now. The new nodes sit in the Rock lineage band between 1980–2013 — if any labels feel crowded once you zoom in, say the word and I'll nudge positions.

## User

Yes, the Rock space is getting crowded around Alternative Rock, Post-Hardcore, Madchester, etc... Let's nudge positions.

## Assistant

_[tool: grep]_

_[tool: str_replace_edit]_

_[tool: ready_for_verification]_

Positions nudged and out for review — if any pair still overlaps at your zoom level, name the two nodes and I'll separate them further.

## User

Found issues — fixing…

## Assistant

_[tool: str_replace_edit]_

_[tool: ready_for_verification]_

Out for review again with all nodes back inside the rock band's divider lines.

## User

Please add Desert Rock, it's connections and nudge as needed.

## Assistant

_[tool: grep]_

_[tool: grep]_

_[tool: run_script]_

_[tool: ready_for_verification]_

Desert Rock is in and out for review.

## User

You missed the descendants to Desert Rock: Stoner Metal / Stoner Rock, Desert Blues (Tishoumaren), Sludge Metal, and Desert Punk.

## Assistant

_[tool: grep]_

_[tool: run_script]_

_[tool: ready_for_verification]_

Out for review — the desert lineage now spans three family bands (rock, metal, global).

## User

We're missing Hard Rock.  believe some of it's ancestors are Electric Blues, Psychedelic / Acid Rock, and Garage Rock.  Some of it's descendants are Heavy Metal,  Arena / Stadium Rock, Glam / Hair Metal, Grunge.  Let's also ensure Grunge is mapped correct as well.   Additionally, add Gothic, Industrial, and Yacht Rock.

## Assistant

_[tool: grep]_

_[tool: run_script]_

_[tool: snip]_

_[tool: ready_for_verification]_

Added all seven and rewired grunge:

- **Hard Rock** (1968) — origins from Chicago (electric) Blues, plus Psych and Garage; feeds Heavy Metal, Arena Rock, Glam Metal and Grunge
- **Arena Rock** (1975) — from Hard Rock + Prog's pomp, feeds Hair Metal's power ballads
- **Glam / Hair Metal** (1983, metal band) — from Hard Rock, Heavy Metal and Arena Rock
- **Grunge** (1990) — now a proper node: origins from Hardcore (Melvins) and Heavy Metal (the old metal→alternative "grunge" edge was retargeted here), stylistic from Hard Rock
- **Gothic Rock** (1982, gaze band) — from Post-Punk, feeds Ethereal Wave
- **Industrial** (1977, gaze×electronic) — from Krautrock + punk-era scene, feeds Noise Rock and Techno
- **Yacht Rock** (1976, rock×soul) — from Soul + Jazz Fusion, feeds City Pop

Out for review.

## User

Let's clean up the spacing in the Rock section it's getting busy.

## Assistant

_[tool: run_script]_

_[tool: dc_js_str_replace]_

_[tool: ready_for_verification]_

Out for review — the rock section now breathes, and the metal band picked up extra headroom too.

