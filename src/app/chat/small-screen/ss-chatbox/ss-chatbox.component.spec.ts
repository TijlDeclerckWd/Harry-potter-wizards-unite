import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SsChatboxComponent } from './ss-chatbox.component';

describe('SsChatboxComponent', () => {
  let component: SsChatboxComponent;
  let fixture: ComponentFixture<SsChatboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SsChatboxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SsChatboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
