import { applicationDefault, cert, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';

import {
  buildSearchKeywords,
  demoSongs,
  seedUploader,
  slugify,
} from './demo-songs.mjs';

const PROJECT_ID = process.env.FIREBASE_PROJECT_ID ?? 'christsongs-app';
const dryRun = process.argv.includes('--dry-run');

function resolveCredential() {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    try {
      return cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON));
    } catch {
      throw new Error('FIREBASE_SERVICE_ACCOUNT_JSON is not valid JSON.');
    }
  }

  return applicationDefault();
}

function getDb() {
  if (!getApps().length) {
    initializeApp({
      credential: resolveCredential(),
      projectId: PROJECT_ID,
    });
  }

  return getFirestore();
}

function buildSongDocument(seedSong, timestamp) {
  return {
    title: seedSong.title,
    titleLower: seedSong.title.toLowerCase(),
    artist: seedSong.artist,
    artistLower: seedSong.artist.toLowerCase(),
    slug: slugify(`${seedSong.title}-${seedSong.artist}`),
    uploaderUid: seedUploader.uid,
    uploaderName: seedUploader.name,
    uploaderNameLower: seedUploader.name.toLowerCase(),
    isPublic: true,
    status: 'active',
    instrumentsAvailable: [seedSong.instrument],
    searchKeywords: buildSearchKeywords(
      seedSong.title,
      seedSong.artist,
      seedUploader.name,
    ),
    views: seedSong.views,
    favoritesCount: seedSong.favoritesCount,
    version: 1,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

function buildArrangementDocument(seedSong, timestamp) {
  return {
    instrument: seedSong.instrument,
    key: seedSong.key,
    capo: seedSong.capo,
    tuning: seedSong.tuning,
    transposeEnabled: seedSong.transposeEnabled,
    sections: seedSong.sections,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

function printDryRun() {
  console.log(`Dry run for project ${PROJECT_ID}`);
  console.table(
    demoSongs.map((seedSong) => ({
      songId: seedSong.id,
      title: seedSong.title,
      artist: seedSong.artist,
      arrangementId: slugify(seedSong.instrument),
      instrument: seedSong.instrument,
      isPublic: true,
    })),
  );
}

async function seedDemoSongs() {
  const firestore = getDb();
  const batch = firestore.batch();
  const timestamp = Timestamp.now();

  for (const seedSong of demoSongs) {
    const songReference = firestore.collection('songs').doc(seedSong.id);
    const arrangementReference = songReference
      .collection('arrangements')
      .doc(slugify(seedSong.instrument));

    batch.set(songReference, buildSongDocument(seedSong, timestamp), { merge: true });
    batch.set(arrangementReference, buildArrangementDocument(seedSong, timestamp), {
      merge: true,
    });
  }

  await batch.commit();

  console.log(
    `Seeded ${demoSongs.length} public songs and ${demoSongs.length} arrangements into ${PROJECT_ID}.`,
  );
}

if (dryRun) {
  printDryRun();
} else {
  seedDemoSongs().catch((error) => {
    console.error('Unable to seed demo songs.');
    console.error(
      error instanceof Error
        ? error.message
        : 'Unknown seed error. Provide Firebase admin credentials and try again.',
    );
    process.exitCode = 1;
  });
}