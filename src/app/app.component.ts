import { Component } from '@angular/core';
import { PlaylistService } from './services/playlist.service';
import { Album } from './models/album';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(public playlistService: PlaylistService) {}

  title = 'albumRanker';

  public albums: Album[];

  handleFileInput(files: FileList) {
    const file = files.item(0);

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onloadend = (e: any) => {
      // Initialize Playlist Service
      this.playlistService.init(e.target.result);

      // Display Albums
      this.albums = this.playlistService.GetAlbums().map(album => {
        album.rank = album.GetRank();
        return album;
      });
    };
    reader.readAsText(file);
  }

  public toggleShowAlbumDetails(album): void {
    album.showDetails = album.showDetails ? false : true;
  }
}
