import { serverTimestamp } from 'firebase/firestore';

import { AppUser } from '../../../models/app-user.model';
import { Song } from '../../../models/song.model';
import { SongArrangement } from '../../../models/song-arrangement.model';
import { buildSearchKeywords } from '../../../shared/utilities/keyword-builder.util';
import { slugify } from '../../../shared/utilities/slug.util';
import {
  SongEditorFormValue,
  SongLineFormValue,
} from '../models/song-editor-form.model';

export interface SongPersistencePayload {
  readonly arrangementId: string;
  readonly instrument: string;
  readonly songLink?: string;
  readonly song: Record<string, unknown>;
  readonly arrangement: Record<string, unknown>;
}

export function parseChordTokens(chordsText: string): string[] {
  return chordsText
    .split(/[\s,]+/)
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0);
}

export function mapSongEditorToPersistencePayload(
  formValue: SongEditorFormValue,
  uploader: AppUser,
  existingInstruments: readonly string[] = [],
): SongPersistencePayload {
  const title = formValue.metadata.title.trim();
  const artist = formValue.metadata.artist.trim();
  const songLink = formValue.metadata.songLink.trim();
  const instrument = formValue.metadata.instrument.trim().toLowerCase();
  const uploaderName = uploader.displayName.trim();
  const instrumentsAvailable = Array.from(
    new Set([...existingInstruments.map((value) => value.toLowerCase()), instrument]),
  );

  return {
    arrangementId: slugify(instrument),
    instrument,
    songLink: songLink || undefined,
    song: {
      title,
      titleLower: title.toLowerCase(),
      artist,
      artistLower: artist.toLowerCase(),
      slug: slugify(`${title}-${artist}`),
      uploaderUid: uploader.uid,
      uploaderName,
      uploaderNameLower: uploaderName.toLowerCase(),
      isPublic: formValue.metadata.isPublic,
      status: formValue.metadata.status,
      instrumentsAvailable,
      searchKeywords: buildSearchKeywords(title, artist, uploaderName),
      updatedAt: serverTimestamp(),
    },
    arrangement: {
      instrument,
      key: formValue.metadata.key.trim(),
      capo: formValue.metadata.capo,
      tuning: formValue.metadata.tuning.trim(),
      transposeEnabled: formValue.metadata.transposeEnabled,
      sections: formValue.sections.map((section) => ({
        type: section.type.trim(),
        title: section.title.trim(),
        lines: section.lines.map((line) => mapLine(line)),
      })),
      updatedAt: serverTimestamp(),
    },
  };
}

export function mapSongEditorSource(
  song: Song,
  arrangement: SongArrangement | null,
): SongEditorFormValue {
  const selectedInstrument = arrangement?.instrument ?? song.instrumentsAvailable[0] ?? 'guitar';

  return {
    metadata: {
      title: song.title,
      artist: song.artist,
      songLink: song.songLink ?? '',
      instrument: selectedInstrument,
      key: arrangement?.key ?? 'C',
      capo: arrangement?.capo ?? 0,
      tuning: arrangement?.tuning ?? 'standard',
      transposeEnabled: arrangement?.transposeEnabled ?? true,
      isPublic: song.isPublic,
      status: song.status,
    },
    sections:
      arrangement?.sections.map((section) => ({
        type: section.type,
        title: section.title,
        lines: section.lines.map((line) => ({
          lyrics: line.lyrics,
          chordsText: line.chords.join(' '),
        })),
      })) ?? [createEmptySection()],
  };
}

export function createEmptyLine(): SongLineFormValue {
  return {
    lyrics: '',
    chordsText: '',
  };
}

export function createEmptySection() {
  return {
    type: 'verse',
    title: 'Verse 1',
    lines: [createEmptyLine()],
  } as const;
}

function mapLine(line: SongLineFormValue): Record<string, unknown> {
  return {
    lyrics: line.lyrics.trim(),
    chords: parseChordTokens(line.chordsText),
  };
}