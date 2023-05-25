import {Component, OnInit, ViewChild} from '@angular/core';
import { JobServiceService } from '../../services/job-service.service';
import { UserStore } from '../../stores/UserStore';
import {catchError, combineLatest, forkJoin, of, take, tap} from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import {JobDto} from "../../dtos/DTO's";
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-company-main-page',
  templateUrl: './company-main-page.component.html',
  styleUrls: ['./company-main-page.component.scss'],
})
export class CompanyMainPageComponent implements OnInit {
  constructor(private jobsService: JobServiceService, private userStore: UserStore,private modalService: NgbModal) { }
  closeResult = '';
  @ViewChild('confirmSelectModal') confirmSelectModal;
  @ViewChild('confirmRejectModal') confirmRejectModal;
  selectedJobIndex!: number;
  selectedCandidateIndex!: number;

  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
        if (content === this.confirmSelectModal) {
          this.selectCandidate(this.selectedJobIndex, this.selectedCandidateIndex);
        } else if (content === this.confirmRejectModal) {
          let candidateId = this.jobsToDisplay[this.selectedJobIndex]?.candidates?.[this.selectedCandidateIndex]?.id;
          if (candidateId !== undefined) {
            this.jobsService.removeCandidate(this.jobsToDisplay[this.selectedJobIndex].id.toString(), candidateId)
              .then(() =>{console.log(this.jobsToDisplay[this.selectedJobIndex].candidates)});
          }          this.jobsToDisplay[this.selectedJobIndex].candidates?.splice(this.selectedCandidateIndex, 1);
        }
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
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
  selectCandidate(jobIndex: number, rowIndex: number) {
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
      const rowBelow = document.getElementById(`row-${jobIndex}-${rowIndex + 1}`);
      if (rowBelow) {
        const rowHeight = rowBelow.offsetHeight;
        rowBelow.style.position = 'relative';
        if (dropdownHeight)
          rowBelow.style.top = `${dropdownHeight + cardHeight - rowHeight}px`;
      }
    }
    this.open(this.confirmSelectModal);

  }
  isPopUp: boolean= false
  selectedUser: any;
  jobPopupVisible = false;
  isEdit = false;
  showMore(selectedUser: any) {
    this.isUserProfileVisible =true
    this.isPopUp=true;
    this.selectedUser = selectedUser
  }

  rejectCandidate(jobIndex: number, rowIndex: number) {
    this.selectedJobIndex = jobIndex;
    this.selectedCandidateIndex = rowIndex;
    this.open(this.confirmRejectModal);
  }

  editJob(job: any) {
    this.isEdit = true;
    this.selectedJob = job;
    this.jobPopupVisible = true;
    console.log(this.isPopUp)
  }

  hideJobPopUp() {
    this.jobPopupVisible = false;
  }

  onSelectedJobChange($event: any) {
    this.selectedJob = $event;
  }

  deleteJob(job: JobDto) {
    this.jobsService.removeJob(job.id.toString());
  }

  navigateToJobCreation() {

  }
}
