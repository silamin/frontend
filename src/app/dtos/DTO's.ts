import {Observable} from "rxjs";
import { Timestamp } from 'firebase/firestore';

export interface WorkExperienceFormDTO{
  id?: number;
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
  skill: string;
  rating: string;
}
export interface LanguageDto{
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

}

export interface AddressDTO {
  street: string;
  city: string;
  postalCode: string;
  country: string
}

export interface UserDTO{
  id: number;
  isCompanyUser: boolean;
  name: string;
  summary: string;
  email: string;
  phoneNumber: string;
  address: AddressDTO;
  socialMediaProfiles: any
}

export interface ScheduleDto {
  date: Timestamp;
  location: string;
}

export interface ApplicationDTO{
  resources: any[];
  notes: string
  scheduling: ScheduleDto;
  invitation?: string;
  id: number;
  jobId: string;
  candidateId: string;
  applicationDate: Timestamp

}
export interface ApplicationDto{
  id: any;
  userId: any;
  jobId: any;
  Status: any;
  notes: any;
  status: any
  candidateId: any;
}
