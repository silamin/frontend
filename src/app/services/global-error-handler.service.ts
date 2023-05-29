import {ErrorHandler, Injectable, Injector, NgZone} from '@angular/core';
import {ToastrService} from "ngx-toastr";


@Injectable({
  providedIn: 'root'
})
export class GlobalErrorHandlerService implements ErrorHandler{
  constructor(private ngZone: NgZone, private injector: Injector) {}

  handleError(error: any): void {
    this.ngZone.run(() => {
      const toastrService = this.injector.get(ToastrService);

      if (error.message.includes('auth/user-not-found')) {
        toastrService.error('No user found with the provided email address', 'Login Error');
      } else {
        toastrService.error('An error occurred: ' + error.message, 'Login Error');
      }
    });
  }}
