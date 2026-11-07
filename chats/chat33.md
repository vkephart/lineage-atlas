# Adding YouTube to node platforms

_Started 2026-10-07 06:47 UTC_

---

## User

How difficult would it be to add a YouTube option within every node alongside the existing streaming platforms?

## Assistant

_[tool: grep]_

It'd be easy, roughly a 3-line change. The service picker is already data-driven, so YouTube would show up wherever Spotify, Apple Music and Bandcamp appear now, which covers every node's playlist link and album links.

What it would take:
1. **Add it to the service list.** One new entry with a name and a color, e.g. YouTube red `#ff0033`.
2. **Add its link.** `https://www.youtube.com/results?search_query=…`, or `music.youtube.com/search?q=…` if you'd rather send people to YouTube Music.
3. **Adjust the playlist search.** Spotify searches add the word "essential" after the genre name. For YouTube, something like "[genre] playlist" or "[genre] mix" would probably give better results.

There's nothing else to change. The way the page tries to open the Spotify app only applies to Spotify, so YouTube would just open in a new tab. Your saved service choice would also keep working as is.

Want me to add it? If so, should it be regular YouTube or YouTube Music?

## User

Im thinking of people without streaming subs so regular?

## Assistant

_[tool: read_file]_

_[tool: read_file]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: ready_for_verification]_

I added regular YouTube as a fourth option in the service picker, after Spotify, Apple Music and Bandcamp, in red. A check of the page is still running.

When YouTube is picked, every node's links open a YouTube search in a new tab. The playlist link searches "[genre] music mix", and album links search the album title plus artist. Your saved service choice still carries over as before.

