import { Component, OnInit, Input } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { PageEvent } from '@angular/material';
import { PaginationOptions } from '../../../interfaces/pagination';

@Component({
  selector: 'ranker-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  @Input() data: any[];
  @Input() name: string;
  @Input() key: string;
  @Input() canReorder: boolean = false;
  public paginatedData: any[];
  public defaultPageSize = 25;
  public listHeader: string;
  public pagination: PaginationOptions;

  public ngOnInit(): void {
    this.listHeader = this.setListHeader(this.key);
    this.pagination = this.setPaginationOptions(this.data);
    this.filterDataByPagination(this.defaultPageSize, 0);
  }

  public setListHeader(key) {
    if (this.key === 'albums') {
      return 'Artist/Album Title';
    } else if (this.key === 'artists') {
      return 'Artist';
    } else if (this.key === 'songs') {
      return 'Artist/Song Title';
    }
  }

  public handleItemDropped(event: CdkDragDrop<string[]>): void {
    if (this.canReorder) {
      moveItemInArray(this.data, event.previousIndex, event.currentIndex);
    }
  }

  public handlePageChange(event: PageEvent): void {
    this.filterDataByPagination(event.pageSize, event.pageIndex);
  }

  private filterDataByPagination(pageSize: number, pageIndex: number): void {
    const start = pageSize * pageIndex;
    const end = start + pageSize - 1;
    this.paginatedData = this.data.filter((album, index) => index >= start && index <= end);
  }

  private setPaginationOptions(data): PaginationOptions {
    return {
      length: data.length,
      pageSize: this.defaultPageSize,
      pageSizeOptions: [10, 25, 50, 100],
    };
  }
}
