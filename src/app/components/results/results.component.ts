import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-results',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './results.component.html',
  styleUrl: './results.component.sass',
})
export class ResultsComponent implements OnDestroy {
  @Input() label: string = '';
  @Input() results: string[] | null = [];

  @Output() resultSelected = new EventEmitter<string>();
  @Output() filterSelected = new EventEmitter<string | null>();

  filter = new FormControl<string>('');

  private _subscriptions = new Subscription();

  /**
   * Class constructor. Listens for filter value changes.
   */
  constructor() {
    this._subscriptions.add(
      this.filter.valueChanges.subscribe((filter) =>
        this.filterSelected.emit(filter)
      )
    );
  }

  /**
   * Emits selected result.
   * @param {string} result Selected result.
   */
  selectResult(result: string): void {
    this.resultSelected.emit(result);
  }

  /** Unsubscribes from all subscriptions. */
  ngOnDestroy(): void {
    this._subscriptions.unsubscribe();
  }
}
