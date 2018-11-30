
/*************/
/* FRAMEWORK */
/*************/

import { PageEvent } from '@angular/material';

/***********/
/* CLASSES */
/***********/

import { PaginationOptions } from '../classes/paginationOptions';

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