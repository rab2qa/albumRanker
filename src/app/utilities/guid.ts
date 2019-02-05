//////////////////
//              //
//     GUID     //
//              //
//////////////////

class GUID {

    /**************/
    /* PROPERTIES */
    /**************/

    private static _instance: GUID;
    private _counter: number;

    /***************/
    /* CONSTRUCTOR */
    /***************/

    private constructor() { this._counter = 0; }

    /******************/
    /* PUBLIC METHODS */
    /******************/

    public static init() { return this._instance || (this._instance = new this()); }
    public get() { return (++this._counter).toString(); };

} // End class GUID

export const guid = GUID.init();