//////////////////////////
//                      //
//     DEPENDENCIES     //
//                      //
//////////////////////////

/**********/
/* MODELS */
/**********/

import { Presenter } from 'src/app/models/presenter/presenter';

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
    IsFalse,
    IsGreaterThan,
    IsInTheRange,
    IsLessThan,
    IsNot,
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
        private _id: ComparisonType,
        private _name: string
    ) { 
        super();
    }

    /*************/
    /* ACCESSORS */
    /*************/

    get id(): ComparisonType { return this._id; }

    get name(): string { return this._name; }

    /******************/
    /* STATIC METHODS */
    /******************/

    public static getComparisonName(id: ComparisonType): string {
        switch (id) {
            case ComparisonType.BeginsWith:
                return 'Begins With';
            case ComparisonType.Contians:
                return 'Contains';
            case ComparisonType.DoesNotContain:
                return 'Does Not Contain';
            case ComparisonType.EndsWith:
                return 'Ends With';
            case ComparisonType.Is:
                return 'Is';
            case ComparisonType.IsNot:
                return 'Is Not';
            case ComparisonType.IsFalse:
                return 'Is False';
            case ComparisonType.IsGreaterThan:
                return 'Is Greater Than';
            case ComparisonType.IsLessThan:
                return 'Is Less Than';
            case ComparisonType.IsInTheRange:
                return 'Is In The Range';
            case ComparisonType.IsTrue:
                return 'Is True';
        }
    }

} // End class Comparison