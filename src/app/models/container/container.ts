//////////////////////////
//                      //
//     DEPENDENCIES     //
//                      //
//////////////////////////

/**************/
/* INTERFACES */
/**************/

import { Filterable } from 'src/app/interfaces/filterable';
import { Pagable } from 'src/app/interfaces/pagable';

/**********/
/* MODELS */
/**********/

import { Comparison, ComparisonType } from 'src/app/models/presenter/comparison/comparison';
import { exclusiveSelect, EventType } from 'src/app/models/event/event';
import { ExternalEvent } from 'src/app/models/event/externalEvent/externalEvent';
import { InternalEvent } from 'src/app/models/event/internalEvent/internalEvent';
import { Filter, FilterType } from 'src/app/models/presenter/filter/filter';
import { BooleanFilter } from 'src/app/models/presenter/filter/booleanFilter/booleanFilter';
import { NumberFilter } from 'src/app/models/presenter/filter/numberFilter/numberFilter';
import { RangeFilter } from 'src/app/models/presenter/filter/numberFilter/rangeFilter/rangeFilter';
import { StringFilter } from 'src/app/models/presenter/filter/stringFilter/stringFilter';
import { PaginationOptions } from 'src/app/models/paginationOptions/paginationOptions';

/*************/
/* UTILITIES */
/*************/

import { Cache } from 'src/app/models/cache/cache';
import { Globals } from 'src/app/utilities/globals';

////////////////////////////
//                        //
//     CONTAINER TYPE     //
//                        //
////////////////////////////

export enum ContainerType {
    Album,
    Artist,
    Playlist,
    Song
}

///////////////////////
//                   //
//     CONTAINER     //
//                   //
///////////////////////

export class Container<T> implements Filterable, Pagable {

    /**************/
    /* PROPERTIES */
    /**************/

    private _filteredData: Array<T>;
    private _filters: Array<Filter>;

    protected _cache: Cache;

    public paginationOptions: PaginationOptions;

    /***************/
    /* CONSTRUCTOR */
    /***************/

    public constructor(
        private _id: ContainerType,
        private _name: string,
        private _data: Array<T>
    ) {
        this.paginationOptions = new PaginationOptions(null, false, false, this._data.length, 0, Globals.defaultPageSize, [10, 25, 50, 100], true);
        this._cache = new Cache();
        this._filteredData = this._data;
        this._filters = new Array<Filter>();
        this._setFilters();
    }

    /*************/
    /* ACCESSORS */
    /*************/

    get all(): Array<T> { return this._data; }

    get container(): Container<T> { return this; }

    get filtered(): Array<T> { return this._filteredData; }

    get id(): ContainerType { return this._id; }

    get name(): string { return this._name; }

    get page(): Array<T> {
        const start: number = this.paginationOptions.pageSize * this.paginationOptions.pageIndex;
        const end: number = start + this.paginationOptions.pageSize;
        return this._filteredData.slice(start, end);
    }

    /******************/
    /* PUBLIC METHODS */
    /******************/

    public getAvailableFilters(): Array<Filter> {
        let availableFilters: Array<Filter> = this._cache.get('availableFilters');
        if (!availableFilters) {
            availableFilters = this.getSupportedFilters()
                .filter(filter => filter.isAvailable());
            this._cache.add('availableFilters', availableFilters);
        }
        return availableFilters;
    }

    public getSupportedFilters(): Array<Filter> {
        let supportedFilters: Array<Filter> = this._cache.get('supportedFilters');
        if (!supportedFilters) {
            supportedFilters = this._filters
                .filter(filter => filter.isSupported());
            this._cache.add('supportedFilters', supportedFilters);
        }
        return supportedFilters;
    }

    /*******************/
    /* PRIVATE METHODS */
    /*******************/

    private _applyFilter(data: Array<T>, filter: Filter): Array<T> {
        const filteredData: Array<T> = data.filter(datum => {
            const property: string = Filter.getFilterValue(filter.id);
            if (datum[property] !== undefined) {
                const selectedComparison: Comparison = filter.comparisons.find(comparison => comparison.isSelected());
                if (selectedComparison) {
                    switch (selectedComparison.id) {
                        case ComparisonType.BeginsWith:
                            return datum[property].match(new RegExp('\^' + (filter as StringFilter).value, 'i'));
                        case ComparisonType.Contians:
                            return datum[property].match(new RegExp((filter as StringFilter).value, 'i'));
                        case ComparisonType.DoesNotContain:
                            return !datum[property].match(new RegExp((filter as StringFilter).value, 'i'));
                        case ComparisonType.EndsWith:
                            const stringFilter: StringFilter = filter as StringFilter;
                            return datum[property].match(new RegExp(stringFilter.value + '\$', 'i'));
                        case ComparisonType.Is:
                            if (filter instanceof StringFilter) {
                                return datum[property].toString().toLowerCase() == filter.value.toString().toLowerCase();
                            } else if (filter instanceof NumberFilter || filter instanceof RangeFilter) {
                                return datum[property] == filter.value;
                            }
                        case ComparisonType.IsFalse:
                            return datum[property] != true;
                        case ComparisonType.IsGreaterThan:
                            return datum[property] > (filter as RangeFilter).value;
                        case ComparisonType.IsInTheRange:
                            return datum[property] >= (filter as RangeFilter).value && datum[property] <= (filter as RangeFilter).rangeEnd;
                        case ComparisonType.IsLessThan:
                            return datum[property] < (filter as RangeFilter).value;
                        case ComparisonType.IsNot:
                            if (filter instanceof StringFilter) {
                                return datum[property].toString().toLowerCase() != filter.value.toString().toLowerCase();
                            } else if (filter instanceof NumberFilter || filter instanceof RangeFilter) {
                                return datum[property] != filter.value;
                            }
                        case ComparisonType.IsTrue:
                            return datum[property] == true;
                    }
                }
            } else {
                return true;
            }
        });
        return filteredData;
    }

