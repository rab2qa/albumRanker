import { Component, Input, OnInit } from '@angular/core';
import { Song } from '../../../../models/song';
import { R3_PATCH_COMPONENT_DEF_WTIH_SCOPE } from '@angular/core/src/ivy_switch/compiler/ivy_switch_on';

@Component({
  selector: 'ranker-list-item',
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.scss'],
})
export class ListItemComponent implements OnInit {
  @Input() item: any;
  @Input() key: string;
  @Input() canReorder: boolean = false;
  public listItemTitle: string;
  public showDetails: boolean = false;
  public orderedTracks: Song[];

  public ngOnInit(): void {
    this.listItemTitle = this.setListItemTitle(this.key);
    this.orderedTracks = this.orderTracksByTrackNumber(this.item.tracks);
  }

  public setListItemTitle(key: string) {
    if (key === 'albums' || key === 'songs') {
      return `${this.item.artist.name} "${this.item.name}"`;
    } else if (this.key === 'artists') {
      return this.item.name;
    }
  }
  public toggleShowDetails(key: string): void {
    if (key === 'albums') {
      this.showDetails = this.showDetails ? false : true;
    }
  }

  private orderTracksByTrackNumber(discs) {
    if (!discs) {
      return;
    }
    return discs.map(tracks => {
      return tracks.sort((a, b) => {
        return a.trackNumber < b.trackNumber;
      });
    });
  }
}
