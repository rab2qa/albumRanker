//////////////////////////
//                      //
//     DEPENDENCIES     //
//                      //
//////////////////////////

/*************/
/* FRAMEWORK */
/*************/

import { Component } from '@angular/core';
import { Location } from '@angular/common';

/************/
/* SERVICES */
/************/

import { XmlService } from '../../services/xml.service';
import { DataService } from '../../services/data.service';
import { Router } from '@angular/router';

///////////////////////////
//                       //
//     UPLOAD COMPONENT  //
//                       //
///////////////////////////

@Component({
    selector: 'ranker-upload',
    templateUrl: './upload.component.html',
    styleUrls: ['./upload.component.scss'],
})
export class UploadComponent {

    /**************/
    /* PROPERTIES */
    /**************/

    public loading: boolean = false;
    public canCancel: boolean = false;

    /***************/
    /* CONSTRUCTOR */
    /***************/

    public constructor(
        private router: Router,
        private location: Location,
        public xmlService: XmlService,
        private dataService: DataService
    ) {
        const libraryXML = localStorage.getItem('libraryXML');
        if (libraryXML !== null && this.router.url === '/import') {
            this.handleLibraryData(libraryXML);
        } else if (this.router.url === '/reimport') {
            this.canCancel = true;
        }
    }

    /******************/
    /* PUBLIC METHODS */
    /******************/

    public onFileUpload(files: FileList) {
        const file = files.item(0);

        if (file) {
            const fileReader = new FileReader();
            this.loading = true;
            fileReader.onloadend = (e: any) => this.handleLibraryData(e.target.result);
            fileReader.readAsText(file);
        }
    } // end onFileUpload()

    /*******************/
    /* PRIVATE METHODS */
    /*******************/

    private handleLibraryData(libraryXML) {
        this.parseXML(libraryXML).then(library => {
            this.dataService.importLibrary(library).then(() => {
                this.loading = false;
                this.router.navigate(['/']);
            });
            try {
                localStorage.setItem('libraryXML', libraryXML);
            } catch (error) {
                console.warn('Unable to save imported library to Local Storage.');
            }
        });
    }

    private async parseXML(text: string): Promise<Object> {
        return await this.xmlService.parseXML(text);
    }

} // End class UploadComponent
