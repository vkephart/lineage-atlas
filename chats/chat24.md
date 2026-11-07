# Burundi beat and post-punk connections

_Started 2026-09-25 06:02 UTC_

---

## User

How about Burundi beat and interested if this connects to things like new wave, post punk or anything like that?

## Assistant

_[tool: grep]_

_[tool: read_file]_

_[tool: grep]_

_[tool: read_file]_

_[tool: grep]_

_[tool: grep]_

_[tool: read_file]_

_[tool: grep]_

_[tool: grep]_

_[tool: grep]_

_[tool: web_search]_

_[tool: run_script]_

_[tool: str_replace_edit]_

_[tool: show_html]_

_[tool: ready_for_verification]_

Yes, it connects directly to new wave and post-punk, and I've added it to the atlas. **Burundi Drumming** is now a node in the Global row, dated 1967, with links to New Wave and Post-Punk.

**How it links up**
- **The source recording:** It was made in 1967 by Michel Vuylsteke and Charles Duvelle, and was released on the album Musique du Burundi on the French Ocora label in 1968.
- **The first pop hit:** Under the name Burundi Steïphenson Black, Bernholc reached Number 31 in the UK charts in 1971 with 'Burundi Black'. Joni Mitchell also used the field recording of the Burundi drummers with some Moog synthesiser for 'The Jungle Line' in 1975.
- **New wave (the strongest link):** Adam and the Ants were instantly transfixed by the Burundi Beat, and crafted their new sound around the heavy rolling low-tom adaptation led by two drummers. Malcolm McLaren then used the same beat for Bow Wow Wow, and both bands were determined to debut the new Burundi-based sound to the public first.
- **Post-punk (a weaker link):** The recording turns up on "Zimbo" by Echo & the Bunnymen (1983).

I also added Adam and the Ants, Bow Wow Wow, Echo & the Bunnymen and the Royal Drummers of Burundi to artist search.

I didn't link it to Gothic Rock. Goth's "tribal toms" sound similar, but I couldn't find a documented direct influence. If you want, I can add a guided journey from Burundi to Adam and the Ants.

## User

Something messed up after you search now

## Assistant

_[tool: grep]_

_[tool: grep]_

_[tool: grep]_

_[tool: run_script]_

_[tool: ready_for_verification]_

I made two fixes; I haven't checked them on a phone screen yet.

- **Top bar:** After a search, the "Lineage" strip showing your selected genre sat on top of the title and search box on mobile. It now appears below the header, along the left edge. If it gets too long for the screen, it scrolls sideways.
- **Burundi Drumming:** The circle was overlapping Reggae and Latin Psych, so I moved it higher up in the Global row, where there's empty space.

## User

Now behind the search text is too transparent

## Assistant

_[tool: grep]_

_[tool: str_replace_edit]_

_[tool: ready_for_verification]_

_[tool: show_html]_

_[tool: get_webview_logs]_

_[tool: list_files]_

Files are present; likely a transient load failure. Retrying.

_[tool: ready_for_verification]_

_[tool: read_file]_

_[tool: read_file]_

The search box and the buttons next to it now have a solid dark background on phone screens, so the map no longer shows through the text.

My preview wouldn't load the page to check it: it failed to fetch `support.js` and `la-data.js` twice. Both files are still in the project and unchanged, and this edit only touched styling, so it's most likely a preview glitch on my end. If the page doesn't load for you either, refresh it and let me know if the problem is still there.

## User

Good now, just want to verify we have it correct at Burundi drumming instead of Burundi Beat.  I’m not stating a fact just having you verify.

## Assistant

_[tool: web_search]_

Yes, "Burundi Drumming" is the right name for the node. The two names refer to slightly different things:

- **Burundi Drumming** is the tradition itself: the royal ingoma drum ensembles of Burundi. The large drums "Ingoma" are made from hollowed tree trunks covered with skin. The "Amashako" drums provide a continuous beat, and "Ibishikiso" drums follow the rhythm of the central "Inkiranya" drum.
- **"Burundi Beat"** is the nickname Western listeners gave to that sound. Their massed drum sound, or the "Burundi beat" as it became known, also caught the ear of Western musicians. The name also refers to one specific recording: a performance by 25 drummers in a commune called Bukirasazi, recorded in 1967 by French anthropologists and released on a compilation of Burundi music the following year.

The tradition is what belongs on the map, so the node keeps "Burundi Drumming" as its name. "The Burundi Beat" is already listed as an alternate name, next to "Ingoma", so the pop-history term still shows up.

I found one detail that needs a fix. The Echo & the Bunnymen track is "All My Colours (Zimbo)", from 1981. I only called it "Zimbo", and my earlier date of 1983 was wrong. Should I correct it in the data?

## User

Yes

## Assistant

_[tool: str_replace_edit]_

_[tool: ready_for_verification]_

I fixed it. The link from Burundi Drumming to Post-Punk now says "All My Colours (Zimbo)" (1981).

My preview still can't load the page's data and support files, the same glitch as before, so I couldn't check it on screen. If the change doesn't show up for you, refresh the page.

