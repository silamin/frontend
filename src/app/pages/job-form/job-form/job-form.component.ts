import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";



@Component({
  selector: 'app-job-form',
  templateUrl: './job-form.component.html',
  styleUrls: ['./job-form.component.scss'],
})
export class JobFormComponent{
  @Input() visible: boolean = false;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() isDisplay = false;

  jobForm: FormGroup;

  close() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }

  constructor(private fb: FormBuilder) {
    this.jobForm = this.fb.group({
      jobTitle: ['', Validators.required],
      workplace: ['', Validators.required],
      workType: ['', Validators.required],
      startDate: [''],
      deadline: [''],
      jobDescription: ['', Validators.required],
      jobResponsibilities: ['', Validators.required],
      backgroundSkills: ['', Validators.required],
      jobBenefits: ['', Validators.required]
    });
  }


  submitJobForm() {

  }
}
