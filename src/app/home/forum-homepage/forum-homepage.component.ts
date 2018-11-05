import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../../services/auth.service';
import {NavigationService} from '../../services/navigation.service';
import {Router} from '@angular/router';

@Component({
  selector: 'forum-homepage',
  templateUrl: './forum-homepage.component.html',
  styleUrls: ['./forum-homepage.component.css']
})
export class ForumHomepageComponent implements OnInit {

  user;

  constructor(private authService: AuthenticationService, private navigationService: NavigationService, private router: Router) { }

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.user = this.authService.currentUser().user;
    }
  }

  getUser(){
    return this.authService.currentUser().user
  }

  isLoggedIn() {
    return this.authService.isLoggedIn();
  }

  navigateTo(section) {
    if ( !this.authService.isLoggedIn()) {
      this.navigationService.checkboxUpdates.next({checked: true, component: 'login'});
    } else if (section === 'house') {
      this.router.navigate(
        [`forum/discussions/${this.user.house}`]);
    } else {
      this.router.navigate([`forum/discussions/country/${this.user.country}`]);
    }
  }

  openLogin() {
    this.navigationService.checkboxUpdates.next({checked: true, component: 'login'});
  }
}
