import { Ratable } from '../interfaces/ratable';
import { Artist } from './artist';
import { Song } from './song';
import { Algorithm } from '../utilities/algorithm';

class Cache {
  private _ranking?: number;
  get ranking(): number { return this._ranking; }
  set ranking(value: number) { this._ranking = value; }

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

  public GetTopTenSongs(): Array<Song> {
    return this.Flatten()
      .filter(song => song.IsRated())
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 10);
  }

  /////////////////////////////
  //                         //
  //     PRIVATE METHODS     //
  //                         //
  /////////////////////////////

  private Flatten(): Array<Song> {
    return this.tracks.reduce((a, disc) => {
      disc.forEach(track => a.push(track));
      return a;
    }, new Array<Song>());
  }
} // End class Album
