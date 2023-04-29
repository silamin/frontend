import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-work-experience-form',
  templateUrl: './work-experience-form.component.html',
  styleUrls: ['./work-experience-form.component.scss']
})
export class WorkExperienceFormComponent implements OnInit{
  @Input() visible: boolean=false;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  workExperienceForm: FormGroup;

  close() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }

  ngOnInit(): void {

  }
  constructor(private fb: FormBuilder) {
    this.workExperienceForm = this.fb.group({
      title: [''],
      employmentType: [''],
      companyName: [''],
      location: [''],
      startDate: [''],
      endDate: [''],
      currentlyWorking: [false],
      jobDescription: ['']
    });
  }
  onSubmit() {

  }
}
