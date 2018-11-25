import { Component, OnInit, Input } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'ranker-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent {
  @Input() data: any[];
  @Input() name: string;
  @Input() type: string;
  @Input() canReorder: boolean = false;
  public drop(event: CdkDragDrop<string[]>): void {
    if (this.canReorder) {
      moveItemInArray(this.data, event.previousIndex, event.currentIndex);
    }
  }
}
