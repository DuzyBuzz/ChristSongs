import { inject, Injectable } from '@angular/core';
import {
  collection,
  DocumentData,
  getDocs,
  limit,
  orderBy,
  query,
  QueryConstraint,
  QueryDocumentSnapshot,
  where,
} from 'firebase/firestore';

import { FIRESTORE_COLLECTIONS, SONG_STATUS } from '../../../core/config/firestore.constants';
import { FIREBASE_FIRESTORE } from '../../../core/firebase/firebase.providers';
import { SongFilters } from '../../../models/song-filters.model';
import { Song } from '../../../models/song.model';
import {
  asDateOrNull,
  asNumber,
  asStringArray,
  asStringOrEmpty,
} from '../../../shared/utilities/firestore-mapper.util';
import {
  buildPrefixRangeEnd,
  normalizeSearchTerm,
  resolveSearchField,
} from '../../songs/utilities/song-search.util';

@Injectable({
  providedIn: 'root',
})
export class SongSearchService {
  private readonly firestore = inject(FIREBASE_FIRESTORE);

  async search(filters: SongFilters): Promise<readonly Song[]> {
    const searchTerm = normalizeSearchTerm(filters.searchTerm);
    const constraints: QueryConstraint[] = [
      where('isPublic', '==', true),
      where('status', '==', SONG_STATUS.active),
    ];

    if (filters.instrument) {
      constraints.push(
        where('instrumentsAvailable', 'array-contains', filters.instrument),
      );
    }

    if (searchTerm.length > 0) {
      const field = resolveSearchField(filters.searchField);

      if (field) {
        constraints.push(where(field, '>=', searchTerm));
        constraints.push(where(field, '<=', buildPrefixRangeEnd(searchTerm)));
        constraints.push(orderBy(field, 'asc'));
      } else {
        constraints.push(where('searchKeywords', 'array-contains', searchTerm));
        constraints.push(orderBy('createdAt', 'desc'));
      }
    } else {
      constraints.push(orderBy('createdAt', 'desc'));
    }

    constraints.push(limit(filters.limit));

    const songQuery = query(
      collection(this.firestore, FIRESTORE_COLLECTIONS.songs),
      ...constraints,
    );
    const snapshot = await getDocs(songQuery);

    return snapshot.docs.map((documentSnapshot) => this.mapSong(documentSnapshot));
  }

  private mapSong(snapshot: QueryDocumentSnapshot<DocumentData>): Song {
    const data = snapshot.data();
    const songLink = asStringOrEmpty(data['songLink']).trim();

    return {
      id: snapshot.id,
      title: asStringOrEmpty(data['title']),
      titleLower: asStringOrEmpty(data['titleLower']),
      artist: asStringOrEmpty(data['artist']),
      artistLower: asStringOrEmpty(data['artistLower']),
      songLink: songLink.length > 0 ? songLink : undefined,
      slug: asStringOrEmpty(data['slug']),
      uploaderUid: asStringOrEmpty(data['uploaderUid']),
      uploaderName: asStringOrEmpty(data['uploaderName']),
      uploaderNameLower: asStringOrEmpty(data['uploaderNameLower']),
      isPublic: data['isPublic'] === true,
      status: data['status'] === SONG_STATUS.draft ? SONG_STATUS.draft : SONG_STATUS.active,
      instrumentsAvailable: asStringArray(data['instrumentsAvailable']),
      searchKeywords: asStringArray(data['searchKeywords']),
      views: asNumber(data['views']),
      favoritesCount: asNumber(data['favoritesCount']),
      version: asNumber(data['version'], 1),
      createdAt: asDateOrNull(data['createdAt']),
      updatedAt: asDateOrNull(data['updatedAt']),
    };
  }
}