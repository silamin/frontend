import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { SignInComponent } from './pages/sign-in/sign-in.component';
import {RouterModule, RouterOutlet} from "@angular/router";
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
import { SkillFormComponent } from './components/skill-form/skill-form.component'; // import FontAwesomeModule



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
    SkillFormComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot([]),
    FontAwesomeModule,
    ReactiveFormsModule // add this line to import ReactiveFormsModule

  ],
  providers: [],
  bootstrap: [AppComponent],

})
export class AppModule { }
