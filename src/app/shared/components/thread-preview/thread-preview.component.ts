import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { IThreadSearchResult, ISearchResult } from '../../models/search';
import { IEmail } from '../../models/message';

@Component({
  selector: 'thread-preview',
  templateUrl: './thread-preview.component.html',
  styleUrls: ['./thread-preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ThreadPreviewComponent {
  @Input()
  thread: IThreadSearchResult<IEmail>;

  public trackByFn(_index: number, item: ISearchResult<IEmail>) {
    return item.originalItem.id;
  }
}
