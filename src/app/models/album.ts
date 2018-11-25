//////////////////////////
//                      //
//     DEPENDENCIES     //
//                      //
//////////////////////////

/***********/
/* CLASSES */
/***********/

import { Presenter } from '../classes/presenter';

/**************/
/* INTERFACES */
/**************/

import { Ratable } from '../interfaces/ratable';

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

export class Album extends Presenter implements Ratable {

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

    public isRated(): boolean {
        return !!this.rating;
    }

    public isEP(): boolean {
        return this.flatten().length < 10;
    }

    public isLP(): boolean {
        return this.flatten().length >= 10;
    }

    public getDuration(): number {
        return this.flatten().reduce((total, track) => {
            return total + track.duration;
        }, 0);
    }

    public getPLayCount(): number {
        return this.flatten().reduce((sum, song) => sum + song.playCount, 0);
    }

    public getSkipCount(): number {
        return this.flatten().reduce((sum, song) => sum + song.skipCount, 0);
    }

    public getTopTenSongs(): Array<Song> {
        return this.flatten()
            .filter(song => song.isRated())
            .sort((a, b) => b.rating - a.rating)
            .slice(0, 10);
    }

    public getSongsWithRatingOf(rating: number): Array<Song> {
        return this.flatten().filter(song => song.rating === rating);
    }

    /*******************/
    /* PRIVATE METHODS */
    /*******************/

    private flatten(): Array<Song> {
        return this.tracks.reduce((a, disc) => {
            disc.forEach(track => a.push(track));
            return a;
        }, new Array<Song>());
    }
} // End class Album
