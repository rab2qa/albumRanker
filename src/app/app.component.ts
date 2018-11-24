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

    public albums: Album[];
    public albumsSupervised: Album[];

    constructor(public xmlService: XmlService, public playlistService: PlaylistService) {
        this.albums = [];
        this.albumsSupervised = [];
    }

    public handleFileInput(files: FileList) {
        const file = files.item(0);

        if (file) {
            const fileReader = new FileReader();
            fileReader.onloadend = (e: any) => {
                const xml = this.xmlService.FromText(e.target.result);
                const json = this.xmlService.ToJSON(xml);
                this.playlistService.FromJSON(json);

                // Update Albums
                this.albums = this.playlistService.albums;
                this.albumsSupervised = this.playlistService.albums;
            };
            fileReader.readAsText(file);
        }
    }

} // End class AppComponent
