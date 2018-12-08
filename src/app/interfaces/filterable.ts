//////////////////////////
//                      //
//     DEPENDENCIES     //
//                      //
//////////////////////////

/***********/
/* CLASSES */
/***********/

import { Filter } from "../classes/filter";

////////////////////////
//                    //
//     FILTERABLE     //
//                    //
////////////////////////

export interface Filterable {

    filters: Array<Filter>;
    
}; // End interface Filterable