import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'ranker-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.scss'],
})
export class ListsComponent {
  public key: string;
  public name: string;
  constructor(private route: ActivatedRoute, public dataService: DataService) {
    this.route.data.subscribe((data: any) => {
      this.key = data.key;
      this.name = data.name;
    });
  }
}
