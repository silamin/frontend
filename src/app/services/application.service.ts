import { Injectable } from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {BehaviorSubject, map, Observable} from "rxjs";
import {ApplicationDTO} from "../dtos/DTO's";

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {

  constructor(private firestore: AngularFirestore) { }

  startProcess(candidateId: number, jobId: number) {
    // create a new document in applications collection
    this.firestore.collection('applications').add({
      jobId: jobId,
      candidateId: candidateId
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









  isCandidateSelected(candidateId: string, jobId: string): Observable<boolean> {
    this.selectedCandidates.subscribe((selectedCandidatesSet) => {
      console.log(selectedCandidatesSet); // Log the set of selected candidates
    });
    return this.selectedCandidates.asObservable().pipe(
      map((selectedCandidatesSet) => selectedCandidatesSet.has(`${candidateId}-${jobId}`))
    );
  }
}
