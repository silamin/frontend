import { Injectable } from '@angular/core';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {AngularFireFunctions} from "@angular/fire/compat/functions";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {Observable} from "rxjs";
import {JobDto, SkillDto, WorkExperienceFormDTO} from "../dtos/DTO's";

@Injectable({
  providedIn: 'root'
})
export class JobServiceService {


  constructor(private afAuth: AngularFireAuth, private functions: AngularFireFunctions, private firestore: AngularFirestore) {}
  async addJob(jobDto: JobDto): Promise<any> {
    // Reference to the 'jobs' collection
    const jobsRef = this.firestore.collection('jobs');

    // Adding the new job to the 'jobs' collection
    return jobsRef.add(jobDto);
  }

  getAllJobs(userId?: string) {
    if (userId) {
      return this.firestore.collection('jobs', ref => ref.where('userId', '==', userId)).valueChanges();
    } else {
      return this.firestore.collection('jobs').valueChanges();
    }  }
}
