import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterLink } from '@angular/router';
import { IonButton, IonContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { cloudDownloadOutline, heartOutline } from 'ionicons/icons';

import { appRoutes } from '../../../../core/config/route-paths.constants';
import { mapFirebaseError } from '../../../../core/firebase/firebase-error.mapper';
import { AuthService } from '../../../../core/services/auth.service';
import { ExternalLinkService } from '../../../../core/services/external-link.service';
import { ToastService } from '../../../../core/services/toast.service';
import { Song } from '../../../../models/song.model';
import { SongArrangement } from '../../../../models/song-arrangement.model';
import { AppHeaderComponent } from '../../../../shared/components/app-header/app-header.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { OfflineIndicatorComponent } from '../../../../shared/components/offline-indicator/offline-indicator.component';
import { FavoritesService } from '../../../library/services/favorites.service';
import { OfflineSongsService } from '../../../library/services/offline-songs.service';
import { ArrangementViewerComponent } from '../../components/arrangement-viewer/arrangement-viewer.component';
import { InstrumentSelectorComponent } from '../../components/instrument-selector/instrument-selector.component';
import { SongArrangementService } from '../../services/song-arrangement.service';
import { SongQueryService } from '../../services/song-query.service';

@Component({
  selector: 'app-song-detail-page',
  standalone: true,
  templateUrl: './song-detail.page.html',
  styleUrls: ['./song-detail.page.scss'],
  imports: [
    IonContent,
    IonButton,
    IonIcon,
    RouterLink,
    AppHeaderComponent,
    ArrangementViewerComponent,
    InstrumentSelectorComponent,
    EmptyStateComponent,
    OfflineIndicatorComponent,
  ],
})
export class SongDetailPage {
  private readonly route = inject(ActivatedRoute);
  private readonly authService = inject(AuthService);
  private readonly externalLinkService = inject(ExternalLinkService);
  private readonly toastService = inject(ToastService);
  private readonly favoritesService = inject(FavoritesService);
  private readonly offlineSongsService = inject(OfflineSongsService);
  private readonly songQueryService = inject(SongQueryService);
  private readonly songArrangementService = inject(SongArrangementService);

  protected readonly songId = this.route.snapshot.paramMap.get('songId') ?? 'song';
  protected readonly appRoutes = appRoutes;
  protected song: Song | null = null;
  protected arrangement: SongArrangement | null = null;
  protected selectedInstrument = '';
  protected isLoadingSong = true;
  protected isLoadingArrangement = false;
  protected songErrorMessage = '';
  protected arrangementErrorMessage = '';
  protected isFavorite = false;
  protected isSavedOffline = false;
  protected isOpeningSongLink = false;
  protected isUpdatingFavorite = false;
  protected isUpdatingOffline = false;

  constructor() {
    addIcons({ heartOutline, cloudDownloadOutline });
    void this.loadSong();
  }

  protected get isOwner(): boolean {
    return this.song?.uploaderUid === this.authService.snapshot.firebaseUser?.uid;
  }

  protected async selectInstrument(instrument: string): Promise<void> {
    if (instrument === this.selectedInstrument) {
      return;
    }

    this.selectedInstrument = instrument;
    await this.loadArrangement();
  }

  protected async toggleFavorite(): Promise<void> {
    const currentUserId = this.authService.snapshot.firebaseUser?.uid;

    if (!this.song || this.isUpdatingFavorite) {
      return;
    }

    if (!currentUserId) {
      await this.toastService.showError('Sign-in is only required when uploading songs.');
      return;
    }

    if (this.isUpdatingFavorite) {
      return;
    }

    this.isUpdatingFavorite = true;

    try {
      const nextFavoriteState = await this.favoritesService.toggleFavorite(
        currentUserId,
        this.song.id,
      );

      this.isFavorite = nextFavoriteState;
    } catch (error) {
      await this.toastService.showError(mapFirebaseError(error));
    } finally {
      this.isUpdatingFavorite = false;
    }
  }

  protected async toggleOfflineSong(): Promise<void> {
    const currentUserId = this.authService.snapshot.firebaseUser?.uid;

    if (!this.song || !this.selectedInstrument || this.isUpdatingOffline) {
      return;
    }

    if (!currentUserId) {
      await this.toastService.showError('Sign-in is only required when uploading songs.');
      return;
    }

    if (this.isUpdatingOffline) {
      return;
    }

    this.isUpdatingOffline = true;

    try {
      this.isSavedOffline = await this.offlineSongsService.toggleOfflineSong(
        currentUserId,
        this.song.id,
        this.selectedInstrument,
      );
      await this.toastService.showSuccess(
        this.isSavedOffline
          ? 'Song saved for offline reading.'
          : 'Song removed from offline reading.',
      );
    } catch (error) {
      await this.toastService.showError(mapFirebaseError(error));
    } finally {
      this.isUpdatingOffline = false;
    }
  }

  protected async openSongLink(): Promise<void> {
    const songLink = this.song?.songLink?.trim();

    if (!songLink || this.isOpeningSongLink) {
      return;
    }

    this.isOpeningSongLink = true;

    try {
      await this.externalLinkService.open(songLink);
    } catch (error) {
      await this.toastService.showError(mapFirebaseError(error));
    } finally {
      this.isOpeningSongLink = false;
    }
  }

  private async loadSong(): Promise<void> {
    this.isLoadingSong = true;
    this.songErrorMessage = '';

    try {
      this.song = await this.songQueryService.getSongById(this.songId);

      if (!this.song) {
        return;
      }

      await this.loadLibraryState(this.song.id);

      this.selectedInstrument = this.song.instrumentsAvailable[0] ?? '';

      if (this.selectedInstrument) {
        await this.loadArrangement();
      }
    } catch (error) {
      this.songErrorMessage = mapFirebaseError(error);
    } finally {
      this.isLoadingSong = false;
    }
  }

  private async loadArrangement(): Promise<void> {
    if (!this.selectedInstrument) {
      this.arrangement = null;
      return;
    }

    this.isLoadingArrangement = true;
    this.arrangementErrorMessage = '';

    try {
      this.arrangement = await this.songArrangementService.getArrangementForInstrument(
        this.songId,
        this.selectedInstrument,
      );
    } catch (error) {
      this.arrangementErrorMessage = mapFirebaseError(error);
    } finally {
      this.isLoadingArrangement = false;
    }
  }

  private async loadLibraryState(songId: string): Promise<void> {
    const currentUserId = this.authService.snapshot.firebaseUser?.uid;

    if (!currentUserId) {
      this.isFavorite = false;
      this.isSavedOffline = false;
      return;
    }

    const [isFavorite, isSavedOffline] = await Promise.all([
      this.favoritesService.isFavorite(currentUserId, songId),
      this.offlineSongsService.isSavedOffline(currentUserId, songId),
    ]);

    this.isFavorite = isFavorite;
    this.isSavedOffline = isSavedOffline;
  }
}