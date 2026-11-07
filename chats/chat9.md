# Music artist genre search feature

_Started 2026-07-20 01:19 UTC_

---

## User

It would be help in the search, in addition to genre, because able to search a band or music artist and have it either return the genre(s) that artist belongs too, is possible, the aim to prioritize the specific genre, but can roll-up the family tree as needed, if a micro-genre or scene is missing.

## Assistant

_[tool: read_file]_

_[tool: grep]_

_[tool: grep]_

_[tool: grep]_

_[tool: run_script]_

_[tool: run_script]_

_[tool: str_replace_edit]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: ready_for_verification]_

Search now covers artists as well as genres. Typing a band/artist name returns the genre(s) they belong to — most specific first, with a "via [artist]" note on each result. A curated index of ~230 well-known artists (beyond each genre's representative lists) handles roll-ups: if an artist's micro-genre isn't a node, they map to the nearest parent (e.g. pop-punk acts → Punk/Emo, G-funk → Hip-Hop + Funk). Multi-genre artists like Miles Davis or Radiohead return one row per genre.

If you search someone and get nothing, tell me — I can keep growing the index.

## User

Can we add a Guided Path for 1960s Garage to Psych to Desert Rock to nu psychedelic to the current frontiers?  Ensure you have all of the genres for this.

## Assistant

_[tool: grep]_

_[tool: grep]_

_[tool: str_replace_edit]_

_[tool: ready_for_verification]_

Added "Garage to Psych to the Desert" under Guided Paths — 8 steps: Garage Rock → Psychedelic Rock → Acid Rock → Heavy Psych → Desert Rock → Stoner Rock → Neo-Psychedelia (nu-psych) → Desert Punk (the current frontier). All stops were already nodes in the atlas, so no new genres were needed.

## User

You made too much of a leap from Heavy Psych to Desert, you need to pick up the genres in between.

## Assistant

_[tool: str_replace_edit]_

_[tool: ready_for_verification]_

Filled the gap — the path now runs Heavy Psych → Heavy Metal → Doom Metal → Desert Rock (10 steps total), tracing how Sabbath's weight passed through the doom underground before the Palm Desert scene detuned it.

## User

Dream Pop is a form of proto Post-Rock, yeah?

## Assistant

_[tool: grep]_

_[tool: str_replace_edit]_

_[tool: ready_for_verification]_

Added a Dream Pop → Post-Rock stylistic influence edge (0.5 — slightly stronger than the shoegaze one, since it's the more direct ancestor). It now shows in both genres' panels and on the map.

## User

Where are the Slits in the artist search?

## Assistant

_[tool: grep]_

_[tool: str_replace_edit]_

_[tool: ready_for_verification]_

Added The Slits (Post-Punk primary, plus Punk and Dub for their Cut-era dub side), and while I was there: The Raincoats, Gang of Four, Public Image Ltd, X-Ray Spex, and ESG. Searching "slits" now resolves to Post-Punk → Punk → Dub.

## User

Shoegaze is a sub-genre of Indie.  It's also known as 'Dream Rock' for the more informaiton.  Also be aware, Numerous revivals have since emerged in the form of nu gaze (sometimes "second-wave shoegaze") and blackgaze in the 2000s, grungegaze in the 2010s, and zoomergaze in the 2020s.  Let's ensure these are captured, including missing genres.

## Assistant

_[tool: read_file]_

_[tool: read_file]_

_[tool: grep]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: dc_js_str_replace]_

_[tool: ready_for_verification]_

The full shoegaze wave history is now captured:

- **Shoegaze** — def notes it grew up inside the UK indie scene and is also called "dream rock"; added a scene edge to Indie Rock; searching "dream rock" now finds it (genre aliases are searchable).
- **Nu-Gaze** — re-dated to 2006 as the second wave (alias "second-wave shoegaze"), now a revival node with Silversun Pickups / M83 / A Place to Bury Strangers.
- **Blackgaze** (2000s) — already existed, unchanged.
- **Grunge Gaze** — re-dated to 2016 as the 2010s wave; Nothing added as an artist.
- **Zoomergaze** — new rising node (2021): the DAW-native, TikTok-born fourth wave (Wisp, julie, quannnic), with revival/production/scene edges from Shoegaze, Nu-Gaze, Bedroom Pop, and Grunge Gaze.

## User

zoomergaze and Sprechgesang are on top of each other visually.  Also, is Sprechgesan originall from 2020 check that and ensure you don't need to create the origin and revival.

## Assistant

_[tool: grep]_

_[tool: grep]_

_[tool: str_replace_edit]_

_[tool: ready_for_verification]_

Two fixes:

- **Overlap** — moved Zoomergaze to the lane Nu-Gaze vacated (it now sits ~105px below Sprechgesang instead of on top of it).
- **Sprechgesang origin** — the term isn't from 2020: Schoenberg's *Sprechstimme* (Pierrot Lunaire, 1912) named the technique. The 2020 node is correctly the revival wave, and the lineage was already half-covered (Post-Punk revival edge via The Fall, Hip-Hop stylistic edge). I added the missing origin: a revival edge from Modern Classical (1908, which covers Schoenberg) → Sprechgesang. No new node needed.

