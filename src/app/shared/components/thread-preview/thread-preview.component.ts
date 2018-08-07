import { Component, OnInit, Input } from '@angular/core';
import { IThreadSearchResult } from '../../models/search';
import { IEmail } from '../../models/message';

@Component({
  selector: 'thread-preview',
  templateUrl: './thread-preview.component.html',
  styleUrls: ['./thread-preview.component.scss']
})
export class ThreadPreviewComponent {
  @Input()
  thread: IThreadSearchResult<IEmail>;
}
