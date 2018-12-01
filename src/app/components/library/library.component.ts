import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../services/data.service';
import { features } from 'src/environments/environment';
import { Library } from 'src/app/models/library';

@Component({
    selector: 'ranker-library',
    templateUrl: './library.component.html',
    styleUrls: ['./library.component.scss'],
})
export class LibraryComponent {

    public library: Object;
    public key: string;
    public features = features;

    constructor(private route: ActivatedRoute, public dataService: DataService) {
        this.route.data.subscribe((data: any) => {
            this.key = data.key;
            this.library = dataService.library;
        });
    }

} // End class LibraryComponent
