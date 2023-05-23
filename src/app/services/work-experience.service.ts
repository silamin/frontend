import {Inject, Injectable} from '@angular/core';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {AngularFireFunctions} from "@angular/fire/compat/functions";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {WorkExperienceFormDTO} from "../dtos/DTO's";
import {Observable} from "rxjs";
import {SectionService} from "./section-service";
import {WORK_EXPERIENCE_SERVICE_TOKEN} from "./tokens";

@Injectable({
  providedIn: 'root'
})
export class WorkExperienceService implements SectionService{

  constructor(private afAuth: AngularFireAuth,
              private functions: AngularFireFunctions,
              private firestore: AngularFirestore,

  ) {}

  addItem(userId: string, workExperience: WorkExperienceFormDTO): Promise<any> {
    // Reference to the specific user's work experiences collection
    const workExperiencesRef = this.firestore.collection('users').doc(userId).collection('workExperience');

    // Get the previous ID and add one to it, or start from one if not found
    return workExperiencesRef.get().toPromise().then(snapshot => {
      let newId: number;
      const previousIds: number[] = [];

      snapshot?.forEach(doc => {
        const workExp = doc.data() as WorkExperienceFormDTO;
        if (workExp.id) {
          previousIds.push(workExp.id);
        }
      });

      if (previousIds.length > 0) {
        const maxId = Math.max(...previousIds);
        newId = maxId + 1;
      } else {
        newId = 1;
      }

      // Add the ID to the workExperience object
      workExperience.id = newId;

      // Adding the new work experience to the user's workExperience sub-collection
      return workExperiencesRef.add(workExperience);
    });
  }


  editUserWorkExperience(userId: string, workExperienceId: string, updatedWorkExperience: WorkExperienceFormDTO): Promise<void> {
    const workExperienceDocRef = this.firestore.collection('users').doc(userId).collection('workExperience').doc(workExperienceId);
    return workExperienceDocRef.update(updatedWorkExperience);
  }

  removeUserWorkExperience(userId: string, workExperienceId: string): Promise<void> {
    const workExperienceDocRef = this.firestore.collection('users').doc(userId).collection('workExperience').doc(workExperienceId);
    return workExperienceDocRef.delete();
  }

  deleteItem(item: any, userId: string): void {
    this.firestore
      .collection('users')
      .doc(userId)
      .collection('skills', ref => ref.where('id', '==', item.id))
      .get()
      .subscribe(querySnapshot => {
        querySnapshot.forEach(doc => {
          doc.ref.delete();
        });
      });
  }

  fetchData(uid: any): Observable<any> {
    // Reference to the specific user's work experiences collection
    const workExperiencesRef = this.firestore.collection('users').doc(uid).collection<WorkExperienceFormDTO>('workExperience');

    // Return the observable stream of the user's work experiences
    return workExperiencesRef.valueChanges();
  }
}
