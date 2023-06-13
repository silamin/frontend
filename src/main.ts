import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { initializeApp } from 'firebase/app';

import { getMessaging } from 'firebase/messaging';
import {firebaseConfig} from "../firebaseconfig";

const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);

platformBrowserDynamic()
  .bootstrapModule(AppModule, {
    providers: [{ provide: 'Messaging', useValue: messaging }],
  })
  .catch((err) => console.error(err));

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('./firebase-messaging-sw.js')
      .then((registration) => {
        console.log('ServiceWorker registered:', registration);
      })
      .catch((error) => {
        console.log('ServiceWorker registration failed:', error);
      });
  });
}
