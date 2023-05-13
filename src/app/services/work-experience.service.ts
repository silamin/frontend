import { Injectable } from '@angular/core';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {AngularFireFunctions} from "@angular/fire/compat/functions";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {WorkExperienceFormDTO} from "../dtos/DTO's";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class WorkExperienceService {

  constructor(private afAuth: AngularFireAuth, private functions: AngularFireFunctions, private firestore: AngularFirestore) {}
  getAllWorkExperiences(userId: string): Observable<WorkExperienceFormDTO[]> {
    // Reference to the specific user's work experiences collection
    const workExperiencesRef = this.firestore.collection('users').doc(userId).collection<WorkExperienceFormDTO>('workExperience');

    // Return the observable stream of the user's work experiences
    return workExperiencesRef.valueChanges();
  }
  addUserWorkExperience(userId: string, workExperience: WorkExperienceFormDTO): Promise<any> {
    // Reference to the specific user's work experiences collection
    const workExperiencesRef = this.firestore.collection('users').doc(userId).collection('workExperience');

    // Adding the new work experience to the user's workExperience sub-collection
    return workExperiencesRef.add(workExperience);
  }

  editUserWorkExperience(userId: string, workExperienceId: string, updatedWorkExperience: WorkExperienceFormDTO): Promise<void> {
    const workExperienceDocRef = this.firestore.collection('users').doc(userId).collection('workExperience').doc(workExperienceId);
    return workExperienceDocRef.update(updatedWorkExperience);
  }

  removeUserWorkExperience(userId: string, workExperienceId: string): Promise<void> {
    const workExperienceDocRef = this.firestore.collection('users').doc(userId).collection('workExperience').doc(workExperienceId);
    return workExperienceDocRef.delete();
  }
}
