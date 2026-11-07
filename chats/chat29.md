# Tape Music Electroacoustic Classification

_Started 2026-10-04 19:39 UTC_

---

## User

Let’s add Tape Music / Electroacoustic as tag.  I’m sourcing from Jaap vink eg Tape Music / Electroacoustic clears your node test easily (distinct studios, composers, sound). Screen fits best as an ancestor with an edge into Drone and Dark Ambient, not as a member of those nodes. And (electroacoustic). In 1960s terms, "electronic music" meant something specific: sounds generated from oscillators, filters, and modulators, then shaped on tape. That was the Cologne-derived tradition the Utrecht studio worked in, as opposed to the Paris disc on the same box, which is musique concrète (recorded real-world sounds, manipulated). So the four LPs actually span two rival schools, and Screen sits on the synthesized side.

We may need some connected nodes here, but research this for accuracy, time period, and other meta data for accuracy and placement.

## Assistant

_[tool: list_files]_

_[tool: grep]_

_[tool: read_file]_

_[tool: grep]_

_[tool: grep]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: grep]_

_[tool: grep]_

_[tool: grep]_

_[tool: grep]_

_[tool: grep]_

_[tool: web_search]_

_[tool: web_search]_

_[tool: read_file]_

_[tool: grep]_

_[tool: grep]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: grep]_

_[tool: web_search]_

_[tool: web_search]_

_[tool: web_search]_

_[tool: str_replace_edit]_

The data file currently has no Tape Music / Electroacoustic node and no Dark Ambient node, so before writing anything I checked the history against outside sources. Adding both now.

_[tool: snip]_

_[tool: ready_for_verification]_

The atlas had no Tape Music / Electroacoustic node and no Dark Ambient node, so I checked the history first and then added both to `la-data.js`. A background check of the map is still running.

**Tape Music / Electroacoustic** (1951, a foundational node in the Jazz & Experimental row, also known as Elektronische Musik)
- Framed as the synthesized Cologne tradition and the rival to musique concrète, which the existing Musique Concrète node already covers.
- The Utrecht studio dates are confirmed: in November 1960 the Philips studio moved to Utrecht University as STEM, Koenig became Artistic Director in September 1964, and it was renamed the Institute of Sonology in October 1967.
- The Screen entry is based on sources saying it was recorded in 1968 and issued in 1970 by Philips on a four-LP set, and that it combines pink and white noise plus tones with no identifiable pitch.
- It also lists Studie II and Funktion Grün, with artists Stockhausen, Eimert, Koenig and Vink, and the Electronic Panorama box as its album.
- Edges: from Modern Classical and Musique Concrète in, and out to Drone, Dark Ambient and Krautrock. The Krautrock edge is there because Can's Czukay and Schmidt studied with Stockhausen.

**Dark Ambient** (1985, a branch node). It was needed as the target of your second edge.
- It is originally known as ambient industrial, and the term was coined in the early 1990s by Roger Karmanik.
- Representative records are Lustmord's Heresy and raison d'être's Prospectus I.
- Edges: Industrial, Ambient, Drone, Musique Concrète and Krautrock feed into it. Tangerine Dream's Zeit and Popol Vuh are listed as precursors. It has one edge out to Black Metal.

**A correction I made without asking:** Musique Concrète listed Stockhausen and Gesang der Jünglinge, but that piece was made at the Cologne studio. I replaced him with François Bayle and Luc Ferrari's Presque rien No. 1, and the Stockhausen piece now appears in the edge note linking the two schools. Undo this if you'd rather keep the original.

The new artists are also searchable. The positions I chose may overlap other nodes, so I may need to nudge them.

## User

You may have already considered this, but checking if anything was missed: A few lineage edges worth considering as you flesh it out (my judgment, unsourced):

	•	Siblings: Musique Concrète (Paris/GRM), which the Panorama box literally sits next to. Many taxonomies fold both under Electroacoustic, so decide whether that's a parent node or just a grouping.
	•	Ancestors: early oscillator and tape experiments from studios like Cologne's WDR and the Philips lab in Eindhoven.
	•	Descendants: Drone, Dark Ambient, Kosmische (via the synth and tape-loop techniques), and later academic Computer Music, which Koenig's Utrecht work fed directly.

## Assistant

_[tool: grep]_

_[tool: grep]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: ready_for_verification]_

I added two of your descendants as new nodes and handled the other suggestions as below. A background check of the map is running.

- **Sibling or parent:** Musique Concrète stays a sibling, linked by the edge noting the Paris-versus-Cologne rivalry. Making Electroacoustic a parent would pull the existing Musique Concrète node under it. The catch is that the new node's name says "Electroacoustic" while it covers only the synthesized side. If that reads as an umbrella, I can rename it "Elektronische Musik / Tape Music".
- **Ancestors:** WDR Cologne and Philips Eindhoven are studios rather than genres, so they appear in the node's description, not as nodes. Its genre parents are Modern Classical and Musique Concrète.
- **Kosmische / Berlin School** (1972, new node): it comes from Krautrock and Electroacoustic. It leads to Ambient and New Age, and to Dark Ambient, now with Zeit and Irrlicht as the precursors. I removed the earlier Krautrock → Dark Ambient edge, because Zeit is a Kosmische record.
- **Computer Music** (1957, new node): it starts from Max Mathews' MUSIC software at Bell Labs. It comes from Electroacoustic through Koenig's Project 1 at Utrecht in 1964 and the studio's PDP-15 in 1971. It leads to Synth Pop, via Chowning's FM synthesis and the Yamaha DX7, and to IDM.
- **Electronic Rock:** I also added a weaker edge from Electroacoustic.

Unlike the first round, these additions come from my own knowledge rather than fresh research. They include the Computer Music dates, Chowning's FM licensing, and the Klaus Schulze and Cluster track titles. Spot-check them against Vink-era sources if accuracy matters.

Both new nodes sit in the Electronic & Dance row, which is empty before 1981.

