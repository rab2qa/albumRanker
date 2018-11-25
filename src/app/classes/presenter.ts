//////////////////////////
//                      //
//     DEPENDENCIES     //
//                      //
//////////////////////////

/**************/
/* INTERFACES */
/**************/

import { Rankable } from "../interfaces/rankable";

/////////////////////
//                 //
//     GLOBALS     //
//                 //
/////////////////////

const MAX_STARS: number = 5;

///////////////////
//               //
//     CACHE     //
//               //
///////////////////

class Cache {

    /**************/
    /* PROPERTIES */
    /**************/

    public ranking?: number;
    public stars?: Array<number>;

    /***************/
    /* CONSTRUCTOR */
    /***************/

    constructor() {
        this.ranking = null;
        this.stars = null;
    }
}

///////////////////////
//                   //
//     PRESENTER     //
//                   //
///////////////////////

export class Presenter implements Rankable {

    /**************/
    /* PROPERTIES */
    /**************/

    protected cache: Cache;

    /*************/
    /* ACCESSORS */
    /*************/

    get ranking(): number { return this.cache.ranking; };
    set ranking(value: number) { this.cache.ranking = value; };

    get stars(): Array<number> {
        if (!this.cache.stars) {
            const rating = this.ranking.toFixed(2);
            const array = [0, 0, 0, 0, 0];
            const ratingWhole = +rating.toString().split('.')[0];
            const ratingDecimal = +rating.toString().split('.')[1];
            for (let i = 0; i < ratingWhole; i++) {
                array[i] = 100;
            }
            if (ratingWhole < 5) {
                array[ratingWhole] = ratingDecimal;
            }
            this.cache.stars = array;
        }
        return this.cache.stars;
    }

    /***************/
    /* CONSTRUCTOR */
    /***************/

    public constructor() {
        this.cache = new Cache();
    }

} // End class Presenter