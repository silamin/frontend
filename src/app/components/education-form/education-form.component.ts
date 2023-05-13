import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {EducationService} from "../../services/education.service";

@Component({
  selector: 'app-education-form',
  templateUrl: './education-form.component.html',
  styleUrls: ['./education-form.component.scss']
})
export class EducationFormComponent {
  @Input() visible: boolean = false;
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

  ngOnInit(): void {
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
