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

import { Filter, BooleanFilter, RangeFilter, StringFilter, NumberFilter } from './filter';

/**************/
/* INTERFACES */
/**************/

import { Pagable, PaginationOptions } from '../interfaces/pagable';
import { ComparisonType, FilterType } from '../utilities/enums';

/*************/
/* UTILITIES */
/*************/

import { Globals } from '../utilities/globals';

/////////////////////
//                 //
//     GLOBALS     //
//                 //
/////////////////////

const defaultPageSize = 25;

///////////////////////
//                   //
//     CONTAINER     //
//                   //
///////////////////////

export class Container<T> implements Pagable {

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
        private _name: string,
        private _data: Array<T>
    ) {
        this.paginationOptions = new PaginationOptions(null, false, false, this._data.length, 0, defaultPageSize, [10, 25, 50, 100], true);
        this._filteredData = this._data;
        this._filters = new Array<Filter>();
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

    get page(): Array<T> {
        const start = this.paginationOptions.pageSize * this.paginationOptions.pageIndex;
        const end = start + this.paginationOptions.pageSize;
        return this._filteredData.slice(start, end);
    }

    get name(): string { return this._name; }

    /******************/
    /* PUBLIC METHODS */
    /******************/

    public onPageChange(event: PageEvent): void {
        this.paginationOptions.pageIndex = event.pageIndex;
        this.paginationOptions.pageSize = event.pageSize;
    }

    public addFilter(filter: Filter): void {
        this.removeFilter(filter);
        this._filters.push(filter);
        this.applyFilters();
    }

    public applyFilters(): void {
        this._filteredData = this._filters.reduce((filteredData, filter) => {
            return this.applyFilter(filteredData, filter);
        }, this._data);
        this.paginationOptions.length = this._filteredData.length;
    }

    public clearFilters(): void {
        this._filters = new Array<Filter>();
        this.applyFilters();
    }
    public removeFilter(filter: Filter): void {
        this._filters = this._filters.filter(element => element.id !== filter.id);
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

}  // End class Container