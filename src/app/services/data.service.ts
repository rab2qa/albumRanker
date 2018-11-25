//////////////////////////
//                      //
//     DEPENDENCIES     //
//                      //
//////////////////////////

/*************/
/* FRAMEWORK */
/*************/

import { Injectable } from '@angular/core';

/**********/
/* MODELS */
/**********/

import { Artist } from '../models/artist';
import { Album } from '../models/album';
import { Song } from '../models/song';

/////////////////////
//                 //
//     SERVICE     //
//                 //
/////////////////////

@Injectable({
  providedIn: 'root',
})
export class DataService {
  /**************/
  /* PROPERTIES */
  /**************/

  public artists: Album[] = [];
  public artistsSupervised: Album[] = [];
  public albums: Album[] = [];
  public albumsSupervised: Album[] = [];
  public songs: Album[] = [];
  public songsSupervised: Album[] = [];

  /******************/
  /* PUBLIC METHODS */
  /******************/
  public updateData(playlistService): void {
    console.log(playlistService);
    this.artists = [...playlistService.artists];
    this.artistsSupervised = [...playlistService.artists];
    this.albums = [...playlistService.albums];
    this.albumsSupervised = [...playlistService.albums];
    this.songs = [...playlistService.songs];
    this.songsSupervised = [...playlistService.songs];
  }
} // End class DataService
