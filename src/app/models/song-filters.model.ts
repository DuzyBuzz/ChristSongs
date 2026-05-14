export type SongSearchField = 'all' | 'title' | 'artist' | 'uploader';

export interface SongFilters {
  readonly searchTerm: string;
  readonly searchField: SongSearchField;
  readonly instrument: string | null;
  readonly limit: number;
}