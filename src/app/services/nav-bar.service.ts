import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class NavBarService {
  private activeNavItemIndexSubject = new BehaviorSubject<number>(
    // retrieve the stored value from the LocalStorage if it exists; otherwise, use 0 as the default value
    parseInt(localStorage.getItem('activeNavItemIndex') || '0', 10)
  );

  activeNavItemIndex$ = this.activeNavItemIndexSubject.asObservable();

  setActiveNavItemIndex(index: number) {
    // store the new value in the LocalStorage before updating the subject
    localStorage.setItem('activeNavItemIndex', String(index));
    this.activeNavItemIndexSubject.next(index);
  }

  constructor() { }
}
