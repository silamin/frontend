import {action, observable} from 'mobx-angular';
import {Injectable} from "@angular/core";
import {BehaviorSubject, Observable} from "rxjs";
import {UserDTO} from "../dtos/DTO's";

@Injectable()
export class UserStore {
  user$: BehaviorSubject<any> = new BehaviorSubject<any>({});
  userData$: BehaviorSubject<any> = new BehaviorSubject<any>({});


  setUser(user: any) {
    this.user$.next(user); // Use next function to set the user
  }
  setUserData(userData: UserDTO) {
    this.userData$.next(userData); // Use next function to set the user
  }
}
