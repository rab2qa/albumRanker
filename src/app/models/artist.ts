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

import { Rankable } from '../interfaces/rankable';

/**********/
/* MODELS */
/**********/

import { Album } from '../models/album';
import { Library } from '../models/library';
import { Song } from '../models/song';

/*************/
/* UTILITIES */
/*************/

import { Globals } from '../utilities/globals';
import { Settings } from '../utilities/settings';

////////////////////
//                //
//     ARTIST     //
//                //
////////////////////

export class Artist extends Presenter implements Rankable {

    /**************/
    /* PROPERTIES */
    /**************/

    private _albums: Array<Album>;
    private _library?: Library;
    private _ranking?: number;
    private _name: string;

    /***************/
    /* CONSTRUCTOR */
    /***************/

    public constructor(json: Object) {
        super();

        this._name = json["Artist"];
        this._albums = new Array<Album>();
    }

    /*************/
    /* ACCESSORS */
    /*************/

    get albums(): Array<Album> { return this._albums; }

    get library(): Library { return this._library; }
    set library(library: Library) { this._library = library; }

    get name(): string { return this._name; }

    get playCount(): number {
        if (!this.cache.has('playCount')) {
            const playCount = this.songs.reduce((sum, song) => sum + song.playCount, 0);
            this.cache.add('playCount', playCount);
        }
        return this.cache.get('playCount');
    }

    get ranking(): number {
        if (!this._ranking) {
            let aggregateAlbumRating = this._albums.reduce((sum, album) => sum + album.ranking, 0) / this._albums.length;
            aggregateAlbumRating = aggregateAlbumRating || 0; // Handle Divide by Zero Error
            this._ranking = aggregateAlbumRating;
        }
        return this._ranking;
    }

    get skipCount(): number {
        if (!this.cache.has('skipCount')) {
            const skipCount = this.songs.reduce((sum, song) => sum + song.skipCount, 0);
            this.cache.add('skipCount', skipCount);
        }
        return this.cache.get('skipCount');
    }

    get songs(): Array<Song> {
        if (!this.cache.has('songs')) {
            const songs = new Array<Song>();
            for (let key in this._albums) {
                Array.prototype.push.apply(songs, this._albums[key].songs);
            }
            this.cache.add('songs', songs);
        }
        return this.cache.get('songs');
    }

    get stars(): Array<number> {
        if (!this.cache.has('stars')) {
            const stars = Globals.rankingToStars(this.ranking);
            this.cache.add('stars', stars);;
        }
        return this.cache.get('stars');
    }

    get value(): number {
        // if (Settings.distributeAggregateValues) {
        //     return this.getTotalValue();
        // } else {
        //     return this.getAverageValue();
        // }
        return this.getTotalValue();

    }

    /******************/
    /* PUBLIC METHODS */
    /******************/

    public isRankable(): boolean {
        return true;
    }
    public isRanked(): boolean {
        return !!(this.ranking);
    }

    public getAverageValue(): number {
        let response = this.getTotalValue() / this.songs.length || 0;
        return response;
    }

    public getTotalValue(): number {
        const response = this.songs.reduce((sum, song) => sum + song.value, 0);
        return response;
    }

} // End class Artist