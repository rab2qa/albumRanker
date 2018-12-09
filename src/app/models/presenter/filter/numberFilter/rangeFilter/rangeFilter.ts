//////////////////////////
//                      //
//     DEPENDENCIES     //
//                      //
//////////////////////////

/**********/
/* MODELS */
/**********/

import { Comparison, ComparisonType } from 'src/app/models/comparison/comparison';
import { EventType, exclusiveSelect } from 'src/app/models/event/event';
import { ExternalEvent } from 'src/app/models/event/externalEvent/externalEvent';
import { FilterType } from '../../filter';
import { NumberFilter } from '../numberFilter';

//////////////////////////
//                      //
//     RANGE FILTER     //
//                      //
//////////////////////////

export class RangeFilter extends NumberFilter {

    constructor(
        id: FilterType,
        name: string,
        value?: number,
        public rangeEnd?: number
    ) {
        super(id, name, value);
        const comparisons = [new Comparison(ComparisonType.IsInTheRange, Comparison.getComparisonName(ComparisonType.IsInTheRange))];
        comparisons.forEach((element, index, array) => element.subscribe(new ExternalEvent(EventType.Selected, exclusiveSelect, element, index, this.comparisons)));
        Array.prototype.push.apply(this.comparisons, comparisons);
    }

    /*************/
    /* ACCESSORS */
    /*************/

    get dirtyRangeEnd(): number { return this._cache.get('rangeEnd'); }

    /******************/
    /* PUBLIC METHODS */
    /******************/

    public isValid(): boolean {
        const superIsValid = super.isValid();
        const selectedComparison = this.comparisons.find(comparison => comparison.isSelected());
        const rangeComparisonIsSelected = !!(selectedComparison && selectedComparison.id === ComparisonType.IsInTheRange);
        const isComplete = rangeComparisonIsSelected ? !!(this.rangeEnd) : true;
        const isNotActive = !this.isActive();
        const isDirty = this.isDirty();
        return superIsValid && isComplete && (isNotActive || isDirty);
    }

    // ----------------------------------------------------------------------------------- //
    // -------------------- HIDE BASE CLASS SELECTABLE IMPLEMENTATION -------------------- //
    // ----------------------------------------------------------------------------------- //

    public clean(): void {
        super.clean();
        if (this.rangeEnd) {
            if (this._cache.has('rangeEnd')) {
                this._cache.update('rangeEnd', this.rangeEnd);
            } else {
                this._cache.add('rangeEnd', this.rangeEnd);
            }
        }
    }

    public isDirty(): boolean {
        return super.isDirty() || this._rangeEndIsDirty();
    }

    /*******************/
    /* PRIVATE METHODS */
    /*******************/

    private _rangeEndIsDirty(): boolean {
        let response = false;
        if (this.rangeEnd) {
            if (this._cache.has('rangeEnd')) {
                if (this._cache.get('rangeEnd') !== this.rangeEnd) {
                    response = true;
                }
            } else {
                response = true;
            }
        }
        return response;
    }

} // End class RangeFilter