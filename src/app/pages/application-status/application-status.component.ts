import {Component, OnInit} from '@angular/core';
import {UserStore} from "../../stores/UserStore";
import {forkJoin, Observable} from "rxjs";
import {UserDTO} from "../../dtos/DTO's";
import {UserService} from "../../services/user.service";
import {ApplicationService} from "../../services/application.service";
import {Timestamp} from "firebase/firestore";
import {switchMap} from "rxjs/operators";
import {JobServiceService} from "../../services/job-service.service";

@Component({
  selector: 'app-application-status',
  templateUrl: './application-status.component.html',
  styleUrls: ['./application-status.component.scss']
})
export class ApplicationStatusComponent implements OnInit{

  userData: any;
  jobData: any;
  applications: any;


  constructor(private userStore: UserStore,
              private userService: UserService,
              private applicationService: ApplicationService,
              private jobService: JobServiceService) { }

  ngOnInit(): void {
    let userId = this.userStore.userId$.getValue();
    if (userId){
      let userData$: Observable<UserDTO> = this.userService.getUserById(userId);
      userData$.subscribe(async userData => {
        this.userData = userData;
        this.applicationService.getAllApplications(this.userData.id.toString())
          .pipe(
            switchMap(applications => {
              this.applications = applications;
              let jobObservables = applications.map(application =>
                this.jobService.getJobById(application.jobId));
              return forkJoin(jobObservables);
            }),
          )
          .subscribe(jobDataArray => {
            console.log(jobDataArray)
            // jobDataArray is an array of job data objects, in the same order as the applications array
            this.applications.forEach((application, index) => {
              application.jobData = jobDataArray[index];
            });
            console.log(this.applications)
          });

      })}
    }

  getStatusClass(status: string) {
    switch(status) {
      case 'Selected':
        return 'text-success';
      case 'Rejected':
        return 'text-danger';
      case 'In-progress':
        return 'text-warning';
      default:
        return '';
    }
  }

  toggleDetails(application: any) {
    application.showDetails = !application.showDetails;
  }

  getFormattedDate(applicationDate: Timestamp) {
    return applicationDate?.toDate().toISOString().substring(0, 16); // Convert Timestamp to Date object
  }
}

