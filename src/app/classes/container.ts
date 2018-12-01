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
import { Rankable } from '../interfaces/rankable';

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
        public name: string,
        private _data: Array<T>
    ) {
        this.paginationOptions = new PaginationOptions(false, false, this._data.length, 1, defaultPageSize, [10, 25, 50, 100], true);
    }

    /*************/
    /* ACCESSORS */
    /*************/

    get all(): Array<T> {
        return this._data;
    }

    get page(): Array<T> {
        const start = this.paginationOptions.pageSize * (this.paginationOptions.pageIndex - 1);
        const end = start + this.paginationOptions.pageSize - 1;
        return this._data.filter((T, index) => index >= start && index <= end);
    }

    /******************/
    /* PUBLIC METHODS */
    /******************/

    public onPageChange(event: PageEvent): void {
        this.paginationOptions.pageIndex = event.pageIndex;
        this.paginationOptions.pageSize = event.pageSize;
    }

    public sort() {
        try {
            const data = this._data as unknown as Array<Rankable>
            data.sort((a, b) => b.ranking - a.ranking);
        } catch(error) {
            console.log("Error trying to sort container." + error);
        }
    }

}  // End class Container