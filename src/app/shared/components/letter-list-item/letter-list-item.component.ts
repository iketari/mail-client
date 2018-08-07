import { Component, Input, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { IThreadSearchResult } from '../../models/search';
import { IEmail } from '../../models/message';

@Component({
  selector: 'letter-list-item',
  templateUrl: './letter-list-item.component.html',
  styleUrls: ['./letter-list-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LetterListItemComponent {
  @Input()
  thread: IThreadSearchResult<IEmail>;

  @Input()
  selected: boolean;

  @Output()
  select = new EventEmitter<IThreadSearchResult<IEmail>>();

  /**
   * onItemClick
   */
  public onItemClick() {
    this.select.emit(this.thread);
  }
}
