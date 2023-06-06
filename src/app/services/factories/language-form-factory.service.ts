import { Injectable } from '@angular/core';
import {FormFactory} from "./FormFactory";
import {FormGroup} from "@angular/forms";
import {LanguageFormControlNames} from "../../interfaces/control-names";

@Injectable({
  providedIn: 'root'
})
export class LanguageFormFactoryService implements FormFactory{

  constructor() { }
  populateForm(data: any, formData): void {
    formData.setValue({
      [LanguageFormControlNames.Id]: data.id,
      [LanguageFormControlNames.Language]: data.language,
      [LanguageFormControlNames.Rating]: data.rating
    })
  }

  resetForm(formData: FormGroup): void {
    formData.reset();
  }
}
