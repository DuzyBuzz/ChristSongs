import { Component, input, output } from '@angular/core';

import { Song } from '../../../../models/song.model';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { ErrorStateComponent } from '../../../../shared/components/error-state/error-state.component';
import { LoadingSkeletonComponent } from '../../../../shared/components/loading-skeleton/loading-skeleton.component';
import { SongCardComponent } from '../../../../shared/components/song-card/song-card.component';

@Component({
  selector: 'app-library-song-list',
  standalone: true,
  templateUrl: './library-song-list.component.html',
  styleUrls: ['./library-song-list.component.scss'],
  imports: [
    EmptyStateComponent,
    ErrorStateComponent,
    LoadingSkeletonComponent,
    SongCardComponent,
  ],
})
export class LibrarySongListComponent {
  readonly title = input.required<string>();
  readonly eyebrow = input.required<string>();
  readonly songs = input.required<readonly Song[]>();
  readonly isLoading = input(false);
  readonly errorMessage = input('');
  readonly emptyTitle = input.required<string>();
  readonly emptyDescription = input.required<string>();
  readonly retry = output<void>();
}