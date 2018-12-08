/////////////////////
//                 //
//     GLOBALS     //
//                 //
/////////////////////

export class Globals {

    /*************/
    /* ACCESSORS */
    /*************/

    public static get defaultPageSize(): number { return 25; }

    public static get defaultRating(): number { return null; }

    public static get fortyFiveMinutes(): number { return 45 * 60 * 1000; }

    public static get maxRating(): number { return 5; }

    public static get minRating(): number { return 0; }

    public static get thirtyMinutes(): number { return 30 * 60 * 1000; }

    /******************/
    /* PUBLIC METHODS */
    /******************/

    public static newStarArray(): Array<number> {
        let starArray = new Array<number>(this.maxRating);
        for (let i = 0; i < this.maxRating; i++) {
            starArray[i] = 0;
        }
        return starArray;
    }

} // End class Globals