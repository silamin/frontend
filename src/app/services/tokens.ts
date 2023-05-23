import {InjectionToken} from "@angular/core";
import {SectionService} from "./section-service";

export const WORK_EXPERIENCE_SERVICE_TOKEN = new InjectionToken<SectionService>('WorkExperienceService');
export const EDUCATION_SERVICE_TOKEN = new InjectionToken<SectionService>('EducationService');
export const SKILLS_SERVICE_TOKEN = new InjectionToken<SectionService>('SkillsService');
export const LANGUAGE_SERVICE_TOKEN = new InjectionToken<SectionService>('LanguageService');

