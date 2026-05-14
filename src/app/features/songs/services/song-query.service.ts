import { inject, Injectable } from '@angular/core';
import {
  collection,
  doc,
  documentId,
  DocumentData,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  QueryDocumentSnapshot,
  where,
} from 'firebase/firestore';

import { HOME_SECTION_SIZE } from '../../../core/config/app.constants';
import { FIRESTORE_COLLECTIONS, SONG_STATUS } from '../../../core/config/firestore.constants';
import { FIREBASE_FIRESTORE } from '../../../core/firebase/firebase.providers';
import { Song } from '../../../models/song.model';
import {
  asDateOrNull,
  asNumber,
  asStringArray,
  asStringOrEmpty,
} from '../../../shared/utilities/firestore-mapper.util';

@Injectable({
  providedIn: 'root',
})
export class SongQueryService {
  private readonly firestore = inject(FIREBASE_FIRESTORE);

  async getRecentSongs(limitCount = HOME_SECTION_SIZE): Promise<readonly Song[]> {
    const songQuery = query(
      collection(this.firestore, FIRESTORE_COLLECTIONS.songs),
      where('isPublic', '==', true),
      where('status', '==', SONG_STATUS.active),
      orderBy('createdAt', 'desc'),
      limit(limitCount),
    );

    const snapshot = await getDocs(songQuery);
    return snapshot.docs.map((documentSnapshot) => this.mapSong(documentSnapshot));
  }

  async getPopularSongs(limitCount = HOME_SECTION_SIZE): Promise<readonly Song[]> {
    const songQuery = query(
      collection(this.firestore, FIRESTORE_COLLECTIONS.songs),
      where('isPublic', '==', true),
      where('status', '==', SONG_STATUS.active),
      orderBy('views', 'desc'),
      orderBy('createdAt', 'desc'),
      limit(limitCount),
    );

    const snapshot = await getDocs(songQuery);
    return snapshot.docs.map((documentSnapshot) => this.mapSong(documentSnapshot));
  }

  async getSongById(songId: string): Promise<Song | null> {
    const songReference = doc(this.firestore, FIRESTORE_COLLECTIONS.songs, songId);
    const snapshot = await getDoc(songReference);

    if (!snapshot.exists()) {
      return null;
    }

    return this.mapSong(snapshot as QueryDocumentSnapshot<DocumentData>);
  }

  async getSongsByUploader(
    uploaderUid: string,
    limitCount = HOME_SECTION_SIZE,
  ): Promise<readonly Song[]> {
    const songQuery = query(
      collection(this.firestore, FIRESTORE_COLLECTIONS.songs),
      where('uploaderUid', '==', uploaderUid),
      orderBy('updatedAt', 'desc'),
      limit(limitCount),
    );

    const snapshot = await getDocs(songQuery);
    return snapshot.docs.map((documentSnapshot) => this.mapSong(documentSnapshot));
  }

  async getSongsByIds(songIds: readonly string[]): Promise<readonly Song[]> {
    const uniqueSongIds = Array.from(
      new Set(songIds.map((songId) => songId.trim()).filter((songId) => songId.length > 0)),
    );

    if (uniqueSongIds.length === 0) {
      return [];
    }

    const results: Song[] = [];

    for (let index = 0; index < uniqueSongIds.length; index += 10) {
      const chunk = uniqueSongIds.slice(index, index + 10);
      const songQuery = query(
        collection(this.firestore, FIRESTORE_COLLECTIONS.songs),
        where(documentId(), 'in', chunk),
      );
      const snapshot = await getDocs(songQuery);

      results.push(
        ...snapshot.docs.map((documentSnapshot) => this.mapSong(documentSnapshot)),
      );
    }

    const songMap = new Map(results.map((song) => [song.id, song] as const));
    return uniqueSongIds
      .map((songId) => songMap.get(songId))
      .filter((song): song is Song => !!song);
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