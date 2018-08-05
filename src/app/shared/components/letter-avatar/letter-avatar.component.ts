import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  ViewEncapsulation
} from '@angular/core';

@Component({
  selector: 'letter-avatar',
  templateUrl: './letter-avatar.component.html',
  styleUrls: ['./letter-avatar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class LetterAvatarComponent {
  @Input()
  name: string = '';

  /**
   * getInitials
   */
  public getInitials(): string {
    const parts = this.name.split(' ');
    let result = '';

    if (parts[0] && parts[1]) {
      result = parts[0].charAt(0) + parts[1].charAt(0);
    } else {
      result = this.name.slice(0, 2);
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
