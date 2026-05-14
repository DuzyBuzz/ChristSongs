import { inject, Injectable } from '@angular/core';
import {
  doc,
  collection,
  getDoc,
  getDocs,
  limit,
  query,
  where,
} from 'firebase/firestore';

import { FIRESTORE_COLLECTIONS } from '../../../core/config/firestore.constants';
import { FIREBASE_FIRESTORE } from '../../../core/firebase/firebase.providers';
import {
  SongArrangement,
  SongArrangementLine,
  SongArrangementSection,
} from '../../../models/song-arrangement.model';
import {
  asDateOrNull,
  asStringArray,
  asStringOrEmpty,
} from '../../../shared/utilities/firestore-mapper.util';
import { slugify } from '../../../shared/utilities/slug.util';

@Injectable({
  providedIn: 'root',
})
export class SongArrangementService {
  private readonly firestore = inject(FIREBASE_FIRESTORE);

  async getArrangementForInstrument(
    songId: string,
    instrument: string,
  ): Promise<SongArrangement | null> {
    const directReference = doc(
      this.firestore,
      FIRESTORE_COLLECTIONS.songs,
      songId,
      FIRESTORE_COLLECTIONS.arrangements,
      slugify(instrument),
    );
    const directSnapshot = await getDoc(directReference);

    if (directSnapshot.exists()) {
      const data = directSnapshot.data();

      return {
        id: directSnapshot.id,
        songId,
        instrument: asStringOrEmpty(data['instrument']),
        key: asStringOrEmpty(data['key']),
        capo: typeof data['capo'] === 'number' ? data['capo'] : null,
        tuning: asStringOrEmpty(data['tuning']),
        transposeEnabled: data['transposeEnabled'] !== false,
        sections: this.mapSections(data['sections']),
        createdAt: asDateOrNull(data['createdAt']),
        updatedAt: asDateOrNull(data['updatedAt']),
      };
    }

    const arrangementsPath = collection(
      this.firestore,
      FIRESTORE_COLLECTIONS.songs,
      songId,
      FIRESTORE_COLLECTIONS.arrangements,
    );

    const arrangementQuery = query(
      arrangementsPath,
      where('instrument', '==', instrument),
      limit(1),
    );
    const snapshot = await getDocs(arrangementQuery);
    const documentSnapshot = snapshot.docs[0];

    if (!documentSnapshot) {
      return null;
    }

    const data = documentSnapshot.data();

    return {
      id: documentSnapshot.id,
      songId,
      instrument: asStringOrEmpty(data['instrument']),
      key: asStringOrEmpty(data['key']),
      capo: typeof data['capo'] === 'number' ? data['capo'] : null,
      tuning: asStringOrEmpty(data['tuning']),
      transposeEnabled: data['transposeEnabled'] !== false,
      sections: this.mapSections(data['sections']),
      createdAt: asDateOrNull(data['createdAt']),
      updatedAt: asDateOrNull(data['updatedAt']),
    };
  }

  private mapSections(value: unknown): readonly SongArrangementSection[] {
    if (!Array.isArray(value)) {
      return [];
    }

    return value
      .map((entry) => this.mapSection(entry))
      .filter((entry): entry is SongArrangementSection => entry !== null);
  }

  private mapSection(value: unknown): SongArrangementSection | null {
    if (!value || typeof value !== 'object') {
      return null;
    }

    const section = value as Record<string, unknown>;

    return {
      type: asStringOrEmpty(section['type']),
      title: asStringOrEmpty(section['title']),
      lines: this.mapLines(section['lines']),
    };
  }

  private mapLines(value: unknown): readonly SongArrangementLine[] {
    if (!Array.isArray(value)) {
      return [];
    }

    return value
      .map((entry) => this.mapLine(entry))
      .filter((entry): entry is SongArrangementLine => entry !== null);
  }

  private mapLine(value: unknown): SongArrangementLine | null {
    if (!value || typeof value !== 'object') {
      return null;
    }

    const line = value as Record<string, unknown>;

    return {
      lyrics: asStringOrEmpty(line['lyrics']),
      chords: asStringArray(line['chords']),
    };
  }
}