import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { LoadEmails } from './core/ngrx/actions/core.actions';
import { map } from 'rxjs/operators';
import { IEmail } from './shared/models/message';

import * as fromRoot from './reducers';
import * as fromCore from './core/ngrx/reducers';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public emails: IEmail[];
  public emailsTotal: number;
  public eamilsLimit: number;
  public eamilsLoading: boolean;
  public eamilsPage: number;

  constructor(private store: Store<fromRoot.State>) {}

  ngOnInit() {
    this.store.pipe(select(fromCore.getAllEmails)).subscribe((emails) => (this.emails = emails));

    this.store
      .pipe(select(fromCore.getTotalEmails))
      .subscribe((total) => (this.emailsTotal = total));

    this.store
      .pipe(select(fromCore.getEmailsLimit))
      .subscribe((limit) => (this.eamilsLimit = limit));

    this.store
      .pipe(select(fromCore.getEmailsLoading))
      .subscribe((loading) => (this.eamilsLoading = loading));

    this.store
      .pipe(select(fromCore.getCurrentEmailsPage))
      .subscribe((page) => (this.eamilsPage = page));

    this.store.dispatch(
      new LoadEmails({
        page: 1
      })
    );
  }

  public onPaginationChange(page: number) {
    this.store.dispatch(new LoadEmails({ page }));
  }
}
