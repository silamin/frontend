import { Injectable } from '@angular/core';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {AngularFireFunctions} from "@angular/fire/compat/functions";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {Observable} from "rxjs";
import {EducationBackgroundDto, SkillDto, WorkExperienceFormDTO} from "../dtos/DTO's";

@Injectable({
  providedIn: 'root'
})
export class SkillsService {

  constructor(private afAuth: AngularFireAuth, private functions: AngularFireFunctions, private firestore: AngularFirestore) {}
  getAllSkills(userId: string): Observable<any> {
    // Reference to the specific user's work experiences collection
    const educationBackgroundRef = this.firestore.collection('users').doc(userId).collection<WorkExperienceFormDTO>('skills');

    // Return the observable stream of the user's work experiences
    return educationBackgroundRef.valueChanges();
  }
  addSkill(userId: string, skillDto: SkillDto): Promise<any> {
    // Reference to the specific user's work experiences collection
    const educationBackgroundRef = this.firestore.collection('users').doc(userId).collection('skills');

    // Adding the new work experience to the user's workExperience sub-collection
    return educationBackgroundRef.add(skillDto);
  }
}
