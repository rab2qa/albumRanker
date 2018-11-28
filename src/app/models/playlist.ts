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

import { Disklikable } from '../interfaces/dislikable';
import { Likable } from '../interfaces/likable';

/**********/
/* MODELS */
/**********/

import { Song } from '../models/song';

//////////////////////
//                  //
//     PLAYLIST     //
//                  //
//////////////////////

export class Playlist extends Presenter implements Likable, Disklikable {

    /**************/
    /* PROPERTIES */
    /**************/

    private _songs: Array<Song>;

    /***************/
    /* CONSTRUCTOR */
    /***************/

    public constructor(
        private _disliked: boolean,
        private _liked: boolean,
        private _name: string,
    ) {
        super();
        this._songs = new Array<Song>();
    }

    /*************/
    /* ACCESSORS */
    /*************/

    get disliked(): boolean { return this._disliked; }

    get liked(): boolean { return this._disliked; }
    
    get name(): string { return this._name; }
    
    get songs(): Array<Song> { return this._songs; }

} // End class Playlist