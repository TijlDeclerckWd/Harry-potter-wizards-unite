import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForumHeaderComponent } from './forum-header.component';

describe('ForumHeaderComponent', () => {
  let component: ForumHeaderComponent;
  let fixture: ComponentFixture<ForumHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForumHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForumHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
