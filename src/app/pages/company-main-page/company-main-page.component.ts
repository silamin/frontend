import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import { JobServiceService } from '../../services/job-service.service';
import { UserStore } from '../../stores/UserStore';
import {Observable} from 'rxjs';
import { JobDto, UserDTO} from "../../dtos/DTO's";
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
            job.hasAcceptedCandidate = false; // default value
            this.applicationService.getAllCandidatesByJobId(job.id.toString()).subscribe(candidates => {
              // attach candidates to job
              job.candidates = candidates
              // check if any candidate is accepted
              for (let candidate of candidates) {
                console.log(candidate)
                if (candidate.applicationStatus === 'accepted') {
                  job.hasAcceptedCandidate = true; // set boolean value to true
                  break; // stop processing remaining candidates
                }
              }
            });
          }
          this.jobsToDisplay = jobs;
        });
      });
    } else {
      this.jobsToDisplay = [];
    }
  }
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

  processApplication(candidateId: number, jobId: number) {
    this.router.navigate(['application-process', candidateId,jobId]);
  }

  openJobForm() {
    this.jobPopupVisible = true;
    this.isPopUp = true;
  }

  hideUserProfilePopUp() {
    this.isUserProfileVisible = false;
    this.isPopUp = false;
  }

  insertDefaultText() {
    this.rejectionText = `Dear Candidate,
Thank you for your application.
We regret to inform you that we have chosen not to proceed with your application. The decision was not easy, and there were many qualified applicants for this position.
Thank you again for showing interest in our company. We encourage you to apply for future openings for which you qualify.
Please take some time to learn more about our organization and the opportunities we offer by visiting our job portal.

Best Regards,
Hiring Team`
  }
}
