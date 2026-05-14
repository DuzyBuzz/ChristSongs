import { InjectionToken, Provider } from '@angular/core';
import { FirebaseApp, getApp, getApps, initializeApp } from 'firebase/app';
import {
  Auth,
  getAuth,
  indexedDBLocalPersistence,
  initializeAuth,
} from 'firebase/auth';
import {
  CACHE_SIZE_UNLIMITED,
  Firestore,
  getFirestore,
  initializeFirestore,
  persistentLocalCache,
} from 'firebase/firestore';

import { environment } from '../../../environments/environment';

export const FIREBASE_APP = new InjectionToken<FirebaseApp>('FIREBASE_APP');
export const FIREBASE_AUTH = new InjectionToken<Auth>('FIREBASE_AUTH');
export const FIREBASE_FIRESTORE = new InjectionToken<Firestore>('FIREBASE_FIRESTORE');

let firebaseAppInstance: FirebaseApp | null = null;
let firebaseAuthInstance: Auth | null = null;
let firebaseFirestoreInstance: Firestore | null = null;

function getFirebaseAppInstance(): FirebaseApp {
  if (firebaseAppInstance) {
    return firebaseAppInstance;
  }

  firebaseAppInstance = getApps().length > 0 ? getApp() : initializeApp(environment.firebase);
  return firebaseAppInstance;
}

function getFirebaseAuthInstance(app: FirebaseApp): Auth {
  if (firebaseAuthInstance) {
    return firebaseAuthInstance;
  }

  try {
    firebaseAuthInstance = initializeAuth(app, {
      persistence: indexedDBLocalPersistence,
    });
  } catch {
    firebaseAuthInstance = getAuth(app);
  }

  return firebaseAuthInstance;
}

function getFirebaseFirestoreInstance(app: FirebaseApp): Firestore {
  if (firebaseFirestoreInstance) {
    return firebaseFirestoreInstance;
  }

  try {
    firebaseFirestoreInstance = initializeFirestore(app, {
      cacheSizeBytes: CACHE_SIZE_UNLIMITED,
      ignoreUndefinedProperties: true,
      localCache: persistentLocalCache({}),
    });
  } catch {
    firebaseFirestoreInstance = getFirestore(app);
  }

  return firebaseFirestoreInstance;
}

export const firebaseProviders: Provider[] = [
  {
    provide: FIREBASE_APP,
    useFactory: getFirebaseAppInstance,
  },
  {
    provide: FIREBASE_AUTH,
    deps: [FIREBASE_APP],
    useFactory: getFirebaseAuthInstance,
  },
  {
    provide: FIREBASE_FIRESTORE,
    deps: [FIREBASE_APP],
    useFactory: getFirebaseFirestoreInstance,
  },
];