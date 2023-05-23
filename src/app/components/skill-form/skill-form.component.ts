import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {SkillsService} from "../../services/skills.service";
import {HasForm} from "../../services/factories/FormFactory";

@Component({
  selector: 'app-skill-form',
  templateUrl: './skill-form.component.html',
  styleUrls: ['./skill-form.component.scss']
})
export class SkillFormComponent implements HasForm{
  skillForm: FormGroup;
  @Input() data;

  constructor(private fb: FormBuilder, private skillsService: SkillsService) {
    this.skillForm = this.fb.group({
      skill: ['', Validators.required],
      rating: ['', Validators.required],
    });
  }

  onSubmit() {
   this.skillsService.addItem('tTGtgSdVyQSwf8hBO3yUC1dcGBV2',{
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
}
