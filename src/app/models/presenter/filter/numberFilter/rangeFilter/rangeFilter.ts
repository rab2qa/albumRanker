//////////////////////////
//                      //
//     DEPENDENCIES     //
//                      //
//////////////////////////

/**********/
/* MODELS */
/**********/

import { Comparison, ComparisonType } from 'src/app/models/presenter/comparison/comparison';
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
        const comparisons: Array<Comparison> = [new Comparison(ComparisonType.IsInTheRange, Comparison.getComparisonName(ComparisonType.IsInTheRange))];
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

    // ------------------------------------------------------------------------------------ //
    // -------------------- HIDE BASE CLASS VALIDATABLE IMPLEMENTATION -------------------- //
    // ------------------------------------------------------------------------------------ //

    public isValid(): boolean {
        const superIsValid: boolean = super.isValid();
        const selectedComparison: Comparison = this.comparisons.find(comparison => comparison.isSelected());
        const rangeComparisonIsSelected: boolean = !!(selectedComparison && selectedComparison.id === ComparisonType.IsInTheRange);
        const thisIsComplete: boolean = rangeComparisonIsSelected ? !!(this.rangeEnd) : true;
        const thisIsNotActive: boolean = !this.isActive();
        const thisIsDirty: boolean = this.isDirty();
        return superIsValid && thisIsComplete && (thisIsNotActive || thisIsDirty);
    }

    /*******************/
    /* PRIVATE METHODS */
    /*******************/

    private _rangeEndIsDirty(): boolean {
        let rangeEndIsDirty: boolean = false;
        if (this.rangeEnd) {
            if (this._cache.has('rangeEnd')) {
                if (this._cache.get('rangeEnd') !== this.rangeEnd) {
                    rangeEndIsDirty = true;
                }
            } else {
                rangeEndIsDirty = true;
            }
        }
        return rangeEndIsDirty;
    }

} // End class RangeFilter