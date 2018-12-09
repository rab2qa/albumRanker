//////////////////////////
//                      //
//     DEPENDENCIES     //
//                      //
//////////////////////////

/**********/
/* MODELS */
/**********/

import { Event, EventType } from '../event/event';
import { ExternalEvent } from '../event/externalEvent/externalEvent';
import { InternalEvent } from '../event/InternalEvent/internalEvent';
import { Status } from '../status/status';

/**************/
/* INTERFACES */
/**************/

import { Observable } from '../../interfaces/observable';
import { Selectable } from '../../interfaces/selectable';

/*************/
/* UTILITIES */
/*************/

import { Cache } from '../cache/cache';

///////////////////////
//                   //
//     PRESENTER     //
//                   //
///////////////////////

export abstract class Presenter implements Observable, Selectable {

    /**************/
    /* PROPERTIES */
    /**************/
    
    private _events: Array<Event>;

    protected _cache: Cache;
    protected _status: Status;

    /***************/
    /* CONSTRUCTOR */
    /***************/

    public constructor() {
        this._cache = new Cache();
        this._status = new Status();
        this._events = new Array<Event>();
    }

    /******************/
    /* PUBLIC METHODS */
    /******************/

    // ---------------------------------------------------------------------------- //
    // -------------------- IMPLEMENT THE OBSERVABLE INTERFACE -------------------- //
    // ---------------------------------------------------------------------------- //

    public notify(thisObj: object, id: EventType): void {
        this._events
            .filter((event) => event.id === id)
            .forEach((event) => {
                if (event instanceof ExternalEvent) {
                    event.callback.apply(thisObj, event.args)
                } else if (event instanceof InternalEvent) {
                    event.callback.call(event.target);
                }
            });
    }

    public subscribe(event: Event): void {
        this.unsubscribe(event.callback);
        this._events.push(event);
    }

    public unsubscribe(callback: Function): void {
        this._events = this._events.filter((handler) => { return (handler.callback !== callback); });
    }

    // ---------------------------------------------------------------------------- //
    // -------------------- IMPLEMENT THE SELECTABLE INTERFACE -------------------- //
    // ---------------------------------------------------------------------------- //

    public clean(): void {
        this._status.dirty = false;
    }

    public isAvailable(value?: boolean, force?: boolean): boolean {
        if (value !== undefined && (this._status.available !== value || force === true)) {  // are we changing state?
            if (value === false) {
                this.isSelected(false);                                                     // deselect anything we make unavailable
            }
            this._status.available = value;                                                 // make the state change
            if (this.notify) {                                                              // do we implement the Observable interface?
                this.notify(this, EventType.Available);                                     // update listeners to the state change
            }
        }
        return this._status.available;
    };

    public isDirty(): boolean {
        return this._status.dirty;
    };

    public isSelected(value?: boolean, force?: boolean): boolean {
        if (value !== undefined && (this._status.selected !== value || force === true)) {   // are we changing state?
            if (this.isAvailable()) {                                                       // ensure that only available items can be selected
                this._status.selected = value;                                              // make the state change
                this._status.dirty = !this._status.dirty;                                   // flip the dirty flag
                if (this.notify) {                                                          // do we implement the Observable interface?
                    this.notify(this, EventType.Selected);                                  // update listeners to the state change
                    this.notify(this, EventType.Dirty);
                }
            }
        }
        return this._status.selected;
    };

    public toggleAvailable(): void {
        this.isAvailable(!this.isAvailable());  // toggle the available state
    };

    public toggleSelected(): void {
        this.isSelected(!this.isSelected());    // toggle the selection state
    };

} // End class Presenter