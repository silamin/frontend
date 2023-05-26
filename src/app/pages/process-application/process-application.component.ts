import {Component, OnInit} from '@angular/core';
import {ApplicationDTO} from "../../dtos/DTO's";
import {ApplicationService} from "../../services/application.service";
import {ActivatedRoute} from "@angular/router";
import firebase from "firebase/compat/app";
import {UserService} from "../../services/user.service";


interface Resource {
  name: string;
  url: string;
}

@Component({
  selector: 'app-process-application',
  templateUrl: './process-application.component.html',
  styleUrls: ['./process-application.component.scss']
})
export class ProcessApplicationComponent implements OnInit{
  userId!: string;
  jobId!: string;
  isEditingNotes = false;
  textareaHeight = 150; // Adjust the desired height in pixels
  selectedUser: any;


  toggleEditNotes() {
    this.isEditingNotes = !this.isEditingNotes;
  }
  resources: Resource[] = [];
  newResourceName: string = '';
  newResourceUrl: string = '';
  convertedDate: string | null | undefined;

  addResource() {
    if (this.newResourceName && this.newResourceUrl) {
      const newResource: Resource = {
        name: this.newResourceName,
        url: this.newResourceUrl
      };
      this.resources.push(newResource);
      this.newResourceName = '';
      this.newResourceUrl = '';
    }
  }
  constructor(private applicationService: ApplicationService,
              private route: ActivatedRoute,
              private userService: UserService) {
  }

  deleteResource(resource: Resource) {
    const index = this.resources.indexOf(resource);
    if (index !== -1) {
      this.resources.splice(index, 1);
    }
  }
  invitationText = '';

  useTemplate() {
    this.invitationText = 'Dear [Candidate],\n\nWe are pleased to invite you for an interview at our office for the position of [Job Role]. Please let us know when you are available.\n\nBest Regards,\n[Your Name]';
  }

  clearText() {
    this.invitationText = '';
  }

  sendInvitation() {
    this.applicationService.sendInvitation(this.invitationText, this.applicationData.id);
  }
  applicationData: ApplicationDTO = { id: '1', jobId: '', candidateId: '0', applicationDate: new Date().toDateString() };
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params){
        this.userId = params['cid'];
        this.jobId = params['jid'];
      }
    });

    this.applicationService.getApplicationData(this.userId, this.jobId).subscribe(data =>{
      this.applicationData = data[0];
      this.convertedDate = this.firestoreStringToJSDate(this.applicationData?.applicationDate)?.toDateString();

      console.log(this.applicationData)
    })
    window.onload = () => {
      const steps = document.getElementsByClassName("process-step");
      const progressBar = document.getElementById("process-progress") as HTMLDivElement;

      const stepCompleted = (index: number) => {
        let progress = (index / steps.length) * 100;
        progressBar.style.width = `${progress}%`;
      }

      for (let i = 0; i < steps.length; i++) {
        let step = steps[i];
        let button = step.querySelector("button");

        if (button) {
          button.onclick = () => stepCompleted(i + 1);
        }
      }
    }
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
}
