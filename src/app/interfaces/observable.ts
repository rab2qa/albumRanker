import { Event, EventType } from "../models/event/event";

////////////////////////
//                    //
//     OBSERVABLE     //
//                    //
////////////////////////

export interface Observable{

    notify(thisObj: object, eventType: EventType): void;
    subscribe(event: Event): void;
    unsubscribe(callback: Function): void;

}; // end interface Observable