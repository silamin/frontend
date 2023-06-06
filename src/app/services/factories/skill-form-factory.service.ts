import { Injectable } from '@angular/core';
import {FormFactory} from "./FormFactory";
import {FormGroup} from "@angular/forms";
import {SkillsFormControlNames} from "../../interfaces/control-names";

@Injectable({
  providedIn: 'root'
})
export class SkillFormFactoryService  implements FormFactory{

  constructor() { }
  populateForm(data: any,formData): void {
    formData.setValue({
      [SkillsFormControlNames.Id]: data.id,
      [SkillsFormControlNames.Skill]: data.skill,
      [SkillsFormControlNames.Rating]: data.rating
    });
  }

  resetForm(formData: FormGroup): void {
    formData.reset()
  }
}
