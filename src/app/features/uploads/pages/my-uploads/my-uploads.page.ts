import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonButton, IonContent } from '@ionic/angular/standalone';

import { appRoutes } from '../../../../core/config/route-paths.constants';
import { mapFirebaseError } from '../../../../core/firebase/firebase-error.mapper';
import { AuthService } from '../../../../core/services/auth.service';
import { ToastService } from '../../../../core/services/toast.service';
import { Song } from '../../../../models/song.model';
import { AppHeaderComponent } from '../../../../shared/components/app-header/app-header.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { ErrorStateComponent } from '../../../../shared/components/error-state/error-state.component';
import { LoadingSkeletonComponent } from '../../../../shared/components/loading-skeleton/loading-skeleton.component';
import { OfflineIndicatorComponent } from '../../../../shared/components/offline-indicator/offline-indicator.component';
import { SongQueryService } from '../../../songs/services/song-query.service';
import { SongEditorService } from '../../services/song-editor.service';

@Component({
  selector: 'app-my-uploads-page',
  standalone: true,
  templateUrl: './my-uploads.page.html',
  styleUrls: ['./my-uploads.page.scss'],
  imports: [
    IonContent,
    IonButton,
    RouterLink,
    AppHeaderComponent,
    OfflineIndicatorComponent,
    EmptyStateComponent,
    ErrorStateComponent,
    LoadingSkeletonComponent,
  ],
})
export class MyUploadsPage {
  private readonly authService = inject(AuthService);
  private readonly songQueryService = inject(SongQueryService);
  private readonly songEditorService = inject(SongEditorService);
  private readonly toastService = inject(ToastService);

  protected readonly appRoutes = appRoutes;
  protected songs: readonly Song[] = [];
  protected isLoading = true;
  protected errorMessage = '';

  constructor() {
    void this.loadSongs();
  }

  protected reload(): void {
    void this.loadSongs();
  }

  protected async deleteSong(songId: string): Promise<void> {
    if (!window.confirm('Delete this song and all of its arrangements?')) {
      return;
    }

    try {
      await this.songEditorService.deleteSong(songId);
      this.songs = this.songs.filter((song) => song.id !== songId);
      await this.toastService.showSuccess('Song deleted.');
    } catch (error) {
      await this.toastService.showError(mapFirebaseError(error));
    }
  }

  private async loadSongs(): Promise<void> {
    const currentUserId = this.authService.snapshot.firebaseUser?.uid;

    if (!currentUserId) {
      this.isLoading = false;
      this.songs = [];
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    try {
      this.songs = await this.songQueryService.getSongsByUploader(currentUserId);
    } catch (error) {
      this.errorMessage = mapFirebaseError(error);
    } finally {
      this.isLoading = false;
    }
  }
}