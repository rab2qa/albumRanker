//////////////////////////
//                      //
//     DEPENDENCIES     //
//                      //
//////////////////////////

/*************/
/* FRAMEWORK */
/*************/

import { Component, Input, OnInit } from '@angular/core';

/**************/
/* INTERFACES */
/**************/

import { Rankable } from 'src/app/interfaces/rankable';

/**********/
/* MODELS */
/**********/

import { Album } from '../../models/presenter/album/album';
import { Artist } from '../../models/presenter/artist/artist';
import { Song } from '../../models/presenter/song/song';

///////////////////////
//                   //
//     COMPONENT     //
//                   //
///////////////////////

@Component({
    selector: 'ranker-rankable',
    templateUrl: './rankable.component.html',
    styleUrls: ['./rankable.component.scss', '../rankables/rankables.component.scss'],
})
export class RankableComponent implements OnInit {
    @Input() rankable: Rankable;

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
        return this.rankable instanceof Album;
    }

    public itemIsArtist(): boolean {
        return this.rankable instanceof Artist;
    }

    public setListItemTitle() {
        if (this.rankable instanceof Album || this.rankable instanceof Song) {
            this.listItemTitle = `${this.rankable.artist.name} "${this.rankable.name}"`;
        } else if (this.rankable instanceof Artist) {
            this.listItemTitle = this.rankable.name;
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
        if (
            (this.rankable instanceof Album && this.rankable.tracks) ||
            (this.rankable instanceof Artist && this.rankable.albums)
        ) {
            this.canShowDetails = true;
        }
    }

} // End class RankablesComponent
