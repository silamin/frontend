import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener, NgZone,
  OnInit,
  Renderer2,
  ViewChild
} from '@angular/core';
import {faEdit, faSave} from '@fortawesome/free-solid-svg-icons';
import {JobServiceService} from "../../services/job-service.service";

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit, AfterViewInit{
  @ViewChild('scrollableContainer') scrollableContainerRef!: ElementRef;
  isContentOverflowing: boolean = false;

  currentPage = 1;

  onPageChanged(newPage: number): void {
    this.currentPage = newPage;
    // Add logic to handle fetching or filtering the jobs for the current page
  }
  ngAfterViewInit() {


  }
  jobs;
  selectedJob = null;
  jobPopupVisible = true;
  isDisplay = true;

  constructor(private jobsService: JobServiceService, private elementRef: ElementRef,    private ngZone: NgZone
  ) {
    this.jobsService.getAllJobs().subscribe(jobs => {
      this.jobs = jobs;
      console.log(jobs);
      this.onSelectedJobChange(this.jobs[0])

    });  }

  scrollable!: HTMLElement;
  isScrollableEnd: boolean = false;

  ngOnInit() {
    this.scrollable = this.elementRef.nativeElement.querySelector('.scrollable');
    this.scrollable.addEventListener('scroll', this.onScroll.bind(this));  }

  onScroll() {
    const { scrollTop, clientHeight, scrollHeight } = this.scrollable;
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

  }
  toggleLove(job: any) {
    job.loved = !job.loved;
  }
}
