import { Injectable } from '@angular/core';
import {FormFactory} from "./FormFactory";
import {FormGroup} from "@angular/forms";

@Injectable({
  providedIn: 'root'
})
export class LanguageFormFactoryService implements FormFactory{

  constructor() { }

  populateForm(data: any, formData): void {
    formData.setValue({
      id: data.id,
      skill: data.skill,
      rating: data.rating
    })
  }

  resetForm(formData: FormGroup): void {
    formData.reset();
  }
}
