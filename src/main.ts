import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import firebase from "firebase/compat/app";
import { environment } from "../environments/environment";

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

firebase.initializeApp({
  apiKey: "AIzaSyD-UXdqY60rn6MigvTq9jsU6dnDNI9jPLk",
  authDomain: "silamin-7bbfd.firebaseapp.com",
  projectId: "silamin-7bbfd",
  storageBucket: "silamin-7bbfd.appspot.com",
  messagingSenderId: "365220988857",
  appId: "1:365220988857:web:f8fbe2e3ad8efd3b13d868",
  measurementId: "G-394246XLDF"
});

if ('serviceWorker' in navigator && environment.production) {
  navigator.serviceWorker.register('/firebase-messaging-sw.js')
    .then((registration) => {
      // Registration was successful
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }).catch((err) => {
    // registration failed
    console.log('ServiceWorker registration failed: ', err);
  });
}
