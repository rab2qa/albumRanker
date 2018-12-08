import { AppEvent, EventType } from "../classes/event";

////////////////////////
//                    //
//     OBSERVABLE     //
//                    //
////////////////////////

export interface Observable{

    subscribe(event: AppEvent): void;
    unsubscribe(callback: Function): void;
    notify(thisObj: object, eventType: EventType): void;

}; // end interface Observable