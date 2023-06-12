import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {SkillsService} from "../../services/forms-service/skills.service";
import {HasForm} from "../../services/factories/FormFactory";
import {Observable} from "rxjs";
import {UserDTO} from "../../interfaces/DTO\'s";
import {UserStore} from "../../stores/UserStore";
import {UserService} from "../../services/user.service";
import {ToastrService} from "ngx-toastr";
import {SkillsFormControlNames} from "../../interfaces/control-names";

@Component({
  selector: 'app-skill-form',
  templateUrl: './skill-form.component.html',
  styleUrls: ['./skill-form.component.scss']
})
export class SkillFormComponent implements HasForm, OnInit{
  SkillsFormControlNames = SkillsFormControlNames;
  skillForm: FormGroup;
  @Input() data;
  @Output() dataChange = new EventEmitter();
  user!: UserDTO;

  constructor(private fb: FormBuilder,
              private skillsService: SkillsService,
              private userStore: UserStore,
              private userService:UserService,
              private toastr: ToastrService) {
    this.skillForm = this.fb.group({
      [SkillsFormControlNames.Id]: ['',],
      [SkillsFormControlNames.Skill]: ['', Validators.required],
      [SkillsFormControlNames.Rating]: ['', Validators.required],
    });
  }

  onSubmit(): void {
    console.log(this.data)
    if (!this.data){
      this.skillsService.addItem(this.user.id,this.skillForm.value).then(() => {
        this.toastr.success('Skill item added successfully!');
      })
        .catch(error => {
          this.toastr.error('An error occurred while adding the skill item');
        });
    } else {
      try {
        this.skillsService.editItem(this.user.id, this.skillForm.value);
        this.toastr.success('Skill item updated successfully!');
      } catch(error) {
        this.toastr.error('An error occurred while updating the skill item');
      }
    }

    this.close();
    this.data= null
  }

  @Input() visible: boolean=false;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  close() {
    this.data = null;
    this.dataChange.emit(this.data);
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
