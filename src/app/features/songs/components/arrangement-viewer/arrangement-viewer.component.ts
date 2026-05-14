import { Component, input } from '@angular/core';

import { SongArrangement } from '../../../../models/song-arrangement.model';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { ErrorStateComponent } from '../../../../shared/components/error-state/error-state.component';
import { LoadingSkeletonComponent } from '../../../../shared/components/loading-skeleton/loading-skeleton.component';

@Component({
  selector: 'app-arrangement-viewer',
  standalone: true,
  templateUrl: './arrangement-viewer.component.html',
  styleUrls: ['./arrangement-viewer.component.scss'],
  imports: [EmptyStateComponent, ErrorStateComponent, LoadingSkeletonComponent],
})
export class ArrangementViewerComponent {
  readonly arrangement = input<SongArrangement | null>(null);
  readonly isLoading = input(false);
  readonly errorMessage = input('');
}