import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {ForumService} from '../../../services/forum.service';

@Component({
  selector: 'last-forum-posts',
  templateUrl: './last-forum-posts.component.html',
  styleUrls: ['./last-forum-posts.component.css']
})
export class LastForumPostsComponent implements OnChanges {

  @Input('user') user;
  last3Posts = [];

  constructor(private forumService: ForumService) { }

  ngOnChanges() {
    if (this.user) {
      this.last3Posts = this.user.forumPosts.slice(-3);
    }
  }

  getDate(type, date) {
    return this.forumService.getDate(type, date);
  }

}
