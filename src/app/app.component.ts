import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { LoadEmails } from './core/ngrx/actions/core.actions';
import { map } from '../../node_modules/rxjs/operators';
import { IEmail } from './shared/models/email';

import * as fromRoot from './reducers';
import * as fromCore from './core/ngrx/reducers';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public emails: IEmail[];

  constructor(
    private store: Store<fromRoot.State>
  ) {}

  ngOnInit() {
    this.store.pipe(
      select(fromCore.getAllEmails)
    ).subscribe(emails => this.emails = emails)

    this.store.dispatch(new LoadEmails());
  }
}
