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

/*************/
/* UTILITIES */
/*************/

import { EventType } from "../utilities/enums";

///////////////////
//               //
//     EVENT     //
//               //
///////////////////

export class Event {
    type: EventType;
    callback: (element: Presenter, index: number, array: Array<Presenter>) => void;
    args: Array<any>;

    constructor(eventType: EventType, callback: (element: Presenter, index: number, array: Array<Presenter>) => void, ...args) {
        this.type = eventType;
        this.callback = callback;
        this.args = args;
    }

}; // end class Event

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