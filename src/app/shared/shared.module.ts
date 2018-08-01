import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from './components/pagination/pagination.component';

const COMPONENTS = [PaginationComponent];

@NgModule({
    declarations: COMPONENTS,
    imports: [ CommonModule ],
    exports: COMPONENTS,
    providers: [],
})
export class SharedModule {}