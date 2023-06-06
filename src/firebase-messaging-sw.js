importScripts('https://www.gstatic.com/firebasejs/9.9.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.9.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey : "AIzaSyD-UXdqY60rn6MigvTq9jsU6dnDNI9jPLk" ,
  authDomain : "silamin-7bbfd.firebaseapp.com" ,
  projectId : "silamin-7bbfd" ,
  storageBucket : "silamin-7bbfd.appspot.com" ,
  messagingSenderId : "365220988857" ,
  appId : "1:365220988857:web:f8fbe2e3ad8efd3b13d868" ,
  measurementId : "G-394246XLDF"
});

// Initialize Firebase Messaging
const messaging = firebase.messaging();
