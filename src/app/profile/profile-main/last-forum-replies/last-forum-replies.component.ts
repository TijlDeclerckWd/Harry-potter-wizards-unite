import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {ForumService} from '../../../services/forum.service';

@Component({
  selector: 'last-forum-replies',
  templateUrl: './last-forum-replies.component.html',
  styleUrls: ['./last-forum-replies.component.css']
})
export class LastForumRepliesComponent implements OnChanges {

  @Input('userId') userId;
  replies = [];
  loading = true;

  constructor(private forumService: ForumService) { }

  ngOnChanges() {
    if (this.userId) {
      this.forumService.getLatestReplies(this.userId)
        .subscribe((replies: any) => {
          this.replies = replies.obj;
          this.loading = false;
        });
    }
  }

  getDate(type, date) {
    return this.forumService.getDate(type, date);
  }

}
