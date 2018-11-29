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

import { Disklikable } from '../interfaces/dislikable';
import { Likable } from '../interfaces/likable';
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

export class Album extends Multimedia implements Ratable, Likable, Disklikable {

    /**************/
    /* PROPERTIES */
    /**************/

    private _artist?: Artist;
    private _disliked: boolean;
    private _liked: boolean;
    private _name: string;
    private _rating: number;
    private _tracks: Array<Array<Song>>;
    private _year: number;

    /***************/
    /* CONSTRUCTOR */
    /***************/

    public constructor(json: Object) {
        super();

        this._disliked= json["Album Disliked"] === "true";
        this._name = json["Album"];
        this._rating = (json["Album Rating Computed"] === "true") ? 0 : +json["Album Rating"] / 20 || 0;
        this._liked = json["Loved"] === "true";
        this._year = json["Year"];

        this._tracks = new Array<Array<Song>>();
    }

    /*************/
    /* ACCESSORS */
    /*************/

    get artist(): Artist { return this._artist; }
    set artist(artist: Artist) { this._artist = artist; }
    
    get disliked(): boolean { return this._disliked; }

    get duration(): number {
        if (!this.cache.has('duration')) {
            const duration = this.songs.reduce((total, track) => {
                return total + track.duration;
            }, 0);
            this.cache.add('duration', duration);
        }
        return this.cache.get('duration');
    }

    get liked(): boolean { return this._liked; }

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

    public hasAllSongsRated(): boolean {
        let response = true;

        this._tracks.forEach(disc => {
            const ratedTracks = disc.filter(track => track.isRated()).length;
            if (disc.length === 1 || ratedTracks !== disc.length) {
                response = false;
            }
        });

        return response;
    }

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
        return !!(this.rating);
    }

    public getSongsWithRatingOf(rating: number): Array<Song> {
        return this.songs.filter(song => song.rating === rating);
    }

} // End class Album
