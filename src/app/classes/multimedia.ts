//////////////////////////
//                      //
//     DEPENDENCIES     //
//                      //
//////////////////////////

/***********/
/* CLASSES */
/***********/

import { Presenter } from './presenter';

/**************/
/* INTERFACES */
/**************/

import { Rankable } from '../interfaces/rankable';

////////////////////////
//                    //
//     MULTIMEDIA     //
//                    //
////////////////////////

export abstract class Multimedia extends Presenter implements Rankable {

    /*************/
    /* ACCESSORS */
    /*************/

    get ranking(): number { return this.cache.get('ranking'); };
    set ranking(value: number) { this.cache.add('ranking', value); };

    get stars(): Array<number> {
        if (!this.cache.has('stars')) {
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
            this.cache.add('stars', array);;
        }
        return this.cache.get('stars');
    }

} // End class Multimedia