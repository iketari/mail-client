import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// components
import { LetterListItemComponent } from './components/letter-list-item/letter-list-item.component';
import { LetterAvatarComponent } from './components/letter-avatar/letter-avatar.component';
import { LetterPreviewComponent } from './components/letter-preview/letter-preview.component';
import { ThreadPreviewComponent } from './components/thread-preview/thread-preview.component';
import { SpinnerComponent } from './components/spinner/spinner.component';

// pipes
import { HighlightPipe } from './pipes/highlight.pipe';

const COMPONENTS = [
  LetterListItemComponent,
  LetterAvatarComponent,
  LetterPreviewComponent,
  ThreadPreviewComponent,
  SpinnerComponent,
  HighlightPipe
];

@NgModule({
  declarations: COMPONENTS,
  imports: [CommonModule],
  exports: COMPONENTS,
  providers: []
})
export class SharedModule {}
