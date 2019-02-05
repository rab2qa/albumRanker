//////////////////////////
//                      //
//     DEPENDENCIES     //
//                      //
//////////////////////////

/**************/
/* INTERFACES */
/**************/

import { Selectable } from '../../interfaces/selectable';

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

export class Event {

    /***************/
    /* CONSTRUCTOR */
    /***************/

    constructor(
        public id: EventType,
        public callback: (...args) => void,
        public args?: Array<any>) {
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