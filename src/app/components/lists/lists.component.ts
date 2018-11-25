import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'ranker-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.scss'],
})
export class ListsComponent implements OnInit {
  @Input() data: any[];
  @Input() name: string;
  @Input() type: string;
  constructor() {}
  ngOnInit() {}
}
