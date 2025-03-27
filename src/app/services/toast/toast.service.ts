import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  /**
   * Creates an alert with the input message.
   * @param {string} message Message to notify user of.
   */
  notify(message: string): void {
    alert(message);
  }
}
