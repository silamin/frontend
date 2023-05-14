import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {JobServiceService} from "../../../services/job-service.service";



@Component({
  selector: 'app-job-form',
  templateUrl: './job-form.component.html',
  styleUrls: ['./job-form.component.scss'],
})
export class JobFormComponent implements OnChanges{
  @Input() visible: boolean = false;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() isDisplay = false;
  @Input() selectedJob;
  @Output() selectedJobChange = new EventEmitter<any>();

  ngOnChanges() {
    if (this.selectedJob) {
      this.jobForm.get('jobTitle')?.setValue(this.selectedJob?.jobTitle);
      this.jobForm.get('workplace')?.setValue(this.selectedJob?.workplace);
      this.jobForm.get('workType')?.setValue(this.selectedJob?.workType);
      this.jobForm.get('startDate')?.setValue(this.selectedJob?.startDate);
      this.jobForm.get('deadline')?.setValue(this.selectedJob?.deadline);
      this.jobForm.get('jobResponsibilities')?.setValue(this.selectedJob?.jobResponsibilities);
      this.jobForm.get('jobDescription')?.setValue(this.selectedJob?.jobDescription);
      this.jobForm.get('backgroundSkills')?.setValue(this.selectedJob?.backgroundSkills);
      this.jobForm.get('jobBenefits')?.setValue(this.selectedJob?.jobBenefits);
      this.selectedJobChange.emit(this.selectedJob);
    }
  }

  jobForm: FormGroup;
  @Input() isPopUp: boolean = false;

  close() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }

  constructor(private fb: FormBuilder, private jobService: JobServiceService) {
    this.jobForm = this.fb.group({
      jobTitle: ['', Validators.required],
      workplace: ['', Validators.required],
      workType: ['', Validators.required],
      startDate: [''],
      deadline: [''],
      jobDescription: ['', Validators.required],
      jobResponsibilities: ['', Validators.required],
      backgroundSkills: ['', Validators.required],
      jobBenefits: ['', Validators.required]
    });
  }


  submitJobForm() {
    this.jobService.addJob({
      userId: 'SWyg6mbbzeRrayewKprp2XaYhfm1',
      backgroundSkills: "Knowledge in JavaScript, TypeScript, Angular, and NodeJS. Understanding of REST APIs, SQL, and Git version control. Familiarity with Agile methodologies and TDD (Test Driven Development).",
      deadline: "2023-06-30",
      jobBenefits: "Health insurance, Retirement plan, Paid time off, Flexible schedule, Professional development assistance.",
      jobDescription: "Developing front end website architecture, designing user interactions on web pages. You will be responsible for the server side of our web applications and you will also be responsible for developing and integrating the front-end elements into the application.",
      jobResponsibilities: "Developing front end website architecture, designing user interactions on web pages, developing back end website applications, creating servers and databases for functionality, ensuring responsiveness of applications, working alongside graphic designers for web design features.",
      jobTitle: "Full Stack Developer",
      startDate: "2023-07-15",
      workType: "Full-time",
      workplace: "Remote"
    })
  }
}
