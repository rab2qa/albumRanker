import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ranker-stars',
  templateUrl: './stars.component.html',
  styleUrls: ['./stars.component.scss'],
})
export class StarRatingsComponent implements OnInit {
  @Input() ratings: any[];
  @Input() ranking: number;
  public stars: number[];
  constructor() {}
  ngOnInit() {
    this.stars = this.rankingToStars(this.ranking);
  }
  public rankingToStars(ranking: number): number[] {
    const fixedRanking = ranking.toFixed(2);
    const array = [0, 0, 0, 0, 0];
    const ratingWhole = +fixedRanking.toString().split('.')[0];
    const ratingDecimal = +fixedRanking.toString().split('.')[1];
    for (let i = 0; i < ratingWhole; i++) {
      array[i] = 100;
    }
    if (ratingWhole < 5) {
      array[ratingWhole] = ratingDecimal;
    }
    return array;
  }
}
