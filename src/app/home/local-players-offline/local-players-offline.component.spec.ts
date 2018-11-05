import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalPlayersOfflineComponent } from './local-players-offline.component';
import {NavigationService} from '../../services/navigation.service';

describe('LocalPlayersOfflineComponent', () => {
  let component: LocalPlayersOfflineComponent;
  let fixture: ComponentFixture<LocalPlayersOfflineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocalPlayersOfflineComponent ],
      providers: [NavigationService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalPlayersOfflineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
