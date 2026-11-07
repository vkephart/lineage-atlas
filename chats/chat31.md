# Genre music lineage question

_Started 2026-10-07 06:10 UTC_

---

## User

Is our genre baile funk missing a predecessor from Miami Bass? Or have a descendent of Brazilian phonk or Memphis Phonk?

Confirm the facts first and let me know before updating.

## Assistant

_[tool: grep]_

_[tool: grep]_

_[tool: grep]_

_[tool: grep]_

_[tool: grep]_

_[tool: web_search]_

_[tool: web_search]_

Confirmed: the Atlas is missing Miami Bass as a predecessor. Brazilian phonk is a descendant of baile funk. Memphis phonk is not a descendant of it; it feeds into Brazilian phonk from the other side.

**What the Atlas has now**
- Baile Funk's only parent is Hip-Hop. That link's description mentions Miami bass tapes, but there's no Miami Bass genre on the map.
- There's no Phonk, Memphis rap or Brazilian phonk genre anywhere.
- Baile Funk is dated 1998, which is when the tamborzão beat took over.

**What the sources say**
- **Miami Bass is a parent.** Wikipedia lists the style's origins as Miami bass; freestyle; samba; Brazilian bass; electro; techno; candomblé. DJ Marlboro's first LP, Funk Brasil (1989), marks the beginning of the Funk Carioca Movement, initially with versions of hip-hop and freestyle hits from American artists, especially the 2 Live Crew.
- **Brazilian phonk is a descendant, but not a direct one.** It came through São Paulo's funk mandelão. RYM calls it a form of Funk mandelão that merges Funk automotivo rhythms, vocals, and energy, with the energetic and nocturnal production typical of the Drift Phonk scene. Mandelão itself was popularized by DJ GBR's "Ritmo dos Fluxos" in 2016.
- **Memphis phonk runs the other way.** Phonk's origins are Memphis rap; Southern hip hop; trap; chopped and screwed, starting in the early 2010s. The Memphis style is the template later borrowed (selectively) by drift phonk and, by extension, some Brazilian automotivo producers. So it's a second parent of Brazilian phonk, not a child of baile funk.
- **The name is disputed.** Some argue Brazilian phonk is more accurately a subgenre of Brazilian Funk.

**What I'd add (not applied yet)**
1. **Miami Bass** (about 1985). Hip-Hop → Miami Bass → Baile Funk. I'd also move the Miami-bass wording off the current Hip-Hop → Baile Funk link.
2. **Phonk** (early 2010s), with Memphis phonk as an alias. Hip-Hop and Chopped & Screwed → Phonk.
3. **Brazilian Phonk** (about 2021), with funk automotivo as an alias. Baile Funk and Phonk → Brazilian Phonk.

Funk mandelão could be its own step between Baile Funk and Brazilian Phonk, or I could fold it into the Brazilian Phonk description. Which do you prefer, and should I also change Baile Funk's year to 1989?

## User

First do we have chopped and screwed?

## Assistant

Yes, Chopped & Screwed is already in the Atlas (`id:'screwed'`, 1993, Hip-Hop family, also known as "Screwed & Chopped / Slowed and Throwed"). So Phonk can link from it directly, and we don't need to add it.

## User

Ok add the suggested plus Funk mandelão.  Watch the spacing.

## Assistant

_[tool: read_file]_

_[tool: grep]_

_[tool: grep]_

_[tool: read_file]_

_[tool: run_script]_

_[tool: run_script]_

_[tool: grep]_

_[tool: str_replace_edit]_

_[tool: show_html]_

_[tool: ready_for_verification]_

I added four genres and seven links, and redid the old Hip-Hop → Baile Funk link. I haven't looked at the map myself yet; a check is running now.

**New genres**
- **Miami Bass** (1985), Hip-Hop lane: Hip-Hop → Miami Bass → Baile Funk.
- **Phonk** (2012), Hip-Hop lane, also called Memphis Phonk / Drift Phonk: Hip-Hop and Chopped & Screwed → Phonk.
- **Funk Mandelão** (2016), Global lane: Baile Funk → Funk Mandelão.
- **Brazilian Phonk** (2022), shown as a hybrid of Global and Hip-Hop: Funk Mandelão and Phonk → Brazilian Phonk.

**Other change:** Hip-Hop → Baile Funk is now a weaker "stylistic" link. Its old Miami-bass description moved to the new Miami Bass → Baile Funk link.

**Spacing:** The new nodes sit in the open space next to Alternative R&B and Amapiano, at least about 100px from any neighbour. The tightest pair is Brazilian Phonk and Funk Mandelão, about 110px apart vertically.

**Not changed:**
- Baile Funk is still dated 1998, since you didn't confirm moving it to 1989.
- Only Miami Bass got a BPM range. The other three new genres have none.
- I wrote the artist and track lists for the four new genres from memory, not from sources, so they're worth a quick check.

