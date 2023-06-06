import { Injectable } from '@angular/core';
import {FormFactory} from "./FormFactory";
import {FormGroup} from "@angular/forms";
import {EducationFormControlNames} from "../../interfaces/control-names";

@Injectable({
  providedIn: 'root'
})
export class EducationFormFactoryService implements FormFactory{

  constructor() { }
  populateForm(data: any, formData): void {
    formData.setValue({
      [EducationFormControlNames.Id]: data?.id,
      [EducationFormControlNames.School]: data?.school ?? '',
      [EducationFormControlNames.Degree]: data?.degree ?? '',
      [EducationFormControlNames.FieldOfStudy]: data?.fieldOfStudy ?? '',
      [EducationFormControlNames.StartDate]: data?.startDate ?? '',
      [EducationFormControlNames.EndDate]: data?.endDate ?? '',
      [EducationFormControlNames.Grade]: data?.grade ?? '',
      [EducationFormControlNames.ActivitiesSocieties]: data?.activitiesSocieties ?? '',
      [EducationFormControlNames.Description]: data?.description ?? ''
    });

  }
  resetForm(formData: FormGroup) {
    formData.reset();
  }
}
