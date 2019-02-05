//////////////////////////
//                      //
//     DEPENDENCIES     //
//                      //
//////////////////////////

/**********/
/* MODELS */
/**********/

import { Event, EventType } from '../event';
import { Presenter } from '../../presenter/presenter';

////////////////////////////
//                        //
//     EXTERNAL EVENT     //
//                        //
////////////////////////////

export class ExternalEvent extends Event {

    constructor(id: EventType, callback: (element: Presenter, index: number, array: Array<Presenter>) => void, element: Presenter, index: number, array: Array<Presenter>) {
        super(id, callback, [element, index, array]);
    }

}; // end class ExternalEvent
