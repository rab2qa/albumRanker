//////////////////////////
//                      //
//     DEPENDENCIES     //
//                      //
//////////////////////////

/*************/
/* FRAMEWORK */
/*************/

import { Injectable } from '@angular/core';

/***********/
/* CLASSES */
/***********/

import { Event, exclusiveSelect } from '../classes/event';

/**********/
/* MODELS */
/**********/

import { Filter, BooleanFilter, NumberFilter, RangeFilter, StringFilter } from '../classes/filter';
import { Library } from '../models/library';

import { FilterType, EventType } from '../utilities/enums';
import { Globals } from '../utilities/globals';

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

    get library(): Object {
        if (this._library) {
            return {
                initial: this._library,
                adjusted: this._library
            }
        }
    }

    get albums(): Object {
        if (this._library) {
            return {
                initial: this._library.albums,
                adjusted: this._library.albums
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
                initial: this._library.songs,
                adjusted: this._library.songs
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

    /*******************/
    /* PRIVATE METHODS */
    /*******************/

} // End class DataService