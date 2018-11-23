import { Artist } from './artist';
import { Album } from './album';

export class Song {

    ////////////////////////
    //                    //
    //     PROPERTIES     //
    //                    //
    ////////////////////////

    public name: string;
    public artist: Artist;
    public album: Album;
    public genre: string;
    public duration: number;
    public releaseDate: Date;
    public rating: number;
    public playCount: number;
    public skipCount: number;
    public trackID: number;
    public trackNumber: number;
    public discNumber: number;

    ////////////////////////////
    //                        //
    //     PUBLIC METHODS     //
    //                        //
    ////////////////////////////

    public constructor(init?: Partial<Song>) {
        Object.assign(this, init);
    }

  // Transform Star Rating Weights From Linear to Exponential
  //    1 Star  = 2^0 = 1 Point
  //    2 Stars = 2^1 = 2 Points
  //    3 Stars = 2^2 = 4 Points
  //    4 Stars = 2^3 = 8 Points
  //    5 Stars = 2^4 = 16 Points
    public GetScore(): number {
        return this.rating > 0 ? Math.pow(2, this.rating - 1) : 0;
    }

} // End class Song