//////////////////////////
//                      //
//     DEPENDENCIES     //
//                      //
//////////////////////////

/***********/
/* CLASSES */
/***********/

import { Cache } from "../utilities/cache";

/////////////////////
//                 //
//     GLOBALS     //
//                 //
/////////////////////

const MAX_STARS: number = 5;

///////////////////////
//                   //
//     PRESENTER     //
//                   //
///////////////////////

export abstract class Presenter {

    /**************/
    /* PROPERTIES */
    /**************/

    protected cache: Cache;

    /***************/
    /* CONSTRUCTOR */
    /***************/

    public constructor() {
        this.cache = new Cache();
    }

} // End class Presenter