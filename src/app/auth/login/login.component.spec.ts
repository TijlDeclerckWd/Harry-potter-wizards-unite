import {LoginComponent} from './login.component';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {NavigationService} from '../../services/navigation.service';
import {LocalPlayersOfflineComponent} from '../../home/local-players-offline/local-players-offline.component';
import {AuthenticationService} from '../../services/auth.service';
import {MockAuthenticationService} from '../../services/auth.service.mock';
import {FindLocalsService} from '../../services/find-locals.service';
import {MockFindLocalsService} from '../../services/find-locals.service.mock';
import {NavigationServiceMock} from '../../services/navigation.service.mock';
import {from, Observable, of} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';


class RouterStub {
  navigateByUrl(){
return of([]);
  }
}

class ActivatedRouteStub {
queryParams: Observable<any> =  of([]);
}

describe('loginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginComponent ],
      providers: [
        {
          provide: AuthenticationService,
          useClass: MockAuthenticationService
        },
        {
          provide: FindLocalsService,
          useClass: MockFindLocalsService
        },
        {
          provide: NavigationService,
          useClass: NavigationServiceMock
        },
        {
          provide: Router,
          useClass: RouterStub
        },
        {
          provide: ActivatedRoute,
          useClass: ActivatedRouteStub
        }
      ],
      imports: [
        RouterTestingModule,
        ReactiveFormsModule
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


});
