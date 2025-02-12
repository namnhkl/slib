import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  private loadingSubject = new BehaviorSubject<boolean>(false);

  getLoading$() {
    return this.loadingSubject.asObservable();
  }

  setLoading(state: boolean) {
    this.loadingSubject.next(state);
  }

  toggleLoading() {
    this.loadingSubject.next(!this.loadingSubject.getValue());
  }
}
