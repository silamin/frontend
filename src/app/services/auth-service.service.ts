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

  async register(registerForm): Promise<void> {
    try {
      const email = registerForm.get('email')?.value;
      const password = registerForm.get('password')?.value;
      const isRecruiter = registerForm.get('isRecruiter')?.value;

      const userCredential = await this.afAuth.createUserWithEmailAndPassword(email, password);

      if (userCredential.user) {
        const uid = userCredential.user.uid; // Fetch uid from user object

        // Set the userId in the UserStore
        this.userStore.setUserId(uid);

        // Create a new document in Firestore for this user
        await this.firestore.collection('users').doc(uid).set({
          id: uid,
          email: email,
          isCompanyUser: isRecruiter
        })

        // Redirect the user to the appropriate page based on whether they're a recruiter or not
        if (isRecruiter) {
          await this.router.navigate(['/company-main-page']);
        } else {
          await this.router.navigate(['/user-main-page']);
        }
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


  async login(loginForm): Promise<void> {
    try {
      const email = loginForm.get('email')?.value;
      const password = loginForm.get('password')?.value;

      const userCredential = await this.afAuth.signInWithEmailAndPassword(email, password);
      const user = userCredential.user;

      if (user) {
        // Check if a user document already exists
        const userDocRef = this.firestore.collection('users').doc(user.uid);
        const userDoc = await userDocRef.get().toPromise();

        if (userDoc?.exists) {
          // If the user document exists, set the userId in the UserStore
          this.userStore.setUserId(user.uid);

          // Determine the appropriate navigation based on user type
          const userData: any = userDoc.data();
          if (userData?.isCompanyUser) {
            await this.router.navigate(['/company-main-page']);
          } else {
            await this.router.navigate(['/user-main-page']);
          }
        } else {
          // If the user document does not exist, throw an error
          // (because a user document should be created at registration)
          throw new Error("User document does not exist");
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
    } catch (error) {
      console.error('Error during logout:', error);
      throw error;
    }
  }
}
