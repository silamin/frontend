import {action, observable} from 'mobx-angular';
import {Injectable} from "@angular/core";
import {BehaviorSubject, Observable} from "rxjs";

@Injectable()
export class UserStore {
  user$: BehaviorSubject<any> = new BehaviorSubject<any>({});

  setUser(user: any) {
    console.log(user.uid)
    this.user$.next(user); // Use next function to set the user
  }
}
