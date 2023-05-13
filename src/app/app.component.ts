import {Component, OnInit} from '@angular/core';
import {RouterOutlet} from "@angular/router";
import {AuthServiceService} from "./services/auth-service.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent{
    constructor(authService: AuthServiceService) {
      authService.login('chafik@easv.dk','e50afeed0');
    }
}
