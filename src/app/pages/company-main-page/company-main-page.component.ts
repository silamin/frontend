import {ChangeDetectorRef, Component, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import { JobServiceService } from '../../services/job-service.service';
import { UserStore } from '../../stores/UserStore';
import {catchError, combineLatest, forkJoin, Observable, of, take, tap} from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import {ApplicationDto, JobDto, UserDTO} from "../../dtos/DTO's";
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Router} from "@angular/router";
import {ApplicationService} from "../../services/application.service";
import {UserService} from "../../services/user.service";

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
              private applicationService: ApplicationService,
              private userService: UserService) { }
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
          if (result === 'Yes'){
            this.router.navigate(['application-process',this.candidateId, this.jobId])
          }
        } else if (content === this.confirmRejectModal) {
          result === 'Yes' ?
            this.applicationService.rejectApplication(this.jobId, this.candidateId.toString(), this.rejectionText).then(() => {
              this.jobsToDisplay.forEach(job => {
                if (job.id === this.jobId && job.candidates) {
                  job.candidates = job.candidates.filter(candidate => candidate.id !== this.candidateId);
                }
              });
            }): {};
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
  userData:any;
  job

  async ngOnInit() {
    let userId = this.userStore.userId$.getValue();
    if (userId) {
      let userData$: Observable<UserDTO> = this.userService.getUserById(userId);
      userData$.subscribe(async userData => {
        this.userData = userData;
        this.user = userData;
        this.jobsService.getAllJobs(userId!, this.user.isCompanyUser).subscribe(jobs => {
          for (let job of jobs) {
            this.applicationService.getAllCandidatesByJobId(job.id.toString()).subscribe(candidates =>{
              job.candidates = candidates
              console.log(candidates)
            });
          }
          this.jobsToDisplay = jobs;
        });
      });
    } else {
      this.jobsToDisplay = [];
    }
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
  rejectionText ='';
  showMore(selectedUser: any) {
    this.selectedUser = selectedUser
    this.isPopUp=true;
    this.isUserProfileVisible =true
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

  processApplication(candidateId: number, jobId: number) {
    this.router.navigate(['application-process', candidateId,jobId]);
  }

  isCandidateSelected(candidateId: string, jobId: string): Observable<boolean> {
    this.applicationService.selectedCandidates.subscribe((selectedCandidatesSet) => {
    });
    return this.applicationService.selectedCandidates.asObservable().pipe(
      map((selectedCandidatesSet) => {
        const candidateJobKey = `${candidateId}-${jobId}`;  // Change the order here
        return selectedCandidatesSet.has(candidateJobKey)
      })
    );
  }

  openJobForm() {
    this.jobPopupVisible = true;
    this.isPopUp = true;
  }

  getCandidates(job: any) {

  }

  hideUserProfilePopUp() {
    this.isUserProfileVisible = false;
    this.isPopUp = false;
  }
}
