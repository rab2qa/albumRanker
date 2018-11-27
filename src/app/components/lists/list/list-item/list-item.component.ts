import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ranker-list-item',
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.scss'],
})
export class ListItemComponent implements OnInit {
  @Input() item: any;
  @Input() key: string;
  @Input() canReorder: boolean = false;
  public listItemTitle: string;
  public showDetails: boolean = false;
  public ngOnInit(): void {
    this.listItemTitle = this.setListItemTitle(this.key);
  }
  public setListItemTitle(key: string) {
    if (key === 'albums' || key === 'songs') {
      return `${this.item.artist.name} "${this.item.name}"`;
    } else if (this.key === 'artists') {
      return this.item.name;
    }
  }
  public toggleShowDetails(key: string): void {
    if (key === 'albums') {
      this.showDetails = this.showDetails ? false : true;
    }
  }
}
