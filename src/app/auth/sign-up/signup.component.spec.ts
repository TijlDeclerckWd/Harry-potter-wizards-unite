
import {AuthenticationService} from '../../services/auth.service';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import {RouterTestingModule} from '@angular/router/testing';

import {SignUpComponent} from './sign-up.component';
import {NavigationService} from '../../services/navigation.service';
import {of} from 'rxjs';

describe('signup', () => {
  let component: SignUpComponent;
  let fixture: ComponentFixture<SignUpComponent>;
  let authService;

  beforeEach(async(() => {
    const authServiceSpy = jasmine.createSpyObj('AuthenticationService', ['checkUsername', 'checkEmailUniqueness', 'signup']);

    TestBed.configureTestingModule({
      declarations: [SignUpComponent],
      providers: [
        {
          provide: AuthenticationService,
          useValue: authServiceSpy
        },
        NavigationService
      ],
      imports: [
        RouterTestingModule],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignUpComponent);
    authService = fixture.debugElement.injector.get(AuthenticationService);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  xit('should warn user if username already exists', fakeAsync(() => {
      const fakeUsername = "testUsername"
      authService.checkUsername.and.returnValue(of({obj: true}));

      fixture.detectChanges();


      component.mySignupForm.value.username = fakeUsername;

      fixture.detectChanges();
      component.checkUniqueUsername();
tick(500);

      expect(authService.checkUsername).toHaveBeenCalled();
      expect(component.uniqueUsernameMessage).toContain('already exists');
    })
  )

});
