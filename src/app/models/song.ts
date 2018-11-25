//////////////////////////
//                      //
//     DEPENDENCIES     //
//                      //
//////////////////////////

/***********/
/* CLASSES */
/***********/

import { Presenter } from '../classes/presenter';

/**********/
/* MODELS */
/**********/

import { Artist } from './artist';
import { Album } from './album';

    //////////////////
    //              //
    //     SONG     //
    //              //
    //////////////////

export class Song extends Presenter {

    /**************/
    /* PROPERTIES */
    /**************/

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

    /***************/
    /* CONSTRUCTOR */
    /***************/

    public constructor(init?: Partial<Song>) {
        super();
        Object.assign(this, init);
    }

    /******************/
    /* PUBLIC METHODS */
    /******************/

    public IsRated(): boolean {
        return !!(this.rating);
    }

} // End class Song