import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LastForumRepliesComponent } from './last-forum-replies.component';

describe('LastForumRepliesComponent', () => {
  let component: LastForumRepliesComponent;
  let fixture: ComponentFixture<LastForumRepliesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LastForumRepliesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LastForumRepliesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
