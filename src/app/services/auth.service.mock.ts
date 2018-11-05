import {of} from 'rxjs';


export class MockAuthenticationService {

  currentUser() {
    return {user: { _id: 123}};
  }

  isLoggedIn() {
    return of([]);
  }

  sendPM() {
    return of([]);
  }
}
