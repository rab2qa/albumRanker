import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatPaginatorModule } from '@angular/material/paginator';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StarRatingsComponent } from './components/stars/stars.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DataService } from './services/data.service';
import { ListsComponent } from './components/lists/lists.component';
import { ListComponent } from './components/lists/list/list.component';
import { ListItemComponent } from './components/lists/list/list-item/list-item.component';
import { LibraryGuard } from './guards/library.guard';
import { ShellComponent } from './components/shell/shell.component';
import { UploadComponent } from './components/upload/upload.component';
import { NavigationComponent } from './components/shell/navigation/navigation.component';
import { LibraryComponent } from './components/library/library.component';
import { RankablesComponent } from './components/rankables/rankables.component';
import { MultimediaComponent } from './components/multimedia/multimedia.component';

@NgModule({
    declarations: [
        AppComponent,
        StarRatingsComponent,
        // ListsComponent,
        // ListComponent,
        // ListItemComponent,
        ShellComponent,
        UploadComponent,
        NavigationComponent,
        LibraryComponent,
        RankablesComponent,
        MultimediaComponent,
    ],
    imports: [BrowserModule, AppRoutingModule, NoopAnimationsModule, DragDropModule, MatPaginatorModule],
    providers: [DataService, LibraryGuard],
    bootstrap: [AppComponent],
})
export class AppModule { }
