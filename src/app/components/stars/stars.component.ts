import { Component, Input, OnInit } from '@angular/core';
import { Rankable } from 'src/app/interfaces/rankable';
import { Cache } from 'src/app/utilities/cache';
import { Album } from 'src/app/models/album';
import { Artist } from 'src/app/models/artist';
import { Song } from 'src/app/models/song';

const cache = new Cache();

@Component({
  selector: 'ranker-stars',
  templateUrl: './stars.component.html',
  styleUrls: ['./stars.component.scss'],
})
export class StarRatingsComponent implements OnInit {
  @Input() rankable: Rankable;
  public stars: number[];
  private cacheKey: string;

  ngOnInit() {
    this.cacheKey = this.generateCacheKey(this.rankable);
    this.stars = this.getStars(this.rankable);
  }

  public getStars(rankable): number[] {
    if (!cache.has(this.cacheKey)) {
      const stars = this.rankingToStars(rankable.ranking);
      cache.add(this.cacheKey, stars);
    }
    return cache.get(this.cacheKey);
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

  private generateCacheKey(rankable): string {
    if (rankable instanceof Album) {
      return '(Album) ' + rankable.name;
    } else if (rankable instanceof Artist) {
      return '(Artist) ' + rankable.name;
    } else if (rankable instanceof Song) {
      return '(Song) ' + rankable.name;
    }
  }
}
