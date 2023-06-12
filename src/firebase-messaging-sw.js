importScripts('https://www.gstatic.com/firebasejs/9.9.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.9.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyD-UXdqY60rn6MigvTq9jsU6dnDNI9jPLk",
  authDomain: "silamin-7bbfd.firebaseapp.com",
  projectId: "silamin-7bbfd",
  storageBucket: "silamin-7bbfd.appspot.com",
  messagingSenderId: "365220988857",
  appId: "1:365220988857:web:f8fbe2e3ad8efd3b13d868",
  measurementId: "G-394246XLDF"
});

const messaging = firebase.messaging();

self.addEventListener('push', (event) => {
  console.log('Received a push event:', event);

  const pushData = event.data ? event.data.json() : {};

  const title = pushData.notification?.title || 'Test Title';
  const body = pushData.notification?.body || 'Test Body';

  const options = {
    body: body,
    // include other options as necessary, such as icon, image, etc.
  };

  if (event.data) {
    event.waitUntil(
      self.registration.showNotification(title, options)
    );
  } else {
    // Handle the push event when data is not available
    console.log('Foreground push event received:', event);
    // Handle the notification manually or perform other actions
    // For example, you can dispatch a custom event to communicate with the page
    self.clients.matchAll().then((clients) => {
      clients.forEach((client) => {
        client.postMessage({
          type: 'foreground-push',
          title: title,
          body: body,
        });
      });
    });
  }
});
