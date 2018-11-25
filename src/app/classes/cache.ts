///////////////////
//               //
//     CACHE     //
//               //
///////////////////

export class Cache {

    /**************/
    /* PROPERTIES */
    /**************/

    private _cache: object;

    /***************/
    /* CONSTRUCTOR */
    /***************/

    constructor() {
        this._cache = new Object();
    }

    /*************/
    /* ACCESSORS */
    /*************/

    public get(key: string): any {
        return this._cache[key];
    }

    public has(key: string): boolean {
        return !!(this._cache[key]);
    }

    public add(key: string, value: any): any {
        this._cache[key] = value;
    }

    public remove(key: string) {
        delete this._cache[key];
    }

} // End class Cache
