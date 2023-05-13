import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {SkillsService} from "../../services/skills.service";

@Component({
  selector: 'app-skill-form',
  templateUrl: './skill-form.component.html',
  styleUrls: ['./skill-form.component.scss']
})
export class SkillFormComponent{
  skillForm: FormGroup;

  constructor(private fb: FormBuilder, private skillsService: SkillsService) {
    this.skillForm = this.fb.group({
      skill: ['', Validators.required],
      rating: ['', Validators.required],
    });
  }

  onSubmit() {
   this.skillsService.addSkill('tTGtgSdVyQSwf8hBO3yUC1dcGBV2',{
     rating: "devOps",
     skill: "4"
   })
  }

  @Input() visible: boolean=false;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  close() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }
}
