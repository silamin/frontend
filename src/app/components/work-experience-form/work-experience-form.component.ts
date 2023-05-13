import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {WorkExperienceService} from "../../services/work-experience.service";
import {AuthServiceService} from "../../services/auth-service.service";
import {UserStore} from "../../stores/UserStore";
import {WorkExperienceFormDTO} from "../../dtos/DTO's";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-work-experience-form',
  templateUrl: './work-experience-form.component.html',
  styleUrls: ['./work-experience-form.component.scss']
})
export class WorkExperienceFormComponent implements OnInit{
  @Input() visible: boolean=false;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() workExperienceData: WorkExperienceFormDTO | undefined;
  formData: FormGroup;

  close() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }

  ngOnInit(): void {
    if (this.workExperienceData){
      this.formData.get('companyName')?.setValue(this.workExperienceData.companyName);
      this.formData.get('currentlyWorkingHere')?.setValue(this.workExperienceData.currentlyWorkingHere);
      this.formData.get('endDate')?.setValue(this.workExperienceData.endDate);
      this.formData.get('startDate')?.setValue(this.workExperienceData.startDate);
      this.formData.get('title')?.setValue(this.workExperienceData.jobTitle);
      this.formData.get('environmentType')?.setValue(this.workExperienceData.employmentType);
      this.formData.get('jobDescription')?.setValue(this.workExperienceData.jobDescription);
      this.formData.get('location')?.setValue(this.workExperienceData.location)
    }
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
    jobDescription: 'Research and Development',
    jobTitle: 'Data Scientist',
    location: 'San Francisco, CA',
    startDate: new Date()
  };
  onSubmit() {
      this.workExperienceService.addUserWorkExperience(this.userStore.getUser.uid,this.newWorkExperience)
  }
}
