import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {WorkExperienceService} from "../../services/forms-service/work-experience.service";
import {UserStore} from "../../stores/UserStore";
import {UserDTO, WorkExperienceFormDTO} from "../../dtos/DTO's";
import {HasForm} from "../../services/factories/FormFactory";
import {Observable} from "rxjs";
import {UserService} from "../../services/user.service";


@Component({
  selector: 'app-work-experience-form',
  templateUrl: './work-experience-form.component.html',
  styleUrls: ['./work-experience-form.component.scss']
})
export class WorkExperienceFormComponent implements HasForm, OnInit{
  @Input() visible: boolean=false;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  formData: FormGroup;
  user: any;
  @Input() data;
  close() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }

  getForm(): FormGroup {
    return this.formData;
  }
  constructor(private fb: FormBuilder, private workExperienceService: WorkExperienceService, private userStore: UserStore, private userService: UserService) {
    this.formData = this.fb.group({
      id:[''],
      jobTitle: [''],
      employmentType: [''],
      companyName: [''],
      location: [''],
      startDate: [''],
      endDate: [''],
      currentlyWorking: [false],
      jobDescription: ['']
    });
  }
  onSubmit() {
    if (!this.data){
      this.workExperienceService.addItem(this.user.id,this.formData.value)
    }else {
      this.data = this.formData.value
      this.workExperienceService.editItem(this.user.id, this.data)
    }
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
