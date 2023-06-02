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
      this.jobForm.get(JobFormControlNames.id)?.setValue(this.selectedJob?.id);
      this.jobForm.get(JobFormControlNames.jobTitle)?.setValue(this.selectedJob?.jobTitle);
      this.jobForm.get(JobFormControlNames.workplace)?.setValue(this.selectedJob?.workplace);
      this.jobForm.get(JobFormControlNames.workType)?.setValue(this.selectedJob?.workType);
      this.jobForm.get(JobFormControlNames.startDate)?.setValue(this.selectedJob?.startDate);
      this.jobForm.get(JobFormControlNames.deadline)?.setValue(this.selectedJob?.deadline);
      this.jobForm.get(JobFormControlNames.jobResponsibilities)?.setValue(this.selectedJob?.jobResponsibilities);
      this.jobForm.get(JobFormControlNames.jobDescription)?.setValue(this.selectedJob?.jobDescription);
      this.jobForm.get(JobFormControlNames.backgroundSkills)?.setValue(this.selectedJob?.backgroundSkills);
      this.jobForm.get(JobFormControlNames.jobBenefits)?.setValue(this.selectedJob?.jobBenefits);
      this.isApplied = this.applications?.some(application => application.jobId === this.jobForm.get(JobFormControlNames.id)?.value);

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
          this.isApplied = this.applications.some(application => application.jobId === this.jobForm.get(JobFormControlNames.id)?.value)
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
              private applicationService: ApplicationService,
              private changeDetector: ChangeDetectorRef,
              private toastr: ToastrService) {
    this.jobForm = this.fb.group({
      [JobFormControlNames.id]: ['', Validators.required],
      [JobFormControlNames.jobTitle]: ['', Validators.required],
      [JobFormControlNames.workplace]: ['', Validators.required],
      [JobFormControlNames.workType]: ['', Validators.required],
      [JobFormControlNames.startDate]: [''],
      [JobFormControlNames.deadline]: [''],
      [JobFormControlNames.jobDescription]: ['', Validators.required],
      [JobFormControlNames.jobResponsibilities]: ['', Validators.required],
      [JobFormControlNames.backgroundSkills]: ['', Validators.required],
      [JobFormControlNames.jobBenefits]: ['', Validators.required],
      [JobFormControlNames.userId]: ['', Validators.required]
    });
  }

  submitJobForm() {
    if (!this.isEdit) {
      this.jobForm.get(JobFormControlNames.userId)?.setValue(this.userId)
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
      this.applicationService.withdrawApplication(this.jobForm.get(JobFormControlNames.id)?.value, this.userId).then(() => {
        this.toastr.success('Application withdrawn successfully');
      }).catch(error => {
        this.toastr.error('Error while withdrawing application');
      }).finally(() => {
        this.isApplied = false;
        this.isLoading = false;
        this.changeDetector.detectChanges();  // add this line
      });
    } else {
      this.applicationService.startProcess(this.jobForm.get(JobFormControlNames.id)?.value, this.userId).then(() => {
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
