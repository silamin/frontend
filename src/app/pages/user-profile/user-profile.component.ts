import {
  Component, EventEmitter,
  Inject,
  Injector,
  Input,
  OnChanges,
  OnInit, Output,
  ProviderToken,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {UserStore} from "../../stores/UserStore";
import {Observable} from "rxjs";
import {UserDTO} from "../../interfaces/DTO\'s";
import {FormFactoryProviderService} from "../../services/factories/form-factory-provider.service";
import {WorkExperienceFormComponent} from "../../components/work-experience-form/work-experience-form.component";
import {SkillFormComponent} from "../../components/skill-form/skill-form.component";
import {EducationFormComponent} from "../../components/education-form/education-form.component";
import {LanguageFormComponent} from "../../components/language-form/language-form.component";
import {HasForm} from "../../services/factories/FormFactory";
import {FormArray, FormBuilder} from "@angular/forms";
import {SectionService} from "../../services/section-service";
import { WORK_EXPERIENCE_SERVICE_TOKEN, EDUCATION_SERVICE_TOKEN, SKILLS_SERVICE_TOKEN, LANGUAGE_SERVICE_TOKEN } from '../../services/tokens';
import {UserService} from "../../services/user.service";
import { v4 as uuidv4 } from 'uuid';
import {ToastrService} from "ngx-toastr";
import {UserInfoFormControlNames} from "../../interfaces/control-names";


interface Section {
  title: string;
  items?: Observable<any[]>;
  displayProperty: string[];
}

export interface SocialMediaProfile {
  id: string;
  type: string;
  url: string
}

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit, OnChanges {
  UserInfoFormControlNames = UserInfoFormControlNames;
  @Input() user: any;
  @ViewChild('workExperienceForm') workExperienceForm!: WorkExperienceFormComponent;
  @ViewChild('skillForm') skillForm!: SkillFormComponent;
  @ViewChild('educationForm') educationForm!: EducationFormComponent;
  @ViewChild('languageForm') languageForm!: LanguageFormComponent;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();


  items: Observable<any>[] = [];
  showMore = {};
  public showMoreUserInfo = false;

  toggleShowMore() {
    this.showMoreUserInfo = !this.showMoreUserInfo;
  }
  isWorkExperienceFormVisible = false;
  isEducationFormVisible = false;
  isLanguageFormVisible = false;
  description: string = 'no description';
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
    private injector: Injector,
    private userService: UserService,
    private toastr: ToastrService
  ) {
    this.sections.forEach(section => {
      section.items?.subscribe(data => this.items = data);
    });
  }

  hidePopUp() {
    this.isWorkExperienceFormVisible = false;
    this.isEducationFormVisible = false;
    this.isSkillFormVisible = false;
    this.isLanguageFormVisible = false;
  }

  showMoreItems(sectionTitle: string) {
    this.showMore[sectionTitle] = true;
  }

  showLessItems(sectionTitle: string) {
    this.showMore[sectionTitle] = false;
  }

  userData!: UserDTO;

  async ngOnInit() {
    this.createUserInfoFormGroup();
    if (!this.user) {
      let userId = this.userStore.userId$.getValue();
      if (userId) {
        let userData$: Observable<UserDTO> = await this.userService.getUserById(userId);
        userData$.subscribe(async userData => {
          console.log('silamin')
          this.userData = userData;
          // Check if there are social media profiles in userData
          if (this.userData.socialMediaProfiles && this.socialMediaProfiles.length === 0) {
            console.log(this.userData.socialMediaProfiles)
            // Create a form group for each profile
            this.userData.socialMediaProfiles.forEach(profile => {
              this.addSocialMediaProfile(profile);
            });

            // Set the value for the form array
            this.formGroup.get(UserInfoFormControlNames.SocialMediaProfiles).patchValue(this.userData.socialMediaProfiles);
          }
          if (!userData.isCompanyUser) {
            if (this.sections.length === 0){
              this.sections = [
                {
                  title: 'Work Experience',
                  items: this.workExperienceService.fetchData(this.userData?.id),
                  displayProperty: ['jobTitle']
                },
                {
                  title: 'Education',
                  items: this.educationService.fetchData(this.userData?.id),
                  displayProperty: ['degree']
                },
                {
                  title: 'Skills',
                  items: this.skillsService.fetchData(this.userData?.id),
                  displayProperty: ['skill']
                },
                {
                  title: 'Languages',
                  items: this.languageService.fetchData(this.userData?.id),
                  displayProperty: ['language']
                }
              ];
            }

          }
        });
      }
    }
  }


  getDisplayPropertiesBrief(item: any, sectionTitle: string): string {
    let str = '';

    switch (sectionTitle) {
      case 'Work Experience':
        str += `As a ${item.jobTitle} at ${item.companyName}, located in ${item.location}, `;
        str += `I work on a ${item.employmentType} basis. `;

        if (item.currentlyWorkingHere) {
          str += `I'm currently employed here. `;
        } else if (item.endDate) {
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
    switch (title) {
      case 'Work Experience':
        this.isWorkExperienceFormVisible = true;
        break;
      case 'Skills':
        this.isSkillFormVisible = true;
        break;
      case 'Education':
        this.isEducationFormVisible = true;
        break;
      case 'Languages':
        this.isLanguageFormVisible = true;
    }
  }

  getSlicedItems(items: any[]): any[] {
    return items.length > 3 ? items.slice(0, 3) : items;
  }

  formComponent: HasForm | undefined;
  @Input() visible: boolean = false;
  @Input() isPopUp: boolean = false;
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

  private getFormGroup(sectionTitle: string) {
    switch (sectionTitle) {
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
      try {
        service.deleteItem(item, this.userData.id);
        this.toastr.success('Item deleted successfully!');
      } catch(error) {
          this.toastr.error('An error occurred while deleting the item');
          console.error(error);
        }
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
    this.isPopUp = false
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }

  getDisplayProperties(item: any, displayProperties: string[]): string {
    return displayProperties.map(prop => item[prop]).join(' ');
  }
  editField: any;

  isEditing(field: string): boolean {
    return this.editField === field;
  }
  get socialMediaProfiles(): FormArray {
    return this.formGroup.get(UserInfoFormControlNames.SocialMediaProfiles) as FormArray;
  }

  addSocialMediaProfile(profile: SocialMediaProfile = {id: uuidv4(), type: '', url: ''}): void {
    this.socialMediaProfiles.push(this.formBuilder.group(profile));
  }
  removeSocialMediaProfile(profile: SocialMediaProfile = {id: uuidv4(), type: '', url: ''}): void {
    this.socialMediaProfiles.controls = this.socialMediaProfiles.controls.filter(control => control.value.id !== profile.id);
  }


  startEditing(field: string): void {
    this.editField = field;
    // Populate the form controls with existing data
    this.formGroup.get(UserInfoFormControlNames.Email).setValue(this.userData.email);
    this.formGroup.get(UserInfoFormControlNames.PhoneNumber).setValue(this.userData.phoneNumber);
    if (this.userData.address) {
      this.formGroup.get(UserInfoFormControlNames.Street).setValue(this.userData.address.street);
      this.formGroup.get(UserInfoFormControlNames.City).setValue(this.userData.address.city);
      this.formGroup.get(UserInfoFormControlNames.PostalCode).setValue(this.userData.address.postalCode);
      this.formGroup.get(UserInfoFormControlNames.Country).setValue(this.userData.address.country);
    }
  }

  stopEditing(): void {
    this.editField = '';
  }

  private createUserInfoFormGroup() {
      this.formGroup = this.formBuilder.group({
        [UserInfoFormControlNames.Email]: [this.userData?.email || '', []],
        [UserInfoFormControlNames.PhoneNumber]: [this.userData?.phoneNumber || '', []],
        [UserInfoFormControlNames.Street]: [this.userData?.address?.street || '', []],
        [UserInfoFormControlNames.City]: [this.userData?.address?.city || '', []],
        [UserInfoFormControlNames.PostalCode]: [this.userData?.address?.postalCode || '', []],
        [UserInfoFormControlNames.Country]: [this.userData?.address?.country || '', []],
        [UserInfoFormControlNames.SocialMediaProfiles]: this.formBuilder.array([])
      });
    }
  async updateUserAddress() {
    if (!this.userData.address){
      this.userData.address = {
        city: '',
        country: '',
        postalCode: '',
        street: ''
      };
    }

    this.userData.address.street = this.formGroup.get(UserInfoFormControlNames.Street).value;
    this.userData.address.city = this.formGroup.get(UserInfoFormControlNames.City).value;
    this.userData.address.postalCode = this.formGroup.get(UserInfoFormControlNames.PostalCode).value;
    this.userData.address.country = this.formGroup.get(UserInfoFormControlNames.Country).value;

    try {
      await this.userService.editUser(this.userData);
      this.toastr.success('User address has been successfully updated');
    } catch(error) {
      this.toastr.error('An error occurred while updating user address');
      console.error(error);
    }
  }

  updateUserData() {
    this.userData.email = this.formGroup.get(UserInfoFormControlNames.Email).value;
    this.userData.phoneNumber = this.formGroup.get(UserInfoFormControlNames.PhoneNumber).value;

    // Get the FormArray
    let formArray = this.formGroup.get(UserInfoFormControlNames.SocialMediaProfiles) as FormArray;

    // Update the userData.socialMediaProfiles array
    this.userData.socialMediaProfiles = formArray.value;

    try {
       this.userService.editUser(this.userData);
      this.toastr.success('User data has been successfully updated');
    } catch(error) {
      this.toastr.error('An error occurred while updating user data');
      console.error(error);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['user']) {
      this.sections = [
        {
          title: 'Work Experience',
          items: this.workExperienceService.fetchData(this.user.id),
          displayProperty: ['jobTitle']
        },
        {
          title: 'Education',
          items: this.educationService.fetchData(this.user.id),
          displayProperty: ['degree']
        },
        {
          title: 'Skills',
          items: this.skillsService.fetchData(this.user.id),
          displayProperty: ['skill']
        },
        {
          title: 'Languages',
          items: this.languageService.fetchData(this.user.id),
          displayProperty: ['language']
        }
      ]
      this.sections[0].items?.subscribe(items => {
        console.log('items:', items);
      });
    }
  }

  removeLink(link) {
    this.userService.removeLink(this.userData.id.toString(), link)
    this.removeSocialMediaProfile(link)
  }
}
