import { Component, Input, OnInit } from '@angular/core';
import { Song } from './../../models/song';
import { Album } from './../../models/album';
import { Artist } from './../../models/artist';

@Component({
    selector: 'ranker-multimedia',
    templateUrl: './multimedia.component.html',
    styleUrls: ['./multimedia.component.scss', '../container/container.component.scss'],
})
export class MultimediaComponent implements OnInit {

    @Input() item: any;
    @Input() canReorder: boolean = false;

    public listItemTitle: string;
    public showDetails: boolean = false;
    public canShowDetails: boolean = false;
    public orderedTracks: Song[];
    public orderedAlbums: Album[];

    public ngOnInit(): void {
        this.setListItemTitle();
        this.createItemDetails();
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
            this.showDetails = this.showDetails ? false : true;
        }
    }

    private createItemDetails(): void {
        if (this instanceof Album && this.item.tracks) {
            this.orderedTracks = this.orderTracksByRanking(this.item.tracks);
            this.canShowDetails = true;
        } else if (this instanceof Artist && this.item.albums) {
            this.orderedAlbums = this.item.albums.sort((a, b) => {
                return b.ranking - a.ranking;
            });
            this.canShowDetails = true;
        }
    }

    private orderTracksByRanking(discs): Song[] {
        return discs.map(disc => {
            return disc.sort((a, b) => {
                return b.ranking - a.ranking;
            });
        });
    }

} // End class MultimediaComponent
