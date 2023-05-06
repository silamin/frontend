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
    { title: 'Home', href: '', icon: 'fa-home', active: true },
    { title: 'Profile', href: '', icon: 'fa-user' },
    { title: 'Liked jobs', href: '', icon: 'fa-heart' },
    { title: 'Messages', href: '', icon: 'fa-envelope' },
    { title: 'Log out', href: '', icon: 'fa-sign-out-alt' },

  ];
  jobs = [
    { title: 'Job Title 1', description: 'Job Description 1' },
    { title: 'Job Title 2', description: 'Job Description 2' },
    { title: 'Job Title 3', description: 'Job Description 3' },
    { title: 'Job Title 4', description: 'Job Description 3' },
    { title: 'Job Title 5', description: 'Job Description 3' },
    { title: 'Job Title 6', description: 'Job Description 3' },
    { title: 'Job Title 7', description: 'Job Description 3' },
    { title: 'Job Title 8', description: 'Job Description 3' },
    { title: 'Job Title 9', description: 'Job Description 3' }
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
