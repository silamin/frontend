import {AfterViewInit, Component, ElementRef, HostListener, OnInit} from '@angular/core';
import {faEdit, faSave} from '@fortawesome/free-solid-svg-icons';
import {JobServiceService} from "../../services/job-service.service";

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent{

  currentPage = 1;

  onPageChanged(newPage: number): void {
    this.currentPage = newPage;
    // Add logic to handle fetching or filtering the jobs for the current page
  }

  navItems = [
    { jobTitle: 'Home', href: '', icon: 'fa-home', active: true },
    { jobTitle: 'Profile', href: '', icon: 'fa-user' },
    { jobTitle: 'Liked jobs', href: '', icon: 'fa-heart' },
    { jobTitle: 'Messages', href: '', icon: 'fa-envelope' },
    { jobTitle: 'Log out', href: '', icon: 'fa-sign-out-alt' },

  ];
  jobs;
  selectedJob = null;
  jobPopupVisible = false;
  isDisplay = true;

  constructor(private jobsService: JobServiceService) {
    this.jobsService.getAllJobs().subscribe(jobs => {
      this.jobs = jobs;
      console.log(jobs);
    });  }


  ngOnInit(): void {
  }

  selectJob(job): void {
    this.selectedJob = job;
    this.jobPopupVisible = true;
  }

  hideJobPopUp() {
    this.jobPopupVisible = false
  }

  onSelectedJobChange($event: any) {
    this.selectedJob=$event;

  }
}
