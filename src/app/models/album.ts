import { Ratable } from '../interfaces/ratable';
import { Artist } from './artist';
import { Song } from './song';

class Cache {
  private _ranking?: number;
  get ranking(): number {
    return this._ranking;
  }
  set ranking(value: number) {
    this._ranking = value;
  }

  constructor() {
    this._ranking = null;
  }
}

export class Album implements Ratable {
  ////////////////////////
  //                    //
  //     PROPERTIES     //
  //                    //
  ////////////////////////

  public name: string;
  public artist: Artist;
  public releaseDate: Date;
  public rating: number;
  public tracks: Array<Array<Song>>;
  public starRatings?: number[];
  public showDetails: boolean;

  public cache: Cache;

  ////////////////////////////
  //                        //
  //     PUBLIC METHODS     //
  //                        //
  ////////////////////////////

  public constructor(name: string) {
    this.name = name;
    this.tracks = new Array<Array<Song>>();
    this.cache = new Cache();
  }

  public IsRated(): boolean {
    return !!this.rating;
  }
  public IsEP(): boolean {
    return this.Flatten().length < 10;
  }

  public IsLP(): boolean {
    return this.Flatten().length >= 10;
  }

  public GetDuration(): number {
    return this.Flatten().reduce((total, track) => {
      return total + track.duration;
    }, 0);
  }

  public GetPLayCount(): number {
    return this.Flatten().reduce((sum, song) => sum + song.playCount, 0);
  }

  public GetSkipCount(): number {
    return this.Flatten().reduce((sum, song) => sum + song.skipCount, 0);
  }

  // Main Algorithm For Calculating an Album's Rating
  // 1) Order the Tracks on the Album by Indivitual Track Rating
  // 2) Take the Top 10 Tracks, Discarding the Rest (So That Albums With Lots of Tracks Don't Dwarf Standard LPs)
  // 3) Sum All Individual Track Points into Total Album Points
  public GetScore(): number {
    // Use this algorithm to normalize EPs to be competitive with LPs
    //   let topTenSongs = this.Flatten()
    //   .sort((a, b) => {
    //     return b.rating - a.rating;
    //   })
    //   .slice(0, 10);

    //   return topTenSongs.reduce((sum, song) => {
    //     return sum + song.GetScore();
    //   }, 0) / topTenSongs.length;

    // Standard Algorithm
    return this.Flatten()
      .filter(song => song.IsRated())
      .sort((a, b) => {
        return b.rating - a.rating;
      })
      .slice(0, 10)
      .reduce((sum, song) => {
        return sum + song.GetScore();
      }, 0);
  }

  /////////////////////////////
  //                         //
  //     PRIVATE METHODS     //
  //                         //
  /////////////////////////////

  public Flatten(): Array<Song> {
    return this.tracks.reduce((a, disc) => {
      disc.forEach(track => a.push(track));
      return a;
    }, new Array<Song>());
  }
} // End class Album
