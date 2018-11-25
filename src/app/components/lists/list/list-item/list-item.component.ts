import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ranker-list-item',
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.scss'],
})
export class ListItemComponent implements OnInit {
  @Input() item: any;
  @Input() type: string;
  @Input() canReorder: boolean = false;
  public showDetails: boolean = false;
  public ngOnInit(): void {}
  public toggleShowDetails(): void {
    if (this.type === 'album') {
      this.showDetails = this.showDetails ? false : true;
    }
  }
}
