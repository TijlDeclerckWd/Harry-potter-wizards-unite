import {Injectable} from "@angular/core";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {BehaviorSubject, throwError} from 'rxjs';
import {catchError, map} from "rxjs/operators";
import {Subject} from "rxjs";
import {AuthenticationService} from "./auth.service";
import {url} from "../reusable code/reusable-code";


@Injectable()

export class ForumService {

    categoryOfTitle = new Subject();
    newPost = new Subject();
    viewersCount = new Subject();
    loadedMain = new Subject();
  monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

    constructor(private http: HttpClient, private authService: AuthenticationService){

    }

    addPost(post) {
        return this.http.post(url + '/forum/addPost', post)
            .pipe(
              map( (receivedPost: any) => this.newPost.next(receivedPost.obj)),
              catchError(this.handleError));
    }

    addReply(values ) {
        return this.http.post(url + '/forum/addReply', values)
            .pipe(catchError(this.handleError))
    }

    createForumSection(data) {
      return this.http.post(`${url}/forum/createForumSection`, data);
    }

    deletePost(postId) {
      return this.http.delete( url + `/forum/deletePost/${postId}`);
    }

    deleteReply(replyId, postId){
        let userId = this.authService.currentUser().user._id;
        return this.http.delete(url + '/forum/deleteReply/' + replyId + '/' + postId + '/' + userId)
            .pipe(catchError(this.handleError))
    }

    determineBackground(category) {
      console.log('category', category);
      switch (category) {
        case 'News':
          return 'orange';
        case 'Quests':
          return 'green';
        case 'Tips & Tricks':
          return 'purple';
        case 'Gryffindor':
          return '#740001';
        case 'Slytherin':
          return '#1a472a';
        case 'Ravenclaw':
          return '#0e1a40';
        case 'Hufflepuff':
          return '#ecb939';
        default:
          return 'yellow';
      }
    }

    editReply(replyId, newReplyContent){
        let data = {
            replyId: replyId,
            newReplyContent: newReplyContent,
            userId: this.authService.currentUser().user._id
        };
        return this.http.post(url + '/forum/editReply', data)
            .pipe(catchError(this.handleError))
    }

    getPost(id) {
        console.log(id);
        return this.http.get(url + '/forum/getPost/' + id);
    }



    getAllPosts() {
      return this.http.get( `${url}/forum/getAllPosts`)
        .pipe(map( (posts: any) => {
          this.categoryOfTitle.next({name: 'General'});
          posts.obj = this.topSorting(posts.obj);
          this.loadedMain.next(true);
          return posts;
        }));
    }

    getDate(type, date) {
      if (type === 'day') {
        const day = new Date(date).getDate();
        return day;
      } else {
        const month = new Date(date).getMonth();
        return this.monthNames[month].slice(0, 3);
      }
    }

    getPosts(sections) {
        return this.http.post(`${url}/forum/getPosts`, sections)
          .map( (posts: any) => {
            // posts should be ordened based on latest replies. If there are no replies yet, we compare it to the date
            // of the original post
            this.categoryOfTitle.next(posts.section);
            posts.obj = this.topSorting(posts.obj);
            return posts;
          });
    }

    getLatestReplies(userId) {
      return this.http.get(`${url}/forum/getLatestReplies/${userId}`);
    }

    sortListItems(order, posts) {
      if (order === "Newest") {
        posts.sort((a, b) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
      } else if (order === "Oldest") {
        posts.sort((a, b) => {
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        });
      } else if (order === "Top") {
        posts = this.topSorting(posts);
      }
      return posts;
    }

    subViewChange(section, sign){
        console.log('entered service');
        return this.http.get(url + '/forum/subViewPlus/' + section + '/' + sign)
            .pipe(
                map((views) => {
                    this.viewersCount.next({
                        views: views,
                        section: section
                    });
                    return views;
                }),
                catchError(this.handleError)
                );
    }

    topSorting(posts) {
      posts.sort((a, b) => {
        const aHasReplies = a.replies.length !== 0;
        const bHasReplies = b.replies.length !== 0;

        if (aHasReplies && bHasReplies ) {
          return new Date(b.replies.slice(-1)[0].date).getTime() - new Date(a.replies.slice(-1)[0].date).getTime();
        } else if ( aHasReplies && !bHasReplies) {
          return new Date(b.date).getTime() - new Date(a.replies.slice(-1)[0].date).getTime();
        } else if ( !aHasReplies && bHasReplies) {
          return new Date(b.replies.slice(-1)[0].date).getTime() - new Date(a.date).getTime();
        } else {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        }
      });

      return posts;
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
        return throwError (
            'Something bad happened; please try again later.');
    };
}
