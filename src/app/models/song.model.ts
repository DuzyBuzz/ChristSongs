import { SongStatus } from '../core/config/firestore.constants';

export interface Song {
  readonly id: string;
  readonly title: string;
  readonly titleLower: string;
  readonly artist: string;
  readonly artistLower: string;
  readonly songLink?: string;
  readonly slug: string;
  readonly uploaderUid: string;
  readonly uploaderName: string;
  readonly uploaderNameLower: string;
  readonly isPublic: boolean;
  readonly status: SongStatus;
  readonly instrumentsAvailable: readonly string[];
  readonly searchKeywords: readonly string[];
  readonly views: number;
  readonly favoritesCount: number;
  readonly version: number;
  readonly createdAt: Date | null;
  readonly updatedAt: Date | null;
}