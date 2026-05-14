import { Component } from '@angular/core';
import {
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  addCircleOutline,
  addCircleSharp,
  bookmarksOutline,
  bookmarksSharp,
  homeOutline,
  homeSharp,
  personCircleOutline,
  personCircleSharp,
  searchOutline,
  searchSharp,
} from 'ionicons/icons';

import { APP_TABS } from '../../config/app.constants';

@Component({
  selector: 'app-app-shell',
  standalone: true,
  templateUrl: './app-shell.component.html',
  styleUrls: ['./app-shell.component.scss'],
  imports: [
    IonTabs,
    IonRouterOutlet,
    IonTabBar,
    IonTabButton,
    IonIcon,
    IonLabel,
  ],
})
export class AppShellComponent {
  protected readonly tabs = APP_TABS;

  constructor() {
    addIcons({
      homeOutline,
      homeSharp,
      searchOutline,
      searchSharp,
      addCircleOutline,
      addCircleSharp,
      bookmarksOutline,
      bookmarksSharp,
      personCircleOutline,
      personCircleSharp,
    });
  }
}