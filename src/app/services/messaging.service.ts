import {Injectable} from '@angular/core';
import {getMessaging, getToken} from "@angular/fire/messaging";

@Injectable({
    providedIn: 'root'
  })
  export class MessagingService {

  constructor() { }

  // Update in MessagingService
  async requestPermission() {
    console.log('Requesting permission...');
    const permission = await Notification.requestPermission();

    if (permission === 'granted') {
      console.log('Notification permission granted.');

      const messaging = getMessaging();
      try {
        const currentToken = await getToken(messaging, { vapidKey: 'BNlQ82uDhNzCW-RdNqKgsoYk2QyF-8i9o5p8te6NVOgRO2upmuaWrAKpDyVJrAeG9soLrJObAd_AjNjB4yksf2s' });
        if (currentToken) {
          console.log(`FCM token: ${currentToken}`);
          return currentToken; // return the token
        } else {
          console.log('No registration token available. Request permission to generate one.');
          return null;
        }
      } catch (error) {
        console.log('An error occurred while retrieving token. ', error);
        return null;
      }
    } else {
      console.error('Notification permission denied.');
      return null;
    }
  }



}
