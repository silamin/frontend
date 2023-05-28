import {Injectable} from '@angular/core';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {AngularFireFunctions} from "@angular/fire/compat/functions";
import {JobDto, UserDTO} from "../dtos/DTO's";
import {combineLatest, map, Observable} from "rxjs";
import { AngularFirestore } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app';
import {switchMap} from "rxjs/operators";
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

      // Check if userId is defined
      if (!jobDto.userId) {
        throw new Error("Invalid jobDto: userId is undefined");
      }

      // Adding the new job to the 'jobs' collection with the new ID
      return jobsRef.doc(newId.toString()).set(jobDto);
    });
  }

  getAllJobs(userId?: string, isCompanyUser?: boolean): Observable<JobDto[]> {
    console.log(isCompanyUser)
    if (userId) {
      if (isCompanyUser){
        return this.firestore.collection<JobDto>('jobs', ref => ref.where('userId', '==', userId)).valueChanges();
      } else {
        // Get appliedJobsIds for user
        return this.firestore.collection<UserDTO>('users').doc(userId).get()
          .pipe(switchMap(userDoc => {
            const appliedJobsIds = userDoc.data()?.jobApplicationIds;
            console.log(appliedJobsIds);

            // Fetch all jobs
            return this.firestore.collection<JobDto>('jobs').valueChanges()
              .pipe(
                map(jobs => jobs.filter(job => { console.log(jobs)
                    appliedJobsIds?.includes(String(job.id)) && !job.candidates?.includes(userId)
                  })
                )
              );
          }));
      }
    } else {
      return this.firestore.collection<JobDto>('jobs').valueChanges();
    }
  }


  async apply(jobId: string, userId: string): Promise<void> {
    console.log(userId)
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
      likedJobs: firebase.firestore.FieldValue.arrayRemove(parseInt(jobId))
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
    await this.firestore.collection('jobs').doc(id).update({
      candidates: firebase.firestore.FieldValue.arrayRemove(selectedCandidateIndex)
    });
  }

  editJob(job: JobDto) {
    return this.firestore.collection('jobs').doc(job.id.toString()).update(job);
  }

  removeJob(jobId: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const batch = this.firestore.firestore.batch();

      // Fetch users who have liked this job
      const usersLikedRef = this.firestore.collection('users', ref => ref.where('likedJobs', 'array-contains', jobId));
      usersLikedRef.get().subscribe(usersLikedSnapshot => {
        usersLikedSnapshot.forEach(userLikedDoc => {
          const userLikedRef = this.firestore.collection('users').doc(userLikedDoc.id).ref;
          batch.update(userLikedRef, {
            likedJobs: firebase.firestore.FieldValue.arrayRemove(jobId)
          });
        });

        // Fetch users who have applied to this job
        const usersAppliedRef = this.firestore.collection('users', ref => ref.where('jobApplicationIds', 'array-contains', jobId));
        usersAppliedRef.get().subscribe(usersAppliedSnapshot => {
          usersAppliedSnapshot.forEach(userAppliedDoc => {
            const userAppliedRef = this.firestore.collection('users').doc(userAppliedDoc.id).ref;
            batch.update(userAppliedRef, {
              jobApplicationIds: firebase.firestore.FieldValue.arrayRemove(jobId)
            });
          });

          // Delete the job
          const jobRef = this.firestore.collection('jobs').doc(jobId).ref;
          batch.delete(jobRef);

          // Commit the batch
          batch.commit().then(() => {
            resolve();
          }).catch(error => {
            reject(error);
          });
        });
      });
    });
  }


}
