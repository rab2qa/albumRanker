import { Artist } from './artist';
import { Song } from './song';

export class Album {

  ////////////////////////
  //                    //
  //     PROPERTIES     //
  //                    //
  ////////////////////////

  public name: string;
  public artist: Artist;
  public releaseDate: Date;
  public tracks: Array<Array<Song>>;
  public rating?: number;
  public starRatings?: number[];

  ////////////////////////////
  //                        //
  //     PUBLIC METHODS     //
  //                        //
  ////////////////////////////

  public constructor(name: string) {
    this.name = name;
    this.tracks = new Array<Array<Song>>();
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

  public GetScore(): number {
    return this.Flatten()
      .sort((a, b) => {
        return b.rating - a.rating;
      })
      .slice(0, 10)
      .reduce((accumulator, song) => {
        return song.rating > 0 ? accumulator + Math.pow(2, song.rating - 1) : 0;
      }, 0);
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