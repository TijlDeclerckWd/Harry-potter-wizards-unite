import {Injectable, Injector} from '@angular/core';
import {LocationStrategy, PathLocationStrategy} from '@angular/common';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import * as StackTraceParser from 'error-stack-parser';
import {url} from '../reusable code/reusable-code';
import {map} from 'rxjs/internal/operators';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  constructor(private injector: Injector, private http: HttpClient) { }

  log(error) {
    // Log the error to the console
    console.log('error inside log', error);
    // Send error to server
    const errorToSend = this.addContextInfo(error);
    console.log('errorToSend', errorToSend);
    return this.http.post(`${url}/user/addError`, errorToSend);
  }
  addContextInfo(error) {
    // All the context details that you want (usually coming from other services; Constants, UserService...)
    const name = error.name || null;
    const appId = 'HPWU';
    const user = 'ShthppnsUser';
    const type = error instanceof  HttpErrorResponse ? 'Server error' : 'Client error';
    const time = new Date().getTime();
    const id = `${appId}-${user}-${time}`;
    const location = this.injector.get(LocationStrategy);
    const url = location instanceof PathLocationStrategy ? location.path() : '';
    const status = error.status || null;
    const message = error.message || error.toString();
    const stack = error instanceof HttpErrorResponse ? null : StackTraceParser.parse(error);
    const errorToSend = {name, appId, user, type, time, id, url, status, message, stack};
    return errorToSend;
  }

  getAllErrors() {
    return this.http.get(`${url}/user/getAllErrors`)
      .pipe(map((errors: any) => {
        errors.obj.serverErrors.sort((a, b) => {
          return b.time - a.time;
        });
        errors.obj.clientErrors.sort((a, b) => {
          return b.time - a.time;
        });

        return errors;
      }))
  }
}

