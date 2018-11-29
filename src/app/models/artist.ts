//////////////////////////
//                      //
//     DEPENDENCIES     //
//                      //
//////////////////////////

/***********/
/* CLASSES */
/***********/

import { Multimedia } from '../classes/multimedia';

/**********/
/* MODELS */
/**********/

import { Song } from '../models/song';

////////////////////
//                //
//     ARTIST     //
//                //
////////////////////

export class Artist extends Multimedia {

    /**************/
    /* PROPERTIES */
    /**************/

    private _albums: object;

    /***************/
    /* CONSTRUCTOR */
    /***************/

    public constructor(
        private _name: string
    ) {
        super();
        this._albums = new Object();
    }

    /*************/
    /* ACCESSORS */
    /*************/

    get albums(): object { return this._albums; }
    
    get name(): string { return this._name; }

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

} // End class Artist