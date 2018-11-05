import {async, ComponentFixture, fakeAsync, flush, TestBed, tick} from '@angular/core/testing';

import { TestComponent } from './test.component';
import {By} from '@angular/platform-browser';
import {UserService} from '../services/user.service';
import {of} from 'rxjs';
import {MockUserService} from '../services/user.service.mock';

describe('TestComponent', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let userService;

  let el;

  beforeEach(async(() => {

    // const userServiceSpy = jasmine.createSpyObj('UserService', ['getUserData']);

    TestBed.configureTestingModule({
      declarations: [ TestComponent ],
      providers: [{provide: UserService, useClass: MockUserService}]
    })
    .compileComponents();

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    userService = TestBed.get(UserService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add selected class when clicked', fakeAsync(() => {
fixture.detectChanges();

let spy = spyOn(component, 'onSelect');
el = fixture.debugElement.query(By.css('li')).nativeElement.click();

fixture.detectChanges();

tick();

fixture.detectChanges();


expect(component.onSelect).toHaveBeenCalled();
expect(component.selectedHero).toBeTruthy();

  }));
});
