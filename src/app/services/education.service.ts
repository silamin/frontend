import { Injectable } from '@angular/core';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {AngularFireFunctions} from "@angular/fire/compat/functions";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {Observable} from "rxjs";
import {EducationBackgroundDto, WorkExperienceFormDTO} from "../dtos/DTO's";

@Injectable({
  providedIn: 'root'
})
export class EducationService {


  constructor(private afAuth: AngularFireAuth, private functions: AngularFireFunctions, private firestore: AngularFirestore) {}
  getAllEducationBackground(userId: string): Observable<any> {
    // Reference to the specific user's work experiences collection
    const educationBackgroundRef = this.firestore.collection('users').doc(userId).collection<WorkExperienceFormDTO>('education');

    // Return the observable stream of the user's work experiences
    return educationBackgroundRef.valueChanges();
  }
  addUserEducationBackground(userId: string, educationBackgroundDto: EducationBackgroundDto): Promise<any> {
    // Reference to the specific user's work experiences collection
    const educationBackgroundRef = this.firestore.collection('users').doc(userId).collection('education');

    // Adding the new work experience to the user's workExperience sub-collection
    return educationBackgroundRef.add(educationBackgroundDto);
  }

  editUserWorkExperience(userId: string, educationBackgroundId: string, updatedEducationBackground: EducationBackgroundDto): Promise<void> {
    const educationBackgroundRef = this.firestore.collection('users').doc(userId).collection('education').doc(educationBackgroundId);
    return educationBackgroundRef.update(updatedEducationBackground);
  }

  removeUserWorkExperience(userId: string, educationBackgroundId: string): Promise<void> {
    const workExperienceDocRef = this.firestore.collection('users').doc(userId).collection('education').doc(educationBackgroundId);
    return workExperienceDocRef.delete();
  }}
