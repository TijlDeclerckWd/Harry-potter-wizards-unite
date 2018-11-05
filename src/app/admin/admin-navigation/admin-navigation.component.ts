import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'admin-navigation',
  templateUrl: './admin-navigation.component.html',
  styleUrls: ['./admin-navigation.component.css']
})
export class AdminNavigationComponent implements OnInit {

  @Output('changeDisplayedComponent') changeComponent = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  changeDisplayedComponent(component) {
    this.changeComponent.emit(component);
  }

}
