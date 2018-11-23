import { Injectable } from '@angular/core';

import { Artist } from '../models/artist';
import { Album } from '../models/album';
import { Song } from '../models/song'; 

@Injectable({
  providedIn: 'root'
})
export class PlaylistService {

  ////////////////////////
  //                    //
  //     PROPERTIES     //
  //                    //
  ////////////////////////
    
  private playlist;
  private albums;

  ////////////////////////////
  //                        //
  //     PUBLIC METHODS     //
  //                        //
  ////////////////////////////

  constructor() { }

  public init(xml): void {
    this.playlist = this.ParseXML(xml);
    this.albums = this.GenerateORM(this.playlist);
  }

  public GetAlbums(): Array<Album> {
    return this.albums;
  }

  /////////////////////////////
  //                         //
  //     PRIVATE METHODS     //
  //                         //
  /////////////////////////////

  private ParseXML(value) {
    var response = {};
    var parser = new DOMParser();
    var xmlDocument = parser.parseFromString(value, "text/xml");
  
    response = this.ParseDictionary(xmlDocument.getElementsByTagName("plist")[0].firstElementChild);
    return response;
  }
  
  private ParseDictionary(node) {
    var response = {};
    var key = node.firstElementChild;
  
    while (key) {
      var value = key.nextElementSibling;
      if (value) {
        switch (value.nodeName) {
          case "dict":
            response[key.innerHTML] = this.ParseDictionary(value);
            break;
          case "array":
            response[key.innerHTML] = this.ParseArray(value);
            break;
          case "true":
          case "false":
          response[key.innerHTML] = value.nodeName;
          break;
          default:
            response[key.innerHTML] = value.innerHTML;
        }
        key = value.nextElementSibling;
      }
    }
  
    return response;
  }
  
  private ParseArray(node) {
    var response = [];
  
    node.childNodes.forEach(element => {
      switch (element.nodeName) {
        case "dict":
          response.push(this.ParseDictionary(element));
          break;
        case "array":
          response.push(this.ParseArray(element));
          break;
      }
    });
  
    return response;
  }
  
  private GenerateORM(playlist) {
    let artists = {};
    let albums = {};
  
    for (let key in playlist["Tracks"]) {
      let track = playlist["Tracks"][key];
      let artistName: string = track["Artist"];
      let albumName: string = track["Album"];
      let trackNumber = +track["Track Number"];
      let discNumber = +track["Disc Number"] || 1;
  
      if (!artists[artistName]) {
        artists[artistName] = new Artist(artistName);
      }
  
      if (!albums[albumName]) {
        albums[albumName] = new Album(albumName);
      }
  
      let song = new Song({
        name: track["Name"],
        artist: artists[artistName],
        album: albums[albumName],
        genre: track["Genre"],
        duration: +track["Total Time"],
        releaseDate: new Date(track["Release Date"]),
        rating: +track["Rating"] || 0,
        playCount: +track["Play Count"] || 0,
        skipCount: +track["Skip Count"] || 0,
        trackID: +track["Track ID"]
      });
  
      // Update ORM References
      albums[albumName].tracks[discNumber - 1] = albums[albumName].tracks[discNumber - 1] || new Array<Song>();
      albums[albumName].tracks[discNumber - 1][trackNumber - 1] = song;
      artists[artistName].albums[albumName] = albums[albumName];
      albums[albumName].artist = artists[artistName];
    }
  
    return Object.values(albums).sort((a: Album, b: Album) => { return b.GetRank() - a.GetRank(); } );
  }
}