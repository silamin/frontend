import {Component, OnInit} from '@angular/core';
import {UserStore} from "../../stores/UserStore";
import {Observable} from "rxjs";
import {UserDTO} from "../../dtos/DTO's";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-application-status',
  templateUrl: './application-status.component.html',
  styleUrls: ['./application-status.component.scss']
})
export class ApplicationStatusComponent implements OnInit{
  userType!: 'company' | 'regular';

  // Application statuses
  statuses = ['Selected', 'Rejected', 'In-progress'];

  // Mock application data

  applications: any[] = [
    {
      userPicture: 'https://www.gravatar.com/avatar/USER_HASH?s=150',
      applicantName: 'John Doe',
      position: 'Software Developer',
      jobDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit....',
      showDetails: false,
      email: 'john.doe@example.com',
      phoneNumber: '123-456-7890',
      cv: 'path-to-cv',
      summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit....',
      applicationDate: new Date(),
      status: 'Selected',
      editNotes: false,
      notes: '',
      interviewDate: new Date()
    },
    {
      userPicture: 'https://www.gravatar.com/avatar/USER_HASH?s=150',
      applicantName: 'Jane Smith',
      position: 'Front-end Developer',
      jobDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit....',
      showDetails: false,
      email: 'jane.smith@example.com',
      phoneNumber: '987-654-3210',
      cv: 'path-to-cv',
      summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit....',
      applicationDate: new Date(),
      status: 'Pending',
      editNotes: false,
      notes: '',
      interviewDate: new Date()
    },
    // Add more applications here
  ];
  isCompanyUser!: boolean;
  userData: any;


  constructor(private userStore: UserStore,private userService: UserService) { }

  ngOnInit(): void {
    let userId = this.userStore.userId$.getValue();
    if (userId){
      let userData$: Observable<UserDTO> = this.userService.getUserById(userId);
      userData$.subscribe(async userData => {
        this.userData = userData;
        this.userType = this.userData.isCompanyUser ? 'company' : 'regular';
        this.isCompanyUser = this.userData.isCompanyUser;
      })}
    }

  changeStatus(application, newStatus: string) {
    application.status = newStatus;
  }

  saveNotes(application) {
    application.editNotes = false;
  }

  scheduleInterview(application, date: Date) {
    application.interviewDate = date;
  }

  getStatusClass(status: string) {
    switch(status) {
      case 'Selected':
        return 'text-success';
      case 'Rejected':
        return 'text-danger';
      case 'In-progress':
        return 'text-warning';
      default:
        return '';
    }
  }

  toggleDetails(application: any) {
    application.showDetails = !application.showDetails;
  }
}

