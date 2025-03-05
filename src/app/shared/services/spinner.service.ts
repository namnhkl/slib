import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SpinnerService {
  private _spinner = new BehaviorSubject<boolean>(false);

  private isWaitAll = false;

  get spinner$(): Observable<boolean> {
    return this._spinner.asObservable();
  }

  hiden() {
    if (!this.isWaitAll) {
      this._spinner.next(false);
    }
  }

  show() {
    this._spinner.next(true);
  }

  showWaitAll() {
    this.isWaitAll = true;
    this._spinner.next(true);
  }

  hidenAll() {
    this._spinner.next(false);
    this.isWaitAll = false;
  }
}
