import { Component, Input } from '@angular/core';

@Component({
  selector: 'ranker-star-ratings',
  templateUrl: './star-ratings.component.html',
  styleUrls: ['./star-ratings.component.scss'],
})
export class StarRatingsComponent {
  @Input() ratings: any[];
  constructor() {}
}
