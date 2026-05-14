import { Component } from '@angular/core';
import { IonRouterOutlet } from '@ionic/angular/standalone';

@Component({
  selector: 'app-auth-shell',
  standalone: true,
  templateUrl: './auth-shell.component.html',
  styleUrls: ['./auth-shell.component.scss'],
  imports: [IonRouterOutlet],
})
export class AuthShellComponent {}