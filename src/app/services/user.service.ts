import {Injectable} from "@angular/core";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {url} from "../reusable code/reusable-code";
import {catchError} from "rxjs/operators";
import {of, throwError} from 'rxjs';

@Injectable()

export class UserService {

    constructor(private http: HttpClient){}

    getUserData(userId) {
        return this.http.get(url + '/user/getUserData/' + userId)
            .pipe(catchError(this.handleError))
    }

    getQuote(){
      return of({test: 'something'});
    }

    postFile(fileToUpload: File, userId ) {

        const formData: FormData = new FormData();
        console.log('fileToUpload', fileToUpload);
        formData.append('fileKey', fileToUpload, fileToUpload.name);

        return this.http.post( url + '/user/uploadProfilePicture/' + userId, formData);
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
