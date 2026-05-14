import {
  FormArray,
  FormControl,
  FormGroup,
} from '@angular/forms';

import { SongStatus } from '../../../core/config/firestore.constants';
import { Song } from '../../../models/song.model';
import { SongArrangement } from '../../../models/song-arrangement.model';

export interface SongLineFormValue {
  readonly lyrics: string;
  readonly chordsText: string;
}

export interface SongSectionFormValue {
  readonly type: string;
  readonly title: string;
  readonly lines: readonly SongLineFormValue[];
}

export interface SongMetadataFormValue {
  readonly title: string;
  readonly artist: string;
  readonly songLink: string;
  readonly instrument: string;
  readonly key: string;
  readonly capo: number;
  readonly tuning: string;
  readonly transposeEnabled: boolean;
  readonly isPublic: boolean;
  readonly status: SongStatus;
}

export interface SongEditorFormValue {
  readonly metadata: SongMetadataFormValue;
  readonly sections: readonly SongSectionFormValue[];
}

export interface SongLineFormControls {
  readonly lyrics: FormControl<string>;
  readonly chordsText: FormControl<string>;
}

export interface SongSectionFormControls {
  readonly type: FormControl<string>;
  readonly title: FormControl<string>;
  readonly lines: SongLineFormArray;
}

export interface SongMetadataFormControls {
  readonly title: FormControl<string>;
  readonly artist: FormControl<string>;
  readonly songLink: FormControl<string>;
  readonly instrument: FormControl<string>;
  readonly key: FormControl<string>;
  readonly capo: FormControl<number>;
  readonly tuning: FormControl<string>;
  readonly transposeEnabled: FormControl<boolean>;
  readonly isPublic: FormControl<boolean>;
  readonly status: FormControl<SongStatus>;
}

export interface SongEditorFormControls {
  readonly metadata: SongMetadataFormGroup;
  readonly sections: SongSectionFormArray;
}

export type SongLineFormGroup = FormGroup<SongLineFormControls>;
export type SongLineFormArray = FormArray<SongLineFormGroup>;
export type SongSectionFormGroup = FormGroup<SongSectionFormControls>;
export type SongSectionFormArray = FormArray<SongSectionFormGroup>;
export type SongMetadataFormGroup = FormGroup<SongMetadataFormControls>;
export type SongEditorFormGroup = FormGroup<SongEditorFormControls>;

export interface SongEditorLoadedState {
  readonly song: Song;
  readonly arrangement: SongArrangement | null;
  readonly formValue: SongEditorFormValue;
}