//////////////////////////
//                      //
//     DEPENDENCIES     //
//                      //
//////////////////////////

/***********/
/* CLASSES */
/***********/

import { Presenter } from "./presenter";

/**************/
/* INTERFACES */
/**************/

import { Selectable } from "../interfaces/selectable";

////////////////////////
//                    //
//     EVENT TYPE     //
//                    //
////////////////////////

export enum EventType {
    Active,
    Available,
    Selected,
    Supported,
    Dirty
}

///////////////////
//               //
//     EVENT     //
//               //
///////////////////

export class AppEvent {
    id: EventType;
    callback: (...args) => void;
    args: Array<any>;

    constructor(id: EventType, callback: (...args) => void, args?: Array<any>) {
        this.id = id;
        this.callback = callback;
        this.args = args;
    }

}; // end class AppEvent

export class ExternalEvent extends AppEvent {

    constructor(id: EventType, callback: (element: Presenter, index: number, array: Array<Presenter>) => void, element: Presenter, index: number, array: Array<Presenter>) {
        super(id, callback, [element, index, array]);
    }

}; // end class SelectionEvent

export class InternalEvent extends AppEvent {

    constructor(
        public id: EventType,
        public callback: () => void,
        public target: any
    ) {
        super(id, callback);
    }

}; // end class ContainerEvent

////////////////////
//                //
//     EVENTS     //
//                //
////////////////////

export function exclusiveSelect(element: Selectable, index: number, array: Array<Selectable>): void {
    if (this.isSelected()) {
        array.filter((element) => { return element !== this; }).forEach((element) => element.isSelected(false));
    }
}