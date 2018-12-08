//////////////////////////
//                      //
//     DEPENDENCIES     //
//                      //
//////////////////////////

/***********/
/* CLASSES */
/***********/

import { Presenter } from "./presenter";

/////////////////////////////
//                         //
//     COMPARISON TYPE     //
//                         //
/////////////////////////////

export enum ComparisonType {
    BeginsWith,
    Contians,
    DoesNotContain,
    EndsWith,
    Is,
    IsNot,
    IsFalse,
    IsGreaterThan,
    IsLessThan,
    IsInTheRange,
    IsTrue
}

////////////////////////
//                    //
//     COMPARISON     //
//                    //
////////////////////////

export class Comparison extends Presenter {

    /***************/
    /* CONSTRUCTOR */
    /***************/

    constructor(
        public id: number,
        public name: string
    ) { 
        super();
    }

    /******************/
    /* STATIC METHODS */
    /******************/

    public static getComparisonName(comparison: ComparisonType): string {
        switch (comparison) {
            case ComparisonType.BeginsWith:
                return "Begins With";
            case ComparisonType.Contians:
                return "Contains";
            case ComparisonType.DoesNotContain:
                return "Does Not Contain";
            case ComparisonType.EndsWith:
                return "Ends With";
            case ComparisonType.Is:
                return "Is";
            case ComparisonType.IsNot:
                return "Is Not";
            case ComparisonType.IsFalse:
                return "Is False";
            case ComparisonType.IsGreaterThan:
                return "Is Greater Than";
            case ComparisonType.IsLessThan:
                return "Is Less Than";
            case ComparisonType.IsInTheRange:
                return "Is In The Range";
            case ComparisonType.IsTrue:
                return "Is True";

        }
    }

} // End class Comparison
