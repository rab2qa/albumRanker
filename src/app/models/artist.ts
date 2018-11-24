
class Cache {
    private _ranking?: number;
    get ranking(): number { return this._ranking; }
    set ranking(value: number) { this._ranking = value; }
  
    constructor() {
      this._ranking = null;
    }
  }

export class Artist {

    ////////////////////////
    //                    //
    //     PROPERTIES     //
    //                    //
    ////////////////////////

    public name: string;
    public albums: Object;

    public cache: Cache;

    ////////////////////////////
    //                        //
    //     PUBLIC METHODS     //
    //                        //
    ////////////////////////////

    public constructor(name: string) {
        this.name = name;
        this.albums = new Object();
        this.cache = new Cache();
    }

} // End class Artist