import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-education-form',
  templateUrl: './education-form.component.html',
  styleUrls: ['./education-form.component.scss']
})
export class EducationFormComponent {
  @Input() visible: boolean = false;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  educationForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.educationForm = this.formBuilder.group({
      school: '',
      degree: '',
      fieldOfStudy: '',
      startDate: '',
      endDate: '',
      grade: '',
      activitiesSocieties: '',
      description: ''
    });
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    // Handle form submission
    console.log(this.educationForm.value);
    this.close();
  }

  close(): void {
    this.visible = false;
  }

  open(): void {
    this.visible = true;
  }
}
