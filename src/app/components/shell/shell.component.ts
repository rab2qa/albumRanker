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

import { XmlService } from '../../services/xml.service';
import { DataService } from '../../services/data.service';

///////////////////////////
//                       //
//     APP COMPONENT     //
//                       //
///////////////////////////

@Component({
  selector: 'ranker-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss'],
})
export class ShellComponent {
  /**************/
  /* PROPERTIES */
  /**************/

  public loading: boolean = false;

  /***************/
  /* CONSTRUCTOR */
  /***************/

  public constructor(public xmlService: XmlService, private dataService: DataService) {}

  /******************/
  /* PUBLIC METHODS */
  /******************/

  public onFileUpload(files: FileList) {
    const file = files.item(0);

    if (file) {
      const fileReader = new FileReader();
      this.loading = true;
      fileReader.onloadend = (e: any) => {
        const text = e.target.result;
        this.parseXML(text).then(library => {
          this.dataService.importLibrary(library).then(success => {
            this.loading = false;
          });
        });
      };
      fileReader.readAsText(file);
    }
  } // end onFileUpload()

  /*******************/
  /* PRIVATE METHODS */
  /*******************/

  private async parseXML(text: string): Promise<Object> {
    return await this.xmlService.parseXML(text);
  }
} // End class AppComponent
