import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LetterListItemComponent } from './components/letter-list-item/letter-list-item.component';

const COMPONENTS = [LetterListItemComponent];

@NgModule({
  declarations: COMPONENTS,
  imports: [CommonModule],
  exports: COMPONENTS,
  providers: []
})
export class SharedModule {}
