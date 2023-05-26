import {Component, OnInit, ViewChild} from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ApplicationService } from "../../services/application.service";
import { ActivatedRoute } from "@angular/router";
import { UserService } from "../../services/user.service";
import {ApplicationDTO, ScheduleDto} from "../../dtos/DTO's";
import {ModalServiceService} from "../../services/modal-service.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {JobServiceService} from "../../services/job-service.service";

export interface Resource {
  name: string;
  url: string;
}

@Component({
  selector: 'app-process-application',
  templateUrl: './process-application.component.html',
  styleUrls: ['./process-application.component.scss']
})
export class ProcessApplicationComponent implements OnInit {
  applicationForm!: FormGroup;
  applicationData: ApplicationDTO = new class implements ApplicationDTO {
    notes: string='';
    resources: any[]=[];
    scheduling: ScheduleDto= new class implements ScheduleDto {
      date = '';
      location= '';
    };
    applicationDate = '';
    candidateId = '';
    id = 0;
    invitationText = '';
    jobId = '0';
  };

  isEditingNotes = false;
  textareaHeight = 150; // Adjust the desired height in pixels
  resources: Resource[] = [];
  userId!: string;
  jobId!: string;
  convertedDate: string | null | undefined;

  constructor(
    private formBuilder: FormBuilder,
    private applicationService: ApplicationService,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private jobService: JobServiceService
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.initializeData();

    window.onload = () => {
      const steps = document.getElementsByClassName("process-step");
      const progressBar = document.getElementById("process-progress") as HTMLDivElement;

      const stepCompleted = (index: number) => {
        let progress = (index / steps.length) * 100;
        progressBar.style.width = `${progress}%`;
      };

      for (let i = 0; i < steps.length; i++) {
        let step = steps[i];
        let button = step.querySelector("button");

        if (button) {
          button.onclick = () => stepCompleted(i + 1);
        }
      }
    };
  }

  createForm(): void {
    this.applicationForm = this.formBuilder.group({
      invitationText: [''],
      interviewLocation: [''],
      interviewDate: [''],
      newResourceName: [''],
      newResourceUrl: [''],
      notes: ['']
    });
  }

  initializeData(): void {
    this.route.params.subscribe((params) => {
      if (params) {
        this.userId = params['cid'];
        this.jobId = params['jid'];
      }
    });

    this.applicationService.getApplicationData(this.userId, this.jobId).subscribe((data) => {
      if (data && data.length > 0) {
        this.applicationData = data[0];
        this.applicationForm.patchValue({
          invitationText: this.applicationData.invitationText,
          interviewLocation: this.applicationData.scheduling.location, // Populate with correct value
          interviewDate: this.applicationData.scheduling.location,
          notes: this.applicationData.notes
        });
      }
      this.convertedDate = this.firestoreStringToJSDate(this.applicationData?.applicationDate)?.toDateString();
      console.log(this.applicationData)
    });
  }

  toggleEditNotes(): void {
    this.isEditingNotes = !this.isEditingNotes;
    if (!this.isEditingNotes) {
      this.saveNotes();
    }
  }

  addResource(): void {
    const newResourceName = this.applicationForm.get('newResourceName')?.value;
    const newResourceUrl = this.applicationForm.get('newResourceUrl')?.value;

    if (newResourceName && newResourceUrl) {
      const newResource: Resource = {
        name: newResourceName,
        url: newResourceUrl
      };

      this.resources.push(newResource);
      this.applicationService.addResource(newResource, this.applicationData.id);

      this.applicationForm.get('newResourceName')?.reset();
      this.applicationForm.get('newResourceUrl')?.reset();
    }
  }

  deleteResource(resource: Resource): void {
    const index = this.resources.indexOf(resource);
    if (index !== -1) {
      this.resources.splice(index, 1);
      this.applicationService.deleteResource(this.applicationData.id, resource);
    }
  }

  useTemplate(): void {
    this.applicationForm.get('invitationText')?.setValue('Dear [Candidate],\n\nWe are pleased to invite you for an interview at our office for the position of [Job Role]. Please let us know when you are available.\n\nBest Regards,\n[Your Name]');
  }

  clearText(): void {
    this.applicationForm.get('invitationText')?.reset();
  }

  sendInvitation(): void {
    const invitationText = this.applicationForm.get('invitationText')?.value;
    this.applicationService.sendInvitation(invitationText, this.applicationData.id);
  }

  scheduleInterview(): void {
    const interviewLocation = this.applicationForm.get('interviewLocation')?.value;
    const interviewDate = this.applicationForm.get('interviewDate')?.value;

    const interviewData = {
      location: interviewLocation,
      date: new Date(interviewDate)
    };

    this.applicationService.saveInterviewData(this.applicationData.id, interviewData);
  }

  saveNotes(): void {
    const notes = this.applicationForm.get('notes')?.value;
    this.applicationService.saveData(notes, this.applicationData.id);
  }

  firestoreStringToJSDate(dateString: string | undefined): Date | null {
    if (!dateString) {
      return null;
    }

    const timestamp = Date.parse(dateString);
    if (isNaN(timestamp)) {
      return null;
    }

    return new Date(timestamp);
  }

  getProgress(): number {
    // Implement your logic to calculate the progress percentage
    // Return the progress percentage as a number
    return 0;
  }

  @ViewChild('confirmSelectModal', { static: true }) confirmSelectModal: any;
  @ViewChild('confirmRejectModal', { static: true }) confirmRejectModal: any;

  openModal(action: 'accept' | 'reject') {
    let modalRef;
    if (action === 'accept') {
      modalRef = this.modalService.open(this.confirmSelectModal);
    } else if (action === 'reject') {
      modalRef = this.modalService.open(this.confirmRejectModal);
    }

    modalRef.result.then((result) => {
      if (result === 'Yes') {
        // handle the 'Yes' action here
        if (action === 'accept') {
          this.jobService.removeJob(this.jobId)
        } else {
          this.jobService.removeCandidate(this.jobId,this.userId)
          this.jobService.removeLikedJob(this.userId,this.jobId)

        }
      } else {
        // handle the 'No' action here
      }
    }, (reason) => {
      // this function will be invoked if the promise is rejected.
      // handle the dismiss action here
    });
  }
}
