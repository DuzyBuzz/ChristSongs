import { Injectable, inject } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private readonly toastController = inject(ToastController);

  async showSuccess(message: string): Promise<void> {
    await this.present(message, 'success');
  }

  async showError(message: string): Promise<void> {
    await this.present(message, 'danger');
  }

  private async present(
    message: string,
    color: 'danger' | 'success',
  ): Promise<void> {
    const toast = await this.toastController.create({
      color,
      duration: 2800,
      message,
      position: 'bottom',
    });

    await toast.present();
  }
}