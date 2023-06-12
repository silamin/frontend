import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {LanguageServiceService} from "../../services/forms-service/language-service.service";
import {HasForm} from "../../services/factories/FormFactory";
import {UserStore} from "../../stores/UserStore";
import {Observable} from "rxjs";
import {UserDTO} from "../../interfaces/DTO\'s";
import {UserService} from "../../services/user.service";
import {ToastrService} from "ngx-toastr";
import {LanguageFormControlNames} from "../../interfaces/control-names";

@Component({
  selector: 'app-language-form',
  templateUrl: './language-form.component.html',
  styleUrls: ['./language-form.component.scss']
})
export class LanguageFormComponent implements HasForm, OnInit{
  LanguageFormControlNames = LanguageFormControlNames;
  languageForm: FormGroup;
  @Input() data;
  @Output() dataChange = new EventEmitter();

  user!: UserDTO;

  constructor(private fb: FormBuilder,
              private languageService: LanguageServiceService,
              private userStore: UserStore, private userService: UserService,
              private toastr: ToastrService) {
    this.languageForm = this.fb.group({
      [LanguageFormControlNames.Id]: ['',],
      [LanguageFormControlNames.Language]: ['', Validators.required],
      [LanguageFormControlNames.Rating]: ['', Validators.required],
    });
  }


  onSubmit(): void {
    if (!this.data){
      this.languageService.addItem(this.user.id,this.languageForm.value).then(() => {
          this.toastr.success('Language item added successfully!');
        })
        .catch(error => {
          this.toastr.error('An error occurred while adding the language item');
          console.error(error);
        });
    } else {
      try {
        this.languageService.editItem(this.user.id, this.languageForm.value);
        this.toastr.success('Language item updated successfully!');
      } catch(error) {
        this.toastr.error('An error occurred while updating the language item');
        console.error(error);
      }
    }

    this.close();
    this.data= null
  }

  @Input() visible: boolean=false;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  close() {
    this.data = null;
    this.dataChange.emit(this.data)
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
