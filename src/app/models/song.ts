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
import { Album } from './album';

//////////////////
//              //
//     SONG     //
//              //
//////////////////

export class Song extends Presenter implements Ratable {

    /**************/
    /* PROPERTIES */
    /**************/

    public id: number;
    public name: string;
    public artist: Artist;
    public album: Album;
    public genre: string;
    public duration: number;
    public releaseDate: Date;
    public rating: number;
    public loved: boolean;
    public playCount: number;
    public skipCount: number;

    /*************/
    /* ACCESSORS */
    /*************/

    public get discNumber(): number {
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

    public get trackNumber(): number {
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

    /***************/
    /* CONSTRUCTOR */
    /***************/

    public constructor(init?: Partial<Song>) {
        super();
        Object.assign(this, init);
    }

    /******************/
    /* PUBLIC METHODS */
    /******************/

    public isRated(): boolean {
        return !!(this.rating);
    }

} // End class Song