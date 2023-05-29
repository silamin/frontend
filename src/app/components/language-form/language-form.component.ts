import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {LanguageServiceService} from "../../services/language-service.service";
import {HasForm} from "../../services/factories/FormFactory";
import {UserStore} from "../../stores/UserStore";
import {Observable} from "rxjs";
import {UserDTO} from "../../dtos/DTO's";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-language-form',
  templateUrl: './language-form.component.html',
  styleUrls: ['./language-form.component.scss']
})
export class LanguageFormComponent implements HasForm, OnInit{
  languageForm: FormGroup;
  @Input() data;
  user: any;

  constructor(private fb: FormBuilder,
              private languageService: LanguageServiceService,
              private userStore: UserStore, private userService: UserService) {
    this.languageForm = this.fb.group({
      language: ['', Validators.required],
      rating: ['', Validators.required],
    });
  }


  onSubmit() {
    this.languageService.addItem(this.user.id,{
      rating: this.languageForm.get('rating')?.value,
      language: this.languageForm.get('language')?.value
    })
  }

  @Input() visible: boolean=false;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  close() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }

  getForm(): FormGroup {
    return this.languageForm;
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
