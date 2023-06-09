import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {EducationService} from "../../services/forms-service/education.service";
import {HasForm} from "../../services/factories/FormFactory";
import {UserStore} from "../../stores/UserStore";
import {catchError, Observable} from "rxjs";
import {UserDTO} from "../../interfaces/DTO\'s";
import {UserService} from "../../services/user.service";
import {ToastrService} from "ngx-toastr";
import {EducationFormControlNames} from "../../interfaces/control-names";

@Component({
  selector: 'app-education-form',
  templateUrl: './education-form.component.html',
  styleUrls: ['./education-form.component.scss']
})
export class EducationFormComponent implements HasForm, OnInit{
  EducationFormControlNames = EducationFormControlNames
  @Input() visible: boolean = false;
  @Input() data;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() dataChange = new EventEmitter();


  educationForm: FormGroup;
  user!: UserDTO;

  constructor(private formBuilder: FormBuilder,
              private educationService: EducationService,
              private userStore: UserStore,private userService: UserService,
              private toastr: ToastrService) {
    this.educationForm = this.formBuilder.group({
      [EducationFormControlNames.Id]: ['',[]],
      [EducationFormControlNames.School]: ['',[]],
      [EducationFormControlNames.Degree]: ['',[]],
      [EducationFormControlNames.FieldOfStudy]: ['',[]],
      [EducationFormControlNames.StartDate]: ['',[]],
      [EducationFormControlNames.EndDate]: ['',[]],
      [EducationFormControlNames.Grade]: ['',[]],
      [EducationFormControlNames.ActivitiesSocieties]: ['',[]],
      [EducationFormControlNames.Description]: ['',[]]
    });
  }

  onSubmit(): void {
    console.log(this.data)
    if (!this.data){
      this.educationService.addItem(this.user.id, this.educationForm.value)
        .then(() => {
          this.toastr.success('Education item added successfully!');
        })
        .catch(error => {
          this.toastr.error('An error occurred while adding the education item');
          console.error(error);
        });
    } else {
      try {
        this.educationService.editItem(this.user.id, this.educationForm.value);
        this.toastr.success('Education item updated successfully!');
      } catch(error) {
        this.toastr.error('An error occurred while updating the education item');
        console.error(error);
      }
    }

  this.close();
  }

  close(): void {
    this.data = null;
    this.visible = false;
    this.dataChange.emit(this.data); // emit the new data
    this.visibleChange.emit(this.visible);
  }

  open(): void {
    this.visible = true;
  }

  getForm(): FormGroup {
    return this.educationForm;
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
}}
