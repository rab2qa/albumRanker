/////////////////////
//                 //
//     GLOBALS     //
//                 //
/////////////////////

export class Globals {

    /**************/
    /* PROPERTIES */
    /**************/

    private static _maxRating: number = 5;
    private static _minRating: number = 0;
    private static _penalizeEP: boolean = false;

    /*************/
    /* ACCESSORS */
    /*************/

    public static get maxRating(): number { return this._maxRating; }

    public static get minRating(): number { return this._minRating; }

    public static get penalizeEP(): boolean { return this._penalizeEP; }

} // End class Globals