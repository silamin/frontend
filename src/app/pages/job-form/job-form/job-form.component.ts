import {ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {JobServiceService} from "../../../services/job-service.service";
import {UserStore} from "../../../stores/UserStore";
import {UserService} from "../../../services/user.service";
import {user} from "@angular/fire/auth";
import {map, Observable} from "rxjs";
import {UserDTO} from "../../../dtos/DTO's";
import {ApplicationService} from "../../../services/application.service";



@Component({
  selector: 'app-job-form',
  templateUrl: './job-form.component.html',
  styleUrls: ['./job-form.component.scss'],
})
export class JobFormComponent implements OnChanges, OnInit{
  @Input() visible: boolean = false;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() isDisplay = false;
  @Input() selectedJob;
  @Output() selectedJobChange = new EventEmitter<any>();
  @Input() userId ;
  isApplied = false;
  applications:any

  ngOnChanges() {
    this.isApplied = false;
    if (this.selectedJob && this.applications) { // Check if applications is defined
      this.jobForm.get('id')?.setValue(this.selectedJob?.id);
      this.jobForm.get('jobTitle')?.setValue(this.selectedJob?.jobTitle);
      this.jobForm.get('workplace')?.setValue(this.selectedJob?.workplace);
      this.jobForm.get('workType')?.setValue(this.selectedJob?.workType);
      this.jobForm.get('startDate')?.setValue(this.selectedJob?.startDate);
      this.jobForm.get('deadline')?.setValue(this.selectedJob?.deadline);
      this.jobForm.get('jobResponsibilities')?.setValue(this.selectedJob?.jobResponsibilities);
      this.jobForm.get('jobDescription')?.setValue(this.selectedJob?.jobDescription);
      this.jobForm.get('backgroundSkills')?.setValue(this.selectedJob?.backgroundSkills);
      this.jobForm.get('jobBenefits')?.setValue(this.selectedJob?.jobBenefits);
      this.isApplied = this.applications.some(application => application.jobId === this.jobForm.get('id')?.value);

      this.selectedJobChange.emit(this.selectedJob);
    }
  }

  ngOnInit() {
    if (!this.userId){
      this.userId = this.userStore.userId$.getValue();
    }
    if (this.userId){
      let userData$: Observable<UserDTO> = this.userService.getUserById(this.userId);
      userData$.subscribe(async userData => {
        this.applicationService.getAllApplications(this.userId).subscribe(applications => {
          this.applications = applications;
          this.isApplied = this.applications.some(application => application.jobId === this.jobForm.get('id')?.value)
        })
      })}
       };


  jobForm: FormGroup;
  @Input() isPopUp: boolean = false;

  close() {
    this.visible = false;
    this.isEdit = false;
    this.selectedJob = null;
    this.visibleChange.emit(this.visible);
  }

  constructor(private fb: FormBuilder,
              private jobService: JobServiceService,
              private userStore: UserStore,
              private userService: UserService,
              private applicationService: ApplicationService) {
    this.jobForm = this.fb.group({
      id: ['', Validators.required],
      jobTitle: ['', Validators.required],
      workplace: ['', Validators.required],
      workType: ['', Validators.required],
      startDate: [''],
      deadline: [''],
      jobDescription: ['', Validators.required],
      jobResponsibilities: ['', Validators.required],
      backgroundSkills: ['', Validators.required],
      jobBenefits: ['', Validators.required],
      userId: ['', Validators.required]
    });
  }

  submitJobForm() {
    console.log(this.isEdit)
    if (!this.isEdit) {
      this.jobForm.get('userId')?.setValue(this.userId)
      this.jobService.addJob(this.jobForm.value)
    } else {
      this.jobService.editJob(this.jobForm.value);
    }
    this.close()
  }
  @Input() isEdit: boolean = false;
  onApply() {
    if (this.isApplied){
      this.applicationService.withdrawApplication(this.jobForm.get('id')?.value, this.userId).then(()=>{
        this.isApplied = false;
      });
    }else {
      this.applicationService.startProcess(this.jobForm.get('id')?.value, this.userId).then(()=>{
        this.isApplied = true;

      });
      }
  }
}
