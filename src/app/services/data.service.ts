//////////////////////////
//                      //
//     DEPENDENCIES     //
//                      //
//////////////////////////

/*************/
/* FRAMEWORK */
/*************/

import { Injectable } from '@angular/core';

/**********/
/* MODELS */
/**********/

import { Library } from '../models/library';

/////////////////////
//                 //
//     SERVICE     //
//                 //
/////////////////////

@Injectable({
    providedIn: 'root',
})
export class DataService {

    /**************/
    /* PROPERTIES */
    /**************/

    private _library: Library;

    /***************/
    /* CONSTRUCTOR */
    /***************/

    public constructor() { }

    /*************/
    /* ACCESSORS */
    /*************/

    get albums(): Object {
        if (this._library) {
            return {
                initial: this._library.albums.filter(album => album.isRated()),    // TODO: Separate Complete from Partial Albums
                adjusted: this._library.albums.filter(album => album.isRated())
            };
        }
    }

    get artists(): Object {
        if (this._library) {
            return {
                initial: this._library.artists,
                adjusted: this._library.artists
            };
        }
    }

    get playlists(): Object {
        if (this._library) {
            return this._library.playlists;
        }
    }

    get songs(): Object {
        if (this._library) {
            return {
                initial: this._library.songs.filter(song => song.isRated()),  // TODO: Separate Rated from Unrated Songs
                adjusted: this._library.songs.filter(song => song.isRated())
            };
        }
    }

    /******************/
    /* PUBLIC METHODS */
    /******************/

    public async importLibrary(library: Object): Promise<boolean> {
        let success: boolean = false;

        try {
            this._library = await new Library(library);
            success = true;
        } catch (error) {
            console.error(error);
        }

        return success;
    }

} // End class DataService