export interface SongArrangementLine {
  readonly lyrics: string;
  readonly chords: readonly string[];
}

export interface SongArrangementSection {
  readonly type: string;
  readonly title: string;
  readonly lines: readonly SongArrangementLine[];
}

export interface SongArrangement {
  readonly id: string;
  readonly songId: string;
  readonly instrument: string;
  readonly key: string;
  readonly capo: number | null;
  readonly tuning: string;
  readonly transposeEnabled: boolean;
  readonly sections: readonly SongArrangementSection[];
  readonly createdAt: Date | null;
  readonly updatedAt: Date | null;
}