/////////////////////
//                 //
//     SERVICE     //
//                 //
/////////////////////

export class Algorithm {

    /***************/
    /* CONSTRUCTOR */
    /***************/

    public constructor() { }

    /******************/
    /* PUBLIC METHODS */
    /******************/

    public static getTransform(value: number): number {
        return value > 0 ? Math.pow(2, value - 1) : 0;
    }

    public static applyWeight(x: number, weight: number): number {
        return x * weight;
    }

    public static normalize(x: number, min: number, max: number, a?: number, b?: number): number {
        a = a || 0;
        b = b || 1;
        let result = (x - min) / (max - min);
        return this.scale(result, a, b);
    }

    public static scale(x: number, a: number, b: number) {
        return (b - a) * x + a;
    }

} // End class Algorithm