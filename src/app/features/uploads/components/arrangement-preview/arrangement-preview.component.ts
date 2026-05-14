import { Component, input } from '@angular/core';

import { SongEditorFormValue } from '../../models/song-editor-form.model';
import { parseChordTokens } from '../../utilities/song-payload.mapper';

@Component({
  selector: 'app-arrangement-preview',
  standalone: true,
  templateUrl: './arrangement-preview.component.html',
  styleUrls: ['./arrangement-preview.component.scss'],
})
export class ArrangementPreviewComponent {
  readonly preview = input.required<SongEditorFormValue>();

  protected readonly parseChordTokens = parseChordTokens;
}