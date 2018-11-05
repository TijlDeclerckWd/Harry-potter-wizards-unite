import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileMainComponent } from './profile-main.component';
import {UserService} from '../../services/user.service';
import {MockUserService} from '../../services/user.service.mock';
import {AuthenticationService} from '../../services/auth.service';
import {MockAuthenticationService} from '../../services/auth.service.mock';
import {RouterTestingModule} from '@angular/router/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';

describe('ProfileMainComponent', () => {
  let component: ProfileMainComponent;
  let fixture: ComponentFixture<ProfileMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileMainComponent ],
      providers: [
        {
          provide: UserService,
          useClass: MockUserService
        },
        {
          provide: AuthenticationService,
          useClass: MockAuthenticationService
        }
      ],
      imports: [RouterTestingModule],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
