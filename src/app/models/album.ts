import { Artist } from './artist';
import { Song } from './song';

export class Album {
  public name: string;

  public artist: Artist;

  public releaseDate: Date;

  public tracks: Array<Array<Song>>;

  public rank?: number;
  public starRatings?: number[];

  public constructor(name: string) {
    this.name = name;
    this.tracks = new Array<Array<Song>>();
  }

  private Flatten(): Array<Song> {
    return this.tracks.reduce((a, disc) => {
      disc.forEach(track => a.push(track));
      return a;
    }, new Array<Song>());
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

  public GetRank(): number {
    return this.Flatten()
      .sort((a, b) => {
        return b.rating - a.rating;
      })
      .slice(0, 10)
      .reduce((accumulator, song) => {
        return song.rating > 0 ? accumulator + Math.pow(2, song.rating / 20 - 1) : 0;
      }, 0);
  }
}
