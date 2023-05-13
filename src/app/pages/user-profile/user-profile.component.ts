import {AfterViewInit, Component, OnInit} from '@angular/core';
import {WorkExperienceService} from "../../services/work-experience.service";
import {UserStore} from "../../stores/UserStore";
import {user} from "@angular/fire/auth";
import {map, Observable, of} from "rxjs";
import {WorkExperienceFormDTO} from "../../dtos/DTO's";
import {EducationService} from "../../services/education.service";
import {SkillsService} from "../../services/skills.service";
import {LanguageServiceService} from "../../services/language-service.service";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit{

  constructor(
    private workExperienceService: WorkExperienceService,
    private userStore: UserStore,
    private educationService: EducationService,
    private skillsService: SkillsService,
    private languageService: LanguageServiceService
  ) {
  }
  showMore = {};
  isDisplay = false;
  isWorkExperienceFormVisible = false;
  isEducationFormVisible = false;
  isLanguageFormVisible = false;

  navItems = [
    { jobTitle: 'Home', href: '', icon: 'fa-home', active: true },
    { jobTitle: 'Profile', href: '', icon: 'fa-user' },
    { jobTitle: 'Liked jobs', href: '', icon: 'fa-heart' },
    { jobTitle: 'Messages', href: '', icon: 'fa-envelope' },
    { jobTitle: 'Log out', href: '', icon: 'fa-sign-out-alt' },

  ];


  hidePopUp() {
    this.isWorkExperienceFormVisible = false;
  }


  showMoreItems(sectionTitle: string) {
    this.showMore[sectionTitle] = true;
  }
  showLessItems(sectionTitle: string) {
    this.showMore[sectionTitle] = false;
  }
  workExperiences$: Observable<WorkExperienceFormDTO[]> =of([]);
  sections = [
    {
      title: 'Work Experience',
      items: this.workExperienceService.getAllWorkExperiences('tTGtgSdVyQSwf8hBO3yUC1dcGBV2')
    },
    {
      title: 'Education',
      items: this.educationService.getAllEducationBackground('tTGtgSdVyQSwf8hBO3yUC1dcGBV2')
    },
    {
      title: 'Skills',
      items: this.skillsService.getAllSkills('tTGtgSdVyQSwf8hBO3yUC1dcGBV2')
    },
    {
      title: 'Languages',
      items: this.languageService.getAllLanguages('tTGtgSdVyQSwf8hBO3yUC1dcGBV2')
    }
    // Add more sections as needed
  ];
  isSkillFormVisible = false;

  async ngOnInit() {
    this.workExperiences$ =  await this.workExperienceService.getAllWorkExperiences('tTGtgSdVyQSwf8hBO3yUC1dcGBV2');
  }

  showPopUp(title: string) {
    console.log(title);
    switch (title){
      case 'Work Experience': this.isWorkExperienceFormVisible = true;break;
      case 'Skills': this.isSkillFormVisible = true;break;
      case 'Education': this.isEducationFormVisible = true;break;
      case 'Languages': this.isLanguageFormVisible = true;

      }
  }
  getSlicedItems(items: Observable<any[]> | any[]): Observable<any[]> {
    if (items instanceof Observable) {
      return items.pipe(map(itemsArray => itemsArray.slice(0, 3)));
    } else {
      return of(items.slice(0, 3));
    }
  }

}
