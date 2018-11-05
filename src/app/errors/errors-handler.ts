import {ErrorHandler, Injectable, Injector} from '@angular/core';
import {NotificationService} from '../services/notification.service';
import {HttpErrorResponse} from '@angular/common/http';
import {Router} from '@angular/router';
import {ErrorService} from '../services/error.service';

@Injectable()

export class ErrorsHandler implements ErrorHandler {

  constructor(private injector: Injector) {}

  handleError(error: Error) {
    const notificationService = this.injector.get(NotificationService);
    const errorService = this.injector.get(ErrorService);
    const router = this.injector.get(Router);

    if (error instanceof HttpErrorResponse) {
      console.log('ITS A SERVER ERROR');
      console.log('show error', error);
      // Server or connection error happened
      if (!navigator.onLine) {

        // Handle offline error
        return notificationService.notify('No Internet Connection');
      } else {
        // Handle Http Error (error.status === 403, 404...)
        // Send the error to the server
        errorService
          .log(error)
          .subscribe();
        // Show notification to the user
        if (error.error.notification) {
          return notificationService.notify(`${error.error.notification}`);
        }
      }
    } else {
      // Handle Client Error (Angular Error, ReferenceError...)
      // Send the error to the server and then
      // redirect the user to the page with all the info
      errorService
        .log(error)
        .subscribe(errorWithContextInfo => {
          // router.navigate(['/error'], { queryParams: errorWithContextInfo });
        });
    }

    // Log the error anyway
    console.error('It happens: ', error);
  }
}
