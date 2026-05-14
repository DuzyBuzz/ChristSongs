import { Component, input, output } from '@angular/core';
import { IonChip, IonLabel } from '@ionic/angular/standalone';

@Component({
  selector: 'app-instrument-selector',
  standalone: true,
  templateUrl: './instrument-selector.component.html',
  styleUrls: ['./instrument-selector.component.scss'],
  imports: [IonChip, IonLabel],
})
export class InstrumentSelectorComponent {
  readonly instruments = input.required<readonly string[]>();
  readonly selectedInstrument = input('');
  readonly instrumentSelected = output<string>();
}