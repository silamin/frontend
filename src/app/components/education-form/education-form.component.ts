import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {EducationService} from "../../services/education.service";
import {HasForm} from "../../services/factories/FormFactory";
import {UserStore} from "../../stores/UserStore";
import {Observable} from "rxjs";
import {UserDTO} from "../../dtos/DTO's";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-education-form',
  templateUrl: './education-form.component.html',
  styleUrls: ['./education-form.component.scss']
})
export class EducationFormComponent implements HasForm, OnInit{
  @Input() visible: boolean = false;
  @Input() data;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  educationForm: FormGroup;
  user: any;

  constructor(private formBuilder: FormBuilder,
              private educationService: EducationService,
              private userStore: UserStore,private userService: UserService) {
    this.educationForm = this.formBuilder.group({
      school: ['',[]],
      degree: ['',[]],
      fieldOfStudy: ['',[]],
      startDate: ['',[]],
      endDate: ['',[]],
      grade: ['',[]],
      activitiesSocieties: ['',[]],
      description: ['',[]]
    });
  }

  onSubmit(): void {
    this.educationService.addItem(this.user.id,{
      activitiesSocieties: "Student Council, Debate Club",
      degree: "Bachelor of Science",
      description: "Managed project timelines and deliverables",
      endDate: new Date("2023-05-31"),
      fieldOfStudy: "Computer Science",
      grade: "A+",
      school: "University of Example",
      startDate: new Date("2020-09-01")
    })
    // Handle form submission
    this.close();
  }

  close(): void {
    this.visible = false;
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
