import { inject, Injectable } from '@angular/core';
import {
  FormArray,
  NonNullableFormBuilder,
  Validators,
} from '@angular/forms';
import {
  collection,
  deleteField,
  doc,
  getDocs,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore';

import { DEFAULT_INSTRUMENTS } from '../../../core/config/app.constants';
import { FIRESTORE_COLLECTIONS, SONG_STATUS } from '../../../core/config/firestore.constants';
import { FIREBASE_FIRESTORE } from '../../../core/firebase/firebase.providers';
import { AppUser } from '../../../models/app-user.model';
import { Song } from '../../../models/song.model';
import {
  lineContentRequiredValidator,
  minimumSectionCountValidator,
  optionalHttpsUrlValidator,
} from '../../../shared/forms/validators/song-form.validators';
import { slugify } from '../../../shared/utilities/slug.util';
import { SongArrangementService } from '../../songs/services/song-arrangement.service';
import { SongQueryService } from '../../songs/services/song-query.service';
import {
  SongEditorFormGroup,
  SongEditorFormValue,
  SongEditorLoadedState,
  SongLineFormArray,
  SongLineFormGroup,
  SongLineFormValue,
  SongMetadataFormGroup,
  SongSectionFormArray,
  SongSectionFormGroup,
  SongSectionFormValue,
} from '../models/song-editor-form.model';
import {
  createEmptyLine,
  createEmptySection,
  mapSongEditorSource,
  mapSongEditorToPersistencePayload,
} from '../utilities/song-payload.mapper';

@Injectable({
  providedIn: 'root',
})
export class SongEditorService {
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly firestore = inject(FIREBASE_FIRESTORE);
  private readonly songQueryService = inject(SongQueryService);
  private readonly songArrangementService = inject(SongArrangementService);

  buildForm(initialValue?: SongEditorFormValue): SongEditorFormGroup {
    const formValue: SongEditorFormValue = initialValue ?? {
      metadata: {
        title: '',
        artist: '',
        songLink: '',
        instrument: DEFAULT_INSTRUMENTS[0],
        key: 'C',
        capo: 0,
        tuning: 'standard',
        transposeEnabled: true,
        isPublic: true,
        status: SONG_STATUS.active,
      },
      sections: [createEmptySection()],
    };

    const sections = new FormArray<SongSectionFormGroup>(
      formValue.sections.map((section) => this.createSectionGroup(section)),
      { validators: [minimumSectionCountValidator(1)] },
    );

    return this.formBuilder.group({
      metadata: this.formBuilder.group({
        title: this.formBuilder.control(formValue.metadata.title, {
          validators: [Validators.required, Validators.maxLength(120)],
        }),
        artist: this.formBuilder.control(formValue.metadata.artist, {
          validators: [Validators.required, Validators.maxLength(120)],
        }),
        songLink: this.formBuilder.control(formValue.metadata.songLink, {
          validators: [Validators.maxLength(500), optionalHttpsUrlValidator()],
        }),
        instrument: this.formBuilder.control(formValue.metadata.instrument, {
          validators: [Validators.required],
        }),
        key: this.formBuilder.control(formValue.metadata.key, {
          validators: [Validators.required, Validators.maxLength(12)],
        }),
        capo: this.formBuilder.control(formValue.metadata.capo, {
          validators: [Validators.min(0), Validators.max(12)],
        }),
        tuning: this.formBuilder.control(formValue.metadata.tuning, {
          validators: [Validators.required, Validators.maxLength(60)],
        }),
        transposeEnabled: this.formBuilder.control(
          formValue.metadata.transposeEnabled,
        ),
        isPublic: this.formBuilder.control(formValue.metadata.isPublic),
        status: this.formBuilder.control(formValue.metadata.status),
      }) as SongMetadataFormGroup,
      sections,
    });
  }

  addSection(sections: SongSectionFormArray): void {
    sections.push(this.createSectionGroup(createEmptySection()));
  }

  removeSection(sections: SongSectionFormArray, sectionIndex: number): void {
    if (sections.length <= 1) {
      return;
    }

    sections.removeAt(sectionIndex);
  }

  addLine(section: SongSectionFormGroup): void {
    section.controls.lines.push(this.createLineGroup(createEmptyLine()));
  }

  removeLine(section: SongSectionFormGroup, lineIndex: number): void {
    if (section.controls.lines.length <= 1) {
      return;
    }

    section.controls.lines.removeAt(lineIndex);
  }

  async loadEditorState(songId: string): Promise<SongEditorLoadedState | null> {
    const song = await this.songQueryService.getSongById(songId);

    if (!song) {
      return null;
    }

    const defaultInstrument = song.instrumentsAvailable[0] ?? DEFAULT_INSTRUMENTS[0];
    const arrangement = await this.songArrangementService.getArrangementForInstrument(
      songId,
      defaultInstrument,
    );

    return {
      song,
      arrangement,
      formValue: mapSongEditorSource(song, arrangement),
    };
  }

  async createSong(formValue: SongEditorFormValue, uploader: AppUser): Promise<string> {
    const payload = mapSongEditorToPersistencePayload(formValue, uploader);
    const songReference = doc(collection(this.firestore, FIRESTORE_COLLECTIONS.songs));
    const arrangementReference = doc(
      collection(songReference, FIRESTORE_COLLECTIONS.arrangements),
      payload.arrangementId,
    );
    const batch = writeBatch(this.firestore);

    batch.set(songReference, {
      ...payload.song,
      ...(payload.songLink ? { songLink: payload.songLink } : {}),
      createdAt: serverTimestamp(),
      favoritesCount: 0,
      views: 0,
      version: 1,
    });
    batch.set(arrangementReference, {
      ...payload.arrangement,
      createdAt: serverTimestamp(),
    });

    await batch.commit();
    return songReference.id;
  }

  async updateSong(
    songId: string,
    formValue: SongEditorFormValue,
    uploader: AppUser,
    existingSong: Song,
    previousInstrument?: string,
  ): Promise<void> {
    const normalizedInstrument = formValue.metadata.instrument.trim().toLowerCase();
    const existingInstruments =
      previousInstrument && existingSong.instrumentsAvailable.length <= 1
        ? [normalizedInstrument]
        : existingSong.instrumentsAvailable;
    const payload = mapSongEditorToPersistencePayload(
      formValue,
      uploader,
      existingInstruments,
    );
    const songReference = doc(this.firestore, FIRESTORE_COLLECTIONS.songs, songId);
    const arrangementReference = doc(
      collection(songReference, FIRESTORE_COLLECTIONS.arrangements),
      payload.arrangementId,
    );
    const batch = writeBatch(this.firestore);

    batch.set(
      songReference,
      {
        ...payload.song,
        songLink: payload.songLink ?? deleteField(),
        version: existingSong.version + 1,
      },
      { merge: true },
    );
    batch.set(arrangementReference, payload.arrangement, { merge: true });

    if (
      previousInstrument &&
      slugify(previousInstrument) !== payload.arrangementId &&
      existingSong.instrumentsAvailable.length <= 1
    ) {
      const previousArrangementReference = doc(
        collection(songReference, FIRESTORE_COLLECTIONS.arrangements),
        slugify(previousInstrument),
      );
      batch.delete(previousArrangementReference);
    }

    await batch.commit();
  }

  async deleteSong(songId: string): Promise<void> {
    const songReference = doc(this.firestore, FIRESTORE_COLLECTIONS.songs, songId);
    const arrangementSnapshots = await getDocs(
      collection(songReference, FIRESTORE_COLLECTIONS.arrangements),
    );
    const batch = writeBatch(this.firestore);

    arrangementSnapshots.docs.forEach((documentSnapshot) => {
      batch.delete(documentSnapshot.ref);
    });
    batch.delete(songReference);

    await batch.commit();
  }

  private createSectionGroup(
    value: SongSectionFormValue = createEmptySection(),
  ): SongSectionFormGroup {
    const lines = new FormArray<SongLineFormGroup>(
      value.lines.map((line) => this.createLineGroup(line)),
    ) as SongLineFormArray;

    return this.formBuilder.group({
      type: this.formBuilder.control(value.type, {
        validators: [Validators.required],
      }),
      title: this.formBuilder.control(value.title, {
        validators: [Validators.required, Validators.maxLength(80)],
      }),
      lines,
    });
  }

  private createLineGroup(
    value: SongLineFormValue = createEmptyLine(),
  ): SongLineFormGroup {
    return this.formBuilder.group(
      {
        lyrics: this.formBuilder.control(value.lyrics, {
          validators: [Validators.maxLength(240)],
        }),
        chordsText: this.formBuilder.control(value.chordsText, {
          validators: [Validators.maxLength(120)],
        }),
      },
      { validators: [lineContentRequiredValidator()] },
    );
  }
}
