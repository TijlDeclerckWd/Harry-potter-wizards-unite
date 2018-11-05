import {Observable, of, ReplaySubject} from 'rxjs';


export class MockUserService {

  getUserData(test) {
    return new Observable( observer => {
      setTimeout(() => {
        observer.next('jos');
      },3000)
    });
  };

  postFile() {
    return of([]);
  }

}
