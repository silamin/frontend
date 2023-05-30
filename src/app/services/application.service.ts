import { Injectable } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/compat/firestore";
import {BehaviorSubject, combineLatest, filter, map, Observable, tap} from "rxjs";
import {ApplicationDto, ApplicationDTO, UserDTO} from "../dtos/DTO's";
import 'firebase/firestore';
import {Resource} from "../pages/process-application/process-application.component";
import 'firebase/firestore';
import firebase from "firebase/compat/app";
import {switchMap} from "rxjs/operators";
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
  getAllApplications(userId: string): Observable<ApplicationDto[]> {
    return this.firestore.collection<ApplicationDto>('applications', ref => ref.where('candidateId', '==', userId))
      .valueChanges();
  }

  withdrawApplication(jobId: number, userId: number): Promise<void> {
    const applicationsRef: AngularFirestoreCollection<any> = this.firestore.collection('applications');

    return applicationsRef.ref
      .where('jobId', '==', jobId)
      .where('candidateId', '==', userId)
      .get()
      .then(querySnapshot => {
        if (!querySnapshot.empty) {
          // Delete the matching application document
          const documentId = querySnapshot.docs[0].id;
          return applicationsRef.doc(documentId).delete();
        } else {
          throw new Error('Matching application not found');
        }
      })
      .then(() => {
        console.log('Application successfully withdrawn!');
      })
      .catch(error => {
        console.error('Error withdrawing application:', error);
        throw error;
      });
  }
  getAllCandidatesByJobId(jobId: string): Observable<UserDTO[]> {
    return this.firestore.collection('applications', ref => ref.where('jobId', '==', parseInt(jobId))).valueChanges().pipe(
      tap(applications => console.log('applications:', applications)),
      switchMap((applications: any[]) => {
        const candidatesObservables: Observable<UserDTO>[] = [];

        applications.forEach(application => {
          if (application.status !== 'rejected') {
            const candidate$ = this.firestore.doc<UserDTO>(`users/${application.candidateId}`).valueChanges().pipe(
              filter(candidate => candidate !== undefined), // Filter out undefined values
              map(candidate => ({
                ...candidate,
                isCandidateSelected: application.status === 'in progress'
              }))
            ) as Observable<UserDTO>;

            candidatesObservables.push(candidate$);
          }
        });

        return combineLatest(candidatesObservables);
      }),
      tap(candidates => console.log('candidates:', candidates))
    );
  }




  rejectApplication(jobId: number, candidateId: string, rejectionReason?: string) {
    // Query the collection
    return this.firestore.collection('applications', ref => ref.where('jobId', '==', jobId).where('candidateId', '==', candidateId))
      .get().toPromise().then(querySnapshot => {
        if (querySnapshot && !querySnapshot.empty) {
          const docRef = querySnapshot.docs[0].ref;  // Take the first matched document
          const updateData = { status: 'rejected', rejectionReason: rejectionReason || '' };
          return docRef.set(updateData, { merge: true })
            .then(() => console.log('Application rejected successfully'))
            .catch(error => console.error('Error rejecting application: ', error));
        } else {
          console.log(`No matching application found for jobId: ${jobId}, candidateId: ${candidateId}`);
          return Promise.resolve();  // Resolve the promise in case of no matching document
        }
      }).catch(error => console.error('Error executing query: ', error));
  }


  acceptCandidate(jobId: number, candidateId: string) {

    // Query the collection
    return this.firestore.collection('applications', ref => ref.where('jobId', '==', jobId).where('candidateId', '==', candidateId))
      .get().toPromise().then(querySnapshot => {
        if (querySnapshot && !querySnapshot.empty) {
          const docRef = querySnapshot.docs[0].ref;  // Take the first matched document
          return docRef.set({ status: 'accepted' }, { merge: true })
            .then(() => console.log('Candidate accepted successfully'))
            .catch(error => console.error('Error accepting candidate: ', error));
        }  else {
          console.log(`No matching application found for jobId: ${jobId}, candidateId: ${candidateId}`);
          return Promise.resolve();  // Resolve the promise in case of no matching document
        }
      }).catch(error => console.error('Error executing query: ', error));
  }

}
