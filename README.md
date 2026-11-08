# The Music Genre Lineage Atlas

An interactive map of how music genres evolved and influenced one another, from the aulos and lyre of antiquity
to the current frontiers. Pan and zoom a timeline-graph of 200+ genres in nine colour-coded super-families, scrub
the time slider to watch genres emerge, follow curated journeys, search by genre or artist, and open any genre
for its definition, traits, lineage, representative artists, albums and tracks (with links out to Spotify,
Apple Music, Bandcamp or YouTube).

Built with Vite, React and TypeScript. All content is plain JSON under `data/`, so the atlas grows by editing data
and pushing; GitHub Pages redeploys automatically.

## Run locally

```bash
npm install
npm run dev
```

## Contribute a genre

See `CLAUDE.md` for the data model, the add-a-genre checklist and the validator (`npm run validate`).

## Origin

The atlas began as a Claude Design prototype; the original export, including the chat transcripts that record every
editorial decision, is preserved under `design-handoff/` for reference.

## License

Copyright © 2026 vkephart. The Lineage Atlas, its code and its genre data are released under the
[Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International](https://creativecommons.org/licenses/by-nc-sa/4.0/)
license (see `LICENSE`). You may copy, share and adapt it with credit, for non-commercial purposes only, and any
adaptation must be shared under the same terms. Commercial use requires the author's permission.
