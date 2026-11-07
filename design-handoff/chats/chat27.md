# Electronic rock genre overview

_Started 2026-10-03 04:07 UTC_

---

## User

Before adding, just answer is Electronic Rock a genre tags, and if so what are some example artists and time the genre started?

## Assistant

_[tool: grep]_

Yes. Electronic rock is an established genre tag, used on Wikipedia, RateYourMusic and Discogs-style taxonomies. It isn't in `la-data.js` yet.

**Started:** late 1960s, around 1968, when rock bands began using oscillators and early synthesizers.

**Example artists:**
- **Pioneers (late '60s–'70s):** Silver Apples, The United States of America, Suicide
- **Late '70s–'80s:** Gary Numan, Ultravox, Devo
- **'90s:** Nine Inch Nails, The Prodigy, Garbage
- **2000s on:** Muse, Radiohead (the *Kid A* era), The Killers

**Neighbouring genres it overlaps with:** krautrock, synth-pop, industrial rock, new wave and electronica.

Do you want me to add it to the map?

## User

So it’s knit acts like caribou, Radiohead, joy wave, simian mobile disco?  I ask because I’m trying to understand if means a specific era a it just the introduction of synth.  On they other hand maybe the acts you mentioned are the genesis.

## Assistant

Electronic rock is a broad umbrella, not a specific era. It covers any rock music where electronics carry a big part of the sound, from 1968 to today. The acts I listed span its whole history; only the first group is the genesis.

Your examples:
- **Radiohead (Kid A onward):** yes, commonly tagged electronic rock.
- **Joywave:** yes. It's also tagged indietronica.
- **Caribou:** borderline. It's more often tagged indietronica, psychedelic electronic or house. The band structure is there, but the music is mostly electronic.
- **Simian Mobile Disco:** no. That's electronic and house music with no rock base, even though the members came from the rock band Simian.

The tag you're probably reaching for is **indietronica**. It's a narrower, era-specific offshoot that emerged in the mid-to-late 1990s and peaked in the 2000s, and it fits Caribou, Joywave, The Postal Service, Hot Chip and Passion Pit. **Dance-punk** (2000s: LCD Soundsystem, !!!) is a nearby branch on the same timeline.

For the map, that gives this lineage: electronic rock (1968, the root) → new wave/synth-pop and industrial rock → indietronica and dance-punk (late '90s–2000s).

## User

Great can we add each of the missing links, and mindful of not overcrowding the ui.

## Assistant

_[tool: read_file]_

_[tool: grep]_

_[tool: run_script]_

_[tool: run_script]_

_[tool: run_script]_

_[tool: run_script]_

_[tool: show_html]_

_[tool: ready_for_verification]_

I added three missing genres to the Rock row, each placed in an empty spot so it doesn't overlap existing labels. A check of the map layout is still running.

- **Electronic Rock (1968):** Silver Apples, The United States of America, Suicide. It comes out of Psychedelic Rock and leads into Krautrock, New Wave, Synth Pop and Industrial Rock.
- **Industrial Rock (1989):** Nine Inch Nails, Ministry, KMFDM. It comes from Industrial, Post-Punk and Alternative Rock.
- **Indietronica (1997):** The Postal Service, Caribou, Hot Chip. It comes from Indie Rock, IDM and Synth Pop, and leads into Electropop and Bedroom Pop.

The map already had an "Indie Dance" genre with LCD Soundsystem, The Rapture and !!!, which is dance-punk. Rather than add a duplicate, I gave it the alternate name "Dance-Punk", so searching for dance-punk now finds it.

I also made these artists searchable under the right genres: Joywave, Passion Pit, Radiohead, Gary Numan and Simian Mobile Disco. Simian Mobile Disco is listed under House and Electroclash, not rock.

## User

no indietronica connection though in the lineage?

## Assistant



## User

no indietronica connection though in the lineage?

## Assistant

_[tool: run_script]_

_[tool: run_script]_

_[tool: run_script]_

_[tool: run_script]_

_[tool: run_script]_

_[tool: show_html]_

_[tool: eval_js_user_view]_

_[tool: run_script]_

_[tool: ready_for_verification]_

_[tool: run_script]_

The file is fine; the load errors look transient. Retrying.

_[tool: ready_for_verification]_

_[tool: eval_js_user_view]_

I added two links: **Electronic Rock → Indietronica**, which makes it the direct branch you asked about, and **Indietronica → Indie Dance (Dance-Punk)**.

Before this, Indietronica connected to Indie Rock, IDM, Synth Pop, Electropop and Bedroom Pop, but not to Electronic Rock.

Your preview hasn't picked up the change yet: the page couldn't load the updated data file and is still showing the old version. The file itself checks out fine. Reload the page and the new links should appear; if they don't, tell me and I'll look into it.

## User

Just evaluate one more time if the lineage is correct for this links.  I do think indietronica is in the link but maybe not directly to electronic rock.  Do the research and sure this up.

## Assistant

_[tool: run_script]_

_[tool: ready_for_verification]_

_[tool: web_search]_

_[tool: web_search]_

You were right: Indietronica belongs under the Electronic Rock umbrella, but it doesn't come directly from it.

- **Umbrella:** Wikipedia lists Indietronica as a subgenre of Electronic Rock, along with dance-punk, electroclash, industrial rock and krautrock. Those subgenres grew out of electronic rock acts fusing in styles like punk rock, industrial rock, hip hop, techno and synth-pop.
- **Direct ancestry:** Indietronica is filed as a fusion genre of indie pop and of electronica. Its actual sound is indie songwriting meeting '90s electronica, not a descendant of the 1968 bands.

What I changed in the map:
- **Electronic Rock → Indietronica:** kept, but weakened to a faint "umbrella" link. Its description now says it's a category relationship, not direct descent.
- **IDM → Indietronica:** strengthened, and now framed as the electronica half of the fusion. The map has no separate Electronica genre, so IDM stands in for it.
- **Indie Rock → Indietronica:** still the main origin link.
- **Indietronica → Indie Dance:** removed. I'd added it on a guess and the research doesn't support it; the two are parallel 2000s branches.

Your preview is still showing the old data. Reload the page to see the changes.

One more problem I found: Industrial Rock is dated 1989 in the map, but sources place its start in the late 1970s. 1989 is when Nine Inch Nails took it mainstream. Should I move it to around 1980?

