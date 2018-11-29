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
    private static _starWeights: Array<number> = [Math.pow(2, 0), Math.pow(2, 1), Math.pow(2, 2), Math.pow(2, 3), Math.pow(2, 4)];

    /*************/
    /* ACCESSORS */
    /*************/

    public static get maxRating(): number { return this._maxRating; }

    public static get minRating(): number { return this._minRating; }

    public static get penalizeEP(): boolean { return this._penalizeEP; }
    
    public static get starWeights(): Array<number> { return this._starWeights; }

} // End class Globals