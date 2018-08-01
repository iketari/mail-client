import { Component, Input, EventEmitter, Output, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'pagination',
    templateUrl: './pagination.component.html',
    styleUrls: ['./pagination.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaginationComponent {
  public totalPage: number = 0;

  @Input()
  total: number = 0;

  @Input()
  page: number = 1;

  @Input()
  limit: number = 10;

  @Output()
  change = new EventEmitter<number>();

  totalPages() {
    // 10 items per page per default
    return Math.ceil(this.total / this.limit)
  }

  rangeStart() {
    return Math.floor(this.page / this.limit) * this.limit + 1
  }

  pagesRange() {
    return this.range(this.rangeStart(), Math.min(this.rangeStart() + 10, this.totalPages() + 1))
  }

  prevPage() {
    return Math.max(this.rangeStart(), this.page - 1)
  }

  nextPage() {
    return Math.min(this.page + 1, this.totalPages())
  }

  pageClicked(page: number) {
    this.change.emit(page);
  }

  private range(start: number, count: number): number[] {
    return Array.apply(0, Array(count))
      .map((_, index) => index + start);
  }

}