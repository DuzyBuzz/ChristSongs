import { Injectable } from '@angular/core';
import { BehaviorSubject, fromEvent, merge } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NetworkService {
  private readonly isOnlineSubject = new BehaviorSubject<boolean>(navigator.onLine);

  readonly isOnline$ = this.isOnlineSubject.asObservable();

  constructor() {
    merge(fromEvent(window, 'online'), fromEvent(window, 'offline')).subscribe(() => {
      this.isOnlineSubject.next(navigator.onLine);
    });
  }
}