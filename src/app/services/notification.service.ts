import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, Subject} from 'rxjs';

@Injectable()

export class NotificationService {

  private _notification: Subject<string> = new Subject();
  readonly notification$: Observable<string> = this._notification.asObservable();

  constructor() {}

  notify(message) {
    console.log('entered modify', message);
    this._notification.next(message);
    // setTimeout(() => this._notification.next(null), 3000);
  }


}
