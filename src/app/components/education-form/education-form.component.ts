import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {EducationService} from "../../services/education.service";

@Component({
  selector: 'app-education-form',
  templateUrl: './education-form.component.html',
  styleUrls: ['./education-form.component.scss']
})
export class EducationFormComponent implements OnChanges{
  @Input() visible: boolean = false;
  @Input() data;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  educationForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private educationService: EducationService) {
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
  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] && changes['data'].currentValue) {
      if (this.data) {
        this.educationForm.setValue({
          school: this.data.school,
          degree: this.data.degree,
          fieldOfStudy: this.data.fieldOfStudy,
          startDate: this.data.startDate,
          endDate: this.data.endDate,
          grade: this.data.grade,
          activitiesSocieties: this.data.activitiesSocieties,
          description: this.data.description
        });
    }
  }
  }

  onSubmit(): void {
    this.educationService.addUserEducationBackground('tTGtgSdVyQSwf8hBO3yUC1dcGBV2',{
      activitiesAndSocieties: "Student Council, Debate Club",
      degree: "Bachelor of Science",
      description: "Managed project timelines and deliverables",
      endDate: new Date("2023-05-31"),
      fieldOfStudy: "Computer Science",
      grade: "A+",
      school: "University of Example",
      startDate: new Date("2020-09-01")
    })
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
