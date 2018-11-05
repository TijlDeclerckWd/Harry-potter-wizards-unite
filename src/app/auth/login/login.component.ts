import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {AuthenticationService} from "../../services/auth.service";
import {ActivatedRoute, Router} from "@angular/router";
import {FindLocalsService} from "../../services/find-locals.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {NavigationService} from "../../services/navigation.service";


@Component({
    selector:'app-login',
    templateUrl:'./login.component.html',
    styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

    user;
    loginForm: FormGroup;
    @Output() signup = new EventEmitter();
    @Output() closeSubmenu = new EventEmitter();
    loginError: string;
    loading = false;

    constructor(
        private auth: AuthenticationService,
        private router: Router,
        private route: ActivatedRoute,
        private findLocalsService: FindLocalsService,
        private navigationService: NavigationService) {
}

ngOnInit() {
    this.loginForm = new FormGroup({
        email: new FormControl(null, [Validators.required]),
        password: new FormControl(null, [Validators.required])
    });
}

onLogin() {
      console.log('tried to log in');
      const formValues = {
            email: this.loginForm.value.email,
            password: this.loginForm.value.password
        };

        this.auth.signIn(formValues)
            .subscribe((token: any) => {
              this.loading = true;
              console.log('test1', token);
                this.getAndSaveLocation(token);
    }, (error) => {
              console.log(error);
              this.loginError = error.error.notification;
            });
}

    onError(error) {
        switch (error.code) {
            case 'PERMISSION_DENIED':
                alert("User denied permission");
                break;

            case 'TIMEOUT':
                alert("Geolocation timed out");
                break;

            case 'POSITION_UNAVAILABLE':
                alert("Geolocation information is not available");
                break;

            default:
                alert("An unknown error ocurred when we tried to save your location");
                console.log('error', error);
                break;
        }
    }

getAndSaveLocation(token) {
      console.log('get and save location');

        if (navigator.geolocation) {
          console.log('navigator works')
            navigator.geolocation.getCurrentPosition((position) => {
                console.log('cb called')
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                console.log('check2', latitude, longitude);

                const locationObj = {
                  latitude,
                  longitude,
                  token: token.token
                };


                if (latitude && longitude) {
                  this.saveLocation(locationObj, token);

            }
            }, (err) => {
              this.onError(err);
              this.loginForm.reset();
              this.closeSubmenu.emit();
              // close the background
              this.navigationService.checkboxUpdates.next({checked: false});
              this.loading = false;
              // only set the localstorage after saving the location, so that the homepage find-locals section
              // receives up-to-date results.
              localStorage.setItem('token', token.token);
              localStorage.setItem('fullName', token.fullName);
            }, {
                maximumAge: 60 * 1000, timeout: 5 * 60 * 1000, enableHighAccuracy: true
            });
        } else {
            alert("your browser doesn't support HTML5 Geolocation! If you wish to experience this website in the best way possible, please use a different browser.")
          this.loginForm.reset();
          this.closeSubmenu.emit();
          // close the background
          this.navigationService.checkboxUpdates.next({checked: false});
          this.loading = false;
          // only set the localstorage after saving the location, so that the homepage find-locals section
          // receives up-to-date results.
          localStorage.setItem('token', token.token);
          localStorage.setItem('fullName', token.fullName);
        }

}

saveLocation(locationObj, token) {
  this.findLocalsService.saveLocation(locationObj)
    .subscribe((data) => {
      this.loginForm.reset();
      // close submenu
      this.closeSubmenu.emit();
      // close the background
      this.navigationService.checkboxUpdates.next({checked: false});
      this.loading = false;
      // only set the localstorage after saving the location, so that the homepage find-locals section
      // receives up-to-date results.
      localStorage.setItem('token', token.token);
      localStorage.setItem('fullName', token.fullName);
    });
}
}
