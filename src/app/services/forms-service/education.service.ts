import {Injectable} from '@angular/core';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {AngularFireFunctions} from "@angular/fire/compat/functions";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {Observable} from "rxjs";
import {WorkExperienceFormDTO} from "../../dtos/DTO\'s";
import {SectionService} from "../section-service";

@Injectable({
  providedIn: 'root'
})
export class EducationService implements SectionService{


  constructor(
    private afAuth: AngularFireAuth,
              private functions: AngularFireFunctions,
              private firestore: AngularFirestore) {}
  addItem(userId: string, educationBackground: any): Promise<any> {
    // Reference to the specific user's education background collection
    const educationBackgroundsRef = this.firestore.collection('users').doc(userId).collection('education');

    // Get the previous ID and add one to it, or start from one if not found
    return educationBackgroundsRef.get().toPromise().then(snapshot => {
      let newId: number;
      const previousIds: number[] = [];

      snapshot?.forEach(doc => {
        const eduBackground = doc.data() as any;
        if (eduBackground.id) {
          previousIds.push(eduBackground.id);
        }
      });

      if (previousIds.length > 0) {
        const maxId = Math.max(...previousIds);
        newId = maxId + 1;
      } else {
        newId = 1;
      }

      // Add the ID to the educationBackground object
      educationBackground.id = newId;

      // Adding the new education background to the user's educationBackground sub-collection
      return educationBackgroundsRef.add(educationBackground);
    });
  }

  deleteItem(item: any, userId: string): void {
    this.firestore
      .collection('users')
      .doc(userId)
      .collection('education', ref => ref.where('id', '==', item.id))
      .get()
      .subscribe(querySnapshot => {
        querySnapshot.forEach(doc => {
          doc.ref.delete();
        });
      });
  }

  fetchData(uid: any): Observable<any> {
    // Reference to the specific user's work experiences collection
    const educationBackgroundRef = this.firestore.collection('users').doc(uid).collection<WorkExperienceFormDTO>('education');

    // Return the observable stream of the user's work experiences
    return educationBackgroundRef.valueChanges();
  }
  editItem(id, data) {
    // Check if data and data.id are defined before proceeding
    if(data && data.id) {
      this.firestore
        .collection('users')
        .doc(id)
        .collection('education', ref => ref.where('id', '==', data.id))
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
