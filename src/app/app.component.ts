import {Component, OnInit} from "@angular/core";
import {AuthenticationService} from "./services/auth.service";
import {FindLocalsService} from "./services/find-locals.service";


@Component({
    selector:'app-root',
    templateUrl:'./app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

    constructor(private authService: AuthenticationService){}

    ngOnInit() {

    }

    isLoggedIn() {
      return this.authService.isLoggedIn();
    }
}
