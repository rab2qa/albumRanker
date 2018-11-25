//////////////////////////
//                      //
//     DEPENDENCIES     //
//                      //
//////////////////////////

/***********/
/* CLASSES */
/***********/

import { Presenter } from '../classes/presenter';

/**********/
/* MODELS */
/**********/

import { Artist } from './artist';
import { Song } from './song';

///////////////////
//               //
//     ALBUM     //
//               //
///////////////////

export class Album extends Presenter {

    /**************/
    /* PROPERTIES */
    /**************/

    public name: string;
    public artist: Artist;
    public releaseDate: Date;
    public rating: number;
    public tracks: Array<Array<Song>>;
    public starRatings?: number[];

    /***************/
    /* CONSTRUCTOR */
    /***************/

    public constructor(name: string) {
        super();
        this.name = name;
        this.tracks = new Array<Array<Song>>();
    }

    /******************/
    /* PUBLIC METHODS */
    /******************/

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

    /*******************/
    /* PRIVATE METHODS */
    /*******************/

    private Flatten(): Array<Song> {
        return this.tracks.reduce((a, disc) => {
            disc.forEach(track => a.push(track));
            return a;
        }, new Array<Song>());
    }
} // End class Album
