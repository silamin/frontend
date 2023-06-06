import { Injectable } from '@angular/core';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {AngularFireFunctions} from "@angular/fire/compat/functions";
import {Router} from "@angular/router";
import {UserStore} from "../stores/UserStore";
import {GlobalErrorHandlerService} from "./global-error-handler.service";
import {LoginRegisterFormControlNames} from "../interfaces/control-names";
import {MessagingService} from "./messaging.service";
import firebase from "firebase/compat/app";

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  constructor(
    private afAuth: AngularFireAuth,
    private functions: AngularFireFunctions,
    private firestore: AngularFirestore,
    private router: Router,
    private userStore: UserStore,
    private errorHandler: GlobalErrorHandlerService,
    private messagingService: MessagingService
  ) {}

  async register(registerForm): Promise<void> {
    try {
      const email = registerForm.get(LoginRegisterFormControlNames.Email)?.value;
      const password = registerForm.get(LoginRegisterFormControlNames.Password)?.value;
      const isRecruiter = registerForm.get(LoginRegisterFormControlNames.IsRecruiter)?.value;

      const userCredential = await this.afAuth.createUserWithEmailAndPassword(email, password);

      if (userCredential.user) {
        const uid = userCredential.user.uid; // Fetch uid from user object

        // Set the UserId in the UserStore
        this.userStore.setUserId(uid);

        // Create a new document in Firestore for this user
        await this.firestore.collection('users').doc(uid).set({
          id: uid,
          email: email,
          isCompanyUser: isRecruiter
        });

        // Get the FCM token and store it in the user document
        try {
          const fcmToken = await this.messagingService.requestPermission();
          await this.firestore.collection('users').doc(uid).update({
            fcmToken: fcmToken
          });
        } catch (error) {
          console.log('Failed to get FCM token:', error);
        }

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
        // Handle specific error case if needed
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

        if (!userDoc?.exists) {
          // If the user document doesn't exist, create it and store the FCM token
          try {
            const fcmToken = await this.messagingService.requestPermission();
            console.log('FCM Token:', fcmToken);
            const userData = {
              id: user.uid,
              email: user.email,
              isCompanyUser: false,
              fcmToken: fcmToken // Store the FCM token
            };
            await userDocRef.set(userData);
          } catch (error) {
            console.log('Failed to get FCM token:', error);
          }
        }

        // Set the UserId in the UserStore
        this.userStore.setUserId(user.uid);

        // Determine the appropriate navigation based on user type
        const userData: any = userDoc?.data();
        if (userData?.isCompanyUser) {
          await this.router.navigate(['/company-main-page']);
        } else {
          await this.router.navigate(['/user-main-page']);
        }
      }
    } catch (error) {
      // Delegate error handling to global error handler
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      const uid = localStorage.getItem('userId'); // Retrieve uid from localStorage

      if (!uid) {
        throw new Error("User id not found in localStorage");
      }
      await this.firestore.collection('users').doc(uid).update({
        fcmToken: firebase.firestore.FieldValue.delete()
      });

      await this.afAuth.signOut();
      localStorage.clear();
    } catch (error) {
      console.error('Error during logout:', error);
      throw error;
    }
  }
}
