import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateForumSectionComponent } from './create-forum-section.component';

describe('CreateForumSectionComponent', () => {
  let component: CreateForumSectionComponent;
  let fixture: ComponentFixture<CreateForumSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateForumSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateForumSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
