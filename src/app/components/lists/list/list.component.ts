import { Component, OnInit, Input } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

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
  public listHeader: string;
  public ngOnInit(): void {
    this.listHeader = this.setListHeader(this.key);
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
  public drop(event: CdkDragDrop<string[]>): void {
    if (this.canReorder) {
      moveItemInArray(this.data, event.previousIndex, event.currentIndex);
    }
  }
}
