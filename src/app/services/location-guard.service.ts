import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate} from '@angular/router';
import {AuthenticationService} from './auth.service';
import {Observable} from 'rxjs';
import {map} from 'rxjs/internal/operators';

@Injectable({
  providedIn: 'root'
})
export class LocationGuardService implements CanActivate {

  constructor(private authService: AuthenticationService) { }

  canActivate(route: ActivatedRouteSnapshot): boolean | Observable<boolean>{
    console.log('entered the guard');
    if (this.authService.isLoggedIn()) {
      if (this.authService.currentUser().user.locationSaved) {
        return true;
      } else {
        return this.authService.isLocationSaved()
          .pipe(map((status: any) => status.saved));
        // this.authService.isLocationSaved()
        //   .subscribe((status: {saved: boolean}) => {
        //     console.log('saved', status);
        //     return status.saved;
        //   });
      }
    } else {
      return false;
    }
  }
}
