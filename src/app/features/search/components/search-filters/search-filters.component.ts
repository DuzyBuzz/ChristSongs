import { Component, input, output } from '@angular/core';

import { SongSearchField } from '../../../../models/song-filters.model';

@Component({
  selector: 'app-search-filters',
  standalone: true,
  templateUrl: './search-filters.component.html',
  styleUrls: ['./search-filters.component.scss'],
})
export class SearchFiltersComponent {
  readonly selectedField = input.required<SongSearchField>();
  readonly selectedInstrument = input<string | null>(null);
  readonly instruments = input.required<readonly string[]>();

  readonly fieldSelected = output<SongSearchField>();
  readonly instrumentSelected = output<string | null>();

  protected readonly fields: readonly SongSearchField[] = ['all', 'title', 'artist', 'uploader'];

  protected getFieldLabel(field: SongSearchField): string {
    return field === 'all' ? 'All fields' : `${field.charAt(0).toUpperCase()}${field.slice(1)}`;
  }

  protected getInstrumentLabel(instrument: string): string {
    return `${instrument.charAt(0).toUpperCase()}${instrument.slice(1)}`;
  }
}