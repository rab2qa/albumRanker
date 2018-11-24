
//////////////////////////
//                      //
//     DEPENDENCIES     //
//                      //
//////////////////////////

/*************/
/* FRAMEWORK */
/*************/

import { Injectable } from '@angular/core';

/*************/
/* UTILITIES */
/*************/

import { Algorithm } from '../utilities/algorithm';

/**********/
/* MODELS */
/**********/

import { Artist } from '../models/artist';
import { Album } from '../models/album';
import { Song } from '../models/song';

/////////////////////
//                 //
//     GLOBALS     //
//                 //
/////////////////////

const minRating = 0;
const maxRating = 5;

///////////////////
//               //
//     CACHE     //
//               //
///////////////////

class Cache {
  public minAlbumScore?: number = null;
  public maxAlbumScore?: number = null;

  public maxPlayCount?: number = 0;
  public minPlayCount?: number = Number.MAX_SAFE_INTEGER;

  public maxSkipCount?: number = 0;
  public minSkipCount?: number = Number.MAX_SAFE_INTEGER;

  constructor() { }
}

/////////////////////
//                 //
//     SERVICE     //
//                 //
/////////////////////

@Injectable({
  providedIn: 'root'
})
export class PlaylistService {

  /**************/
  /* PROPERTIES */
  /**************/

  private _artists: Array<Artist> = new Array<Artist>();
  private _albums: Array<Album> = new Array<Album>();
  private _songs: Array<Song> = new Array<Song>();

  private _cache: Cache = new Cache();

  /*************/
  /* ACCESSORS */
  /*************/

  get albums(): Array<Album> { return this._albums; }
  get songs(): Array<Song> { return this._songs; }

  get maxAlbumScore(): number {
    if (!this._cache.maxAlbumScore) {
      this._cache.maxAlbumScore = this.albums.reduce((max, album) => {
        const albumScore = this.GetAlbumScore(album);
        return albumScore > max ? albumScore : max;
      }, 0);
    }
    return this._cache.maxAlbumScore;
  }

  get minAlbumScore(): number {
    if (!this._cache.minAlbumScore) {
      this._cache.minAlbumScore = this.albums.reduce((min, album) => {
        const albumScore = this.GetAlbumScore(album);
        return albumScore < min ? albumScore : min;
      }, 800);
    }
    return this._cache.minAlbumScore;
  }

  /******************/
  /* PUBLIC METHODS */
  /******************/

  constructor() { }

  public init(playlist): void {
    this.ClearORM();
    this.GenerateORM(playlist);
    this.RankSongs();
    this.RankAlbums();
  }

  public GetAlbumScore(album: Album): number {
    return album.GetTopTenSongs().reduce((sum, song) => sum + this.GetSongRanking(song), 0);
  }

  public GetSongRanking(song: Song): number {
    if (!song.cache.ranking) {
      const weights = { rating: 1.0, playCount: 0.0, skipCount: 0.0 };
      const normalizedSongRating = Algorithm.Normalize(Algorithm.GetTransform(song.rating), Algorithm.GetTransform(minRating), Algorithm.GetTransform(maxRating));
      const normalizedPlayCount = Algorithm.Normalize(song.playCount, this._cache.minPlayCount, this._cache.maxPlayCount);
      const normalizedSkipCount = Algorithm.Normalize(song.skipCount, this._cache.minSkipCount, this._cache.maxSkipCount);
      const weightedRating = Algorithm.ApplyWeight(normalizedSongRating, weights.rating) + Algorithm.ApplyWeight(normalizedPlayCount, weights.playCount) + Algorithm.ApplyWeight(1 - normalizedSkipCount, weights.skipCount);
      song.cache.ranking = Algorithm.Scale(weightedRating, minRating, maxRating);
    }
    return song.cache.ranking;
  }

  public GetAlbumRanking(album: Album): number {
    if (!album.cache.ranking) {
      const weights = { rating: 0.0, aggregateSongRating: 1.0 };
      const normalizedAlbumRating = Algorithm.Normalize(Algorithm.GetTransform(album.rating), Algorithm.GetTransform(minRating), Algorithm.GetTransform(maxRating));
      const normalizedAlbumScore = Algorithm.Normalize(this.GetAlbumScore(album), this.minAlbumScore, this.maxAlbumScore);
      const weightedRating = Algorithm.ApplyWeight(normalizedAlbumRating, weights.rating) + Algorithm.ApplyWeight(normalizedAlbumScore, weights.aggregateSongRating);
      album.cache.ranking = Algorithm.Scale(weightedRating, minRating, maxRating);
    }
    return album.cache.ranking;
  }

  /*******************/
  /* PRIVATE METHODS */
  /*******************/

  private ClearORM() {
    this._artists = new Array<Artist>();
    this._albums = new Array<Album>();
    this._songs = new Array<Song>();
    this._cache = new Cache();
  }

  private GenerateORM(playlist) {
    const artists = {};
    const albums = {};

    for (const key in playlist["Tracks"]) {
      const track = playlist["Tracks"][key];
      const artistName = track["Artist"];
      const albumName = track["Album"];
      const trackNumber = +track["Track Number"];
      const discNumber = +track["Disc Number"] || 1;

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

      const song = new Song({
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
      this._cache.maxPlayCount = song.playCount > this._cache.maxPlayCount ? song.playCount : this._cache.maxPlayCount;
      this._cache.minPlayCount = song.playCount < this._cache.minPlayCount ? song.playCount : this._cache.minPlayCount;
      this._cache.maxSkipCount = song.skipCount > this._cache.maxSkipCount ? song.skipCount : this._cache.maxSkipCount;
      this._cache.minSkipCount = song.skipCount < this._cache.minSkipCount ? song.skipCount : this._cache.minSkipCount;

      // Update ORM References
      albums[albumName].tracks[discNumber - 1] = albums[albumName].tracks[discNumber - 1] || new Array<Song>();
      albums[albumName].tracks[discNumber - 1][trackNumber - 1] = song;
      artists[artistName].albums[albumName] = albums[albumName];
      albums[albumName].artist = artists[artistName];
    }

    this._artists = Object.values(artists);
    this._albums = Object.values(albums);
  }

  private RankSongs(): void {
    this.songs.forEach(song => this.GetSongRanking(song));
    this.songs.sort((a: Song, b: Song) => { return b.cache.ranking - a.cache.ranking });
  }

  private RankAlbums(): void {
    this.albums.forEach(album => this.GetAlbumRanking(album));
    this._albums = this._albums
      .filter(album => album.cache.ranking > 0)
      .sort((a, b) => b.cache.ranking - a.cache.ranking);
  }

} // End class PlaylistService