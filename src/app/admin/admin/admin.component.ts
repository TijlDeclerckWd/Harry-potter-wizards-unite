import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  displayedComponent: string;

  constructor() { }

  ngOnInit() {
  }

  changeDisplayedComponent(component) {
    this.displayedComponent = component;
    console.log(this.displayedComponent);
  }

}
