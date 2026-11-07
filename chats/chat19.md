# Ska, reggae, punk connections

_Started 2026-08-22 16:39 UTC_

---

## User

I changes yet.  Where is the connection of ska / reggae to punk.  I thought there was some late 70s connection?

## Assistant

_[tool: grep]_

_[tool: list_files]_

_[tool: grep]_

_[tool: grep]_

It's not in the map — that's a genuine gap. Nothing currently links the Jamaican branch (ska → reggae → dub) to the rock/punk side. The only edges out of that cluster go to ambient, UK garage, trip-hop and hauntology.

The late-70s connection you're remembering is real, and it runs two ways:

**Reggae/dub → punk & post-punk (1976–79).** Don Letts DJing reggae between sets at the Roxy because there weren't enough punk records; The Clash covering "Police and Thieves"; Marley's "Punky Reggae Party" as a direct response. Post-punk then absorbed dub as method rather than genre — PiL, The Slits, Gang of Four, the *Metal Box* bass-and-space approach. Your post-punk node already says "dub space" in its definition and lists The Slits and PiL with dub tags, but there's no edge carrying it.

**2 Tone / the ska revival (1979).** Coventry, Chrysalis-distributed, The Specials / The Selecter / Madness / The Beat — first-wave Jamaican ska played at punk tempo with punk's DIY label structure and mixed-race lineup as an explicit anti-racist statement. That's the actual ska–punk hinge, and it's the missing node.

Then later: ska-punk third wave (Operation Ivy, Rancid, Sublime, mid-90s).

If you want, I can add:
- a **2 Tone** node (1979, hybrid of `global` + `rock`), with edges from `ska` and `punk`
- `dub` → `postpunk` (production, ~0.6)
- `reggae` → `punk` (scene, ~0.4) for the Roxy/Letts crossover
- optionally a **Ska Punk** node (1989/1995) descending from 2 Tone and hardcore

Want all four, or just the 2 Tone node and the two edges?

## User

Yes all four!

## Assistant

_[tool: read_file]_

_[tool: read_file]_

_[tool: run_script]_

_[tool: ready_for_verification]_

Added, all four:

- **2 Tone** (1979, global × rock hybrid) — Specials, Selecter, Madness, The Beat; edges in from `ska` (revival, 0.85) and `punk` (origin, 0.6)
- **Ska Punk** (1989, rock × global hybrid) — Operation Ivy, Rancid, Sublime, Bosstones; edges in from `twotone` and `hardcore`
- **reggae → punk** (scene, 0.4) — Roxy/Letts, "Police and Thieves", "Punky Reggae Party"
- **dub → post-punk** (production, 0.6)

Artists indexed too. The vertical offsets in the rock band are crowded around 1989 — if Ska Punk collides with anything on screen, tell me and I'll nudge it.

## User

Yes nudge, it’s on top of Madchester:

## Assistant

_[tool: grep]_

_[tool: run_script]_

_[tool: run_script]_

_[tool: ready_for_verification]_

_[tool: ready_for_verification]_

_[tool: show_html]_

_[tool: show_html]_

_[tool: show_html]_

_[tool: show_html]_

_[tool: screenshot_user_view]_

Nudged — Ska Punk now sits clear below Madchester. (Your live view confirms it; my own preview pane is having trouble loading scripts, unrelated to the data.)

