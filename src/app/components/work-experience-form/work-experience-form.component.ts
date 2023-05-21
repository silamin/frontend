import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {WorkExperienceService} from "../../services/work-experience.service";
import {UserStore} from "../../stores/UserStore";
import {WorkExperienceFormDTO} from "../../dtos/DTO's";
import {HasForm} from "../../services/factories/FormFactory";


@Component({
  selector: 'app-work-experience-form',
  templateUrl: './work-experience-form.component.html',
  styleUrls: ['./work-experience-form.component.scss']
})
export class WorkExperienceFormComponent implements HasForm, OnInit{
  @Input() visible: boolean=false;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() workExperienceData: WorkExperienceFormDTO | undefined;
  formData: FormGroup;
  user: any;

  close() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }

  getForm(): FormGroup {
    return this.formData;
  }
  constructor(private fb: FormBuilder, private workExperienceService: WorkExperienceService, private userStore: UserStore) {
    this.formData = this.fb.group({
      jobTitle: [''],
      employmentType: [''],
      companyName: [''],
      location: [''],
      startDate: [''],
      endDate: [''],
      currentlyWorking: [false],
      jobDescription: ['']
    });
  }
   newWorkExperience: WorkExperienceFormDTO = {
    companyName: 'OpenAI',
    currentlyWorkingHere: true,
    employmentType: 'Full-Time',
    endDate: new Date(),
    jobDescription: 'test',
    jobTitle: 'Data Scientist',
    location: 'San Francisco, CA',
    startDate: new Date()
  };
  onSubmit() {
      this.workExperienceService.addUserWorkExperience(this.user.uid,this.newWorkExperience)
  }

  ngOnInit(): void {
    this.userStore.user$.subscribe(user => this.user = user)
  }
}
