import { Component, Input } from '@angular/core';
import { Album } from '../../models/album';
import { moveItemInArray, CdkDragDrop } from '@angular/cdk/drag-drop';

@Component({
  selector: 'ranker-albums-list',
  templateUrl: './albums-list.component.html',
  styleUrls: ['./albums-list.component.scss'],
})
export class AlbumsListComponent {
  @Input() albums: Album[];
  @Input() canReorder: boolean = false;
  public toggleShowAlbumDetails(album): void {
    album.showDetails = album.showDetails ? false : true;
  }
  public drop(event: CdkDragDrop<string[]>): void {
    if (this.canReorder) {
      moveItemInArray(this.albums, event.previousIndex, event.currentIndex);
    }
  }
}
