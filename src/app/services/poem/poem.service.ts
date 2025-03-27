import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { EMPTY, Observable, catchError, map, of, shareReplay, tap } from 'rxjs';
import {
  Authors,
  BadResponse,
  Poem,
  Title,
} from '../../models/interfaces/responses';
import { ToastService } from '../toast/toast.service';

@Injectable({
  providedIn: 'root',
})
export class PoemService {
  private _http = inject(HttpClient);
  private _toastService = inject(ToastService);

  /**
   * Gets list of poets.
   * @return {string[]} List of poets.
   */
  getPoets(): Observable<string[]> {
    const error = 'Unable to fetch poets';

    return this._http
      .get<Authors | BadResponse>('https://poetrydb.org/author')
      .pipe(
        catchError((err) => {
          this._toastService.notify(err);

          return EMPTY;
        }),
        map((authors) => {
          if (this._isBadResponse(authors)) {
            this._toastService.notify(error);
            throw new Error(error);
          }

          return authors;
        }),
        map((authors) => authors.authors)
      );
  }

  /**
   * Gets titles for the input poet.
   * @param {string} poet Poet to get titles for.
   * @return {string[]} Titles for input poet.
   */
  getTitlesForPoet(poet: string): Observable<string[]> {
    const error = `Unable to fetch poems for ${poet}`;

    return this._http
      .get<Title[] | BadResponse>(`https://poetrydb.org/author/${poet}/title`)
      .pipe(
        catchError((err) => {
          this._toastService.notify(err);

          return EMPTY;
        }),
        map((titles) => {
          if (this._isBadResponse<Title[]>(titles)) {
            this._toastService.notify(error);
            throw new Error(error);
          }
          return titles;
        }),
        map((titles) => titles.map((titles) => titles.title))
      );
  }

  /**
   * Gets poem by name and poet.
   * @param {string} poet Poet of the poem.
   * @param {string} title Title of the poem.
   * @return {Poem} Found poem.
   */
  getPoem(poet: string, title: string): Observable<Poem> {
    const error = `Unable to fetch poem ${title} for ${poet}`;

    return this._http
      .get<Poem[] | BadResponse>(`https://poetrydb.org/title/${title}`)
      .pipe(
        catchError((err) => {
          this._toastService.notify(err);

          return EMPTY;
        }),
        map((poems) => {
          if (this._isBadResponse(poems)) {
            this._toastService.notify(error);
            throw new Error(error);
          }
          return poems;
        }),
        map((poems) => {
          // The API that provides poems will returns all poems that match
          // the given substring, so we need to do an additional search
          // by author.
          const poem = poems.find((poem) => poem.author === poet);

          if (poem) {
            return poem;
          }

          this._toastService.notify(error);
          throw new Error(error);
        })
      );
  }

  /**
   * Determines if response is "bad". That is, the server may return
   * a "bad" response with a 200 OK status code, which is not technically
   * bad, so we need this additional check.
   */
  private _isBadResponse<T>(
    response: T | BadResponse
  ): response is BadResponse {
    return !!(response as BadResponse).reason;
  }
}
