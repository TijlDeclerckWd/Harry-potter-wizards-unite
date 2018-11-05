import {Component, OnInit} from "@angular/core";
import {AuthenticationService} from '../../services/auth.service';

@Component({
    selector: 'navigation',
    styleUrls: ['navigation.component.css'],
    templateUrl: 'navigation.component.html'
})

export class NavigationComponent implements OnInit {

    checkboxChecked: Boolean = false;

    constructor(private authService: AuthenticationService) {}

    ngOnInit() {}

    changeCheckboxStatus() {
        this.checkboxChecked = !this.checkboxChecked;
    }

    isAdmin() {
      return this.authService.isAdmin();
    }
}
