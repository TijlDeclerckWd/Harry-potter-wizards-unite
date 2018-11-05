import {Component, OnInit, ViewChild} from '@angular/core';
import {ForumService} from '../../services/forum.service';
import {NotificationService} from '../../services/notification.service';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {CreatePostDialogComponent} from '../create-post-dialog/create-post-dialog.component';

@Component({
  selector: 'app-forum-main',
  templateUrl: './forum-main.component.html',
  styleUrls: ['./forum-main.component.css']
})

export class ForumMainComponent implements OnInit {

  newPost;
  loaded = false;

  constructor(
    private dialog: MatDialog,
    private forumService: ForumService,
    private notificationService: NotificationService) { }

  ngOnInit() {
    this.forumService.loadedMain.subscribe( (loaded: boolean) => {
      console.log(loaded);
      this.loaded = loaded;
    })
  }

  openDialog() {
    const dialogConfig = new MatDialogConfig();


    dialogConfig.autoFocus = true;

    const dialogRef = this.dialog.open(CreatePostDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe( data => {
      if ( data  ) {
        this.newPost = data;
        console.log(this.newPost);
      }
    })
  }

}
