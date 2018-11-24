import { Component, Input } from '@angular/core';
import { Album } from '../../models/album';

@Component({
  selector: 'ranker-albums-list',
  templateUrl: './albums-list.component.html',
  styleUrls: ['./albums-list.component.scss'],
})
export class AlbumsListComponent {
  @Input() albums: Album[];
  public toggleShowAlbumDetails(album): void {
    album.showDetails = album.showDetails ? false : true;
  }
}
