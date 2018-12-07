//////////////////////////
//                      //
//     DEPENDENCIES     //
//                      //
//////////////////////////

/***********/
/* CLASSES */
/***********/

import { Presenter } from "./presenter";

////////////////////////
//                    //
//     COMPARISON     //
//                    //
////////////////////////

export class Comparison extends Presenter {

    /***************/
    /* CONSTRUCTOR */
    /***************/

    constructor(
        public id: number,
        public name: string
    ) { 
        super();
    }

} // End class Comparison
