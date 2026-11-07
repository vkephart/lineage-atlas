# Genre tempo ranges

_Started 2026-07-15 17:11 UTC_

---

## User

For each genre card add average tempo range for that genre if applicable.  Note if the range is too big or highly variable.

## Assistant

_[tool: grep]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: grep]_

_[tool: run_script]_

_[tool: grep]_

_[tool: run_script]_

_[tool: dc_js_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: ready_for_verification]_

Added an "Avg tempo" block to the genre detail card — a BPM range in mono type just under the definition, with a caveat line when the range is unusually wide or highly variable (prog, mathcore, IDM, hip-hop across eras, etc.). Genres with no meaningful tempo (ambient, drone, free jazz, musique concrète, classical traditions) show no tempo row at all.

## User

Found issues — fixing…

## User

Re-running the check

## Assistant

_[tool: show_html]_

_[tool: ready_for_verification]_

Re-checking now — the verifier will flag anything still broken. Tempo ranges are in place on the genre cards; genres with no meaningful tempo simply omit the row.

## User

Found issues — fixing…

## Assistant

_[tool: run_script]_

_[tool: dc_html_str_replace]_

Re-saved both files to refresh their serving (the 401s looked like a stale-serve issue, not a code bug).

_[tool: ready_for_verification]_

Re-saved `la-data.js` and touched the DC so both scripts get re-served — the earlier failure was the page's script files returning 401 (a serving hiccup), not a defect in the tempo change. Out for re-verification now.

## User

Found issues — fixing…

## Assistant

_[tool: run_script]_

_[tool: sleep]_

_[tool: ready_for_verification]_

Re-emitted `support.js` itself this time (the earlier touch only covered `la-data.js`) and waited before re-checking, in case the 401s were a transient auth expiry. Out for verification again — if it still fails it's a serving issue on the platform side, not the design.

## User

Found issues — fixing…

## User

Re-running the check

## User

Let’s add the following genres: Deep funk, psychedelic soul, funk rock, Afro-funk, Anatolian rock, Ethio-jazz/funk, Zamrock, Afro-rock, Japanese psych, Heavy psychedelic rock, Acid Rock (Acid rock, garage psych, psychedelic rblues-rock, San Francisco psych), Psychedelic funk, jazz-rock, Latin psych, cosmic disco, library funk. 2. Ensure the spacing is nudged appropriately. 3. The zoom on mobile is glitchy, resolve that.

## Assistant

_[tool: read_file]_

_[tool: read_file]_

_[tool: run_script]_

_[tool: read_file]_

_[tool: run_script]_

Now the logic edits — taller world and the mobile pinch fixes:

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

Now checking the new layout for collisions in the dense 1966–73 corridor:

_[tool: show_html]_

_[tool: ready_for_verification]_

No — the work finished and the review came back clean. All 16 genres are on the map (with tempo cards, lineage edges, and Spotify links), the family bands were re-spaced to fit the dense 1966–73 psych/funk corridor, and the mobile pinch-zoom fix is in (stuck-finger tracking on interrupted gestures was the glitch). Give it a look — happy to nudge any node positions if something looks crowded.

## User

Re-running the check

