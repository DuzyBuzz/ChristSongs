import { Component, input, output } from '@angular/core';
import { IonButton } from '@ionic/angular/standalone';

import { SongSectionFormArray } from '../../models/song-editor-form.model';
import {
  LineRemovalEvent,
  SectionEditorComponent,
} from '../section-editor/section-editor.component';

@Component({
  selector: 'app-arrangement-editor',
  standalone: true,
  templateUrl: './arrangement-editor.component.html',
  styleUrls: ['./arrangement-editor.component.scss'],
  imports: [IonButton, SectionEditorComponent],
})
export class ArrangementEditorComponent {
  readonly sections = input.required<SongSectionFormArray>();

  readonly sectionAdded = output<void>();
  readonly sectionRemoved = output<number>();
  readonly lineAdded = output<number>();
  readonly lineRemoved = output<LineRemovalEvent>();
}