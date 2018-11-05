// import {FindLocalsService} from './find-locals.service';
// import {TestBed} from '@angular/core/testing';
// import {AuthenticationService} from './auth.service';
// import {MockAuthenticationService} from './auth.service.mock';
// import {HttpClientModule} from '@angular/common/http';
// import {of} from 'rxjs';
//
// let findLocalsService: FindLocalsService;
// let authService: MockAuthenticationService;
// let httpClientSpy;
//
//
// beforeEach(() => {
//   httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post']);
//
//   TestBed.configureTestingModule({
//     // Provide both the service-to-test and its (spy) dependency
//     providers: [
//       FindLocalsService,
//       { provide: AuthenticationService, useValue: MockAuthenticationService }
//     ]
//   });
//   // Inject both the service-to-test and its (spy) dependency
//   findLocalsService = TestBed.get(FindLocalsService);
//   authService = TestBed.get(AuthenticationService);
// });
//
// it('should save the location', function () {
//   const expectedData =
//     [{ id: 1, name: 'A' }, { id: 2, name: 'B' }];
//   httpClientSpy.post.and.returnValue(of(expectedData));
//
//   findLocalsService.saveLocation('something').subscribe(
//     data => expect(data).toEqual(expectedData)
//   );
// });
