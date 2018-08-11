import { Component, ChangeDetectionStrategy, Input, ElementRef } from '@angular/core';
import { ISearchResult } from '../../models/search';
import { IEmail } from '../../models/message';

@Component({
  selector: 'letter-preview',
  templateUrl: './letter-preview.component.html',
  styleUrls: ['./letter-preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LetterPreviewComponent {
  @Input()
  message: ISearchResult<IEmail>;
  @Input()
  expanded: boolean;

  constructor(private el: ElementRef) {}

  /**
   * expand the letter
   */
  public onAvatarClick() {
    this.expanded = !this.expanded;
  }

  /**
   * onInfoClick
   */
  public onInfoClick(event: MouseEvent) {
    const el: HTMLElement = event.target as HTMLElement;
    const { to, from } = el.dataset;
    if (!to && !from) {
      return;
    }

    this.el.nativeElement.dispatchEvent(
      new CustomEvent<{ from?: string; to?: string }>('participant-click', {
        detail: { to, from }
      })
    );
  }
}
