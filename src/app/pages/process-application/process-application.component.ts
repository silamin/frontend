import {Component, OnInit, ViewChild} from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ApplicationService } from "../../services/application.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ApplicationDTO, ScheduleDto} from "../../interfaces/DTO\'s";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Timestamp} from "firebase/firestore";
import {ApplicationFormControlNames} from "../../interfaces/control-names";

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
      date = Timestamp.now();
      location= '';
    };
    applicationDate = Timestamp.now();
    candidateId = '';
    id = 0;
    invitation = '';
    jobId = '0';
  };

  isEditingNotes = false;
  textareaHeight = 150; // Adjust the desired height in pixels
  resources: Resource[] = [];
  userId!: string;
  jobId!: string;
  convertedDate : string = '';

  constructor(
    private formBuilder: FormBuilder,
    private applicationService: ApplicationService,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private router: Router
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
      [ApplicationFormControlNames.InvitationText]: [''],
      [ApplicationFormControlNames.InterviewLocation]: [''],
      [ApplicationFormControlNames.InterviewDate]: [''],
      [ApplicationFormControlNames.NewResourceName]: [''],
      [ApplicationFormControlNames.NewResourceUrl]: [''],
      [ApplicationFormControlNames.Notes]: [{ value: '', disabled: !this.isEditingNotes }]
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
        console.log(data[0].scheduling?.date)
        this.applicationData = data[0];

        this.resources = this.applicationData.resources || [];
        const interviewDate = this.applicationData.scheduling?.date?.toDate(); // Convert Timestamp to Date object
        const formattedInterviewDate = interviewDate?.toISOString().substring(0, 16); // Format as "yyyy-MM-ddThh:mm"

        this.applicationForm.patchValue({
          invitationText: this.applicationData.invitation,
          interviewLocation: this.applicationData.scheduling?.location, // Added '?.' operator
          interviewDate: formattedInterviewDate,
          notes: this.applicationData.notes
        });
      }
      const interviewDate = this.applicationData.applicationDate?.toDate(); // Convert Timestamp to Date object
      this.convertedDate = interviewDate?.toISOString().substring(0, 16)
    });
  }

  toggleEditNotes(): void {
    console.log(this.isEditingNotes);
    this.isEditingNotes = !this.isEditingNotes;
    console.log(this.isEditingNotes);

    if (this.isEditingNotes) {
      this.applicationForm.get(ApplicationFormControlNames.Notes)?.enable(); // Enable the form control
    } else {
      this.applicationForm.get(ApplicationFormControlNames.Notes)?.disable(); // Disable the form control
      this.saveNotes(); // Save notes if not in editing mode
    }
  }

  addResource(): void {
    const newResourceName = this.applicationForm.get(ApplicationFormControlNames.NewResourceName)?.value;
    const newResourceUrl = this.applicationForm.get(ApplicationFormControlNames.NewResourceUrl)?.value;

    if (newResourceName && newResourceUrl) {
      const newResource: Resource = {
        name: newResourceName,
        url: newResourceUrl
      };

      this.resources.push(newResource);
      this.applicationService.addResource(newResource, this.applicationData.id);

      this.applicationForm.get(ApplicationFormControlNames.NewResourceName)?.reset();
      this.applicationForm.get(ApplicationFormControlNames.NewResourceUrl)?.reset();
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
    this.applicationForm.get(ApplicationFormControlNames.InvitationText)?.setValue('Dear [Candidate],\n\nWe are pleased to invite you for an interview at our office for the position of [Job Role]. Please let us know when you are available.\n\nBest Regards,\n[Your Name]');
  }

  clearText(): void {
    this.applicationForm.get(ApplicationFormControlNames.InvitationText)?.reset();
  }

  sendInvitation(): void {
    const invitationText = this.applicationForm.get(ApplicationFormControlNames.InvitationText)?.value;
    this.applicationService.sendInvitation(invitationText, this.applicationData.id);
  }

  scheduleInterview(): void {
    const interviewLocation = this.applicationForm.get(ApplicationFormControlNames.InterviewLocation)?.value;
    const interviewDate = this.applicationForm.get(ApplicationFormControlNames.InterviewDate)?.value;

    const interviewData = {
      location: interviewLocation,
      date: new Date(interviewDate)
    };

    this.applicationService.saveInterviewData(this.applicationData.id, interviewData);
  }

  saveNotes(): void {
    const notes = this.applicationForm.get(ApplicationFormControlNames.Notes)?.value;
    this.applicationService.saveData(notes, this.applicationData.id);
  }

  getProgress(): number {
    // Implement the logic to calculate the progress percentage
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
        this.router.navigate(['company-main-page'])
        if (action === 'accept') {
          this.applicationService.acceptCandidate(parseInt(this.jobId), this.userId)
        } else {
          this.applicationService.rejectApplication(parseInt(this.jobId), this.userId)
        }
      } else if (result === 'No'){
      console.log('rejected')}
    }, () => {
      console.log('dismissed');

      // this function will be invoked if the promise is rejected.
      // handle the dismiss action here
    });
  }
}
