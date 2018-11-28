//////////////////////////
//                      //
//     DEPENDENCIES     //
//                      //
//////////////////////////

/***********/
/* CLASSES */
/***********/

import { Multimedia } from '../classes/multimedia';

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

export class Album extends Multimedia implements Ratable {

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
            const duration = this.songs.reduce((total, track) => {
                return total + track.duration;
            }, 0);
            this.cache.add('duration', duration);
        }
        return this.cache.get('duration');
    }

    get name(): string { return this._name; }

    get playCount(): number {
        if (!this.cache.has('playCount')) {
            const playCount = this.songs.reduce((sum, song) => sum + song.playCount, 0);
            this.cache.add('playCount', playCount);
        }
        return this.cache.get('playCount');
    }

    get rating(): number { return this._rating; }

    get skipCount(): number {
        if (!this.cache.has('skipCount')) {
            const skipCount = this.songs.reduce((sum, song) => sum + song.skipCount, 0);
            this.cache.add('skipCount', skipCount);
        }
        return this.cache.get('skipCount');
    }

    get songs(): Array<Song> {
        if (!this.cache.has('songs')) {
            const songs = this.tracks.reduce((array, disc) => {
                disc.forEach(track => array.push(track));
                return array;
            }, new Array<Song>());
            this.cache.add('songs', songs);
        }
        return this.cache.get('songs');
    }

    get topTenSongs(): Array<Song> {
        if (!this.cache.has('topTenSongs')) {
            const topTenSongs = this.songs
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

    public isEP(): boolean {
        return this.songs.length >= 5 && this.songs.length < 10;
    }

    public isLP(): boolean {
        return this.songs.length >= 10;
    }
    
    public isSingle(): boolean {
        return this.songs.length < 5;
    }

    public isRated(): boolean {
        return !!(this.rating || this.hasAllSongsRated());
    }

    public getSongsWithRatingOf(rating: number): Array<Song> {
        return this.songs.filter(song => song.rating === rating);
    }

    /*******************/
    /* PRIVATE METHODS */
    /*******************/

    private hasAllSongsRated(): boolean {
        return this.songs.filter(song => song.isRated()).length === this.songs.length;
    }

    private hasSomeSongsRated(): boolean {
        const ratedSongs = this.songs.filter(song => song.isRated());
        return ratedSongs.length > 0 && ratedSongs.length < this.songs.length;
    }

    private hasNoSongsRated(): boolean {
        return this.songs.filter(song => song.isRated()).length === 0;
    }

} // End class Album
