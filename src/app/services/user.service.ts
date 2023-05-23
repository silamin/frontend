import { Injectable } from '@angular/core';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {AngularFireFunctions} from "@angular/fire/compat/functions";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {take, tap} from "rxjs";
import {UserStore} from "../stores/UserStore";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private afAuth: AngularFireAuth,
              private functions: AngularFireFunctions,
              private firestore: AngularFirestore) {}
  editUser(user) {
    console.log(user.id);

    // Get a reference to the Firestore collection or node where user data is stored
    const usersRef = this.firestore.collection('users');

    // Retrieve the user document using their ID
    const userDoc = usersRef.doc(user.id);

    // Extract the necessary data from the User object
    const userData = {
      ...user.uid && {id: user.uid},
      ...user.isCompanyUser !== undefined && {isCompanyUser: user.isCompanyUser},
      ...user.name && {name: user.name},
      ...user.summary && {summary: user.summary},
      ...user.email && {email: user.email},
      ...user.phoneNumber && {phoneNumber: user.phoneNumber},
      ...user.address && {address: user.address},
      ...user.socialMediaProfiles && {socialMediaProfiles: user.socialMediaProfiles},
    };



    // Update the document with the extracted data
    userDoc.update(userData)
      .then(() => {
        console.log('User data updated successfully!');
      })
      .catch((error) => {
        console.error('Error updating user data:', error);
      });
  }


}