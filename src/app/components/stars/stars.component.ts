import { Component, Input } from '@angular/core';

@Component({
  selector: 'ranker-stars',
  templateUrl: './stars.component.html',
  styleUrls: ['./stars.component.scss'],
})
export class StarRatingsComponent {
  @Input() ratings: any[];
  constructor() {}
}
