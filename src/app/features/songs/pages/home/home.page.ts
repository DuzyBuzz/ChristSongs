import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonButton, IonChip, IonContent, IonLabel } from '@ionic/angular/standalone';

import { DEFAULT_INSTRUMENTS } from '../../../../core/config/app.constants';
import { appRoutes } from '../../../../core/config/route-paths.constants';
import { mapFirebaseError } from '../../../../core/firebase/firebase-error.mapper';
import { Song } from '../../../../models/song.model';
import { AppHeaderComponent } from '../../../../shared/components/app-header/app-header.component';
import { OfflineIndicatorComponent } from '../../../../shared/components/offline-indicator/offline-indicator.component';
import { SongListSectionComponent } from '../../components/song-list-section/song-list-section.component';
import { SongQueryService } from '../../services/song-query.service';

@Component({
  selector: 'app-home-page',
  standalone: true,
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  imports: [
    IonContent,
    IonButton,
    IonChip,
    IonLabel,
    RouterLink,
    AppHeaderComponent,
    OfflineIndicatorComponent,
    SongListSectionComponent,
  ],
})
export class HomePage {
  private readonly songQueryService = inject(SongQueryService);

  protected readonly appRoutes = appRoutes;
  protected readonly instruments = DEFAULT_INSTRUMENTS;
  protected recentSongs: readonly Song[] = [];
  protected popularSongs: readonly Song[] = [];
  protected isLoading = true;
  protected errorMessage = '';

  constructor() {
    void this.loadHomeData();
  }

  protected reload(): void {
    void this.loadHomeData();
  }

  private async loadHomeData(): Promise<void> {
    this.isLoading = true;
    this.errorMessage = '';

    try {
      const [recentSongs, popularSongs] = await Promise.all([
        this.songQueryService.getRecentSongs(),
        this.songQueryService.getPopularSongs(),
      ]);

      this.recentSongs = recentSongs;
      this.popularSongs = popularSongs;
    } catch (error) {
      this.errorMessage = mapFirebaseError(error);
    } finally {
      this.isLoading = false;
    }
  }
}