import {Component, HostListener, OnInit, ViewChild} from '@angular/core';
import {FindLocalsService} from '../services/find-locals.service';
import {AuthenticationService} from '../services/auth.service';

import {Pipe, PipeTransform} from '@angular/core';
import * as moment from 'moment';

import {Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Location} from '../models/location';


@Pipe({
  name: 'age'
})
export class AgePipe implements PipeTransform {

  transform(value: Date): string {
    const today = moment();
    const birthdate = moment(value);
    const years = today.diff(birthdate, 'years');
    const html: string = years + ' years old ';

    return html;
  }
}

@Component({
  selector: 'find-locals',
  styleUrls: ['find-locals.component.css'],
  templateUrl: 'find-locals.component.html'
})

export class FindLocalsComponent implements OnInit {

  lat: number;
  lng: number;
  enteredProfilePic = false;
  modalReference;
  filteredMarkers: Location[];
  markers: Location[] = [];
  markerClicked = false;
  loadedLocations = false;
  screenWidth: any;
  distance = 5;
  distancesDisplayed = false;
  focussedUser: any;
  mapZoom = 14;
  personalIcon = {
    url: '/assets/images/user-icon.png',
    scaledSize: {
      height: 53,
      width: 50
    }
  }
  houseIcons = {
    Slytherin: {
      url: '/assets/images/Slytherin-icon-maps.png',
      scaledSize: {
        height: 53,
        width: 41
      }
    },
    Hufflepuff: {
      url: '/assets/images/hufflepuff-icon-maps.png',
      scaledSize: {
        height: 53,
        width: 41
      }
    },
    Ravenclaw: {
      url: '/assets/images/ravenclaw-icon-maps.png',
      scaledSize: {
        height: 53,
        width: 41
      }
    },
    Gryffindor: {
      url: '/assets/images/gryffindor-icon-maps.png',
      scaledSize: {
        height: 53,
        width: 38
      }
    }
  };

  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.screenWidth = window.innerWidth;
  }

  constructor(private findLocalsService: FindLocalsService,
              private authService: AuthenticationService,
              private router: Router,
              private modalService: NgbModal) {
    this.onResize();
    console.log(this.screenWidth);
  }

  ngOnInit() {
    const token = localStorage.getItem('token');

    this.findLocalsService.getLocations(token)
      .subscribe((data: {myLocation: Location, locationCollection: Location[]}) => {
        // these are the coordinates of the current user
        this.lat = data.myLocation[0].latitude;
        this.lng = data.myLocation[0].longitude;
        this.markers = data.locationCollection;
        this.filterMarkers();
        this.loadedLocations = true;
      });
  }

  changeDistance(km: number) {
    this.distance = km;
    this.distancesDisplayed = false;
    switch (km) {
      case 1:
        this.mapZoom = 15;
        break;
      case 5:
        this.mapZoom = 13;
        break;
      case 20:
        this.mapZoom = 12;
        break;
      case 50:
        this.mapZoom = 11;
        break;
      case 100:
        this.mapZoom = 10;
    }
    this.filterMarkers();
  }

  closeProfile() {
    this.focussedUser = null;
    this.markerClicked = false;
  }

  closeModal(modal){
    this.modalReference.close();
  }

  changeDistanceDisplayStatus() {

    this.distancesDisplayed = !this.distancesDisplayed;
  }

  customIcon(house) {

    if (house === 'Slytherin') {
      return this.houseIcons.Slytherin;
    } else if (house === 'Hufflepuff') {
      return this.houseIcons.Hufflepuff;
    } else if (house === 'Ravenclaw') {
      return this.houseIcons.Ravenclaw;
    } else {
      return this.houseIcons.Gryffindor;
    }
  }

  filterMarkers() {
    this.filteredMarkers = this.markers.filter((marker: Location) => {
      const distanceInKMS = this.getDistanceFromLatLonInKm(marker.latitude, marker.longitude, this.lat, this.lng);
      return distanceInKMS < this.distance;
    });
  }

  getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the earth in km
    const dLat = this.deg2rad(lat2 - lat1);  // deg2rad below
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2)
    ;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
  }

  deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

  onMarkerClick(user) {
    console.log('user check', user);
    this.resetSubsections();

    this.focussedUser = user;
    this.markerClicked = true;
  }

  openModal(modal) {
    this.modalReference = this.modalService.open(modal);
  }

  resetSubsections() {
    this.markerClicked = false;
    this.focussedUser = null;
  }

  sendMessage(msg) {
    const destinationUserId = this.focussedUser._id;
    const currentUserId = this.authService.currentUser().user._id;
    this.authService.sendPM(msg, destinationUserId, currentUserId)
      .subscribe((data) => {
        console.log(data);
        this.resetSubsections();
      });
  }

  showData() {
    this.enteredProfilePic = true;
  }

  hideData() {
    this.enteredProfilePic = false;
  }

  houseFocussedUser(house){
    return house === this.focussedUser.house;
  }
}
