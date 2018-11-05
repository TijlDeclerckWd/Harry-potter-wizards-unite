import { Component, OnInit } from '@angular/core';
import {NavigationService} from '../../services/navigation.service';

@Component({
  selector: 'app-local-players-offline',
  templateUrl: './local-players-offline.component.html',
  styleUrls: ['./local-players-offline.component.css']
})
export class LocalPlayersOfflineComponent implements OnInit {

  constructor(private navigationService: NavigationService) { }

  ngOnInit() {
  }

  open(component) {
    this.navigationService.checkboxUpdates.next({checked: true, component: component});
  }

}
