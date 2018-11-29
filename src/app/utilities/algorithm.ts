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

    // ------------------------------------------------------------------------
    // LINEAR TRANSFORM 
    // ------------------------------------------------------------------------
    // Algorithm:   Transforms a given positve input (x) into a linear function
    //              Optional: b = slope
    //              Optional: a = y-intercept
    //
    // Formula:     y = a + b * x
    // ------------------------------------------------------------------------

    public static linearTransform(x: number, b?: number, a?: number) {
        b = b || 1;
        a = a || 0;
        return a + b * x;
    }

    // ------------------------------------------------------------------------------
    // EXPONENTIAL TRANSFORM 
    // ------------------------------------------------------------------------------
    // Algorithm:   Transforms a given positve input (x) into an exponential function
    //              Optional: b = base
    //              Optional: a = coefficient
    //              Optional: v = vertical shift
    //              Optional: h = horizontal shift
    //
    // Formula:     y = a * b^(x + h) + v
    //
    // Example:     x = 0 -> 1
    //              x = 1 -> 2
    //              x = 2 -> 4
    //              x = 3 -> 8
    //              x = 4 -> 16
    // ------------------------------------------------------------------------------

    public static expTransform(x: number, b?: number, a?: number, v?: number, h?: number): number {
        a = a || 1;
        b = b || Math.E;
        v = v || 0;
        h = h || 0;
        return a * Math.pow(b, x + h) + v;
    }

    // ---------------------------------------------------
    // APPLY WEIGHT
    // ---------------------------------------------------
    // Algorithm:   Apply a weighting to a given input (x)  
    //  
    // Example:     x = 1, weight = 0.5 -> 0.5
    // ---------------------------------------------------

    public static applyWeight(x: number, weight: number): number {
        return x * weight;
    }

    // -------------------------------------------------------------------------------------------
    // NORMALIZE
    // -------------------------------------------------------------------------------------------
    // Algorithm:   Normalizes a given input (x) to a number in the range [0, 1]
    //              Optional parameters (a) and (b) will also scale the result to the range [a, b]
    //
    // Formula: x[i] = (x[i] - x[min]) / (x[max] - x[min])
    //
    // -------------------------------------------------------------------------------------------

    public static normalize(x: number, min: number, max: number, a?: number, b?: number): number {
        a = a || 0;
        b = b || 1;

        let result = 0;

        result = (x - min) / (max - min);
        result = result || 0; // Handle Divide by Zero error

        return this.scale(result, a, b);
    }

    // ---------------------------------------------------------
    // SCALE
    // ---------------------------------------------------------
    // Algorithm:   Scales a given input (x) to the range [a, b]
    //
    // Example:     x = 0.5, [a, b] = [0, 5] -> 2.5
    // ---------------------------------------------------------

    public static scale(x: number, a: number, b: number) {
        return (b - a) * x + a;
    }

} // End class Algorithm