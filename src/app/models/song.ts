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

import { Album } from './album';
import { Artist } from './artist';
import { Playlist } from './playlist';

//////////////////
//              //
//     SONG     //
//              //
//////////////////

export class Song extends Multimedia implements Ratable, Likable, Disklikable {

    /**************/
    /* PROPERTIES */
    /**************/

    private _playlists: Array<Playlist>;

    /***************/
    /* CONSTRUCTOR */
    /***************/

    public constructor(
        private _album: Album,
        private _artist: Artist,
        private _disliked: boolean,
        private _duration: number,
        private _genre: string,
        private _liked: boolean,
        private _name: string,
        private _playCount: number,
        private _rating: number,
        private _releaseDate: Date,
        private _skipCount: number
    ) {
        super();
        this._playlists = new Array<Playlist>();
    }

    /*************/
    /* ACCESSORS */
    /*************/

    get album(): Album { return this._album; }

    get artist(): Artist { return this._artist; }
    
    get discNumber(): number {
        if (!this.cache.has('discNumber')) {
            for (let i = 0; i < this.album.tracks.length; i++) {
                for (let j = 0; j < this.album.tracks[i].length; j++) {
                    if (this.album.tracks[i][j] === this) {
                        this.cache.add('discNumber', i + 1);
                        return i + 1;
                    }
                }
            }
        }
        return this.cache.get('discNumber');
    }
    
    get disliked(): boolean { return this._disliked; }
    
    get duration(): number { return this._duration; }

    get genre(): string { return this._genre; }
    
    get liked(): boolean { return this._liked; }
    
    get name(): string { return this._name; }
    
    get playCount(): number { return this._playCount; }
    
    get playlists(): Array<Playlist> { return this._playlists; }
    
    get releaseDate(): Date { return this._releaseDate; }
    
    get rating(): number { return this._rating; }
    
    get skipCount(): number { return this._skipCount; }

    get trackNumber(): number {
        if (!this.cache.has('trackNumber')) {
            for (let i = 0; i < this.album.tracks.length; i++) {
                for (let j = 0; j < this.album.tracks[i].length; j++) {
                    if (this.album.tracks[i][j] === this) {
                        this.cache.add('trackNumber', j + 1);
                        return j + 1;
                    }
                }
            }
        }
        return this.cache.get('trackNumber');
    }

    /******************/
    /* PUBLIC METHODS */
    /******************/

    public isRated(): boolean {
        return !!(this.rating);
    }

} // End class Song