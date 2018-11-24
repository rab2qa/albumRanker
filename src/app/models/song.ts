import { Artist } from './artist';
import { Album } from './album';
import { Ratable } from '../interfaces/ratable';

const MAX_STARS: number = 5;

class Cache {
    public ranking?: number;
    public stars: Array<number>;

    constructor() {
        this.ranking = null;
        this.stars = null;
    }
}

export class Song implements Ratable {

    ////////////////////////
    //                    //
    //     PROPERTIES     //
    //                    //
    ////////////////////////

    public id: number;
    public name: string;
    public artist: Artist;
    public album: Album;
    public genre: string;
    public duration: number;
    public releaseDate: Date;
    public rating: number;
    public loved: boolean;
    public playCount: number;
    public skipCount: number;

    private cache: Cache;

    get ranking(): number { return this.cache.ranking; };
    set ranking(value: number) { this.cache.ranking = value; };

    get stars(): Array<number> {
        if (!this.cache.stars) {
            const rating = this.rating.toFixed(2);
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

    ////////////////////////////
    //                        //
    //     PUBLIC METHODS     //
    //                        //
    ////////////////////////////

    public constructor(init?: Partial<Song>) {
        Object.assign(this, init);
        this.cache = new Cache();
    }

    public IsRated(): boolean {
        return !!(this.rating);
    }

} // End class Song