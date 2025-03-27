import { Component, Input } from '@angular/core';
import { Poem } from '../../models/interfaces/responses';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-poem',
  imports: [CommonModule],
  templateUrl: './poem.component.html',
  styleUrl: './poem.component.sass',
})
export class PoemComponent {
  @Input() poem: Poem | null = null;
}
