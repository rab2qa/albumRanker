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
import { Container } from "./container";
import { Rankable } from "../interfaces/rankable";

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

// export class ContainerEvent<T> extends Event {
//     type: EventType;
//     callback: (target: Container<T>) => void;
//     target: Container<T>;

//     constructor(eventType: EventType, callback: (target: Container<T>) => void, target: Container<T>) {
//         super();
//         this.type = eventType;
//         this.callback = callback;
//         this.target = target;
//     }

// }; // end class Event

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