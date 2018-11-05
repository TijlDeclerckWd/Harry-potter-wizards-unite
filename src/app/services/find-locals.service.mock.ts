import {of} from 'rxjs';
import {HttpClient} from '@angular/common/http';


export class MockFindLocalsService {


getLocations() {
  return of([]);
}

  saveLocation() {
    return of([]);
  }
}
