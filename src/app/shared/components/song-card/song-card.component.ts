import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonChip, IonLabel } from '@ionic/angular/standalone';

import { Song } from '../../../models/song.model';
import { appRoutes } from '../../../core/config/route-paths.constants';

@Component({
  selector: 'app-song-card',
  standalone: true,
  templateUrl: './song-card.component.html',
  styleUrls: ['./song-card.component.scss'],
  imports: [RouterLink, IonChip, IonLabel],
})
export class SongCardComponent {
  readonly song = input.required<Song>();
  readonly showUploader = input(true);

  protected readonly appRoutes = appRoutes;
}