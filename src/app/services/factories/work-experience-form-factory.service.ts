import { Injectable } from '@angular/core';
import {FormFactory} from "./FormFactory";
import {FormGroup} from "@angular/forms";
import {WorkExperienceFormControlNames} from "../../interfaces/control-names";

@Injectable({
  providedIn: 'root'
})
export class WorkExperienceFormFactoryService implements FormFactory{
  constructor() { }
  populateForm(data: any, formData): void {
    formData.setValue({
      [WorkExperienceFormControlNames.Id]: data?.id,
      [WorkExperienceFormControlNames.JobTitle]: data?.jobTitle ?? '',
      [WorkExperienceFormControlNames.CompanyName]: data?.companyName ?? '',
      [WorkExperienceFormControlNames.CurrentlyWorking]: data?.currentlyWorkingHere ?? false,
      [WorkExperienceFormControlNames.EndDate]: data.endDate,
      [WorkExperienceFormControlNames.StartDate]: data?.startDate ?? '',
      [WorkExperienceFormControlNames.EmploymentType]: data?.employmentType ?? '',
      [WorkExperienceFormControlNames.JobDescription]: data?.jobDescription ?? '',
      [WorkExperienceFormControlNames.Location]: data?.location ?? ''
    });
  }

  resetForm(formData: FormGroup): void {
    formData.reset();
  }
}
