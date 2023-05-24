import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private searchSubject = new BehaviorSubject<string>('');
  public searchObservable = this.searchSubject.asObservable();

  updateSearchQuery(query: string) {
    this.searchSubject.next(query);
  }}
