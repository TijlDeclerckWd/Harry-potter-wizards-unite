import {Injectable} from "@angular/core";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {JwtHelper, tokenNotExpired} from "angular2-jwt";
import {catchError, map} from "rxjs/operators";
import {throwError} from "rxjs";
import {url} from "../reusable code/reusable-code";

@Injectable()

export class AuthenticationService {

    constructor(private http: HttpClient){}

    checkEmailUniqueness(email) {
        return this.http.get(url + '/user/checkEmailUniqueness/' + email)
            .pipe(catchError(this.handleError))
    }

    checkUsername(username){
        console.log('entered checkUsername');
        return this.http.get(url + '/user/checkUsername/' + username)
            .pipe(catchError(this.handleError))
    }

    createLoginObject(user){
        let endFirstIndex = user.name.indexOf(' ');
        let obj = {
            email: user.email,
            firstName: user.name.slice(0, endFirstIndex),
            lastName: user.name.slice(endFirstIndex+1, user.name.length-1),
            provider: {
                name: user.provider,
                ID: user.id,
            }
        };
        return this.signIn(obj);
    }

    currentUser():any {
        let token = localStorage.getItem('token');
        if (!token) return null;
        return new JwtHelper().decodeToken(token);
    }

    isLoggedIn() {
        return tokenNotExpired();
    }

    isLocationSaved() {
      const token = localStorage.getItem('token');

      return this.http.post(`${url}/user/isLocationSaved`, {token});
    }

    isAdmin() {
      return this.isLoggedIn() && this.currentUser().user.role === 'admin';
    }

    logout(){
        localStorage.clear();
    }

    sendPM(msg, destinationUserId, currentUserId){
        let msgObject = {
          msg: msg,
          destinationUserId: destinationUserId,
            currentUserId: currentUserId
        };

        return this.http.post(url + '/user/sendPM', msgObject)
            .pipe(
                catchError(this.handleError)
            )
    }

    signup(user) {
      console.log('reached signup service');
        return this.http.post(url + '/user/signup', user)
            .pipe(catchError(this.handleError));
    }

    signIn(data){
        return this.http.post(url + '/user/signin', data);
    }

    validateCaptcha(token) {
      return this.http.get(`${url}/user/validate_captcha/${token}`);
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
