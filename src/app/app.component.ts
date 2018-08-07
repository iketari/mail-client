import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { FormGroup, FormControl } from '@angular/forms';
import { IEmail } from './shared/models/message';

import * as fromRoot from './reducers';
import * as fromCore from './core/ngrx/reducers';
import {
  LoadSearchResults,
  SelectResult,
  ChangeSearchTextQuery
} from './core/ngrx/actions/search.actions';
import { IThreadSearchResult, IParticipant } from './shared/models/search';
import { LoadParticipants } from './core/ngrx/actions/context.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public results: IThreadSearchResult<IEmail>[];
  public selectedThread: IThreadSearchResult<IEmail>;
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
      .subscribe((selected) => (this.selectedThread = selected));

    this.store.dispatch(
      new LoadSearchResults({
        page: 1,
        params: {}
      })
    );
  }

  public onItemSelect(item: IThreadSearchResult<IEmail>) {
    this.store.dispatch(new SelectResult({ id: item.id }));
  }

  public onPaginationChange(page: number) {
    this.store.dispatch(new LoadSearchResults({ page, params: {} }));
  }

  public onSearchChange(query: string) {
    this.store.dispatch(new ChangeSearchTextQuery({ query }));
  }
}
