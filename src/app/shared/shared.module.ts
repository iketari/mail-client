import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LetterListItemComponent } from './components/letter-list-item/letter-list-item.component';
import { LetterAvatarComponent } from './components/letter-avatar/letter-avatar.component';
import { LetterPreviewComponent } from './components/letter-preview/letter-preview.component';
import { HighlightPipe } from './pipes/highlight.pipe';
import { ThreadPreviewComponent } from './components/thread-preview/thread-preview.component';

const COMPONENTS = [
  LetterListItemComponent,
  LetterAvatarComponent,
  LetterPreviewComponent,
  ThreadPreviewComponent,
  HighlightPipe
];

@NgModule({
  declarations: COMPONENTS,
  imports: [CommonModule],
  exports: COMPONENTS,
  providers: []
})
export class SharedModule {}
