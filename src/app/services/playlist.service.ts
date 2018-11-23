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
    
  private playlist;               // JSON Representation of Initial XML Playlist
  private albums: Array<Album>;   // Object Relational Model
  private minAlbumScore;          // Cached Minimum Album Score for Performance Gain
  private maxAlbumRScore;         // Cached Maximum Album Score for Performance Gain

  ////////////////////////////
  //                        //
  //     PUBLIC METHODS     //
  //                        //
  ////////////////////////////

  constructor() { }

  public init(xml): void {

    // Parse XML
    this.playlist = this.ParseXML(xml);

    // Generate the Object Relational Model
    this.GenerateORM();

    // Set Each Album's Rating Based on Its Songs' Ratings
    this.albums.forEach(album => {
      album.rating = (5 - 0) * ((album.GetScore() - this.GetMinAlbumRScore()) / (this.GetMaxAlbumScore() - this.GetMinAlbumRScore())) + 0;
    });

    // Sort All Albums By Rating
    this.albums = this.albums
      .filter(album => album.rating > 0)
      .sort((a: Album, b: Album) => { 
        return b.rating - a.rating; 
      });

  } // End init()

  public GetAlbums(): Array<Album> {
    return this.albums;
  }

  /////////////////////////////
  //                         //
  //     PRIVATE METHODS     //
  //                         //
  /////////////////////////////

  private GetMaxAlbumScore(): number {
    if (!this.maxAlbumRScore) {
      this.maxAlbumRScore = this.albums.reduce((acc, album) => { 
        let albumRating = album.GetScore(); 
        return albumRating > acc ? albumRating : acc;
      }, 0);
    }
    return this.maxAlbumRScore;
  }

  private GetMinAlbumRScore(): number {
    if (!this.minAlbumScore) {
      this.minAlbumScore = this.albums.reduce((acc, album) => { 
        let albumRating = album.GetScore(); 
        return albumRating < acc ? albumRating: acc;
      }, 800);
    }
    return this.minAlbumScore;
  }

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
  
  private GenerateORM() {
    let artists = {};
    let albums = {};
  
    for (let key in this.playlist["Tracks"]) {
      let track = this.playlist["Tracks"][key];
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
        rating: +track["Rating"] / 20 || 0,
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
  
    this.albums = Object.values(albums);
  }

} // End class PlaylistService