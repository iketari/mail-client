import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';

import * as fromCore from './../../ngrx/reducers';
import { IParticipant, ISearchQuery } from '../../../shared/models/search';
import { LoadParticipants } from '../../ngrx/actions/context.actions';
import {
  ChangeSearchParticipantsParams,
  ChangeSearchDatesParams
} from '../../ngrx/actions/search.actions';

@Component({
  selector: 'sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  public participants: IParticipant[];
  public selectedFrom: IParticipant;
  public selectedTo: IParticipant[];
  public searchQuery: ISearchQuery;

  constructor(private store: Store<fromCore.State>) {}

  ngOnInit() {
    this.store
      .pipe(select(fromCore.getAllParticipants))
      .subscribe((participants) => (this.participants = participants));

    this.store
      .pipe(select(fromCore.getSelectedFromParticipant))
      .subscribe((participant) => (this.selectedFrom = participant));

    this.store
      .pipe(select(fromCore.getSelectedToParticipants))
      .subscribe((participants) => (this.selectedTo = participants));

    this.store
      .pipe(select(fromCore.getSearchQuery))
      .subscribe((searchQuery) => (this.searchQuery = searchQuery));

    this.store.dispatch(new LoadParticipants());
  }

  /**
   * handler for "from" input change
   */
  public onFromChange(from: IParticipant) {
    this.store.dispatch(
      new ChangeSearchParticipantsParams({
        from: from ? from : null
      })
    );
  }

  /**
   * handler for "to" input change
   */
  public onToChange(to: IParticipant[]) {
    this.store.dispatch(
      new ChangeSearchParticipantsParams({
        to
      })
    );
  }

  /**
   * onDateChange
   */
  public onDateChange([date_from, date_to]: [Date, Date]) {
    this.store.dispatch(
      new ChangeSearchDatesParams({
        date_from,
        date_to
      })
    );
  }
}
