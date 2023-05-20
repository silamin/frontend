import {Component, OnInit} from '@angular/core';
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
    constructor(private authService: AuthServiceService, private afAuth: AngularFireAuth, private userStore: UserStore, private router: Router) {
    }

   async ngOnInit() {
    await this.authService.login('loulou@easv.dk','e50afeed0');
    this.afAuth.authState.subscribe(user => {
      if (user) {
        // User is signed in
        const userId = user.uid;
        this.userStore.setUser(user);
        console.log('User ID:', userId);
      } else {
        // User is signed out
        console.log('No user is signed in.');
      }
    });
  }
}
