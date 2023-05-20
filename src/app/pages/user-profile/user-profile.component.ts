import {Component, OnInit, ViewChild} from '@angular/core';
import {WorkExperienceService} from "../../services/work-experience.service";
import {UserStore} from "../../stores/UserStore";
import {Observable, take} from "rxjs";
import {WorkExperienceFormDTO} from "../../dtos/DTO's";
import {EducationService} from "../../services/education.service";
import {SkillsService} from "../../services/skills.service";
import {LanguageServiceService} from "../../services/language-service.service";
import { of } from 'rxjs';
import {FormFactoryProviderService} from "../../services/factories/form-factory-provider.service";
import {WorkExperienceFormComponent} from "../../components/work-experience-form/work-experience-form.component";
import {SkillFormComponent} from "../../components/skill-form/skill-form.component";
import {EducationFormComponent} from "../../components/education-form/education-form.component";
import {LanguageFormComponent} from "../../components/language-form/language-form.component";
import {HasForm} from "../../services/factories/FormFactory";


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
  @ViewChild('workExperienceForm') workExperienceForm!: WorkExperienceFormComponent;
  @ViewChild('skillForm') skillForm!: SkillFormComponent;
  @ViewChild('educationForm') educationForm!: EducationFormComponent;
  @ViewChild('languageForm') languageForm!: LanguageFormComponent;

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
  data: any;

  constructor(
    private workExperienceService: WorkExperienceService,
    private userStore: UserStore,
    private educationService: EducationService,
    private skillsService: SkillsService,
    private languageService: LanguageServiceService,
     private formFactoryProvider: FormFactoryProviderService,
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
    this.workExperiences$ =  await this.workExperienceService.getAllWorkExperiences(this.userStore.getUser.uid);

    this.sections = [
      {
        title: 'Work Experience',
        items: this.workExperiences$,
        displayProperty: 'jobTitle'
      },
      {
        title: 'Education',
        items: this.educationService.getAllEducationBackground(this.userStore.getUser.uid),
        displayProperty: 'degree'
      },
      {
        title: 'Skills',
        items: this.skillsService.getAllSkills(this.userStore.getUser.uid),
        displayProperty: 'skill'
      },
      {
        title: 'Languages',
        items: this.languageService.getAllLanguages(this.userStore.getUser.uid),
        displayProperty: 'language'
      }
    ];
  }

  showPopUp(title: string) {
    this.resetData(title);
    switch (title){
      case 'Work Experience': this.isWorkExperienceFormVisible = true; this.data = {};break;
      case 'Skills': this.isSkillFormVisible = true;break;
      case 'Education': this.isEducationFormVisible = true;break;
      case 'Languages': this.isLanguageFormVisible = true;
      }
  }
  getSlicedItems(items: any[]): any[] {
    return items.length > 3 ? items.slice(0, 3) : items;
  }
   formComponent: HasForm | undefined;

  resetData(sectionTitle: string) {
    this.getFormGroup(sectionTitle);
    if (this.formComponent) {
      let formGroup = this.formComponent.getForm();
      let formFactory = this.formFactoryProvider.getFormFactory(sectionTitle);
      formFactory.resetForm(formGroup);
    }
  }


  editItem(item: any, sectionTitle: string) {
    this.data = {};
    this.data = item;
    const section = this.sections.find(section => section.title === sectionTitle);
    if (section) {
        this.getFormGroup(section.title)
      if (this.formComponent) {
        let formGroup = this.formComponent.getForm();
        let formFactory = this.formFactoryProvider.getFormFactory(section.title);
        formFactory.populateForm(this.data, formGroup);
      }
    }
  }
  private getFormGroup(sectionTitle: string){
    switch (sectionTitle){
      case 'Work Experience':
        this.isWorkExperienceFormVisible = true;
        this.formComponent = this.workExperienceForm;
        break;
      case 'Skills':
        this.isSkillFormVisible = true;
        this.formComponent = this.skillForm;
        break;
      case 'Languages':
        this.isLanguageFormVisible = true;
        this.formComponent = this.languageForm;
        break;
      case 'Education':
        this.isEducationFormVisible = true;
        this.formComponent = this.educationForm;
        break;
    }
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
