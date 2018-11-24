import { Artist } from './artist';
import { Album } from './album';
import { Ratable } from '../interfaces/ratable';

class Cache {
    private _ranking?: number;
    get ranking(): number { return this._ranking; };
    set ranking(value: number) { this._ranking = value; };

    constructor() {
        this._ranking = null;
    }
}

export class Song implements Ratable{

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

    public cache: Cache;

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