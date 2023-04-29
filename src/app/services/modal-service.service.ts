import { Injectable } from '@angular/core';
import {BehaviorSubject, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ModalServiceService {

  private showModalSource = new Subject<boolean>();
  showModal$ = this.showModalSource.asObservable();

  constructor() {}

  showModal(showModal: boolean) {
    this.showModalSource.next(showModal);
  }
}
