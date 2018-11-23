import { Component, OnInit } from '@angular/core';
import { PlaylistService } from './services/playlist.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(public playlistService: PlaylistService) { }

  title = 'albumRanker';
  
  handleFileInput(files: FileList) {
    let file = files.item(0);

    if (!file) {
      return;
    }

    let reader = new FileReader();
    reader.onloadend = (e: any) => {

      // Initialize Playlist Service
      this.playlistService.init(e.target.result);
  
      // Display LPs
      let longPlays = this.playlistService.GetAlbums().filter(album => album.IsLP());
      this.displayContents(longPlays, 'long-plays');
  
      // Display EPs
      let extendedPlays = this.playlistService.GetAlbums().filter(album => album.IsEP());
      this.displayContents(extendedPlays, 'extended-plays');
    };
    reader.readAsText(file);
  }

  displayContents(list, id) {
    var element = document.getElementById(id);

    list.forEach((album, index) => {
      element.innerHTML += (index + 1) + ') ' + album.artist.name + ' - ' + album.name + ' ' + '(' + album.GetRank() + ' points)' + '</br>';
    });
  }
}