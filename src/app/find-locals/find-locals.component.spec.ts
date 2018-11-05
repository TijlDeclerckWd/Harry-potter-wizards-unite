import {AgePipe, FindLocalsComponent} from './find-locals.component';
import {AuthenticationService} from '../services/auth.service';
import {EmptyObservable} from 'rxjs-compat/observable/EmptyObservable';
import {from} from 'rxjs';
import {FindLocalsService} from '../services/find-locals.service';
import {MatSnackBar} from '@angular/material';
import {NotificationsComponent} from '../notifications/notifications.component';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {NotificationService} from '../services/notification.service';
import {MockFindLocalsService} from '../services/find-locals.service.mock';
import {MockAuthenticationService} from '../services/auth.service.mock';
import {AgmCoreModule} from '@agm/core';
import {RouterTestingModule} from '@angular/router/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {By} from '@angular/platform-browser';
import {HttpClient, HttpClientModule} from '@angular/common/http';

xdescribe('find-locals', () => {
  let component: FindLocalsComponent;
  let fixture: ComponentFixture<FindLocalsComponent>;
  let httpClientSpy;

  beforeEach(async(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);

    TestBed.configureTestingModule({
      declarations: [ FindLocalsComponent, AgePipe ],
      providers: [
        {
          provide: FindLocalsService,
          useClass: MockFindLocalsService
        },
        {
          provide: AuthenticationService,
          useClass: MockAuthenticationService
        },
        {
          provide: HttpClient,
          useClass: httpClientSpy
        }
      ],
      imports: [
        AgmCoreModule.forRoot({
        apiKey: 'AIzaSyDFDGOMDXkdSHOkVaVbGjIwtMvqaTwVXCA'
      }),
      RouterTestingModule],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FindLocalsComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });


  it('should display the name property', function () {
      component.name = 'jos';
      fixture.detectChanges();


    let de = fixture.debugElement.query(By.css('.name'));
    let el: HTMLElement = de.nativeElement;

    expect(el.innerText).toContain('jos');

  });

  it('should change the name property after a click', function () {
    let button = fixture.debugElement.query(By.css('.btn-joske'));
    button.triggerEventHandler('click', null);

    expect(component.name).toContain('joske');
  });


  it('should change property distancesDisplayed to false',  () => {
    component.distancesDisplayed = true;

    component.changeDistance(2);

    expect(component.distancesDisplayed).toBe(false);
  });

  it('should call filterMarkers method after changing the distance',  () => {
    spyOn(component, 'filterMarkers');

    component.changeDistance(2);

    expect(component.filterMarkers).toHaveBeenCalled();
  });

  it('should change distance display status',  () => {
    component.distancesDisplayed = false;

    component.changeDistanceDisplayStatus();

    expect(component.distancesDisplayed).toBe(true);
  });

  it('should change the focussed user',  () => {
    const user = {name: 'George'};

    component.onMarkerClick(user);

    expect(component.focussedUser).toBe(user);
  });

  it('should reset markerClicked and focusedUser',  () => {
    component.focussedUser = {name: 'George'};
    component.markerClicked = true;

    component.resetSubsections();

    expect(component.markerClicked).toBeFalsy();
    expect(component.focussedUser).toBeNull();
  });



  it('should set up lat and long at start',  () => {
    const msg = [{msg: 'hey'}];
    const locations = {myLocation: [{latitude: 3, longitude: 2}], locationCollection: msg};
    const service = TestBed.get(FindLocalsService);
    spyOn(service, 'getLocations').and.callFake(() => {
      return from([locations]);
    });

     // this will initialize ngOninit
    fixture.detectChanges();

    expect(component.lat).toBe(3);
    expect(component.lng).toBe(2);
    expect(component.markers).toBe(msg);
  });

  it('should reset subsections after sending message', function () {
    component.focussedUser = {_id: 12345};
    const service = TestBed.get(AuthenticationService);
    let spy = spyOn(component, 'resetSubsections');

    component.sendMessage('hallo');

    expect(spy).toHaveBeenCalled();
  });
});
