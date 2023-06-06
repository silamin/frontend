import {Injectable} from '@angular/core';
import {AngularFireMessaging} from "@angular/fire/compat/messaging";

@Injectable({
    providedIn: 'root'
  })
  export class MessagingService {

  constructor(private afMessaging: AngularFireMessaging) { }

  requestPermission(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.afMessaging.requestToken
        .subscribe(
          (token) => {
            if (token) {
              resolve(token);
            } else {
              reject('No token received');
            }
          },
          (error) => {
            reject(error);
          },
        );
    });
  }

  }
