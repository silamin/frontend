import {action, observable} from 'mobx-angular';
import {Injectable} from "@angular/core";

@Injectable()
export class UserStore{
  @observable private _user: any;

  @action setUser(user: any) {
    this._user = user;
  }

  get getUser(): any {
    return this._user;
  }
}
