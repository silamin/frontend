import {Component, OnInit} from '@angular/core';
import {WorkExperienceService} from "../../services/work-experience.service";
import {UserStore} from "../../stores/UserStore";
import {Observable, take} from "rxjs";
import {WorkExperienceFormDTO} from "../../dtos/DTO's";
import {EducationService} from "../../services/education.service";
import {SkillsService} from "../../services/skills.service";
import {LanguageServiceService} from "../../services/language-service.service";
import {ActivatedRoute} from "@angular/router";
import { of } from 'rxjs';


interface Section {
  title: string;
  items: Observable<any[]>;
  displayProperty: string;
}

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit{
  items: Observable<any>[] = [];
  showMore = {};
  isDisplay = false;
  isWorkExperienceFormVisible = false;
  isEducationFormVisible = false;
  isLanguageFormVisible = false;
  description: string = 'no description';
  editMode: boolean = false;
  workExperiences$: Observable<WorkExperienceFormDTO[]> =of([]);
  sections: Section[] = [];
  isSkillFormVisible = false;
  userId;
  selectedWorkExperience: any;

  constructor(
    private workExperienceService: WorkExperienceService,
    private userStore: UserStore,
    private educationService: EducationService,
    private skillsService: SkillsService,
    private languageService: LanguageServiceService,
    private route: ActivatedRoute
  ) {
    this.sections.forEach(section => {
      section.items.subscribe(data => this.items = data);
    });
  }
  hidePopUp() {
    this.isWorkExperienceFormVisible = false;
  }
  showMoreItems(sectionTitle: string) {
    this.showMore[sectionTitle] = true;
  }
  showLessItems(sectionTitle: string) {
    this.showMore[sectionTitle] = false;
  }

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
    ];
  }

  showPopUp(title: string) {
    switch (title){
      case 'Work Experience': this.isWorkExperienceFormVisible = true; this.selectedWorkExperience = {};break;
      case 'Skills': this.isSkillFormVisible = true;break;
      case 'Education': this.isEducationFormVisible = true;break;
      case 'Languages': this.isLanguageFormVisible = true;

      }
  }
  getSlicedItems(items: any[]): any[] {
    return items.length > 3 ? items.slice(0, 3) : items;
  }


  editItem(item: any) {
    this.selectedWorkExperience = item;
    this.isWorkExperienceFormVisible = true;
  }

  deleteItem(item: any, sectionTitle: string) {
    const section = this.sections.find(section => section.title === sectionTitle);
    if (section) {
      section.items.pipe(take(1)).subscribe(items => {
        const updatedItems = items.filter(i => i.id !== item.id);
        section.items = of(updatedItems);
      });
    }
  }
}
