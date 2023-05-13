import { Injectable } from '@angular/core';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {AngularFireFunctions} from "@angular/fire/compat/functions";

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  constructor(private afAuth: AngularFireAuth, private functions: AngularFireFunctions, private firestore: AngularFirestore) {}

  async setIsCompanyUser(uid: string, isCompanyUser: boolean): Promise<void> {
    const setIsCompanyUserCallable = this.functions.httpsCallable('setIsCompanyUser');
    try {
      await setIsCompanyUserCallable({ uid, isCompanyUser }).toPromise();
      await this.addUserToFirestore(uid);  // Use uid directly here
    } catch (error) {
      console.error('Error setting isCompanyUser:', error);
      throw error;
    }
  }
  async addUserToFirestore(uid: string): Promise<void> {
    try {
      await this.firestore.collection('users').add({
        id: uid
      });
    } catch (error) {
      console.error('Error adding user to Firestore:', error);
      throw error;
    }
  }
  async register(email: string, password: string, isCompanyUser: boolean): Promise<void> {
    try {
      const credential = await this.afAuth.createUserWithEmailAndPassword(email, password);

      if (credential.user) {
        const uid = credential.user.uid; // Fetch uid from user object
        //await this.setIsCompanyUser(uid, isCompanyUser);
        await this.addUserToFirestore(uid);  // Use uid directly here
      }
    } catch (error: any) {
      console.error('Error during registration:', error);

      if (error.code === 'auth/email-already-in-use') {
        alert('The email address is already in use by another account.');
      } else {
        alert('An error occurred during registration. Please try again later.');
        throw error;
      }
    }
  }

  async login(email: string, password: string): Promise<void> {
    this.afAuth.idToken.subscribe((token) => console.log(token));

    try {
      await this.afAuth.signInWithEmailAndPassword(email, password);
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await this.afAuth.signOut();
    } catch (error) {
      console.error('Error during logout:', error);
      throw error;
    }
  }
}
