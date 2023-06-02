import { Injectable } from '@angular/core';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {AngularFireFunctions} from "@angular/fire/compat/functions";
import {Router} from "@angular/router";
import {UserStore} from "../stores/UserStore";
import {GlobalErrorHandlerService} from "./global-error-handler.service";
import {LoginRegisterFormControlNames} from "../interfaces/control-names";

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  constructor(private afAuth: AngularFireAuth,
              private functions: AngularFireFunctions,
              private firestore: AngularFirestore,
              private router: Router,
              private userStore: UserStore,
              private errorHandler: GlobalErrorHandlerService) {}


  async register(registerForm): Promise<void> {
    try {
      const email = registerForm.get(LoginRegisterFormControlNames.Email)?.value;
      const password = registerForm.get(LoginRegisterFormControlNames.Password)?.value;
      const isRecruiter = registerForm.get(LoginRegisterFormControlNames.IsRecruiter)?.value;

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
      } else {
        throw error;
      }
    }
  }

  async login(loginForm): Promise<void> {
    try {
      const email = loginForm.get(LoginRegisterFormControlNames.Email)?.value;
      const password = loginForm.get(LoginRegisterFormControlNames.Password)?.value;

      const userCredential = await this.afAuth.signInWithEmailAndPassword(email, password);
      const user = userCredential?.user;

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
        }
      }
    } catch (error) {
      // Delegate error handling to global error handler
      throw error;
    }
  }


  async logout(): Promise<void> {
    try {
      await this.afAuth.signOut();
      localStorage.clear();
    } catch (error) {
      console.error('Error during logout:', error);
      throw error;
    }
  }
}
