//////////////////////////
//                      //
//     DEPENDENCIES     //
//                      //
//////////////////////////

/*************/
/* FRAMEWORK */
/*************/

import { PageEvent, ThemePalette } from '@angular/material';

////////////////////////////////
//                            //
//     PAGINATION OPTIONS     //
//                            //
////////////////////////////////

export class PaginationOptions {

    public page: (event: PageEvent) => void;

    constructor(
        public color?: ThemePalette,
        public disabled?: boolean,
        public hidePageSize?: boolean,
        public length?: number,
        public pageIndex?: number,
        public pageSize?: number,
        public pageSizeOptions?: number[],
        public showFirstLastButtons?: boolean,
        // public initialized?: Observable<void>
    ) { 
        this.page = function(event: PageEvent): void {
            this.pageIndex = event.pageIndex;
            this.pageSize = event.pageSize;
        }
    }

} // End class PaginationOptions
