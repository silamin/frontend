import {Observable} from "rxjs";
import { Timestamp } from 'firebase/firestore';
import {Resource} from "../pages/process-application/process-application.component";
import {SocialMediaProfile} from "../pages/user-profile/user-profile.component";

export interface WorkExperienceFormDTO{
  id: number;
  companyName: string;
  currentlyWorkingHere: boolean;
  employmentType: string;
  endDate: Date;
  jobDescription: string
  jobTitle: string;
  location: string;
  startDate: Date;
}
export interface EducationBackgroundDto{
  id?: number;
  school: string;
  degree: string;
  fieldOfStudy: string;
  endDate: Date;
  description: string
  activitiesAndSocieties: string;
  grade: string;
  startDate: Date;
}
export interface SkillDto{
  id: number;
  skill: string;
  rating: string;
}
export interface LanguageDto{
  id: number;
  language: string;
  rating: string;
}
export interface  JobDto{
  id: number;
  userId: string;
  jobTitle: string,
  workplace: string,
  workType: string,
  startDate: string,
  deadline: string,
  jobDescription: string,
  jobResponsibilities: string,
  backgroundSkills: string,
  jobBenefits: string,
  candidates?: any[];
  candidates$?: Observable<UserDTO[]>;
  hasAcceptedCandidate?: boolean;

}

export interface AddressDTO {
  street: string;
  city: string;
  postalCode: string;
  country: string
}

export interface UserDTO{
  id: string;
  isCompanyUser: boolean;
  name: string;
  summary: string;
  email: string;
  phoneNumber: string;
  address: AddressDTO;
  socialMediaProfiles: SocialMediaProfile[];
  applicationStatus: string;
  likedJobs: number[];
}

export interface ScheduleDto {
  date: Timestamp;
  location: string;
}

export interface ApplicationDTO{
  resources: Resource[];
  notes: string
  scheduling: ScheduleDto;
  invitation?: string;
  id: number;
  jobId: string;
  candidateId: string;
  applicationDate: Timestamp

}
export interface ApplicationDto{
  id: number;
  userId: string;
  jobId: number;
  notes: string;
  status: string
  candidateId: string;
}
