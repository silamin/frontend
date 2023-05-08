import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class NavBarService {
  private activeNavItemIndexSubject = new BehaviorSubject<number>(0);
  activeNavItemIndex$ = this.activeNavItemIndexSubject.asObservable();

  setActiveNavItemIndex(index: number) {
    this.activeNavItemIndexSubject.next(index);
  }

  constructor() { }
}
