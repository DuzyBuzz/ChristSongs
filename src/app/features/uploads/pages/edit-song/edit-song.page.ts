import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { IonButton, IonContent } from '@ionic/angular/standalone';

import { appRoutes } from '../../../../core/config/route-paths.constants';
import { mapFirebaseError } from '../../../../core/firebase/firebase-error.mapper';
import { AuthService } from '../../../../core/services/auth.service';
import { LoginGateService } from '../../../../core/services/login-gate.service';
import { ToastService } from '../../../../core/services/toast.service';
import { Song } from '../../../../models/song.model';
import { AppHeaderComponent } from '../../../../shared/components/app-header/app-header.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { ErrorStateComponent } from '../../../../shared/components/error-state/error-state.component';
import { OfflineIndicatorComponent } from '../../../../shared/components/offline-indicator/offline-indicator.component';
import { ArrangementEditorComponent } from '../../components/arrangement-editor/arrangement-editor.component';
import { ArrangementPreviewComponent } from '../../components/arrangement-preview/arrangement-preview.component';
import { SongMetadataFormComponent } from '../../components/song-metadata-form/song-metadata-form.component';
import { SongEditorFormGroup } from '../../models/song-editor-form.model';
import { SongEditorService } from '../../services/song-editor.service';

@Component({
  selector: 'app-edit-song-page',
  standalone: true,
  templateUrl: './edit-song.page.html',
  styleUrls: ['./edit-song.page.scss'],
  imports: [
    ReactiveFormsModule,
    IonContent,
    IonButton,
    AppHeaderComponent,
    OfflineIndicatorComponent,
    SongMetadataFormComponent,
    ArrangementEditorComponent,
    ArrangementPreviewComponent,
    EmptyStateComponent,
    ErrorStateComponent,
  ],
})
export class EditSongPage {
  private readonly route = inject(ActivatedRoute);
  private readonly authService = inject(AuthService);
  private readonly loginGateService = inject(LoginGateService);
  private readonly router = inject(Router);
  private readonly songEditorService = inject(SongEditorService);
  private readonly toastService = inject(ToastService);

  protected readonly songId = this.route.snapshot.paramMap.get('songId') ?? '';
  protected readonly appRoutes = appRoutes;
  protected form: SongEditorFormGroup | null = null;
  protected song: Song | null = null;
  protected previousInstrument = '';
  protected isLoading = true;
  protected isSaving = false;
  protected isDeleting = false;
  protected errorMessage = '';

  constructor() {
    void this.loadSong();
  }

  protected addSection(): void {
    if (!this.form) {
      return;
    }

    this.songEditorService.addSection(this.form.controls.sections);
  }

  protected removeSection(sectionIndex: number): void {
    if (!this.form) {
      return;
    }

    this.songEditorService.removeSection(this.form.controls.sections, sectionIndex);
  }

  protected addLine(sectionIndex: number): void {
    if (!this.form) {
      return;
    }

    this.songEditorService.addLine(this.form.controls.sections.at(sectionIndex));
  }

  protected removeLine(event: { sectionIndex: number; lineIndex: number }): void {
    if (!this.form) {
      return;
    }

    this.songEditorService.removeLine(
      this.form.controls.sections.at(event.sectionIndex),
      event.lineIndex,
    );
  }

  protected async save(): Promise<void> {
    if (!this.form || !this.song) {
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      await this.toastService.showError('Complete the required metadata and arrangement fields before saving.');
      return;
    }

    const currentUser = this.authService.snapshot.user;

    if (!currentUser) {
      await this.loginGateService.requireAuthentication({
        continueTo: this.router.url,
        reason: 'edit-song',
      });
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';

    try {
      await this.songEditorService.updateSong(
        this.songId,
        this.form.getRawValue(),
        currentUser,
        this.song,
        this.previousInstrument,
      );
      await this.toastService.showSuccess('Song updated successfully.');
      await this.router.navigateByUrl(appRoutes.songDetail(this.songId), { replaceUrl: true });
    } catch (error) {
      this.errorMessage = mapFirebaseError(error);
    } finally {
      this.isSaving = false;
    }
  }

  protected async deleteSong(): Promise<void> {
    if (this.isDeleting || !this.song) {
      return;
    }

    if (!this.authService.snapshot.user) {
      await this.loginGateService.requireAuthentication({
        continueTo: this.router.url,
        reason: 'edit-song',
      });
      return;
    }

    if (!window.confirm('Delete this song and its uploaded arrangements?')) {
      return;
    }

    this.isDeleting = true;
    this.errorMessage = '';

    try {
      await this.songEditorService.deleteSong(this.songId);
      await this.toastService.showSuccess('Song deleted.');
      await this.router.navigateByUrl(appRoutes.myUploads, { replaceUrl: true });
    } catch (error) {
      this.errorMessage = mapFirebaseError(error);
    } finally {
      this.isDeleting = false;
    }
  }

  private async loadSong(): Promise<void> {
    this.isLoading = true;
    this.errorMessage = '';

    try {
      const editorState = await this.songEditorService.loadEditorState(this.songId);

      if (!editorState) {
        this.song = null;
        this.form = null;
        return;
      }

      this.song = editorState.song;
      this.previousInstrument = editorState.arrangement?.instrument ?? editorState.formValue.metadata.instrument;
      this.form = this.songEditorService.buildForm(editorState.formValue);
    } catch (error) {
      this.errorMessage = mapFirebaseError(error);
    } finally {
      this.isLoading = false;
    }
  }
}