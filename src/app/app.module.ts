import {ErrorHandler, NgModule, NgZone, isDevMode} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { SignInComponent } from './pages/sign-in/sign-in.component';
import {RouterModule, Routes} from "@angular/router";
import { NavigationBarComponent } from './components/navigation-bar/navigation-bar.component';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { CompanyPageComponent } from './pages/company-page/company-page.component';
import { ContactCompanyComponent } from './components/company-contact/contact-company/contact-company.component';
import { SkillsCardComponent } from './components/skills-card/skills-card.component';
import { FileInputComponent } from './components/file-input/file-input.component';
import { SelectBoxComponent } from './components/select-box/select-box/select-box.component';
import { NetworkCardComponent } from './components/network-card/network-card/network-card.component';
import { JobFormComponent } from './pages/job-form/job-form/job-form.component';
import { DatePickerComponent } from './components/date-picker/date-picker.component';
import { CompanyMainPageComponent } from './pages/company-main-page/company-main-page.component';
import { WorkExperienceFormComponent } from './components/work-experience-form/work-experience-form.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SkillFormComponent } from './components/skill-form/skill-form.component';
import { FilterCandidatesComponent } from './components/filter-candidates/filter-candidates.component';
import { AppPaginationComponent } from './components/app-pagination/app-pagination.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { EducationFormComponent } from './components/education-form/education-form.component';
import { LikesJobsComponent } from './pages/likes-jobs/likes-jobs.component';
import { ChatComponent } from './pages/chat/chat.component';
import {AngularFireFunctionsModule} from "@angular/fire/compat/functions";
import {AngularFireAuthModule} from "@angular/fire/compat/auth";
import {AngularFireModule} from "@angular/fire/compat";
import {UserStore} from "./stores/UserStore";
import { LanguageFormComponent } from './components/language-form/language-form.component';
import { ApplicationStatusComponent } from './pages/application-status/application-status.component';
import {NgbCollapse} from "@ng-bootstrap/ng-bootstrap";
import {WorkExperienceService} from "./services/forms-service/work-experience.service";
import {EducationService} from "./services/forms-service/education.service";
import {SkillsService} from "./services/forms-service/skills.service";
import {LanguageServiceService} from "./services/forms-service/language-service.service";
import {
  EDUCATION_SERVICE_TOKEN,
  LANGUAGE_SERVICE_TOKEN,
  SKILLS_SERVICE_TOKEN,
  WORK_EXPERIENCE_SERVICE_TOKEN
} from "./services/tokens";
import { ProcessApplicationComponent } from './pages/process-application/process-application.component';
import {ToastrModule, ToastrService} from "ngx-toastr";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {GlobalErrorHandlerService} from "./services/global-error-handler.service";
import {AngularFireMessagingModule} from "@angular/fire/compat/messaging";
import { ServiceWorkerModule } from '@angular/service-worker';
import {firebaseConfig} from "../../firebaseconfig.js";

const routes: Routes = [
  { path: '', component: SignInComponent },
  { path: 'company-main-page', component: CompanyMainPageComponent },
  {path: 'user-main-page', component: MainPageComponent},
  {path:'user-profile', component: UserProfileComponent},
  {path:'liked-jobs', component: LikesJobsComponent},
  {path: 'status', component: ApplicationStatusComponent},
  { path: 'application-process/:cid/:jid', component: ProcessApplicationComponent },

];


@NgModule({
  declarations: [
    AppComponent,
    SignInComponent,
    NavigationBarComponent,
    MainPageComponent,
    CompanyPageComponent,
    ContactCompanyComponent,
    SkillsCardComponent,
    FileInputComponent,
    SelectBoxComponent,
    NetworkCardComponent,
    JobFormComponent,
    DatePickerComponent,
    CompanyMainPageComponent,
    WorkExperienceFormComponent,
    SkillFormComponent,
    FilterCandidatesComponent,
    AppPaginationComponent,
    UserProfileComponent,
    EducationFormComponent,
    LikesJobsComponent,
    ChatComponent,
    LanguageFormComponent,
    ApplicationStatusComponent,
    ProcessApplicationComponent,
  ],
    imports: [
        BrowserModule,
        FormsModule,
        RouterModule.forRoot(routes),
        FontAwesomeModule,
        ToastrModule.forRoot(), // ToastrModule added
      BrowserAnimationsModule,

      ReactiveFormsModule,

        // Add AngularFire and Firebase configurations
        AngularFireModule.initializeApp(firebaseConfig),
        AngularFireAuthModule,
        AngularFireMessagingModule,
        AngularFireFunctionsModule,
        NgbCollapse,
        ServiceWorkerModule.register('ngsw-worker.js', {
          enabled: !isDevMode(),
          // Register the ServiceWorker as soon as the application is stable
          // or after 30 seconds (whichever comes first).
          registrationStrategy: 'registerWhenStable:30000'
        }),
    ],
  providers: [
    UserStore,
    { provide: WORK_EXPERIENCE_SERVICE_TOKEN, useClass: WorkExperienceService },
    { provide: EDUCATION_SERVICE_TOKEN, useClass: EducationService },
    { provide: SKILLS_SERVICE_TOKEN, useClass: SkillsService },
    { provide: LANGUAGE_SERVICE_TOKEN, useClass: LanguageServiceService },
    { provide: ErrorHandler, useClass: GlobalErrorHandlerService },
  ],
  bootstrap: [AppComponent],

})
export class AppModule { }
