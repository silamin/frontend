import {ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {JobServiceService} from "../../../services/job-service.service";
import {UserStore} from "../../../stores/UserStore";
import {UserService} from "../../../services/user.service";



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
  isApplied = false;

  ngOnChanges() {
    this.isApplied = false;
    if (this.selectedJob) {
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

      this.userService.getAppliedJobIds(this.user.uid).then((response) =>{
        if (response.includes(this.jobForm.get('id')?.value.toString())){
          this.isApplied = true;
        }
      })
      this.selectedJobChange.emit(this.selectedJob);
    }
  }
  ngOnInit() {
    this.userStore.user$.subscribe(user => {
      if (user) {
        this.user = user;
      }
    })
  }

  jobForm: FormGroup;
  @Input() isPopUp: boolean = false;

  close() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }

  constructor(private fb: FormBuilder,
              private jobService: JobServiceService,
              private userStore: UserStore,
              private userService: UserService,
              private changeDetectorRef: ChangeDetectorRef) {
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
  user:any;

  submitJobForm() {
    this.jobForm.get('userId')?.setValue(this.user.uid)
    this.jobService.addJob(this.jobForm.value)
  }

  onApply() {
    this.jobService.apply(this.jobForm.get('id')?.value, this.user.uid);
    this.isApplied = true;
    this.changeDetectorRef.detectChanges();
  }
}
