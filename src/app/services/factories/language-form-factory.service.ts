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
      language: data.language,
      rating: data.rating
    })
  }

  resetForm(formData: FormGroup): void {
    formData.reset();
  }
}
