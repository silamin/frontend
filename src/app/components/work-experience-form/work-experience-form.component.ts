import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {WorkExperienceService} from "../../services/forms-service/work-experience.service";
import {UserStore} from "../../stores/UserStore";
import {UserDTO} from "../../interfaces/DTO\'s";
import {HasForm} from "../../services/factories/FormFactory";
import {Observable} from "rxjs";
import {UserService} from "../../services/user.service";
import {ToastrService} from "ngx-toastr";
import {WorkExperienceFormControlNames} from "../../interfaces/control-names";


@Component({
  selector: 'app-work-experience-form',
  templateUrl: './work-experience-form.component.html',
  styleUrls: ['./work-experience-form.component.scss']
})
export class WorkExperienceFormComponent implements HasForm, OnInit{
  WorkExperienceFormControlNames = WorkExperienceFormControlNames;
  @Input() visible: boolean=false;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  formData: FormGroup;
  user!: UserDTO;
  @Input() data;
  @Output() dataChange = new EventEmitter();
  close() {
    this.data = null;
    this.dataChange.emit(this.data);
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }

  getForm(): FormGroup {
    return this.formData;
  }
  constructor(private fb: FormBuilder,
              private workExperienceService: WorkExperienceService,
              private userStore: UserStore,
              private userService: UserService,
              private toastr: ToastrService) {
    this.formData = this.fb.group({
      [WorkExperienceFormControlNames.Id]:[''],
      [WorkExperienceFormControlNames.JobTitle]: [''],
      [WorkExperienceFormControlNames.EmploymentType]: [''],
      [WorkExperienceFormControlNames.CompanyName]: [''],
      [WorkExperienceFormControlNames.Location]: [''],
      [WorkExperienceFormControlNames.StartDate]: [''],
      [WorkExperienceFormControlNames.EndDate]: [''],
      [WorkExperienceFormControlNames.CurrentlyWorking]: [false],
      [WorkExperienceFormControlNames.JobDescription]: ['']
    });
  }
  onSubmit() {
    if (!this.data){
      this.workExperienceService.addItem(this.user.id,this.formData.value)
        .then(() => {
          this.toastr.success('Work Experience added successfully!');
        })
        .catch(error => {
          this.toastr.error('An error occurred while adding the work experience');
          console.error(error);
        });
    }else {
      this.data = this.formData.value
      try {
        this.workExperienceService.editItem(this.user.id, this.data);
        this.toastr.success('Work Experience updated successfully!');
      }catch(error) {
          this.toastr.error('An error occurred while updating the work experience');
        }
    }
    this.close();
    this.data= null
  }

  ngOnInit(): void {
    let userId = this.userStore.userId$.getValue();
    if (userId){
      let userData$: Observable<UserDTO> = this.userService.getUserById(userId);
      userData$.subscribe(async user => {
        if (user){
          this.user = user;
        }
      })
    }
  }
}
