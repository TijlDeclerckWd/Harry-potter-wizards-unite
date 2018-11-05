import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminErrorsComponent } from './admin-errors.component';

describe('AdminErrorsComponent', () => {
  let component: AdminErrorsComponent;
  let fixture: ComponentFixture<AdminErrorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminErrorsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminErrorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
