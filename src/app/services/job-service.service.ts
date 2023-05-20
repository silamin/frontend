import {Injectable} from '@angular/core';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {AngularFireFunctions} from "@angular/fire/compat/functions";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {JobDto} from "../dtos/DTO's";

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


  getAllJobs(userId?: string) {
    if (userId) {
      return this.firestore.collection('jobs', ref => ref.where('userId', '==', userId)).valueChanges();
    } else {
      return this.firestore.collection('jobs').valueChanges();
    }
  }

  async apply(jobId: string, userId: string): Promise<void> {
    // Reference to the specific 'job' document
    const jobDocRef = this.firestore.collection('jobs').doc(jobId);

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

    // Add the user ID to the 'candidates' field
    jobData.candidates.push(userId);

    // Update the document with the new 'candidates' field
    await jobDocRef.update(jobData);
  }


}
