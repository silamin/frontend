import { Component } from '@angular/core';
import {FireService} from "./fire.service";
import {ModalServiceService} from "./services/modal-service.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(public modalService: ModalServiceService) {
  }
  sendThisMessage: any;
  userName: string = '';
  password: string = '';
}
