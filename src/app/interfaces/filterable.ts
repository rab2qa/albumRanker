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

    addFilter(filter: Filter): void;
    clearFilters(): void;
    removeFilter(filter: Filter): void;
    
}; // End interface Filterable