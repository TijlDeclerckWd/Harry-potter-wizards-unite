import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ForumService} from '../../services/forum.service';
import * as moment from 'moment';

@Component({
  selector: 'app-forum-list',
  templateUrl: './forum-list.component.html',
  styleUrls: ['./forum-list.component.css']
})
export class ForumListComponent implements OnInit {

  title: string;
  posts = [];
  displayOptions = 'Top';
  category: string;
  postsLoaded = false;

  constructor(private route: ActivatedRoute, private forumService: ForumService) {

  }

  ngOnInit() {
    this.route.params.subscribe( params => {
      if (params.category) {
        this.postsLoaded = false;
        this.category = params.country || params.category;
        const country = params.country || null;
        this.getCategoryPosts(this.category, country);
      } else {
        this.getAllPosts();
      }

      this.forumService.newPost.subscribe( (newPost: any) => {
        console.log('newpost', newPost);
if (newPost.category !== 'General' && params) {
  if (newPost.category === params.category || newPost.category === params.country) {
    this.posts.unshift(newPost);
  }
} else if (!params) {
  this.posts.unshift(newPost);
}
      });
    });
  }

  determineBgcLabel(category) {
    return this.forumService.determineBackground(category);
}

  getAllPosts() {
    this.forumService.getAllPosts()
      .subscribe( (posts: any) => {
        console.log('received the posts', posts);
        this.posts = posts.obj;
        this.postsLoaded = true;
      });
  };

  getCategoryPosts(category, country?) {
    console.log('getting category posts')
    const data = {
      category: category.charAt(0).toUpperCase() + category.slice(1),
      country };
    this.forumService.getPosts(data)
      .subscribe(posts => {
        this.posts = posts.obj;
        this.postsLoaded = true;
        console.log('posts', this.posts);
      });
  }

  getLastReply(replies) {
    const lastReply = replies.slice(-1)[0];
    const username = lastReply.user.username;
    const timeAgo = moment(new Date(lastReply.date)).fromNow();

    return `${username} replied ${timeAgo}`;
  }

  getPostTime(post) {
    const username = post.user.username;
    const timeAgo = moment(new Date(post.date)).fromNow();

    return `${username} started this post ${timeAgo}`;
  }

  refreshList() {
    if (this.category) {
      this.forumService.getPosts({category: this.category.charAt(0).toUpperCase() + this.category.slice(1)})
        .subscribe( posts => {
          console.log('refreshed page', posts);
          this.posts = this.sortListItems(this.displayOptions, posts.obj);
        });
    } else {
      this.getAllPosts();
    }
  }

  sortListItems(order, newPosts? ) {

    if (newPosts) {
      return this.forumService.sortListItems(order, newPosts);
    } else {
      this.posts = this.forumService.sortListItems(order, this.posts);
    }

    this.displayOptions = order;
  }

}
