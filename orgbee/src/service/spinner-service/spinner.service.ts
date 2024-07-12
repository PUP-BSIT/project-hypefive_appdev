import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {
  private spinnerSubject = new BehaviorSubject<{ isLoading: boolean, message: string }>({ isLoading: false, message: '' });
  spinnerState$ = this.spinnerSubject.asObservable();

  show(message: string = 'Loading...') {
    this.spinnerSubject.next({ isLoading: true, message });
  }

  hide() {
    this.spinnerSubject.next({ isLoading: false, message: '' });
  }
}
