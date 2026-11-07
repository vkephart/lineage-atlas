# Chat

_Started 2026-07-20 01:19 UTC_

---

## User

<artifact-content-authored-by-others/>
Continuing from "Claude Code vs Artifacts".

## Assistant

We were building a comprehensive music genre lineage atlas with search, multiple streaming service links, and iOS mobile fixes.

We added a search box that matches genre names and artists, with results ranked and viewport-jumping. You chose to support Spotify, Apple Music, and Bandcamp with a service picker that remembers your choice, and upgraded Spotify desktop links to try launching the native app first, falling back to web. All 16 originally pending genres went live (Deep funk, psychedelic soul, funk rock, Afro-funk, Anatolian rock, Ethio-jazz/funk, Zamrock, Afro-rock, Japanese psych, Heavy psychedelic rock, Acid rock, Psychedelic funk, jazz-rock, Latin psych, cosmic disco, library funk), then we expanded to 155 genres total by adding your requested 17 (Art Rock, Art Pop, Experimental, Sprechgesang, Indie Dance, Baroque Pop, Electroclash, Grunge Gaze, Dark Post-Punk, Ambient Post-Rock, Baile Funk, Darkwave, Bedroom Pop, Nu-Yacht Rock, French Touch, Bossa Nova) with intentional frontier coverage — new edges connecting rising genres like hyperpop, Jersey Club, and future funk to show where styles are morphing.

We fixed three iOS Safari issues: pinch-zoom was competing with Safari's native page zoom, long-press was triggering text selection, and search input focus was triggering page zoom that threw results off-screen. The last fix (16px input font) is in place.

Current state: 155 genres, 404 edges, search live, streaming picker live, iOS gesture behavior patched. The search results dropdown issue persists on mobile — results are still appearing off-screen left despite the font-size fix.

Next: diagnose and resolve the mobile search results alignment fully, then you can decide whether to expand further or move to publishing.

Files: la-data.js, The Lineage Atlas.dc.html, support.js

