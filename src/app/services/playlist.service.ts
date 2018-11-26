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

/**************/
/* INTERFACES */
/**************/

import { Ratable } from '../interfaces/ratable';

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

const starWeights = [1, 2, 3, 4, 5];

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

    public lovedCount?: number = 0;

    public maxPlayCount?: number = 0;
    public minPlayCount?: number = Number.MAX_SAFE_INTEGER;

    public maxSkipCount?: number = 0;
    public minSkipCount?: number = Number.MAX_SAFE_INTEGER;

    public albumStarCount?: Array<number> = [0, 0, 0, 0, 0];
    public songStarCount?: Array<number> = [0, 0, 0, 0, 0];

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
            this._cache.maxAlbumScore = this.albums.reduce((max, album) => Math.max(max, this.getAlbumScore(album)), Number.MIN_SAFE_INTEGER);
        }
        return this._cache.maxAlbumScore;
    }

    get minAlbumScore(): number {
        if (!this._cache.minAlbumScore) {
            this._cache.minAlbumScore = this.albums.reduce((min, album) => Math.min(min, this.getAlbumScore(album)), Number.MAX_SAFE_INTEGER);
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
        this.updateStarWeights();
        this.rankSongs();
        this.rankAlbums();
        this.rankArtists();
    }

    private updateStarWeights(): void {
        for (let i = 1; i < maxRating; i++) {
            if (this._cache.songStarCount[i]) { starWeights[i] = Math.max(this._cache.songStarCount[i - 1] / this._cache.songStarCount[i], 1); }
        }
    }

    public getArtistScore(artist: Artist): number {
        return Object.values(artist.albums).reduce((sum, album) => sum + this.getAlbumRanking(album), 0);
    }

    public getAlbumScore(album: Album): number {
        return album.topTenSongs.reduce((sum, song) => sum + this.transformRating(song), 0);
    }

    private transformRating(ratable: Ratable): number {
        const starIndex = ratable.rating - 1;
        return Algorithm.linearTransform(ratable.rating, starWeights[starIndex]);
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
            const weights = (album.rating)
                ? { rating: 0.5, aggregateSongRating: 0.4, aggregatePlayCount: 0.08, aggregateSkipCount: 0.02 }
                : { rating: 0.0, aggregateSongRating: 0.8, aggregatePlayCount: 0.16, aggregateSkipCount: 0.04 };

            const normalizedAlbumRating = Algorithm.normalize(album.rating, minRating, maxRating);
            const normalizedAlbumScore = Algorithm.normalize(this.getAlbumScore(album), this.minAlbumScore, this.maxAlbumScore);

            const topTenSongs = album.topTenSongs;
            const aggregatePlayCount = topTenSongs.reduce((sum, song) => sum + song.playCount, 0);
            const aggregateSkipCount = topTenSongs.reduce((sum, song) => sum + song.skipCount, 0);
            const normalizedAggregatePlayCount = Algorithm.normalize(aggregatePlayCount, this._cache.minPlayCount * topTenSongs.length, this._cache.maxPlayCount * topTenSongs.length);
            const normalizedAggregateSkipCount = Algorithm.normalize(aggregateSkipCount, this._cache.minSkipCount * topTenSongs.length, this._cache.maxSkipCount * topTenSongs.length);

            const weightedRating = Algorithm.applyWeight(normalizedAlbumRating, weights.rating) + Algorithm.applyWeight(normalizedAlbumScore, weights.aggregateSongRating) + Algorithm.applyWeight(normalizedAggregatePlayCount, weights.aggregatePlayCount) + Algorithm.applyWeight(normalizedAggregateSkipCount, weights.aggregateSkipCount);
            album.ranking = Algorithm.scale(weightedRating, minRating, maxRating);
        }
        return album.ranking;
    }

    public getSongRanking(song: Song): number {
        if (!song.ranking) {
            const weights = { rating: 0.8, loved: 0.0, playCount: 0.16, skipCount: 0.04 };
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

            const albumName = track["Album"];
            const albumRating = (track["Album Rating Computed"] === "true") ? 0 : +track["Album Rating"] / 20 || 0;
            const artistName = track["Artist"];
            const discNumber = +track["Disc Number"] || 1;
            const duration = +track["Total Time"];
            const genre = track["Genre"];
            const id = +track["Track ID"];
            const loved = track["Loved"] === "true";
            const name = track["Name"];
            const playCount = +track["Play Count"] || 0;
            const rating = +track["Rating"] / 20 || 0;
            const releaseDate = new Date(track["Release Date"]);
            const skipCount = +track["Skip Count"] || 0;
            const trackNumber = +track["Track Number"];
            const year = track["Year"];

            let artist = artists[artistName];
            if (!artist) {
                artist = new Artist(artistName);
                artists[artistName] = artist;
            }

            let album = albums[albumName];
            if (!album) {
                album = this.createAlbum(artist, albumName, albumRating, year);
                albums[albumName] = album;
            }

            const song = this.createSong(album, artist, discNumber, duration, genre, id, loved, name, playCount, rating, releaseDate, skipCount, trackNumber);
            this.songs.push(song);
        }

        Array.prototype.push.apply(this._artists, Object.values(artists));
        Array.prototype.push.apply(this._albums, Object.values(albums));
    }

    private createAlbum(artist, albumName, albumRating, year): Album {
        const album = new Album(artist, albumName, albumRating, year);

        // Update ORM
        artist.albums[albumName] = album;

        // Update Cache
        if (album.rating) { this._cache.albumStarCount[album.rating - 1]++; }

        return album;
    }

    private createSong(album, artist, discNumber, duration, genre, id, loved, name, playCount, rating, releaseDate, skipCount, trackNumber): Song {
        const song = new Song(album, artist, duration, genre, id, loved, name, playCount, rating, releaseDate, skipCount);

        // Update ORM
        album.tracks[discNumber - 1] = album.tracks[discNumber - 1] || new Array<Song>();
        album.tracks[discNumber - 1][trackNumber - 1] = song;

        // Update Cache
        if (song.loved) { this._cache.lovedCount++; }
        if (song.rating) { this._cache.songStarCount[song.rating - 1]++; }
        this._cache.maxPlayCount = Math.max(song.playCount, this._cache.maxPlayCount);
        this._cache.maxSkipCount = Math.max(song.skipCount, this._cache.maxSkipCount);
        this._cache.minPlayCount = Math.min(song.playCount, this._cache.minPlayCount);
        this._cache.minSkipCount = Math.min(song.skipCount, this._cache.minSkipCount);

        return song;
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