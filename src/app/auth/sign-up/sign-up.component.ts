import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import { FormControl, FormGroup, Validators} from '@angular/forms';

import {countries} from "../../reusable code/reusable-code";
import {AuthenticationService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {NavigationService} from "../../services/navigation.service";
import { debounceTime } from "rxjs/operators";
import {isEqualPassword} from '../../validators/equal-passwords.validator';
import {isInvalidHouse} from '../../validators/house.validator';
import {User} from '../user.model';
import { RECAPTCHA_LANGUAGE } from 'ng-recaptcha';

@Component({
    selector: 'app-sign-up',
    templateUrl: 'sign-up.component.html',
    styleUrls: ['sign-up.component.css']
    })

export class SignUpComponent implements OnInit {

    checked = true;
    mySignupForm: FormGroup;
    countries = countries;
    uniqueUsernameMessage;
    submittedForm = false;
    serverError = false;
    @Output() closeSubmenu = new EventEmitter();
    @ViewChild('select') select;


    constructor(
        private authService: AuthenticationService,
        private route: Router,
        private navigationService: NavigationService){}

    get firstName() { return this.mySignupForm.get('firstName'); }
    get lastName() { return this.mySignupForm.get('lastName'); }
    get username() { return this.mySignupForm.get('username'); }
    get email() { return this.mySignupForm.get('email'); }
    get password1() { return this.mySignupForm.get('password1'); }
    get password2() { return this.mySignupForm.get('password2'); }
    get birthDate() { return this.mySignupForm.get('birthDate'); }
    get country() { return this.mySignupForm.get('country'); }
    get house() { return this.mySignupForm.get('house'); }

    ngOnInit() {

        this.mySignupForm = new FormGroup({
            firstName: new FormControl(null, Validators.required),
            lastName: new FormControl(null, Validators.required),
            username: new FormControl(null, [
              Validators.required,
              Validators.minLength(5),
              Validators.maxLength(15),
            Validators.pattern('^[a-zA-Z0-9_.-]*$')]),
            birthDate: new FormControl(null, Validators.required),
            password1: new FormControl(null, [
              Validators.required,
              Validators.minLength(6),
              Validators.maxLength(15),
              Validators.pattern('^.*(?=.{4,10})(?=.*\\d)(?=.*[a-zA-Z]).*$')]),
            password2: new FormControl(null, [
              Validators.required,
              isEqualPassword]),
            email: new FormControl(null, [
              Validators.required,
              Validators.email]),
            country: new FormControl(null, Validators.required),
            house: new FormControl(null, [
              Validators.required,
              isInvalidHouse]),
          captcha: new FormControl(null, Validators.required)
        });

      this.mySignupForm.controls['captcha'].setErrors({'invalid-captcha': true});
    }

    navigateToLoginPage() {
      this.checked = false;

      setTimeout(() => {
        this.navigationService.checkboxUpdates.next({checked: true, component: 'login'});
      }, 500);
    }

    checkUniqueEmail() {
        if (!this.email.hasError('email')) {
            this.authService.checkEmailUniqueness(this.email.value)
                .subscribe((data: any) => {
                    console.log('result from unique check', data.obj);
                    if (data.obj) {
                      this.email.setErrors({uniqueEmail: true});
                    } else {
                      this.email.setErrors(null);
                    }
                });
        }
    }


    checkUniqueUsername() {
        if ((this.username.value.length >= 5 && this.username.value.length <= 15) || null ) {
            this.authService.checkUsername(this.username.value)
                .pipe(debounceTime(500))
                .subscribe((result: any) => {
                   console.log('result', result);
                    if (result.obj) {
                        this.username.setErrors({uniqueUser: true});
                    } else {
                      this.username.setErrors(null);
                    }
                });
        }
    }

    onSignupSubmit() {
      this.submittedForm = true;
      // We can only submit our sign up data when the form is valid, the passwords match, the email is unique and so is the username
      if (this.mySignupForm.valid) {
        const user =  new User(
          this.mySignupForm.value.email,
          this.mySignupForm.value.username,
          this.mySignupForm.value.password1,
          this.mySignupForm.value.firstName,
          this.mySignupForm.value.lastName,
          this.mySignupForm.value.birthDate,
          this.mySignupForm.value.country,
          this.mySignupForm.value.house
        );

        console.log('user', user);

        this.authService.signup(user)
          .subscribe(
            data => {
              this.serverError = false;
              this.navigationService.checkboxUpdates.next({checked: true, component: 'login'});
            }
          , (err) => {
              this.serverError = true;
            });
      } else {
        this.submittedForm = false;
      }
    }

  resolved(captchaResponse: string) {
    console.log(`Resolved captcha with response ${captchaResponse}:`);


this.authService.validateCaptcha(captchaResponse)
  .subscribe( (resp: any) => {
    console.log('response form validate captcha', resp);
    if (resp.success) {
      console.log('great success!');
      this.mySignupForm.controls['captcha'].setErrors({'invalid-captcha': null});
      // the form needs to notice that the this error is now gone
      this.mySignupForm.controls['captcha'].updateValueAndValidity();
    } else {
      this.mySignupForm.controls['captcha'].setErrors({'invalid-captcha': true});
    }
  })
  }
}
