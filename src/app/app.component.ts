import { Component } from '@angular/core';
import { PlaylistService } from './services/playlist.service';
import { XmlService } from './services/xml.service';
import { Album } from './models/album';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(public xmlService: XmlService, public playlistService: PlaylistService) {}

  title = 'albumRanker';

  public albums: Album[];
  public albumsSupervised: Album[];

  handleFileInput(files: FileList) {
    this.albums = [];
    this.albumsSupervised = [];

    const file = files.item(0);

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onloadend = (e: any) => {
      const xml = this.xmlService.FromText(e.target.result);
      const playlist = this.xmlService.ToJson(xml);
      this.playlistService.init(playlist);

      // Display Albums
      this.albums = this.generateAlbums(this.albums);
      this.albumsSupervised = this.generateAlbums(this.albums);
    };
    reader.readAsText(file);
  }

  private generateAlbums(albums) {
    return this.playlistService.GetAlbums().map(album => {
      album.starRatings = this.getStarRatings(album.cache.ranking);
      album.tracks.forEach(disc => {
        Object.keys(disc).forEach(track => {
          disc[track].starRatings = this.getStarRatings(disc[track].rating);
        });
      });
      return album;
    });
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
} // End class AppComponent
