import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { FormGroup, FormControl } from '@angular/forms';
import { IEmail } from './shared/models/message';

import * as fromRoot from './reducers';
import * as fromCore from './core/ngrx/reducers';
import { LoadSearchResults, SelectResult, ChangeSearchTextQuery } from './core/ngrx/actions/search.actions';
import { ISearchResult, IParticipant } from './shared/models/search';
import { LoadParticipants } from './core/ngrx/actions/context.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public results: ISearchResult<IEmail>[];
  public selectedEmail: ISearchResult<IEmail>;
  public emailsTotal: number;
  public eamilsLimit: number;
  public eamilsLoading: boolean;
  public eamilsPage: number;

  constructor(private store: Store<fromRoot.State>) {}

  ngOnInit() {
    this.store
      .pipe(select(fromCore.getAllSearchResults))
      .subscribe((results) => (this.results = results));

    this.store
      .pipe(select(fromCore.getTotalSearchResults))
      .subscribe((total) => (this.emailsTotal = total));

    this.store
      .pipe(select(fromCore.getSearchResultsLimit))
      .subscribe((limit) => (this.eamilsLimit = limit));

    this.store
      .pipe(select(fromCore.getSearchResultsLoading))
      .subscribe((loading) => (this.eamilsLoading = loading));

    this.store
      .pipe(select(fromCore.getCurrentSearchResultsPage))
      .subscribe((page) => (this.eamilsPage = page));

    this.store
      .pipe(select(fromCore.getSelectedResult))
      .subscribe((selected) => (this.selectedEmail = selected));

    this.store.dispatch(
      new LoadSearchResults({
        page: 1,
        params: {}
      })
    );
  }

  public onItemSelect(item: ISearchResult<IEmail>) {
    this.store.dispatch(new SelectResult({ id: item.originalItem.id }));
  }

  public onPaginationChange(page: number) {
    this.store.dispatch(new LoadSearchResults({ page, params: {} }));
  }

  public onSearchChange(query: string) {
    this.store.dispatch(new ChangeSearchTextQuery({ query }));
  }

  public getInitials(): string {
    const { from } = this.selectedEmail.originalItem;
    const parts = from.split(' ');
    let result = '';

    if (parts[0] && parts[1]) {
      result = parts[0].charAt(0) + parts[1].charAt(0);
    } else {
      result = from.slice(0, 2);
    }

    return result;
  }

  public stringToColour(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    let colour = '#';
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xff;
      colour += ('00' + value.toString(16)).substr(-2);
    }
    return colour;
  }
}
