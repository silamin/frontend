import {Component, OnInit} from '@angular/core';
import {UserStore} from "../../stores/UserStore";
import {UserService} from "../../services/user.service";
import {JobServiceService} from "../../services/job-service.service";
import {JobDto} from "../../dtos/DTO's";

@Component({
  selector: 'app-likes-jobs',
  templateUrl: './likes-jobs.component.html',
  styleUrls: ['./likes-jobs.component.scss']
})
export class LikesJobsComponent implements OnInit{

  jobs: JobDto[]=[];
  get paginatedJobs(): any[] {
    const startIndex = (this.currentPage - 1) * 9;
    const endIndex = startIndex + 9;
    return this.jobs!.slice(startIndex, endIndex);
  }
  isCollapsed = {};
  currentPage = 1;
  itemsPerPage = 9;
  isLoading =true;

  constructor(private userStore: UserStore, private jobsService: JobServiceService) { }

  ngOnInit(): void {
    this.userStore.user$.subscribe(user =>{
      if (user){
        this.jobsService.getLikedJobIds(user.uid).then(async r => {
          if (r){
            for (const id of r) {
              this.jobs?.push(await this.jobsService.getJobById(id));
            }
            // Initialize isCollapsed object with all jobs collapsed
            this.jobs?.forEach(job => this.isCollapsed[job.id] = true);
            this.isLoading = false;
          }

        })
      }

    })
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
