import { Component, input, output } from '@angular/core';

import { Song } from '../../../../models/song.model';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { ErrorStateComponent } from '../../../../shared/components/error-state/error-state.component';
import { LoadingSkeletonComponent } from '../../../../shared/components/loading-skeleton/loading-skeleton.component';
import { SongCardComponent } from '../../../../shared/components/song-card/song-card.component';

@Component({
  selector: 'app-song-list-section',
  standalone: true,
  templateUrl: './song-list-section.component.html',
  styleUrls: ['./song-list-section.component.scss'],
  imports: [
    SongCardComponent,
    LoadingSkeletonComponent,
    ErrorStateComponent,
    EmptyStateComponent,
  ],
})
export class SongListSectionComponent {
  readonly eyebrow = input.required<string>();
  readonly title = input.required<string>();
  readonly songs = input.required<readonly Song[]>();
  readonly isLoading = input(false);
  readonly errorMessage = input('');
  readonly emptyTitle = input('No songs found');
  readonly emptyDescription = input('Try adjusting your filters or upload the first song.');
  readonly retry = output<void>();
}