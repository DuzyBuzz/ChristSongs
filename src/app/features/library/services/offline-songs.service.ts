import { inject, Injectable } from '@angular/core';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  deleteDoc,
} from 'firebase/firestore';

import { DEFAULT_PAGE_SIZE } from '../../../core/config/app.constants';
import { FIRESTORE_COLLECTIONS } from '../../../core/config/firestore.constants';
import { FIREBASE_FIRESTORE } from '../../../core/firebase/firebase.providers';
import { Song } from '../../../models/song.model';
import { SongArrangementService } from '../../songs/services/song-arrangement.service';
import { SongQueryService } from '../../songs/services/song-query.service';

@Injectable({
  providedIn: 'root',
})
export class OfflineSongsService {
  private readonly firestore = inject(FIREBASE_FIRESTORE);
  private readonly songQueryService = inject(SongQueryService);
  private readonly songArrangementService = inject(SongArrangementService);

  async getOfflineSongsForUser(uid: string): Promise<readonly Song[]> {
    const offlineQuery = query(
      collection(this.firestore, FIRESTORE_COLLECTIONS.users, uid, FIRESTORE_COLLECTIONS.offlineSongs),
      orderBy('savedAt', 'desc'),
      limit(DEFAULT_PAGE_SIZE),
    );
    const snapshot = await getDocs(offlineQuery);
    const songIds = snapshot.docs.map((documentSnapshot) => documentSnapshot.id);

    return this.songQueryService.getSongsByIds(songIds);
  }

  async isSavedOffline(uid: string, songId: string): Promise<boolean> {
    const offlineReference = doc(
      this.firestore,
      FIRESTORE_COLLECTIONS.users,
      uid,
      FIRESTORE_COLLECTIONS.offlineSongs,
      songId,
    );
    const snapshot = await getDoc(offlineReference);
    return snapshot.exists();
  }

  async toggleOfflineSong(
    uid: string,
    songId: string,
    instrument: string,
  ): Promise<boolean> {
    const offlineReference = doc(
      this.firestore,
      FIRESTORE_COLLECTIONS.users,
      uid,
      FIRESTORE_COLLECTIONS.offlineSongs,
      songId,
    );
    const snapshot = await getDoc(offlineReference);

    if (snapshot.exists()) {
      await deleteDoc(offlineReference);
      return false;
    }

    await Promise.all([
      this.songQueryService.getSongById(songId),
      this.songArrangementService.getArrangementForInstrument(songId, instrument),
    ]);

    await setDoc(offlineReference, {
      songId,
      savedAt: serverTimestamp(),
      lastSyncedAt: serverTimestamp(),
    });

    return true;
  }
}