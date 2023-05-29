import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild
} from '@angular/core';
import {JobServiceService} from "../../services/job-service.service";
import {UserStore} from "../../stores/UserStore";
import {SearchService} from "../../services/search.service";
import {combineLatest, Observable, of} from "rxjs";
import {switchMap} from "rxjs/operators";
import {UserService} from "../../services/user.service";
import {UserDTO} from "../../dtos/DTO's";
import {user} from "@angular/fire/auth";

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit, AfterViewInit{
  @ViewChild('scrollable', { static: false }) scrollable!: ElementRef;
  @ViewChild('scrollableContainer') scrollableContainerRef!: ElementRef;
  currentPage = 1;
  likedJobs: any;
  displayedJobs;
  onPageChanged(newPage: number): void {
    this.currentPage = newPage;
    // Add logic to handle fetching or filtering the jobs for the current page
  }
  jobs;
  filteredJobs;
  selectedJob = null;
  jobPopupVisible = true;
  isDisplay = true;
  userData: any;


  constructor(private jobsService: JobServiceService,
              private elementRef: ElementRef,
              private userStore: UserStore,
              private searchService: SearchService,
              private userService: UserService
  ) {
  }

  isScrollableEnd: boolean = false;
  showNoJobsModal: any;

  ngOnInit() {
    this.userStore.userId$
      .pipe(
        switchMap(userId => {
          if (userId) {
            return this.userService.getUserById(userId);
          } else {
            // handle the situation when userId is not available
            // return an appropriate Observable
            // For now, let's return an empty Observable as a placeholder
            return of(null);
          }
        }),
        switchMap(userData => {
          if (userData) {
            this.userData = userData;
           if (!this.userData.likedJobs){
             this.userData.likedJobs = []
           }else {
             this.likedJobs= this.jobsService.getLikedJobIds(userData.id.toString())
           }

            let userId = this.userStore.userId$.getValue();
            if (userId) {
              return combineLatest([
                this.jobsService.getAllJobs(userId, userData.isCompanyUser),
                this.searchService.searchObservable
              ]);
            } else {
              // handle the situation when userId is not available
              // return an appropriate Observable
              // For now, let's return an empty Observable as a placeholder
              return of([]);
            }
          } else {
            // handle the situation when userData is not available
            // return an appropriate Observable
            // For now, let's return an empty Observable as a placeholder
            return of([]);
          }
        })
      )
      .subscribe(([jobs, query]) => {
        if (jobs && this.userData) {

          // The rest of your code...
          this.jobs = jobs;
          this.displayedJobs = jobs; // Initialize displayedJobs to jobs
          console.log(this.displayedJobs)
          this.selectedJob = this.displayedJobs[0]
          this.filterJobs(query);
        }
      });
  }



  onScroll() {
    const element = this.scrollable.nativeElement;
    const { scrollTop, clientHeight, scrollHeight } = element;
    this.isScrollableEnd = scrollTop + clientHeight >= scrollHeight;
  }

  selectJob(job): void {
    this.selectedJob = job;
    this.jobPopupVisible = true;
  }
  get paginatedJobs(): any[] {
    const startIndex = (this.currentPage - 1) * 5;
    const endIndex = startIndex + 5;
    const paginatedJobs = this.displayedJobs?.length > 0 ? this.displayedJobs?.slice(startIndex, endIndex) : [];
    this.showNoJobsModal = paginatedJobs?.length === 0;
    return paginatedJobs;
  }

  hideJobPopUp() {
    this.jobPopupVisible = false
  }

  onSelectedJobChange($event: any) {
    this.selectedJob=$event;
  }
  toggleLove(job: any) {
      const index = this.userData.likedJobs.indexOf(job.id);
      if (index !== -1) {
        this.userData.likedJobs.splice(index, 1);
        this.jobsService.removeLikedJob(this.userData.id, job.id);
      } else {
        this.userData.likedJobs.push(job.id);
        this.jobsService.likeJob(this.userData.id, job.id);
      }
    }

  isJobLiked(jobId: string): boolean {
    return this.userData?.likedJobs?.includes(jobId);
  }


  ngAfterViewInit(): void {
    this.scrollable?.nativeElement?.addEventListener('scroll', this.onScroll.bind(this));
  }


  filterJobs(query: string) {
    const lowerCaseQuery = query.toLowerCase();
    this.filteredJobs = this.jobs.filter(job => {
      const jobTitleMatch = job.jobTitle.toLowerCase().includes(lowerCaseQuery);
      const jobDescriptionMatch = job.jobDescription.toLowerCase().includes(lowerCaseQuery);
      const jobResponsibilitiesMatch = job.jobResponsibilities.toLowerCase().includes(lowerCaseQuery);
      const jobBenefitsMatch = job.jobBenefits.toLowerCase().includes(lowerCaseQuery);
      const workplaceMatch = job.workplace.toLowerCase().includes(lowerCaseQuery);
      const backgroundSkillsMatch = job.backgroundSkills.toLowerCase().includes(lowerCaseQuery);
      return jobTitleMatch || jobDescriptionMatch || jobResponsibilitiesMatch || jobBenefitsMatch || workplaceMatch || backgroundSkillsMatch;
    });
    this.displayedJobs = this.filteredJobs; // Update displayedJobs to filteredJobs
  }

  redirectToProfile() {

  }
}
