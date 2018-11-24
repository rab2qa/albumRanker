import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AlbumsListComponent } from './components/albums-list/albums-list.component';
import { AlbumComponent } from './components/albums-list/album/album.component';
import { StarRatingsComponent } from './components/star-ratings/star-ratings.component';

@NgModule({
  declarations: [AppComponent, AlbumsListComponent, AlbumComponent, StarRatingsComponent],
  imports: [BrowserModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
