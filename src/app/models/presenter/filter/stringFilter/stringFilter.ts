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
import { Filter, FilterType } from '../filter';

///////////////////////////
//                       //
//     STRING FILTER     //
//                       //
///////////////////////////

export class StringFilter extends Filter {

    constructor(
        id: FilterType,
        name: string,
        public value?: string
    ) {
        super(id, name);
        this.comparisons.push(new Comparison(ComparisonType.BeginsWith, Comparison.getComparisonName(ComparisonType.BeginsWith)));
        this.comparisons.push(new Comparison(ComparisonType.Contians, Comparison.getComparisonName(ComparisonType.Contians)));
        this.comparisons.push(new Comparison(ComparisonType.DoesNotContain, Comparison.getComparisonName(ComparisonType.DoesNotContain)));
        this.comparisons.push(new Comparison(ComparisonType.EndsWith, Comparison.getComparisonName(ComparisonType.EndsWith)));
        this.comparisons.push(new Comparison(ComparisonType.Is, Comparison.getComparisonName(ComparisonType.Is)));
        this.comparisons.push(new Comparison(ComparisonType.IsNot, Comparison.getComparisonName(ComparisonType.IsNot)));
        this.comparisons.forEach((element, index, array) => element.subscribe(new ExternalEvent(EventType.Selected, exclusiveSelect, element, index, array)));
    }

    /*************/
    /* ACCESSORS */
    /*************/

    get dirtyValue(): string {
        return this._cache.get('value');
    }

    /******************/
    /* PUBLIC METHODS */
    /******************/

    public isValid(): boolean {
        const superIsValid = super.isValid();
        const isComplete = !!(this.value);
        const isNotActive = !this.isActive();
        const isDirty = this.isDirty();
        return superIsValid && isComplete && (isNotActive || isDirty);
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

    /*******************/
    /* PRIVATE METHODS */
    /*******************/

    private _valueIsDirty(): boolean {
        let response = false;
        if (this.value) {
            if (this._cache.has('value')) {
                if (this._cache.get('value') !== this.value) {
                    response = true;
                }
            } else {
                response = true;
            }
        }
        return response;
    }

} // End class StringFilter