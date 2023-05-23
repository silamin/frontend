import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {LanguageServiceService} from "../../services/language-service.service";
import {HasForm} from "../../services/factories/FormFactory";
import {UserStore} from "../../stores/UserStore";

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
              private userStore: UserStore) {
    this.languageForm = this.fb.group({
      language: ['', Validators.required],
      rating: ['', Validators.required],
    });
  }


  onSubmit() {
    this.languageService.addItem(this.user.uid,{
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
    this.userStore.user$.subscribe(user => {
      this.user = user;
    })
  }
}
