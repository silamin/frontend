import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import { JobServiceService } from '../../services/job-service.service';
import { UserStore } from '../../stores/UserStore';
import {catchError, combineLatest, forkJoin, Observable, of, take, tap} from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import {JobDto} from "../../dtos/DTO's";
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Router} from "@angular/router";
import {ApplicationService} from "../../services/application.service";

@Component({
  selector: 'app-company-main-page',
  templateUrl: './company-main-page.component.html',
  styleUrls: ['./company-main-page.component.scss'],
})
export class CompanyMainPageComponent implements OnInit {
  constructor(private jobsService: JobServiceService,
              private userStore: UserStore,
              private modalService: NgbModal,
              private router: Router,
              private cdRef:ChangeDetectorRef,
              private applicationService: ApplicationService) { }
  closeResult = '';
  @ViewChild('confirmSelectModal') confirmSelectModal;
  @ViewChild('confirmRejectModal') confirmRejectModal;

  jobId!: number;
  candidateId!: number;

  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
        if (content === this.confirmSelectModal) {
          result === 'Yes' ? this.applicationService.startProcess(this.jobId, this.candidateId): {};
        } else if (content === this.confirmRejectModal) {
          result === 'Yes' ? this.jobsToDisplay[this.jobId]?.candidates?.splice(this.candidateId, 1) : {};
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
  async ngOnInit() {
    await this.applicationService.fetchSelectedCandidates();
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
  selectedJob: any = null;
  isUserProfileVisible = false;
  selectCandidate(jobIndex: number, rowIndex: number) {
    this.jobId = jobIndex;
    this.candidateId = rowIndex;
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
    this.jobId = jobIndex;
    this.candidateId = rowIndex;
    this.open(this.confirmRejectModal);
  }

  editJob(job: any) {
    this.isEdit = true;
    this.selectedJob = job;
    this.jobPopupVisible = true;
    this.isPopUp = true;
  }

  hideJobPopUp() {
    this.jobPopupVisible = false;
    this.isPopUp = false;
    this.isEdit = false;
    this.selectedJob = null;
    this.cdRef.detectChanges();
  }
  onSelectedJobChange($event: any) {
    this.selectedJob = $event;
  }

  deleteJob(job: JobDto) {
    this.jobsService.removeJob(job.id.toString());
  }

  navigateToJobCreation() {

  }

  processApplication(candidateId: number) {
    this.router.navigate(['application-process', candidateId]);
  }

  isCandidateSelected(candidateId: string, jobId: string): Observable<boolean> {
    this.applicationService.selectedCandidates.subscribe((selectedCandidatesSet) => {
      console.log(selectedCandidatesSet); // Log the set of selected candidates
    });
    return this.applicationService.selectedCandidates.asObservable().pipe(
      map((selectedCandidatesSet) => {
        const candidateJobKey = `${jobId}-${candidateId}`;  // Change the order here
        return selectedCandidatesSet.has(candidateJobKey)
      })
    );
  }

}
