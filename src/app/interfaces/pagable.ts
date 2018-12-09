//////////////////////////
//                      //
//     DEPENDENCIES     //
//                      //
//////////////////////////

/*************/
/* FRAMEWORK */
/*************/

import { PageEvent } from "@angular/material";

/**********/
/* MODELS */
/**********/

import { PaginationOptions } from "../models/paginationOptions/paginationOptions";

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