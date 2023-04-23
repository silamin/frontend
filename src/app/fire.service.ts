import { Injectable } from '@angular/core';
import firebase from "firebase/compat/app";
import 'firebase/compat/firestore'
import * as config from '../../firebaseconfig.js'

@Injectable({
  providedIn: 'root'
})
export class FireService {

  firebaseApplication;
  fireStore: firebase.firestore.Firestore;
  constructor() {
    this.firebaseApplication = firebase.initializeApp(config.firebaseConfig);
    this.fireStore = firebase.firestore()
    this.fireStore.collection('helloWorld').add({
      myField: 'HelloWorld'
    });
  }
}
