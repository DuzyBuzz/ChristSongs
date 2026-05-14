import { inject, Injectable } from '@angular/core';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';

import { DEFAULT_PAGE_SIZE } from '../../../core/config/app.constants';
import { FIRESTORE_COLLECTIONS } from '../../../core/config/firestore.constants';
import { FIREBASE_FIRESTORE } from '../../../core/firebase/firebase.providers';
import { Song } from '../../../models/song.model';
import { SongQueryService } from '../../songs/services/song-query.service';

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  private readonly firestore = inject(FIREBASE_FIRESTORE);
  private readonly songQueryService = inject(SongQueryService);

  async getFavoritesForUser(uid: string): Promise<readonly Song[]> {
    const favoritesQuery = query(
      collection(this.firestore, FIRESTORE_COLLECTIONS.users, uid, FIRESTORE_COLLECTIONS.favorites),
      orderBy('createdAt', 'desc'),
      limit(DEFAULT_PAGE_SIZE),
    );
    const snapshot = await getDocs(favoritesQuery);
    const songIds = snapshot.docs.map((documentSnapshot) => documentSnapshot.id);

    return this.songQueryService.getSongsByIds(songIds);
  }

  async isFavorite(uid: string, songId: string): Promise<boolean> {
    const favoriteReference = doc(
      this.firestore,
      FIRESTORE_COLLECTIONS.users,
      uid,
      FIRESTORE_COLLECTIONS.favorites,
      songId,
    );
    const snapshot = await getDoc(favoriteReference);
    return snapshot.exists();
  }

  async toggleFavorite(uid: string, songId: string): Promise<boolean> {
    const favoriteReference = doc(
      this.firestore,
      FIRESTORE_COLLECTIONS.users,
      uid,
      FIRESTORE_COLLECTIONS.favorites,
      songId,
    );
    const favoriteSnapshot = await getDoc(favoriteReference);
    const shouldFavorite = !favoriteSnapshot.exists();

    if (shouldFavorite) {
      await setDoc(favoriteReference, {
        songId,
        createdAt: serverTimestamp(),
      });
    } else {
      await deleteDoc(favoriteReference);
    }

    return shouldFavorite;
  }
}