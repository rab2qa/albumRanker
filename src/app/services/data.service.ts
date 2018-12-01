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

import { Container } from '../classes/container';

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

    get library(): Object {
        if (this._library) {
            return {
                initial: this._library,
                adjusted: this._library
            }
        }
    }

    // get albums(): Object {
    //     if (this._library) {
    //         const fullyRankedAlbumsByRanking = this._library.albums
    //         .filter(album => album.isRated() || album.hasAllSongsRated())   // TODO: Separate Complete from Partially Rated Albums
    //         .sort((a, b) => b.ranking - a.ranking);
    //         return {
    //             initial: new Container("Albums", fullyRankedAlbumsByRanking),
    //             adjusted: new Container("Albums", fullyRankedAlbumsByRanking)
    //         };
    //     }
    // }

    // get artists(): Object {
    //     if (this._library) {
    //         const artistsByRanking = this._library.artists.sort((a, b) => b.ranking - a.ranking);
    //         return {
    //             initial: new Container("Artists", artistsByRanking),
    //             adjusted: new Container("Artists", artistsByRanking)
    //         };
    //     }
    // }

    // get playlists(): Object {
    //     if (this._library) {
    //         const playlists = this._library.playlists;
    //         return new Container("Playlists", playlists);
    //     }
    // }

    // get songs(): Object {
    //     if (this._library) {
    //         const ratedSongsByRanking = this._library.songs
    //         .filter(song => song.isRated()) // TODO: Separate Rated from Unrated Songs
    //         .sort((a, b) => b.ranking - a.ranking);
    //         return {
    //             initial: new Container("Songs", ratedSongsByRanking), 
    //             adjusted: new Container("Songs", ratedSongsByRanking)
    //         };
    //     }
    // }


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
            this._library.artists.sort();
            this._library.albums.sort();
            this._library.songs.sort();
            success = true;
        } catch (error) {
            console.error(error);
        }

        return success;
    }

} // End class DataService