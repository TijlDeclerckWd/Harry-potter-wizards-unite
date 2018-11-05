import {Component, OnDestroy, OnInit} from "@angular/core";
import {FindLocalsService} from "../../services/find-locals.service";
import {Observable, Subject} from 'rxjs';
import { takeUntil } from "rxjs/operators";
import {AuthenticationService} from '../../services/auth.service';

@Component({
    selector: 'local-players-home',
    styleUrls: ['local-players-home.component.css'],
    templateUrl: 'local-players-home.component.html'
})

export class LocalPlayersHomeComponent implements OnInit, OnDestroy {

    ngUnsubscribe = new Subject();
    nearbyPlayers: Observable<any>;
    destinationUser;
    errorMessage: string;

    constructor(private findLocalsService: FindLocalsService, private authService: AuthenticationService){}

    ngOnInit() {
        this.grabThreeClosestLocations();
    }

    changeDestinationUser(player){
      this.destinationUser = player;
    }

    getId() {
      return this.authService.currentUser().user._id;
    }

    grabThreeClosestLocations() {
        this.findLocalsService.getThreeClosestPlayers()
          .subscribe((data) => {
            this.nearbyPlayers = data.threeClosest;
            console.log(data);
      }, (err) => {
            this.errorMessage =
              `We were unable to retrieve the locations of players close to you. Please refresh the page to try again.
               If you denied us location access, please change your browser settings if you wish to use this section
            `;
          });
    }

    isLoggedIn() {
      return this.authService.isLoggedIn();
    }

    refreshPage() {
      location.reload();
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}
