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
  candidates?: string;
}
