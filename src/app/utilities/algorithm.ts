/////////////////////
//                 //
//     SERVICE     //
//                 //
/////////////////////

export class Algorithm {

    /******************/
    /* PUBLIC METHODS */
    /******************/

    public static GetTransform(value: number): number {
        return value > 0 ? Math.pow(2, value - 1) : 0;
    }

    public static ApplyWeight(x: number, weight: number): number {
        return x * weight;
    }

    public static Normalize(x: number, min: number, max: number, a?: number, b?: number): number {
        a = a || 0;
        b = b || 1;
        let result = (x - min) / (max - min);
        return this.Scale(result, a, b);
    }

    public static Scale(x: number, a: number, b: number) {
        return (b - a) * x + a;
    }

} // End class Algorithm