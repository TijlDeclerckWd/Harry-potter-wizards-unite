import { Component, OnInit } from '@angular/core';
import {NotificationService} from '../../services/notification.service';
import {ForumService} from '../../services/forum.service';
import {MatDialogRef} from '@angular/material';
import {AuthenticationService} from '../../services/auth.service';
import {ForumPost} from '../../models/post.model';

@Component({
  selector: 'app-create-post-dialog',
  templateUrl: './create-post-dialog.component.html',
  styleUrls: ['./create-post-dialog.component.css']
})
export class CreatePostDialogComponent implements OnInit {

  country;
  house;

  newPostData = {
    title: '',
    category: 'Quests',
    htmlContent: null
  };

  constructor(
    private notificationService: NotificationService,
    private forumService: ForumService,
    private dialogRef: MatDialogRef<CreatePostDialogComponent>,
    private authService: AuthenticationService) { }

    ngOnInit() {
    const user = this.authService.currentUser().user;

    this.country = user.country;
    this.house = user.house;
    }

  createPost() {
    if ( this.newPostData.title && this.newPostData.htmlContent) {
      const newPost = new ForumPost(
        this.newPostData.title,
        this.newPostData.htmlContent.toString(),
        this.newPostData.category,
        localStorage.getItem('token')
      );

      console.log('new post', newPost);

      this.forumService.addPost(newPost)
        .subscribe((post: any) => {
          this.notificationService.notify('Succesfully created forum post');

          this.newPostData.title = '';
          this.newPostData.category = '';
          this.newPostData.htmlContent = null;
          this.close();
        });
    } else {
      console.log('display error message')
    }

  }

  close() {
    this.dialogRef.close();
  }



}
