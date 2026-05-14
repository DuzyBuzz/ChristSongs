import { Component, inject } from '@angular/core';

import { IonContent } from '@ionic/angular/standalone';

import { mapFirebaseError } from '../../../../core/firebase/firebase-error.mapper';
import { AuthService } from '../../../../core/services/auth.service';
import { AppHeaderComponent } from '../../../../shared/components/app-header/app-header.component';
import { OfflineIndicatorComponent } from '../../../../shared/components/offline-indicator/offline-indicator.component';
import { LibrarySongListComponent } from '../../components/library-song-list/library-song-list.component';
import { FavoritesService } from '../../services/favorites.service';
import { Song } from '../../../../models/song.model';

@Component({
  selector: 'app-favorites-page',
  standalone: true,
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
  imports: [
    IonContent,
    AppHeaderComponent,
    OfflineIndicatorComponent,
    LibrarySongListComponent,
  ],
})
export class FavoritesPage {
  private readonly authService = inject(AuthService);
  private readonly favoritesService = inject(FavoritesService);

  protected songs: readonly Song[] = [];
  protected isLoading = true;
  protected errorMessage = '';

  constructor() {
    void this.loadFavorites();
  }

  protected reload(): void {
    void this.loadFavorites();
  }

  private async loadFavorites(): Promise<void> {
    const currentUserId = this.authService.snapshot.firebaseUser?.uid;

    if (!currentUserId) {
      this.songs = [];
      this.isLoading = false;
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    try {
      this.songs = await this.favoritesService.getFavoritesForUser(currentUserId);
    } catch (error) {
      this.errorMessage = mapFirebaseError(error);
    } finally {
      this.isLoading = false;
    }
  }
}