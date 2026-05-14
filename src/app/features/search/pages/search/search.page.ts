import { Component, inject } from '@angular/core';
import {
  IonContent,
  IonSearchbar,
} from '@ionic/angular/standalone';

import { DEFAULT_PAGE_SIZE, DEFAULT_INSTRUMENTS } from '../../../../core/config/app.constants';
import { mapFirebaseError } from '../../../../core/firebase/firebase-error.mapper';
import { SongFilters, SongSearchField } from '../../../../models/song-filters.model';
import { Song } from '../../../../models/song.model';
import { AppHeaderComponent } from '../../../../shared/components/app-header/app-header.component';
import { OfflineIndicatorComponent } from '../../../../shared/components/offline-indicator/offline-indicator.component';
import { SongListSectionComponent } from '../../../songs/components/song-list-section/song-list-section.component';
import { SongSearchService } from '../../services/song-search.service';

@Component({
  selector: 'app-search-page',
  standalone: true,
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
  imports: [
    IonContent,
    IonSearchbar,
    AppHeaderComponent,
    OfflineIndicatorComponent,
    SongListSectionComponent,
  ],
})
export class SearchPage {
  private readonly songSearchService = inject(SongSearchService);

  protected readonly instruments = DEFAULT_INSTRUMENTS;
  protected songs: readonly Song[] = [];
  protected searchTerm = '';
  protected selectedField: SongSearchField = 'all';
  protected selectedInstrument: string | null = null;
  protected isLoading = false;
  protected errorMessage = '';
  protected readonly fields: readonly SongSearchField[] = ['all', 'title', 'artist', 'uploader'];

  constructor() {
    void this.runSearch();
  }

  protected handleSearchInput(event: Event): void {
    const searchEvent = event as CustomEvent<{ value?: string | null }>;
    this.searchTerm = searchEvent.detail.value?.trim() ?? '';
    void this.runSearch();
  }

  protected updateField(field: SongSearchField): void {
    this.selectedField = field;
    void this.runSearch();
  }

  protected updateInstrument(instrument: string | null): void {
    this.selectedInstrument = instrument;
    void this.runSearch();
  }

  protected getFieldLabel(field: SongSearchField): string {
    return field === 'all' ? 'All fields' : `${field.charAt(0).toUpperCase()}${field.slice(1)}`;
  }

  protected getInstrumentLabel(instrument: string): string {
    return `${instrument.charAt(0).toUpperCase()}${instrument.slice(1)}`;
  }

  protected retry(): void {
    void this.runSearch();
  }

  private async runSearch(): Promise<void> {
    this.isLoading = true;
    this.errorMessage = '';

    const filters: SongFilters = {
      instrument: this.selectedInstrument,
      limit: DEFAULT_PAGE_SIZE,
      searchField: this.selectedField,
      searchTerm: this.searchTerm,
    };

    try {
      this.songs = await this.songSearchService.search(filters);
    } catch (error) {
      this.errorMessage = mapFirebaseError(error);
    } finally {
      this.isLoading = false;
    }
  }
}