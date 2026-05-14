import { SongSearchField } from '../../../models/song-filters.model';

export function normalizeSearchTerm(value: string): string {
  return value.trim().toLowerCase();
}

export function buildPrefixRangeEnd(value: string): string {
  return `${value}\uf8ff`;
}

export function resolveSearchField(field: SongSearchField): string | null {
  switch (field) {
    case 'title':
      return 'titleLower';
    case 'artist':
      return 'artistLower';
    case 'uploader':
      return 'uploaderNameLower';
    default:
      return null;
  }
}