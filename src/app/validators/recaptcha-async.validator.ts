import {Inject, Injectable, InjectionToken} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AbstractControl} from '@angular/forms';

export const RECAPTCHA_URL = new InjectionToken('RECAPTCHA_URL');

@Injectable()
export class ReCaptchaAsyncValidator {

  constructor( private http: HttpClient, @Inject(RECAPTCHA_URL) private url ) {
  }

  validateToken( token: string ) {
    return (_: AbstractControl ) => {
      return this.http.get(this.url, { params: { token } }).map( (res: any) => res.json()).map(res => {
        if(!res.success ) {
          return { tokenInvalid: true }
        }
        return null;
      });
    }
  }
}
