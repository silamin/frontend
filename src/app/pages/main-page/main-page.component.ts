import {AfterViewInit, Component, ElementRef, HostListener, OnInit} from '@angular/core';
import {faEdit, faSave} from '@fortawesome/free-solid-svg-icons';

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
  jobs = [
    { jobTitle: 'Job Title 1', description: 'Job Description 1' },
    { jobTitle: 'Job Title 2', description: 'Job Description 2' },
    { jobTitle: 'Job Title 3', description: 'Job Description 3' },
    { jobTitle: 'Job Title 4', description: 'Job Description 3' },
    { jobTitle: 'Job Title 5', description: 'Job Description 3' },
    { jobTitle: 'Job Title 6', description: 'Job Description 3' },
    { jobTitle: 'Job Title 7', description: 'Job Description 3' },
    { jobTitle: 'Job Title 8', description: 'Job Description 3' },
    { jobTitle: 'Job Title 9', description: 'Job Description 3' }
  ];
  selectedJob = null;
  jobPopupVisible = false;
  isDisplay = true;

  constructor() { }

  ngOnInit(): void {
  }

  selectJob(job): void {
    this.selectedJob = job;
    this.jobPopupVisible = true;
  }

  hideJobPopUp() {
    this.jobPopupVisible = false
  }
}
