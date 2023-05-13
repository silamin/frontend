import { Component } from '@angular/core';

@Component({
  selector: 'app-likes-jobs',
  templateUrl: './likes-jobs.component.html',
  styleUrls: ['./likes-jobs.component.scss']
})
export class LikesJobsComponent {
  likedJobs = [
    {
      jobTitle: 'Job Title 1',
      description: 'Job Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.1',
      image: 'https://via.placeholder.com/150'
    },
    {
      jobTitle: 'Job Title 1',
      description: 'Job Description 1',
      image: 'https://via.placeholder.com/150'
    },
    {
      jobTitle: 'Job Title 1',
      description: 'Job Description 1',
      image: 'https://via.placeholder.com/150'
    },
    {
      jobTitle: 'Job Title 1',
      description: 'Job Description 1',
      image: 'https://via.placeholder.com/150'
    }
    // ... other job objects
  ];
  navItems = [
    { jobTitle: 'Home', href: '', icon: 'fa-home', active: true },
    { jobTitle: 'Profile', href: '', icon: 'fa-user' },
    { jobTitle: 'Liked jobs', href: '', icon: 'fa-heart' },
    { jobTitle: 'Messages', href: '', icon: 'fa-envelope' },
    { jobTitle: 'Log out', href: '', icon: 'fa-sign-out-alt' },

  ];
  currentPage = 1;

  constructor() { }

  ngOnInit(): void {
  }

  dislike(job: any): void {
    // Implement the dislike functionality here
  }

  showMore(job: any): void {
    // Implement the show more functionality here
  }

  applyNow(job: any): void {
    // Implement the apply now functionality here
  }

  onPageChanged(newPage: number): void {
    this.currentPage = newPage;
    // Add logic to handle fetching or filtering the jobs for the current page
  }
}
