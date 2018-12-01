//////////////////////////
//                      //
//     DEPENDENCIES     //
//                      //
//////////////////////////

/*************/
/* FRAMEWORK */
/*************/

import { Component, OnInit, Input } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

/***********/
/* CLASSES */
/***********/

import { Container } from '../../classes/container';

/**************/
/* INTERFACES */
/**************/

import { Rankable } from '../../interfaces/rankable';

///////////////////////
//                   //
//     COMPONENT     //
//                   //
///////////////////////

@Component({
    selector: 'ranker-rankables',
    templateUrl: './rankables.component.html',
    styleUrls: ['./rankables.component.scss'],
})
export class RankablesComponent implements OnInit {

    @Input() rankables: Container<Rankable>;
    @Input() canReorder: boolean = false;

    /**************/
    /* PROPERTIES */
    /**************/

    public listHeader: string;

    /******************/
    /* PUBLIC METHODS */
    /******************/

    public ngOnInit(): void {
        this.listHeader = this.setListHeader(this.rankables.name.toLowerCase());
    }

    public setListHeader(name) {
        if (name === 'albums') {
            return 'Artist/Album Title';
        } else if (name === 'artists') {
            return 'Artist';
        } else if (name === 'songs') {
            return 'Artist/Song Title';
        }
    }

    public handleItemDropped(event: CdkDragDrop<string[]>): void {
        if (this.canReorder) {
            moveItemInArray(this.rankables.page, event.previousIndex, event.currentIndex);
        }
    }

} // End class RankablesComponent
