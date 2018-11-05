import {Component, OnInit} from "@angular/core";
import {AuthenticationService} from "../services/auth.service";


import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import {NavigationService} from '../services/navigation.service';



@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
  animations: [
    trigger('heroState', [
      state('active', style({
        backgroundColor: '#111',
        transform: 'scale(1)'
      })),
      state('inactive',   style({
        backgroundColor: '#ccc',
        transform: 'scale(1.5)'
      })),
      transition('inactive => active', animate('1000ms ease-in')),
      transition('active => inactive', animate('1000ms ease-out'))
    ])
  ]

})
export class HomeComponent implements OnInit{

  state = 'active';

    constructor(private authService: AuthenticationService, private navigationService: NavigationService) {
    }

    ngOnInit() {
    }

    isLoggedIn() {
        return this.authService.isLoggedIn();
    }

    scroll(el) {
      console.log('element', el);
      el.scrollIntoView({behavior:'smooth'});
    }

    openLogin() {
      this.navigationService.checkboxUpdates.next({checked: true, component: 'login'});
    }


}
