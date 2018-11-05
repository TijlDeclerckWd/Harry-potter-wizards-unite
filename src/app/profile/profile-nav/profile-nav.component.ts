import {Component, OnInit} from "@angular/core";
import {transition, trigger, useAnimation} from "@angular/animations";
import {bounceOutLeftAnimation, fadeInAnimation, fadeInBottomAnimation} from "../../animations";
import {UserService} from "../../services/user.service";
import {AuthenticationService} from "../../services/auth.service";

@Component({
    selector: 'profile-nav',
    styleUrls: ['profile-nav.component.css'],
    templateUrl: 'profile-nav.component.html',
    animations: [
        trigger('slideInLogo', [
            transition(':enter', [
                useAnimation(fadeInBottomAnimation)
            ])
        ])
    ]
})

export class ProfileNavComponent implements OnInit {

    fileToUpload: File = null;
    user;


    constructor(private userService: UserService, private authService: AuthenticationService){}

    ngOnInit() {
        this.getUserData()
    }

    getUserData() {
        if (this.authService.isLoggedIn()) {
            const userId = this.authService.currentUser().user._id;

            this.userService.getUserData(userId)
                .subscribe( (data: any) => {
                    this.user = data.obj;
                });
        }
    }

    uploadProfilePic(files: FileList) {
        this.fileToUpload = files.item(0);
        this.uploadFileToActivity()
    }

    uploadFileToActivity() {
        console.log('current User', this.authService.currentUser());
        if (this.authService.currentUser().user._id){
            this.userService.postFile(this.fileToUpload, this.authService.currentUser().user._id)
                .subscribe( data => {
                    console.log('data returned', data)
                })
        }
    }
}
