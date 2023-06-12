import {ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {JobServiceService} from "../../../services/job-service.service";
import {UserStore} from "../../../stores/UserStore";
import {UserService} from "../../../services/user.service";
import { Observable} from "rxjs";
import {UserDTO} from "../../../interfaces/DTO\'s";
import {ApplicationService} from "../../../services/application.service";
import {ToastrService} from "ngx-toastr";
import {JobFormControlNames} from "../../../interfaces/control-names";



@Component({
  selector: 'app-job-form',
  templateUrl: './job-form.component.html',
  styleUrls: ['./job-form.component.scss'],
})
export class JobFormComponent implements OnChanges, OnInit{
  JobFormControlNames = JobFormControlNames;
  @Input() visible: boolean = false;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() isDisplay = false;
  @Input() selectedJob;
  @Output() selectedJobChange = new EventEmitter<any>();
  @Input() userId ;
  isApplied = false;
  applications:any
  isLoading: boolean = false;


  ngOnChanges() {
    this.isApplied = false;
    if (this.selectedJob) { // Check if applications is defined
      this.jobForm.get(JobFormControlNames.Id)?.setValue(this.selectedJob?.id);
      this.jobForm.get(JobFormControlNames.JobTitle)?.setValue(this.selectedJob?.jobTitle);
      this.jobForm.get(JobFormControlNames.Workplace)?.setValue(this.selectedJob?.workplace);
      this.jobForm.get(JobFormControlNames.WorkType)?.setValue(this.selectedJob?.workType);
      this.jobForm.get(JobFormControlNames.StartDate)?.setValue(this.selectedJob?.startDate);
      this.jobForm.get(JobFormControlNames.Deadline)?.setValue(this.selectedJob?.deadline);
      this.jobForm.get(JobFormControlNames.JobResponsibilities)?.setValue(this.selectedJob?.jobResponsibilities);
      this.jobForm.get(JobFormControlNames.JobDescription)?.setValue(this.selectedJob?.jobDescription);
      this.jobForm.get(JobFormControlNames.BackgroundSkills)?.setValue(this.selectedJob?.backgroundSkills);
      this.jobForm.get(JobFormControlNames.JobBenefits)?.setValue(this.selectedJob?.jobBenefits);
      this.isApplied = this.applications?.some(application => application.jobId === this.jobForm.get(JobFormControlNames.Id)?.value);

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
          this.isApplied = this.applications.some(application => application.jobId === this.jobForm.get(JobFormControlNames.Id)?.value)
        })
      })}
       };


  jobForm: FormGroup;
  @Input() isPopUp: boolean = false;

  close() {
    this.visible = false;
    this.isEdit = false;
    this.selectedJob = null;
    this.jobForm.reset();
    this.visibleChange.emit(this.visible);
  }

  constructor(private fb: FormBuilder,
              private jobService: JobServiceService,
              private userStore: UserStore,
              private userService: UserService,
              private applicationService: ApplicationService,
              private changeDetector: ChangeDetectorRef,
              private toastr: ToastrService) {
    this.jobForm = this.fb.group({
      [JobFormControlNames.Id]: ['', Validators.required],
      [JobFormControlNames.JobTitle]: ['', Validators.required],
      [JobFormControlNames.Workplace]: ['', Validators.required],
      [JobFormControlNames.WorkType]: ['', Validators.required],
      [JobFormControlNames.StartDate]: [''],
      [JobFormControlNames.Deadline]: [''],
      [JobFormControlNames.JobDescription]: ['', Validators.required],
      [JobFormControlNames.JobResponsibilities]: ['', Validators.required],
      [JobFormControlNames.BackgroundSkills]: ['', Validators.required],
      [JobFormControlNames.JobBenefits]: ['', Validators.required],
      [JobFormControlNames.UserId]: ['', Validators.required]
    });
  }

  submitJobForm() {
    if (!this.isEdit) {
      this.jobForm.get(JobFormControlNames.UserId)?.setValue(this.userId)
      this.jobService.addJob(this.jobForm.value)
    } else {
      this.jobService.editJob(this.jobForm.value);
    }
    this.close()
  }
  @Input() isEdit: boolean = false;
  onApply() {
    this.isLoading = true;
    if (this.isApplied) {
      this.applicationService.withdrawApplication(this.jobForm.get(JobFormControlNames.Id)?.value, this.userId).then(() => {
        this.toastr.success('Application withdrawn successfully');
      }).catch(error => {
        this.toastr.error('Error while withdrawing application');
      }).finally(() => {
        this.isApplied = false;
        this.isLoading = false;
        this.changeDetector.detectChanges();  // add this line
      });
    } else {
      this.applicationService.startProcess(this.jobForm.get(JobFormControlNames.Id)?.value, this.userId).then(() => {
        this.toastr.success('Application started successfully');
      }).catch(error => {
        this.toastr.error('Error while starting application');
      }).finally(() => {
        this.isApplied = true;
        this.isLoading = false;
        this.changeDetector.detectChanges();  // add this line
      });
    }
  }



}
