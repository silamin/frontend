import {Injectable} from '@angular/core';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {AngularFireFunctions} from "@angular/fire/compat/functions";
import {JobDto, UserDTO} from "../dtos/DTO's";
import {combineLatest, map, Observable} from "rxjs";
import { AngularFirestore } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app';
@Injectable({
  providedIn: 'root'
})
export class JobServiceService {


  constructor(private afAuth: AngularFireAuth, private functions: AngularFireFunctions, private firestore: AngularFirestore) {
  }

  async addJob(jobDto: JobDto): Promise<any> {
    // Reference to the 'jobs' collection
    const jobsRef = this.firestore.collection('jobs');

    // Get the previous ID and add one to it, or start from one if not found
    return jobsRef.get().toPromise().then(snapshot => {
      let newId: number;
      const previousIds: number[] = [];

      snapshot?.forEach(doc => {
        const job = doc.data() as JobDto;
        if (job.id) {
          previousIds.push(job.id);
        }
      });

      if (previousIds.length > 0) {
        const maxId = Math.max(...previousIds);
        newId = maxId + 1;
      } else {
        newId = 1;
      }

      // Add the ID to the jobDto object
      jobDto.id = newId;

      // Adding the new job to the 'jobs' collection with the new ID
      return jobsRef.doc(newId.toString()).set(jobDto);
    });
  }


  getAllJobs(userId?: string): Observable<any[]> {
    if (userId) {
      return this.firestore.collection('jobs', ref => ref.where('userId', '==', userId)).valueChanges();
    } else {
      return this.firestore.collection('jobs').valueChanges();
    }
  }


  async apply(jobId: string, userId: string): Promise<void> {



    // Reference to the specific 'job' document
    const jobDocRef = this.firestore.collection('jobs').doc(jobId.toString());

    // Get the job document
    const jobDoc = await jobDocRef.get().toPromise();

    // If the document doesn't exist, throw an error
    if (!jobDoc?.exists) {
      throw new Error('Job does not exist');
    }
    const jobData = jobDoc?.data() as JobDto; // Explicitly specify the data type
    // If the 'candidates' field doesn't exist or isn't an array, create it
    if (!Array.isArray(jobData.candidates)) {
      jobData.candidates = [];
    }
    jobData.candidates.push(userId);
    await jobDocRef.update(jobData);

    // Now add the jobId to the user's 'appliedJobsIds' array
    // Get user reference
    const userDocRef = this.firestore.collection('users').doc(userId);
    const userDoc = await userDocRef.get().toPromise();
    const userData = userDoc?.data() as UserDTO;
    console.log(userData)

    // If appliedJobsIds does not exist or is not an array, create it
    if (!Array.isArray(userData.jobApplicationIds)) {
      userData.jobApplicationIds = [];
    }

    // Add the jobId to the appliedJobsIds field
    userData.jobApplicationIds.push(jobId.toString());

    // Update the user document with the new 'appliedJobsIds' field
    await userDocRef.update(userData);
  }


  getCandidate(candidateId: string): Observable<any> {
    console.log(this.firestore.collection('users').doc(candidateId).valueChanges())
    return this.firestore.collection('users').doc(candidateId).valueChanges();
  }
  getCandidateWithWorkExperience(candidateId: string): Observable<any> {
    const candidateDoc = this.firestore.collection('users').doc(candidateId);

    return combineLatest([
      candidateDoc.valueChanges(),
      candidateDoc.collection('workExperience').valueChanges()
    ]).pipe(
      map(([candidate, workExperience]) => {
        const candidateData = candidate as any; // Specify the type of candidate object
        return {
          ...candidateData,
          workExperience: workExperience
        };
      })
    );
  }

  getCandidateWithDetails(candidateId: string): Observable<any> {
    const candidateDoc = this.firestore.collection('users').doc(candidateId);

    return combineLatest([
      candidateDoc.valueChanges(),
      candidateDoc.collection('workExperience').valueChanges(),
      candidateDoc.collection('education').valueChanges(),
      candidateDoc.collection('skills').valueChanges(),
      candidateDoc.collection('languages').valueChanges()


    ]).pipe(
      map(([candidate, workExperience, education, skills, languages]) => {
        const candidateData = candidate as any; // Specify the type of candidate object
        return {
          ...candidateData,
          workExperience: workExperience,
          education: education,
          skills: skills,
          languages: languages
        };
      })
    );
  }

  likeJob(uid: string, jobId: string): Promise<void> {
    const userRef = this.firestore.collection('users').doc(uid);

    return userRef.get().toPromise().then(docSnapshot => {
      if (docSnapshot && docSnapshot.exists) {
        const userData = docSnapshot.data() as { likedJobs?: string[] };

        let likedJobs: string[] = userData.likedJobs || [];

        if (!likedJobs.includes(jobId)) {
          likedJobs.push(jobId);
        }

        return userRef.update({ likedJobs });
      } else {
        return userRef.set({ likedJobs: [jobId.toString()] });
      }
    });
  }
  getLikedJobIds(uid: string): Promise<string[]> {
    const userRef = this.firestore.collection('users').doc(uid);

    return userRef.get().toPromise().then(docSnapshot => {
      if (docSnapshot && docSnapshot.exists) {
        const userData = docSnapshot.data() as { likedJobs?: string[] };
        return userData.likedJobs || [];
      } else {
        return [];
      }
    });
  }
  removeLikedJob(uid: string, jobId: string): Promise<void> {
    const userRef = this.firestore.collection('users').doc(uid);

    return userRef.update({
      likedJobs: firebase.firestore.FieldValue.arrayRemove(jobId)
    });
  }

  async getJobById(id: any): Promise<any> {
    if (!id && id !== 0) { // this will handle id = 0 case as well
      throw new Error('Invalid ID');
    }
    const idStr = id.toString(); // convert to string to use with firestore
    const jobDoc = await this.firestore.collection('jobs').doc(idStr).get().toPromise();
    if (jobDoc && jobDoc.exists) {
      return jobDoc.data();
    } else {
      throw new Error('Job not found');
    }
  }


  async removeCandidate(id: string, selectedCandidateIndex: string) {
    console.log(id);
    console.log(selectedCandidateIndex)
    await this.firestore.collection('jobs').doc(id).update({
      candidates: firebase.firestore.FieldValue.arrayRemove(selectedCandidateIndex)
    });
  }
}
