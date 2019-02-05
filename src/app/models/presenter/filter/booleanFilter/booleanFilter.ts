//////////////////////////
//                      //
//     DEPENDENCIES     //
//                      //
//////////////////////////

/**********/
/* MODELS */
/**********/

import { Comparison, ComparisonType } from 'src/app/models/presenter/comparison/comparison';
import { ExternalEvent } from 'src/app/models/event/externalEvent/externalEvent';
import { EventType, exclusiveSelect } from 'src/app/models/event/event';
import { Filter, FilterType } from 'src/app/models/presenter/filter/filter';

////////////////////////////
//                        //
//     BOOLEAN FILTER     //
//                        //
////////////////////////////

export class BooleanFilter extends Filter {

    constructor(
        id: FilterType,
        name: string,
    ) {
        super(id, name);
        this.comparisons.push(new Comparison(ComparisonType.IsFalse, Comparison.getComparisonName(ComparisonType.IsFalse)));
        this.comparisons.push(new Comparison(ComparisonType.IsTrue, Comparison.getComparisonName(ComparisonType.IsTrue)));
        this.comparisons.forEach((element, index, array) => element.subscribe(new ExternalEvent(EventType.Selected, exclusiveSelect, element, index, array)));
    }

} // End class BooleanFilter
