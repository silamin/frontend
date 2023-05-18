import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {WorkExperienceService} from "../../services/work-experience.service";
import {UserStore} from "../../stores/UserStore";
import {WorkExperienceFormDTO} from "../../dtos/DTO's";


@Component({
  selector: 'app-work-experience-form',
  templateUrl: './work-experience-form.component.html',
  styleUrls: ['./work-experience-form.component.scss']
})
export class WorkExperienceFormComponent implements OnChanges{
  @Input() visible: boolean=false;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() workExperienceData: WorkExperienceFormDTO | undefined;
  formData: FormGroup;

  close() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['workExperienceData'] && changes['workExperienceData'].currentValue) {
      console.log(this.workExperienceData);

      this.formData.get('companyName')?.setValue(this.workExperienceData?.companyName);
      this.formData.get('currentlyWorking')?.setValue(this.workExperienceData?.currentlyWorkingHere);
      if (this.workExperienceData?.endDate){
        let endDate = new Date(this.workExperienceData.endDate);
        if (!isNaN(endDate.getTime())) {
          this.formData.get('endDate')?.setValue(endDate.toISOString().split('T')[0]);
        }
        else {
          console.log('Invalid date', this.workExperienceData.endDate);
        }
      }

      this.formData.get('startDate')?.setValue(this.workExperienceData?.startDate);
      this.formData.get('jobTitle')?.setValue(this.workExperienceData?.jobTitle);
      this.formData.get('employmentType')?.setValue(this.workExperienceData?.employmentType);
      this.formData.get('jobDescription')?.setValue(this.workExperienceData?.jobDescription);
      this.formData.get('location')?.setValue(this.workExperienceData?.location)
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
    jobDescription: 'test',
    jobTitle: 'Data Scientist',
    location: 'San Francisco, CA',
    startDate: new Date()
  };
  onSubmit() {
      this.workExperienceService.addUserWorkExperience(this.userStore.getUser.uid,this.newWorkExperience)
  }
}
