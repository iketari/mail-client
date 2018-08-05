import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
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
}
