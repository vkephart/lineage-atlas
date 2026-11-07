/** Data model for the Lineage Atlas. The JSON files under data/ must conform to these types. */

export type FamilyId =
  | 'soul'
  | 'rock'
  | 'metal'
  | 'gaze'
  | 'jazz'
  | 'electronic'
  | 'roots'
  | 'hiphop'
  | 'global';

export type Role = 'foundational' | 'branch' | 'classic' | 'hybrid' | 'revival' | 'rising';

export type Rel = 'origin' | 'stylistic' | 'production' | 'scene' | 'revival' | 'bridge';

export interface Family {
  id: FamilyId;
  /** Long label shown in the detail panel and legend tooltip */
  label: string;
  /** Short label used for the rotated row label and legend row */
  short: string;
  /** Hex colour */
  color: string;
  /** "r,g,b" triplet used to build rgba() strings */
  rgb: string;
  /** Authored vertical centre of the family row in world px (the app adds spacing on top) */
  y: number;
}

export interface Trait {
  k: string;
  v: string;
}

export interface Track {
  t: string;
  a: string;
  why?: string;
}

export interface Album {
  t: string;
  a: string;
}

export interface Genre {
  id: string;
  name: string;
  fam: FamilyId;
  /** Secondary family for hybrid nodes */
  fam2?: FamilyId;
  /** Year of emergence; negative = BCE */
  year: number;
  role: Role;
  /** Vertical offset from the family row centre, in world px. The layout declutter pass may nudge it. */
  yOff?: number;
  /** Alternate names, "·"-separated, searchable */
  aka?: string;
  def: string;
  traits: Trait[];
  why: string;
  artists: string[];
  albums: Album[];
  tracks: Track[];
  tempo?: string;
  tempoNote?: string;
}

export interface Edge {
  from: string;
  to: string;
  rel: Rel;
  /** 0–1 */
  strength: number;
  note: string;
}

export interface JourneyStep {
  id: string;
  text: string;
}

export interface Journey {
  id: string;
  title: string;
  subtitle: string;
  steps: JourneyStep[];
}

/** Artist name → genre ids, most specific first; later ids are parents / roll-ups. */
export type ArtistIndex = Record<string, string[]>;

export interface AtlasData {
  families: Family[];
  genres: Genre[];
  edges: Edge[];
  journeys: Journey[];
  artistIndex: ArtistIndex;
}
