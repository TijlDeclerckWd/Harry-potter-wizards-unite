import {AfterContentChecked, AfterContentInit, Component, HostListener, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ForumService} from '../../services/forum.service';
import {AuthenticationService} from '../../services/auth.service';
import {NavigationService} from '../../services/navigation.service';
import {takeUntil} from 'rxjs/internal/operators';

@Component({
  selector: 'app-forum-post',
  templateUrl: './forum-post.component.html',
  styleUrls: ['./forum-post.component.css']
})
export class ForumPostComponent implements OnInit, AfterContentInit {

  post;
  @ViewChild('postContentEl') postContentEl;
  @ViewChild('replyInputEl') replyInputEl;
  @ViewChild('stickyContainer') stickyContainer;
  replyInput = '';
  quotedReply = {selected: false, obj: {username: null, content: null}};
  page = 1;
  start = this.page * 20 - 20;
  end = this.page * 20
  stickyOptions = false;
  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    const top = window.pageYOffset || document.body.scrollTop;
    console.log('scrolltop', top);
    if (top > 160) {
      this.stickyOptions = true;
    } else {
      this.stickyOptions = false;
    }
    }


  constructor(
    private route: ActivatedRoute,
    private forumService: ForumService,
    private authService: AuthenticationService,
    private navigationService: NavigationService,
    private router: Router) { }

  ngOnInit() {
    window.scrollTo(0, 0);
  }

  ngAfterContentInit() {
    this.route.params.subscribe( params => {
      if (params.postId) {
        this.getPost(params.postId);
      }
    })
  }

  calculateNumberOfPages() {
    return Math.ceil(this.post.replies.length / 20);
  }

  deletePost() {
    const category = this.post.category;
    if (confirm("Are you sure you want to delete this post?")) {
      console.log('deleting the post');
      this.forumService.deletePost(this.post._id)
        .subscribe( data => {
          this.router.navigate([`/forum/discussions/${category}`]);
        });
    } else {
      console.log('do nothing');
    }
  }

  deleteReply(data) {
    console.log('replyId', data.replyId);
    const index = this.post.replies.findIndex( reply => reply._id === data.replyId);
    this.post.replies.splice(index, 1);
}



editReply(data) {
    console.log(data.replyId);
    const index = this.post.replies.findIndex( reply => reply._id === data.replyId);
    this.post.replies[index].content = data.newInput;
}

  getPost(postId) {
    this.forumService.getPost(postId)
      .subscribe((result: any) => {
        this.post = result.obj;
        console.log('post received', this.post);
        this.insertHTML();

        // set the paginator
        this.page = Math.ceil(this.post.replies.length / 20);
        this.page = this.page === 0 ? 1 : this.page;
        this.start = this.page * 20 - 20;
        this.end = this.page * 20;
      });
  }

  insertHTML() {
    setTimeout(() => {
      if (this.postContentEl) {
        this.postContentEl.nativeElement.insertAdjacentHTML('beforeend', this.post.content);
      }
    }, 0);
  }

  isLoggedIn() {
    return this.authService.isLoggedIn();
  }

  isMyPost() {
    if (this.authService.isLoggedIn() && this.post) {
      return this.post.user._id === this.authService.currentUser().user._id;
  } else {
      return false;
    }
  }

  login() {
    this.navigationService.checkboxUpdates.next({checked: true, component: 'login'});
  }

  onPageChange() {
    this.start = this.page * 20 - 20;
    this.end = this.page * 20;
  }

  quoteReply(data) {
    // get the reply
    const index = this.post.replies.findIndex( reply => data.replyId === reply._id);
    const username = this.post.replies[index].user.username;
    const content = this.post.replies[index].content;
    this.quotedReply = {selected: true, obj: {username, content}};

    this.scrollToInput();
  }

  resetQuoteReply() {
    this.quotedReply = {selected: false, obj: {username: null, content: null}};
  }

  scrollToInput() {
    this.replyInputEl.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    this.replyInputEl.nativeElement.focus();
  }

  sendReply() {
    if (this.replyInput) {
      const values = {
        content: this.replyInput,
        quote: this.quotedReply,
        postId: this.post._id,
        token: localStorage.getItem('token') || null
      };
      this.replyInput = '';

      this.forumService.addReply(values)
        .subscribe((reply: any) => {
          console.log('reply', reply);
          this.post.replies.push(reply.obj);
          this.quotedReply = {selected: false, obj: {username: null, content: null}};
        });
    }
  }
}
