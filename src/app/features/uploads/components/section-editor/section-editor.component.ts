import { Component, input, output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
  IonButton,
  IonInput,
  IonItem,
  IonSelect,
  IonSelectOption,
  IonTextarea,
} from '@ionic/angular/standalone';

import { SongLineFormArray, SongSectionFormGroup } from '../../models/song-editor-form.model';

export interface LineRemovalEvent {
  readonly sectionIndex: number;
  readonly lineIndex: number;
}

@Component({
  selector: 'app-section-editor',
  standalone: true,
  templateUrl: './section-editor.component.html',
  styleUrls: ['./section-editor.component.scss'],
  imports: [
    ReactiveFormsModule,
    IonButton,
    IonItem,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonTextarea,
  ],
})
export class SectionEditorComponent {
  readonly sectionForm = input.required<SongSectionFormGroup>();
  readonly sectionIndex = input.required<number>();
  readonly canRemove = input(false);

  readonly lineAdded = output<number>();
  readonly lineRemoved = output<LineRemovalEvent>();
  readonly sectionRemoved = output<number>();

  protected readonly sectionTypes = ['intro', 'verse', 'chorus', 'bridge', 'tag', 'outro'] as const;

  protected get lines(): SongLineFormArray {
    return this.sectionForm().controls.lines;
  }
}