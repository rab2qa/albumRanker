//////////////////////////
//                      //
//     DEPENDENCIES     //
//                      //
//////////////////////////

/**************/
/* INTERFACES */
/**************/

import { Disklikable } from '../../../interfaces/dislikable';
import { Likable } from '../../../interfaces/likable';

/**********/
/* MODELS */
/**********/

import { Library } from '../library/library';
import { Presenter } from '../presenter';
import { Song } from '../song/song';

/*************/
/* UTILITIES */
/*************/

import { Settings } from '../../../utilities/settings';

//////////////////////
//                  //
//     PLAYLIST     //
//                  //
//////////////////////

export class Playlist extends Presenter implements Likable, Disklikable {

    /**************/
    /* PROPERTIES */
    /**************/

    private _disliked: boolean;
    private _library?: Library;
    private _liked: boolean;
    private _name: string;
    private _songs: Array<Song>;
    
    /***************/
    /* CONSTRUCTOR */
    /***************/

    public constructor(json: Object) {
        super();

        this._disliked = json['Disliked'] === 'true';
        this._liked = json['Loved'] === 'true';
        this._name = json['Name'];

        this._songs = new Array<Song>();
    }

    /*************/
    /* ACCESSORS */
    /*************/

    get disliked(): boolean { return this._disliked; }

    get library(): Library { return this._library; }
    set library(library: Library) { this._library = library; }

    get liked(): boolean { return this._disliked; }
    
    get name(): string { return this._name; }
    
    get songs(): Array<Song> { return this._songs; }

    /******************/
    /* PUBLIC METHODS */
    /******************/

    public isDisliked(): boolean {
        return !Settings.ignoreLikesAndDislikes && this._disliked;
    }

    public isLiked(): boolean {
        return !Settings.ignoreLikesAndDislikes && this._liked;
    }

} // End class Playlist