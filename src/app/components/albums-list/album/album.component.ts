import { Component, Input } from '@angular/core';
import { Album } from '../../../models/album';

@Component({
  selector: 'ranker-albums-list-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.scss'],
})
export class AlbumComponent {
  @Input() album: Album;
  public toggleShowAlbumDetails(album): void {
    album.showDetails = album.showDetails ? false : true;
  }
}
