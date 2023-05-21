import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Router, RouterOutlet} from "@angular/router";
import {AuthServiceService} from "./services/auth-service.service";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {UserStore} from "./stores/UserStore";
import {AngularFirestore} from "@angular/fire/compat/firestore";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private authService: AuthServiceService, private firestore: AngularFirestore, private userStore: UserStore, private changeDetector: ChangeDetectorRef) {
  }

  user: any;

  async ngOnInit() {
    await this.authService.login('loulou@easv.dk', 'e50afeed0');

    /*this.userStore.user$.subscribe(user => {
      this.user =user;
    })
    const userDocRef = this.firestore.collection('users').doc(this.user.uid);

    // Set the summary and name fields
    const summary = 'This is a mock summary';
    const name = 'Silamin';

    return userDocRef.update({ summary, name })
      .catch((error) => {
        console.error('Error updating user document:', error);
        throw error;
      });
  }*/
  }
}
