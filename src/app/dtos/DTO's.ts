export interface WorkExperienceFormDTO{
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
