
/*************/
/* FRAMEWORK */
/*************/

import { PageEvent } from '@angular/material';

////////////////////////////////
//                            //
//     PAGINATION OPTIONS     //
//                            //
////////////////////////////////

export class PaginationOptions {

    constructor(
        //public color: ThemePalette
        public disabled: boolean,
        public hidePageSize: boolean,
        public length: number,
        public pageIndex: number,
        public pageSize: number,
        public pageSizeOptions: number[],
        public showFirstLastButtons: boolean
        // public page: EventEmitter<PageEvent>
        // public initialized: Observable<void>
    ) { }

} // End class PaginationOptions

/////////////////////
//                 //
//     PAGABLE     //
//                 //
/////////////////////

export interface Pagable {
   
    /**************/
    /* PROPERTIES */
    /**************/

    paginationOptions: PaginationOptions;

    /***********/
    /* METHODS */
    /***********/

    onPageChange(event: PageEvent): void;

} // End interface Pagable