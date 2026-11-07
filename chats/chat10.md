# Chat

_Started 2026-07-26 07:24 UTC_

---

## User

<artifact-content-authored-by-others/>
Continuing from "Music artist genre search feature".

## Assistant

We've been building out The Lineage Atlas—a visual genre map with searchable artists and guided listening paths. The core work is capturing accurate genre genealogies, handling overlaps between micro-genres and their parent families, and ensuring artist search returns the right genre lineages with roll-ups when needed.

Key decisions made:
- Artist search includes ~230+ curated artists beyond genre representative lists; if a micro-genre doesn't exist as a node, artists map to the nearest parent.
- Guided paths trace full genealogies with intermediate steps (e.g., Garage to Psych to Desert now includes the Heavy Metal→Doom Metal bridge, not a direct leap).
- Stylistic influence edges (0.5 strength) capture cross-pollination like Dream Pop→Post-Rock without implying direct lineage.
- Genre aliases are searchable (e.g., "dream rock" finds Shoegaze).
- Revival waves are separate nodes with origin edges to their source (e.g., Sprechgesang revival 2020 traces back to Modern Classical 1912).

Current state: Shoegaze wave history is complete (Shoegaze → Nu-Gaze 2006 → Blackgaze 2000s → Grungegaze 2016 → Zoomergaze 2021), with Zoomergaze repositioned to avoid visual overlap with Sprechgesang. Sprechgesang's lineage includes Modern Classical origin + Post-Punk/Hip-Hop stylistic edges.

Next: Monitor artist search for gaps (users report missing artists/bands); continue expanding the curated index as needed. Keep an eye on emerging micro-genres and revival waves.

Files: la-data.js, The Lineage Atlas.dc.html

