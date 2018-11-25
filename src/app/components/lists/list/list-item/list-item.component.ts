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
  public ngOnInit(): void {
    console.log(this.item);
  }
  public toggleShowDetails(): void {
    if (this.type === 'Albums') {
      this.showDetails = this.showDetails ? false : true;
    }
  }
}
