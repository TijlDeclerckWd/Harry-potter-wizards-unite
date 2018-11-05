import {Injectable} from "@angular/core";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {catchError, map} from "rxjs/operators";
import {throwError} from "rxjs";
import {AuthenticationService} from "./auth.service";
import {url} from "../reusable code/reusable-code";

@Injectable()

export class MessagesService {

    constructor( private http: HttpClient, private authService: AuthenticationService){}

    getUserPMs(userId){
        return this.http.get(url + '/user/getUserPMs/' + userId)
            .pipe(
                map((data: any) => {
                    data.obj.map(function(conversation) {
                        if (conversation.messages[0].from._id == userId) {
                            conversation.otherUser = {
                              username: conversation.messages[0].to.username,
                              userId: conversation.messages[0].to._id,
                              profilePicture: conversation.messages[0].to.profilePicture
                            };
                        } else {
                            conversation.otherUser = {
                              username: conversation.messages[0].from.username,
                              userId: conversation.messages[0].from._id,
                              profilePicture: conversation.messages[0].from.profilePicture
                            };
                        }
                    });
                    return data;
                }),
                catchError(this.handleError))
    }

    sendPM(msg, destinationUserId){
        let body = {
            message: msg,
            destinationUserId: destinationUserId,
            currentUserId: this.authService.currentUser().user._id
        };

        return this.http.post(url + '/user/sendPM', body)
            .pipe(catchError(this.handleError))
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
