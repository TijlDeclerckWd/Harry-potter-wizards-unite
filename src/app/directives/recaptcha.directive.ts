import {AfterViewInit, Directive, ElementRef, Injector, Input, NgZone, OnInit} from '@angular/core';
import {ReCaptchaConfig} from '../interfaces/reCaptchaConfig';
import {ControlValueAccessor, FormControl, NgControl, Validators} from '@angular/forms';
import {ReCaptchaAsyncValidator} from '../validators/recaptcha-async.validator';


declare const grecaptcha: any;

declare global {
  interface Window {
    grecaptcha: any;
    reCaptchaLoad: () => void
  }
}

@Directive({
  selector: '[nbRecaptcha]',
  providers: [ReCaptchaAsyncValidator]
})
export class RecaptchaDirective implements OnInit, ControlValueAccessor, AfterViewInit {
  @Input() key: string;
  @Input() config: ReCaptchaConfig = {};
  @Input() lang: string;

  private control: FormControl;

  private onChange: ( value: string ) => void;
  private onTouched: ( value: string ) => void;
  private widgetId: number;

  constructor(
    private element: ElementRef,
    private ngZone: NgZone,
    private injector: Injector,
    private reCaptchaAsyncValidator: ReCaptchaAsyncValidator){}

  ngOnInit() {
    this.registerReCaptchaCallback();
    this.addScript();
  }

  ngAfterViewInit() {
    this.control = this.injector.get(NgControl).control;
    this.setValidator();
  }

  addScript() {
    let script = document.createElement('script');
    const lang = this.lang ? '&hl=' + this.lang : '';
    script.src = `https://www.google.com/recaptcha/api.js?onload=reCaptchaLoad&render=explicit${lang}`;
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  }


  //  We need to notify the formControl that it’s valid if we get the token
  // from the onSuccess function or that it’s invalid if the onExpired function is called.

  onExpired() {
    this.ngZone.run(() => {
      this.onChange(null);
      this.onTouched(null);
    });
  }

  onSuccess( token: string ) {
    this.ngZone.run(() => {
      this.verifyToken(token);
      this.onChange(token);
      this.onTouched(token);
    });
  }

  //  these are the three methods that controlValueAccessor requires

  writeValue( obj: any ): void {
  }

  registerOnChange( fn: any ): void {
    this.onChange = fn;
  }

  registerOnTouched( fn: any ): void {
    this.onTouched = fn;
  }

  private setValidator() {
    this.control.setValidators(Validators.required);
    this.control.updateValueAndValidity();
  }

  registerReCaptchaCallback() {
    window.reCaptchaLoad = () => {
      const config = {
        ...this.config,
        'sitekey': this.key,
        'callback': this.onSuccess.bind(this),
        'expired-callback': this.onExpired.bind(this)
      };
      this.widgetId = this.render(this.element.nativeElement, config);
    };
  }

  private render( element: HTMLElement, config ): number {
    return grecaptcha.render(element, config);
  }

  verifyToken( token : string ) {
    this.control.setAsyncValidators(this.reCaptchaAsyncValidator.validateToken(token))
    this.control.updateValueAndValidity();
  }
}
