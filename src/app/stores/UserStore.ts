import {Injectable} from "@angular/core";
import {BehaviorSubject, Observable} from "rxjs";
import {UserDTO} from "../interfaces/DTO\'s";

@Injectable()
export class UserStore {
  userId$: BehaviorSubject<string | null>;

  constructor() {
    // Try to load the user Id from localStorage
    const storedUserId = localStorage.getItem('userId');
    const initialUserId = storedUserId ? storedUserId : null;

    // Initialize the UserId$ observable with the loaded data
    this.userId$ = new BehaviorSubject<string | null>(initialUserId);
  }

  setUserId(userId: string) {
    // Update the UserId$ observable
    this.userId$.next(userId);

    // Also save the user Id in localStorage
    localStorage.setItem('userId', userId);
  }

  clearUserId() {
    // Clear the UserId$ observable
    this.userId$.next(null);

    // Also clear the user Id from localStorage
    localStorage.removeItem('userId');
  }
}
