//////////////////////////
//                      //
//     DEPENDENCIES     //
//                      //
//////////////////////////

/***********/
/* CLASSES */
/***********/

import { Multimedia } from '../classes/multimedia';

////////////////////
//                //
//     ARTIST     //
//                //
////////////////////

export class Artist extends Multimedia {

    /**************/
    /* PROPERTIES */
    /**************/

    private _albums: object;

    /***************/
    /* CONSTRUCTOR */
    /***************/

    public constructor(
        private _name: string
    ) {
        super();
        this._albums = new Object();
    }

    /*************/
    /* ACCESSORS */
    /*************/

    get albums(): object { return this._albums; }
    
    get name(): string { return this._name; }

} // End class Artist