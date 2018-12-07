//////////////////////////
//                      //
//     DEPENDENCIES     //
//                      //
//////////////////////////

/***********/
/* CLASSES */
/***********/

import { Comparison } from "./comparison";
import { Presenter } from "./presenter";

/*************/
/* UTILITIES */
/*************/

import { ComparisonType, FilterType, EventType } from "../utilities/enums";
import { Globals } from "../utilities/globals";
import { Event, exclusiveSelect } from "./event";

////////////////////
//                //
//     FILTER     //
//                //
////////////////////

export abstract class Filter extends Presenter {

    public comparisons: Array<Comparison>;

    /***************/
    /* CONSTRUCTOR */
    /***************/

    public constructor(
        public id: FilterType,
        public name: string,
    ) {
        super();
        this.comparisons = new Array<Comparison>();
    }

}  // End class Filter

////////////////////////////
//                        //
//     BOOLEAN FILTER     //
//                        //
////////////////////////////

export class BooleanFilter extends Filter {

    constructor(
        public id: FilterType,
        public name: string,
    ) {
        super(id, name);
        this.comparisons.push(new Comparison(ComparisonType.IsFalse, Globals.getComparisonName(ComparisonType.IsFalse)));
        this.comparisons.push(new Comparison(ComparisonType.IsTrue, Globals.getComparisonName(ComparisonType.IsTrue)));
        this.comparisons.forEach((element, index, array) => element.subscribe(new Event(EventType.Selected, exclusiveSelect, element, index, array)));
    }

} // End class BooleanFilter

///////////////////////////
//                       //
//     NUMBER FILTER     //
//                       //
///////////////////////////

export class NumberFilter extends Filter {

    constructor(
        public id: FilterType,
        public name: string,
        public value?: number
    ) {
        super(id, name);
        this.comparisons.push(new Comparison(ComparisonType.Is, Globals.getComparisonName(ComparisonType.Is)));
        this.comparisons.push(new Comparison(ComparisonType.IsGreaterThan, Globals.getComparisonName(ComparisonType.IsGreaterThan)));
        this.comparisons.push(new Comparison(ComparisonType.IsLessThan, Globals.getComparisonName(ComparisonType.IsLessThan)));
        this.comparisons.push(new Comparison(ComparisonType.IsNot, Globals.getComparisonName(ComparisonType.IsNot)));
        this.comparisons.forEach((element, index, array) => element.subscribe(new Event(EventType.Selected, exclusiveSelect, element, index, array)));
    }

} // End class NumberFilter

//////////////////////////
//                      //
//     RANGE FILTER     //
//                      //
//////////////////////////

export class RangeFilter extends Filter {

    constructor(
        public id: FilterType,
        public name: string,
        public value?: number,
        public rangeEnd?: number
    ) {
        super(id, name);
        this.comparisons.push(new Comparison(ComparisonType.Is, Globals.getComparisonName(ComparisonType.Is)));
        this.comparisons.push(new Comparison(ComparisonType.IsGreaterThan, Globals.getComparisonName(ComparisonType.IsGreaterThan)));
        this.comparisons.push(new Comparison(ComparisonType.IsInTheRange, Globals.getComparisonName(ComparisonType.IsInTheRange)));
        this.comparisons.push(new Comparison(ComparisonType.IsLessThan, Globals.getComparisonName(ComparisonType.IsLessThan)));
        this.comparisons.push(new Comparison(ComparisonType.IsNot, Globals.getComparisonName(ComparisonType.IsNot)));
        this.comparisons.forEach((element, index, array) => element.subscribe(new Event(EventType.Selected, exclusiveSelect, element, index, array)));
    }

} // End class RangeFilter

///////////////////////////
//                       //
//     STRING FILTER     //
//                       //
///////////////////////////

export class StringFilter extends Filter {

    constructor(
        public id: FilterType,
        public name: string,
        public value?: string
    ) {
        super(id, name);
        this.comparisons.push(new Comparison(ComparisonType.BeginsWith, Globals.getComparisonName(ComparisonType.BeginsWith)));
        this.comparisons.push(new Comparison(ComparisonType.Contians, Globals.getComparisonName(ComparisonType.Contians)));
        this.comparisons.push(new Comparison(ComparisonType.DoesNotContain, Globals.getComparisonName(ComparisonType.DoesNotContain)));
        this.comparisons.push(new Comparison(ComparisonType.EndsWith, Globals.getComparisonName(ComparisonType.EndsWith)));
        this.comparisons.push(new Comparison(ComparisonType.Is, Globals.getComparisonName(ComparisonType.Is)));
        this.comparisons.push(new Comparison(ComparisonType.IsNot, Globals.getComparisonName(ComparisonType.IsNot)));
        this.comparisons.forEach((element, index, array) => element.subscribe(new Event(EventType.Selected, exclusiveSelect, element, index, array)));
    }

} // End class StringFilter