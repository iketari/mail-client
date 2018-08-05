import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy,
  Output,
  EventEmitter
} from '@angular/core';
import { ISearchResult } from '../../../shared/models/search';
import { IEmail } from '../../../shared/models/message';

@Component({
  selector: 'letter-list-item',
  templateUrl: './letter-list-item.component.html',
  styleUrls: ['./letter-list-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LetterListItemComponent {
  @Input()
  message: ISearchResult<IEmail>;

  @Input()
  selected: boolean;

  @Output()
  select = new EventEmitter<ISearchResult<IEmail>>();

  /**
   * onItemClick
   */
  public onItemClick() {
    this.select.emit(this.message);
  }
}
