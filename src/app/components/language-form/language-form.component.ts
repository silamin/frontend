import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {LanguageServiceService} from "../../services/language-service.service";

@Component({
  selector: 'app-language-form',
  templateUrl: './language-form.component.html',
  styleUrls: ['./language-form.component.scss']
})
export class LanguageFormComponent implements OnChanges{
  languageForm: FormGroup;
  @Input() data;

  constructor(private fb: FormBuilder, private languageService: LanguageServiceService) {
    this.languageForm = this.fb.group({
      language: ['', Validators.required],
      rating: ['', Validators.required],
    });
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] && changes['data'].currentValue) {
      this.languageForm.get('language')?.setValue(this.data?.language);
      this.languageForm.get('rating')?.setValue(this.data?.rating);
    }
    }

  onSubmit() {
    this.languageService.addLanguage('tTGtgSdVyQSwf8hBO3yUC1dcGBV2',{
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
}
