import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AlbumsComponent } from './components/albums/albums.component';
import { ArtistsComponent } from './components/artists/artists.component';
import { SongsComponent } from './components/songs/songs.component';

const routes: Routes = [
  {
    path: 'albums',
    component: AlbumsComponent,
  },
  {
    path: 'artists',
    component: ArtistsComponent,
  },
  {
    path: 'songs',
    component: SongsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
