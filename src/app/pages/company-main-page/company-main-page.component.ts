import { Component, OnInit } from '@angular/core';
import { JobServiceService } from '../../services/job-service.service';
import { UserStore } from '../../stores/UserStore';
import {catchError, combineLatest, forkJoin, of, take, tap} from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import {JobDto} from "../../dtos/DTO's";
import {error} from "@angular/compiler-cli/src/transformers/util";

@Component({
  selector: 'app-company-main-page',
  templateUrl: './company-main-page.component.html',
  styleUrls: ['./company-main-page.component.scss'],
})
export class CompanyMainPageComponent implements OnInit {
  constructor(private jobsService: JobServiceService, private userStore: UserStore) { }

  itemsPerPage = 3;
  currentPage = 1;
  jobsToDisplay!: JobDto[];

  get paginatedJobs(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.jobsToDisplay.slice(startIndex, endIndex);
  }

  onPageChanged(newPage: number): void {
    this.currentPage = newPage;
  }
  user:any;
  ngOnInit(): void {
    this.userStore.user$.subscribe(user => {
      this.user = user;
      if (user) {
        this.jobsService.getAllJobs(user.uid).pipe(
          switchMap((jobs: any[]) => {
            if (!jobs || jobs.length === 0) {
              return of([]);
            }

            const jobsWithCandidates$ = jobs.map(job => {
              if (!job.candidates || job.candidates.length === 0) {
                return of(job);
              }

              const candidateObservables = job.candidates.map(candidateId =>
                this.jobsService.getCandidateWithDetails(candidateId).pipe(take(1))
              );

              return combineLatest(candidateObservables).pipe(
                map(candidates => ({ ...job, candidates }))
              );
            });

            return forkJoin(jobsWithCandidates$);
          }),
          catchError(err => {
            console.error('Error occurred: ', err);
            return of([]);
          })
        ).subscribe(jobsWithCandidates => {
          this.jobsToDisplay = jobsWithCandidates;
          console.log(this.jobsToDisplay);
        });
      } else {
        this.jobsToDisplay = [];
      }
    });
  }







  candidatesPosition: { top: string, left: string } = { top: '0', left: '0' };
  isVisible = false;
  selectedJob: any = null;
  isUserProfileVisible = false;
  showCandidates(jobIndex: number, rowIndex: number) {
    this.selectedJob = this.jobsToDisplay[jobIndex];
    const card = document.getElementById(`card-${jobIndex}-${rowIndex}`);
    if (card) {
      const cardPosition = card.getBoundingClientRect();
      const dropdownHeight = document.getElementById('candidates-dropdown')?.offsetHeight;
      const cardHeight = card.offsetHeight;
      const cardTop = cardPosition.top;
      const windowHeight = window.innerHeight;
      let dropdownTop = cardTop + cardHeight;
      if (dropdownHeight)
        if (dropdownTop + dropdownHeight > windowHeight) {
          dropdownTop = windowHeight - dropdownHeight;
        }
      this.candidatesPosition = {
        top: `${dropdownTop}px`,
        left: `${cardPosition.left}px`,
      };
      this.isVisible = true;
      const rowBelow = document.getElementById(`row-${jobIndex}-${rowIndex + 1}`);
      if (rowBelow) {
        const rowHeight = rowBelow.offsetHeight;
        rowBelow.style.position = 'relative';
        if (dropdownHeight)
          rowBelow.style.top = `${dropdownHeight + cardHeight - rowHeight}px`;
      }
    }
  }
  isPopUp: boolean= false
  selectedUser: any;
  showMore(selectedUser: any) {
    console.log(selectedUser)
    this.isUserProfileVisible =true
    this.isPopUp=true;
    this.selectedUser = selectedUser
  }
}
