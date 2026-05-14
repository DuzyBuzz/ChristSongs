import { Component, input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonSelect,
  IonSelectOption,
  IonToggle,
} from '@ionic/angular/standalone';

import { DEFAULT_INSTRUMENTS } from '../../../../core/config/app.constants';
import { SONG_STATUS } from '../../../../core/config/firestore.constants';
import { SongMetadataFormGroup } from '../../models/song-editor-form.model';

@Component({
  selector: 'app-song-metadata-form',
  standalone: true,
  templateUrl: './song-metadata-form.component.html',
  styleUrls: ['./song-metadata-form.component.scss'],
  imports: [
    ReactiveFormsModule,
    IonList,
    IonItem,
    IonInput,
    IonLabel,
    IonSelect,
    IonSelectOption,
    IonToggle,
    IonNote,
  ],
})
export class SongMetadataFormComponent {
  readonly form = input.required<SongMetadataFormGroup>();

  protected readonly instruments = DEFAULT_INSTRUMENTS;
  protected readonly statuses = [SONG_STATUS.active, SONG_STATUS.draft] as const;

  protected get songLinkControl() {
    return this.form().controls.songLink;
  }
}