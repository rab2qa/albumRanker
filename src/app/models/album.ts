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

    private _tracks: Array<Array<Song>>;

    /***************/
    /* CONSTRUCTOR */
    /***************/

    public constructor(
        private _artist: Artist,
        private _name: string,
        private _rating: number,
        private _year: number
    ) {
        super();
        this._tracks = new Array<Array<Song>>();
    }

    /*************/
    /* ACCESSORS */
    /*************/

    get artist(): Artist { return this._artist; }

    get duration(): number {
        if (!this.cache.has('duration')) {
            const duration = this.flatten().reduce((total, track) => {
                return total + track.duration;
            }, 0);
            this.cache.add('duration', duration);
        }
        return this.cache.get('duration');
    }

    get name(): string { return this._name; }

    get playCount(): number {
        if (!this.cache.has('playCount')) {
            const playCount = this.flatten().reduce((sum, song) => sum + song.playCount, 0);
            this.cache.add('playCount', playCount);
        }
        return this.cache.get('playCount');
    }

    get rating(): number { return this._rating; }

    get skipCount(): number {
        if (!this.cache.has('skipCount')) {
            const skipCount = this.flatten().reduce((sum, song) => sum + song.skipCount, 0);
            this.cache.add('skipCount', skipCount);
        }
        return this.cache.get('skipCount');
    }

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

    get tracks(): Array<Array<Song>> { return this._tracks; }

    get year(): number { return this._year; }

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
