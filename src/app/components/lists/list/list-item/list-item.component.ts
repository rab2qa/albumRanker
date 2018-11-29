import { Component, Input, OnInit } from '@angular/core';
import { Song } from '../../../../models/song';
import { Album } from '../../../../models/album';

@Component({
  selector: 'ranker-list-item',
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.scss', '../list.component.scss'],
})
export class ListItemComponent implements OnInit {
  @Input() item: any;
  @Input() key: string;
  @Input() canReorder: boolean = false;
  public listItemTitle: string;
  public showDetails: boolean = false;
  public canShowDetails: boolean = false;
  public orderedTracks: Song[];
  public orderedAlbums: Album[];

  public ngOnInit(): void {
    this.listItemTitle = this.setListItemTitle(this.key);
    this.createItemDetails(this.item, this.key);
    console.log(this.item);
  }

  public setListItemTitle(key: string) {
    if (key === 'albums' || key === 'songs') {
      return `${this.item.artist.name} "${this.item.name}"`;
    } else if (this.key === 'artists') {
      return this.item.name;
    }
  }

  public toggleShowDetails(): void {
    if (this.canShowDetails) {
      this.showDetails = this.showDetails ? false : true;
    }
  }

  private createItemDetails(item, key): void {
    if (key === 'albums' && item.tracks) {
      this.orderedTracks = this.orderTracksByRanking(item.tracks);
      this.canShowDetails = true;
    } else if (key === 'artists' && item.albums) {
      console.log(item);
      this.orderedAlbums = item.albums.sort((a, b) => {
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
}
