import { Injectable} from '@angular/core';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {AngularFireFunctions} from "@angular/fire/compat/functions";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {WorkExperienceFormDTO} from "../../interfaces/DTO\'s";
import {Observable} from "rxjs";
import {SectionService} from "../section-service";

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

  deleteItem(item: any, userId: string): void {
    this.firestore
      .collection('users')
      .doc(userId)
      .collection('workExperience', ref => ref.where('id', '==', item.id))
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

  editItem(id, data) {
    // Check if data and data.id are defined before proceeding
    if(data && data.id) {
      this.firestore
        .collection('users')
        .doc(id)
        .collection('workExperience', ref => ref.where('id', '==', data.id))
        .get()
        .subscribe(querySnapshot => {
          querySnapshot.forEach(doc => {
            // Update the document
            doc.ref.update(data).then(() => {
              console.log('Document successfully updated!');
            }).catch((error) => {
              console.error('Error updating document: ', error);
            });
          });
        });
    } else {
      console.error('Data or data.id is undefined');
    }
  }
}
