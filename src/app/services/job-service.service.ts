import {Injectable} from '@angular/core';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {AngularFireFunctions} from "@angular/fire/compat/functions";
import {ApplicationDto, JobDto, UserDTO} from "../dtos/DTO's";
import { map, Observable} from "rxjs";
import { AngularFirestore } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app';
import {switchMap} from "rxjs/operators";
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JobServiceService {


  constructor(private afAuth: AngularFireAuth,
              private functions: AngularFireFunctions,
              private firestore: AngularFirestore) {
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
  getAllJobs(userId: string, isCompanyUser: boolean): Observable<JobDto[]> {
    if (isCompanyUser) {
      // Get postedJobs for company user
      return this.firestore.collection<JobDto>('jobs', ref => ref.where('userId', '==', userId))
        .valueChanges();
    } else {
      // Get appliedJobsIds for user
      return this.firestore.collection<UserDTO>('users').doc(userId).get()
        .pipe(
          switchMap(userDoc => {
            // Fetch all applications for the user
            return this.firestore.collection<ApplicationDto>('applications', ref => ref.where('userId', '==', userId)).valueChanges()
              .pipe(
                switchMap(applications => {
                  // Fetch all jobs
                  return this.firestore.collection<JobDto>('jobs').valueChanges()
                    .pipe(
                      map(jobs => {
                        // Filter jobs based on applications' status
                        return jobs.filter(job => {
                          // Find the application of this job
                          const application = applications.find(app => app.jobId === job.id);
                          // If the application is rejected, do not include the job
                          return application?.status !== 'rejected';
                        });
                      })
                    );
                })
              );
          }));
    }
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

  editJob(job: JobDto) {
    return this.firestore.collection('jobs').doc(job.id.toString()).update(job);
  }

  async removeJob(jobId: string, userId: string): Promise<void> {
    // Create a reference to the document in the 'jobs' collection
    const jobRef = this.firestore.collection('jobs').doc(jobId);

    // Delete the job document
    await jobRef.delete();

    // Fetch user document
    const userRef = this.firestore.collection('users').doc(userId);

    // Get user data
    const userSnapshot = await firstValueFrom(userRef.get());
    const userData = userSnapshot.data() as UserDTO;

    // Check if the job id is in the user's likedJobs array
    if (userData?.likedJobs) {
      const likedJobs = userData.likedJobs;
      const jobIndex = likedJobs.indexOf(Number(jobId));

      // If the job id is found, remove it
      if (jobIndex > -1) {
        likedJobs.splice(jobIndex, 1);
        await userRef.update({ likedJobs });
      }
    }
  }



}
