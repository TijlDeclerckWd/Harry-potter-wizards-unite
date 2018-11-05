import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {UserService} from '../../services/user.service';
import {AuthenticationService} from '../../services/auth.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-profile-main',
  templateUrl: './profile-main.component.html',
  styleUrls: ['./profile-main.component.css']
})
export class ProfileMainComponent implements OnInit {

  user;
  fileToUpload: File = null;
  modalReference;


  constructor(private route: ActivatedRoute, private userService: UserService, private authService: AuthenticationService, private modalService:NgbModal) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.userService.getUserData(params.id)
        .subscribe((data: any) => {
          console.log('received user');
          this.user = data.obj;
        });
    });
  }

  closeModal(modal) {
    this.modalReference.close();
  }

  determineBGC(house) {
    if (house === 'Gryffindor') {
      return '#740001';
    } else if (house === 'Ravenclaw') {
      return '#0e1a40';
    } else if (house === 'Hufflepuff') {
      return '#ecb939';
    } else {
      return '#1a472a';
    }
  }

  isItMyProfile() {
    if (this.user) {
      return this.user._id === this.authService.currentUser().user._id;
    }
  }

  openModal(modal) {
    this.modalReference = this.modalService.open(modal);
  }

  uploadProfilePic(files: FileList) {
    this.fileToUpload = files.item(0);
    this.uploadFileToActivity();
  }

  uploadFileToActivity() {
    console.log('current User', this.authService.currentUser());
    if (this.authService.currentUser().user._id) {
      this.userService.postFile(this.fileToUpload, this.authService.currentUser().user._id)
        .subscribe( data => {
          console.log('data returned', data);
        })
    }
  }
}
