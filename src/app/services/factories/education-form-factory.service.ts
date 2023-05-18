import { Injectable } from '@angular/core';
import {FormFactory} from "./FormFactory";
import {FormGroup} from "@angular/forms";

@Injectable({
  providedIn: 'root'
})
export class EducationFormFactoryService implements FormFactory{

  constructor() { }

  populateForm(data: any, formData): void {
    formData.setValue({
      school: data.school,
      degree: data.degree,
      fieldOfStudy: data.fieldOfStudy,
      startDate: data.startDate,
      endDate: data.endDate,
      grade: data.grade,
      activitiesSocieties: data.activitiesSocieties,
      description: data.description
    })
  }
  resetForm(formData: FormGroup) {
    formData.reset();
  }
}
