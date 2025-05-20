// search.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private searchTermSource = new BehaviorSubject<string>('');
  public searchTerm$ = this.searchTermSource.asObservable();

  constructor() { }

  updateSearchTerm(term: string): void {
    this.searchTermSource.next(term);
  }
}
