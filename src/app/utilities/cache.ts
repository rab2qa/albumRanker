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

    /******************/
    /* PUBLIC METHODS */
    /******************/

    public add(key: string, value: any): any {
        if (this.has(key)) {
            console.warn("Overwriting an existing cache key: " + key);
        }
        this._cache[key] = value;
    }

    public clear(): void {
        this._cache = new Object();
    }

    public get(key: string): any {
        return this._cache[key];
    }

    public has(key: string): boolean {
        return !!(this._cache[key]);
    }

    public remove(key: string) {
        delete this._cache[key];
    }

} // End class Cache
