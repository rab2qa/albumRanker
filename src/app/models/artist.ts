//////////////////////////
//                      //
//     DEPENDENCIES     //
//                      //
//////////////////////////

/***********/
/* CLASSES */
/***********/

import { Presenter } from '../classes/presenter';

////////////////////
//                //
//     ARTIST     //
//                //
////////////////////

export class Artist extends Presenter {

    /**************/
    /* PROPERTIES */
    /**************/

    public name: string;
    public albums: Object;
  
    /******************/
    /* PUBLIC METHODS */
    /******************/

    public constructor(name: string) {
        super();
        this.name = name;
        this.albums = new Object();
    }

} // End class Artist