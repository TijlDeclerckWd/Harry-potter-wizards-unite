import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {AuthenticationService} from '../../services/auth.service';
import {ForumService} from '../../services/forum.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'forum-reply',
  templateUrl: './forum-reply.component.html',
  styleUrls: ['./forum-reply.component.css']
})
export class ForumReplyComponent implements OnInit {

  @Input('reply') reply;
  @Output('deleteReply') deleteReplies = new EventEmitter();
  @Output('editReply') sendEdittedReply = new EventEmitter();
  @Output('quoteReply') sendQuoteReply = new EventEmitter();

  modalReference;
editContent = '';

  constructor(private authService: AuthenticationService, private forumService: ForumService, private modalService: NgbModal) { }

  ngOnInit() {
  }

  deleteReply(replyId) {
    //    Delete the reply from the replies and filteredReplies array
    console.log(this.reply.post);
    const postId = this.reply.post;

    this.forumService.deleteReply(replyId, postId)
      .subscribe((data) => {
        this.deleteReplies.emit({postId, replyId});
      });
  }

  editReply() {
    if (this.editContent) {
      this.forumService.editReply(this.reply._id, this.editContent)
        .subscribe( data => {
          this.sendEdittedReply.emit({replyId: this.reply._id, newInput: this.editContent});
          this.modalReference.close();
          this.editContent = '';
        });
    }
  }

  isItMyReply(replyUserId) {
    if (this.authService.isLoggedIn()) {
      return replyUserId === this.authService.currentUser().user._id;
    } else {
      return false;
    }
    }

  openEditModal(modal) {
      this.editContent = this.reply.content;
      this.modalReference = this.modalService.open(modal);
  }

  quoteReply() {
    this.sendQuoteReply.emit({replyId: this.reply._id});
  }

}
