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
    private _filters: Array<Filter>

    /***************/
    /* CONSTRUCTOR */
    /***************/

    public constructor() {
        this.getFilters();
    }

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

    get filters(): Array<Filter> {
        return this._filters.filter(filter => filter.isActive());
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

    private getFilters(): void {
        this._filters = new Array<Filter>();
        for (let key in FilterType) {
            let id = Number.parseInt(key);
            if (Number.isFinite(id)) {
                switch (id) {
                    case FilterType.Album:
                    case FilterType.AlbumArtist:
                    case FilterType.Artist:
                    case FilterType.Category:
                    case FilterType.Comments:
                    case FilterType.Composer:
                    case FilterType.Description:
                    case FilterType.Genre:
                    case FilterType.Grouping:
                    case FilterType.Kind:
                    case FilterType.MovementName:
                    case FilterType.Show:
                    case FilterType.SortAlbum:
                    case FilterType.SortAlbumArtist:
                    case FilterType.SortArtist:
                    case FilterType.SortComposer:
                    case FilterType.SortName:
                    case FilterType.SortShow:
                    case FilterType.VideoRating:
                    case FilterType.Work:
                        this._filters.push(new StringFilter(id, FilterType[key]));
                        this._filters[this._filters.length - 1].isActive(false);
                        break;
                    case FilterType.Name:
                        this._filters.push(new StringFilter(id, FilterType[key]));
                        break;
                    case FilterType.AlbumArtwork:
                    // case FilterType.AlbumLove:
                    case FilterType.Compilation:
                    // case FilterType.Love:
                    case FilterType.Purchased:
                        this._filters.push(new BooleanFilter(id, FilterType[key]));
                        this._filters[this._filters.length - 1].isActive(false);
                        break;
                    case FilterType.Checked:
                    case FilterType.Disliked:
                    case FilterType.Liked:
                        this._filters.push(new BooleanFilter(id, FilterType[key]));
                        break;
                    // case FilterType.AlbumRating:
                    case FilterType.BitRate:
                    case FilterType.BPM:
                    case FilterType.MovementNumber:
                    case FilterType.SampleRate:
                    case FilterType.Season:
                    case FilterType.Size:
                        this._filters.push(new RangeFilter(id, FilterType[key]));
                        this._filters[this._filters.length - 1].isActive(false);
                        break;
                    case FilterType.DiscNumber:
                    case FilterType.Plays:
                    case FilterType.Rating:
                    case FilterType.Skips:
                    case FilterType.TrackNumber:
                    case FilterType.Year:
                        this._filters.push(new RangeFilter(id, FilterType[key]));
                        break;
                    case FilterType.DateAdded:
                    case FilterType.DateModified:
                    case FilterType.ICloudStatus:
                    case FilterType.LastPlayed:
                    case FilterType.LastSkipped:
                    case FilterType.Location:
                    case FilterType.MediaKind:
                    case FilterType.Playlist:
                    case FilterType.Time:
                }
            }
        }
        this._filters.forEach((element, index, array) => element.subscribe(new Event(EventType.Selected, exclusiveSelect, element, index, array)));
    }

} // End class DataService