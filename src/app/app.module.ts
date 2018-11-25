import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AlbumsComponent } from './components/albums/albums.component';
import { AlbumsListComponent } from './components/albums/albums-list/albums-list.component';
import { AlbumComponent } from './components/albums/albums-list/album/album.component';
import { StarRatingsComponent } from './components/stars/stars.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SongsComponent } from './components/songs/songs.component';
import { ArtistsComponent } from './components/artists/artists.component';
import { DataService } from './services/data.service';

@NgModule({
  declarations: [
    AppComponent,
    AlbumsListComponent,
    AlbumComponent,
    StarRatingsComponent,
    AlbumsComponent,
    SongsComponent,
    ArtistsComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, NoopAnimationsModule, DragDropModule],
  providers: [DataService],
  bootstrap: [AppComponent],
})
export class AppModule {}
