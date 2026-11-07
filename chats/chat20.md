# Canzone italiana genre classification

_Started 2026-09-18 06:43 UTC_

---

## User

Is Canzone italiana a relevant stand alone genre tag?

## Assistant

_[tool: grep]_

_[tool: grep]_

_[tool: grep]_

Yes, it's a legitimate standalone tag, and it would be a natural fit for the Global / Diaspora family in your atlas.

Why it stands alone:
- It's a recognised umbrella genre in its own right (Discogs, RYM, AllMusic all treat it as one), covering Italian popular song from roughly the 1950s Sanremo era onward: Modugno, Mina, Battisti, Dalla, De André, Battiato.
- It has distinct traits: bel canto‑derived vocal phrasing, orchestral or piano‑led arrangements, lyric‑first songwriting, and the Sanremo festival as its institutional engine.
- It has real lineage links: draws from Neapolitan song and opera, feeds Italo disco and cosmic disco (which you already have), and sits alongside chanson and schlager as the European "national song" traditions.

Caveats:
- It's broad, so it overlaps with cantautori (singer‑songwriter), Italian pop, and Italo disco. If you add it, treat it as the foundational node and let cantautori branch from it.
- Date it around 1958 (Modugno's "Nel blu dipinto di blu") rather than trying to reach back to Neapolitan song, unless you want that as a separate 19th‑century root.

Want me to add it (and optionally chanson as a sibling) to the map?

## User

Ok, let’s create it and a node for Ítalo disco.  Also if there is a beach Enio Morricone would fit.  While you are adding let fox the bugginess of the over all grid it’s hard to move around and laggy.  Also the genre map is odd with some before the lineage starts, find a more elegant way to organize.

## Assistant

_[tool: list_files]_

_[tool: grep]_

_[tool: grep]_

_[tool: read_file]_

_[tool: grep]_

_[tool: read_file]_

_[tool: show_html]_

_[tool: show_html]_

_[tool: multi_screenshot]_

_[tool: multi_screenshot]_

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: show_html]_

_[tool: multi_screenshot]_

_[tool: grep]_

_[tool: str_replace_edit]_

_[tool: show_html]_

_[tool: multi_screenshot]_

_[tool: ready_for_verification]_

Out for review. What changed:

- **Canzone Italiana** (1958, Global & Diaspora) and **Italo Disco** (1982, Electronic + Soul hybrid) are in the map, wired to Classical, Film Score, Disco, Synth-pop, Cosmic Disco, House and Synthwave, plus a curated "Italian Connection" journey.
- **Morricone** lives under **Film Score** (1933, Jazz & Experimental), which also links to Library Funk, Trip-hop and Post-rock. Searching his name jumps straight there.
- **Root stem**: the pre‑1865 art‑music nodes (Ancient Greek → Gregorian → Renaissance Polyphony → Classical) now form one vertical column at the left, read top‑down and centred on the map, feeding the recorded era instead of sitting awkwardly inside the Jazz row. Classical is now dated 1750 so it joins the stem.
- **Performance**: edge geometry is computed once instead of every render, hidden edge labels are no longer drawn, hover has a short intent delay so sweeping across clusters doesn't re-render the whole map, glow shadows are lighter, and max zoom is capped at 2× (the extreme zoom levels were the main source of re-rasterization lag).

One caveat: on a plain mouse, the scroll wheel zooms (trackpads pan); drag to move. Tell me if you'd rather have wheel = pan.

## User

Re-running the check

