import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {SkillsService} from "../../services/skills.service";
import {HasForm} from "../../services/factories/FormFactory";
import {Observable} from "rxjs";
import {UserDTO} from "../../dtos/DTO's";
import {UserStore} from "../../stores/UserStore";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-skill-form',
  templateUrl: './skill-form.component.html',
  styleUrls: ['./skill-form.component.scss']
})
export class SkillFormComponent implements HasForm, OnInit{
  skillForm: FormGroup;
  @Input() data;
  user: any;

  constructor(private fb: FormBuilder,
              private skillsService: SkillsService,
              private userStore: UserStore,
              private userService:UserService) {
    this.skillForm = this.fb.group({
      skill: ['', Validators.required],
      rating: ['', Validators.required],
    });
  }

  onSubmit() {
   this.skillsService.addItem(this.user.id,{
     rating: this.skillForm.get('rating')?.value,
     skill: this.skillForm.get('skill')?.value
   })
  }

  @Input() visible: boolean=false;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  close() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }

  getForm(): FormGroup {
    return this.skillForm;
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
