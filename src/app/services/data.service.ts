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

  public albums: {
    initial: Album[];
    adjusted: Album[];
  };
  public artists: {
    initial: Artist[];
    adjusted: Artist[];
  };
  public songs: {
    initial: Song[];
    adjusted: Song[];
  };

  /******************/
  /* PUBLIC METHODS */
  /******************/
  public updateData(playlistService): void {
    this.albums = this.updateEachEntity(playlistService.albums);
    this.artists = this.updateEachEntity(playlistService.artists);
    this.songs = this.updateEachEntity(playlistService.songs);
  }

  private updateEachEntity(data) {
    return {
      initial: [...data],
      adjusted: [...data],
    };
  }
} // End class DataService
