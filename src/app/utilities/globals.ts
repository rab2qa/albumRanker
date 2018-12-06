/////////////////////
//                 //
//     GLOBALS     //
//                 //
/////////////////////

export class Globals {

    /*************/
    /* ACCESSORS */
    /*************/

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