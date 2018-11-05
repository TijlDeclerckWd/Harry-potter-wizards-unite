import {Injectable} from "@angular/core";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {throwError} from "rxjs";
import {catchError, map} from "rxjs/operators";
import {AuthenticationService} from "./auth.service";
import {url} from "../reusable code/reusable-code";


@Injectable()

export class FindLocalsService {

    constructor(private http: HttpClient, private authService: AuthenticationService){}

    saveLocation(locationObj) {
      console.log('check 2', locationObj);
        return this.http.post(url + '/findLocals/saveLocation', locationObj);
    }

    getThreeClosestPlayers() {
        const userId = this.authService.currentUser().user._id;
        console.log('entered 3 closest service', userId);

        return this.http.get(url + '/findLocals/getThreeClosestPlayers/' + userId)
            .pipe(
              map((data: any) => data.obj)
              );
    }

    getLocations(token) {
        return this.http.get(url + '/findLocals/getLocations/' + token);
    }

    private handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error('An error occurred:', error.error.message);
        } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            console.error({
                "Backend returned code: ": error.status,
                "body was: ": error.error
            });
        }
        // return an ErrorObservable with a user-facing error message
        return throwError(
            'Something bad happened; please try again later.');
    };
}
