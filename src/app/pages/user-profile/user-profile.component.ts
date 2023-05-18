import {AfterViewInit, Component, OnInit} from '@angular/core';
import {WorkExperienceService} from "../../services/work-experience.service";
import {UserStore} from "../../stores/UserStore";
import {user} from "@angular/fire/auth";
import {map, Observable, of} from "rxjs";
import {WorkExperienceFormDTO} from "../../dtos/DTO's";
import {EducationService} from "../../services/education.service";
import {SkillsService} from "../../services/skills.service";
import {LanguageServiceService} from "../../services/language-service.service";
import {ActivatedRoute} from "@angular/router";

interface Section {
  title: string;
  items: Observable<[]>;
  displayProperty: string
}

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
    private languageService: LanguageServiceService,
    private route: ActivatedRoute
  ) {
  }
  showMore = {};
  isDisplay = false;
  isWorkExperienceFormVisible = false;
  isEducationFormVisible = false;
  isLanguageFormVisible = false;
  description: string = 'no description';
  editMode: boolean = false;


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
  sections: Section[] = [];
  isSkillFormVisible = false;
  userId;

  async ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('id');
    this.workExperiences$ =  await this.workExperienceService.getAllWorkExperiences(this.userId);
    this.sections = [
      {
        title: 'Work Experience',
        items: this.workExperiences$,
        displayProperty: 'jobTitle'
      },
      {
        title: 'Education',
        items: this.educationService.getAllEducationBackground(this.userId),
        displayProperty: 'degree'
      },
      {
        title: 'Skills',
        items: this.skillsService.getAllSkills(this.userId),
        displayProperty: 'skill'
      },
      {
        title: 'Languages',
        items: this.languageService.getAllLanguages(this.userId),
        displayProperty: 'language'
      }
      // Add more sections as needed
    ];
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

  editItem(item: any) {

  }

  deleteItem(item: any) {

  }
}
