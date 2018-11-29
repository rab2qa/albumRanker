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

import { Album } from '../models/album';
import { Library } from '../models/library';
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

    private _albums: Array<Album>;
    private _library?: Library;
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

    get albums(): object { return this._albums; }
    
    get library(): Library { return this._library; }
    set library(library: Library) { this._library = library; }

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