//////////////////////////
//                      //
//     DEPENDENCIES     //
//                      //
//////////////////////////

/***********/
/* CLASSES */
/***********/

import { Filter } from "../models/presenter/filter/filter";

////////////////////////
//                    //
//     FILTERABLE     //
//                    //
////////////////////////

export interface Filterable {

    filters: Array<Filter>;
    
}; // End interface Filterable