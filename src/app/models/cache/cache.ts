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

    public add(key: string, value: any): void {
        if (this.has(key)) {
            console.warn(`Overwriting an existing cache key of ${key}`);
        }
        switch (value) {
            case NaN:
            // Fall Through
            case null:
            // Fall Through
            case undefined:
                console.warn(`Attempt to cache a value of ${value}`);
                break;
            default:
                this._cache[key] = value;
        }
    }

    public clear(): void {
        this._cache = new Object();
    }

    public get(key: string): any {
        return this._cache[key];
    }

    public has(key: string): boolean {
        return this._cache[key] !== undefined;
    }

    public remove(key: string): void {
        delete this._cache[key];
    }

    public update(key: string, value: any): void {
        this._cache[key] = value;
    }

} // End class Cache