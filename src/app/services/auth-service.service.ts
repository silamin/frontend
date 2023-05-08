import { Injectable } from '@angular/core';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {AngularFireFunctions} from "@angular/fire/compat/functions";

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  constructor(private afAuth: AngularFireAuth, private functions: AngularFireFunctions) {}

  async setIsCompanyUser(uid: string, isCompanyUser: boolean): Promise<void> {
    const setIsCompanyUserCallable = this.functions.httpsCallable('setIsCompanyUser');
    try {
      await setIsCompanyUserCallable({ uid, isCompanyUser }).toPromise();
    } catch (error) {
      console.error('Error setting isCompanyUser:', error);
      throw error;
    }
  }

  async register(email: string, password: string, isCompanyUser: boolean): Promise<void> {
    try {
      const { user } = await this.afAuth.createUserWithEmailAndPassword(email, password);

      if (user) {
        await this.setIsCompanyUser(user.uid, isCompanyUser);
      }
    } catch (error: any) {
      console.error('Error during registration:', error);

      if (error.code === 'auth/email-already-in-use') {
        alert('The email address is already in use by another account.');
      } else {
        alert('An error occurred during registration. Please try again later.');
        throw error; // re-throw the error only if it is not of the 'auth/email-already-in-use' type
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
