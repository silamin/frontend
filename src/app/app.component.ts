import { Component } from '@angular/core';
import {FireService} from "./fire.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(public fireService: FireService) {
  }
  sendThisMessage: any;
  userName: string = '';
  password: string = '';
}
