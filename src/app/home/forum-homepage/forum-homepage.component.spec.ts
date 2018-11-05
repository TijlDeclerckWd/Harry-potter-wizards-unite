import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForumHomepageComponent } from './forum-homepage.component';

describe('ForumHomepageComponent', () => {
  let component: ForumHomepageComponent;
  let fixture: ComponentFixture<ForumHomepageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForumHomepageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForumHomepageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
