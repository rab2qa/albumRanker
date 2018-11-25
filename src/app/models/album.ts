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

    /*************/
    /* ACCESSORS */
    /*************/

    get topTenSongs(): Array<Song> {
        if (!this.cache.has('topTenSongs')) {
            const topTenSongs = this.flatten()
                .filter(song => song.isRated())
                .sort((a, b) => b.rating - a.rating)
                .slice(0, 10);
            this.cache.add('topTenSongs', topTenSongs);
        }
        return this.cache.get('topTenSongs');
    }

    get duration(): number {
        if (!this.cache.has('duration')) {
            const duration = this.flatten().reduce((total, track) => {
                return total + track.duration;
            }, 0);
            this.cache.add('duration', duration);
        }
        return this.cache.get('duration');
    }

    get playCount(): number {
        if (!this.cache.has('playCount')) {
            const playCount = this.flatten().reduce((sum, song) => sum + song.playCount, 0);
            this.cache.add('playCount', playCount);
        }
        return this.cache.get('playCount');
    }

    get skipCount(): number {
        if (!this.cache.has('skipCount')) {
            const skipCount = this.flatten().reduce((sum, song) => sum + song.skipCount, 0);
            this.cache.add('skipCount', skipCount);
        }
        return this.cache.get('skipCount');
    }

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
