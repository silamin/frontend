import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {SkillsService} from "../../services/skills.service";

@Component({
  selector: 'app-skill-form',
  templateUrl: './skill-form.component.html',
  styleUrls: ['./skill-form.component.scss']
})
export class SkillFormComponent implements OnChanges{
  skillForm: FormGroup;
  @Input() data;

  constructor(private fb: FormBuilder, private skillsService: SkillsService) {
    this.skillForm = this.fb.group({
      skill: ['', Validators.required],
      rating: ['', Validators.required],
    });
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] && changes['data'].currentValue) {
      this.skillForm.get('skill')?.setValue(this.data?.skill);
      this.skillForm.get('rating')?.setValue(this.data?.rating);
    }
  }

  onSubmit() {
   this.skillsService.addSkill('tTGtgSdVyQSwf8hBO3yUC1dcGBV2',{
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
}
