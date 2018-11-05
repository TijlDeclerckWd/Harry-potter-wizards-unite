import {Component, OnInit} from '@angular/core';


@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit{

  selectedHero;
  heroes = [{id: 1, name: 'superman'}, {id: 2, name: 'Iron man'}];

  ngOnInit() {}

  onSelect(hero) {
    this.selectedHero = hero;
  }

}
