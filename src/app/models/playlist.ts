//////////////////////////
//                      //
//     DEPENDENCIES     //
//                      //
//////////////////////////

/***********/
/* CLASSES */
/***********/

import { Presenter } from '../classes/presenter';

/**********/
/* MODELS */
/**********/

import { Song } from '../models/song';

//////////////////////
//                  //
//     PLAYLIST     //
//                  //
//////////////////////

export class Playlist extends Presenter {

    /**************/
    /* PROPERTIES */
    /**************/

    private _songs: Array<Song>;

    /***************/
    /* CONSTRUCTOR */
    /***************/

    public constructor(
        private _name: string,
    ) {
        super();
        this._songs = new Array<Song>();
    }

    /*************/
    /* ACCESSORS */
    /*************/

    get name(): string { return this._name; }
    
    get songs(): Array<Song> { return this._songs; }

} // End class Playlist