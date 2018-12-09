//////////////////////////
//                      //
//     DEPENDENCIES     //
//                      //
//////////////////////////

/**********/
/* MODELS */
/**********/

import { Event, EventType } from '../event';

////////////////////////////
//                        //
//     INTERNAL EVENT     //
//                        //
////////////////////////////

export class InternalEvent extends Event {

    constructor(
        public id: EventType,
        public callback: () => void,
        public target: any
    ) {
        super(id, callback);
    }

}; // end class InternalEvent
