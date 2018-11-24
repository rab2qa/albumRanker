import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AlbumsListComponent } from './components/albums-list/albums-list.component';
import { AlbumComponent } from './components/albums-list/album/album.component';
import { StarRatingsComponent } from './components/stars/stars.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [AppComponent, AlbumsListComponent, AlbumComponent, StarRatingsComponent],
  imports: [BrowserModule, AppRoutingModule, NoopAnimationsModule, DragDropModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
