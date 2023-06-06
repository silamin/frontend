import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { initializeApp } from 'firebase/app';

import { getMessaging } from 'firebase/messaging';

const firebaseApp = initializeApp({
  apiKey: "AIzaSyD-UXdqY60rn6MigvTq9jsU6dnDNI9jPLk",
  authDomain: "silamin-7bbfd.firebaseapp.com",
  projectId: "silamin-7bbfd",
  storageBucket: "silamin-7bbfd.appspot.com",
  messagingSenderId: "365220988857",
  appId: "1:365220988857:web:f8fbe2e3ad8efd3b13d868",
  measurementId: "G-394246XLDF"
});
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
