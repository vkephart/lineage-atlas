import type { AtlasData, Edge, Family, Genre, Journey, ArtistIndex } from './types';
import familiesJson from '../../data/families.json';
import edgesJson from '../../data/edges.json';
import journeysJson from '../../data/journeys.json';
import artistIndexJson from '../../data/artist-index.json';

// One JSON file per family under data/genres/. Adding a file there is enough; the
// family must also exist in data/families.json.
const genreModules = import.meta.glob('../../data/genres/*.json', { eager: true, import: 'default' }) as Record<
  string,
  Genre[]
>;

const families = familiesJson as Family[];
const famIndex = new Map(families.map((f, i) => [f.id, i]));

// Keep genres in family order, then file order — the layout and search are order-stable.
const genres: Genre[] = Object.entries(genreModules)
  .sort(([a], [b]) => {
    const fa = famIndex.get(a.split('/').pop()!.replace('.json', '') as Family['id']) ?? 99;
    const fb = famIndex.get(b.split('/').pop()!.replace('.json', '') as Family['id']) ?? 99;
    return fa - fb || a.localeCompare(b);
  })
  .flatMap(([, list]) => list);

export const atlasData: AtlasData = {
  families,
  genres,
  edges: edgesJson as Edge[],
  journeys: journeysJson as Journey[],
  artistIndex: artistIndexJson as ArtistIndex,
};

export * from './types';
