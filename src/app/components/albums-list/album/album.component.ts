import { Component, Input } from '@angular/core';
import { Album } from '../../../models/album';

@Component({
  selector: 'ranker-albums-list-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.scss'],
})
export class AlbumComponent {
  @Input() album: Album;
  public showDetails: boolean = false;
  public toggleShowAlbumDetails(album): void {
    this.showDetails = this.showDetails ? false : true;
  }
}
