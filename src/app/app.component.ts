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
import { DataService } from './services/data.service';

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

  /***************/
  /* CONSTRUCTOR */
  /***************/

  public constructor(
    public xmlService: XmlService,
    public playlistService: PlaylistService,
    private dataService: DataService
  ) {}

  /******************/
  /* PUBLIC METHODS */
  /******************/

  public onFileUpload(files: FileList) {
    const file = files.item(0);

    if (file) {
      const fileReader = new FileReader();
      fileReader.onloadend = (e: any) => {
        const playlist = this.parseXML(e.target.result);
        this.playlistService.apply(playlist);
        this.dataService.updateData(this.playlistService);
      };
      fileReader.readAsText(file);
    }
  }

  /*******************/
  /* PRIVATE METHODS */
  /*******************/

  private parseXML(text: string): object {
    const xml = this.xmlService.fromText(text);
    const json = this.xmlService.toJSON(xml);
    return json;
  }
} // End class AppComponent
