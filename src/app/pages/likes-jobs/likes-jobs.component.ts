import {Component, OnInit} from '@angular/core';
import {UserStore} from "../../stores/UserStore";
import {UserService} from "../../services/user.service";
import {JobServiceService} from "../../services/job-service.service";
import {JobDto, UserDTO} from "../../dtos/DTO's";
import {Observable} from "rxjs";
import {ApplicationService} from "../../services/application.service";

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
  user: any;

  constructor(private userStore: UserStore, private jobsService: JobServiceService, private userService: UserService, private applicationService: ApplicationService) { }

  ngOnInit(): void {
    let userId = this.userStore.userId$.getValue();
    if (userId){
      let userData$: Observable<UserDTO> = this.userService.getUserById(userId);
      userData$.subscribe(async userData => {
        this.user = userData;
          if (this.user){
            this.jobsService.getLikedJobIds(this.user.id).then(async r => {
              if (r){
                for (const id of r) {
                  this.jobs?.push(await this.jobsService?.getJobById(id));
                }
                // Initialize isCollapsed object with all jobs collapsed
                this.jobs?.forEach(job => this.isCollapsed[job.id] = true);
                this.isLoading = false;
              }
            })
          }
        })
    }
  }

  async onApply(id: number) {
      this.applicationService.startProcess(id,parseInt(this.userStore.userId$.getValue()!))
  }

  async onDislike(id: number) {
    const index = this.jobs.findIndex(job => job.id === id);
    if (index !== -1) {
      this.jobs.splice(index, 1);
    }
    await this.jobsService.removeLikedJob(this.user.uid, id.toString());

  }

  toggleCollapse(id: number) {
    this.isCollapsed[id] = !this.isCollapsed[id];
  }

  onPageChanged(newPage: number) {
    this.currentPage = newPage;
  }

  redirectToProfile() {

  }

  redirectToJobs() {

  }
}
