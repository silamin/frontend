import {Component, Inject, Injector, Input, OnInit, ProviderToken, ViewChild} from '@angular/core';
import {UserStore} from "../../stores/UserStore";
import {Observable} from "rxjs";
import {UserDTO, WorkExperienceFormDTO} from "../../dtos/DTO's";
import { of } from 'rxjs';
import {FormFactoryProviderService} from "../../services/factories/form-factory-provider.service";
import {WorkExperienceFormComponent} from "../../components/work-experience-form/work-experience-form.component";
import {SkillFormComponent} from "../../components/skill-form/skill-form.component";
import {EducationFormComponent} from "../../components/education-form/education-form.component";
import {LanguageFormComponent} from "../../components/language-form/language-form.component";
import {HasForm} from "../../services/factories/FormFactory";
import {FormBuilder} from "@angular/forms";
import {SectionService} from "../../services/section-service";
import { WORK_EXPERIENCE_SERVICE_TOKEN, EDUCATION_SERVICE_TOKEN, SKILLS_SERVICE_TOKEN, LANGUAGE_SERVICE_TOKEN } from '../../services/tokens';



interface Section {
  title: string;
  items: Observable<any[]>;
  displayProperty: string[];
}

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit{
  @Input() user: any;
  @ViewChild('workExperienceForm') workExperienceForm!: WorkExperienceFormComponent;
  @ViewChild('skillForm') skillForm!: SkillFormComponent;
  @ViewChild('educationForm') educationForm!: EducationFormComponent;
  @ViewChild('languageForm') languageForm!: LanguageFormComponent;

  items: Observable<any>[] = [];
  showMore = {};
  public showMoreUserInfo = true;
  toggleShowMore() {
    this.showMoreUserInfo = !this.showMoreUserInfo;
  }
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
    @Inject(WORK_EXPERIENCE_SERVICE_TOKEN) private workExperienceService: SectionService,
    @Inject(EDUCATION_SERVICE_TOKEN) private educationService: SectionService,
    @Inject(SKILLS_SERVICE_TOKEN) private skillsService: SectionService,
    @Inject(LANGUAGE_SERVICE_TOKEN) private languageService: SectionService,
    private userStore: UserStore,
     private formFactoryProvider: FormFactoryProviderService,
    private formBuilder: FormBuilder,
    private injector: Injector
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
  isCompanyUser!: boolean;
  userData!: UserDTO;
  async ngOnInit() {
    this.createUserInfoFormGroup()
    this.userStore.userData$.subscribe(userData => {
      if (userData){
        this.userData = userData;
        this.socialMediaKeys = Object?.keys(this.userData.socialMediaProfiles);
        this.isCompanyUser = userData.isCompanyUser
      }

    })
    this.userStore.user$.subscribe(async siUser => {
      if (!siUser.isCompanyUser) {
        this.user = siUser;
        this.workExperiences$ = await this.workExperienceService.fetchData(this.user?.uid);

        this.sections = [
          {
            title: 'Work Experience',
            items: this.workExperiences$,
            displayProperty: ['jobTitle']
          },
          {
            title: 'Education',
            items: this.educationService.fetchData(this.user?.uid),
            displayProperty: ['degree']
          },
          {
            title: 'Skills',
            items: this.skillsService.fetchData(this.user?.uid),
            displayProperty: ['skill']
          },
          {
            title: 'Languages',
            items: this.languageService.fetchData(this.user?.uid),
            displayProperty: ['language']
          }
        ];
      }else {
        this.sections = [
          {
            title: 'Work Experience',
            items: this.user.workExperience,
            displayProperty: ['jobTitle']
          },
          {
            title: 'Education',
            items: this.user.education,
            displayProperty: ['degree']
          },
          {
            title: 'Skills',
            items: this.user.skills,
            displayProperty: ['skill']
          },
          {
            title: 'Languages',
            items: this.user.languages,
            displayProperty: ['language']
          }
        ];
      }

    })

  }
  getDisplayPropertiesBrief(item: any, sectionTitle: string): string {
    let str = '';

    switch (sectionTitle) {
      case 'Work Experience':
        str += `As a ${item.jobTitle} at ${item.companyName}, located in ${item.location}, `;
        str += `I work on a ${item.employmentType} basis. `;

        if(item.currentlyWorkingHere) {
          str += `I'm currently employed here. `;
        } else if(item.endDate) {
          const endDate = new Date(item.endDate.seconds * 1000);
          str += `My employment ended on ${endDate.toLocaleDateString()}. `;
        }

        str += `During my time here, my responsibilities included: ${item.jobDescription}. `;
        break;

      case 'Education':
        const startDate = item.startDate ? new Date(item.startDate.seconds * 1000) : undefined;
        const endDate = item.endDate ? new Date(item.endDate.seconds * 1000) : undefined;

        str += `I pursued my ${item.degree} in ${item.fieldOfStudy} from the ${item.school}. `;

        if (startDate && endDate) {
          str += `My course began in ${startDate.toLocaleDateString()} and I graduated in ${endDate.toLocaleDateString()} with a grade of ${item.grade}. `;
        }

        str += `During my time at the university, I participated in activities such as ${item.activitiesAndSocieties}. `;

        str += `My notable accomplishments include ${item.description}. `;
        break;
      case 'Skills':


      // add more cases as needed

      default:
        str = 'No information available';
    }

    return str;
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
  @Input() visible: boolean = false ;
  @Input() isPopUp: boolean =false;
  starIndexes: number[] = [0, 1, 2, 3, 4]; // array for 5 star rating system
  formGroup: any;

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
    const section = this.sections.find((section) => section.title === sectionTitle);
    if (section) {
      const serviceToken = this.getServiceToken(sectionTitle);
      const service = this.injector.get<SectionService>(serviceToken);
      service.deleteItem(item, this.user.uid);
    }
  }

  private getServiceToken(sectionTitle: string): ProviderToken<SectionService> {
    switch (sectionTitle) {
      case 'Work Experience':
        return WORK_EXPERIENCE_SERVICE_TOKEN;
      case 'Education':
        return EDUCATION_SERVICE_TOKEN;
      case 'Skills':
        return SKILLS_SERVICE_TOKEN;
      case 'Languages':
        return LANGUAGE_SERVICE_TOKEN;
      default:
        throw new Error('Invalid section title');
    }
  }

  close() {
    this.isPopUp =false
    this.visible = false;
  }
  getDisplayProperties(item: any, displayProperties: string[]): string {
    return displayProperties.map(prop => item[prop]).join(' ');
  }
  editField:any;
  socialMediaKeys: any;

  isEditing(field: string): boolean {
    return this.editField === field;
  }

  startEditing(field: string): void {
    this.editField = field;
  }

  stopEditing(): void {
    // here you would typically have a call to an API to save changes
    // the API call could be different depending on this.editField value
    this.editField = '';
  }

  private createUserInfoFormGroup() {
    this.formGroup = this.formBuilder.group({
      email: [ '', []],
      phoneNumber: [ '', []],
      address: [ '', []],
      social: [ '', []]
    });
  }
}
