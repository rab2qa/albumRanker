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
      this.albums = this.playlistService.GetAlbums().map(album => {
        album.starRatings = this.getStarRatings(album.rating);
        album.tracks.forEach(disc => {
          Object.keys(disc).forEach(track => {
            disc[track].starRatings = this.getStarRatings(disc[track].rating);
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
    rating = rating.toFixed(2);
    const array = [0, 0, 0, 0, 0];
    const ratingWhole = +rating.toString().split('.')[0];
    const ratingDecimal = +rating.toString().split('.')[1];
    for (let i = 0; i < ratingWhole; i++) {
      array[i] = 100;
    }
    if (ratingWhole < 5) {
      array[ratingWhole] = ratingDecimal;
    }
    return array;
  }
}