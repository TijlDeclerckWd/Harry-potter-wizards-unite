import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatboxWindowComponent } from './chatbox-window.component';

describe('ChatboxWindowComponent', () => {
  let component: ChatboxWindowComponent;
  let fixture: ComponentFixture<ChatboxWindowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatboxWindowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatboxWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
