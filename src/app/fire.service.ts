import { Injectable } from '@angular/core';
import firebase from "firebase/compat/app";
import 'firebase/compat/firestore'
import * as config from '../../firebaseconfig.js'
import  'firebase/compat/auth'

@Injectable({
  providedIn: 'root'
})
export class FireService {

  firebaseApplication;
  fireStore: firebase.firestore.Firestore;
  messages: any[] = [];
  auth: firebase.auth.Auth

  constructor() {
    this.firebaseApplication = firebase.initializeApp(config.firebaseConfig);
    this.fireStore = firebase.firestore();
    this.getMessages();
    this.auth = firebase.auth();

    this.auth.onAuthStateChanged((user)=>{
      if (user){
        this.getMessages();
      }
    })

  }

  sendMessage(sendThisMessage: any) {
    let messageDto: MessageDto = {
      messageContent : sendThisMessage,
      timeStamp : new Date(),
      user: 'some user'
    }
    this.fireStore.collection('myChat').add(
      messageDto
    )
  }
  async getMessages(){
    this.fireStore.collection('myChat').where('user','==','some user').onSnapshot(snapshot => {
        snapshot.docChanges().forEach(change => {
          if (change.type=='added'){
            this.messages.push(change.doc.data())
          }
        })
      });
  }
  register(email: string, password: string): void{
    this.auth.createUserWithEmailAndPassword(email, password);
  }
  signIn(email: string, password: string): void {
    this.auth.signInWithEmailAndPassword(email,password);
  }
  signOut():void {
    this.auth.signOut();
  }

}
export interface MessageDto{
  messageContent: string;
  timeStamp: Date;
  user: string;
}
