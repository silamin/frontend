import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Router, RouterOutlet} from "@angular/router";
import {AuthServiceService} from "./services/auth-service.service";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {UserStore} from "./stores/UserStore";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {UserService} from "./services/user.service";
import {of} from "rxjs";
import {ApplicationService} from "./services/application.service";
import {JobServiceService} from "./services/job-service.service";
import {WorkExperienceService} from "./services/forms-service/work-experience.service";
import {EducationService} from "./services/forms-service/education.service";
import {SkillsService} from "./services/forms-service/skills.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor() {
  }
  async ngOnInit() {
  }
}
