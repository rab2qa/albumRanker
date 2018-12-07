//////////////////////////
//                      //
//     DEPENDENCIES     //
//                      //
//////////////////////////

/***********/
/* CLASSES */
/***********/

import { Event } from "./event";
import { Status } from "./status";

/**************/
/* INTERFACES */
/**************/

import { Observable } from "../interfaces/observable";
import { Selectable } from "../interfaces/selectable";

/*************/
/* UTILITIES */
/*************/

import { Cache } from "../utilities/cache";
import { EventType } from "../utilities/enums";

///////////////////////
//                   //
//     PRESENTER     //
//                   //
///////////////////////

export abstract class Presenter implements Observable, Selectable {

    /**************/
    /* PROPERTIES */
    /**************/

    protected cache: Cache;
    protected _status: Status;
    private _events: Array<Event>;

    /***************/
    /* CONSTRUCTOR */
    /***************/

    public constructor() {
        this.cache = new Cache();
        this._status = new Status();
        this._events = new Array<Event>();
    }

    /******************/
    /* PUBLIC METHODS */
    /******************/

    // -------------------- IMPLEMENT THE OBSERVABLE INTERFACE -------------------- //

    public subscribe(event: Event): void {
        this.unsubscribe(event.callback);
        this._events.push(event);
    }

    public unsubscribe(callback: Function): void {
        this._events = this._events.filter((handler) => { return (handler.callback !== callback); });
    }

    public notify(thisObj: object, eventType: EventType): void {
        this._events
            .filter((event) => event.type === eventType)
            .forEach((event) => event.callback.apply(thisObj, event.args));
    }

    // -------------------- IMPLEMENT THE SELECTABLE INTERFACE -------------------- //

    public isAvailable(value?: boolean): boolean {
        if (value !== undefined && this._status.available !== value) {  // are we changing state?
            if (value === false) {
                this.isSelected(false);                                 // deselect anything we make unavailable
            }
            this._status.available = value;                             // make the state change
            if (this.notify) {                                          // do we implement the Observable interface?
                this.notify(this, EventType.Available);                 // update listeners to the state change
            }
        }
        return this._status.available;
    };

    public toggleAvailable(): void {
        this.isAvailable(!this.isAvailable());                          // toggle the available state
    };

    public isDirty(): boolean {
        return this._status.dirty;
    };

    public isSelected(value?: boolean): boolean {
        if (value !== undefined && this._status.selected !== value) {   // are we changing state?
            if (this.isAvailable()) {                                   // ensure that only available items can be selected
                this._status.selected = value;                          // make the state change
                this._status.dirty = !this._status.dirty;               // flip the dirty flag
                if (this.notify) {                                      // do we implement the Observable interface?
                    this.notify(this, EventType.Selected);              // update listeners to the state change
                    this.notify(this, EventType.Dirty);
                }
            }
        }
        return this._status.selected;
    };

    public toggleSelected(): void {
        this.isSelected(!this.isSelected());                            // toggle the selection state
    };

} // End class Presenter