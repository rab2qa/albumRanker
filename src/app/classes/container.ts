//////////////////////////
//                      //
//     DEPENDENCIES     //
//                      //
//////////////////////////

/*************/
/* FRAMEWORK */
/*************/

import { PageEvent } from '@angular/material';

/***********/
/* CLASSES */
/***********/

import { Event, exclusiveSelect } from './event';
import { Filter, BooleanFilter, RangeFilter, StringFilter, NumberFilter } from './filter';

/**************/
/* INTERFACES */
/**************/

import { Filterable } from '../interfaces/filterable';
import { Pagable, PaginationOptions } from '../interfaces/pagable';

/*************/
/* UTILITIES */
/*************/

import { ComparisonType, FilterType, ContainerType, EventType } from '../utilities/enums';
import { Globals } from '../utilities/globals';

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

    public paginationOptions: PaginationOptions;

    /***************/
    /* CONSTRUCTOR */
    /***************/

    public constructor(
        private _id: number,
        private _name: string,
        private _data: Array<T>
    ) {
        this.paginationOptions = new PaginationOptions(null, false, false, this._data.length, 0, Globals.defaultPageSize, [10, 25, 50, 100], true);
        this._filteredData = this._data;
        this._filters = new Array<Filter>();
        this.setFilters();
    }

    /*************/
    /* ACCESSORS */
    /*************/

    get all(): Array<T> {
        return this._data;
    }

    get filtered(): Array<T> {
        return this._filteredData;
    }

    get filters(): Array<Filter> {
        return this._filters.filter(filter => filter.isSupported());
    }

    get page(): Array<T> {
        const start = this.paginationOptions.pageSize * this.paginationOptions.pageIndex;
        const end = start + this.paginationOptions.pageSize;
        return this._filteredData.slice(start, end);
    }

    get id(): number { return this._id; }

    get name(): string { return this._name; }

    /******************/
    /* PUBLIC METHODS */
    /******************/

    public onPageChange(event: PageEvent): void {
        this.paginationOptions.pageIndex = event.pageIndex;
        this.paginationOptions.pageSize = event.pageSize;
    }

    public addFilter(filter: Filter): void {
        filter.isActive(true);
        this.applyFilters();
    }

    public applyFilters(): void {
        this._filteredData = this._filters
            .filter(filter => filter.isActive())
            .reduce((filteredData, filter) => {
                return this.applyFilter(filteredData, filter);
            }, this._data);
        this.paginationOptions.length = this._filteredData.length;
    }

    public clearFilters(): void {
        this._filters
            .filter(filter => filter.isActive())
            .forEach(filter => filter.isActive(false));
        this.applyFilters();
    }

    public removeFilter(filter: Filter): void {
        filter.isActive(false);
        this.applyFilters();
    }

    /*******************/
    /* PRIVATE METHODS */
    /*******************/

    public applyFilter(data: Array<T>, filter: Filter): Array<T> {
        let response = data.filter(datum => {
            const property = Globals.getPropertyValue(filter.id);
            if (datum[property] !== undefined) {
                let selectedComparison = filter.comparisons.find(comparison => comparison.isSelected());
                if (selectedComparison) {
                    switch (selectedComparison.id) {
                        case ComparisonType.BeginsWith:
                            return datum[property].match(new RegExp('\^' + (filter as StringFilter).value, "i"));
                        case ComparisonType.Contians:
                            return datum[property].match(new RegExp((filter as StringFilter).value, "i"));
                        case ComparisonType.DoesNotContain:
                            return !datum[property].match(new RegExp((filter as StringFilter).value, "i"));
                        case ComparisonType.EndsWith:
                            const stringFilter = filter as StringFilter;
                            return datum[property].match(new RegExp(stringFilter.value + '\$', "i"));
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
        return response;
    }

    private setFilters(): void {
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
                        this._filters[this._filters.length - 1].isSupported(false);
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
                        this._filters[this._filters.length - 1].isSupported(false);
                        break;
                    case FilterType.Checked:
                        this._filters.push(new BooleanFilter(id, FilterType[key]));
                        switch (this._id) {
                            case ContainerType.Artist:
                            case ContainerType.Album:
                            case ContainerType.Playlist:
                                this._filters[this._filters.length - 1].isSupported(false);
                                break;
                            default:
                                this._filters[this._filters.length - 1].isSupported(true);
                        }
                        break;
                    case FilterType.Disliked:
                    case FilterType.Liked:
                        this._filters.push(new BooleanFilter(id, FilterType[key]));
                        switch (this._id) {
                            case ContainerType.Artist:
                                this._filters[this._filters.length - 1].isSupported(false);
                                break;
                            default:
                                this._filters[this._filters.length - 1].isSupported(true);
                        }
                        break;
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
                                this._filters[this._filters.length - 1].isSupported(false);
                                break;
                            default:
                                this._filters[this._filters.length - 1].isSupported(true);
                        }
                        break;
                    case FilterType.Plays:
                    case FilterType.Skips:
                    this._filters.push(new RangeFilter(id, FilterType[key]));
                    switch (this._id) {
                        case ContainerType.Playlist:
                            this._filters[this._filters.length - 1].isSupported(false);
                            break;
                        default:
                            this._filters[this._filters.length - 1].isSupported(true);
                    }
                    break;
                    case FilterType.Rating:
                        this._filters.push(new RangeFilter(id, FilterType[key]));
                        switch (this._id) {
                            case ContainerType.Artist:
                            case ContainerType.Playlist:
                                this._filters[this._filters.length - 1].isSupported(false);
                                break;
                            default:
                                this._filters[this._filters.length - 1].isSupported(true);
                        }
                        break;
                    case FilterType.Year:
                        this._filters.push(new RangeFilter(id, FilterType[key]));
                        switch (this._id) {
                            case ContainerType.Artist:
                            case ContainerType.Playlist:
                            case ContainerType.Song:
                                this._filters[this._filters.length - 1].isSupported(false);
                                break;
                            default:
                                this._filters[this._filters.length - 1].isSupported(true);
                        }
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

}  // End class Container