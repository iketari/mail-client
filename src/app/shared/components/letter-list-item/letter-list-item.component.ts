import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy,
  Output,
  EventEmitter
} from '@angular/core';
import { IEmail } from '../../models/message';
import { ISearchResult } from '../../models/search';

@Component({
  selector: 'letter-list-item',
  templateUrl: './letter-list-item.component.html',
  styleUrls: ['./letter-list-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LetterListItemComponent {
  @Input()
  message: ISearchResult<IEmail>;

  @Output()
  select = new EventEmitter<ISearchResult<IEmail>>();

  /**
   * onItemClick
   */
  public onItemClick() {
    this.select.emit(this.message);
  }

  /**
   * getInitials
   */
  public getInitials(): string {
    const { from } = this.message.originalItem;
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
