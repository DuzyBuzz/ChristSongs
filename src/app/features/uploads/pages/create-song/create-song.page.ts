import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonButton, IonContent } from '@ionic/angular/standalone';

import { appRoutes } from '../../../../core/config/route-paths.constants';
import { AuthService } from '../../../../core/services/auth.service';
import { LoginGateService } from '../../../../core/services/login-gate.service';
import { ToastService } from '../../../../core/services/toast.service';
import { AppHeaderComponent } from '../../../../shared/components/app-header/app-header.component';
import { ErrorStateComponent } from '../../../../shared/components/error-state/error-state.component';
import { OfflineIndicatorComponent } from '../../../../shared/components/offline-indicator/offline-indicator.component';
import { ArrangementEditorComponent } from '../../components/arrangement-editor/arrangement-editor.component';
import { ArrangementPreviewComponent } from '../../components/arrangement-preview/arrangement-preview.component';
import { SongMetadataFormComponent } from '../../components/song-metadata-form/song-metadata-form.component';
import { SongEditorService } from '../../services/song-editor.service';

@Component({
  selector: 'app-create-song-page',
  standalone: true,
  templateUrl: './create-song.page.html',
  styleUrls: ['./create-song.page.scss'],
  imports: [
    ReactiveFormsModule,
    IonContent,
    IonButton,
    AppHeaderComponent,
    OfflineIndicatorComponent,
    SongMetadataFormComponent,
    ArrangementEditorComponent,
    ArrangementPreviewComponent,
    ErrorStateComponent,
  ],
})
export class CreateSongPage {
  private readonly authService = inject(AuthService);
  private readonly loginGateService = inject(LoginGateService);
  private readonly router = inject(Router);
  private readonly songEditorService = inject(SongEditorService);
  private readonly toastService = inject(ToastService);

  protected readonly form = this.songEditorService.buildForm();
  protected readonly appRoutes = appRoutes;
  protected isSaving = false;
  protected saveErrorMessage = '';

  protected addSection(): void {
    this.songEditorService.addSection(this.form.controls.sections);
  }

  protected removeSection(sectionIndex: number): void {
    this.songEditorService.removeSection(this.form.controls.sections, sectionIndex);
  }

  protected addLine(sectionIndex: number): void {
    this.songEditorService.addLine(this.form.controls.sections.at(sectionIndex));
  }

  protected removeLine(event: { sectionIndex: number; lineIndex: number }): void {
    this.songEditorService.removeLine(
      this.form.controls.sections.at(event.sectionIndex),
      event.lineIndex,
    );
  }

  protected async save(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      await this.toastService.showError('Complete the required metadata and arrangement fields before saving.');
      return;
    }

    const currentUser = this.authService.snapshot.user;

    if (!currentUser) {
      await this.loginGateService.requireAuthentication({
        continueTo: this.router.url,
        reason: 'upload-song',
      });
      return;
    }

    this.isSaving = true;
    this.saveErrorMessage = '';

    try {
      const songId = await this.songEditorService.createSong(
        this.form.getRawValue(),
        currentUser,
      );

      await this.toastService.showSuccess('Song uploaded successfully.');
      await this.router.navigateByUrl(appRoutes.songDetail(songId), { replaceUrl: true });
    } catch (error) {
      this.saveErrorMessage = error instanceof Error
        ? error.message
        : 'Unable to save this song right now.';
    } finally {
      this.isSaving = false;
    }
  }
}