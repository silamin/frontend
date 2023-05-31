import { Injectable } from '@angular/core';
import {WorkExperienceFormFactoryService} from "./work-experience-form-factory.service";
import {SkillFormFactoryService} from "./skill-form-factory.service";
import {FormFactory} from "./FormFactory";
import {LanguageFormFactoryService} from "./language-form-factory.service";
import {EducationFormFactoryService} from "./education-form-factory.service";

@Injectable({
  providedIn: 'root'
})
export class FormFactoryProviderService {

  constructor(
    private workExperienceFormFactory: WorkExperienceFormFactoryService,
    private skillFormFactory: SkillFormFactoryService,
    private languageFormFactory: LanguageFormFactoryService,
    private educationFormFactory: EducationFormFactoryService
  ) { }

  getFormFactory(formType: string): FormFactory {
    switch (formType) {
      case 'Work Experience':
        return this.workExperienceFormFactory;
      case 'Skills':
        return this.skillFormFactory;
      case 'Languages':
        return this.languageFormFactory;
      case 'Education':
        return this.educationFormFactory;
      default:
        throw new Error('Invalid form type');
    }
  }
}
