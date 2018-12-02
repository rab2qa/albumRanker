//////////////////////////
//                      //
//     DEPENDENCIES     //
//                      //
//////////////////////////

/*************/
/* FRAMEWORK */
/*************/

import { PageEvent } from '@angular/material';

/**************/
/* INTERFACES */
/**************/

import { Pagable, PaginationOptions } from '../interfaces/pagable';

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

    public paginationOptions: PaginationOptions;

    /***************/
    /* CONSTRUCTOR */
    /***************/

    public constructor(
        private _name: string,
        private _data: Array<T>
    ) {
        this.paginationOptions = new PaginationOptions(null, false, false, this._data.length, 0, defaultPageSize, [10, 25, 50, 100], true);
    }

    /*************/
    /* ACCESSORS */
    /*************/

    get all(): Array<T> {
        return this._data;
    }

    get page(): Array<T> {
        const start = this.paginationOptions.pageSize * this.paginationOptions.pageIndex;
        const end = start + this.paginationOptions.pageSize;
        return this._data.slice(start, end);
    }

    get name(): string { return this._name; }

    /******************/
    /* PUBLIC METHODS */
    /******************/

    public onPageChange(event: PageEvent): void {
        this.paginationOptions.pageIndex = event.pageIndex;
        this.paginationOptions.pageSize = event.pageSize;
    }

}  // End class Container