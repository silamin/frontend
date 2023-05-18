import { Injectable } from '@angular/core';
import {FormFactory} from "./FormFactory";
import {FormGroup} from "@angular/forms";

@Injectable({
  providedIn: 'root'
})
export class WorkExperienceFormFactoryService implements FormFactory{
  constructor() { }
  populateForm(data: any, formData): void {
    formData.setValue({
      jobTitle: data?.jobTitle ?? '',
      companyName: data?.companyName ?? '',
      currentlyWorking: data?.currentlyWorkingHere ?? false,
      endDate: data.endDate,
      startDate: data?.startDate ?? '',
      employmentType: data?.employmentType ?? '',
      jobDescription: data?.jobDescription ?? '',
      location: data?.location ?? ''
    });
  }

  resetForm(formData: FormGroup): void {
    formData.reset();
  }
}
