import { Injectable } from '@angular/core';
import {FormFactory} from "./FormFactory";
import {FormGroup} from "@angular/forms";

@Injectable({
  providedIn: 'root'
})
export class SkillFormFactoryService  implements FormFactory{

  constructor() { }

  populateForm(data: any): void {
  }

  resetForm(formData: FormGroup): void {
    formData.reset()
  }
}
