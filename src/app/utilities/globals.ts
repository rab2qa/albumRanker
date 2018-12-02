/////////////////////
//                 //
//     GLOBALS     //
//                 //
/////////////////////

export class Globals {

    /**************/
    /* PROPERTIES */
    /**************/

    private static _fortyFiveMinutes: number = 45 * 60 * 1000;
    private static _maxRating: number = 5;
    private static _minRating: number = 0;
    private static _penalizeEP: boolean = false;
    private static _thirtyMinutes: number = 30 * 60 * 1000;

    /*************/
    /* ACCESSORS */
    /*************/

    public static get fortyFiveMinutes(): number { return this._fortyFiveMinutes; }
    
    public static get maxRating(): number { return this._maxRating; }
    
    public static get minRating(): number { return this._minRating; }
    
    public static get penalizeEP(): boolean { return this._penalizeEP; }
    
    public static get thirtyMinutes(): number { return this._thirtyMinutes; }

    /******************/
    /* PUBLIC METHODS */
    /******************/

    public static rankingToStars(ranking: number): Array<number> {
        const fixedRanking = ranking.toFixed(2);
        const array = [0, 0, 0, 0, 0];
        const ratingWhole = +fixedRanking.toString().split('.')[0];
        const ratingDecimal = +fixedRanking.toString().split('.')[1];
        for (let i = 0; i < ratingWhole; i++) {
            array[i] = 100;
        }
        if (ratingWhole < 5) {
            array[ratingWhole] = ratingDecimal;
        }
        return array;
    }

} // End class Globals