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
import { Filter, FilterType } from '../filter';

///////////////////////////
//                       //
//     NUMBER FILTER     //
//                       //
///////////////////////////

export class NumberFilter extends Filter {

    constructor(
        id: FilterType,
        name: string,
        public value?: number
    ) {
        super(id, name);
        this.comparisons.push(new Comparison(ComparisonType.Is, Comparison.getComparisonName(ComparisonType.Is)));
        this.comparisons.push(new Comparison(ComparisonType.IsGreaterThan, Comparison.getComparisonName(ComparisonType.IsGreaterThan)));
        this.comparisons.push(new Comparison(ComparisonType.IsLessThan, Comparison.getComparisonName(ComparisonType.IsLessThan)));
        this.comparisons.push(new Comparison(ComparisonType.IsNot, Comparison.getComparisonName(ComparisonType.IsNot)));
        this.comparisons.forEach((element, index, array) => element.subscribe(new ExternalEvent(EventType.Selected, exclusiveSelect, element, index, array)));
    }

    /*************/
    /* ACCESSORS */
    /*************/

    get dirtyValue(): number { return this._cache.get('value'); }

    /******************/
    /* PUBLIC METHODS */
    /******************/

    // ------------------------------------------------------------------------------------ //
    // -------------------- HIDE BASE CLASS ACTIVATABLE IMPLEMENTATION -------------------- //
    // ------------------------------------------------------------------------------------ //

    public isActive(value?: boolean): boolean {
        if (value === true && this.isDirty()) {
            this.clean();
            return super.isActive(value, true);
        } else {
            return super.isActive(value);
        }
    }

    // ----------------------------------------------------------------------------------- //
    // -------------------- HIDE BASE CLASS SELECTABLE IMPLEMENTATION -------------------- //
    // ----------------------------------------------------------------------------------- //

    public clean(): void {
        super.clean();
        if (this.value) {
            if (this._cache.has('value')) {
                this._cache.update('value', this.value);
            } else {
                this._cache.add('value', this.value);
            }
        }
    }

    public isDirty(): boolean {
        return super.isDirty() || this._valueIsDirty();
    }

    // ------------------------------------------------------------------------------------ //
    // -------------------- HIDE BASE CLASS VALIDATABLE IMPLEMENTATION -------------------- //
    // ------------------------------------------------------------------------------------ //

    public isValid(): boolean {
        const superIsValid: boolean = super.isValid();
        const isComplete: boolean = !!(this.value);
        const isNotActive: boolean = !this.isActive();
        const thisIsDirty: boolean = this.isDirty();
        return superIsValid && isComplete && (isNotActive || thisIsDirty);
    }

    /*******************/
    /* PRIVATE METHODS */
    /*******************/

    private _valueIsDirty(): boolean {
        let valueIsDirty: boolean = false;
        if (this.value) {
            if (this._cache.has('value')) {
                if (this._cache.get('value') !== this.value) {
                    valueIsDirty = true;
                }
            } else {
                valueIsDirty = true;
            }
        }
        return valueIsDirty;
    }

} // End class NumberFilter