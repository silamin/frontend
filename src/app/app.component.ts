import { Component, OnInit } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import {MessagingService} from "./services/messaging.service";
import firebase from "firebase/compat";
import MessagePayload = firebase.messaging.MessagePayload;
import {Observable} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  ngOnInit() {}

}
