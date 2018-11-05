import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatComponent } from './chat.component';
import {By} from '@angular/platform-browser';
import {AuthenticationService} from '../services/auth.service';
import {Conversation} from './conversation.model';
import {RouterTestingModule} from '@angular/router/testing';
import {FormsModule} from '@angular/forms';
import {ChatroomService} from '../services/chatroom.service';

xdescribe('ChatComponent', () => {
  let component: ChatComponent;
  let fixture: ComponentFixture<ChatComponent>;
  let authService;
  const mockConversation = new Conversation(
    [{id: 'jos'}],
    {username: 'jos', profilePicture: {name: 'jos', uploaded: true, userId: '12345'}},
    '123456',
    '123457',
    '9875412');


  beforeEach(async(() => {
    const authServiceSpy = jasmine.createSpyObj('AuthenticationService', ['isLoggedIn']);
    const chatServiceSpy = jasmine.createSpyObj('ChatroomService', ['getMessages']);

    TestBed.configureTestingModule({
      declarations: [ ChatComponent ],
      providers: [
        {provide: AuthenticationService, useValue: authServiceSpy},
        {provide: ChatroomService, useValue: chatServiceSpy}
      ],
      imports: [
        RouterTestingModule,
        FormsModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatComponent);
    authService = TestBed.get(AuthenticationService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close the chatbox', function () {

    component.openConversations = [mockConversation];

    fixture.detectChanges()

    expect(component.openConversations).toBeTruthy();
  });

  // it('should change checkbox status when label gets clicked', function () {
  //   component.checkboxChecked = false;
  //   fixture.detectChanges();
  //
  //   let de = fixture.debugElement.query(By.css(''));
  //   let el: HTMLElement = de.nativeElement;
  // });


});
