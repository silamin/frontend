import {FormGroup} from "@angular/forms";

export interface FormFactory {
  populateForm(data: any, formData: FormGroup): void;
  resetForm(formData: FormGroup): void;
}
export interface HasForm {
  getForm(): FormGroup;
}
