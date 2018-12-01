//////////////////////////
//                      //
//     DEPENDENCIES     //
//                      //
//////////////////////////

/*************/
/* FRAMEWORK */
/*************/

import { Component, Input, OnInit } from '@angular/core';

/***********/
/* CLASSES */
/***********/

import { Multimedia } from 'src/app/classes/multimedia';

/**********/
/* MODELS */
/**********/

import { Album } from './../../models/album';
import { Artist } from './../../models/artist';
import { Song } from './../../models/song';

///////////////////////
//                   //
//     COMPONENT     //
//                   //
///////////////////////

@Component({
    selector: 'ranker-multimedia',
    templateUrl: './multimedia.component.html',
    styleUrls: ['./multimedia.component.scss', '../container/container.component.scss'],
})
export class MultimediaComponent implements OnInit {

    @Input() item: Multimedia;
    @Input() canReorder: boolean = false;

    /**************/
    /* PROPERTIES */
    /**************/

    public listItemTitle: string;
    public showDetails: boolean = false;
    public canShowDetails: boolean = false;

    /******************/
    /* PUBLIC METHODS */
    /******************/

    public ngOnInit(): void {
        this.setListItemTitle();
        this.createItemDetails();
    }

    public itemIsAlbum(): boolean {
        return this.item instanceof Album;
    }

    public itemIsArtist(): boolean {
        return this.item instanceof Artist;
    }
    
    public setListItemTitle() {
        if (this.item instanceof Album || this.item instanceof Song) {
            this.listItemTitle = `${this.item.artist.name} "${this.item.name}"`;
        } else if (this.item instanceof Artist) {
            this.listItemTitle = this.item.name;
        }
    }

    public toggleShowDetails(): void {
        if (this.canShowDetails) {
            this.showDetails = !this.showDetails;
        }
    }

    /*******************/
    /* PRIVATE METHODS */
    /*******************/

    private createItemDetails(): void {
        if ((this.item instanceof Album && this.item.tracks) || (this.item instanceof Artist && this.item.albums)) {
            this.canShowDetails = true;
        }
    }

} // End class MultimediaComponent