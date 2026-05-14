import { inject, Injectable } from '@angular/core';
import { User } from 'firebase/auth';
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';

import { AppUser } from '../../models/app-user.model';
import { FIRESTORE_COLLECTIONS } from '../config/firestore.constants';
import { FIREBASE_FIRESTORE } from '../firebase/firebase.providers';
import { asDateOrNull, asStringOrEmpty } from '../../shared/utilities/firestore-mapper.util';

@Injectable({
  providedIn: 'root',
})
export class UserProfileService {
  private readonly firestore = inject(FIREBASE_FIRESTORE);

  async upsertUserProfile(user: User): Promise<void> {
    const userReference = doc(this.firestore, FIRESTORE_COLLECTIONS.users, user.uid);
    const existingSnapshot = await getDoc(userReference);
    const displayName = user.displayName ?? user.email?.split('@')[0] ?? 'ChristSongs User';

    await setDoc(
      userReference,
      {
        uid: user.uid,
        displayName,
        email: user.email ?? '',
        photoURL: user.photoURL ?? '',
        updatedAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
        ...(existingSnapshot.exists() ? {} : { createdAt: serverTimestamp() }),
      },
      { merge: true },
    );
  }

  async getProfile(uid: string): Promise<AppUser | null> {
    const userReference = doc(this.firestore, FIRESTORE_COLLECTIONS.users, uid);
    const snapshot = await getDoc(userReference);

    if (!snapshot.exists()) {
      return null;
    }

    const data = snapshot.data();

    return {
      uid: asStringOrEmpty(data['uid']),
      displayName: asStringOrEmpty(data['displayName']),
      email: asStringOrEmpty(data['email']),
      photoURL: asStringOrEmpty(data['photoURL']) || null,
      createdAt: asDateOrNull(data['createdAt']),
      updatedAt: asDateOrNull(data['updatedAt']),
      lastLoginAt: asDateOrNull(data['lastLoginAt']),
    };
  }
}