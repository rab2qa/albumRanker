import { Injectable } from '@angular/core';

import { Artist } from '../models/artist';
import { Album } from '../models/album';
import { Song } from '../models/song'; 
import { Ratable } from '../interfaces/ratable';

const minRating = 0;
const maxRating = 5;

class Cache {
  public minAlbumScore?: number;
  public maxAlbumScore?: number;
  public maxPlayCount?: number;
  public minPlayCount?: number
  public maxSkipCount?: number;
  public minSkipCount?: number;

  constructor() {
    this.minAlbumScore = null;
    this.maxAlbumScore = null;
    this.maxPlayCount = 0;
    this.minPlayCount = Number.MAX_SAFE_INTEGER;
    this.maxSkipCount = 0;
    this.minSkipCount = Number.MAX_SAFE_INTEGER;
  }
}

@Injectable({
  providedIn: 'root'
})
export class PlaylistService {

  ////////////////////////
  //                    //
  //     PROPERTIES     //
  //                    //
  ////////////////////////

  private playlist: object;         // JSON Representation of Initial XML Playlist
  private artists: Array<Artist>;
  private albums: Array<Album>;     // Object Relational Model
  private songs: Array<Song>;

  private cache: Cache;

  ////////////////////////////
  //                        //
  //     PUBLIC METHODS     //
  //                        //
  ////////////////////////////

  constructor() {
    this.cache = new Cache();
    this.songs = new Array<Song>();
  }

  public init(xml): void {

    // Parse XML
    this.playlist = this.ParseXML(xml);

    // Generate the Object Relational Model
    this.GenerateORM();

    // Set Each Album's Ranking Based on Its Songs' Ratings
    // this.albums.forEach(album => {
    //   this.GetAlbumRanking(album);
    // });

    // Set Each Album's Ranking Based on Its Songs' Ratings
    this.albums.forEach(album => {
      album.cache.ranking = this.Normalize(album.GetScore(), this.GetMinAlbumRScore(), this.GetMaxAlbumScore(), minRating, maxRating);
    });

    // Sort All Albums By Rating
    this.albums = this.albums
      .filter(album => album.cache.ranking > 0)
      .sort((a: Album, b: Album) => { 
        return b.cache.ranking - a.cache.ranking; 
      });

      this.songs.sort((a: Song, b: Song) => { return b.cache.ranking - a.cache.ranking });

  } // End init()

  public GetAlbums(): Array<Album> {
    return this.albums;
  }

  // 50% Song Rating
  // 40% Play Count
  // 10% Skip Count
  // public GetSongRanking(song: Song): number {
  //   if (!song.cache.ranking) {
  //     let normalizedRating = this.Normalize(this.GetTransform(song.rating), this.GetTransform(minRating), this.GetTransform(maxRating));
  //     let normalizedPlayCount = this.Normalize(song.playCount, this.cache.minPlayCount, this.cache.maxPlayCount);
  //     let normalizedSkipCount = this.Normalize(song.skipCount, this.cache.minSkipCount, this.cache.maxSkipCount);
  //     let result = this.ApplyWeight(normalizedRating, 0.5) + this.ApplyWeight(normalizedPlayCount, 0.4) + this.ApplyWeight(1 - normalizedSkipCount, 0.1);
  //     song.cache.ranking = this.Scale(result, minRating, maxRating);
  //   }
  //   return song.cache.ranking;
  // }

  // 50% Album Rating
  // 25% Aggregate Ranking of Tracks
  // 20% Aggregate Play Count
  // 5% Aggregate Skip Count
  // public GetAlbumRanking(album: Album): number {
  //   if (!album.cache.ranking) {
  //     let scaledAlbumRating = this.Normalize(this.GetTransform(album.rating), this.GetTransform(minRating), this.GetTransform(maxRating), minRating, maxRating);
  //     let scaledSongRatingAggregate = album.Flatten()
  //     .filter(song => song.IsRated())
  //     .sort((a, b) => { return b.rating - a.rating; })
  //     .slice(0, 10)
  //     .reduce((sum, song) => { return sum + this.GetSongRanking(song); }, 0) / 10;
  //     let result = this.ApplyWeight(scaledAlbumRating, 0.5) + this.ApplyWeight(scaledSongRatingAggregate, 0.5);
  //     album.cache.ranking = result;
  //   }
  //   return album.cache.ranking;
  // }

  /////////////////////////////
  //                         //
  //     PRIVATE METHODS     //
  //                         //
  /////////////////////////////

  //    1 Star  = 2^0 = 1 Point
  //    2 Stars = 2^1 = 2 Points
  //    3 Stars = 2^2 = 4 Points
  //    4 Stars = 2^3 = 8 Points
  //    5 Stars = 2^4 = 16 Points
  private GetTransform(value: number): number {
    return value > 0 ? Math.pow(2, value - 1) : 0;
  }

  private ApplyWeight(x, weight): number {
    return x * weight;
  }

  private Normalize(x: number, min: number, max: number, a?: number, b?: number): number {
    a = a || 0;
    b = b || 1;
    let result = (x - min) / (max - min);
    return this.Scale(result, a, b);
  }

  private Scale(x: number, a: number , b: number) {
    return (b - a) * x + a;
  }

  private GetMaxAlbumScore(): number {
    if (!this.cache.maxAlbumScore) {
      this.cache.maxAlbumScore = this.albums.reduce((max, album) => { 
        let albumRating = album.GetScore(); 
        return albumRating > max ? albumRating : max;
      }, 0);
    }
    return this.cache.maxAlbumScore;
  }

  private GetMinAlbumRScore(): number {
    if (!this.cache.minAlbumScore) {
      this.cache.minAlbumScore = this.albums.reduce((min, album) => { 
        let albumRating = album.GetScore(); 
        return albumRating < min ? albumRating: min;
      }, 800);
    }
    return this.cache.minAlbumScore;
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
        if (track["Album Rating Computed"] === "true") {
          albums[albumName].rating = 0;
        } else {
          albums[albumName].rating = +track["Album Rating"] / 20 || 0;
        }
      }
  
      let song = new Song({
        name: track["Name"],
        artist: artists[artistName],
        album: albums[albumName],
        genre: track["Genre"],
        duration: +track["Total Time"],
        releaseDate: new Date(track["Release Date"]),
        rating: +track["Rating"] / 20 || 0,
        loved: track["Loved"] === "true",
        playCount: +track["Play Count"] || 0,
        skipCount: +track["Skip Count"] || 0,
        trackID: +track["Track ID"]
      });
      this.songs.push(song);

      // Update Statistics
      this.cache.maxPlayCount = song.playCount > this.cache.maxPlayCount ? song.playCount : this.cache.maxPlayCount;
      this.cache.minPlayCount = song.playCount < this.cache.minPlayCount ? song.playCount : this.cache.minPlayCount;
      this.cache.maxSkipCount = song.skipCount > this.cache.maxSkipCount ? song.skipCount : this.cache.maxSkipCount;
      this.cache.minSkipCount = song.skipCount < this.cache.minSkipCount ? song.skipCount : this.cache.minSkipCount;
  
      // Update ORM References
      albums[albumName].tracks[discNumber - 1] = albums[albumName].tracks[discNumber - 1] || new Array<Song>();
      albums[albumName].tracks[discNumber - 1][trackNumber - 1] = song;
      artists[artistName].albums[albumName] = albums[albumName];
      albums[albumName].artist = artists[artistName];
    }
  
    this.artists = Object.values(artists);
    this.albums = Object.values(albums);
  }

} // End class PlaylistService