import {Component, OnInit} from '@angular/core';
import {UserStore} from "../../stores/UserStore";
import {UserService} from "../../services/user.service";
import {JobServiceService} from "../../services/job-service.service";
import {JobDto, UserDTO} from "../../dtos/DTO's";
import {forkJoin, Observable, of} from "rxjs";
import {ApplicationService} from "../../services/application.service";
import {ToastrService} from "ngx-toastr";
import {switchMap} from "rxjs/operators";

@Component({
  selector: 'app-likes-jobs',
  templateUrl: './likes-jobs.component.html',
  styleUrls: ['./likes-jobs.component.scss']
})
export class LikesJobsComponent implements OnInit{

  jobs: any[]=[];
  get paginatedJobs(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.jobs!.slice(startIndex, endIndex);
  }
  isCollapsed = {};
  currentPage = 1;
  itemsPerPage = 4;
  isLoading =true;
  user: any;

  constructor(private userStore: UserStore,
              private jobsService: JobServiceService,
              private userService: UserService,
              private applicationService: ApplicationService,
              private toastr: ToastrService) { }

  ngOnInit(): void {
    let userId = this.userStore.userId$.getValue();
    if (userId) {
      this.userService.getUserById(userId).pipe(
        switchMap(userData => {
          this.user = userData;
          if (this.user) {
            return this.jobsService.getLikedJobIds(this.user.id);
          } else {
            return of([]);
          }
        }),
        switchMap(likedJobIds => {
          if (likedJobIds.length) {
            return forkJoin(likedJobIds.map(id => this.jobsService.getJobById(id)));
          } else {
            return of([]);
          }
        }),
        switchMap(jobs => {
          this.jobs = jobs;
          this.jobs?.forEach(job => this.isCollapsed[job.id] = true);
          this.isLoading = false;
          return this.applicationService.getAllApplications();
        })
      ).subscribe(applications => {
        this.jobs?.forEach(job => {
          console.log(job);
          console.log(job.id)
          console.log(this.user.id)
          console.log(applications)
          job.isApplied = applications.some(app => app.jobId === job.id && app.candidateId === this.user.id);
        });
        console.log(this.jobs)
      });
    }
  }



  async onApply(id: number) {
    try {
      await this.applicationService.startProcess(id, this.user.id);
      this.toastr.success('Application started successfully');
    } catch (error) {
      this.toastr.error('An error occurred while starting the application');
    }
  }

  async onDislike(id: number) {
    const index = this.jobs.findIndex(job => job.id === id);
    if (index !== -1) {
      this.jobs.splice(index, 1);
    }
    try {
       await this.jobsService.removeLikedJob(this.user.id, id.toString());
      this.toastr.success('Job successfully removed from your liked jobs', 'Success');
    } catch (error) {
      this.toastr.error('Failed to remove job from your liked jobs. Please try again', 'Error');
    }
  }


  toggleCollapse(id: number) {
    this.isCollapsed[id] = !this.isCollapsed[id];
  }

  onPageChanged(newPage: number) {
    this.currentPage = newPage;
  }

  redirectToProfile() {

  }

  redirectToJobs() {

  }

  onWithdrawApplication(id) {
    this.applicationService.withdrawApplication(id, this.user.id).then(r => {
      // Display success message
      this.toastr.success('Application withdrawn successfully!', 'Success');
    }).catch(error => {
      // Display error message
      this.toastr.error('Failed to withdraw application. Please try again.', 'Error');
    });
  }
}
