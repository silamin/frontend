import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-app-pagination',
  templateUrl: './app-pagination.component.html',
  styleUrls: ['./app-pagination.component.scss']
})
export class AppPaginationComponent {
  @Input() currentPage = 1;
  @Input() itemsPerPage = 3;
  @Input() totalItems: number = 0; // Add a default value here
  @Output() pageChanged = new EventEmitter<number>();

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  changePage(newPage: number): void {
    if (newPage > 0 && newPage <= this.totalPages) {
      this.currentPage = newPage;
      this.pageChanged.emit(this.currentPage);
    }
  }
}
