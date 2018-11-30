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

import { Pagable } from '../interfaces/pagable';

/**************/
/* INTERFACES */
/**************/

import { PaginationOptions } from '../classes/paginationOptions';

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

    private _pageSize: number;
    private _pageIndex: number;

    /***************/
    /* CONSTRUCTOR */
    /***************/

    public constructor(
        public name: string,
        private _data: Array<T>
    ) {
        this._pageSize = defaultPageSize;
        this._pageIndex = 0;
        this.paginationOptions = new PaginationOptions( false, false, _data.length, 1, defaultPageSize, [10, 25, 50, 100], true ); 
    }

    /*************/
    /* ACCESSORS */
    /*************/

    get data(): Array<T> {
        const start = this._pageSize * this._pageIndex;
        const end = start + this._pageSize - 1;
        return this._data.filter((T, index) => index >= start && index <= end);
    }

    /******************/
    /* PUBLIC METHODS */
    /******************/

    public onPageChange(event: PageEvent): void {
        this._pageIndex = event.pageIndex;
        this._pageSize = event.pageSize;
    }

} // End class Container