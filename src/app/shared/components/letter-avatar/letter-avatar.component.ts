import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  ViewEncapsulation
} from '@angular/core';

const colours = [
  [['#5e0231'], ['#dbc3d0']],
  [['#283018'], ['#f6f1ed']],
  [['#aa863a'], ['#f6f1ed']],
  [['#729f98'], ['#f6f1ed']],
  [['#1d2120'], ['#f6f1ed']],
  [['#5a5c51'], ['#f6f1ed']],
  [['#ba9077'], ['#f6f1ed']],
  [['#e6cf8b'], ['#e8edf3']],
  [['#b56969'], ['#e8edf3']],
  [['#22264b'], ['#e8edf3']],

  [['#edd9c0'], ['#f6f1ed']],
  [['#c9d8c5'], ['#f6f1ed']],
  [['#a8b6bf'], ['#f6f1ed']],
  [['#7d4627'], ['#f6f1ed']],
  [['#b3c2bf'], ['#c0dfd9']],
  [['#3b3a36'], ['#c0dfd9']],
  [['#262216'], ['#f6f1ed']],
  [['#49412c'], ['#f6f1ed']],
  [['#97743a'], ['#f6f1ed']],

  [['#b0a18e'], ['#f6f1ed']],
  [['#252839'], ['#f6f1ed']],
  [['#677077'], ['#f6f1ed']],
  [['#b5b5b7'], ['#f6f1ed']],
  [['#f2b632'], ['#f6f1ed']],
  [['#16174f'], ['#f6f1ed']],
  [['#963019'], ['#f6f1ed']],
  [['#667467'], ['#f6f1ed']],
  [['#A5DD99'], ['#f6f1ed']],
  [['#DB9B6D'], ['#f6f1ed']]
];

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

  public stringToColour(str: string): string[][] {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = Math.abs(str.charCodeAt(i) + ((hash << 5) - hash));
    }

    return colours[hash % colours.length];
  }
}
