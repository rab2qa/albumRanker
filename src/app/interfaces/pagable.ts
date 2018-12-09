//////////////////////////
//                      //
//     DEPENDENCIES     //
//                      //
//////////////////////////

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

} // End interface Pagable