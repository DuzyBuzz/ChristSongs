import { inject, Injectable } from '@angular/core';
import { collection, getDocs, query, where } from 'firebase/firestore';

import { FIRESTORE_COLLECTIONS } from '../../../core/config/firestore.constants';
import { FIREBASE_FIRESTORE } from '../../../core/firebase/firebase.providers';
import { UserProfileService } from '../../../core/services/user-profile.service';
import { AppUser } from '../../../models/app-user.model';

export interface ProfileSummary {
  readonly profile: AppUser | null;
  readonly uploadsCount: number;
  readonly favoritesCount: number;
  readonly offlineCount: number;
}

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private readonly firestore = inject(FIREBASE_FIRESTORE);
  private readonly userProfileService = inject(UserProfileService);

  async getProfileSummary(uid: string): Promise<ProfileSummary> {
    const [profile, uploadsSnapshot, favoritesSnapshot, offlineSnapshot] = await Promise.all([
      this.userProfileService.getProfile(uid),
      getDocs(
        query(
          collection(this.firestore, FIRESTORE_COLLECTIONS.songs),
          where('uploaderUid', '==', uid),
        ),
      ),
      getDocs(
        collection(
          this.firestore,
          FIRESTORE_COLLECTIONS.users,
          uid,
          FIRESTORE_COLLECTIONS.favorites,
        ),
      ),
      getDocs(
        collection(
          this.firestore,
          FIRESTORE_COLLECTIONS.users,
          uid,
          FIRESTORE_COLLECTIONS.offlineSongs,
        ),
      ),
    ]);

    return {
      profile,
      uploadsCount: uploadsSnapshot.size,
      favoritesCount: favoritesSnapshot.size,
      offlineCount: offlineSnapshot.size,
    };
  }
}