    private _applyFilters(): void {
        this._filteredData = this._filters
            .filter(filter => filter.isActive())
            .reduce((filteredData, filter) => {
                return this._applyFilter(filteredData, filter);
            }, this._data);
        this.paginationOptions.length = this._filteredData.length;
        this.paginationOptions.pageIndex = 0;
    }

    private _setFilters(): void {
        for (const key in FilterType) {
            const id: number = Number.parseInt(key);
            if (Number.isFinite(id)) {
                switch (id) {

                    // -------------------------------------------------------- //
                    // -------------------- STRING FILTERS -------------------- //
                    // -------------------------------------------------------- //

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
                        this._filters[this._filters.length - 1].isSupported(false);
                        break;
                    case FilterType.Name:
                        this._filters.push(new StringFilter(id, FilterType[key]));
                        break;

                    // --------------------------------------------------------- //
                    // -------------------- BOOLEAN FILTERS -------------------- //
                    // --------------------------------------------------------- //

                    case FilterType.AlbumArtwork:
                    // case FilterType.AlbumLove:
                    case FilterType.Compilation:
                    // case FilterType.Love:
                    case FilterType.Purchased:
                        this._filters.push(new BooleanFilter(id, FilterType[key]));
                        this._filters[this._filters.length - 1].isSupported(false);
                        break;
                    case FilterType.Checked:
                        this._filters.push(new BooleanFilter(id, FilterType[key]));
                        switch (this._id) {
                            case ContainerType.Artist:
                            case ContainerType.Album:
                            case ContainerType.Playlist:
                                this._filters[this._filters.length - 1].isAvailable(false);
                                break;
                            default:
                                this._filters[this._filters.length - 1].isAvailable(true);
                        }
                        break;
                    case FilterType.Disliked:
                    case FilterType.Liked:
                        this._filters.push(new BooleanFilter(id, FilterType[key]));
                        switch (this._id) {
                            case ContainerType.Artist:
                                this._filters[this._filters.length - 1].isAvailable(false);
                                break;
                            default:
                                this._filters[this._filters.length - 1].isAvailable(true);
                        }
                        break;

                    // ------------------------------------------------------- //
                    // -------------------- RANGE FILTERS -------------------- //
                    // ------------------------------------------------------- //

                    // case FilterType.AlbumRating:
                    case FilterType.BitRate:
                    case FilterType.BPM:
                    case FilterType.MovementNumber:
                    case FilterType.SampleRate:
                    case FilterType.Season:
                    case FilterType.Size:
                        this._filters.push(new RangeFilter(id, FilterType[key]));
                        this._filters[this._filters.length - 1].isSupported(false);
                        break;
                    case FilterType.DiscNumber:
                    case FilterType.TrackNumber:
                        this._filters.push(new RangeFilter(id, FilterType[key]));
                        switch (this._id) {
                            case ContainerType.Album:
                            case ContainerType.Artist:
                            case ContainerType.Playlist:
                                this._filters[this._filters.length - 1].isAvailable(false);
                                break;
                            default:
                                this._filters[this._filters.length - 1].isAvailable(true);
                        }
                        break;
                    case FilterType.Plays:
                    case FilterType.Skips:
                        this._filters.push(new RangeFilter(id, FilterType[key]));
                        switch (this._id) {
                            case ContainerType.Playlist:
                                this._filters[this._filters.length - 1].isAvailable(false);
                                break;
                            default:
                                this._filters[this._filters.length - 1].isAvailable(true);
                        }
                        break;
                    case FilterType.Rating:
                        this._filters.push(new RangeFilter(id, FilterType[key]));
                        switch (this._id) {
                            case ContainerType.Artist:
                            case ContainerType.Playlist:
                                this._filters[this._filters.length - 1].isAvailable(false);
                                break;
                            default:
                                this._filters[this._filters.length - 1].isAvailable(true);
                        }
                        break;
                    case FilterType.Year:
                        this._filters.push(new RangeFilter(id, FilterType[key]));
                        switch (this._id) {
                            case ContainerType.Artist:
                            case ContainerType.Playlist:
                            case ContainerType.Song:
                                this._filters[this._filters.length - 1].isAvailable(false);
                                break;
                            default:
                                this._filters[this._filters.length - 1].isAvailable(true);
                        }
                        break;

                    // --------------------------------------------------------- //
                    // -------------------- SPECIAL FILTERS -------------------- //
                    // --------------------------------------------------------- //

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
        this._filters.forEach((element, index, array) => element.subscribe(new ExternalEvent(EventType.Selected, exclusiveSelect, element, index, array)));
        this._filters.forEach((element) => element.subscribe(new InternalEvent(EventType.Active, this._applyFilters, this)));
    }

}  // End class Container