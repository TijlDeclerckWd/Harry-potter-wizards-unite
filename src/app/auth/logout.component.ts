import {Component, OnInit} from "@angular/core";
import {AuthenticationService} from "../services/auth.service";
import {Router} from "@angular/router";
import {NotificationService} from '../services/notification.service';

@Component({
    selector:'app-logout',
    templateUrl:'./logout.component.html'
})

export class LogoutComponent implements OnInit {

    constructor(
      private auth: AuthenticationService,
      private router: Router,
      private notificationService: NotificationService){}

    ngOnInit(){
        this.auth.logout();
        this.notificationService.notify('Succesfully logged out');
        this.router.navigateByUrl('login');
    }

}
