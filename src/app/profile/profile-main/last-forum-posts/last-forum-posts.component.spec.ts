import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LastForumPostsComponent } from './last-forum-posts.component';

describe('LastForumPostsComponent', () => {
  let component: LastForumPostsComponent;
  let fixture: ComponentFixture<LastForumPostsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LastForumPostsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LastForumPostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
