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

    get ranking(): number {
        if (!this._ranking) {
            // const albumScore = this.songs.reduce((sum, song) => {
            //     return sum + this.library.getSongStarWeights()[song.rating - 1];
            // }, 0);
            // this._ranking = albumScore;
            const albums = Object.values(this.albums);
            let aggregateAlbumRating = albums.reduce((sum, album) => sum + album.ranking, 0) / albums.length;
            aggregateAlbumRating = aggregateAlbumRating || 0; // Handle Divide by Zero Error
            this._ranking = aggregateAlbumRating;
        }
        return this._ranking;
    }

    get songs(): Array<Song> {
        if (!this.cache.has('songs')) {
            const songs = new Array<Song>();
            for(let key in this._albums) {
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

    /******************/
    /* PUBLIC METHODS */
    /******************/

    public isRanked(): boolean {
        return !!(this.ranking);
    }

} // End class Artist