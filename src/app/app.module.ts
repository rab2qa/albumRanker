import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AlbumsComponent } from './components/albums/albums.component';
import { StarRatingsComponent } from './components/stars/stars.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SongsComponent } from './components/songs/songs.component';
import { ArtistsComponent } from './components/artists/artists.component';
import { DataService } from './services/data.service';
import { ListsComponent } from './components/lists/lists.component';
import { ListComponent } from './components/lists/list/list.component';
import { ListItemComponent } from './components/lists/list/list-item/list-item.component';

@NgModule({
  declarations: [
    AppComponent,
    StarRatingsComponent,
    AlbumsComponent,
    SongsComponent,
    ArtistsComponent,
    ListsComponent,
    ListComponent,
    ListItemComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, NoopAnimationsModule, DragDropModule],
  providers: [DataService],
  bootstrap: [AppComponent],
})
export class AppModule {}
