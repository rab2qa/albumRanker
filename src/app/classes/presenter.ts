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
  public ranking?: number;
  public stars?: Array<number>;

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

export class Presenter {

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

    /******************/
    /* PUBLIC METHODS */
    /******************/

    public constructor() {
        this.cache = new Cache();
    }
  
} // End class Presenter