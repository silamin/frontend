import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild
} from '@angular/core';
import {JobServiceService} from "../../services/job-service.service";
import {UserStore} from "../../stores/UserStore";

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit, AfterViewInit{
  @ViewChild('scrollable', { static: false }) scrollable!: ElementRef;
  @ViewChild('scrollableContainer') scrollableContainerRef!: ElementRef;
  currentPage = 1;
  likedJobIds: any;
  onPageChanged(newPage: number): void {
    this.currentPage = newPage;
    // Add logic to handle fetching or filtering the jobs for the current page
  }
  jobs;
  selectedJob = null;
  jobPopupVisible = true;
  isDisplay = true;
  user: any;

  constructor(private jobsService: JobServiceService,
              private elementRef: ElementRef,
              private userStore: UserStore
  ) {
  }

  isScrollableEnd: boolean = false;

  async ngOnInit() {
    this.userStore.user$.subscribe(async user => {
      if (user) {
        this.user = user;
        this.likedJobIds = await this.jobsService.getLikedJobIds(user.uid);
      }
    });

    await this.jobsService.getAllJobs().subscribe(jobs => {
      this.jobs = jobs;
      console.log(jobs);
      this.onSelectedJobChange(this.jobs[0])
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
    return this.jobs?.slice(startIndex, endIndex);
  }

  hideJobPopUp() {
    this.jobPopupVisible = false
  }

  onSelectedJobChange($event: any) {
    this.selectedJob=$event;
    console.log(this.selectedJob)

  }
  toggleLove(job: any) {
    job.loved = !job.loved;
    const index = this.likedJobIds.indexOf(job.id);
    if (index !== -1) {
      this.likedJobIds.splice(index, 1);
      this.jobsService.removeLikedJob(this.user.uid, job.id);
    } else {
      this.likedJobIds.push(job.id);
      this.jobsService.likeJob(this.user.uid, job.id);
    }
  }
  isJobLiked(jobId: string): boolean {
    return this.likedJobIds.includes(jobId);
  }

  ngAfterViewInit(): void {
    this.scrollable?.nativeElement?.addEventListener('scroll', this.onScroll.bind(this));
  }
}
