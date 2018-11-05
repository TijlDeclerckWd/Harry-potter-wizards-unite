import { Component, OnInit } from '@angular/core';
import {MatSnackBar} from '@angular/material';
import {NotificationService} from '../services/notification.service';

@Component({
  selector: 'notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

  snackBarReference;

  constructor(public snackBar: MatSnackBar, private notificationService: NotificationService) { }

  ngOnInit() {
    this.notificationService.notification$
        .subscribe((message) => {
          console.log('received the notification', message);
          this.openSnackBar(message);
        });
  }

  openSnackBar(message: string, action?: string) {
    setTimeout(() => {
      this.snackBarReference = this.snackBar.open(message, action, {
        duration: 3000
      });
    }, 0);

  }

}
