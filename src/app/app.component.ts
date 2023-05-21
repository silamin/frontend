import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Router, RouterOutlet} from "@angular/router";
import {AuthServiceService} from "./services/auth-service.service";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {UserStore} from "./stores/UserStore";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
    constructor(private authService: AuthServiceService, private afAuth: AngularFireAuth, private userStore: UserStore, private changeDetector: ChangeDetectorRef) {
    }

  async ngOnInit() {
    await this.authService.login('loulou@easv.dk','e50afeed0');
  }
}
