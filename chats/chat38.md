# Indie pop as music genre

_Started 2026-10-15 05:58 UTC_

---

## User

is indie pop worth while as a genre add?  I came across this from Glasgow Indie Pop eg Belle and Sabatian, camera obscura, the pastels, teenage fan club.  Glasgow may be too specific of it sits better as Indie pop?

## Assistant

_[tool: grep]_

_[tool: read_file]_

_[tool: grep]_

Yes, it's worth adding, and Indie Pop is the right level. Glasgow is a scene inside the genre, not a genre itself.

**Why it earns a node:** The map already has Jangle Pop (R.E.M., The Smiths, Orange Juice) and Indie Rock (Pavement, Guided by Voices, Yo La Tengo). Indie Rock is weighted toward US lo-fi, so the UK line from C86 through Sarah Records to Belle & Sebastian has no home. Indie Pop has its own sound: soft or untrained vocals, deliberately naive melodies, chamber-pop strings and brass, and 60s girl-group and Velvet Underground references. It also has its own ethos (anti-macho, fanzines, 7-inch singles), which sets it apart from both of its neighbours.

**How Glasgow fits:**
- Use it in the Scene/context trait, e.g. Postcard Records → the Pastels and 53rd & 3rd → Belle & Sebastian and Camera Obscura.
- Orange Juice is already in Jangle Pop, so a Glasgow link gives the edge to Indie Pop a real story.
- Twee and C86 work as `aka` names, the same way Shoegaze uses "Dream Rock".

**Your artist list:**
- **Core Indie Pop:** The Pastels, Belle & Sebastian, Camera Obscura.
- **Teenage Fanclub:** leans power pop/jangle. I'd tag them to Indie Pop plus Jangle Pop rather than make them a headline artist.

**Proposed node:** Indie Pop, rock family, c. 1986, branch. Edges:
- Jangle Pop → Indie Pop (origin)
- Post-Punk → Indie Pop (Postcard Records' scratchy guitar pop)
- Folk Rock → Indie Pop (stylistic link)
- Indie Pop → Dream Pop (shared scene via Sarah Records)
- Indie Pop → Bedroom Pop (stylistic link)

Want me to add it this way?

## User

post punk really connects to indie pop?

## Assistant

Partly, but the link is weaker than I made it sound.

**What supports it:**
- Postcard Records (Orange Juice, Josef K) came out of Glasgow's post-punk scene in 1979–81. Josef K were a straight post-punk band.
- Television Personalities, Swell Maps and Young Marble Giants were DIY post-punk acts that the C86 bands openly copied: amateur playing, home-made 7-inch singles, fanzines.

**What cuts against it:**
- Orange Juice were mostly reacting against post-punk's gloom. Their influences were the Velvets, the Byrds, Chic and Motown, not Joy Division.
- The Pastels, Belle & Sebastian and Camera Obscura sound nothing like post-punk. What they took from it was the DIY ethos, not the music.

**My recommendation:** Don't make it an origin edge. Two options:
1. Keep Post-Punk → Indie Pop as a weak **scene** edge (about 0.35), with a note like "Postcard Records and DIY post-punk singles set the template; the sound turned away from post-punk's gloom."
2. Drop it and use **Punk → Indie Pop** for the DIY ethos instead. The map already has Post-Punk → Jangle Pop → Indie Pop, so the post-punk lineage still comes through indirectly.

I'd go with option 2. It's the cleaner claim. Want me to add Indie Pop with that edge set?

## User

Yes to 2 and do we have the dates right for Indie pop, check.

## Assistant

_[tool: grep]_

_[tool: grep]_

_[tool: web_search]_

_[tool: grep]_

_[tool: read_file]_

_[tool: grep]_

_[tool: grep]_

_[tool: grep]_

_[tool: read_file]_

_[tool: str_replace_edit]_

_[tool: ready_for_verification]_

I've added Indie Pop to the map in the Rock family, dated 1986. I placed it by eye, so check it doesn't sit on top of a nearby node.

**The 1986 date checks out.** The key moment in naming indie pop as a genre was the release of NME's C86 tape in 1986, and that compilation is today credited as the birth of indie pop. The roots go back further: Simon Reynolds has said that "what we now know as indie music was invented in Scotland," with reference to the emergence of Postcard Records in 1979. I've put the 1979 roots in the genre's description and kept 1986 as its position on the map.

**This partly contradicts what I said about post-punk.** Wikipedia says indie pop originated from British post-punk in the late 1970s, and lists post-punk among its stylistic origins. Other sources say its roots [are] in Scottish post-punk bands on the Postcard Records label in the early 1980s (Josef K and Orange Juice). So a direct post-punk link has stronger backing than I suggested. I've built your option 2 as agreed. Adding a weak Post-Punk → Indie Pop edge alongside it would be easy if you want it.

**What's in it:**
- **Also known as:** C86 / Twee Pop.
- **Glasgow:** shown in the Scene/context trait, running from Postcard to 53rd & 3rd.
- **Artists:** The Pastels, Belle and Sebastian, Camera Obscura and Television Personalities. Teenage Fanclub and Orange Juice are linked to both Indie Pop and Jangle Pop.
- **Connections:** Jangle Pop → Indie Pop, Punk → Indie Pop, Folk Rock → Indie Pop, Indie Pop → Dream Pop (via Sarah Records) and Indie Pop → Bedroom Pop.

