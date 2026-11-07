# Witch House genre exploration

_Started 2026-08-16 20:17 UTC_

---

## User

Based on I aspiration from the quote, lets add Witch House as a genre.  Possibly link d with with darkwave and including key artists like Salem and Crystal Castles.  It likely has a predecessor from chopped n screwed, so late add that if validated as well.

## Assistant

I'll look at the data structure first.

_[tool: grep]_

_[tool: read_file]_

_[tool: grep]_

_[tool: read_file]_

_[tool: grep]_

_[tool: grep]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: grep]_

_[tool: grep]_

_[tool: grep]_

_[tool: web_search]_

_[tool: grep]_

_[tool: run_script]_

_[tool: ready_for_verification]_

Added two nodes.

**Witch House** (1969-family: Gaze, 2009) — Salem, Crystal Castles, oOoOO; linked from Darkwave (origin), Ethereal Wave, Industrial, Shoegaze, and forward into Alternative R&B and Hyperpop.

**Chopped & Screwed** (Hip-Hop, 1993) — validated as a foundational influence (DJ Screw's Houston screwtapes are cited as such by Wikipedia, Complex and RYM), so it's in as its own node feeding Witch House via a production edge.

Also added: a "How Witch House Emerged" curated journey, tempo ranges, and search-index entries for Balam Acab, White Ring, Pictureplane, Sidewalks and Skeletons and Pastel Ghost.

## User

I'm unable to search, have these been indexed?

## Assistant

_[tool: grep]_

_[tool: eval_js]_

_[tool: eval_js]_

_[tool: grep]_

_[tool: read_file]_

Yes. Search covers genre names, alternate names, and the artist index, and all of it is built from the data file at load:

- **Genre names**: "Witch House" (also its aka "Drag / Screwgaze"), "Chopped & Screwed" (aka "Screwed & Chopped / Slowed and Throwed")
- **Artists on the nodes** (auto-indexed): Salem, Crystal Castles, oOoOO, DJ Screw, Big Moe, Michael Watts
- **Added to the supplemental index**: Balam Acab, White Ring, Pictureplane, Sidewalks and Skeletons, Pastel Ghost

So typing "salem", "screw", "pastel" or "witch" will surface the nodes.

