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
}

interface AddressDTO {
  street: string;
  city: string;
  postalCode: string;
  country: string
}

export interface UserDTO{
  jobApplicationIds: string[];
  isCompanyUser: boolean;
  name: string;
  summary: string;
  email: string;
  phoneNumber: string;
  address: AddressDTO;
  socialMediaProfiles: {}
}
export interface ApplicationDTO{
  invitationText?: string;
  id: string;
  jobId: string;
  candidateId: string;
  applicationDate: string

}
