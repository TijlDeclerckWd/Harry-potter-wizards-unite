import {Component, OnInit} from "@angular/core";
import {NavigationService} from "../../services/navigation.service";
import {Router} from "@angular/router";
import {AuthenticationService} from "../../services/auth.service";
import {NotificationService} from '../../services/notification.service';

@Component({
    selector: 'user-navigation',
    styleUrls: ['user-navigation.component.css'],
    templateUrl: 'user-navigation.component.html'
})

export class UserNavigationComponent implements OnInit {

    checkboxChecked = false;
    subMenuOpened = false;
    displayedComponent: string;
    return = false;

    constructor(
        private navigationService: NavigationService,
        private route: Router,
        private authService: AuthenticationService,
        private notificationService: NotificationService){
    }

    ngOnInit() {
        // register to outside triggering of the user-navigation
        // first key is boolean, if this is true then we specify the component we want to show
        this.navigationService.checkboxUpdates
            .subscribe( (status: { checked: boolean, component?: string}) => {
                if (status.checked === true) {
                    this.checkboxChecked = true;
                    this.subMenuOpened = true;
                    this.displayedComponent = status.component;
                } else {
                    this.checkboxChecked = false;
                }
            });
    }

    changeCheckboxStatus() {
        this.checkboxChecked = !this.checkboxChecked;
    }

    changeDisplayedComponent(newComponent){
        this.displayedComponent = newComponent;
        this.subMenuOpened = true;
    }

    closeSubmenu() {
      this.subMenuOpened = false;
    }

    getUserId(){
      return this.authService.currentUser().user._id;
    }

    isLoggedIn() {
      return this.authService.isLoggedIn()
    }

    logout(){
        this.authService.logout();
        this.notificationService.notify('You have succesfully logged out')
        this.route.navigateByUrl('/');
        this.subMenuOpened = false;
        this.checkboxChecked = false;
    }


}
