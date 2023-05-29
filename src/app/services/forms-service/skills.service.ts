import {Inject, Injectable} from '@angular/core';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {AngularFireFunctions} from "@angular/fire/compat/functions";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {Observable} from "rxjs";
import {SkillDto, WorkExperienceFormDTO} from "../../dtos/DTO\'s";
import {SectionService} from "../section-service";

@Injectable({
  providedIn: 'root'
})
export class SkillsService implements SectionService{

  constructor(
              private afAuth: AngularFireAuth,
              private functions: AngularFireFunctions,
              private firestore: AngularFirestore) {}
  addItem(userId: string, skillDto: SkillDto): Promise<any> {
    // Reference to the specific user's work experiences collection
    const educationBackgroundRef = this.firestore.collection('users').doc(userId).collection('skills');

    // Adding the new work experience to the user's workExperience sub-collection
    return educationBackgroundRef.add(skillDto);
  }

  deleteItem(item: any, userId: string): void {
    this.firestore
      .collection('users')
      .doc(userId)
      .collection('skills', ref => ref.where('skill', '==', item.skill))
      .get()
      .subscribe(querySnapshot => {
        querySnapshot.forEach(doc => {
          doc.ref.delete();
        });
      });
  }

  fetchData(uid: any): Observable<any> {
    // Reference to the specific user's work experiences collection
    const educationBackgroundRef = this.firestore.collection('users').doc(uid).collection<WorkExperienceFormDTO>('skills');

    // Return the observable stream of the user's work experiences
    return educationBackgroundRef.valueChanges();
  }
}
