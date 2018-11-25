//////////////////////////
//                      //
//     DEPENDENCIES     //
//                      //
//////////////////////////

/*************/
/* FRAMEWORK */
/*************/

import { Component } from '@angular/core';

/************/
/* SERVICES */
/************/

import { PlaylistService } from './services/playlist.service';
import { XmlService } from './services/xml.service';

/**********/
/* MODELS */
/**********/

import { Artist } from './models/artist';
import { Album } from './models/album';
import { Song } from './models/song';

///////////////////////////
//                       //
//     APP COMPONENT     //
//                       //
///////////////////////////

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {

    /**************/
    /* PROPERTIES */
    /**************/

    public artists: Artist[];
    public albums: Album[];
    public albumsSupervised: Album[];
    public songs: Song[];

    /***************/
    /* CONSTRUCTOR */
    /***************/

    public constructor(public xmlService: XmlService, public playlistService: PlaylistService) {
        this.artists = [];
        this.albums = [];
        this.albumsSupervised = [];
        this.songs = [];
    }

    /******************/
    /* PUBLIC METHODS */
    /******************/

    public onFileUpload(files: FileList) {
        const file = files.item(0);

        if (file) {
            const fileReader = new FileReader();
            fileReader.onloadend = (e: any) => {
                const playlist = this.parseXML(e.target.result);
                this.playlistService.Apply(playlist);
                this.updateData();
            };
            fileReader.readAsText(file);
        }
    }

    /*******************/
    /* PRIVATE METHODS */
    /*******************/

    private parseXML(text: string): object {
        const xml = this.xmlService.FromText(text);
        const json = this.xmlService.ToJSON(xml);
        return json;
    }

    private updateData(): void {
        this.artists = this.playlistService.artists;        // TODO: implementation
        this.albums = this.playlistService.albums;
        this.albumsSupervised = this.playlistService.albums;
        this.songs = this.playlistService.songs;            // TODO: implementation
    }

} // End class AppComponent