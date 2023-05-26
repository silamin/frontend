import { Injectable } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/compat/firestore";
import {BehaviorSubject, map, Observable} from "rxjs";
import {ApplicationDTO} from "../dtos/DTO's";
import 'firebase/firestore';
import {Resource} from "../pages/process-application/process-application.component";
import 'firebase/firestore';
import firebase from "firebase/compat/app";
@Injectable({
  providedIn: 'root'
})
export class ApplicationService {

  constructor(private firestore: AngularFirestore) { }

  async startProcess(jobId: number, candidateId: number) {
    try {
      const applicationsRef: AngularFirestoreCollection<any> = this.firestore.collection('applications');

      // Get the most recent document based on the 'id' field in descending order
      const querySnapshot = await applicationsRef.ref.orderBy('id', 'desc').limit(1).get();
      const lastId = querySnapshot.empty ? 0 : querySnapshot.docs[0].data().id;

      // Create a new document with the auto-incremented ID
      const newId = lastId + 1;
      const applicationData = {
        id: newId,
        jobId: jobId,
        candidateId: candidateId,
        applicationDate: new Date()
      };
      await applicationsRef.doc(newId.toString()).set(applicationData);

      console.log("Document successfully written!");
    } catch (error) {
      console.error("Error writing document: ", error);
    }
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

  async sendInvitation(invitationText: string, applicationId: number): Promise<void> {
    try {
      const docRef = this.firestore.collection('applications').doc(applicationId.toString());
      await docRef.update({
        invitation: invitationText
      });
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  }

  async saveInterviewData(id, interviewData: { date: Date; location: string }) {
    try {
      const docRef = this.firestore.collection('applications').doc(id.toString());
      await docRef.update({
        scheduling: interviewData
      });
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  }

  addResource(newResource: Resource, id) {
    this.firestore
      .collection('applications')
      .doc(id.toString())
      .update({
        resources: firebase.firestore.FieldValue.arrayUnion(newResource)
      })
      .then(() => {
        console.log('Resource added successfully!');
      })
      .catch((error) => {
        console.error('Error adding resource: ', error);
      });
  }

  deleteResource(applicationId, resource) {

    this.firestore.collection('applications').doc(applicationId.toString()).update({
      resources: firebase.firestore.FieldValue.arrayRemove(resource)
    })
      .then(() => {
        console.log("Resource deleted successfully!");
      })
      .catch((error) => {
        console.error("Error deleting resource: ", error);
      });
  }

  saveData(notes: string, id) {
    this.firestore
      .collection('applications')
      .doc(id.toString())
      .update({
        notes: notes
      })
      .then(() => {
        console.log('Notes saved successfully!');
      })
      .catch((error) => {
        console.error('Error saving notes: ', error);
      });
  }
  }
