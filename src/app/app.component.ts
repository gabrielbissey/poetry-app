import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PoemService } from './services/poem/poem.service';
import { AsyncPipe, CommonModule } from '@angular/common';
import {
  Subject,
  combineLatest,
  filter,
  map,
  of,
  startWith,
  switchMap,
} from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { ResultsComponent } from './components/results/results.component';
import { PoemComponent } from './components/poem/poem.component';

@Component({
  selector: 'app-root',
  imports: [
    AsyncPipe,
    ReactiveFormsModule,
    CommonModule,
    ResultsComponent,
    PoemComponent,
  ],
  providers: [HttpClient],
  templateUrl: './app.component.html',
  styleUrl: './app.component.sass',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  private _poemService = inject(PoemService);

  private _selectedPoet = new Subject<string>();
  private _selectedPoem = new Subject<string | null>();

  private _poetFilter = new Subject<string>();
  private _poemFilter = new Subject<string>();

  poet$ = this._selectedPoet.asObservable();

  poets$ = combineLatest([
    this._poemService.getPoets(),
    this._poetFilter.asObservable().pipe(
      startWith(''),
      filter((filter) => filter !== null && filter !== undefined)
    ),
  ]).pipe(
    map(([poets, filter]) => {
      if (filter === '' || filter === null) {
        return poets;
      }

      return poets.filter((poet) =>
        poet.toLowerCase().includes(filter.toLowerCase())
      );
    })
  );

  poems$ = combineLatest([
    this._selectedPoet.asObservable(),
    this._poemFilter.asObservable().pipe(
      startWith(''),
      filter((filter) => filter !== null && filter !== undefined)
    ),
  ]).pipe(
    switchMap(([poet, filter]) => {
      return this._poemService.getTitlesForPoet(poet).pipe(
        map((poems) => {
          if (filter === '' || filter === null) {
            return poems;
          }

          return poems.filter((poem) =>
            poem.toLowerCase().includes(filter.toLowerCase())
          );
        })
      );
    })
  );

  poem$ = combineLatest([
    this._selectedPoet.asObservable(),
    this._selectedPoem.asObservable(),
  ]).pipe(
    switchMap(([poet, poem]) => {
      if (poem) {
        return this._poemService.getPoem(poet, poem);
      }

      return of(null);
    })
  );

  /**
   * Selects the input poet.
   * @param {string} poet Selected poet.
   */
  selectPoet(poet: string): void {
    this._selectedPoet.next(poet);
    this._selectedPoem.next(null);
  }

  /**
   * Provides a filter for poets.
   * @param {string} filter Filter for poets.
   */
  selectPoetFilter(filter: string): void {
    this._poetFilter.next(filter);
  }

  /**
   * Selects the input poem.
   * @param {string} poem Selected poem.
   */
  selectPoem(poem: string): void {
    this._selectedPoem.next(poem);
  }

  /**
   * Provides a filter for poems.
   * @param {string} filter Filter for poems.
   */
  selectPoemFilter(filter: string): void {
    this._poemFilter.next(filter);
  }
}
