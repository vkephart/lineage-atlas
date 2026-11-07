# Lineage Atlas Dub node updates

_Started 2026-10-08 03:05 UTC_

---

## User

In the Lineage Atlas data, make these changes to the Dub node and its edges. Match existing E() edge format and tone.

1. Fix the Dub track title "King Tubby Meets the Rockers Uptown" to "King Tubby Meets Rockers Uptown" (no "the"). Leave the album title unchanged.

2. Add edges:
   E('dub','postpunk','production',0.6,"Post-punk borrows dub's cavernous echo, drop-outs and bass-forward mix.")
   E('dub','disco','production',0.4,"The dub mix and stripped 12-inch version carry dub's remix logic into the disco club.")
   E('dub','ambienttechno','production',0.5,"Dub techno fuses dub's delay-drenched chords with the techno pulse.")

3. Do not add new nodes yet. Show me the updated Dub node card and the three new edges in the graph so I can review placement.

## Assistant

_[tool: grep]_

_[tool: grep]_

_[tool: grep]_

A `dub → postpunk` production edge (0.6) already exists at line 1694 with different wording, so adding yours would draw it twice. I left the existing edge alone and added the other two.

_[tool: run_script]_

_[tool: grep]_

_[tool: show_html]_

_[tool: multi_screenshot]_

The user asked to see it, so I'm opening it directly.

_[tool: show_to_user]_

_[tool: multi_screenshot]_

_[tool: grep]_

_[tool: read_file]_

_[tool: multi_screenshot]_

_[tool: multi_screenshot]_

_[tool: grep]_

_[tool: multi_screenshot]_

_[tool: eval_js_user_view]_

_[tool: eval_js_user_view]_

_[tool: screenshot_user_view]_

_[tool: eval_js_user_view]_

_[tool: screenshot_user_view]_

_[tool: eval_js_user_view]_

_[tool: screenshot_user_view]_

_[tool: eval_js_user_view]_

I've made the changes in `la-data.js`, and Dub is open in your preview with its edges highlighted.

- **Track title:** now "King Tubby Meets Rockers Uptown". The album title "King Tubbys Meets Rockers Uptown" is unchanged.
- **Dub → Post-Punk: not added.** That edge already exists as `production, 0.6`, with this description: "Post-punk took dub as method: bass to the front, instruments dropped in and out, everything drenched in echo and space." A second copy would draw the same line twice. I can replace that description with yours if you prefer it.
- **Dub → Disco and Dub → Ambient Techno:** added right after the existing Dub → Post-Punk edge, in the Global section.

**Placement:**
- **Ambient Techno:** a clean dotted curve up and to the right from Dub. It reads well.
- **Disco:** almost directly above Dub (1974 vs 1973), about 860px up at default zoom. The edge is a long near-vertical line through the soul and rock area.
- **Post-Punk:** also nearly vertical, about 490px above Dub.

The two vertical edges run next to each other and are hard to tell apart from far out. Moving Dub sideways would separate them; adjusting `yOff` alone won't.

