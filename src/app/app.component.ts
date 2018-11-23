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
    this.albums = [];

    const file = files.item(0);

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onloadend = (e: any) => {
      // Initialize Playlist Service
      this.playlistService.init(e.target.result);

      // Display Albums
      const min = this.playlistService.GetMin();
      const max = this.playlistService.GetMax();

      this.albums = this.playlistService.GetAlbums().map(album => {
        album.rank = (5 - 1) * ((album.GetRank() - min) / (max - min)) + 1;
        album.tracks.forEach(disc => {
          Object.keys(disc).forEach(track => {
            disc[track].rating = disc[track].GetRating();
            disc[track].starRatings = this.getStarRatings(disc[track].rating);
            console.log(disc[track].rating);
          });
        });
        return album;
      });
    };
    reader.readAsText(file);
  }

  public toggleShowAlbumDetails(album): void {
    album.showDetails = album.showDetails ? false : true;
  }

  private getStarRatings(rating): number[] {
    // if (rating === 1) {
    //   return [1, 0, 0, 0, 0];
    // } else if (rating === 1.5) {
    //   return [1]
    // }
    return [1, 0.5, 0, 0, 0];
  }
}
