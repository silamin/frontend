import {AfterViewInit, Component, ElementRef, HostListener, OnInit} from '@angular/core';
import {faEdit, faSave} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent{
  jobs = [
    { title: 'Job Title 1', description: 'Job Description 1' },
    { title: 'Job Title 2', description: 'Job Description 2' },
    { title: 'Job Title 3', description: 'Job Description 3' }
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
