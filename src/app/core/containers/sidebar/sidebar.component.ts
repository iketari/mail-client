import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';

import * as fromCore from './../../ngrx/reducers';
import { IParticipant } from '../../../shared/models/search';
import { LoadParticipants } from '../../ngrx/actions/context.actions';
import { ChangeSearchParticipantsParams } from '../../ngrx/actions/search.actions';

@Component({
  selector: 'sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  public participants: IParticipant[];
  public selectedFrom: IParticipant;

  constructor(private store: Store<fromCore.State>) {}

  ngOnInit() {
    this.store
      .pipe(select(fromCore.getAllParticipants))
      .subscribe((participants) => (this.participants = participants));

    this.store
      .pipe(select(fromCore.getSelectedFromParticipant))
      .subscribe((participant) => (this.selectedFrom = participant));

    this.store.dispatch(new LoadParticipants());
  }

  /**
   * handler on "from" input change
   */
  public onFromChange(from: IParticipant) {
    this.store.dispatch(
      new ChangeSearchParticipantsParams({
        from: from ? from : null
      })
    );
  }

  /**
   * handler on "to" input change
   */
  public onToChange(to: IParticipant[]) {
    this.store.dispatch(
      new ChangeSearchParticipantsParams({
        to
      })
    );
  }
}
