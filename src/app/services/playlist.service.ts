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
    public minArtistScore?: number = null;
    public maxArtistScore?: number = null;

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

    get artists(): Array<Artist> { return this._artists; }
    get albums(): Array<Album> { return this._albums; }
    get songs(): Array<Song> { return this._songs; }

    get maxArtistScore(): number {
        if (!this._cache.maxArtistScore) {
            this._cache.maxArtistScore = this.artists.reduce((max, artist) => {
                const artistScore = this.getArtistScore(artist);
                return artistScore > max ? artistScore : max;
            }, 0);
        }
        return this._cache.maxArtistScore;
    }

    get minArtistScore(): number {
        if (!this._cache.minArtistScore) {
            this._cache.minArtistScore = this.artists.reduce((min, artist) => {
                const artistScore = this.getArtistScore(artist);
                return artistScore < min ? artistScore : min;
            }, 800);
        }
        return this._cache.minArtistScore;
    }
    get maxAlbumScore(): number {
        if (!this._cache.maxAlbumScore) {
            this._cache.maxAlbumScore = this.albums.reduce((max, album) => {
                const albumScore = this.getAlbumScore(album);
                return albumScore > max ? albumScore : max;
            }, 0);
        }
        return this._cache.maxAlbumScore;
    }

    get minAlbumScore(): number {
        if (!this._cache.minAlbumScore) {
            this._cache.minAlbumScore = this.albums.reduce((min, album) => {
                const albumScore = this.getAlbumScore(album);
                return albumScore < min ? albumScore : min;
            }, 800);
        }
        return this._cache.minAlbumScore;
    }

    /***************/
    /* CONSTRUCTOR */
    /***************/

    public constructor() {
        this._artists = new Array<Artist>();
        this._albums = new Array<Album>();
        this._songs = new Array<Song>();
        this._cache = new Cache();
    }

    /******************/
    /* PUBLIC METHODS */
    /******************/

    public apply(playlist): void {
        this.clearORM();
        this.generateORM(playlist);
        this.rankSongs();
        this.rankAlbums();
        this.rankArtists();
    }

    public getArtistScore(artist: Artist): number {
        return Object.values(artist.albums).reduce((sum, album) => sum + this.getAlbumRanking(album), 0);
    }

    public getAlbumScore(album: Album): number {
        return album.getTopTenSongs().reduce((sum, song) => sum + Algorithm.getTransform(this.getSongRanking(song)), 0);
    }

    // public GetSongScore(song: Song): number {
    //     return this.GetSongRanking(song);
    // }

    public getArtistRanking(artist: Artist): number {
        if (!artist.ranking) {
            artist.ranking = Algorithm.normalize(this.getArtistScore(artist), this.minArtistScore, this.maxArtistScore, minRating, maxRating);
        }
        return artist.ranking;
    }

    public getAlbumRanking(album: Album): number {
        if (!album.ranking) {
            const weights = { rating: 0.0, aggregateSongRating: 1.0 };
            const normalizedAlbumRating = Algorithm.normalize(album.rating, minRating, maxRating);
            const normalizedAlbumScore = Algorithm.normalize(this.getAlbumScore(album), this.minAlbumScore, this.maxAlbumScore);
            const weightedRating = Algorithm.applyWeight(normalizedAlbumRating, weights.rating) + Algorithm.applyWeight(normalizedAlbumScore, weights.aggregateSongRating);
            album.ranking = Algorithm.scale(weightedRating, minRating, maxRating);
        }
        return album.ranking;
    }

    public getSongRanking(song: Song): number {
        if (!song.ranking) {
            const weights = { rating: 0.8, playCount: 0.16, skipCount: 0.04 };
            const normalizedSongRating = Algorithm.normalize(song.rating, minRating, maxRating);
            const normalizedPlayCount = Algorithm.normalize(song.playCount, this._cache.minPlayCount, this._cache.maxPlayCount);
            const normalizedSkipCount = Algorithm.normalize(song.skipCount, this._cache.minSkipCount, this._cache.maxSkipCount);
            const weightedRating = Algorithm.applyWeight(normalizedSongRating, weights.rating) + Algorithm.applyWeight(normalizedPlayCount, weights.playCount) + Algorithm.applyWeight(1 - normalizedSkipCount, weights.skipCount);
            song.ranking = Algorithm.scale(weightedRating, minRating, maxRating);
        }
        return song.ranking;
    }

    /*******************/
    /* PRIVATE METHODS */
    /*******************/

    private clearORM() {
        this._artists.splice(0, this._artists.length);
        this._albums.splice(0, this._albums.length);
        this._songs.splice(0, this._songs.length);
        this._cache = new Cache();
    }

    private generateORM(playlist) {
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
                id: +track["Track ID"],
                name: track["Name"],
                artist: artists[artistName],
                album: albums[albumName],
                genre: track["Genre"],
                duration: +track["Total Time"],
                releaseDate: new Date(track["Release Date"]),
                rating: +track["Rating"] / 20 || 0,
                loved: track["Loved"] === "true",
                playCount: +track["Play Count"] || 0,
                skipCount: +track["Skip Count"] || 0
            });
            this.songs.push(song);

            // Update Statistics
            this._cache.maxPlayCount = Math.max(song.playCount, this._cache.maxPlayCount);
            this._cache.maxSkipCount = Math.max(song.skipCount, this._cache.maxSkipCount);
            this._cache.minPlayCount = Math.min(song.playCount, this._cache.minPlayCount);
            this._cache.minSkipCount = Math.min(song.skipCount, this._cache.minSkipCount);

            // Update ORM References
            albums[albumName].tracks[discNumber - 1] = albums[albumName].tracks[discNumber - 1] || new Array<Song>();
            albums[albumName].tracks[discNumber - 1][trackNumber - 1] = song;
            artists[artistName].albums[albumName] = albums[albumName];
            albums[albumName].artist = artists[artistName];
        }

        Array.prototype.push.apply(this._artists, Object.values(artists));
        Array.prototype.push.apply(this._albums, Object.values(albums));
    }

    private rankSongs(): void {
        this.songs.forEach(song => this.getSongRanking(song));
        this.songs.sort((a: Song, b: Song) => { return b.ranking - a.ranking });
    }

    private rankAlbums(): void {
        this.albums.forEach(album => this.getAlbumRanking(album));
        this._albums = this._albums
            .filter(album => album.ranking > 0)
            .sort((a, b) => b.ranking - a.ranking);
    }

    private rankArtists(): void {
        this.artists.forEach(artist => this.getArtistRanking(artist));
        this._artists = this._artists
            .filter(artist => artist.ranking > 0)
            .sort((a, b) => b.ranking - a.ranking);
    }

} // End class PlaylistService