import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AuthenticationService} from '../../services/auth.service';
import {ForumService} from '../../services/forum.service';

@Component({
  selector: 'forum-navigation',
  templateUrl: './forum-navigation.component.html',
  styleUrls: ['./forum-navigation.component.css']
})
export class ForumNavigationComponent implements OnInit {

  @Output('openDialog') openDialog = new EventEmitter();

  house: string;
  country: string;
  currentUser;

  constructor(private authService: AuthenticationService, private forumService: ForumService) { }

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.currentUser = this.authService.currentUser().user;
      this.house = this.currentUser.house;
      this.country = this.currentUser.country;
    } else {
console.log('get the location via geolocation')
    }
  }

  determineBgc(category) {
    return this.forumService.determineBackground(category);
  }

  open() {
    this.openDialog.emit();
  }

  isLoggedIn() {
    return this.authService.isLoggedIn();
  }

}
