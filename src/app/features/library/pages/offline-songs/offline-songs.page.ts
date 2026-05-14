import { Component, inject } from '@angular/core';

import { IonContent } from '@ionic/angular/standalone';

import { mapFirebaseError } from '../../../../core/firebase/firebase-error.mapper';
import { AuthService } from '../../../../core/services/auth.service';
import { AppHeaderComponent } from '../../../../shared/components/app-header/app-header.component';
import { OfflineIndicatorComponent } from '../../../../shared/components/offline-indicator/offline-indicator.component';
import { Song } from '../../../../models/song.model';
import { LibrarySongListComponent } from '../../components/library-song-list/library-song-list.component';
import { OfflineSongsService } from '../../services/offline-songs.service';

@Component({
  selector: 'app-offline-songs-page',
  standalone: true,
  templateUrl: './offline-songs.page.html',
  styleUrls: ['./offline-songs.page.scss'],
  imports: [
    IonContent,
    AppHeaderComponent,
    OfflineIndicatorComponent,
    LibrarySongListComponent,
  ],
})
export class OfflineSongsPage {
  private readonly authService = inject(AuthService);
  private readonly offlineSongsService = inject(OfflineSongsService);

  protected songs: readonly Song[] = [];
  protected isLoading = true;
  protected errorMessage = '';

  constructor() {
    void this.loadOfflineSongs();
  }

  protected reload(): void {
    void this.loadOfflineSongs();
  }

  private async loadOfflineSongs(): Promise<void> {
    const currentUserId = this.authService.snapshot.firebaseUser?.uid;

    if (!currentUserId) {
      this.songs = [];
      this.isLoading = false;
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    try {
      this.songs = await this.offlineSongsService.getOfflineSongsForUser(currentUserId);
    } catch (error) {
      this.errorMessage = mapFirebaseError(error);
    } finally {
      this.isLoading = false;
    }
  }
}