import { Injectable } from '@angular/core';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {AngularFireFunctions} from "@angular/fire/compat/functions";
import {Router} from "@angular/router";
import {UserStore} from "../stores/UserStore";

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  constructor(private afAuth: AngularFireAuth, private functions: AngularFireFunctions, private firestore: AngularFirestore, private router: Router, private userStore: UserStore) {}

  async register(email: string, password: string, isCompanyUser: boolean): Promise<void> {
    try {
      const credential = await this.afAuth.createUserWithEmailAndPassword(email, password);

      if (credential.user) {
        const uid = credential.user.uid; // Fetch uid from user object
        await this.firestore.collection('users').doc(uid).set({
          id: uid,
          isCompanyUser: isCompanyUser
        })
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
    try {
      const userCredential = await this.afAuth.signInWithEmailAndPassword(email, password);
      const user = userCredential.user;

      if (user) {
        this.userStore.setUser(user)

        // Check if a user document already exists
        const userDocRef = this.firestore.collection('users').doc(user.uid);
        const userDoc = await userDocRef.get().toPromise();

        if (userDoc?.exists) {
          // If the user document exists, check if the user is a company user
          const userData: any = userDoc.data();
          if (userData) {
            this.userStore.setUserData(userData);
            if (userData.isCompanyUser) {
              await this.router.navigate(['/company-main-page']);
            } else {
              await this.router.navigate(['/user-main-page']); // Navigate to different page for non-company users
            }
          }
        } else {
          // If the user document does not exist, create it
          await userDocRef.set({
            // Add any initial data you want for the user here
          });
          await this.router.navigate(['/company-main-page']);
        }
      } else {
        console.error('Error during login: No user');
      }
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await this.afAuth.signOut();
      this.userStore.setUser(null); // This will cause user$ to emit a new value
    } catch (error) {
      console.error('Error during logout:', error);
      throw error;
    }
  }
}
