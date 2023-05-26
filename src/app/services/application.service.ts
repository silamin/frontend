import { Injectable } from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {BehaviorSubject, map, Observable} from "rxjs";
import {ApplicationDTO} from "../dtos/DTO's";
import firebase from "firebase/compat";
import App = firebase.app.App;

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {

  constructor(private firestore: AngularFirestore) { }

  startProcess(jobId: number, candidateId: number) {
    // create a new document in applications collection
    this.firestore.collection('applications').add({
      jobId: jobId,
      candidateId: candidateId,
      applicationDate: new Date()
    }).then(() => {
      console.log("Document successfully written!");
    }).catch((error) => {
      console.error("Error writing document: ", error);
    });
  }

   selectedCandidates = new BehaviorSubject<Set<string>>(new Set());

  fetchSelectedCandidates() {
    this.firestore.collection('applications').get().toPromise().then((querySnapshot) => {
      const selectedCandidatesSet = new Set<string>();
      querySnapshot?.forEach((doc) => {
        const data = doc.data() as ApplicationDTO;
        if (!data?.candidateId || !data.jobId) {
          console.error(`Invalid data in doc ${doc.id}:`, data);
        } else {
          selectedCandidatesSet.add(`${data.candidateId}-${data.jobId}`);
        }
      });
      this.selectedCandidates.next(selectedCandidatesSet);
    });
  }

  getApplicationData(uid: string, jid: string): Observable<ApplicationDTO[]> {
    return this.firestore.collection('applications', ref =>
      ref.where('candidateId', '==', uid).where('jobId', '==', parseInt(jid))
    )
      .valueChanges()
      .pipe(
        map(data => data as ApplicationDTO[])
      );
  }

  async sendInvitation(invitationText: string, applicationId: string): Promise<void> {
    try {
      const docRef = this.firestore.collection('applications').doc(applicationId);
      await docRef.update({
        invitation: invitationText
      });
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  }
}
