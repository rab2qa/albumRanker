import { EventType } from "../utilities/enums";
import { Event } from "../classes/event";

////////////////////////
//                    //
//     OBSERVABLE     //
//                    //
////////////////////////

export interface Observable{

    subscribe(event: Event): void;
    unsubscribe(callback: Function): void;
    notify(thisObj: object, eventType: EventType): void;

}; // end interface Observable