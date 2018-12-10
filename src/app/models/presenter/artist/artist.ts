//////////////////////////
//                      //
//     DEPENDENCIES     //
//                      //
//////////////////////////

/**************/
/* INTERFACES */
/**************/

import { Rankable } from '../../../interfaces/rankable';

/**********/
/* MODELS */
/**********/

import { Album } from '../album/album';
import { Library } from '../library/library';
import { Presenter } from '../presenter';
import { Song } from '../song/song';

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
    private _name: string;

    /***************/
    /* CONSTRUCTOR */
    /***************/

    public constructor(json: Object) {
        super();

        this._albums = new Array<Album>();
        this._name = json['Artist'];
    }

    /*************/
    /* ACCESSORS */
    /*************/

    get albums(): Array<Album> { return this._albums; }

    get library(): Library { return this._library; }
    set library(library: Library) { this._library = library; }

    get name(): string { return this._name; }

    get playCount(): number {
        let playCount: number = this._cache.get('playCount');
        if (!Number.isFinite(playCount)) {
            playCount = this.songs.reduce((sum, song) => sum + song.playCount, 0);
            this._cache.add('playCount', playCount);
        }
        return playCount;
    }

    get ranking(): number {
        let ranking: number = this._cache.get('ranking');
        if (!Number.isFinite(ranking)) {
            ranking = this._albums.reduce((sum, album) => sum + album.ranking, 0) / this._albums.length || 0;
            this._cache.add('ranking', ranking);
        }
        return ranking;
    }

    get skipCount(): number {
        let skipCount: number = this._cache.get('skipCount');
        if (!Number.isFinite(skipCount)) {
            skipCount = this.songs.reduce((sum, song) => sum + song.skipCount, 0);
            this._cache.add('skipCount', skipCount);
        }
        return skipCount;
    }

    get songs(): Array<Song> {
        let songs: Array<Song> = this._cache.get('songs');
        if (!songs) {
            songs = new Array<Song>();
            for (let key in this._albums) {
                Array.prototype.push.apply(songs, this._albums[key].songs);
            }
            this._cache.add('songs', songs);
        }
        return songs;
    }

    get value(): number {
        return this._getTotalValue();
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

    /*******************/
    /* PRIVATE METHODS */
    /*******************/

    private _getAverageValue(): number {
        const averageValue: number = this._getTotalValue() / this.songs.length || 0;
        return averageValue;
    }

    private _getTotalValue(): number {
        const totalValue: number = this.songs.reduce((sum, song) => sum + song.value, 0);
        return totalValue;
    }

} // End class Artist