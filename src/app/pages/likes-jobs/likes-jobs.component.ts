import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-likes-jobs',
  templateUrl: './likes-jobs.component.html',
  styleUrls: ['./likes-jobs.component.scss']
})
export class LikesJobsComponent implements OnInit{

  jobs = [
    {id: 1, title: 'Job 1', company: 'Company 1', location: 'Location 1'},
    {id: 2, title: 'Job 2', company: 'Company 2', location: 'Location 2'},
    {id: 3, title: 'Job 2', company: 'Company 2', location: 'Location 2'},
    {id: 4, title: 'Job 2', company: 'Company 2', location: 'Location 2'},
    {id: 5, title: 'Job 2', company: 'Company 2', location: 'Location 2'},
    {id: 6, title: 'Job 2', company: 'Company 2', location: 'Location 2'},
    {id: 7, title: 'Job 2', company: 'Company 2', location: 'Location 2'},
    {id: 8, title: 'Job 2', company: 'Company 2', location: 'Location 2'},
    {id: 9, title: 'Job 2', company: 'Company 2', location: 'Location 2'},
    {id: 10, title: 'Job 2', company: 'Company 2', location: 'Location 2'},

  ];
  get paginatedJobs(): any[] {
    const startIndex = (this.currentPage - 1) * 9;
    const endIndex = startIndex + 9;
    return this.jobs?.slice(startIndex, endIndex);
  }
  isCollapsed = {};
  currentPage = 1;
  itemsPerPage = 9;

  constructor() { }

  ngOnInit(): void {
    // Initialize isCollapsed object with all jobs collapsed
    this.jobs.forEach(job => this.isCollapsed[job.id] = true);
  }

  onApply(id: number) {
    console.log(`Applied for job id ${id}`);
  }

  onDislike(id: number) {
    console.log(`Disliked job id ${id}`);
  }

  toggleCollapse(id: number) {
    this.isCollapsed[id] = !this.isCollapsed[id];
  }

  onPageChanged(newPage: number) {
    this.currentPage = newPage;

  }
}
